import DatabaseModule from "bun:sqlite";
import path from "node:path";
import fs from "node:fs";
import type { CommentItem } from "~/types/comment";

const dbDir = path.resolve(process.cwd(), ".data/db");

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const isTestEnv = process.env.NODE_ENV === "test" || Boolean(process.env.VITEST);
const rawConfig = typeof useRuntimeConfig === "function" ? useRuntimeConfig() : null;

const defaultFileName = isTestEnv ? "lequan81dev_test.sqlite" : "lequan81dev_app.sqlite";
const dbFileName = String(process.env.DB_FILE_NAME || rawConfig?.dbFileName || defaultFileName).trim();

const dbPath = path.join(dbDir, dbFileName);

const Database = (DatabaseModule as any).Database || DatabaseModule;
export const db = new Database(dbPath);

// WAL Mode for concurrent reads/writes
db.exec("PRAGMA journal_mode = WAL;");

// ── Comments table (with moderation fields & audit log) ──────────────────
db.exec(`
  CREATE TABLE IF NOT EXISTS comments (
    id TEXT PRIMARY KEY,
    post_slug TEXT NOT NULL,
    parent_id TEXT,
    author_name TEXT NOT NULL,
    author_email TEXT NOT NULL,
    author_avatar TEXT,
    content TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    mod_flags INTEGER NOT NULL DEFAULT 0,
    mod_confidence REAL NOT NULL DEFAULT 0.0,
    mod_reason TEXT,
    mod_source TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_comments_post_slug ON comments(post_slug);
  CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_id);
  CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at DESC);
  CREATE INDEX IF NOT EXISTS idx_comments_status ON comments(status);
`);

// Safe migrations for existing SQLite files
try { db.exec("ALTER TABLE comments ADD COLUMN mod_reason TEXT;"); } catch {}
try { db.exec("ALTER TABLE comments ADD COLUMN mod_source TEXT;"); } catch {}

// ── Reported comments table ──────────────────────────────────────────────
db.exec(`
  CREATE TABLE IF NOT EXISTS reported_comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    comment_id TEXT NOT NULL,
    reporter_session TEXT NOT NULL,
    reason TEXT NOT NULL DEFAULT 'spam',
    custom_text TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    resolved INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_reported_comment_id ON reported_comments(comment_id);
  CREATE INDEX IF NOT EXISTS idx_reported_resolved ON reported_comments(resolved);
`);

// ── Contacts table ────────────────────────────────────────────────────────
db.exec(`
  CREATE TABLE IF NOT EXISTS contacts (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'unread',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    ip TEXT
  );

  CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at DESC);
  CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts(status);
`);

// ── Migration: add new columns if DB already existed without them ────────
try {
  db.exec("ALTER TABLE comments ADD COLUMN status TEXT NOT NULL DEFAULT 'approved';");
} catch { /* column already exists */ }
try {
  db.exec("ALTER TABLE comments ADD COLUMN mod_flags INTEGER NOT NULL DEFAULT 0;");
} catch { /* column already exists */ }
try {
  db.exec("ALTER TABLE comments ADD COLUMN mod_confidence REAL NOT NULL DEFAULT 0.0;");
} catch { /* column already exists */ }

// ─────────────────────────────────────────────────────────────────────────
// QUERY FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────

/**
 * Get paginated comments — only approved comments visible to guests.
 * Uses Deferred Join for optimal performance.
 */
import { formatRelativeTime } from "~/utils/formatters";

export function formatCommentRow(row: any): CommentItem {
  if (!row) return row;
  const authorName = String(row.author_name || "Guest");
  const authorAvatar = String(row.author_avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(authorName)}`);

  return {
    id: String(row.id),
    post_slug: String(row.post_slug || ""),
    parent_id: row.parent_id ? String(row.parent_id) : null,
    author_name: authorName,
    author_email: String(row.author_email || ""),
    author_avatar: authorAvatar,
    author: {
      name: authorName,
      avatar: authorAvatar,
      isAuthor: authorName === "Lê Quân" || authorName === "Juno_okyo",
    },
    content: String(row.content || ""),
    status: String(row.status || "pending"),
    mod_flags: Number(row.mod_flags || 0),
    mod_confidence: Number(row.mod_confidence || 0),
    mod_reason: row.mod_reason ? String(row.mod_reason) : undefined,
    mod_source: row.mod_source ? String(row.mod_source) : undefined,
    date: formatRelativeTime(row.created_at),
    created_at: String(row.created_at || ""),
    likes: Number(row.likes || 0),
  };
}

export function getPaginatedComments(postSlug: string, page: number = 1, pageSize: number = 10) {
  const offset = (page - 1) * pageSize;

  const countStmt = db.prepare(
    "SELECT COUNT(*) as total FROM comments WHERE post_slug = ? AND parent_id IS NULL AND status = 'approved'"
  );
  const { total } = countStmt.get(postSlug) as { total: number };

  const topCommentsStmt = db.prepare(`
    SELECT c.* FROM comments c
    JOIN (
      SELECT id FROM comments
      WHERE post_slug = ? AND parent_id IS NULL AND status = 'approved'
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    ) lim ON c.id = lim.id
    ORDER BY c.created_at DESC
  `);
  const topCommentsRaw = topCommentsStmt.all(postSlug, pageSize, offset) as any[];

  if (topCommentsRaw.length === 0) {
    return { comments: [], total, page, pageSize, hasMore: false };
  }

  // Replies — also only approved
  const parentIds = topCommentsRaw.map((c) => c.id);
  const placeholders = parentIds.map(() => "?").join(",");
  const repliesStmt = db.prepare(`
    SELECT * FROM comments
    WHERE parent_id IN (${placeholders}) AND status = 'approved'
    ORDER BY created_at ASC
  `);
  const repliesRaw = repliesStmt.all(...parentIds) as any[];

  const repliesMap = new Map<string, CommentItem[]>();
  for (const reply of repliesRaw) {
    if (reply.parent_id) {
      if (!repliesMap.has(reply.parent_id)) {
        repliesMap.set(reply.parent_id, []);
      }
      repliesMap.get(reply.parent_id)!.push(formatCommentRow(reply));
    }
  }

  const commentsWithReplies = topCommentsRaw.map((c) => ({
    ...formatCommentRow(c),
    replies: repliesMap.get(c.id) || [],
  }));

  return {
    comments: commentsWithReplies,
    total,
    page,
    pageSize,
    hasMore: offset + topCommentsRaw.length < total,
  };
}

// ─────────────────────────────────────────────────────────────────────────
// INSERT / UPDATE FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────

/**
 * Insert a new comment with moderation status.
 */
export function insertComment(data: {
  post_slug: string;
  parent_id?: string | null;
  author_name: string;
  author_email: string;
  author_avatar?: string;
  content: string;
  status?: string;
  mod_flags?: number;
  mod_confidence?: number;
  mod_reason?: string;
  mod_source?: string;
}): CommentItem {
  const id = (Bun as any).randomUUIDv7
    ? (Bun as any).randomUUIDv7()
    : `comment-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

  const stmt = db.prepare(`
    INSERT INTO comments (id, post_slug, parent_id, author_name, author_email, author_avatar, content, status, mod_flags, mod_confidence, mod_reason, mod_source)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    id,
    data.post_slug,
    data.parent_id || null,
    data.author_name,
    data.author_email,
    data.author_avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(data.author_name)}`,
    data.content,
    data.status || "pending",
    data.mod_flags || 0,
    data.mod_confidence || 0.0,
    data.mod_reason || null,
    data.mod_source || null
  );

  const getStmt = db.prepare("SELECT * FROM comments WHERE id = ?");
  const rawInserted = getStmt.get(id);
  return formatCommentRow(rawInserted);
}

/**
 * Update comment moderation status (used by async Gemini callback).
 */
export function updateCommentStatus(
  commentId: string,
  status: string,
  modFlags: number,
  modConfidence: number,
  modReason?: string,
  modSource?: string
) {
  const stmt = db.prepare(
    "UPDATE comments SET status = ?, mod_flags = ?, mod_confidence = ?, mod_reason = COALESCE(?, mod_reason), mod_source = COALESCE(?, mod_source) WHERE id = ?"
  );
  stmt.run(status, modFlags, modConfidence, modReason || null, modSource || null, commentId);
}

// ─────────────────────────────────────────────────────────────────────────
// REPORT FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────

/**
 * Insert a report for a comment.
 */
export function insertReport(data: {
  comment_id: string;
  reporter_session: string;
  reason: string;
  custom_text?: string;
}) {
  const stmt = db.prepare(`
    INSERT INTO reported_comments (comment_id, reporter_session, reason, custom_text)
    VALUES (?, ?, ?, ?)
  `);
  stmt.run(data.comment_id, data.reporter_session, data.reason, data.custom_text || null);

  // Automatically update comment status to 'flagged' with mod_reason '0x20' (User Report)
  db.prepare(`
    UPDATE comments 
    SET status = 'flagged', mod_reason = '0x20' 
    WHERE id = ?
  `).run(data.comment_id);
}

/**
 * Get all unresolved reports (for admin).
 */
export function getUnresolvedReports() {
  const stmt = db.prepare(`
    SELECT r.*, c.content as comment_content, c.author_name, c.post_slug, c.status as comment_status
    FROM reported_comments r
    JOIN comments c ON r.comment_id = c.id
    WHERE r.resolved = 0
    ORDER BY r.created_at DESC
  `);
  return stmt.all();
}

/**
 * Check if a session has already reported a comment.
 */
export function hasUserReportedComment(commentId: string, reporterSession: string): boolean {
  const stmt = db.prepare(
    "SELECT COUNT(*) as count FROM reported_comments WHERE comment_id = ? AND reporter_session = ?"
  );
  const row = stmt.get(commentId, reporterSession) as { count: number };
  return row.count > 0;
}

/**
 * Resolve a report (admin action: delete comment or dismiss report).
 */
export function resolveReport(reportId: number, action: "delete" | "dismiss") {
  if (action === "delete") {
    // Get comment_id from report, then delete the comment
    const report = db.prepare("SELECT comment_id FROM reported_comments WHERE id = ?").get(reportId) as any;
    if (report) {
      db.prepare("DELETE FROM comments WHERE id = ?").run(report.comment_id);
    }
  }
  // Mark report as resolved
  db.prepare("UPDATE reported_comments SET resolved = 1 WHERE id = ?").run(reportId);
}

// ─────────────────────────────────────────────────────────────────────────
// CONTACT FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────

export function insertContact(data: {
  name: string;
  email: string;
  subject?: string;
  message: string;
  ip?: string;
}) {
  const id = (Bun as any).randomUUIDv7
    ? (Bun as any).randomUUIDv7()
    : `contact-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

  const stmt = db.prepare(`
    INSERT INTO contacts (id, name, email, subject, message, ip)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  stmt.run(id, data.name, data.email, data.subject || null, data.message, data.ip || null);

  return db.prepare("SELECT * FROM contacts WHERE id = ?").get(id);
}

export function getPaginatedContacts(page: number = 1, pageSize: number = 20) {
  const offset = (page - 1) * pageSize;
  const countRow = db.prepare("SELECT COUNT(*) as total FROM contacts").get() as { total: number };
  const rows = db.prepare("SELECT * FROM contacts ORDER BY created_at DESC LIMIT ? OFFSET ?").all(pageSize, offset);

  return {
    contacts: rows,
    total: countRow.total,
    page,
    pageSize,
    hasMore: offset + rows.length < countRow.total,
  };
}

export function updateContactStatus(id: string, status: "unread" | "read" | "archived") {
  db.prepare("UPDATE contacts SET status = ? WHERE id = ?").run(status, id);
}

export function deleteContact(id: string) {
  db.prepare("DELETE FROM contacts WHERE id = ?").run(id);
}

// ─────────────────────────────────────────────────────────────────────────
// ADMIN HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────

export function getAdminStats() {
  const totalComments = (db.prepare("SELECT COUNT(*) as count FROM comments").get() as any).count;
  const pendingComments = (db.prepare("SELECT COUNT(*) as count FROM comments WHERE status = 'pending'").get() as any).count;
  const flaggedComments = (db.prepare("SELECT COUNT(*) as count FROM comments WHERE status = 'flagged'").get() as any).count;
  const totalReports = (db.prepare("SELECT COUNT(*) as count FROM reported_comments WHERE resolved = 0").get() as any).count;
  const totalContacts = (db.prepare("SELECT COUNT(*) as count FROM contacts").get() as any).count;
  const unreadContacts = (db.prepare("SELECT COUNT(*) as count FROM contacts WHERE status = 'unread'").get() as any).count;

  return {
    totalComments,
    pendingComments,
    flaggedComments,
    totalReports,
    totalContacts,
    unreadContacts,
  };
}

export function getAdminComments(status: string = "all", page: number = 1, pageSize: number = 20) {
  const offset = (page - 1) * pageSize;
  let countSql = "SELECT COUNT(*) as total FROM comments";
  let fetchSql = "SELECT * FROM comments";
  const params: any[] = [];

  if (status !== "all") {
    countSql += " WHERE status = ?";
    fetchSql += " WHERE status = ?";
    params.push(status);
  }

  fetchSql += " ORDER BY created_at DESC LIMIT ? OFFSET ?";

  const countRow = db.prepare(countSql).get(...params) as { total: number };
  const rows = db.prepare(fetchSql).all(...params, pageSize, offset);

  const pendingCount = (db.prepare("SELECT COUNT(*) as c FROM comments WHERE status = 'pending'").get() as any).c;
  const flaggedCount = (db.prepare("SELECT COUNT(*) as c FROM comments WHERE status = 'flagged'").get() as any).c;
  const approvedCount = (db.prepare("SELECT COUNT(*) as c FROM comments WHERE status = 'approved'").get() as any).c;

  return {
    comments: rows.map(formatCommentRow),
    total: countRow.total,
    counts: {
      all: pendingCount + flaggedCount + approvedCount,
      pending: pendingCount,
      flagged: flaggedCount,
      approved: approvedCount,
    },
    page,
    pageSize,
  };
}

export function updateCommentAdminStatus(id: string, status: "approved" | "pending" | "flagged") {
  db.prepare("UPDATE comments SET status = ? WHERE id = ?").run(status, id);
}

export function deleteComment(id: string) {
  db.prepare("DELETE FROM comments WHERE id = ?").run(id);
}

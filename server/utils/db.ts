import DatabaseModule from "bun:sqlite";
import path from "node:path";
import fs from "node:fs";
import type { CommentItem } from "~/types/comment";

const dbDir = path.resolve(process.cwd(), "server/db");

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, "comments.sqlite");
const Database = (DatabaseModule as any).Database || DatabaseModule;
export const db = new Database(dbPath);

// WAL Mode for concurrent reads/writes
db.exec("PRAGMA journal_mode = WAL;");

// ── Comments table (with moderation fields) ──────────────────────────────
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
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_comments_post_slug ON comments(post_slug);
  CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_id);
  CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at DESC);
  CREATE INDEX IF NOT EXISTS idx_comments_status ON comments(status);
`);

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
function formatRelativeTime(created_at?: string): string {
  if (!created_at) return "Vừa xong";
  const diffMs = Date.now() - new Date(created_at).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "Vừa xong";
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

export function formatCommentRow(row: any): CommentItem {
  if (!row) return row;
  return {
    ...row,
    author: {
      name: row.author_name,
      avatar: row.author_avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(row.author_name)}`,
      isAuthor: row.author_name === "Lê Quân" || row.author_name === "Juno_okyo",
    },
    date: formatRelativeTime(row.created_at),
    likes: row.likes || 0,
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
}): CommentItem {
  const id = (Bun as any).randomUUIDv7
    ? (Bun as any).randomUUIDv7()
    : `comment-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

  const stmt = db.prepare(`
    INSERT INTO comments (id, post_slug, parent_id, author_name, author_email, author_avatar, content, status, mod_flags, mod_confidence)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
    data.mod_confidence || 0.0
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
  modConfidence: number
) {
  const stmt = db.prepare(
    "UPDATE comments SET status = ?, mod_flags = ?, mod_confidence = ? WHERE id = ?"
  );
  stmt.run(status, modFlags, modConfidence, commentId);
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

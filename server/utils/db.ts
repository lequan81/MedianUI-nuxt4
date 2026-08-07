import DatabaseModule from "bun:sqlite";
import path from "node:path";
import fs from "node:fs";

const dbDir = path.resolve(process.cwd(), "server/db");
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, "comments.sqlite");
const Database = (DatabaseModule as any).Database || DatabaseModule;
export const db = new Database(dbPath);

// Kích hoạt WAL Mode (Write-Ahead Logging) cho hiệu năng đọc ghi đồng thời siêu tốc
db.exec("PRAGMA journal_mode = WAL;");

// Khởi tạo bảng Comments với Bun.randomUUIDv7() chuẩn Native UUIDv7
db.exec(`
  CREATE TABLE IF NOT EXISTS comments (
    id TEXT PRIMARY KEY,
    post_slug TEXT NOT NULL,
    parent_id TEXT,
    author_name TEXT NOT NULL,
    author_email TEXT NOT NULL,
    author_avatar TEXT,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_comments_post_slug ON comments(post_slug);
  CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_id);
  CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at DESC);
`);

export interface CommentItem {
  id: string;
  post_slug: string;
  parent_id: string | null;
  author_name: string;
  author_email: string;
  author_avatar?: string;
  content: string;
  created_at: string;
  replies?: CommentItem[];
}

/**
 * Phân trang tối ưu theo thuật toán SQLite Deferred Join
 * Nối Index ID trước khi JOIN toàn bộ dữ liệu cột content/text
 */
export function getPaginatedComments(postSlug: string, page: number = 1, pageSize: number = 10) {
  const offset = (page - 1) * pageSize;

  // 1. Đếm tổng số bình luận gốc (top-level)
  const countStmt = db.prepare(
    "SELECT COUNT(*) as total FROM comments WHERE post_slug = ? AND parent_id IS NULL"
  );
  const { total } = countStmt.get(postSlug) as { total: number };

  // 2. Query Deferred Join lấy danh sách bình luận gốc
  const topCommentsStmt = db.prepare(`
    SELECT c.* FROM comments c
    JOIN (
      SELECT id FROM comments
      WHERE post_slug = ? AND parent_id IS NULL
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    ) lim ON c.id = lim.id
    ORDER BY c.created_at DESC
  `);
  const topComments = topCommentsStmt.all(postSlug, pageSize, offset) as CommentItem[];

  if (topComments.length === 0) {
    return {
      comments: [],
      total,
      page,
      pageSize,
      hasMore: false,
    };
  }

  // 3. Lấy tất cả phản hồi (replies) của các bình luận gốc đang hiển thị
  const parentIds = topComments.map((c) => c.id);
  const placeholders = parentIds.map(() => "?").join(",");
  const repliesStmt = db.prepare(`
    SELECT * FROM comments
    WHERE parent_id IN (${placeholders})
    ORDER BY created_at ASC
  `);
  const replies = repliesStmt.all(...parentIds) as CommentItem[];

  // 4. Group replies vào từng bình luận cha
  const repliesMap = new Map<string, CommentItem[]>();
  for (const reply of replies) {
    if (reply.parent_id) {
      if (!repliesMap.has(reply.parent_id)) {
        repliesMap.set(reply.parent_id, []);
      }
      repliesMap.get(reply.parent_id)!.push(reply);
    }
  }

  const commentsWithReplies = topComments.map((c) => ({
    ...c,
    replies: repliesMap.get(c.id) || [],
  }));

  return {
    comments: commentsWithReplies,
    total,
    page,
    pageSize,
    hasMore: offset + topComments.length < total,
  };
}

/**
 * Thêm bình luận mới sử dụng Bun.randomUUIDv7() native
 */
export function insertComment(data: {
  post_slug: string;
  parent_id?: string | null;
  author_name: string;
  author_email: string;
  author_avatar?: string;
  content: string;
}): CommentItem {
  const id = (Bun as any).randomUUIDv7
    ? (Bun as any).randomUUIDv7()
    : `comment-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

  const stmt = db.prepare(`
    INSERT INTO comments (id, post_slug, parent_id, author_name, author_email, author_avatar, content)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    id,
    data.post_slug,
    data.parent_id || null,
    data.author_name,
    data.author_email,
    data.author_avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(data.author_name)}`,
    data.content
  );

  const getStmt = db.prepare("SELECT * FROM comments WHERE id = ?");
  return getStmt.get(id) as CommentItem;
}

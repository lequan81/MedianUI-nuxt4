import { Database } from "bun:sqlite";
import path from "node:path";
import fs from "node:fs";
import crypto from "node:crypto";
import type { ContactMessage } from "~/types/contact";

const dbDir = path.resolve(process.cwd(), ".data/db");

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const isTestEnv = process.env.NODE_ENV === "test" || Boolean(process.env.VITEST);
const rawConfig = typeof useRuntimeConfig === "function" ? useRuntimeConfig() : null;

const defaultFileName = isTestEnv ? "lequan81dev_test.sqlite" : "lequan81dev_app.sqlite";
const dbFileName = String(process.env.DB_FILE_NAME || rawConfig?.dbFileName || defaultFileName).trim();

const dbPath = path.join(dbDir, dbFileName);

import { generateUUIDv7 } from "./id";

export const db = new Database(dbPath);

// WAL Mode for concurrent reads/writes
db.exec("PRAGMA journal_mode = WAL;");

export function queryOne<T>(sql: string, ...params: any[]): T | null {
  return (db.prepare(sql).get(...params) as T) || null;
}

export function queryAll<T>(sql: string, ...params: any[]): T[] {
  return (db.prepare(sql).all(...params) as T[]) || [];
}

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

// ─────────────────────────────────────────────────────────────────────────
// CONTACT FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────

export function insertContact(data: {
  name: string;
  email: string;
  subject?: string;
  message: string;
  ip?: string;
}): ContactMessage | null {
  const id = generateUUIDv7();

  const stmt = db.prepare(`
    INSERT INTO contacts (id, name, email, subject, message, ip)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  stmt.run(id, data.name, data.email, data.subject || null, data.message, data.ip || null);

  return queryOne<ContactMessage>("SELECT * FROM contacts WHERE id = ?", id);
}

export function getPaginatedContacts(page: number = 1, pageSize: number = 20) {
  const offset = (page - 1) * pageSize;
  const countRow = queryOne<{ total: number }>("SELECT COUNT(*) as total FROM contacts") || { total: 0 };
  const rows = queryAll<ContactMessage>("SELECT * FROM contacts ORDER BY created_at DESC LIMIT ? OFFSET ?", pageSize, offset);

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
  const totalContacts = queryOne<{ count: number }>("SELECT COUNT(*) as count FROM contacts")?.count || 0;
  const unreadContacts = queryOne<{ count: number }>("SELECT COUNT(*) as count FROM contacts WHERE status = 'unread'")?.count || 0;

  return {
    totalContacts,
    unreadContacts,
  };
}

import { db, queryOne, queryAll } from "~/server/db/client";
import { generateUUIDv7 } from "~/server/utils/id";
import type { ContactMessage } from "~/types/contact";

export interface CreateContactInput {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export function createContact(data: CreateContactInput, ip?: string): ContactMessage | null {
  const id = generateUUIDv7();

  const stmt = db.prepare(`
    INSERT INTO contacts (id, name, email, subject, message, ip)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  stmt.run(id, data.name, data.email, data.subject || null, data.message, ip || null);

  return queryOne<ContactMessage>("SELECT * FROM contacts WHERE id = ?", id);
}

export function listContacts(page: number = 1, pageSize: number = 20) {
  const offset = (page - 1) * pageSize;
  const countRow = queryOne<{ total: number }>("SELECT COUNT(*) as total FROM contacts") || { total: 0 };
  const rows = queryAll<ContactMessage>(
    "SELECT * FROM contacts ORDER BY created_at DESC LIMIT ? OFFSET ?",
    pageSize,
    offset
  );

  return {
    contacts: rows,
    total: countRow.total,
    page,
    pageSize,
    hasMore: offset + rows.length < countRow.total,
  };
}

export function setContactStatus(id: string, status: "unread" | "read" | "archived"): void {
  db.prepare("UPDATE contacts SET status = ? WHERE id = ?").run(status, id);
}

export function removeContact(id: string): void {
  db.prepare("DELETE FROM contacts WHERE id = ?").run(id);
}

export function getContactStats(): { totalContacts: number; unreadContacts: number } {
  const total = queryOne<{ count: number }>("SELECT COUNT(*) as count FROM contacts")?.count || 0;
  const unread =
    queryOne<{ count: number }>("SELECT COUNT(*) as count FROM contacts WHERE status = 'unread'")?.count || 0;

  return {
    totalContacts: total,
    unreadContacts: unread,
  };
}

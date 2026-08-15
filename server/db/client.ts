import { Database, type SQLQueryBindings } from "bun:sqlite";
import { initSchema } from "./schema";

const isTestEnv = process.env.NODE_ENV === "test" || Boolean(process.env.VITEST);
const rawConfig = typeof useRuntimeConfig === "function" ? useRuntimeConfig() : null;

const defaultFileName = isTestEnv ? "lequan81dev_test.sqlite" : "lequan81dev_app.sqlite";
const dbFileName = String(process.env.DB_FILE_NAME || rawConfig?.dbFileName || defaultFileName).trim();

const dbPath = `.data/db/${dbFileName}`;

export const db = new Database(dbPath, { create: true });

// High-performance SQLite PRAGMA configuration for Bun runtime
db.run(`
  PRAGMA journal_mode = WAL;
  PRAGMA synchronous = NORMAL;
  PRAGMA busy_timeout = 5000;
  PRAGMA cache_size = -64000;
`);

// Run DDL migrations on startup
initSchema(db);

export function queryOne<T>(sql: string, ...params: SQLQueryBindings[]): T | null {
  return (db.prepare(sql).get(...params) as T) || null;
}

export function queryAll<T>(sql: string, ...params: SQLQueryBindings[]): T[] {
  return (db.prepare(sql).all(...params) as T[]) || [];
}

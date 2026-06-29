import Database from "better-sqlite3";
import path from "path";
import { schema } from "./schema";

const dbPath = process.env.DATABASE_FILE || path.resolve(process.cwd(), "../../packages/db/dev.db");

const globalForDb = globalThis as unknown as { __atsDb?: Database.Database };

function init() {
  const db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  db.exec(schema);
  return db;
}

export const db = globalForDb.__atsDb ?? init();

if (process.env.NODE_ENV !== "production") {
  globalForDb.__atsDb = db;
}

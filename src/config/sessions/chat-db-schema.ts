import path from "node:path";
import { ensureDir } from "../../memory/internal.js";
import { requireNodeSqlite } from "../../memory/sqlite.js";
import { resolveConfigDir, resolveUserPath } from "../../utils.js";

const SESSIONS_TABLE = "sessions";

/**
 * Resolve the chat DB path: OPENCLAW_CHAT_DB_PATH or ~/.openclaw/chat.db
 * (respects OPENCLAW_STATE_DIR for the default).
 */
export function resolveChatDbPath(): string {
  const envPath = process.env.OPENCLAW_CHAT_DB_PATH?.trim();
  if (envPath) {
    return resolveUserPath(envPath);
  }
  return path.join(resolveConfigDir(), "chat.db");
}

/**
 * Ensure the chat DB directory exists, open the DB, run PRAGMAs, create
 * the sessions table and indexes. Returns the sync database instance.
 */
export function ensureChatDbSchema(dbPath: string): import("node:sqlite").DatabaseSync {
  const dir = path.dirname(dbPath);
  ensureDir(dir);

  const { DatabaseSync } = requireNodeSqlite();
  const db = new DatabaseSync(dbPath);

  db.exec("PRAGMA journal_mode=WAL");
  db.exec("PRAGMA foreign_keys=ON");

  db.exec(`
    CREATE TABLE IF NOT EXISTS ${SESSIONS_TABLE} (
      key TEXT PRIMARY KEY,
      agent_id TEXT NOT NULL,
      store_path TEXT NOT NULL,
      payload TEXT NOT NULL,
      updated_at INTEGER NOT NULL
    )
  `);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_sessions_agent ON ${SESSIONS_TABLE}(agent_id)`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_sessions_updated ON ${SESSIONS_TABLE}(updated_at)`);

  return db;
}

import path from "node:path";
import type { DatabaseSync } from "node:sqlite";
import { ensureChatDbSchema, resolveChatDbPath } from "./chat-db-schema.js";
import type { SessionEntry } from "./types.js";

const SESSIONS_TABLE = "sessions";

let cachedDb: DatabaseSync | null = null;

function getDb(): DatabaseSync {
  if (cachedDb) {
    return cachedDb;
  }
  cachedDb = ensureChatDbSchema(resolveChatDbPath());
  return cachedDb;
}

/**
 * Derive agent_id from store path for SQLite rows.
 * Default layout: .../agents/<agentId>/sessions/sessions.json
 */
export function deriveAgentIdFromStorePath(storePath: string): string {
  const resolved = path.resolve(storePath);
  const parts = resolved.split(path.sep);
  const agentsIdx = parts.indexOf("agents");
  if (agentsIdx >= 0 && agentsIdx + 1 < parts.length) {
    return parts[agentsIdx + 1] ?? "default";
  }
  const dir = path.dirname(resolved);
  const parent = path.basename(dir);
  return parent || "default";
}

/**
 * Load all sessions for a store path from SQLite (no agent_id filter).
 * Used when OPENCLAW_SESSION_STORE_SQLITE=1 for loadSessionStore.
 */
export function loadSessionsFromSqliteByStorePath(storePath: string): Record<string, SessionEntry> {
  const db = getDb();
  const rows = db
    .prepare(`SELECT key, payload FROM ${SESSIONS_TABLE} WHERE store_path = ?`)
    .all(storePath) as Array<{ key: string; payload: string }>;

  const store: Record<string, SessionEntry> = {};
  for (const row of rows) {
    try {
      const entry = JSON.parse(row.payload) as SessionEntry;
      store[row.key] = entry;
    } catch {
      // Skip malformed payloads
    }
  }
  return store;
}

export function loadSessionsFromSqlite(
  agentId: string,
  storePath: string,
): Record<string, SessionEntry> {
  const db = getDb();
  const rows = db
    .prepare(`SELECT key, payload FROM ${SESSIONS_TABLE} WHERE store_path = ? AND agent_id = ?`)
    .all(storePath, agentId) as Array<{ key: string; payload: string }>;

  const store: Record<string, SessionEntry> = {};
  for (const row of rows) {
    try {
      const entry = JSON.parse(row.payload) as SessionEntry;
      store[row.key] = entry;
    } catch {
      // Skip malformed payloads
    }
  }
  return store;
}

export function saveSessionsToSqlite(
  agentId: string,
  storePath: string,
  store: Record<string, SessionEntry>,
): void {
  const db = getDb();
  const stmt = db.prepare(
    `INSERT OR REPLACE INTO ${SESSIONS_TABLE} (key, agent_id, store_path, payload, updated_at) VALUES (?, ?, ?, ?, ?)`,
  );
  db.exec("BEGIN");
  try {
    for (const [key, entry] of Object.entries(store)) {
      if (!entry) {
        continue;
      }
      const updatedAt = entry.updatedAt ?? 0;
      stmt.run(key, agentId, storePath, JSON.stringify(entry), updatedAt);
    }
    db.exec("COMMIT");
  } catch (err) {
    db.exec("ROLLBACK");
    throw err;
  }
}

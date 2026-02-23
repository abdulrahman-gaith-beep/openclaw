#!/usr/bin/env node
/**
 * Backfill session metadata from agents/<agentId>/sessions/sessions.json into SQLite chat.db.
 * Idempotent: safe to re-run. Uses node:sqlite only (Node 22+).
 * Run: node scripts/backfill-sessions-to-sqlite.mjs
 */

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

const STATE_DIR = process.env.OPENCLAW_STATE_DIR ?? path.join(os.homedir(), ".openclaw");
const CHAT_DB_PATH = process.env.OPENCLAW_CHAT_DB_PATH ?? path.join(STATE_DIR, "chat.db");

// Drop then create so re-runs always use the plan schema (idempotent).
const SESSIONS_TABLE_SQL = `
DROP TABLE IF EXISTS sessions;
CREATE TABLE sessions (
  key TEXT PRIMARY KEY,
  agent_id TEXT NOT NULL,
  store_path TEXT NOT NULL,
  payload TEXT NOT NULL,
  updated_at INTEGER NOT NULL
);
CREATE INDEX idx_sessions_agent ON sessions(agent_id);
CREATE INDEX idx_sessions_updated ON sessions(updated_at);
`;

/**
 * Collect all sessions.json paths under stateDir/agents/<agentId>/sessions/sessions.json.
 * @param {string} stateDir
 * @returns {string[]} Absolute paths to sessions.json files
 */
function findSessionsJsonFiles(stateDir) {
  const agentsDir = path.join(stateDir, "agents");
  const files = [];
  if (!fs.existsSync(agentsDir)) {
    return files;
  }
  const agentIds = fs.readdirSync(agentsDir, { withFileTypes: true });
  for (const ent of agentIds) {
    if (!ent.isDirectory()) {
      continue;
    }
    const sessionsPath = path.join(agentsDir, ent.name, "sessions", "sessions.json");
    if (fs.existsSync(sessionsPath)) {
      files.push(sessionsPath);
    }
  }
  return files;
}

/**
 * Extract agent_id from a path like .../agents/main/sessions/sessions.json -> main.
 * @param {string} stateDir
 * @param {string} sessionsJsonPath
 * @returns {string}
 */
function agentIdFromPath(stateDir, sessionsJsonPath) {
  const rel = path.relative(stateDir, sessionsJsonPath);
  const parts = rel.split(path.sep);
  // agents, <agentId>, sessions, sessions.json
  return parts[1] ?? "unknown";
}

/**
 * @param {string} storePath
 * @returns {{ parsed: Record<string, { updatedAt?: number }>, ok: boolean }}
 */
function readSessionsJson(storePath) {
  try {
    const raw = fs.readFileSync(storePath, "utf-8");
    const parsed = JSON.parse(raw);
    if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
      return { parsed: {}, ok: false };
    }
    return { parsed, ok: true };
  } catch {
    return { parsed: {}, ok: false };
  }
}

function main() {
  console.log("State dir:", STATE_DIR);
  console.log("Chat DB: ", CHAT_DB_PATH);

  const sessionsFiles = findSessionsJsonFiles(STATE_DIR);
  console.log("Found", sessionsFiles.length, "sessions.json file(s)");

  const dbDir = path.dirname(CHAT_DB_PATH);
  if (sessionsFiles.length > 0 && !fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  const db = new DatabaseSync(CHAT_DB_PATH);
  try {
    db.exec("PRAGMA journal_mode=WAL;");
    db.exec(SESSIONS_TABLE_SQL);
  } catch (err) {
    console.error("Failed to initialize SQLite:", err);
    process.exit(1);
  }

  const insertStmt = db.prepare(
    "INSERT OR REPLACE INTO sessions (key, agent_id, store_path, payload, updated_at) VALUES (?, ?, ?, ?, ?)",
  );

  let filesProcessed = 0;
  let rowsInserted = 0;

  for (const storePath of sessionsFiles) {
    const { parsed, ok } = readSessionsJson(storePath);
    if (!ok) {
      continue;
    }
    filesProcessed += 1;
    const agentId = agentIdFromPath(STATE_DIR, storePath);
    const now = Date.now();
    for (const [sessionKey, entry] of Object.entries(parsed)) {
      const updatedAt =
        entry != null && typeof entry === "object" && typeof entry.updatedAt === "number"
          ? entry.updatedAt
          : now;
      const payload = JSON.stringify(entry);
      insertStmt.run(sessionKey, agentId, storePath, payload, updatedAt);
      rowsInserted += 1;
    }
  }

  db.close();
  console.log("Files processed:", filesProcessed);
  console.log("Rows inserted/replaced:", rowsInserted);
}

main();

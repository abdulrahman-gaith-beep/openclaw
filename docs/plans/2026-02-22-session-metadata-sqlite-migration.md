# Session Metadata SQLite Migration — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Move session metadata source-of-truth from `sessions.json` (per-agent flat file) to SQLite `sessions` table in `~/.openclaw/chat.db`, enabling concurrent access, efficient queries, and future chat search/analytics.

**Architecture:** Introduce `~/.openclaw/chat.db` with `sessions` table. Gateway session store layer will read/write SQLite as primary; keep JSONL transcripts unchanged. Dual-write during migration, then cutover. Use WAL mode and proper locking.

**Tech Stack:** Node.js `node:sqlite`, gateway session store (`src/config/sessions/store.ts`), gateway session-utils (`src/gateway/session-utils.ts`).

---

## Context & Rationale

From `ARCHITECTURE-AUDIT-2026-02-19.md`:

- **Gap 4:** `sessions.json` is a flat file rewritten entirely on every update. No concurrent access safety beyond file locking.
- **Phase 1 remaining:** Move session metadata source-of-truth from `sessions.json` to SQLite `sessions` table.

---

## Schema Design

```sql
CREATE TABLE IF NOT EXISTS sessions (
  key TEXT PRIMARY KEY,
  agent_id TEXT NOT NULL,
  store_path TEXT NOT NULL,
  payload TEXT NOT NULL,
  updated_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_sessions_agent ON sessions(agent_id);
CREATE INDEX IF NOT EXISTS idx_sessions_updated ON sessions(updated_at);
```

- `key`: session key
- `agent_id`: extracted from key
- `store_path`: original sessions.json path
- `payload`: JSON.stringify(SessionEntry)
- `updated_at`: for pruning/capping

---

## Task Breakdown

### Task 1: Create chat.db schema module — DONE

- Create `src/config/sessions/chat-db-schema.ts`
- Create `src/config/sessions/chat-db-schema.test.ts`

### Task 2: Add SessionStoreSqlite adapter — DONE

- Create `src/config/sessions/store-sqlite.ts`
- Export from `src/config/sessions.ts`

### Task 3: Integrate dual-write into store.ts — DONE

- Add OPENCLAW_SESSION_STORE_SQLITE flag
- Dual-write in saveSessionStoreUnlocked
- Read from SQLite first in loadSessionStore when flag set

### Task 4: Backfill script — DONE

- Create `scripts/backfill-sessions-to-sqlite.mjs`
- npm script: `pnpm backfill:sessions`

### Task 5: Enable SQLite as primary — DONE

- Default: SQLite enabled (set `OPENCLAW_SESSION_STORE_SQLITE=0` to disable)
- Docs: session-management-compaction.md and concepts/session.md updated

---

## Blocking Issue: Fix build pipeline

**Problem:** `fix-exports.mjs` exists but is NOT in the build script. Add after tsdown:

```json
"build": "pnpm canvas:a2ui:bundle && tsdown && node scripts/fix-exports.mjs && ..."
```

---

## References

- ARCHITECTURE-AUDIT-2026-02-19.md
- src/config/sessions/store.ts
- src/config/sessions/types.ts

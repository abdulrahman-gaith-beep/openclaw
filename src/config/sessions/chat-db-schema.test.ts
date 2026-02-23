import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { ensureChatDbSchema, resolveChatDbPath } from "./chat-db-schema.js";

let tempDir: string;

beforeAll(async () => {
  tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-chat-db-schema-"));
});

afterAll(async () => {
  await fs.rm(tempDir, { recursive: true, force: true });
});

describe("chat-db-schema", () => {
  it("ensureChatDbSchema creates DB with sessions table in temp dir", () => {
    const dbPath = path.join(tempDir, "chat.db");
    const db = ensureChatDbSchema(dbPath);

    const row = db
      .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='sessions'")
      .get() as { name: string } | undefined;

    expect(row?.name).toBe("sessions");
    db.close();
  });
});

describe("resolveChatDbPath", () => {
  it("returns path under config dir when OPENCLAW_CHAT_DB_PATH is unset", () => {
    const prev = process.env.OPENCLAW_CHAT_DB_PATH;
    delete process.env.OPENCLAW_CHAT_DB_PATH;
    try {
      const p = resolveChatDbPath();
      expect(p).toContain("chat.db");
      expect(path.isAbsolute(p)).toBe(true);
    } finally {
      if (prev !== undefined) {
        process.env.OPENCLAW_CHAT_DB_PATH = prev;
      }
    }
  });
});

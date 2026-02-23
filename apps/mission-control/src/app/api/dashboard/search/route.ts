import { NextRequest, NextResponse } from "next/server";
import { withApiGuard, ApiGuardPresets } from "@/lib/api-guard";
import { handleApiError, UserError } from "@/lib/errors";
import { listTasks, listMissions } from "@/lib/db";
import { getSpecializedAgents } from "@/lib/agent-registry";
import { isValidWorkspaceId } from "@/lib/workspaces-server";

export interface DashboardSearchResult {
  type: "task" | "mission" | "agent" | "specialist";
  id: string;
  title: string;
  subtitle?: string;
  viewId: string;
  hash?: string;
}

export interface DashboardSearchResponse {
  results: DashboardSearchResult[];
  query: string;
}

function normalize(s: string): string {
  return s.toLowerCase().trim().replace(/\s+/g, " ");
}

function matches(query: string, text: string): boolean {
  const q = normalize(query);
  const t = normalize(text);
  return t.includes(q) || q.split(" ").every((word) => t.includes(word));
}

export const GET = withApiGuard(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim();
    const workspaceId = searchParams.get("workspace_id") ?? "golden";

    if (!q || q.length < 2) {
      return NextResponse.json({ results: [], query: q ?? "" });
    }

    if (!isValidWorkspaceId(workspaceId)) {
      throw new UserError("Invalid workspace_id", 400);
    }

    const results: DashboardSearchResult[] = [];

    // Search tasks
    const tasks = listTasks({ workspace_id: workspaceId });
    for (const t of tasks) {
      if (matches(q, t.title) || matches(q, t.description || "")) {
        results.push({
          type: "task",
          id: t.id,
          title: t.title,
          subtitle: t.status,
          viewId: "board",
          hash: `board?task=${t.id}`,
        });
      }
    }

    // Search missions
    const missions = listMissions({ workspace_id: workspaceId });
    for (const m of missions) {
      if (matches(q, m.name) || matches(q, m.description || "")) {
        results.push({
          type: "mission",
          id: m.id,
          title: m.name,
          subtitle: m.status,
          viewId: "missions",
          hash: `missions?mission=${m.id}`,
        });
      }
    }

    // Search specialists (from agent registry)
    const specialists = getSpecializedAgents();
    for (const s of specialists) {
      const searchText = [s.name, s.description, ...(s.capabilities || []), ...(s.suggestedTasks || [])].join(" ");
      if (matches(q, searchText)) {
        results.push({
          type: "specialist",
          id: s.id,
          title: s.name,
          subtitle: s.description?.slice(0, 60),
          viewId: "specialists",
          hash: `specialists?agent=${s.id}`,
        });
      }
    }

    // Agents come from gateway - we don't have them in DB. Skip for now or fetch from gateway.
    // For simplicity, we rely on specialists which are the main "agents" in Mission Control.

    return NextResponse.json({
      results: results.slice(0, 20),
      query: q,
    });
  } catch (error) {
    return handleApiError(error, "Dashboard search failed");
  }
}, ApiGuardPresets.read);

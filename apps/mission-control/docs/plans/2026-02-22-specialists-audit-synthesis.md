# Specialists Page — Full Audit & Integration Synthesis

**Date:** 2026-02-22  
**Status:** Audit complete; actionable fixes identified  

---

## 1. Implementation Status

| Plan Task | Status | Notes |
|-----------|--------|-------|
| 42 agents in registry | ✅ Done | 45 agents (includes ceo-advisor, cto-advisor, content-strategist, demand-gen, product-manager) |
| FilterBar | ✅ Done | Search, category chips, status/quality/sort, view modes |
| StatsRibbon (6 KPIs) | ✅ Done | Total, Available, Busy, Tasks Done, Avg Quality, Top Performer |
| AdvisoryPanel collapsible | ✅ Done | 3 channels |
| AgentCard (quality ring, sparkline, favorites) | ✅ Done | QualityScoreRing, TrendSparkline, star, checkbox |
| AgentDetailPanel | ✅ Done | Feedback history, comparison button |
| ComparisonView | ✅ Done | Side-by-side stats for 2–3 agents |
| BulkDispatchBar | ✅ Done | Bottom bar when 2+ selected |
| View modes (grid/list/comparison) | ✅ Done | localStorage persisted |
| Favorites localStorage | ✅ Done | `oc-specialists-view` |

---

## 2. Critical Integration Gaps

### 2.1 `suggestAgentForTask` keyword map mismatch

**File:** `src/lib/agent-registry.ts` (line 3049)

- **Issue:** `"design-system-architect"` in keyword map vs `"design-system"` in registry
- **Effect:** Design system specialist never suggested for tasks
- **Fix:** Change `"design-system-architect"` → `"design-system"` in keywordMap

### 2.2 Missing keyword entries for 5 agents

**File:** `src/lib/agent-registry.ts`

- **Agents:** `ceo-advisor`, `cto-advisor`, `content-strategist`, `demand-gen`, `product-manager`
- **Effect:** These agents never appear in `suggestAgentForTask` results
- **Fix:** Add keyword mappings for each agent

### 2.3 Orchestrator UI ignores specialists

**File:** `src/components/views/orchestrator.tsx`

- **Issue:** Agent dropdown only shows gateway agents; specialists not available
- **Effect:** Manual orchestrator use cannot pick specialists; only Learning Hub Build (Parallel) can
- **Fix:** Merge `SPECIALIZED_AGENTS` (or fetch `/api/agents/specialists`) into the agent dropdown

### 2.4 Employees inline task dispatch excludes specialists

**File:** `src/components/views/employees-view.tsx` (lines 1820–1836)

- **Issue:** Per-employee task dispatch dropdown uses only `agents` (gateway)
- **Effect:** Task form uses specialists, but inline dispatch does not
- **Fix:** Add specialists to the inline dispatch dropdown (same pattern as DispatchModal)

### 2.5 "View Specialist Profile" does not select specialist

**File:** `src/components/modals/task-detail.tsx` → `src/components/views/ai-specialists.tsx`

- **Issue:** Task Detail sets `#specialists` and closes; specialists view does not auto-select the task’s specialist
- **Effect:** User must manually find the specialist after navigating
- **Fix:** Support `#specialists?agent=frontend-dev` (or similar) and have AISpecialists select that specialist on open

---

## 3. Code Quality Issues (Prioritized)

### High

| # | Issue | File | Fix |
|---|-------|------|-----|
| 1 | Keyword map ID mismatch | agent-registry.ts:3049 | `design-system-architect` → `design-system` |
| 2 | Specialist icon shown as text in dropdown | employees-view.tsx:2245–2249 | Remove icon from option text or use custom select with icon |
| 3 | SmartSuggestion button missing ARIA | ai-specialists.tsx:1589–1611 | Add `aria-label`, `role`, `tabIndex` |
| 4 | Search input missing ARIA | learning-hub.tsx:1089–1095 | Add `aria-label="Search lessons by title, summary, or tags"` |
| 5 | Feedback note input not associated with label | task-detail.tsx:369–377 | Add `id`/`htmlFor` for label association |

### Medium

| # | Issue | File | Fix |
|---|-------|------|-----|
| 6 | Agent list not virtualized | ai-specialists.tsx | Use `@tanstack/react-virtual` or `react-window` for large lists |
| 7 | Duplicate localStorage writes | learning-hub.tsx:558–578 | Centralize persistence, debounce writes |
| 8 | Inconsistent design tokens | ai-specialists.tsx | Use `glass-2` consistently (vs `glass-panel`) |
| 9 | SpecialistSuggestion type mismatch | learning-hub.tsx vs ai-specialists.tsx | Shared type in `@/lib/types` |
| 10 | Notification dropdown not keyboard-accessible | learning-hub.tsx:956–1006 | Use Radix Popover/DropdownMenu |

### Low

| # | Issue | File | Fix |
|---|-------|------|-----|
| 11 | handleAssignTask not memoized | ai-specialists.tsx:2533 | Wrap in `useCallback` |
| 12 | Feedback error not announced | task-detail.tsx:378 | Add `role="alert"` and `aria-live="polite"` |
| 13 | Filter buttons missing aria-pressed | learning-hub.tsx:1098–1110 | Add `role="tablist"` / `role="tab"` and `aria-pressed` |

---

## 4. Integration Map (Summary)

| Component | Specialist Usage |
|-----------|------------------|
| **page.tsx** | `suggestAgentForTask` for community usecase seed; mounts `AISpecialists` with full props |
| **AISpecialists** | `getSpecializedAgents`, `getSpecializedAgent`, `suggestAgentForTask`; fetches specialists API |
| **Learning Hub** | `/recommend`, `/suggestions`; Specialist Learning Signals; Build (Parallel) |
| **Employees View** | `SPECIALIZED_AGENTS` for task form dropdown; inline dispatch **excludes specialists** |
| **Task Detail** | `POST /api/agents/specialists/feedback`; "View Specialist Profile" → `#specialists` |
| **Dispatch Modal** | `SPECIALIZED_AGENTS` + `suggestAgentForTask` |
| **Create Task Modal** | `SPECIALIZED_AGENTS` + `suggestAgentForTask` |
| **Orchestrator** | Fetches gateway only; **does not include specialists** |

---

## 5. Recommended Next Steps

1. **Immediate fixes** (agent-registry.ts)
   - Fix `design-system-architect` → `design-system` in keywordMap
   - Add keyword entries for `ceo-advisor`, `cto-advisor`, `content-strategist`, `demand-gen`, `product-manager`

2. **Integration fixes**
   - Add specialists to Orchestrator agent dropdown
   - Add specialists to Employees inline dispatch dropdown
   - Support `#specialists?agent=<id>` for deep link + auto-select

3. **Accessibility fixes**
   - ARIA and keyboard support for SmartSuggestion, search, feedback note, filter buttons

4. **Design system consistency**
   - Standardize `glass-2` vs `glass-panel` in ai-specialists.tsx

5. **Optional improvements**
   - Virtualize agent list for large lists
   - Centralize Learning Hub localStorage writes
   - Unify SpecialistSuggestion type

# Specialists Audit Findings — Implementation Plan

> **For Claude:** Implement this plan task-by-task. Tasks are ordered by priority.

**Goal:** Fix all critical integration gaps, accessibility issues, and code quality findings from the 2026-02-22 specialists audit.

**Architecture:** No new files. Modify existing components: orchestrator, employees-view, task-detail, ai-specialists, learning-hub, agent-registry.

**Tech Stack:** React 19, TypeScript, Radix UI, existing design system.

---

## Phase 1: Integration Fixes

### Task 1: Orchestrator — Add specialists to agent dropdown ✅

**Files:** `src/components/views/orchestrator.tsx`

**Steps:**
1. Import `SPECIALIZED_AGENTS` from `@/lib/agent-registry`
2. Create combined agents list: gateway agents first, then specialists (map to `{ id, name }`)
3. Update the SelectContent to show two groups: "Gateway Agents" and "AI Specialists"
4. Ensure default agent fallback includes specialists when gateway is empty

**Verification:** Open Orchestrator, agent dropdown shows both gateway agents and AI specialists.

---

### Task 2: Employees view — Add specialists to inline dispatch dropdown ✅

**Files:** `src/components/views/employees-view.tsx` (lines 1820–1836)

**Steps:**
1. The inline dispatch `<select>` currently maps only `agents`. Add `SPECIALIZED_AGENTS` as a second group.
2. Use `<optgroup label="Gateway Agents">` and `<optgroup label="AI Specialists">` for clarity.
3. For specialists use `specialist.name` (remove icon from option text per audit).

**Verification:** In Employees view, per-task dispatch dropdown shows both gateway agents and specialists.

---

### Task 3: View Specialist Profile — Deep link + auto-select ✅

**Files:**
- `src/components/layout/sidebar.tsx` — `getViewFromHash()` must parse `specialists?agent=id`
- `src/components/modals/task-detail.tsx` — set hash to `#specialists?agent=${agentId}`
- `src/components/views/ai-specialists.tsx` — read `agent` from hash, open detail panel

**Steps:**
1. In `getViewFromHash`, strip query: `hash.split("?")[0]` so `specialists?agent=frontend-dev` → `specialists`
2. In task-detail "View Specialist Profile" button: `window.location.hash = "specialists?agent=" + encodeURIComponent(task.assigned_agent_id)`
3. In AISpecialists: add `useEffect` that on mount/hashchange parses `window.location.hash` for `agent=` param; if present, set `selectedAgentId` to that agent and ensure detail panel opens

**Verification:** From task detail, click "View Specialist Profile" → specialists view opens with that specialist's detail panel open.

---

## Phase 2: Accessibility Fixes

### Task 4: Employees view — Remove icon from specialist dropdown option text ✅

**Files:** `src/components/views/employees-view.tsx` (lines 2245–2249)

**Steps:**
1. Change option content from `{specialist.icon} {specialist.name}` to `{specialist.name}` (icon is Lucide name, renders as text)

**Verification:** Task form specialist dropdown shows "Frontend Developer" not "Palette Frontend Developer".

---

### Task 5: SmartSuggestion button — Add ARIA ✅

**Files:** `src/components/views/ai-specialists.tsx` (lines ~1589–1611)

**Steps:**
1. Find the recommendation button in SmartSuggestion/QuickAssignDialog
2. Add `aria-label={`Select recommended specialist: ${recommendation.name}`}` and `type="button"`

**Verification:** Screen reader announces button purpose.

---

### Task 6: Learning Hub search input — Add ARIA ✅

**Files:** `src/components/views/learning-hub.tsx` (lines ~1089–1095)

**Steps:**
1. Add `aria-label="Search lessons by title, summary, or tags"` to the search input

**Verification:** Screen reader announces input purpose.

---

### Task 7: Task detail feedback note — Label association ✅

**Files:** `src/components/modals/task-detail.tsx` (lines 369–377)

**Steps:**
1. Add `id="feedback-note"` to the input
2. Add `htmlFor="feedback-note"` to the label

**Verification:** Clicking label focuses input.

---

### Task 8: Task detail feedback error — Add role="alert" ✅

**Files:** `src/components/modals/task-detail.tsx` (lines ~378)

**Steps:**
1. Add `role="alert"` and `aria-live="polite"` to the feedback error element

**Verification:** Screen reader announces error when it appears.

---

### Task 9: Learning Hub filter buttons — Add aria-pressed ✅

**Files:** `src/components/views/learning-hub.tsx` (lines ~1098–1110)

**Steps:**
1. Add `role="tablist"` to container, `role="tab"` and `aria-pressed={currentFilter === filter.id}` to each filter button

**Verification:** Screen reader and keyboard users understand toggle state.

---

## Phase 3: Code Quality

### Task 10: ai-specialists — Use glass-2 consistently ✅

**Files:** `src/components/views/ai-specialists.tsx`

**Steps:**
1. Find `glass-panel` usage in StatsRibbon and ComparisonView
2. Replace with `glass-2` for design system consistency

**Verification:** Visual consistency with other dashboard cards.

---

### Task 11: ai-specialists — Memoize handleAssignTask ✅

**Files:** `src/components/views/ai-specialists.tsx` (lines ~2533)

**Steps:**
1. Wrap `handleAssignTask` in `useCallback` with empty deps (or appropriate deps)

**Verification:** No functional change; fewer re-renders.

---

## Completed (Pre-Plan)

- [x] agent-registry: `design-system-architect` → `design-system` in keywordMap
- [x] agent-registry: Add keyword entries for ceo-advisor, cto-advisor, content-strategist, demand-gen, product-manager

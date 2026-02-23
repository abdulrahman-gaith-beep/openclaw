# Phase 1: Repository Analysis & Planning

## 1. Codebase Map

### 1.1 Target Application: Mission Control Dashboard

**Path:** `apps/mission-control/`  
**Framework:** Next.js 16.1.6 (App Router), React 19.2.4  
**Build:** Next.js build, Tailwind CSS 4, TypeScript 5.9  
**State:** React (useState/useCallback/useMemo), ProfileContext, no global store  
**Styling:** Tailwind 4 + CSS variables (OKLCH), shadcn/Radix, `globals.css` (design tokens, glass, glow, grid pattern)

### 1.2 Routes & Pages

| Route | Content | Component |
|-------|---------|-----------|
| `/` | Single-page dashboard | `src/app/page.tsx` (hash-based view switching) |

**Views (hash-driven):**  
`#board` | `#chat` | `#orchestrate` | `#agents` | `#employees` | `#specialists` | `#learn` | `#all-tools` | `#usage` | `#logs` | `#approvals` | `#missions` | `#integrations` | `#channels` | `#tools` | `#skills` | `#plugins` | `#mcp-servers` | `#cron` | `#settings`

All views are lazy-loaded via `dynamic()` with `ViewSkeleton` placeholders.

### 1.3 API Endpoints (64 routes)

- **Auth:** `auth/session`, `accounts`, `csrf-token`
- **Tasks:** `tasks`, `tasks/dispatch`, `tasks/comments`, `tasks/check-completion`, `tasks/rework`
- **Chat:** `chat`, `chat/council`, `chat/attachments`, `chat/search`, `chat/tags`, `chat/sessions`, `chat/sessions/search`, `chat/analytics`
- **Agents:** `agents`, `agents/files`, `agents/teams`, `agents/specialists`, `agents/specialists/suggestions`, `agents/specialists/feedback`, `agents/specialists/recommend`
- **Employees:** `employees`, `employees/access`, `employees/seed`, `employees/schedules`, `employees/schedules/run`, `employees/swarm-seed`, `employees/hierarchy`
- **OpenClaw gateway:** `openclaw/status`, `openclaw/sessions`, `openclaw/approvals`, `openclaw/cron`, `openclaw/events`, `openclaw/restart`, `openclaw/channels`, `openclaw/skills`, `openclaw/usage`, `openclaw/community-usecases`, `openclaw/nodes`, `openclaw/config`, `openclaw/connectivity`, `openclaw/tools`, `openclaw/community-skills`
- **Gateway:** `gateway/start`
- **Settings:** `settings/models`, `settings/api-keys`, `settings/api-keys/batch-status`, `settings/credits`, `settings/risk-level`
- **Other:** `profiles`, `profiles/workspaces`, `workspaces`, `missions`, `missions/save-queue`, `models`, `health`, `activity`, `plugins`, `integrations`, `learning-hub/lessons`, `orchestrator`, `search`

### 1.4 Key Components & Layout

- **Layout:** `Sidebar`, `Header`, `LiveTerminal`, scroll root with `#main-content`
- **Dashboard:** `StatCards`, `TaskFilterBar`, `KanbanBoard`, favorite use-case quick actions
- **Modals:** `CreateTaskModal`, `DispatchModal`, `TaskDetailModal`, `ManageProfilesDialog`, `QuickActions`, delete confirmation
- **Views:** 20+ view components (agents, employees, specialists, missions, integrations, channels, skills, plugins, MCP, usage/cost, approvals, cron, logs, settings, chat, orchestrator, learning hub, tools playground, etc.)
- **UI:** shadcn (Button, Dialog, Tooltip, etc.), Lucide icons, custom empty states, undo toast, error boundary

### 1.5 Data Structures & Integrations

- **Tasks:** Kanban columns (backlog, in progress, review, done), filters, create/move/delete/dispatch
- **Agents:** List from gateway, start gateway, specialists suggestions
- **Profiles / Workspaces:** Multi-workspace, profile switcher, localStorage + URL sync
- **Gateway:** Status, connection state, events/min, start gateway, telemetry
- **Third-party:** OpenClaw gateway (REST/WS), community use cases/skills, plugins registry

---

## 2. Content Preservation Strategy

- **Copy:** All labels, titles, descriptions live in components and `NAV_ITEMS` / view titles; no CMS.
- **Media:** Favicon, no heavy image inventory in mission-control.
- **User flows:** Board (Kanban) → task detail / dispatch / create; Chat; Orchestrate; Agents/Employees/Specialists; Settings; Learning Hub; All Tools and sub-views. Preserve all navigation and actions.
- **Business logic:** Task CRUD, dispatch, gateway start, profile/workspace switching, polling, connection toasts, undo (Cmd+Z). Keep all API contracts and client behavior.
- **Design tokens (current):** OKLCH palette (primary ~260°, destructive, success, warning), `--radius`, `--gradient-*`, `--shadow-*`, `--mc-surface`, `--mc-glow`, `--font-display` (Space Grotesk), `--font-mono` (JetBrains Mono). Glass panels, grid pattern, glow effects already present.

---

## 3. Current Architecture Summary

- **Framework:** Next.js 16 App Router, React 19, single root layout and single page.
- **State:** Local + context (ProfileProvider, useTasks, usePolling, useGatewayTelemetry, useConnectionToast).
- **Styling:** Tailwind 4, `@theme inline` mapping CSS variables, extensive `globals.css` (glass, glow, animations, reduced-motion).
- **Fonts:** Space Grotesk (display), JetBrains Mono (mono), next/font.
- **Accessibility:** Skip-to-content, focus-visible, aria-live toasts, semantic structure.
- **Performance:** Dynamic imports per view, skeleton loaders, polling and gateway WS consideration.

---

## 4. Pain Points & Opportunities

| Area | Current | Opportunity |
|------|---------|-------------|
| **Animations** | CSS keyframes only | Framer Motion for layout, scroll, gestures, stagger, reduced-motion |
| **Typography** | Fixed font sizes | Fluid scale (clamp), larger hero-style headings, gradient text |
| **Glass** | Good base | Glassmorphism 2.0 (stronger blur, borders, z-depth) |
| **Layout** | Custom strips/sections | Bento grids for stats and feature blocks |
| **TypeScript** | strict: true | noUncheckedIndexedAccess, exactOptionalPropertyTypes, animation types |
| **3D / Immersive** | None | Optional R3F for hero or product-style sections |
| **Design tokens** | In globals.css | Centralized TypeScript tokens + CSS sync for design system docs |

---

## 5. Success Metrics (Targets)

- **FCP:** &lt; 1.8s  
- **LCP:** &lt; 2.5s  
- **CLS:** &lt; 0.1  
- **FID / INP:** &lt; 100ms  
- **TTI:** &lt; 3.5s  
- **Lighthouse:** 95+ (all categories)  
- **Accessibility:** WCAG 2.2 AAA (contrast 7:1, reduced motion, focus, semantics)  
- **Bundle:** Initial JS &lt; 150KB gzipped (monitor with Framer Motion and optional 3D)

---

## 6. Other Repo Surfaces (Reference)

- **openclaw/ui (control-ui):** Lit + Vite 7, 171+ TS files; views (usage, skills, sessions, config, chat, channels, agents, etc.). Separate codebase; design tokens could be shared via CSS/spec later.
- **openclaw (root):** Node/TS gateway, CLI, extensions; not in scope for this UI redesign.

---

## 7. Implementation Checklist (from Prompt)

- [x] Audit and document existing repository structure
- [ ] Create design system with all tokens and components
- [ ] Build TypeScript type definitions for design system and animations
- [ ] Implement core Framer Motion animation library
- [ ] Develop reusable component library (Storybook optional)
- [ ] Migrate all pages with content preservation
- [ ] Implement glassmorphism 2.0, optional 3D, futuristic aesthetics
- [ ] Add AI personalization and adaptive features (optional phase)
- [ ] Ensure WCAG 2.2 AAA compliance
- [ ] Optimize for Core Web Vitals
- [ ] Set up comprehensive testing suite
- [ ] Deploy with monitoring and analytics

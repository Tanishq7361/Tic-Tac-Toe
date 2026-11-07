# Project Plan

**Status**: Awaiting Integration
**Created**: 2026-11-07
**Mode**: AUGMENT

---

## 1. Project Overview

**Goal**: Upgrade Tic-Tac-Toe into a polished, responsive game hub with local AI and two-player play, undo and move history, persistent local statistics, a searchable game-history explorer, and configurable settings. The project is designed so that every module is independently testable.

**App Type**: SPA

**API Login**: No

**Mode**: AUGMENT

**Deployment Plan**: No deployment plan found

---

## 2. Frontend — Web App

| Component | Technology |
|-----------|-----------|
| **Language** | TypeScript |
| **Framework** | React with Vite |
| **Package Manager** | npm |
| **Test Runner** | Vitest |
| **Mocking Library** | vi.mock |
| **Test Command** | npm test |

Implementation notes: use React Router for the four client routes, Recharts for the statistics chart, and Framer Motion for restrained transitions that respect reduced-motion preferences.

---

## 3. Services Required

No Azure services or remote API are required. The application runs as a client-side SPA; game history and preferences are stored in browser local storage.

| Azure Service | Role in App | Environment Variable | Default Value (Local) | Classification |
|---------------|------------|---------------------|----------------------|----------------|
| None | No cloud service is needed for local play or persistence | — | — | — |

---

## 4. Prerequisites

### Run

| Tool | Service(s) | Installed | Version |
|------|------------|-----------|---------|
| Node.js | frontend | ✅ | v24.19.0 |
| npm | frontend | ✅ | 11.4.2 |

### Debug

| Tool | Service(s) | Installed | Version |
|------|------------|-----------|---------|
| Chrome | frontend | ✅ | 156.0.8078.80 |

---

## 6. Design System & UI

**Component Library**: Fluent UI v9
**Style Direction**: A premium, dark game cockpit with crisp, readable score panels, restrained glass-like elevations, rounded controls, and subtle motion. Electric violet anchors the interface while aqua highlights winning lines, active turns, and positive performance.
**Typography**: Inter, system-ui, -apple-system, "Segoe UI", sans-serif

### Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `primary` | `#7C5CFC` | New game and primary actions, selected navigation, and the active player mark |
| `accent` | `#35D6C1` | Winning-line highlights, positive statistics, and secondary game accents |
| `surface` | `#0B1020` | Main game-hub background |
| `text` | `#F4F5FC` | Board marks, match labels, and primary content |
| `muted` | `#9AA4BF` | Supporting descriptions, timestamps, and inactive controls |
| `border` | `#27314B` | Board-cell dividers, cards, and control boundaries |

### Pages

| Page | Route | Purpose | Layout |
|------|-------|---------|--------|
| Dashboard | `/` | Review play statistics, recent matches, and start or resume a game | `header + nav + hero + grid + main + footer` |
| Play | `/play` | Play local AI or two-player Tic-Tac-Toe with undo and a move timeline | `header + nav + main + tabs + two-column(main+sidebar) + actions` |
| Game History | `/history` | Search, filter, sort, and paginate locally saved matches | `header + nav + main + form + table + actions` |
| Settings | `/settings` | Configure local game mode, AI difficulty, mark, sound, and motion preferences | `header + nav + main + form + actions` |

### Sample Content

Dashboard — match statistics:
| Metric | Value | Context |
|--------|-------|---------|
| Games played | 48 | All completed matches |
| Player wins | 31 | Player used X in each recorded match |
| Draws | 8 | No winning line |
| Current streak | 3 wins | Consecutive player victories |

Dashboard — recent matches:
| Match | Opponent | Mode | Result |
|-------|----------|------|--------|
| Match #048 | Local AI | AI · X | X won |
| Match #047 | Maya Chen | Two players | Draw |
| Match #046 | Local AI | AI · O | O won |
| Match #045 | Leo Park | Two players | X won |

Play — Match #049, local AI, X to move:
| Move | Mark | Cell | Board state after move |
|------|------|------|------------------------|
| 1 | X | Top left | X · · / · · · / · · · |
| 2 | O | Top center | X O · / · · · / · · · |
| 3 | X | Center | X O · / · X · / · · · |
| 4 | O | Middle right | X O · / · X O / · · · |

Game History — completed matches:
| Match | Opponent | Mode | Result | Date |
|-------|----------|------|--------|------|
| Match #048 | Local AI | AI · X | X won | Nov 7, 2026 |
| Match #047 | Maya Chen | Two players | Draw | Nov 7, 2026 |
| Match #046 | Local AI | AI · O | O won | Nov 6, 2026 |
| Match #045 | Leo Park | Two players | X won | Nov 6, 2026 |

Settings — defaults: Game mode: Local AI · AI difficulty: Smart · Player mark: X · Sound effects: On · Motion effects: On

---

## 7. Project Structure

```text
.
├── README.md
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── public/
└── src/
    ├── app/
    │   ├── App.tsx
    │   ├── routes.tsx
    │   └── routes.test.tsx
    ├── components/
    │   ├── AppShell.tsx
    │   ├── GameBoard.tsx
    │   └── MoveTimeline.tsx
    ├── features/
    │   ├── dashboard/
    │   ├── game/
    │   │   └── game-engine.test.ts
    │   ├── history/
    │   └── settings/
    ├── hooks/
    ├── lib/
    │   ├── game-engine.ts
    │   └── storage.ts
    ├── models/
    ├── styles/
    └── test/
```

---

## 8. Route Definitions

Client-side navigation only; this project has no HTTP API.

| # | Method | Path | Description | Request Body | Response Body | Status Codes |
|---|--------|------|-------------|--------------|---------------|--------------|
| 1 | GET (client) | `/` | Dashboard and game statistics | — | Dashboard page | 200 |
| 2 | GET (client) | `/play` | Local AI and two-player game | — | Play page | 200 |
| 3 | GET (client) | `/history` | Searchable local game history | — | Game history page | 200 |
| 4 | GET (client) | `/settings` | Local game preferences | — | Settings page | 200 |

---

## 9. Next Steps

1. Run **azure-project-scaffold** to execute this plan
2. Run **azure-project-integrate** to wire the frontend to live data, smoke-test the backend, and create the migrations
3. Run **azure-debug-plan** → **azure-debug-generate** for Docker emulators and VS Code debugging
4. Run the **azure-deploy** agent when ready; it uses **azure-app-onboard** for architecture, cost estimation, IaC generation, provisioning, and health verification

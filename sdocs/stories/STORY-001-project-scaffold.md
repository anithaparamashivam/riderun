---
id: STORY-001
epic: EPIC-001
title: Project scaffold — React + Vite + Node.js + Express + MongoDB + Socket.io
status: done
priority: P0
prd: ../../prd.md
depends_on: []
created: 2026-05-12
completed: 2026-05-12
phase_log:
  red: done
  green: done
  refactor: done
  ui: n/a (no UI)
  a11y: n/a (no UI)
  docs: done
---

## User Story
As a developer, I want a bootable full-stack project scaffold so that every subsequent story has a working foundation to build on.

## Acceptance Criteria
- [ ] AC1: Given the repo is cloned, when `npm run dev` is run in the frontend directory, then the Vite dev server starts on port 5173 without errors
- [ ] AC2: Given the repo is cloned and `.env` is configured, when `npm run dev` is run in the backend directory, then the Express + Socket.io server starts on port 3001 without errors
- [ ] AC3: Given the backend is running, when Mongoose connects to `MONGODB_URI`, then the console logs "MongoDB connected" (or an explicit error — never silent)
- [ ] AC4: Given the frontend is running, when the app loads in a browser, then the Inter font is applied and the root `<App />` renders without a JS console error
- [ ] AC5: Given the frontend, when `npm run build` is executed, then it exits 0 with no type errors
- [ ] AC6: Given the project, when a provider seed script (`npm run seed`) is run, then at least one provider user document is inserted into MongoDB (manual onboarding workaround for v1)

## Technical Notes
- Files in scope: new files only (greenfield project)
- Project structure:
  ```
  /
  ├── client/          # React + Vite frontend
  │   ├── src/
  │   │   ├── main.tsx
  │   │   ├── App.tsx
  │   │   ├── contexts/AuthContext.tsx
  │   │   └── index.css
  │   ├── index.html
  │   ├── tailwind.config.ts
  │   ├── vite.config.ts
  │   └── package.json
  └── server/          # Node.js + Express backend
      ├── index.js
      ├── config/db.js
      ├── models/User.js
      ├── models/Request.js
      ├── routes/auth.js
      ├── middleware/authMiddleware.js
      ├── scripts/seed.js
      └── package.json
  ```
- Architecture refs: architecture-ref.md — Bootable App Requirements, Environment Variables
- Tailwind config must define all design-standard color tokens (primary, background, foreground, muted, destructive, border, ring) as CSS variables, with `.dark` class support
- `vite.config.ts` must proxy `/api` and `/socket.io` to `http://localhost:3001`
- Non-functional: no feature code, no auth — only the skeleton compiles and boots

## Test Approach
- Unit: none (scaffold only)
- Integration: verify Mongoose connection establishes in test environment using an in-memory MongoDB (mongodb-memory-server)
- E2E: not applicable at scaffold stage

## Out of Scope
- Any application features (auth, UI pages, real-time events)
- CI/CD pipeline configuration
- Production AWS deployment setup

## Design Standards
- Source: [SAM defaults] — architecture-ref.md Design Standards section
- Tailwind config: define custom theme with Inter, all color tokens, 4px base spacing
- Global CSS: import Inter via `index.html`, define CSS variables for light/dark themes

## Bootable App Requirements
- [ ] `client/index.html` has `<div id="root">` and loads Inter font from Google Fonts
- [ ] `client/src/main.tsx` mounts `<App />` wrapped in `<BrowserRouter>` and `<AuthProvider>`
- [ ] `client/tailwind.config.ts` defines custom color tokens, font-family: Inter
- [ ] `npm run build` (client) exits 0 with no TypeScript errors
- [ ] `npm run dev` (client) starts Vite at port 5173 without error
- [ ] `server/index.js` creates HTTP server, attaches Socket.io, starts listening on `PORT`
- [ ] `server/config/db.js` connects Mongoose; logs success or failure explicitly
- [ ] `npm run dev` (server) starts with nodemon without error
- [ ] `server/scripts/seed.js` inserts a test provider document; runnable via `npm run seed`

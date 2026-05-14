---
id: STORY-007
epic: EPIC-004
title: Provider can view their home screen and toggle availability
status: done
priority: P0
prd: ../../prd.md
depends_on: [STORY-003]
created: 2026-05-12
completed: 2026-05-12
phase_log:
  red: done
  green: done
  refactor: done
  ui: done (ProviderHome with navbar, status badge, toggle switch, loading/error states)
  a11y: done (aria-label on toggle, role=alert on error, h1, header landmark)
  docs: done
notes: Socket.io providers-online-room join/leave deferred to STORY-009 where matching logic uses it.
---

## User Story
As a service provider, I want to see my home screen and toggle my availability between online and offline so that I only receive requests when I am ready to work.

## Acceptance Criteria
- [ ] AC1: Given an authenticated provider, when they navigate to `/provider`, then they see their home screen with their name, current availability status, and an online/offline toggle
- [ ] AC2: Given the provider is offline, when they flip the toggle to online, then their `isOnline` field is updated to `true` in MongoDB and the UI reflects "Online" status
- [ ] AC3: Given the provider is online, when they flip the toggle to offline, then their `isOnline` field is updated to `false` in MongoDB and the UI reflects "Offline" status
- [ ] AC4: Given a non-provider (unauthenticated or passenger) accessing `/provider`, when the route loads, then they are redirected appropriately
- [ ] AC5: Given the availability toggle, when the PATCH request is in flight, then the toggle is disabled to prevent rapid double-flips
- [ ] AC6: Given a network error during toggle, when the update fails, then the toggle reverts to its previous state and shows an error toast

## Technical Notes
- Files in scope:
  - `client/src/pages/provider/Home.tsx`
  - `server/routes/providers.js` — PATCH `/api/providers/me/availability` (accepts `{ isOnline: boolean }`)
  - `server/models/User.js` — `isOnline` field already on schema
- Architecture refs: architecture-ref.md — Database schema (users.isOnline)
- Socket.io: when provider goes online, join a `providers-online` Socket.io room; when offline, leave it. Server uses this room for matching in STORY-009.

## Test Approach
- Unit: toggle component renders correct label ("Online"/"Offline") based on `isOnline` prop; disables during loading
- Integration: PATCH `/api/providers/me/availability` — `isOnline` field updated in DB; unauthenticated returns 401; non-provider returns 403
- E2E: not required

## Out of Scope
- Incoming request notifications and accept/decline (STORY-008)
- Earnings or trip history display
- Provider profile editing

## Design Standards
- Source: [SAM defaults]
- Provider home: top navbar with name + avatar + logout; large status indicator (green badge = Online, gray = Offline); toggle switch component with accessible label; disabled + loading state during update

---
id: STORY-009
epic: EPIC-005
title: Request matching — server notifies providers, assigns first accept, handles timeout
status: done
priority: P0
prd: ../../prd.md
depends_on: [STORY-005, STORY-006, STORY-008]
created: 2026-05-12
completed: 2026-05-13
phase_log:
  red: done
  green: done
  refactor: done
  ui: done (WaitingForProvider updated with unmatched state, retry button, socket listener)
  a11y: done (destructive color on unmatched card, aria-live preserved)
  docs: done
notes: |
  matchingService uses configurable timeout (DEFAULT_TIMEOUT_MS=60_000) with test injection for fast tests.
  jest.useFakeTimers() conflicts with Mongoose's connection pooling — use real timers with short injectable timeout instead.
---

## User Story
As the system, when a passenger submits a request I want to find an available provider, notify them, and assign the first one who accepts, so that the passenger is matched as quickly as possible.

## Acceptance Criteria
- [ ] AC1: Given a new request is created (POST `/api/requests`), when it is saved, then the server immediately emits a `provider:new-request` Socket.io event to all sockets in the `providers-online` room with the request details
- [ ] AC2: Given a `request:accept` event from a provider, when the request status is still `pending`, then the request is updated to `status: assigned, providerId: <acceptingProviderId>` in MongoDB and a `request:assigned` event is emitted to the passenger's socket
- [ ] AC3: Given a `request:accept` event from a provider, when the request is already `assigned` (another provider was faster), then the server emits nothing back and the late provider's accept is ignored
- [ ] AC4: Given a request in `pending` status, when 60 seconds elapse with no acceptance, then the request status is updated to `unmatched` and a `request:unmatched` event is emitted to the passenger's socket
- [ ] AC5: Given a `request:unmatched` event received by the passenger, when it renders on the waiting screen, then the passenger sees "No providers available right now. Please try again." with a "Try again" button that returns them to the home screen
- [ ] AC6: Given no providers are online when a request is submitted, when the request is created, then the 60-second timeout still starts (providers may come online within the window)

## Technical Notes
- Files in scope:
  - `server/socket/matchingService.js` — core matching logic: emit to room, listen for accept/decline, 60s timeout, update request document
  - `server/routes/requests.js` — POST handler calls `matchingService.startMatching(request)` after save
  - `server/socket/handlers.js` — wire `request:accept` and `request:decline` into matchingService
  - `client/src/pages/passenger/WaitingForProvider.tsx` — handle `request:assigned` (navigate to tracking) and `request:unmatched` (show error + retry)
- Architecture refs: architecture-ref.md — Real-Time Events table, Socket.io section
- Passenger socket association: on Socket.io connect, authenticate JWT and store `userId → socketId` mapping in memory (Map); use this to target the passenger's socket for `request:assigned` / `request:unmatched`
- 60-second timeout: use `setTimeout` in `matchingService`; clear it on first accept
- Race condition guard: use MongoDB `findOneAndUpdate` with `{ status: 'pending' }` filter to atomically claim the request on accept

## Test Approach
- Unit: `matchingService` — test accept arrives before timeout (→ assigned); test timeout fires (→ unmatched); test late accept after already-assigned (→ ignored); test race where two accepts arrive simultaneously (only one wins)
- Integration: full Socket.io test — create request, connect online provider socket, verify `provider:new-request` received, emit `request:accept`, verify MongoDB status = assigned, verify passenger socket receives `request:assigned`
- E2E: not required

## Out of Scope
- Geographic proximity sorting of providers (first-available used in v1)
- Multi-round retry (single 60s window; user manually retries)
- Admin override of assignment

## Design Standards
- Source: [SAM defaults]
- Waiting screen unmatched state: destructive-colored message card, "Try again" primary button, no spinner (request is concluded)

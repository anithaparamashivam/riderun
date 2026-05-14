---
id: STORY-010
epic: EPIC-006
title: Provider broadcasts live location via Socket.io after accepting a request
status: done
priority: P0
prd: ../../prd.md
depends_on: [STORY-009]
created: 2026-05-12
completed: 2026-05-13
phase_log:
  red: done
  green: done
  refactor: done
  ui: done (ActiveRequest mounts useProviderLocation hook; permission-denied warning rendered)
  a11y: done (role="alert" on denied warning)
  docs: done
---

## User Story
As a service provider who has accepted a request, I want my device location to be sent to the passenger in real time so that they can track my progress.

## Acceptance Criteria
- [ ] AC1: Given a provider whose request status becomes `assigned`, when the active request view loads, then the browser requests Geolocation permission
- [ ] AC2: Given Geolocation permission granted, when the provider's position is obtained, then a `location:update` Socket.io event is emitted to the server with `{ requestId, lat, lng }` at most every 5 seconds
- [ ] AC3: Given a `location:update` event on the server, when it is received from the assigned provider, then the server relays it to the passenger's socket as `location:update` with `{ lat, lng }`
- [ ] AC4: Given Geolocation permission denied, when the provider's active request view loads, then the provider sees an inline warning "Location access required for tracking" with instructions to enable it; no crash
- [ ] AC5: Given the provider marks the request complete (STORY-012), when the completion event fires, then location broadcasting stops (interval cleared, no further `location:update` events sent)
- [ ] AC6: Given the provider navigates away or disconnects, when their socket disconnects, then location broadcasting stops and no stale events are relayed

## Technical Notes
- Files in scope:
  - `client/src/hooks/useProviderLocation.ts` — encapsulates `navigator.geolocation.watchPosition`; emits `location:update` via socket; cleans up on unmount
  - `client/src/pages/provider/ActiveRequest.tsx` — mounts `useProviderLocation` when `isActive` is true
  - `server/socket/locationRelay.js` — on `location:update` from provider socket, validate `requestId` and relay to assigned passenger socket
- Architecture refs: architecture-ref.md — Real-Time Events table, Google Maps API Usage (Browser Geolocation is free, no Maps API call)
- Throttle: use `setInterval` (5s) in `useProviderLocation`, not `watchPosition` alone, to respect the ≤ 5s NFR without flooding
- Server relay: verify the emitting socket is the assigned provider for the `requestId` before relaying (security: reject spoofed relays)
- Non-functional: location data not written to MongoDB — relay-only (per architecture-ref.md Risk Flags #5)

## Test Approach
- Unit: `useProviderLocation` hook — with mocked `navigator.geolocation` and fake timers, verify events emitted at ≤5s intervals; verify cleanup on unmount stops emissions
- Integration: Socket.io test — provider socket emits `location:update`; verify passenger socket receives relayed event; verify unauthorized provider for a different request cannot relay
- E2E: not required

## Out of Scope
- Storing location history in MongoDB (relay-only per architecture-ref.md)
- Passenger location sharing
- Route polyline calculation (STORY-011 shows position only)

## Design Standards
- Source: [SAM defaults]
- Active request view: minimal UI — request summary card at top, geolocation status indicator, "Mark Complete" button (disabled placeholder until STORY-012); permission-denied warning uses `destructive` color token

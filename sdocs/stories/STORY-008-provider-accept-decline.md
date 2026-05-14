---
id: STORY-008
epic: EPIC-004
title: Provider receives request notification and can accept or decline
status: done
priority: P0
prd: ../../prd.md
depends_on: [STORY-007]
created: 2026-05-12
completed: 2026-05-13
phase_log:
  red: done
  green: done
  refactor: done
  ui: done (RequestAlert with countdown, type badge, accept/decline; ActiveRequest placeholder)
  a11y: done (role=dialog, aria-modal, focus ring, keyboard accessible buttons)
  docs: done
---

## User Story
As an online service provider, I want to receive an alert when a new request is available and choose to accept or decline it so that I only take on work I can fulfill.

## Acceptance Criteria
- [ ] AC1: Given an online provider, when a new request is dispatched to them via Socket.io (`provider:new-request` event), then a request alert appears on their screen showing: service type (Ride/Errand), relevant details (pickup+destination or shop+items), and Accept / Decline buttons
- [ ] AC2: Given the request alert, when the provider clicks "Accept", then a `request:accept` Socket.io event is emitted to the server with the `requestId`
- [ ] AC3: Given the request alert, when the provider clicks "Decline", then a `request:decline` Socket.io event is emitted and the alert is dismissed
- [ ] AC4: Given the provider has accepted, when the server confirms assignment, then the UI transitions to the active request view (showing request details and a "Mark Complete" button placeholder for STORY-012)
- [ ] AC5: Given the request alert is shown, when 30 seconds elapse without action, then the alert auto-dismisses (treated as a decline)
- [ ] AC6: Given the provider is offline, when a request event is received (e.g., connectivity edge case), then the alert is not shown and the event is silently ignored

## Technical Notes
- Files in scope:
  - `client/src/pages/provider/Home.tsx` — extend to handle `provider:new-request` socket event
  - `client/src/components/RequestAlert.tsx` — modal/overlay with request details and Accept/Decline actions
  - `client/src/pages/provider/ActiveRequest.tsx` — placeholder view shown after accept (Mark Complete implemented in STORY-012)
  - `server/socket/handlers.js` — listen for `request:accept` and `request:decline` events; matching logic deferred to STORY-009
- Architecture refs: architecture-ref.md — Real-Time Events table, Socket.io section
- Socket.io: provider must be in the `providers-online` room (joined in STORY-007) to receive the event
- 30-second auto-dismiss: client-side timer on the `RequestAlert` component

## Test Approach
- Unit: `RequestAlert` renders correct details for ride vs errand type; auto-dismiss timer fires after 30s (fake timers); disabled state during accept/decline in-flight
- Integration: Socket.io test — emit `provider:new-request` to a connected provider socket; verify `request:accept` handler records acceptance; verify `request:decline` handler records decline
- E2E: not required

## Out of Scope
- Request matching / assignment logic (STORY-009)
- Location broadcasting (STORY-010)
- Mark Complete button functionality (STORY-012)

## Design Standards
- Source: [SAM defaults]
- `RequestAlert`: full-screen modal overlay; service type badge (color-coded Ride vs Errand); detail rows; countdown timer visual; large Accept (primary) and Decline (ghost) buttons; keyboard accessible (focus trapped in modal)

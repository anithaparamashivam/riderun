---
id: STORY-012
epic: EPIC-007
title: Provider marks request complete; passenger is notified and tracking ends
status: done
priority: P0
prd: ../../prd.md
depends_on: [STORY-011]
created: 2026-05-12
completed: 2026-05-13
phase_log:
  red: done
  green: done
  refactor: done
  ui: done (provider and passenger ServiceComplete screens; ActiveRequest Mark Complete wired)
  a11y: done (success icon aria-hidden, role="alert" preserved for location errors)
  docs: done
---

## User Story
As a service provider who has fulfilled a request, I want to mark it as complete so that the passenger is notified, tracking stops, and both parties see a completion confirmation.

## Acceptance Criteria
- [ ] AC1: Given the provider's active request view, when the provider clicks "Mark Complete", then a `request:completed` Socket.io event is emitted to the server with `{ requestId }`
- [ ] AC2: Given a `request:completed` event on the server, when received from the assigned provider, then the request status is updated to `completed` in MongoDB and `updatedAt` is set to now
- [ ] AC3: Given the request is marked complete, when the server processes it, then a `request:completed` event is relayed to the passenger's socket
- [ ] AC4: Given a `request:completed` event received by the passenger, when the tracking view handles it, then the map tracking stops (no further `location:update` events are processed) and the view transitions to a "Service Complete" screen
- [ ] AC5: Given the "Service Complete" screen, when it renders, then the passenger sees: "Your service is complete", the service type and summary, and a "Back to Home" button that returns them to the passenger home screen
- [ ] AC6: Given the provider clicks "Mark Complete", when the button is clicked, then it shows a loading state and is disabled until the server acknowledgement is received
- [ ] AC7: Given the provider marks complete, when completion is confirmed, then the provider's active request view transitions to a "Service Complete" screen with a "Back to Home" button

## Technical Notes
- Files in scope:
  - `client/src/pages/provider/ActiveRequest.tsx` — enable "Mark Complete" button (was placeholder in STORY-010); handle completion confirmation and navigate to completion screen
  - `client/src/pages/provider/ServiceComplete.tsx` — provider completion screen
  - `client/src/pages/passenger/Tracking.tsx` — handle `request:completed` event; stop processing `location:update`; navigate to passenger completion screen
  - `client/src/pages/passenger/ServiceComplete.tsx` — passenger completion screen
  - `server/socket/handlers.js` — handle `request:completed` event: update MongoDB, relay to passenger socket
- Architecture refs: architecture-ref.md — Real-Time Events table (`request:completed` bidirectional), Database schema (request.status = 'completed')
- Location broadcast stop (provider): `useProviderLocation` hook cleanup should be triggered on completion; unmounting `ActiveRequest` achieves this if navigation is immediate
- Security: server must verify the emitting socket is the assigned provider for the `requestId` before updating status or relaying

## Test Approach
- Unit: `ActiveRequest` — "Mark Complete" button disabled during in-flight emit; enabled when no active request; navigates to completion screen on server ack
- Integration: Socket.io test — provider socket emits `request:completed`; verify MongoDB status = 'completed'; verify passenger socket receives `request:completed` event; verify unauthorized socket cannot complete the request
- E2E: not required

## Out of Scope
- Passenger confirmation of completion (provider marks done unilaterally in v1 per architecture-ref.md)
- Post-completion ratings or reviews (non-goal)
- In-app payment collection (cash on delivery, non-goal)
- Request history list (deferred to v2)

## Design Standards
- Source: [SAM defaults]
- Provider `ServiceComplete` screen: centered success icon (green checkmark), "Service Complete" heading, request summary, "Back to Home" primary button
- Passenger `ServiceComplete` screen: identical layout; heading "Your service is complete — thank you!"; "Back to Home" button navigates to `/passenger`

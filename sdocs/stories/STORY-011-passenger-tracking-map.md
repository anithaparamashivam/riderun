---
id: STORY-011
epic: EPIC-006
title: Passenger sees provider's live location on Google Maps tracking view
status: done
priority: P0
prd: ../../prd.md
depends_on: [STORY-010]
created: 2026-05-12
completed: 2026-05-13
phase_log:
  red: done
  green: done
  refactor: done
  ui: done (TrackingMap with spinner overlay; request summary card fixed at bottom)
  a11y: done (role="application", aria-label, aria-live="polite" on loading overlay)
  docs: done
---

## User Story
As a passenger whose request has been accepted, I want to see the provider's live location on a map so that I know where they are and how close they are.

## Acceptance Criteria
- [ ] AC1: Given a `request:assigned` Socket.io event received on the waiting screen, when it fires, then the passenger is automatically navigated to the tracking view
- [ ] AC2: Given the tracking view, when it loads, then a Google Maps instance is displayed centered on Chennai
- [ ] AC3: Given a `location:update` Socket.io event, when the passenger receives it, then a marker on the Google Maps instance moves to the new `{ lat, lng }` position; the map re-centers if the marker moves outside the visible area
- [ ] AC4: Given no `location:update` has been received yet, when the tracking view first loads, then the map shows a spinner overlay with "Waiting for provider's location…" until the first update arrives
- [ ] AC5: Given the tracking view, when it renders, then the passenger can see the request type and a brief summary (e.g., "Ride to [destination]" or "Errand at [shop]")
- [ ] AC6: Given a `request:completed` event received by the passenger, when it fires, then the tracking view transitions to a completion screen (implemented in STORY-012)

## Technical Notes
- Files in scope:
  - `client/src/pages/passenger/Tracking.tsx` — subscribes to `location:update` socket events; renders `TrackingMap`
  - `client/src/components/TrackingMap.tsx` — wraps `@react-google-maps/api` `<GoogleMap>` with a controlled `<Marker>` for provider position
  - `client/src/pages/passenger/WaitingForProvider.tsx` — on `request:assigned` event, navigate to `/passenger/tracking/:requestId`
- Architecture refs: architecture-ref.md — Google Maps API Usage (Maps JavaScript API), Design Standards (map container dimensions: `h-64` mobile, `h-96` desktop)
- Google Maps API key: load from `VITE_GOOGLE_MAPS_API_KEY`; use `@googlemaps/js-api-loader` or the `@react-google-maps/api` `<LoadScript>` wrapper
- Marker: use a distinct colored custom icon (e.g., blue pin) to differentiate from default red pin
- Non-functional: map must be responsive; WCAG — map container has `role="application"` and `aria-label="Provider tracking map"`

## Test Approach
- Unit: `TrackingMap` — given a `position` prop update, verify `Marker` position prop changes; mock `@react-google-maps/api` to avoid live API calls in tests
- Integration: Socket.io test — emit `location:update` from provider socket; verify passenger tracking component updates marker coordinates
- E2E: not required (Google Maps is third-party)

## Out of Scope
- Route polyline from provider to destination (v1 shows position pin only)
- ETA estimation
- Passenger location on map
- Satellite or street view

## Design Standards
- Source: [SAM defaults]
- Tracking view: full-width map (responsive height); request summary card overlaid at bottom (`fixed bottom-0`); provider marker with custom blue icon; loading overlay with `aria-live="polite"` spinner while awaiting first location event

---
id: STORY-005
epic: EPIC-003
title: Passenger can submit a ride request
status: done
priority: P0
prd: ../../prd.md
depends_on: [STORY-004]
created: 2026-05-12
completed: 2026-05-12
phase_log:
  red: done
  green: done
  refactor: done
  ui: done (RideRequest.tsx — labeled inputs, hidden test lat/lng inputs, validation error, loading button; WaitingForProvider.tsx — spinner, aria-live)
  a11y: done (aria-live polite on waiting screen, role=alert on errors, labeled inputs, form aria-label)
  docs: done
---

## User Story
As a passenger, I want to enter a pickup location and a destination and submit a ride request so that a service provider can transport me.

## Acceptance Criteria
- [ ] AC1: Given the ride request form, when the passenger enters a pickup location and destination, then both inputs use Google Maps Places Autocomplete restricted to Chennai
- [ ] AC2: Given both locations are filled, when the passenger submits the form, then the system validates both addresses are within Chennai bounds; if either is outside Chennai, an inline error is shown and submission is blocked
- [ ] AC3: Given valid Chennai locations, when the passenger submits the form, then a Request document is created in MongoDB with `{ type: 'ride', status: 'pending', passengerId, pickupLocation, destination }`
- [ ] AC4: Given a successful submission, when the request is created, then the passenger is navigated to a "Waiting for provider" screen showing a spinner and the message "Looking for a provider…"
- [ ] AC5: Given the form, when submission is in progress, then the submit button shows a loading state and is disabled to prevent duplicate submissions
- [ ] AC6: Given a network error during submission, when the request fails, then an inline error message is shown with a retry option

## Technical Notes
- Files in scope:
  - `client/src/pages/passenger/RideRequest.tsx`
  - `client/src/pages/passenger/WaitingForProvider.tsx` — shared waiting screen (also used by STORY-006)
  - `server/routes/requests.js` — POST `/api/requests` (creates request document)
  - `server/models/Request.js` — Request mongoose schema
- Architecture refs: architecture-ref.md — Database schema (requests collection), Google Maps API Usage (Geocoding API for Chennai validation)
- Chennai bounds for geocoding validation: approx. `{ north: 13.23, south: 12.82, east: 80.34, west: 79.97 }`
- Google Maps Places Autocomplete: restrict to `componentRestrictions: { country: 'in' }` + bounds bias to Chennai
- Non-functional: form submission POST must respond within p95 < 500ms

## Test Approach
- Unit: Chennai bounds validation function — test addresses inside/outside bounds, edge cases
- Integration: POST `/api/requests` — valid ride request creates document with correct fields; invalid payload returns 400; unauthenticated returns 401
- E2E: not required (autocomplete is Google-hosted)

## Out of Scope
- Fare estimation (non-goal)
- Multiple stops (non-goal)
- Scheduled bookings (non-goal)
- Provider matching (STORY-009)

## Design Standards
- Source: [SAM defaults]
- Form: two labeled inputs with Places Autocomplete, primary-colored submit button, inline error states below each field, loading state on button during submission
- Waiting screen: centered spinner, "Looking for a provider…" text, accessible loading announcement via `aria-live="polite"`

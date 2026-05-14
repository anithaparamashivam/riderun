---
id: STORY-006
epic: EPIC-003
title: Passenger can submit an errand request
status: done
priority: P0
prd: ../../prd.md
depends_on: [STORY-004]
created: 2026-05-12
completed: 2026-05-12
phase_log:
  red: done (errand route was incorrectly requiring pickupLocation; 3 new errand tests failed)
  green: done (fixed requests.js to branch on type; created ErrandRequest.tsx)
  refactor: done
  ui: done (shop name input, item list textarea, inline validation, loading state)
  a11y: done (labeled inputs, role=alert on errors, h1)
  docs: done
---

## User Story
As a passenger, I want to specify a shop name and a list of items and submit an errand request so that a service provider can collect the items on my behalf.

## Acceptance Criteria
- [ ] AC1: Given the errand request form, when the passenger enters a shop name and item list, then both fields accept free text
- [ ] AC2: Given the form, when the passenger leaves either field empty and tries to submit, then an inline validation error is shown and submission is blocked
- [ ] AC3: Given both fields filled, when the passenger submits, then a Request document is created in MongoDB with `{ type: 'errand', status: 'pending', passengerId, shopName, itemList }`
- [ ] AC4: Given a successful submission, when the request is created, then the passenger is navigated to the shared "Waiting for provider" screen
- [ ] AC5: Given the form, when submission is in progress, then the submit button shows a loading state and is disabled
- [ ] AC6: Given a network error during submission, when the request fails, then an inline error message is shown with a retry option

## Technical Notes
- Files in scope:
  - `client/src/pages/passenger/ErrandRequest.tsx`
  - `client/src/pages/passenger/WaitingForProvider.tsx` — shared with STORY-005 (already created)
  - `server/routes/requests.js` — POST `/api/requests` (same endpoint as STORY-005, type field differentiates)
  - `server/models/Request.js` — already created in STORY-005; no schema changes needed
- Architecture refs: architecture-ref.md — Database schema (requests collection)
- Item list: single `<textarea>` with placeholder "e.g. 2x milk, 1x bread" — no structured parsing in v1
- Non-functional: same p95 < 500ms target as ride request

## Test Approach
- Unit: form validation — empty shop name blocked, empty item list blocked, both filled allows submit
- Integration: POST `/api/requests` with `type: errand` — document created with correct fields; missing shopName or itemList returns 400
- E2E: not required

## Out of Scope
- Structured item catalog (plain text only per PRD)
- Item quantity parsing or totals
- Multiple shops per errand (non-goal)
- Provider matching (STORY-009)

## Design Standards
- Source: [SAM defaults]
- Form: shop name text input + item list textarea (min 3 rows), inline error states, primary submit button with loading state

---
id: EPIC-003
title: Passenger Request Submission
status: planned
prd: ../../prd.md
prd_sections: ["Functional Requirements - Service type selection", "Functional Requirements - Ride request", "Functional Requirements - Errand request"]
depends_on: [EPIC-002]
created: 2026-05-12
---

## Description
Everything a passenger sees and does before a provider accepts their request: the home screen with service type selection, the ride request form (pickup + destination with Chennai validation), and the errand request form (shop name + item list). Ends at the "waiting for provider" state.

## Stories
- STORY-004 — Passenger sees home screen with service type selection
- STORY-005 — Passenger can submit a ride request
- STORY-006 — Passenger can submit an errand request

## Out of Scope
- Provider matching logic (EPIC-005)
- Real-time tracking (EPIC-006)
- Scheduled bookings (non-goal)
- Multiple stops (non-goal)

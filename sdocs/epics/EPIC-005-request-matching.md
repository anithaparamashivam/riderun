---
id: EPIC-005
title: Request Matching Engine
status: planned
prd: ../../prd.md
prd_sections: ["Functional Requirements - Request submission and matching"]
depends_on: [EPIC-003, EPIC-004]
created: 2026-05-12
---

## Description
The server-side engine that bridges passenger requests to available providers. When a request is submitted, the engine notifies online providers in sequence via Socket.io; the first accept wins. Includes a 60-second timeout → unmatched fallback (resolved from Open Question #3).

## Stories
- STORY-009 — Request matching: server notifies providers, assigns first accept, handles timeout

## Out of Scope
- Fare calculation or ETA estimation (non-goal)
- Geographic proximity ordering (v1 uses first-available; proximity ordering deferred)
- Admin override of assignments (deferred)

---
id: EPIC-006
title: Real-Time Tracking
status: planned
prd: ../../prd.md
prd_sections: ["Functional Requirements - Real-time tracking"]
depends_on: [EPIC-005]
created: 2026-05-12
---

## Description
After a provider accepts a request, two things happen in parallel: the provider's browser begins broadcasting GPS coordinates via Socket.io, and the passenger's view transitions to a Google Maps tracking screen that updates the provider's marker in real time (≤ 5-second interval per PRD NFR).

## Stories
- STORY-010 — Provider broadcasts live location via Socket.io after accepting a request
- STORY-011 — Passenger sees provider's live location on Google Maps tracking view

## Out of Scope
- Route polyline rendering (v1 shows pin position only)
- ETA calculation
- Location history persistence (relay-only per architecture-ref.md)

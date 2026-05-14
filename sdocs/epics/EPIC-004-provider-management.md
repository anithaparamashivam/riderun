---
id: EPIC-004
title: Provider Management
status: planned
prd: ../../prd.md
prd_sections: ["Functional Requirements - Provider availability toggle", "Functional Requirements - Provider request notifications"]
depends_on: [EPIC-002]
created: 2026-05-12
---

## Description
Everything a service provider sees and does: their home screen, the online/offline availability toggle, receiving incoming request alerts via Socket.io, and accepting or declining each request.

## Stories
- STORY-007 — Provider can view their home screen and toggle availability
- STORY-008 — Provider receives request notification and can accept or decline

## Out of Scope
- Provider onboarding/self-registration (manual seed in v1 per architecture-ref.md)
- Ratings or earnings history (non-goal)
- Active request tracking view (EPIC-006, EPIC-007)

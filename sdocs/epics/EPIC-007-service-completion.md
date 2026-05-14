---
id: EPIC-007
title: Service Completion
status: planned
prd: ../../prd.md
prd_sections: ["Functional Requirements - Service completion"]
depends_on: [EPIC-006]
created: 2026-05-12
---

## Description
Closes the service loop: the provider marks the request complete, the system updates the request status in MongoDB, broadcasts a completion event to the passenger, stops location broadcasting, and shows both parties a "service complete" confirmation.

## Stories
- STORY-012 — Provider marks request complete; passenger is notified and tracking ends

## Out of Scope
- Passenger confirmation of completion (provider marks done unilaterally in v1 per architecture-ref.md)
- In-app payment collection (cash on delivery, non-goal)
- Ratings or reviews post-completion (non-goal)

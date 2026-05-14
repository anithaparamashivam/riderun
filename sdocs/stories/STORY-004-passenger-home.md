---
id: STORY-004
epic: EPIC-003
title: Passenger sees home screen with service type selection
status: done
priority: P0
prd: ../../prd.md
depends_on: [STORY-003]
created: 2026-05-12
completed: 2026-05-12
phase_log:
  red: done
  green: done
  refactor: done (replaced non-idiomatic function-as-hook with clean PassengerRoute/ProviderRoute components)
  ui: done (PassengerHome with navbar, two ServiceCards; ServiceCard reusable component)
  a11y: done (aria-label on ServiceCard button, h1 heading, header landmark)
  docs: done
---

## User Story
As a passenger, I want to see my home screen with two service options — Ride and Errand — so that I can choose the type of service I need.

## Acceptance Criteria
- [ ] AC1: Given an authenticated passenger, when they navigate to `/passenger`, then they see a home screen with two service cards: "Ride" and "Errand"
- [ ] AC2: Given the passenger home screen, when the user clicks "Ride", then they are navigated to the ride request form
- [ ] AC3: Given the passenger home screen, when the user clicks "Errand", then they are navigated to the errand request form
- [ ] AC4: Given the passenger home screen, when a non-passenger (unauthenticated or provider) accesses `/passenger`, then they are redirected appropriately (login page or provider home)
- [ ] AC5: Given the home screen, when it renders, then a logout option is accessible in the navigation

## Technical Notes
- Files in scope:
  - `client/src/pages/passenger/Home.tsx`
  - `client/src/components/ServiceCard.tsx` — reusable card component used by both options
  - `client/src/App.tsx` — route `/passenger` maps to `PassengerHome`; role guard applied
- Architecture refs: architecture-ref.md — Design Standards (card component, responsive layout)
- Non-functional: page load must show content immediately (no async fetch required on this screen)

## Test Approach
- Unit: `ServiceCard` renders label, icon, and fires `onClick` correctly
- Integration: role guard redirects unauthenticated users to `/login` and providers to `/provider`
- E2E: not required

## Out of Scope
- Request history or past rides list (deferred to v2)
- Notifications or alerts on the home screen (EPIC-005 adds waiting-state redirect)

## Design Standards
- Source: [SAM defaults]
- Home screen: centered layout, two equally-sized `ServiceCard` components side by side (stacked on mobile), each with an icon, title, and short description; hover + focus states on cards; top navbar with user avatar and logout link

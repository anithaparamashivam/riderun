---
id: STORY-003
epic: EPIC-002
title: New user selects a role on first login
status: done
priority: P0
prd: ../../prd.md
depends_on: [STORY-002]
created: 2026-05-12
completed: 2026-05-12
phase_log:
  red: done
  green: done
  refactor: done
  ui: done (RoleSelection.tsx — two card options, disabled confirm, loading state, error display)
  a11y: done (main landmark, h1, aria-pressed on cards, role=alert on error)
  docs: done
---

## User Story
As a first-time user who has completed Google sign-in, I want to choose whether I am a passenger or a service provider so that the app shows me the correct experience.

## Acceptance Criteria
- [ ] AC1: Given a user with `role: null` after OAuth, when they are redirected post-login, then they land on the role selection screen before any other page
- [ ] AC2: Given the role selection screen, when the user selects "Passenger" and confirms, then their role is updated to `passenger` in MongoDB and they are redirected to the passenger home screen
- [ ] AC3: Given the role selection screen, when the user selects "Service Provider" and confirms, then their role is updated to `provider` in MongoDB and they are redirected to the provider home screen
- [ ] AC4: Given a user with `role: passenger`, when they log in again, then they skip role selection and go directly to the passenger home screen
- [ ] AC5: Given a user with `role: provider`, when they log in again, then they skip role selection and go directly to the provider home screen
- [ ] AC6: Given the role selection screen, when neither option is selected and the user tries to confirm, then the confirm button remains disabled

## Technical Notes
- Files in scope:
  - `server/routes/users.js` — PATCH `/api/users/me/role` (accepts `{ role: 'passenger' | 'provider' }`)
  - `client/src/pages/RoleSelection.tsx`
  - `client/src/App.tsx` — update routing guard: if `user.role === null` redirect to `/role-selection`
  - `client/src/contexts/AuthContext.tsx` — refresh user after role update
- Architecture refs: architecture-ref.md — Database schema (users collection, role field)
- Route guard logic: `<ProtectedRoute>` component should check `role` after `loading` resolves; `null` role → `/role-selection`; `passenger` → `/passenger`; `provider` → `/provider`

## Test Approach
- Unit: routing guard logic — given each role state (null / passenger / provider), assert correct redirect
- Integration: PATCH `/api/users/me/role` — verify role updated in DB, invalid role values rejected with 400
- E2E: not required at this stage

## Out of Scope
- Ability to change role after first selection (deferred to v2)
- Provider verification during role selection (manual seed in v1)

## Design Standards
- Source: [SAM defaults]
- Role selection screen: two large card options (Passenger / Service Provider) with icons and brief descriptions; selected card has a `primary`-colored border; confirm button disabled until a selection is made

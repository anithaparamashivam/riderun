---
id: STORY-002
epic: EPIC-002
title: User can sign in with Google OAuth
status: done
priority: P0
prd: ../../prd.md
depends_on: [STORY-001]
created: 2026-05-12
completed: 2026-05-12
phase_log:
  red: done (server tests; client Login.test.tsx failed before Login.tsx existed)
  green: done
  refactor: done
  ui: done (Login.tsx — centered card, Google SVG logo, focus ring)
  a11y: done (main landmark, h1 heading, aria-hidden on SVG)
  docs: done
---

## User Story
As a new or returning user (passenger or provider), I want to sign in with my Google account so that I can access the app without creating a separate username and password.

## Acceptance Criteria
- [ ] AC1: Given the login page, when a user clicks "Sign in with Google", then they are redirected to Google's OAuth consent screen
- [ ] AC2: Given the OAuth consent screen, when the user grants permission, then they are redirected back to the app and a JWT is issued in an `httpOnly` cookie
- [ ] AC3: Given a valid JWT cookie, when a protected API endpoint is called, then the server returns the user's profile (id, name, email, picture, role)
- [ ] AC4: Given a user who has never signed in before, when OAuth completes, then their user document is created in MongoDB with `role: null`
- [ ] AC5: Given a user who already has an account, when OAuth completes, then their existing document is returned (no duplicate created)
- [ ] AC6: Given a user with a valid session, when they visit `/logout`, then the JWT cookie is cleared and they are redirected to the login page
- [ ] AC7: Given an expired or missing JWT, when a protected route is accessed, then the API returns 401

## Technical Notes
- Files in scope:
  - `server/routes/auth.js` — GET `/api/auth/google`, GET `/api/auth/google/callback`, GET `/api/auth/logout`, GET `/api/auth/me`
  - `server/middleware/authMiddleware.js` — JWT verification middleware
  - `server/models/User.js` — upsert on `googleId`
  - `client/src/pages/Login.tsx` — "Sign in with Google" button
  - `client/src/contexts/AuthContext.tsx` — fetch `/api/auth/me` on mount; expose `user`, `loading`, `logout()`
- Architecture refs: architecture-ref.md — Authentication (Passport.js + google-oauth20 + JWT httpOnly cookie)
- JWT payload: `{ userId, role }`; sign with `JWT_SECRET`; expiry 7 days
- CORS: backend must allow `CLIENT_URL` with credentials
- Non-functional: HTTPS required in production; `httpOnly` + `secure` + `sameSite: lax` cookie flags

## Test Approach
- Unit: `authMiddleware.js` — test valid JWT passes, expired JWT returns 401, missing token returns 401
- Integration: mock Passport Google strategy (stub callback with test user profile); verify user upsert logic, JWT issuance, duplicate prevention
- E2E: not required (OAuth flow is Google-hosted; mock in integration)

## Out of Scope
- Role selection (STORY-003)
- Email/password auth
- Social login beyond Google
- Admin user creation

## Design Standards
- Source: [SAM defaults]
- Login page: centered card, Inter font, primary-colored "Sign in with Google" button with Google's logo icon, loading state during OAuth redirect, focus ring on button

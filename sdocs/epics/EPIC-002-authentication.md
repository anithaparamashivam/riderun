---
id: EPIC-002
title: Authentication & User Roles
status: planned
prd: ../../prd.md
prd_sections: ["Functional Requirements - Authentication"]
depends_on: [EPIC-001]
created: 2026-05-12
---

## Description
Handles the full identity layer: Google OAuth sign-in for both passengers and providers, JWT session issuance, and the one-time role selection screen that determines which app view a new user enters.

## Stories
- STORY-002 — User can sign in with Google OAuth
- STORY-003 — New user selects a role (passenger or provider) on first login

## Out of Scope
- Email/password auth (Google OAuth only per PRD)
- Admin user type (deferred, Open Question #4)
- Provider verification/document upload (deferred to v2)

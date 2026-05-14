---
id: EPIC-001
title: Project Scaffold & Foundation
status: planned
prd: ../../prd.md
prd_sections: ["Technical Constraints"]
depends_on: []
created: 2026-05-12
---

## Description
Sets up the full monorepo / dual-package project structure: React + Vite frontend and Node.js + Express backend, wired together with Tailwind, Socket.io, Mongoose, and all environment configuration. This epic produces a bootable app with no features — the foundation every other epic builds on.

## Stories
- STORY-001 — Project scaffold: React + Vite + Node.js + Express + MongoDB + Socket.io

## Out of Scope
- Any application features (auth, requests, tracking)
- Database seeding beyond a seed script placeholder

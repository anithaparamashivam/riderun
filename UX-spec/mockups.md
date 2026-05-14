# UX Mockups — Transportation & Errand Service App
**Version:** 0.1 | **Date:** 2026-05-12 | **Status:** Draft

All screens are responsive web. Mobile-first layout shown (375px). Desktop notes included per screen.

---

## Screen Index

1. [Login](#1-login)
2. [Role Selection](#2-role-selection)
3. [Passenger — Home](#3-passenger--home)
4. [Passenger — Ride Request](#4-passenger--ride-request)
5. [Passenger — Errand Request](#5-passenger--errand-request)
6. [Passenger — Waiting for Provider](#6-passenger--waiting-for-provider)
7. [Passenger — Live Tracking](#7-passenger--live-tracking)
8. [Passenger — Service Complete](#8-passenger--service-complete)
9. [Provider — Home & Availability](#9-provider--home--availability)
10. [Provider — Incoming Request Alert](#10-provider--incoming-request-alert)
11. [Provider — Active Request](#11-provider--active-request)
12. [Provider — Service Complete](#12-provider--service-complete)

---

## 1. Login

```
┌─────────────────────────────────┐
│                                 │
│                                 │
│         🚗  RideRun             │
│    Transport & Errand Service   │
│                                 │
│                                 │
│  ┌───────────────────────────┐  │
│  │  🔵  Sign in with Google  │  │
│  └───────────────────────────┘  │
│                                 │
│   Connecting Chennai to you.    │
│                                 │
│                                 │
└─────────────────────────────────┘
```

**States:**
- Default: button enabled, blue background
- Loading: button shows spinner, disabled ("Signing in…")
- Error: error toast below button ("Sign-in failed. Please try again.")

**Desktop:** Centered card (max-w-sm) on a neutral background. Same content.

---

## 2. Role Selection

```
┌─────────────────────────────────┐
│  ← Back                         │
│                                 │
│   Welcome, Ani!                 │
│   How will you use RideRun?     │
│                                 │
│  ┌───────────────────────────┐  │
│  │                           │  │
│  │   🧑  I'm a Passenger     │  │
│  │                           │  │
│  │  Book rides and errands   │  │
│  │                           │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │                           │  │
│  │   🚗  I'm a Provider      │  │
│  │                           │  │
│  │  Fulfill requests and     │  │
│  │  earn on your schedule    │  │
│  │                           │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │       Continue →          │  │  ← disabled until one card selected
│  └───────────────────────────┘  │
└─────────────────────────────────┘
```

**Selected state:** Card has a 2px primary-colored border + checkmark icon in top-right corner.

**Desktop:** Two cards side by side (grid-cols-2), Continue button below.

---

## 3. Passenger — Home

```
┌─────────────────────────────────┐
│  RideRun          [A] Logout    │  ← A = user avatar initials
├─────────────────────────────────┤
│                                 │
│   Good morning, Ani 👋          │
│   What do you need today?       │
│                                 │
│  ┌───────────────────────────┐  │
│  │                           │  │
│  │   🚗                      │  │
│  │   Ride                    │  │
│  │   Get from A to B         │  │
│  │                           │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │                           │  │
│  │   🛍️                      │  │
│  │   Errand                  │  │
│  │   Pick up items for me    │  │
│  │                           │  │
│  └───────────────────────────┘  │
│                                 │
└─────────────────────────────────┘
```

**Hover/Focus state:** Card lifts with a subtle shadow and primary-colored left border.

**Desktop:** Cards side by side in a centered max-w-2xl container.

---

## 4. Passenger — Ride Request

```
┌─────────────────────────────────┐
│  ← Back          Book a Ride   │
├─────────────────────────────────┤
│                                 │
│  Pickup Location                │
│  ┌───────────────────────────┐  │
│  │ 📍 Enter pickup address…  │  │
│  └───────────────────────────┘  │
│                                 │
│  Destination                    │
│  ┌───────────────────────────┐  │
│  │ 🏁 Enter destination…     │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐  │
│    Suggestions:                 │
│  │  📍 Anna Nagar, Chennai   │  │  ← Google Places dropdown
│     📍 T. Nagar, Chennai        │
│  │  📍 Adyar, Chennai        │  │
│  └ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘  │
│                                 │
│  Payment: Cash on delivery 💵   │
│                                 │
│  ┌───────────────────────────┐  │
│  │     Request Ride →        │  │
│  └───────────────────────────┘  │
│                                 │
└─────────────────────────────────┘
```

**Error state (outside Chennai):**
```
│  Pickup Location                │
│  ┌───────────────────────────┐  │
│  │ 📍 Mumbai, Maharashtra    │  │  ← red border
│  └───────────────────────────┘  │
│  ⚠ Service is only available   │
│    in Chennai at this time.     │
```

**Loading state:** "Request Ride →" button shows spinner + "Finding you a provider…", disabled.

**Desktop:** Narrow centered form (max-w-md).

---

## 5. Passenger — Errand Request

```
┌─────────────────────────────────┐
│  ← Back        Book an Errand  │
├─────────────────────────────────┤
│                                 │
│  Shop Name                      │
│  ┌───────────────────────────┐  │
│  │ e.g. Reliance Fresh…      │  │
│  └───────────────────────────┘  │
│                                 │
│  Items to collect               │
│  ┌───────────────────────────┐  │
│  │                           │  │
│  │ e.g.                      │  │
│  │ 2x milk                   │  │
│  │ 1x bread                  │  │
│  │ 1x eggs (dozen)           │  │
│  │                           │  │
│  └───────────────────────────┘  │
│  Tip: one item per line         │
│                                 │
│  Payment: Cash on delivery 💵   │
│                                 │
│  ┌───────────────────────────┐  │
│  │    Request Errand →       │  │
│  └───────────────────────────┘  │
│                                 │
└─────────────────────────────────┘
```

**Error state (empty fields):**
```
│  Shop Name                      │
│  ┌───────────────────────────┐  │
│  │                           │  │  ← red border
│  └───────────────────────────┘  │
│  ⚠ Shop name is required.       │
```

---

## 6. Passenger — Waiting for Provider

```
┌─────────────────────────────────┐
│  RideRun                        │
├─────────────────────────────────┤
│                                 │
│                                 │
│         ⟳  (spinner)            │
│                                 │
│   Looking for a provider…       │
│                                 │
│   Your request has been         │
│   submitted. A provider will    │
│   be assigned shortly.          │
│                                 │
│   ─────────────────────────     │
│   Ride: T. Nagar → Adyar        │  ← or Errand: Reliance Fresh
│   ─────────────────────────     │
│                                 │
│  ┌───────────────────────────┐  │
│  │       Cancel Request      │  │  ← ghost button
│  └───────────────────────────┘  │
│                                 │
│                                 │
└─────────────────────────────────┘
```

**Unmatched state (60s timeout):**
```
│  ┌───────────────────────────┐  │
│  │  ⚠  No providers          │  │
│  │  available right now.     │  │
│  │                           │  │
│  │  Please try again in a    │  │
│  │  few minutes.             │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │      Try Again →          │  │  ← primary button → back to home
│  └───────────────────────────┘  │
```

---

## 7. Passenger — Live Tracking

```
┌─────────────────────────────────┐
│  RideRun        ● Provider en   │
│                   route         │
├─────────────────────────────────┤
│                                 │
│  ┌───────────────────────────┐  │
│  │                           │  │
│  │   [  Google Maps view  ]  │  │
│  │                           │  │
│  │       🔵  ← provider      │  │
│  │           marker          │  │
│  │                           │  │
│  │                           │  │
│  │                           │  │
│  └───────────────────────────┘  │
│                                 │
├─────────────────────────────────┤
│  Your Ride                      │
│  T. Nagar → Adyar               │
│                                 │
│  Provider is on the way 🚗      │
│  Payment: Cash on delivery      │
└─────────────────────────────────┘
```

**Awaiting first location event:**
```
│  ┌───────────────────────────┐  │
│  │  ⟳  Waiting for          │  │
│  │     provider's location…  │  │
│  └───────────────────────────┘  │
```

**Desktop:** Map fills left 2/3 of viewport; request summary panel on the right.

---

## 8. Passenger — Service Complete

```
┌─────────────────────────────────┐
│  RideRun                        │
├─────────────────────────────────┤
│                                 │
│                                 │
│           ✅                    │
│                                 │
│   Your service is complete!     │
│   Thank you for using RideRun.  │
│                                 │
│  ┌───────────────────────────┐  │
│  │  Ride: T. Nagar → Adyar   │  │
│  │  Payment: Cash on delivery│  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │      Back to Home →       │  │
│  └───────────────────────────┘  │
│                                 │
│                                 │
└─────────────────────────────────┘
```

---

## 9. Provider — Home & Availability

```
┌─────────────────────────────────┐
│  RideRun          [A] Logout    │
├─────────────────────────────────┤
│                                 │
│   Hi, Ravi 👋                   │
│                                 │
│  ┌───────────────────────────┐  │
│  │                           │  │
│  │   Status                  │  │
│  │                           │  │
│  │   ● ONLINE    [ ● ─── ]  │  │  ← toggle ON = green
│  │                           │  │
│  │   You are receiving       │  │
│  │   new requests.           │  │
│  │                           │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │   No active request       │  │
│  │   Waiting for a job…  ⟳   │  │
│  └───────────────────────────┘  │
│                                 │
└─────────────────────────────────┘
```

**Offline state:**
```
│  │   ○ OFFLINE   [ ─── ○ ]  │  │  ← toggle OFF = gray
│  │                           │  │
│  │   You won't receive new   │  │
│  │   requests while offline. │  │
```

**Toggle loading state:** Toggle disabled, shows a small spinner while PATCH request is in flight.

---

## 10. Provider — Incoming Request Alert

```
┌─────────────────────────────────┐
│  RideRun          [A] Logout    │
├─────────────────────────────────┤
│                                 │
│  ╔═══════════════════════════╗  │
│  ║                           ║  │
│  ║  🚗  NEW RIDE REQUEST     ║  │
│  ║                           ║  │
│  ║  From:  T. Nagar          ║  │
│  ║  To:    Adyar             ║  │
│  ║                           ║  │
│  ║  Payment: Cash on         ║  │
│  ║  delivery                 ║  │
│  ║                           ║  │
│  ║  ┌──────────┐ ┌────────┐ ║  │
│  ║  │  Accept  │ │Decline │ ║  │
│  ║  └──────────┘ └────────┘ ║  │
│  ║                           ║  │
│  ║  Expires in  [ 28s ] ████░  ║  │  ← countdown progress bar
│  ║                           ║  │
│  ╚═══════════════════════════╝  │
│                                 │
└─────────────────────────────────┘
```

**Errand variant:**
```
│  ║  🛍️  NEW ERRAND REQUEST   ║  │
│  ║                           ║  │
│  ║  Shop:  Reliance Fresh    ║  │
│  ║  Items: 2x milk, 1x      ║  │
│  ║         bread, 1x eggs   ║  │
```

**States:**
- Accept button: primary (filled), loading spinner + disabled on click
- Decline button: ghost/outline, immediate dismiss
- Alert: focus-trapped modal overlay; keyboard accessible (Tab cycles Accept → Decline)

---

## 11. Provider — Active Request

```
┌─────────────────────────────────┐
│  RideRun          [A] Logout    │
├─────────────────────────────────┤
│                                 │
│   Active Request 🟢             │
│                                 │
│  ┌───────────────────────────┐  │
│  │  Type:    Ride            │  │
│  │  From:    T. Nagar        │  │
│  │  To:      Adyar           │  │
│  │  Payment: Cash on delivery│  │
│  └───────────────────────────┘  │
│                                 │
│  📡 Sharing your location…      │
│  ████████████░░░  (pulsing)     │
│                                 │
│  ┌───────────────────────────┐  │
│  │   ✅  Mark Complete       │  │
│  └───────────────────────────┘  │
│                                 │
└─────────────────────────────────┘
```

**Location denied state:**
```
│  ⚠ Location access required    │
│  for tracking. Please enable   │
│  it in your browser settings   │
│  and reload the page.          │
```

**Mark Complete loading state:** Button shows spinner + "Completing…", disabled until server ack.

---

## 12. Provider — Service Complete

```
┌─────────────────────────────────┐
│  RideRun          [A] Logout    │
├─────────────────────────────────┤
│                                 │
│                                 │
│           ✅                    │
│                                 │
│   Service Complete!             │
│                                 │
│  ┌───────────────────────────┐  │
│  │  Ride: T. Nagar → Adyar   │  │
│  │  Payment: Collect cash    │  │
│  │          from passenger   │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │      Back to Home →       │  │
│  └───────────────────────────┘  │
│                                 │
│                                 │
└─────────────────────────────────┘
```

---

## User Flow Diagram

```
PASSENGER FLOW
──────────────
Login → Role Selection → Passenger Home
                              │
              ┌───────────────┴───────────────┐
              ▼                               ▼
        Ride Request                  Errand Request
         (form)                          (form)
              │                               │
              └───────────────┬───────────────┘
                              ▼
                    Waiting for Provider
                       ┌────┴────┐
                    timeout    accept
                       │         │
                       ▼         ▼
                   Unmatched  Live Tracking
                   (try again)    │
                              complete
                                  │
                                  ▼
                          Service Complete
                                  │
                                  ▼
                          Passenger Home


PROVIDER FLOW
─────────────
Login → Role Selection → Provider Home
                              │
                         go online
                              │
                              ▼
                    Waiting (listening…)
                              │
                        new request
                              │
                              ▼
                    Request Alert (30s)
                     ┌────┴────┐
                  decline    accept
                     │         │
                     ▼         ▼
               Next provider  Active Request
                           (broadcasting GPS)
                              │
                         mark complete
                              │
                              ▼
                       Service Complete
                              │
                              ▼
                        Provider Home
```

---

## Design Tokens Reference

| Token | Light | Dark |
|-------|-------|------|
| `primary` | `#4F46E5` (indigo-600) | `#818CF8` (indigo-400) |
| `background` | `#FFFFFF` | `#09090B` (zinc-950) |
| `foreground` | `#18181B` (zinc-900) | `#FAFAFA` |
| `muted` | `#F4F4F5` (zinc-100) | `#27272A` (zinc-800) |
| `muted-foreground` | `#71717A` (zinc-500) | `#A1A1AA` |
| `destructive` | `#DC2626` (red-600) | `#EF4444` |
| `border` | `#E4E4E7` (zinc-200) | `#3F3F46` |
| `ring` | `#4F46E5` (indigo-600) | `#818CF8` |

**Font:** Inter (Google Fonts) — 400 body, 500 labels, 600 headings

**Ride badge color:** Indigo / primary
**Errand badge color:** Amber (`#D97706`)
**Online status:** Green (`#16A34A`)
**Offline status:** Zinc-400 (`#A1A1AA`)

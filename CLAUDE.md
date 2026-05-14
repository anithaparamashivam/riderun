# CLAUDE.md — RideRun

This file gives Claude Code context about the project so it can assist effectively without re-reading the entire codebase each session.

---

## What this project is

RideRun is a two-sided marketplace web app for Chennai. Passengers book rides or errands; service providers accept them. The core loop is: **request → match → track → complete**.

Authentication is email/password (bcrypt + JWT in httpOnly cookie). Google OAuth was deliberately removed in favour of email/password to simplify local development.

---

## Monorepo layout

```
client/   React 18 + Vite + TypeScript + Tailwind CSS (port 5173)
server/   Node.js + Express + Socket.io + Mongoose   (port 3001)
sdocs/    PRD, architecture reference, story files, changelog
```

Vite proxies `/api` and `/socket.io` → `localhost:3001`, so the client never hard-codes the server port.

---

## Key architectural decisions

- **JWT in httpOnly cookie** — issued by server on login/register; read by `requireAuth` middleware from `req.cookies.token`
- **Socket.io rooms** — every connected user joins `user:{userId}`; online providers also join `providers-online-room`
- **Request matching** — `matchingService.js` uses `findOneAndUpdate({ status: 'pending' })` for atomic race-safe assignment; 60-second configurable timeout
- **Location relay** — provider emits `location:update`; server verifies `request.providerId === socket.data.userId` before relaying to passenger room; location is **not** persisted to MongoDB
- **Address autocomplete** — uses OpenStreetMap Nominatim (free, no API key). Google Maps key in `client/.env` is optional (only needed for the map tile renderer)
- **No fake timers in Jest** — `jest.useFakeTimers()` freezes Mongoose connection pooling; use real timers with injectable short timeouts in tests instead

---

## Environment variables

**`server/.env`**
```
MONGODB_URI=         # MongoDB Atlas connection string (include /riderun as db name)
JWT_SECRET=          # Any long random string
CLIENT_URL=http://localhost:5173
PORT=3001
NODE_ENV=development
```

**`client/.env`**
```
VITE_GOOGLE_MAPS_API_KEY=   # Optional — only needed for map tiles
```

---

## Running locally

```bash
# Terminal 1
cd server && npm run dev

# Terminal 2
cd client && npm run dev
```

Visit http://localhost:5173 → Register → Choose role → use the app.

---

## Running tests

```bash
cd server && npm test          # Jest, --runInBand --forceExit
cd client && npm test          # Vitest
```

Current counts: **52 server tests** (9 suites) · **61 client tests** (16 files).

Do not use `jest.useFakeTimers()` in server tests — it breaks Mongoose buffering. Use injectable `timeoutMs` parameters instead (see `matching.test.js`).

Do not call `jest.resetModules()` in `beforeEach` — it destroys the Mongoose connection shared across tests.

---

## Models

### User
```js
{ name, email, password, picture, role: 'passenger'|'provider'|null, isOnline }
```
`password` is bcrypt-hashed. `role` starts as `null` after registration and is set on the role-selection screen.

### Request
```js
{ type: 'ride'|'errand', status: 'pending'|'assigned'|'completed'|'unmatched',
  passengerId, providerId,
  pickupLocation: {lat,lng,address}, destination: {lat,lng,address},  // ride
  shopName, itemList }                                                  // errand
```

---

## Socket handlers (`server/socket/handlers.js`)

| Event received | Behaviour |
|---------------|-----------|
| `request:accept` | Delegates to `matchingService.handleAccept` — atomic DB claim |
| `request:decline` | Acknowledges via `matchingService.handleDecline` |
| `location:update` | Verifies assigned provider, relays `{lat,lng}` to passenger room |
| `request:completed` | Verifies assigned provider, sets status=completed, relays to passenger |

---

## Client routing (`client/src/App.tsx`)

| Path | Component | Guard |
|------|-----------|-------|
| `/login` | Login | none |
| `/register` | Register | none |
| `/role-selection` | RoleSelection | none |
| `/passenger` | PassengerHome | PassengerRoute |
| `/passenger/ride` | RideRequest | PassengerRoute |
| `/passenger/errand` | ErrandRequest | PassengerRoute |
| `/passenger/waiting/:requestId` | WaitingForProvider | PassengerRoute |
| `/passenger/tracking/:requestId` | Tracking | PassengerRoute |
| `/passenger/complete/:requestId` | PassengerServiceComplete | PassengerRoute |
| `/provider` | ProviderHome | ProviderRoute |
| `/provider/complete` | ProviderServiceComplete | ProviderRoute |

After `login()` or `register()`, navigate based on returned `role`: null → `/role-selection`, passenger → `/passenger`, provider → `/provider`.

After `updateRole()` in RoleSelection, explicitly `navigate()` — do not rely on route guards to redirect from an unguarded route.

---

## Common gotchas

- The `RideRequest` form requires lat/lng to be set (not null) before submitting. Users must click a suggestion from the Nominatim dropdown — typing an address and pressing submit without selecting will show a validation error.
- `useProviderLocation` hook uses `setInterval(5000)` + `watchPosition`. On unmount both are cleaned up. Active request navigation triggers unmount which stops location broadcast.
- The `TrackingMap` component wraps `@react-google-maps/api`. In tests, mock the entire module — see `TrackingMap.test.tsx` for the pattern.
- Chennai bounds: `{ north: 13.23, south: 12.82, east: 80.34, west: 79.97 }` — validated server-side in `server/lib/chennai.js` and client-side in `RideRequest.tsx`.

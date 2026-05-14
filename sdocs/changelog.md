# Changelog

## [STORY-012] Service Completion — 2026-05-13

### Added
- `server/socket/handlers.js` — `request:completed` handler: atomic `findOneAndUpdate` verifying `{ status: 'assigned', providerId }` (security), updates to `completed`, relays event to passenger socket (AC2, AC3)
- `client/src/pages/provider/ActiveRequest.tsx` — Mark Complete button wired to emit `request:completed`; `completing` state disables button and shows "Completing…" (AC1, AC6); navigates to `/provider/complete`
- `client/src/pages/provider/ServiceComplete.tsx` — "Service Complete" screen with green checkmark, summary, "Back to Home" → `/provider` (AC7)
- `client/src/pages/passenger/ServiceComplete.tsx` — "Your service is complete — thank you!" screen with summary prop, "Back to Home" → `/passenger` (AC5)
- `client/src/App.tsx` — routes `/passenger/complete/:requestId` and `/provider/complete`
- `server/tests/completion.test.js` — 2 socket integration tests: assigned provider completes + DB update; unassigned provider cannot complete
- `client/src/pages/provider/__tests__/ActiveRequest.test.tsx` — 3 tests: button renders, emit on click, disabled while completing
- `client/src/pages/passenger/__tests__/ServiceComplete.test.tsx` — 3 tests: completion message, summary, Back to Home navigation
- `client/src/pages/provider/__tests__/ServiceComplete.test.tsx` — 2 tests: heading, Back to Home navigation

## [STORY-011] Passenger Live Tracking Map — 2026-05-13

### Added
- `client/src/components/TrackingMap.tsx` — `@react-google-maps/api` GoogleMap with Marker; spinner overlay (`aria-live="polite"`) while awaiting first location; `role="application"` + `aria-label="Provider tracking map"` (AC2, AC4)
- `client/src/pages/passenger/Tracking.tsx` — subscribes to `location:update` and `request:completed` socket events; renders TrackingMap + fixed bottom summary card; navigates on completion (AC3, AC5)
- `client/src/App.tsx` — route `/passenger/tracking/:requestId`
- `client/src/vite-env.d.ts` — typed `VITE_GOOGLE_MAPS_API_KEY` env variable
- `client/src/components/__tests__/TrackingMap.test.tsx` — 5 tests: loading overlay, role, marker render, position update, overlay hide
- `client/src/pages/passenger/__tests__/Tracking.test.tsx` — 5 tests: loading state, map render, location update relay, overlay dismiss, summary card

## [STORY-010] Provider Location Broadcast — 2026-05-13

### Added
- `server/socket/handlers.js` — `location:update` handler: verifies emitting socket is the assigned provider for the request (security check), then relays `{ lat, lng }` to passenger's `user:{passengerId}` room
- `client/src/hooks/useProviderLocation.ts` — `navigator.geolocation.watchPosition` + 5s setInterval; emits `location:update` via socket; cleans up on unmount (AC2, AC5, AC6); returns `LocationStatus` ('idle' | 'watching' | 'denied' | 'unavailable')
- `client/src/pages/provider/ActiveRequest.tsx` — mounts `useProviderLocation` hook; shows `role="alert"` warning when location is denied/unavailable (AC4)
- `server/tests/location.test.js` — 2 socket integration tests: relay to assigned passenger; reject unassigned provider
- `client/src/hooks/__tests__/useProviderLocation.test.ts` — 4 unit tests: 5s emit interval, cleanup on unmount, denied status, inactive mode

## [STORY-009] Request Matching — 2026-05-13

### Added
- `server/socket/matchingService.js` — core matching: emits `provider:new-request` to online room, atomic MongoDB claim on accept (race-safe), 60s configurable timeout → `unmatched` + passenger notification; `init(io)` / `startMatching(request, timeoutMs)` / `handleAccept` / `handleDecline` / `cleanup`
- `server/socket/handlers.js` — updated to use matchingService for accept/decline events
- `server/routes/requests.js` — calls `matchingService.startMatching(doc)` via setImmediate after request creation
- `client/src/pages/passenger/WaitingForProvider.tsx` — socket listener for `request:assigned` (navigate to tracking) and `request:unmatched` (unmatched state with retry button)
- `server/tests/matching.test.js` — 4 unit tests covering broadcast, assign, late-accept ignore, timeout
- `client/src/pages/passenger/__tests__/WaitingUnmatched.test.tsx` — 3 client tests for unmatched state and retry navigation

## [STORY-008] Provider Accept/Decline — 2026-05-13

### Added
- `server/socket/handlers.js` — `request:accept` (DB update to assigned + notify passenger); `request:decline` (acknowledge); joins user and providers-online rooms on connect
- `server/index.js` — replaced inline io.on handler with `registerHandlers(io)` call
- `client/src/components/RequestAlert.tsx` — modal overlay with type badge, request details, 30s countdown auto-dismiss, Accept/Decline buttons
- `client/src/pages/provider/ActiveRequest.tsx` — post-accept placeholder with Mark Complete button stub
- `server/tests/socket.test.js` — 2 socket integration tests (accept → DB assigned, decline → acknowledged)
- `client/src/components/__tests__/RequestAlert.test.tsx` — 6 tests including fake-timer countdown and auto-dismiss

## [STORY-006] Errand Request Form — 2026-05-12

### Added
- `client/src/pages/passenger/ErrandRequest.tsx` — shop name input, item list textarea, validation, loading state, navigates to waiting screen on success
- `client/src/App.tsx` — route `/passenger/errand`
- `client/src/pages/passenger/__tests__/ErrandRequest.test.tsx` — 4 tests covering render, validation, and success navigation

### Fixed
- `server/routes/requests.js` — errand requests were incorrectly requiring `pickupLocation`; refactored to branch on `type`; errand now validates `shopName` and `itemList` instead

## [STORY-005] Ride Request Form — 2026-05-12

### Added
- `server/lib/chennai.js` — `isInChennai({ lat, lng })` pure utility; Chennai bounds `{ north: 13.23, south: 12.82, east: 80.34, west: 79.97 }`
- `server/routes/requests.js` — POST `/api/requests`; validates type, location shape, Chennai bounds (400 on out-of-bounds); requireAuth guard
- `server/index.js` — mounted `/api/requests` router
- `client/src/pages/passenger/RideRequest.tsx` — ride form with labeled inputs, hidden lat/lng test inputs, Chennai validation, loading state, navigate to waiting on success
- `client/src/pages/passenger/WaitingForProvider.tsx` — spinner, "Looking for a provider…", aria-live="polite"
- `client/src/App.tsx` — routes `/passenger/ride` and `/passenger/waiting/:requestId`
- `server/tests/requests.test.js` — 10 tests covering valid submission, out-of-bounds errors, missing fields, 401, and Chennai bounds pure function
- `client/src/pages/passenger/__tests__/RideRequest.test.tsx` — 4 tests; `WaitingForProvider.test.tsx` — 2 tests

## [STORY-007] Provider Home & Availability Toggle — 2026-05-12

### Added
- `server/routes/providers.js` — GET `/api/providers/me` (profile with isOnline); PATCH `/api/providers/me/availability` (boolean isOnline); requireProvider middleware (403 for non-providers)
- `server/index.js` — mounted `/api/providers` router
- `client/src/pages/provider/Home.tsx` — provider home with name, status badge (green/gray), toggle switch, disabled during flight, error revert on failure
- `server/tests/providers.test.js` — 7 tests covering availability toggle, 403 for passengers, 401 unauth, 400 bad payload, GET profile
- `client/src/pages/provider/__tests__/Home.test.tsx` — 5 tests covering render, online/offline status, disabled toggle, error revert

## [STORY-004] Passenger Home Screen — 2026-05-12

### Added
- `client/src/components/ServiceCard.tsx` — reusable card button with label, description, icon; hover/focus states
- `client/src/pages/passenger/Home.tsx` — passenger home with navbar (logout), two ServiceCards (Ride/Errand), navigates to `/passenger/ride` and `/passenger/errand`
- `client/src/App.tsx` — replaced single ProtectedRoute with PassengerRoute and ProviderRoute guards; providers redirected to `/provider` if accessing `/passenger` and vice versa
- `client/src/components/__tests__/ServiceCard.test.tsx` — 3 unit tests
- `client/src/pages/passenger/__tests__/Home.test.tsx` — 4 integration tests

## [STORY-003] Role Selection — 2026-05-12

### Added
- `server/routes/users.js` — PATCH `/api/users/me/role` with requireAuth guard; validates role is passenger or provider; 400 on invalid/missing role, 401 when unauthenticated
- `server/index.js` — mounted `/api/users` router
- `client/src/pages/RoleSelection.tsx` — two-card role picker (Passenger / Service Provider); Confirm button disabled until selection; error recovery state
- `client/src/contexts/AuthContext.tsx` — added `updateRole(role)` function: PATCHes role, updates user state so routing guard redirects automatically
- `server/tests/users.test.js` — 5 tests covering role update, invalid role, missing role, unauthenticated access
- `client/src/pages/__tests__/RoleSelection.test.tsx` — 5 tests covering render, disabled state, role selection, and updateRole calls

## [STORY-002] Google OAuth Sign-in — 2026-05-12

### Added
- `client/src/pages/Login.tsx` — Sign-in page with Google OAuth link, Google SVG logo, accessible `<main>` landmark and `<h1>` heading, focus ring, dark mode support
- `server/routes/auth.js` — `/me` route now uses `requireAuth` middleware (no duplicate JWT verification); CLIENT_URL helper with `localhost:5173` fallback
- `server/tests/auth.test.js` — 10 tests covering requireAuth middleware (valid/expired/wrong-secret tokens), GET /api/auth/me, GET /api/auth/logout, and User model upsert AC4/AC5
- `client/src/pages/__tests__/Login.test.tsx` — 3 tests verifying render, Sign-in link presence, and href target

## [STORY-001] Project Scaffold — 2026-05-12

### Added
- `server/` — Express + Socket.io HTTP server (`index.js`), Mongoose connection helper (`config/db.js`)
- `server/models/User.js` — User schema with role enum (passenger | provider | null), googleId, isOnline
- `server/models/Request.js` — Request schema with type (ride | errand), status, pickupLocation, destination, shopName, itemList
- `server/routes/auth.js` — Google OAuth 2.0 routes via Passport.js; JWT issued in httpOnly cookie
- `server/middleware/authMiddleware.js` — `requireAuth` middleware validates JWT from cookie
- `server/scripts/seed.js` — Seeds one provider user (Ravi Kumar) for local dev
- `client/` — React 18 + Vite 5 + TypeScript SPA
- `client/src/contexts/AuthContext.tsx` — Fetches `/api/auth/me` on mount; exposes user, loading, logout
- `client/src/App.tsx` — BrowserRouter with role-based route guards
- Tailwind CSS design tokens (indigo primary, zinc neutrals, CSS variable light/dark themes)
- Vite proxy: `/api` and `/socket.io` → `localhost:3001`

### Security (Refactor)
- Socket.io connection handler now verifies JWT before accepting connection; unauthenticated sockets are rejected
- Added 404 fallback handler for unmatched `/api/*` routes
- `seed.js` exits with clear error message when `MONGODB_URI` is not set

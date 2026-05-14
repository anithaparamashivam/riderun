---
title: Transportation & Errand Service App
version: 0.1
status: accepted
created: 2026-05-12
last_updated: 2026-05-12
source: scope
owner: TBD
---

## Overview

A two-sided web application connecting passengers in Chennai with service providers who fulfill transport ride requests and errand requests. Passengers submit a request — either a ride to a destination or an errand from a specific shop — get matched with an available provider, and track fulfillment in real time via Google Maps. Payment is cash on delivery. The product follows Uber's core loop (request → match → track) extended to cover non-transport errands.

## Goals

- A passenger can submit a ride request (pickup + destination) within 2 minutes of opening the app
- A passenger can submit an errand request (shop name + item list) within 3 minutes of opening the app
- Every submitted request is assigned to a service provider who accepts it
- Passengers can track the assigned provider's live location from assignment through completion
- Service providers can accept or decline incoming requests and toggle their availability

## Non-Goals

- In-app payment processing — cash on delivery only; no card, wallet, or UPI
- Scheduled or future-dated bookings
- Multiple stops in a single ride or errand
- In-app chat between passenger and provider
- User ratings or reviews
- Surge or dynamic pricing

## Users

### Passengers (Customers)
Residents in Chennai who need a ride to a destination or someone to run an errand on their behalf (e.g., collect items from Reliance stores). They currently use existing ride or delivery apps. They want a single app covering both transport and errands without switching platforms.

### Service Providers (Drivers / Assistants)
Independent contractors in Chennai who fulfill ride and errand requests. Analogous to Uber drivers. They can handle both service types depending on their availability and ETA. They use the same web app with a provider-specific view.

## Functional Requirements

- **Service type selection:** A passenger opens the app and chooses between two service types: Ride (transport to a destination) or Errand (collect items from a shop). Both options are presented on the home screen after login.

- **Ride request:** A passenger submitting a ride specifies a pickup location and a destination. The system validates both are within the supported area (Chennai) before allowing submission.

- **Errand request:** A passenger submitting an errand specifies a shop name and a free-text list of items to collect. No structured item catalog — plain text is sufficient.

- **Request submission and matching:** After submission the system notifies available online providers. The request is assigned to the first provider who accepts. If a provider declines, the next available provider is notified.

- **Real-time tracking:** Once a provider accepts, the passenger sees the provider's live location updated on a Google Maps view. Tracking continues until the provider marks the service complete.

- **Provider request notifications:** Online providers receive incoming request alerts and can accept or decline each one individually.

- **Provider availability toggle:** Providers can set themselves online or offline. Only online providers receive new requests.

- **Service completion:** The provider marks a request as complete when done. The passenger is notified. Payment is settled offline (cash on delivery).

- **Authentication:** Both passengers and providers sign in via Google OAuth. First-time sign-in creates a new account. No separate registration flow.

## Non-Functional Requirements

- Real-time location update interval: target ≤ 5 seconds from provider to passenger map view
- Responsive web — usable on modern desktop and mobile browsers (Chrome, Safari, Firefox latest)
- HTTPS enforced; user location data not persisted beyond the duration of an active service session
- System must support up to 100 concurrent users at initial launch

## Technical Constraints

- Frontend: React (web app)
- Backend: Node.js
- Database: MongoDB
- Maps and real-time tracking: Google Maps API (Google Maps JavaScript API + Geolocation)
- Authentication: Google OAuth 2.0 — greenfield, no existing identity system
- Real-time location push: WebSocket-based (e.g., Socket.io) required for live tracking
- Deployment: AWS
- Target geography: Chennai, India (initial pilot)

## Design

Greenfield — no existing design system or brand guidelines. Default accessibility target: WCAG 2.1 AA. Web only; no native iOS or Android app in v1.

## Out of Scope

- Native iOS / Android apps (deferred post-web launch)
- Scheduled or advance bookings (deferred to v2)
- In-app messaging between passenger and provider (deferred to v2)
- Ratings and reviews (deferred to v2)
- Surge or dynamic pricing (deferred to v2)
- Multi-city expansion (deferred after Chennai pilot validates the model)
- Admin / operations dashboard (see Open Questions)

## Open Questions

1. How are service providers onboarded and verified — manual admin process, or self-registration with document upload?
2. How is fare / pricing communicated to the passenger — fixed rate table, distance-based estimate shown before submission, or no estimate at all?
3. What happens if no provider accepts a request — timeout with passenger notification, or queue indefinitely?
4. Is there an admin / ops user type who needs a dashboard to monitor active requests, manage providers, and handle disputes?
5. How is errand completion confirmed — provider marks done unilaterally, or does the passenger confirm receipt first?
6. Should location history for completed requests be retained (e.g., for dispute resolution), and if so for how long?

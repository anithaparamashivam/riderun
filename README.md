# RideRun

A two-sided web application connecting passengers in Chennai with service providers who fulfil ride and errand requests. Passengers submit a request, get matched with an available provider, and track them live on a map. Payment is cash on delivery.

---

## Features

- **Ride requests** — pickup + destination with address autocomplete (OpenStreetMap)
- **Errand requests** — shop name + item list
- **Real-time matching** — first provider to accept wins; 60-second timeout if no one accepts
- **Live location tracking** — provider's GPS relayed to passenger via Socket.io
- **Provider availability toggle** — go online/offline to receive requests
- **Service completion** — provider marks done; both parties see confirmation screen
- **Email/password auth** — register and log in with JWT in httpOnly cookie

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + TypeScript + Tailwind CSS |
| Backend | Node.js + Express + Mongoose |
| Real-time | Socket.io |
| Database | MongoDB Atlas |
| Auth | JWT (httpOnly cookie) + bcrypt |
| Address search | OpenStreetMap Nominatim (free, no API key) |
| Maps | `@react-google-maps/api` (optional) |

---

## Project Structure

```
riderun/
├── client/               # React SPA
│   └── src/
│       ├── components/   # Shared UI components
│       ├── contexts/     # AuthContext
│       ├── hooks/        # useProviderLocation
│       └── pages/
│           ├── passenger/
│           └── provider/
└── server/               # Express API + Socket.io
    ├── middleware/
    ├── models/           # Mongoose schemas
    ├── routes/           # REST endpoints
    ├── socket/           # Socket.io handlers + matching service
    └── tests/            # Jest integration tests
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (free tier works)

### 1. Clone

```bash
git clone https://github.com/anithaparamashivam/riderun.git
cd riderun
```

### 2. Server setup

```bash
cd server
npm install
```

Create `server/.env`:

```env
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/riderun
JWT_SECRET=your-secret-key
CLIENT_URL=http://localhost:5173
PORT=3001
NODE_ENV=development
```

```bash
npm run dev
```

### 3. Client setup

```bash
cd client
npm install
npm run dev
```

Open **http://localhost:5173**

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Sign in |
| GET | `/api/auth/me` | Current user |
| GET | `/api/auth/logout` | Sign out |
| PATCH | `/api/users/me/role` | Set passenger/provider role |
| GET | `/api/providers/me` | Provider profile |
| PATCH | `/api/providers/me/availability` | Toggle online status |
| POST | `/api/requests` | Submit ride or errand request |

## Socket.io Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `provider:new-request` | server → provider | New request available |
| `request:accept` | provider → server | Accept a request |
| `request:assigned` | server → passenger | Provider matched |
| `location:update` | provider ↔ server ↔ passenger | Live location relay |
| `request:completed` | provider → server → passenger | Service marked done |
| `request:unmatched` | server → passenger | No provider found in 60s |

---

## Running Tests

```bash
# Server (Jest)
cd server && npm test

# Client (Vitest)
cd client && npm test
```

**52 server tests · 61 client tests · TypeScript strict**

---

## User Flow

```
Register → Choose role → (Passenger) Book ride/errand → Wait for provider
                       → (Provider)  Go online → Accept request → Share location → Mark complete
```

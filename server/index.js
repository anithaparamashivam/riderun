require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { Server } = require('socket.io');
const { connectDB } = require('./config/db');
const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const providersRouter = require('./routes/providers');
const requestsRouter = require('./routes/requests');

const app = express();
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  },
});

// ── Middleware ────────────────────────────────────────────────
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());

// ── Routes ────────────────────────────────────────────────────
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/providers', providersRouter);
app.use('/api/requests', requestsRouter);

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/api/*', (_req, res) => res.status(404).json({ error: 'Not found' }));

// ── Socket.io — verify JWT on connect ────────────────────────
const jwt = require('jsonwebtoken');
io.use((socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('Authentication required'));
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
    socket.data.userId = payload.userId;
    socket.data.role   = payload.role;
    next();
  } catch {
    next(new Error('Invalid token'));
  }
});

const registerHandlers = require('./socket/handlers');
registerHandlers(io);

// ── Boot (skip auto-connect when required by tests) ───────────
if (require.main === module) {
  const PORT = process.env.PORT || 3001;
  connectDB(process.env.MONGODB_URI)
    .then(() => httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
    .catch(err => { console.error('Startup error:', err); process.exit(1); });
}

module.exports = { app, httpServer, io };

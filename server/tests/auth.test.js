process.env.JWT_SECRET = 'test-jwt-secret';
process.env.CLIENT_URL = 'http://localhost:5173';

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const request = require('supertest');
const jwt = require('jsonwebtoken');

let mongod;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

afterEach(async () => {
  const User = require('../models/User');
  await User.deleteMany({});
});

// ── requireAuth middleware ─────────────────────────────────────
describe('requireAuth middleware', () => {
  const { requireAuth } = require('../middleware/authMiddleware');

  it('calls next() and attaches user payload for a valid JWT cookie (AC3)', () => {
    const token = jwt.sign({ userId: 'abc123', role: 'passenger' }, 'test-jwt-secret');
    const req = { cookies: { token } };
    const res = {};
    const next = jest.fn();
    requireAuth(req, res, next);
    expect(next).toHaveBeenCalledWith();
    expect(req.user.userId).toBe('abc123');
    expect(req.user.role).toBe('passenger');
  });

  it('returns 401 when no cookie is present (AC7)', () => {
    const req = { cookies: {} };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    requireAuth(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 401 for an expired JWT (AC7)', () => {
    const token = jwt.sign({ userId: 'abc123' }, 'test-jwt-secret', { expiresIn: '-1s' });
    const req = { cookies: { token } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    requireAuth(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 401 for a token signed with a wrong secret (AC7)', () => {
    const token = jwt.sign({ userId: 'abc123' }, 'wrong-secret');
    const req = { cookies: { token } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    requireAuth(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
  });
});

// ── GET /api/auth/me ──────────────────────────────────────────
describe('GET /api/auth/me', () => {
  const { app } = require('../index');

  it('returns the JWT payload for a valid cookie (AC3)', async () => {
    const token = jwt.sign({ userId: 'user123', role: 'passenger' }, 'test-jwt-secret');
    const res = await request(app)
      .get('/api/auth/me')
      .set('Cookie', `token=${token}`);
    expect(res.status).toBe(200);
    expect(res.body.userId).toBe('user123');
    expect(res.body.role).toBe('passenger');
  });

  it('returns 401 when no cookie is sent (AC7)', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  it('returns 401 for a malformed token (AC7)', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Cookie', 'token=not-a-valid-jwt');
    expect(res.status).toBe(401);
  });
});

// ── GET /api/auth/logout ──────────────────────────────────────
describe('GET /api/auth/logout', () => {
  const { app } = require('../index');

  it('clears the token cookie and redirects to /login (AC6)', async () => {
    const token = jwt.sign({ userId: 'user123', role: 'passenger' }, 'test-jwt-secret');
    const res = await request(app)
      .get('/api/auth/logout')
      .set('Cookie', `token=${token}`);
    expect(res.status).toBe(302);
    expect(res.headers.location).toContain('/login');
    const setCookieHeader = res.headers['set-cookie'];
    expect(setCookieHeader).toBeDefined();
    const tokenClearCookie = setCookieHeader.find(c => c.startsWith('token='));
    expect(tokenClearCookie).toBeDefined();
  });
});

// ── POST /api/auth/register ───────────────────────────────────
describe('POST /api/auth/register', () => {
  const { app } = require('../index');

  it('creates user, sets cookie, returns 201 with userId and role', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Alice', email: 'alice@example.com', password: 'secret123' });
    expect(res.status).toBe(201);
    expect(res.body.userId).toBeDefined();
    expect(res.body.role).toBeNull();
    const cookie = res.headers['set-cookie'];
    expect(cookie).toBeDefined();
    expect(cookie.some(c => c.startsWith('token='))).toBe(true);
  });

  it('returns 409 when email is already registered', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ name: 'Alice', email: 'alice@example.com', password: 'secret123' });
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Alice', email: 'alice@example.com', password: 'other' });
    expect(res.status).toBe(409);
  });

  it('returns 400 when fields are missing', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'x@example.com' });
    expect(res.status).toBe(400);
  });
});

// ── POST /api/auth/login ──────────────────────────────────────
describe('POST /api/auth/login', () => {
  const { app } = require('../index');
  const bcrypt = require('bcryptjs');
  const User = require('../models/User');

  beforeEach(async () => {
    const hashed = await bcrypt.hash('mypassword', 10);
    await User.create({ name: 'Bob', email: 'bob@example.com', password: hashed });
  });

  it('issues cookie and returns userId on valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'bob@example.com', password: 'mypassword' });
    expect(res.status).toBe(200);
    expect(res.body.userId).toBeDefined();
    const cookie = res.headers['set-cookie'];
    expect(cookie.some(c => c.startsWith('token='))).toBe(true);
  });

  it('returns 401 for wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'bob@example.com', password: 'wrongpassword' });
    expect(res.status).toBe(401);
  });

  it('returns 401 for unknown email', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nobody@example.com', password: 'whatever' });
    expect(res.status).toBe(401);
  });

  it('returns 400 when fields are missing', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'bob@example.com' });
    expect(res.status).toBe(400);
  });
});

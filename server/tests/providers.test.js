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

function makeToken(userId, role = 'provider') {
  return jwt.sign({ userId, role }, 'test-jwt-secret');
}

describe('PATCH /api/providers/me/availability', () => {
  const { app } = require('../index');
  const User = require('../models/User');

  it('sets isOnline to true for an authenticated provider (AC2)', async () => {
    const user = await User.create({
      googleId: 'g-p-001', name: 'Provider', email: 'p@test.com', picture: '', role: 'provider', isOnline: false,
    });
    const token = makeToken(user._id.toString());

    const res = await request(app)
      .patch('/api/providers/me/availability')
      .set('Cookie', `token=${token}`)
      .send({ isOnline: true });

    expect(res.status).toBe(200);
    expect(res.body.isOnline).toBe(true);
    const updated = await User.findById(user._id);
    expect(updated.isOnline).toBe(true);
  });

  it('sets isOnline to false for an authenticated provider (AC3)', async () => {
    const user = await User.create({
      googleId: 'g-p-002', name: 'Provider2', email: 'p2@test.com', picture: '', role: 'provider', isOnline: true,
    });
    const token = makeToken(user._id.toString());

    const res = await request(app)
      .patch('/api/providers/me/availability')
      .set('Cookie', `token=${token}`)
      .send({ isOnline: false });

    expect(res.status).toBe(200);
    expect(res.body.isOnline).toBe(false);
  });

  it('returns 401 when not authenticated', async () => {
    const res = await request(app)
      .patch('/api/providers/me/availability')
      .send({ isOnline: true });
    expect(res.status).toBe(401);
  });

  it('returns 403 when the user is a passenger, not a provider', async () => {
    const user = await User.create({
      googleId: 'g-pass-001', name: 'Passenger', email: 'pass@test.com', picture: '', role: 'passenger',
    });
    const token = jwt.sign({ userId: user._id.toString(), role: 'passenger' }, 'test-jwt-secret');

    const res = await request(app)
      .patch('/api/providers/me/availability')
      .set('Cookie', `token=${token}`)
      .send({ isOnline: true });

    expect(res.status).toBe(403);
  });

  it('returns 400 when isOnline is not a boolean', async () => {
    const user = await User.create({
      googleId: 'g-p-003', name: 'Provider3', email: 'p3@test.com', picture: '', role: 'provider', isOnline: false,
    });
    const token = makeToken(user._id.toString());

    const res = await request(app)
      .patch('/api/providers/me/availability')
      .set('Cookie', `token=${token}`)
      .send({ isOnline: 'yes' });

    expect(res.status).toBe(400);
  });
});

describe('GET /api/providers/me', () => {
  const { app } = require('../index');
  const User = require('../models/User');

  it('returns provider profile including isOnline', async () => {
    const user = await User.create({
      googleId: 'g-p-004', name: 'Provider4', email: 'p4@test.com', picture: '', role: 'provider', isOnline: true,
    });
    const token = makeToken(user._id.toString());

    const res = await request(app)
      .get('/api/providers/me')
      .set('Cookie', `token=${token}`);

    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Provider4');
    expect(res.body.isOnline).toBe(true);
  });

  it('returns 403 when the caller is a passenger', async () => {
    const user = await User.create({
      googleId: 'g-pass-002', name: 'Pass', email: 'pass2@test.com', picture: '', role: 'passenger',
    });
    const token = jwt.sign({ userId: user._id.toString(), role: 'passenger' }, 'test-jwt-secret');

    const res = await request(app)
      .get('/api/providers/me')
      .set('Cookie', `token=${token}`);

    expect(res.status).toBe(403);
  });
});

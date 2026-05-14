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

function makeToken(userId, role = null) {
  return jwt.sign({ userId, role }, 'test-jwt-secret');
}

describe('PATCH /api/users/me/role', () => {
  const { app } = require('../index');
  const User = require('../models/User');

  it('updates role to passenger for an authenticated user (AC2)', async () => {
    const user = await User.create({
      googleId: 'g-001',
      name: 'Test',
      email: 'test@test.com',
      picture: '',
      role: null,
    });
    const token = makeToken(user._id.toString());

    const res = await request(app)
      .patch('/api/users/me/role')
      .set('Cookie', `token=${token}`)
      .send({ role: 'passenger' });

    expect(res.status).toBe(200);
    expect(res.body.role).toBe('passenger');

    const updated = await User.findById(user._id);
    expect(updated.role).toBe('passenger');
  });

  it('updates role to provider for an authenticated user (AC3)', async () => {
    const user = await User.create({
      googleId: 'g-002',
      name: 'Provider',
      email: 'provider@test.com',
      picture: '',
      role: null,
    });
    const token = makeToken(user._id.toString());

    const res = await request(app)
      .patch('/api/users/me/role')
      .set('Cookie', `token=${token}`)
      .send({ role: 'provider' });

    expect(res.status).toBe(200);
    expect(res.body.role).toBe('provider');
  });

  it('returns 400 for an invalid role value', async () => {
    const user = await User.create({
      googleId: 'g-003',
      name: 'BadRole',
      email: 'bad@test.com',
      picture: '',
      role: null,
    });
    const token = makeToken(user._id.toString());

    const res = await request(app)
      .patch('/api/users/me/role')
      .set('Cookie', `token=${token}`)
      .send({ role: 'admin' });

    expect(res.status).toBe(400);
  });

  it('returns 401 when not authenticated', async () => {
    const res = await request(app)
      .patch('/api/users/me/role')
      .send({ role: 'passenger' });

    expect(res.status).toBe(401);
  });

  it('returns 400 when role field is missing', async () => {
    const user = await User.create({
      googleId: 'g-004',
      name: 'NoRole',
      email: 'norole@test.com',
      picture: '',
      role: null,
    });
    const token = makeToken(user._id.toString());

    const res = await request(app)
      .patch('/api/users/me/role')
      .set('Cookie', `token=${token}`)
      .send({});

    expect(res.status).toBe(400);
  });
});

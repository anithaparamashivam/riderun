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
  const Request = require('../models/Request');
  await User.deleteMany({});
  await Request.deleteMany({});
});

function makeToken(userId, role = 'passenger') {
  return jwt.sign({ userId, role }, 'test-jwt-secret');
}

const VALID_PICKUP = { lat: 13.0, lng: 80.2, address: '123 Anna Nagar, Chennai' };
const VALID_DEST   = { lat: 12.9, lng: 80.1, address: '456 T. Nagar, Chennai' };
const OUT_OF_BOUNDS = { lat: 15.0, lng: 78.0, address: 'Somewhere far away' };

describe('POST /api/requests (ride)', () => {
  const { app } = require('../index');
  const User = require('../models/User');
  const Request = require('../models/Request');

  it('creates a ride request with correct fields (AC3)', async () => {
    const user = await User.create({ googleId: 'g-1', name: 'Pass', email: 'p@t.com', picture: '', role: 'passenger' });
    const token = makeToken(user._id.toString());

    const res = await request(app)
      .post('/api/requests')
      .set('Cookie', `token=${token}`)
      .send({ type: 'ride', pickupLocation: VALID_PICKUP, destination: VALID_DEST });

    expect(res.status).toBe(201);
    expect(res.body.type).toBe('ride');
    expect(res.body.status).toBe('pending');
    expect(res.body.passengerId).toBe(user._id.toString());
    expect(res.body.pickupLocation.lat).toBe(13.0);

    const doc = await Request.findById(res.body._id);
    expect(doc).not.toBeNull();
    expect(doc.type).toBe('ride');
  });

  it('returns 400 when pickup is outside Chennai bounds (AC2)', async () => {
    const user = await User.create({ googleId: 'g-2', name: 'Pass', email: 'p2@t.com', picture: '', role: 'passenger' });
    const token = makeToken(user._id.toString());

    const res = await request(app)
      .post('/api/requests')
      .set('Cookie', `token=${token}`)
      .send({ type: 'ride', pickupLocation: OUT_OF_BOUNDS, destination: VALID_DEST });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/chennai/i);
  });

  it('returns 400 when destination is outside Chennai bounds (AC2)', async () => {
    const user = await User.create({ googleId: 'g-3', name: 'Pass', email: 'p3@t.com', picture: '', role: 'passenger' });
    const token = makeToken(user._id.toString());

    const res = await request(app)
      .post('/api/requests')
      .set('Cookie', `token=${token}`)
      .send({ type: 'ride', pickupLocation: VALID_PICKUP, destination: OUT_OF_BOUNDS });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/chennai/i);
  });

  it('returns 400 when required fields are missing', async () => {
    const user = await User.create({ googleId: 'g-4', name: 'Pass', email: 'p4@t.com', picture: '', role: 'passenger' });
    const token = makeToken(user._id.toString());

    const res = await request(app)
      .post('/api/requests')
      .set('Cookie', `token=${token}`)
      .send({ type: 'ride' }); // missing locations

    expect(res.status).toBe(400);
  });

  it('returns 401 when not authenticated', async () => {
    const res = await request(app)
      .post('/api/requests')
      .send({ type: 'ride', pickupLocation: VALID_PICKUP, destination: VALID_DEST });
    expect(res.status).toBe(401);
  });
});

describe('Chennai bounds validation', () => {
  const { isInChennai } = require('../lib/chennai');

  it('returns true for coordinates inside Chennai', () => {
    expect(isInChennai({ lat: 13.0, lng: 80.2 })).toBe(true);
  });

  it('returns false for coordinates north of Chennai', () => {
    expect(isInChennai({ lat: 13.5, lng: 80.2 })).toBe(false);
  });

  it('returns false for coordinates south of Chennai', () => {
    expect(isInChennai({ lat: 12.5, lng: 80.2 })).toBe(false);
  });

  it('returns false for coordinates east of Chennai', () => {
    expect(isInChennai({ lat: 13.0, lng: 80.5 })).toBe(false);
  });

  it('returns false for coordinates west of Chennai', () => {
    expect(isInChennai({ lat: 13.0, lng: 79.5 })).toBe(false);
  });
});

describe('POST /api/requests (errand)', () => {
  const { app } = require('../index');
  const User = require('../models/User');
  const Request = require('../models/Request');

  it('creates an errand request with shopName and itemList (AC3)', async () => {
    const user = await User.create({ googleId: 'g-e-1', name: 'Pass', email: 'pe1@t.com', picture: '', role: 'passenger' });
    const token = jwt.sign({ userId: user._id.toString(), role: 'passenger' }, 'test-jwt-secret');

    const res = await request(app)
      .post('/api/requests')
      .set('Cookie', `token=${token}`)
      .send({ type: 'errand', shopName: 'Reliance Fresh', itemList: '2x milk, 1x bread' });

    expect(res.status).toBe(201);
    expect(res.body.type).toBe('errand');
    expect(res.body.shopName).toBe('Reliance Fresh');
    expect(res.body.itemList).toBe('2x milk, 1x bread');

    const doc = await Request.findById(res.body._id);
    expect(doc.type).toBe('errand');
  });

  it('returns 400 when shopName is missing (AC2)', async () => {
    const user = await User.create({ googleId: 'g-e-2', name: 'Pass', email: 'pe2@t.com', picture: '', role: 'passenger' });
    const token = jwt.sign({ userId: user._id.toString(), role: 'passenger' }, 'test-jwt-secret');

    const res = await request(app)
      .post('/api/requests')
      .set('Cookie', `token=${token}`)
      .send({ type: 'errand', itemList: '2x milk' });

    expect(res.status).toBe(400);
  });

  it('returns 400 when itemList is missing (AC2)', async () => {
    const user = await User.create({ googleId: 'g-e-3', name: 'Pass', email: 'pe3@t.com', picture: '', role: 'passenger' });
    const token = jwt.sign({ userId: user._id.toString(), role: 'passenger' }, 'test-jwt-secret');

    const res = await request(app)
      .post('/api/requests')
      .set('Cookie', `token=${token}`)
      .send({ type: 'errand', shopName: 'Reliance Fresh' });

    expect(res.status).toBe(400);
  });
});

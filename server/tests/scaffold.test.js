/**
 * STORY-001: Project Scaffold
 * RED-phase tests — all must fail before implementation exists.
 */
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

describe('Story: Project scaffold — React + Vite + Node.js + Express + MongoDB + Socket.io', () => {
  let mongod;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongod.stop();
  });

  describe('AC3: Mongoose connects to MONGODB_URI and logs result', () => {
    it('connects to in-memory MongoDB without throwing', async () => {
      const { connectDB } = require('../config/db');
      const uri = mongod.getUri();
      await expect(connectDB(uri)).resolves.not.toThrow();
      expect(mongoose.connection.readyState).toBe(1); // 1 = connected
    });

    it('exports a connectDB function', () => {
      const db = require('../config/db');
      expect(typeof db.connectDB).toBe('function');
    });
  });

  describe('AC6: Seed script inserts at least one provider user', () => {
    it('User model has role field accepting passenger|provider', async () => {
      const User = require('../models/User');
      const user = new User({
        googleId: 'test-google-id',
        name: 'Test Provider',
        email: 'provider@test.com',
        picture: '',
        role: 'provider',
        isOnline: false,
      });
      const err = user.validateSync();
      expect(err).toBeUndefined();
    });

    it('User model rejects invalid role values', () => {
      const User = require('../models/User');
      const user = new User({
        googleId: 'test-id-2',
        name: 'Bad Role',
        email: 'bad@test.com',
        role: 'admin',
      });
      const err = user.validateSync();
      expect(err).toBeDefined();
      expect(err.errors.role).toBeDefined();
    });

    it('Request model has type field accepting ride|errand', () => {
      const Request = require('../models/Request');
      const req = new Request({
        type: 'ride',
        passengerId: new mongoose.Types.ObjectId(),
        status: 'pending',
      });
      const err = req.validateSync();
      expect(err).toBeUndefined();
    });

    it('Request model rejects invalid type values', () => {
      const Request = require('../models/Request');
      const req = new Request({
        type: 'taxi',
        passengerId: new mongoose.Types.ObjectId(),
        status: 'pending',
      });
      const err = req.validateSync();
      expect(err).toBeDefined();
      expect(err.errors.type).toBeDefined();
    });
  });

  describe('AC1/AC2: Express server module exports app and starts', () => {
    it('server/index.js exports an httpServer', () => {
      process.env.PORT = '3099';
      process.env.MONGODB_URI = 'mongodb://localhost/test';
      process.env.JWT_SECRET = 'test-secret';
      process.env.SESSION_SECRET = 'test-session';
      process.env.CLIENT_URL = 'http://localhost:5173';
      const { httpServer } = require('../index');
      expect(httpServer).toBeDefined();
      expect(typeof httpServer.listen).toBe('function');
    });
  });
});

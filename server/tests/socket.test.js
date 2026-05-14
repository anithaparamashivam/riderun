process.env.JWT_SECRET = 'test-jwt-secret';
process.env.CLIENT_URL = 'http://localhost:5173';

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { createServer } = require('http');
const { Server } = require('socket.io');
const ioClient = require('socket.io-client');
const jwt = require('jsonwebtoken');

let mongod;
let httpServer;
let io;
let serverPort;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());

  // Start a minimal server with socket handlers
  const express = require('express');
  const app = express();
  httpServer = createServer(app);
  io = new Server(httpServer, { cors: { origin: '*' } });

  // Apply JWT middleware
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error('No token'));
      const payload = jwt.verify(token, 'test-jwt-secret');
      socket.data.userId = payload.userId;
      socket.data.role   = payload.role;
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  // Register handlers
  const registerHandlers = require('../socket/handlers');
  registerHandlers(io);

  await new Promise(resolve => httpServer.listen(0, resolve));
  serverPort = httpServer.address().port;
});

afterAll(async () => {
  await new Promise(resolve => io.close(resolve));
  await new Promise(resolve => httpServer.close(resolve));
  await mongoose.disconnect();
  await mongod.stop();
});

afterEach(async () => {
  const Request = require('../models/Request');
  const User = require('../models/User');
  await Request.deleteMany({});
  await User.deleteMany({});
});

function makeToken(userId, role = 'provider') {
  return jwt.sign({ userId, role }, 'test-jwt-secret');
}

function connectProvider(userId) {
  const token = makeToken(userId.toString());
  return ioClient(`http://localhost:${serverPort}`, {
    auth: { token },
    transports: ['websocket'],
  });
}

describe('Socket: request:accept', () => {
  const Request = require('../models/Request');
  const User = require('../models/User');

  it('updates request status to assigned and sets providerId (AC2)', done => {
    (async () => {
      const provider = await User.create({
        googleId: 'g-s-1', name: 'Provider', email: 'sp@t.com', picture: '', role: 'provider', isOnline: true,
      });
      const passenger = await User.create({
        googleId: 'g-s-2', name: 'Passenger', email: 'pass@t.com', picture: '', role: 'passenger',
      });
      const req = await Request.create({
        type: 'ride',
        status: 'pending',
        passengerId: passenger._id,
        pickupLocation: { lat: 13.0, lng: 80.2, address: 'Pickup' },
        destination:   { lat: 12.9, lng: 80.1, address: 'Dest' },
      });

      const socket = connectProvider(provider._id);
      socket.on('connect', () => {
        socket.emit('request:accept', { requestId: req._id.toString() });
      });

      socket.on('request:accepted', async () => {
        const updated = await Request.findById(req._id);
        expect(updated.status).toBe('assigned');
        expect(updated.providerId.toString()).toBe(provider._id.toString());
        socket.disconnect();
        done();
      });

      socket.on('connect_error', err => { socket.disconnect(); done(err); });
    })();
  });

  it('emits request:decline acknowledgement on decline (AC3)', done => {
    (async () => {
      const provider = await User.create({
        googleId: 'g-s-3', name: 'Provider2', email: 'sp2@t.com', picture: '', role: 'provider', isOnline: true,
      });
      const passenger = await User.create({
        googleId: 'g-s-4', name: 'Pass2', email: 'pass2@t.com', picture: '', role: 'passenger',
      });
      const req = await Request.create({
        type: 'errand',
        status: 'pending',
        passengerId: passenger._id,
        shopName: 'Reliance',
        itemList: '2x milk',
      });

      const socket = connectProvider(provider._id);
      socket.on('connect', () => {
        socket.emit('request:decline', { requestId: req._id.toString() });
      });

      socket.on('request:declined', () => {
        socket.disconnect();
        done();
      });

      socket.on('connect_error', err => { socket.disconnect(); done(err); });
    })();
  });
});

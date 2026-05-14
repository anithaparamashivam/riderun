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

  const express = require('express');
  const app = express();
  httpServer = createServer(app);
  io = new Server(httpServer, { cors: { origin: '*' } });

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

function connect(userId, role = 'provider') {
  const token = jwt.sign({ userId: userId.toString(), role }, 'test-jwt-secret');
  return ioClient(`http://localhost:${serverPort}`, { auth: { token }, transports: ['websocket'] });
}

describe('location:update relay', () => {
  const Request = require('../models/Request');
  const User = require('../models/User');

  it('relays location to passenger when emitted by the assigned provider (AC3)', done => {
    (async () => {
      const passenger = await User.create({ googleId: 'g-l-1', name: 'P', email: 'pl@t.com', picture: '', role: 'passenger' });
      const provider  = await User.create({ googleId: 'g-l-2', name: 'Prov', email: 'prl@t.com', picture: '', role: 'provider' });
      const req = await Request.create({
        type: 'ride', status: 'assigned',
        passengerId: passenger._id,
        providerId:  provider._id,
        pickupLocation: { lat: 13.0, lng: 80.2, address: 'Pickup' },
        destination:   { lat: 12.9, lng: 80.1, address: 'Dest' },
      });

      const passengerSocket = connect(passenger._id, 'passenger');
      const providerSocket  = connect(provider._id,  'provider');

      passengerSocket.on('location:update', ({ lat, lng }) => {
        expect(lat).toBe(13.05);
        expect(lng).toBe(80.15);
        passengerSocket.disconnect();
        providerSocket.disconnect();
        done();
      });

      providerSocket.on('connect', () => {
        providerSocket.emit('location:update', {
          requestId: req._id.toString(),
          lat: 13.05,
          lng: 80.15,
        });
      });

      passengerSocket.on('connect_error', err => { passengerSocket.disconnect(); done(err); });
      providerSocket.on('connect_error', err => { providerSocket.disconnect(); done(err); });
    })();
  });

  it('does not relay when provider is not assigned to the request', done => {
    (async () => {
      const passenger  = await User.create({ googleId: 'g-l-3', name: 'P2', email: 'pl2@t.com', picture: '', role: 'passenger' });
      const provider1  = await User.create({ googleId: 'g-l-4', name: 'Prov2', email: 'prl2@t.com', picture: '', role: 'provider' });
      const provider2  = await User.create({ googleId: 'g-l-5', name: 'Prov3', email: 'prl3@t.com', picture: '', role: 'provider' });
      const req = await Request.create({
        type: 'ride', status: 'assigned',
        passengerId: passenger._id,
        providerId:  provider1._id, // provider1 is assigned, not provider2
        pickupLocation: { lat: 13.0, lng: 80.2, address: 'Pickup' },
        destination:   { lat: 12.9, lng: 80.1, address: 'Dest' },
      });

      const passengerSocket = connect(passenger._id, 'passenger');
      const intruder = connect(provider2._id, 'provider');

      let received = false;
      passengerSocket.on('location:update', () => { received = true; });

      intruder.on('connect', () => {
        intruder.emit('location:update', { requestId: req._id.toString(), lat: 13.0, lng: 80.0 });
        // Wait briefly then verify no event received
        setTimeout(() => {
          expect(received).toBe(false);
          passengerSocket.disconnect();
          intruder.disconnect();
          done();
        }, 200);
      });

      passengerSocket.on('connect_error', err => { passengerSocket.disconnect(); done(err); });
      intruder.on('connect_error', err => { intruder.disconnect(); done(err); });
    })();
  });
});

process.env.JWT_SECRET = 'test-jwt-secret';

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const matchingService = require('../socket/matchingService');
const Request = require('../models/Request');
const User = require('../models/User');

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
  await Request.deleteMany({});
  await User.deleteMany({});
});

function makeIo() {
  const mockEmit = jest.fn();
  const mockTo = jest.fn().mockReturnValue({ emit: mockEmit });
  return {
    to: mockTo,
    emit: mockEmit,
    _mockTo: mockTo,
    _mockEmit: mockEmit,
  };
}

function makeSocket(userId, role = 'provider') {
  return {
    data: { userId, role },
    emit: jest.fn(),
  };
}

describe('matchingService', () => {
  it('emits provider:new-request to providers-online-room on startMatching (AC1)', async () => {
    const io = makeIo();
    matchingService.init(io);

    const passenger = await User.create({ googleId: 'g1', name: 'P', email: 'p@t.com', picture: '', role: 'passenger' });
    const request = await Request.create({
      type: 'ride', status: 'pending', passengerId: passenger._id,
      pickupLocation: { lat: 13.0, lng: 80.2, address: 'Pickup' },
      destination:   { lat: 12.9, lng: 80.1, address: 'Dest' },
    });

    matchingService.startMatching(request);
    matchingService.cleanup(request._id.toString());

    expect(io.to).toHaveBeenCalledWith('providers-online-room');
    expect(io._mockEmit).toHaveBeenCalledWith(
      'provider:new-request',
      expect.objectContaining({ requestId: request._id.toString(), type: 'ride' })
    );
  });

  it('updates request to assigned and notifies both parties on accept (AC2)', async () => {
    const io = makeIo();
    matchingService.init(io);

    const passenger = await User.create({ googleId: 'g2', name: 'P2', email: 'p2@t.com', picture: '', role: 'passenger' });
    const provider  = await User.create({ googleId: 'g3', name: 'Prov', email: 'prov@t.com', picture: '', role: 'provider' });
    const request   = await Request.create({
      type: 'errand', status: 'pending', passengerId: passenger._id,
      shopName: 'Reliance', itemList: '2x milk',
    });

    matchingService.startMatching(request);
    const socket = makeSocket(provider._id.toString());
    await matchingService.handleAccept(socket, { requestId: request._id.toString() });

    const updated = await Request.findById(request._id);
    expect(updated.status).toBe('assigned');
    expect(updated.providerId.toString()).toBe(provider._id.toString());
    expect(socket.emit).toHaveBeenCalledWith('request:accepted', expect.any(Object));
    expect(io.to).toHaveBeenCalledWith(`user:${passenger._id.toString()}`);
  });

  it('ignores late accept when request is already assigned (AC3)', async () => {
    const io = makeIo();
    matchingService.init(io);

    const passenger = await User.create({ googleId: 'g4', name: 'P3', email: 'p3@t.com', picture: '', role: 'passenger' });
    const provider1 = await User.create({ googleId: 'g5', name: 'Prov1', email: 'prov1@t.com', picture: '', role: 'provider' });
    const provider2 = await User.create({ googleId: 'g6', name: 'Prov2', email: 'prov2@t.com', picture: '', role: 'provider' });
    const request   = await Request.create({
      type: 'ride', status: 'pending', passengerId: passenger._id,
      pickupLocation: { lat: 13.0, lng: 80.2, address: 'Pickup' },
      destination:   { lat: 12.9, lng: 80.1, address: 'Dest' },
    });

    matchingService.startMatching(request);

    const socket1 = makeSocket(provider1._id.toString());
    const socket2 = makeSocket(provider2._id.toString());
    await matchingService.handleAccept(socket1, { requestId: request._id.toString() });
    await matchingService.handleAccept(socket2, { requestId: request._id.toString() });

    expect(socket2.emit).not.toHaveBeenCalledWith('request:accepted', expect.any(Object));
  });

  it('sets status to unmatched and notifies passenger after timeout (AC4)', async () => {
    const io = makeIo();
    matchingService.init(io);

    const passenger = await User.create({ googleId: 'g7', name: 'P4', email: 'p4@t.com', picture: '', role: 'passenger' });
    const request   = await Request.create({
      type: 'ride', status: 'pending', passengerId: passenger._id,
      pickupLocation: { lat: 13.0, lng: 80.2, address: 'Pickup' },
      destination:   { lat: 12.9, lng: 80.1, address: 'Dest' },
    });

    matchingService.startMatching(request, 150);
    await new Promise(r => setTimeout(r, 400));

    const updated = await Request.findById(request._id);
    expect(updated.status).toBe('unmatched');
    expect(io.to).toHaveBeenCalledWith(`user:${passenger._id.toString()}`);
  }, 5000);
});

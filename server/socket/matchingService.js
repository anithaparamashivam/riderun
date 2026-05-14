const Request = require('../models/Request');

const DEFAULT_TIMEOUT_MS = 60_000;

let _io = null;
const activeTimers = new Map();

function init(io) {
  _io = io;
}

function startMatching(request, timeoutMs = DEFAULT_TIMEOUT_MS) {
  if (!_io) return;

  const requestId = request._id.toString();

  _io.to('providers-online-room').emit('provider:new-request', {
    requestId,
    type:           request.type,
    pickupLocation: request.pickupLocation ?? null,
    destination:    request.destination    ?? null,
    shopName:       request.shopName       ?? null,
    itemList:       request.itemList       ?? null,
  });

  const timer = setTimeout(async () => {
    activeTimers.delete(requestId);
    try {
      const updated = await Request.findOneAndUpdate(
        { _id: requestId, status: 'pending' },
        { status: 'unmatched' },
        { new: true }
      );
      if (updated && _io) {
        _io.to(`user:${updated.passengerId.toString()}`).emit('request:unmatched', { requestId });
      }
    } catch {
      // Timeout DB update failed — silent in production; observable via DB queries
    }
  }, timeoutMs);

  activeTimers.set(requestId, timer);
}

async function handleAccept(socket, { requestId }) {
  try {
    const updated = await Request.findOneAndUpdate(
      { _id: requestId, status: 'pending' },
      { status: 'assigned', providerId: socket.data.userId },
      { new: true }
    );

    if (!updated) return; // already assigned — ignore late accept (AC3)

    clearTimeout(activeTimers.get(requestId));
    activeTimers.delete(requestId);

    socket.emit('request:accepted', { requestId, request: updated });

    if (_io) {
      _io.to(`user:${updated.passengerId.toString()}`).emit('request:assigned', {
        requestId,
        providerId: socket.data.userId,
      });
    }
  } catch {
    socket.emit('request:error', { message: 'Failed to accept request' });
  }
}

function handleDecline(socket, { requestId }) {
  socket.emit('request:declined', { requestId });
}

function cleanup(requestId) {
  clearTimeout(activeTimers.get(requestId));
  activeTimers.delete(requestId);
}

module.exports = { init, startMatching, handleAccept, handleDecline, cleanup };

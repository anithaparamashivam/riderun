const matchingService = require('./matchingService');
const Request = require('../models/Request');

module.exports = function registerHandlers(io) {
  matchingService.init(io);

  io.on('connection', (socket) => {
    socket.join(`user:${socket.data.userId}`);
    if (socket.data.role === 'provider') socket.join('providers-online-room');

    socket.on('request:accept',  data => matchingService.handleAccept(socket, data));
    socket.on('request:decline', data => matchingService.handleDecline(socket, data));

    socket.on('location:update', async ({ requestId, lat, lng }) => {
      const request = await Request.findById(requestId);
      if (!request) return;
      if (!request.providerId || request.providerId.toString() !== socket.data.userId) return;
      io.to(`user:${request.passengerId.toString()}`).emit('location:update', { lat, lng });
    });

    socket.on('request:completed', async ({ requestId }) => {
      const updated = await Request.findOneAndUpdate(
        { _id: requestId, status: 'assigned', providerId: socket.data.userId },
        { status: 'completed' },
        { new: true }
      );
      if (!updated) return;
      io.to(`user:${updated.passengerId.toString()}`).emit('request:completed', { requestId });
    });
  });
};

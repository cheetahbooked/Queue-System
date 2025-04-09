const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = 3000;

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// In-memory queue
let queue = [];

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Send current queue to new client
  socket.emit('queue_update', queue);

  // Student joins queue
  socket.on('join_queue', (name) => {
    if (!queue.find((entry) => entry.id === socket.id)) {
      queue.push({ id: socket.id, name });
      console.log(`${name} joined the queue`);
      io.emit('queue_update', queue);
    }
  });

  // Student removes self
  socket.on('remove_self', () => {
    queue = queue.filter((entry) => entry.id !== socket.id);
    console.log(`Client ${socket.id} removed themselves`);
    io.emit('queue_update', queue);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    queue = queue.filter((entry) => entry.id !== socket.id);
    console.log(`Client disconnected: ${socket.id}`);
    io.emit('queue_update', queue);
  });
});

// Start server on all network interfaces
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
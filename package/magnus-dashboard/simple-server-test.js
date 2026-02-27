#!/usr/bin/env node

import DashboardServer from './server/dashboard-server.js';

console.log('Starting server...');

const server = new DashboardServer({
  port: 3000,
  host: 'localhost'
});

server.start()
  .then(() => {
    console.log('Server started successfully!');
    console.log('Server instance:', server);
    console.log('Config:', server.config);
  })
  .catch(err => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });

// Keep process alive
setTimeout(() => {
  console.log('Stopping server...');
  server.stop().then(() => {
    console.log('Server stopped');
    process.exit(0);
  });
}, 5000);

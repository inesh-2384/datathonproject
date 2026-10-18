/**
 * FINANCIAL IMMUNE SYSTEM - ENTERPRISE BACKEND SERVICE
 * Port: 3001
 * 
 * Provides:
 * - REST API endpoints
 * - SSE Real-Time Event Pipeline
 * - Deterministic Simulation Engine
 * - Enclave State Persistence
 */

import app from './app';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`=======================================================`);
  console.log(`  FINANCIAL IMMUNE SYSTEM - CONTROL ENCLAVE SERVER`);
  console.log(`  Listening on: http://0.0.0.0:${PORT}`);
  console.log(`  Real-Time Stream: http://0.0.0.0:${PORT}/api/events/stream`);
  console.log(`  Simulation Baseline: Seed 42091 initialized`);
  console.log(`=======================================================`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received. Closing HTTP server...');
  server.close(() => {
    process.exit(0);
  });
});

export { app, server };

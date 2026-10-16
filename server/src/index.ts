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

import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import apiRouter from './routes/api';
import streamRouter from './routes/stream';
import { globalSimulationEngine } from './simulation/engine';

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;

// Production security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

app.use(cors());
app.use(express.json());

// Logging middleware for development observability (Section 21)
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    if (req.path !== '/api/events/stream') {
      console.log(`[FIS-SRV] ${req.method} ${req.path} -> ${res.statusCode} (${Date.now() - start}ms)`);
    }
  });
  next();
});

// Minimal deployment health check (Section 18)
app.get('/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    system: 'Financial Immune System Control Enclave',
    version: '2.4.0-frozen',
    qualification: 'LOCAL_SIMULATION [TARGET: IBM Z TELUM II / LINUXONE]',
    timestamp: new Date().toISOString()
  });
});

// Detailed API health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    system: 'Financial Immune System Control Enclave',
    version: '1.0.0-phase1',
    simulation_clock: globalSimulationEngine.getClock(),
    timestamp: new Date().toISOString()
  });
});

// Mount API routers
app.use('/api', apiRouter);
app.use('/api', streamRouter);

// Serve compiled static assets from dist/ for unified production deployment (Section 4 & 5)
const distPath = path.resolve(process.cwd(), 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

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

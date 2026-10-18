/**
 * FINANCIAL IMMUNE SYSTEM - ENTERPRISE APPLICATION CONFIGURATION
 * 
 * Provides:
 * - Express Application Object
 * - Security & Observability Middlewares
 * - REST API Routes
 * - SSE Real-Time Event Pipeline
 * - Health Check Endpoints
 * - Static SPA Serving (when dist/ exists)
 */

import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import apiRouter from './routes/api';
import streamRouter from './routes/stream';
import { globalSimulationEngine } from './simulation/engine';

const app = express();

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
    if (req.path !== '/api/events/stream' && req.path !== '/events/stream') {
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

// Mount API routers under /api as canonical prefix
// Serverless Session State Middleware:
// Synchronizes active shock state across isolated serverless lambda containers using standard HTTP session cookie or header
app.use((req, res, next) => {
  let activeShock: string | null = null;
  if (req.headers['x-fis-shock']) {
    activeShock = String(req.headers['x-fis-shock']);
  } else if (req.headers.cookie) {
    const cookies = req.headers.cookie.split(';');
    for (const c of cookies) {
      const [key, val] = c.trim().split('=');
      if (key === 'fis_shock' && val) {
        activeShock = decodeURIComponent(val);
        break;
      }
    }
  }

  if (activeShock && activeShock !== 'NORMAL' && activeShock !== 'RESET') {
    const [scenarioId, tickStr] = activeShock.split(':');
    const targetTick = tickStr ? parseInt(tickStr, 10) : 0;
    if (globalSimulationEngine.scenarioState === 'NORMAL') {
      if (['SCENARIO_A', 'SCENARIO_B', 'SCENARIO_C', 'SCENARIO_D'].includes(scenarioId)) {
        globalSimulationEngine.startScenario(scenarioId as any);
        while (globalSimulationEngine.clock.tick < targetTick && globalSimulationEngine.clock.tick < 10) {
          globalSimulationEngine.step();
        }
      }
    }
  }

  next();
});

app.use('/api', apiRouter);
app.use('/api', streamRouter);

// Also mount under root to support serverless rewrites where /api is stripped
app.use('/', apiRouter);
app.use('/', streamRouter);

// Serve compiled static assets from dist/ for unified local/standalone production deployment
const distPath = path.resolve(process.cwd(), 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path === '/health') {
      return next();
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

export default app;

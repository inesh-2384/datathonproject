/**
 * FINANCIAL IMMUNE SYSTEM - REAL-TIME EVENT STREAM (SSE)
 * Section 8: Real-Time Architecture
 * 
 * Provides unified Server-Sent Events channel for:
 * 1. Simulation clock ticks
 * 2. Systemic state transitions
 * 3. Decision & systemic events
 * 4. Intervention lifecycle updates
 * 5. Connection heartbeat & latency measurement
 */

import { Router, Request, Response } from 'express';
import { globalSimulationEngine } from '../simulation/engine';
import { systemStateStore } from '../state/store';
import { globalOperationManager } from '../simulation/operations';

const router = Router();

router.get('/events/stream', (req: Request, res: Response) => {
  // Set headers for SSE
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*'
  });

  // Send immediate initial handshake and current state snapshot
  const initialPayload = {
    type: 'HANDSHAKE',
    timestamp: new Date().toISOString(),
    state: systemStateStore.getState()
  };
  res.write(`data: ${JSON.stringify(initialPayload)}\n\n`);

  // Subscribe to simulation engine events
  const unsubscribeEngine = globalSimulationEngine.subscribe((eventType, payload) => {
    const packet = {
      type: eventType,
      timestamp: new Date().toISOString(),
      payload
    };
    res.write(`data: ${JSON.stringify(packet)}\n\n`);
  });

  // Subscribe to operation lifecycle events
  const unsubscribeOperations = globalOperationManager.subscribe((operation) => {
    const packet = {
      type: 'OPERATION_LIFECYCLE',
      timestamp: new Date().toISOString(),
      payload: operation
    };
    res.write(`data: ${JSON.stringify(packet)}\n\n`);
  });

  // Heartbeat interval (every 3 seconds) to maintain connection and measure ping
  const heartbeat = setInterval(() => {
    const pingPacket = {
      type: 'HEARTBEAT',
      timestamp: new Date().toISOString(),
      tick: globalSimulationEngine.getClock().tick,
      control_margin: globalSimulationEngine.controlState.control_margin_percent
    };
    res.write(`data: ${JSON.stringify(pingPacket)}\n\n`);
  }, 3000);

  // Clean up on client disconnect
  req.on('close', () => {
    clearInterval(heartbeat);
    unsubscribeEngine();
    unsubscribeOperations();
  });
});


export default router;

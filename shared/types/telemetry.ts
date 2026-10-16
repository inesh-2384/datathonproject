/**
 * FINANCIAL IMMUNE SYSTEM - REAL-TIME TELEMETRY PROTOCOL
 * Section 8: Real-Time Architecture & Transport
 * Section 20: Error / Failure States
 */

import { SystemControlState, SystemicEvent, DecisionEvent, Incident, Institution } from './domain';

export type TransportConnectionState = 
  | 'INITIALIZING'
  | 'CONNECTING'
  | 'CONNECTED'
  | 'RECONNECTING'
  | 'DEGRADED'
  | 'STALE'
  | 'OFFLINE';

export type TelemetryChannel = 
  | 'SYSTEM_STATE'
  | 'INCIDENT_STREAM'
  | 'DECISION_FEED'
  | 'SIMULATION_CLOCK'
  | 'INTERVENTION_LIFECYCLE'
  | 'EVIDENCE_SEAL';

export interface TelemetryPacket<T = any> {
  packet_id: string;
  channel: TelemetryChannel;
  timestamp: string;
  payload: T;
  sequence_number: number;
  enclave_signature?: string;
}

export interface StateSyncPayload {
  control_state: SystemControlState;
  active_incidents: Incident[];
  recent_systemic_events: SystemicEvent[];
  recent_decision_events: DecisionEvent[];
  updated_institutions: Institution[];
  simulation_tick: number;
}

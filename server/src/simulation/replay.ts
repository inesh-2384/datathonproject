/**
 * FINANCIAL IMMUNE SYSTEM - DETERMINISTIC REPLAY & STATE FINGERPRINTING
 * Phase 2 Authoritative Replay & State History Buffer
 * 
 * Guarantees:
 * 1. Cryptographic SHA-256 state fingerprint for every simulation tick.
 * 2. Deterministic replay: re-running from identical seed + scenario sequence reproduces exact bit-for-bit hashes.
 * 3. Bidirectional timeline scrubbing (T0, T1, T2...) across all views.
 */

import crypto from 'crypto';
import { ReplayFrame, ScenarioId } from '../../../shared/types/events';

export interface FullFrameData {
  meta: ReplayFrame;
  state: {
    institutions: any[];
    dependencies: any[];
    dataProviders: any[];
    infrastructureNodes: any[];
    aiModels: any[];
    assets: any[];
    incidents: any[];
    controlState: any;
    authoritativeEvents: any[];
  };
}

export class ReplayEngine {
  private frames: Map<number, FullFrameData> = new Map();
  private maxFrames: number = 200;

  /**
   * Generates a deterministic cryptographic fingerprint of current state.
   */
  public generateStateHash(
    seed: number,
    tick: number,
    scenarioId: ScenarioId,
    institutions: any[],
    dependencies: any[],
    controlMargin: number
  ): string {
    const instFingerprint = institutions.map(i => `${i.institution_id}:${i.status}`).sort().join(';');
    const depFingerprint = dependencies.map(d => `${d.dependency_id}:${d.status}`).sort().join(';');
    const payload = `${seed}|${tick}|${scenarioId}|${controlMargin}|${instFingerprint}|${depFingerprint}`;

    return `sha256:${crypto.createHash('sha256').update(payload).digest('hex').substring(0, 16)}`;
  }

  /**
   * Captures and commits an authoritative state frame to the replay buffer.
   */
  public recordFrame(engine: any, summary: string = ''): ReplayFrame {
    const tick = engine.clock.tick;
    const seed = engine.config.seed;
    const scenarioId = engine.activeScenarioId || 'SCENARIO_A';

    const stateHash = this.generateStateHash(
      seed,
      tick,
      scenarioId,
      engine.institutions,
      engine.dependencies,
      engine.controlState.control_margin_percent
    );

    const meta: ReplayFrame = {
      tick,
      virtual_timestamp: engine.clock.virtual_timestamp,
      scenario_id: scenarioId,
      state_hash: stateHash,
      control_margin_percent: engine.controlState.control_margin_percent,
      overall_status: engine.controlState.overall_status,
      active_incident_id: engine.incidents.length > 0 ? engine.incidents[0].incident_id : null,
      events_count: engine.authoritativeEvents.length,
      summary: summary || `Tick ${tick}: ${engine.controlState.overall_status} (Margin: ${engine.controlState.control_margin_percent}%)`
    };

    const fullFrame: FullFrameData = {
      meta,
      state: {
        institutions: JSON.parse(JSON.stringify(engine.institutions)),
        dependencies: JSON.parse(JSON.stringify(engine.dependencies)),
        dataProviders: JSON.parse(JSON.stringify(engine.dataProviders)),
        infrastructureNodes: JSON.parse(JSON.stringify(engine.infrastructureNodes)),
        aiModels: JSON.parse(JSON.stringify(engine.aiModels)),
        assets: JSON.parse(JSON.stringify(engine.assets)),
        incidents: JSON.parse(JSON.stringify(engine.incidents)),
        controlState: JSON.parse(JSON.stringify(engine.controlState)),
        authoritativeEvents: JSON.parse(JSON.stringify(engine.authoritativeEvents))
      }
    };

    this.frames.set(tick, fullFrame);

    // Prune old frames if exceeding buffer limit
    if (this.frames.size > this.maxFrames) {
      const minTick = Math.min(...Array.from(this.frames.keys()));
      this.frames.delete(minTick);
    }

    return meta;
  }

  /**
   * Restores engine state directly to a recorded tick.
   */
  public restoreTick(targetTick: number, engine: any): boolean {
    const frame = this.frames.get(targetTick);
    if (!frame) return false;

    engine.clock.tick = targetTick;
    engine.clock.virtual_timestamp = frame.meta.virtual_timestamp;
    engine.institutions = JSON.parse(JSON.stringify(frame.state.institutions));
    engine.dependencies = JSON.parse(JSON.stringify(frame.state.dependencies));
    engine.dataProviders = JSON.parse(JSON.stringify(frame.state.dataProviders));
    engine.infrastructureNodes = JSON.parse(JSON.stringify(frame.state.infrastructureNodes));
    engine.aiModels = JSON.parse(JSON.stringify(frame.state.aiModels));
    engine.assets = JSON.parse(JSON.stringify(frame.state.assets));
    engine.incidents = JSON.parse(JSON.stringify(frame.state.incidents));
    engine.controlState = JSON.parse(JSON.stringify(frame.state.controlState));
    engine.authoritativeEvents = JSON.parse(JSON.stringify(frame.state.authoritativeEvents));

    return true;
  }

  /**
   * Returns metadata timeline of all recorded frames.
   */
  public getTimeline(): ReplayFrame[] {
    return Array.from(this.frames.values())
      .map(f => f.meta)
      .sort((a, b) => a.tick - b.tick);
  }

  /**
   * Resets the replay buffer.
   */
  public clear(): void {
    this.frames.clear();
  }
}

export const globalReplayEngine = new ReplayEngine();

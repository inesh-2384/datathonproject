/**
 * FINANCIAL IMMUNE SYSTEM - SYSTEM STATE PERSISTENCE STORE
 * Section 4: System State Architecture
 * Section 5: State Transitions
 * 
 * Supports authoritative in-memory state and disk persistence snapshot.
 */

import fs from 'fs';
import path from 'path';
import { globalSimulationEngine } from '../simulation/engine';

const PERSISTENCE_FILE = path.resolve(process.cwd(), '.fis_state_snapshot.json');

export interface FullSystemSnapshot {
  institutions: any[];
  dependencies: any[];
  aiModels: any[];
  assets: any[];
  dataProviders: any[];
  infrastructureNodes: any[];
  incidents: any[];
  controlState: any;
  systemicEvents: any[];
  decisionEvents: any[];
  authoritativeEvents: any[];
  activeScenarioId: string;
  evidenceRecords: any[];
  interventions: any[];
  simulationClock: any;
  simulationConfig: any;
  lastPersistedAt: string;
}

export class SystemStateStore {
  /**
   * Returns current consolidated system state.
   */
  public getState(): FullSystemSnapshot {
    return {
      institutions: globalSimulationEngine.institutions,
      dependencies: globalSimulationEngine.dependencies,
      aiModels: globalSimulationEngine.aiModels,
      assets: globalSimulationEngine.assets,
      dataProviders: globalSimulationEngine.dataProviders,
      infrastructureNodes: globalSimulationEngine.infrastructureNodes,
      incidents: globalSimulationEngine.incidents,
      controlState: globalSimulationEngine.controlState,
      systemicEvents: globalSimulationEngine.systemicEvents,
      decisionEvents: globalSimulationEngine.decisionEvents,
      authoritativeEvents: globalSimulationEngine.authoritativeEvents,
      activeScenarioId: globalSimulationEngine.activeScenarioId,
      evidenceRecords: globalSimulationEngine.evidenceRecords,
      interventions: globalSimulationEngine.interventions,
      simulationClock: globalSimulationEngine.getClock(),
      simulationConfig: globalSimulationEngine.getConfig(),
      lastPersistedAt: new Date().toISOString()
    };
  }

  /**
   * Persists current state snapshot to disk.
   */
  public persistToDisk(): void {
    try {
      const state = this.getState();
      fs.writeFileSync(PERSISTENCE_FILE, JSON.stringify(state, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to persist FIS state to disk:', err);
    }
  }

  /**
   * Cleans persistent file on baseline reset.
   */
  public clearPersistence(): void {
    try {
      if (fs.existsSync(PERSISTENCE_FILE)) {
        fs.unlinkSync(PERSISTENCE_FILE);
      }
    } catch (err) {
      console.error('Failed to clear persistence file:', err);
    }
  }
}

export const systemStateStore = new SystemStateStore();

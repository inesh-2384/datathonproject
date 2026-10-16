/**
 * FINANCIAL IMMUNE SYSTEM - OPERATION LIFECYCLE MANAGER
 * Phase 2 Authoritative Operation Lifecycle & Observability
 * 
 * Lifecycle States:
 * IDLE -> QUEUED -> RUNNING -> PROCESSING -> COMPLETED
 * Failure: PROCESSING -> FAILED
 * Partial: PROCESSING -> PARTIAL
 * Reassessment: COMPLETED -> REASSESSMENT_REQUIRED
 * 
 * Invariants:
 * 1. Observable telemetry for every meaningful action.
 * 2. Guard against duplicate / conflicting concurrent operations (HTTP 409).
 * 3. Never silently report success on failure.
 * 4. Truth label explicitly tracked.
 */

export type OperationLifecycleStatus = 
  | 'IDLE' 
  | 'QUEUED' 
  | 'RUNNING' 
  | 'PROCESSING' 
  | 'COMPLETED' 
  | 'FAILED' 
  | 'PARTIAL' 
  | 'REASSESSMENT_REQUIRED';

export type OperationType = 
  | 'SCENARIO_INJECTION'
  | 'SIMULATION_STEP'
  | 'INTERVENTION_PROPOSAL'
  | 'INTERVENTION_EXECUTION'
  | 'SIMULATION_RESET'
  | 'REPLAY_SCRUB'
  | 'INTEGRITY_VERIFICATION';

export interface OperationTelemetry {
  operation_id: string;
  operation_type: OperationType;
  status: OperationLifecycleStatus;
  incident_id?: string;
  tick: number;
  source_entity_id?: string;
  affected_entity_ids: string[];
  previous_state_summary: string;
  new_state_summary?: string;
  duration_ms: number;
  started_at: string;
  completed_at?: string;
  error_message?: string;
  data_truth_label: 'IMPLEMENTED' | 'DERIVED' | 'SIMULATED' | 'EXPERIMENTAL' | 'CALIBRATED' | 'ARCHITECTED' | 'IBM_INTEGRATED';
}

class OperationLifecycleManager {
  private activeOperation: OperationTelemetry | null = null;
  private operationHistory: OperationTelemetry[] = [];
  private listeners: Array<(op: OperationTelemetry) => void> = [];

  public getActiveOperation(): OperationTelemetry | null {
    return this.activeOperation ? { ...this.activeOperation } : null;
  }

  public getRecentOperations(limit: number = 20): OperationTelemetry[] {
    return [...this.operationHistory].reverse().slice(0, limit);
  }

  public getOperationById(operationId: string): OperationTelemetry | null {
    if (this.activeOperation && this.activeOperation.operation_id === operationId) {
      return { ...this.activeOperation };
    }
    const found = this.operationHistory.find(o => o.operation_id === operationId);
    return found ? { ...found } : null;
  }

  public subscribe(listener: (op: OperationTelemetry) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify(op: OperationTelemetry): void {
    for (const l of this.listeners) {
      try {
        l({ ...op });
      } catch (err) {
        console.error('Operation listener notification error:', err);
      }
    }
  }

  /**
   * Starts a new operation. Throws error if a conflicting operation is currently in progress.
   */
  public beginOperation(
    type: OperationType,
    details: {
      tick: number;
      incident_id?: string;
      source_entity_id?: string;
      affected_entity_ids?: string[];
      previous_state_summary: string;
    }
  ): OperationTelemetry {
    // Check for duplicate / concurrent running operation
    if (this.activeOperation && ['QUEUED', 'RUNNING', 'PROCESSING'].includes(this.activeOperation.status)) {
      const elapsed = Date.now() - new Date(this.activeOperation.started_at).getTime();
      // If previous operation is less than 3000ms old and still in flight, reject duplicate
      if (elapsed < 3000) {
        const error = new Error(`Operation conflict: Operation ${this.activeOperation.operation_id} (${this.activeOperation.operation_type}) is currently ${this.activeOperation.status}.`);
        (error as any).status = 409;
        throw error;
      }
    }

    const opId = `OP-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 1000)}`;
    const now = new Date().toISOString();

    const op: OperationTelemetry = {
      operation_id: opId,
      operation_type: type,
      status: 'QUEUED',
      incident_id: details.incident_id,
      tick: details.tick,
      source_entity_id: details.source_entity_id,
      affected_entity_ids: details.affected_entity_ids || [],
      previous_state_summary: details.previous_state_summary,
      duration_ms: 0,
      started_at: now,
      data_truth_label: 'SIMULATED'
    };

    this.activeOperation = op;
    this.notify(op);

    // Transition to RUNNING
    op.status = 'RUNNING';
    this.notify(op);

    return op;
  }

  /**
   * Transitions active operation to PROCESSING
   */
  public transitionProcessing(opId: string): void {
    if (this.activeOperation && this.activeOperation.operation_id === opId) {
      this.activeOperation.status = 'PROCESSING';
      this.notify(this.activeOperation);
    }
  }

  /**
   * Completes an operation successfully or with partial/reassessment status
   */
  public completeOperation(
    opId: string,
    result: {
      new_state_summary: string;
      affected_entity_ids?: string[];
      status?: 'COMPLETED' | 'PARTIAL' | 'REASSESSMENT_REQUIRED';
    }
  ): OperationTelemetry {
    const op = this.activeOperation;
    if (!op || op.operation_id !== opId) {
      const pastOp = this.operationHistory.find(o => o.operation_id === opId);
      if (pastOp) return pastOp;
      throw new Error(`Cannot complete unknown operation: ${opId}`);
    }

    const now = new Date();
    const duration = now.getTime() - new Date(op.started_at).getTime();

    op.status = result.status || 'COMPLETED';
    op.new_state_summary = result.new_state_summary;
    if (result.affected_entity_ids) {
      op.affected_entity_ids = result.affected_entity_ids;
    }
    op.duration_ms = duration;
    op.completed_at = now.toISOString();

    this.operationHistory.push({ ...op });
    if (this.operationHistory.length > 100) this.operationHistory.shift();

    this.notify(op);
    this.activeOperation = null;
    return op;
  }

  /**
   * Fails an operation with error details
   */
  public failOperation(opId: string, errorMessage: string): OperationTelemetry {
    const op = this.activeOperation;
    if (!op || op.operation_id !== opId) {
      throw new Error(`Cannot fail unknown operation: ${opId}`);
    }

    const now = new Date();
    const duration = now.getTime() - new Date(op.started_at).getTime();

    op.status = 'FAILED';
    op.error_message = errorMessage;
    op.duration_ms = duration;
    op.completed_at = now.toISOString();

    this.operationHistory.push({ ...op });
    if (this.operationHistory.length > 100) this.operationHistory.shift();

    this.notify(op);
    this.activeOperation = null;
    return op;
  }
}

export const globalOperationManager = new OperationLifecycleManager();

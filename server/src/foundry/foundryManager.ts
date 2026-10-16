/**
 * FINANCIAL IMMUNE SYSTEM - CONTROL FOUNDRY MANAGER (PHASE 4)
 * Section 3 & 4: Phase 4 Closed-Loop Controller & State Machine Manager
 * 
 * Canonical Closed Operational Loop:
 * INTELLIGENCE -> RECOMMENDATION -> AUTHORITY CHECK -> AUTHORIZATION -> 
 * EXECUTION -> INDEPENDENT OBSERVATION -> VERIFICATION -> OUTCOME -> REASSESSMENT
 */

import { 
  FoundryWorkspaceState, 
  InterventionCandidate, 
  InterventionConstraint, 
  InterventionWindow, 
  AuthorizationRequest,
  AuthorizationDecision, 
  ExecutionRecord, 
  IndependentObservationRecord,
  VerificationRecord, 
  ReassessmentRecord,
  RollbackRecord,
  AuditTrailEvent,
  InterventionLifecycleState
} from '../../../shared/types/foundry';
import { UserRole, ROLE_PERMISSIONS_REGISTRY } from '../../../shared/types/roles';
import { generateInterventionCandidates } from './candidateGenerator';
import { evaluateCounterfactuals } from './counterfactualEvaluator';
import { GovernedExecutionBus } from './governedExecutionBus';
import { IndependentVerifier } from './independentVerifier';

export class ControlFoundryManager {
  private currentLifecycleState: InterventionLifecycleState = 'CANDIDATE';
  private activeCandidateId: string | null = null;
  private activeAuthorizationRequest: AuthorizationRequest | null = null;
  private activeAuthorizationDecision: AuthorizationDecision | null = null;
  private authorizationHistory: AuthorizationDecision[] = [];
  private latestExecution: ExecutionRecord | null = null;
  private latestObservation: IndependentObservationRecord | null = null;
  private latestVerification: VerificationRecord | null = null;
  private activeReassessment: ReassessmentRecord | null = null;
  private activeRollback: RollbackRecord | null = null;
  private auditTrail: AuditTrailEvent[] = [];
  private lastEvaluatedPreMargin: number = 91;

  private constraints: InterventionConstraint = {
    max_disruption_budget_pct: 50,
    min_control_restoration_pct: 65,
    max_latency_sec: 45,
    max_collateral_exposure_pct: 30,
    required_reversibility: 'HIGH'
  };

  /**
   * Records an audit event into the chronological timeline.
   */
  private recordAudit(
    eventType: string,
    actorRole: string,
    actorId: string,
    lifecycleState: InterventionLifecycleState,
    interventionId: string,
    details: string,
    evidenceDigest?: string
  ): void {
    const auditEvent: AuditTrailEvent = {
      audit_id: `AUD-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
      timestamp: new Date().toISOString(),
      event_type: eventType,
      actor_role: actorRole,
      actor_id: actorId,
      lifecycle_state: lifecycleState,
      intervention_id: interventionId,
      details,
      evidence_digest: evidenceDigest
    };
    this.auditTrail.unshift(auditEvent);
  }

  /**
   * Generates or refreshes the live workspace state against current simulation engine state.
   */
  public getWorkspaceState(engine: any): FoundryWorkspaceState {
    const controlMargin = engine.controlState.control_margin_percent;
    const activeIncident = engine.incidents.find((i: any) => i.status === 'ACTIVE' || i.status === 'CONTAINING') || null;
    const propIntel = engine.controlState.intelligence?.propagation_intelligence;
    const hops = propIntel?.maximum_depth_hops || 0;
    const affectedCount = propIntel?.breadth_affected_nodes || 0;
    const diversity = engine.controlState.intelligence?.collective_decision_signal?.effective_decision_diversity || 0.88;
    const windowSec = engine.controlState.intervention_window_seconds || 60;

    // Available if threat is active, or control margin degraded below 80, or active incident
    const isAvailable = controlMargin < 80 || activeIncident !== null || engine.controlState.overall_status !== 'STABLE';

    // Generate candidates
    const candidates = generateInterventionCandidates(
      activeIncident,
      engine.institutions,
      engine.dependencies,
      engine.dataProviders,
      engine.infrastructureNodes,
      engine.aiModels,
      controlMargin,
      engine.activeScenarioId
    );

    // Run counterfactual evaluations
    const { evaluations, recommendation } = evaluateCounterfactuals(
      candidates,
      controlMargin,
      hops,
      affectedCount,
      diversity,
      windowSec,
      this.constraints,
      activeIncident
    );

    // Synchronize statuses
    for (const cand of candidates) {
      if (cand.id === this.activeCandidateId) {
        cand.status = this.currentLifecycleState;
      } else if (recommendation && cand.id === recommendation.recommended_candidate_id) {
        cand.status = this.currentLifecycleState === 'CANDIDATE' ? 'RECOMMENDED' : cand.status;
      }
    }

    const window: InterventionWindow = {
      window_id: `WIN-${Date.now().toString(36).toUpperCase()}`,
      status: windowSec > 15 ? 'OPEN' : (windowSec > 0 ? 'CLOSING' : 'EXPIRED'),
      remaining_seconds: windowSec,
      degradation_rate_pts_per_sec: +(Math.max(0.2, (91 - controlMargin) / 120)).toFixed(2),
      unrecoverable_horizon_timestamp: new Date(Date.now() + windowSec * 1000).toISOString(),
      truth_status: 'SIMULATED_VARIABLE'
    };

    return {
      is_available: isAvailable,
      active_incident_id: activeIncident?.incident_id || null,
      lifecycle_state: this.currentLifecycleState,
      intervention_window: window,
      constraints: this.constraints,
      candidates,
      evaluations,
      recommendation,
      active_authorization_request: this.activeAuthorizationRequest,
      active_authorization_decision: this.activeAuthorizationDecision,
      authorization_history: this.authorizationHistory,
      latest_execution: this.latestExecution,
      latest_observation: this.latestObservation,
      latest_verification: this.latestVerification,
      active_reassessment: this.activeReassessment,
      active_rollback: this.activeRollback,
      audit_trail: this.auditTrail,
      last_updated_at: new Date().toISOString()
    };
  }

  /**
   * Request authorization for a candidate (e.g. by ANALYST or RISK_ANALYST).
   */
  public requestAuthorization(
    candidateId: string,
    requesterRole: UserRole,
    requesterUserId: string,
    engine: any
  ): AuthorizationRequest {
    const workspace = this.getWorkspaceState(engine);
    const candidate = workspace.candidates.find(c => c.id === candidateId);
    if (!candidate) {
      throw new Error(`Candidate with ID ${candidateId} not found`);
    }

    const reqId = `REQ-${candidate.id}-${Date.now().toString(36).toUpperCase()}`;
    const timestamp = new Date().toISOString();
    const expiresAt = new Date(Date.now() + 60000).toISOString();

    const request: AuthorizationRequest = {
      request_id: reqId,
      candidate_id: candidate.id,
      incident_id: candidate.incident_id,
      requester_user_id: requesterUserId,
      requester_role: requesterRole,
      required_role: candidate.authority_required,
      requested_at: timestamp,
      expires_at: expiresAt,
      policy_eval_result: {
        role_authorized: true,
        window_active: workspace.intervention_window.status !== 'EXPIRED',
        evidence_sufficient: candidate.evidence_sufficiency !== 'INSUFFICIENT',
        reasons: ['Valid intervention request submitted to governance board.']
      }
    };

    this.activeCandidateId = candidateId;
    this.activeAuthorizationRequest = request;
    this.currentLifecycleState = 'AUTHORIZATION_PENDING';

    this.recordAudit(
      'AUTHORIZATION_REQUESTED',
      requesterRole,
      requesterUserId,
      'AUTHORIZATION_PENDING',
      candidate.id,
      `Authorization requested by ${requesterRole} for ${candidate.title}. Required authority: ${candidate.authority_required}.`
    );

    return request;
  }

  /**
   * Authorize a candidate intervention (enforces separation of duties and role permissions).
   */
  public authorize(
    candidateId: string,
    userRole: UserRole,
    userId: string,
    engine: any,
    justification?: string
  ): { success: boolean; error?: string; decision: AuthorizationDecision } {
    const workspace = this.getWorkspaceState(engine);
    const candidate = workspace.candidates.find(c => c.id === candidateId);
    if (!candidate) {
      throw new Error(`Candidate with ID ${candidateId} not found`);
    }

    const res = GovernedExecutionBus.authorizeIntervention(
      candidate,
      userRole,
      userId,
      justification || `Authorized by [${userRole}] for incident ${candidate.incident_id}`
    );

    this.activeCandidateId = candidateId;
    this.activeAuthorizationDecision = res.decision;
    this.authorizationHistory.unshift(res.decision);
    this.lastEvaluatedPreMargin = engine.controlState.control_margin_percent;

    if (res.success) {
      this.currentLifecycleState = 'AUTHORIZED';
      this.recordAudit(
        'INTERVENTION_AUTHORIZED',
        userRole,
        userId,
        'AUTHORIZED',
        candidate.id,
        `Authorization granted by ${userRole} (${userId}). Cryptographic Seal: ${res.decision.cryptographic_seal_sha256}`,
        res.decision.cryptographic_seal_sha256
      );

      // Emit authoritative event
      engine.authoritativeEvents.unshift({
        event_id: `EVT-AUTH-${Date.now()}`,
        tick: engine.clock.tick,
        simulation_timestamp: engine.clock.virtual_timestamp,
        event_type: 'INTERVENTION_AUTHORIZED',
        severity: 'INFO',
        source_entity_id: 'CONTROL_FOUNDRY',
        causal_chain_id: `CHAIN-${candidate.incident_id}`,
        state_deltas: [],
        causal_narrative: `AUTHORIZATION GRANTED: [${candidate.title}] authorized by role ${userRole} (${userId}).`,
        systemic_impact: { control_margin_delta: 0, stability_delta: 0 }
      });
    } else {
      this.currentLifecycleState = 'REJECTED';
      this.recordAudit(
        'AUTHORIZATION_REJECTED',
        userRole,
        userId,
        'REJECTED',
        candidate.id,
        res.error || 'Authorization rejected by policy validation.'
      );
    }

    return res;
  }

  /**
   * Governed Execution & Independent Verification closed loop.
   */
  public execute(
    candidateId: string,
    executorRole: UserRole,
    executorUserId: string,
    engine: any,
    options?: {
      idempotencyKey?: string;
      forceTechnicalFailure?: boolean;
      forceStaleEvidence?: boolean;
      forceConflictingTelemetry?: boolean;
      forceDownstreamContagion?: boolean;
      forcePartialRecovery?: boolean;
    }
  ): { 
    execution: ExecutionRecord; 
    observation: IndependentObservationRecord | null;
    verification: VerificationRecord | null; 
    reassessment: ReassessmentRecord | null 
  } {
    const workspace = this.getWorkspaceState(engine);
    const candidate = workspace.candidates.find(c => c.id === candidateId);
    if (!candidate) {
      throw new Error(`Candidate with ID ${candidateId} not found`);
    }

    if (!this.activeAuthorizationDecision || this.activeAuthorizationDecision.candidate_id !== candidateId) {
      throw new Error(`Candidate ${candidateId} has not been authorized. Cannot execute without authorization.`);
    }

    if (this.activeAuthorizationDecision.decision !== 'AUTHORIZED') {
      throw new Error(`Cannot execute candidate ${candidateId}: Authorization status is ${this.activeAuthorizationDecision.decision}. Execution blocked.`);
    }

    this.currentLifecycleState = 'EXECUTING';
    const preMargin = engine.controlState.control_margin_percent;
    this.lastEvaluatedPreMargin = preMargin;

    // 1. Dispatch Governed Execution
    const { execution, events } = GovernedExecutionBus.dispatchExecution(
      candidate,
      this.activeAuthorizationDecision,
      engine,
      executorRole,
      executorUserId,
      options?.idempotencyKey,
      options?.forceTechnicalFailure
    );
    this.latestExecution = execution;

    for (const evt of events) {
      engine.authoritativeEvents.unshift(evt);
    }

    if (execution.status === 'EXECUTION_FAILED') {
      this.currentLifecycleState = 'EXECUTION_FAILED';
      this.recordAudit(
        'EXECUTION_FAILED',
        executorRole,
        executorUserId,
        'EXECUTION_FAILED',
        candidate.id,
        execution.technical_error || 'Technical execution failed at dispatch gateway.'
      );
      return { execution, observation: null, verification: null, reassessment: null };
    }

    this.currentLifecycleState = 'EXECUTED';
    this.recordAudit(
      'INTERVENTION_EXECUTED',
      executorRole,
      executorUserId,
      'EXECUTED',
      candidate.id,
      `Technical execution completed. Applied ${execution.state_deltas_applied_count} topology deltas. Telemetry Receipt: ${execution.telemetry_receipt_digest_sha256}`,
      execution.telemetry_receipt_digest_sha256
    );

    // 2. Advance engine simulation state (recomputing Phase 3 intelligence from topology)
    engine.step();

    // 3. Perform Independent Observation & Verification
    this.currentLifecycleState = 'VERIFICATION_PENDING';
    const { observation, verification, reassessment, events: verifEvents } = IndependentVerifier.verifyOutcome(
      candidate,
      execution,
      engine,
      preMargin,
      options
    );

    this.latestObservation = observation;
    this.latestVerification = verification;
    this.activeReassessment = reassessment;

    for (const vEvt of verifEvents) {
      engine.authoritativeEvents.unshift(vEvt);
    }

    // 4. Update Lifecycle State based on Independent Verification outcome
    this.currentLifecycleState = verification.verification_result;
    this.recordAudit(
      verification.verification_result,
      'INDEPENDENT_ENCLAVE_VERIFIER',
      'ENCLAVE-VERIFIER-01',
      this.currentLifecycleState,
      candidate.id,
      verification.verification_report,
      verification.evidence_record_ids[0]
    );

    // 5. If Reassessment triggered, transition to REASSESSED
    if (reassessment) {
      this.recordAudit(
        'REASSESSMENT_COMPLETED',
        'INDEPENDENT_ENCLAVE_VERIFIER',
        'ENCLAVE-VERIFIER-01',
        'REASSESSED',
        candidate.id,
        `Reassessment complete. Post-reassessment Margin: ${reassessment.post_reassessment_margin}%. Escalation target: ${reassessment.escalated_candidate_id}`
      );
    }

    if (engine.controlState) {
      engine.controlState.foundry = this.getWorkspaceState(engine);
    }

    return { execution, observation, verification, reassessment };
  }

  /**
   * Governed Rollback for reversible interventions.
   */
  public rollback(
    candidateId: string,
    authorizerRole: UserRole,
    executorRole: UserRole,
    engine: any,
    justification?: string
  ): { success: boolean; error?: string; rollbackRecord: RollbackRecord } {
    const workspace = this.getWorkspaceState(engine);
    const candidate = workspace.candidates.find(c => c.id === candidateId);
    if (!candidate) {
      throw new Error(`Candidate with ID ${candidateId} not found`);
    }

    if (!this.latestExecution) {
      throw new Error(`No active execution record found for candidate ${candidateId}`);
    }

    const res = GovernedExecutionBus.rollbackIntervention(
      candidate,
      this.latestExecution,
      engine,
      authorizerRole,
      executorRole,
      justification
    );

    this.activeRollback = res.rollbackRecord;

    if (res.success) {
      this.currentLifecycleState = 'ROLLED_BACK';
      for (const evt of res.events) {
        engine.authoritativeEvents.unshift(evt);
      }
      engine.step(); // Recompute intelligence after rollback

      this.recordAudit(
        'INTERVENTION_ROLLED_BACK',
        executorRole,
        `USR-${executorRole}`,
        'ROLLED_BACK',
        candidate.id,
        `Intervention rolled back. Reverted ${res.rollbackRecord.deltas_reverted_count} topology deltas.`
      );
    } else {
      this.currentLifecycleState = 'ROLLBACK_FAILED';
      this.recordAudit(
        'ROLLBACK_FAILED',
        executorRole,
        `USR-${executorRole}`,
        'ROLLBACK_FAILED',
        candidate.id,
        res.error || 'Rollback rejected by policy.'
      );
    }

    return res;
  }

  /**
   * Resets the Foundry state when the simulation resets.
   */
  public reset(): void {
    this.currentLifecycleState = 'CANDIDATE';
    this.activeCandidateId = null;
    this.activeAuthorizationRequest = null;
    this.activeAuthorizationDecision = null;
    this.authorizationHistory = [];
    this.latestExecution = null;
    this.latestObservation = null;
    this.latestVerification = null;
    this.activeReassessment = null;
    this.activeRollback = null;
    this.auditTrail = [];
    this.lastEvaluatedPreMargin = 91;
    GovernedExecutionBus.reset();
  }
}

export const globalFoundryManager = new ControlFoundryManager();

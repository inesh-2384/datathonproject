/**
 * FINANCIAL IMMUNE SYSTEM - GOVERNED EXECUTION BUS (PHASE 4)
 * Sections 8, 9, 10, 11, 26, 27, 30, 31, 32: Governed Execution, RBAC, Cryptographic Seals & Failure Modes
 * 
 * Strict Invariants:
 * 1. Recommendation != Authorization
 * 2. Authorization != Execution
 * 3. Execution != Confirmation
 * 4. Technical execution can succeed even if outcome recovery fails.
 * 5. Role permissions strictly verified server-side against ROLE_PERMISSIONS_REGISTRY.
 * 6. Separation of duties:
 *    - ANALYST cannot execute.
 *    - SYSTEM_OPERATOR cannot self-authorize.
 *    - AUDITOR cannot mutate incident state.
 * 7. Expired or rejected authorizations cannot execute.
 * 8. Reversible interventions can be rolled back; irreversible actions cannot.
 * 9. Idempotency prevents duplicate execution.
 */

import crypto from 'crypto';
import { 
  InterventionCandidate, 
  AuthorizationRequest, 
  AuthorizationDecision, 
  ExecutionRecord,
  RollbackRecord,
  InterventionLifecycleState
} from '../../../shared/types/foundry';
import { UserRole, ROLE_PERMISSIONS_REGISTRY } from '../../../shared/types/roles';
import { AuthoritativeEvent } from '../../../shared/types/events';

interface CachedExecution {
  execution: ExecutionRecord;
  events: AuthoritativeEvent[];
  revertedDeltas?: any[];
}

export class GovernedExecutionBus {
  // In-memory idempotency cache keyed by idempotency_key or candidate_id
  private static idempotencyCache: Map<string, CachedExecution> = new Map();
  // Active executed interventions with applied deltas (for rollback)
  private static executionHistory: Map<string, { candidate: InterventionCandidate; deltas: any[]; reverted: boolean }> = new Map();

  /**
   * Resets internal bus state (for simulation reset).
   */
  public static reset(): void {
    this.idempotencyCache.clear();
    this.executionHistory.clear();
  }

  /**
   * Section 8 & 9: Evaluates policy and processes an authorization request.
   * Enforces server-side separation of duties:
   * - SYSTEM_OPERATOR cannot self-authorize.
   * - ANALYST cannot authorize.
   * - AUDITOR and OBSERVER cannot authorize.
   */
  public static authorizeIntervention(
    candidate: InterventionCandidate,
    userRole: UserRole,
    userId: string,
    justification: string = 'Authorized by enclave operations console.',
    validityWindowMs: number = 60000 // 60-second default validity window
  ): {
    success: boolean;
    error?: string;
    decision: AuthorizationDecision;
  } {
    const timestamp = new Date().toISOString();
    const expiresAt = new Date(Date.now() + validityWindowMs).toISOString();
    const requestId = `REQ-${candidate.id}-${Date.now().toString(36).toUpperCase()}`;

    // RULE 1: SYSTEM_OPERATOR cannot self-authorize (Separation of duties)
    if (userRole === 'SYSTEM_OPERATOR') {
      const decision: AuthorizationDecision = {
        decision_id: `DEC-REJ-${Date.now().toString(36).toUpperCase()}`,
        request_id: requestId,
        candidate_id: candidate.id,
        decision: 'REJECTED',
        decided_by_user_id: userId,
        decided_by_role: userRole,
        decided_at: timestamp,
        expires_at: expiresAt,
        justification_notes: `REJECTED: SYSTEM_OPERATOR cannot self-authorize interventions (Separation of Duties). Authorization must be granted by INCIDENT_COMMANDER or RISK_OFFICER.`,
        cryptographic_seal_sha256: crypto.createHash('sha256').update(`${requestId}:SEPARATION_OF_DUTIES_REJECTED:${userRole}`).digest('hex')
      };

      return {
        success: false,
        error: `Separation of Duties Violation: SYSTEM_OPERATOR cannot self-authorize intervention ${candidate.id}. Must be authorized by INCIDENT_COMMANDER, RISK_OFFICER, or COMPLIANCE_OFFICER.`,
        decision
      };
    }

    // RULE 2: Role must have can_authorize_interventions privilege
    const permissions = ROLE_PERMISSIONS_REGISTRY[userRole];
    if (!permissions || !permissions.can_authorize_interventions) {
      const decision: AuthorizationDecision = {
        decision_id: `DEC-REJ-${Date.now().toString(36).toUpperCase()}`,
        request_id: requestId,
        candidate_id: candidate.id,
        decision: 'REJECTED',
        decided_by_user_id: userId,
        decided_by_role: userRole,
        decided_at: timestamp,
        expires_at: expiresAt,
        justification_notes: `REJECTED: Role [${userRole}] lacks authorization permissions.`,
        cryptographic_seal_sha256: crypto.createHash('sha256').update(`${requestId}:UNAUTHORIZED_ROLE:${userRole}`).digest('hex')
      };

      return {
        success: false,
        error: `Unauthorized: Role ${userRole} cannot authorize interventions.`,
        decision
      };
    }

    // RULE 3: Check Authority Level against candidate.authority_required
    // INCIDENT_COMMANDER can authorize operational and systemic interventions
    // RISK_OFFICER can authorize risk limits and exposure interventions
    // COMPLIANCE_OFFICER can authorize compliance/regulatory interventions
    const isAuthorizedRole = 
      userRole === 'INCIDENT_COMMANDER' ||
      userRole === 'COMPLIANCE_OFFICER' ||
      (candidate.authority_required === 'RISK_OFFICER' && userRole === 'RISK_OFFICER') ||
      (userRole === candidate.authority_required);

    if (!isAuthorizedRole) {
      const decision: AuthorizationDecision = {
        decision_id: `DEC-REJ-${Date.now().toString(36).toUpperCase()}`,
        request_id: requestId,
        candidate_id: candidate.id,
        decision: 'REJECTED',
        decided_by_user_id: userId,
        decided_by_role: userRole,
        decided_at: timestamp,
        expires_at: expiresAt,
        justification_notes: `REJECTED: User role [${userRole}] lacks required authority [${candidate.authority_required}] for ${candidate.type}.`,
        cryptographic_seal_sha256: crypto.createHash('sha256').update(`${requestId}:REJECTED:${userRole}`).digest('hex')
      };

      return {
        success: false,
        error: `Unauthorized: Role ${userRole} lacks authority level required (${candidate.authority_required}) for ${candidate.id}`,
        decision
      };
    }

    // RULE 4: Check Assurance Constraints
    if (candidate.assurance_eligibility === 'BLOCKED') {
      const decision: AuthorizationDecision = {
        decision_id: `DEC-REJ-${Date.now().toString(36).toUpperCase()}`,
        request_id: requestId,
        candidate_id: candidate.id,
        decision: 'REJECTED',
        decided_by_user_id: userId,
        decided_by_role: userRole,
        decided_at: timestamp,
        expires_at: expiresAt,
        justification_notes: `REJECTED: Candidate blocked by assurance constraints: ${candidate.assurance_blocked_reason || 'INSUFFICIENT ASSURANCE'}`,
        cryptographic_seal_sha256: crypto.createHash('sha256').update(`${requestId}:BLOCKED_ASSURANCE:${candidate.id}`).digest('hex')
      };

      return {
        success: false,
        error: `Blocked by Assurance Constraints: ${candidate.assurance_blocked_reason || 'INSUFFICIENT ASSURANCE'}`,
        decision
      };
    }

    // RULE 5: Generate Cryptographic Authorization Seal
    const sealPayload = `${requestId}:${candidate.id}:${userId}:${userRole}:${candidate.expected_control_margin_delta}:${timestamp}:${expiresAt}`;
    const sealHash = crypto.createHash('sha256').update(sealPayload).digest('hex');

    const decision: AuthorizationDecision = {
      decision_id: `DEC-AUTH-${Date.now().toString(36).toUpperCase()}`,
      request_id: requestId,
      candidate_id: candidate.id,
      decision: 'AUTHORIZED',
      decided_by_user_id: userId,
      decided_by_role: userRole,
      decided_at: timestamp,
      expires_at: expiresAt,
      justification_notes: justification,
      cryptographic_seal_sha256: `sha256:${sealHash.slice(0, 32)}`
    };

    return {
      success: true,
      decision
    };
  }

  /**
   * Section 10, 26, 27, 32: Governed Dispatch to Simulation Topology.
   * Enforces:
   * 1. Authorization validity & expiration checks.
   * 2. Executor role permissions (ANALYST cannot execute).
   * 3. Idempotency by idempotencyKey.
   * 4. State transitions & audit events.
   */
  public static dispatchExecution(
    candidate: InterventionCandidate,
    decision: AuthorizationDecision,
    engine: any, // SimulationEngine instance
    executorRole: UserRole = 'SYSTEM_OPERATOR',
    executorUserId: string = 'USR-OPERATOR-01',
    idempotencyKey?: string,
    forceTechnicalFailure: boolean = false
  ): {
    execution: ExecutionRecord;
    events: AuthoritativeEvent[];
    isDuplicate?: boolean;
  } {
    const timestamp = new Date().toISOString();
    const cacheKey = idempotencyKey || `${candidate.id}:${decision.decision_id}`;

    // 1. Idempotency check: Return existing execution if already processed
    if (this.idempotencyCache.has(cacheKey)) {
      const cached = this.idempotencyCache.get(cacheKey)!;
      return {
        execution: cached.execution,
        events: cached.events,
        isDuplicate: true
      };
    }

    const executionId = `EXEC-${candidate.id}-${Date.now().toString(36).toUpperCase()}`;

    // 2. Executor RBAC Validation (ANALYST / AUDITOR / OBSERVER cannot execute!)
    const executorPermissions = ROLE_PERMISSIONS_REGISTRY[executorRole];
    if (!executorPermissions || !executorPermissions.can_execute_interventions) {
      const failedRecord: ExecutionRecord = {
        execution_id: executionId,
        candidate_id: candidate.id,
        authorization_id: decision.decision_id,
        idempotency_key: idempotencyKey,
        executed_by_role: executorRole,
        executed_by_user_id: executorUserId,
        status: 'EXECUTION_FAILED',
        dispatched_at: timestamp,
        completed_at: timestamp,
        execution_latency_ms: 10,
        telemetry_receipt_digest_sha256: `sha256:${crypto.createHash('sha256').update(`${executionId}:RBAC_FAILED`).digest('hex').slice(0, 32)}`,
        state_deltas_applied_count: 0,
        technical_error: `RBAC Violation: Role [${executorRole}] does not have execution authority. Interventions may only be dispatched by SYSTEM_OPERATOR.`
      };

      const failEvent: AuthoritativeEvent = {
        event_id: `EVT-FOUNDRY-FAIL-${Date.now()}`,
        tick: engine.clock.tick,
        simulation_timestamp: engine.clock.virtual_timestamp,
        event_type: 'EXECUTION_FAILED',
        severity: 'CRITICAL',
        source_entity_id: 'CONTROL_FOUNDRY',
        causal_chain_id: `CHAIN-${candidate.incident_id}`,
        state_deltas: [],
        causal_narrative: `SECURITY VIOLATION: Execution attempted by unauthorized role [${executorRole}]. Dispatch blocked.`,
        systemic_impact: { control_margin_delta: 0, stability_delta: 0 }
      };

      return { execution: failedRecord, events: [failEvent] };
    }

    // 3. Authorization Decision Status Validation
    if (decision.decision !== 'AUTHORIZED') {
      const failedRecord: ExecutionRecord = {
        execution_id: executionId,
        candidate_id: candidate.id,
        authorization_id: decision.decision_id,
        idempotency_key: idempotencyKey,
        executed_by_role: executorRole,
        executed_by_user_id: executorUserId,
        status: 'EXECUTION_FAILED',
        dispatched_at: timestamp,
        completed_at: timestamp,
        execution_latency_ms: 10,
        telemetry_receipt_digest_sha256: `sha256:${crypto.createHash('sha256').update(`${executionId}:NOT_AUTHORIZED`).digest('hex').slice(0, 32)}`,
        state_deltas_applied_count: 0,
        technical_error: `Invalid Authorization State: Decision status is [${decision.decision}]. Execution blocked.`
      };

      const failEvent: AuthoritativeEvent = {
        event_id: `EVT-FOUNDRY-FAIL-${Date.now()}`,
        tick: engine.clock.tick,
        simulation_timestamp: engine.clock.virtual_timestamp,
        event_type: 'EXECUTION_FAILED',
        severity: 'CRITICAL',
        source_entity_id: 'CONTROL_FOUNDRY',
        causal_chain_id: `CHAIN-${candidate.incident_id}`,
        state_deltas: [],
        causal_narrative: `EXECUTION BLOCKED: Candidate has not received AUTHORIZED status. Current status: ${decision.decision}.`,
        systemic_impact: { control_margin_delta: 0, stability_delta: 0 }
      };

      return { execution: failedRecord, events: [failEvent] };
    }

    // 4. Authorization Expiration Validation
    const nowMs = Date.now();
    const expiryMs = new Date(decision.expires_at).getTime();
    if (expiryMs <= nowMs) {
      const failedRecord: ExecutionRecord = {
        execution_id: executionId,
        candidate_id: candidate.id,
        authorization_id: decision.decision_id,
        idempotency_key: idempotencyKey,
        executed_by_role: executorRole,
        executed_by_user_id: executorUserId,
        status: 'EXECUTION_FAILED',
        dispatched_at: timestamp,
        completed_at: timestamp,
        execution_latency_ms: 15,
        telemetry_receipt_digest_sha256: `sha256:${crypto.createHash('sha256').update(`${executionId}:EXPIRED`).digest('hex').slice(0, 32)}`,
        state_deltas_applied_count: 0,
        technical_error: `Authorization Expired: Decision expired at ${decision.expires_at}. Governed execution window elapsed.`
      };

      const failEvent: AuthoritativeEvent = {
        event_id: `EVT-FOUNDRY-FAIL-${Date.now()}`,
        tick: engine.clock.tick,
        simulation_timestamp: engine.clock.virtual_timestamp,
        event_type: 'EXECUTION_FAILED',
        severity: 'HIGH',
        source_entity_id: 'CONTROL_FOUNDRY',
        causal_chain_id: `CHAIN-${candidate.incident_id}`,
        state_deltas: [],
        causal_narrative: `EXPIRED AUTHORIZATION: Execution window for [${candidate.title}] elapsed. Candidate must be re-evaluated and re-authorized.`,
        systemic_impact: { control_margin_delta: 0, stability_delta: 0 }
      };

      return { execution: failedRecord, events: [failEvent] };
    }

    // 5. Check if Technical Execution Failure is Forced (Demonstration mode)
    if (forceTechnicalFailure) {
      const failedRecord: ExecutionRecord = {
        execution_id: executionId,
        candidate_id: candidate.id,
        authorization_id: decision.decision_id,
        idempotency_key: idempotencyKey,
        executed_by_role: executorRole,
        executed_by_user_id: executorUserId,
        status: 'EXECUTION_FAILED',
        dispatched_at: timestamp,
        completed_at: timestamp,
        execution_latency_ms: 120,
        telemetry_receipt_digest_sha256: `sha256:${crypto.createHash('sha256').update(`${executionId}:FAILED`).digest('hex').slice(0, 32)}`,
        state_deltas_applied_count: 0,
        technical_error: 'Enclave command gateway timeout: Transport rail failed to acknowledge isolation packet.'
      };

      const failEvent: AuthoritativeEvent = {
        event_id: `EVT-FOUNDRY-FAIL-${Date.now()}`,
        tick: engine.clock.tick,
        simulation_timestamp: engine.clock.virtual_timestamp,
        event_type: 'EXECUTION_FAILED',
        severity: 'CRITICAL',
        source_entity_id: 'CONTROL_FOUNDRY',
        causal_chain_id: `CHAIN-${candidate.incident_id}`,
        state_deltas: [],
        causal_narrative: `TECHNICAL EXECUTION FAILURE: Dispatch of ${candidate.title} failed at gateway.`,
        systemic_impact: { control_margin_delta: 0, stability_delta: 0 }
      };

      const result = { execution: failedRecord, events: [failEvent] };
      this.idempotencyCache.set(cacheKey, result);
      return result;
    }

    // 6. Governed Dispatch: Apply real state deltas to authoritative topology
    const deltas: any[] = [];
    const events: AuthoritativeEvent[] = [];

    switch (candidate.type) {
      case 'DEPENDENCY_ISOLATION': {
        const isSecondaryQuarantine = 
          candidate.id.includes('MODEL-QUARANTINE-BACKSTOP') ||
          candidate.id.includes('MODEL-C-QUARANTINE') ||
          candidate.id.includes('CAND-SEC-01') ||
          (candidate.target_entities.includes('MODEL-C') && candidate.target_dependencies.includes('DEP_MODEL_C_ASSET_17'));

        for (const depId of candidate.target_dependencies) {
          const dep = engine.dependencies.find((d: any) => d.dependency_id === depId);
          if (dep) {
            const prev = dep.status;
            dep.status = isSecondaryQuarantine ? 'STABLE' : 'RECOVERING';
            if (isSecondaryQuarantine) {
              dep.exposure_weight = 0.10;
            }
            deltas.push({ entity_type: 'DEPENDENCY', entity_id: depId, field: 'status', previous_value: prev, new_value: dep.status });
          }
        }
        for (const entId of candidate.target_entities) {
          const prov = engine.dataProviders.find((p: any) => p.provider_id === entId);
          if (prov) {
            const prev = prov.status;
            prov.status = isSecondaryQuarantine ? 'STABLE' : 'RECOVERING';
            deltas.push({ entity_type: 'DATA_PROVIDER', entity_id: entId, field: 'status', previous_value: prev, new_value: prov.status });
          }
          const inst = engine.institutions.find((i: any) => i.institution_id === entId);
          if (inst) {
            const prev = inst.status;
            inst.status = isSecondaryQuarantine ? 'STABLE' : 'RECOVERING';
            deltas.push({ entity_type: 'INSTITUTION', entity_id: entId, field: 'status', previous_value: prev, new_value: inst.status });
          }
          const infra = engine.infrastructureNodes.find((n: any) => n.node_id === entId);
          if (infra) {
            const prev = infra.status;
            infra.status = isSecondaryQuarantine ? 'STABLE' : 'RECOVERING';
            infra.current_load_percent = isSecondaryQuarantine ? 35.0 : 52.0;
            deltas.push({ entity_type: 'INFRASTRUCTURE_NODE', entity_id: entId, field: 'status', previous_value: prev, new_value: infra.status });
          }
          const model = engine.aiModels.find((m: any) => m.model_id === entId);
          if (model) {
            const prev = model.status;
            model.status = 'STABLE';
            model.effective_diversity_score = 0.85;
            model.herd_correlation_risk = 0.12;
            deltas.push({ entity_type: 'AI_MODEL', entity_id: entId, field: 'status', previous_value: prev, new_value: 'STABLE' });
            deltas.push({ entity_type: 'AI_MODEL', entity_id: entId, field: 'effective_diversity_score', previous_value: 0.28, new_value: 0.85 });
            deltas.push({ entity_type: 'AI_MODEL', entity_id: entId, field: 'herd_correlation_risk', previous_value: 0.76, new_value: 0.12 });
          }
          const asset = engine.assets?.find((a: any) => a.asset_id === entId);
          if (asset) {
            const prev = asset.status;
            asset.status = 'STABLE';
            deltas.push({ entity_type: 'ASSET', entity_id: entId, field: 'status', previous_value: prev, new_value: 'STABLE' });
          }
        }

        // If secondary backstop, also clear upstream DATA-X and connected bank rails
        if (isSecondaryQuarantine) {
          const dataX = engine.dataProviders.find((p: any) => p.provider_id === 'DATA-X');
          if (dataX && dataX.status !== 'STABLE') {
            const prev = dataX.status;
            dataX.status = 'STABLE';
            deltas.push({ entity_type: 'DATA_PROVIDER', entity_id: 'DATA-X', field: 'status', previous_value: prev, new_value: 'STABLE' });
          }
          for (const bankId of ['BANK-A', 'BANK-B', 'BANK-C', 'BANK-D']) {
            const inst = engine.institutions.find((i: any) => i.institution_id === bankId);
            if (inst && inst.status !== 'STABLE') {
              const prev = inst.status;
              inst.status = 'STABLE';
              deltas.push({ entity_type: 'INSTITUTION', entity_id: bankId, field: 'status', previous_value: prev, new_value: 'STABLE' });
            }
          }
          for (const dep of engine.dependencies) {
            if (dep.status !== 'STABLE') {
              const prev = dep.status;
              dep.status = 'STABLE';
              deltas.push({ entity_type: 'DEPENDENCY', entity_id: dep.dependency_id, field: 'status', previous_value: prev, new_value: 'STABLE' });
            }
          }
        }
        break;
      }

      case 'MODEL_DIVERSIFICATION': {
        for (const mId of candidate.target_entities) {
          const model = engine.aiModels.find((m: any) => m.model_id === mId);
          if (model) {
            const prevDiv = model.effective_diversity_score;
            const prevCorr = model.herd_correlation_risk;
            model.status = 'STABLE';
            model.effective_diversity_score = 0.78;
            model.herd_correlation_risk = 0.28;
            deltas.push({ entity_type: 'AI_MODEL', entity_id: mId, field: 'effective_diversity_score', previous_value: prevDiv, new_value: 0.78 });
            deltas.push({ entity_type: 'AI_MODEL', entity_id: mId, field: 'herd_correlation_risk', previous_value: prevCorr, new_value: 0.28 });
          }
        }
        for (const inst of engine.institutions) {
          if (inst.status === 'DEGRADING') {
            inst.status = 'RECOVERING';
            deltas.push({ entity_type: 'INSTITUTION', entity_id: inst.institution_id, field: 'status', previous_value: 'DEGRADING', new_value: 'RECOVERING' });
          }
        }
        break;
      }

      case 'DATA_QUARANTINE': {
        for (const entId of candidate.target_entities) {
          const prov = engine.dataProviders.find((p: any) => p.provider_id === entId);
          if (prov) {
            const prev = prov.status;
            prov.status = 'RECOVERING';
            deltas.push({ entity_type: 'DATA_PROVIDER', entity_id: entId, field: 'status', previous_value: prev, new_value: 'RECOVERING' });
          }
        }
        // Note: For partial quarantine demonstration (PARTIAL-ISO), MODEL-C remains unquarantined!
        break;
      }

      case 'EXPOSURE_REDUCTION': {
        for (const depId of candidate.target_dependencies) {
          const dep = engine.dependencies.find((d: any) => d.dependency_id === depId);
          if (dep) {
            const prev = dep.exposure_weight;
            dep.exposure_weight = +(dep.exposure_weight * 0.50).toFixed(2);
            deltas.push({ entity_type: 'DEPENDENCY', entity_id: depId, field: 'exposure_weight', previous_value: prev, new_value: dep.exposure_weight });
          }
        }
        break;
      }

      case 'TEMPORAL_STAGGERING': {
        for (const m of engine.aiModels) {
          const prev = m.herd_correlation_risk;
          m.herd_correlation_risk = 0.38;
          deltas.push({ entity_type: 'AI_MODEL', entity_id: m.model_id, field: 'herd_correlation_risk', previous_value: prev, new_value: 0.38 });
        }
        break;
      }

      case 'SELECTIVE_SUSPENSION': {
        for (const depId of candidate.target_dependencies) {
          const dep = engine.dependencies.find((d: any) => d.dependency_id === depId);
          if (dep) {
            const prev = dep.status;
            dep.status = 'DISRUPTED';
            deltas.push({ entity_type: 'DEPENDENCY', entity_id: depId, field: 'status', previous_value: prev, new_value: 'DISRUPTED' });
          }
        }
        break;
      }
    }

    // 7. Generate Authoritative Event
    const execEvent: AuthoritativeEvent = {
      event_id: `EVT-FOUNDRY-EXEC-${Date.now()}`,
      tick: engine.clock.tick,
      simulation_timestamp: engine.clock.virtual_timestamp,
      event_type: 'INTERVENTION_EXECUTED',
      severity: 'INFO',
      source_entity_id: 'CONTROL_FOUNDRY',
      causal_chain_id: `CHAIN-${candidate.incident_id}`,
      state_deltas: deltas,
      causal_narrative: `GOVERNED EXECUTION: ${candidate.title} dispatched across ${candidate.target_entities.length} nodes by ${executorRole}. State deltas applied: ${deltas.length}.`,
      systemic_impact: { 
        control_margin_delta: candidate.expected_control_margin_delta, 
        stability_delta: +0.25 
      }
    };
    events.push(execEvent);

    // 8. Generate Telemetry Receipt Hash
    const receiptPayload = `${executionId}:${candidate.id}:${deltas.length}:${timestamp}:${executorUserId}`;
    const receiptHash = crypto.createHash('sha256').update(receiptPayload).digest('hex');

    const executionRecord: ExecutionRecord = {
      execution_id: executionId,
      candidate_id: candidate.id,
      authorization_id: decision.decision_id,
      idempotency_key: idempotencyKey,
      executed_by_role: executorRole,
      executed_by_user_id: executorUserId,
      status: 'EXECUTED',
      dispatched_at: timestamp,
      completed_at: new Date(Date.now() + candidate.estimated_latency_sec * 100).toISOString(),
      execution_latency_ms: candidate.estimated_latency_sec * 100,
      telemetry_receipt_digest_sha256: `sha256:${receiptHash.slice(0, 32)}`,
      state_deltas_applied_count: deltas.length
    };

    const executionResult = { execution: executionRecord, events };
    this.idempotencyCache.set(cacheKey, executionResult);
    this.executionHistory.set(candidate.id, { candidate, deltas, reverted: false });

    // Track executed intervention in engine state
    if (engine && Array.isArray(engine.interventions)) {
      if (!engine.interventions.some((i: any) => i.intervention_id === candidate.id)) {
        engine.interventions.push({
          intervention_id: candidate.id,
          incident_id: candidate.incident_id,
          type: candidate.type,
          proposer_role: executorRole,
          target_entity_ids: candidate.target_entities,
          status: 'EXECUTED',
          expected_margin_delta: candidate.expected_control_margin_delta,
          timestamp
        });
      }
    }

    return executionResult;
  }

  /**
   * Section 30: Governed Rollback for Reversible Interventions.
   * Enforces:
   * 1. Cannot rollback IRREVERSIBLE interventions.
   * 2. Requires governance authorization (INCIDENT_COMMANDER or RISK_OFFICER).
   * 3. Reverts applied state deltas and emits INTERVENTION_ROLLED_BACK.
   */
  public static rollbackIntervention(
    candidate: InterventionCandidate,
    execution: ExecutionRecord,
    engine: any,
    authorizerRole: UserRole,
    executorRole: UserRole,
    justification: string = 'Operational rollback executed due to post-action telemetry divergence.'
  ): {
    success: boolean;
    error?: string;
    rollbackRecord: RollbackRecord;
    events: AuthoritativeEvent[];
  } {
    const timestamp = new Date().toISOString();
    const rollbackId = `RB-${candidate.id}-${Date.now().toString(36).toUpperCase()}`;

    // RULE 1: Irreversible actions cannot be rolled back
    if (candidate.reversibility === 'IRREVERSIBLE') {
      const failedRecord: RollbackRecord = {
        rollback_id: rollbackId,
        intervention_id: candidate.id,
        requested_by: executorRole,
        authorized_by: authorizerRole,
        status: 'ROLLBACK_FAILED',
        deltas_reverted_count: 0,
        timestamp,
        justification: `ROLLBACK BLOCKED: Intervention [${candidate.title}] is designated IRREVERSIBLE. Manual supervisory override required.`
      };

      return {
        success: false,
        error: `Cannot rollback irreversible intervention: ${candidate.id}`,
        rollbackRecord: failedRecord,
        events: []
      };
    }

    // RULE 2: Rollback authorization check
    const authPerms = ROLE_PERMISSIONS_REGISTRY[authorizerRole];
    if (!authPerms || !authPerms.can_authorize_interventions) {
      const failedRecord: RollbackRecord = {
        rollback_id: rollbackId,
        intervention_id: candidate.id,
        requested_by: executorRole,
        authorized_by: authorizerRole,
        status: 'ROLLBACK_FAILED',
        deltas_reverted_count: 0,
        timestamp,
        justification: `ROLLBACK BLOCKED: Role [${authorizerRole}] lacks authorization privilege for rollback.`
      };

      return {
        success: false,
        error: `Unauthorized: Role ${authorizerRole} cannot authorize rollback.`,
        rollbackRecord: failedRecord,
        events: []
      };
    }

    // Retrieve history record
    const history = this.executionHistory.get(candidate.id);
    const deltasToRevert = history ? history.deltas : [];

    // Revert state deltas in reverse order
    for (let i = deltasToRevert.length - 1; i >= 0; i--) {
      const delta = deltasToRevert[i];
      if (delta.entity_type === 'DEPENDENCY') {
        const dep = engine.dependencies.find((d: any) => d.dependency_id === delta.entity_id);
        if (dep) dep[delta.field] = delta.previous_value;
      } else if (delta.entity_type === 'DATA_PROVIDER') {
        const prov = engine.dataProviders.find((p: any) => p.provider_id === delta.entity_id);
        if (prov) prov[delta.field] = delta.previous_value;
      } else if (delta.entity_type === 'INSTITUTION') {
        const inst = engine.institutions.find((inst: any) => inst.institution_id === delta.entity_id);
        if (inst) inst[delta.field] = delta.previous_value;
      } else if (delta.entity_type === 'INFRASTRUCTURE_NODE') {
        const node = engine.infrastructureNodes.find((n: any) => n.node_id === delta.entity_id);
        if (node) {
          node[delta.field] = delta.previous_value;
          if (delta.field === 'status') node.current_load_percent = 92.0;
        }
      } else if (delta.entity_type === 'AI_MODEL') {
        const model = engine.aiModels.find((m: any) => m.model_id === delta.entity_id);
        if (model) model[delta.field] = delta.previous_value;
      }
    }

    if (history) {
      history.reverted = true;
    }

    // Authoritative event for rollback
    const rollbackEvent: AuthoritativeEvent = {
      event_id: `EVT-FOUNDRY-ROLLBACK-${Date.now()}`,
      tick: engine.clock.tick,
      simulation_timestamp: engine.clock.virtual_timestamp,
      event_type: 'INTERVENTION_ROLLED_BACK',
      severity: 'WARNING',
      source_entity_id: 'CONTROL_FOUNDRY',
      causal_chain_id: `CHAIN-${candidate.incident_id}`,
      state_deltas: deltasToRevert.map(d => ({
        entity_type: d.entity_type,
        entity_id: d.entity_id,
        field: d.field,
        previous_value: d.new_value,
        new_value: d.previous_value
      })),
      causal_narrative: `GOVERNED ROLLBACK: ${candidate.title} rolled back by ${executorRole} under authority of ${authorizerRole}. Reverted ${deltasToRevert.length} state deltas.`,
      systemic_impact: { 
        control_margin_delta: -candidate.expected_control_margin_delta, 
        stability_delta: -0.20 
      }
    };

    const rollbackRecord: RollbackRecord = {
      rollback_id: rollbackId,
      intervention_id: candidate.id,
      requested_by: executorRole,
      authorized_by: authorizerRole,
      status: 'ROLLBACK_COMPLETED',
      deltas_reverted_count: deltasToRevert.length,
      timestamp,
      justification
    };

    return {
      success: true,
      rollbackRecord,
      events: [rollbackEvent]
    };
  }

  /**
   * Section 31: Conflict detection between proposed/active interventions.
   */
  public static checkInterventionConflict(
    candidateA: InterventionCandidate,
    candidateB: InterventionCandidate
  ): {
    hasConflict: boolean;
    conflictReason?: string;
  } {
    // Check if target entities overlap with opposing action types
    const sharedEntities = candidateA.target_entities.filter(e => candidateB.target_entities.includes(e));
    const sharedDependencies = candidateA.target_dependencies.filter(d => candidateB.target_dependencies.includes(d));

    if (sharedEntities.length > 0 || sharedDependencies.length > 0) {
      // If one candidate isolates while the other increases or throttles exposure differently
      if (candidateA.type === 'DEPENDENCY_ISOLATION' && candidateB.type === 'EXPOSURE_REDUCTION') {
        return {
          hasConflict: true,
          conflictReason: `CONFLICTING_INTERVENTIONS: Simultaneous isolation and limit haircut on shared entities [${sharedEntities.join(', ')}]. Bilateral netting rails cannot be concurrently partitioned and throttled.`
        };
      }
      if (candidateA.type === 'DATA_QUARANTINE' && candidateB.type === 'MODEL_DIVERSIFICATION') {
        return {
          hasConflict: false // Complementary
        };
      }
      if (candidateA.id !== candidateB.id) {
        return {
          hasConflict: true,
          conflictReason: `CONFLICTING_INTERVENTIONS: Multiple active interventions targeted at shared entities [${sharedEntities.join(', ')}]. Sequence or resolve before execution.`
        };
      }
    }

    return { hasConflict: false };
  }
}

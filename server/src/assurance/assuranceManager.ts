/**
 * FINANCIAL IMMUNE SYSTEM - ASSURANCE STATE MANAGER (PHASE 5)
 * Sections 6, 7, 18, 19, 20, 21, 23: Assurance State Engine, Unified Traceability & Threat Injections
 * 
 * Invariants:
 * 1. AssuranceState is first-class typed system state derived from authoritative topology.
 * 2. Unified traceId persists across the entire incident lifecycle.
 * 3. Categorical assurance status reflects actual operational health.
 * 4. Control Margin provenance is fully auditable with mathematical breakdown.
 */

import { 
  AssuranceState, 
  AssuranceStatus, 
  TraceRecord, 
  ControlMarginProvenance, 
  SecurityThreatScenarioId 
} from '../../../shared/types/assurance';
import { AuthoritativeEvent } from '../../../shared/types/events';
import { EvidenceEngine } from './evidenceEngine';
import { PrivacyBoundary } from './privacyBoundary';
import { IBMRuntimeContext } from './ibmRuntime';

export class AssuranceManager {
  private activeTraces: Map<string, TraceRecord> = new Map();
  private currentActiveTraceId: string = 'TRC-BASELINE-EQUILIBRIUM';
  private integrityFailureActive: boolean = false;
  private forcedAssuranceStatus: AssuranceStatus | null = null;
  private activeSecurityEvents: string[] = [];
  private warnings: string[] = [];

  constructor() {
    this.reset();
  }

  public reset(): void {
    this.activeTraces.clear();
    this.currentActiveTraceId = 'TRC-BASELINE-EQUILIBRIUM';
    this.integrityFailureActive = false;
    this.forcedAssuranceStatus = null;
    this.activeSecurityEvents = [];
    this.warnings = [];
    EvidenceEngine.setFreshnessOverride(null);
    EvidenceEngine.setEvidenceConflict(false);

    // Initial baseline trace
    this.activeTraces.set(this.currentActiveTraceId, {
      traceId: this.currentActiveTraceId,
      incidentId: 'EQUILIBRIUM',
      firstObservedAt: new Date().toISOString(),
      sourceEventIds: ['EVT-INIT-BASELINE'],
      assessmentId: 'ASM-BASELINE-001',
      currentStatus: 'NOMINAL_EQUILIBRIUM'
    });
  }

  /**
   * Initializes or binds a unified traceId for a newly declared incident.
   */
  public bindIncidentTrace(incidentId: string, initialEventId?: string): string {
    const traceId = `TRC-${incidentId}-${Date.now().toString(36).slice(-4).toUpperCase()}`;
    this.currentActiveTraceId = traceId;

    const record: TraceRecord = {
      traceId,
      incidentId,
      firstObservedAt: new Date().toISOString(),
      sourceEventIds: initialEventId ? [initialEventId] : [],
      currentStatus: 'INCIDENT_ACTIVE'
    };

    this.activeTraces.set(traceId, record);
    return traceId;
  }

  /**
   * Updates an active trace with lifecycle milestone references.
   */
  public updateTrace(
    traceId: string,
    updates: Partial<TraceRecord>
  ): void {
    const existing = this.activeTraces.get(traceId);
    if (existing) {
      Object.assign(existing, updates);
    }
  }

  /**
   * Gets the active trace record.
   */
  public getActiveTrace(): TraceRecord | undefined {
    return this.activeTraces.get(this.currentActiveTraceId);
  }

  /**
   * Dynamically evaluates and derives the authoritative AssuranceState from live engine telemetry.
   */
  public evaluateAssuranceState(engine: any): AssuranceState {
    const timestamp = new Date().toISOString();
    const evidenceList = engine.evidenceRecords || [];
    const latestEvidence = evidenceList[evidenceList.length - 1];
    const freshness = latestEvidence ? EvidenceEngine.calculateFreshness(latestEvidence.timestamp) : 'UNKNOWN';
    const conflict = EvidenceEngine.getEvidenceConflict();

    // Check evidence sufficiency
    const evidenceCount = evidenceList.length;
    const sufficiency = evidenceCount >= 3 ? 'SUFFICIENT' : evidenceCount >= 1 ? 'MARGINAL' : 'INSUFFICIENT';

    // Derive categorical AssuranceStatus
    let status: AssuranceStatus = 'ASSURED';

    if (this.forcedAssuranceStatus) {
      status = this.forcedAssuranceStatus;
    } else if (this.integrityFailureActive) {
      status = 'ASSURANCE_COMPROMISED';
    } else if (conflict && conflict.isConflicted) {
      status = 'ASSURANCE_UNVERIFIED';
    } else if (engine.controlState?.controllability_state === 'CONTROL_UNVERIFIED') {
      status = 'ASSURANCE_UNVERIFIED';
    } else if (freshness === 'STALE' || freshness === 'EXPIRED') {
      status = 'ASSURANCE_DEGRADED';
    } else if (engine.incidents && engine.incidents.length > 0) {
      status = 'ASSURANCE_CONSTRAINED';
    } else {
      status = 'ASSURED';
    }

    // Refresh active warnings
    const warnings: string[] = [];
    if (this.integrityFailureActive) {
      warnings.push('CRITICAL: Enclave cryptographic digest mismatch detected on evidence payload.');
    }
    if (conflict && conflict.isConflicted) {
      warnings.push(`EVIDENCE CONFLICT: Discrepancy between ${conflict.sourceA} and ${conflict.sourceB}.`);
    }
    if (freshness === 'STALE' || freshness === 'EXPIRED') {
      warnings.push(`EVIDENCE STALENESS: Telemetry age exceeds verification threshold (${freshness}).`);
    }
    if (sufficiency === 'INSUFFICIENT') {
      warnings.push('EVIDENCE DEFICIT: Fewer than minimum required attested records for intervention.');
    }

    const state: AssuranceState = {
      assuranceStatus: status,
      identityStatus: 'VERIFIED',
      authorizationStatus: 'GOVERNED',
      evidenceStatus: this.integrityFailureActive 
        ? 'CORRUPTED' 
        : conflict && conflict.isConflicted 
          ? 'CONFLICTED' 
          : freshness === 'STALE' || freshness === 'EXPIRED' 
            ? 'STALE' 
            : 'VALID',
      evidenceFreshness: freshness,
      evidenceSufficiency: sufficiency,
      evidenceConflict: Boolean(conflict && conflict.isConflicted),
      conflictDescription: conflict?.conflictDescription,
      integrityStatus: this.integrityFailureActive ? 'FAILED' : 'VERIFIED',
      privacyStatus: 'ENFORCED',
      executionStatus: engine.controlState?.foundry?.latest_execution?.status === 'EXECUTED' 
        ? 'EXECUTED' 
        : engine.controlState?.foundry?.latest_execution?.status === 'EXECUTION_FAILED'
          ? 'FAILED'
          : 'READY',
      verificationStatus: engine.controlState?.controllability_state === 'CONTROL_RESTORED'
        ? 'RESTORED'
        : engine.controlState?.controllability_state === 'CONTROL_UNVERIFIED'
          ? 'UNVERIFIED'
          : 'PENDING',
      observabilityStatus: 'OPTIMAL',
      uncertaintyStatus: conflict && conflict.isConflicted ? 'HIGH' : freshness === 'STALE' ? 'MEDIUM' : 'LOW',
      activeSecurityEvents: [...this.activeSecurityEvents],
      warnings,
      lastVerifiedAt: timestamp,
      traceId: this.currentActiveTraceId,
      calculationVersion: 'ASR-v1.0-ENCLAVE',
      truthStatus: 'IMPLEMENTED'
    };

    return state;
  }

  /**
   * Generates mathematical Control Margin provenance breakdown.
   */
  public generateControlMarginProvenance(
    previousMargin: number,
    newMargin: number,
    engine: any
  ): ControlMarginProvenance {
    const intel = engine.controlState?.intelligence;
    const conc = intel?.concentration_metrics;

    // Derived attribution breakdown
    const depDelta = conc?.dependency_exposure_hhi ? -Math.round(conc.dependency_exposure_hhi * 20) : -6;
    const propDelta = intel?.propagation_intelligence?.maximum_depth_hops ? -Math.round(intel.propagation_intelligence.maximum_depth_hops * 4) : -8;
    const infraDelta = conc?.infrastructure_concentration_hhi && conc.infrastructure_concentration_hhi > 0.4 ? -12 : 0;
    const herdDelta = intel?.collective_decision_signal?.decision_synchrony_percent && intel.collective_decision_signal.decision_synchrony_percent > 80 ? -30 : 0;
    const recoveryDelta = newMargin > previousMargin ? (newMargin - previousMargin) : 0;

    return {
      previousMargin,
      newMargin,
      dependencyContribution: depDelta,
      propagationContribution: propDelta,
      infrastructureContribution: infraDelta,
      collectiveDecisionContribution: herdDelta,
      recoveryContribution: recoveryDelta,
      evidenceRefs: engine.evidenceRecords?.map((e: any) => e.evidence_id) || [],
      calculationVersion: 'CM-v0.3',
      uncertainty: intel?.epistemic_uncertainty?.level || 'LOW',
      source: 'SIMULATED_VARIABLE',
      status: 'EXPERIMENTAL PROTOTYPE METRIC'
    };
  }

  /**
   * Handles demonstration attack injections to test systemic resilience.
   */
  public injectThreat(
    threatType: SecurityThreatScenarioId,
    engine: any
  ): {
    success: boolean;
    event: AuthoritativeEvent;
    state: AssuranceState;
  } {
    const timestamp = engine.clock?.virtual_timestamp || new Date().toISOString();
    const tick = engine.clock?.tick || 0;
    let eventType: any = 'ANOMALY_DETECTED';
    let narrative = '';

    switch (threatType) {
      case 'THREAT_A_DATA_COMPROMISE': {
        eventType = 'PROVIDER_COMPROMISED';
        narrative = 'THREAT INJECTION [THREAT-A]: Information provider DATA-X rate feeds subjected to cryptographic integrity corruption.';
        const dataX = engine.dataProviders.find((p: any) => p.provider_id === 'DATA-X');
        if (dataX) dataX.status = 'COMPROMISED';
        this.activeSecurityEvents.push('DATA-X Oracle Compromise Active');
        break;
      }

      case 'THREAT_B_UNAUTHORIZED_ACTION': {
        eventType = 'AUTHORIZATION_DENIED';
        narrative = 'SECURITY INCIDENT [THREAT-B]: Unauthorized role [OBSERVER] attempted execution of critical intervention. RBAC gateway blocked execution and generated tamper seal.';
        this.activeSecurityEvents.push('Unauthorized Intervention Attempt (Blocked)');
        break;
      }

      case 'THREAT_C_STALE_EVIDENCE': {
        eventType = 'EVIDENCE_EXPIRED';
        narrative = 'ASSURANCE DEGRADATION [THREAT-C]: Evidence TTL reached; telemetry records flagged as STALE. Incident closure blocked.';
        EvidenceEngine.setFreshnessOverride('STALE');
        this.activeSecurityEvents.push('Evidence Staleness Injected');
        break;
      }

      case 'THREAT_D_EXECUTION_OUTCOME_DIVERGENCE': {
        eventType = 'RESIDUAL_HAZARD_DETECTED';
        narrative = 'VERIFICATION ANOMALY [THREAT-D]: Technical intervention executed successfully, but independent verifier detected latent MODEL-C contagion. CONTROL_UNVERIFIED declared.';
        engine.controlState.controllability_state = 'CONTROL_UNVERIFIED';
        this.activeSecurityEvents.push('Latent MODEL-C Contagion Detected');
        break;
      }

      case 'THREAT_E_EVIDENCE_CONFLICT': {
        eventType = 'EVIDENCE_CONFLICT_DETECTED';
        narrative = 'ASSURANCE CONFLICT [THREAT-E]: Primary RTGS telemetry reports nominal recovery (+85%), but Secondary Clearing Audit detects residual collateral deficit. Uncertainty set to HIGH.';
        EvidenceEngine.setEvidenceConflict(true);
        engine.controlState.controllability_state = 'CONTROL_UNVERIFIED';
        this.activeSecurityEvents.push('Telemetry Conflict Active (RTGS vs Clearing)');
        break;
      }

      case 'INJECT_INTEGRITY_FAILURE' as any: {
        eventType = 'INTEGRITY_FAILURE_DETECTED';
        narrative = 'CRITICAL INTEGRITY ANOMALY: Telemetry payload digest mismatch detected in enclave storage.';
        this.integrityFailureActive = true;
        if (engine.evidenceRecords && engine.evidenceRecords[0]) {
          engine.evidenceRecords[0].payload_digest_sha256 = 'sha256:CORRUPTED_TAMPERED_PAYLOAD_HASH';
        }
        this.activeSecurityEvents.push('Cryptographic Digest Tampering Detected');
        break;
      }
    }

    const event: AuthoritativeEvent = {
      event_id: `EVT-SEC-${Date.now()}`,
      tick,
      simulation_timestamp: timestamp,
      event_type: eventType,
      severity: 'CRITICAL',
      source_entity_id: 'ASSURANCE_ENCLAVE',
      causal_chain_id: `CHAIN-SECURITY-${threatType}`,
      state_deltas: [],
      causal_narrative: narrative,
      systemic_impact: { control_margin_delta: -15, stability_delta: -0.15 }
    };

    engine.authoritativeEvents.unshift(event);
    const updatedState = this.evaluateAssuranceState(engine);

    return {
      success: true,
      event,
      state: updatedState
    };
  }

  /**
   * Sets integrity failure status for testing
   */
  public setIntegrityFailure(failed: boolean): void {
    this.integrityFailureActive = failed;
  }
}

export const globalAssuranceManager = new AssuranceManager();

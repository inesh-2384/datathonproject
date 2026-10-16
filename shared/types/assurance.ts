/**
 * FINANCIAL IMMUNE SYSTEM - ASSURANCE & SECURITY DOMAIN CONTRACT (PHASE 5)
 * Enterprise Assurance, Privacy Boundary, Cryptographic Integrity & IBM Z / LinuxONE Context
 * 
 * Semantic Invariants:
 * - IDENTITY != AUTHORITY
 * - RECOMMENDATION != AUTHORIZATION
 * - AUTHORIZATION != EXECUTION
 * - EXECUTION != SUCCESSFUL RECOVERY
 * - OBSERVATION != INTERPRETATION
 * - EVIDENCE != TRUTH
 * - FRESH EVIDENCE != SUFFICIENT EVIDENCE
 * - LOCAL RECOVERY != SYSTEMIC RESTORATION
 * - SYSTEMIC RESTORATION != VERIFIED RESTORATION
 */

import { UserRole } from './roles';

export type ScientificTruthState =
  | 'IMPLEMENTED'
  | 'IBM_INTEGRATED'
  | 'SIMULATED'
  | 'EXPERIMENTAL'
  | 'ARCHITECTED'
  | 'FUTURE';

export type AssuranceStatus =
  | 'ASSURED'
  | 'ASSURANCE_DEGRADED'
  | 'ASSURANCE_CONSTRAINED'
  | 'ASSURANCE_UNVERIFIED'
  | 'ASSURANCE_COMPROMISED';

export type IdentityStatus = 'VERIFIED' | 'UNVERIFIED' | 'REVOKED';
export type AuthorizationStatus = 'GOVERNED' | 'BLOCKED' | 'PENDING';
export type EvidenceStatus = 'VALID' | 'STALE' | 'CONFLICTED' | 'CORRUPTED';
export type EvidenceFreshness = 'FRESH' | 'AGING' | 'STALE' | 'EXPIRED' | 'UNKNOWN';
export type EvidenceSufficiency = 'SUFFICIENT' | 'MARGINAL' | 'INSUFFICIENT';

export type DataClassification =
  | 'PUBLIC'
  | 'INTERNAL'
  | 'RESTRICTED'
  | 'SENSITIVE'
  | 'DERIVED'
  | 'AGGREGATED';

export type FailureState =
  | 'AUTHORIZATION_DENIED'
  | 'EXECUTION_FAILED'
  | 'EXECUTION_PARTIAL'
  | 'EXECUTION_TIMEOUT'
  | 'VERIFICATION_FAILED'
  | 'EVIDENCE_STALE'
  | 'EVIDENCE_CONFLICTED'
  | 'OBSERVATION_GAP'
  | 'RESIDUAL_HAZARD'
  | 'CONTROL_UNVERIFIED'
  | 'ASSURANCE_DEGRADED'
  | 'ASSURANCE_COMPROMISED';

export interface ClassifiedDataField {
  fieldName: string;
  classification: DataClassification;
  source: string;
  purpose: string;
  transformation: string;
  aggregationLevel: string;
  authorizedRoles: UserRole[];
  retentionClass: string;
  derivedUsage: string;
}

export interface PrivacyTransformationRecord {
  transformId: string;
  timestamp: string;
  sourceEntityId: string;
  rawFieldsCount: number;
  protectedFieldsCount: number;
  transformationType: 'AGGREGATION' | 'DIFFERENTIAL_NOISE' | 'HASH_MASKING' | 'TOPOLOGICAL_SYNTHESIS';
  aggregationLevel: 'INSTITUTION_LEVEL' | 'TIER_1_CLUSTER' | 'NETWORK_CENTRALITY_INDEX';
  outputSignal: string;
  authorizedUse: string;
  classification: DataClassification;
}

export type SecurityThreatScenarioId =
  | 'THREAT_A_DATA_COMPROMISE'
  | 'THREAT_B_UNAUTHORIZED_ACTION'
  | 'THREAT_C_STALE_EVIDENCE'
  | 'THREAT_D_EXECUTION_OUTCOME_DIVERGENCE'
  | 'THREAT_E_EVIDENCE_CONFLICT';

export interface TraceRecord {
  traceId: string;
  incidentId: string;
  firstObservedAt: string;
  sourceEventIds: string[];
  assessmentId?: string;
  recommendationId?: string;
  authorizationId?: string;
  executionId?: string;
  verificationId?: string;
  outcomeId?: string;
  reassessmentId?: string;
  currentStatus: string;
}

export interface AssuranceState {
  assuranceStatus: AssuranceStatus;
  identityStatus: IdentityStatus;
  authorizationStatus: AuthorizationStatus;
  evidenceStatus: EvidenceStatus;
  evidenceFreshness: EvidenceFreshness;
  evidenceSufficiency: EvidenceSufficiency;
  evidenceConflict: boolean;
  conflictDescription?: string;
  integrityStatus: 'VERIFIED' | 'FAILED' | 'UNKNOWN';
  privacyStatus: 'ENFORCED' | 'DEGRADED';
  executionStatus: 'READY' | 'EXECUTING' | 'EXECUTED' | 'FAILED';
  verificationStatus: 'RESTORED' | 'UNVERIFIED' | 'FAILED' | 'PENDING';
  observabilityStatus: 'OPTIMAL' | 'DEGRADED';
  uncertaintyStatus: 'LOW' | 'MEDIUM' | 'HIGH';
  activeSecurityEvents: string[];
  warnings: string[];
  lastVerifiedAt: string;
  traceId: string;
  calculationVersion: string;
  truthStatus: ScientificTruthState;
}

export interface IBMRuntimeCapability {
  capability: string;
  ibmTechnology: string;
  truthState: ScientificTruthState;
  rationale: string;
}

export interface IBMRuntimeTruth {
  runtimeMode: 'LOCAL_SIMULATION' | 'IBM_INTEGRATED';
  dataSource: 'SIMULATED' | 'CONNECTED';
  eventStream: 'SIMULATED' | 'CONNECTED';
  aiInference: 'SIMULATED' | 'IBM_INTEGRATED';
  enterpriseData: 'SIMULATED' | 'IBM_INTEGRATED';
  hardware: 'ARCHITECTED' | 'AVAILABLE';
  attestation: 'SIMULATED' | 'IMPLEMENTED' | 'NOT_IMPLEMENTED';
  capabilities: IBMRuntimeCapability[];
  hardwareSubstrateRationale: string;
}

export interface ControlMarginProvenance {
  previousMargin: number;
  newMargin: number;
  dependencyContribution: number;
  propagationContribution: number;
  infrastructureContribution: number;
  collectiveDecisionContribution: number;
  recoveryContribution: number;
  evidenceRefs: string[];
  calculationVersion: string;
  uncertainty: 'LOW' | 'MEDIUM' | 'HIGH';
  source: 'SIMULATED_VARIABLE';
  status: 'EXPERIMENTAL PROTOTYPE METRIC';
}

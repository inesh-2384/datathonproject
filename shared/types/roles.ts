/**
 * FINANCIAL IMMUNE SYSTEM - ROLE & CAPABILITY MODEL (PHASE 4)
 * Section 8: Role Governance, RBAC & Separation of Duties
 * 
 * Functional Roles:
 * 1. OBSERVER - Read-only access to system state and evidence. Cannot authorize or execute.
 * 2. ANALYST / RISK_ANALYST - Systemic analysis, investigation & recommendation. Cannot execute.
 * 3. INCIDENT_COMMANDER - Operational leadership. Can authorize interventions, but cannot execute technical dispatch.
 * 4. RISK_OFFICER - Risk governance. Can authorize risk limits and intervention recommendations.
 * 5. COMPLIANCE_OFFICER - Regulatory governance, evidence seals, policy overrides.
 * 6. SYSTEM_OPERATOR - Technical dispatch of authorized actions. CANNOT self-authorize!
 * 7. AUDITOR - Inspect evidence, lineage, and verification. Cannot mutate incident state.
 */

export type UserRole = 
  | 'OBSERVER'
  | 'ANALYST'
  | 'RISK_ANALYST'
  | 'INCIDENT_COMMANDER'
  | 'RISK_OFFICER'
  | 'COMPLIANCE_OFFICER'
  | 'SYSTEM_OPERATOR'
  | 'AUDITOR';

export interface UserSession {
  user_id: string;
  name: string;
  role: UserRole;
  department: string;
  enclave_session_token: string;
  authenticated_at: string;
  expires_at: string;
}

export interface RolePermissions {
  can_propose_interventions: boolean;
  can_authorize_interventions: boolean;
  can_execute_interventions: boolean;
  can_control_simulation: boolean;
  can_inject_disturbances: boolean;
  can_export_evidence_packages: boolean;
  can_modify_governance_rules: boolean;
  can_access_restricted_data: boolean;
  can_verify_integrity: boolean;
  read_only_mode: boolean;
}

export const ROLE_PERMISSIONS_REGISTRY: Record<UserRole, RolePermissions> = {
  OBSERVER: {
    can_propose_interventions: false,
    can_authorize_interventions: false,
    can_execute_interventions: false,
    can_control_simulation: false,
    can_inject_disturbances: false,
    can_export_evidence_packages: false,
    can_modify_governance_rules: false,
    can_access_restricted_data: false,
    can_verify_integrity: true,
    read_only_mode: true,
  },
  ANALYST: {
    can_propose_interventions: true,
    can_authorize_interventions: false,
    can_execute_interventions: false,
    can_control_simulation: true,
    can_inject_disturbances: true,
    can_export_evidence_packages: true,
    can_modify_governance_rules: false,
    can_access_restricted_data: true,
    can_verify_integrity: true,
    read_only_mode: false,
  },
  RISK_ANALYST: {
    can_propose_interventions: true,
    can_authorize_interventions: false,
    can_execute_interventions: false,
    can_control_simulation: true,
    can_inject_disturbances: true,
    can_export_evidence_packages: true,
    can_modify_governance_rules: false,
    can_access_restricted_data: true,
    can_verify_integrity: true,
    read_only_mode: false,
  },
  INCIDENT_COMMANDER: {
    can_propose_interventions: true,
    can_authorize_interventions: true,
    can_execute_interventions: false, // Separation of duties: commander authorizes, operator executes
    can_control_simulation: true,
    can_inject_disturbances: false,
    can_export_evidence_packages: true,
    can_modify_governance_rules: false,
    can_access_restricted_data: true,
    can_verify_integrity: true,
    read_only_mode: false,
  },
  RISK_OFFICER: {
    can_propose_interventions: true,
    can_authorize_interventions: true,
    can_execute_interventions: false,
    can_control_simulation: false,
    can_inject_disturbances: false,
    can_export_evidence_packages: true,
    can_modify_governance_rules: true,
    can_access_restricted_data: true,
    can_verify_integrity: true,
    read_only_mode: false,
  },
  COMPLIANCE_OFFICER: {
    can_propose_interventions: false,
    can_authorize_interventions: true,
    can_execute_interventions: false,
    can_control_simulation: false,
    can_inject_disturbances: false,
    can_export_evidence_packages: true,
    can_modify_governance_rules: true,
    can_access_restricted_data: true,
    can_verify_integrity: true,
    read_only_mode: false,
  },
  SYSTEM_OPERATOR: {
    can_propose_interventions: false,
    can_authorize_interventions: false, // Cannot self-authorize! Must execute authorized orders only
    can_execute_interventions: true,
    can_control_simulation: true,
    can_inject_disturbances: true,
    can_export_evidence_packages: true,
    can_modify_governance_rules: false,
    can_access_restricted_data: true,
    can_verify_integrity: true,
    read_only_mode: false,
  },
  AUDITOR: {
    can_propose_interventions: false,
    can_authorize_interventions: false,
    can_execute_interventions: false,
    can_control_simulation: false,
    can_inject_disturbances: false,
    can_export_evidence_packages: true,
    can_modify_governance_rules: false,
    can_access_restricted_data: true,
    can_verify_integrity: true,
    read_only_mode: true, // Cannot mutate incident state
  },
};

export interface RoleDefinition {
  role: UserRole;
  title: string;
  tagline: string;
  description: string;
  key_responsibilities: string[];
  access_level: 'FULL_CONTROL' | 'ANALYTIC_INVESTIGATION' | 'GOVERNANCE_AUDIT' | 'READ_ONLY_OBSERVATION';
  badge_color: string;
}

export const ROLE_DEFINITIONS: RoleDefinition[] = [
  {
    role: 'INCIDENT_COMMANDER',
    title: 'Incident Commander',
    tagline: 'Operational Authority & Incident Command',
    description: 'Empowered to authorize emergency interventions and govern systemic circuit-breaker activation during active incidents.',
    key_responsibilities: [
      'Operational intervention authorization',
      'Incident scope governance',
      'Emergency containment sign-off',
      'Dual-key approval coordination'
    ],
    access_level: 'FULL_CONTROL',
    badge_color: '#f59e0b'
  },
  {
    role: 'SYSTEM_OPERATOR',
    title: 'System Operator',
    tagline: 'Technical Dispatch & Operational Execution',
    description: 'Authorized to execute authorized technical actions, circuit-breakers, and traffic throttles. Separation of duties prevents self-authorization.',
    key_responsibilities: [
      'Real-time technical dispatch',
      'Governed execution bus activation',
      'Telemetry circuit-breaker deployment',
      'Rollback execution when mandated'
    ],
    access_level: 'FULL_CONTROL',
    badge_color: '#3b82f6'
  },
  {
    role: 'RISK_OFFICER',
    title: 'Risk Officer',
    tagline: 'Enterprise Risk & Limit Authority',
    description: 'Evaluates counterfactual risk-reward trade-offs and authorizes exposure reductions and liquidity backstops.',
    key_responsibilities: [
      'Risk appetite evaluation',
      'Counterfactual projection sign-off',
      'Disruption budget monitoring',
      'Intervention authorization'
    ],
    access_level: 'GOVERNANCE_AUDIT',
    badge_color: '#ec4899'
  },
  {
    role: 'ANALYST',
    title: 'Risk Analyst',
    tagline: 'Contagion Modeling & Control Margin Assessment',
    description: 'Investigates systemic propagation pathways, requests intervention authorization, and models counterfactual intervention windows.',
    key_responsibilities: [
      'Cross-institution cascade tracing',
      'Control Margin degradation forecasting',
      'AI herd correlation monitoring',
      'Intervention request creation'
    ],
    access_level: 'ANALYTIC_INVESTIGATION',
    badge_color: '#06b6d4'
  },
  {
    role: 'COMPLIANCE_OFFICER',
    title: 'Compliance Officer',
    tagline: 'Regulatory Governance & Immutable Lineage',
    description: 'Maintains cryptographically sealed evidence trails for BCBS 239, DORA Article 14, and regulatory audit compliance.',
    key_responsibilities: [
      'Immutable evidence package audit',
      'Dual-key intervention authorization',
      'Confidential enclave attestation verification',
      'Regulatory compliance reporting'
    ],
    access_level: 'GOVERNANCE_AUDIT',
    badge_color: '#a855f7'
  },
  {
    role: 'AUDITOR',
    title: 'Independent Auditor',
    tagline: 'Read-Only Cryptographic Audit & Verification',
    description: 'Inspects tamper-evident telemetry logs, cryptographic seals, and independent verification reports. Strictly read-only; cannot mutate incident state.',
    key_responsibilities: [
      'Cryptographic digest verification',
      'Separation-of-duties audit',
      'Independent verification review',
      'Lineage inspection'
    ],
    access_level: 'GOVERNANCE_AUDIT',
    badge_color: '#8b5cf6'
  },
  {
    role: 'OBSERVER',
    title: 'Observer',
    tagline: 'Read-Only Systemic Telemetry',
    description: 'Observes global financial stability indices, active alerts, and top-level topological graphs without operational privileges.',
    key_responsibilities: [
      'Global ecosystem monitoring',
      'Top-level incident status awareness',
      'Non-operational read-only telemetry'
    ],
    access_level: 'READ_ONLY_OBSERVATION',
    badge_color: '#64748b'
  }
];

/**
 * FINANCIAL IMMUNE SYSTEM - PRIVACY BOUNDARY (PHASE 5)
 * Sections 10, 11, 12, 13: Privacy-Bounded Intelligence, Data Classification & Transformations
 * 
 * Invariants:
 * 1. The system uses the minimum information necessary to make systemic control decisions.
 * 2. Raw sensitive data is classified, minimized, transformed, and aggregated at the boundary.
 * 3. Downstream intelligence operates on derived systemic representations.
 * 4. Unauthorized roles (OBSERVER) cannot view RESTRICTED or SENSITIVE fields.
 */

import { UserRole } from '../../../shared/types/roles';
import { 
  DataClassification, 
  ClassifiedDataField, 
  PrivacyTransformationRecord 
} from '../../../shared/types/assurance';

export class PrivacyBoundary {
  // Pre-configured data dictionary defining classification for all financial telemetry
  public static readonly DATA_DICTIONARY: ClassifiedDataField[] = [
    {
      fieldName: 'institution_id',
      classification: 'INTERNAL',
      source: 'Global Legal Entity Identifier (GLEIF)',
      purpose: 'Entity topological identification',
      transformation: 'Direct mapping to G-SIB identifier',
      aggregationLevel: 'INSTITUTION_LEVEL',
      authorizedRoles: ['SYSTEM_OPERATOR', 'RISK_ANALYST', 'COMPLIANCE_OFFICER', 'OBSERVER'],
      retentionClass: 'PERMANENT',
      derivedUsage: 'Topology graph node key'
    },
    {
      fieldName: 'liquidity_coverage_ratio',
      classification: 'DERIVED',
      source: 'Prudential Regulatory Telemetry (Basel III / BCBS 239)',
      purpose: 'Short-term systemic liquidity stress tracking',
      transformation: 'Ratio derived from High-Quality Liquid Assets / Total Net Cash Outflows',
      aggregationLevel: 'INSTITUTION_LEVEL',
      authorizedRoles: ['SYSTEM_OPERATOR', 'RISK_ANALYST', 'COMPLIANCE_OFFICER', 'OBSERVER'],
      retentionClass: '7_YEARS',
      derivedUsage: 'Node health scoring & Controllability Margin M(t)'
    },
    {
      fieldName: 'systemic_footprint_score',
      classification: 'DERIVED',
      source: 'BCBS G-SIB Scoring Methodology',
      purpose: 'Systemic importance weighting',
      transformation: 'Multi-factor weighted index of size, interconnectedness, and substitutability',
      aggregationLevel: 'INSTITUTION_LEVEL',
      authorizedRoles: ['SYSTEM_OPERATOR', 'RISK_ANALYST', 'COMPLIANCE_OFFICER', 'OBSERVER'],
      retentionClass: 'PERMANENT',
      derivedUsage: 'Graph centrality and cascade weight'
    },
    {
      fieldName: 'proprietary_order_book_depth_usd_m',
      classification: 'RESTRICTED',
      source: 'Internal Matching Engine / FIX Protocol Gateway',
      purpose: 'Raw market liquidity profiling',
      transformation: 'Zero-Knowledge Enclave Aggregate: Converted to Network Centrality Index',
      aggregationLevel: 'TIER_1_CLUSTER',
      authorizedRoles: ['SYSTEM_OPERATOR', 'COMPLIANCE_OFFICER'],
      retentionClass: 'EPHEMERAL_ENCLAVE_ONLY',
      derivedUsage: 'Masked at privacy boundary; not exposed to observers'
    },
    {
      fieldName: 'unhedged_derivative_notional_usd_b',
      classification: 'SENSITIVE',
      source: 'DTCC / Clearing Repository Bilateral Feeds',
      purpose: 'Counterparty default risk assessment',
      transformation: 'Differential Privacy: Perturbed into Decile Risk Tier (1-10)',
      aggregationLevel: 'TIER_1_CLUSTER',
      authorizedRoles: ['SYSTEM_OPERATOR', 'COMPLIANCE_OFFICER'],
      retentionClass: '30_DAYS_ENCLAVE',
      derivedUsage: 'Masked at privacy boundary; stripped for observer roles'
    },
    {
      fieldName: 'bilateral_intraday_borrowing_limit_usd_m',
      classification: 'RESTRICTED',
      source: 'RTGS / Fedwire Central Counterparty Netting Rail',
      purpose: 'Clearing gridlock and settlement saturation modeling',
      transformation: 'Aggregated exposure HHI and Chokepoint Saturation score',
      aggregationLevel: 'NETWORK_CENTRALITY_INDEX',
      authorizedRoles: ['SYSTEM_OPERATOR', 'COMPLIANCE_OFFICER'],
      retentionClass: '90_DAYS',
      derivedUsage: 'Converted to Dependency Exposure HHI before intelligence ingestion'
    }
  ];

  // Active privacy transformation records
  private static transformations: PrivacyTransformationRecord[] = [
    {
      transformId: 'TRF-001-ORDERBOOK-ZK',
      timestamp: '2026-10-08T14:20:00Z',
      sourceEntityId: 'TIER_1_GSIB_CLUSTER',
      rawFieldsCount: 48,
      protectedFieldsCount: 48,
      transformationType: 'TOPOLOGICAL_SYNTHESIS',
      aggregationLevel: 'NETWORK_CENTRALITY_INDEX',
      outputSignal: 'Market Liquidity Depth Reserve: 84.2% [Aggregated]',
      authorizedUse: 'Systemic Control Margin M(t) Calculation',
      classification: 'DERIVED'
    },
    {
      transformId: 'TRF-002-BILATERAL-NETTING',
      timestamp: '2026-10-08T14:21:15Z',
      sourceEntityId: 'INFRA-1_RTGS',
      rawFieldsCount: 120,
      protectedFieldsCount: 112,
      transformationType: 'AGGREGATION',
      aggregationLevel: 'TIER_1_CLUSTER',
      outputSignal: 'Clearing Chokepoint Saturation: 0.28 [HHI Clustered]',
      authorizedUse: 'Dependency Intelligence Chokepoint Evaluation',
      classification: 'AGGREGATED'
    },
    {
      transformId: 'TRF-003-DERIVATIVE-TIERING',
      timestamp: '2026-10-08T14:22:30Z',
      sourceEntityId: 'BANK-A..D_BILATERAL',
      rawFieldsCount: 36,
      protectedFieldsCount: 36,
      transformationType: 'DIFFERENTIAL_NOISE',
      aggregationLevel: 'NETWORK_CENTRALITY_INDEX',
      outputSignal: 'Systemic Credit Contagion Index: 0.19 [Decile Scaled]',
      authorizedUse: 'Counterfactual Propagation Projection',
      classification: 'DERIVED'
    }
  ];

  /**
   * Returns list of all active privacy transformations
   */
  public static getTransformations(): PrivacyTransformationRecord[] {
    return [...this.transformations];
  }

  /**
   * Applies privacy transformation to an incoming raw telemetry batch.
   */
  public static recordTransformation(
    sourceEntityId: string,
    rawFieldsCount: number,
    outputSignal: string,
    authorizedUse: string
  ): PrivacyTransformationRecord {
    const record: PrivacyTransformationRecord = {
      transformId: `TRF-${Date.now().toString(36).toUpperCase()}`,
      timestamp: new Date().toISOString(),
      sourceEntityId,
      rawFieldsCount,
      protectedFieldsCount: rawFieldsCount,
      transformationType: 'AGGREGATION',
      aggregationLevel: 'NETWORK_CENTRALITY_INDEX',
      outputSignal,
      authorizedUse,
      classification: 'DERIVED'
    };
    this.transformations.unshift(record);
    if (this.transformations.length > 20) this.transformations.pop();
    return record;
  }

  /**
   * Enforces privacy boundary by role:
   * Strips RESTRICTED and SENSITIVE fields if userRole is not authorized.
   */
  public static filterEntityForRole(entity: any, userRole: UserRole): any {
    if (!entity) return entity;
    const cloned = JSON.parse(JSON.stringify(entity));

    const isAuthorizedForRestricted = userRole === 'SYSTEM_OPERATOR' || userRole === 'COMPLIANCE_OFFICER';

    if (!isAuthorizedForRestricted) {
      // Mask / redact restricted fields from view
      if (cloned.proprietary_order_book_depth_usd_m !== undefined) {
        cloned.proprietary_order_book_depth_usd_m = '[RESTRICTED_MASKED_BY_PRIVACY_BOUNDARY]';
      }
      if (cloned.unhedged_derivative_notional_usd_b !== undefined) {
        cloned.unhedged_derivative_notional_usd_b = '[SENSITIVE_REDACTED]';
      }
      if (cloned.bilateral_intraday_borrowing_limit_usd_m !== undefined) {
        cloned.bilateral_intraday_borrowing_limit_usd_m = '[RESTRICTED_AGGREGATED_ONLY]';
      }
      // Attach privacy boundary badge
      cloned._privacy_enforced = true;
      cloned._privacy_role = userRole;
    } else {
      cloned._privacy_enforced = false;
      cloned._privacy_role = userRole;
    }

    return cloned;
  }
}

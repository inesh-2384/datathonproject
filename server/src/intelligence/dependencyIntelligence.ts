/**
 * FINANCIAL IMMUNE SYSTEM - DEPENDENCY INTELLIGENCE ENGINE (PHASE 3)
 * Intelligence Layer 1: Structural Dependency Analysis & Concentration Metrics
 * 
 * Rules:
 * 1. Every metric has explicit formula, source, update trigger, and truth status.
 * 2. Strict Data Truth: Labeled DERIVED from topology or SIMULATED.
 * 3. Supports Herfindahl-Hirschman Index (HHI) for systemic concentration.
 */

import { Dependency, Institution, DataProvider, InfrastructureNode, AIModel } from '../../../shared/types/domain';
import { 
  DependencyIntelligenceRecord, 
  SystemicConcentrationMetrics, 
  DependencyCriticality 
} from '../../../shared/types/intelligence';

/**
 * Normalizes health status to [0.0 - 1.0]
 */
function getNormalizedHealth(status: string): number {
  switch (status) {
    case 'STABLE':
    case 'RESTORED':
      return 1.0;
    case 'RECOVERING':
      return 0.85;
    case 'UNVERIFIED':
    case 'CONFLICTED':
      return 0.60;
    case 'DEGRADING':
    case 'RESIDUAL_RISK':
      return 0.40;
    case 'CRITICAL':
    case 'OBSERVATION_GAP':
      return 0.15;
    case 'COMPROMISED':
    case 'COLLAPSING':
      return 0.0;
    default:
      return 1.0;
  }
}

/**
 * Calculates dependency-level structural intelligence for all edges.
 */
export function computeDependencyIntelligence(
  dependencies: Dependency[],
  institutions: Institution[],
  dataProviders: DataProvider[],
  infrastructureNodes: InfrastructureNode[]
): DependencyIntelligenceRecord[] {
  const records: DependencyIntelligenceRecord[] = [];
  const totalDepWeight = dependencies.reduce((acc, d) => acc + (d.exposure_weight || 0.5), 0);

  // Map out incoming and outgoing adjacency
  const downstreamMap = new Map<string, string[]>();
  const upstreamMap = new Map<string, string[]>();

  for (const dep of dependencies) {
    if (!downstreamMap.has(dep.source_id)) downstreamMap.set(dep.source_id, []);
    downstreamMap.get(dep.source_id)!.push(dep.target_id);

    if (!upstreamMap.has(dep.target_id)) upstreamMap.set(dep.target_id, []);
    upstreamMap.get(dep.target_id)!.push(dep.source_id);
  }

  for (const dep of dependencies) {
    const health = getNormalizedHealth(dep.status);

    // 1. Centrality: Degree of source + target relative to network scale
    const sourceDegree = (downstreamMap.get(dep.source_id)?.length || 0);
    const targetDegree = (upstreamMap.get(dep.target_id)?.length || 0);
    const centralityScore = Math.min(1.0, +((sourceDegree + targetDegree) / (institutions.length + 4)).toFixed(2));

    // 2. Affected Entity Count (downstream BFS up to 2 hops)
    const affectedSet = new Set<string>();
    affectedSet.add(dep.target_id);
    const secondaryHop = downstreamMap.get(dep.target_id) || [];
    for (const s of secondaryHop) affectedSet.add(s);
    const affectedCount = affectedSet.size;

    // 3. Systemic Reach: Summed systemic footprint of affected entities
    let reachScore = 0;
    for (const id of affectedSet) {
      const inst = institutions.find(i => i.institution_id === id);
      reachScore += inst ? (inst.systemic_footprint_score || 0.5) : 0.4;
    }
    const systemicReach = Math.min(1.0, +(reachScore / Math.max(1, institutions.length * 0.7)).toFixed(2));

    // 4. Exposure Concentration: Dependency weight share relative to all incoming paths to target
    const incomingWeights = dependencies
      .filter(d => d.target_id === dep.target_id)
      .map(d => d.exposure_weight || 0.5);
    const totalIncoming = incomingWeights.reduce((a, b) => a + b, 0);
    const weightShare = totalIncoming > 0 ? (dep.exposure_weight || 0.5) / totalIncoming : 1.0;
    const exposureHhi = +(weightShare * weightShare).toFixed(2);

    // 5. Redundancy: Count of alternative incoming dependencies for target
    const redundancyPaths = Math.max(0, (upstreamMap.get(dep.target_id)?.length || 1) - 1);

    // 6. Criticality Classification
    let criticality: DependencyCriticality = 'LOW';
    if (dep.is_chokepoint) {
      criticality = 'CHOKEPOINT';
    } else if (systemicReach > 0.6 || (dep.exposure_weight || 0) > 0.8) {
      criticality = 'CRITICAL';
    } else if (systemicReach > 0.35 || (dep.exposure_weight || 0) > 0.6) {
      criticality = 'HIGH';
    } else if (systemicReach > 0.2) {
      criticality = 'MEDIUM';
    }

    // 7. Propagation Contribution (severity if degraded)
    const propagationContribution = dep.status !== 'STABLE' && dep.status !== 'RESTORED'
      ? +( (1.0 - health) * (dep.exposure_weight || 0.5) * (dep.is_chokepoint ? 1.5 : 1.0) ).toFixed(2)
      : 0.0;

    records.push({
      dependency_id: dep.dependency_id,
      source_id: dep.source_id,
      target_id: dep.target_id,
      type: dep.type,
      centrality_score: centralityScore,
      affected_entity_count: affectedCount,
      systemic_reach_score: systemicReach,
      exposure_concentration_hhi: exposureHhi,
      redundancy_path_count: redundancyPaths,
      current_health: health,
      propagation_contribution: Math.min(1.0, propagationContribution),
      criticality,
      is_chokepoint: !!dep.is_chokepoint,
      truth_status: 'DERIVED'
    });
  }

  return records;
}

/**
 * Calculates network-wide Systemic Concentration across 4 dimensions.
 */
export function computeSystemicConcentrationMetrics(
  dependencies: Dependency[],
  institutions: Institution[],
  dataProviders: DataProvider[],
  infrastructureNodes: InfrastructureNode[],
  aiModels: AIModel[]
): SystemicConcentrationMetrics {
  // 1. Data Oracle Concentration HHI
  // Measure distribution of institution dependencies on each data provider
  const providerUsage = new Map<string, number>();
  for (const dep of dependencies) {
    if (dataProviders.some(p => p.provider_id === dep.source_id)) {
      providerUsage.set(dep.source_id, (providerUsage.get(dep.source_id) || 0) + 1);
    }
  }
  const totalProviderDeps = Array.from(providerUsage.values()).reduce((a, b) => a + b, 0);
  let dataHhi = 0;
  if (totalProviderDeps > 0) {
    for (const count of providerUsage.values()) {
      const share = count / totalProviderDeps;
      dataHhi += share * share;
    }
  } else {
    dataHhi = 0.5;
  }

  // 2. Infrastructure Concentration HHI
  const infraUsage = new Map<string, number>();
  for (const dep of dependencies) {
    if (infrastructureNodes.some(n => n.node_id === dep.source_id)) {
      infraUsage.set(dep.source_id, (infraUsage.get(dep.source_id) || 0) + 1);
    }
  }
  const totalInfraDeps = Array.from(infraUsage.values()).reduce((a, b) => a + b, 0);
  let infraHhi = 0;
  if (totalInfraDeps > 0) {
    for (const count of infraUsage.values()) {
      const share = count / totalInfraDeps;
      infraHhi += share * share;
    }
  } else {
    infraHhi = 0.5;
  }

  // 3. Model Concentration HHI
  // Distribution of institutions using distinct models
  const modelUsage = new Map<string, number>();
  for (const inst of institutions) {
    for (const mId of inst.active_ai_models || []) {
      modelUsage.set(mId, (modelUsage.get(mId) || 0) + 1);
    }
  }
  const totalModelUsages = Array.from(modelUsage.values()).reduce((a, b) => a + b, 0);
  let modelHhi = 0;
  if (totalModelUsages > 0) {
    for (const count of modelUsage.values()) {
      const share = count / totalModelUsages;
      modelHhi += share * share;
    }
  } else {
    modelHhi = 0.25;
  }

  // 4. Dependency Exposure HHI across chokepoint weights
  const chokepoints = dependencies.filter(d => d.is_chokepoint);
  const totalChokeWeight = chokepoints.reduce((a, b) => a + (b.exposure_weight || 0.5), 0);
  let depHhi = 0;
  if (totalChokeWeight > 0) {
    for (const cp of chokepoints) {
      const share = (cp.exposure_weight || 0.5) / totalChokeWeight;
      depHhi += share * share;
    }
  } else {
    depHhi = 0.33;
  }

  // Composite Weighted Index
  const compositeIndex = +(dataHhi * 0.30 + infraHhi * 0.30 + modelHhi * 0.20 + depHhi * 0.20).toFixed(2);

  return {
    data_concentration_hhi: +dataHhi.toFixed(2),
    infrastructure_concentration_hhi: +infraHhi.toFixed(2),
    model_concentration_hhi: +modelHhi.toFixed(2),
    dependency_exposure_hhi: +depHhi.toFixed(2),
    composite_concentration_index: compositeIndex,
    truth_status: 'DERIVED'
  };
}

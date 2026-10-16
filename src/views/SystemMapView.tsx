/**
 * FINANCIAL IMMUNE SYSTEM - SYSTEM MAP (DEPENDENCY GRAPH) (MODULE 04)
 * State-Driven Topological Network & Dependency Relationship Inspector
 * 
 * Features:
 * - Circular topological network graph with DATA-X at center and radiating ecosystem nodes
 * - Interactive Node Selection AND Dependency Edge / Relationship Inspection
 * - Live state reaction across Nominal Baseline (91%), Active Shock (65%), Residual Contagion (42%), and Restored (84%)
 */

import React, { useState, useEffect } from 'react';
import { useSystemStore } from '../store/useSystemStore';
import { FinancialGlobe } from '../components/globe/FinancialGlobe';
import { 
  Network, 
  Share2, 
  ArrowRight,
  Sliders
} from 'lucide-react';

interface EnrichedMapNode {
  id: string;
  name: string;
  type: string;
  label: string;
  angle: number;
  r: number;
  color: string;
  isCenter?: boolean;
  status: string;
  criticality: string;
  sharedBy: string;
  dependenciesCount: number;
  affectedNodes: number;
  evidenceSignals: number;
  controlContribution: string;
  upstream: string[];
  downstream: string[];
  relationshipSummary: string;
}

interface InspectableRelationship {
  id: string;
  source: string;
  target: string;
  edgeType: 'INFORMATION' | 'AI_MODEL' | 'FINANCIAL' | 'INFRASTRUCTURE' | 'BEHAVIOURAL';
  status: string;
  weight: string;
  mechanism: string;
  consequence: string;
}

export const SystemMapView: React.FC = () => {
  const [viewMode, setViewMode] = useState<'RADIAL_GRAPH' | '3D_GLOBE'>('RADIAL_GRAPH');
  const [activeNodeId, setActiveNodeId] = useState<string>('DATA-X');
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);

  const institutions = useSystemStore(state => state.institutions);
  const dependencies = useSystemStore(state => state.dependencies);
  const dataProviders = useSystemStore(state => state.dataProviders);
  const infrastructureNodes = useSystemStore(state => state.infrastructureNodes);
  const selectEntity = useSystemStore(state => state.selectEntity);
  const selectedEntityId = useSystemStore(state => state.selectedEntityId);
  const controlState = useSystemStore(state => state.controlState);
  const scenarioState = useSystemStore(state => state.scenarioState);
  const activeIncident = useSystemStore(state => state.activeIncident);
  const setCurrentRoute = useSystemStore(state => state.setCurrentRoute);

  const isAttack = (scenarioState === 'ATTACK_TRIGGERED' || (activeIncident !== null && activeIncident.status !== 'RESOLVED')) && controlState.overall_status !== 'STABLE';
  const isUnverifiedFailure = controlState.overall_status === 'RESIDUAL_RISK' || controlState.controllability_state === 'CONTROL_NOT_RESTORED';
  const isRestored = !isAttack && controlState.control_margin_percent >= 80 && controlState.control_margin_percent < 90;

  // Reset local selection when store resets
  useEffect(() => {
    if (!selectedEntityId && !isAttack && !isUnverifiedFailure) {
      setActiveNodeId('DATA-X');
      setSelectedEdgeId(null);
    }
  }, [selectedEntityId, isAttack, isUnverifiedFailure]);

  const dataX = dataProviders.find(p => p.provider_id === 'DATA-X');
  const bankA = institutions.find(i => i.institution_id === 'BANK-A');
  const bankB = institutions.find(i => i.institution_id === 'BANK-B');
  const bankC = institutions.find(i => i.institution_id === 'BANK-C');
  const infra1 = infrastructureNodes.find(n => n.node_id === 'INFRA-1');

  const graphNodes: EnrichedMapNode[] = [
    {
      id: 'DATA-X',
      name: 'DATA-X',
      type: 'DATA_PROVIDER',
      label: 'Shared Market Oracle Hub',
      angle: 0,
      r: 0,
      isCenter: true,
      color: isUnverifiedFailure ? '#f59e0b' : isAttack ? '#ef4444' : isRestored ? '#06b6d4' : '#10b981',
      status: isUnverifiedFailure ? 'ISOLATED_AT_GATEWAY' : isAttack ? (dataX?.status || 'COMPROMISED') : isRestored ? 'QUARANTINED_SAFE' : 'STABLE',
      criticality: isAttack ? 'CRITICAL (HHI 0.73)' : 'MODERATE (HHI 0.57)',
      sharedBy: '14 institutions & 6 AI models',
      dependenciesCount: 28,
      affectedNodes: isAttack ? 8 : isUnverifiedFailure ? 4 : 0,
      evidenceSignals: isAttack ? 6 : 2,
      controlContribution: isAttack ? '-22 pts Control Margin degradation' : '0 pts penalty (Nominal variance)',
      upstream: ['EXTERNAL_SWAP_VENUES'],
      downstream: ['MODEL-A', 'MODEL-C', 'BANK-A', 'BANK-B', 'ASSET-17'],
      relationshipSummary: isAttack
        ? 'Primary systemic chokepoint broadcasting +18.4% synthetic pricing drift across 28 downstream edges.'
        : isUnverifiedFailure
        ? 'Primary DATA-X feed isolated via circuit breaker, but secondary cached drift persists in MODEL-C.'
        : 'Operating within ±0.12% nominal swap pricing tolerance.'
    },
    {
      id: 'BANK-A',
      name: 'BANK-A',
      type: 'FINANCIAL_INSTITUTION',
      label: 'Tier-1 G-SIB Dealer',
      angle: 45,
      r: 140,
      color: isAttack ? '#f59e0b' : '#a855f7',
      status: isAttack ? (bankA?.status || 'DEGRADING') : isRestored ? 'RESTORED' : 'STABLE',
      criticality: isAttack ? 'HIGH (LIQUIDITY_STRESS)' : 'NOMINAL',
      sharedBy: '7 bilateral interbank counterparties',
      dependenciesCount: 16,
      affectedNodes: isAttack ? 5 : 0,
      evidenceSignals: isAttack ? 4 : 1,
      controlContribution: isAttack ? '-9 pts Cascade Multi-Hop drain' : '0 pts (Buffer at 96%)',
      upstream: ['DATA-X', 'MODEL-A'],
      downstream: ['INFRA-1', 'BANK-B', 'MARKET-1'],
      relationshipSummary: isAttack
        ? 'Executing automated one-way SELL liquidations (€420M) triggered by MODEL-A recalibration.'
        : 'Intraday liquidity reserve and bilateral credit lines nominal.'
    },
    {
      id: 'BANK-B',
      name: 'BANK-B',
      type: 'FINANCIAL_INSTITUTION',
      label: 'Tier-1 G-SIB Clearing Member',
      angle: 90,
      r: 140,
      color: isAttack ? '#f59e0b' : '#a855f7',
      status: isAttack ? (bankB?.status || 'DEGRADING') : isRestored ? 'RESTORED' : 'STABLE',
      criticality: isAttack ? 'HIGH (HERD_CORRELATED)' : 'NOMINAL',
      sharedBy: '6 bilateral interbank counterparties',
      dependenciesCount: 14,
      affectedNodes: isAttack ? 4 : 0,
      evidenceSignals: isAttack ? 4 : 1,
      controlContribution: isAttack ? '-8 pts Synchronized Run pressure' : '0 pts (Buffer at 94%)',
      upstream: ['DATA-X', 'MODEL-A', 'BANK-A'],
      downstream: ['INFRA-1', 'INFRA-2'],
      relationshipSummary: isAttack
        ? '0.91 portfolio liquidation correlation with BANK-A, compounding margin calls on INFRA-1.'
        : 'Normal settlement velocity across wholesale clearing rails.'
    },
    {
      id: 'BANK-C',
      name: 'BANK-C',
      type: 'FINANCIAL_INSTITUTION',
      label: 'G-SIB Derivatives Hub',
      angle: 135,
      r: 140,
      color: isUnverifiedFailure ? '#ef4444' : isAttack ? '#f59e0b' : '#a855f7',
      status: isUnverifiedFailure ? 'RESIDUAL_CONTAGION' : isAttack ? (bankC?.status || 'DEGRADING') : 'STABLE',
      criticality: isUnverifiedFailure ? 'CRITICAL (MODEL-C VECTOR)' : isAttack ? 'ELEVATED' : 'NOMINAL',
      sharedBy: '5 bilateral counterparties',
      dependenciesCount: 11,
      affectedNodes: isUnverifiedFailure ? 4 : isAttack ? 3 : 0,
      evidenceSignals: isUnverifiedFailure ? 5 : 2,
      controlContribution: isUnverifiedFailure ? '-19 pts Residual Latent Contagion' : isAttack ? '-5 pts Secondary Exposure' : '0 pts',
      upstream: ['DATA-X', 'MODEL-C'],
      downstream: ['INFRA-2', 'ASSET-17'],
      relationshipSummary: isUnverifiedFailure
        ? 'Experiencing latent collateral drain driven by unquarantined MODEL-C secondary credit engine.'
        : 'Derivatives margining within standard risk corridor.'
    },
    {
      id: 'MODEL-A',
      name: 'MODEL-A',
      type: 'AI_MODEL',
      label: 'Cross-Bank Execution AI',
      angle: 180,
      r: 140,
      color: isAttack ? '#ef4444' : '#06b6d4',
      status: isAttack ? 'HERD_SYNCHRONY_91%' : isRestored ? 'DIVERSITY_RESTORED' : 'STABLE',
      criticality: isAttack ? 'CRITICAL (EDD = 0.15)' : 'NOMINAL (EDD = 0.61)',
      sharedBy: '8 G-SIB execution desks',
      dependenciesCount: 9,
      affectedNodes: isAttack ? 6 : 0,
      evidenceSignals: isAttack ? 5 : 1,
      controlContribution: isAttack ? '-18 pts Decision Diversity collapse' : '0 pts (Independent inference)',
      upstream: ['DATA-X'],
      downstream: ['BANK-A', 'BANK-B', 'MARKET-1'],
      relationshipSummary: isAttack
        ? 'Output entropy collapsed below 0.12 bits; 8 institutional instances issuing identical SELL signals.'
        : 'Operating with independent feature weights (Effective Decision Diversity = 0.61).'
    },
    {
      id: 'MODEL-C',
      name: 'MODEL-C',
      type: 'AI_MODEL',
      label: 'Derivative Risk Engine (SHARED_MODEL)',
      angle: 210,
      r: 140,
      color: isUnverifiedFailure ? '#ef4444' : isAttack ? '#f59e0b' : '#06b6d4',
      status: isUnverifiedFailure ? 'LATENT_DRIFT_ACTIVE' : isAttack ? 'SHARED_MODEL CORRELATED_DRIFT' : isRestored ? 'QUARANTINED' : 'STABLE',
      criticality: isUnverifiedFailure ? 'CRITICAL (UNVERIFIED_FAILURE)' : 'MODERATE',
      sharedBy: '5 G-SIB credit desks',
      dependenciesCount: 8,
      affectedNodes: isUnverifiedFailure ? 4 : isAttack ? 4 : 0,
      evidenceSignals: isUnverifiedFailure ? 6 : 2,
      controlContribution: isUnverifiedFailure ? '-30 pts Unresolved Latent Contagion (Holds M(t) at 42%)' : '0 pts',
      upstream: ['DATA-X', 'ASSET-17'],
      downstream: ['BANK-C', 'INFRA-2'],
      relationshipSummary: isUnverifiedFailure
        ? 'Derivative Risk Engine (SHARED_MODEL) retained poisoned swap covariance cache after DATA-X disconnect, preventing systemic recovery until 2nd backstop.'
        : 'Derivative Risk Engine (SHARED_MODEL) inference synchronized with verified enclave baseline.'
    },
    {
      id: 'ASSET-17',
      name: 'ASSET-17',
      type: 'ASSET',
      label: 'Synthetic Swap Basket',
      angle: 245,
      r: 140,
      color: isAttack ? '#ef4444' : '#f97316',
      status: isAttack ? 'DISLOCATED (-18.4%)' : 'STABLE',
      criticality: isAttack ? 'HIGH' : 'LOW',
      sharedBy: '11 institutional balance sheets',
      dependenciesCount: 11,
      affectedNodes: isAttack ? 6 : 0,
      evidenceSignals: isAttack ? 3 : 1,
      controlContribution: isAttack ? '-6 pts Collateral haircut spike' : '0 pts',
      upstream: ['DATA-X'],
      downstream: ['MODEL-C', 'BANK-C'],
      relationshipSummary: isAttack
        ? 'Reference collateral basket mispriced due to DATA-X synthetic swap feed corruption.'
        : 'Collateral valuation aligned with sovereign benchmark curve.'
    },
    {
      id: 'INFRA-1',
      name: 'INFRA-1',
      type: 'INFRASTRUCTURE',
      label: 'Wholesale RTGS Settlement Rail',
      angle: 285,
      r: 140,
      color: isAttack ? '#ef4444' : '#3b82f6',
      status: isAttack ? (infra1?.status || 'CHOKED_78%') : 'STABLE',
      criticality: isAttack ? 'CRITICAL_CHOKEPOINT' : 'HIGH_CAPACITY',
      sharedBy: '20 G-SIBs & Clearing Houses',
      dependenciesCount: 20,
      affectedNodes: isAttack ? 8 : 0,
      evidenceSignals: isAttack ? 5 : 2,
      controlContribution: isAttack ? '-12 pts Chokepoint Saturation' : '0 pts (24% utilization)',
      upstream: ['BANK-A', 'BANK-B'],
      downstream: ['INFRA-2', 'MARKET-1'],
      relationshipSummary: isAttack
        ? 'Intraday settlement queue saturation at 78% due to synchronized G-SIB margin calls.'
        : 'Clearing wholesale interbank settlement with <0.4ms latency.'
    },
    {
      id: 'INFRA-2',
      name: 'INFRA-2',
      type: 'INFRASTRUCTURE',
      label: 'Central Counterparty (CCP)',
      angle: 325,
      r: 140,
      color: isAttack || isUnverifiedFailure ? '#f59e0b' : '#3b82f6',
      status: isUnverifiedFailure ? 'MARGIN_PRESSURE' : isAttack ? 'DEGRADING' : 'STABLE',
      criticality: isAttack || isUnverifiedFailure ? 'ELEVATED' : 'NOMINAL',
      sharedBy: '16 clearing members',
      dependenciesCount: 16,
      affectedNodes: isAttack ? 4 : 0,
      evidenceSignals: 3,
      controlContribution: isAttack ? '-5 pts CCP default fund draw' : '0 pts',
      upstream: ['BANK-B', 'BANK-C', 'MODEL-C'],
      downstream: ['MARKET-1'],
      relationshipSummary: isUnverifiedFailure
        ? 'Observing secondary variation margin deficit from BANK-C / MODEL-C latent vector.'
        : 'Default fund and variation margin buffers within regulatory thresholds.'
    },
    {
      id: 'MARKET-1',
      name: 'MARKET-1',
      type: 'MARKET_VENUE',
      label: 'Sovereign Rates Orderbook',
      angle: 0,
      r: 140,
      color: isAttack ? '#f59e0b' : '#10b981',
      status: isAttack ? 'SPREAD_WIDENING' : 'STABLE',
      criticality: isAttack ? 'ELEVATED' : 'NOMINAL',
      sharedBy: '20 market makers',
      dependenciesCount: 15,
      affectedNodes: isAttack ? 3 : 0,
      evidenceSignals: 2,
      controlContribution: isAttack ? '-3 pts Orderbook depth depletion' : '0 pts',
      upstream: ['BANK-A', 'MODEL-A', 'INFRA-1'],
      downstream: [],
      relationshipSummary: isAttack
        ? 'Bid-ask spread widened 4.2x under synchronized algorithmic sell pressure.'
        : 'Orderbook depth balanced across 20 institutional market makers.'
    }
  ];

  const inspectableRelationships: InspectableRelationship[] = [
    {
      id: 'REL-DATAX-MODELA',
      source: 'DATA-X',
      target: 'MODEL-A',
      edgeType: 'INFORMATION',
      status: isAttack ? 'CORRUPTED_FEED (+18.4%)' : isRestored || isUnverifiedFailure ? 'CIRCUIT_ISOLATED' : 'NOMINAL_STREAM',
      weight: 'Criticality 0.94 (HHI 0.73)',
      mechanism: 'Shared real-time swap curve ingestion API consumed without secondary oracle quorum',
      consequence: isAttack
        ? 'Forces all 8 MODEL-A instances to compute identical tail-risk liquidation signals (-22 pts M(t)).'
        : 'Feed isolated or operating within verified baseline bounds.'
    },
    {
      id: 'REL-MODELA-BANKA',
      source: 'MODEL-A',
      target: 'BANK-A',
      edgeType: 'AI_MODEL',
      status: isAttack ? 'HERD_LIQUIDATION (91%)' : 'INDEPENDENT_DECISION',
      weight: 'Coupling 0.91',
      mechanism: 'Automated execution bridge dispatching unthrottled FIX sell orders from AI risk engine',
      consequence: isAttack
        ? 'Converts informational drift into €420M immediate liquidity drain on BANK-A.'
        : 'AI execution bridge operating with diverse independent decision thresholds.'
    },
    {
      id: 'REL-BANKA-INFRA1',
      source: 'BANK-A',
      target: 'INFRA-1',
      edgeType: 'INFRASTRUCTURE',
      status: isAttack ? 'QUEUE_SATURATION (78%)' : 'CLEAR_SETTLEMENT',
      weight: 'Exposure €800M',
      mechanism: 'Intraday RTGS collateral and variation margin settlement rail',
      consequence: isAttack
        ? 'Synchronized G-SIB sell-offs exhaust intraday buffer headroom at INFRA-1.'
        : 'Settlement queue clearing with 94% buffer capacity.'
    },
    {
      id: 'REL-MODELC-BANKC',
      source: 'MODEL-C',
      target: 'BANK-C',
      edgeType: 'BEHAVIOURAL',
      status: isUnverifiedFailure ? 'ACTIVE_LATENT_CONTAGION' : isAttack ? 'SECONDARY_COUPLING' : isRestored ? 'THROTTLED_SAFE' : 'NOMINAL',
      weight: 'Latent Coupling 0.86',
      mechanism: 'Cached cross-currency swap covariance matrix driving automated collateral haircuts',
      consequence: isUnverifiedFailure
        ? 'CRITICAL: Persists after DATA-X isolation, holding Control Margin at 42% and causing Independent Verification failure!'
        : 'Secondary credit valuation loop operating within safe bounds.'
    }
  ];

  const selectedNode = graphNodes.find(n => n.id === activeNodeId) || graphNodes[0];
  const selectedRelationship = inspectableRelationships.find(r => r.id === selectedEdgeId) || null;

  return (
    <div className="p-4 sm:p-6 space-y-4 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="fis-panel p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-3">
          <Network className="w-5 h-5 text-blue-400" />
          <span className="font-extrabold text-sm sm:text-base font-sans text-white">
            04. SYSTEM MAP & DEPENDENCY TOPOLOGY
          </span>
          <span className="text-slate-600">|</span>
          <span className={isAttack ? 'text-red-400 font-bold' : isUnverifiedFailure ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold'}>
            {isUnverifiedFailure
              ? 'STATE: RESIDUAL CONTAGION (MODEL-C ACTIVE • M(t)=42%)'
              : isAttack
              ? `STATE: ACTIVE CASCADE (${controlState.scenario_name} • M(t)=${controlState.control_margin_percent}%)`
              : isRestored
              ? 'STATE: TOPOLOGY RESTORED POST-BACKSTOP (M(t)=84%)'
              : 'STATE: NOMINAL EQUILIBRIUM (M(t)=91%)'}
          </span>
        </div>

        <div className="flex items-center gap-3 text-slate-400">
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-700 rounded p-0.5">
            <button
              type="button"
              onClick={() => setViewMode('RADIAL_GRAPH')}
              className={`px-2.5 py-1 rounded text-xs transition-colors ${
                viewMode === 'RADIAL_GRAPH'
                  ? 'bg-blue-600 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Radial Graph
            </button>
            <button
              type="button"
              onClick={() => setViewMode('3D_GLOBE')}
              className={`px-2.5 py-1 rounded text-xs transition-colors ${
                viewMode === '3D_GLOBE'
                  ? 'bg-blue-600 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              3D Globe
            </button>
          </div>
        </div>
      </div>

      {/* Main Graph & Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left 2 Cols: Circular Topological Network Graph + Node/Edge Selector Bar */}
        <div className="lg:col-span-2 fis-panel p-4 flex flex-col justify-between space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Network className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-semibold text-white">Interactive Multi-Layer Dependency Topology</h3>
            </div>
            <span className="text-[11px] font-mono text-cyan-400">
              Inspecting: <strong>{selectedRelationship ? `${selectedRelationship.source} → ${selectedRelationship.target}` : selectedNode.name}</strong>
            </span>
          </div>

          {/* Direct Node & Relationship Selection Bar (Guarantees deterministic clickability in 2D/3D) */}
          <div className="space-y-1.5 font-mono text-[10px]">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-slate-500 uppercase font-bold mr-1">Select Node:</span>
              {graphNodes.map(n => (
                <button
                  key={n.id}
                  data-testid={`map-node-${n.id}`}
                  type="button"
                  onClick={() => {
                    setSelectedEdgeId(null);
                    setActiveNodeId(n.id);
                  }}
                  className={`px-2 py-0.5 rounded border transition-all font-bold ${
                    activeNodeId === n.id && !selectedEdgeId
                      ? 'bg-blue-600 text-white border-blue-400 shadow-sm'
                      : 'bg-[#081020] text-slate-300 border-slate-800 hover:border-slate-600'
                  }`}
                >
                  {n.name}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-slate-500 uppercase font-bold mr-1">Inspect Edge:</span>
              {inspectableRelationships.map(rel => (
                <button
                  key={rel.id}
                  type="button"
                  data-testid={`map-edge-btn-EDGE-${rel.source}-${rel.target}`}
                  onClick={() => setSelectedEdgeId(rel.id)}
                  className={`px-2 py-0.5 rounded border transition-all font-bold ${
                    selectedEdgeId === rel.id
                      ? 'bg-purple-600 text-white border-purple-400 shadow-sm'
                      : 'bg-[#081020] text-cyan-300 border-slate-800 hover:border-purple-500'
                  }`}
                >
                  {rel.source} → {rel.target}
                </button>
              ))}
            </div>
          </div>

          {viewMode === 'RADIAL_GRAPH' ? (
            /* 2D Radial Topological Graph */
            <div className="relative w-full h-[380px] flex items-center justify-center bg-[#070b14]/80 rounded-lg border border-slate-800/80 overflow-hidden">
              <svg className="w-full h-full max-w-[460px] max-h-[370px]" viewBox="0 0 400 400">
                <defs>
                  <radialGradient id="dataXGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor={isAttack ? '#ef4444' : '#10b981'} stopOpacity="0.55" />
                    <stop offset="100%" stopColor={isAttack ? '#ef4444' : '#10b981'} stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Background Radar Rings */}
                <circle cx="200" cy="200" r="70" stroke="#1e293b" strokeWidth="1" strokeDasharray="3,3" fill="none" />
                <circle cx="200" cy="200" r="140" stroke="#1e293b" strokeWidth="1" strokeDasharray="3,3" fill="none" />

                {/* Radiating Edges connecting DATA-X to surrounding nodes */}
                {graphNodes.filter(n => !n.isCenter).map((node) => {
                  const rad = (node.angle * Math.PI) / 180;
                  const x = 200 + node.r * Math.cos(rad);
                  const y = 200 + node.r * Math.sin(rad);
                  const isHighlighted = selectedNode.id === node.id || (selectedRelationship && (selectedRelationship.source === node.id || selectedRelationship.target === node.id));

                  return (
                    <line
                      key={`edge-${node.id}`}
                      x1="200"
                      y1="200"
                      x2={x}
                      y2={y}
                      stroke={isHighlighted ? '#38bdf8' : isAttack ? '#7f1d1d' : '#334155'}
                      strokeWidth={isHighlighted ? '2.5' : '1.3'}
                      strokeDasharray={node.type === 'AI_MODEL' ? '4,4' : undefined}
                      className="cursor-pointer"
                      onClick={() => {
                        setSelectedEdgeId(null);
                        setActiveNodeId(node.id);
                      }}
                    />
                  );
                })}

                {/* Outer Orbit Nodes */}
                {graphNodes.filter(n => !n.isCenter).map((node) => {
                  const rad = (node.angle * Math.PI) / 180;
                  const x = 200 + node.r * Math.cos(rad);
                  const y = 200 + node.r * Math.sin(rad);
                  const isSelected = activeNodeId === node.id && !selectedEdgeId;

                  return (
                    <g
                      key={`node-${node.id}`}
                      data-testid={`map-node-${node.id}`}
                      className="cursor-pointer"
                      onClick={() => {
                        setSelectedEdgeId(null);
                        setActiveNodeId(node.id);
                      }}
                    >
                      {isSelected && (
                        <circle cx={x} cy={y} r="22" fill={node.color} opacity="0.28" />
                      )}
                      <circle
                        cx={x}
                        cy={y}
                        r="14"
                        fill="#0c1424"
                        stroke={isSelected ? '#ffffff' : node.color}
                        strokeWidth={isSelected ? '2.5' : '1.5'}
                      />
                      <circle cx={x} cy={y} r="4" fill={node.color} />
                      <text
                        x={x}
                        y={y + 25}
                        fill="#e2e8f0"
                        fontSize="9.5"
                        fontFamily="monospace"
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        {node.name}
                      </text>
                    </g>
                  );
                })}

                {/* Central Node: DATA-X */}
                <g
                  className="cursor-pointer"
                  onClick={() => {
                    setSelectedEdgeId(null);
                    setActiveNodeId('DATA-X');
                  }}
                >
                  <circle cx="200" cy="200" r="40" fill="url(#dataXGlow)" className={isAttack ? 'animate-pulse' : ''} />
                  <polygon
                    points="200,172 225,182 225,218 200,228 175,218 175,182"
                    fill={isAttack ? '#450a0a' : '#064e3b'}
                    stroke={activeNodeId === 'DATA-X' && !selectedEdgeId ? '#ffffff' : isAttack ? '#ef4444' : '#10b981'}
                    strokeWidth="2.5"
                  />
                  <text
                    x="200"
                    y="204"
                    fill="#ffffff"
                    fontSize="11"
                    fontFamily="monospace"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    DATA-X
                  </text>
                </g>
              </svg>
            </div>
          ) : (
            /* 3D WebGL Globe View */
            <div className="relative w-full h-[380px] rounded-lg overflow-hidden bg-[#070b14]/80 border border-slate-800/80">
              <FinancialGlobe
                institutions={institutions}
                dependencies={dependencies}
                dataProviders={dataProviders}
                infrastructureNodes={infrastructureNodes}
                onSelectEntity={(id) => {
                  setSelectedEdgeId(null);
                  setActiveNodeId(id);
                }}
                interactive={true}
                autoRotateSpeed={0.0012}
              />
            </div>
          )}

          {/* Legends: Node Type & Edge Type */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800 text-[10px] font-mono text-slate-400">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-slate-500 uppercase">Nodes:</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-500" /> G-SIB</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cyan-400" /> AI Model</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" /> Oracle</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500" /> Rail/CCP</span>
            </div>
            <div className="text-slate-400">
              20 Institutions • 102 Dependency Edges
            </div>
          </div>
        </div>

        {/* Right Col: Dynamic Node & Relationship Inspector Card */}
        <div className="fis-panel p-4 flex flex-col justify-between space-y-3 font-mono text-xs">
          {selectedRelationship ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs uppercase tracking-wider text-purple-400 font-bold">
                  Dependency Relationship Inspector
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedEdgeId(null)}
                  className="text-[10px] text-slate-400 hover:text-white px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700"
                >
                  Back to Node
                </button>
              </div>

              <div>
                <div className="text-[11px] text-cyan-400 font-bold mb-1">
                  Inspecting Edge: EDGE-{selectedRelationship.source}-{selectedRelationship.target}
                </div>
                <div className="text-base font-extrabold text-white">
                  {selectedRelationship.source} → {selectedRelationship.target}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-700 text-[10px] font-bold">
                    EDGE: {selectedRelationship.edgeType}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-700 text-[10px] font-bold">
                    {selectedRelationship.status}
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800 text-[11px]">
                <div className="flex justify-between py-1 border-b border-slate-850">
                  <span className="text-slate-500">Origin Entity:</span>
                  <button type="button" onClick={() => { setSelectedEdgeId(null); setActiveNodeId(selectedRelationship.source); }} className="text-amber-300 font-bold hover:underline">
                    {selectedRelationship.source}
                  </button>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-850">
                  <span className="text-slate-500">Dependent Target:</span>
                  <button type="button" onClick={() => { setSelectedEdgeId(null); setActiveNodeId(selectedRelationship.target); }} className="text-cyan-300 font-bold hover:underline">
                    {selectedRelationship.target}
                  </button>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-850">
                  <span className="text-slate-500">Coupling / Exposure:</span>
                  <span className="text-white font-bold">{selectedRelationship.weight}</span>
                </div>
                <div className="py-1.5 border-b border-slate-850">
                  <span className="text-slate-500 block text-[10px] uppercase">Transmission Mechanism:</span>
                  <span className="text-slate-200 font-sans block mt-0.5">{selectedRelationship.mechanism}</span>
                </div>
                <div className="py-1.5">
                  <span className="text-slate-500 block text-[10px] uppercase">Systemic Control Consequence:</span>
                  <span className="text-amber-300 font-sans block mt-0.5">{selectedRelationship.consequence}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">
                  Selected Entity Dossier
                </span>
                <span className="text-blue-400 text-[11px] font-bold">Node Inspector</span>
              </div>

              {/* Node Title & Status */}
              <div>
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-lg font-extrabold text-white font-mono">
                    {selectedNode.name}
                  </h2>
                  <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold uppercase border ${
                    selectedNode.status.includes('STABLE') || selectedNode.status.includes('RESTORED') || selectedNode.status.includes('SAFE')
                      ? 'bg-emerald-950 text-emerald-400 border-emerald-700'
                      : 'bg-red-950 text-red-400 border-red-700'
                  }`}>
                    {selectedNode.status}
                  </span>
                </div>
                <div className="text-[11px] text-cyan-400 mt-0.5">
                  {selectedNode.label} ({selectedNode.type})
                </div>
              </div>

              {/* Causal Summary */}
              <div className="p-2.5 rounded bg-[#060a14] border border-slate-800 text-[11px] text-slate-200 font-sans leading-relaxed">
                {selectedNode.relationshipSummary}
              </div>

              {/* State-Derived Metrics List */}
              <div className="space-y-1.5 pt-1 text-[11px]">
                <div className="flex justify-between py-1 border-b border-slate-850">
                  <span className="text-slate-500">Criticality Posture</span>
                  <span className={isAttack || isUnverifiedFailure ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>
                    {selectedNode.criticality}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-850">
                  <span className="text-slate-500">Shared Exposure</span>
                  <span className="text-white font-bold">{selectedNode.sharedBy}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-850">
                  <span className="text-slate-500">Connected Edges</span>
                  <span className="text-white font-bold">{selectedNode.dependenciesCount}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-850">
                  <span className="text-slate-500">Affected Downstream</span>
                  <span className="text-amber-400 font-bold">{selectedNode.affectedNodes} nodes</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-850">
                  <span className="text-slate-500">Control Margin Impact</span>
                  <span className="text-cyan-300 font-bold">{selectedNode.controlContribution}</span>
                </div>
              </div>

              {/* Upstream & Downstream Interactive Pills */}
              <div className="space-y-1.5 pt-1">
                <div>
                  <span className="text-[9px] uppercase text-slate-500 block">Upstream Dependencies (Click to inspect):</span>
                  <div className="flex flex-wrap gap-1 mt-0.5">
                    {selectedNode.upstream.map(up => (
                      <button
                        key={up}
                        type="button"
                        onClick={() => {
                          if (graphNodes.some(g => g.id === up)) setActiveNodeId(up);
                        }}
                        className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 hover:border-blue-400 text-[10px]"
                      >
                        ↑ {up}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-[9px] uppercase text-slate-500 block">Downstream Dependents (Click to inspect):</span>
                  <div className="flex flex-wrap gap-1 mt-0.5">
                    {selectedNode.downstream.length > 0 ? selectedNode.downstream.map(dn => (
                      <button
                        key={dn}
                        type="button"
                        onClick={() => {
                          if (graphNodes.some(g => g.id === dn)) setActiveNodeId(dn);
                        }}
                        className="px-1.5 py-0.5 rounded bg-blue-950/50 border border-blue-800/60 text-blue-300 hover:border-blue-400 text-[10px]"
                      >
                        ↓ {dn}
                      </button>
                    )) : (
                      <span className="text-[10px] text-slate-500">Terminal settlement / market node</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2.5 border-t border-slate-800 space-y-1.5">
            <button
              type="button"
              onClick={() => selectEntity(selectedNode.id)}
              className="w-full py-2 rounded bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold transition-colors shadow-lg shadow-blue-600/30 flex items-center justify-center gap-1.5"
            >
              <span>Open Deep Causal Trace ({selectedNode.name})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => setCurrentRoute('propagation')}
                className="py-1.5 px-2 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-[10px] font-bold flex items-center justify-center gap-1"
              >
                <Share2 className="w-3 h-3 text-cyan-400" /> Propagation (06)
              </button>
              <button
                type="button"
                onClick={() => setCurrentRoute('control-foundry')}
                className="py-1.5 px-2 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-[10px] font-bold flex items-center justify-center gap-1"
              >
                <Sliders className="w-3 h-3 text-emerald-400" /> Foundry (08)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SystemMapView;

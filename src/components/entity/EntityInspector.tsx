/**
 * FINANCIAL IMMUNE SYSTEM - CONTEXTUAL ENTITY INSPECTOR
 * Section 3: Core Domain Model
 * Section 26: User Journey - Select an Entity & View Context
 * Phase 2 Invariant: Unified entity context projection for ALL graph node types
 */

import React from 'react';
import { useSystemStore } from '../../store/useSystemStore';
import { StatusBadge } from '../common/StatusBadge';
import { TechnicalId } from '../common/TechnicalId';
import { CapabilityTag } from '../common/CapabilityTag';
import { 
  Institution, 
  Dependency, 
  AIModel, 
  DataProvider, 
  InfrastructureNode, 
  Asset 
} from '@shared/types/domain';
import { 
  X, 
  Building2, 
  GitBranch, 
  Cpu, 
  Radio, 
  Server, 
  Database, 
  Activity, 
  ShieldAlert, 
  ArrowRight,
  TrendingDown,
  Layers,
  Compass,
  Zap,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export const EntityInspector: React.FC = () => {
  const isEntityDrawerOpen = useSystemStore(state => state.isEntityDrawerOpen);
  const selectedEntity = useSystemStore(state => state.selectedEntity);
  const closeEntityDrawer = useSystemStore(state => state.closeEntityDrawer);
  const dependencies = useSystemStore(state => state.dependencies);
  const aiModels = useSystemStore(state => state.aiModels);
  const authoritativeEvents = useSystemStore(state => state.authoritativeEvents);
  const causalTraceData = useSystemStore(state => state.causalTraceData);
  const selectEntity = useSystemStore(state => state.selectEntity);

  if (!isEntityDrawerOpen || !selectedEntity) return null;

  // Determine entity type
  const isInstitution = 'institution_id' in selectedEntity;
  const isDependency = 'dependency_id' in selectedEntity;
  const isAiModel = 'model_id' in selectedEntity;
  const isDataProvider = 'provider_id' in selectedEntity;
  const isInfrastructure = 'node_id' in selectedEntity;
  const isAsset = 'asset_id' in selectedEntity;

  const inst = isInstitution ? (selectedEntity as Institution) : null;
  const dep = isDependency ? (selectedEntity as Dependency) : null;
  const model = isAiModel ? (selectedEntity as AIModel) : null;
  const provider = isDataProvider ? (selectedEntity as DataProvider) : null;
  const infra = isInfrastructure ? (selectedEntity as InfrastructureNode) : null;
  const asset = isAsset ? (selectedEntity as Asset) : null;

  const entityId = inst?.institution_id 
    || dep?.dependency_id 
    || model?.model_id 
    || provider?.provider_id 
    || infra?.node_id 
    || asset?.asset_id 
    || '';

  const entityTitle = inst?.name 
    || dep?.dependency_id 
    || model?.name 
    || provider?.name 
    || infra?.name 
    || asset?.name 
    || 'Entity Context';

  const entityTypeLabel = isInstitution 
    ? 'INSTITUTION' 
    : isDependency 
    ? 'DEPENDENCY' 
    : isAiModel 
    ? 'AI MODEL' 
    : isDataProvider 
    ? 'DATA PROVIDER' 
    : isInfrastructure 
    ? 'INFRASTRUCTURE NODE' 
    : isAsset 
    ? 'ASSET CLASS' 
    : 'NODE';

  // Connected dependencies
  const connectedDeps = dependencies.filter(d => d.source_id === entityId || d.target_id === entityId);

  // Relevant recent events
  const recentEvents = authoritativeEvents.filter(e => e.source_entity_id === entityId || e.target_entity_id === entityId);

  return (
    <>
      <div 
        onClick={closeEntityDrawer}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs z-30 transition-opacity"
        title="Click to close inspector"
      />
      <div className="fixed inset-y-0 right-0 w-full sm:w-[500px] bg-[#090f1e]/95 backdrop-blur-xl border-l border-[#1e2d4a] z-40 shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="p-5 border-b border-[#1e2d4a] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-blue-950/60 border border-blue-700/60 rounded text-blue-400">
            {isInstitution && <Building2 className="w-5 h-5" />}
            {isDependency && <GitBranch className="w-5 h-5" />}
            {isAiModel && <Cpu className="w-5 h-5" />}
            {isDataProvider && <Radio className="w-5 h-5 text-red-400" />}
            {isInfrastructure && <Server className="w-5 h-5 text-cyan-400" />}
            {isAsset && <Database className="w-5 h-5 text-amber-400" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                {entityTypeLabel} CONTEXT
              </span>
              <CapabilityTag maturity="IMPLEMENTED" />
            </div>
            <h2 className="text-base font-bold text-white truncate max-w-[300px]">
              {entityTitle}
            </h2>
          </div>
        </div>

        <button
          type="button"
          onClick={closeEntityDrawer}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Body Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6 text-sm">
        {/* Identifiers and Status */}
        <div className="fis-panel-sub p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">STATUS:</span>
            <StatusBadge status={selectedEntity.status} size="sm" />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">ENTITY ID:</span>
            <TechnicalId id={entityId} />
          </div>

          {inst && (
            <>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">REGULATORY TIER:</span>
                <span className="text-xs font-mono text-blue-300 font-semibold">{inst.tier}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">LOCATION:</span>
                <span className="text-xs text-slate-200">
                  {inst.location.city}, {inst.location.country}
                </span>
              </div>
            </>
          )}

          {provider && (
            <>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">FEED TYPE:</span>
                <span className="text-xs font-mono text-amber-300 font-semibold">{provider.feed_type}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">CRITICALITY:</span>
                <span className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded ${
                  provider.criticality === 'HIGH' ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-slate-800 text-slate-300'
                }`}>
                  {provider.criticality}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">LATENCY:</span>
                <span className="text-xs font-mono text-slate-300">{provider.latency_ms} ms</span>
              </div>
            </>
          )}

          {infra && (
            <>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">CATEGORY:</span>
                <span className="text-xs font-mono text-cyan-300 font-semibold">{infra.category}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">THROUGHPUT:</span>
                <span className="text-xs font-mono text-slate-200">{infra.peak_throughput_tps.toLocaleString()} TPS</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">CURRENT LOAD:</span>
                <span className={`text-xs font-mono font-bold ${
                  infra.current_load_percent > 85 ? 'text-red-400' : 'text-emerald-400'
                }`}>
                  {infra.current_load_percent}%
                </span>
              </div>
            </>
          )}

          {asset && (
            <>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">ASSET CLASS:</span>
                <span className="text-xs font-mono text-amber-300 font-semibold">{asset.asset_class}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">VALUATION:</span>
                <span className="text-xs font-mono text-white font-bold">${asset.valuation_usd_bn.toLocaleString()} Bn</span>
              </div>
            </>
          )}

          {dep && (
            <>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">CHANNEL TYPE:</span>
                <span className="text-xs font-mono text-blue-300 font-semibold">{dep.type}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">TRANSMISSION:</span>
                <span className="text-xs font-mono text-slate-200">{dep.source_id} → {dep.target_id}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">LATENCY:</span>
                <span className={`text-xs font-mono font-bold ${(dep.latency_ms || 20) > 200 ? 'text-red-400' : 'text-emerald-400'}`}>
                  {dep.latency_ms || 20} ms
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">EXPOSURE WEIGHT:</span>
                <span className="text-xs font-mono text-slate-200">{(((dep.exposure_weight || 0.5)) * 100).toFixed(0)}%</span>
              </div>
              {dep.is_chokepoint && (
                <div className="p-2 bg-red-950/40 border border-red-500/40 rounded text-xs font-mono text-red-300 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                  <span>CRITICAL SYSTEMIC CHOKEPOINT</span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Phase 2: Authoritative Causal Lineage Explainer */}
        {causalTraceData && (
          <div className="fis-panel-sub p-4 space-y-3 border-l-2 border-amber-500/80 bg-slate-900/60">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" />
                Causal Provenance Lineage
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                HOPS: {causalTraceData.hops_count}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-mono">
              {causalTraceData.causal_narrative}
            </p>

            {causalTraceData.hops && causalTraceData.hops.length > 0 && (
              <div className="space-y-1.5 pt-2 border-t border-slate-800">
                <div className="text-[10px] font-mono text-slate-500 uppercase">Transmission Sequence:</div>
                {causalTraceData.hops.map((h: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-2 text-xs font-mono bg-slate-950/80 p-2 rounded border border-slate-800">
                    <span className="text-red-400 font-bold">{h.from_id}</span>
                    <ArrowRight className="w-3 h-3 text-slate-500" />
                    <span className="text-blue-400 font-semibold">{h.via_dependency_id}</span>
                    <ArrowRight className="w-3 h-3 text-slate-500" />
                    <span className="text-amber-300 font-bold">{h.to_id}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Institution Specific Metrics */}
        {inst && (
          <div className="space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
              Prudential Metrics & Systemic Weight
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="fis-panel-sub p-3">
                <div className="text-[10px] font-mono text-slate-400">CAPITAL ADEQUACY (CAR)</div>
                <div className="text-xl font-mono font-bold text-white mt-1">
                  {inst.capital_adequacy_ratio}%
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Basel III Minimum 10.5%</div>
              </div>

              <div className="fis-panel-sub p-3">
                <div className="text-[10px] font-mono text-slate-400">LIQUIDITY COVERAGE (LCR)</div>
                <div className={`text-xl font-mono font-bold mt-1 ${
                  inst.liquidity_coverage_ratio < 100 ? 'text-red-400' : 'text-emerald-400'
                }`}>
                  {inst.liquidity_coverage_ratio}%
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Target buffer &gt; 100%</div>
              </div>
            </div>

            <div className="fis-panel-sub p-3">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-400 font-mono text-[11px]">SYSTEMIC FOOTPRINT:</span>
                <span className="font-mono text-amber-400 font-semibold">
                  {(inst.systemic_footprint_score * 100).toFixed(0)} / 100
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-amber-400 h-full rounded-full"
                  style={{ width: `${inst.systemic_footprint_score * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Data Provider: Institutions Served */}
        {provider && provider.institutions_served && provider.institutions_served.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold flex items-center justify-between">
              <span>Downstream Institutions Served</span>
              <span className="text-slate-500 font-normal">({provider.institutions_served.length})</span>
            </h3>

            <div className="grid grid-cols-2 gap-2">
              {provider.institutions_served.map(id => (
                <div
                  key={id}
                  onClick={() => selectEntity(id)}
                  className="fis-panel-sub p-2.5 flex items-center justify-between cursor-pointer hover:border-blue-500/50 transition-colors"
                >
                  <span className="font-mono text-xs text-white font-bold">{id}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Connected Dependencies */}
        {connectedDeps.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold flex items-center justify-between">
              <span>Connected Systemic Channels</span>
              <span className="text-slate-500 font-normal">({connectedDeps.length})</span>
            </h3>

            <div className="space-y-2">
              {connectedDeps.map((d) => (
                <div
                  key={d.dependency_id}
                  onClick={() => selectEntity(d.dependency_id)}
                  className="fis-panel-sub p-3 flex items-center justify-between cursor-pointer hover:border-blue-500/50 transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-blue-300 font-medium">{d.dependency_id}</span>
                      {d.is_chokepoint && (
                        <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-red-950 text-red-400 border border-red-800">
                          CHOKEPOINT
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {d.source_id} → {d.target_id} • Latency {d.latency_ms}ms
                    </div>
                  </div>
                  <StatusBadge status={d.status} size="sm" showPulse={false} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Authoritative Events */}
        {recentEvents.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
              Recent Systemic Event Deltas
            </h3>

            <div className="space-y-2">
              {recentEvents.map((e) => (
                <div key={e.event_id} className="fis-panel-sub p-3 space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-amber-400 font-semibold">{e.event_type}</span>
                    <span className="text-slate-500">{e.event_id}</span>
                  </div>
                  <p className="text-xs text-slate-300">{e.causal_narrative}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Drawer Action */}
      <div className="p-4 border-t border-[#1e2d4a] bg-slate-950/80 flex items-center justify-between">
        <button
          type="button"
          onClick={closeEntityDrawer}
          className="px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-200 transition-colors"
        >
          Close Context
        </button>
        <span className="text-[10px] font-mono text-slate-500">
          FIS REAL-TIME GRAPH NODE
        </span>
      </div>
    </div>
    </>
  );
};

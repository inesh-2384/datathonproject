/**
 * FINANCIAL IMMUNE SYSTEM - PRIVACY BOUNDARY & DATA CLASSIFICATION VIEW
 * Phase 5 Enterprise Assurance & Privacy Architecture
 * 
 * Invariants:
 * 1. Minimal information necessary for systemic control decisions.
 * 2. Raw sensitive order book and derivative data is masked/aggregated at the boundary.
 * 3. Unauthorized roles (OBSERVER) cannot view restricted or sensitive fields.
 * 4. Transparent data classification and transformation auditing.
 */

import React, { useState, useEffect } from 'react';
import { useSystemStore } from '../store/useSystemStore';
import { CapabilityTag } from '../components/common/CapabilityTag';
import { Lock, Eye, EyeOff, ShieldCheck, ArrowRight, Database, FileSpreadsheet, Layers } from 'lucide-react';
import { UserRole } from '@shared/types/roles';

export const PrivacyView: React.FC = () => {
  const [testRole, setTestRole] = useState<UserRole>('OBSERVER');
  const [filteredData, setFilteredData] = useState<any>(null);
  const privacyTransformations = useSystemStore(state => state.privacyTransformations);
  const dataDictionary = useSystemStore(state => state.dataDictionary);
  const fetchAssuranceState = useSystemStore(state => state.fetchAssuranceState);

  useEffect(() => {
    fetchAssuranceState();
  }, [fetchAssuranceState]);

  useEffect(() => {
    fetch(`/api/assurance/privacy-filter/${testRole}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setFilteredData(data.data);
        }
      })
      .catch(console.error);
  }, [testRole]);

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto font-mono text-xs">
      {/* Top Header */}
      <div className="fis-panel p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-purple-950/80 border border-purple-500/50 flex items-center justify-center text-purple-400">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <div className="font-extrabold text-sm sm:text-base font-sans text-white flex items-center gap-2">
              PRIVACY BOUNDARY & DATA CLASSIFICATION
              <CapabilityTag maturity="IMPLEMENTED" />
            </div>
            <div className="text-[11px] text-purple-400">
              Zero-Knowledge Transformation & Role-Based Confidentiality Filters
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 text-slate-400">
          <span>Boundary Status: <strong className="text-emerald-400">ENFORCED</strong></span>
          <span className="text-slate-600">|</span>
          <span className="text-blue-400 font-bold">IBM Z Enclave</span>
        </div>
      </div>

      {/* Principle Banner */}
      <div className="p-3.5 rounded-lg bg-purple-950/20 border border-purple-500/30 flex items-start gap-3 text-slate-300">
        <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="text-white font-bold">Core Privacy Invariant: Minimum Necessary Systemic Information</div>
          <div className="text-[11px] text-slate-400 font-sans leading-relaxed">
            The Financial Immune System does not ingest raw private order books or confidential bilateral credit agreements. 
            All incoming financial telemetry passes through an enclave transformation pipeline that minimizes, obfuscates, 
            and aggregates raw balances into systemic concentration indices (HHI) before reaching downstream intelligence models.
          </div>
        </div>
      </div>

      {/* Interactive Role-Based Privacy Filter Simulator */}
      <div className="fis-panel p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-semibold text-white">
              Role-Based Confidentiality Filter Inspection
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-[11px]">Select Inspected Role:</span>
            {(['OBSERVER', 'RISK_ANALYST', 'SYSTEM_OPERATOR', 'COMPLIANCE_OFFICER'] as UserRole[]).map(role => (
              <button
                key={role}
                type="button"
                onClick={() => setTestRole(role)}
                className={`px-2.5 py-1 rounded text-[11px] font-bold border transition-colors ${
                  testRole === role
                    ? 'bg-purple-600 text-white border-purple-400 shadow'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        {/* Live Filter Demonstration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-slate-800/80">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-blue-400" />
                Raw Telemetry Ingress (Enclave Ground Truth)
              </span>
              <span className="text-[10px] text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/60">
                RESTRICTED
              </span>
            </div>
            <div className="space-y-2 text-[11px]">
              <div className="flex justify-between p-1.5 rounded bg-slate-900/40">
                <span className="text-slate-400">Entity:</span>
                <span className="font-bold text-white">BANK-A (Global Atlantic Clearing Bank)</span>
              </div>
              <div className="flex justify-between p-1.5 rounded bg-slate-900/40">
                <span className="text-slate-400">Systemic Footprint Score:</span>
                <span className="text-white">0.88 (G-SIB Bucket 4)</span>
              </div>
              <div className="flex justify-between p-1.5 rounded bg-slate-900/40">
                <span className="text-slate-400">Liquidity Coverage Ratio (LCR):</span>
                <span className="text-amber-400 font-bold">88.5%</span>
              </div>
              <div className="flex justify-between p-1.5 rounded bg-purple-950/30 border border-purple-900/50">
                <span className="text-purple-300 font-semibold">Proprietary Order Book Depth:</span>
                <span className="text-purple-200 font-bold">$4,850.0M</span>
              </div>
              <div className="flex justify-between p-1.5 rounded bg-purple-950/30 border border-purple-900/50">
                <span className="text-purple-300 font-semibold">Unhedged Derivative Notional:</span>
                <span className="text-purple-200 font-bold">$142.8B</span>
              </div>
              <div className="flex justify-between p-1.5 rounded bg-purple-950/30 border border-purple-900/50">
                <span className="text-purple-300 font-semibold">Bilateral Intraday Borrowing Limit:</span>
                <span className="text-purple-200 font-bold">$2,500.0M</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-slate-800/80">
              <span className="font-bold text-white flex items-center gap-1.5">
                {testRole === 'OBSERVER' ? <EyeOff className="w-3.5 h-3.5 text-purple-400" /> : <Eye className="w-3.5 h-3.5 text-emerald-400" />}
                Projected View for Role: <span className="text-purple-400">{testRole}</span>
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded border ${
                testRole === 'OBSERVER' 
                  ? 'bg-purple-950/60 text-purple-300 border-purple-800/60' 
                  : 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60'
              }`}>
                {testRole === 'OBSERVER' ? 'MASKED & MINIMIZED' : 'AUTHORIZED ACCESS'}
              </span>
            </div>

            {filteredData ? (
              <div className="space-y-2 text-[11px]">
                <div className="flex justify-between p-1.5 rounded bg-slate-900/40">
                  <span className="text-slate-400">Entity:</span>
                  <span className="font-bold text-white">{filteredData.institution_id}</span>
                </div>
                <div className="flex justify-between p-1.5 rounded bg-slate-900/40">
                  <span className="text-slate-400">Systemic Footprint Score:</span>
                  <span className="text-white">{filteredData.systemic_footprint_score}</span>
                </div>
                <div className="flex justify-between p-1.5 rounded bg-slate-900/40">
                  <span className="text-slate-400">Liquidity Coverage Ratio (LCR):</span>
                  <span className="text-amber-400 font-bold">{filteredData.liquidity_coverage_ratio}%</span>
                </div>
                <div className="flex justify-between p-1.5 rounded bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400">Proprietary Order Book Depth:</span>
                  <span className={testRole === 'OBSERVER' ? 'text-purple-400 font-mono italic' : 'text-emerald-400 font-bold'}>
                    {filteredData.proprietary_order_book_depth_usd_m}
                  </span>
                </div>
                <div className="flex justify-between p-1.5 rounded bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400">Unhedged Derivative Notional:</span>
                  <span className={testRole === 'OBSERVER' ? 'text-purple-400 font-mono italic' : 'text-emerald-400 font-bold'}>
                    {filteredData.unhedged_derivative_notional_usd_b}
                  </span>
                </div>
                <div className="flex justify-between p-1.5 rounded bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400">Bilateral Intraday Borrowing Limit:</span>
                  <span className={testRole === 'OBSERVER' ? 'text-purple-400 font-mono italic' : 'text-emerald-400 font-bold'}>
                    {filteredData.bilateral_intraday_borrowing_limit_usd_m}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-slate-500 py-6 text-center">Loading filtered projection...</div>
            )}
          </div>
        </div>
      </div>

      {/* Active Privacy Transformation Pipeline */}
      <div className="fis-panel p-5 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-purple-400" />
            Active Privacy Transformation Records
          </h3>
          <span className="text-[11px] text-slate-400 font-mono">
            Enclave Telemetry Minimization Pipeline
          </span>
        </div>

        <div className="space-y-3">
          {privacyTransformations.map(tf => (
            <div key={tf.transformId} className="p-3.5 rounded-lg bg-slate-950 border border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 text-[10px] font-bold font-mono">
                    {tf.transformId}
                  </span>
                  <span className="text-white font-bold">{tf.sourceEntityId}</span>
                  <span className="text-slate-500 text-[11px]">({tf.transformationType})</span>
                </div>
                <div className="text-slate-400 text-[11px]">
                  Protected <strong>{tf.protectedFieldsCount} of {tf.rawFieldsCount}</strong> fields via {tf.aggregationLevel}
                </div>
              </div>

              <div className="text-right font-mono">
                <div className="text-emerald-400 font-bold text-xs">{tf.outputSignal}</div>
                <div className="text-[10px] text-slate-500">Authorized: {tf.authorizedUse}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Data Classification Matrix */}
      <div className="fis-panel p-5 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-purple-400" />
            Authoritative Financial Telemetry Classification Matrix
          </h3>
          <span className="text-[10px] text-slate-500 uppercase">ISO / DORA Taxonomy</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 text-[10px] uppercase">
                <th className="py-2.5 px-3">Field Name</th>
                <th className="py-2.5 px-3">Classification</th>
                <th className="py-2.5 px-3">Enclave Transformation</th>
                <th className="py-2.5 px-3">Aggregation Level</th>
                <th className="py-2.5 px-3">Authorized Roles</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {dataDictionary.map(item => (
                <tr key={item.fieldName} className="hover:bg-slate-900/40">
                  <td className="py-2.5 px-3 font-bold text-white">{item.fieldName}</td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      item.classification === 'RESTRICTED' || item.classification === 'SENSITIVE'
                        ? 'bg-red-950/60 text-red-300 border-red-800/60'
                        : item.classification === 'INTERNAL'
                          ? 'bg-blue-950/60 text-blue-300 border-blue-800/60'
                          : 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60'
                    }`}>
                      {item.classification}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-300 text-[11px]">{item.transformation}</td>
                  <td className="py-2.5 px-3 text-slate-400">{item.aggregationLevel}</td>
                  <td className="py-2.5 px-3 text-slate-400 text-[10px]">{item.authorizedRoles.join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

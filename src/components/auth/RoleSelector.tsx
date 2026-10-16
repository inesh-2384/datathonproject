/**
 * FINANCIAL IMMUNE SYSTEM - FUNCTIONAL ROLE SELECTOR
 * Section 6: Authentication + Roles
 * 
 * Functional role switcher and onboarding modal.
 * Directly changes application capabilities & operational context.
 */

import React from 'react';
import { UserRole, ROLE_DEFINITIONS } from '@shared/types/roles';
import { useSystemStore } from '../../store/useSystemStore';
import { Shield, BarChart3, FileCheck, Eye, CheckCircle2, ArrowRight } from 'lucide-react';

interface RoleSelectorProps {
  onRoleSelected?: (role: UserRole) => void;
  isModal?: boolean;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({ onRoleSelected, isModal = false }) => {
  const currentRole = useSystemStore(state => state.currentRole);
  const setRole = useSystemStore(state => state.setRole);

  const handleSelectRole = (role: UserRole) => {
    setRole(role);
    if (onRoleSelected) onRoleSelected(role);
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'INCIDENT_COMMANDER':
        return <Shield className="w-6 h-6 text-amber-400" />;
      case 'SYSTEM_OPERATOR':
        return <Shield className="w-6 h-6 text-blue-400" />;
      case 'RISK_ANALYST':
        return <BarChart3 className="w-6 h-6 text-cyan-400" />;
      case 'COMPLIANCE_OFFICER':
        return <FileCheck className="w-6 h-6 text-purple-400" />;
      case 'OBSERVER':
        return <Eye className="w-6 h-6 text-slate-400" />;
      default:
        return <Shield className="w-6 h-6 text-blue-400" />;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <span className="text-xs font-mono uppercase tracking-widest text-blue-400 bg-blue-950/60 px-3 py-1 rounded border border-blue-800/40">
          SECURE OPERATIONAL ENCLAVE
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Select Operational Identity
        </h2>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Every role exercises distinct operational authority, simulation privileges, and verification keys within the systemic control layer.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ROLE_DEFINITIONS.map((def) => {
          const isSelected = currentRole === def.role;

          return (
            <div
              key={def.role}
              onClick={() => handleSelectRole(def.role)}
              className={`fis-panel p-5 cursor-pointer transition-all border flex flex-col justify-between ${
                isSelected
                  ? 'border-blue-500 bg-blue-950/20 shadow-lg shadow-blue-500/10'
                  : 'hover:border-slate-700 hover:bg-slate-900/60'
              }`}
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-slate-900 border border-slate-700/80 rounded-lg">
                      {getRoleIcon(def.role)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-white text-base">{def.title}</h3>
                        {isSelected && (
                          <span className="flex items-center gap-1 text-[11px] font-mono text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-700/50">
                            <CheckCircle2 className="w-3 h-3 text-blue-400" /> ACTIVE
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-mono text-slate-400">{def.tagline}</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {def.description}
                </p>

                <div className="space-y-1.5 border-t border-slate-800/80 pt-3">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">
                    Core Privileges:
                  </span>
                  {def.key_responsibilities.map((resp, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-[11px] text-slate-400">
                      <div className="w-1 h-1 rounded-full bg-blue-400" />
                      <span>{resp}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800/60 flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                  {def.access_level}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectRole(def.role);
                  }}
                  className={`text-xs font-mono px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors ${
                    isSelected
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <span>{isSelected ? 'Current Identity' : 'Assume Identity'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

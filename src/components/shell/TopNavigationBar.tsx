/**
 * FINANCIAL IMMUNE SYSTEM - HORIZONTAL TOP NAVIGATION BAR
 * Directly Aligned with Reference Image Horizontal Tab Architecture
 */

import React from 'react';
import { APPLICATION_ROUTES } from '@shared/constants/navigation';
import { useSystemStore } from '../../store/useSystemStore';
import { 
  ShieldAlert, 
  Network, 
  Cpu, 
  Share2, 
  Gauge, 
  Sliders, 
  Zap, 
  CheckCircle2, 
  History, 
  FileText, 
  Server, 
  BarChart3,
  Radio,
  RotateCcw,
  Lock
} from 'lucide-react';

const ICON_MAP: Record<string, React.ReactNode> = {
  ShieldAlert: <ShieldAlert className="w-3.5 h-3.5" />,
  Radio: <Radio className="w-3.5 h-3.5" />,
  Network: <Network className="w-3.5 h-3.5" />,
  Cpu: <Cpu className="w-3.5 h-3.5" />,
  Share2: <Share2 className="w-3.5 h-3.5" />,
  Gauge: <Gauge className="w-3.5 h-3.5" />,
  Sliders: <Sliders className="w-3.5 h-3.5" />,
  Zap: <Zap className="w-3.5 h-3.5" />,
  CheckCircle2: <CheckCircle2 className="w-3.5 h-3.5" />,
  RotateCcw: <RotateCcw className="w-3.5 h-3.5" />,
  History: <History className="w-3.5 h-3.5" />,
  FileText: <FileText className="w-3.5 h-3.5" />,
  Lock: <Lock className="w-3.5 h-3.5" />,
  Server: <Server className="w-3.5 h-3.5" />,
  BarChart3: <BarChart3 className="w-3.5 h-3.5" />,
};

export const TopNavigationBar: React.FC = () => {
  const currentRouteId = useSystemStore(state => state.currentRouteId);
  const setCurrentRoute = useSystemStore(state => state.setCurrentRoute);

  return (
    <nav className="h-10 border-b border-[#162238] bg-[#090f1d] px-4 sm:px-6 flex items-center overflow-x-auto select-none z-20 shrink-0 gap-1.5 scrollbar-none">
      {APPLICATION_ROUTES.map((route) => {
        const isActive = currentRouteId === route.id;

        return (
          <button
            key={route.id}
            type="button"
            onClick={() => setCurrentRoute(route.id)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-sans transition-all whitespace-nowrap shrink-0 ${
              isActive
                ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 font-medium'
            }`}
          >
            <span className={isActive ? 'text-white' : 'text-slate-400'}>
              {ICON_MAP[route.iconName] || <ShieldAlert className="w-3.5 h-3.5" />}
            </span>
            <span>{route.name}</span>
          </button>
        );
      })}
    </nav>
  );
};

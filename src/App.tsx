/**
 * FINANCIAL IMMUNE SYSTEM - CORE APPLICATION SHELL
 * High-Assurance Mission Control Architecture with Guided Cybernetic Stepper
 */

import React, { useEffect } from 'react';
import { useSystemStore } from './store/useSystemStore';
import { streamClient } from './services/stream';
import { AppHeader } from './components/shell/AppHeader';
import { OperationalContextBar } from './components/shell/OperationalContextBar';
import { NavigationSidebar } from './components/shell/NavigationSidebar';
import { SystemStatusBar } from './components/shell/SystemStatusBar';
import { EntityInspector } from './components/entity/EntityInspector';
import { LoginPortal } from './components/auth/LoginPortal';
import { RoleSelector } from './components/auth/RoleSelector';

// Dedicated Operational Workspaces for All 16 Modules
import { ControlCenterView } from './views/ControlCenterView';
import { EventDetectionView } from './views/EventDetectionView';
import { SystemMapView } from './views/SystemMapView';
import { CollectiveIntelligenceView } from './views/CollectiveIntelligenceView';
import { PropagationView } from './views/PropagationView';
import { ControlMarginView } from './views/ControlMarginView';
import { ControlFoundryView } from './views/ControlFoundryView';
import { ExecutionView } from './views/ExecutionView';
import { VerificationView } from './views/VerificationView';
import { ReassessmentView } from './views/ReassessmentView';
import { IBMRuntimeView } from './views/IBMRuntimeView';
import { ReplayView } from './views/ReplayView';
import { EvidenceView } from './views/EvidenceView';
import { PrivacyView } from './views/PrivacyView';
import { BenchmarkView } from './views/BenchmarkView';

export const App: React.FC = () => {
  const isAuthenticated = useSystemStore(state => state.isAuthenticated);
  const isLoginModalOpen = useSystemStore(state => state.isLoginModalOpen);
  const isRoleModalOpen = useSystemStore(state => state.isRoleModalOpen);
  const setRoleModalOpen = useSystemStore(state => state.setRoleModalOpen);
  const currentRouteId = useSystemStore(state => state.currentRouteId);

  // Initialize Real-Time SSE Stream on Mount
  useEffect(() => {
    (window as any).__fis_store = useSystemStore;
    streamClient.connect();
    return () => {
      streamClient.disconnect();
    };
  }, []);

  // Route Dispatcher to Dedicated Full-Depth Workspaces
  const renderCurrentView = () => {
    switch (currentRouteId) {
      case 'control-center':
        return <ControlCenterView />;
      case 'event-detection':
        return <EventDetectionView />;
      case 'system-map':
        return <SystemMapView />;
      case 'collective-intelligence':
        return <CollectiveIntelligenceView />;
      case 'propagation':
        return <PropagationView />;
      case 'control-margin':
        return <ControlMarginView />;
      case 'control-foundry':
        return <ControlFoundryView />;
      case 'execution':
        return <ExecutionView />;
      case 'verification':
        return <VerificationView />;
      case 'reassessment':
        return <ReassessmentView />;
      case 'replay':
        return <ReplayView />;
      case 'evidence':
        return <EvidenceView />;
      case 'privacy':
        return <PrivacyView />;
      case 'ibm-runtime':
        return <IBMRuntimeView />;
      case 'benchmark':
        return <BenchmarkView />;
      default:
        return <ControlCenterView />;
    }
  };

  // If unauthenticated or login requested, show Signature Globe Login Portal (Panel 1)
  if (!isAuthenticated || isLoginModalOpen) {
    return <LoginPortal onComplete={() => useSystemStore.getState().setLoginModalOpen(false)} />;
  }

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#060a12] text-[#f1f5f9] font-sans antialiased">
      {/* 1. Global Command Header with Multi-Scenario Injection Controls */}
      <AppHeader />

      {/* 2. Interactive Operator Guided Lifecycle Stepper & Context Banner */}
      <OperationalContextBar />

      {/* 3. Primary Workspace Area with Persistent Left Sidebar */}
      <div className="flex flex-1 overflow-hidden relative min-h-0">
        <NavigationSidebar />
        <main className="flex-1 overflow-y-auto bg-[#050811] relative min-h-0">
          {renderCurrentView()}
        </main>

        {/* Contextual Entity Inspector Slide-Over */}
        <EntityInspector />
      </div>

      {/* 4. Telemetry Status Footer */}
      <SystemStatusBar />

      {/* Role Selection Modal */}
      {isRoleModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="fis-panel max-w-4xl w-full p-6 border border-blue-500 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setRoleModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-xs font-mono px-2.5 py-1 rounded bg-slate-900 border border-slate-700"
            >
              ✕ ESC
            </button>
            <RoleSelector onRoleSelected={() => setRoleModalOpen(false)} isModal={true} />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;

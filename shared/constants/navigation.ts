/**
 * FINANCIAL IMMUNE SYSTEM - APPLICATION ROUTING ARCHITECTURE
 * Structured for the Persistent Enterprise Command Shell
 * Encompasses All 16 Modules from the Reference Mission Control Architecture
 */

export interface NavRoute {
  id: string;
  path: string;
  name: string;
  moduleNumber: string;
  category: 'CONTROL' | 'DECISION' | 'ASSURANCE' | 'RUNTIME';
  description: string;
  phaseStatus: 'IMPLEMENTED' | 'ARCHITECTED' | 'FUTURE';
  iconName: string;
  badgeCount?: number;
}

export const APPLICATION_ROUTES: NavRoute[] = [
  // -------------------------------------------------------------
  // CONTROL MODULES
  // -------------------------------------------------------------
  {
    id: 'control-center',
    path: '/control-center',
    name: 'Control Center',
    moduleNumber: '02',
    category: 'CONTROL',
    description: 'High-density mission control overview with real-time posture, margin, and sentinel telemetry.',
    phaseStatus: 'IMPLEMENTED',
    iconName: 'ShieldAlert',
  },
  {
    id: 'event-detection',
    path: '/event-detection',
    name: 'Event Detection',
    moduleNumber: '03',
    category: 'CONTROL',
    description: 'Real-time sentinel event detection console, incident metadata, and live streaming log.',
    phaseStatus: 'IMPLEMENTED',
    iconName: 'Radio',
  },
  {
    id: 'system-map',
    path: '/system-map',
    name: 'System Map',
    moduleNumber: '04',
    category: 'CONTROL',
    description: 'Topological dependency graph of financial institutions, DATA-X chokepoints, and rails.',
    phaseStatus: 'IMPLEMENTED',
    iconName: 'Network',
  },
  {
    id: 'collective-intelligence',
    path: '/collective-intelligence',
    name: 'Collective Intelligence',
    moduleNumber: '05',
    category: 'CONTROL',
    description: 'AI model alignment, herd behavior, algorithmic correlation, and effective diversity.',
    phaseStatus: 'IMPLEMENTED',
    iconName: 'Cpu',
  },
  {
    id: 'propagation',
    path: '/propagation',
    name: 'Propagation Analysis',
    moduleNumber: '06',
    category: 'CONTROL',
    description: 'Multi-hop cascade modeling, transmission channels, and contagion velocity.',
    phaseStatus: 'IMPLEMENTED',
    iconName: 'Share2',
  },
  {
    id: 'control-margin',
    path: '/control-margin',
    name: 'Control Margin',
    moduleNumber: '07',
    category: 'CONTROL',
    description: 'Dynamic quantify of system control reserves, buffer depletion, and irreversible horizons.',
    phaseStatus: 'IMPLEMENTED',
    iconName: 'Gauge',
  },

  // -------------------------------------------------------------
  // DECISION MODULES
  // -------------------------------------------------------------
  {
    id: 'control-foundry',
    path: '/control-foundry',
    name: 'Control Foundry',
    moduleNumber: '08',
    category: 'DECISION',
    description: 'Intervention synthesis, counter-cyclical circuit-breakers, and action parameterization.',
    phaseStatus: 'IMPLEMENTED',
    iconName: 'Sliders',
  },
  {
    id: 'execution',
    path: '/execution',
    name: 'Governed Execution',
    moduleNumber: '09',
    category: 'DECISION',
    description: 'High-assurance deterministic intervention dispatch, multi-sig consensus, and receipts.',
    phaseStatus: 'IMPLEMENTED',
    iconName: 'Zap',
  },
  {
    id: 'verification',
    path: '/verification',
    name: 'Independent Verification',
    moduleNumber: '10',
    category: 'DECISION',
    description: 'Empirical outcome measurement, counterfactual proof, and delta control margin restoration.',
    phaseStatus: 'IMPLEMENTED',
    iconName: 'CheckCircle2',
  },
  {
    id: 'reassessment',
    path: '/reassessment',
    name: 'Reassessment & 2nd Action',
    moduleNumber: '11',
    category: 'DECISION',
    description: 'Closed-loop reassessment on unverified recovery, residual contagion analysis, and secondary action.',
    phaseStatus: 'IMPLEMENTED',
    iconName: 'RotateCcw',
  },

  // -------------------------------------------------------------
  // ASSURANCE MODULES
  // -------------------------------------------------------------
  {
    id: 'replay',
    path: '/replay',
    name: 'Incident Replay',
    moduleNumber: '13',
    category: 'ASSURANCE',
    description: 'Deterministic microsecond playback of systemic cascade and intervention timeline.',
    phaseStatus: 'IMPLEMENTED',
    iconName: 'History',
  },
  {
    id: 'evidence',
    path: '/evidence',
    name: 'Evidence & Integrity',
    moduleNumber: '14',
    category: 'ASSURANCE',
    description: 'Cryptographically sealed audit packages, regulatory lineage (BCBS 239 / DORA), and proof.',
    phaseStatus: 'IMPLEMENTED',
    iconName: 'FileText',
  },
  {
    id: 'privacy',
    path: '/privacy',
    name: 'Privacy Boundary',
    moduleNumber: '15',
    category: 'ASSURANCE',
    description: 'Data classification, zero-knowledge minimization, and role-based confidentiality filters.',
    phaseStatus: 'IMPLEMENTED',
    iconName: 'Lock',
  },

  // -------------------------------------------------------------
  // RUNTIME & EVALUATION MODULES
  // -------------------------------------------------------------
  {
    id: 'ibm-runtime',
    path: '/ibm-runtime',
    name: 'IBM Z Runtime',
    moduleNumber: '12',
    category: 'RUNTIME',
    description: 'Enterprise execution substrate architecture, IBM Z capability matrix, and runtime truth state.',
    phaseStatus: 'IMPLEMENTED',
    iconName: 'Server',
  },
  {
    id: 'benchmark',
    path: '/benchmark',
    name: 'Benchmark & Evaluation',
    moduleNumber: '16',
    category: 'RUNTIME',
    description: 'Empirical stress test benchmarks, throughput verification, and latency envelopes.',
    phaseStatus: 'IMPLEMENTED',
    iconName: 'BarChart3',
  }
];

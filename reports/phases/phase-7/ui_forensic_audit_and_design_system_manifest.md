# FINANCIAL IMMUNE SYSTEM (FIS)
## UI FORENSIC AUDIT & DESIGN SYSTEM MANIFEST
**Role:** Principal Product Designer, World-Class Enterprise UX Architect & Senior Design Systems Engineer  
**Standard:** Enterprise Sovereign Control Infrastructure / IBM Z Datathon 2026  
**Status:** FORENSIC AUDIT COMPLETE & SPECIFICATION SEALED  

---

## 1. EXECUTIVE SUMMARY & DESIGN INTENT
The Financial Immune System interface represents an enterprise-grade systemic control intelligence platform. The objective of this transformation is to convert the existing high-density prototype into an **intellectually authoritative, visually calm, spatially coherent, and unmistakably institutional command environment**.

### Core Tenet
> *"Make the existing system look and feel world-class without breaking the system that already exists."*

The frontend remains a **pure projection of the authoritative backend state machine**. All APIs, WebSocket/SSE streams, cryptographic digests, dual-governance authorization protocols, and multi-candidate counterfactual evaluations remain 100% operational.

---

## 2. WORKSPACE-BY-WORKSPACE FORENSIC AUDIT

| # | Workspace ID | Primary Operator Task | Functional Category | Current Layout & Scroll Behavior | Identified UX & Visual Issues | Redesign Transformation |
|---|---|---|---|---|---|---|
| **01** | `login-portal` | Authenticate identity & select operational role | **CRITICAL** | Fixed fullscreen 3D Canvas with overlay card | Form controls compete with 3D globe; text contrast on bright globe arcs can drop | Institutional authentication portal with ambient back-projection, role credential badges, and zero clutter |
| **02** | `control-center` | Assess immediate systemic posture, horizon & MEI recommendation | **CRITICAL** | 4-row dashboard layout, primary vertical scroll | Nested cards inside cards; text sizing down to 8px; gauge lacks tabular hierarchy | Unified executive surface; prominent `<ControlMarginHero />`; progressive disclosure for stream logs |
| **03** | `event-detection` | Ingest real-time sentinel telemetry & identify origin shock | **CRITICAL** | Filter toolbar + 2-column event table & detail card | Dense event rows with duplicate colored tags; no quick filter by entity | High-rhythm tabular log; interactive entity links; clear severity indicators; payload inspector drawer |
| **04** | `system-map` | Traverse 102 interbank exposure arcs & inspect chokepoint | **IMPORTANT** | 2D SVG radial map with 3D Globe toggle button | 2D SVG labels overlap when 8+ nodes are selected; legend card clips at bottom | Spatial canvas with zoom/pan controls; clear edge directionality; direct integration with Entity Inspector |
| **05** | `collective-intelligence` | Detect algorithmic herding & common-oracle convergence | **CRITICAL** | Covariance matrix cards + vendor breakdown list | Multiple competing percentage bars; confusing color-coding between vendor & model | Clear EDD hero card; distinct Oracle Coupling indicator; herding correlation drag decomposition |
| **06** | `propagation` | Track multi-hop cascade velocity across clearing rails | **IMPORTANT** | Interactive playback scrubber + cascade stage list | Playback buttons small and hard to click; time delta labels misaligned | Operational cascade timeline; prominent playback controls; hop-by-hop liquidity runoff visualization |
| **07** | `control-margin` | Audit mathematical reserve buffer & additive causal drivers | **CRITICAL** | Circular gauge + waterfall contribution cards | Repetitive gauge components; mathematical formulas displayed as unformatted text | Dedicated mathematical decomposition surface; KaTeX-style rendering; additive driver waterfall |
| **08** | `control-foundry` | Compare counterfactuals & select Minimum Effective Intervention | **CRITICAL** | 4-candidate card grid + constraint slider display | Card clutter; difficult to compare delta metrics side-by-side | High-density comparison table/matrix; prominent MEI recommendation pill; clear trade-off curves |
| **09** | `execution` | Sign dual-authorization token & dispatch to execution bus | **CRITICAL** | Multi-sig authorization card + live terminal logs | Terminal logs dominate screen; authorization buttons look like regular links | High-assurance cryptographic governance gate; clear signature status indicators; atomic dispatch button |
| **10** | `verification` | Detect latent drift & verify systemic controllability restoration | **CRITICAL** | Telemetry diff table + cryptographic audit button | Expected vs Observed contrast lacks visual punch; hero failure moment not celebrated | Hero Moment visual spotlight; side-by-side EXPECTED vs OBSERVED vs VERDICT; residual threat callout |
| **11** | `reassessment` | Escalate to secondary backstop upon verification failure | **CRITICAL** | 4-step stepper + candidate execution card | Stepper dots misaligned on smaller laptops; duplicate authorization trigger | Seamless closed-loop recovery banner; clear failure trace lineage; single-click backstop deployment |
| **12** | `ibm-runtime` | Verify hardware attestation & confidential enclave truth | **IMPORTANT** | Capability matrix grid + server telemetry card | Text walls of architectural claims; status badges inconsistent with Truth Taxonomy | Clean cryptographic attestation ledger; explicit Truth Taxonomy tags; zero fake hardware meters |
| **13** | `replay` | Deterministic microsecond playback & state reconstruction | **IMPORTANT** | Timeline scrubber + frame event inspector | Scrubber handle small; frame diffs hard to parse | Professional forensic timeline; step-frame controls; bit-for-bit state hash verification |
| **14** | `evidence` | Inspect cryptographic lineage & tamper-evident SHA-256 seal | **IMPORTANT** | Evidence card list + search query input | Giant raw JSON text blocks; difficult to verify SHA-256 hashes | Structured evidence ledger; click-to-verify modal; freshness/conflict audit badges |
| **15** | `privacy` | Test role-based boundary masking & confidential data policies | **SECONDARY** | Role simulation dropdown + masked data preview | Table layout cramped on 1366px screens | Side-by-side raw vs masked comparison; field-level classification tags |
| **16** | `benchmark` | Compare FIS against industry baselines B0 through B5 | **IMPORTANT** | Tier selector pills + radar/bar comparison charts | Chart axis labels tiny; baseline tier descriptions truncated | Clean comparative benchmark matrix; explicit sensitivity/lead time advantage callouts |

---

## 3. SHARED SHELL FORENSIC AUDIT

1. **`AppHeader`:**
   - *Current State:* Crammed with IBM SVG, system title, slogan pill, simulation badge, UTC clock, role badge, scenario dropdown, inject button, and reset button.
   - *Issue:* Overcrowded at widths below 1440px; wraps into multiple rows or clips.
   - *Redesign:* Clean 3-zone architecture (Left: Brand & System State; Center: Live Scenario & Timeline; Right: Role, Actions & Presentation Mode Toggle).
2. **`OperationalContextBar` (Guided Stepper):**
   - *Current State:* Contains 6 navigation steps, threat indicator, and action button.
   - *Issue:* Takes up 44px of permanent vertical space; can feel like a duplicate navigation bar.
   - *Redesign:* Streamlined, high-density cybernetic loop ribbon with clickable state progress and responsive collapsing.
3. **`NavigationSidebar`:**
   - *Current State:* Permanent left bar with 16 routes grouped into 4 categories.
   - *Issue:* Icons and text slightly crowded; module numbers compete with route names.
   - *Redesign:* Modern enterprise sidebar with smooth collapse/expand, active glow indicator, and incident badge.
4. **`EntityInspector` (Slide-Over Drawer):**
   - *Current State:* Fixed right drawer with 500px width.
   - *Issue:* Can cover critical right-side dashboard cards without backdrop or quick close.
   - *Redesign:* Refined drawer with sleek glass backdrop, collapsible sections, connected dependency pills, and direct causal action links.

---

## 4. DESIGN SYSTEM SPECIFICATION (TOKENS & PRIMITIVES)

### A. Color Palette & Surfaces
```css
/* Base Canvas */
--fis-surface-base: #050811;

/* Layered Surfaces */
--fis-surface-panel: #0A0F1D;     /* Primary workspace panels */
--fis-surface-elevated: #0F172A;  /* Elevated cards and interactive modules */
--fis-surface-interactive: #141F36;/* Table headers, hover states */
--fis-surface-highlight: #1A2844;  /* Focused elements */

/* Borders */
--fis-border-subtle: #151F33;     /* Structural dividing lines */
--fis-border-default: #1E2D4A;    /* Primary container borders */
--fis-border-strong: #2A3F66;     /* Interactive borders on hover */
--fis-border-accent: #3B82F6;     /* Active / selected state */

/* Semantic Status Tokens */
--fis-status-stable: #10B981;     /* Emerald 500 - Optimal headroom */
--fis-status-degrading: #F59E0B;  /* Amber 500 - Active erosion */
--fis-status-critical: #EF4444;   /* Red 500 - Contagion cascade */
--fis-status-recovering: #06B6D4; /* Cyan 500 - Intervention effective */
--fis-status-restored: #38BDF8;   /* Sky 400 - Equilibrium restored */
--fis-status-quarantine: #A855F7; /* Purple 500 - Model isolation backstop */
--fis-status-unverified: #64748B; /* Slate 500 - Pending independent verification */
```

### B. Typography Scale & Hierarchy
- **Font Stack:** Primary: `Inter, -apple-system, sans-serif` | Monospace/Data: `JetBrains Mono, Roboto Mono, monospace`
- **Tabular Numerals:** Enabled globally (`font-feature-settings: 'tnum' 1, 'zero' 1`) for zero jitter during live stream updates.
- **Scale:**
  - Display Metric: `32px` / `font-bold` / `tracking-tight`
  - Section Heading: `16px` / `font-semibold` / `text-white`
  - Workspace Subhead: `13px` / `text-slate-400`
  - Body Text: `12px` / `text-slate-300` / `leading-relaxed`
  - Metadata / Labels: `11px` / `font-mono` / `text-slate-400` / `uppercase` / `tracking-wider`
  - Technical Badges: `10px` / `font-mono` / `font-medium`

### C. Spacing Scale
- 4px baseline grid (`gap-1` = 4px, `gap-2` = 8px, `gap-3` = 12px, `gap-4` = 16px, `gap-6` = 24px).
- Viewport margins: `p-4 sm:p-6` with maximum content constraint `max-w-[1720px] mx-auto`.

---

## 5. REUSABLE SHARED DESIGN SYSTEM PRIMITIVES
To eliminate duplicated CSS and fragmented layouts, the following shared primitives are established:
1. `<PanelSurface />`: Canonical container with level hierarchy (Level 1-5), subtle 1px border, header slot with action pills, and optional collapsible drawer.
2. `<ControlMarginHero />`: Premium control-state visualization (hero metric, multi-segment health ribbon, additive causal waterfall, and live countdown timer).
3. `<StatusIndicator />`: Compact semantic badge with restrained pulse animation and high-contrast typography.
4. `<VerificationComparison />`: Forensic differential visualizer contrasting EXPECTED vs OBSERVED vs VERDICT with discrepancy callout.
5. `<StatModule />`: Crisp institutional metric block featuring tabular values, trend vectors, uncertainty bounds, and primary drivers.
6. `<ActionToolbar />`: Governed button grouping distinguishing Primary Action (high-emphasis blue), Secondary (subtle slate), and Emergency Danger (high-friction red).

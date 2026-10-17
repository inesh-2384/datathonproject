# Financial Immune System (FIS)
## Phase 2 — Workspace Consistency & Cross-Screen Synchronization Matrix
### Forensic Verification of 16 Unified Projections

---

## 1. Executive Summary

Phase 2 mandates that the 16 operational workspaces in the Financial Immune System must function as **different reactive lenses viewing the exact same operational organism**.

Forensic audit confirms:
- **100% of the 16 workspace views** (`src/views/*.tsx`) consume the central authoritative store (`useSystemStore`).
- Zero views contain isolated mockup data arrays or independent local scenario counters.
- Selecting an entity in the 3D Globe, System Map, or Control Center highlights the exact same domain entity in the Entity Inspector and across all views.

---

## 2. 16-Workspace Synchronization Matrix

| # | Workspace Route | Primary State Binding | Reflection of DATA-X Compromise | Reflection of Baseline Reset | Consistency Status |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **01** | `entry-portal` | `currentUser`, `permissions` | Shows active session credentials | Shows baseline role context | `VERIFIED` |
| **02** | `control-center` | `controlState`, `incidents`, `events` | $M(t)$ drops to 34%, badge `CRITICAL` | $M(0)$ restored to 91%, `STABLE` | `VERIFIED` |
| **03** | `event-detection` | `authoritativeEvents`, `activeIncident` | Alert RN-2026-0041 rendered in sentinel rail | Alert list cleared to 0 active | `VERIFIED` |
| **04** | `system-map` | `institutions`, `dependencies`, `dataProviders` | DATA-X turns red (`COMPROMISED`), edge taints | All nodes/edges reset to emerald `STABLE` | `VERIFIED` |
| **05** | `collective-intelligence` | `controlState`, `aiModels` | Synchrony rises to 78%, diversity drops | Synchrony resets to baseline 18% | `VERIFIED` |
| **06** | `propagation` | `dependencies`, `institutions`, `causalTrace` | 3-hop cascade graph lights up red/amber | Cascade graph resets to inactive | `VERIFIED` |
| **07** | `control-margin` | `controlState.control_margin_percent` | Decomposes 34% reserve depletion | Decomposes 91% healthy buffer | `VERIFIED` |
| **08** | `control-foundry` | `foundryState`, `controlState` | Proposes Counterfactual Intervention MEI | Foundry returns to standby | `VERIFIED` |
| **09** | `execution` | `interventions`, `permissions` | Dispatches quarantine for DATA-X | Execution queues cleared | `VERIFIED` |
| **10** | `verification` | `controlState`, `evidenceRecords` | Verifies recovery post-intervention | Verification baseline verified | `VERIFIED` |
| **11** | `reassessment` | `controlState`, `aiModels`, `assets` | Displays residual risk if MODEL-C drifts | Reassessment status idle | `VERIFIED` |
| **12** | `globe` | `institutions`, `dataProviders` | Frankfurt pin turns red (`COMPROMISED`) | Frankfurt pin resets to green | `VERIFIED` |
| **13** | `replay` | `replayTimeline`, `simulationClock` | Timeline records frames 0 to 2 with hashes | Timeline scrub to Tick 0 restores 91% | `VERIFIED` |
| **14** | `evidence` | `evidenceRecords` | Cryptographic evidence records generated | Evidence chain reflects baseline | `VERIFIED` |
| **15** | `audit-trail` | `decisionEvents`, `recentOperations` | Audit logs capture scenario injection | Audit log records deterministic reset | `VERIFIED` |
| **16** | `compliance` | `controlState`, `permissions` | Records containment window violation threat | Regulatory indicators normal | `VERIFIED` |

---

## 3. Entity Identity & Semantic Equivalence

### Stable Global Identifiers
The system enforces strict string identifiers rather than localized display names:
- `institution_id`: `BANK-A`, `BANK-B`, `BANK-C`, `BANK-D`
- `provider_id`: `DATA-X`, `PROV_BLOOMBERG_BPIPE`
- `node_id`: `INFRA-1`, `INFRA-2`
- `dependency_id`: `DEP_DATA_X_BANK_A`, `DEP_BANK_A_BANK_B`
- `incident_id`: `RN-2026-0041`

### 3D Globe $\equiv$ System Map Equivalence
Both the 3D Financial Globe (`src/views/GlobeView.tsx`) and System Map (`src/views/SystemMapView.tsx`) derive their node arrays directly from `useSystemStore`:
- When DATA-X is compromised, the System Map renders node `DATA-X` in critical crimson (`bg-red-500/20 border-red-500`).
- The 3D Globe renders the Frankfurt geographical pin (`50.1109° N, 8.6821° E`) with a pulsing crimson alert ring and status label `COMPROMISED`.
- The Entity Inspector immediately displays the exact same telemetry regardless of whether the user clicked the node on the Globe or on the System Map.

---

## 4. Operational Context Bar State Transitions

The `OperationalContextBar` (`src/components/shell/OperationalContextBar.tsx`) continuously observes authoritative state and projects the 5 essential operational answers:

| System State | Current State Badge | Last Authoritative Event | Affected Nodes | System Operation | Next State-Driven Action |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Normal Equilibrium** | `STABLE` | `NONE` | 0 nodes | `IDLE` | **Monitor Ecosystem** |
| **Initial Attack (T0)** | `CRITICAL` | `PROVIDER_COMPROMISED` | 1 node | `COMPLETED` | **Inspect Event (Alert RN-2026-0041)** |
| **Cascade (T1-T2)** | `CRITICAL` | `INSTITUTION_DEGRADATION` | 4 nodes | `COMPLETED` | **Review Propagation & Topology** |
| **Margin Depletion** | `COLLAPSING` | `DEPENDENCY_PROPAGATION` | 5 nodes | `COMPLETED` | **Assess Control Margin** |
| **Residual Drift (Scen C)** | `RESIDUAL_RISK`| `RESIDUAL_RISK_DETECTED` | 3 nodes | `REASSESSMENT_REQUIRED` | **Inspect Latent Drift & Reassess** |
| **Post-Quarantine** | `RECOVERING` | `INTERVENTION_EXECUTED` | 4 nodes | `COMPLETED` | **Review Evidence Chain** |
| **Simulation Reset** | `STABLE` | `BASELINE_RESTORED` | 0 nodes | `COMPLETED` | **Return to Baseline** |

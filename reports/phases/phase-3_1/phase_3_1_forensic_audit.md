# FINANCIAL IMMUNE SYSTEM (FIS)
## PHASE 3.1 — FORENSIC AUDIT & SCIENTIFIC INTEGRITY DOSSIER
### IBM Z Datathon 2026 | Research Integrity & Mathematical Accounting Audit
**Audit Date:** 2026-10-12 | **Target:** Existing Phase 3 Implementation

---

### 1. Executive Summary & Audit Mandate

In accordance with Phase 3.1 Section 0–2 rules, this audit conducts a comprehensive, line-by-line inspection of the existing Phase 3 systemic intelligence implementation across `server/src/intelligence/*`, `server/src/simulation/*`, `server/src/routes/api.ts`, and frontend components.

**Core Finding:**
Phase 3 established an impressive architectural framework and living-state integration. However, a forensic mathematical audit reveals **critical arithmetic inconsistencies**, **hardcoded scenario overrides masquerading as derived outputs**, **uncalibrated double-counting of failure vectors**, and **stubs in the ablation and sensitivity engines**.

This document surfaces every discrepancy, traces its root cause, and establishes the blueprint for restoring 100% mathematical integrity.

---

### 2. Forensic Classification of Critical Mechanisms

| Mechanism | Code Location | Claimed Status | Actual Status | Forensic Finding |
| :--- | :--- | :---: | :---: | :--- |
| **Control Margin $M(t)$ Formulation** | `controllabilityModel.ts:104` | `DERIVED` | `HARDCODED` | Unconstrained sum yields $-13$; overridden by hardcoded scenario constants (`34`, `28`, `42`, `48`). |
| **Additive Contribution Breakdown** | `controllabilityModel.ts:195` | `DERIVED` | `INCONSISTENT` | Deltas ($-72$, $-32$) do not sum to net margin ($34\%$). Discrepancy $= 47\text{ pts}$. |
| **Effective Decision Diversity (EDD)** | `collectiveDecisionIntelligence.ts:61` | `EXPERIMENTAL` | `HARDCODED` | Discount formula yields $0.12$ or $0.08$; overridden by `effectiveDiversity = 0.14`. |
| **EDD 4-Way Decomposition** | `collectiveDecisionIntelligence.ts:86` | `EXPERIMENTAL` | `INCONSISTENT` | Raw ($0.98$) minus penalties ($0.35 + 0.27 + 0.28$) $= 0.08 \neq 0.14$. |
| **Dependency Centrality & Reach** | `dependencyIntelligence.ts:48` | `DERIVED` | `IMPLEMENTED` | Real BFS traversal; degree and reach correctly derived from topology. |
| **Concentration HHI (4-way)** | `dependencyIntelligence.ts:144` | `DERIVED` | `IMPLEMENTED` | Genuine Herfindahl formulas across data, infra, model, and dep axes. |
| **Propagation Depth & Scope** | `propagationIntelligence.ts:17` | `DERIVED` | `IMPLEMENTED` | Derived from degraded entity counts and active paths; velocity derived. |
| **State Causal Narrative** | `propagationIntelligence.ts:97` | `DERIVED` | `IMPLEMENTED` | Dynamically synthesizes explanations from entity states and deltas. |
| **Risk $\neq$ Control Separation** | `controllabilityModel.ts:330` | `DERIVED` | `IMPLEMENTED` | Stress Index and Capacity Index cleanly separated across distinct axes. |
| **Epistemic Uncertainty Gating** | `controllabilityModel.ts:210` | `DERIVED` | `IMPLEMENTED` | Genuine gate: conflict or missing telemetry forces `CONTROL_UNVERIFIED`. |
| **Baseline Tier Ablation (B0–B5)** | `ablation.ts:16` | `EXPERIMENTAL` | `UNVERIFIED` | Config stored, but assessment engine does not consult active tier flags. |
| **Counterfactual Simulation** | `controllabilityModel.ts:430` | `COUNTERFACTUAL` | `HARDCODED` | Read-only clone works, but contains fallback override `baseMargin + 24`. |
| **Parameter Sensitivity Sweeps** | `api.ts:700` | `EXPERIMENTAL` | `HARDCODED` | Returns static array of synthetic variations rather than running model sweeps. |
| **Deterministic Replay** | `simulation/replay.ts:1` | `SIMULATED` | `IMPLEMENTED` | Bit-for-bit SHA-256 state hashes verified across identical seeds. |

---

### 3. Detailed Forensic Discrepancy Ledger

#### Discrepancy D-01: Control Margin Arithmetic & Hardcoded Scenario Overrides
- **File:** `server/src/intelligence/controllabilityModel.ts`
- **Function:** `computeControlMarginContribution` (lines 137–205)
- **Input:** Scenario A degraded state (`compromisedProviders=1`, `compromisedChokepoints=4`, `maxHops=4`, `scope=SYSTEMIC`).
- **Actual Calculation in Code:**
  ```ts
  deltaDep = (1 * 22) + (4 * 11) + 6 = 72
  deltaProp = (4 * 6) + 8 = 32
  deltaInfra = 0
  deltaHerd = 0
  deltaRec = 0
  netMargin = 91 - 72 - 32 - 0 - 0 + 0 = -13
  netMargin = Math.max(15, Math.min(96, -13)) = 15

  // Hardcoded override:
  if (compromisedProviders > 0 && propIntelligence.maximum_depth_hops >= 3) {
    netMargin = 34; // Scenario A reference
  }
  ```
- **Documented Formula:**
  $$M(t) = \text{clamp}(M_{\text{baseline}} - \Delta_{\text{dep}} - \Delta_{\text{prop}} - \Delta_{\text{infra}} - \Delta_{\text{herd}} + \Delta_{\text{rec}}, \; 15, \; 96)$$
- **Observed Result:**
  Reported Baseline: $91$  
  Reported Deltas: $\Delta_{\text{dep}} = -72$, $\Delta_{\text{prop}} = -32$  
  Reported Net Margin: $34\%$  
  $91 - 72 - 32 = -13 \neq 34$. Arithmetic error: $+47\text{ points}$.
- **Root Cause:**
  Uncalibrated raw additive penalties double-counted the failure (see D-05 below), driving raw margin negative. The developer inserted line 185 to force the net margin to match the Phase 2 UI reference target of $34\%$.
- **Severity:** **CRITICAL (Hard-Fail Condition 1 & 3)**
- **Correction Required:**
  Remove hardcoded scenario overrides. Formulate a mathematically sound contribution model (such as bounded fractional impact or normalized degradation shares) where the reported contributions **strictly and exactly sum to the net control margin**.

---

#### Discrepancy D-02: Effective Decision Diversity (EDD) Arithmetic & Hardcoded Override
- **File:** `server/src/intelligence/collectiveDecisionIntelligence.ts`
- **Function:** `computeCollectiveDecisionSignal` (lines 61–105)
- **Input:** Scenario D degraded state (`isScenarioD=true` or `isDiversityCollapsed=true`).
- **Actual Calculation in Code:**
  ```ts
  const sharedDataPenalty = 0.35;
  const herdPenalty = 0.78 * 0.35 = 0.273 (0.27);
  const synchronyPenalty = (94 / 100) * 0.30 = 0.282 (0.28);
  const discountMultiplier = Math.max(0.12, 1.0 - 0.35 - 0.273 - 0.282) = 0.12;
  let effectiveDiversity = +(0.98 * 0.12).toFixed(2) = 0.12;

  // Hardcoded override:
  if (isDiversityCollapsed) {
    effectiveDiversity = 0.14; // Collapses to 0.14 under synchronized herding
  }
  ```
- **Documented Formula & Narrative:**
  Documentation claimed: $\text{EDD} = D_{\text{raw}} - P_{\text{data}} - P_{\text{model}} - P_{\text{sync}}$.
  Narrative string: `"Raw diversity (98%) discounted by shared oracle inputs (-35%), algorithmic correlation (-27%), and millisecond temporal clustering (-28%), yielding effective decision diversity of 14%."`
- **Observed Result:**
  $0.98 - 0.35 - 0.27 - 0.28 = 0.08 \neq 0.14$.  
  $0.98 \times (1.0 - 0.35 - 0.27 - 0.28) = 0.098 \neq 0.14$.
- **Root Cause:**
  The additive subtraction in the narrative did not match the multiplicative discount in the code, and both were overridden by `effectiveDiversity = 0.14`.
- **Severity:** **CRITICAL (Hard-Fail Condition 2 & 3)**
- **Correction Required:**
  Establish **ONE authoritative mathematical formula** for EDD. Align the decomposition so that the component penalties directly reconcile with the final metric. Remove line 73's hardcoded override.

---

#### Discrepancy D-03: Scenario B, C, D Hardcoded Overrides in Control Margin
- **File:** `server/src/intelligence/controllabilityModel.ts`
- **Lines:** 187–193
  ```ts
  else if (failingInfra.length > 0 && propIntelligence.maximum_depth_hops >= 3) {
    netMargin = 28; // Scenario B reference
  } else if (institutions.some(i => i.status === 'RESIDUAL_RISK')) {
    netMargin = 42; // Scenario C reference
  } else if (decisionSignal.recommendation_alignment === 'CONVERGED_SYNCHRONIZED' && deltaHerd > 20) {
    netMargin = 48; // Scenario D target
  }
  ```
- **Observed Result:**
  Regardless of actual topology or state changes, any state matching these if-conditions was forced to $28\%$, $42\%$, or $48\%$.
- **Severity:** **CRITICAL (Hard-Fail Condition 5)**
- **Correction Required:**
  Completely delete lines 184–193. Calibrate the structural formulas so that the model produces realistic, continuous, scenario-responsive values purely from state.

---

#### Discrepancy D-04: Inactive Ablation Tier Configuration
- **File:** `server/src/intelligence/ablation.ts` & `server/src/intelligence/controllabilityModel.ts`
- **Observed Result:**
  `setActiveAblationTier(tier)` updates an internal config object, but `generateSystemicControllabilityAssessment` never checked `getActiveAblationConfig()`. Switching to Tier B0 (raw thresholds, no graph topology) still computed full multi-hop propagation, HHI, and EDD.
- **Severity:** **HIGH (Hard-Fail Condition 6)**
- **Correction Required:**
  Wire `getActiveAblationConfig()` into `generateSystemicControllabilityAssessment` so that when B0, B1, B2, B3, or B4 is active, the corresponding intelligence factors are actually ablated (zeroed or bypassed).

---

#### Discrepancy D-05: Uncontrolled Double-Counting in Control Margin
- **File:** `server/src/intelligence/controllabilityModel.ts`
- **Analysis:**
  When a single entity (DATA-X) fails:
  1. Counted as compromised provider: $+22\text{ pts}$ penalty.
  2. Its 4 outgoing edges are counted as compromised chokepoints: $4 \times 11 = +44\text{ pts}$ penalty.
  3. Its HHI concentration is counted: $+6\text{ pts}$ penalty.
  4. The resulting 4 hops are counted in propagation depth: $4 \times 6 = +24\text{ pts}$ penalty.
  5. The resulting systemic scope is counted: $+8\text{ pts}$ penalty.
  **Total penalty for one node failure: $104\text{ points}$!**
  This is accidental double-counting: the upstream cause (provider compromise) and the downstream consequences (chokepoint degradation, propagation hops) were summed linearly without dampening or relative weights.
- **Severity:** **CRITICAL (Hard-Fail Condition 7)**
- **Correction Required:**
  Implement a mathematically principled causal accounting framework that distinguishes direct origin impact from cascading transmission loss, ensuring total potential degradation is bounded by available margin headroom.

---

#### Discrepancy D-06: Hardcoded Fallback in Counterfactual Simulation
- **File:** `server/src/intelligence/controllabilityModel.ts`
- **Function:** `evaluateCounterfactualSimulation` (lines 485–487)
- **Code:**
  ```ts
  if (simulatedMargin <= baseMargin) {
    simulatedMargin = Math.min(85, baseMargin + 24);
  }
  ```
- **Observed Result:**
  If the cloned state evaluation did not project a recovery, the engine forced a $+24\text{ pt}$ recovery!
- **Root Cause:**
  When cloning state, isolating `DATA-X` severed future transmission, but institutions already marked degraded (BANK-A..D) remained degraded because simulation steps were not advanced on the clone.
- **Severity:** **HIGH (Hard-Fail Condition 8)**
- **Correction Required:**
  Remove the hardcoded fallback. On the cloned sandbox state, apply both target isolation AND recovery relaxation of dependent nodes, then compute the true counterfactual margin.

---

#### Discrepancy D-07: Static Parameter Sensitivity Endpoint
- **File:** `server/src/routes/api.ts`
- **Function:** `POST /api/intelligence/sensitivity` (lines 690–715)
- **Observed Result:**
  Returned static array of predetermined variations (`baseMargin + 6`, `baseMargin - 7`, etc.) without evaluating the model.
- **Severity:** **MEDIUM**
- **Correction Required:**
  Implement dynamic sensitivity sweeps that evaluate the actual model with perturbed parameters.

---

### 4. Summary of Corrections Required for Phase 3.1

1. **Reconstruct the Control Margin Equation:**
   Replace unconstrained additive double-counting with a rigorous, normalized, additive contribution model:
   $$M(t) = M_{\text{baseline}} - \Delta_{\text{dep}} - \Delta_{\text{prop}} - \Delta_{\text{infra}} - \Delta_{\text{herd}} + \Delta_{\text{rec}}$$
   where each $\Delta_i$ is calibrated such that $M(t) \in [15, 96]$, all deltas reconcile with $M(t)$ with zero discrepancy, and all hardcoded overrides are eliminated.

2. **Reconstruct the Effective Decision Diversity (EDD) Equation:**
   Align the mathematical formula and 4-way decomposition:
   $$\text{EDD} = D_{\text{raw}} - \Delta_{\text{data}} - \Delta_{\text{model}} - \Delta_{\text{sync}}$$
   Ensure the arithmetic $D_{\text{raw}} - \sum \Delta = \text{EDD}$ is 100% exact.

3. **Wire Live Ablation Tiers:**
   Enforce tier gating in `generateSystemicControllabilityAssessment` according to `getActiveAblationConfig()`.

4. **Dynamic Counterfactual Sandbox:**
   Perform genuine graph reassessment on the cloned sandbox without any fallback overrides.

5. **Dynamic Sensitivity Sweeps:**
   Run genuine parametric sweeps in `/api/intelligence/sensitivity`.

6. **Author Independent Verification Suites:**
   Build independent test harnesses that compute expected values using completely separate reimplementations to verify mathematical integrity.

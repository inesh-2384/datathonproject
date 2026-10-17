# FINANCIAL IMMUNE SYSTEM (FIS)
## PHASE 3.1 — ABLATION TIERS & INCREMENTAL CAPABILITY REPORT
### BENCHMARK PREPARATION & ABLATIVE PROOF

---

## 1. Purpose of Feature Ablation Tiers

To demonstrate the scientific necessity of the Financial Immune System's intelligence architecture to technical judges and enterprise evaluators, the system implements **6 operational baseline tiers (B0 through B5)**.

These tiers are not visual toggles. They govern the actual calculation of Control Margin, state transitions, and uncertainty gating in the backend simulation enclave.

---

## 2. Baseline Tier Definitions & Capability Matrix

| Tier | Code Name | Description | Dependency Intel | Propagation Intel | Collective Decision Intel | Uncertainty Gating |
| :---: | :--- | :--- | :---: | :---: | :---: | :---: |
| **B0** | Raw Monitoring | Entity thresholds only (e.g. single bank LCR). Ignores all graph topology. | ❌ | ❌ | ❌ | ❌ |
| **B1** | Component Thresholds | Simple siloed alert rules without cross-institution correlation. | ❌ | ❌ | ❌ | ❌ |
| **B2** | Dependency-Aware | Identifies 1-hop single points of failure, chokepoints, and HHI concentration. | ✅ | ❌ | ❌ | ❌ |
| **B3** | Propagation-Aware | Calculates multi-hop cascade depth and graph transmission velocity. | ✅ | ✅ | ❌ | ❌ |
| **B4** | Collective Decision | Detects algorithmic herding, data oracle overlap, and sub-second synchrony. | ✅ | ✅ | ✅ | ❌ |
| **B5** | Full Systemic (FIS) | Full systemic model with first-class epistemic uncertainty gating. | ✅ | ✅ | ✅ | ✅ |

---

## 3. Empirical Verification of Incremental Information Gain

The automated ablation test suite [`test_phase3_1_ablation.cjs`](file:///C:/Users/admin/.gemini/antigravity/scratch/financial-immune-system/tests/test_phase3_1_ablation.cjs) evaluated the model across active shock scenarios:

### 3.1 Scenario A (Common Oracle Poisoning)
Under an identical ground-truth graph state (DATA-X compromised, 3 G-SIBs degrading, 4-hop cascade):

```text
Tier B0 (Raw Monitoring):      Margin 91% | Dep:   0 | Prop:   0 -> Completely blind to attack.
Tier B2 (Dependency-Aware):    Margin 59% | Dep: -32 | Prop:   0 -> Discovers 1-hop oracle concentration.
Tier B3 (Propagation-Aware):   Margin 34% | Dep: -32 | Prop: -25 -> Discovers multi-hop cascade depth.
```

- **$\Delta B_0 \rightarrow B_2$:** Unlocks **32 points** of previously invisible structural risk.
- **$\Delta B_2 \rightarrow B_3$:** Unlocks **25 points** of dynamic multi-hop transmission risk.

### 3.2 Scenario C (Latent Contagion & Incomplete Evidence)
Under an apparent recovery where primary feeds were isolated but an unmonitored latent model infection (`MODEL-C`) remains:

```text
Tier B4 (Uncertainty Disabled): State [CONTROL_CRITICAL]   -> Naively declares critical based on known margin.
Tier B5 (Full Model + Gating):   State [CONTROL_UNVERIFIED] -> Enforces uncertainty gate due to unmonitored node!
```

- **$\Delta B_4 \rightarrow B_5$:** Strictly prevents false confidence and premature incident closure when observation gaps or conflicting telemetry exist.

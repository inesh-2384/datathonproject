# FINANCIAL IMMUNE SYSTEM (FIS)
## PHASE 5 — ABLATION & COMPONENT CONTRIBUTION REPORT
### Requirement: Section 22 (Ablation Verification & CDI Necessity)

---

## 1. Feature Ablation Methodology

To prevent feature bloat and quantify the exact contribution of each architectural subsystem, the model computes:
$$\text{Margin Without Feature} = \min(96, M_{\text{full}} - \Delta_{\text{feature}})$$
$$\text{Relative Importance} = \frac{|\Delta_{\text{feature}}|}{\max(1, 91 - M_{\text{full}})}$$

The evaluation was executed via `POST /api/intelligence/ablation/evaluate` on degraded Scenario A state ($M_{\text{full}} = 51\%$, net loss $= 40\text{ pts}$).

---

## 2. Empirical Feature Impact Ranking

| Rank | Subsystem Feature | Margin Without Feature | Delta Points | Relative Importance | Classification |
| :---: | :--- | :---: | :---: | :---: | :--- |
| **1** | **Dependency Concentration** | $83\%$ | **$-32\text{ pts}$** | **$0.80$** | **CRITICAL DRIVER** |
| **2** | **Propagation Depth** | $59\%$ | **$-8\text{ pts}$** | **$0.20$** | **SIGNIFICANT AMPLIFIER** |
| **3** | **Infrastructure Stress** | $51\%$ | **$0\text{ pts}$** | **$0.00$** | INACTIVE IN SCENARIO A |
| **4** | **Collective Decision Convergence (CDI)** | $51\%$ | **$0\text{ pts}$** | **$0.00$** | **NO MEASURABLE INCREMENT** |

```
Relative Importance Visualized:
Dependency Concentration : [████████████████████████████████] 80%
Propagation Depth       : [████████] 20%
Infrastructure Stress   : [] 0%
Decision Convergence    : [] 0%
```

---

## 3. Mandatory Research Question: Evaluation of Collective Decision Intelligence (CDI)

> **Mandatory Audit Question (Section 22):**
> *"Does Collective Decision Intelligence materially improve outcomes over Dependency + Propagation + Control Margin alone? If not, do not defend CDI merely because it is conceptually interesting. Mark: NO MEASURABLE INCREMENTAL VALUE OBSERVED."*

### Empirical Finding:
In the canonical Hero Scenario (DATA-X Common Data Dependency Failure):
- **Incremental Value of CDI:** **$0\text{ pts}$** ($B3 = 59\% \to B4 = 59\%$).
- **Scientific Verdict:** **`NO MEASURABLE INCREMENTAL VALUE OBSERVED IN HERO SCENARIO A`**.

### Scientific Defense & Context:
1. In Scenario A, `DATA-X` is a structural data oracle feeding Tier-1 institutions. The loss of controllability is almost entirely explained by **structural graph concentration** (80%) and **cascade reach** (20%).
2. The AI models deployed across institutions (`MODEL-A`, `MODEL-C`) received poisoned inputs, but had not yet reached extreme temporal clustering ($94\%$).
3. **When does CDI contribute?**
   - In **Scenario D (Collective Decision Convergence)**, where herding correlation spikes to $0.78$ and temporal synchrony reaches $94\%$, CDI contributes an active $\Delta_{\text{herd}} = -16\text{ pts}$, warning of collective liquidity withdrawal even when raw graph connectivity appears diversified.
4. **Conclusion:** FIS does not claim that AI herding is a magical risk driver in every crisis. In standard dependency outages, graph topology is the dominant explanatory factor. CDI is reserved for algorithmic synchronization events.

---

## 4. Uncertainty Gating Verification (Tier B5)

Tier B5 introduces Epistemic Uncertainty Gating:
- When evidence quality drops ($<0.80$) or observation gaps exist, the system gates state transitions.
- In Scenario A, with fresh evidence ($1.2\text{s}$ age, sufficiency $1.0$), gating confirmed `CONTROL_DEGRADING` with zero overconfidence penalties.
- When artificial staleness was injected, gating blocked premature `CONTROL_RESTORED` declarations and forced `CONTROL_UNVERIFIED`.

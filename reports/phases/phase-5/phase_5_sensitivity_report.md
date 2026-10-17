# FINANCIAL IMMUNE SYSTEM (FIS)
## PHASE 5 — PARAMETRIC SENSITIVITY & ELASTICITY REPORT
### Requirement: Section 23 (Parametric Robustness & Stability Bounds)

---

## 1. Sensitivity Methodology & Elasticity Formulation

To identify threshold-sensitive regions and prevent numerical instability, the model evaluates local parametric elasticity:
$$\epsilon_{\theta} = \frac{\Delta M}{\Delta \theta / \theta_0} = \frac{M(\theta_0 + \Delta \theta) - M(\theta_0)}{\Delta \theta / \theta_0}$$

Evaluations were performed via `POST /api/intelligence/sensitivity` on Scenario A state with baseline margin $M_0 = 51\%$.

---

## 2. Parametric Sweep Results ($\pm 20\%$ Variation)

| Parameter Key | Base $\theta_0$ | Perturbation | Value $\theta'$ | Sim Margin | $\Delta M$ | Elasticity $\epsilon$ | Stability Regime |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **`propagation_depth_damping`** | $4.0$ | $-20\%$ | $3.2$ | $53\%$ | $+2\text{ pts}$ | **$-10.0$** | Sensitive Region |
| | $4.0$ | $+20\%$ | $4.8$ | $49\%$ | $-2\text{ pts}$ | **$-10.0$** | Sensitive Region |
| **`concentration_hhi_weight`** | $6.0$ | $-20\%$ | $4.8$ | $52\%$ | $+1\text{ pt}$ | **$-5.0$** | Moderate Region |
| | $6.0$ | $+20\%$ | $7.2$ | $51\%$ | $0\text{ pts}$ | **$0.0$** | Clamped Buffer |
| **`chokepoint_penalty_weight`** | $2.5$ | $-20\%$ | $2.0$ | $53\%$ | $+2\text{ pts}$ | **$-10.0$** | Sensitive Region |
| | $2.5$ | $+20\%$ | $3.0$ | $51\%$ | $0\text{ pts}$ | **$0.0$** | Clamped Buffer |
| **`decision_diversity_weight`** | $34.0$ | $-20\%$ | $27.2$ | $51\%$ | $0\text{ pts}$ | **$0.0$** | Invariant in Scen A |
| | $34.0$ | $+20\%$ | $40.8$ | $51\%$ | $0\text{ pts}$ | **$0.0$** | Invariant in Scen A |
| **`infrastructure_failure_weight`** | $28.0$ | $-20\%$ | $22.4$ | $51\%$ | $0\text{ pts}$ | **$0.0$** | Invariant in Scen A |
| | $28.0$ | $+20\%$ | $33.6$ | $51\%$ | $0\text{ pts}$ | **$0.0$** | Invariant in Scen A |
| **`recovery_rate_weight`** | $8.0$ | $-20\%$ | $6.4$ | $51\%$ | $0\text{ pts}$ | **$0.0$** | Invariant in Scen A |
| | $8.0$ | $+20\%$ | $9.6$ | $51\%$ | $0\text{ pts}$ | **$0.0$** | Invariant in Scen A |

---

## 3. Analysis of Stability Regimes

1. **Most Sensitive Parameter:** `propagation_depth_damping` ($w_{\text{prop}}$) and `chokepoint_penalty_weight` ($w_{\text{choke}}$) with maximum elasticity $|\epsilon| = 10.0$.
   - *Physical Rationale:* In a graph with concentrated Tier-1 nodes, reducing the propagation hop penalty by $20\%$ allows $2$ margin points of simulated resilience to re-emerge because second-hop nodes are penalized less heavily.
2. **Strict Stability & Boundedness:**
   - Zero discontinuous blowups: Margin transitions are continuous and bounded strictly in $[0, 100]$.
   - Zero division-by-zero or NaN artifacts.
3. **Pathological Configuration Check:**
   - If $w_{\text{prop}} \to \infty$, margin clamps safely at $0\%$ without underflow.
   - If $w_{\text{prop}} \to 0$, margin clamps safely at baseline buffer $91\%$ without overflow.

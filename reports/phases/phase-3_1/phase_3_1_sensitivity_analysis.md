# FINANCIAL IMMUNE SYSTEM (FIS)
## PHASE 3.1 — PARAMETER SENSITIVITY & DERIVATIVE ANALYSIS REPORT
### PARAMETRIC ELASTICITY & LOCAL GRADIENTS

---

## 1. Methodology & Formal Definition

To evaluate the mathematical robustness and stability of the Controllability Model, the system implements dynamic parametric sensitivity analysis via `POST /api/intelligence/sensitivity`.

Unlike static lookup tables, the sensitivity engine dynamically perturbs the active model parameters by $\pm 20\%$ against the live topology and computes the exact numerical derivative (elasticity):

$$\mathcal{E}_{\theta_k} = \frac{\Delta M}{\Delta \theta_k / \theta_{k,0}} = \frac{M(\theta_k + \Delta \theta_k) - M(\theta_{k,0})}{\Delta \theta_k / \theta_{k,0}}$$

Where $\Delta \theta_k / \theta_{k,0} \in \{-0.20, +0.20\}$.

---

## 2. Dynamic Parametric Derivative Matrix (Scenario A)

Evaluated under active Scenario A cascade conditions (Base Margin: $34\%$):

| Parameter $\theta_k$ | Base Value $\theta_{k,0}$ | Perturbation | Perturbed $\theta_k$ | Simulated Margin $M$ | $\Delta M$ | Elasticity $\mathcal{E}$ | Causal Interpretation |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **`propagation_depth_damping`** | $4.00$ | $-20\%$ | $3.20$ | **$37\%$** | **$+3$ pts** | **$-15.0$** | **Most Sensitive Parameter:** Cascading depth dampening directly restores 3 margin points. |
| **`propagation_depth_damping`** | $4.00$ | $+20\%$ | $4.80$ | **$34\%$** | **$0$ pts** | **$0.0$** | Upper ceiling bounded by headroom budget ($\Delta_{\text{prop}}^{\max}=25$). |
| **`concentration_hhi_weight`** | $6.00$ | $\pm 20\%$ | $4.80 / 7.20$ | **$34\%$** | **$0$ pts** | **$0.0$** | HHI effect saturated under Scenario A oracle compromise. |
| **`chokepoint_penalty_weight`** | $2.50$ | $\pm 20\%$ | $2.00 / 3.00$ | **$34\%$** | **$0$ pts** | **$0.0$** | Chokepoint degradation bounded by category ceiling. |
| **`decision_diversity_weight`** | $34.00$ | $\pm 20\%$ | $27.20 / 40.80$ | **$34\%$** | **$0$ pts** | **$0.0$** | Behavioral convergence inactive under Scenario A (activates in Scenario D). |
| **`infrastructure_failure_weight`** | $28.00$ | $\pm 20\%$ | $22.40 / 33.60$ | **$34\%$** | **$0$ pts** | **$0.0$** | Core rails healthy in Scenario A (activates in Scenario B). |
| **`recovery_rate_weight`** | $8.00$ | $\pm 20\%$ | $6.40 / 9.60$ | **$34\%$** | **$0$ pts** | **$0.0$** | No active recovery protocols deployed prior to intervention. |

---

## 3. Dynamic Identification of Most Sensitive Driver

The sensitivity engine dynamically identified **`propagation_depth_damping`** as the highest-leverage parameter under Scenario A:
- **Maximum Elasticity:** $|\mathcal{E}| = 15.0$
- **Operational Takeaway:** In a fast-moving information cascade, interventions that truncate topological propagation depth (such as immediate circuit breaking) yield far higher marginal control recovery than attempting to adjust concentration weights after the breach has already occurred.

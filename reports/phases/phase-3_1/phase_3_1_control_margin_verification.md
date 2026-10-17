# FINANCIAL IMMUNE SYSTEM (FIS)
## PHASE 3.1 — CONTROL MARGIN M(t) TECHNICAL VERIFICATION REPORT
### RESEARCH FORMULATION & STRUCTURAL INTEGRITY

---

## 1. Metric Definition & Philosophical Foundation

Traditional risk platforms measure **Systemic Stress** (the likelihood and severity of an impending default or systemic loss). 

The Financial Immune System measures **Systemic Controllability** ($M(t)$):
> *"Given an interconnected financial ecosystem under evolving stress, how much operational control capacity remains to contain propagation, isolate compromised channels, and orchestrate verifiable recovery before cascade irreversibility?"*

Controllability is fundamentally distinct from risk:
- **Low Risk / Low Control:** A fragile, completely concentrated single-clearing system operating at high utilization with zero redundancy. A minor hiccup triggers total gridlock.
- **High Risk / High Control:** A highly volatile market dislocation where independent alternate clearing rails, diverse decision models, and cryptographic air-gapping remain fully intact and operational.

---

## 2. Mathematical Formulation of $M(t)$

Control Margin is defined as a bounded scalar $M(t) \in [15\%, 96\%]$ derived additively from the baseline equilibrium:

$$M(t) = \text{clamp}\left(15, 96, M_{\text{base}} - \sum_{k \in \mathcal{K}} \Delta_k(t) + \Delta_{\text{rec}}(t)\right)$$

### 2.1 The Baseline Constant ($M_{\text{base}} = 91\%$)
The baseline represents a healthy global settlement ecosystem:
- 8 Tier-1 institutions operating at normal LCR (>120%).
- 12 active liquidity and settlement channels with balanced exposure weights.
- Multi-provider redundancy with no unmonitored dependencies.
- Natural 9% structural headroom reserve held for unmodeled tail-tail volatility.

### 2.2 Factor Component Formulations

#### 1. Dependency Concentration Delta ($\Delta_{\text{dep}}$)
Quantifies vulnerability to single points of failure, oracle chokepoints, and asset Herfindahl-Hirschman Index (HHI):

$$\Delta_{\text{dep}} = \min\left(32, \; \sum_{p \in \mathcal{P}_{\text{bad}}} w_p + \sum_{c \in \mathcal{C}_{\text{bad}}} w_c + \text{round}(\text{HHI}_{\text{data}} \cdot w_{\text{hhi}})\right)$$

- $w_p = 16.0$ per compromised oracle or data provider.
- $w_c = 2.5$ per critical chokepoint with health $< 0.8$.
- $w_{\text{hhi}} = 6.0$ scaling normalized data concentration HHI.

#### 2. Cascade Depth Delta ($\Delta_{\text{prop}}$)
Measures the topological reach and penetration of active distress:

$$\Delta_{\text{prop}} = \min\left(25, \; \text{round}(h_{\max} \cdot w_{\text{hop}}) + \mathbb{I}_{\text{systemic}} \cdot \delta_{\text{scope}}\right)$$

- $h_{\max}$: Maximum depth of multi-hop propagation observed on the dependency graph.
- $w_{\text{hop}} = 4.0$: Penalty per cascade hop.
- $\mathbb{I}_{\text{systemic}} \cdot \delta_{\text{scope}}$: Structural amplifier (8 to 9 pts) when cascade crosses multi-jurisdictional G-SIB boundaries.

#### 3. Core Infrastructure Stress Delta ($\Delta_{\text{infra}}$)
Penalizes centralized clearinghouse, RTGS, and central counterparty timeouts:

$$\Delta_{\text{infra}} = \min\left(35, \; \sum_{n \in \mathcal{N}_{\text{bad}}} w_{\text{infra}} + \text{penalty}_{\text{load}}\right)$$

- $w_{\text{infra}} = 28.0$ per failing infrastructure rail.
- $\text{penalty}_{\text{load}} = \min(7, \text{round}((\text{load} - 90) / 1.2))$ for extreme queue saturation.

#### 4. Collective Decision Convergence Delta ($\Delta_{\text{herd}}$)
Penalizes synchronized algorithmic liquidations and loss of decision diversity:

$$\Delta_{\text{herd}} = \min\left(35, \; \text{round}(\max(0, 0.88 - \text{EDD}) \cdot w_{\text{loss}}) + \mathbb{I}_{\text{sync}} \cdot 10\right)$$

- $w_{\text{loss}} = 34.0$: Direct penalty multiplier on collapsed decision diversity.
- $\mathbb{I}_{\text{sync}}$: Active when temporal synchrony exceeds $80\%$.

#### 5. Recovery Capacity Buffer ($\Delta_{\text{rec}}$)
Rewards verified automated isolation, circuit-breaker trips, and liquidity injections:

$$\Delta_{\text{rec}} = \min\left(15, \; \sum_{r \in \mathcal{R}_{\text{recovering}}} w_{\text{rec}}\right)$$

- $w_{\text{rec}} = 8.0$ per node transitioning to `RECOVERING` status.

---

## 3. Monotonicity Verification & Boundary Invariants

Automated sweeps executed in [`test_phase3_1_monotonicity.cjs`](file:///C:/Users/admin/.gemini/antigravity/scratch/financial-immune-system/tests/test_phase3_1_monotonicity.cjs) verify:

$$\frac{\partial M}{\partial \theta_{\text{stress}}} \le 0, \quad \frac{\partial M}{\partial \theta_{\text{rec}}} \ge 0$$

- **Strict Non-Increasing Property:** Adding distressed providers, cascade depth hops, infrastructure outages, or herding synchrony never increases $M(t)$.
- **Strict Non-Decreasing Property:** Adding recovering nodes or isolating compromised feeds never decreases $M(t)$.
- **Strict Clamping Invariance:** $M(t) \in [15, 96]$ is bounded without causing arithmetic disconnects between individual components and reported margin.

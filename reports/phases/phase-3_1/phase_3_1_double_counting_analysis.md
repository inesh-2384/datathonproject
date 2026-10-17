# FINANCIAL IMMUNE SYSTEM (FIS)
## PHASE 3.1 — DOUBLE-COUNTING ANALYSIS & CAUSAL ORTHOGONALITY REPORT
### RESEARCH FORMULATION & DECOMPOSITION SANITY

---

## 1. The Double-Counting Problem in Systemic Modeling

In naive multidimensional risk frameworks, multiple correlated symptoms of a single failure are frequently summed linearly:
> If an oracle crashes:
> - Penalize for the oracle crash.
> - Penalize for the chokepoints connected to the oracle.
> - Penalize for the high HHI of the oracle.
> - Penalize for the cascade depth from the oracle.
> - Penalize for the institutions receiving the oracle data.

If each term subtracts 20–30 points independently without causal orthogonalization, the metric easily subtracts >100 points, blowing past the available headroom budget and collapsing into an uninformative floor clamp ($M=15\%$).

---

## 2. Orthogonal Causal Partitioning

The Financial Immune System partitions the systemic degradation chain into **strictly orthogonal physical dimensions**:

| Dimension | Physical Meaning | What It Measures | What It Does NOT Measure |
| :--- | :--- | :--- | :--- |
| **Dependency Concentration** ($\Delta_{\text{dep}}$) | *Structural Exposure* | Vulnerability of network topology (single points of failure, HHI) | How far or fast contagion has transmitted |
| **Propagation Depth** ($\Delta_{\text{prop}}$) | *Dynamic Transmission* | Topological hops traveled through the graph | The root cause or origin type of the infection |
| **Infrastructure Stress** ($\Delta_{\text{infra}}$) | *Physical Rail Availability* | Settlement queue saturation and CCP processing timeouts | The cognitive state of the banks' trading models |
| **Decision Convergence** ($\Delta_{\text{herd}}$) | *Behavioral Synchronization* | Millisecond order alignment and correlation across models | Graph network edge latency |
| **Recovery Capacity** ($\Delta_{\text{rec}}$) | *Operational Buffer* | Verified containment rails, backup liquidity, and air-gaps | Baseline entity capitalization |

### 2.1 Decoupling Provider Compromise from Propagation Depth
- If `DATA-X` is compromised at Tick 0, **only** $\Delta_{\text{dep}}$ activates (1 provider penalty). Cascade depth is 1 hop, so $\Delta_{\text{prop}} = 0$.
- As the simulation ticks forward, contagion propagates into `BANK-A`, `BANK-B`, and `BANK-C` (Tick 2). $\Delta_{\text{dep}}$ does not multiply; rather, $\Delta_{\text{prop}}$ activates reflecting the multi-hop transmission.
- This clean separation allows the system to distinguish a localized source compromise from an active runaway cascade.

---

## 3. Headroom Budget Allocation

The available degradation range between pristine baseline ($91\%$) and absolute survival floor ($15\%$) is **76 points**. 

To prevent linear summation explosions, each dimension is assigned a calibrated ceiling that reflects its maximum possible independent contribution:

```
Total Degradation Headroom: 76 Points
├── Δ_dep (max: 32 pts)    -> Structural chokepoint exposure
├── Δ_prop (max: 25 pts)   -> Multi-hop cascade depth
├── Δ_infra (max: 35 pts)  -> Centralized settlement gridlock
└── Δ_herd (max: 35 pts)   -> Collective behavioral synchronization
(Offset by Δ_rec: max +15 pts operational recovery buffer)
```

### 3.1 Compound Failure Handling
Even under compound scenarios where multiple dimensions degrade simultaneously (e.g., Scenario A cascade combined with an infrastructure rail failure), the individual dimensions remain bounded. Clamping at the individual component level guarantees that:
1. No single dimension can monopolize or artificially exhaust the margin.
2. The additive identity $\sum \Delta_k \equiv M(t)$ holds identically without truncation gaps.
3. Sensitivity derivatives $\frac{\partial M}{\partial \theta_k}$ reflect real marginal impacts.

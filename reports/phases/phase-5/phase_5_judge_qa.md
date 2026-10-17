# FINANCIAL IMMUNE SYSTEM (FIS)
## PHASE 5 — HOSTILE JUDGE INTERROGATION PREPARATION (Q1 – Q20)
### Standard: Short, Precise, Mathematically Defensible, Non-Hyperbolic Answers

---

### Q1: What is actually novel here?
**Answer:**  
Existing financial platforms focus on *predicting risk* (how bad could losses become). FIS shifts the paradigm to *systemic controllability* (how much operational steering capacity remains to change that trajectory). Specifically novel are: (1) the additive mathematical decomposition of Control Margin $M$, (2) Effective Decision Diversity ($EDD$) penalizing common data and model correlation, and (3) an Independent Enclave Verifier that separates execution acknowledgments from outcome verification.

### Q2: Why isn't this just another risk dashboard?
**Answer:**  
Dashboards passively display metrics. FIS is an active, closed-loop governed control system: $\text{Event} \to \text{Dependency} \to \text{Controllability} \to \text{Counterfactual Candidate Selection} \to \text{Cryptographic Authorization} \to \text{Governed Execution} \to \text{Independent Telemetry Verification} \to \text{Automated Reassessment}$.

### Q3: Why is Control Margin necessary?
**Answer:**  
Because two institutions with identical Value-at-Risk can have drastically different survival trajectories. If one institution sits in an isolated bilateral loop, it can be stabilized with ordinary liquidity lines. If the other sits at the center of an interconnected oracle dependency with 15 seconds before clearing settlement cutoff, its controllability is near zero. Control Margin measures that steering runway.

### Q4: How is Control Margin calculated?
**Answer:**  
It is an exact additive decomposition: $M(t) = \text{clamp}(M_0 + \Delta_{\text{dep}} + \Delta_{\text{prop}} + \Delta_{\text{herd}} + \Delta_{\text{infra}} + \Delta_{\text{rec}} + \Delta_{\text{res}}, \, 0, \, 100)$. Baseline is $91.0$. Static chokepoint concentration, multi-hop propagation depth, and temporal decision synchrony subtract points; active containment bonuses add points. Every point delta is mapped to machine-readable contributor evidence.

### Q5: Why isn't risk enough?
**Answer:**  
Risk is a condition; controllability is an operational capacity. In our experiments, we proved Case 1 (High stress index $0.34$, but high control capacity $0.65$ and $79\text{s}$ window) remains stable in `CONTROL_RECOVERING`. Conversely, Case 2 (Moderate stress $0.48$, but rapidly compressing $15\text{s}$ window) collapses into `CONTROL_CRITICAL`. Conflating the two leads to premature regulatory panic in Case 1, and missed intervention windows in Case 2.

### Q6: What is Effective Decision Diversity (EDD)?
**Answer:**  
EDD is an experimental construct that measures real informational heterogeneity. It takes raw observed model diversity ($D_{\text{obs}}$) and subtracts penalties for shared upstream data feeds ($\Delta_{\text{data}}$), model weight correlation ($\Delta_{\text{model}}$), and temporal action synchrony ($\Delta_{\text{sync}}$). In our hero scenario, apparent diversity was $98\%$, but EDD collapsed to $15\%$ because all models consumed corrupted data from `DATA-X`.

### Q7: How do you know AI herding is occurring?
**Answer:**  
We do NOT assume AI automatically equals herding. We measure three distinct empirical conditions: (1) common input oracle exposure, (2) cross-model recommendation correlation $>0.75$, and (3) temporal synchrony clustering $>80\%$. Only when all three converge does the system penalize diversity.

### Q8: What if low diversity is legitimate coordination rather than systemic failure?
**Answer:**  
In Scenario J, we explicitly tested this. When central banks execute coordinated liquidity injection, EDD drops to $0.15$. However, because data feeds are cryptographically intact and clearing rails are within capacity, FIS classifies the event as `LEGITIMATE_COORDINATION` rather than declaring insolvency. Low diversity is treated as an explanatory variable, not an automatic crisis flag.

### Q9: What happens if your intervention fails?
**Answer:**  
We demonstrated this in Scenario C. When an intervention was executed technically (`status: EXECUTED`), but latent fire-sale contagion continued on synthetic asset `ASSET-17`, the Independent Enclave Verifier assigned `VERIFIED_FAILED` (`CONTROL_NOT_RESTORED`). This immediately triggered automated emergency reassessment, which generated an escalated model quarantine backstop candidate.

### Q10: How do you know the intervention actually worked?
**Answer:**  
We do not ask the executor. The Independent Enclave Verifier samples raw post-intervention graph telemetry, computes a SHA-256 digest, re-calculates the net control margin, and verifies that the observed effect matches the expected target within a discrepancy threshold $\Delta_{\text{disc}} \ge -2\text{ pts}$ with zero active residual threats.

### Q11: What makes your verifier independent?
**Answer:**  
The verifier runs in an isolated architectural context. It does not inspect the executor's return payload. It directly queries node health, queue saturation, and residual threat flags across the simulation topology. If downstream rails remain contaminated, it overrides the executor's success claim.

### Q12: Can your system be wrong?
**Answer:**  
Yes. That is why Tier B5 implements Epistemic Uncertainty Gating. The system continuously evaluates evidence sufficiency ($0.0–1.0$), observation gaps, and telemetry age. When evidence is incomplete or uncertainty is high, it flags `VERIFIED_UNCERTAIN` and blocks automated restoration verdicts.

### Q13: What happens with stale evidence?
**Answer:**  
If telemetry evidence age exceeds $60\text{ seconds}$, the verifier strictly refuses to grant `CONTROL_RESTORED`. It issues a `VERIFIED_UNCERTAIN` verdict with `evidence_freshness_status: STALE` and marks the system `CONTROL_UNVERIFIED`, forcing a telemetry heartbeat refresh.

### Q14: What happens with conflicting evidence?
**Answer:**  
If primary operational feeds disagree with independent audit logs, the verifier does not pick whichever is convenient. It raises an explicit `CONFLICTED` flag, marks the outcome `OUTCOME_CONFLICTED`, and mandates cross-oracle reconciliation.

### Q15: What happens if a simpler baseline performs equally well?
**Answer:**  
We tested this. Under an isolated, single-node shock with zero network cascade, FIS B5 reported a $0\text{ pt}$ advantage over simple risk threshold monitoring B1. FIS transparently acknowledges this baseline equivalence. The system’s measurable advantage emerges specifically in multi-hop interconnected cascading crises ($+57\text{ pts}$ lead sensitivity).

### Q16: What is real data and what is simulated?
**Answer:**  
To be completely transparent: all 20 institutions, 102 dependencies, and market feeds are synthetic, calibrated to Tier-1 G-SIB structural topologies and the competition reference specifications. There is no live real-world banking API connected. All synthetic states are deterministically reproducible via seed `42091`.

### Q17: What is actually running on IBM Z / LinuxONE?
**Answer:**  
Currently, the prototype runs locally in Node.js v24 / TypeScript on a Windows workstation as a development simulation. The architecture is designed for IBM LinuxONE Secure Execution enclaves, Crypto Express 8S HSMs, and on-chip Telum accelerators, but we are not claiming physical mainframe execution in this local build.

### Q18: What did you personally implement?
**Answer:**  
Everything in this codebase: the 20-node financial simulation engine, the Phase 3 Controllability Model, the additive decomposition algorithms, the Control Foundry candidate generator and counterfactual simulator, the Governed Execution Bus with server-side RBAC, the Independent Enclave Verifier, all 16 automated Phase 5 test suites, and the real-time React mission control UI.

### Q19: What would you change with another six months?
**Answer:**  
Three things: (1) Connect empirical market tick data (e.g., historical repo and SOFR market order books) to calibrate the PRNG parameters, (2) deploy containerized enclaves to a real physical IBM LinuxONE Community Cloud instance to benchmark hardware CPACF cryptographic signing throughput, and (3) integrate formal multi-agent reinforcement learning for continuous counterfactual candidate discovery.

### Q20: What is the biggest limitation of your research?
**Answer:**  
The parameter weights ($w_{\text{prop}} = 4.0$, $w_{\text{HHI}} = 6.0$, $w_{\text{EDD}} = 34.0$) are calibrated against simulated scenarios rather than empirical historical crisis datasets. While our sensitivity analysis proved the system is mathematically stable ($|\epsilon| \le 10.0$), real-world deployment would require empirical parameter estimation from regulatory stress test data (CCAR/DFAST).

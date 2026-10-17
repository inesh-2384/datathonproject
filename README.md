<div align="center">

# FINANCIAL IMMUNE SYSTEM
### Systemic Financial Resilience & Control Intelligence
**From Real-Time Signals → To Governed Control → To Verified Restoration**

[![Theme](https://img.shields.io/badge/Theme-Real--Time_AI_for_Critical_Decisions-8A2BE2.svg)](https://github.com/inesh-2384/datathonproject)
[![Target Substrate](https://img.shields.io/badge/Target_Substrate-IBM_Z_%2F_LinuxONE-054ADA.svg)](docs/architecture/system-architecture.md)
[![Release Status](https://img.shields.io/badge/Release-v2.4.0--frozen-blue.svg)](https://github.com/inesh-2384/datathonproject/releases/tag/v2.4.0-frozen)
[![Gate 3 Freeze](https://img.shields.io/badge/Gate_3_Validation-PASS_(98.5%2F100)-success.svg)](reports/gates/gate-3/gate_3_final_forensic_validation_report.md)
[![CI & Verification](https://github.com/inesh-2384/datathonproject/actions/workflows/ci.yml/badge.svg)](https://github.com/inesh-2384/datathonproject/actions/workflows/ci.yml)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)

---

### 🔗 **Live Prototype**: [https://financial-immune-system-d9vz.onrender.com](https://financial-immune-system-d9vz.onrender.com)
### 🎥 **Technical Demonstration**: [Watch on YouTube (Demo Video)](https://youtu.be/nhXzRiLlDXI)

*IBM Z Datathon 2026 · Real-Time AI for Critical Decisions · Financial AI / Systemic Control Intelligence*

---


## Overview

FIS extends real-time AI beyond isolated transaction decisions into systemic control intelligence—using live financial and operational signals to assess collective behaviour, remaining control, governed intervention, and verified recovery across interconnected financial ecosystems.

Modern financial networks link institutions through shared feeds and correlated models. Under stress, algorithms synchronize into herd runs, draining liquidity before perimeter tools alert. FIS operates as a supervisory control plane, maintaining network visibility and computing intervention headroom.

Crucially, FIS enforces that **Execution is an event; Recovery is a claim that requires evidence.** Technical dispatch does not establish crisis resolution. Restoration is attested solely when an **Independent Verifier** evaluates post-action empirical telemetry and seals a **Control Restoration Proof (CRP)**:

$$\text{RECOMMENDATION} \neq \text{AUTHORIZATION} \neq \text{EXECUTION} \neq \text{VERIFICATION} \neq \text{RECOVERY}$$

Demonstrated via a simulation prototype on Render Cloud, the architecture is engineered for **IBM Z and LinuxONE** enterprise mainframes—the trusted foundation for core banking ledgers, low-latency AI inference, confidential computing, and continuous governance.

## The Real-World Problem

Traditional risk management asks: *"What is my balance-sheet exposure?"* In hyper-connected networks, that question comes too late. Systemic fragility arises from structural coupling across shared dependencies:
- **Shared Oracles:** Common market feeds (`DATA-X`).
- **Correlated AI Models:** Similar algorithmic strategies (`VOL-ARB`, `MOM-MKT`).
- **Concentrated Rails:** Shared cloud compute, clearing chokepoints, and payment rails.
- **Machine-Speed Feedback:** Algorithmic liquidations cascading across counterparties.

```
Shared Oracles (DATA-X) ──► Correlated Models (VOL-ARB & MOM-MKT)
                                          │
                                          ▼
Liquidity Collapse (M(t) Falls) ◄── Algorithmic Herd Run (S(t) ↑, EDD(t) ↓)
```

A minor feed disturbance triggers widespread liquidations. Three questions arise:
1. *Has the network lost enough control that local decisions are no longer independent?*
2. *What intervention restores control, and who holds authority to approve it?*
3. *Did the action execute—and did it actually restore control?*

## Why Existing Systems Are Not Enough

Existing platforms provide fraud detection, market surveillance, and model monitoring, answering perimeter-bound questions: *"Is this transaction suspicious?"*, *"Is this model drifting?"*, *"Is this firm exposed?"*

FIS addresses the cross-system question: **How are these signals coupled, how will stress cascade, how much effective control remains, what intervention restores stability, and how is recovery independently proven?**

The gap is not telemetry, but the absence of an authoritative operational state connecting:

$$\text{EVENT} \to \text{EVIDENCE} \to \text{DEPENDENCY} \to \text{COLLECTIVE BEHAVIOUR} \to \text{PROPAGATION} \to \text{CONTROL}$$
$$\to \text{INTERVENTION} \to \text{AUTHORIZATION} \to \text{EXECUTION} \to \text{VERIFICATION} \to \text{OUTCOME} \to \text{REASSESSMENT}$$

## What FIS Does

FIS operates **above** individual financial institutions as a supervisory control plane, maintaining:

$$\mathbf{ONE\ INCIDENT} \quad\bullet\quad \mathbf{ONE\ OPERATIONAL\ STATE} \quad\bullet\quad \mathbf{ONE\ EVIDENCE\ CHAIN} \quad\bullet\quad \mathbf{ONE\ GOVERNED\ ACTION\ HISTORY} \quad\bullet\quad \mathbf{ONE\ VERIFICATION\ STATE}$$

### Operational Scope (What FIS Is NOT)
FIS is explicitly **not** a fraud engine, transaction firewall, automated execution algorithm, high-frequency arbitrage platform, market price predictor, portfolio optimization tool, or retail banking interface. It does not replace banks or clearinghouses; it provides systemic control intelligence to evaluate whether the ecosystem remains controllable under stress.

## Core Control Loop

FIS executes a governed closed-loop control lifecycle:

```mermaid
flowchart LR
    Sense["1. SENSE"] --> Understand["2. UNDERSTAND"]
    Understand --> Propagate["3. PROPAGATE"]
    Propagate --> Assess["4. ASSESS CONTROL"]
    Assess --> Intervene["5. INTERVENE"]
    Intervene --> Authorize["6. AUTHORIZE"]
    Authorize --> Execute["7. EXECUTE"]
    Execute --> Verify["8. VERIFY"]
    Verify -->|CONTROL_NOT_RESTORED| Reassess["9. REASSESS"]
    Reassess --> Authorize
    Verify -->|VERIFIED_RESTORATION| Stable["STABLE"]
```

- **1. SENSE:** Ingest queues, obligations, and telemetry into evidence ledger.
- **2. UNDERSTAND:** Map structural dependencies across network topology.
- **3. PROPAGATE:** Traverse cascade pathways across institutions.
- **4. ASSESS CONTROL:** Quantify intervention headroom (**Control Margin $M(t)$**).
- **5. INTERVENE:** Synthesize backstops under **Minimum Effective Intervention (MEI)**.
- **6. AUTHORIZE:** Dual-key human commander authorization.
- **7. EXECUTE:** Dispatch interventions via governed gateways.
- **8. VERIFY:** Independent post-action telemetry evaluation.
- **9. REASSESS:** Evaluate residual hazards and trigger secondary backstops.

> [!IMPORTANT]
> **Human-in-the-Loop Governance:** AI proposes candidates, but **never** authorizes interventions or declares recovery. Humans authorize all transitions via cryptographic dual-key signatures.

## Flagship Stress Environment

Algorithmic trading is **not** the business domain of FIS; it serves as the **flagship machine-speed stress environment** demonstrating systemic coupling.

When institutions deploy algorithmic models (`VOL-ARB-AI`, `MOM-MKT-AI`) dependent on a shared oracle (`DATA-X`), upstream feed degradation causes independent optimization routines to synchronize into identical risk-off liquidations. Individually rational micro-decisions produce catastrophic cascades. FIS detects this latent synchronization before market liquidity collapses.

## Core Intelligence Domains

1. **Real-Time Threat Assessment:** Ingests live telemetry, queues, and obligations into an evidence-linked ledger to detect emerging anomalies.
2. **Collective Decision Intelligence:** Quantifies algorithmic synchrony and herd behavior across institutions via Decision Synchrony $S(t)$ and Effective Decision Diversity $EDD(t)$ (*experimental indicators*).
3. **Propagation Intelligence:** Traverses multi-hop contagion pathways across credit lines, behavioral feedback, and fire-sale liquidations.
4. **Control Margin Assessment:** Evaluates remaining supervisor intervention capacity $M(t)$ before systemic controllability collapses.
5. **Governed Intervention (Control Foundry):** Synthesizes candidate stabilizers under Minimum Effective Intervention (MEI) requiring dual-key human authorization.
6. **Verified Restoration:** Evaluates post-action empirical telemetry via an Independent Verifier to mathematically attest whether control was restored.

## Execution ≠ Recovery

The foundational engineering invariant of the Financial Immune System is:

# EXECUTION ≠ RECOVERY

$$\text{RECOMMENDATION} \neq \text{AUTHORIZATION} \neq \text{EXECUTION} \neq \text{VERIFICATION} \neq \text{RECOVERY}$$

An HTTP 200 response proves gateway dispatch. It does **not** prove that systemic control was restored.

In financial networks, an action can dispatch cleanly while contagion continues along secondary pathways, model drift persists, or queues remain locked. Treating execution as recovery creates false confidence. Recovery is an empirical claim demanding post-action evidence.

## Control Restoration Proof

> *"Execution is an event. Recovery is a claim that requires evidence."*

The **Control Restoration Proof (CRP)** closes the control loop:

$$\text{EXPECTED OUTCOME} \to \text{AUTHORIZED ACTION} \to \text{EXECUTION} \to \text{INDEPENDENT OBSERVATION} \to \text{COMPARISON} \to \text{RECOVERY / NON-RECOVERY} \to \text{REASSESSMENT}$$

When an action fails to restore stability, the Independent Verifier records **`CONTROL_NOT_RESTORED`** and triggers reassessment. Only post-action empirical evidence attests **`VERIFIED_RESTORATION`**.

### Formal Outcome Semantics
- `EVENT_OBSERVED` / `NON_EVENT_OBSERVED`: Empirical signal verified vs expected breakdown absent.
- `INTERVENTION_CONDITIONED_NON_EVENT`: Cascade averted by governed intervention.
- `OBSERVATION_GAP` / `UNRESOLVED`: Telemetry absent, delayed, or inconclusive.
- `RESIDUAL_HAZARD` / `CONFLICTED`: Secondary contagion active or feeds contradictory.

### Dynamic Control Seal™
The **Dynamic Control Seal™** is an evidence and control-integrity mechanism. It cryptographically binds evolving system states, incident context, dual-key human authorizations, execution gateway receipts, and independent verification proofs into an unbroken, auditable SHA-256 evidence chain across the crisis lifecycle.

## AI / Machine Learning Capabilities

FIS replaces opaque black-box assertions with an interpretable, evidence-linked decision-support pipeline:

- **Feature Construction & Real-Time Telemetry:** Ingests live order queue depths, latency variances ($\Delta t$), counterparty settlement exposures, and price divergence across institutions.
- **Collective Decision Intelligence ($S(t)$ & $EDD(t)$):** Implements an interpretable baseline evaluating cross-agent correlation matrices to detect when independent trading agents synchronize into lockstep liquidations before market-wide liquidity evaporates.
- **Topological Contagion Graph:** Graph traversal algorithms model multi-hop credit propagation and fire-sale exposure paths across counterparties.
- **Control Margin Formulation ($M(t)$):** Operational indicator synthesizing remaining capital, liquidity headroom, and systemic coupling into a continuous metric:
  $$M(t) = \max\left(0, \min\left(100, \left(1.0 - \text{Coupling}(t)\right) \times \frac{\text{Liquidity}(t)}{\text{TotalObligations}(t)} \times 100\right)\right)$$
- **Evidence Lineage & Downstream Decision Support:** Every model assessment outputs explanatory drivers, confidence bounds, and causal dependency graphs, feeding candidate interventions into the Control Foundry while preserving strict human-in-the-loop governance.

> [!NOTE]
> **Implementation Status:** Current prototype ML logic operates as an interpretable real-time algorithmic assessment baseline within the simulation engine. Target production realization integrates deep foundation models and on-chip matrix acceleration on IBM Telum II processors with continuous governance via watsonx.governance.

## Architecture

The FIS architecture connects real-time financial events, enterprise computing, systemic control intelligence, and independent verification:

```mermaid
graph TD
    Mkt["Interconnected Financial Ecosystem"] --> Fabric["IBM Event / Data Fabric (Confluent & Data Gate)"]
    Fabric --> ControlPlane["FIS Systemic Control Plane (6 Domains)"]
    ControlPlane --> Governance["Governance & Dual-Key Authorization"]
    Governance --> Exec["Governed Execution Gateway"]
    Exec --> Foundation["IBM Z / LinuxONE Foundation (Target Architecture)"]
    Foundation --> Core["Core Banking & Settlement Rails"]
    Core --> Verifier["Independent Verifier (Post-Action Telemetry)"]
    Verifier -->|CONTROL_NOT_RESTORED| ControlPlane
    Verifier -->|VERIFIED_RESTORATION| Mkt
```

### Architectural Causal Chain
$$\text{REAL-TIME FINANCIAL EVENTS} \longrightarrow \text{IBM ENTERPRISE DATA FABRIC} \longrightarrow \text{FIS SYSTEMIC CONTEXT}$$
$$\longrightarrow \text{AI/ML INFERENCE} \longrightarrow \text{GOVERNED DECISION} \longrightarrow \text{HUMAN AUTHORIZATION}$$
$$\longrightarrow \text{AUTHORIZED ACTION} \longrightarrow \text{TRUSTED EXECUTION} \longrightarrow \text{INDEPENDENT VERIFICATION} \longrightarrow \text{CONTINUOUS ASSURANCE}$$

## Security & Governance

FIS enforces regulatory governance principles aligned with BCBS 239 and DORA Article 14:
- **Separation of Duties (SoD):** Models propose; commanders sign; operators dispatch. No single entity can unilaterally act.
- **Dual-Key RBAC:** Signatures bind actions to authenticated roles (`INCIDENT_COMMANDER` or `SYSTEM_OPERATOR`).
- **Deterministic Replay:** PRNG seeding (Mulberry32, Seed `42091`) guarantees bit-for-bit repeatability.
- **Tamper-Evident Ledger:** Every telemetry sample, authorization seal, and verification proof is hashed into a SHA-256 chain.

### Core Governance Invariants
- **Risk ≠ Confidence**: Measured risk does not imply certainty.
- **Hazard ≠ Priority**: Severity does not set priority without authority.
- **Recommendation ≠ Authorization**: Models propose; humans sign.
- **Authorization ≠ Execution**: Policy approval is separate from dispatch.
- **Execution ≠ Recovery**: Dispatch is an event; recovery requires evidence.
- **Observation ≠ Interpretation**: Sensory facts differ from projections.
- **Non-event ≠ False Alarm**: Averted collapse is an intended non-event.
- **No observation ≠ No event**: Sensor silence signifies uncertainty.

## Why IBM Z / LinuxONE

Systemic financial intelligence requires enterprise-grade mainframe computing:

1. **Co-Location with Core Ledgers:** Global transactions and RTGS rails run on IBM Z. Hosting control intelligence adjacent to core ledgers eliminates latency and exposure during panics.
2. **Low-Latency Enterprise AI:** During liquidity runs, milliseconds matter. IBM Telum II provides on-chip AI acceleration directly alongside cores for in-transaction inference.
3. **Confidential Multi-Tenant Computing:** Assessing cross-firm risk requires privacy. IBM Secure Execution for Linux provides hardware memory isolation without exposing trading books.
4. **Hardware Cryptography & Continuous Assurance:** Sealing evidence ledgers requires CPACF and Crypto Express 8S silicon cryptography, paired with watsonx.governance.

$$\mathbf{IBM\ FOUNDATION} + \mathbf{FIS\ CONTROL\ INTELLIGENCE} = \mathbf{A\ COHERENT\ SYSTEMIC\ CONTROL\ ARCHITECTURE}$$

## IBM Direction & Architectural Alignment

FIS was independently formulated around the enterprise requirements increasingly vital to mission-critical financial AI: real-time streaming, contextual awareness, AI-assisted reasoning, governed intervention, trusted execution, and independent verification. The architecture aligns naturally with IBM's enterprise roadmap for financial infrastructure:

| Capability | Component | Target Role |
| :--- | :--- | :--- |
| **Event Fabric** | **[IBM Confluent](https://www.ibm.com/products/event-automation) & [Data Gate](https://www.ibm.com/products/data-gate)** | Ingests z/OS transaction streams. |
| **Low-Latency AI** | **[IBM z17 / Telum II](https://newsroom.ibm.com/2024-08-26-IBM-Unveils-Telum-II-Processor-and-Spyre-Accelerator-at-Hot-Chips-2024)** | On-chip real-time risk scoring. |
| **AI Assurance** | **[IBM watsonx.governance](https://www.ibm.com/products/watsonx-governance)** | Model monitoring and guardrails. |
| **Operational Control** | **[IBM Concert](https://www.ibm.com/products/concert)** | Contextualizes risk in IT operations. |
| **Trusted Platform** | **[IBM LinuxONE / s390x](https://www.ibm.com/products/linuxone-4)** | Mainframe substrate for control plane. |
| **Confidentiality** | **[IBM Secure Execution](https://www.ibm.com/docs/en/linux-on-systems?topic=security-secure-execution-linux)** | Hardware enclaves for multi-firm risk. |
| **Hardware Crypto** | **CPACF & [Crypto Express 8S](https://www.ibm.com/products/z16)** | Silicon cryptographic CRP signing. |

## Current Implementation vs Target Architecture

FIS strictly differentiates its verified demonstration prototype from its target production realization:

| Verified Prototype (Today) | Target Production Realization |
| :--- | :--- |
| **FIS Systemic Control Workflow** | Mainframe-native z/OS integration |
| **Deterministic Simulation (Seed 42091)** | Live enterprise financial event streams |
| **Independent Verification & CRP Contract** | Telemetry via IBM Data Gate & Confluent |
| **Software Dynamic Control Seal™** | Hardware crypto (CPACF & Crypto Express 8S) |
| **Dual-Key RBAC Governance** | Enterprise AI governance (watsonx & Concert) |
| **Persistent Cloud Service (Render)** | Containerized OpenShift on LinuxONE (s390x) |

> *FIS is demonstrated today via a deterministic software simulation prototype. The production architecture is engineered for IBM Z and LinuxONE, co-locating systemic control intelligence with core financial ledgers.*

## Prototype Proof

The prototype deterministically demonstrates the closed-loop crisis lifecycle under PRNG **Seed `42091`**:

| Stage | Observed State | Systemic Verdict |
| :--- | :--- | :--- |
| **Baseline** | $M(t) = 91\%$, $S(t) = 0.12$ | **STABLE** |
| **Shock** | `DATA-X` +52ms latency disturbance | Threat Emerging |
| **Coupling** | $S(t) = 0.73$, $EDD = 0.15$ | Correlated Herd Run |
| **Collapse** | $M(t) = 34\%$ (< 35% threshold) | Incident `RN-2026-0041` |
| **First Action** | `INT-01` dispatched (14ms) | **EXECUTED_UNVERIFIED** |
| **Verification 1** | Observed $M(t) = 42\%$ (< 65% target) | **`CRP: CONTROL_NOT_RESTORED`** (`PATH-MODEL-C`) |
| **Action 2** | `INT-02` dispatched | Secondary Backstop Dispatched |
| **Verification 2** | $M(t) = 84.2\%$, $S(t) = 0.14$, $EDD = 0.85$ | **`CRP: VERIFIED_RESTORATION`** |
| **Final State** | Closed-loop recovery complete | **STABLE** |

## Engineering Validation

The codebase passed three forensic gates: Gate 1 (PASS), Gate 2 (PASS, 97.95/100, Grade A+), and Gate 3 (PASS, 98.5/100).

### Automated Validation Summary

| Suite | Target | Result / Scope |
| :--- | :--- | :--- |
| **Production Build** | `npm run build` | **PASS** (1632 modules transformed) |
| **CRP Contract** | [`test_crp_contract.cjs`](tests/test_crp_contract.cjs) | **PASS** (43 / 43 contract assertions) |
| **Phase 4 Closed-Loop** | [`test_phase4_closed_loop_master.cjs`](tests/test_phase4_closed_loop_master.cjs) | **PASS** (23 / 23 operational steps) |
| **Phase 5 Master Assurance** | [`run_all_phase5_tests.cjs`](tests/run_all_phase5_tests.cjs) | **PASS** (16 / 16 test suites) |
| **Living System Integration** | [`test_phase2_living_system.cjs`](tests/integration/test_phase2_living_system.cjs) | **PASS** (45 / 45 criteria checks) |
| **Cloud REST API** | [`testCloudClosedLoopAPI.cjs`](scripts/validation/testCloudClosedLoopAPI.cjs) | **PASS** (21 / 21 cloud API steps) |
| **Headless Chrome Replay** | [`testCloudRenderHeroFlow.cjs`](scripts/validation/testCloudRenderHeroFlow.cjs) | **PASS** (12 / 12 steps, 0 browser errors) |

## Run the Prototype

### Live Prototype
The frozen prototype is cloud-hosted with zero local dependencies:
- **Demonstration URL:** [https://financial-immune-system-d9vz.onrender.com](https://financial-immune-system-d9vz.onrender.com)
- **Health Endpoint:** [`https://financial-immune-system-d9vz.onrender.com/health`](https://financial-immune-system-d9vz.onrender.com/health)

### 60-Second Demonstration Walkthrough
1. **Initialize:** Open URL $\to$ **ENTER CONTROL ENVIRONMENT** $\to$ **INITIALIZE CONTROL CORE** ($M(t) = 91\%$).
2. **Inject Shock:** Header $\to$ **Inject Shock**; Incident `RN-2026-0041` opens ($M(t) = 34\%$).
3. **Inspect Foundry:** Review Candidate `INT-01` in workspace (08).
4. **Authorize:** Switch role to `INCIDENT_COMMANDER` $\to$ click **AUTHORIZE**.
5. **Execute:** Switch role to `SYSTEM_OPERATOR` $\to$ click **EXECUTE** (HTTP 200).
6. **Observe State:** Enters `EXECUTED_UNVERIFIED` (dispatch is not recovery).
7. **Verify & Reject:** Verifier (10) attests **`CRP: CONTROL_NOT_RESTORED`** ($M(t) = 42\%$).
8. **Reassess & Authorize:** Workspace (11) $\to$ authorize Candidate `INT-02` as `INCIDENT_COMMANDER`.
9. **Execute Backstop:** Dispatch Candidate `INT-02` as `SYSTEM_OPERATOR`.
10. **Verified Restoration:** Verifier (10) confirms **`CRP: VERIFIED_RESTORATION`** ($M(t) = 84.2\%$) $\to$ **STABLE**.

### Local Setup

```bash
git clone https://github.com/inesh-2384/datathonproject.git
cd datathonproject
npm install
npm run dev

# Verification suites
npm run build
node tests/test_crp_contract.cjs
node tests/test_phase4_closed_loop_master.cjs
node tests/run_all_phase5_tests.cjs
```

## Repository Structure

```
financial-immune-system/
├── .github/workflows/ci.yml       # CI workflow
├── docs/                          # Architecture & governance specs
├── reports/                       # 85 forensic validation reports
├── scripts/                       # Cloud validation & replay suites
├── server/                        # Backend Control Plane & API
├── shared/                        # Domain contracts & schemas
├── src/                           # Frontend React 18 cockpit
├── tests/                         # Master assurance suites
├── render.yaml                    # Cloud deployment manifest
├── package.json                   # Manifest & dependencies
├── LICENSE                        # Apache 2.0 license
└── README.md                      # System documentation
```

## Production Realization

The evolution from software prototype to enterprise production follows four architectural horizons:

- **Horizon 1 (Prototype Demonstration):** Deterministic simulation (Seed `42091`) on Render Cloud / Node.js with independent verification and SHA-256 hashing.
- **Horizon 2 (Mainframe OS & Data Fabric):** OpenShift on LinuxONE (s390x), ingesting live transactions via IBM Data Gate & Confluent from z/OS.
- **Horizon 3 (Hardware Acceleration & Enclaves):** In-transaction AI via Telum II, hardware signing via CPACF/Crypto Express 8S, and enclaves via IBM Secure Execution.
- **Horizon 4 (Enterprise Control & Assurance):** Continuous AI governance via watsonx.governance and automated multi-institution playbooks via IBM Concert.

$$\mathbf{FROM\ PROTOTYPE} \longrightarrow \mathbf{TO\ PRODUCTION\text{-}GRADE\ SYSTEMIC\ CONTROL}$$

## Impact

FIS establishes a new paradigm for systemic financial resilience:

$$\text{SYSTEMIC VISIBILITY} \longrightarrow \text{DEPENDENCY AWARENESS} \longrightarrow \text{COLLECTIVE DECISION INTELLIGENCE}$$
$$\longrightarrow \text{PROPAGATION AWARENESS} \longrightarrow \text{CONTROL ASSESSMENT} \longrightarrow \text{GOVERNED INTERVENTION}$$
$$\longrightarrow \text{INDEPENDENT VERIFICATION} \longrightarrow \text{CONTINUOUS REASSESSMENT}$$

By transforming financial operations from perimeter alerting into closed-loop control intelligence, FIS provides institutions and supervisors with empirical evidence to know whether systemic control remains.


## License & Acknowledgements

Licensed under the [Apache License, Version 2.0](LICENSE).

Developed for the **IBM Z Datathon 2026** (Theme: **Real-Time AI for Critical Decisions**). Special recognition to the IBM Z, LinuxONE, and open-source communities advancing verified computing.

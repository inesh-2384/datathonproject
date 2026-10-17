# Financial Immune System (FIS)
## Phase 2 — Living System Architecture Specification
### Enterprise Control Platform for AI-Enabled Financial Ecosystems

---

## 1. Executive Architectural Overview

The **Phase 2 Living System** establishes the foundational cybernetic core of the Financial Immune System (FIS). Where Phase 1 established the design system, product shell, and workspace topology, Phase 2 transforms the 16 operational workspaces from isolated visual displays into **reactive windows looking into the same authoritative living ecosystem**.

### The Living System Axiom
$$\text{USER ACTION} \longrightarrow \text{REAL OPERATION} \longrightarrow \text{AUTHORITATIVE STATE MUTATION} \longrightarrow \text{EVENT EMISSION} \longrightarrow \text{GRAPH PROPAGATION} \longrightarrow \text{CROSS-VIEW REFLECTION} \longrightarrow \text{NEXT ACTION}$$

The user interface does not maintain its own speculative financial reality. **The UI is a deterministic projection of the authoritative backend enclave state.**

```mermaid
flowchart TD
    subgraph UI_Surface ["Operational Projections (Client: Port 3000)"]
        CC["Control Center (02)"]
        ED["Event Detection (03)"]
        SM["System Map (04)"]
        GL["3D Financial Globe (12)"]
        PR["Propagation Engine (06)"]
        CM["Control Margin Surface (07)"]
        EI["Entity Inspector (04/06)"]
        OC["Operational Context Bar"]
    end

    subgraph Reactive_Transport ["Deterministic Sync (SSE / REST)"]
        SSE["/api/events/stream (SSE)"]
        REST["REST API Router (/api/*)"]
        Store["Zustand Central Store (useSystemStore)"]
    end

    subgraph Enclave_Core ["Authoritative Control Enclave (Port 3001)"]
        SimEng["Deterministic Simulation Engine"]
        PropEng["Dynamic Graph Traversal Engine"]
        OpMgr["Operation Lifecycle Manager"]
        ReplayEng["Cryptographic Replay Buffer"]
        StateStore["Authoritative State Store (JSON / In-Memory)"]
    end

    CC & ED & SM & GL & PR & CM & EI -->|User Action| REST
    REST -->|Begin Operation| OpMgr
    OpMgr -->|Mutate| SimEng
    SimEng -->|Traverse Edges| PropEng
    PropEng -->|Derive M(t)| SimEng
    SimEng -->|Commit Delta| StateStore
    SimEng -->|Record Hash| ReplayEng
    StateStore -->|SSE Broadcast| SSE
    SSE -->|Synchronize| Store
    Store -->|Reactive Selectors| CC & ED & SM & GL & PR & CM & EI & OC
```

---

## 2. Architectural Invariants

| Invariant ID | Principle | Implementation Guarantee | Truth Status |
| :--- | :--- | :--- | :--- |
| **INV-01** | **Single Source of Truth** | A single authoritative state object in `server/src/simulation/engine.ts` owns all entity states, incident dossiers, and control metrics. | `IMPLEMENTED` |
| **INV-02** | **One Incident Truth** | Incident `RN-2026-0041` maintains identical identity, declared timestamp, root cause, and containment window across all 16 workspaces. | `IMPLEMENTED` |
| **INV-03** | **No Hardcoded Cascades** | Propagation emerges dynamically from graph edge traversal (`source_id` $\rightarrow$ `target_id`) in `server/src/simulation/propagation.ts`. | `DERIVED` |
| **INV-04** | **Explicit Operation Lifecycle** | All meaningful operations transition through `IDLE` $\rightarrow$ `QUEUED` $\rightarrow$ `RUNNING` $\rightarrow$ `PROCESSING` $\rightarrow$ `COMPLETED` / `FAILED` / `REASSESSMENT_REQUIRED`. | `IMPLEMENTED` |
| **INV-05** | **Deterministic Reproducibility** | Mulberry32 seedable 32-bit PRNG guarantees identical state hashes across runs with the same seed and input sequence. | `CALIBRATED` |
| **INV-06** | **Semantic Equivalence** | 3D Globe, System Map, Control Center, and Entity Inspector reflect identical status tokens (`COMPROMISED`, `DEGRADING`, `STABLE`). | `IMPLEMENTED` |
| **INV-07** | **State-Driven Guidance** | `OperationalContextBar` next action transitions strictly according to system state lifecycle, never static routing loops. | `IMPLEMENTED` |
| **INV-08** | **RBAC Enforcement** | The backend enclave strictly validates role capabilities before executing interventions (`OBSERVER` rejected with HTTP 403). | `IMPLEMENTED` |

---

## 3. Subsystem Breakdown

### 3.1 Authoritative Enclave Engine (`server/src/simulation/engine.ts`)
The engine holds the canonical state of 8 Tier-1 institutions, 12 systemic dependency channels, 2 market data oracles, 2 clearing infrastructures, 4 AI models, and 4 assets. It governs the simulation clock, evaluates stage transitions, and emits authoritative events.

### 3.2 Dynamic Graph Traversal Engine (`server/src/simulation/propagation.ts`)
Implements breadth-first dependency graph traversal (`propagateGraphContagion`) and real-time metric derivation (`computeSystemicGraphMetrics`). Calculates:
- **Control Margin $M(t)$**: Dynamically evaluated as a composite function of institution capital/liquidity ratios, dependency health, chokepoint saturation, and cascade depth.
- **Causal Provenance (`traceEntityCausality`)**: Traces reverse hops from any selected entity back to the root failure origin.

### 3.3 Operation Lifecycle Manager (`server/src/simulation/operations.ts`)
Monitors and regulates all systemic mutations. Provides:
- Idempotency and duplicate action rejection (HTTP 409 Conflict).
- Observable telemetry (`operation_id`, `tick`, `source_entity_id`, `affected_entity_ids`, `duration_ms`).
- Direct SSE broadcast (`OPERATION_LIFECYCLE`) for front-end progress reflection.

### 3.4 Real-Time Transport Subsystem (`server/src/routes/stream.ts` & `src/services/stream.ts`)
Maintains an unbroken Server-Sent Events (SSE) connection between the backend enclave and browser client:
- Emits initial `HANDSHAKE` with complete state snapshot on connection.
- Dispatches `TICK` and `OPERATION_LIFECYCLE` packets.
- Emits regular 3-second `HEARTBEAT` packets with latency calibration.
- Automatically reconnects with exponential backoff if the transport is degraded.

---

## 4. Truth Classification Framework

| Classification | Meaning in Phase 2 | Phase 2 Implementations |
| :--- | :--- | :--- |
| **`IMPLEMENTED`** | Genuinely executed software logic with verified unit/acceptance tests. | REST APIs, SSE stream, operation lifecycle, Zustand store, role checks, view routing. |
| **`DERIVED`** | Mathematically calculated from authoritative state graph variables. | Dynamic Control Margin $M(t)$, chokepoint saturation score, causal provenance trace. |
| **`SIMULATED`** | Algorithmic representation of financial networks rather than real DTCC/Fedwire feeds. | Balance sheet metrics (LCR, CAR), oracle prices, clearing transaction queue depths. |
| **`CALIBRATED`** | Tuned deterministic values matching Datathon reference operational scenarios. | Mulberry32 seed 42091, reference baseline $M(0)=91\%$, attack floor $M(2)=34\%$. |
| **`EXPERIMENTAL`** | Validated model behavior subject to formal research refinement in Phase 3. | AI herding synchrony index, diversity collapse threshold. |
| **`ARCHITECTED`** | Production hardware mapping formally designed for IBM Z/LinuxONE. | IBM Telum AI on-chip acceleration, CPACF cryptographic envelopes, z/OS SMF audit rails. |

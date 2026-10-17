# Independent Verification & Control Restoration Proof (CRP)
## Financial Immune System (FIS)

### Architectural Invariant: Observational Independence
The Independent Enclave Verifier (`IndependentVerifier`) operates with complete observational purity:
- It maintains zero write-privileges to simulation state, interbank topology, or user RBAC.
- It evaluates post-action telemetry independently of whether the intervention gateway returned HTTP 200 OK.
- It will not attest recovery if telemetry is stale, conflicting, or reveals residual critical contagion paths.

---

## 1. Control Restoration Proof (CRP) Formal Schema

Every verification cycle produces a cryptographically bound `RestorationAssessment`:

```typescript
export interface RestorationAssessment {
  proof_id: string;                      // e.g. "CRP-RN-2026-0041-A8F9B2"
  timestamp: string;                    // ISO-8601 UTC timestamp
  incident_id: string;                  // Active incident reference
  executed_action_id: string;           // Dispatched candidate ID
  
  // Verification Verdict
  restoration_state: 
    | 'VERIFIED_RESTORATION'            // Control Margin restored >= 65%, zero residual paths
    | 'CONTROL_NOT_RESTORED'            // Residual critical paths remain or margin < 65%
    | 'PARTIALLY_RESTORED'              // Measurable progress, but full criteria unmet
    | 'RESTORATION_UNRESOLVED';         // Telemetry stale, conflicting, or unverified
    
  qualitative_attribution:
    | 'SUPPORTED'                       // Causal link between action and recovery confirmed
    | 'PLAUSIBLE'                       // Likely causal, but potential confounding factors
    | 'UNRESOLVED';                     // Cannot attribute recovery to intervention
    
  observed_control_margin: number;      // Actual telemetric M(t)
  expected_control_margin: number;      // Modeled M(t) prediction
  margin_discrepancy: number;           // observed - expected
  
  residual_critical_paths: Array<{
    path_id: string;
    description: string;
    severity: 'HIGH' | 'CRITICAL';
  }>;
  
  evidence_freshness: 'FRESH' | 'STALE' | 'DEGRADED';
  cryptographic_seal: string;           // SHA-256 tamper-evident digest
}
```

---

## 2. Mandatory Verification Invariants

1. **Execution Failure Invariant:** If technical execution fails (`status = EXECUTION_FAILED`), the verifier produces zero restoration assessment.
2. **Latent Contagion Detection:** If a secondary contagion vector remains unquarantined (e.g. `PATH-MODEL-C`), verdict is strictly `CONTROL_NOT_RESTORED` and reassessment is mandated.
3. **Evidence Staleness Block:** If evidence timestamps lag telemetry by $> 1000\text{ms}$, verdict drops to `RESTORATION_UNRESOLVED`.
4. **Conflicted Telemetry Block:** If redundant sensor streams disagree beyond tolerance $\epsilon$, verdict drops to `RESTORATION_UNRESOLVED`.

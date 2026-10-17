# Governance & Separation of Duties (SoD) Specification
## Financial Immune System (FIS)

### Principle of Dual-Key Governance
In mission-critical systemic control systems, no single operator or automated routine possesses the unilateral authority to formulate, authorize, and execute systemic market interventions.

---

## 1. Role-Based Access Control (RBAC) Matrix

| Role | Formulate Action | Dual-Key Authorize | Governed Execution | Inspect Proofs |
| :--- | :---: | :---: | :---: | :---: |
| **OBSERVER** | ❌ | ❌ | ❌ | ✅ |
| **SYSTEM_OPERATOR** | ✅ | ❌ | ✅ | ✅ |
| **INCIDENT_COMMANDER** | ✅ | ✅ | ❌ | ✅ |
| **RISK_OFFICER** | ✅ | ✅ | ❌ | ✅ |
| **COMPLIANCE_OFFICER** | ❌ | ✅ | ❌ | ✅ |

---

## 2. Separation of Duties Enclave Enforcement

The backend `ControlFoundryManager` and `GovernedExecutionBus` strictly enforce policy boundaries:

1. **Authorization Authority:**
   Only users holding `INCIDENT_COMMANDER`, `RISK_OFFICER`, or `COMPLIANCE_OFFICER` roles may sign an action authorization contract:
   ```typescript
   if (!['INCIDENT_COMMANDER', 'RISK_OFFICER', 'COMPLIANCE_OFFICER'].includes(caller.role)) {
     throw new AuthorizationError('Separation of Duties: Caller lacks authorization credentials');
   }
   ```

2. **Self-Authorization Prevention:**
   The operator who requested an intervention cannot authorize it:
   ```typescript
   if (candidate.requested_by === caller.user_id) {
     throw new PolicyViolationError('Separation of Duties prevents requester from authorizing own candidate');
   }
   ```

3. **Execution Privilege:**
   Only `SYSTEM_OPERATOR` may trigger physical dispatch through the execution gateway, and only after verifying a valid authorization seal:
   ```typescript
   if (caller.role !== 'SYSTEM_OPERATOR') {
     throw new PermissionError('Execution requires SYSTEM_OPERATOR credentials');
   }
   if (candidate.lifecycle_state !== 'AUTHORIZED') {
     throw new ExecutionError('Candidate must be in AUTHORIZED state prior to gateway dispatch');
   }
   ```

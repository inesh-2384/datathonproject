# FINANCIAL IMMUNE SYSTEM (FIS)
## BASELINE REPOSITORY STRUCTURE AUDIT REPORT (PRE-REFACTOR)
**Date:** 2026-10-16  
**Objective:** Record the forensic baseline state of the repository before any file organization or directory restructuring.

---

## 1. Safety Checkpoint Metadata

| Parameter | Baseline Value |
| :--- | :--- |
| **Git Branch** | `master` (synchronized with `origin/main` and `origin/master`) |
| **Git Commit Hash** | `8e1f80c2023f04a94e72ff647927084bf54dd159` |
| **Release Tag** | `v2.4.0-frozen` |
| **Working Tree Status** | Clean (0 uncommitted changes, 0 staged changes) |
| **Package Manager** | `npm` (Node v20.18.0) |
| **Build Command** | `npm run build` (`tsc -b && vite build`) |
| **Server Start Command** | `npm run server` (`tsx server/src/index.ts`) |
| **Live Persistent Deployment**| `https://financial-immune-system-d9vz.onrender.com` |
| **Render Service Config** | `render.yaml` (Build: `npm install --include=dev && npm run build`, Start: `npm run server`) |

---

## 2. Baseline Validation Suite Results

Before any modifications were attempted, the existing suites were executed against the frozen code:
- **TypeScript Compilation & Vite Build:** **100% PASS** (`tsc -b && vite build` built clean in 11.91s, 0 errors).
- **Phase 5 Master Acceptance Suite:** **16 / 16 Suites Passed (100%)** (`tests/run_all_phase5_tests.cjs`).
- **Phase 2 CRP Contract Test Suite:** **43 / 43 Assertions Passed (100%)** (`tests/test_crp_contract.cjs`).
- **Phase 4 Closed-Loop Master Suite:** **23 / 23 Steps Passed (100%)** (`tests/test_phase4_closed_loop_master.cjs`).
- **Cloud REST API Acceptance Suite:** **21 / 21 Steps Passed (100%)** (`scripts/testCloudClosedLoopAPI.cjs`).
- **Cloud Real-Browser Hero Flow Replay:** **12 / 12 Steps Passed (100%)** (`scripts/testCloudRenderHeroFlow.cjs`, 0 uncaught errors).

---

## 3. Baseline Repository Inventory

```
financial-immune-system/
├── .dockerignore
├── .env.example
├── .fis_state_snapshot.json        (Ignored by .gitignore)
├── .gitignore
├── audit_workspaces.cjs            (Root test/audit script)
├── cloudflared.exe                 (Local tunnel binary, ignored by .gitignore)
├── Dockerfile
├── full_user_prompt.txt            (Ignored by .gitignore)
├── index.html
├── package.json
├── package-lock.json
├── postcss.config.js
├── railway.json
├── README.md
├── render.yaml
├── tailwind.config.js
├── temp_user_prompt.txt            (Ignored by .gitignore)
├── test_golden_path.cjs            (Root legacy test script)
├── test_phase1_foundation.cjs      (Root legacy test script)
├── test_phase2_invariants.cjs      (Root legacy test script)
├── test_phase2_living_system.cjs   (Root legacy test script)
├── test_phase3_golden_path.cjs     (Root legacy test script)
├── test_phase3_intelligence.cjs    (Root legacy test script)
├── test_phase3_systemic_intelligence.cjs (Root legacy test script)
├── test_phase4_control_foundry.cjs (Root legacy test script)
├── test_phase5_assurance.cjs       (Root legacy test script)
├── test_runtime_health.cjs         (Root legacy test script)
├── test_user_journey.cjs           (Root legacy test script)
├── tsconfig.json
├── tsconfig.tsbuildinfo            (Ignored by .gitignore)
├── verify_phase1_live.cjs          (Root legacy test script)
├── vite.config.ts
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── scripts/                        (14 files: mixed browser audits, cloud tests, JSON logs)
│   ├── browserAudit.cjs
│   ├── browser_audit_results.json
│   ├── captureJudgeScreenshots.cjs
│   ├── masterBrowserForensicRunner.cjs
│   ├── observeOnlyBrowserAudit.cjs
│   ├── observe_audit_results.json
│   ├── phase76ForensicRunner.cjs
│   ├── phase76_forensic_results.json
│   ├── phaseA_browserAudit.cjs
│   ├── testCloudClosedLoopAPI.cjs
│   ├── testCloudRenderHeroFlow.cjs
│   ├── testCloudSSE.cjs
│   ├── testPublicCloudflareHeroFlow.cjs
│   └── testRealBrowserHeroFlow.cjs
│
├── server/                         (Backend TypeScript runtime)
│   └── src/
│       ├── index.ts
│       ├── assurance/              (4 modules: evidenceEngine, ibmRuntime, privacyBoundary, assuranceManager)
│       ├── foundry/                (5 modules: candidateGenerator, counterfactualEvaluator, foundryManager, governedExecutionBus, independentVerifier)
│       ├── intelligence/           (5 modules: ablation, collectiveDecisionIntelligence, controllabilityModel, dependencyIntelligence, propagationIntelligence)
│       ├── routes/                 (2 modules: api.ts, stream.ts)
│       ├── simulation/             (7 modules: baseline, engine, operations, prng, propagation, replay, scenarios)
│       └── state/                  (1 module: store.ts)
│
├── shared/                         (Shared TypeScript constants & types)
│   ├── constants/                  (navigation.ts, status.ts)
│   └── types/                      (assurance, domain, events, foundry, intelligence, roles, simulation, telemetry)
│
├── src/                            (Frontend React/Vite/Tailwind SPA)
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   ├── components/                 (auth, common, dashboard, entity, globe, intelligence, shell)
│   ├── services/                   (stream.ts)
│   ├── store/                      (useSystemStore.ts)
│   └── views/                      (15 dedicated route views)
│
└── tests/                          (30 flat legacy and phase test scripts)
    ├── run_all_phase5_tests.cjs
    ├── test_crp_contract.cjs
    ├── test_phase3_1_ablation.cjs
    ├── test_phase3_1_claim_integrity.cjs
    ├── test_phase3_1_counterfactual_integrity.cjs
    ├── test_phase3_1_determinism.cjs
    ├── test_phase3_1_mathematical_integrity.cjs
    ├── test_phase3_1_monotonicity.cjs
    ├── test_phase3_ui_integration.cjs
    ├── test_phase4_closed_loop_master.cjs
    ├── test_phase4_independent_verification.cjs
    ├── test_phase4_lifecycle_governance.cjs
    ├── test_phase4_red_team.cjs
    ├── test_phase4_scenarios_and_golden_path.cjs
    └── ... (16 Phase 5 test files)
```

---

## 4. Key Diagnostic Observations & Plan of Action

1. **Root Directory Clutter:**  
   There are 13 test and verification scripts sitting directly at the root level (`test_*.cjs`, `audit_*.cjs`, `verify_*.cjs`). These are legacy test suites from Phases 1 through 5 that belong categorized inside `tests/legacy_phases/` or `tests/integration/`.
2. **Missing Documentation & Evidence Repository:**  
   The project has no `docs/` or `reports/` folder in git. Over 80 critical forensic, gate, and phase audit reports produced during the competition currently live outside git tracking. These should be structured into `docs/` and `reports/` to showcase full engineering rigor.
3. **Scripts Organization:**  
   The `scripts/` directory mixes browser test scripts, validation runners, cloud replay tools, and generated JSON audit results. These should be organized into:
   - `scripts/validation/` (Cloud API, Render hero flow, SSE, browser audit runners)
   - `scripts/tools/` (screenshot capture, workspace audit)
4. **Tests Organization:**  
   The `tests/` directory currently houses 30 test scripts at the root of `tests/`. Organizing them by category (`tests/contracts/`, `tests/phases/`, `tests/red-team/`, `tests/helpers/`) with master runners preserved will maintain 100% test discoverability and clarity.
5. **Preservation of Runtime Paths:**  
   `server/`, `src/`, `shared/`, `package.json`, `render.yaml`, `tsconfig.json`, and `vite.config.ts` must maintain their exact build commands, start commands, module aliases (`@/`, `@shared/`), and public API contracts so that cloud deployments and zero-regression constraints remain completely untouched.

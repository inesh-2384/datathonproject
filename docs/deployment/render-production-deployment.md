# Persistent Cloud Deployment Runbook
## Financial Immune System (FIS)

### Production Coordinates
- **Cloud Provider:** Render (Persistent Web Service)
- **Live URL:** [`https://financial-immune-system-d9vz.onrender.com`](https://financial-immune-system-d9vz.onrender.com)
- **Git Repository:** [`https://github.com/inesh-2384/datathonproject.git`](https://github.com/inesh-2384/datathonproject.git)
- **Primary Branches:** `master` and `main`

---

## 1. Render Infrastructure Specification

The cloud service is declared in `render.yaml`:

```yaml
services:
  - type: web
    name: financial-immune-system
    runtime: node
    plan: free
    region: oregon
    buildCommand: npm install --include=dev && npm run build
    startCommand: npm run server
    envVars:
      - key: NODE_VERSION
        value: "20.18.0"
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
      - key: FIS_SIMULATION_SEED
        value: "42091"
      - key: FIS_RUNTIME_QUALIFICATION
        value: "LOCAL_SIMULATION [TARGET: IBM Z TELUM II / LINUXONE]"
```

---

## 2. Zero Local Dependency Guarantee

The application is 100% self-hosted on Render:
- Does **not** require local Node.js server.
- Does **not** require Vite development server.
- Does **not** require Cloudflare tunnel or `cloudflared.exe`.
- Does **not** require local laptop network presence.

---

## 3. Production Health & Validation

To verify the cloud deployment at any time:

```bash
# 1. Health Endpoint Verification
curl -s https://financial-immune-system-d9vz.onrender.com/health | jq .

# 2. Automated Cloud Closed Loop Acceptance Suite (21 Steps)
node scripts/validation/testCloudClosedLoopAPI.cjs

# 3. Headless Chrome End-to-End Hero Flow Replay (12 Steps)
node scripts/validation/testCloudRenderHeroFlow.cjs
```

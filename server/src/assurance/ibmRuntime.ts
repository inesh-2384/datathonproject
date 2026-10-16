/**
 * FINANCIAL IMMUNE SYSTEM - IBM Z / LINUXONE RUNTIME CONTEXT (PHASE 5)
 * Sections 25, 26, 27, 28, 29, 30: Enterprise Architecture & Truth Labeling
 * 
 * Invariants:
 * 1. Do not label architecture as implementation.
 * 2. Do not label simulation as live infrastructure.
 * 3. Never claim IBM Z automatically secures the application or solves systemic risk.
 * 4. Ground claims in real platform characteristics: mission-critical throughput,
 *    colocation with core banking ledgers, hardware cryptography (CPACF),
 *    confidential computing enclaves, and zero-unplanned-downtime reliability.
 */

import { IBMRuntimeTruth, IBMRuntimeCapability } from '../../../shared/types/assurance';

export class IBMRuntimeContext {
  public static readonly CAPABILITY_MATRIX: IBMRuntimeCapability[] = [
    {
      capability: 'Enterprise Event Processing',
      ibmTechnology: 'IBM Z / LinuxONE s390x High-Throughput Substrate',
      truthState: 'ARCHITECTED',
      rationale: 'Sub-millisecond systemic event ingestion co-located with Tier-1 core banking transactions.'
    },
    {
      capability: 'Streaming / Event Fabric',
      ibmTechnology: 'IBM Event Streams (Apache Kafka on LinuxONE)',
      truthState: 'ARCHITECTED',
      rationale: 'High-throughput event sourcing for immutable systemic state updates and multi-subscriber SSE distribution.'
    },
    {
      capability: 'Enterprise Data Persistence',
      ibmTechnology: 'IBM Db2 for z/OS & LinuxONE',
      truthState: 'ARCHITECTED',
      rationale: 'ACID-compliant storage of topological graphs, historical incidents, and regulatory audit packages.'
    },
    {
      capability: 'In-Transaction AI Inference',
      ibmTechnology: 'IBM Telum Integrated AI Accelerator / On-Chip Matrix Processing',
      truthState: 'ARCHITECTED',
      rationale: 'Low-latency evaluation of effective decision diversity (EDD) and algorithmic herding scores directly in transaction path.'
    },
    {
      capability: 'Containerized Microservices',
      ibmTechnology: 'Red Hat OpenShift on LinuxONE',
      truthState: 'ARCHITECTED',
      rationale: 'Resilient container orchestration for FIS intelligence engines, propagation models, and Control Foundry.'
    },
    {
      capability: 'Enterprise AI Governance',
      ibmTechnology: 'IBM watsonx.governance',
      truthState: 'ARCHITECTED',
      rationale: 'Lifecycle tracking, drift detection, and compliance attestation for systemic intervention recommendation models.'
    },
    {
      capability: 'Data Security & Enclave Isolation',
      ibmTechnology: 'IBM Guardium & IBM Secure Execution for Linux',
      truthState: 'ARCHITECTED',
      rationale: 'Hardware-enforced memory isolation ensuring cross-firm financial topology cannot be inspected by external host administrators.'
    }
  ];

  public static readonly HARDWARE_SUBSTRATE_RATIONALE = 
    'The Financial Immune System operates as a systemic control intelligence layer requiring continuous proximity to ' +
    'mission-critical core banking ledgers, clearing rails, and RTGS infrastructure. Deploying on IBM Z and LinuxONE ' +
    'is appropriate because:\n' +
    '1. High-Throughput Event Co-Location: Systemic contagion propagates in milliseconds; co-locating the intelligence ' +
    'engine with transactional workloads eliminates cross-cloud egress latency.\n' +
    '2. CP Assist for Cryptographic Function (CPACF): Silicon-accelerated SHA-256 and asymmetric cryptography ensures ' +
    'every state delta and authorization seal is signed without operational latency penalty.\n' +
    '3. Secure Execution Enclaves: Prevents multi-tenant hypervisors from inspecting proprietary order books while allowing ' +
    'computation of collective systemic risk metrics.\n' +
    '4. Continuous Operational Availability: Systemic immune response cannot fail during market turbulence; IBM Z high-availability ' +
    'is architected to support uninterruptible control center continuity.';

  /**
   * Returns authoritative runtime truth status
   */
  public static getRuntimeTruth(): IBMRuntimeTruth {
    return {
      runtimeMode: 'LOCAL_SIMULATION',
      dataSource: 'SIMULATED',
      eventStream: 'SIMULATED',
      aiInference: 'SIMULATED',
      enterpriseData: 'SIMULATED',
      hardware: 'ARCHITECTED',
      attestation: 'SIMULATED',
      capabilities: [...this.CAPABILITY_MATRIX],
      hardwareSubstrateRationale: this.HARDWARE_SUBSTRATE_RATIONALE
    };
  }
}

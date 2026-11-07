import { getArchitectureFlow } from "./projectArchitectures";
import { getProjectStack, projectStacks, type ProjectStackGroup } from "./projectStacks";

export type Project = {
  slug: string;
  title: string;
  shortTitle: string;
  category: string;
  tagline: string;
  overview: string;
  role: string;
  tags: string[];
  stack: string[];
  stackGroups: ProjectStackGroup[];
  features: string[];
  impact: string;
  github: string;
  demo: string;
  accent: [string, string];
  cover: string;
  problem: string;
  solution: string;
  engineering: string;
  note: string;
  flow: { title: string; detail: string }[];
};

export const projects: Project[] = [
  {
    slug: "trace-ops",
    title: "Trace Ops",
    shortTitle: "Trace Ops",
    category: "Agentic AI · Operations",
    tagline: "From operational incident to evidence-backed action.",
    overview:
      "A multi-tenant AI platform that investigates incidents using company knowledge and live business data. Stateful agents retrieve evidence, inspect operational records, recommend actions, pause for human approval, and verify execution before recording incident memory.",
    role: "Full-stack AI engineering across FastAPI services, LangGraph orchestration, retrieval, operational tools, approvals, voice interfaces, the frontend, and an isolated classifier fine-tuning pipeline.",
    tags: ["LangGraph", "FastAPI", "RAG", "Qdrant", "Human-in-the-loop"],
    stack: getProjectStack("trace-ops"),
    stackGroups: projectStacks["trace-ops"],
    features: [
      "Tenant-scoped retrieval with embeddings, reranking, and source citations.",
      "Checkpointed LangGraph investigations with operational tools and incident memory.",
      "Human approval, deterministic financial checks, idempotent execution, and outcome verification.",
      "MCP access, n8n automation dispatch, and durable background workflows.",
      "Recorded-audio transcription and speech synthesis; isolated supervised LoRA/QLoRA training and serving.",
    ],
    problem:
      "Incident context is scattered across documents, orders, payments, and past investigations. AI has to connect the evidence while respecting the boundaries around real actions.",
    solution:
      "One investigation graph connects retrieval, live tools, explicit approval, verified execution, and reusable incident memory.",
    engineering:
      "The model reasons about evidence; deterministic logic validates transactions, amounts, authorization, idempotency, and execution outcomes.",
    impact:
      "Connects investigation and controlled execution in an auditable workflow, with tenant boundaries and recovery paths built into the backend.",
    note: "Active development. The fine-tuning pipeline is implemented; no production model-quality or customer-scale results are claimed. Voice features depend on configuration.",
    github: "https://github.com/Zebishah/TraceOps",
    demo: "https://ops-pilot-sage.vercel.app",
    accent: ["#0c4935", "#c4d46b"],
    cover: "/projects/trace-ops.png",
    flow: getArchitectureFlow("trace-ops"),
  },
  {
    slug: "case-lens",
    title: "Case Lens",
    shortTitle: "Case Lens",
    category: "Applied AI · HR Operations",
    tagline: "The right employee context. Inside the conversation.",
    overview:
      "An Intercom-integrated HR case intelligence platform that identifies employees, classifies cases, surfaces related histories, and recommends stakeholders inside the support workflow, with a separate operations dashboard for review.",
    role: "Full-stack development across the Next.js dashboard, TypeScript API, Intercom Canvas and webhooks, Gemini intelligence, Box directory sync, durable ingestion, and background processing.",
    tags: ["Next.js", "Gemini", "Intercom", "PostgreSQL", "Apify"],
    stack: getProjectStack("case-lens"),
    stackGroups: projectStacks["case-lens"],
    features: [
      "Intercom sidebar with employee identity, classification, related history, and recommended CC contacts.",
      "Gemini analysis, alias-aware matching, related-case retrieval, and persistent human corrections.",
      "Box directory synchronization and internal Intercom note/tag write-back.",
      "Signed webhooks, transactional ingestion, revision-aware deduplication, and stale-write protection.",
      "On-demand Apify execution with BullMQ/Redis retained as a supported alternative.",
    ],
    problem:
      "HR support agents need employee history and the right stakeholders while a case is open. Disconnected directories and records interrupt their work.",
    solution:
      "Resolve identity, gather related evidence, and bring useful recommendations directly into Intercom Inbox.",
    engineering:
      "Durable webhook ingestion and revision-aware processing prevent repeated events and older analyses from silently overwriting newer context.",
    impact:
      "Connects identity resolution, related-case evidence, and stakeholder routing to the agent's existing workflow, with human review and traceable processing.",
    note: "The public walkthrough uses synthetic reviewer data. Apify is the active deployment path; BullMQ is a supported alternative architecture.",
    github: "https://github.com/Zebishah/CaseLens",
    demo: "https://nagumo-hr-intelligence.vercel.app",
    accent: ["#e4e5cf", "#244735"],
    cover: "/projects/case-lens.png",
    flow: getArchitectureFlow("case-lens"),
  },
  {
    slug: "drive-pilot",
    title: "Drive Pilot",
    shortTitle: "Drive Pilot",
    category: "Full-stack · Marketplace & Payments",
    tagline: "A lesson marketplace with a serious payment engine.",
    overview:
      "An end-to-end driving lesson marketplace connecting students, instructors, and administrators. Instructor discovery, timezone-aware booking, real-time messaging, learning progress, and document verification meet a complete Stripe payment lifecycle.",
    role: "Full-stack engineering across role-based dashboards, GraphQL APIs, scheduling, messaging, Stripe checkout and Connect payouts, refund consistency, and background processing.",
    tags: ["React", "GraphQL", "Stripe Connect", "MongoDB", "Redis"],
    stack: getProjectStack("drive-pilot"),
    stackGroups: projectStacks["drive-pilot"],
    features: [
      "Scoped student, instructor, and administrator workflows and dashboards.",
      "Discovery, availability, timezone-aware lessons, rescheduling, and progress tracking.",
      "Stripe checkout, scheduled off-session charges, refunds, and instructor payouts.",
      "Guarded booking transitions, idempotent financial operations, durable webhooks, and reconciliation.",
      "Real-time chat, reviews, document verification, and Redis caches with explicit invalidation.",
    ],
    problem:
      "A booking is also a financial workflow. Reschedules, cancellations, scheduled charges, and payouts must stay consistent across three user roles.",
    solution:
      "A complete marketplace built around explicit booking transitions, scoped APIs, durable events, and a carefully guarded Stripe lifecycle.",
    engineering:
      "Financial-operation records, webhook deduplication, reconciliation, and transactional outbox processing address duplicate delivery and partial failures.",
    impact:
      "Connects the customer booking experience to dependable payment and instructor workflows, including refund and payout handling.",
    note: "The public demo shows the product experience. Payment capabilities describe implemented integration paths, not claims of public transaction volume.",
    github: "https://github.com/Zebishah/DrivePilot",
    demo: "https://dsp-marketplace.vercel.app",
    accent: ["#d8e5e7", "#144952"],
    cover: "/projects/drive-pilot.png",
    flow: getArchitectureFlow("drive-pilot"),
  },
  {
    slug: "dealer-flow",
    title: "Dealer Flow",
    shortTitle: "Dealer Flow",
    category: "Full-stack · Automotive Intelligence",
    tagline: "Dealership operations, connected to vehicle intelligence.",
    overview:
      "An automotive sales CRM and vehicle-intelligence platform combining leads, appointments, follow-ups, deals, commissions, analytics, inventory comparisons, and a role-aware AI assistant.",
    role: "Full-stack engineering across dealership workflows, React interfaces, typed APIs, PostgreSQL data models, vehicle acquisition, AI tools, and asynchronous ingestion architectures.",
    tags: ["React", "PostgreSQL", "Apify", "Puppeteer", "AI Tools"],
    stack: getProjectStack("dealer-flow"),
    stackGroups: projectStacks["dealer-flow"],
    features: [
      "Role-aware leads, appointments, follow-ups, sales, commissions, and reporting.",
      "Multi-source vehicle acquisition, normalized listings, comparisons, and source-health visibility.",
      "Page-aware read-only assistance grounded in authorized deterministic data tools.",
      "On-demand Apify scraping, PostgreSQL persistence, and Redis limits, quotas, and caches.",
      "A retained SQS/Lambda implementation with outbox publication, retries, and dead-letter handling.",
    ],
    problem:
      "Sales teams need a shared view of activity and current vehicle data. Long-running browser acquisition cannot sit inside ordinary API requests.",
    solution:
      "Separate operational APIs from on-demand acquisition, and ground the assistant in authorized persisted records.",
    engineering:
      "PostgreSQL enforces listing identity and run idempotency. Redis stays ephemeral; typed adapters and bounded AI tools preserve application boundaries.",
    impact:
      "Connects CRM operations, inventory acquisition, and explainable assistance while keeping long-running scraping outside interactive requests.",
    note: "Reviewed from portfolio-hardening. The current demo uses Apify; SQS/Lambda and BullMQ/Azure are retained earlier paths, separate from the active runtime.",
    github: "https://github.com/Zebishah/DealerFlow",
    demo: "https://rta-dealership-web.vercel.app",
    accent: ["#e9ddcb", "#634e30"],
    cover: "/projects/dealer-flow.png",
    flow: getArchitectureFlow("dealer-flow"),
  },
];
export const getProject = (slug: string) => projects.find((project) => project.slug === slug);

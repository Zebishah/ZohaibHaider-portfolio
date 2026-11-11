import { skillGroups } from "@/lib/skills";
import {
  Code2,
  Server,
  BrainCircuit,
  Database,
  Cloud,
  Workflow,
  Search,
  Cpu,
  AudioLines,
  ShieldCheck,
  CreditCard,
  FlaskConical,
  type LucideIcon,
} from "lucide-react";
export type SkillName = (typeof skillGroups)[number]["name"];
const group = (name: SkillName): string[] => [
  ...(skillGroups.find((g) => g.name === name)?.items ?? []),
];
const retrieval = [
  "RAG",
  "Semantic Search",
  "Hybrid Retrieval",
  "Embeddings",
  "Reranking",
  "pypdf",
  "LangChain Text Splitters",
];
const searchData = ["Qdrant", "Elasticsearch", "pgvector"];
const searchModels = ["Mistral Embed", "Voyage AI"];
const voiceModels = ["Whisper", "Orpheus"];
function domain(
  name: string,
  icon: LucideIcon,
  description: string,
  items: string[],
  featured: string[],
) {
  return {
    name,
    icon,
    description,
    items: [...new Set(items)],
    featured,
    preview: featured.slice(0, 3).join(" · "),
  };
}
export const skillDomains = [
  domain(
    "Frontend & UI",
    Code2,
    "Interfaces, design systems, state, and the languages that bring a product to life.",
    [
      ...group("Frontend"),
      ...group("UI systems & utilities"),
      "TypeScript",
      "JavaScript (ES6+)",
      "HTML",
      "CSS",
    ],
    [
      "React",
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "shadcn/ui",
      "TanStack Query",
      "React Hook Form",
      "Zod",
    ],
  ),
  domain(
    "Backend & APIs",
    Server,
    "Python and JavaScript services, typed contracts, real-time interfaces, and server-side business logic.",
    [...group("Backend & APIs"), "Python"],
    ["FastAPI", "Node.js", "Express.js", "NestJS", "Python", "REST APIs", "GraphQL", "WebSockets"],
  ),
  domain(
    "Databases",
    Database,
    "Relational and document databases, storage, migrations, transactions, caching, and query performance.",
    [...group("Databases & storage").filter((x) => !searchData.includes(x)), "SQL"],
    [
      "PostgreSQL",
      "MongoDB",
      "MySQL",
      "Redis",
      "SQLAlchemy",
      "Alembic",
      "Drizzle ORM",
      "Amazon S3",
    ],
  ),
  domain(
    "AI Agents & Models",
    BrainCircuit,
    "Stateful agents, tool use, human approval, AI memory, model APIs, and evaluation.",
    [
      ...group("Agentic AI & retrieval").filter((x) => !retrieval.includes(x)),
      ...group("AI providers & models").filter(
        (x) => ![...searchModels, ...voiceModels].includes(x),
      ),
    ],
    [
      "LangGraph",
      "LangChain",
      "Tool Calling",
      "Human-in-the-Loop",
      "AI Memory",
      "Groq",
      "Gemini API",
      "Qwen",
    ],
  ),
  domain(
    "Search & RAG",
    Search,
    "Semantic and hybrid retrieval: from document ingestion and embeddings to reranking and grounded answers.",
    [...retrieval, ...searchData, ...searchModels],
    [
      "RAG",
      "Semantic Search",
      "Embeddings",
      "Reranking",
      "Qdrant",
      "Elasticsearch",
      "pgvector",
      "Voyage AI",
    ],
  ),
  domain(
    "ML & Fine-tuning",
    Cpu,
    "Dataset preparation, efficient model adaptation, quantization, training, evaluation, checkpoints, and serving.",
    group("Fine-tuning & ML"),
    [
      "PyTorch",
      "Hugging Face Transformers",
      "PEFT",
      "LoRA",
      "QLoRA",
      "bitsandbytes",
      "CUDA",
      "Model Serving",
    ],
  ),
  domain(
    "Voice AI",
    AudioLines,
    "Speech recognition, generated speech, browser audio capture, and voice-connected application workflows.",
    [...group("Voice AI"), ...voiceModels],
    [
      "Whisper",
      "Speech-to-Text",
      "Text-to-Speech",
      "Groq Audio API",
      "Whisper Large V3",
      "Orpheus",
      "MediaRecorder API",
      "getUserMedia",
    ],
  ),
  domain(
    "Cloud & DevOps",
    Cloud,
    "Cloud infrastructure, containers, deployments, observability, build tooling, version control, and continuous delivery.",
    [
      ...group("Cloud & deployment"),
      ...group("Build & developer tools"),
      ...group("Observability & debugging"),
      "AWS SQS",
      "Git Flow",
      "Bash",
    ],
    [
      "Docker",
      "AWS Lambda",
      "Cloudflare Workers",
      "GitHub Actions",
      "CI/CD",
      "Vercel",
      "Linux",
      "NGINX",
    ],
  ),
  domain(
    "Automation",
    Workflow,
    "Event-driven jobs, AI tool connections, application integrations, webhooks, and automated business workflows.",
    group("Automation & integrations"),
    ["n8n", "Inngest", "MCP", "Webhooks", "Gmail API", "Intercom Canvas Kit", "Apify", "Cron Jobs"],
  ),
  domain(
    "Testing & Quality",
    FlaskConical,
    "Testing, static analysis, code review, and collaborative development practices that support dependable software delivery.",
    [
      ...group("Testing & quality"),
      ...group("Methodologies & practices").filter((item) => item !== "Git Flow"),
    ],
    [
      "pytest",
      "Playwright",
      "Vitest",
      "Jest",
      "Ruff",
      "mypy",
      "Integration Testing",
      "E2E Testing",
    ],
  ),
  domain(
    "Payments & Fintech",
    CreditCard,
    "Marketplace payments, subscriptions, connected accounts, payouts, refunds, ledgers, and accounting integrations.",
    group("Payments & finance"),
    [
      "Stripe Connect",
      "Stripe",
      "PayPal",
      "Subscriptions",
      "Refunds",
      "Payouts",
      "QuickBooks",
      "Wallet Transactions",
    ],
  ),
  domain(
    "Security & Systems",
    ShieldCheck,
    "Identity, tenant boundaries, permissions, distributed messaging, resilient architecture, concurrency, and reliable background processing.",
    [
      ...group("Authentication & security"),
      ...group("Architecture & reliability"),
      ...group("Distributed systems & messaging").filter((x) => x !== "AWS SQS"),
    ],
    [
      "OAuth 2.0",
      "RBAC",
      "JWT",
      "Tenant Isolation",
      "System Design",
      "Multi-Tenant SaaS",
      "Idempotency",
      "Transactional Outbox",
    ],
  ),
];
export const domainTools = (index: number) => skillDomains[index].items;
export const skillCoverage = () => {
  const source = new Set(skillGroups.flatMap((g) => [...g.items]));
  const assigned = skillDomains.flatMap((d) => d.items);
  return {
    total: source.size,
    assigned: new Set(assigned).size,
    missing: [...source].filter((x) => !assigned.includes(x)),
    unknown: assigned.filter((x) => !source.has(x as never)),
    duplicates: assigned.filter((x, i) => assigned.indexOf(x) !== i),
  };
};
export const toolNotes: Record<string, { label: string; description: string }> = {
  LangGraph: {
    label: "Stateful agent orchestration",
    description:
      "Builds multi-step AI workflows with tool calls, persistent state, checkpoints, and human approval.",
  },
  RAG: {
    label: "Retrieval-augmented generation",
    description:
      "Connects model responses to retrieved documents and application knowledge instead of relying on the prompt alone.",
  },
  "Hugging Face Transformers": {
    label: "Model training & inference",
    description:
      "Works with pretrained transformer models for adaptation, evaluation, and serving.",
  },
  PyTorch: {
    label: "Machine learning engineering",
    description:
      "Supports the training, evaluation, and inference work behind the classifier fine-tuning pipeline.",
  },
  PEFT: {
    label: "Parameter-efficient adaptation",
    description: "Adapts pretrained models using a smaller set of trainable parameters.",
  },
  LoRA: {
    label: "Low-rank adaptation",
    description:
      "Trains compact adapters for supervised model adaptation without updating every model weight.",
  },
  QLoRA: {
    label: "Quantized adapter training",
    description:
      "Combines low-rank adapters with quantized base models to reduce fine-tuning memory requirements.",
  },
  Groq: {
    label: "Model & audio integration",
    description:
      "Connects language and speech models to real application workflows through provider APIs.",
  },
  Whisper: {
    label: "Speech-to-text",
    description: "Transcribes recorded audio into text for voice-enabled product workflows.",
  },
  "Tool Calling": {
    label: "Models connected to tools",
    description:
      "Lets an agent request structured application operations while deterministic logic validates access and execution.",
  },
  React: {
    label: "Interactive product interfaces",
    description:
      "Builds reusable UI components, stateful interactions, and complete frontend application flows.",
  },
  "Next.js": {
    label: "Full-stack React applications",
    description:
      "Connects routing, rendering, frontend interfaces, and server-backed product features.",
  },
  FastAPI: {
    label: "Typed Python services",
    description:
      "Builds asynchronous APIs with validation, clear contracts, and application integrations.",
  },
  "Node.js": {
    label: "JavaScript backend services",
    description:
      "Powers backend application logic, integrations, and event-driven product workflows.",
  },
  "Stripe Connect": {
    label: "Marketplace payments",
    description:
      "Connects marketplace checkout, connected accounts, and payment workflows in Drive Pilot.",
  },
  PostgreSQL: {
    label: "Relational application data",
    description:
      "Stores structured records with transactions, relational queries, and migration-managed schemas.",
  },
  Qdrant: {
    label: "Vector search",
    description:
      "Retrieves relevant embedded knowledge for tenant-scoped semantic search and RAG workflows.",
  },
  Redis: {
    label: "Caching & coordination",
    description:
      "Supports caching and background-work infrastructure across application workflows.",
  },
  Docker: {
    label: "Repeatable environments",
    description:
      "Packages application services and dependencies into consistent container environments.",
  },
  "GitHub Actions": {
    label: "Automated delivery checks",
    description: "Runs repository workflows and checks as part of a repeatable delivery process.",
  },
  pytest: {
    label: "Python testing",
    description:
      "Exercises application behavior, integrations, and regression cases in the Python backend.",
  },
  n8n: {
    label: "Workflow automation",
    description: "Connects external applications, triggers, and controlled workflow execution.",
  },
  MCP: {
    label: "Tools exposed to AI clients",
    description:
      "Exposes authorized application tools and resources through the Model Context Protocol.",
  },
};

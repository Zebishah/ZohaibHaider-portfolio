export type CaseStudyArea = { title: string; description: string; details: string[] };
export type CaseStudyDecision = {
  title: string;
  challenge: string;
  approach: string;
  result: string;
};
export type ProjectCaseStudyData = {
  card: { overview: string; build: string; impact: string };
  introduction: string[];
  audiences: { title: string; description: string }[];
  ownership: string[];
  capabilities: CaseStudyArea[];
  decisions: CaseStudyDecision[];
  quality: { title: string; description: string }[];
  outcomes: { title: string; description: string }[];
  boundaries: string[];
  repository: string;
  commit: string;
  sources: { label: string; path: string }[];
};

// Reviewed against the current repository READMEs, local implementation, tests,
// and product/architecture documents. See docs/project-case-study-sources.md.
export const projectCaseStudies: Record<string, ProjectCaseStudyData> = {
  "trace-ops": {
    card: {
      overview:
        "An AI operations workspace that investigates incidents using company knowledge, live business records, and past resolutions. Findings, proposed actions, human approvals, and execution history stay connected to the same incident.",
      build:
        "Full-stack engineering across the React workspace, FastAPI services, LangGraph tool workflows, tenant-scoped RAG, approval and recovery paths, MCP integrations, voice input, and an isolated classifier training and evaluation workspace.",
      impact:
        "Brings evidence and decision-making into one inspectable workflow. Sensitive proposals require explicit approval, results are verified, and incident memory helps future investigations. The public refund demonstration uses a simulated internal ledger.",
    },
    introduction: [
      "Operational incidents rarely arrive with all their context. An investigator may need a policy document, an order, a payment record, and the outcome of a similar incident before deciding what to do. Trace Ops brings those sources into a shared, organization-scoped workspace that keeps findings connected to the incident.",
      "The product connects incident intake, classification, retrieval, operational tools, recommendations, approvals, execution verification, and searchable incident memory. I worked across the product interface and the underlying services, including the boundaries that keep an AI recommendation separate from permission to act.",
    ],
    audiences: [
      {
        title: "Operations teams",
        description:
          "Investigate incidents, inspect supporting evidence, request clarification, and follow a case through to resolution.",
      },
      {
        title: "Authorized reviewers",
        description:
          "Review proposed sensitive actions and approve or reject them with the relevant incident context available.",
      },
      {
        title: "Workspace administrators",
        description:
          "Manage organization knowledge, memberships, integrations, processing readiness, and evaluation workflows.",
      },
    ],
    ownership: [
      "Built the incident and knowledge workspace with React, TypeScript, and Next.js App Router conventions on a Vinext/Vite runtime.",
      "Connected FastAPI endpoints, validated schemas, SQLAlchemy records, database migrations, organization membership, and authorization.",
      "Implemented retrieval and LangGraph orchestration around scoped tools, conditional routing, persisted state, approval, and verified outcomes.",
      "Connected durable background processing, automation delivery, MCP/OAuth access, voice endpoints, and a separate fine-tuning environment.",
    ],
    capabilities: [
      {
        title: "A workspace for the full investigation",
        description:
          "The interface makes the incident and its processing state the main unit of work. Users can follow findings, evidence, approvals, and subsequent activity without losing the connection to the original business problem.",
        details: [
          "Incident intake, category, priority, status, and investigation history.",
          "Knowledge, approvals, automation, readiness, and evaluation screens.",
          "Backend proxy integration and observable processing states backed by persisted records.",
        ],
      },
      {
        title: "Document ingestion and explicit retrieval",
        description:
          "Original documents live in S3-compatible storage, while PostgreSQL records their metadata and processing state. Extracted text is split into page-aware chunks, embedded through Mistral, and indexed in Qdrant.",
        details: [
          "Organization filters constrain both document and incident-memory retrieval.",
          "Voyage reranking selects useful passages from vector-search candidates.",
          "Source metadata and citations keep retrieved evidence inspectable.",
        ],
      },
      {
        title: "Stateful agents and operational tools",
        description:
          "LangGraph manages the investigation state and conditional routes. The workflow can classify an incident, retrieve evidence, choose an operational tool, examine its result, and continue investigating instead of assuming a single model call has completed the job.",
        details: [
          "LangChain/Groq interactions use structured outputs validated before application use.",
          "Bounded tools inspect permitted customer, order, and payment records.",
          "Missing information, no-action outcomes, rejection, and approval are separate paths.",
        ],
      },
      {
        title: "Approval, execution, and recovery",
        description:
          "A sensitive proposal pauses at an explicit human decision. Persisted checkpoints allow the authorized workflow to resume, while backend code validates transaction identity, amounts, currency, and execution state.",
        details: [
          "Approval records and resumable state separate a recommendation from authorization.",
          "Idempotent operations and recovery services protect repeated or interrupted execution.",
          "Outcome verification runs before a successful resolution is treated as reusable incident memory.",
        ],
      },
      {
        title: "Durable jobs and external automation",
        description:
          "Inngest handles internal background work such as document processing, indexing, investigation, and recovery. n8n is a separate integration boundary for configured downstream business automation.",
        details: [
          "Progress and failure information are persisted for the workspace to inspect.",
          "Temporary provider failures can be retried without holding an HTTP request open.",
          "Automation delivery attempts are tracked; a downstream notification failure does not undo a completed core operation.",
        ],
      },
      {
        title: "Memory, MCP, voice, and the model lifecycle",
        description:
          "Resolved incidents can become organization-scoped searchable memory. Authorized MCP clients can access bounded tools through OAuth. Recorded audio can enter the workflow through configured transcription and speech services, while classifier training remains isolated from the API runtime.",
        details: [
          "Separate document and incident-memory collections preserve their different roles.",
          "The training workspace includes PyTorch, Transformers, PEFT, adapter training, evaluation, checkpoints, and serving.",
          "LoRA/QLoRA, CUDA, model providers, and voice workers depend on the selected environment and configuration.",
        ],
      },
    ],
    decisions: [
      {
        title: "Give each store one responsibility",
        challenge:
          "Application records, original files, vector search, and temporary caches have different consistency requirements.",
        approach:
          "Use PostgreSQL as the application source of truth, S3-compatible storage for documents, Qdrant for retrieval vectors, and Redis for supporting caches.",
        result:
          "A vector index or cache is not mistaken for the authoritative incident or approval record.",
      },
      {
        title: "Keep authority in application code",
        challenge:
          "A plausible model answer is insufficient evidence that a financial action is allowed or correctly specified.",
        approach:
          "Validate structured outputs, enforce organization scope inside tools, perform exact financial checks in backend code, and require explicit approval before sensitive execution.",
        result:
          "Reasoning, authorization, execution, and verification remain separate, inspectable boundaries.",
      },
      {
        title: "Separate core work from external delivery",
        challenge:
          "Notifications, indexing providers, and business automation can fail independently of the incident workflow.",
        approach:
          "Persist job and delivery state, use durable execution and recovery paths, and record downstream attempts separately from the core result.",
        result:
          "An accepted webhook or automation dispatch is not presented as proof that every downstream action completed.",
      },
    ],
    quality: [
      {
        title: "Behavior and boundary tests",
        description:
          "The repository contains pytest coverage for retrieval, tenant foreign keys, approval scoping and supersession, refund consistency, incident memory, MCP operations, voice, and recovery. Ruff, mypy, frontend Node.js tests, TypeScript, and build checks support the development workflow. External integration tests need their configured services.",
      },
      {
        title: "Deployment and processing",
        description:
          "The API, database migrations, frontend proxy, background execution, retrieval services, and external integrations have explicit setup boundaries. The separate training environment keeps heavyweight model dependencies out of the ordinary FastAPI runtime. Provider readiness and job states are exposed through the product rather than inferred from a successful page load.",
      },
      {
        title: "Evaluation without invented results",
        description:
          "Classification and fine-tuning evaluation tooling is implemented, but its existence is not a claim of a production accuracy improvement. Tests and synthetic examples demonstrate behavior; measured model quality, customer-scale performance, and live downstream delivery require separate evidence.",
      },
    ],
    outcomes: [
      {
        title: "A connected investigation record",
        description:
          "Company knowledge, authorized records, proposed decisions, approvals, and execution history can be inspected around one incident.",
      },
      {
        title: "Controlled AI action",
        description:
          "Human approval, deterministic checks, persisted state, and verification make the action boundary explicit.",
      },
      {
        title: "An extensible engineering foundation",
        description:
          "Retrieval, memory, tools, background processing, MCP, voice, and training are connected through defined application contracts.",
      },
    ],
    boundaries: [
      "The public walkthrough uses synthetic records. Its refund demonstration writes to an internal simulated ledger and does not move money through a payment provider.",
      "Voice, optional training workers, AI providers, and n8n execution depend on deployment configuration. An automation delivery acknowledgement is separate from downstream completion.",
      "Investigations take conditional routes: they can request clarification, resolve without an action, or wait for an approval decision before continuing.",
    ],
    repository: "Zebishah/TraceOps",
    commit: "0191af0db3d7ac77a93aa306d0f5612730290a06",
    sources: [
      { label: "Product and current architecture", path: "README.md" },
      {
        label: "Implemented investigation graph",
        path: "backend/src/ops_pilot/workflows/incident/graph.py",
      },
      { label: "Durable background work", path: "docs/project-knowledge/background-processing.md" },
      { label: "Isolated classifier training", path: "backend/finetuning/train_classifier.py" },
    ],
  },
  "case-lens": {
    card: {
      overview:
        "An HR case intelligence platform that brings employee identity, conversation classification, related history, and stakeholder context into Intercom, with a separate dashboard for review and operations.",
      build:
        "Built the Next.js dashboard, TypeScript/Express services, signed Intercom and email ingestion, Gemini intelligence, deterministic employee matching, Box directory sync, durable processing, review workflows, and a scoped read-only assistant.",
      impact:
        "Centralizes case context where HR teams already work, makes uncertain identity matches reviewable, and preserves newer replies and human corrections. The reviewer environment uses synthetic data; no unmeasured customer savings are claimed.",
    },
    introduction: [
      "HR conversations often contain incomplete names, inconsistent employee references, long histories, and routing details spread across different systems. Case Lens structures that information without asking operators to abandon their existing Intercom inbox.",
      "The product combines embedded Intercom Canvas surfaces with a Next.js operations dashboard. AI assists extraction and classification, while employee resolution, evidence handling, role boundaries, and processing correctness remain explicit application responsibilities. Its focus is employee support, case history, and HR operations.",
    ],
    audiences: [
      {
        title: "HR support operators",
        description:
          "See employee evidence, related conversations, and stakeholder suggestions beside the active Intercom case.",
      },
      {
        title: "Administrators",
        description:
          "Review cases, directories, processing health, invitations, and evaluation evidence in a separate dashboard.",
      },
      {
        title: "Restricted reviewers",
        description:
          "Explore approved synthetic walkthroughs with a read-only role and controlled access.",
      },
    ],
    ownership: [
      "Built the Next.js/React workspace, typed API integration, case views, directory screens, loading/error states, and reviewer experience.",
      "Implemented Express/TypeScript modules, signed ingestion adapters, PostgreSQL/Drizzle persistence, migrations, and role-aware APIs.",
      "Connected Gemini-assisted intelligence with deterministic identity matching, related-case evidence, stakeholder routing, and human corrections.",
      "Built asynchronous execution, revision-aware processing, operational visibility, integration write-back, and a read-only assistant.",
    ],
    capabilities: [
      {
        title: "Intercom, email, and shared case intake",
        description:
          "Signed provider requests enter through dedicated adapters that normalize the conversation into the application model. The generic intake path commits the event, conversation, messages, and outbox state transactionally; Intercom also maintains durable event and source-revision state.",
        details: [
          "HMAC verification and workspace checks occur at the integration boundary.",
          "Unique inbound-event identities prevent repeated delivery from becoming repeated intake.",
          "Durable dispatch state supports recovery when recording an event succeeds but starting work is interrupted.",
        ],
      },
      {
        title: "Structured intelligence with reviewable evidence",
        description:
          "Gemini-assisted extraction and classification turn long conversations into structured case context. Deterministic fixture mode provides a reproducible demonstration and evaluation path without implying that fixture results measure live-model accuracy.",
        details: [
          "Extracted facts and confidence support an operator-facing case view.",
          "Exact, alias, token, and bounded fuzzy matching help resolve employee references.",
          "Uncertain matches remain visible for review rather than becoming silent identity decisions.",
        ],
      },
      {
        title: "Employee history and stakeholder context",
        description:
          "Related-case retrieval looks across name variants and close spellings, with scope and time-window evidence. Directory-backed context supplies store ownership and recipient suggestions so the case includes both its history and the people who may need to act.",
        details: [
          "Box directory synchronization and imports support employee and store context.",
          "Related history does not depend on every conversation sharing one category.",
          "Routing and CC suggestions use deterministic directory rules with inspectable evidence.",
        ],
      },
      {
        title: "On-demand processing without lost updates",
        description:
          "The active deployment starts private Apify Actors after durable intake. Actors load persisted case data and use the shared intelligence handlers, keeping long-running processing outside the webhook response.",
        details: [
          "Revision-aware dispatch and stale-snapshot checks protect newer conversation replies.",
          "Processing locks and guarded persistence limit conflicting analysis.",
          "BullMQ/Redis and inline execution remain supported alternatives, not simultaneous production requirements.",
        ],
      },
      {
        title: "Human review and Intercom write-back",
        description:
          "Persisted intelligence is surfaced through Canvas and the dashboard, with internal-note/tag write-back when configured. Human corrections remain authoritative across ordinary subsequent processing until an explicit re-analysis is requested.",
        details: [
          "Write-back failures are handled separately from successfully persisted analysis.",
          "Admin and viewer authorization is enforced by the backend.",
          "Case, directory, health, and evaluation views make processing and review inspectable.",
        ],
      },
      {
        title: "A read-only assistant and controlled walkthrough",
        description:
          "Ask Case Lens can explain product behavior publicly and use authorized case, operations, directory, or evaluation context for authenticated roles. Its tools use bounded validated inputs and existing access checks.",
        details: [
          "The assistant receives no arbitrary SQL, shell access, or mutation capability.",
          "Invite-controlled access and short-lived reviewer walkthroughs avoid publishing shared credentials.",
          "Synthetic sessions have request limits and retention controls; fixture evidence remains labelled.",
        ],
      },
    ],
    decisions: [
      {
        title: "Keep deterministic identity evidence",
        challenge:
          "AI extraction alone cannot safely decide that two differently named people are the same employee.",
        approach:
          "Combine exact matches, aliases, name tokens, and bounded fuzzy evidence, and preserve the reason and confidence for a review decision.",
        result:
          "Operators can inspect uncertain identity links instead of inheriting an unexplained model guess.",
      },
      {
        title: "Protect conversation revisions",
        challenge:
          "A new reply can arrive while an older analysis is running, creating a risk of stale persistence or write-back.",
        approach:
          "Use durable source revisions, revision-aware dispatch, processing guards, and stale-result checks before committing or publishing analysis.",
        result:
          "A later message is not silently hidden by older in-flight work, and human corrections retain their intended priority.",
      },
      {
        title: "Use one intelligence implementation across execution modes",
        challenge:
          "Moving long-running work between an API process, queue worker, and Actor should not create three different analysis products.",
        approach:
          "Share intelligence handlers across the current Apify execution path and the retained inline/BullMQ alternatives, with PostgreSQL owning the durable case state.",
        result:
          "Deployment choices can evolve without changing the evidence and case-processing contracts exposed to the operator.",
      },
    ],
    quality: [
      {
        title: "Tests across the integration boundary",
        description:
          "The repository includes backend unit, integration, contract, and browser-level checks for signed requests, durable events, identity resolution, revision handling, and Canvas workflows. Jest, Supertest, Vitest, React Testing Library, Playwright, TypeScript, and CI support verification; fixtures and mocked providers are distinguished from live integration checks.",
      },
      {
        title: "Application security and access",
        description:
          "JWT validation checks algorithms, issuer, and audience. Backend roles govern administrator and reviewer data. Password hashing, secure refresh cookies, login throttling, request validation, safe request IDs, and atomic demo quotas support the access boundary.",
      },
      {
        title: "Deployment and recovery",
        description:
          "The current processing topology uses a Render API, PostgreSQL, and private on-demand Apify execution. Configured Redis provides shared rate-limit counters and temporary directory/routing caches. Ordered transactional migrations and persisted dispatch state support repeatable changes and operational recovery without treating Redis as the business source of truth.",
      },
    ],
    outcomes: [
      {
        title: "Case context inside the existing workflow",
        description:
          "Classification, employee evidence, related history, and routing context can be inspected beside the Intercom conversation.",
      },
      {
        title: "Reviewable intelligence",
        description:
          "Uncertain matches, persistent human corrections, and labelled evaluation evidence keep operator judgement part of the system.",
      },
      {
        title: "Recoverable asynchronous work",
        description:
          "Durable event records, revision-aware processing, and dispatch recovery make incomplete or repeated delivery visible and manageable.",
      },
    ],
    boundaries: [
      "The public reviewer experience uses synthetic records. A demonstrated Intercom workflow is not evidence of production customer traffic, a customer SLA, or independently measured time savings.",
      "Apify is the documented active background path; BullMQ and inline processing are supported alternatives. Different ingestion adapters do not all implement an identical outbox flow.",
      "Fixture evaluation records reproducible behavior against labelled synthetic data. Live Gemini evaluation and configured third-party integrations are separate verification paths.",
    ],
    repository: "Zebishah/CaseLens",
    commit: "210880414ee2f2520cdd2b8b53b97fe1dff249b8",
    sources: [
      { label: "Product and deployment topology", path: "README.md" },
      { label: "Product/value evidence", path: "docs/PRODUCT_AUDIT.md" },
      { label: "Review and demonstration boundaries", path: "docs/RECRUITER_EVIDENCE.md" },
      {
        label: "Revision-aware intelligence processing",
        path: "Intercom-app/backend/src/modules/intelligence/intelligence.processor.ts",
      },
    ],
  },
  "drive-pilot": {
    card: {
      overview:
        "A driving-lesson marketplace connecting student discovery and booking with instructor teaching, earnings, and administrator oversight. Scheduling, messaging, learning progress, and a complete Stripe payment lifecycle share the same product.",
      build:
        "Built role-based React dashboards, GraphQL and REST services, timezone-aware scheduling, real-time messaging, document workflows, Stripe checkout and Connect payouts, scheduled charges, refunds, financial reconciliation, and a read-only assistant.",
      impact:
        "Connects a booking to the operational and financial work around it. Explicit states, idempotent operations, durable webhooks, and recovery paths keep repeated events and interrupted jobs from being treated as new financial actions.",
    },
    introduction: [
      "A driving lesson is more than a calendar entry. A student needs to choose an instructor, understand availability, book the right time, pay, communicate, and track progress. The instructor needs control over availability, teaching, documents, tariffs, and earnings. Administrators need a reliable view of those connected workflows.",
      "Drive Pilot brings those responsibilities into three role-based workspaces. My work spans the React marketplace and dashboards, GraphQL and REST application services, real-time communication, and the financial lifecycle behind a booking. The engineering is especially concerned with what happens when a payment is repeated, delayed, refunded, or interrupted.",
    ],
    audiences: [
      {
        title: "Students",
        description:
          "Discover instructors, book lessons, complete payments, message instructors, track learning, and review payment history.",
      },
      {
        title: "Instructors",
        description:
          "Manage availability, pricing, verification documents, students, lesson feedback, and connected earnings workflows.",
      },
      {
        title: "Administrators",
        description:
          "Oversee users, bookings, verification, support, refunds, marketplace activity, and financial records.",
      },
    ],
    ownership: [
      "Built the public React/TypeScript marketplace and student, instructor, and administrator interfaces with connected state and typed GraphQL operations.",
      "Implemented Express/Apollo services, Mongoose business records, role and ownership checks, booking transitions, and integration endpoints.",
      "Connected Stripe checkout, off-session charging, Connect payout workflows, refunds, durable webhook processing, and financial operation records.",
      "Built messaging, notifications, document and learning workflows, background delivery, reconciliation, and authorized read-only assistance.",
    ],
    capabilities: [
      {
        title: "Instructor discovery and student onboarding",
        description:
          "The marketplace connects profiles, reviews, location filters, prices in CHF, and availability with the booking journey. The student workspace brings upcoming lessons, history, progress, feedback, and payment context into a consistent experience.",
        details: [
          "Search and discovery lead into an instructor-specific booking flow.",
          "Student pages expose lesson state and payment actions appropriate to the current booking.",
          "Google/Facebook OAuth and ordinary account workflows connect to application authorization.",
        ],
      },
      {
        title: "Availability, booking, and learning progress",
        description:
          "Booking and rescheduling operate around explicit business rules and timezone-aware lesson data. The platform distinguishes pending, payable, completed, missed, refunded, and other lifecycle states instead of treating every lesson as an interchangeable event.",
        details: [
          "Instructor availability, tariffs, and student management have dedicated surfaces.",
          "Cancellation, rescheduling, and refund actions depend on eligibility and lesson state.",
          "Progress tracking, lesson feedback, ratings, and student/instructor history support the learning relationship.",
        ],
      },
      {
        title: "Stripe checkout and the payment lifecycle",
        description:
          "Payments connect the initial booking to scheduled charging, additional authentication, refunds, commissions, and instructor payout handling. Provider-facing operations are represented by application records rather than inferred only from a browser redirect.",
        details: [
          "Checkout and configured off-session charges use the appropriate Stripe paths.",
          "Payment failures and authentication-required states have explicit completion flows.",
          "Stripe Connect, financial records, and guarded payout processing connect instructor earnings to eligible lessons.",
        ],
      },
      {
        title: "Durable financial processing and recovery",
        description:
          "Financial operation records have idempotency keys and guarded transitions. Leases coordinate processing, durable webhook records support retryable handling, and reconciliation addresses ambiguity between a provider result and the application's local state.",
        details: [
          "Repeated events are distinguished from new financial work.",
          "Webhook processing, transactions, money utilities, and reconciliation have dedicated implementation and test boundaries.",
          "Outbox delivery and replay keep notifications recoverable without conflating an email failure with a failed payment.",
        ],
      },
      {
        title: "Communication, documents, and administration",
        description:
          "Socket.IO supports real-time messaging and notifications. Instructor documents and profile verification support marketplace trust, while administrative screens expose users, bookings, reviews, support, and financial oversight.",
        details: [
          "Role-specific chat interfaces share the authorized messaging transport.",
          "AWS S3 supports document/file integration where configured.",
          "Redis caching uses explicit invalidation around changing product data rather than replacing MongoDB as the durable record.",
        ],
      },
      {
        title: "Product guidance with a bounded assistant",
        description:
          "A read-only assistant can explain product behavior and permitted workspace information. It is separated from normal booking, payment, cancellation, and refund mutations so a conversation does not become an alternative financial authorization path.",
        details: [
          "Public guidance and authenticated workspace context have different access boundaries.",
          "Assistant route, provider, tools, and tests live in a dedicated feature module.",
          "Recruiter role walkthroughs are available only when their demonstration accounts are explicitly configured.",
        ],
      },
    ],
    decisions: [
      {
        title: "Model a booking as a business lifecycle",
        challenge:
          "A reschedule, cancellation, missed lesson, payment failure, or refund changes which later operations are permitted.",
        approach:
          "Use explicit booking/slot states, eligibility checks, and role/ownership validation in the application services and GraphQL resolvers.",
        result:
          "The interface can expose valid next actions instead of relying on a payment button or calendar state alone.",
      },
      {
        title: "Represent financial work before executing it",
        challenge:
          "Retries and concurrent workers can otherwise perform the same external financial operation more than once.",
        approach:
          "Persist financial operation identity, use provider idempotency and guarded state transitions, claim work through leases, and reconcile uncertain outcomes.",
        result:
          "A repeated request can be associated with the existing operation and its state rather than automatically becoming a second charge or payout.",
      },
      {
        title: "Keep communications recoverable and separate",
        challenge:
          "An email provider or chat notification can fail after a booking or financial transition has already succeeded.",
        approach:
          "Persist outbox work and process delivery/replay independently; keep API and scheduled worker processes separately runnable.",
        result:
          "Communication can be retried without pretending that an already committed business operation failed.",
      },
    ],
    quality: [
      {
        title: "Focused financial and application tests",
        description:
          "The Node.js test suite includes financial operation and reliability checks, durable Stripe webhooks, transactions, money utilities, authentication, booking guards, cache behavior, logging, request correlation, and email outbox delivery. These code-level checks are separate from configured Stripe sandbox smoke tests and live provider behavior.",
      },
      {
        title: "Typed clients and incremental feature ownership",
        description:
          "The frontend uses TypeScript, Apollo Client, Redux Toolkit, and route/feature boundaries for assistant, chat, and feedback. The backend composes GraphQL services alongside REST authentication and integration endpoints. The repository contains transitional legacy modules and multiple UI libraries alongside its newer feature-owned boundaries.",
      },
      {
        title: "Deployable API and worker boundaries",
        description:
          "The server exposes separately configurable API and worker start modes. MongoDB stores business records, Redis supports optional caches, Socket.IO carries real-time messages, and external payment, document, OAuth, and email integrations require their own configuration. Role-based synthetic demonstrations depend on explicitly configured demo accounts.",
      },
    ],
    outcomes: [
      {
        title: "Three connected marketplace perspectives",
        description:
          "Student discovery and learning, instructor teaching and earnings, and administrator oversight are represented in one application.",
      },
      {
        title: "A booking tied to its financial state",
        description:
          "Checkout, scheduled charges, authentication, cancellations, refunds, and payouts have explicit conditional paths and application records.",
      },
      {
        title: "Recovery beyond the happy path",
        description:
          "Durable events, operation identity, reconciliation, leases, cache invalidation, and notification replay address interrupted and repeated work.",
      },
    ],
    boundaries: [
      "Stripe integration behavior depends on configured accounts, provider credentials, webhook endpoints, and scheduled jobs. External provider checks have their own sandbox verification path.",
      "Scheduled charges, cancellations, refunds, reschedules, and payouts are conditional workflows. Every booking does not execute every path.",
      "The assistant is read-only. Payment-provider checks, external integrations, deployment workers, and recruiter accounts need their configured environment; a public product preview does not prove those services are currently active.",
    ],
    repository: "Zebishah/DrivePilot",
    commit: "469cce1a73306af7e8ebc2b2590b94d79859c0a7",
    sources: [
      { label: "Marketplace surfaces and integrations", path: "README.md" },
      { label: "Application and feature boundaries", path: "docs/ARCHITECTURE.md" },
      {
        label: "Booking and financial eligibility rules",
        path: "docs/BUSINESS_RULES_CANCEL_REFUND_PAYMENT_PAYOUT.md",
      },
      {
        label: "Financial operations and leases",
        path: "server/src/services/financialOperationService.js",
      },
    ],
  },
  "dealer-flow": {
    card: {
      overview:
        "A dealership operations and vehicle-intelligence platform connecting leads, follow-ups, appointments, sales, commissions, inventory, and analytics. Role-aware AI explains authorized records, while on-demand acquisition keeps external vehicle data inspectable.",
      build:
        "Built the React workspace, typed Express APIs, PostgreSQL models, customer handoff workflows, Apify acquisition and reconciliation, source-health diagnostics, scoped AI tools, session security, caching, tests, and deployment configuration.",
      impact:
        "Brings customer operations and vehicle intelligence into a shared product with traceable source runs and explicit recovery. The current path uses Vercel, Render, Neon, Upstash, and Apify; older AWS and queue-worker paths remain clearly labelled alternatives.",
    },
    introduction: [
      "A dealership needs more than a list of vehicles. Staff have leads to follow up, appointments to organize, deals to record, commissions to understand, and external inventory to assess. Dealer Flow connects those operational tasks with persisted vehicle intelligence and role-aware assistance.",
      "I worked across the React product, Express services, PostgreSQL data, on-demand acquisition, and operational visibility. The architecture keeps browser scraping away from interactive API requests, gives persisted records a clear owner, and restricts the assistant to the same authorized business context as the ordinary product.",
    ],
    audiences: [
      {
        title: "Dealership staff",
        description:
          "Work assigned leads, appointments, customer follow-ups, vehicle context, and permitted sales activities.",
      },
      {
        title: "Customer-operations assistants",
        description:
          "Handle lead engagement, follow-up, appointments, and contextual handoff without inheriting unrestricted sales access.",
      },
      {
        title: "Administrators and reviewers",
        description:
          "Inspect workspace activity, analytics, acquisition history, source health, and role-limited synthetic walkthroughs.",
      },
    ],
    ownership: [
      "Built the React/TypeScript workspace, public inventory experience, role-aware navigation, analytics, and shared assistant surfaces.",
      "Implemented Express application contracts, PostgreSQL/Drizzle data access, migrations, session/RBAC enforcement, and customer-operations workflows.",
      "Connected approved source adapters to on-demand Apify execution, persisted run metadata, listing normalization, and reconciliation.",
      "Built deterministic AI tools, provider fallbacks, ephemeral caching/quotas, safe diagnostics, browser tests, and deployment/CI boundaries.",
    ],
    capabilities: [
      {
        title: "CRM and dealership operations",
        description:
          "The workspace connects leads, follow-ups, appointments, sales, targets, commissions, documents, analytics, and audit history. Role and row visibility shape which records and actions a person can access.",
        details: [
          "Customer-operations assistants focus on engagement, follow-up, appointments, and handoff.",
          "Administrators can inspect workload, overdue work, appointments, and escalations.",
          "Handoff threads preserve the lead and business context of internal communication.",
        ],
      },
      {
        title: "On-demand vehicle acquisition",
        description:
          "Authorized requests start bounded Apify Actor runs against approved source adapters. The API records run metadata and reconciles progress/results while the Actor performs browser or HTML acquisition and persists the current scraped inventory.",
        details: [
          "The active adapters cover Romans International, Tom Hartley, and Redline Specialist Cars.",
          "Shared source contracts normalize listing identity and parser versions.",
          "The current flow does not require a permanent scraper worker or an additional Redis queue.",
        ],
      },
      {
        title: "Inventory and operational visibility",
        description:
          "Persisted listing projections support inventory browsing, filtering, comparisons, saved vehicles, and relevant business queries. The acquisition workspace adds run history, source health, parser context, and safe dependency telemetry.",
        details: [
          "Neon PostgreSQL is the durable source of truth for application records.",
          "Run reconciliation is manual or externally schedulable, not an invented always-on maintenance process.",
          "Accepted-record counts and source state are displayed only where the adapters actually provide that evidence.",
        ],
      },
      {
        title: "A page-aware, read-only assistant",
        description:
          "The shared assistant combines curated product knowledge with deterministic tools for authorized analytics, leads, inventory, sales, and acquisition diagnostics. The API applies the user's existing session, role, workspace, and row boundaries.",
        details: [
          "Public questions use public-safe curated context; operational questions require authorized records.",
          "Configured Gemini, Groq, and OpenRouter providers sit behind bounded contracts, timeouts, fallbacks, and circuit suppression.",
          "The assistant cannot mutate records, start scrapes, send email, run arbitrary SQL, or browse arbitrary URLs.",
        ],
      },
      {
        title: "Caching, rate limits, and failure handling",
        description:
          "Upstash Redis is intentionally ephemeral: it holds distributed rate limits, daily AI quota counters, and short-lived cache entries. It is not the current acquisition queue and does not own the business records.",
        details: [
          "A cache failure can fall back to PostgreSQL reads.",
          "Configured quota/rate-limit failures fail closed with safe service errors.",
          "Request IDs, structured logs, provider diagnostics, and protected health endpoints make failures traceable without exposing secrets or customer content.",
        ],
      },
      {
        title: "Security and deployable product boundaries",
        description:
          "Opaque sessions, RBAC, CSRF protection, bounded inputs, allowlisted image proxying, safe errors, and audit history are part of the current API boundary. The Actor receives only its required acquisition inputs, while application credentials stay server-side.",
        details: [
          "The active product path is Vercel web → Render API → Neon PostgreSQL, with on-demand Apify execution.",
          "S3 document storage and Resend email are configured integrations.",
          "BullMQ/Azure and SQS/Lambda implementations remain visible as retained reference paths rather than being described as current runtime requirements.",
        ],
      },
    ],
    decisions: [
      {
        title: "Keep acquisition out of an interactive request",
        challenge:
          "Browser acquisition has variable duration and depends on external markup, so it cannot be treated like an ordinary fast API query.",
        approach:
          "Launch short-lived Apify Actors with bounded approved-source inputs, persist run identities, and expose reconciliation and source status through the API.",
        result:
          "The user can inspect an acquisition lifecycle while the interactive application keeps clear authorization and persistence responsibilities.",
      },
      {
        title: "Give Redis an intentionally limited role",
        challenge:
          "Combining durable records, queues, caches, quotas, and scraping ownership would make failures and data responsibility hard to explain.",
        approach:
          "Keep Neon authoritative and use Upstash only for ephemeral limits, quotas, and caches in the active topology; label older queue architectures separately.",
        result:
          "Cache fallback and fail-closed authorization limits can behave differently without confusing the source of business truth.",
      },
      {
        title: "Make AI use the existing permission model",
        challenge:
          "Natural-language access could otherwise expose records that the ordinary workspace would hide.",
        approach:
          "Use strict schemas, deterministic tools, session/CSRF checks, workspace/row scoping, read-only operations, bounded history, and safe provider fallbacks.",
        result:
          "Assistance explains authorized persisted information without becoming a second mutation or data-access channel.",
      },
    ],
    quality: [
      {
        title: "Tests across data, acquisition, and interface behavior",
        description:
          "The repository includes TypeScript checks, unit/integration tests for shared contracts, source parsers, Actor inputs, Apify clients, reconciliation, and operational services. Playwright business flows, account states, landing pages, and axe accessibility checks complement frontend tests and GitHub Actions CI.",
      },
      {
        title: "Operational and database discipline",
        description:
          "Protected health/source endpoints, request correlation, structured Pino logging, parser versions, and persisted run states support diagnosis. Common inventory, ownership, source, and run query paths have targeted indexes. The database audit explicitly avoids claiming representative performance improvements without a suitable fixture dataset and measured query plans.",
      },
      {
        title: "Current deployment and architecture history",
        description:
          "The documented live path uses Vercel, Render, Neon, Upstash, and Apify. Docker definitions, migrations, and CI support development and delivery. Retained BullMQ/Azure and AWS SQS/Lambda implementations document earlier approaches; their presence in the repository is not evidence of concurrent live production workers.",
      },
    ],
    outcomes: [
      {
        title: "Customer operations connected to inventory",
        description:
          "Staff can move between customer work, persisted vehicle context, analytics, and role-appropriate assistance inside one product.",
      },
      {
        title: "Inspectable acquisition and recovery",
        description:
          "Approved sources, run metadata, parser versions, reconciliation, and source health give external-data collection a visible lifecycle.",
      },
      {
        title: "An assistant with bounded authority",
        description:
          "Product help and operational explanations reuse existing authorization while keeping writes and acquisition controls outside the AI boundary.",
      },
    ],
    boundaries: [
      "External source markup changes over time. Adapter maintenance and configured live-source checks are distinct from passing local unit tests.",
      "Source metrics depend on the shared adapter contract. Accepted-record counts and parser versions are available; discovered/rejected counts are unavailable where a source adapter does not expose them.",
      "AI providers, email, storage, and live acquisition depend on their configured services. Public and recruiter views use role-limited, sanitized access. Older queue-worker and AWS paths are references, not the active acquisition architecture.",
    ],
    repository: "Zebishah/DealerFlow",
    commit: "680e50c01c64a6116d0bd616174960169b2ba21e",
    sources: [
      { label: "Product and evidence boundaries", path: "rta-marketing/docs/PORTFOLIO.md" },
      {
        label: "Current production topology",
        path: "rta-marketing/docs/architecture/current-production.md",
      },
      {
        label: "Assistant tools and permissions",
        path: "rta-marketing/docs/architecture/ai-assistant.md",
      },
      {
        label: "Acquisition reconciliation",
        path: "rta-marketing/apps/dealership-api/src/modules/acquisition/reconciliation.ts",
      },
    ],
  },
};

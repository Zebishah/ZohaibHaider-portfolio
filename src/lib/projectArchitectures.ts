export type ArchitectureStage = {
  title: string;
  kind: "interface" | "service" | "data" | "ai" | "gate" | "integration" | "recovery";
  summary: string;
  tools: string[];
  input: string;
  output: string;
  engineering: string;
  recovery: string;
  skill: string;
};
export type ProjectArchitecture = {
  headline: string;
  description: string;
  phases: { title: string; description: string; stages: ArchitectureStage[] }[];
  branches: { title: string; label: string; detail: string; tools: string[] }[];
  strengths: { title: string; evidence: string }[];
  context: string;
};

// Workflow source and evidence are documented in docs/project-architecture-sources.md.
// These are explanatory maps: conditional actions and supporting systems are
// labelled explicitly rather than presented as mandatory steps in every request.
export const projectArchitectures: Record<string, ProjectArchitecture> = {
  "trace-ops": {
    headline: "Turn an incident into an evidence-backed, auditable decision.",
    description:
      "A tenant-scoped investigation connects company knowledge, operational records, AI reasoning, human approval, and verified execution.",
    phases: [
      {
        title: "Context & evidence",
        description:
          "Establish who is asking, what happened, and which evidence the investigation can use.",
        stages: [
          {
            title: "Authorize the workspace",
            kind: "interface",
            summary: "Create the incident inside the signed-in organization.",
            tools: ["React", "FastAPI", "JWT"],
            input: "A signed-in user, organization membership, and an incident description.",
            output: "A persisted incident linked to its organization and creator.",
            engineering:
              "Carry organization scope from authentication into every application query and downstream tool.",
            recovery:
              "Reject missing membership or unauthorized records before starting an investigation.",
            skill: "Full-stack authentication & multi-tenant design",
          },
          {
            title: "Classify & route",
            kind: "ai",
            summary: "Validate category and priority, then check prerequisites.",
            tools: ["LangGraph", "Groq", "Pydantic"],
            input: "The incident text and current workflow state.",
            output: "A validated classification and the next permitted graph route.",
            engineering:
              "Validate structured model output before using it in application logic; route high-risk notifications separately.",
            recovery:
              "When required customer context is absent, request clarification instead of continuing with guessed facts.",
            skill: "Structured AI output & conditional orchestration",
          },
          {
            title: "Retrieve company knowledge",
            kind: "data",
            summary: "Find tenant-filtered evidence and rerank the useful passages.",
            tools: ["Mistral Embed", "Qdrant", "Voyage AI"],
            input: "An incident-derived retrieval query and its organization filter.",
            output: "Ranked document passages with metadata and source references.",
            engineering:
              "Keep embedding, tenant filtering, candidate selection, and reranking explicit so evidence remains inspectable.",
            recovery:
              "Validate provider response shapes and scores; insufficient evidence remains a visible limitation.",
            skill: "Retrieval engineering & grounded generation",
          },
          {
            title: "Recall prior incidents",
            kind: "data",
            summary: "Bring relevant incident memory into the investigation context.",
            tools: ["PostgreSQL", "Qdrant", "LangGraph"],
            input: "The current incident and scoped historical memory candidates.",
            output: "Relevant prior outcomes alongside the document evidence.",
            engineering:
              "Use saved incident memory as additional context while retaining the identity and scope of its source.",
            recovery:
              "A missing historical match does not authorize the model to fabricate a precedent.",
            skill: "AI memory & evidence modelling",
          },
        ],
      },
      {
        title: "Investigation & decisions",
        description:
          "Connect the evidence to real records and build an action that can be reviewed.",
        stages: [
          {
            title: "Inspect operational records",
            kind: "service",
            summary: "Select bounded tools and inspect permitted business data.",
            tools: ["LangGraph", "FastAPI", "SQLAlchemy"],
            input: "Evidence, authorized customer context, and the available operational tools.",
            output:
              "Structured observations about permitted orders, payments, or customer records.",
            engineering:
              "The graph can select a tool, execute it, and return to tool selection rather than relying on a single model answer.",
            recovery:
              "Stop for missing information and enforce the same record authorization inside each tool.",
            skill: "Agent tool loops & API boundaries",
          },
          {
            title: "Check deterministic facts",
            kind: "gate",
            summary: "Validate duplicates, transaction identity, amounts, and currency.",
            tools: ["Python", "SQLAlchemy", "PostgreSQL"],
            input: "The operational records relevant to a possible financial action.",
            output: "Explicit facts and validated transaction candidates.",
            engineering:
              "Exact payment conditions and financial arithmetic belong in backend code rather than model judgement.",
            recovery:
              "Ambiguous transaction identity or inconsistent amounts prevents construction of a sensitive action.",
            skill: "Financial correctness & deterministic validation",
          },
          {
            title: "Analyze & propose",
            kind: "ai",
            summary: "Explain the evidence and construct a bounded recommendation.",
            tools: ["LangChain", "Groq", "Pydantic"],
            input: "Cited evidence, tool observations, and deterministic checks.",
            output: "An explanation and a validated action proposal, or a no-action outcome.",
            engineering:
              "Separate model reasoning from payload construction and authorization so a recommendation is reviewable.",
            recovery:
              "The workflow can finish without an action; not every incident is routed to execution.",
            skill: "Applied AI architecture & action contracts",
          },
          {
            title: "Pause for human approval",
            kind: "gate",
            summary: "Sensitive proposals wait for an authorized approve or reject decision.",
            tools: ["Human-in-the-Loop", "LangGraph", "PostgreSQL"],
            input: "A proposed sensitive action and its supporting evidence.",
            output: "A recorded approval decision and a resumable graph state.",
            engineering:
              "Use the graph interruption boundary and persisted checkpoints to separate recommendation from permission.",
            recovery:
              "Rejection ends that execution path. Approval must be explicit before the action node can run.",
            skill: "Human-in-the-loop systems & resumable state",
          },
        ],
      },
      {
        title: "Execution & feedback",
        description:
          "Verify the result, retain useful context, and deliver downstream events independently.",
        stages: [
          {
            title: "Execute the approved action",
            kind: "integration",
            summary: "Run the validated action through the controlled execution service.",
            tools: ["FastAPI", "PostgreSQL", "Idempotency"],
            input: "An authorized approval and a validated action payload.",
            output: "A durable action result that can be checked and audited.",
            engineering:
              "Recheck authorization and financial invariants at execution, and make repeated delivery safe.",
            recovery:
              "The public refund demonstration writes to an internal simulated ledger; it does not transfer money through a payment provider.",
            skill: "Controlled execution & idempotent operations",
          },
          {
            title: "Verify the outcome",
            kind: "gate",
            summary: "Check the recorded execution result before calling the work complete.",
            tools: ["Python", "PostgreSQL", "LangGraph"],
            input: "The action result and the expected postconditions.",
            output: "An explicit verification outcome attached to the incident.",
            engineering:
              "Completion is an application-level check after execution, not a success claim made by the model.",
            recovery:
              "An unsuccessful or inconsistent result remains visible for investigation instead of being silently marked resolved.",
            skill: "Postcondition checks & workflow integrity",
          },
          {
            title: "Write incident memory",
            kind: "data",
            summary: "Save the investigation and outcome as reusable scoped knowledge.",
            tools: ["PostgreSQL", "Qdrant", "Inngest"],
            input: "The investigation evidence, action result, and verification state.",
            output: "Persisted incident memory and searchable context for future investigations.",
            engineering:
              "Keep durable application records authoritative while indexing memory for later retrieval.",
            recovery:
              "Persist processing state so indexing and follow-up work can be traced and recovered.",
            skill: "Knowledge lifecycle & durable background work",
          },
          {
            title: "Dispatch business automation",
            kind: "integration",
            summary: "Send configured resolution and recovery events to downstream workflows.",
            tools: ["n8n", "Inngest", "HTTPX"],
            input: "A completed incident event and configured automation destinations.",
            output: "Recorded delivery attempts and downstream acknowledgements.",
            engineering:
              "Isolate external automation from the core investigation result and distinguish accepted delivery from downstream completion.",
            recovery:
              "A failed notification does not reverse a successfully verified core action; delivery attempts retain their own status.",
            skill: "Integration design & failure isolation",
          },
        ],
      },
    ],
    branches: [
      {
        title: "Knowledge ingestion",
        label: "SUPPORTING PIPELINE",
        detail:
          "Upload documents to S3, extract and chunk text, create Mistral embeddings, and index scoped passages in Qdrant.",
        tools: ["Amazon S3", "pypdf", "Qdrant"],
      },
      {
        title: "Voice & MCP entry points",
        label: "CONFIGURED INTEGRATIONS",
        detail:
          "Recorded speech and authorized MCP clients feed the same application boundaries through transcription or scoped tools.",
        tools: ["Whisper", "Orpheus", "MCP", "OAuth 2.0"],
      },
      {
        title: "Classifier training workspace",
        label: "ISOLATED / OPTIONAL",
        detail:
          "Prepare datasets, train LoRA adapters, evaluate checkpoints, and serve a classifier separately from the API runtime. QLoRA requires supported CUDA hardware.",
        tools: ["PyTorch", "PEFT", "LoRA", "Modal"],
      },
      {
        title: "Durable execution",
        label: "CROSS-CUTTING",
        detail:
          "Background investigations, indexing, retries, and recovery are coordinated through durable application state and Inngest workflows.",
        tools: ["Inngest", "PostgreSQL", "Redis"],
      },
    ],
    strengths: [
      {
        title: "AI that connects to business systems",
        evidence:
          "Retrieval, operational tools, structured reasoning, and graph routing work together around the same incident.",
      },
      {
        title: "Authority stays in application code",
        evidence:
          "Tenant scope, exact financial validation, approvals, and execution verification define what the system can do.",
      },
      {
        title: "Ownership across the AI lifecycle",
        evidence:
          "The implementation extends from the user interface and APIs to knowledge ingestion, evaluation, training, and automation.",
      },
    ],
    context:
      "This map groups the implemented lifecycle. Clarification, no-action, approval, and rejection routes are conditional; an incident does not execute every stage. Training and voice depend on configuration.",
  },
  "hr-intelligence": {
    headline: "Turn fragmented HR conversations into reviewable case intelligence.",
    description:
      "Signed intake, durable processing, employee identity, AI extraction, related history, and operator review share one PostgreSQL-backed case domain.",
    phases: [
      {
        title: "Intake & durability",
        description:
          "Acknowledge the event only after it has a validated, durable processing path.",
        stages: [
          {
            title: "Receive the conversation",
            kind: "integration",
            summary: "Accept an Intercom event or supported inbound-email payload.",
            tools: ["Intercom Webhooks", "Express.js", "TypeScript"],
            input: "A source event and conversation content from a configured intake integration.",
            output: "A normalized intake request with a source identity and event key.",
            engineering:
              "Route integrations into a shared case-intelligence domain rather than building a separate intelligence engine per channel.",
            recovery: "Malformed and unsupported payloads are rejected before processing.",
            skill: "Integration contracts & domain modelling",
          },
          {
            title: "Verify signatures & shape",
            kind: "gate",
            summary: "Check authenticity, input contracts, and event identity.",
            tools: ["HMAC Verification", "Zod", "Express.js"],
            input: "The inbound request, signature, and expected source contract.",
            output: "A verified and validated case event.",
            engineering:
              "Keep authenticity checks ahead of parsing and business processing, and use stable source/event keys for deduplication.",
            recovery:
              "Invalid signatures are rejected; duplicate deliveries must not create duplicate case processing.",
            skill: "Webhook security & idempotent intake",
          },
          {
            title: "Commit durable intake",
            kind: "data",
            summary: "Persist case state and the work that needs to be dispatched.",
            tools: ["PostgreSQL", "Drizzle ORM", "Transactional Outbox"],
            input: "A verified event and its normalized case data.",
            output: "Stored case/event state and a durable dispatch intent.",
            engineering:
              "Generic intake commits its explicit outbox with the case transaction; Intercom uses durable ingestion and revision-aware dispatch state.",
            recovery:
              "Recovery can find eligible work that was committed but not successfully dispatched.",
            skill: "Transactional boundaries & recoverable messaging",
          },
          {
            title: "Dispatch an on-demand Actor",
            kind: "service",
            summary: "Move long-running intelligence work out of the webhook request.",
            tools: ["Apify", "PostgreSQL", "Node.js"],
            input: "Persisted work identity and a bounded Actor invocation.",
            output: "An Actor run linked to durable application state.",
            engineering:
              "The Actor loads case content from PostgreSQL and calls shared handlers; the webhook does not wait for the entire AI pipeline.",
            recovery:
              "Record attempts and safe error classifications so eligible failed dispatches can be recovered.",
            skill: "Asynchronous processing & runtime separation",
          },
        ],
      },
      {
        title: "Identity & intelligence",
        description:
          "Extract useful information, resolve the employee, and explain the context behind a case.",
        stages: [
          {
            title: "Extract structured case facts",
            kind: "ai",
            summary: "Use Gemini or deterministic fixtures to structure the stored conversation.",
            tools: ["Gemini API", "TypeScript", "Zod"],
            input: "The persisted conversation and the configured extraction mode.",
            output: "Structured classification and extracted case facts.",
            engineering:
              "Keep fixture and live-provider modes explicit, and validate the contracts consumed by later handlers.",
            recovery:
              "Provider or extraction failures remain traceable; fixture results are not presented as live production accuracy.",
            skill: "LLM integration & testable AI contracts",
          },
          {
            title: "Resolve employee identity",
            kind: "service",
            summary: "Combine directory records, aliases, names, and reviewable match evidence.",
            tools: ["PostgreSQL", "Box API", "Trigram Search"],
            input: "Extracted identity hints and the synchronized employee directory.",
            output: "An employee match with explainable evidence or an uncertainty flag.",
            engineering:
              "Use deterministic identity evidence and bounded fuzzy matching rather than treating a model guess as an employee record.",
            recovery:
              "Ambiguous identity is surfaced for human review rather than silently linked.",
            skill: "Entity resolution & uncertainty handling",
          },
          {
            title: "Retrieve related history",
            kind: "data",
            summary: "Find relevant cases with evidence and time-window controls.",
            tools: ["PostgreSQL", "pgvector", "Semantic Search"],
            input: "The case context, employee evidence, and permitted related records.",
            output: "Relevant case history with explainable links.",
            engineering:
              "Persist related-case evidence so operators can inspect why a result is relevant.",
            recovery:
              "Weak or missing matches are allowed outcomes; unrelated history should not be forced into the answer.",
            skill: "Retrieval design & explainable relationships",
          },
          {
            title: "Build routing context",
            kind: "service",
            summary: "Recommend stakeholders and CC recipients from directory and store context.",
            tools: ["PostgreSQL", "Upstash Redis", "TypeScript"],
            input: "The resolved identity, case classification, and store-directory context.",
            output: "Review flags, stakeholder context, and recipient suggestions.",
            engineering:
              "Keep PostgreSQL authoritative and cache only short-lived routing lookups with version invalidation.",
            recovery:
              "A cache outage falls back to PostgreSQL; it does not make Redis a source of case truth.",
            skill: "Contextual recommendation & cache design",
          },
        ],
      },
      {
        title: "Review & delivery",
        description:
          "Protect newer information, present the evidence, and retain an operational recovery path.",
        stages: [
          {
            title: "Protect the latest revision",
            kind: "gate",
            summary: "Commit a snapshot only when it is still valid for the conversation.",
            tools: ["PostgreSQL", "Drizzle ORM", "Idempotency"],
            input:
              "An intelligence result, its conversation revision, and current persisted state.",
            output: "A current snapshot with execution metadata.",
            engineering:
              "Revision-aware dispatch, stale-write checks, and advisory locking prevent competing work from overwriting newer context.",
            recovery:
              "An older result must not replace a newer snapshot or write outdated intelligence back to Intercom.",
            skill: "Concurrency control & stale-write protection",
          },
          {
            title: "Surface the evidence",
            kind: "interface",
            summary:
              "Bring employee identity, related cases, and routing context into the operator workspace.",
            tools: ["Intercom Canvas Kit", "Next.js", "React"],
            input: "The persisted intelligence snapshot and permitted directory context.",
            output: "An Intercom sidebar and dashboard view with reviewable evidence.",
            engineering:
              "Read persisted case state into the surfaces where agents already work, keeping optional write-back separate.",
            recovery:
              "A deferred note/tag write-back failure does not retroactively invalidate successful primary intelligence.",
            skill: "Embedded product UX & consistent read models",
          },
          {
            title: "Preserve human corrections",
            kind: "gate",
            summary:
              "Let reviewers correct uncertain results without losing their decisions on later analysis.",
            tools: ["Next.js", "PostgreSQL", "RBAC"],
            input: "A permitted reviewer action and the existing case evidence.",
            output: "A stored human correction with controlled re-analysis behaviour.",
            engineering:
              "Human corrections remain authoritative until the documented explicit re-analysis path is used.",
            recovery:
              "Role checks protect review/admin actions; a background run cannot silently erase a correction.",
            skill: "Human review workflows & product trust",
          },
          {
            title: "Recover & inspect processing",
            kind: "recovery",
            summary: "Trace dispatches, Actor attempts, failures, and eligible retries.",
            tools: ["Apify", "PostgreSQL", "Winston"],
            input: "Durable event, outbox, Actor-run, and application-log state.",
            output: "Operational status and bounded recovery actions for authorized operators.",
            engineering:
              "Keep attempts, retryability, and processing state in durable records instead of relying on an in-memory task list.",
            recovery:
              "Retry eligible failures with bounded recovery and retain non-fatal secondary effects separately.",
            skill: "Operational observability & failure recovery",
          },
        ],
      },
    ],
    branches: [
      {
        title: "Directory synchronization",
        label: "SUPPORTING PIPELINE",
        detail:
          "Box-synchronized directories supply employee, store, and stakeholder context for the matching and routing handlers.",
        tools: ["Box API", "PostgreSQL", "Upstash Redis"],
      },
      {
        title: "BullMQ worker mode",
        label: "SUPPORTED ALTERNATIVE",
        detail:
          "The retained worker architecture uses Redis queues, retries, and revision-aware jobs. The selected production path uses Apify Actors.",
        tools: ["BullMQ", "Redis", "Resend"],
      },
      {
        title: "Ask CaseLens",
        label: "READ-ONLY ASSISTANCE",
        detail:
          "Product help and role-gated case, operations, and directory tools share existing access boundaries and cannot mutate case data.",
        tools: ["Gemini API", "Zod", "RBAC"],
      },
      {
        title: "Fixture evaluation",
        label: "VERIFICATION WORKSPACE",
        detail:
          "Deterministic samples and reviewable fixtures support testing of matching and intelligence behaviour independently of a live AI provider.",
        tools: ["Jest", "Vitest", "Playwright"],
      },
    ],
    strengths: [
      {
        title: "Reliable event-driven systems",
        evidence:
          "Signed ingestion, durable dispatch, revision awareness, locking, and recovery are designed together around the same case.",
      },
      {
        title: "Explainable applied AI",
        evidence:
          "Extraction is paired with deterministic identity evidence, related-case reasoning, human review, and preserved corrections.",
      },
      {
        title: "An integration that fits the workflow",
        evidence:
          "The Intercom Canvas surface, directory sync, API, and dashboard serve a shared case domain rather than disconnected screens.",
      },
    ],
    context:
      "The map groups the case lifecycle and its review/recovery paths. Apify is the current background-processing path; BullMQ is a supported alternative. Public walkthroughs use synthetic reviewer data.",
  },
  dsp: {
    headline: "Connect a lesson booking to a dependable financial lifecycle.",
    description:
      "Student, instructor, and administrator experiences meet scheduling, payments, durable events, payouts, and reconciliation.",
    phases: [
      {
        title: "Identity & booking",
        description: "Turn marketplace discovery into an authorized, valid lesson booking.",
        stages: [
          {
            title: "Resolve the user role",
            kind: "gate",
            summary: "Scope the student, instructor, or admin workspace and its requests.",
            tools: ["React", "JWT", "Passport.js"],
            input: "A user session or supported OAuth identity.",
            output: "An authenticated role context for the marketplace APIs.",
            engineering:
              "Enforce role and record-ownership checks on the server, not just through hidden dashboard controls.",
            recovery:
              "Reject access outside the permitted role or owned records before exposing booking or financial data.",
            skill: "Role-based product design & authorization",
          },
          {
            title: "Discover an instructor",
            kind: "interface",
            summary: "Connect search, profiles, reviews, location, and availability.",
            tools: ["React", "Apollo Client", "GraphQL"],
            input: "The student's search criteria and marketplace read context.",
            output: "Instructor profiles and booking options backed by scoped API data.",
            engineering:
              "Keep the discovery experience connected to the same API contracts used by the role workspaces.",
            recovery:
              "Empty results and unavailable options remain explicit instead of offering invalid booking choices.",
            skill: "Full-stack marketplace UX & API composition",
          },
          {
            title: "Validate the lesson slot",
            kind: "service",
            summary:
              "Check availability and timezone-aware scheduling before committing a booking.",
            tools: ["Node.js", "MongoDB", "Moment Timezone"],
            input: "An instructor, requested lesson time, and the current scheduling records.",
            output: "A validated booking candidate with explicit timing and availability.",
            engineering:
              "Treat scheduling and booking transitions as backend invariants shared across all role dashboards.",
            recovery:
              "Conflicting availability or invalid transitions prevent a booking from advancing.",
            skill: "Scheduling logic & domain invariants",
          },
          {
            title: "Create the booking state",
            kind: "data",
            summary: "Record the booking and the financial workflow it needs.",
            tools: ["GraphQL", "Mongoose", "MongoDB"],
            input: "An authorized booking candidate and its payment requirements.",
            output: "A persisted booking with a controlled lifecycle state.",
            engineering:
              "Make booking state changes explicit so later payment, cancellation, and instructor actions have valid preconditions.",
            recovery:
              "Guard repeated and invalid state transitions rather than letting clients overwrite status arbitrarily.",
            skill: "State-machine thinking & data modelling",
          },
        ],
      },
      {
        title: "Payments & consistency",
        description:
          "Connect payment providers to durable application state without double-processing money operations.",
        stages: [
          {
            title: "Start Stripe checkout",
            kind: "integration",
            summary: "Create the permitted payment flow for the booking.",
            tools: ["Stripe", "Stripe.js", "Node.js"],
            input: "The booking, customer identity, and server-validated charge context.",
            output: "A Stripe payment/checkout reference linked to the booking.",
            engineering:
              "Keep payment creation and amounts under server control and use stable operation identity for retries.",
            recovery:
              "A failed or abandoned payment stays distinct from a completed booking payment.",
            skill: "Payment integration & financial boundaries",
          },
          {
            title: "Accept durable webhooks",
            kind: "gate",
            summary: "Verify provider events and make repeated deliveries safe.",
            tools: ["Stripe", "Express.js", "MongoDB"],
            input: "A signed Stripe webhook and its event identity.",
            output: "A verified durable event and the corresponding application processing result.",
            engineering:
              "Treat provider delivery as repeatable and asynchronous rather than trusting a browser redirect as proof of payment.",
            recovery: "Deduplicate repeated deliveries and retain event state for recovery.",
            skill: "Provider contracts & durable event handling",
          },
          {
            title: "Commit financial operations",
            kind: "data",
            summary: "Connect payment state to guarded booking transitions and operation records.",
            tools: ["MongoDB", "Mongoose", "Idempotency"],
            input: "A verified provider result and current booking/financial-operation state.",
            output: "Consistent application records for the accepted money operation.",
            engineering:
              "Use financial-operation records, idempotency, and database constraints to control duplicate processing and partial failures.",
            recovery:
              "Incomplete provider/application outcomes remain available for reconciliation rather than being silently discarded.",
            skill: "Financial consistency & distributed-state reasoning",
          },
          {
            title: "Handle scheduled charges",
            kind: "service",
            summary: "Process eligible off-session charges through the background worker path.",
            tools: ["Node.js", "Stripe", "MongoDB"],
            input: "An eligible scheduled payment and its booking state.",
            output: "A recorded attempt and a provider-linked charge outcome.",
            engineering:
              "Separate API work from scheduled processing and guard the financial preconditions for each attempt.",
            recovery:
              "Retry/recovery paths retain enough operation identity to avoid charging again merely because delivery was repeated.",
            skill: "Background processing & recoverable payments",
          },
        ],
      },
      {
        title: "Lifecycle & recovery",
        description:
          "Model conditional refunds and payouts, reconcile outcomes, and keep people informed.",
        stages: [
          {
            title: "Cancel, reschedule or refund",
            kind: "gate",
            summary: "Apply the permitted branch for changed or cancelled lessons.",
            tools: ["Stripe", "MongoDB", "GraphQL"],
            input:
              "A permitted cancellation/reschedule/refund request and current financial state.",
            output: "A guarded lifecycle transition and any required refund operation.",
            engineering:
              "Keep refund eligibility, booking changes, and financial records tied to explicit state transitions.",
            recovery:
              "Invalid or repeated requests cannot bypass the same authorization and idempotency checks.",
            skill: "Conditional business workflows & refund correctness",
          },
          {
            title: "Manage instructor payouts",
            kind: "integration",
            summary: "Route eligible instructor payment workflows through Stripe Connect.",
            tools: ["Stripe Connect", "Node.js", "MongoDB"],
            input: "The instructor account and an eligible payout/payment context.",
            output: "A provider-linked instructor financial-operation record.",
            engineering:
              "Treat instructor payouts as a financial lifecycle with their own references and guarded transitions.",
            recovery:
              "A failed or incomplete payout remains traceable rather than being inferred as paid from UI state.",
            skill: "Marketplace finance & connected-account integration",
          },
          {
            title: "Reconcile & replay safely",
            kind: "recovery",
            summary: "Find mismatches and recover incomplete financial or event processing.",
            tools: ["Stripe", "MongoDB", "Transactional Outbox"],
            input:
              "Provider references, webhook records, financial operations, and durable event state.",
            output: "Diagnosed inconsistencies and controlled recovery/replay results.",
            engineering:
              "Design for partial failure between provider calls and application writes, with explicit reconciliation and replay services.",
            recovery:
              "A replay uses durable identities and guards so recovery does not become duplicate financial execution.",
            skill: "Reconciliation & failure-oriented engineering",
          },
          {
            title: "Notify & synchronize the UI",
            kind: "interface",
            summary: "Deliver email and real-time updates around the booking lifecycle.",
            tools: ["Socket.IO", "Elastic Email", "React"],
            input: "Committed booking/financial events and the user's permitted role context.",
            output: "Recoverable email delivery and up-to-date role workflows.",
            engineering:
              "Use durable email outbox processing and scoped real-time transport; delivery is separate from financial correctness.",
            recovery:
              "Notification failure must not be mistaken for a failed charge, refund, or committed booking operation.",
            skill: "Real-time product systems & reliable notifications",
          },
        ],
      },
    ],
    branches: [
      {
        title: "Learning & instructor workspaces",
        label: "PRODUCT WORKFLOWS",
        detail:
          "Lesson progress, feedback, reviews, instructor availability, and role-based administration extend the core booking experience.",
        tools: ["React", "GraphQL", "MongoDB"],
      },
      {
        title: "Document verification",
        label: "SUPPORTING INTEGRATION",
        detail:
          "Instructor verification and document workflows connect application records to configured S3 storage.",
        tools: ["Amazon S3", "Passport.js", "Mongoose"],
      },
      {
        title: "Read-only product assistant",
        label: "AI ASSISTANCE",
        detail:
          "Public guidance and authorized role context support useful answers while booking and money changes remain in normal application workflows.",
        tools: ["Gemini API", "Zod", "REST APIs"],
      },
      {
        title: "Explicit cache invalidation",
        label: "CROSS-CUTTING",
        detail:
          "Redis read caches use invalidation and database fallback, keeping durable marketplace records in MongoDB.",
        tools: ["Redis", "MongoDB", "Cache Invalidation"],
      },
    ],
    strengths: [
      {
        title: "A complete marketplace domain",
        evidence:
          "Discovery, availability, booking, learning progress, role workspaces, and communication are connected through scoped APIs.",
      },
      {
        title: "Money workflows with recovery paths",
        evidence:
          "Payments, scheduled charges, refunds, payouts, durable webhooks, and reconciliation have explicit application state.",
      },
      {
        title: "Consistency beyond the browser",
        evidence:
          "Server-side guards, operation identity, durable events, and replay logic handle repeated delivery and partial failures.",
      },
    ],
    context:
      "These layers describe the marketplace lifecycle. Scheduled charges, refunds, rescheduling, and payouts are conditional paths; they are not operations every booking performs. No public transaction-volume claim is made.",
  },
  "rta-mark": {
    headline: "Connect dealership operations to trustworthy vehicle intelligence.",
    description:
      "Role-scoped CRM workflows, on-demand acquisition, durable inventory, operational visibility, and a read-only assistant work across shared application boundaries.",
    phases: [
      {
        title: "Operations & requests",
        description:
          "Keep dealership actions scoped and make vehicle acquisition an explicit, bounded request.",
        stages: [
          {
            title: "Establish role & workspace",
            kind: "gate",
            summary: "Apply session, workspace, and role checks to dealership requests.",
            tools: ["React", "Express.js", "RBAC"],
            input: "An authenticated session and the user's dealership workspace.",
            output: "An authorized application context with the permitted row visibility.",
            engineering:
              "Carry role and workspace scope into regular APIs and AI tools rather than relying on client-side navigation rules.",
            recovery:
              "Deny access to records and operations outside the session's role and workspace.",
            skill: "Multi-role systems & authorization boundaries",
          },
          {
            title: "Operate the CRM",
            kind: "interface",
            summary: "Connect leads, appointments, follow-ups, sales, commissions, and reports.",
            tools: ["React", "TanStack Query", "PostgreSQL"],
            input: "An authorized business action in the dealership dashboard.",
            output: "Validated CRM records and refreshed role-aware read views.",
            engineering:
              "Organize product workflows around typed APIs and persisted domain state rather than disconnected dashboard widgets.",
            recovery: "Invalid requests and unauthorized transitions are rejected by the API.",
            skill: "Full-stack CRM development & product modelling",
          },
          {
            title: "Bound the acquisition request",
            kind: "gate",
            summary: "Validate approved sources, input limits, and applicable request quotas.",
            tools: ["Zod", "Upstash Redis", "Express.js"],
            input: "An authorized request to acquire configured vehicle sources.",
            output: "A bounded acquisition command with allowed inputs.",
            engineering:
              "Keep source selection and resource limits under server control; Redis provides ephemeral counters rather than durable job truth.",
            recovery:
              "Configured rate-limit/quota failures fail closed; a cache miss or outage can fall back to persisted data.",
            skill: "Input boundaries & infrastructure failure semantics",
          },
          {
            title: "Launch an Apify Actor",
            kind: "integration",
            summary: "Start a private on-demand run instead of scraping inside the API request.",
            tools: ["Apify", "Node.js", "PostgreSQL"],
            input: "The approved acquisition command and durable run context.",
            output: "An Actor run reference attached to application metadata.",
            engineering:
              "Separate long-running acquisition from interactive APIs and give the Actor the current inventory-writing responsibility.",
            recovery:
              "A start/run failure stays visible through persisted run state and protected operational reconciliation.",
            skill: "Async integration architecture & execution ownership",
          },
        ],
      },
      {
        title: "Acquisition & durable data",
        description:
          "Turn approved external listings into validated, comparable, persisted inventory.",
        stages: [
          {
            title: "Run bounded source adapters",
            kind: "service",
            summary: "Fetch approved sources through shared scraping adapters.",
            tools: ["Apify", "Crawlee", "Cheerio"],
            input: "Approved source configuration and bounded Actor inputs.",
            output: "Candidate listing data and source/run diagnostics.",
            engineering:
              "Keep acquisition in reusable typed adapters with bounded navigation and source configuration.",
            recovery:
              "Source failures are classified and reported; the assistant cannot browse arbitrary sources or trigger a replacement scrape.",
            skill: "Browser/data acquisition & adapter design",
          },
          {
            title: "Normalize listing contracts",
            kind: "service",
            summary:
              "Validate and normalize external listing fields into comparable application data.",
            tools: ["TypeScript", "Zod", "Drizzle ORM"],
            input: "Source-specific candidate listings.",
            output: "Validated listings in the shared persistence shape.",
            engineering:
              "Keep data contracts explicit between source adapters, the Actor, and storage instead of leaking arbitrary scraped fields into the UI.",
            recovery:
              "Malformed data is handled at the validation boundary rather than silently becoming a trusted inventory record.",
            skill: "Typed data pipelines & schema boundaries",
          },
          {
            title: "Deduplicate & persist",
            kind: "data",
            summary: "Write inventory with stable identity and run-level idempotency.",
            tools: ["Neon", "PostgreSQL", "Drizzle ORM"],
            input: "Validated comparable listings and their source/run identities.",
            output: "Durable inventory records with controlled duplicate handling.",
            engineering:
              "Use PostgreSQL uniqueness and idempotency boundaries; the current Apify Actor is the inventory writer.",
            recovery:
              "Repeated runs or writes must respect persisted listing identity instead of creating unbounded duplicates.",
            skill: "Database integrity & ingestion idempotency",
          },
          {
            title: "Track run & source health",
            kind: "recovery",
            summary: "Expose acquisition state and reconciliation to authorized operators.",
            tools: ["PostgreSQL", "Pino", "Apify"],
            input: "Actor outcomes, source diagnostics, and persisted run metadata.",
            output: "Protected health, source status, and reconciliation views.",
            engineering:
              "Retain observability around external work without starting an undocumented always-on maintenance worker.",
            recovery:
              "Reconciliation is manual or externally schedulable, and failed runs remain diagnosable.",
            skill: "Operational visibility & recoverable integrations",
          },
        ],
      },
      {
        title: "Product intelligence",
        description:
          "Read durable data into dashboards, deterministic calculations, and authorized assistance.",
        stages: [
          {
            title: "Refresh persisted product views",
            kind: "interface",
            summary:
              "Show inventory, source status, and dealership records from the authorized API.",
            tools: ["React", "TanStack Query", "Neon"],
            input: "Persisted inventory and role-scoped business records.",
            output: "Dashboard views, comparisons, and source/run status.",
            engineering:
              "Keep dashboard reads grounded in durable records and refresh after acquisition instead of treating scraping output as browser state.",
            recovery:
              "Cache failures can use database-backed reads; Redis does not become the source of inventory truth.",
            skill: "Frontend data orchestration & consistent read models",
          },
          {
            title: "Compute trusted business facts",
            kind: "service",
            summary: "Calculate analytics and comparisons in SQL and application services.",
            tools: ["PostgreSQL", "TypeScript", "Drizzle ORM"],
            input: "Authorized inventory, lead, sales, and reporting records.",
            output: "Deterministic aggregates and bounded comparison results.",
            engineering:
              "Financial and operational calculations remain server-side; the model explains results rather than inventing arithmetic.",
            recovery:
              "Return only the data and comparisons the user's role and persisted records can support.",
            skill: "Analytics engineering & deterministic business logic",
          },
          {
            title: "Authorize the AI tools",
            kind: "gate",
            summary:
              "Validate assistant inputs and enforce the same row and role rules as normal APIs.",
            tools: ["Zod", "RBAC", "Upstash Redis"],
            input: "A bounded conversation, page context, and the user's authorized workspace.",
            output: "Permitted read-only tool calls with validated arguments.",
            engineering:
              "Tool queries preserve existing authorization; public product help and authenticated operational tools have different scopes.",
            recovery:
              "The assistant cannot execute SQL, mutate records, send email, or start scraping jobs.",
            skill: "Safe AI tool design & policy enforcement",
          },
          {
            title: "Explain with bounded fallbacks",
            kind: "ai",
            summary: "Combine curated knowledge and permitted tool results into a useful answer.",
            tools: ["Gemini API", "Groq", "OpenRouter"],
            input: "Public-safe knowledge or authorized deterministic tool results.",
            output: "A validated answer envelope grounded in allowed product and business data.",
            engineering:
              "Bound context, tool calls, timeouts, and provider fallback; suppress repeatedly failing providers through circuit state.",
            recovery:
              "When AI is disabled or unavailable, curated product help and the deterministic router remain useful.",
            skill: "Provider-neutral AI orchestration & graceful degradation",
          },
        ],
      },
    ],
    branches: [
      {
        title: "Document & email workflows",
        label: "CONFIGURED INTEGRATIONS",
        detail:
          "S3-backed documents and Resend transactional email support dealership workflows when the respective providers are configured.",
        tools: ["Amazon S3", "Resend", "Express.js"],
      },
      {
        title: "Ephemeral Redis layer",
        label: "CROSS-CUTTING",
        detail:
          "Upstash provides rate limits, AI quota counters, and short-lived cache-aside reads. Neon remains authoritative.",
        tools: ["Upstash Redis", "Neon", "PostgreSQL"],
      },
      {
        title: "AWS ingestion path",
        label: "RETAINED REFERENCE",
        detail:
          "An earlier SQS/Lambda ingestion implementation demonstrates queued acquisition, outbox publication, retry, and dead-letter handling.",
        tools: ["AWS SQS", "AWS Lambda", "Amazon S3"],
      },
      {
        title: "Queue worker architecture",
        label: "RETAINED ALTERNATIVE",
        detail:
          "The separate BullMQ/Redis/Azure worker path remains as an earlier deployment architecture. Current acquisition uses on-demand Apify runs.",
        tools: ["BullMQ", "Redis", "Azure VMs"],
      },
    ],
    strengths: [
      {
        title: "Bounded acquisition, durable results",
        evidence:
          "Approved source adapters, typed normalization, run identity, and database constraints connect scraping to usable product data.",
      },
      {
        title: "AI that preserves business boundaries",
        evidence:
          "Role-aware read tools, deterministic calculations, validated contracts, quotas, and provider fallbacks support the assistant.",
      },
      {
        title: "An architecture that can evolve",
        evidence:
          "The current Apify/Neon path is explicit while earlier queue-worker and AWS integrations remain separate reference implementations.",
      },
    ],
    context:
      "This map combines the acquisition path with CRM and optional read-only assistance. The current acquisition architecture uses Apify and Neon. AWS SQS/Lambda and BullMQ/Azure are retained alternatives, not hidden always-on workers.",
  },
};

export const getArchitectureFlow = (slug: string) =>
  projectArchitectures[slug].phases.flatMap((phase) =>
    phase.stages.map((stage) => ({ title: stage.title, detail: stage.summary })),
  );

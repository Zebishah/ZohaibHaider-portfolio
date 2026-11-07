# Project architecture walkthrough sources

The engineering explorer in `src/lib/projectArchitectures.ts` groups each project into three explanatory layers with twelve stages, four supporting systems, and three examples of engineering skills. Stages are conceptual groupings of implemented work, not a claim that every request executes a twelve-node pipeline. The existing `Project.flow` data is derived from these same stages.

Source repositories were inspected locally on 2026-11-07. No customer-scale, speed, revenue, or model-quality metrics are inferred from source code.

## Trace Ops

Repository: `Zebishah/TraceOps`, snapshot `97c40040f0ac9299766b3d5e831d726461c2b327`.

- `backend/src/ops_pilot/workflows/incident/graph.py` and `nodes.py`: authoritative graph routing, operational tool loop, approval interruption, controlled execution, verification, memory, and automation dispatch.
- `docs/project-knowledge/langgraph-workflow.md`: investigation state and workflow context.
- Backend services and package manifests: organization scoping, retrieval, ingestion, provider integrations, MCP/voice entry points, and isolated classifier training workspace.

The older `docs/architecture.md` describes LangGraph as a future phase; the implemented graph takes precedence. No separate reviewer/critic graph node is invented. Clarification, no-action, rejection, and approval paths are conditional. Public refund execution uses an internal simulated ledger, not a live payment-provider transfer. Automation acknowledgement is not evidence that downstream work completed. Voice is configuration dependent; training is isolated, with QLoRA dependent on supported CUDA hardware.

## HR Intelligence

Repository: `Zebishah/Hr-intercom`, snapshot `cfe74e70b59c1da482e3bb80856fa72d22ae7fe1`.

- `docs/ARCHITECTURE.md` and `docs/RECRUITER_EVIDENCE.md`: current Actor topology, case evidence, human review, and supported alternatives.
- `Intercom-app/backend/src/modules/ingestion/`: normalization, durable intake, Actor run state, error classification, and recovery.
- Backend directory, intelligence, Intercom, database, and dashboard implementations: employee matching, related cases, routing context, revision protection, persisted read models, and review.

Generic intake uses transactional ingestion/outbox; Intercom uses durable event/revision dispatch. They are grouped in the map without claiming identical mechanisms. Apify is the current processing path; BullMQ is a retained alternative. PostgreSQL owns durable case state; Redis holds ephemeral routing/directory/rate-limit data with database fallback. Human corrections survive routine subsequent analysis until explicit re-analysis. Read-only Ask CaseLens and fixture evaluation are supporting paths.

## DSP Marketplace

Repository: `Zebishah/dsp-marketplace`, snapshot `49266c96268e031350fbdfa030e2ad8a564c78bf`.

- `README.md`, `docs/ARCHITECTURE.md`, and client/server manifests: product surfaces and deployment stack.
- `server/src/services/financialOperationService.js` and `financialReconciliationService.js`: operation records, idempotency, and reconciliation.
- `server/src/services/outboxService.js`, `outboxReplay.js`, `outboxEmailWorker.js`, and `server/src/jobs/payoutJob.js`: durable delivery, replay, notification, and payout paths.
- GraphQL booking, payment, Stripe webhook, and account services: role/ownership checks, availability, booking transitions, checkout, charges, cancellations, refunds, and Connect payouts.

This is a booking and financial lifecycle map. Scheduled charging, cancellation, refund, and payout actions apply only when eligible; they are not mandatory steps for every booking. The assistant is a separate read-oriented product feature. No unsupported transaction-volume or business-impact metrics are displayed.

## RTA Marketing

Repository: `Zebishah/Rta-mark`, snapshot `67836d642f88996aa8ae3979ed9705db6f32714b`.

- `rta-marketing/docs/architecture/current-production.md`: current React/Express/Neon/Upstash/Apify topology and ownership of inventory writes.
- `rta-marketing/docs/architecture/ai-assistant.md`: authorized read tools, bounded contracts, deterministic answers, provider routing, and restrictions.
- API and Actor implementations: approved source adapters, normalized listing identity, quotas, persistence, diagnostics, and recovery.

The map combines acquisition, CRM read models, and optional assistant paths; assistance is not required for acquisition. Current scraped inventory writes belong to the on-demand Apify Actor. Neon remains authoritative; Upstash is ephemeral. Reconciliation is manual or externally schedulable, not an invented always-on worker. Gemini/Groq/OpenRouter are configured provider paths with bounded fallbacks. The assistant cannot mutate business data, start scrapes, send emails, execute arbitrary SQL, or browse arbitrary URLs. AWS SQS/Lambda and BullMQ/Redis/Azure are labelled retained references/alternatives rather than current production workers.

## Presentation and maintenance

Each stage supplies a summary, inputs, outputs, technologies, an engineering decision, recovery/boundary context, and a demonstrated skill. Supporting systems and conditional paths are labelled. `docs/project-stack-sources.md` documents the larger technology inventory separately. Update this evidence record and the corresponding stage data together when project architecture changes.

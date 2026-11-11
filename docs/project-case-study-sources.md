# Expanded project case studies

Reviewed on 11 November 2026. The connected GitHub app confirmed the identities,
private visibility, main-branch READMEs, and the commit-pinned README contents
for all four repositories. Each remote README blob matches the clean local
checkout used for implementation review. No commands from repository documents
were executed and no other project checkout was changed.

| Case study | Repository | Inspected commit | README blob |
| --- | --- | --- | --- |
| Trace Ops | `Zebishah/TraceOps` | `0191af0db3d7ac77a93aa306d0f5612730290a06` | `24d285f939be03774fb94f08fc501035790d5e83` |
| Case Lens | `Zebishah/CaseLens` | `210880414ee2f2520cdd2b8b53b97fe1dff249b8` | `e0ce27f48c95cfd5bdd239e7c19b5d16595cca60` |
| Drive Pilot | `Zebishah/DrivePilot` | `469cce1a73306af7e8ebc2b2590b94d79859c0a7` | `55ab437a0abaa257027dc0d3916b5938777084fc` |
| Dealer Flow | `Zebishah/DealerFlow` | `680e50c01c64a6116d0bd616174960169b2ba21e` | `f11cadcd090ad0873d98fd84299d628c18ebb8ac` |

## Sources reviewed

Trace Ops: current README, `backend/pyproject.toml`, implemented incident graph,
refund execution/recovery services, retrieval/approval/MCP/memory/voice tests,
classifier training/evaluation/serving entry points, and the project-knowledge
workflow, background-processing, and incident-memory documents. The older
architecture document's future-phase language does not override implemented
LangGraph code. Sensitive execution in the public refund demonstration is an
internal simulated ledger action, not a real payment-provider transfer.

Case Lens: current README, `docs/PRODUCT_AUDIT.md`,
`docs/RECRUITER_EVIDENCE.md`, backend/frontend manifests, intelligence processing,
revision/stale-result checks, employee matching, durable ingestion, directory
synchronization, assistant modules, and dashboard routes. The write-up keeps
adapter-specific ingestion mechanisms distinct and does not claim complete
multi-tenant isolation. Apify is current; BullMQ and inline are supported modes.

Drive Pilot: current README, `docs/ARCHITECTURE.md`,
`docs/BUSINESS_RULES_CANCEL_REFUND_PAYMENT_PAYOUT.md`, frontend/server manifests,
role-specific pages, financial operation identity/leases, webhook durability,
reconciliation, outbox/replay/email services, and their test files. The retained
legacy modules and multiple UI systems are not described as a completed rewrite.
Payments, scheduled charges, cancellations, refunds, and payouts are conditional
paths, and the product assistant is read-only.

Dealer Flow: current README, `rta-marketing/docs/PORTFOLIO.md`, current-production
and assistant architecture, database-performance audit, dealership API manifest,
acquisition/reconciliation/operations/session modules, and parser, integration,
browser, and accessibility test files. The current main branch contains the
product previously reviewed on portfolio-hardening. Apify/Neon/Upstash is the
current acquisition topology; BullMQ/Azure and SQS/Lambda are retained references.

## Content and UI maintenance

- `src/lib/projectCaseStudies.ts`: card overview/contribution/impact, detailed
  introduction, audience, engineering scope, six capability areas, decisions,
  quality/delivery notes, implementation outcomes, demo boundaries, and pinned
  source links for each project.
- `src/lib/projects.ts`: canonical metadata; short overview, role, and impact
  derive from the shared case-study copy.
- `src/lib/projectArchitectures.ts`: the existing detailed workflow maps. The
  case-study pages now expose each phase/stage, input, output, engineering
  decision, recovery context, technologies, and supporting path.
- `src/lib/projectStacks.ts`: the complete existing stack inventories. No tools
  were removed in this pass. Reference/alternative groups remain labelled in
  the card, expandable stack dialog, and full case study.
- `ProjectCaseStudy`: section navigation and expandable architecture stages.
- `ProjectsGrid`: Overview, My work, and Impact tabs; stack remains available
  while changing the story. Card text is outside 3D transforms; preview tilt
  remains confined to the visual. Short viewports use ordinary card scrolling.

Outcomes describe implemented product/engineering capabilities. No revenue,
customer volume, time savings, production model-quality improvement, passing
external test run, or performance percentage is inferred from repository code.

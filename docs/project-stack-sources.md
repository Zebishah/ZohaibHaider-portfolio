# Project stack inventory

Audited on 7 November 2026 from the four clean local project checkouts. The
portfolio cards and case studies share `src/lib/projectStacks.ts`; the flat
`project.stack` list is derived from those groups so the two views stay aligned.

The inventory includes direct runtime libraries, direct development tools,
documented services, and implemented engineering capabilities. Package families
are named for recruiters (for example `torch` → PyTorch and `@mui/material` →
Material UI). Standalone type declaration packages and internal workspace
imports are represented by TypeScript and their parent technologies. Lockfile
transitive dependencies are not presented as independently selected tools.

| Portfolio project | Repository snapshot                                            | Direct dependency entries checked | Displayed tools and techniques |
| ----------------- | -------------------------------------------------------------- | --------------------------------: | -----------------------------: |
| Trace Ops         | `Zebishah/TraceOps@97c40040f0ac9299766b3d5e831d726461c2b327`   |                                76 |                            131 |
| Case Lens         | `Zebishah/CaseLens@cfe74e70b59c1da482e3bb80856fa72d22ae7fe1`   |                                49 |                             77 |
| Drive Pilot       | `Zebishah/DrivePilot@49266c96268e031350fbdfa030e2ad8a564c78bf` |                                96 |                            117 |
| Dealer Flow       | `Zebishah/DealerFlow@67836d642f88996aa8ae3979ed9705db6f32714b` |                                54 |                             80 |

## Trace Ops

- `frontend/package.json`: frontend, UI libraries, Cloudflare/Vinext/Vite tools,
  React Server Components, Drizzle, and lint/build tooling.
- `backend/pyproject.toml`: API, agents, retrieval, infrastructure SDKs,
  authentication, build backend, and development dependency groups.
- `backend/finetuning/pyproject.toml` and `requirements.txt`: isolated training
  environment; the requirements explicitly mark bitsandbytes/CUDA as optional.
- `backend/finetuning/modal_app.py`, `train_classifier.py`, and `artifacts.py`:
  Modal, Qwen, Hugging Face Hub, adapter training, and serving integration.
- `backend/src/ops_pilot/services/voice.py`: Whisper and Orpheus providers.
- `README.md`, `frontend/README.md`, `backend/README.md`, and `.github/workflows/`:
  services, authorization, workflows, delivery, and verification.

The training group describes a separate configured environment, not evidence of
a production GPU/QLoRA run or model-quality result.

## Case Lens

- `Intercom-app/backend/package.json` and `frontend/package.json`: every direct
  application and development dependency, normalized by tool family.
- `README.md`, backend documentation, and Compose configuration: PostgreSQL,
  pgvector, trigram search, Intercom Canvas/webhooks, Gemini, Box, Upstash Redis,
  Apify, authentication, durable ingestion, deployment, and CI.

BullMQ and its optional Resend worker are shown as supported alternative paths.
The documented current background-execution architecture uses Apify.

## Drive Pilot

- `Frontend/package.json`: interface frameworks, state, GraphQL client, Stripe,
  maps, charts, documents, editors, carousels, utilities, and development tools.
- `server/package.json`: API, GraphQL, persistence, messaging, authentication,
  Stripe, AWS SDK, and supporting libraries.
- `docs/package.json`: VitePress documentation tooling.
- `README.md` and `server/src/modules/assistant/aiProvider.js`: product
  integrations, Elastic Email, Google/Facebook OAuth, Gemini-backed read-only
  assistance, scheduling, financial consistency, and verification.

## Dealer Flow

- `rta-marketing/package.json`, every `apps/*/package.json`, and every
  `packages/*/package.json`: all workspace application and development tools.
- `rta-marketing/README.md`, deployment/architecture documentation, and CI
  workflows: hosting, database, Redis responsibilities, and alternate runtimes.
- `apps/dealership-api/src/ai/provider.ts` and `services/email/email.service.ts`:
  implemented AI provider adapters and Resend integration.
- `apps/scraping-actor/src/index.ts` and `packages/scrapers/src/`: Apify uses the
  shared Cheerio/Crawlee adapters; these are included with the scraping tools,
  rather than incorrectly labelling them as legacy-only.

The AWS SQS/Lambda reference path and BullMQ/Azure worker architecture are marked
as alternatives. The documented current acquisition flow uses Apify and Neon.

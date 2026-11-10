# Portfolio content and asset provenance

This implementation uses the user's résumé, additional skills, personal-project description, original portrait, repository implementations, and public product walkthroughs. Repository documents supplied facts for the portfolio; their embedded operational instructions were not executed.

## Sources

- Supplied `Zohaib_Haider_Resume.pdf`: Jidat IT role and dates, 12+ commercial applications, 4+ payment-integrated applications, education, CGPA, and the software/cloud stack. The downloadable file is an unchanged copy at `public/resume.pdf`.
- User's portfolio brief: 16–18 total projects, additional applied-AI skills, four featured repositories, contact details, and the selected cream/forest-green hero direction. The public statistic uses the conservative **16+ total projects**; commercial work is described separately.
- [Trace Ops](https://github.com/Zebishah/TraceOps): dependency manifests; incident workflow graph; operational and approval services; fine-tuning modules; tests; project-knowledge documents; voice/fine-tuning implementation notes. The initial README labels many capabilities as planned, so descriptions were checked against the implementation and later documentation.
- [Case Lens](https://github.com/Zebishah/CaseLens): README, Intercom/identity/intelligence modules, processing code, dependency manifests, and `docs/RECRUITER_EVIDENCE.md`.
- [Drive Pilot](https://github.com/Zebishah/DrivePilot): manifests, architecture and payment documentation, booking state-machine code, financial/outbox/cache services, and their test structure.
- [Dealer Flow, portfolio-hardening branch](https://github.com/Zebishah/DealerFlow/tree/portfolio-hardening): current-production and overview architecture documents, AI assistant architecture, typed dealership API manifest, and acquisition/queue-worker structure. The repository's default `main` branch is an older implementation; the portfolio branch contains the current demo architecture.

GitHub repository identities and access were checked using the connected GitHub app. All four repositories were private at implementation time. The cards and case studies label that access requirement; live demos remain public links.

## Important distinctions preserved in the copy

- Trace Ops implements agentic investigation, RAG, scoped operational tools, approval/verification, incident memory, background processing, and an isolated fine-tuning pipeline. No production classifier-quality improvement, model benchmark, traffic volume, or customer SLA is invented. Recorded voice I/O is configuration-dependent, rather than a claimed continuous real-time assistant.
- Case Lens is an **HR case intelligence and support workflow** integrated with Intercom, rather than a recruitment or résumé-screening product. Its public reviewer data is synthetic. Apify is the active background-processing path; BullMQ/Redis is retained as an alternative.
- Drive Pilot covers student/instructor/admin scheduling, messaging, and payments. Stripe capabilities describe implemented paths, not unverified transaction counts or public revenue.
- Dealer Flow's current deployment uses on-demand Apify, PostgreSQL, and ephemeral Redis. The SQS/Lambda and BullMQ/Azure code is described as retained earlier architecture, not the live default.
- No client logos, testimonials, invented skill percentages, conversion improvements, or fabricated outcome metrics were added.

## Assets

- `public/images/zohaib-haider.png` is an unchanged copy of the user's **Charcoal suit portrait with stylish glasses.png**. Its SHA-256 was compared with the source. The browser applies clipping, scaling, and 3D positioning; no generative edit was made to the face or eyes.
- `public/projects/{trace-ops,case-lens,drive-pilot,dealer-flow}.png` were refreshed from the working public demos on 2026-11-08. Preview wordmarks reflect the user-authorized names; the underlying interfaces and synthetic records are unchanged. Live deployments may still display earlier names. Former cover paths remain copies of the updated previews for compatibility.
- Manrope and Barlow Condensed are self-hosted in `public/fonts`. Google Fonts source CSS and the corresponding OFL license files are retained there.
- The skills sculpture is procedural Three.js geometry. Its React Three Fiber chunk is loaded on the client when the artwork enters the viewport. CSS artwork remains available if WebGL cannot render.

## Content maintenance

- Canonical case studies use `/projects/trace-ops`, `/projects/case-lens`, `/projects/drive-pilot`, and `/projects/dealer-flow`. Former paths permanently redirect to their renamed case studies. GitHub links use the verified renamed `Zebishah/TraceOps`, `Zebishah/CaseLens`, `Zebishah/DrivePilot`, and `Zebishah/DealerFlow` repositories. Live demo links use the replacement deployments supplied by the user: `trace-ops-pearl.vercel.app`, `case-lens-amber.vercel.app`, `drive-pilot-topaz.vercel.app`, and `dealer-flow-kappa.vercel.app`.

- `src/lib/projects.ts`: the four case studies, exact GitHub/live URLs, stack, capability boundaries, and interactive workflow stages.
- `src/lib/skills.ts`: categorized, searchable tools and engineering techniques from the résumé and additional skills. The displayed total is computed, not separately hard-coded.
- `src/lib/socials.ts`: portrait, résumé, email, phone, WhatsApp, GitHub, and LinkedIn destinations.
- `src/components/portfolio/Experience.tsx`: résumé employment and education dates.

## Motion references

The visual composition follows the user's reference. Implementation research included the [Codrops 3D carousel study](https://tympanus.net/Development/3DCarousel/), [Motion scroll-linked animation documentation](https://motion.dev/docs/react-use-scroll), and the [React Three Fiber Canvas documentation](https://r3f.docs.pmnd.rs/api/canvas). The page uses its own composition and code, not a copied template.

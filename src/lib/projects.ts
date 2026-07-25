export type Project = {
  slug: string;
  title: string;
  tagline: string;
  overview: string;
  role: string;
  stack: string[];
  features: string[];
  impact: string;
  github?: string;
  demo?: string;
  accent: [string, string];
};

export const projects: Project[] = [
  {
    slug: "dsp",
    title: "DSP — Driving School Platform",
    tagline: "Full-stack booking & payments marketplace connecting students, instructors, and admins.",
    overview:
      "DSP connects students, driving instructors, and admins in one place. Students find instructors, book lessons, pay online, track progress, and leave reviews. Instructors manage availability, bookings, students, payouts, and ratings. Admins oversee users, documents, payments, refunds, and platform analytics. A booking + payments marketplace with Stripe-powered checkout, delayed (T-48) charges, refunds, instructor payouts, reminders, and timezone-aware scheduling.",
    role: "Full-stack developer — built frontend dashboards, GraphQL/API work, the entire Stripe payment lifecycle (checkout, T-48 delayed charge, refunds, payouts, webhooks), booking status logic, analytics, and UX consistency across Admin/Instructor/Student panels. Built solo, end to end.",
    stack: ["React 18", "TypeScript", "Vite", "Apollo Client", "Redux Toolkit", "Tailwind CSS", "MUI", "Ant Design", "ApexCharts", "React Hook Form", "Zod", "Node.js", "Express", "Apollo Server", "MongoDB", "Mongoose", "JWT", "Passport OAuth", "Socket.io", "Nodemailer", "Stripe", "AWS SDK"],
    features: [
      "Multi-role dashboards for Student, Instructor, and Admin with distinct workflows",
      "Full Stripe lifecycle: checkout, T-48 delayed charging, reminders, auto-cancel, manual refunds synced to Stripe, instructor payout timing",
      "Booking workflow with reschedule-as-slot-transfer, abandoned checkout handling, consistent status tracking",
      "Real-time chat and notifications via WebSockets and GraphQL subscriptions",
      "Timezone-aware scheduling showing local time + Europe/Zurich business time",
      "Admin analytics with independent per-graph filters and KPI cards",
      "Secure auth with JWT + Google/Facebook OAuth",
    ],
    impact:
      "Unified booking/payment status language across all three dashboards eliminated confusion. The T-48 + reminder + auto-cancel system reduced unpaid slots sitting as false 'upcoming' lessons. Independent analytics filters let admins get insights without full reloads. Dual timezone display removed confusion for international users.",
    github: "https://github.com/jidatit/dsp-demo",
    demo: "https://dsp-demo.onrender.com",
    accent: ["#6366f1", "#06b6d4"],
  },
  {
    slug: "pde",
    title: "PDE — Practice/Dental Equipment Management",
    tagline: "Multi-tenant SaaS helping dental & medical clinics manage equipment, compliance, and billing.",
    overview:
      "PDE helps practices organize facilities, rooms, and equipment, schedule and track maintenance tasks for compliance, manage subscriptions and billing, and upload documents for admin review. Clinics map their office hierarchy (building → room → machine), get maintenance checklists on each machine, stay on top of overdue work, pay for a plan (Basic/Pro), and keep licenses and paperwork in one place.",
    role: "Full-stack developer — designed and built the entire product end to end, solo: frontend UI, Express API, database schema, auth flows, Stripe billing, admin and clinic dashboards, and full technical + client-facing documentation.",
    stack: ["React 19", "TypeScript", "Vite", "TanStack Query", "Tailwind CSS", "Framer Motion", "shadcn/ui", "Node.js", "Express 5", "Zod", "Winston", "Supabase", "PostgreSQL", "Stripe", "AWS S3", "VitePress"],
    features: [
      "Public pricing page and 4-step clinic signup (Account → Plan → Payment → Magic link)",
      "Facility/room/equipment hierarchy management with plan-based limits",
      "Maintenance task tracking with overdue flags, proof uploads, and compliance scoring",
      "Full Stripe billing: plan changes, cancellations, invoices, payment methods",
      "Document upload and admin approval workflow",
      "Admin platform: KPIs, equipment template library, Kanban task board, staff management",
      "RBAC (admin/clinic/staff) with JWT cookie sessions",
      "Automated daily cron jobs for overdue task tracking",
      "Full technical and client documentation site built with VitePress",
    ],
    impact:
      "Delivered a complete multi-tenant SaaS product solo — from database schema through Stripe billing to deployed UI and documentation. Automated compliance scoring and overdue task tracking removed manual overhead for clinic staff.",
    github: "https://github.com/jidatit/PDE-demo",
    demo: "https://pde-demo.onrender.com",
    accent: ["#8b5cf6", "#ec4899"],
  },
  {
    slug: "daizer",
    title: "Daizer — B2B Wallet-Based Top-Up Platform",
    tagline: "Wallet-funded B2B commerce with PayPal top-ups, tiered pricing, and live Zoho Books sync.",
    overview:
      "Daizer is a dual-dashboard commerce app where invited B2B customers fund a prepaid USD wallet via PayPal, browse a catalog of digital game/service top-ups, and place orders. Admins manage users, tiered pricing, catalog, wallets, refunds, external fulfillment providers, and platform configuration. Money and catalog events sync automatically into Zoho Books.",
    role: "Full-stack developer on a small team, building across the entire flow: authentication, catalog, wallet/checkout, and Zoho Books integration.",
    stack: ["React 19", "TypeScript", "Vite", "TanStack Query", "Redux Toolkit", "Tailwind CSS", "shadcn/ui", "Express 5", "Drizzle ORM", "PostgreSQL", "JWT", "Redis", "AWS S3", "Docker", "PayPal API", "Zoho Books API", "Swagger"],
    features: [
      "Invite-only B2B onboarding via admin-generated signup links tied to pricing groups",
      "PayPal wallet top-up flow (create → approve → capture) with webhook handling",
      "Nested catalog with per-pricing-group pricing and provider bindings",
      "Dual order fulfillment: automatic via external API, or manual queue when providers are offline",
      "Deep Zoho Books integration — OAuth, contacts, items, price books, orders, invoices, credit notes, wallet journals",
      "Admin wallet ops: credit/debit adjustments, refund approval",
      "Redis caching, S3 image uploads, SMTP-templated emails",
      "Fully Dockerized deployment (nginx client + API)",
    ],
    impact:
      "Built a production-style platform spanning auth, catalog, wallet, checkout, and live accounting sync. The dual fulfillment path keeps the business selling even when external providers go offline.",
    github: "https://github.com/JidatItDev/Daizer",
    accent: ["#f59e0b", "#ef4444"],
  },
  {
    slug: "karim-lms",
    title: "KARIM LMS — Security Awareness LMS",
    tagline: "B2B security-awareness training with seat-based licensing and simulated phishing campaigns.",
    overview:
      "KARIM LMS is a B2B security-awareness learning management system for MSPs and partners. Organizations onboard companies, assign seat-based training licenses, deliver interactive courses, run simulated phishing campaigns, handle billing/invoices, and track learner engagement — all through role-specific dashboards.",
    role: "Full-stack developer — shipped features across the React SPA and Node API, including RBAC dashboards, phishing campaign management, licensing/billing, and analytics.",
    stack: ["React 18", "Vite", "MUI", "TanStack Query", "Formik", "ApexCharts", "H5P", "Node.js", "Express 5", "Sequelize", "MySQL", "JWT", "Redis", "Microsoft Entra ID", "GoPhish", "AWS S3"],
    features: [
      "Five role dashboards (Admin, Contributor, Group Leader, Learner, Support) with 40+ granular permissions",
      "Multiple auth methods: password, passwordless OTP, and Microsoft SSO",
      "Interactive course delivery using H5P content with lesson progress tracking",
      "Multi-tenant org model: companies → groups → members with CSV bulk import",
      "Licensing & commerce: bundles, seat pools, discounts, checkout, seat assignment",
      "Automated invoicing with PDF generation and S3 storage",
      "Simulated phishing campaigns via GoPhish — templates, landing pages, cron-scheduled",
      "Automated Handlebars email via Microsoft Graph",
      "Built-in helpdesk with tickets, categories, and agent dashboards",
      "Analytics dashboard tracking registrations, seat usage, and course completion",
      "White-label branding (logo/favicon upload with ICO conversion)",
    ],
    impact:
      "Delivered an enterprise-grade B2B SaaS with real seat economics (purchased vs. allocated), automated phishing campaign scheduling, and Microsoft identity integration.",
    github: "https://github.com/jidatit/lms-demo",
    demo: "https://lms-demo-ss02.onrender.com",
    accent: ["#10b981", "#3b82f6"],
  },
  {
    slug: "cardlock",
    title: "CardLock — Fuel Card Management Platform",
    tagline: "Enterprise fuel-card operations with live SOAP integrations & QuickBooks billing sync.",
    overview:
      "CardLock is an enterprise WEX fuel-card operations platform. Admins and end users manage fuel cards in real time, run transaction/tax/status reports, set custom pricing and margins, schedule automated report delivery, and sync billing with QuickBooks — all through a web app backed by live WEX SOAP APIs. Built as part of a multi-developer team.",
    role: "Full-stack engineer on a multi-developer team, contributing to the admin/user portals, WEX card operations features, reporting suite, and QuickBooks integration work.",
    stack: ["React 19", "TypeScript", "Vite 7", "Tailwind CSS", "TanStack Query", "Redux Toolkit", "Express 5", "PostgreSQL", "Drizzle ORM", "JWT", "WEX SOAP API", "QuickBooks API", "AWS S3", "ExcelJS", "PDFKit", "Swagger"],
    features: [
      "Live WEX SOAP integration for real-time fuel card lookup, status, PIN reset, limits, and authorization",
      "Card-to-user assignment with full audit trail",
      "On-demand and scheduled reporting suite with email delivery and short-lived S3 pre-signed links",
      "Custom pricing and margin engine with state/province-level rules",
      "QuickBooks OAuth integration for customer and invoice sync",
      "Background WEX session keep-alive scheduler",
      "Role-based access with bulk user management",
    ],
    impact:
      "Replaced long-lived stored S3 URLs with short-TTL pre-signed downloads. Automated scheduled report generation reduced manual reporting work. Persistent WEX session monitoring kept APIs available without manual re-authentication.",
    github: "https://github.com/jidatit/Cardlock-Demo",
    demo: "https://cardlock-demo.onrender.com",
    accent: ["#0ea5e9", "#22d3ee"],
  },
  {
    slug: "taskflow",
    title: "TaskFlow — Multi-Tenant Kanban Workspace",
    tagline: "Trello/Linear-style team collaboration with workspaces, drag-and-drop boards, and job queues.",
    overview:
      "TaskFlow is a multi-tenant workspace collaboration and Kanban task management app — a lighter Trello/Linear-style product. Teams create workspaces, invite members, organize projects with custom columns, and manage tasks on a drag-and-drop board with due dates, assignees, priorities, and automated email reminders.",
    role: "Full-stack engineer, solo — owned the architecture, API, UI, auth, background job queues, database schema, and full test suite end to end.",
    stack: ["NestJS 11", "TypeScript", "React 19", "Vite", "Tailwind CSS 4", "TanStack Query", "PostgreSQL 17", "Drizzle ORM", "Redis 7", "BullMQ", "Resend", "JWT", "@dnd-kit", "Docker", "Jest", "Vitest", "Cypress"],
    features: [
      "Full auth: register/login/logout, bcrypt, JWT + rotating refresh tokens (hashed), httpOnly cookies, auto refresh with request deduping",
      "Multi-tenant workspaces with RBAC (owner/admin/member) enforced via guards",
      "Invitations: invite by email, resend/cancel, public accept/decline via token, async through BullMQ with idempotency",
      "Full project CRUD with soft-delete and restore",
      "Custom per-project Kanban columns (name, color, position), restricted to owner/admin",
      "Drag-and-drop Kanban board with rich task details",
      "Background jobs: invitation-email worker + due-date reminder worker with auto-scheduling",
      "Redis health checks and Bull Board for queue inspection",
      "Full test pyramid: Jest, Vitest + Testing Library, Cypress E2E",
      "Clean monorepo (npm workspaces), versioned API prefix, health endpoint",
      "~23k lines TS across ~200 files, fully containerized local infra",
    ],
    impact:
      "Built a production-grade collaboration tool solo — including rotating refresh-token sessions, RBAC-guarded routes, non-blocking async email via job queues, and a real automated test suite spanning unit, integration, component, and E2E layers.",
    github: "https://github.com/Zebishah/taskflow-og",
    accent: ["#a855f7", "#f472b6"],
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);

import {
  ArrowUpRight,
  BrainCircuit,
  BriefcaseBusiness,
  CreditCard,
  GraduationCap,
  Layers3,
  Rocket,
} from "lucide-react";
import { projects } from "@/lib/projects";
import { socials } from "@/lib/socials";
import { Reveal } from "./Reveal";
import { PortraitCard } from "./PortraitCard";
import "./About.css";

const capabilities = [
  {
    icon: Layers3,
    label: "01 / PRODUCT & PLATFORM",
    title: "Interfaces backed by real systems.",
    description:
      "Role-based dashboards, multi-tenant APIs, and connected business workflows—from React and Next.js to Node.js, NestJS, and FastAPI.",
    tools: ["TypeScript", "React / Next.js", "REST / GraphQL", "RBAC"],
    href: "#work",
    link: "Explore the products",
  },
  {
    icon: BrainCircuit,
    label: "02 / APPLIED AI",
    title: "Intelligence with a path to action.",
    description:
      "LangGraph agents, grounded retrieval, scoped tools, and human approvals. My AI work also includes voice interfaces and isolated LoRA fine-tuning pipelines.",
    tools: ["LangGraph", "RAG / Qdrant", "Human-in-the-loop", "LoRA"],
    href: "#systems",
    link: "Follow the AI architecture",
  },
  {
    icon: CreditCard,
    label: "03 / DATA & FINANCIAL WORKFLOWS",
    title: "Correctness beyond the happy path.",
    description:
      "Payment lifecycles, signed webhooks, and recoverable background work, with idempotency, guarded state transitions, and reconciliation built into the flow.",
    tools: ["PostgreSQL / MongoDB", "Stripe / PayPal", "Redis / BullMQ", "Outbox pattern"],
    href: "#systems",
    link: "Inspect the engineering",
  },
  {
    icon: Rocket,
    label: "04 / DELIVERY & OPERATIONS",
    title: "Ownership through deployment.",
    description:
      "System design, schema modelling, automated tests, and CI/CD—connecting feature development with cloud deployment, debugging, and production troubleshooting.",
    tools: ["Docker / AWS", "GitHub Actions", "Playwright / Jest", "Observability"],
    href: "#experience",
    link: "See my experience",
  },
];

const stats = [
  {
    value: "2+",
    label: "Years of professional experience",
    detail: "Full-stack development",
    href: "#experience",
  },
  {
    value: "12+",
    label: "Production applications delivered",
    detail: "Across five business domains",
    href: "#experience",
  },
  {
    value: "4+",
    label: "Applications with payment integrations",
    detail: "Payments & accounting workflows",
    href: "#work",
  },
  {
    value: String(projects.length).padStart(2, "0"),
    label: "Detailed project case studies",
    detail: "Product, architecture & implementation",
    href: "#systems",
  },
];

export function About() {
  return (
    <section className="about-section section-wrap" id="about" aria-labelledby="about-title">
      <div className="section-label">
        <span>01 / THE ENGINEER BEHIND THE WORK</span>
        <span>PRODUCT VISION. TECHNICAL DEPTH. END-TO-END DELIVERY.</span>
      </div>
      <div className="about-profile-grid">
        <Reveal className="about-profile">
          <PortraitCard className="about-portrait-card" />
          <div className="about-degree">
            <GraduationCap size={20} />
            <div>
              <strong>BS Software Engineering</strong>
              <span>IIUI · 3.66 / 4.00 CGPA</span>
            </div>
          </div>
        </Reveal>
        <Reveal className="about-positioning">
          <p className="eyebrow">
            <span /> FULL-STACK ENGINEERING · APPLIED AI · SYSTEM DESIGN
          </p>
          <h2 id="about-title">
            Product thinking.
            <br />
            <span className="serif-word">Engineering depth.</span>
          </h2>
          <p className="about-profile-lead">
            I connect product thinking with full-stack engineering to help businesses manage
            workflows, understand their data, and put AI to practical use.
          </p>
          <p>
            I’m Zohaib. Over two years at Jidat IT, I contributed to{" "}
            <strong>12+ commercial applications</strong> across SaaS, fintech, healthcare,
            marketplaces, and CRM. I build websites and dashboards with React/Next.js, supported by
            Node.js/NestJS and Python/FastAPI services, PostgreSQL, MongoDB, and Redis.
          </p>
          <p>
            My backend work covers{" "}
            <strong>
              multi-tenant RBAC, REST/GraphQL APIs, and payment and accounting integrations
            </strong>
            . I design background processing around outbox records, idempotency, queues, and retries
            so teams can recover from partial failures and keep business workflows consistent.
          </p>
          <p>
            My AI work includes{" "}
            <strong>
              Trace Ops, a RAG and LangGraph agent system with tool calling and human approval
            </strong>
            . I also build voice interfaces and automation, and I’m exploring LoRA/QLoRA
            fine-tuning.
          </p>
          <div className="about-principle">
            <BriefcaseBusiness size={19} />
            <div>
              <span>WHAT I BRING TO YOUR TEAM OR PRODUCT</span>
              <p>
                I take features from idea to production: designing the system, building the frontend
                and backend, testing, and deploying on AWS with Docker and CI/CD.
              </p>
            </div>
          </div>
          <div className="about-profile-actions">
            <a href="#contact" className="about-contact-link">
              Let’s build your next system <ArrowUpRight size={17} />
            </a>
            <a href={socials.resume} target="_blank" rel="noreferrer" className="about-resume-link">
              View my résumé <ArrowUpRight size={16} />
            </a>
          </div>
        </Reveal>
      </div>
      <Reveal className="about-evidence">
        <div className="about-evidence-heading">
          <p className="eyebrow">EXPERIENCE, IN CONTEXT</p>
          <span>Commercial work at Jidat IT · Selected project case studies</span>
        </div>
        <div className="about-evidence-grid">
          {stats.map((stat) => (
            <a className="about-evidence-stat" href={stat.href} key={stat.label}>
              <div>
                <strong>{stat.value}</strong>
                <ArrowUpRight size={19} />
              </div>
              <h3>{stat.label}</h3>
              <p>{stat.detail}</p>
            </a>
          ))}
        </div>
      </Reveal>
      <div className="about-capabilities" aria-labelledby="about-capabilities-title">
        <Reveal className="about-capabilities-heading">
          <div>
            <p className="eyebrow">BREADTH THAT CONNECTS. DEPTH THAT DELIVERS.</p>
            <h3 id="about-capabilities-title">
              One engineer. <span className="serif-word">Across the whole build.</span>
            </h3>
          </div>
          <a href="#systems">
            See the engineering in practice <ArrowUpRight size={16} />
          </a>
        </Reveal>
        <div className="about-capability-grid">
          {capabilities.map((capability, index) => {
            const Icon = capability.icon;
            return (
              <Reveal key={capability.title} className="about-capability-card" delay={index * 0.05}>
                <div className="about-capability-top">
                  <Icon size={21} />
                  <span>{capability.label}</span>
                </div>
                <h4>{capability.title}</h4>
                <p>{capability.description}</p>
                <ul aria-label={capability.title + " technologies"}>
                  {capability.tools.map((tool) => (
                    <li key={tool}>{tool}</li>
                  ))}
                </ul>
                <a href={capability.href}>
                  {capability.link}
                  <ArrowUpRight size={14} />
                </a>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

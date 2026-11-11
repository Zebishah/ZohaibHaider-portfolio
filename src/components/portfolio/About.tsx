import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { animate, useInView } from "framer-motion";
import { Link } from "@tanstack/react-router";
import {
  ArrowDown,
  ArrowUpRight,
  Blocks,
  BrainCircuit,
  BriefcaseBusiness,
  Check,
  CheckCheck,
  CircleCheck,
  Code2,
  CreditCard,
  Database,
  GitBranch,
  GraduationCap,
  Layers3,
  MapPin,
  Network,
  Rocket,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";
import { projects } from "@/lib/projects";
import { socials } from "@/lib/socials";
import { usePortfolioMotion } from "./Motion";
import "./About.css";

const stats = [
  {
    value: 12,
    suffix: "+",
    label: "Commercial applications",
    detail: "Contributed to at Jidat IT",
    icon: BriefcaseBusiness,
    href: "#experience",
  },
  {
    value: 20,
    suffix: "+",
    label: "Projects across my journey",
    detail: "Commercial work + personal builds",
    icon: Blocks,
    href: "#work",
  },
  {
    value: 2,
    suffix: "+",
    label: "Years of professional work",
    detail: "Full-stack development · 2024–2026",
    icon: Code2,
    href: "#experience",
  },
  {
    value: 5,
    suffix: "+",
    label: "Payment-integrated applications",
    detail: "Payments, accounting & financial flows",
    icon: CreditCard,
    href: "#work",
  },
];

const focusAreas = [
  {
    id: "platforms",
    icon: Layers3,
    tab: "Product platforms",
    number: "01",
    title: "A good interface deserves a great system.",
    description:
      "I connect the experience people see with the services, permissions, and data that make it work. The result is a product whose parts actually fit together.",
    points: [
      "Role-aware dashboards and multi-tenant workflows",
      "Typed APIs and carefully modelled business data",
      "Frontend and backend decisions made together",
    ],
    tools: ["React / Next.js", "Node.js / NestJS", "PostgreSQL", "REST / GraphQL"],
    flow: [
      {
        icon: Code2,
        title: "The experience",
        detail: "Clear interfaces. Workflows that make sense.",
      },
      { icon: Network, title: "The application", detail: "Typed APIs, roles, and business rules." },
      {
        icon: Database,
        title: "The foundation",
        detail: "Persistent data and purposeful caching.",
      },
    ],
    project: "dealer-flow",
    proof: "Connected CRM and vehicle intelligence",
  },
  {
    id: "ai",
    icon: BrainCircuit,
    tab: "Applied AI",
    number: "02",
    title: "Intelligence that can do something useful.",
    description:
      "I build AI into a defined workflow: retrieve the right context, reason with tools, ask for approval when it matters, and verify what happened. My wider AI work includes voice interfaces and LoRA/QLoRA fine-tuning pipelines.",
    points: [
      "Grounded answers with retrieval and source evidence",
      "Stateful agents with scoped operational tools",
      "Human approval before sensitive actions",
    ],
    tools: ["LangGraph", "RAG / Qdrant", "FastAPI", "MCP", "LoRA / QLoRA"],
    flow: [
      {
        icon: Database,
        title: "Retrieve evidence",
        detail: "Tenant-scoped knowledge and live context.",
      },
      {
        icon: BrainCircuit,
        title: "Reason with tools",
        detail: "A stateful LangGraph investigation.",
      },
      {
        icon: ShieldCheck,
        title: "Approve & verify",
        detail: "Human control and checked outcomes.",
      },
    ],
    project: "trace-ops",
    proof: "Evidence-backed incident investigation",
  },
  {
    id: "reliability",
    icon: ShieldCheck,
    tab: "Reliable workflows",
    number: "03",
    title: "The edge cases are part of the product.",
    description:
      "Payments, bookings, and background jobs need more than a successful first request. I design for duplicate events, partial failures, retries, and recovery.",
    points: [
      "Idempotent payment and webhook processing",
      "Explicit state transitions and durable events",
      "Queues, reconciliation, and recovery paths",
    ],
    tools: ["Stripe / PayPal", "Redis / BullMQ", "Outbox pattern", "PostgreSQL / MongoDB"],
    flow: [
      {
        icon: GitBranch,
        title: "Guard the transition",
        detail: "Validate the state and the operation.",
      },
      { icon: CreditCard, title: "Execute once", detail: "Idempotent financial operations." },
      {
        icon: CheckCheck,
        title: "Recover & reconcile",
        detail: "Durable events and consistent records.",
      },
    ],
    project: "drive-pilot",
    proof: "Bookings connected to the payment lifecycle",
  },
  {
    id: "delivery",
    icon: Rocket,
    tab: "End-to-end delivery",
    number: "04",
    title: "Stay with the work. All the way to delivery.",
    description:
      "I like understanding the whole product. I work across requirements, system design, implementation, testing, and deployment, with production behavior in mind.",
    points: [
      "Translate product requirements into a technical plan",
      "Build and test the complete feature flow",
      "Connect development with deployment and debugging",
    ],
    tools: ["Docker / AWS", "CI/CD", "Integration testing", "Playwright / Jest"],
    flow: [
      {
        icon: Blocks,
        title: "Understand & design",
        detail: "Requirements, contracts, and data models.",
      },
      { icon: Code2, title: "Build & test", detail: "The interface, the API, and the edge cases." },
      { icon: Rocket, title: "Ship & improve", detail: "Deployment, debugging, and iteration." },
    ],
    project: "case-lens",
    proof: "Intelligence inside the HR support workflow",
  },
];

function CountUp({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const played = useRef(false);
  const { enabled } = usePortfolioMotion();
  useEffect(() => {
    const element = ref.current;
    if (!element || !inView || !enabled || played.current) return;
    played.current = true;
    const controls = animate(0, value, {
      duration: 1.25,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        element.textContent = String(Math.round(latest));
      },
    });
    return () => {
      controls.stop();
      element.textContent = String(value);
    };
  }, [enabled, inView, value]);
  return (
    <span ref={ref} aria-hidden="true">
      {value}
    </span>
  );
}

function EngineeringExplorer() {
  const [selected, setSelected] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "100px" });
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const focus = focusAreas[selected];
  const project = projects.find((item) => item.slug === focus.project)!;

  function navigate(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % focusAreas.length;
    else if (event.key === "ArrowLeft") next = (index - 1 + focusAreas.length) % focusAreas.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = focusAreas.length - 1;
    else return;
    event.preventDefault();
    setSelected(next);
    tabs.current[next]?.focus();
  }

  return (
    <div
      className="about-craft"
      aria-labelledby="about-craft-title"
      ref={ref}
      data-in-view={inView}
    >
      <div className="about-craft-heading">
        <div>
          <p className="about-kicker">
            <span /> THE WAY I BUILD
          </p>
          <h3 id="about-craft-title">
            Different layers.
            <br />
            <span>One connected product.</span>
          </h3>
        </div>
        <p>
          Explore the thinking behind the work.
          <br />
          Then see it in a real project.
        </p>
      </div>
      <div className="about-craft-tabs" role="tablist" aria-label="Engineering focus">
        {focusAreas.map((area, index) => {
          const Icon = area.icon;
          return (
            <button
              key={area.id}
              type="button"
              role="tab"
              id={`about-tab-${area.id}`}
              aria-selected={selected === index}
              aria-controls="about-craft-panel"
              tabIndex={selected === index ? 0 : -1}
              ref={(element) => {
                tabs.current[index] = element;
              }}
              onClick={() => setSelected(index)}
              onKeyDown={(event) => navigate(event, index)}
            >
              <Icon size={19} aria-hidden="true" />
              <span>{area.tab}</span>
              <small>{area.number}</small>
            </button>
          );
        })}
      </div>
      <div
        className="about-craft-panel"
        role="tabpanel"
        id="about-craft-panel"
        aria-labelledby={`about-tab-${focus.id}`}
        tabIndex={0}
      >
        <div className="about-craft-content" key={focus.id}>
          <div className="about-craft-story">
            <span className="about-craft-index">{focus.number} / THE APPROACH</span>
            <h4>{focus.title}</h4>
            <p>{focus.description}</p>
            <ul className="about-craft-points">
              {focus.points.map((point) => (
                <li key={point}>
                  <CircleCheck size={16} aria-hidden="true" />
                  {point}
                </li>
              ))}
            </ul>
            <ul className="about-craft-tools" aria-label={`${focus.tab} technologies`}>
              {focus.tools.map((tool) => (
                <li key={tool}>{tool}</li>
              ))}
            </ul>
          </div>
          <div className="about-system-view">
            <div className="about-system-heading">
              <span>
                <Workflow size={16} aria-hidden="true" /> THE CONNECTED VIEW
              </span>
              <i aria-hidden="true">
                <b />
                <b />
                <b />
              </i>
            </div>
            <ol className="about-system-flow">
              {focus.flow.map((step, index) => {
                const Icon = step.icon;
                return (
                  <li key={step.title}>
                    <span className="about-flow-icon">
                      <Icon size={21} aria-hidden="true" />
                    </span>
                    <div>
                      <span>0{index + 1}</span>
                      <strong>{step.title}</strong>
                      <p>{step.detail}</p>
                    </div>
                    <Check size={14} className="about-flow-check" aria-hidden="true" />
                  </li>
                );
              })}
            </ol>
            <Link
              className="about-project-proof"
              to="/projects/$slug"
              params={{ slug: project.slug }}
            >
              <img src={project.cover} alt="" width="66" height="49" loading="lazy" />
              <span>
                <small>IN PRACTICE / {project.shortTitle}</small>
                <strong>{focus.proof}</strong>
              </span>
              <ArrowUpRight size={19} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
      <div className="about-craft-footer">
        <span>
          <GitBranch size={15} aria-hidden="true" /> From product decisions to implementation
          details.
        </span>
        <a href="#work">
          Explore all {projects.length} case studies <ArrowUpRight size={15} aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}

export function About() {
  return (
    <section className="about-section" id="about" aria-labelledby="about-title">
      <div className="about-inner">
        <div className="about-section-label">
          <span>
            <i aria-hidden="true" /> 01 / THE ENGINEER BEHIND THE WORK
          </span>
          <span>PRODUCT MINDSET. ENGINEERING DEPTH.</span>
        </div>
        <div className="about-intro-grid">
          <aside className="about-person" aria-label="About Zohaib Haider">
            <div className="about-person-card">
              <div className="about-person-top">
                <span>
                  <Layers3 size={14} aria-hidden="true" /> A LITTLE MORE HUMAN
                </span>
                <span className="about-person-number">ZH / 01</span>
              </div>
              <div className="about-person-photo">
                <img
                  src={socials.portrait}
                  alt="Zohaib Haider in a charcoal suit and glasses"
                  width="1070"
                  height="1470"
                  loading="lazy"
                />
                <span>
                  <MapPin size={13} aria-hidden="true" /> Islamabad, Pakistan
                </span>
              </div>
              <div className="about-person-caption">
                <div>
                  <h3>
                    Zohaib Haider<span>.</span>
                  </h3>
                  <p>Full-Stack &amp; AI Software Engineer</p>
                </div>
                <a
                  href={socials.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Connect with Zohaib on LinkedIn"
                >
                  <ArrowUpRight size={21} aria-hidden="true" />
                </a>
              </div>
              <div className="about-person-status">
                <span aria-hidden="true" /> Open to full-time roles &amp; freelance work
              </div>
            </div>
            <div className="about-education">
              <span className="about-education-icon">
                <GraduationCap size={23} aria-hidden="true" />
              </span>
              <div>
                <strong>BS Software Engineering</strong>
                <span>IIUI · Graduated 2024</span>
              </div>
              <p>
                3.66<small>/ 4.00 CGPA</small>
              </p>
            </div>
          </aside>
          <div className="about-intro-copy">
            <p className="about-kicker">
              <span /> FULL-STACK ENGINEERING × APPLIED AI
            </p>
            <h2 id="about-title">
              I make the whole
              <br />
              product <span className="serif-word">work together.</span>
            </h2>
            <p className="about-lead">
              The interface. The backend. The intelligence.
              <br />I connect the pieces to build software people can actually use.
            </p>
            <p className="about-story">
              I’m Zohaib, a full-stack and AI software engineer who turns complex problems into{" "}
              <strong>polished products and dependable systems</strong>. I bring the interface,
              backend, data, and AI together, taking an idea from architecture and implementation
              through testing and deployment.
            </p>
            <p className="about-story">
              From{" "}
              <strong>
                SaaS platforms and payment integrations to RAG pipelines and LangGraph agents
              </strong>
              , I build the workflows that make a product useful. My work combines React, Next.js,
              Node.js, and Python with secure APIs, reliable background processing, and AI tools
              with human oversight. I focus on the details that matter: a clear experience, sound
              technical decisions, and software that holds up beyond the demo.
            </p>
            <div className="about-belief">
              <span className="about-belief-icon">
                <Sparkles size={21} aria-hidden="true" />
              </span>
              <div>
                <span>THE PRINCIPLE BEHIND THE WORK</span>
                <p>
                  Make it useful. Make it dependable.
                  <br />
                  <strong>Then make it feel effortless.</strong>
                </p>
              </div>
            </div>
            <div className="about-intro-actions">
              <a className="about-primary-action" href="#contact">
                Let’s build something that works <ArrowUpRight size={18} aria-hidden="true" />
              </a>
              <a
                className="about-secondary-action"
                href={socials.resume}
                target="_blank"
                rel="noreferrer"
              >
                Read my résumé <ArrowDown size={16} aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
        <div className="about-proof-heading">
          <p className="about-kicker">EXPERIENCE, WITH CONTEXT</p>
          <span>A few numbers. A lot of hands-on work.</span>
        </div>
        <div className="about-stats" aria-label="Experience highlights">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <a
                className={`about-stat${index === 0 ? " about-stat-featured" : ""}`}
                href={stat.href}
                key={stat.label}
                aria-label={`${stat.value}${stat.suffix} ${stat.label}. ${stat.detail}`}
              >
                <div className="about-stat-top">
                  <Icon size={20} aria-hidden="true" />
                  <ArrowUpRight size={17} aria-hidden="true" />
                </div>
                <strong className="about-stat-number">
                  <CountUp value={stat.value} />
                  <span aria-hidden="true">{stat.suffix}</span>
                </strong>
                <h3>{stat.label}</h3>
                <p>{stat.detail}</p>
              </a>
            );
          })}
        </div>
        <EngineeringExplorer />
      </div>
    </section>
  );
}

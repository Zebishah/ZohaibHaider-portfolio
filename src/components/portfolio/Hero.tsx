import { ArrowUpRight, BriefcaseBusiness, Github, Layers3, Linkedin, Mail, MessageCircle, Phone } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { socials } from "@/lib/socials";
import { usePortfolioMotion } from "./Motion";
import { RoleTitle } from "./RoleTitle";
import { PortraitCard } from "./PortraitCard";
import "./Hero.css";

const focusAreas = ["Production Platforms.", "Payment Integrations.", "Intelligent AI Systems."];
const coreStack = [
  "React / Next.js",
  "TypeScript",
  "Node.js / NestJS",
  "Python / FastAPI",
  "PostgreSQL / MongoDB",
  "Redis / BullMQ",
  "Stripe / Payments",
  "AWS / Docker",
  "RAG / LangGraph",
];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { enabled } = usePortfolioMotion();
  const [entered, setEntered] = useState(false);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting);
      if (entry.isIntersecting) setEntered(true);
    });
    observer.observe(element);
    return () => {
      observer.disconnect();
    };
  }, []);
  return (
    <section
      className="hero hero-intro"
      ref={ref}
      aria-labelledby="hero-title"
      data-entered={enabled && entered}
      data-in-view={inView}
    >
      <div className="hero-intro-kicker">
        <p>
          <span className="hero-kicker-dot" /> ZOHAIB HAIDER <i>/</i> <RoleTitle />
        </p>
        <span>PRODUCT THINKING. SYSTEMS BUILT TO WORK.</span>
      </div>
      <div
        className="hero-socials hero-contact-footer hero-contact-bar"
        role="group"
        aria-label="Contact and social links"
      >
        <div className="hero-direct-contacts">
          <a href={socials.emailHref}>
            <Mail size={16} />
            <span>{socials.email}</span>
          </a>
          <a href={socials.phoneHref}>
            <Phone size={15} />
            <span>{socials.phone}</span>
          </a>
        </div>
        <div className="hero-network-links">
          {[
            [Github, "GitHub", socials.github],
            [Linkedin, "LinkedIn", socials.linkedin],
            [MessageCircle, "WhatsApp", socials.whatsapp],
          ].map(([Icon, label, href]) => {
            const I = Icon as typeof Github;
            return (
              <a
                key={String(label)}
                href={String(href)}
                aria-label={String(label)}
                target={String(href).startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
              >
                <I size={16} />
                <span>{String(label)}</span>
                <ArrowUpRight size={12} />
              </a>
            );
          })}
        </div>
      </div>
      <div className="hero-intro-grid">
        <div className="hero-specialty"><Layers3 size={18} aria-hidden="true" /><span>FULL-STACK &amp; AI ENGINEER</span></div>
        <h1
          className="hero-intro-title"
          id="hero-title"
          aria-label="Zohaib Haider — Full-stack Software Engineer | AI Systems"
        >
          <span className="hero-intro-mask" aria-hidden="true">
            <span>FULL-STACK</span>
          </span>
          <span className="hero-intro-mask" aria-hidden="true">
            <span>SOFTWARE ENGINEER</span>
          </span>
        </h1>
        <div className="hero-intro-story">
          <div className="hero-focus">
            <span className="hero-focus-label">I BUILD</span>
            <p className="hero-focus-statements">
              {focusAreas.map((area) => (
                <span key={area}>{area}</span>
              ))}
            </p>
          </div>
          <p className="hero-intro-description">
            Full-Stack &amp; AI Software Engineer with 2+ years of experience delivering 12+
            production-grade applications. I build modern frontends, scalable backends, secure
            APIs, payment systems, and third-party integrations. My expertise includes AI/LLM
            integrations, RAG, LangChain, LangGraph agents, MCP, human-in-the-loop workflows, and
            LLM fine-tuning. From architecture and testing to cloud deployment, I deliver
            reliable, scalable, end-to-end software solutions.
          </p>
          <div className="hero-action-slot">
            <div className="hero-actions hero-intro-actions">
              <a className="button button-green" href="#work">
                Explore My Work <ArrowUpRight size={20} />
              </a>
              <a className="text-link" href={socials.resume} target="_blank" rel="noreferrer">
                View Resume <ArrowUpRight size={19} />
              </a>
            </div>
          </div>
          <div className="hero-proof" aria-label="Professional experience highlights">
            <div className="hero-proof-item"><Layers3 size={24} aria-hidden="true" /><strong>12+</strong><span>Apps Shipped</span></div>
            <div className="hero-proof-item"><BriefcaseBusiness size={24} aria-hidden="true" /><strong>2+</strong><span>Years Experience</span></div>
          </div>
        </div>
        <PortraitCard className="hero-profile" priority availability />
        <div className="hero-core-stack">
          <span className="hero-strip-label">Core stack</span>
          <ul aria-label="Selected core technologies">
            {coreStack.map((technology) => (
              <li key={technology}>{technology}</li>
            ))}
          </ul>
        </div>

      </div>
    </section>
  );
}

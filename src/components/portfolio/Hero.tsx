import {
  ArrowUpRight,
  Calendar,
  Database,
  Download,
  Layers3,
  Mail,
  MapPin,
  Network,
  Phone,
  Rocket,
} from "lucide-react";
import { FaAws, FaLinkedinIn } from "react-icons/fa6";
import {
  SiGithub,
  SiNodedotjs,
  SiPython,
  SiReact,
  SiRedis,
  SiStripe,
  SiTypescript,
  SiWhatsapp,
} from "react-icons/si";
import { socials } from "@/lib/socials";
import { PortraitCard } from "./PortraitCard";
import "./Hero.css";

const coreStack = [
  { label: "React / Next.js", icon: SiReact, color: "#00b9ed" },
  { label: "TypeScript", icon: SiTypescript, color: "#087fc8" },
  { label: "Node.js / NestJS", icon: SiNodedotjs, color: "#68a82e" },
  { label: "Python / FastAPI", icon: SiPython, color: "#2586b9" },
  { label: "PostgreSQL / MongoDB", icon: Database, color: "#07503a" },
  { label: "Redis / BullMQ", icon: SiRedis, color: "#cf3425" },
  { label: "Stripe / Payments", icon: SiStripe, color: "#7960ff" },
  { label: "AWS / Docker", icon: FaAws, color: "#25313c" },
  { label: "RAG / LangGraph", icon: Network, color: "#174c37" },
];

function HeroBackdrop() {
  return (
    <svg
      className="hero-backdrop"
      viewBox="0 0 1672 873"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="hero-forest" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#376b50" />
          <stop offset="0.65" stopColor="#103d2d" />
          <stop offset="1" stopColor="#315e49" />
        </linearGradient>
        <linearGradient id="hero-sand" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#e5dfcd" stopOpacity="0.15" />
          <stop offset="1" stopColor="#d5d7c0" stopOpacity="0.75" />
        </linearGradient>
        <linearGradient id="hero-contour" x1="0" y1="1" x2="1" y2="0">
          <stop stopColor="#f5f3df" stopOpacity="0.6" />
          <stop offset="1" stopColor="#d5db9b" stopOpacity="0.22" />
        </linearGradient>
        <radialGradient id="hero-card-shadow">
          <stop stopColor="#344628" stopOpacity="0.33" />
          <stop offset="1" stopColor="#344628" stopOpacity="0" />
        </radialGradient>
      </defs>
      <path
        d="M1672 24C1472 115 1488 365 1275 526C1103 656 955 691 797 807L696 873H1672Z"
        fill="url(#hero-sand)"
      />
      <path
        d="M1672 177C1514 305 1491 449 1419 564C1311 740 1210 835 1016 873H1672Z"
        fill="url(#hero-forest)"
      />
      <path d="M0 781C59 832 121 863 230 873H0Z" fill="url(#hero-forest)" />
      <path
        d="M0 533C106 605 166 757 345 807C557 866 778 885 1016 873C743 916 263 949 0 781Z"
        fill="url(#hero-sand)"
        opacity="0.62"
      />
      <ellipse cx="1266" cy="730" rx="325" ry="105" fill="url(#hero-card-shadow)" />
      <g fill="none" stroke="url(#hero-contour)" strokeWidth="1">
        {[0, 20, 40, 60].map((offset) => (
          <path
            key={offset}
            d="M1010 899C1307 829 1419 585 1679 472"
            transform={`translate(0 ${offset})`}
          />
        ))}
      </g>
    </svg>
  );
}

export function Hero() {
  return (
    <section className="hero hero-intro" aria-labelledby="hero-title">
      <HeroBackdrop />
      <div className="hero-content">
        <div className="hero-contact-bar" role="group" aria-label="Contact and social links">
          <div className="hero-direct-contacts">
            <a href={socials.emailHref}>
              <Mail size={18} aria-hidden="true" />
              <span>{socials.email}</span>
            </a>
            <a href={socials.phoneHref}>
              <Phone size={17} aria-hidden="true" />
              <span>{socials.phone}</span>
            </a>
            <span className="hero-location">
              <MapPin size={18} aria-hidden="true" />
              Islamabad, Pakistan
            </span>
          </div>
          <div className="hero-network-links">
            {[
              { icon: SiGithub, label: "GitHub", href: socials.github },
              { icon: FaLinkedinIn, label: "LinkedIn", href: socials.linkedin },
              { icon: SiWhatsapp, label: "WhatsApp", href: socials.whatsapp },
            ].map(({ icon: Icon, label, href }) => (
              <a key={label} href={href} target="_blank" rel="noreferrer">
                <Icon size={20} aria-hidden="true" />
                <span>{label}</span>
                <ArrowUpRight size={13} aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
        <div className="hero-intro-grid">
          <div className="hero-copy">
            <div className="hero-specialty">
              <Layers3 size={21} aria-hidden="true" />
              <span>FULL-STACK &amp; AI ENGINEER</span>
            </div>
            <h1 className="hero-intro-title" id="hero-title">
              <span>FULL-STACK</span>
              <span>SOFTWARE ENGINEER</span>
            </h1>
            <div className="hero-title-stroke" aria-hidden="true" />
            <div className="hero-intro-story">
              <p className="hero-focus">
                Production Platforms. Payment Integrations. Intelligent AI Systems.
              </p>
              <p className="hero-intro-description">
                Full-Stack &amp; AI Software Engineer with 2+ years of experience delivering 12+
                production-grade applications. I build modern frontends, scalable backends, secure
                APIs, payment systems, and third-party integrations. My expertise includes AI/LLM
                integrations, RAG, LangChain, LangGraph, MCP, human-in-the-loop workflows, and
                fine-tuning. From architecture and testing to cloud deployment, I deliver reliable,
                scalable, end-to-end software solutions.
              </p>
              <div className="hero-intro-actions">
                <a className="hero-work-button" href="#work">
                  Explore My Work <ArrowUpRight size={22} aria-hidden="true" />
                </a>
                <a
                  className="hero-resume-button"
                  href={socials.resume}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Download size={23} aria-hidden="true" /> View Resume
                </a>
              </div>
              <div className="hero-proof" aria-label="Professional experience highlights">
                <div className="hero-proof-item">
                  <Rocket size={26} aria-hidden="true" />
                  <strong>12+</strong>
                  <span>Apps Shipped</span>
                </div>
                <div className="hero-proof-item">
                  <Calendar size={26} aria-hidden="true" />
                  <strong>2+</strong>
                  <span>Years Experience</span>
                </div>
              </div>
            </div>
          </div>
          <PortraitCard className="hero-profile" priority availability />
        </div>
        <div className="hero-core-stack">
          <span className="hero-strip-label">
            <Layers3 size={22} aria-hidden="true" /> CORE STACK
          </span>
          <ul aria-label="Selected core technologies">
            {coreStack.map(({ label, icon: Icon, color }) => (
              <li key={label}>
                <Icon size={22} color={color} aria-hidden="true" />
                <span>{label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

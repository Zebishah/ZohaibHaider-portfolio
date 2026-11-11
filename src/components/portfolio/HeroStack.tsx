import { Braces, Layers3, Network, Pause, Play } from "lucide-react";
import { FaAws } from "react-icons/fa6";
import {
  SiDocker,
  SiFastapi,
  SiGit,
  SiGithubactions,
  SiGraphql,
  SiJavascript,
  SiLangchain,
  SiMongodb,
  SiNestjs,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiPython,
  SiPytorch,
  SiReact,
  SiRedis,
  SiStripe,
  SiSupabase,
  SiTailwindcss,
  SiTypescript,
} from "react-icons/si";
import type { CSSProperties } from "react";
import { usePortfolioMotion } from "./Motion";
import "./HeroStack.css";

const technologies = [
  { label: "React", icon: SiReact, color: "#00a6d5" },
  { label: "Next.js", icon: SiNextdotjs, color: "#20382d" },
  { label: "JavaScript", icon: SiJavascript, color: "#c99808" },
  { label: "TypeScript", icon: SiTypescript, color: "#087fc8" },
  { label: "Python", icon: SiPython, color: "#2586b9" },
  { label: "Node.js", icon: SiNodedotjs, color: "#68a82e" },
  { label: "NestJS", icon: SiNestjs, color: "#d82b53" },
  { label: "FastAPI", icon: SiFastapi, color: "#009688" },
  { label: "Tailwind CSS", icon: SiTailwindcss, color: "#09a6bc" },
  { label: "PostgreSQL", icon: SiPostgresql, color: "#36678f" },
  { label: "MongoDB", icon: SiMongodb, color: "#429944" },
  { label: "Redis / BullMQ", icon: SiRedis, color: "#cf3425" },
  { label: "Stripe", icon: SiStripe, color: "#7960ff" },
  { label: "AWS", icon: FaAws, color: "#b77a18" },
  { label: "Docker", icon: SiDocker, color: "#168bd1" },
  { label: "GraphQL", icon: SiGraphql, color: "#d6379b" },
  { label: "LangChain", icon: SiLangchain, color: "#225a44" },
  { label: "RAG / LangGraph", icon: Network, color: "#547927" },
  { label: "MCP", icon: Braces, color: "#364d40" },
  { label: "PyTorch", icon: SiPytorch, color: "#dc5837" },
  { label: "Supabase", icon: SiSupabase, color: "#2b9d72" },
  { label: "Git", icon: SiGit, color: "#e05a3f" },
  { label: "GitHub Actions", icon: SiGithubactions, color: "#2785d6" },
];

export function HeroStack() {
  const { enabled, toggle } = usePortfolioMotion();
  return (
    <div className="hero-core-stack">
      <div className="hero-stack-heading">
        <span className="hero-strip-label">
          <Layers3 size={22} aria-hidden="true" /> CORE STACK
        </span>
        <button
          className="hero-motion-toggle"
          type="button"
          onClick={toggle}
          aria-label={enabled ? "Pause hero animations" : "Enable hero animations"}
          aria-pressed={!enabled}
          title={enabled ? "Pause animations" : "Enable animations"}
        >
          {enabled ? <Pause size={12} aria-hidden="true" /> : <Play size={12} aria-hidden="true" />}
        </button>
      </div>
      <div className="hero-stack-window" role="region" aria-label="Technology stack" tabIndex={0}>
        <div className="hero-stack-track">
          {[false, true].map((duplicate) => (
            <ul
              className="hero-stack-group"
              key={String(duplicate)}
              aria-hidden={duplicate || undefined}
              aria-label={duplicate ? undefined : "Core technologies"}
            >
              {technologies.map(({ label, icon: Icon, color }) => (
                <li
                  className="hero-tech-chip"
                  key={label}
                  style={{ "--tech-color": color } as CSSProperties}
                >
                  <span className="hero-tech-icon">
                    <Icon size={22} aria-hidden="true" />
                  </span>
                  <span>{label}</span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </div>
  );
}

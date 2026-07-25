import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal, SectionHeader } from "./Reveal";
import {
  SiJavascript, SiTypescript, SiHtml5, SiReact, SiNextdotjs, SiRedux, SiReactquery, SiReactrouter,
  SiTailwindcss, SiMui, SiFramer, SiNodedotjs, SiExpress, SiNestjs, SiGraphql, SiJsonwebtokens,
  SiMongodb, SiPostgresql, SiRedis, SiFirebase, SiSupabase, SiDrizzle,
  SiDocker, SiGithubactions, SiNginx, SiJest, SiCypress, SiStripe, SiSwagger,
  SiCss,
} from "react-icons/si";
import { Database, Cloud, Wrench, Server, Layers, Beaker } from "lucide-react";

type IconCmp = React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
type Skill = { name: string; icon: IconCmp; color: string };
type Category = { key: string; label: string; icon: IconCmp; skills: Skill[] };

const categories: Category[] = [
  {
    key: "frontend",
    label: "Frontend",
    icon: Layers,
    skills: [
      { name: "JavaScript", icon: SiJavascript, color: "#f7df1e" },
      { name: "TypeScript", icon: SiTypescript, color: "#3178c6" },
      { name: "React", icon: SiReact, color: "#61dafb" },
      { name: "Next.js", icon: SiNextdotjs, color: "#ffffff" },
      { name: "Redux Toolkit", icon: SiRedux, color: "#764abc" },
      { name: "TanStack Query", icon: SiReactquery, color: "#ff4154" },
      { name: "React Router", icon: SiReactrouter, color: "#ca4245" },
      { name: "Tailwind CSS", icon: SiTailwindcss, color: "#06b6d4" },
      { name: "Material UI", icon: SiMui, color: "#007fff" },
      { name: "Framer Motion", icon: SiFramer, color: "#ec4899" },
      { name: "HTML5", icon: SiHtml5, color: "#e34f26" },
      { name: "CSS3", icon: SiCss, color: "#1572b6" },
    ],
  },
  {
    key: "backend",
    label: "Backend",
    icon: Server,
    skills: [
      { name: "Node.js", icon: SiNodedotjs, color: "#5fa04e" },
      { name: "Express.js", icon: SiExpress, color: "#ffffff" },
      { name: "NestJS", icon: SiNestjs, color: "#e0234e" },
      { name: "GraphQL", icon: SiGraphql, color: "#e10098" },
      { name: "REST APIs", icon: Server, color: "#6366f1" },
      { name: "WebSockets", icon: Server, color: "#22d3ee" },
      { name: "JWT Auth", icon: SiJsonwebtokens, color: "#d946ef" },
      { name: "OAuth / RBAC", icon: SiJsonwebtokens, color: "#a855f7" },
    ],
  },
  {
    key: "database",
    label: "Database",
    icon: Database,
    skills: [
      { name: "MongoDB", icon: SiMongodb, color: "#47a248" },
      { name: "PostgreSQL", icon: SiPostgresql, color: "#4169e1" },
      { name: "Redis", icon: SiRedis, color: "#dc382d" },
      { name: "Firebase", icon: SiFirebase, color: "#ffca28" },
      { name: "Supabase", icon: SiSupabase, color: "#3ecf8e" },
      { name: "Drizzle ORM", icon: SiDrizzle, color: "#c5f74f" },
    ],
  },
  {
    key: "cloud",
    label: "Cloud & DevOps",
    icon: Cloud,
    skills: [
      { name: "AWS (EC2/S3/Lambda)", icon: Cloud, color: "#ff9900" },
      { name: "Docker", icon: SiDocker, color: "#2496ed" },
      { name: "GitHub Actions", icon: SiGithubactions, color: "#ffffff" },
      { name: "NGINX", icon: SiNginx, color: "#009639" },
      { name: "CI/CD Pipelines", icon: Cloud, color: "#06b6d4" },
      { name: "Rate Limiting", icon: Cloud, color: "#8b5cf6" },
    ],
  },
  {
    key: "testing",
    label: "Testing",
    icon: Beaker,
    skills: [
      { name: "Jest", icon: SiJest, color: "#c21325" },
      { name: "Cypress", icon: SiCypress, color: "#17202c" },
      { name: "Unit Testing", icon: Beaker, color: "#10b981" },
      { name: "E2E Testing", icon: Beaker, color: "#f59e0b" },
    ],
  },
  {
    key: "tools",
    label: "Tools & Integrations",
    icon: Wrench,
    skills: [
      { name: "Stripe", icon: SiStripe, color: "#635bff" },
      { name: "Zoho Books", icon: Wrench, color: "#e42527" },
      { name: "Swagger/OpenAPI", icon: SiSwagger, color: "#85ea2d" },
      { name: "BullMQ", icon: Wrench, color: "#dc382d" },
      { name: "AI/LLM Integrations", icon: Wrench, color: "#a855f7" },
      { name: "SMTP / Emails", icon: Wrench, color: "#0ea5e9" },
    ],
  },
];

const tabs = [
  { key: "all", label: "All" },
  ...categories.map((c) => ({ key: c.key, label: c.label })),
];

export function Skills() {
  const [active, setActive] = useState("all");
  const visible = active === "all" ? categories : categories.filter((c) => c.key === active);

  return (
    <section id="skills" className="relative py-24">
      <div className="max-w-6xl mx-auto px-4">
        <SectionHeader
          eyebrow="Skills"
          title="The |stack| I build with."
          subtitle="Real production tools, not a resume word cloud."
        />

        <Reveal>
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setActive(t.key)}
                className={`px-4 py-1.5 rounded-full text-sm transition ${
                  active === t.key
                    ? "gradient-bg text-white shadow-lg shadow-primary/30"
                    : "glass text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="space-y-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="space-y-10"
            >
              {visible.map((cat) => (
                <div key={cat.key}>
                  <div className="flex items-center gap-2 mb-4 text-sm font-medium text-muted-foreground uppercase tracking-widest">
                    <cat.icon className="w-4 h-4 text-primary" />
                    {cat.label}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {cat.skills.map((s, i) => (
                      <motion.div
                        key={s.name}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03 }}
                        whileHover={{ y: -4 }}
                        className="glass rounded-xl p-3 flex items-center gap-2 group hover:border-primary/40 transition relative overflow-hidden"
                      >
                        <s.icon className="w-5 h-5 shrink-0" style={{ color: s.color }} />
                        <span className="text-sm truncate">{s.name}</span>
                        <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition pointer-events-none"
                          style={{ boxShadow: `inset 0 0 30px ${s.color}22` }} />
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

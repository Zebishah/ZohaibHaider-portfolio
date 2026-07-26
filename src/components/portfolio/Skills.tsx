import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal, SectionHeader } from "./Reveal";
import {
  SiJavascript, SiTypescript, SiHtml5, SiReact, SiNextdotjs, SiRedux, SiReactquery, SiReactrouter,
  SiTailwindcss, SiMui, SiFramer, SiNodedotjs, SiExpress, SiNestjs, SiGraphql, SiJsonwebtokens,
  SiMongodb, SiPostgresql, SiRedis, SiFirebase, SiSupabase, SiDrizzle, SiMysql, SiMongoose,
  SiDocker, SiGithubactions, SiNginx, SiJest, SiCypress, SiStripe, SiSwagger, SiVite, SiZod,
  SiSocketdotio, SiApollographql, SiReacthookform, SiShadcnui, SiVitest, SiCss,
  SiPaypal, SiQuickbooks, SiGooglemaps, SiLeaflet, SiAntdesign, SiGsap, SiPassport,
} from "react-icons/si";
import { Database, Cloud, Wrench, Server, Layers, Beaker, FileSpreadsheet } from "lucide-react";

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
      { name: "Vite", icon: SiVite, color: "#646cff" },
      { name: "Redux Toolkit", icon: SiRedux, color: "#764abc" },
      { name: "TanStack Query", icon: SiReactquery, color: "#ff4154" },
      { name: "Apollo Client", icon: SiApollographql, color: "#311c87" },
      { name: "React Router", icon: SiReactrouter, color: "#ca4245" },
      { name: "React Hook Form", icon: SiReacthookform, color: "#ec5990" },
      { name: "Tailwind CSS", icon: SiTailwindcss, color: "#06b6d4" },
      { name: "shadcn/ui", icon: SiShadcnui, color: "#ffffff" },
      { name: "Material UI", icon: SiMui, color: "#007fff" },
      { name: "Ant Design", icon: SiAntdesign, color: "#1677ff" },
      { name: "Framer Motion", icon: SiFramer, color: "#ec4899" },
      { name: "GSAP", icon: SiGsap, color: "#88ce02" },
      { name: "Leaflet / Maps", icon: SiLeaflet, color: "#199900" },
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
      { name: "Apollo Server", icon: SiApollographql, color: "#311c87" },
      { name: "REST APIs", icon: Server, color: "#6366f1" },
      { name: "Socket.io", icon: SiSocketdotio, color: "#ffffff" },
      { name: "JWT Auth", icon: SiJsonwebtokens, color: "#d946ef" },
      { name: "Passport OAuth", icon: SiPassport, color: "#34e27a" },
      { name: "OAuth / RBAC", icon: SiJsonwebtokens, color: "#a855f7" },
      { name: "Zod", icon: SiZod, color: "#3e67b1" },
    ],
  },
  {
    key: "database",
    label: "Database",
    icon: Database,
    skills: [
      { name: "MongoDB", icon: SiMongodb, color: "#47a248" },
      { name: "Mongoose", icon: SiMongoose, color: "#880000" },
      { name: "PostgreSQL", icon: SiPostgresql, color: "#4169e1" },
      { name: "MySQL", icon: SiMysql, color: "#4479a1" },
      { name: "Redis", icon: SiRedis, color: "#dc382d" },
      { name: "Firebase", icon: SiFirebase, color: "#ffca28" },
      { name: "Supabase", icon: SiSupabase, color: "#3ecf8e" },
      { name: "Drizzle ORM", icon: SiDrizzle, color: "#c5f74f" },
      { name: "Sequelize", icon: Database, color: "#52b0e7" },
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
    ],
  },
  {
    key: "testing",
    label: "Testing",
    icon: Beaker,
    skills: [
      { name: "Jest", icon: SiJest, color: "#c21325" },
      { name: "Vitest", icon: SiVitest, color: "#729b1b" },
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
      { name: "PayPal", icon: SiPaypal, color: "#003087" },
      { name: "Cryptomus", icon: Wrench, color: "#7c3aed" },
      { name: "Zoho Books", icon: Wrench, color: "#e42527" },
      { name: "QuickBooks", icon: SiQuickbooks, color: "#2ca01c" },
      { name: "WEX SOAP", icon: Wrench, color: "#c8102e" },
      { name: "GoPhish", icon: Wrench, color: "#f97316" },
      { name: "H5P", icon: Wrench, color: "#1a73e8" },
      { name: "Google Maps", icon: SiGooglemaps, color: "#4285f4" },
      { name: "Microsoft Entra ID", icon: Wrench, color: "#00a4ef" },
      { name: "Microsoft Graph", icon: Wrench, color: "#8b5cf6" },
      { name: "AI / LLM APIs", icon: Wrench, color: "#a855f7" },
      { name: "OpenAI / Gemini / Bedrock", icon: Wrench, color: "#10a37f" },
      { name: "BullMQ", icon: Wrench, color: "#dc382d" },
      { name: "Swagger/OpenAPI", icon: SiSwagger, color: "#85ea2d" },
      { name: "PDF & Excel export", icon: FileSpreadsheet, color: "#217346" },
      { name: "SMTP / Resend", icon: Wrench, color: "#0ea5e9" },
    ],
  },
];

const tabs = [
  { key: "all", label: "All" },
  ...categories.map((c) => ({ key: c.key, label: c.label })),
];

/* Continuous flowing marquee row of skill chips */
function FlowRow({ items, reverse = false }: { items: Skill[]; reverse?: boolean }) {
  const doubled = [...items, ...items];
  return (
    <div className="relative overflow-hidden py-2 [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
      <div
        className={`flex gap-3 w-max ${reverse ? "animate-marquee-reverse" : "animate-marquee"}`}
        style={{ animationDuration: reverse ? "50s" : "45s" }}
      >
        {doubled.map((s, i) => (
          <div
            key={i}
            className="flex items-center gap-2 px-4 py-2 rounded-full glass text-sm whitespace-nowrap"
          >
            <s.icon className="w-4 h-4 shrink-0" style={{ color: s.color }} />
            <span>{s.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Skills() {
  const [active, setActive] = useState("all");
  const visible = active === "all" ? categories : categories.filter((c) => c.key === active);
  const allSkills = categories.flatMap((c) => c.skills);
  const rowA = allSkills.slice(0, Math.ceil(allSkills.length / 2));
  const rowB = allSkills.slice(Math.ceil(allSkills.length / 2));

  return (
    <section id="skills" className="relative py-24 overflow-hidden">
      <div
        className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[80%] h-full pointer-events-none opacity-30"
        style={{
          background:
            "radial-gradient(ellipse at center, color-mix(in oklab, var(--brand-from) 25%, transparent), transparent 60%)",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4">
        <SectionHeader
          eyebrow="Skills"
          title="The |stack| I build with."
          subtitle="Real production tools, not a resume word cloud."
        />

        {/* Live flowing rows */}
        <Reveal>
          <div className="mb-10 space-y-1">
            <FlowRow items={rowA} />
            <FlowRow items={rowB} reverse />
          </div>
        </Reveal>

        <Reveal>
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {tabs.map((t) => (
              <motion.button
                key={t.key}
                onClick={() => setActive(t.key)}
                whileHover={{ y: -2, scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 22 }}
                className={`px-4 py-1.5 rounded-full text-sm ${
                  active === t.key
                    ? "gradient-bg text-white shadow-lg shadow-primary/30"
                    : "glass text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.label}
              </motion.button>
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
                    {/* Live flowing progress bar */}
                    <div className="ml-3 h-[2px] flex-1 max-w-[160px] rounded-full bg-border/40 overflow-hidden relative">
                      <span
                        className="absolute inset-y-0 w-1/3 rounded-full animate-flow-bar"
                        style={{
                          background:
                            "linear-gradient(90deg, transparent, var(--brand-from), var(--brand-to), transparent)",
                        }}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {cat.skills.map((s, i) => (
                      <motion.div
                        key={s.name}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03, type: "spring", stiffness: 260, damping: 22 }}
                        whileHover={{ y: -6, scale: 1.05 }}
                        style={{
                          // dynamic hover glow via CSS var
                          ["--chip-glow" as string]: `${s.color}55`,
                        }}
                        className="skill-chip glass rounded-xl p-3 flex items-center gap-2 group relative overflow-hidden hover:border-primary/60 hover:shadow-[0_10px_30px_-10px_var(--chip-glow)]"
                      >
                        <motion.span
                          whileHover={{ rotate: [0, -8, 8, 0] }}
                          transition={{ duration: 0.5 }}
                          className="shrink-0"
                        >
                          <s.icon className="w-5 h-5" style={{ color: s.color }} />
                        </motion.span>
                        <span className="text-sm truncate">{s.name}</span>
                        <span
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                          style={{ boxShadow: `inset 0 0 40px ${s.color}33` }}
                        />
                        {/* shine sweep */}
                        <span
                          className="absolute -inset-x-full inset-y-0 group-hover:translate-x-full transition-transform duration-700 ease-out pointer-events-none"
                          style={{
                            background:
                              "linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.12) 50%, transparent 70%)",
                          }}
                        />
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

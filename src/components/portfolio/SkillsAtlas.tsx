import { useEffect, useMemo, useRef, useState } from "react";
import { SkillsStudio } from "./SkillsStudio";
import {
  initialStudioPose,
  roomHeadings,
  displayTool,
  loadStudioLayout,
  type StudioLayout,
  type StudioPose,
} from "./studioScene";
import * as Dialog from "@radix-ui/react-dialog";
import {
  RotateCcw,
  MousePointer2,
  Compass,
  ZoomIn,
  ZoomOut,
  Move3D,
  List,
  ChevronDown,
  ArrowLeft,
  ArrowRight,
  ArrowRight as Go,
} from "lucide-react";
import { skillDomains, domainTools, skillCoverage, toolNotes, type SkillName } from "./skillWorld";
import { Link } from "@tanstack/react-router";
import {
  ArrowUpRight,
  AudioLines,
  Bell,
  BookOpenText,
  Braces,
  BrainCircuit,
  Cloud,
  Code2,
  Cpu,
  CreditCard,
  CalendarDays,
  ChartNoAxesCombined,
  Command,
  Database,
  FlaskConical,
  Layers3,
  GalleryHorizontal,
  GitBranch,
  HardDrive,
  KeyRound,
  ListFilter,
  MessageSquareCode,
  Network,
  Palette,
  PanelBottom,
  PanelsTopLeft,
  Search,
  Server,
  ShieldCheck,
  Sparkles,
  SunMoon,
  Terminal,
  Workflow,
  UserRoundCheck,
  Waypoints,
  Wrench,
  X,
  type LucideIcon,
} from "lucide-react";
import {
  SiReact,
  SiNextdotjs,
  SiPython,
  SiTypescript,
  SiJavascript,
  SiNodedotjs,
  SiNestjs,
  SiFastapi,
  SiPostgresql,
  SiMongodb,
  SiRedis,
  SiDocker,
  SiPytorch,
  SiHuggingface,
  SiLangchain,
  SiLanggraph,
  SiTailwindcss,
  SiGraphql,
  SiStripe,
  SiGit,
  SiGithub,
  SiVite,
  SiCloudflare,
  SiVercel,
  SiGithubactions,
  SiQdrant,
  SiMysql,
  SiExpress,
  SiHtml5,
  SiShadcnui,
  SiRadixui,
  SiMui,
  SiAntdesign,
  SiLucide,
  SiPaypal,
  SiQuickbooks,
  SiZoho,
  SiCss,
  SiRedux,
  SiReacthookform,
  SiZod,
  SiReactquery,
  SiApollographql,
  SiJest,
  SiPytest,
  SiClaude,
  SiGooglegemini,
  SiSupabase,
  SiFirebase,
  SiDrizzle,
} from "react-icons/si";
import type { IconType } from "react-icons";
import { skillGroups, totalSkills } from "@/lib/skills";
import { projects } from "@/lib/projects";
import { usePortfolioMotion } from "./Motion";
import "./SkillsAtlas.css";

type SkillGroup = (typeof skillGroups)[number];
const profiles: Record<SkillGroup["name"], { icon: LucideIcon; description: string }> = {
  Languages: {
    icon: Code2,
    description:
      "The foundation for building interfaces, writing services, working with data, and automating the work between them.",
  },
  Frontend: {
    icon: Layers3,
    description:
      "Thoughtful interfaces, connected state, and complete product workflows. Built for the people who actually use them.",
  },
  "UI systems & utilities": {
    icon: Palette,
    description:
      "The components, interactions, and details that turn a working interface into a considered product experience.",
  },
  "Backend & APIs": {
    icon: Server,
    description:
      "Typed contracts, clear service boundaries, and the business logic that connects an interface to a real system.",
  },
  "Databases & storage": {
    icon: Database,
    description:
      "Relational records, document stores, vector retrieval, and caching. The right data layer for the job.",
  },
  "Agentic AI & retrieval": {
    icon: BrainCircuit,
    description:
      "Connect models to knowledge, tools, and real workflows—with memory, structured outputs, and human approval where it matters.",
  },
  "AI providers & models": {
    icon: Sparkles,
    description:
      "Language, embedding, and speech models connected through application integrations and bounded provider workflows.",
  },
  "Fine-tuning & ML": {
    icon: Cpu,
    description:
      "From preparing a dataset to adapter training, evaluation, checkpointing, and serving. An engineering practice beyond the prompt.",
  },
  "Voice AI": {
    icon: AudioLines,
    description:
      "Recorded speech becomes useful input. Generated speech becomes a clear response. Voice connected to the product workflow.",
  },
  "Automation & integrations": {
    icon: Workflow,
    description:
      "Connect applications, events, APIs, and background work so information moves through the complete business workflow.",
  },
  "Payments & finance": {
    icon: CreditCard,
    description:
      "Payments are more than a checkout screen. Subscriptions, scheduled charges, refunds, payouts, and accounting have to agree.",
  },
  "Authentication & security": {
    icon: ShieldCheck,
    description:
      "Identity, scoped access, signed requests, and tenant boundaries—designed into the application rather than added at the end.",
  },
  "Architecture & reliability": {
    icon: Network,
    description:
      "Design for duplicate events, interrupted jobs, concurrent requests, and recovery. The important work beyond the happy path.",
  },
  "Cloud & deployment": {
    icon: Cloud,
    description:
      "The infrastructure and delivery tools that take an application from a working branch to a running service.",
  },
  "Testing & quality": {
    icon: FlaskConical,
    description:
      "Exercise the behavior that matters: business rules, integration boundaries, regressions, and real user journeys.",
  },
  "Build & developer tools": {
    icon: Terminal,
    description:
      "The everyday tooling behind a repeatable development process, versioned work, and dependable delivery.",
  },
};
const toolIcons: Record<string, IconType | LucideIcon> = {
  Groq: Sparkles,
  Whisper: AudioLines,
  PEFT: Cpu,
  LoRA: Cpu,
  QLoRA: Cpu,
  React: SiReact,
  "Next.js": SiNextdotjs,
  Python: SiPython,
  TypeScript: SiTypescript,
  "JavaScript (ES6+)": SiJavascript,
  "Node.js": SiNodedotjs,
  NestJS: SiNestjs,
  FastAPI: SiFastapi,
  PostgreSQL: SiPostgresql,
  MongoDB: SiMongodb,
  Redis: SiRedis,
  Docker: SiDocker,
  PyTorch: SiPytorch,
  "Hugging Face Transformers": SiHuggingface,
  "Hugging Face Hub": SiHuggingface,
  LangChain: SiLangchain,
  "LangChain Groq": SiLangchain,
  LangGraph: SiLanggraph,
  "Tailwind CSS": SiTailwindcss,
  GraphQL: SiGraphql,
  Stripe: SiStripe,
  "Stripe Connect": SiStripe,
  Git: SiGit,
  GitHub: SiGithub,
  Vite: SiVite,
  "Cloudflare Workers": SiCloudflare,
  Vercel: SiVercel,
  "GitHub Actions": SiGithubactions,
  Qdrant: SiQdrant,
  MySQL: SiMysql,
  "Express.js": SiExpress,
  HTML: SiHtml5,
  CSS: SiCss,
  "shadcn/ui": SiShadcnui,
  "Radix UI": SiRadixui,
  "Base UI": PanelsTopLeft,
  "Material UI": SiMui,
  "Ant Design": SiAntdesign,
  "Lucide React": SiLucide,
  Recharts: ChartNoAxesCombined,
  ApexCharts: ChartNoAxesCombined,
  "Redux Toolkit": SiRedux,
  "RTK Query": SiRedux,
  "React Hook Form": SiReacthookform,
  Zod: SiZod,
  "TanStack Query": SiReactquery,
  "Apollo Client": SiApollographql,
  "Apollo Server": SiApollographql,
  "React Markdown": SiReact,
  Sonner: Bell,
  "date-fns": CalendarDays,
  "React Day Picker": CalendarDays,
  "Embla Carousel": GalleryHorizontal,
  cmdk: Command,
  "input-otp": KeyRound,
  Vaul: PanelBottom,
  "react-resizable-panels": PanelsTopLeft,
  "next-themes": SunMoon,
  "tw-animate-css": Sparkles,
  "class-variance-authority": Braces,
  clsx: Braces,
  "tailwind-merge": SiTailwindcss,
  RAG: BookOpenText,
  "Semantic Search": Search,
  "Hybrid Retrieval": GitBranch,
  Embeddings: Waypoints,
  Reranking: ListFilter,
  "Prompt Engineering": MessageSquareCode,
  "Tool Calling": Wrench,
  "Structured Outputs": Braces,
  "Stateful Agent Workflows": Workflow,
  "Human-in-the-Loop": UserRoundCheck,
  "AI Memory": HardDrive,
  PayPal: SiPaypal,
  QuickBooks: SiQuickbooks,
  "Zoho Books": SiZoho,
  Jest: SiJest,
  pytest: SiPytest,
  "Claude API": SiClaude,
  "Gemini API": SiGooglegemini,
  Supabase: SiSupabase,
  Firebase: SiFirebase,
  "Drizzle ORM": SiDrizzle,
};

function SkillItems({ items }: { items: readonly string[] }) {
  return (
    <ul className="board-inventory-tools">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
function ToolIcon({ name, size = 22 }: { name: string; size?: number }) {
  const Icon = toolIcons[name] ?? Braces;
  const colors: Record<string, string> = {
    React: "#087eac",
    TypeScript: "#2763cb",
    PyTorch: "#df5b35",
    "Hugging Face Transformers": "#bb8400",
    Docker: "#1974bc",
    PostgreSQL: "#3e6c96",
    "Stripe Connect": "#635bce",
    Qdrant: "#bf4266",
    LangGraph: "#b64a0d",
  };
  return <Icon size={size} aria-hidden="true" style={{ color: colors[name] }} />;
}
export function SkillsAtlas() {
  const [domain, setDomain] = useState(3);
  const [layout, setLayout] = useState<StudioLayout | null>(null);
  const coverage = useMemo(skillCoverage, []);
  const [view, setView] = useState<"studio" | "all">("studio");
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [panelOpen, setPanelOpen] = useState(true);
  const [pose, setPose] = useState<StudioPose>(initialStudioPose);
  const [opened, setOpened] = useState<SkillName | null>(null);
  const [detailTool, setDetailTool] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(true);
  const [liveModel, setLiveModel] = useState(false);
  const [scene, setScene] = useState<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);
  const nav = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const { enabled } = usePortfolioMotion();
  const current = skillDomains[domain];
  const allTools = domainTools(domain);
  const tools = expanded ? allTools : current.featured;
  const normalized = query.trim().toLowerCase();
  const openedGroup = skillGroups.find((group) => group.name === opened);
  const selectedGroup = skillGroups.find((group) =>
    (group.items as readonly string[]).includes(detailTool ?? ""),
  );
  const note = toolNotes[detailTool ?? ""] ?? {
    label: selectedGroup?.name ?? current.name,
    description: selectedGroup ? profiles[selectedGroup.name].description : current.description,
  };
  const matches = useMemo(
    () =>
      skillGroups
        .map((group) => ({
          ...group,
          items: group.items.filter(
            (item) =>
              item.toLowerCase().includes(normalized) ||
              group.name.toLowerCase().includes(normalized),
          ),
        }))
        .filter((group) => group.items.length),
    [normalized],
  );
  const keyword = (detailTool ?? "")
    .toLowerCase()
    .replace("hugging face transformers", "transformers")
    .replace("javascript (es6+)", "javascript");
  const exactProjects = detailTool
    ? projects.filter((project) =>
        [...project.stack, ...project.tags].some((item) => item.toLowerCase().includes(keyword)),
      )
    : [];
  const domainProjects: Record<number, string[]> = {
    3: ["ops-pilot", "hr-intelligence"],
    4: ["ops-pilot"],
    5: ["ops-pilot"],
    6: ["ops-pilot"],
    8: ["ops-pilot", "hr-intelligence", "rta-mark"],
    10: ["dsp"],
    11: ["ops-pilot"],
  };
  const related = exactProjects.length
    ? exactProjects
    : domainProjects[domain]
      ? projects.filter((project) => domainProjects[domain].includes(project.slug))
      : projects;
  const archive = normalized ? matches : skillGroups;

  useEffect(() => {
    loadStudioLayout()
      .then(setLayout)
      .catch(() => {});
    setMounted(true);
    const update = () => setVisible(!document.hidden);
    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);
  useEffect(() => {
    if (!scene) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      rootMargin: "150px",
    });
    observer.observe(scene);
    return () => observer.disconnect();
  }, [scene]);

  function choose(index: number) {
    setDomain(index);
    setExpanded(false);
    setPanelOpen(true);
    setPose((p) => ({ ...p, room: index, zoom: 1, angle: 0, serial: p.serial + 1 }));
  }
  function overview() {
    setPose((p) => ({ ...initialStudioPose, serial: p.serial + 1 }));
  }
  function rememberFocus() {
    lastFocus.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
  }
  function openGroup(name: SkillName) {
    rememberFocus();
    setOpened(name);
  }
  function openTool(tool: string) {
    rememberFocus();
    setDetailTool(tool);
  }
  function inspectObject(tool: string, room: number) {
    setDomain(room);
    setPanelOpen(true);
    if (pose.room !== room) setPose((p) => ({ ...p, room, zoom: 1, serial: p.serial + 1 }));
    openTool(tool);
  }

  return (
    <div className="skills-circuit skills-studio" id="skill-collection">
      <header className="studio-heading">
        <div>
          <p className="studio-eyebrow">
            EXPERTISE <span>/</span> AN INTERACTIVE SPACE
          </p>
          <h2 id="skills-title">
            Step inside my toolkit<span>.</span>
          </h2>
          <p className="studio-intro">
            Twelve rooms. Every layer of my work. Explore the objects inside.
          </p>
          <p className="studio-coverage">
            <i />
            {coverage.assigned} / {coverage.total} skills mapped · 12 specialist rooms
          </p>
        </div>
        <div className="studio-view-switch" role="group" aria-label="Skills view">
          <button
            aria-pressed={view === "studio" && !normalized}
            onClick={() => {
              setQuery("");
              setView("studio");
              overview();
            }}
          >
            <Compass size={19} /> Explore rooms
          </button>
          <button
            aria-pressed={view === "all" || !!normalized}
            onClick={() => {
              setQuery("");
              setView("all");
            }}
          >
            <Layers3 size={20} /> View all skills{" "}
            <span className="studio-count">{totalSkills}</span>
          </button>
        </div>
      </header>

      {view === "studio" && !normalized ? (
        <>
          <div className="studio-experience">
            <div className="studio-building" ref={setScene}>
              <SkillsStudio
                render3D={mounted && inView}
                active={enabled && visible && inView}
                selected={domain}
                pose={pose}
                onSelect={choose}
                onInspect={inspectObject}
                onModeChange={setLiveModel}
              />
              <div className="studio-floor-nav" role="group" aria-label="Explore floors">
                {[
                  ["04", "Product", 0],
                  ["03", "Intelligence", 3],
                  ["02", "Connections", 6],
                  ["01", "Trust", 9],
                ].map(([number, name, index]) => (
                  <button
                    key={number}
                    aria-pressed={Math.floor(domain / 3) === Math.floor(Number(index) / 3)}
                    onClick={() => choose(Number(index))}
                  >
                    <i />
                    <span>
                      {number}
                      <strong>{name}</strong>
                    </span>
                  </button>
                ))}
              </div>
              <div className="studio-camera-controls" role="group" aria-label="Model camera">
                <button
                  aria-label="Rotate model left"
                  onClick={() =>
                    setPose((p) => ({
                      ...p,
                      room: null,
                      angle: p.angle - 1,
                      serial: p.serial + 1,
                    }))
                  }
                >
                  <ArrowLeft size={17} />
                </button>
                <button
                  aria-label="Rotate model right"
                  onClick={() =>
                    setPose((p) => ({
                      ...p,
                      room: null,
                      angle: p.angle + 1,
                      serial: p.serial + 1,
                    }))
                  }
                >
                  <ArrowRight size={17} />
                </button>
                <span />
                <button
                  aria-label="Zoom out"
                  disabled={pose.zoom <= 0.8}
                  onClick={() =>
                    setPose((p) => ({
                      ...p,
                      zoom: Math.max(0.8, p.zoom - 0.25),
                      serial: p.serial + 1,
                    }))
                  }
                >
                  <ZoomOut size={17} />
                </button>
                <button
                  aria-label="Zoom in"
                  disabled={pose.zoom >= 2}
                  onClick={() =>
                    setPose((p) => ({
                      ...p,
                      zoom: Math.min(2, p.zoom + 0.25),
                      serial: p.serial + 1,
                    }))
                  }
                >
                  <ZoomIn size={17} />
                </button>
                <button className="studio-reset" onClick={overview}>
                  <RotateCcw size={15} />
                  <span>Reset view</span>
                </button>
              </div>
            </div>

            {panelOpen ? (
              <section
                className={"studio-room-panel" + (expanded ? " is-expanded" : "")}
                id="studio-skill-panel"
                aria-labelledby="studio-room-heading"
                key={domain}
              >
                <button
                  className="studio-panel-close"
                  aria-label="Close room and return to overview"
                  onClick={() => {
                    setPanelOpen(false);
                    overview();
                  }}
                >
                  <X size={21} />
                </button>
                <p className="studio-room-breadcrumb" aria-live="polite">
                  ROOM {String(domain + 1).padStart(2, "0")} <span>/</span> {current.name}
                </p>
                <div className="studio-room-title">
                  <h3 id="studio-room-heading">
                    {roomHeadings[domain]}
                    <em>.</em>
                  </h3>
                  <span>
                    {expanded ? allTools.length : current.featured.length}{" "}
                    {expanded ? "tools & techniques" : "featured skills"}
                  </span>
                </div>
                <div className="studio-room-objects" aria-label="Interactive objects in this room">
                  <span>EXPLORE THE OBJECTS</span>
                  {layout?.hotspots
                    .filter((h) => h.room === domain)
                    .map((h, index) => (
                      <button
                        key={h.tool}
                        onClick={() => inspectObject(h.tool, h.room)}
                        aria-haspopup="dialog"
                      >
                        <i>{index + 1}</i>
                        {h.tool}
                        <ArrowUpRight size={12} />
                      </button>
                    ))}
                </div>
                <div className="studio-tool-grid">
                  {tools.map((tool) => (
                    <button
                      key={tool}
                      onClick={() => openTool(tool)}
                      aria-haspopup="dialog"
                      aria-label={"Explore " + tool}
                    >
                      <ToolIcon name={tool} size={25} />
                      <span>{displayTool(tool)}</span>
                    </button>
                  ))}
                </div>
                <div className="studio-panel-footer">
                  <p>Explore the tools. Discover the projects.</p>
                  <div>
                    <button
                      className="studio-expand"
                      aria-expanded={expanded}
                      onClick={() => setExpanded(!expanded)}
                    >
                      {expanded ? "Show highlights" : "All " + allTools.length + " in this room"}
                      <ChevronDown size={15} style={{ rotate: expanded ? "180deg" : undefined }} />
                    </button>
                    <a href="#work">
                      See related work <ArrowUpRight size={16} />
                    </a>
                  </div>
                </div>
              </section>
            ) : (
              <button className="studio-reopen" onClick={() => setPanelOpen(true)}>
                Explore {current.name} <ArrowUpRight size={16} />
              </button>
            )}
          </div>
          <div className="studio-bottom-nav">
            <p>Select a room to explore</p>
            <div ref={nav} role="group" aria-label="Choose a skills room">
              {skillDomains.map((item, index) => (
                <button
                  key={item.name}
                  onClick={() => choose(index)}
                  aria-pressed={domain === index}
                  aria-controls="studio-skill-panel"
                  onKeyDown={(event) => {
                    const next =
                      event.key === "ArrowRight"
                        ? (index + 1) % skillDomains.length
                        : event.key === "ArrowLeft"
                          ? (index + skillDomains.length - 1) % skillDomains.length
                          : event.key === "Home"
                            ? 0
                            : event.key === "End"
                              ? skillDomains.length - 1
                              : null;
                    if (next === null) return;
                    event.preventDefault();
                    choose(next);
                    nav.current
                      ?.querySelectorAll<HTMLButtonElement>("button")
                      [next]?.focus({ preventScroll: true });
                  }}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {item.name}
                </button>
              ))}
            </div>
          </div>
          <div className="studio-under-note">
            <span>
              <Move3D size={15} />{" "}
              {liveModel
                ? "Drag to rotate · Scroll or pinch to zoom · Click objects to explore"
                : "Select a room · Zoom to explore the details"}
            </span>
            <button onClick={() => setView("all")}>
              Browse all {totalSkills} skills <ArrowRight size={15} />
            </button>
          </div>
        </>
      ) : (
        <div className="circuit-inventory">
          <div className="circuit-inventory-heading" aria-live="polite">
            <div>
              <p className="studio-eyebrow">THE COMPLETE SKILLSET</p>
              <h3>{normalized ? "Found in the toolkit." : "Every skill. Clearly organised."}</h3>
            </div>
            <p>
              {normalized
                ? matches.reduce((sum, group) => sum + group.items.length, 0) +
                  " matches for “" +
                  query.trim() +
                  "”"
                : skillGroups.length +
                  " specialties · " +
                  totalSkills +
                  " unique tools & techniques"}
            </p>
          </div>
          <div className="circuit-search">
            <Search size={18} aria-hidden="true" />
            <label className="sr-only" htmlFor="studio-search">
              Search all skills
            </label>
            <input
              id="studio-search"
              type="search"
              placeholder="Search technologies & techniques…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Escape") setQuery("");
              }}
            />
            {query && (
              <button aria-label="Clear skill search" onClick={() => setQuery("")}>
                <X size={17} />
              </button>
            )}
          </div>
          {archive.length ? (
            <div className="circuit-inventory-grid">
              {archive.map((group, index) => {
                const Icon = profiles[group.name].icon;
                return (
                  <section key={group.name}>
                    <div>
                      <Icon size={22} aria-hidden="true" />
                      <span>
                        {String(index + 1).padStart(2, "0")} / {group.items.length} SKILLS
                      </span>
                    </div>
                    <h4>
                      <button onClick={() => openGroup(group.name)} aria-haspopup="dialog">
                        {group.name}
                        <ArrowUpRight size={18} />
                      </button>
                    </h4>
                    <SkillItems items={group.items} />
                  </section>
                );
              })}
            </div>
          ) : (
            <div className="circuit-empty">
              <Search size={27} />
              <h4>No matching skills.</h4>
              <p>Try a language, framework, or technique.</p>
              <button onClick={() => setQuery("")}>
                Back to exploring <Go size={17} />
              </button>
            </div>
          )}
        </div>
      )}

      <Dialog.Root
        open={opened !== null || detailTool !== null}
        onOpenChange={(open) => {
          if (!open) {
            setOpened(null);
            setDetailTool(null);
          }
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="circuit-dialog-overlay" />
          <Dialog.Content
            className="circuit-dialog"
            onCloseAutoFocus={(event) => {
              event.preventDefault();
              if (lastFocus.current?.isConnected) lastFocus.current.focus({ preventScroll: true });
            }}
          >
            <div className="circuit-dialog-top">
              <span>
                {detailTool
                  ? "INSIDE THE TOOLKIT / " + current.name.toUpperCase()
                  : "THE COMPLETE SKILLSET"}
              </span>
              <Dialog.Close aria-label="Close skill details">
                <X size={22} />
              </Dialog.Close>
            </div>
            {detailTool ? (
              <>
                <div className="studio-detail-title">
                  <ToolIcon name={detailTool} size={34} />
                  <Dialog.Title>{detailTool}</Dialog.Title>
                </div>
                <p className="studio-detail-label">{note.label}</p>
                <Dialog.Description>{note.description}</Dialog.Description>
                <div className="circuit-project-links">
                  <span>
                    {exactProjects.length ? "SEE IT IN THE WORK" : "RELATED ENGINEERING WORK"}
                  </span>
                  <div>
                    {related.map((project) => (
                      <Link key={project.slug} to="/projects/$slug" params={{ slug: project.slug }}>
                        {project.shortTitle}
                        <ArrowUpRight size={15} />
                      </Link>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              openedGroup && (
                <>
                  <Dialog.Title>{openedGroup.name}</Dialog.Title>
                  <Dialog.Description>{profiles[openedGroup.name].description}</Dialog.Description>
                  <ul className="circuit-dialog-tools">
                    {openedGroup.items.map((item) => (
                      <li key={item}>
                        <ToolIcon name={item} size={20} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

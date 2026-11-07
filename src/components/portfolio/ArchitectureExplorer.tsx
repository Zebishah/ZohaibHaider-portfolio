import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BrainCircuit,
  CarFront,
  Check,
  ChevronRight,
  CircleCheck,
  Code2,
  CreditCard,
  Database,
  Fingerprint,
  GitBranch,
  Network,
  Pause,
  Play,
  RotateCcw,
  Server,
  ShieldCheck,
  Sparkles,
  Workflow,
  X,
  type LucideIcon,
} from "lucide-react";
import { projects } from "@/lib/projects";
import { projectArchitectures, type ArchitectureStage } from "@/lib/projectArchitectures";
import { usePortfolioMotion } from "./Motion";
import { Reveal } from "./Reveal";
import "./ArchitectureExplorer.css";

const kinds: Record<ArchitectureStage["kind"], { label: string; icon: LucideIcon }> = {
  interface: { label: "Interface", icon: Code2 },
  service: { label: "Service", icon: Server },
  data: { label: "Data", icon: Database },
  ai: { label: "AI reasoning", icon: BrainCircuit },
  gate: { label: "Decision gate", icon: ShieldCheck },
  integration: { label: "Integration", icon: Workflow },
  recovery: { label: "Recovery", icon: RotateCcw },
};
const projectIcons = [BrainCircuit, Fingerprint, CreditCard, CarFront];
const number = (value: number) => String(value).padStart(2, "0");
const stageDuration = 4500;
const compactQuery = "(max-width: 1279px)";
function subscribeCompact(listener: () => void) {
  const query = window.matchMedia(compactQuery);
  query.addEventListener("change", listener);
  return () => query.removeEventListener("change", listener);
}
const getCompact = () => window.matchMedia(compactQuery).matches;

function StageDetails({
  stage,
  index,
  total,
  onMove,
  enabled,
}: {
  stage: ArchitectureStage;
  index: number;
  total: number;
  onMove: (direction: number) => void;
  enabled: boolean;
}) {
  const Kind = kinds[stage.kind].icon;
  const scroll = useRef<HTMLDivElement>(null);
  useEffect(() => {
    scroll.current?.scrollTo({ top: 0, behavior: "instant" });
  }, [stage.title]);
  return (
    <div className="architecture-inspector">
      <header className="architecture-inspector-top">
        <span>
          STAGE {number(index + 1)} <i>/ {number(total)}</i>
        </span>
        <span>
          <Kind size={13} />
          {kinds[stage.kind].label}
        </span>
      </header>
      <div className="architecture-inspector-scroll" ref={scroll}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={stage.title}
            initial={enabled ? { opacity: 0, y: 5 } : false}
            animate={{ opacity: 1, y: 0 }}
            exit={enabled ? { opacity: 0, y: -4 } : undefined}
            transition={{ duration: enabled ? 0.14 : 0 }}
          >
            <h4>{stage.title}</h4>
            <p className="architecture-inspector-summary">{stage.summary}</p>
            <dl className="architecture-io">
              <div>
                <dt>
                  <span /> INPUT
                </dt>
                <dd>{stage.input}</dd>
              </div>
              <ArrowDown size={13} aria-hidden="true" />
              <div>
                <dt>
                  <CircleCheck size={11} /> OUTPUT
                </dt>
                <dd>{stage.output}</dd>
              </div>
            </dl>
            <section className="architecture-decision">
              <h5>
                <GitBranch size={13} /> The engineering decision
              </h5>
              <p>{stage.engineering}</p>
            </section>
            <section className="architecture-recovery">
              <h5>
                <ShieldCheck size={13} /> Failure & recovery
              </h5>
              <p>{stage.recovery}</p>
            </section>
            <ul className="architecture-tools" aria-label="Technologies in this stage">
              {stage.tools.map((tool) => (
                <li key={tool}>{tool}</li>
              ))}
            </ul>
            <div className="architecture-skill">
              <Sparkles size={15} />
              <div>
                <span>SKILL DEMONSTRATED</span>
                <strong>{stage.skill}</strong>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      <footer className="architecture-inspector-controls">
        <button
          disabled={index === 0}
          onClick={() => onMove(-1)}
          aria-label="Previous architecture stage"
        >
          <ArrowLeft size={14} /> Previous
        </button>
        <button
          disabled={index === total - 1}
          onClick={() => onMove(1)}
          aria-label="Next architecture stage"
        >
          Next stage <ArrowRight size={14} />
        </button>
      </footer>
    </div>
  );
}

export function ArchitectureExplorer() {
  const [selected, setSelected] = useState(0);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [inView, setInView] = useState(false);
  const [visible, setVisible] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);
  const compact = useSyncExternalStore(subscribeCompact, getCompact, () => false);
  const root = useRef<HTMLElement>(null);
  const tabs = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const nodes = useRef<(HTMLButtonElement | null)[]>([]);
  const { enabled } = usePortfolioMotion();
  const project = projects[selected];
  const architecture = projectArchitectures[project.slug];
  const stages = architecture.phases.flatMap((phase) => phase.stages);
  const active = stages[step];
  const running = playing && enabled && inView && visible && !compact;

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
    observer.observe(element);
    const update = () => setVisible(!document.hidden);
    update();
    document.addEventListener("visibilitychange", update);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, []);
  useEffect(() => {
    if (!running) return;
    const timer = setTimeout(() => {
      if (step === stages.length - 1) setPlaying(false);
      else setStep((value) => value + 1);
    }, stageDuration);
    return () => clearTimeout(timer);
  }, [running, step, stages.length]);

  function chooseProject(index: number) {
    setSelected(index);
    setStep(0);
    setPlaying(false);
    setSheetOpen(false);
    requestAnimationFrame(() => {
      if (!panel.current) return;
      window.scrollTo({
        top:
          panel.current.getBoundingClientRect().top +
          window.scrollY -
          (compact ? 74 : 88) -
          (tabs.current?.offsetHeight ?? 0) -
          18,
        behavior: enabled ? "smooth" : "instant",
      });
      tabs.current?.querySelectorAll<HTMLButtonElement>("button")[index]?.focus({
        preventScroll: true,
      });
    });
  }
  function chooseStage(index: number, reveal = false) {
    setStep(index);
    setPlaying(false);
    if (compact && reveal) setSheetOpen(true);
  }
  function moveStage(direction: number) {
    chooseStage(Math.max(0, Math.min(stages.length - 1, step + direction)));
  }
  let offset = 0;
  return (
    <section
      className="system-section architecture-section"
      id="systems"
      ref={root}
      aria-labelledby="system-title"
      data-playing={running}
    >
      <div className="section-wrap">
        <div className="section-label">
          <span>04 / THE ENGINEERING WALKTHROUGHS</span>
          <span>PRODUCT THINKING. SYSTEM DESIGN. IMPLEMENTATION.</span>
        </div>
        <Reveal className="architecture-heading">
          <div>
            <p className="architecture-eyebrow">
              <Network size={15} /> FROM REQUEST TO RESULT
            </p>
            <h2 id="system-title">
              The engineering behind
              <br />
              <span className="serif-word">every experience.</span>
            </h2>
          </div>
          <div className="architecture-intro">
            <p>
              Follow the data, decisions, and recovery paths I built across four complete projects.
            </p>
            <div>
              <span>Interface</span>
              <ArrowRight size={12} />
              <span>API & data</span>
              <ArrowRight size={12} />
              <span>Outcome</span>
            </div>
          </div>
        </Reveal>
        <div
          className="architecture-tabs"
          role="tablist"
          aria-label="Choose project architecture"
          ref={tabs}
        >
          {projects.map((item, index) => {
            const Icon = projectIcons[index];
            const count = projectArchitectures[item.slug].phases.reduce(
              (sum, phase) => sum + phase.stages.length,
              0,
            );
            return (
              <button
                key={item.slug}
                role="tab"
                id={`architecture-tab-${item.slug}`}
                aria-selected={selected === index}
                aria-controls={`architecture-panel-${item.slug}`}
                tabIndex={selected === index ? 0 : -1}
                onClick={() => chooseProject(index)}
                onKeyDown={(event) => {
                  const next =
                    event.key === "ArrowRight"
                      ? (index + 1) % projects.length
                      : event.key === "ArrowLeft"
                        ? (index + projects.length - 1) % projects.length
                        : event.key === "Home"
                          ? 0
                          : event.key === "End"
                            ? projects.length - 1
                            : null;
                  if (next === null) return;
                  event.preventDefault();
                  chooseProject(next);
                  tabs.current
                    ?.querySelectorAll<HTMLButtonElement>("button")
                    [next]?.focus({ preventScroll: true });
                }}
              >
                <span className="architecture-tab-top">
                  <Icon size={20} />
                  <span>{number(index + 1)} / SYSTEM</span>
                  <ArrowUpRight size={16} />
                </span>
                <strong>{item.title}</strong>
                <span className="architecture-tab-meta">
                  {count} stages <i /> {projectArchitectures[item.slug].phases.length} architecture
                  layers
                </span>
              </button>
            );
          })}
        </div>
        <div
          className="architecture-project"
          role="tabpanel"
          id={`architecture-panel-${project.slug}`}
          aria-labelledby={`architecture-tab-${project.slug}`}
          key={project.slug}
          ref={panel}
        >
          <header className="architecture-project-heading">
            <div>
              <p className="architecture-eyebrow">{project.category}</p>
              <h3>
                {project.title}
                <span> / system walkthrough</span>
              </h3>
              <p>{architecture.headline}</p>
            </div>
            <Link
              to="/projects/$slug"
              params={{ slug: project.slug }}
              className="architecture-case-link"
            >
              Read the case study <ArrowUpRight size={17} />
            </Link>
          </header>
          <div className="architecture-project-brief">
            <div>
              <span>THE SYSTEM</span>
              <p>{architecture.description}</p>
            </div>
            <div>
              <span>MY ENGINEERING OWNERSHIP</span>
              <p>{project.role}</p>
            </div>
          </div>
          <div className="architecture-workspace-top">
            <div>
              <GitBranch size={16} />
              <strong>Follow the architecture</strong>
              <span>Select any stage to see what happens inside.</span>
            </div>
            <button
              className="architecture-play"
              disabled={!enabled}
              onClick={() => {
                if (step === stages.length - 1) setStep(0);
                setPlaying((value) => !value);
              }}
            >
              {playing ? <Pause size={13} /> : <Play size={13} />}
              {!enabled
                ? "Manual walkthrough"
                : playing
                  ? "Pause walkthrough"
                  : step === stages.length - 1
                    ? "Replay walkthrough"
                    : "Play walkthrough"}
            </button>
          </div>
          <div
            className="architecture-progress"
            role="progressbar"
            aria-label="Architecture walkthrough progress"
            aria-valuemin={1}
            aria-valuemax={stages.length}
            aria-valuenow={step + 1}
          >
            {stages.map((stage, index) => (
              <span key={stage.title} data-complete={index < step} data-current={index === step}>
                <i
                  key={`${project.slug}-${step}-${playing}`}
                  style={{ "--stage-duration": `${stageDuration}ms` } as CSSProperties}
                />
              </span>
            ))}
          </div>
          <div className="architecture-workspace">
            <div
              className="architecture-map"
              role="group"
              aria-label={`${project.title} architecture stages`}
            >
              {architecture.phases.map((phase, phaseIndex) => {
                const start = offset;
                offset += phase.stages.length;
                return (
                  <section
                    className="architecture-phase"
                    key={phase.title}
                    aria-labelledby={`architecture-phase-${project.slug}-${phaseIndex}`}
                  >
                    <header>
                      <span>0{phaseIndex + 1} / LAYER</span>
                      <h4 id={`architecture-phase-${project.slug}-${phaseIndex}`}>{phase.title}</h4>
                      <p>{phase.description}</p>
                      {phaseIndex < architecture.phases.length - 1 && (
                        <ChevronRight
                          className="architecture-phase-arrow"
                          size={19}
                          aria-hidden="true"
                        />
                      )}
                    </header>
                    <ol start={start + 1}>
                      {phase.stages.map((stage, localIndex) => {
                        const index = start + localIndex;
                        const Kind = kinds[stage.kind].icon;
                        return (
                          <li
                            key={stage.title}
                            data-active={step === index}
                            data-visited={step > index}
                          >
                            <button
                              className="architecture-node"
                              id={`architecture-node-${project.slug}-${index}`}
                              data-kind={stage.kind}
                              aria-pressed={step === index}
                              aria-controls={compact ? undefined : "architecture-stage-inspector"}
                              aria-haspopup={compact ? "dialog" : undefined}
                              tabIndex={step === index ? 0 : -1}
                              ref={(element) => {
                                nodes.current[index] = element;
                              }}
                              onClick={() => chooseStage(index, true)}
                              onKeyDown={(event) => {
                                const next =
                                  event.key === "ArrowDown" || event.key === "ArrowRight"
                                    ? Math.min(stages.length - 1, index + 1)
                                    : event.key === "ArrowUp" || event.key === "ArrowLeft"
                                      ? Math.max(0, index - 1)
                                      : event.key === "Home"
                                        ? 0
                                        : event.key === "End"
                                          ? stages.length - 1
                                          : null;
                                if (next === null) return;
                                event.preventDefault();
                                chooseStage(next);
                                nodes.current[next]?.focus({ preventScroll: true });
                                nodes.current[next]?.scrollIntoView({
                                  block: "nearest",
                                  behavior: enabled ? "smooth" : "auto",
                                });
                              }}
                            >
                              <span className="architecture-node-top">
                                <span>
                                  {step > index ? <Check size={12} /> : number(index + 1)}
                                </span>
                                <span>
                                  <Kind size={11} />
                                  {kinds[stage.kind].label}
                                </span>
                              </span>
                              <strong>{stage.title}</strong>
                              <span className="architecture-node-summary">{stage.summary}</span>
                              <span className="architecture-node-tools">
                                {stage.tools.slice(0, 3).map((tool) => (
                                  <span key={tool}>{tool}</span>
                                ))}
                              </span>
                              <span className="architecture-node-open">
                                {step === index ? "Exploring this stage" : "Explore this stage"}
                                <ArrowUpRight size={12} />
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ol>
                  </section>
                );
              })}
            </div>
            <aside
              className="architecture-detail"
              id="architecture-stage-inspector"
              aria-labelledby={`architecture-node-${project.slug}-${step}`}
            >
              <StageDetails
                stage={active}
                index={step}
                total={stages.length}
                onMove={moveStage}
                enabled={enabled}
              />
            </aside>
          </div>
          <Dialog.Root open={sheetOpen} onOpenChange={setSheetOpen}>
            <Dialog.Portal>
              <Dialog.Overlay className="architecture-sheet-overlay" />
              <Dialog.Content
                className="architecture-stage-sheet"
                onCloseAutoFocus={(event) => {
                  event.preventDefault();
                  nodes.current[step]?.focus({ preventScroll: true });
                  nodes.current[step]?.scrollIntoView({
                    block: "nearest",
                    behavior: enabled ? "smooth" : "auto",
                  });
                }}
              >
                <div className="architecture-sheet-heading">
                  <span>{project.title} / UNDER THE HOOD</span>
                  <Dialog.Close aria-label="Close architecture stage">
                    <X size={21} />
                  </Dialog.Close>
                </div>
                <Dialog.Title className="sr-only">{active.title}</Dialog.Title>
                <Dialog.Description className="sr-only">
                  Stage {step + 1} of {stages.length}. Explore the inputs, outputs, engineering
                  decisions, and recovery behaviour.
                </Dialog.Description>
                <StageDetails
                  stage={active}
                  index={step}
                  total={stages.length}
                  onMove={moveStage}
                  enabled={enabled}
                />
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
          <p className="architecture-context">
            <ShieldCheck size={14} />
            <span>{architecture.context}</span>
          </p>
          <section
            className="architecture-support"
            aria-labelledby={`architecture-support-${project.slug}`}
          >
            <div className="architecture-subheading">
              <div>
                <p className="architecture-eyebrow">BEYOND THE MAIN PATH</p>
                <h4 id={`architecture-support-${project.slug}`}>The supporting systems.</h4>
              </div>
              <span>Inputs, integrations & alternative execution paths</span>
            </div>
            <div className="architecture-branch-grid">
              {architecture.branches.map((branch) => (
                <article key={branch.title}>
                  <span>
                    <GitBranch size={13} />
                    {branch.label}
                  </span>
                  <h5>{branch.title}</h5>
                  <p>{branch.detail}</p>
                  <ul className="architecture-tools">
                    {branch.tools.map((tool) => (
                      <li key={tool}>{tool}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </section>
          <section
            className="architecture-strengths"
            aria-labelledby={`architecture-strengths-${project.slug}`}
          >
            <div className="architecture-subheading">
              <div>
                <p className="architecture-eyebrow">WHAT THIS DEMONSTRATES</p>
                <h4 id={`architecture-strengths-${project.slug}`}>
                  Engineering skills, in practice.
                </h4>
              </div>
              <Sparkles size={23} />
            </div>
            <div>
              {architecture.strengths.map((strength, index) => (
                <article key={strength.title}>
                  <span>0{index + 1}</span>
                  <h5>{strength.title}</h5>
                  <p>{strength.evidence}</p>
                </article>
              ))}
            </div>
          </section>
          <footer className="architecture-project-footer">
            <Link to="/projects/$slug" params={{ slug: project.slug }}>
              Inside {project.title} <ArrowUpRight size={16} />
            </Link>
            <button
              onClick={() => {
                const next = (selected + 1) % projects.length;
                chooseProject(next);
              }}
            >
              Next system: {projects[(selected + 1) % projects.length].title}
              <ArrowRight size={16} />
            </button>
          </footer>
        </div>
      </div>
    </section>
  );
}

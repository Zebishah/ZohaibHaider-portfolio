import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronDown,
  Code2,
  ExternalLink,
  GitBranch,
  Github,
  Layers3,
  ShieldCheck,
} from "lucide-react";
import { projects, type Project } from "@/lib/projects";
import { projectCaseStudies } from "@/lib/projectCaseStudies";
import { projectArchitectures } from "@/lib/projectArchitectures";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { Contact } from "./Contact";
import { ProjectTechStack } from "./ProjectTechStack";
import "./ProjectCaseStudy.css";

const sections = [
  ["overview", "Overview"],
  ["build", "What I built"],
  ["architecture", "Architecture"],
  ["decisions", "Decisions"],
  ["stack", "Full stack"],
  ["quality", "Quality & delivery"],
  ["impact", "Impact"],
];
const number = (n: number) => String(n).padStart(2, "0");

function SectionHeading({
  index,
  eyebrow,
  title,
  description,
}: {
  index: string;
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <header className="study-section-heading">
      <p>
        <span>{index}</span> {eyebrow}
      </p>
      <h2>{title}</h2>
      {description && <div>{description}</div>}
    </header>
  );
}

export function ProjectCaseStudy({ project }: { project: Project }) {
  const study = projectCaseStudies[project.slug];
  const architecture = projectArchitectures[project.slug];
  const next = projects[(projects.findIndex((p) => p.slug === project.slug) + 1) % projects.length];
  const stageKeys = architecture.phases.flatMap((phase, p) =>
    phase.stages.map((_, s) => `${p}-${s}`),
  );
  const [openStages, setOpenStages] = useState(() => new Set(["0-0"]));
  const allOpen = stageKeys.every((key) => openStages.has(key));
  return (
    <div id="top" className="case-study">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Navbar />
      <main id="main-content">
        <header className="study-hero study-container">
          <Link to="/" hash="work" className="study-back">
            <ArrowLeft size={15} /> All selected work
          </Link>
          <div className="study-title-grid">
            <div>
              <p className="study-eyebrow">ENGINEERING CASE STUDY / {project.category}</p>
              <h1>
                {project.title}
                <span>.</span>
              </h1>
              <p className="study-tagline">{project.tagline}</p>
              <p className="study-summary">{study.card.overview}</p>
              <div className="study-actions">
                <a href={project.demo} target="_blank" rel="noreferrer" className="study-primary">
                  Explore the live product <ArrowUpRight size={18} />
                </a>
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="study-source"
                  aria-label={`View ${project.title} source code on GitHub (opens in new tab)`}
                >
                  <Github size={17} aria-hidden="true" />
                  View source on GitHub
                  <ArrowUpRight size={15} aria-hidden="true" />
                </a>
              </div>
            </div>
            <aside className="study-glance" aria-label="Project at a glance">
              <p>
                <Code2 size={17} /> THE BUILD AT A GLANCE
              </p>
              <dl>
                <div>
                  <dt>My scope</dt>
                  <dd>Full-stack engineering</dd>
                </div>
                <div>
                  <dt>Product coverage</dt>
                  <dd>{study.capabilities.length} capability areas</dd>
                </div>
                <div>
                  <dt>Architecture walkthrough</dt>
                  <dd>{stageKeys.length} detailed stages</dd>
                </div>
                <div>
                  <dt>Complete inventory</dt>
                  <dd>{project.stack.length} tools &amp; techniques</dd>
                </div>
              </dl>
              <a href="#study-build">
                Get inside the build <ArrowRight size={16} />
              </a>
            </aside>
          </div>
          <figure className="study-preview" style={{ backgroundColor: project.accent[0] }}>
            <div>
              <span>
                <i />
                <i />
                <i />
              </span>
              <p>{project.title} / PRODUCT PREVIEW</p>
              <ExternalLink size={14} />
            </div>
            <img
              src={project.cover}
              alt={`${project.title} product walkthrough homepage`}
              width="1440"
              height="1000"
              fetchPriority="high"
            />
            <figcaption>Explore the product experience. Follow the engineering below.</figcaption>
          </figure>
        </header>
        <nav className="study-nav" aria-label="Case study sections">
          <div className="study-container">
            {sections.map(([id, label]) => (
              <a key={id} href={`#study-${id}`}>
                {label}
              </a>
            ))}
          </div>
        </nav>
        <div className="study-container study-body">
          <section id="study-overview" className="study-section">
            <div className="study-overview-grid">
              <SectionHeading
                index="01"
                eyebrow="THE PRODUCT"
                title="What it does. Who it serves."
              />
              <div className="study-prose">
                {study.introduction.map((text) => (
                  <p key={text}>{text}</p>
                ))}
              </div>
            </div>
            <div className="study-audiences">
              {study.audiences.map((audience, index) => (
                <article key={audience.title}>
                  <span>{number(index + 1)} / THE USERS</span>
                  <h3>{audience.title}</h3>
                  <p>{audience.description}</p>
                </article>
              ))}
            </div>
            <div className="study-ownership">
              <div>
                <p className="study-eyebrow">
                  <Code2 size={16} /> MY ENGINEERING SCOPE
                </p>
                <h3>
                  The work across
                  <br />
                  <span>the whole product.</span>
                </h3>
              </div>
              <ul>
                {study.ownership.map((item) => (
                  <li key={item}>
                    <Check size={16} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>
          <section id="study-build" className="study-section">
            <SectionHeading
              index="02"
              eyebrow="IMPLEMENTED CAPABILITIES"
              title="What I built."
              description="The product surfaces, services, and engineering work that connect the complete experience."
            />
            <div className="study-capabilities">
              {study.capabilities.map((area, index) => (
                <article key={area.title}>
                  <span className="study-area-number">{number(index + 1)} /</span>
                  <h3>{area.title}</h3>
                  <p>{area.description}</p>
                  <ul>
                    {area.details.map((detail) => (
                      <li key={detail}>
                        <Check size={14} />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </section>
          <section id="study-architecture" className="study-section">
            <SectionHeading
              index="03"
              eyebrow="THE SYSTEM, STEP BY STEP"
              title={architecture.headline}
              description={architecture.description}
            />
            <div className="study-architecture-context">
              <GitBranch size={19} />
              <p>{architecture.context}</p>
            </div>
            <div className="study-workflow-toolbar">
              <span>
                {architecture.phases.length} layers · {stageKeys.length} explanatory stages
              </span>
              <button
                type="button"
                onClick={() => setOpenStages(allOpen ? new Set() : new Set(stageKeys))}
                aria-expanded={allOpen}
                aria-controls="study-workflow"
              >
                {allOpen ? "Collapse all stages" : "Expand all stages"}
                <ChevronDown size={16} />
              </button>
            </div>
            <div id="study-workflow" className="study-workflow">
              {architecture.phases.map((phase, phaseIndex) => (
                <div className="study-phase" key={phase.title}>
                  <header>
                    <span>{number(phaseIndex + 1)}</span>
                    <div>
                      <h3>{phase.title}</h3>
                      <p>{phase.description}</p>
                    </div>
                  </header>
                  <div>
                    {phase.stages.map((stage, stageIndex) => {
                      const key = `${phaseIndex}-${stageIndex}`;
                      return (
                        <details
                          key={stage.title}
                          open={openStages.has(key)}
                          onToggle={(event) => {
                            const isOpen = event.currentTarget.open;
                            setOpenStages((previous) => {
                              if (previous.has(key) === isOpen) return previous;
                              const updated = new Set(previous);
                              if (isOpen) updated.add(key);
                              else updated.delete(key);
                              return updated;
                            });
                          }}
                          className="study-stage"
                        >
                          <summary>
                            <span>
                              {number(
                                architecture.phases
                                  .slice(0, phaseIndex)
                                  .reduce((total, item) => total + item.stages.length, 0) +
                                  stageIndex +
                                  1,
                              )}
                            </span>
                            <div>
                              <h4>{stage.title}</h4>
                              <p>{stage.summary}</p>
                            </div>
                            <ChevronDown size={17} />
                          </summary>
                          <div className="study-stage-content">
                            <dl>
                              <div>
                                <dt>Input</dt>
                                <dd>{stage.input}</dd>
                              </div>
                              <div>
                                <dt>Output</dt>
                                <dd>{stage.output}</dd>
                              </div>
                              <div>
                                <dt>Engineering decision</dt>
                                <dd>{stage.engineering}</dd>
                              </div>
                              <div>
                                <dt>Recovery &amp; boundaries</dt>
                                <dd>{stage.recovery}</dd>
                              </div>
                            </dl>
                            <ul aria-label={`${stage.title} technologies`}>
                              {stage.tools.map((tool) => (
                                <li key={tool}>{tool}</li>
                              ))}
                            </ul>
                            <p>
                              <Code2 size={14} /> {stage.skill}
                            </p>
                          </div>
                        </details>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            <h3 className="study-supporting-title">Supporting systems &amp; conditional paths</h3>
            <div className="study-supporting">
              {architecture.branches.map((branch) => (
                <article key={branch.title}>
                  <span>{branch.label}</span>
                  <h4>{branch.title}</h4>
                  <p>{branch.detail}</p>
                  <ul>
                    {branch.tools.map((tool) => (
                      <li key={tool}>{tool}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </section>
          <section id="study-decisions" className="study-section">
            <SectionHeading
              index="04"
              eyebrow="ENGINEERING JUDGEMENT"
              title="The decisions behind the implementation."
            />
            <div className="study-decisions">
              {study.decisions.map((decision, index) => (
                <article key={decision.title}>
                  <span>{number(index + 1)} /</span>
                  <h3>{decision.title}</h3>
                  <dl>
                    <div>
                      <dt>The challenge</dt>
                      <dd>{decision.challenge}</dd>
                    </div>
                    <div>
                      <dt>The approach</dt>
                      <dd>{decision.approach}</dd>
                    </div>
                    <div>
                      <dt>What this achieves</dt>
                      <dd>{decision.result}</dd>
                    </div>
                  </dl>
                </article>
              ))}
            </div>
          </section>
          <section id="study-stack" className="study-section">
            <SectionHeading
              index="05"
              eyebrow="THE COMPLETE TECHNOLOGY INVENTORY"
              title="Every layer of the stack."
              description={`${project.stack.length} unique tools and techniques across ${project.stackGroups.length} engineering layers. Includes frameworks, services, integrations, development tools, and explicitly labelled alternative paths.`}
            />
            <div className="study-full-stack">
              <ProjectTechStack project={project} full />
            </div>
          </section>
          <section id="study-quality" className="study-section">
            <SectionHeading
              index="06"
              eyebrow="QUALITY, SECURITY & DELIVERY"
              title="What surrounds the feature code."
            />
            <div className="study-quality">
              {study.quality.map((item) => (
                <article key={item.title}>
                  <ShieldCheck size={22} />
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              ))}
            </div>
          </section>
          <section id="study-impact" className="study-section">
            <div className="study-impact">
              <SectionHeading
                index="07"
                eyebrow="IMPLEMENTATION OUTCOMES"
                title="What this work makes possible."
              />
              <div>
                {study.outcomes.map((outcome, index) => (
                  <article key={outcome.title}>
                    <span>{number(index + 1)}</span>
                    <h3>{outcome.title}</h3>
                    <p>{outcome.description}</p>
                  </article>
                ))}
              </div>
            </div>
            <div className="study-boundaries">
              <h3>Deployment &amp; demonstration context</h3>
              <ul>
                {study.boundaries.map((boundary) => (
                  <li key={boundary}>{boundary}</li>
                ))}
              </ul>
            </div>
            <div className="study-evidence">
              <header>
                <div>
                  <p className="study-eyebrow">
                    <BookOpen size={15} /> REPOSITORY EVIDENCE
                  </p>
                  <h3>Follow the implementation.</h3>
                </div>
                <span>
                  <Github size={15} /> Public source · snapshot {study.commit.slice(0, 7)}
                </span>
              </header>
              <div>
                {study.sources.map((source) => (
                  <a
                    href={`https://github.com/${study.repository}/blob/${study.commit}/${source.path}`}
                    key={source.path}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span>
                      {source.label}
                      <small>{source.path}</small>
                    </span>
                    <ArrowUpRight size={17} />
                  </a>
                ))}
              </div>
            </div>
          </section>
          <footer className="study-next">
            <div>
              <p className="study-eyebrow">NEXT / KEEP EXPLORING</p>
              <Link to="/projects/$slug" params={{ slug: next.slug }}>
                {next.title}
                <ArrowRight size={30} />
              </Link>
            </div>
            <Link to="/" hash="work">
              All selected work <ArrowUpRight size={16} />
            </Link>
          </footer>
        </div>
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

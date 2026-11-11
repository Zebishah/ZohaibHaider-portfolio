import { Link } from "@tanstack/react-router";
import { useRef, useState, type KeyboardEvent } from "react";
import { ArrowUpRight, ArrowDownRight, Code2, Github, Layers3 } from "lucide-react";
import { projects, type Project } from "@/lib/projects";
import { Reveal } from "./Reveal";
import { Tilt } from "./Tilt";
import { ProjectTechStack } from "./ProjectTechStack";
import { projectCaseStudies } from "@/lib/projectCaseStudies";
import "./ProjectsGrid.css";
function ProjectStory({ project }: { project: Project }) {
  const [selected, setSelected] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const tabs = [
    { label: "Overview", key: "overview" },
    { label: "My work", key: "build" },
    { label: "Impact", key: "impact" },
  ] as const;
  function navigate(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const next =
      event.key === "ArrowRight"
        ? (index + 1) % tabs.length
        : event.key === "ArrowLeft"
          ? (index + tabs.length - 1) % tabs.length
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? tabs.length - 1
              : null;
    if (next === null) return;
    event.preventDefault();
    setSelected(next);
    refs.current[next]?.focus();
  }
  return (
    <div className="project-story">
      <div
        className="project-story-tabs"
        role="tablist"
        aria-label={`${project.title} project details`}
      >
        {tabs.map((tab, index) => (
          <button
            type="button"
            role="tab"
            key={tab.key}
            id={`${project.slug}-story-${tab.key}`}
            aria-controls={`${project.slug}-story-panel`}
            aria-selected={selected === index}
            tabIndex={selected === index ? 0 : -1}
            ref={(element) => {
              refs.current[index] = element;
            }}
            onClick={() => setSelected(index)}
            onKeyDown={(event) => navigate(event, index)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div
        className="project-story-panel"
        id={`${project.slug}-story-panel`}
        role="tabpanel"
        aria-labelledby={`${project.slug}-story-${tabs[selected].key}`}
        tabIndex={0}
      >
        <p>{projectCaseStudies[project.slug].card[tabs[selected].key]}</p>
      </div>
    </div>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const study = projectCaseStudies[project.slug];
  return (
    <article
      className={`project-card project-${project.slug}`}
      style={{ top: `${92 + index * 12}px`, zIndex: index + 1 }}
    >
      <div
        className="project-visual"
        style={{ backgroundColor: project.accent[0], color: project.accent[1] }}
      >
        <div className="project-art-circle" aria-hidden="true" />
        <span className="project-visual-label">{project.category}</span>
        <Tilt className="project-screen-tilt" strength={8}>
          <Link
            to="/projects/$slug"
            params={{ slug: project.slug }}
            className="project-screen"
            aria-label={`Read ${project.title} case study`}
          >
            <div className="browser-chrome">
              <i />
              <i />
              <i />
              <span>{project.title} · Product preview</span>
              <ArrowUpRight size={12} />
            </div>
            <img
              src={project.cover}
              alt={`${project.title} live product homepage`}
              width="1440"
              height="1000"
              loading="lazy"
            />
          </Link>
        </Tilt>
        <div className="project-visual-bottom">
          <strong>{project.shortTitle}</strong>
          <span>PRODUCT / ENGINEERING / SYSTEMS</span>
        </div>
      </div>
      <div className="project-copy">
        <div className="project-number">
          <span>SELECTED WORK</span>
          <strong>
            0{index + 1}
            <small>/ {String(projects.length).padStart(2, "0")}</small>
          </strong>
        </div>
        <span className="eyebrow">{project.category}</span>
        <h3>{project.title}</h3>
        <p className="project-tagline">{project.tagline}</p>
        <ProjectStory project={project} />
        <div className="project-build-meta">
          <span>
            <Code2 size={13} aria-hidden="true" /> Full-stack engineering
          </span>
          <span>
            <Layers3 size={13} aria-hidden="true" /> {study.capabilities.length} product areas
          </span>
        </div>
        <ProjectTechStack project={project} />
        <div className="project-links">
          <Link
            className="button button-green"
            to="/projects/$slug"
            params={{ slug: project.slug }}
          >
            Read full case study <ArrowUpRight size={18} />
          </Link>
          <a className="text-link" href={project.demo} target="_blank" rel="noreferrer">
            Live demo <ArrowUpRight size={16} />
          </a>
          <a
            className="project-source"
            href={project.github}
            target="_blank"
            rel="noreferrer"
            aria-label={`${project.title} GitHub repository (private)`}
          >
            <Github size={15} /> Code · private
          </a>
        </div>
      </div>
    </article>
  );
}
export function ProjectsGrid() {
  return (
    <section className="work-section section-wrap" id="work" aria-labelledby="work-title">
      <div className="section-label">
        <span>03 / SELECTED WORK</span>
        <span>FOUR SYSTEMS. DIFFERENT CHALLENGES.</span>
      </div>
      <Reveal className="work-heading">
        <div>
          <p className="eyebrow">LESS TALK. MORE BUILT.</p>
          <h2 id="work-title">
            IDEAS, MEET
            <br />
            <span className="serif-word">execution.</span>
          </h2>
        </div>
        <div>
          <ArrowDownRight size={58} strokeWidth={1} />
          <p>
            AI investigations. HR case intelligence.
            <br />
            Payments. Vehicle data.
            <br />
            Explore the engineering behind each one.
          </p>
        </div>
      </Reveal>
      <div className="project-stack">
        {projects.map((project, index) => (
          <ProjectCard key={project.slug} project={project} index={index} />
        ))}
      </div>
      <p className="work-postscript">
        Selected work, backed by experience contributing to 12+ commercial applications.
        <span>BUILT ACROSS THE STACK ↗</span>
      </p>
    </section>
  );
}

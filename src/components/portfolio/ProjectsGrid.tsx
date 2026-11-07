import { Link } from "@tanstack/react-router";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, Github } from "lucide-react";
import { projects, type Project } from "@/lib/projects";
import { Reveal } from "./Reveal";
import { Tilt } from "./Tilt";
import { usePortfolioMotion } from "./Motion";
import { ProjectTechStack } from "./ProjectTechStack";
function ProjectCard({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const { enabled } = usePortfolioMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.96, 1, 1, 0.98]);
  const rotateX = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [5, 0, 0, -2]);
  return (
    <motion.article
      ref={ref}
      className={`project-card project-${project.slug}`}
      style={{
        top: `${92 + index * 12}px`,
        zIndex: index + 1,
        scale: enabled ? scale : 1,
        rotateX: enabled ? rotateX : 0,
        transformPerspective: 1400,
      }}
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
            <small>/ 04</small>
          </strong>
        </div>
        <span className="eyebrow">{project.category}</span>
        <h3>{project.title}</h3>
        <p className="project-tagline">{project.tagline}</p>
        <p className="project-description">{project.overview}</p>
        <ProjectTechStack project={project} />
        <div className="project-links">
          <Link
            className="button button-green"
            to="/projects/$slug"
            params={{ slug: project.slug }}
          >
            Inside the build <ArrowUpRight size={18} />
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
    </motion.article>
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

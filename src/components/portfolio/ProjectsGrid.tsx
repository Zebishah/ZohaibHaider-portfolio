import { Link } from "@tanstack/react-router";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { ArrowUpRight, Github, ExternalLink } from "lucide-react";
import { projects, type Project } from "@/lib/projects";
import { Reveal, SectionHeader } from "./Reveal";
import type { MouseEvent } from "react";

function TiltCard({ project, index }: { project: Project; index: number }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-50, 50], [6, -6]);
  const rotateY = useTransform(x, [-50, 50], [-6, 6]);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - r.left - r.width / 2);
    y.set(e.clientY - r.top - r.height / 2);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <Reveal delay={index * 0.06}>
      <motion.div
        onMouseMove={onMove}
        onMouseLeave={reset}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="group relative h-full"
      >
        <Link
          to="/projects/$slug"
          params={{ slug: project.slug }}
          className="block h-full glass rounded-2xl overflow-hidden hover:border-primary/50 transition relative"
        >
          {/* Thumbnail */}
          <div
            className="relative aspect-[16/10] overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${project.accent[0]}, ${project.accent[1]})`,
            }}
          >
            <div className="absolute inset-0 opacity-30 grid-bg" />
            <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
              <div className="font-display font-bold text-2xl md:text-3xl text-white drop-shadow-lg">
                {project.title.split(" — ")[0]}
              </div>
            </div>
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition">
              <div className="glass rounded-full p-2">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          <div className="p-5">
            <h3 className="font-display font-semibold text-lg leading-snug group-hover:gradient-text transition">
              {project.title}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{project.tagline}</p>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {project.stack.slice(0, 5).map((t) => (
                <span key={t} className="text-[11px] px-2 py-0.5 rounded-full bg-accent/60 text-accent-foreground border border-border/50">
                  {t}
                </span>
              ))}
            </div>

            <div className="mt-5 flex items-center justify-between">
              <span className="text-xs font-medium gradient-text opacity-0 group-hover:opacity-100 transition">
                View Case Study →
              </span>
              <div className="flex items-center gap-1">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    aria-label="GitHub"
                    className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                )}
                {project.demo && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    aria-label="Live demo"
                    className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    </Reveal>
  );
}

export function ProjectsGrid() {
  return (
    <section id="projects" className="relative py-24">
      <div className="max-w-6xl mx-auto px-4">
        <SectionHeader
          eyebrow="Featured Work"
          title="Selected |case studies|."
          subtitle="Six real production platforms — each with a full breakdown, tech stack, and impact."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5" style={{ perspective: 1000 }}>
          {projects.map((p, i) => (
            <TiltCard key={p.slug} project={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

import { Link } from "@tanstack/react-router";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { ArrowUpRight, Github, ExternalLink } from "lucide-react";
import { projects, type Project } from "@/lib/projects";
import { Reveal, SectionHeader } from "./Reveal";
import type { MouseEvent } from "react";

function TiltCard({ project, index }: { project: Project; index: number }) {
  const gx = useMotionValue(50);
  const gy = useMotionValue(50);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    gx.set(((e.clientX - r.left) / r.width) * 100);
    gy.set(((e.clientY - r.top) / r.height) * 100);
  };
  const reset = () => {
    gx.set(50);
    gy.set(50);
  };

  const glow = useTransform(
    [gx, gy] as const,
    ([lx, ly]) =>
      `radial-gradient(300px circle at ${lx}% ${ly}%, color-mix(in oklab, var(--brand-from) 30%, transparent), transparent 60%)`,
  );

  return (
    <Reveal delay={index * 0.06}>
      <div
        onMouseMove={onMove}
        onMouseLeave={reset}
        className="group relative h-full"
      >
        <Link
          to="/projects/$slug"
          params={{ slug: project.slug }}
          className="flex h-full flex-col rounded-2xl overflow-hidden relative border border-border/70 bg-card transition-[border-color,box-shadow] duration-500 hover:border-primary/60 hover:shadow-[0_30px_80px_-30px_color-mix(in_oklab,var(--brand-from)_60%,transparent)]"
        >
          {/* Cursor-following glow */}
          <motion.span
            aria-hidden
            style={{ background: glow }}
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10"
          />

          {/* Thumbnail — solid bg, no backdrop-blur so screenshots stay crisp */}
          <div className="relative aspect-[16/10] shrink-0 overflow-hidden bg-muted">
            <img
              src={project.cover}
              alt={`${project.title} screenshot`}
              width={2880}
              height={1800}
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02]"
              loading="lazy"
            />
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition duration-500 z-10">
              <div className="rounded-full p-2 bg-background/80 border border-border/60 backdrop-blur-sm">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          <div className="relative flex flex-1 flex-col p-5">
            <h3 className="font-display font-semibold text-lg leading-snug transition-colors duration-300 group-hover:gradient-text">
              {project.title}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{project.tagline}</p>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {project.tags.map((t) => (
                <span
                  key={t}
                  className="text-[11px] px-2 py-0.5 rounded-full bg-accent/60 text-accent-foreground border border-border/50 transition-colors duration-300 group-hover:border-primary/40"
                >
                  {t}
                </span>
              ))}
            </div>

            {/* Pinned footer: icons always in the same bottom-right slot */}
            <div className="mt-auto pt-5 flex items-center gap-3">
              <span className="min-w-0 flex-1 text-xs font-medium gradient-text opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                View Case Study →
              </span>
              <div className="flex w-[4.25rem] shrink-0 items-center gap-0.5">
                {project.github ? (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    aria-label="GitHub"
                    className="inline-flex size-8 items-center justify-center rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors duration-300"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                ) : (
                  <span className="size-8" aria-hidden />
                )}
                {project.demo ? (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    aria-label="Live demo"
                    className="inline-flex size-8 items-center justify-center rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors duration-300"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                ) : (
                  <span className="size-8" aria-hidden />
                )}
              </div>
            </div>

            {/* Full-width linear sweep */}
            <div className="mt-4 h-[2px] w-full rounded-full bg-border/40 overflow-hidden relative">
              <span
                className="absolute inset-y-0 left-0 w-1/3 rounded-full animate-flow-bar-linear"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, var(--brand-from), var(--brand-to), transparent)",
                }}
              />
            </div>
          </div>
        </Link>
      </div>
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

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((p, i) => (
            <TiltCard key={p.slug} project={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

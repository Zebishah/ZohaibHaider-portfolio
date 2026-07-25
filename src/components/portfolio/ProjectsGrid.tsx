import { Link } from "@tanstack/react-router";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight, Github, ExternalLink } from "lucide-react";
import { projects, type Project } from "@/lib/projects";
import { Reveal, SectionHeader } from "./Reveal";
import type { MouseEvent } from "react";

function TiltCard({ project, index }: { project: Project; index: number }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const gx = useMotionValue(50);
  const gy = useMotionValue(50);

  // Springified motion for buttery-smooth tilt (no jitter)
  const sx = useSpring(x, { stiffness: 150, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 150, damping: 18, mass: 0.4 });
  const rotateX = useTransform(sy, [-50, 50], [8, -8]);
  const rotateY = useTransform(sx, [-50, 50], [-8, 8]);
  const translateZ = useTransform(sx, [-50, 50], [0, 0]);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - r.left;
    const py = e.clientY - r.top;
    x.set(px - r.width / 2);
    y.set(py - r.height / 2);
    gx.set((px / r.width) * 100);
    gy.set((py / r.height) * 100);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
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
      <motion.div
        onMouseMove={onMove}
        onMouseLeave={reset}
        style={{ rotateX, rotateY, translateZ, transformStyle: "preserve-3d" }}
        className="group relative h-full"
      >
        <Link
          to="/projects/$slug"
          params={{ slug: project.slug }}
          className="block h-full glass rounded-2xl overflow-hidden relative transition-[border-color,box-shadow] duration-500 hover:border-primary/60 hover:shadow-[0_30px_80px_-30px_color-mix(in_oklab,var(--brand-from)_60%,transparent)]"
        >
          {/* Cursor-following glow */}
          <motion.span
            aria-hidden
            style={{ background: glow }}
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          />

          {/* Thumbnail */}
          <div
            className="relative aspect-[16/10] overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${project.accent[0]}, ${project.accent[1]})`,
            }}
          >
            <motion.div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.35), transparent 45%)",
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
              <motion.div
                className="font-display font-bold text-2xl md:text-3xl text-white drop-shadow-lg"
                style={{ translateZ: 30 }}
              >
                {project.title.split(" — ")[0]}
              </motion.div>
            </div>
            {/* Shine sweep */}
            <span
              className="absolute -inset-x-full inset-y-0 group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none"
              style={{
                background:
                  "linear-gradient(120deg, transparent 35%, rgba(255,255,255,0.25) 50%, transparent 65%)",
              }}
            />
            <motion.div
              className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition duration-500"
              whileHover={{ rotate: 45 }}
            >
              <div className="glass rounded-full p-2">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </motion.div>
          </div>

          <div className="p-5 relative">
            <h3 className="font-display font-semibold text-lg leading-snug transition-colors duration-300 group-hover:gradient-text">
              {project.title}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{project.tagline}</p>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {project.stack.slice(0, 5).map((t) => (
                <span
                  key={t}
                  className="text-[11px] px-2 py-0.5 rounded-full bg-accent/60 text-accent-foreground border border-border/50 transition-colors duration-300 group-hover:border-primary/40"
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="mt-5 flex items-center justify-between">
              <span className="text-xs font-medium gradient-text opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
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
                    className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors duration-300"
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
                    className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors duration-300"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>

            {/* Bottom flowing bar */}
            <div className="mt-5 h-[2px] w-full rounded-full bg-border/40 overflow-hidden relative">
              <span
                className="absolute inset-y-0 w-1/3 rounded-full animate-flow-bar"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, var(--brand-from), var(--brand-to), transparent)",
                }}
              />
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

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5" style={{ perspective: 1200 }}>
          {projects.map((p, i) => (
            <TiltCard key={p.slug} project={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

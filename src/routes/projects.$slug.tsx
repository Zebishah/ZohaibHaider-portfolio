import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Github, ExternalLink, Sparkles, CheckCircle2, TrendingUp } from "lucide-react";
import { Navbar } from "@/components/portfolio/Navbar";
import { Footer } from "@/components/portfolio/Footer";
import { Reveal } from "@/components/portfolio/Reveal";
import { getProject, projects } from "@/lib/projects";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/projects/$slug")({
  loader: ({ params }): { project: NonNullable<ReturnType<typeof getProject>> } => {
    const project = getProject(params.slug);
    if (!project) throw notFound();
    return { project };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Project not found" }, { name: "robots", content: "noindex" }] };
    }
    const p = loaderData.project;
    return {
      meta: [
        { title: `${p.title} — Zohaib Haider` },
        { name: "description", content: p.tagline },
        { property: "og:title", content: p.title },
        { property: "og:description", content: p.tagline },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: `/projects/${p.slug}` }],
    };
  },
  component: ProjectDetail,
});

function ProjectDetail() {
  const { project } = Route.useLoaderData();
  const idx = projects.findIndex((p) => p.slug === project.slug);
  const next = projects[(idx + 1) % projects.length];

  return (
    <div className="relative min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 grid-bg opacity-40" />
          <div className="absolute -top-32 -left-16 w-[480px] h-[480px] rounded-full blur-3xl opacity-40 animate-blob"
            style={{ background: `radial-gradient(circle, ${project.accent[0]}, transparent 60%)` }} />
          <div className="absolute -bottom-32 -right-16 w-[480px] h-[480px] rounded-full blur-3xl opacity-40 animate-blob"
            style={{ background: `radial-gradient(circle, ${project.accent[1]}, transparent 60%)`, animationDelay: "3s" }} />
        </div>
        <div className="relative max-w-4xl mx-auto px-4">
          <Link to="/" hash="projects" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to portfolio
          </Link>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-6xl font-bold tracking-tight"
          >
            {project.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 text-lg md:text-xl text-muted-foreground max-w-3xl"
          >
            {project.tagline}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 flex flex-wrap gap-2"
          >
            {project.github && (
              <a href={project.github} target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-2 glass rounded-lg px-4 py-2 text-sm hover:border-primary/50 transition">
                <Github className="w-4 h-4" /> GitHub
              </a>
            )}
            {project.demo && (
              <a href={project.demo} target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-2 gradient-bg text-white rounded-lg px-4 py-2 text-sm shadow-lg shadow-primary/20">
                <ExternalLink className="w-4 h-4" /> Live Demo
              </a>
            )}
          </motion.div>
        </div>
      </section>

      {/* Cover / gallery placeholder */}
      <section className="relative max-w-4xl mx-auto px-4">
        <Reveal>
          <div
            className="relative aspect-[16/9] rounded-2xl overflow-hidden glass"
            style={{ background: `linear-gradient(135deg, ${project.accent[0]}, ${project.accent[1]})` }}
          >
            <div className="absolute inset-0 grid-bg opacity-30" />
            <div className="absolute inset-0 grid place-items-center">
              <div className="font-display font-bold text-4xl md:text-6xl text-white drop-shadow-2xl text-center px-6">
                {project.title.split(" — ")[0]}
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Body */}
      <section className="relative max-w-4xl mx-auto px-4 py-16 space-y-14">
        <Reveal>
          <div>
            <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" /> Overview
            </h2>
            <p className="text-base md:text-lg leading-relaxed text-foreground/90">{project.overview}</p>
          </div>
        </Reveal>

        <Reveal>
          <div>
            <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">My Role</h2>
            <p className="text-base md:text-lg leading-relaxed text-foreground/90">{project.role}</p>
          </div>
        </Reveal>

        <Reveal>
          <div>
            <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Tech Stack</h2>
            <div className="flex flex-wrap gap-2">
              {project.stack.map((t: string) => (
                <span key={t} className="text-sm px-3 py-1 rounded-full glass hover:border-primary/50 transition">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal>
          <div>
            <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Key Features</h2>
            <ul className="grid md:grid-cols-2 gap-3">
              {project.features.map((f: string, i: number) => (
                <li key={i} className="glass rounded-xl p-4 flex gap-3 hover:border-primary/40 transition">
                  <CheckCircle2 className="w-5 h-5 shrink-0 text-primary mt-0.5" />
                  <span className="text-sm leading-relaxed">{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal>
          <div className="glass rounded-2xl p-6 md:p-8 relative overflow-hidden">
            <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full blur-3xl opacity-30"
              style={{ background: `radial-gradient(circle, ${project.accent[0]}, transparent 60%)` }} />
            <h2 className="relative text-xs uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5" /> Impact
            </h2>
            <p className="relative text-base md:text-lg leading-relaxed text-foreground/90">{project.impact}</p>
          </div>
        </Reveal>

        {/* Next project */}
        <Reveal>
          <div className="pt-6 border-t border-border/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <Link to="/" hash="projects" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition">
              <ArrowLeft className="w-4 h-4" /> All projects
            </Link>
            <Link
              to="/projects/$slug"
              params={{ slug: next.slug }}
              className="group inline-flex items-center gap-3 glass rounded-xl px-4 py-3 hover:border-primary/50 transition"
            >
              <div className="text-right">
                <div className="text-xs text-muted-foreground uppercase tracking-widest">Next Project</div>
                <div className="text-sm font-medium group-hover:gradient-text transition">{next.title.split(" — ")[0]}</div>
              </div>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </Link>
          </div>
        </Reveal>
      </section>

      <Footer />
      <Toaster position="bottom-right" theme="dark" />
    </div>
  );
}

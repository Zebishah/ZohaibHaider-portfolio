import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, ArrowUpRight, Github } from "lucide-react";
import { Navbar } from "@/components/portfolio/Navbar";
import { Footer } from "@/components/portfolio/Footer";
import { Contact } from "@/components/portfolio/Contact";
import { Reveal } from "@/components/portfolio/Reveal";
import { getProject, projects } from "@/lib/projects";

export const Route = createFileRoute("/projects/$slug")({
  loader: ({ params }) => {
    const project = getProject(params.slug);
    if (!project) throw notFound();
    return { project };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.project.title} — Engineering case study · Zohaib Haider` },
          { name: "description", content: loaderData.project.overview },
          { property: "og:title", content: `${loaderData.project.title} — Zohaib Haider` },
          { property: "og:description", content: loaderData.project.tagline },
          { property: "og:type", content: "article" },
        ]
      : [{ title: "Project not found" }, { name: "robots", content: "noindex" }],
  }),
  component: ProjectDetail,
});

function ProjectDetail() {
  const { project } = Route.useLoaderData();
  const next = projects[(projects.findIndex((p) => p.slug === project.slug) + 1) % projects.length];
  return (
    <div id="top">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Navbar />
      <main id="main-content">
        <section className="case-hero section-wrap">
          <Link to="/" hash="work" className="case-back">
            <ArrowLeft size={15} /> Back to selected work
          </Link>
          <div className="case-title-row">
            <div>
              <p className="eyebrow">ENGINEERING CASE STUDY / {project.category}</p>
              <h1>{project.title}</h1>
              <p>{project.tagline}</p>
            </div>
            <div className="case-actions">
              <a
                href={project.demo}
                className="button button-green"
                target="_blank"
                rel="noreferrer"
              >
                Explore live demo <ArrowUpRight size={18} />
              </a>
              <a className="text-link" href={project.github} target="_blank" rel="noreferrer">
                <Github size={15} /> Code · private
              </a>
            </div>
          </div>
          <div className="case-preview" style={{ backgroundColor: project.accent[0] }}>
            <img
              src={project.cover}
              alt={`${project.title} public product walkthrough`}
              width="1440"
              height="1000"
              fetchPriority="high"
            />
          </div>
        </section>
        <section className="section-wrap case-overview" aria-label="Project overview">
          <Reveal>
            <p className="eyebrow">THE PRODUCT</p>
            <h2 style={{ marginTop: 20 }}>What it does.</h2>
            <p>{project.overview}</p>
          </Reveal>
          <Reveal className="case-role">
            <h3>My work</h3>
            <p>{project.role}</p>
          </Reveal>
        </section>
        <section className="case-challenges">
          <div className="section-wrap">
            <div className="section-label">
              <span>THE PROBLEM / THE DESIGN / THE ENGINEERING</span>
              <span>BEHIND THE EXPERIENCE.</span>
            </div>
            <div className="case-three-columns">
              {[
                ["01", "The challenge", project.problem],
                ["02", "The approach", project.solution],
                ["03", "The important decision", project.engineering],
              ].map(([number, title, text]) => (
                <Reveal key={number}>
                  <span className="eyebrow">{number} /</span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
        <section className="section-wrap">
          <div className="case-features">
            <Reveal>
              <p className="eyebrow">IMPLEMENTED CAPABILITIES</p>
              <h2 style={{ marginTop: 20 }}>
                Built into
                <br />
                <span className="serif-word">the system.</span>
              </h2>
            </Reveal>
            <ul>
              {project.features.map((feature, i) => (
                <li key={feature}>
                  <span>0{i + 1}</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          <div className="case-stack">
            <p className="eyebrow">THE STACK</p>
            <h2 style={{ marginTop: 16 }}>Tools behind the build.</h2>
            <div className="skill-chips">
              {project.stack.map((tool) => (
                <span key={tool}>{tool}</span>
              ))}
            </div>
          </div>
          <div className="case-note">
            <strong>Project context. </strong>
            {project.note}
            <br />
            <strong>Repository access. </strong>The GitHub repository is currently private. The
            public product walkthrough is available through the live demo link.
          </div>
        </section>
        <section className="case-next section-wrap">
          <div>
            <p>KEEP EXPLORING / NEXT BUILD</p>
            <Link to="/projects/$slug" params={{ slug: next.slug }}>
              <h2>{next.title}</h2>
              <ArrowRight size={32} />
            </Link>
          </div>
          <Link to="/" hash="work" className="text-link">
            All selected work <ArrowUpRight size={18} />
          </Link>
        </section>
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

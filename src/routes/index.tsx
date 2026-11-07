import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/portfolio/Navbar";
import { Hero } from "@/components/portfolio/Hero";
import { About } from "@/components/portfolio/About";
import { Skills } from "@/components/portfolio/Skills";
import { ProjectsGrid } from "@/components/portfolio/ProjectsGrid";
import { Bring } from "@/components/portfolio/Bring";
import { Experience } from "@/components/portfolio/Experience";
import { Contact } from "@/components/portfolio/Contact";
import { Footer } from "@/components/portfolio/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Zohaib Haider — Full-stack Software Engineer | AI Systems" },
      {
        name: "description",
        content:
          "Zohaib Haider builds websites, web applications, business dashboards, AI integrations, and workflow automation that connect operations, reporting, and business data.",
      },
      {
        property: "og:title",
        content: "Zohaib Haider — Full-stack Software Engineer | AI Systems",
      },
      {
        property: "og:description",
        content:
          "Custom websites, business dashboards, AI integrations, and workflow automation. Full-stack engineering with React, Node.js, Python, and FastAPI.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <div id="top">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Navbar />
      <main id="main-content">
        <Hero />
        <About />
        <Skills />
        <ProjectsGrid />
        <Bring />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

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
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Zohaib Haider — Full Stack MERN Developer & Backend Engineer" },
      {
        name: "description",
        content:
          "Portfolio of Zohaib Haider — full-stack MERN developer with 1.5+ years shipping production SaaS platforms, payment systems, and AI integrations across React, Node.js, PostgreSQL, and AWS.",
      },
      { property: "og:title", content: "Zohaib Haider — Full Stack MERN Developer" },
      { property: "og:description", content: "Production-grade SaaS, payments, and AI integrations. React · Node.js · PostgreSQL · AWS." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <div className="relative min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <ProjectsGrid />
        <Bring />
        <Experience />
        <Contact />
      </main>
      <Footer />
      <Toaster position="bottom-right" theme="dark" />
    </div>
  );
}

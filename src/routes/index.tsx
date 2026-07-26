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
      { title: "Zohaib Haider — Full-Stack Developer (MERN, NestJS, AI)" },
      {
        name: "description",
        content:
          "Portfolio of Zohaib Haider — full-stack developer shipping production SaaS, Stripe payments, NestJS APIs, and AI/LLM integrations across React, Node.js, PostgreSQL, and AWS.",
      },
      { property: "og:title", content: "Zohaib Haider — Full-Stack Developer" },
      {
        property: "og:description",
        content: "Production SaaS, Stripe payments, NestJS backends, and AI/LLM integrations. React · Node.js · PostgreSQL · AWS.",
      },
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

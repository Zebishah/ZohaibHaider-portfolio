import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { getProject } from "@/lib/projects";
import { ProjectCaseStudy } from "@/components/portfolio/ProjectCaseStudy";

const legacyProjectSlugs = new Map([
  ["ops-pilot", "trace-ops"],
  ["hr-intelligence", "case-lens"],
  ["dsp", "drive-pilot"],
  ["rta-mark", "dealer-flow"],
]);

export const Route = createFileRoute("/projects/$slug")({
  loader: ({ params }) => {
    const canonicalSlug = legacyProjectSlugs.get(params.slug);
    if (canonicalSlug) {
      throw redirect({ to: "/projects/$slug", params: { slug: canonicalSlug }, statusCode: 301 });
    }
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
  return <ProjectCaseStudy key={project.slug} project={project} />;
}

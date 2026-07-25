import { Briefcase, GraduationCap } from "lucide-react";
import { Reveal, SectionHeader } from "./Reveal";

export function Experience() {
  return (
    <section id="experience" className="relative py-24">
      <div className="max-w-4xl mx-auto px-4">
        <SectionHeader
          eyebrow="Experience"
          title="Where I've |shipped|."
        />

        <div className="relative pl-8 md:pl-12">
          <div className="absolute left-2 md:left-4 top-2 bottom-2 w-px bg-gradient-to-b from-primary via-primary/40 to-transparent" />

          <Reveal>
            <div className="relative">
              <div className="absolute -left-8 md:-left-12 top-1 w-4 h-4 md:w-6 md:h-6 rounded-full gradient-bg grid place-items-center animate-pulse-ring">
                <Briefcase className="w-2 h-2 md:w-3 md:h-3 text-white" />
              </div>
              <div className="glass rounded-2xl p-6 md:p-7">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-display font-semibold text-xl">Junior Full Stack Developer</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full gradient-bg text-white font-medium">Current</span>
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  Jidat IT (Software House) · Islamabad, Pakistan · <span className="text-foreground/80">Feb 2024 – Present</span>
                </div>
                <ul className="mt-5 space-y-3 text-sm md:text-[15px] text-muted-foreground">
                  {[
                    "Delivered end-to-end features across 10+ modules using React, Next.js, Node.js, and Express, writing clean, scalable, maintainable code for 3+ user roles.",
                    "Built REST and GraphQL APIs backed by MongoDB and PostgreSQL, supporting real-time chat, notifications, and alerts for 1K+ monthly users while cutting latency by 25%.",
                    "Deployed and managed infrastructure on AWS (EC2, S3, Lambda), improving reliability and cutting deployment time via Docker and CI/CD pipelines.",
                    "Collaborated with product, design, and QA to plan, build, and ship full-stack features from database design through UI implementation.",
                    "Implemented secure auth via JWT, OAuth, and RBAC middleware, improving API response times by up to 30% through Redis caching and query optimization.",
                  ].map((line, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="mt-2 shrink-0 w-1.5 h-1.5 rounded-full gradient-bg" />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="relative mt-8">
              <div className="absolute -left-8 md:-left-12 top-1 w-4 h-4 md:w-6 md:h-6 rounded-full gradient-bg grid place-items-center">
                <GraduationCap className="w-2 h-2 md:w-3 md:h-3 text-white" />
              </div>
              <div className="glass rounded-2xl p-6 md:p-7">
                <h3 className="font-display font-semibold text-xl">B.S. Software Engineering</h3>
                <div className="mt-1 text-sm text-muted-foreground">
                  International Islamic University, Islamabad · <span className="text-foreground/80">Sep 2020 – Aug 2024</span>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                  <span className="px-2 py-0.5 rounded-full glass text-xs">CGPA 3.66 / 4.00</span>
                  <span className="text-muted-foreground text-xs">
                    Coursework: Data Structures, Algorithms, Database Systems, Web Development
                  </span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

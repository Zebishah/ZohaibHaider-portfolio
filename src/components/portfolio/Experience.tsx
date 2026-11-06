import { ArrowUpRight, BriefcaseBusiness, GraduationCap } from "lucide-react";
import { Reveal } from "./Reveal";
import { socials } from "@/lib/socials";
export function Experience() {
  return (
    <section
      className="experience-section section-wrap"
      id="experience"
      aria-labelledby="experience-title"
    >
      <div className="section-label">
        <span>05 / THE FOUNDATION</span>
        <span>EXPERIENCE THAT CONNECTS THE DOTS.</span>
      </div>
      <div className="experience-grid">
        <Reveal>
          <p className="eyebrow">LEARN. BUILD. TAKE IT FURTHER.</p>
          <h2 id="experience-title">
            A foundation
            <br />
            in <span className="serif-word">doing.</span>
          </h2>
          <p>
            Commercial software experience.
            <br />A software engineering degree.
            <br />
            An expanding practice in applied AI.
          </p>
          <a className="text-link" href={socials.resume} target="_blank" rel="noreferrer">
            Read the full résumé <ArrowUpRight size={18} />
          </a>
        </Reveal>
        <div className="experience-timeline">
          <Reveal className="experience-entry">
            <span className="timeline-icon">
              <BriefcaseBusiness size={19} />
            </span>
            <span className="eyebrow">AUG 2024 — AUG 2026 / ISLAMABAD</span>
            <h3>Full Stack Developer</h3>
            <p className="experience-company">Jidat IT</p>
            <p>
              Contributed to 12+ commercial web applications across SaaS, fintech, healthcare,
              marketplaces, and CRM. Built React and Next.js interfaces, Node.js and NestJS
              backends, role-based systems, and third-party integrations.
            </p>
            <div className="experience-tags">
              <span>Payments & accounting</span>
              <span>Multi-tenant SaaS</span>
              <span>End-to-end delivery</span>
            </div>
          </Reveal>
          <Reveal className="experience-entry">
            <span className="timeline-icon">
              <GraduationCap size={20} />
            </span>
            <span className="eyebrow">SEP 2020 — AUG 2024 / ISLAMABAD</span>
            <h3>BS Software Engineering</h3>
            <p className="experience-company">International Islamic University Islamabad</p>
            <p>A grounding in software design, systems, and engineering practice.</p>
            <span className="education-score">
              3.66 <small>/ 4.00 CGPA</small>
            </span>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

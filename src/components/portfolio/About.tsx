import { ArrowUpRight, MapPin } from "lucide-react";
import { socials } from "@/lib/socials";
import { Reveal } from "./Reveal";
export function About() {
  return (
    <section className="about section-wrap" id="about" aria-labelledby="about-title">
      <div className="section-label">
        <span>01 / A LITTLE CONTEXT</span>
        <span>THE PERSON BEHIND THE PRODUCTS ↙</span>
      </div>
      <div className="about-grid">
        <Reveal className="about-portrait">
          <img
            src={socials.portrait}
            alt="Zohaib Haider"
            width="1070"
            height="1470"
            loading="lazy"
          />
          <span>
            <MapPin size={13} /> Islamabad, Pakistan
          </span>
        </Reveal>
        <Reveal className="about-copy">
          <p className="eyebrow">SOFTWARE ENGINEER. SYSTEMS THINKER. BUILDER.</p>
          <h2 id="about-title">
            I connect the
            <br />
            <span className="serif-word">whole</span> picture.
          </h2>
          <p className="lead">
            I'm Zohaib. I build the interface, the intelligence, and everything that makes them work
            together.
          </p>
          <p>
            I'm a full-stack software engineer working across React, Node.js, Python, and applied
            AI. Over two years at Jidat IT, I contributed to 12+ commercial applications across
            SaaS, fintech, healthcare, marketplaces, and CRM.
          </p>
          <p>
            My work now connects that full-stack foundation with agentic workflows, retrieval,
            fine-tuning pipelines, voice, and automation. From the first screen to the database,
            payment flow, and deployment, I care about how the complete system behaves.
          </p>
          <a className="text-link" href={socials.resume} target="_blank" rel="noreferrer">
            A closer look at my experience <ArrowUpRight size={17} />
          </a>
        </Reveal>
      </div>
      <Reveal className="stats-grid">
        {[
          ["2+", "Years of hands-on engineering"],
          ["16+", "Projects across my journey"],
          ["4+", "Applications with payment integrations"],
          ["04", "Selected systems to explore"],
        ].map(([number, label]) => (
          <div className="stat" key={label}>
            <strong>
              {number}
              <span>↗</span>
            </strong>
            <p>{label}</p>
          </div>
        ))}
      </Reveal>
    </section>
  );
}

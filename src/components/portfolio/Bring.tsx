import { useState } from "react";
import { ArrowRight, Check, Fingerprint } from "lucide-react";
import { projects } from "@/lib/projects";
import { Reveal } from "./Reveal";
export function Bring() {
  const [selected, setSelected] = useState(0);
  const [step, setStep] = useState(0);
  const project = projects[selected];
  return (
    <section className="system-section" id="systems" aria-labelledby="system-title">
      <div className="section-wrap">
        <div className="section-label">
          <span>04 / UNDER THE HOOD</span>
          <span>GOOD INTERFACES ARE ONLY THE BEGINNING.</span>
        </div>
        <Reveal className="system-heading">
          <h2 id="system-title">
            The work beneath
            <br />
            <span className="serif-word">the interface.</span>
          </h2>
          <p>
            AI is useful when it connects to real systems.
            <br />
            Explore the decisions behind the experience.
          </p>
        </Reveal>
        <div className="system-tabs" aria-label="Choose project architecture">
          {projects.map((p, i) => (
            <button
              key={p.slug}
              aria-pressed={i === selected}
              onClick={() => {
                setSelected(i);
                setStep(0);
              }}
            >
              <span>0{i + 1}</span>
              {p.title}
            </button>
          ))}
        </div>
        <div className="system-explorer">
          <div className="system-topline">
            <span>
              <Fingerprint size={15} /> {project.title} / WORKFLOW
            </span>
            <span>SELECT A STAGE TO EXPLORE</span>
          </div>
          <ol className="workflow">
            {project.flow.map((node, i) => (
              <li key={`${project.slug}-${node.title}`}>
                <button aria-pressed={step === i} onClick={() => setStep(i)}>
                  <span className="workflow-node-number">0{i + 1}</span>
                  <strong>{node.title}</strong>
                  <span className="workflow-node-icon">
                    {i === project.flow.length - 1 ? <Check size={20} /> : <ArrowRight size={20} />}
                  </span>
                </button>
                {i < 3 && (
                  <span className="workflow-connector" aria-hidden="true">
                    <i />
                  </span>
                )}
              </li>
            ))}
          </ol>
          <div className="workflow-explanation" aria-live="polite">
            <span className="eyebrow">
              0{step + 1} / {project.flow[step].title.toUpperCase()}
            </span>
            <p>{project.flow[step].detail}</p>
          </div>
          <div className="system-principle">
            <span>THE ENGINEERING CHOICE</span>
            <p>{project.engineering}</p>
          </div>
        </div>
        <div className="principle-row">
          {[
            [
              "01",
              "Intelligence with boundaries",
              "Scoped tools, validated outputs, and explicit human approval where actions need it.",
            ],
            [
              "02",
              "Reliability beyond happy paths",
              "Idempotency, durable events, retries, and reconciliation for the failures that actually happen.",
            ],
            [
              "03",
              "Ownership across layers",
              "From interface and API to data model, integration, tests, and deployment.",
            ],
          ].map(([n, title, text]) => (
            <Reveal key={n}>
              <span>{n} /</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

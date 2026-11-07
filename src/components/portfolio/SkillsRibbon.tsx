import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowUpRight, Pause, Play } from "lucide-react";
import { skillGroups, totalSkills } from "@/lib/skills";
import { usePortfolioMotion } from "./Motion";

type RibbonSkill = { name: string; domain: string };
const uniqueSkills = new Map<string, RibbonSkill>();
for (const group of skillGroups)
  for (const name of group.items)
    if (!uniqueSkills.has(name)) uniqueSkills.set(name, { name, domain: group.domain });
const rows: RibbonSkill[][] = Array.from({ length: 5 }, () => []);
[...uniqueSkills.values()].forEach((skill, index) => rows[index % rows.length].push(skill));

function RibbonRow({ skills, index }: { skills: RibbonSkill[]; index: number }) {
  const group = useRef<HTMLUListElement>(null);
  const [duration, setDuration] = useState(160);
  useEffect(() => {
    const element = group.current;
    if (!element) return;
    const observer = new ResizeObserver(() => {
      // Equal pixel speeds, independent of how long the skill names are.
      setDuration(element.getBoundingClientRect().width / (42 + index * 2));
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [index]);
  return (
    <div className="skill-ribbon-lane" data-direction={index % 2 ? "right" : "left"}>
      <div
        className="skill-ribbon-track"
        style={
          {
            "--ribbon-duration": `${duration}s`,
            "--ribbon-delay": `${-index * 17}s`,
          } as CSSProperties
        }
      >
        {[false, true].map((duplicate) => (
          <ul
            className="skill-ribbon-group"
            key={String(duplicate)}
            ref={duplicate ? undefined : group}
            aria-hidden={duplicate || undefined}
          >
            {skills.map((skill) => (
              <li className="skill-ribbon-chip" key={skill.name} data-domain={skill.domain}>
                <i aria-hidden="true" />
                {skill.name}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

export function SkillsRibbon({ onBrowse }: { onBrowse: () => void }) {
  const root = useRef<HTMLElement>(null);
  const { enabled } = usePortfolioMotion();
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      rootMargin: "100px",
    });
    observer.observe(element);
    const update = () => setVisible(!document.hidden);
    update();
    document.addEventListener("visibilitychange", update);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, []);
  const running = enabled && !paused && inView && visible;
  return (
    <section
      className="skill-ribbon"
      ref={root}
      data-running={running}
      aria-labelledby="skill-ribbon-title"
    >
      <header className="skill-ribbon-heading">
        <div>
          <p className="studio-discovery-eyebrow">
            <i /> THE COMPLETE TOOLKIT
          </p>
          <h3 id="skill-ribbon-title">
            {totalSkills} skills.<span> Always connected.</span>
          </h3>
          <p>From the first interface to the systems behind it.</p>
        </div>
        <button
          className="skill-ribbon-pause"
          disabled={!enabled}
          aria-pressed={paused}
          onClick={() => setPaused((value) => !value)}
        >
          {paused || !enabled ? <Play size={14} /> : <Pause size={14} />}
          {!enabled ? "Motion off" : paused ? "Resume animation" : "Pause animation"}
        </button>
      </header>
      <div
        className="skill-ribbon-lanes"
        role="group"
        aria-label={`${totalSkills} unique skills in five scrolling rows`}
      >
        {rows.map((skills, index) => (
          <RibbonRow key={index} skills={skills} index={index} />
        ))}
      </div>
      <footer className="skill-ribbon-footer">
        <span>
          <i /> Software <i /> AI <i /> Systems
        </span>
        <button onClick={onBrowse}>
          Explore the full skill index <ArrowUpRight size={16} />
        </button>
      </footer>
    </section>
  );
}

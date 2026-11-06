import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { ArrowDown, ArrowUpRight, Search, X } from "lucide-react";
import { skillGroups, totalSkills } from "@/lib/skills";
import { usePortfolioMotion } from "./Motion";
import { Reveal } from "./Reveal";
const SkillSculpture = lazy(() => import("./SkillSculpture"));
export function Skills() {
  const [domain, setDomain] = useState("All");
  const [selected, setSelected] = useState("Agentic AI & retrieval");
  const [query, setQuery] = useState("");
  const [complete, setComplete] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(true);
  const scene = useRef<HTMLDivElement>(null);
  const inView = useInView(scene, { margin: "100px" });
  const { enabled } = usePortfolioMotion();
  useEffect(() => {
    setMounted(true);
    const update = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);
  const groups = useMemo(
    () => skillGroups.filter((group) => domain === "All" || group.domain === domain),
    [domain],
  );
  const matches = useMemo(
    () =>
      skillGroups
        .map((group) => ({
          ...group,
          items: group.items.filter(
            (item) =>
              item.toLowerCase().includes(query.toLowerCase()) ||
              group.name.toLowerCase().includes(query.toLowerCase()),
          ),
        }))
        .filter((group) => group.items.length),
    [query],
  );
  const current = skillGroups.find((group) => group.name === selected) ?? skillGroups[0];
  function chooseDomain(value: string) {
    setDomain(value);
    setSelected(skillGroups.find((group) => value === "All" || group.domain === value)!.name);
  }
  return (
    <section className="skills-section" id="skills" aria-labelledby="skills-title">
      <div className="section-wrap">
        <div className="section-label">
          <span>02 / THE TOOLKIT</span>
          <span>INTELLIGENCE × INTERFACE × INFRASTRUCTURE</span>
        </div>
        <div className="skills-intro">
          <Reveal>
            <p className="eyebrow">ONE CONNECTED ENGINEERING PRACTICE</p>
            <h2 id="skills-title">
              THE FULL
              <br />
              <span className="lime-text">PICTURE.</span>
            </h2>
            <p>
              From a React interface to a stateful AI agent.
              <br />
              The tools to build every layer between them.
            </p>
            <span className="skills-count">
              {skillGroups.length} areas of practice <i /> {totalSkills} tools & techniques
            </span>
          </Reveal>
          <div
            className="skill-art"
            ref={scene}
            aria-label="Animated three-dimensional sculpture representing connected engineering disciplines"
          >
            <div className="sculpture-fallback" aria-hidden="true">
              <i />
              <i />
              <i />
              <b />
            </div>
            {mounted && inView && (
              <Suspense fallback={null}>
                <SkillSculpture active={enabled && visible && inView} />
              </Suspense>
            )}
            <span className="orbit-label orbit-one">AI + AUTOMATION</span>
            <span className="orbit-label orbit-two">FULL-STACK SOFTWARE</span>
            <span className="orbit-label orbit-three">RELIABLE SYSTEMS</span>
            <span className="art-caption">CONNECTED BY DESIGN / BUILT WITH INTENT</span>
          </div>
        </div>
        <div className="skill-controls">
          <div className="segmented" aria-label="Filter skills by discipline">
            {["All", "AI", "Software", "Systems"].map((value) => (
              <button
                key={value}
                onClick={() => chooseDomain(value)}
                aria-pressed={domain === value}
              >
                {value}
              </button>
            ))}
          </div>
          <label className="skill-search">
            <Search size={16} />
            <span className="sr-only">Search all skills</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Find a tool or technique…"
            />
            {query && (
              <button onClick={() => setQuery("")} aria-label="Clear skill search">
                <X size={16} />
              </button>
            )}
          </label>
        </div>
        {query ? (
          <div className="skill-search-results" aria-live="polite">
            <p className="eyebrow">
              {matches.reduce((sum, group) => sum + group.items.length, 0)} MATCHES ACROSS THE
              COMPLETE STACK
            </p>
            {matches.length ? (
              matches.map((group) => (
                <div key={group.name}>
                  <h3>{group.name}</h3>
                  <div className="skill-chips">
                    {group.items.map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p>No matches for “{query}”. Try a language, framework, or engineering practice.</p>
            )}
          </div>
        ) : (
          <div className="skills-workspace">
            <div className="skill-group-list" aria-label="Skill categories">
              {groups.map((group, i) => (
                <button
                  key={group.name}
                  onClick={() => setSelected(group.name)}
                  aria-pressed={selected === group.name}
                >
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  {group.name}
                  <ArrowUpRight size={16} />
                </button>
              ))}
            </div>
            <div className="skill-detail" aria-live="polite">
              <div className="skill-detail-top">
                <span className="eyebrow">
                  {current.domain} / {current.items.length} TOOLS & TECHNIQUES
                </span>
                <span className="skill-detail-symbol" aria-hidden="true">
                  ✳
                </span>
              </div>
              <h3>{current.name}</h3>
              <div className="skill-chips" key={current.name}>
                {current.items.map((item, i) => (
                  <span style={{ animationDelay: `${i * 22}ms` }} key={item}>
                    {item}
                  </span>
                ))}
              </div>
              <div className="skill-panel-footer">
                <i className="status-dot" /> Applied across real projects{" "}
                <span>EXPLORE THE WORK BELOW ↘</span>
              </div>
            </div>
          </div>
        )}
        <button
          className="complete-stack-toggle"
          onClick={() => setComplete(!complete)}
          aria-expanded={complete}
          aria-controls="complete-stack"
        >
          {complete ? "Close complete stack" : "View the complete stack"}
          <ArrowDown size={17} style={{ transform: complete ? "rotate(180deg)" : undefined }} />
        </button>
        {complete && (
          <div className="complete-stack" id="complete-stack">
            {skillGroups.map((group) => (
              <div key={group.name}>
                <h3>{group.name}</h3>
                <div className="skill-chips">
                  {group.items.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="skill-marquee" aria-hidden="true">
        <div>
          {Array.from({ length: 2 }, (_, repeat) => (
            <span key={repeat}>
              INTELLIGENCE THAT WORKS <i>✳</i> SOFTWARE THAT CONNECTS <i>✳</i> SYSTEMS THAT HOLD UP{" "}
              <i>✳</i>{" "}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

import { SkillsAtlas } from "./SkillsAtlas";
export function Skills() {
  return (
    <section
      className="skills-section skills-circuit-section"
      id="skills"
      aria-labelledby="skills-title"
    >
      <div className="section-wrap">
        <SkillsAtlas />
      </div>
    </section>
  );
}

import { useRef } from "react";
import { ArrowRight, ArrowUpRight, Compass, Move3D, MousePointer2, ZoomIn } from "lucide-react";
import { domainTools, skillDomains } from "./skillWorld";
import { totalSkills } from "@/lib/skills";

const roomNotes = [
  "Interfaces & design systems",
  "Services, APIs & real-time connections",
  "Storage, queries & data models",
  "Agents, tools & intelligent products",
  "Retrieval, embeddings & knowledge",
  "Training, adaptation & evaluation",
  "Speech, audio & conversation",
  "Infrastructure, containers & delivery",
  "Workflows, events & integrations",
  "Testing, validation & confidence",
  "Payments, subscriptions & payouts",
  "Identity, permissions & reliability",
];

export function SkillsRoomDirectory({
  selected,
  onChoose,
  onBrowse,
  liveModel,
}: {
  selected: number;
  onChoose: (index: number, revealRoom?: boolean) => void;
  onBrowse: () => void;
  liveModel: boolean;
}) {
  const grid = useRef<HTMLDivElement>(null);
  return (
    <section className="studio-directory" aria-labelledby="studio-directory-title">
      <header className="studio-directory-heading">
        <div>
          <p className="studio-discovery-eyebrow">
            <Compass size={14} /> THE ROOM DIRECTORY
          </p>
          <h3 id="studio-directory-title">
            Find the expertise you need<span>.</span>
          </h3>
          <p>Twelve specialties. One connected toolkit. Pick a room to explore.</p>
        </div>
        <button className="studio-directory-index" onClick={onBrowse}>
          <span>
            <strong>{totalSkills}</strong> skills in the index
          </span>
          <ArrowUpRight size={20} aria-hidden="true" />
        </button>
      </header>
      <div
        className="studio-directory-grid"
        ref={grid}
        role="group"
        aria-label="Choose a skills room"
      >
        {skillDomains.map((item, index) => (
          <button
            className="studio-room-card"
            key={item.name}
            onClick={() => onChoose(index, true)}
            aria-label={`Explore room ${String(index + 1).padStart(2, "0")}: ${item.name}`}
            aria-pressed={selected === index}
            aria-controls="studio-skill-panel"
            onKeyDown={(event) => {
              const columns = grid.current
                ? getComputedStyle(grid.current).gridTemplateColumns.split(/\s+/).length
                : 4;
              const count = skillDomains.length;
              const next =
                event.key === "ArrowRight"
                  ? (index + 1) % count
                  : event.key === "ArrowLeft"
                    ? (index + count - 1) % count
                    : event.key === "ArrowDown"
                      ? (index + columns) % count
                      : event.key === "ArrowUp"
                        ? (index + count - columns) % count
                        : event.key === "Home"
                          ? 0
                          : event.key === "End"
                            ? count - 1
                            : null;
              if (next === null) return;
              event.preventDefault();
              onChoose(next);
              grid.current
                ?.querySelectorAll<HTMLButtonElement>("button")
                [next]?.focus({ preventScroll: true });
            }}
          >
            <span className="studio-room-card-top">
              <span className="studio-room-card-icon">
                <item.icon size={21} aria-hidden="true" />
              </span>
              <span className="studio-room-card-number">{String(index + 1).padStart(2, "0")}</span>
              <ArrowUpRight className="studio-room-card-arrow" size={18} aria-hidden="true" />
            </span>
            <strong>{item.name}</strong>
            <span className="studio-room-card-note">{roomNotes[index]}</span>
            <span className="studio-room-card-bottom">
              <span>{domainTools(index).length} skills</span>
              <span className="studio-room-card-status">
                {selected === index ? (
                  <>
                    <i /> Exploring
                  </>
                ) : (
                  <>
                    Enter room <ArrowRight size={12} aria-hidden="true" />
                  </>
                )}
              </span>
            </span>
          </button>
        ))}
      </div>
      <footer className="studio-directory-footer">
        <span>
          <Move3D size={15} /> {liveModel ? "Drag to rotate" : "Select a room to explore"}
        </span>
        <span>
          <ZoomIn size={15} /> Scroll or pinch to zoom
        </span>
        <span>
          <MousePointer2 size={15} /> Click a skill to see the work
        </span>
        <span className="studio-directory-keyboard">
          <kbd>←</kbd>
          <kbd>→</kbd> to switch rooms
        </span>
      </footer>
    </section>
  );
}

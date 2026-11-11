import { useMemo, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  ArrowDown,
  BrainCircuit,
  Cloud,
  Code2,
  Cpu,
  Database,
  Expand,
  Layers3,
  Search,
  Server,
  ShieldCheck,
  Wrench,
  X,
} from "lucide-react";
import type { Project } from "@/lib/projects";
import type { ProjectStackGroup } from "@/lib/projectStacks";
import "./ProjectTechStack.css";

function categoryIcon(title: string) {
  if (title.startsWith("Languages")) return Code2;
  if (title.startsWith("UI")) return Layers3;
  if (title.startsWith("API")) return Server;
  if (title.startsWith("Data")) return Database;
  if (title.startsWith("AI")) return BrainCircuit;
  if (title.startsWith("Training")) return Cpu;
  if (title.startsWith("Integrations")) return ShieldCheck;
  if (title.startsWith("Alternative")) return Cloud;
  return Wrench;
}

function StackGroups({ groups }: { groups: ProjectStackGroup[] }) {
  return (
    <div className="project-tech-groups">
      {groups.map((group) => {
        const Icon = categoryIcon(group.title);
        return (
          <section
            className="project-tech-group"
            key={group.title}
            data-reference={group.reference || undefined}
            aria-label={group.title}
          >
            <h4>
              <Icon size={13} aria-hidden="true" />
              {group.title}
              {group.reference && (
                <small className="project-tech-reference">Alternative path</small>
              )}
              <span>{group.items.length}</span>
            </h4>
            {group.note && <p>{group.note}</p>}
            <ul>
              {group.items.map((tool) => (
                <li key={tool}>{tool}</li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

export function ProjectTechStack({ project, full = false }: { project: Project; full?: boolean }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const search = useRef<HTMLInputElement>(null);
  const normalized = query.trim().toLowerCase();
  const filtered = useMemo(
    () =>
      project.stackGroups
        .map((group) => ({
          ...group,
          items: group.title.toLowerCase().includes(normalized)
            ? group.items
            : group.items.filter((tool) => tool.toLowerCase().includes(normalized)),
        }))
        .filter((group) => group.items.length),
    [project.stackGroups, normalized],
  );
  const resultCount = filtered.reduce((sum, group) => sum + group.items.length, 0);
  if (full)
    return (
      <div className="project-tech-complete">
        <StackGroups groups={project.stackGroups} />
      </div>
    );
  return (
    <Dialog.Root
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        if (!value) setQuery("");
      }}
    >
      <section className="project-tech-stack" aria-labelledby={`project-stack-${project.slug}`}>
        <div className="project-tech-heading">
          <h4 id={`project-stack-${project.slug}`}>
            <Layers3 size={13} /> THE FULL STACK
          </h4>
          <span>
            {project.stack.length} tools · {project.stackGroups.length} layers
          </span>
        </div>
        <div
          className="project-tech-window"
          tabIndex={0}
          role="region"
          aria-label={`${project.title}: all tools and technologies`}
        >
          <StackGroups groups={project.stackGroups} />
        </div>
        <div className="project-tech-footer">
          <span>
            <ArrowDown size={11} /> Scroll through every layer
          </span>
          <Dialog.Trigger
            className="project-tech-expand"
            aria-label={`Explore the complete ${project.title} stack`}
          >
            Explore stack <Expand size={12} />
          </Dialog.Trigger>
        </div>
      </section>
      <Dialog.Portal>
        <Dialog.Overlay className="project-tech-overlay" />
        <Dialog.Content
          className="project-tech-dialog"
          onOpenAutoFocus={(event) => {
            event.preventDefault();
            search.current?.focus();
          }}
        >
          <header className="project-tech-dialog-heading">
            <div>
              <p>
                <Layers3 size={14} /> INSIDE THE BUILD / FULL STACK
              </p>
              <Dialog.Title>
                {project.title}
                <span>.</span>
              </Dialog.Title>
              <Dialog.Description>
                {project.stack.length} tools & techniques across {project.stackGroups.length}{" "}
                engineering layers.
              </Dialog.Description>
            </div>
            <Dialog.Close className="project-tech-close" aria-label="Close technology stack">
              <X size={21} />
            </Dialog.Close>
          </header>
          <div className="project-tech-search">
            <Search size={17} aria-hidden="true" />
            <label className="sr-only" htmlFor={`stack-search-${project.slug}`}>
              Search {project.title} technologies
            </label>
            <input
              ref={search}
              id={`stack-search-${project.slug}`}
              type="search"
              placeholder="Find a technology, library or service…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            {query && (
              <button
                aria-label="Clear technology search"
                onClick={() => {
                  setQuery("");
                  search.current?.focus();
                }}
              >
                <X size={16} />
              </button>
            )}
            <span aria-live="polite">
              {resultCount} {normalized ? "matches" : "items"}
            </span>
          </div>
          <div className="project-tech-dialog-body">
            {filtered.length ? (
              <StackGroups groups={filtered} />
            ) : (
              <div className="project-tech-empty">
                <Search size={24} />
                <h4>No matching technology.</h4>
                <p>Try a tool name or an engineering layer.</p>
                <button
                  onClick={() => {
                    setQuery("");
                    search.current?.focus();
                  }}
                >
                  Show the full stack
                </button>
              </div>
            )}
          </div>
          <footer className="project-tech-dialog-footer">
            <span>Frameworks, services, integrations & developer tooling.</span>
            <span>
              <kbd>esc</kbd> to close
            </span>
          </footer>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

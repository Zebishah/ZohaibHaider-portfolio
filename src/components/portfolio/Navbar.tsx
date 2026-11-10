import { useState } from "react";
import { Menu, X, Pause, Play, ArrowUpRight } from "lucide-react";
import { usePortfolioMotion } from "./Motion";
import { socials } from "@/lib/socials";
import { RoleTitle } from "./RoleTitle";
import "./Navbar.css";
export function Navbar() {
  const [open, setOpen] = useState(false);
  const { enabled, toggle } = usePortfolioMotion();
  return (
    <header className="site-header reference-header">
      <nav className="nav-inner" aria-label="Main navigation">
        <a href="/" className="wordmark" aria-label="Zohaib Haider, home">
          Zohaib Haider
        </a>
        <span className="nav-role">
          <RoleTitle />
        </span>
        <div className={`nav-links ${open ? "is-open" : ""}`} id="main-nav-links">
          {[
            ["Work", "/#work"],
            ["About", "/#about"],
            ["Skills", "/#skills"],
            ["Contact", "/#contact"],
          ].map(([label, href]) => (
            <a key={label} href={href} onClick={() => setOpen(false)}>
              {label}
            </a>
          ))}
          <a href={socials.resume} target="_blank" rel="noreferrer" className="mobile-resume">
            Résumé <ArrowUpRight size={15} />
          </a>
        </div>
        <a className="nav-contact-button" href="/#contact" onClick={() => setOpen(false)}>
          Let's Work Together <ArrowUpRight size={19} aria-hidden="true" />
        </a>
        <button
          className="icon-button motion-toggle"
          onClick={toggle}
          aria-label={enabled ? "Pause animations" : "Enable animations"}
          title={enabled ? "Pause animations" : "Enable animations"}
          aria-pressed={!enabled}
        >
          {enabled ? <Pause size={15} /> : <Play size={15} />}
        </button>
        <button
          className="icon-button menu-toggle"
          aria-expanded={open}
          aria-controls="main-nav-links"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </nav>
    </header>
  );
}

import { ArrowDown, ArrowUpRight, Github, Linkedin, Mail, MessageCircle } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { socials } from "@/lib/socials";
import { usePortfolioMotion } from "./Motion";
import { Tilt } from "./Tilt";
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { enabled } = usePortfolioMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 100]);
  return (
    <section className="hero" ref={ref} aria-labelledby="hero-title">
      <div className="hero-stage">
        <h1 className="hero-title" id="hero-title" aria-label="Full-stack AI Engineer">
          <span className="hero-full">FULL-STACK</span>
          <span className="hero-ai">AI ENGINEER</span>
        </h1>
        <motion.div className="hero-portrait-scene" style={{ y: enabled ? y : 0 }}>
          <div className="hero-platform" aria-hidden="true" />
          <Tilt className="portrait-tilt" strength={7}>
            <div className="portrait-sheet sheet-back" aria-hidden="true" />
            <div className="portrait-sheet sheet-middle" aria-hidden="true" />
            <div className="portrait-sheet sheet-front">
              <img
                src={socials.portrait}
                alt="Zohaib Haider wearing a charcoal three-piece suit and glasses"
                width="1070"
                height="1470"
                fetchPriority="high"
              />
            </div>
            <span className="portrait-caption">ZOHAIB HAIDER / ENGINEERING WITH INTENT</span>
          </Tilt>
        </motion.div>
        <div className="hero-statement">
          <span className="small-line" aria-hidden="true" />
          <p>
            AI products.
            <br />
            Production platforms.
            <br />
            Real integrations.
          </p>
          <div className="hero-disciplines">AI agents + RAG · Full-stack software · Payments</div>
        </div>
        <div className="hero-index" aria-hidden="true">
          <span>01 / INTRODUCTION</span>
          <span>ISLAMABAD, PK</span>
        </div>
      </div>
      <div className="hero-actions">
        <p>
          <i className="status-dot" />
          2+ years of hands-on engineering
        </p>
        <span className="action-rule" />
        <a className="button button-green" href="#work">
          Explore my work <ArrowUpRight size={22} />
        </a>
        <a className="text-link" href={socials.resume} target="_blank" rel="noreferrer">
          View résumé <ArrowUpRight size={19} />
        </a>
      </div>
      <div className="hero-socials">
        <span>BUILDING INTELLIGENT, USEFUL THINGS.</span>
        <div>
          {[
            [Github, "GitHub", socials.github],
            [Linkedin, "LinkedIn", socials.linkedin],
            [Mail, "Email", socials.emailHref],
            [MessageCircle, "WhatsApp", socials.whatsapp],
          ].map(([Icon, label, href]) => {
            const I = Icon as typeof Github;
            return (
              <a
                key={String(label)}
                href={String(href)}
                aria-label={String(label)}
                target={String(href).startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
              >
                <I size={16} />
                <span>{String(label)}</span>
                <ArrowUpRight size={12} />
              </a>
            );
          })}
        </div>
        <a href="#about" className="scroll-cue" aria-label="Scroll to about">
          <ArrowDown size={17} /> SCROLL TO DISCOVER
        </a>
      </div>
    </section>
  );
}

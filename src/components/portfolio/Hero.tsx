import { motion } from "framer-motion";
import { lazy, Suspense } from "react";
import { ArrowDown, Download, Github, Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClientOnly } from "@tanstack/react-router";
import portrait from "@/assets/zohaib-haider-clean.png";
import { socials } from "@/lib/socials";

const CodeTerminalBg = lazy(() => import("./CodeTerminalBg"));

const proofChips = [
  "Stripe payments",
  "AI / LLM APIs",
  "NestJS · React · AWS",
  "6 SaaS shipped",
];

export function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden pt-24 pb-16">
      {/* Code Terminal background — kept as-is */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <ClientOnly fallback={<div className="absolute inset-0 bg-background" />}>
          <Suspense fallback={<div className="absolute inset-0 bg-background" />}>
            <CodeTerminalBg />
          </Suspense>
        </ClientOnly>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: [
              "radial-gradient(ellipse at 28% 40%, color-mix(in oklab, var(--background) 72%, transparent) 0%, transparent 50%)",
              "linear-gradient(180deg, color-mix(in oklab, var(--background) 30%, transparent) 0%, transparent 18%)",
              "linear-gradient(180deg, transparent 60%, var(--background) 100%)",
            ].join(","),
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 w-full">
        <div className="grid md:grid-cols-[1.25fr_1fr] gap-10 md:gap-14 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs text-muted-foreground mb-6"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              Available for full-time & contract work
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight"
            >
              <span className="block text-muted-foreground text-lg md:text-xl font-medium mb-2">
                Hi there, I'm
              </span>
              <span
                className="gradient-text"
                style={{
                  backgroundImage: "linear-gradient(90deg, #14b8a6, #22d3ee, #f97316)",
                }}
              >
                Zohaib Haider
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="mt-4 text-lg md:text-xl font-semibold text-foreground/90"
            >
              Full-Stack Developer · MERN & NestJS
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="mt-4 text-base md:text-lg text-muted-foreground max-w-xl leading-relaxed"
            >
              I build and ship production SaaS end to end — Stripe payment systems, NestJS APIs,
              multi-tenant dashboards, third-party integrations, and AI/LLM features wired into real
              product workflows on React, Node, and AWS.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              className="mt-5 flex flex-wrap gap-2"
            >
              {proofChips.map((chip) => (
                <span
                  key={chip}
                  className="text-[11px] md:text-xs px-2.5 py-1 rounded-full border border-border/70 bg-card/60 text-muted-foreground"
                >
                  {chip}
                </span>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <Button
                asChild
                size="lg"
                className="gradient-bg text-white border-0 shadow-lg shadow-primary/30 transition-all duration-500 hover:shadow-primary/50 hover:-translate-y-0.5 hover:scale-[1.03]"
              >
                <a href="#projects">View My Work</a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="glow-border transition-all duration-500 hover:-translate-y-0.5 hover:scale-[1.03]"
              >
                <a href={socials.resume} download>
                  <Download className="w-4 h-4 mr-2" /> Download Resume
                </a>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.85 }}
              className="mt-8 flex items-center gap-3"
            >
              {[
                { icon: Github, href: socials.github, label: "GitHub" },
                { icon: Linkedin, href: socials.linkedin, label: "LinkedIn" },
                { icon: Mail, href: socials.emailHref, label: "Email" },
              ].map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  whileHover={{ y: -4, scale: 1.08 }}
                  transition={{ type: "spring", stiffness: 300, damping: 18 }}
                  className="relative w-10 h-10 rounded-full glass grid place-items-center text-muted-foreground hover:text-foreground group"
                >
                  <Icon className="w-4 h-4" />
                  <span
                    className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition duration-500"
                    style={{ boxShadow: "0 0 24px color-mix(in oklab, var(--brand-from) 55%, transparent)" }}
                  />
                </motion.a>
              ))}
            </motion.div>
          </div>

          {/* Circular portrait */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="relative mx-auto flex w-full max-w-[280px] sm:max-w-[320px] md:max-w-[360px] aspect-square items-center justify-center"
          >
            <div
              aria-hidden
              className="absolute inset-[-8%] rounded-full blur-2xl opacity-45"
              style={{
                background:
                  "radial-gradient(circle at 35% 40%, color-mix(in oklab, var(--brand-from) 35%, transparent), transparent 60%), radial-gradient(circle at 70% 60%, color-mix(in oklab, var(--brand-to) 28%, transparent), transparent 60%)",
              }}
            />
            <div
              aria-hidden
              className="absolute inset-0 rounded-full p-[2px]"
              style={{
                background:
                  "linear-gradient(135deg, var(--brand-from), color-mix(in oklab, var(--brand-from) 15%, transparent) 45%, var(--brand-to))",
              }}
            >
              <div className="h-full w-full rounded-full bg-background" />
            </div>
            <div className="relative z-10 h-[93%] w-[93%] overflow-hidden rounded-full border border-white/10 bg-background shadow-[0_20px_50px_-24px_rgba(0,0,0,0.85)]">
              <img
                src={portrait}
                alt="Zohaib Haider"
                width={1024}
                height={1024}
                className="h-full w-full object-cover object-[center_15%]"
                decoding="async"
              />
            </div>
          </motion.div>
        </div>

        <motion.a
          href="#about"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="hidden md:flex absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-1 text-xs text-muted-foreground"
        >
          <span>Scroll</span>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.6 }}>
            <ArrowDown className="w-4 h-4" />
          </motion.div>
        </motion.a>
      </div>
    </section>
  );
}

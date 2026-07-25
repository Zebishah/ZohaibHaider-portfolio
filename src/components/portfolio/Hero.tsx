import { motion } from "framer-motion";
import { lazy, Suspense, useEffect, useState } from "react";
import { ArrowDown, Download, Github, Linkedin, Mail, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClientOnly } from "@tanstack/react-router";
import portrait from "@/assets/zohaib-haider-brand.png";

const CodeTerminalBg = lazy(() => import("./CodeTerminalBg"));

const roles = [
  "Full Stack MERN Developer",
  "Backend & API Engineer",
  "Cloud & DevOps Enthusiast",
  "AI/LLM Integration Developer",
];

const NAME = "Zohaib Haider";

/* Smoother typewriter — steady rhythm, longer hold */
function useTypewriter(text: string) {
  const [display, setDisplay] = useState("");
  const [phase, setPhase] = useState<"typing" | "hold" | "deleting" | "restart">("typing");

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    if (phase === "typing") {
      if (display.length < text.length) {
        t = setTimeout(() => setDisplay(text.slice(0, display.length + 1)), 110);
      } else {
        t = setTimeout(() => setPhase("hold"), 2600);
      }
    } else if (phase === "hold") {
      t = setTimeout(() => setPhase("deleting"), 600);
    } else if (phase === "deleting") {
      if (display.length > 0) {
        t = setTimeout(() => setDisplay(text.slice(0, display.length - 1)), 70);
      } else {
        t = setTimeout(() => setPhase("restart"), 500);
      }
    } else {
      t = setTimeout(() => setPhase("typing"), 300);
    }
    return () => clearTimeout(t);
  }, [display, phase, text]);

  return display;
}

export function Hero() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % roles.length), 2800);
    return () => clearInterval(t);
  }, []);

  const name = useTypewriter(NAME);

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden pt-24 pb-16">
      {/* Code Terminal background — animated developer aesthetic */}
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
              <span className="relative inline-block">
                <span
                  className="gradient-text animate-gradient-x"
                  style={{
                    backgroundImage:
                      "linear-gradient(90deg, #14b8a6, #22d3ee, #f97316, #14b8a6)",
                  }}
                >
                  {name || "\u00A0"}
                </span>
                <span className="inline-block w-[3px] md:w-[4px] h-[0.9em] align-middle ml-1 bg-primary animate-caret rounded-sm" />
              </span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-5 h-9 md:h-10 text-lg md:text-2xl font-medium text-muted-foreground flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5 text-primary" />
              <motion.span
                key={i}
                initial={{ y: 14, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -14, opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="gradient-text font-semibold"
              >
                {roles[i]}
              </motion.span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-6 text-base md:text-lg text-muted-foreground max-w-xl leading-relaxed"
            >
              I build fast, scalable, production-grade SaaS platforms — from database schema
              to deployed infrastructure.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75 }}
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
                <a href="/resume.pdf" download>
                  <Download className="w-4 h-4 mr-2" /> Download Resume
                </a>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-8 flex items-center gap-3"
            >
              {[
                { icon: Github, href: "https://github.com/Zebishah", label: "GitHub" },
                { icon: Linkedin, href: "#", label: "LinkedIn" },
                { icon: Mail, href: "mailto:zebihaider123@gmail.com", label: "Email" },
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

          {/* Circular portrait — compact, brand-matched */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="relative mx-auto flex w-full max-w-[260px] sm:max-w-[300px] md:max-w-[340px] aspect-square items-center justify-center"
          >
            <div
              aria-hidden
              className="absolute inset-[-8%] rounded-full blur-2xl opacity-55"
              style={{
                background:
                  "radial-gradient(circle at 35% 40%, color-mix(in oklab, var(--brand-from) 40%, transparent), transparent 60%), radial-gradient(circle at 70% 60%, color-mix(in oklab, var(--brand-to) 35%, transparent), transparent 60%)",
              }}
            />
            <div
              aria-hidden
              className="absolute inset-0 rounded-full p-[2px]"
              style={{
                background:
                  "linear-gradient(135deg, var(--brand-from), color-mix(in oklab, var(--brand-from) 20%, transparent) 45%, var(--brand-to))",
              }}
            >
              <div className="h-full w-full rounded-full bg-background" />
            </div>
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-10 h-[93%] w-[93%] overflow-hidden rounded-full border border-white/10 bg-background shadow-[0_20px_50px_-24px_rgba(0,0,0,0.85)]"
            >
              <img
                src={portrait}
                alt="Zohaib Haider"
                width={1024}
                height={1024}
                className="h-full w-full object-cover object-[center_20%]"
                decoding="async"
              />
            </motion.div>
          </motion.div>
        </div>

        <motion.a
          href="#about"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
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

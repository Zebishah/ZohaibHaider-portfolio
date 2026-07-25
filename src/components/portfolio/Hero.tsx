import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { ArrowDown, Download, Github, Linkedin, Mail, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const roles = [
  "Full Stack MERN Developer",
  "Backend & API Engineer",
  "Cloud & DevOps Enthusiast",
  "AI/LLM Integration Developer",
];

const NAME = "Zohaib Haider";

/* Typewriter that types + deletes on a loop for the name */
function useTypewriter(text: string) {
  const [display, setDisplay] = useState("");
  const [phase, setPhase] = useState<"typing" | "hold" | "deleting" | "restart">("typing");

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    if (phase === "typing") {
      if (display.length < text.length) {
        t = setTimeout(() => setDisplay(text.slice(0, display.length + 1)), 95);
      } else {
        t = setTimeout(() => setPhase("hold"), 2200);
      }
    } else if (phase === "hold") {
      t = setTimeout(() => setPhase("deleting"), 400);
    } else if (phase === "deleting") {
      if (display.length > 0) {
        t = setTimeout(() => setDisplay(text.slice(0, display.length - 1)), 55);
      } else {
        t = setTimeout(() => setPhase("restart"), 400);
      }
    } else {
      t = setTimeout(() => setPhase("typing"), 200);
    }
    return () => clearTimeout(t);
  }, [display, phase, text]);

  return display;
}

function Stars() {
  const stars = useMemo(
    () =>
      Array.from({ length: 34 }).map(() => ({
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: Math.random() * 2 + 1,
        delay: Math.random() * 3,
        dur: 2 + Math.random() * 3,
      })),
    [],
  );
  return (
    <div className="absolute inset-0 pointer-events-none">
      {stars.map((s, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-white animate-twinkle"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: s.size,
            height: s.size,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.dur}s`,
            boxShadow: "0 0 6px rgba(255,255,255,0.8)",
          }}
        />
      ))}
    </div>
  );
}

export function Hero() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % roles.length), 2600);
    return () => clearInterval(t);
  }, []);

  const name = useTypewriter(NAME);

  // Parallax on the portrait
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 90, damping: 14 });
  const sy = useSpring(my, { stiffness: 90, damping: 14 });
  const tx = useTransform(sx, [-1, 1], [-14, 14]);
  const ty = useTransform(sy, [-1, 1], [-14, 14]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mx.set((e.clientX / window.innerWidth) * 2 - 1);
      my.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mx, my]);

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden pt-24 pb-16">
      {/* Aurora / orbs background (grid removed) */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute -top-40 -left-32 w-[620px] h-[620px] rounded-full blur-3xl opacity-50 animate-aurora"
          style={{ background: "radial-gradient(circle at center, #6366f1, transparent 60%)" }}
        />
        <div
          className="absolute -bottom-52 -right-32 w-[620px] h-[620px] rounded-full blur-3xl opacity-50 animate-aurora"
          style={{ background: "radial-gradient(circle at center, #06b6d4, transparent 60%)", animationDelay: "4s" }}
        />
        <div
          className="absolute top-1/3 left-1/2 w-[420px] h-[420px] rounded-full blur-3xl opacity-30 animate-aurora"
          style={{ background: "radial-gradient(circle at center, #a855f7, transparent 60%)", animationDelay: "8s" }}
        />
        {/* soft radial vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 40%, transparent 40%, color-mix(in oklab, var(--background) 85%, transparent) 100%)",
          }}
        />
        <Stars />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 w-full">
        <div className="grid md:grid-cols-[1.3fr_1fr] gap-10 md:gap-16 items-center">
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
                      "linear-gradient(90deg, #6366f1, #a855f7, #06b6d4, #6366f1)",
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

          {/* Photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            style={{ x: tx, y: ty }}
            className="relative mx-auto md:mx-0 md:justify-self-end"
          >
            <div className="relative animate-float-slow">
              {/* Rotating gradient ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 14, ease: "linear" }}
                className="absolute -inset-2 rounded-full"
                style={{
                  background:
                    "conic-gradient(from 0deg, #6366f1, #a855f7, #06b6d4, #6366f1)",
                  filter: "blur(2px)",
                }}
              />
              <div className="absolute -inset-6 rounded-full gradient-bg opacity-30 blur-3xl" />
              <div className="relative w-56 h-56 md:w-72 md:h-72 rounded-full overflow-hidden bg-card grid place-items-center border border-border">
                <div className="absolute inset-0 gradient-bg opacity-20" />
                <span className="relative font-display text-7xl md:text-8xl font-bold gradient-text">ZH</span>
              </div>
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
                className="absolute -bottom-3 -right-3 glass rounded-full px-3 py-1.5 text-xs font-medium flex items-center gap-1.5"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Open to work
              </motion.div>
            </div>
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

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowDown, Download, Github, Linkedin, Mail, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

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

  // Parallax on the id card
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 80, damping: 16 });
  const sy = useSpring(my, { stiffness: 80, damping: 16 });
  const tx = useTransform(sx, [-1, 1], [-10, 10]);
  const ty = useTransform(sy, [-1, 1], [-8, 8]);

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
      {/* Silky animated mesh background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 animate-mesh-shift opacity-80"
          style={{
            backgroundImage: [
              "radial-gradient(at 20% 30%, color-mix(in oklab, #14b8a6 55%, transparent), transparent 55%)",
              "radial-gradient(at 80% 20%, color-mix(in oklab, #f97316 45%, transparent), transparent 55%)",
              "radial-gradient(at 60% 85%, color-mix(in oklab, #22d3ee 40%, transparent), transparent 55%)",
            ].join(","),
            filter: "blur(60px)",
          }}
        />
        {/* Soft top spotlight */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 0%, color-mix(in oklab, var(--brand-from) 18%, transparent), transparent 55%)",
          }}
        />
        {/* Vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 45%, transparent 45%, color-mix(in oklab, var(--background) 92%, transparent) 100%)",
          }}
        />
        {/* Subtle noise */}
        <div
          className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.6'/></svg>\")",
          }}
        />
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

          {/* Hanging ID Card with ribbon lanyard */}
          <motion.div
            style={{ x: tx, y: ty }}
            className="relative mx-auto md:mx-0 md:justify-self-end pt-6"
          >
            {/* Peg / clip at the top */}
            <div className="relative mx-auto w-fit">
              <div className="w-14 h-3 rounded-full bg-gradient-to-b from-white/60 to-white/20 border border-white/30 shadow-lg mx-auto" />
              <div className="w-3 h-3 rounded-full bg-foreground/70 mx-auto -mt-1.5 shadow-inner" />
            </div>

            {/* Swinging group: ribbon + card */}
            <div className="animate-swing origin-top">
              {/* Ribbon */}
              <motion.div
                initial={{ scaleY: 0, opacity: 0 }}
                animate={{ scaleY: 1, opacity: 1 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                style={{ transformOrigin: "top center" }}
                className="relative mx-auto w-8 h-32"
              >
                <div
                  className="absolute inset-0 rounded-b-sm"
                  style={{
                    background:
                      "linear-gradient(180deg, #14b8a6, #0e9488 55%, #f97316)",
                    boxShadow: "inset -6px 0 10px rgba(0,0,0,0.25), inset 6px 0 10px rgba(255,255,255,0.15)",
                  }}
                />
                {/* stitching */}
                <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-px bg-white/20" />
              </motion.div>

              {/* Metal clasp */}
              <div className="relative mx-auto -mt-1 w-16 h-4 rounded-md bg-gradient-to-b from-neutral-300 to-neutral-500 border border-black/30 shadow-md">
                <div className="absolute inset-x-3 top-1/2 -translate-y-1/2 h-1 rounded-sm bg-black/30" />
              </div>

              {/* Card */}
              <motion.div
                initial={{ y: -40, opacity: 0, rotate: -8 }}
                animate={{ y: 0, opacity: 1, rotate: 0 }}
                transition={{ duration: 0.9, ease: [0.34, 1.56, 0.64, 1], delay: 0.2 }}
                className="relative mx-auto mt-1 w-60 md:w-64 rounded-2xl p-5 glass border shadow-2xl"
                style={{
                  background:
                    "linear-gradient(160deg, color-mix(in oklab, var(--card) 85%, transparent), color-mix(in oklab, var(--card) 55%, transparent))",
                  boxShadow:
                    "0 30px 60px -20px color-mix(in oklab, var(--brand-from) 45%, transparent), 0 10px 30px -10px rgba(0,0,0,0.5)",
                }}
              >
                {/* punch hole */}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-3 rounded-full bg-background border border-border" />

                <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-muted-foreground">
                  <span>ID · 2026</span>
                  <span className="gradient-text font-semibold">Developer</span>
                </div>

                <div className="mt-4 mx-auto w-24 h-24 rounded-2xl overflow-hidden grid place-items-center relative">
                  <div className="absolute inset-0 gradient-bg opacity-90" />
                  <div className="absolute inset-0 opacity-40" style={{ background: "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.5), transparent 55%)" }} />
                  <span className="relative font-display text-4xl font-bold text-white drop-shadow">ZH</span>
                </div>

                <div className="mt-4 text-center">
                  <div className="font-display font-bold text-lg leading-tight">Zohaib Haider</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">Full Stack · MERN · Cloud</div>
                </div>

                <div className="mt-4 flex items-center justify-between text-[10px]">
                  <span className="px-2 py-0.5 rounded-full bg-accent/60 border border-border/60">Karachi, PK</span>
                  <span className="flex items-center gap-1 text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Open to work
                  </span>
                </div>

                {/* barcode */}
                <div className="mt-3 flex gap-[2px] h-6 items-end">
                  {Array.from({ length: 34 }).map((_, k) => (
                    <span
                      key={k}
                      className="bg-foreground/80"
                      style={{ width: 2, height: `${40 + ((k * 37) % 60)}%` }}
                    />
                  ))}
                </div>
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

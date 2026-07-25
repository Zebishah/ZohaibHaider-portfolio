import { motion } from "framer-motion";
import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { ArrowDown, Download, Github, Linkedin, Mail, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClientOnly } from "@tanstack/react-router";
import cardFront from "@/assets/lanyard/card-front.png";

const Lanyard = lazy(() => import("./lanyard/Lanyard"));
const Hyperspeed = lazy(() => import("./Hyperspeed"));

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

  const hyperOpts = useMemo(
    () => ({
      distortion: "turbulentDistortion",
      length: 400,
      roadWidth: 10,
      islandWidth: 2,
      lanesPerRoad: 3,
      fov: 90,
      fovSpeedUp: 150,
      speedUp: 2,
      carLightsFade: 0.4,
      totalSideLightSticks: 20,
      lightPairsPerRoadWay: 40,
      colors: {
        roadColor: 0x080808,
        islandColor: 0x0a0a0a,
        background: 0x000000,
        shoulderLines: 0x131318,
        brokenLines: 0x131318,
        leftCars: [0x14b8a6, 0x22d3ee, 0x0ea5b3],
        rightCars: [0xf97316, 0xfb923c, 0xea580c],
        sticks: 0x14b8a6,
      },
    }),
    [],
  );

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden pt-24 pb-16">
      {/* Hyperspeed background */}
      <div className="absolute inset-0 z-0">
        <ClientOnly fallback={<div className="w-full h-full bg-background" />}>
          <Suspense fallback={<div className="w-full h-full bg-background" />}>
            <Hyperspeed effectOptions={hyperOpts} />
          </Suspense>
        </ClientOnly>
        {/* Fade to background at bottom */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, transparent 40%, color-mix(in oklab, var(--background) 85%, transparent) 100%)",
          }}
        />
      </div>

      {/* Silky animated mesh background */}
      <div className="absolute inset-0 pointer-events-none z-[1] mix-blend-screen opacity-40">

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

      <div className="relative z-10 max-w-6xl mx-auto px-4 w-full">
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

          {/* 3D Lanyard with hanging ID card — drops from top of screen */}
          <div className="relative h-[600px] md:h-[720px] -mt-24 md:-mt-32 md:-mr-8">
            <ClientOnly fallback={<div className="w-full h-full" />}>
              <Suspense fallback={<div className="w-full h-full" />}>
                <Lanyard position={[0, 0, 18]} gravity={[0, -40, 0]} transparent frontImage={cardFront} backImage={cardFront} imageFit="cover" />
              </Suspense>
            </ClientOnly>
          </div>

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

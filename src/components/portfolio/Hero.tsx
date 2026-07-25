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
      distortion: "turbulentDistortion" as const,
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
      shoulderLinesWidthPercentage: 0.05,
      brokenLinesWidthPercentage: 0.1,
      brokenLinesLengthPercentage: 0.5,
      lightStickWidth: [0.12, 0.5] as [number, number],
      lightStickHeight: [1.3, 1.7] as [number, number],
      movingAwaySpeed: [60, 80] as [number, number],
      movingCloserSpeed: [-120, -160] as [number, number],
      carLightsLength: [12, 80] as [number, number],
      carLightsRadius: [0.05, 0.14] as [number, number],
      carWidthPercentage: [0.3, 0.5] as [number, number],
      carShiftX: [-0.8, 0.8] as [number, number],
      carFloorSeparation: [0, 5] as [number, number],
      colors: {
        roadColor: 0x080808,
        islandColor: 0x0a0a0a,
        background: 0x000000,
        shoulderLines: 0xffffff,
        brokenLines: 0xffffff,
        leftCars: [0x14b8a6, 0x22d3ee, 0x0ea5b3],
        rightCars: [0xf97316, 0xfb923c, 0xea580c],
        sticks: 0x14b8a6,
      },
    }),
    [],
  );

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden pt-24 pb-16">
      {/* Hyperspeed background — fills the hero */}
      <div className="absolute inset-0 z-0 pointer-events-none [&_canvas]:pointer-events-auto">
        <ClientOnly fallback={<div className="absolute inset-0 bg-background" />}>
          <Suspense fallback={<div className="absolute inset-0 bg-background" />}>
            <Hyperspeed effectOptions={hyperOpts} />
          </Suspense>
        </ClientOnly>
        {/* Soft edge fade so content stays readable + blends into next section */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: [
              "radial-gradient(ellipse at 50% 45%, transparent 50%, color-mix(in oklab, var(--background) 35%, transparent) 100%)",
              "linear-gradient(180deg, transparent 65%, var(--background) 100%)",
            ].join(","),
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

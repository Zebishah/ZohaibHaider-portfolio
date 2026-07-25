import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowDown, Download, Github, Linkedin, Mail, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const roles = [
  "Full Stack MERN Developer",
  "Backend & API Engineer",
  "Cloud & DevOps Enthusiast",
  "AI/LLM Integration Developer",
];

export function Hero() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % roles.length), 2600);
    return () => clearInterval(t);
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden pt-24 pb-16">
      {/* Background layers */}
      <div className="absolute inset-0 grid-bg opacity-70 pointer-events-none" />
      <div className="absolute -top-32 -left-32 w-[520px] h-[520px] rounded-full blur-3xl opacity-40 animate-blob"
        style={{ background: "radial-gradient(circle at center, #6366f1, transparent 60%)" }} />
      <div className="absolute -bottom-40 -right-24 w-[520px] h-[520px] rounded-full blur-3xl opacity-40 animate-blob"
        style={{ background: "radial-gradient(circle at center, #06b6d4, transparent 60%)", animationDelay: "3s" }} />
      <div className="absolute top-1/3 left-1/2 w-[380px] h-[380px] rounded-full blur-3xl opacity-30 animate-blob"
        style={{ background: "radial-gradient(circle at center, #a855f7, transparent 60%)", animationDelay: "6s" }} />

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
              Hi, I'm{" "}
              <span className="relative inline-block">
                <span className="gradient-text">Zohaib Haider</span>
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  className="absolute -bottom-1 left-0 right-0 h-1 gradient-bg origin-left rounded-full"
                />
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
              <Button asChild size="lg" className="gradient-bg text-white border-0 hover:opacity-90 shadow-lg shadow-primary/20">
                <a href="#projects">View My Work</a>
              </Button>
              <Button asChild size="lg" variant="outline" className="glow-border">
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
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="relative w-10 h-10 rounded-full glass grid place-items-center text-muted-foreground hover:text-foreground transition group"
                >
                  <Icon className="w-4 h-4 group-hover:scale-110 transition" />
                  <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition"
                    style={{ boxShadow: "0 0 24px color-mix(in oklab, var(--brand-from) 45%, transparent)" }} />
                </a>
              ))}
            </motion.div>
          </div>

          {/* Photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="relative mx-auto md:mx-0 md:justify-self-end"
          >
            <div className="relative animate-float-slow">
              <div className="absolute -inset-4 rounded-full gradient-bg opacity-30 blur-2xl" />
              <div className="absolute -inset-1 rounded-full gradient-bg opacity-70 blur-sm" />
              <div className="relative w-56 h-56 md:w-72 md:h-72 rounded-full overflow-hidden bg-card grid place-items-center border border-border">
                <div className="absolute inset-0 gradient-bg opacity-20" />
                <span className="relative font-display text-7xl md:text-8xl font-bold gradient-text">ZH</span>
              </div>
              <div className="absolute -bottom-3 -right-3 glass rounded-full px-3 py-1.5 text-xs font-medium flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Open to work
              </div>
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

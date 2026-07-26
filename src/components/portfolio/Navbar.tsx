import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Moon, Sun, Github, Linkedin, Download, Menu, X } from "lucide-react";
import { useTheme } from "@/lib/theme";
import { Button } from "@/components/ui/button";
import { socials } from "@/lib/socials";

const links = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const { theme, toggle } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const onHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "py-2" : "py-4"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className={`glass rounded-2xl px-4 md:px-6 py-3 flex items-center justify-between ${scrolled ? "shadow-lg shadow-black/20" : ""}`}>
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative w-8 h-8 rounded-lg gradient-bg grid place-items-center font-display font-bold text-white text-sm">
              ZH
              <span className="absolute inset-0 rounded-lg gradient-bg blur-md opacity-40 group-hover:opacity-70 transition" />
            </div>
            <span className="font-display font-semibold text-sm md:text-base">Zohaib<span className="text-muted-foreground">.dev</span></span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {links.map((l) => (
              <a
                key={l.href}
                href={onHome ? l.href : `/${l.href}`}
                className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition rounded-md hover:bg-accent"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-1 md:gap-2">
            <a href={socials.github} target="_blank" rel="noreferrer" className="p-2 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition hidden sm:inline-flex" aria-label="GitHub">
              <Github className="w-4 h-4" />
            </a>
            <a href={socials.linkedin} target="_blank" rel="noreferrer" className="p-2 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition hidden sm:inline-flex" aria-label="LinkedIn">
              <Linkedin className="w-4 h-4" />
            </a>
            <button
              onClick={toggle}
              className="p-2 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition"
              aria-label="Toggle theme"
            >
              <motion.span
                key={theme}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="block"
              >
                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </motion.span>
            </button>
            <Button asChild size="sm" className="gradient-bg text-white border-0 hidden md:inline-flex hover:opacity-90">
              <a href={socials.resume} download>
                <Download className="w-4 h-4 mr-1" /> Resume
              </a>
            </Button>
            <button
              className="p-2 rounded-md hover:bg-accent lg:hidden"
              onClick={() => setOpen((o) => !o)}
              aria-label="Menu"
            >
              {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass mt-2 rounded-2xl p-3 lg:hidden"
          >
            <nav className="flex flex-col">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={onHome ? l.href : `/${l.href}`}
                  onClick={() => setOpen(false)}
                  className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md"
                >
                  {l.label}
                </a>
              ))}
              <a href={socials.resume} download className="mt-2 px-3 py-2 text-sm gradient-bg text-white rounded-md text-center font-medium">
                Download Resume
              </a>
            </nav>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
}

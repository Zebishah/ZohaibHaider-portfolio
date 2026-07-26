import { Github, Linkedin, Mail } from "lucide-react";
import { socials } from "@/lib/socials";

export function Footer() {
  return (
    <footer className="relative py-10 border-t border-border/60">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md gradient-bg grid place-items-center font-display font-bold text-white text-xs">ZH</div>
          <span>Built by <span className="text-foreground font-medium">Zohaib Haider</span></span>
        </div>
        <div className="flex items-center gap-3">
          <a href={socials.github} target="_blank" rel="noreferrer" className="hover:text-foreground transition" aria-label="GitHub">
            <Github className="w-4 h-4" />
          </a>
          <a href={socials.linkedin} target="_blank" rel="noreferrer" className="hover:text-foreground transition" aria-label="LinkedIn">
            <Linkedin className="w-4 h-4" />
          </a>
          <a href={socials.emailHref} className="hover:text-foreground transition" aria-label="Email">
            <Mail className="w-4 h-4" />
          </a>
        </div>
        <div>© {new Date().getFullYear()} Zohaib Haider. All rights reserved.</div>
      </div>
    </footer>
  );
}

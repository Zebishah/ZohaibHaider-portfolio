import { motion, useInView } from "framer-motion";
import { useRef, type ReactNode } from "react";

export function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeader({ eyebrow, title, subtitle }: { eyebrow?: string; title: string; subtitle?: string }) {
  return (
    <div className="text-center max-w-2xl mx-auto mb-14">
      {eyebrow && (
        <Reveal>
          <div className="inline-flex px-3 py-1 rounded-full glass text-xs font-medium text-muted-foreground mb-4 uppercase tracking-widest">
            {eyebrow}
          </div>
        </Reveal>
      )}
      <Reveal delay={0.05}>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
          {title.split("|").map((part, i) =>
            i % 2 === 1 ? (
              <span key={i} className="gradient-text">{part}</span>
            ) : (
              <span key={i}>{part}</span>
            )
          )}
        </h2>
      </Reveal>
      {subtitle && (
        <Reveal delay={0.1}>
          <p className="mt-4 text-muted-foreground md:text-lg">{subtitle}</p>
        </Reveal>
      )}
    </div>
  );
}

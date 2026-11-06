import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { usePortfolioMotion } from "./Motion";
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const { enabled } = usePortfolioMotion();
  return (
    <motion.div
      className={className}
      initial={false}
      whileInView={enabled ? { y: [24, 0], opacity: [0.5, 1] } : undefined}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
export function SectionHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <Reveal className="section-heading">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title.replaceAll("|", "")}</h2>
      {subtitle && <p>{subtitle}</p>}
    </Reveal>
  );
}

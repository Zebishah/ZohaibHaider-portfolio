import { Code2, Cpu } from "lucide-react";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import type { PointerEvent } from "react";
import { usePortfolioMotion } from "./Motion";
import { PortraitCard } from "./PortraitCard";
import "./HeroPortrait.css";

export function HeroPortrait() {
  const { enabled } = usePortfolioMotion();
  const rotateX = useSpring(0, { stiffness: 130, damping: 22 });
  const rotateY = useSpring(0, { stiffness: 130, damping: 22 });
  const lightX = useMotionValue(50);
  const lightY = useMotionValue(30);
  const spotlight = useMotionTemplate`radial-gradient(circle at ${lightX}% ${lightY}%, #e9ffc52b, transparent 58%)`;

  function move(event: PointerEvent<HTMLDivElement>) {
    if (!enabled || event.pointerType !== "mouse") return;
    const box = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width;
    const y = (event.clientY - box.top) / box.height;
    rotateX.set((0.5 - y) * 12);
    rotateY.set((x - 0.5) * 14);
    lightX.set(x * 100);
    lightY.set(y * 100);
  }
  function reset() {
    rotateX.set(0);
    rotateY.set(0);
    lightX.set(50);
    lightY.set(30);
  }

  return (
    <div
      className="hero-portrait-stage"
      onPointerMove={move}
      onPointerLeave={reset}
      onPointerCancel={reset}
    >
      <div className="hero-portrait-aura" aria-hidden="true" />
      <PortraitCard className="hero-profile" priority availability />
      {/* Keep the photo and text outside transformed layers to preserve their sharpness. */}
      <motion.div
        className="hero-portrait-effects"
        aria-hidden="true"
        style={{
          rotateX: enabled ? rotateX : 0,
          rotateY: enabled ? rotateY : 0,
          transformPerspective: 1400,
        }}
      >
        <div className="hero-portrait-rim" />
        <div className="hero-portrait-sheen" />
        <motion.div
          className="hero-portrait-spotlight"
          style={{ background: spotlight, opacity: enabled ? 1 : 0 }}
        />
        <span className="hero-portrait-tag hero-portrait-tag-code">
          <Code2 size={17} /> Full-stack <i />
        </span>
        <span className="hero-portrait-tag hero-portrait-tag-ai">
          <Cpu size={17} /> AI systems <i />
        </span>
      </motion.div>
    </div>
  );
}

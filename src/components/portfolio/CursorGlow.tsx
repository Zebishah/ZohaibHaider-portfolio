import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CursorGlow() {
  const x = useMotionValue(-400);
  const y = useMotionValue(-400);
  const sx = useSpring(x, { stiffness: 220, damping: 28, mass: 0.35 });
  const sy = useSpring(y, { stiffness: 220, damping: 28, mass: 0.35 });
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    setEnabled(true);
    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [x, y]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        aria-hidden
        style={{ x: sx, y: sy, translateX: "-50%", translateY: "-50%" }}
        className="pointer-events-none fixed left-0 top-0 z-[60] h-[520px] w-[520px] rounded-full"
      >
        <div
          className="w-full h-full rounded-full"
          style={{
            background:
              "radial-gradient(circle, color-mix(in oklab, var(--brand-from) 22%, transparent), transparent 60%)",
            filter: "blur(40px)",
          }}
        />
      </motion.div>
      <motion.div
        aria-hidden
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
        className="pointer-events-none fixed left-0 top-0 z-[61] h-3 w-3 rounded-full"
      >
        <div
          className="w-full h-full rounded-full"
          style={{
            background:
              "radial-gradient(circle, color-mix(in oklab, var(--brand-to) 90%, transparent), transparent 70%)",
          }}
        />
      </motion.div>
    </>
  );
}

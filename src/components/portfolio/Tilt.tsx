import { motion, useSpring } from "framer-motion";
import type { PointerEvent, ReactNode } from "react";
import { usePortfolioMotion } from "./Motion";
export function Tilt({
  children,
  className = "",
  strength = 5,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const { enabled } = usePortfolioMotion();
  const rotateX = useSpring(0, { stiffness: 140, damping: 24 });
  const rotateY = useSpring(0, { stiffness: 140, damping: 24 });
  function move(event: PointerEvent<HTMLDivElement>) {
    if (!enabled || event.pointerType !== "mouse") return;
    const box = event.currentTarget.getBoundingClientRect();
    rotateX.set((-(event.clientY - box.top - box.height / 2) / box.height) * strength);
    rotateY.set(((event.clientX - box.left - box.width / 2) / box.width) * strength);
  }
  return (
    <motion.div
      className={`tilt ${className}`}
      onPointerMove={move}
      onPointerLeave={() => {
        rotateX.set(0);
        rotateY.set(0);
      }}
      style={{
        rotateX: enabled ? rotateX : 0,
        rotateY: enabled ? rotateY : 0,
        transformPerspective: 1100,
      }}
    >
      {children}
    </motion.div>
  );
}

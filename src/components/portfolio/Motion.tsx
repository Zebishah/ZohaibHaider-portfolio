import { createContext, useContext, useState, useSyncExternalStore, type ReactNode } from "react";
import { MotionConfig } from "framer-motion";
const mediaQuery = "(prefers-reduced-motion: reduce)";
function subscribeMotionPreference(listener: () => void) {
  const media = window.matchMedia(mediaQuery);
  media.addEventListener("change", listener);
  return () => media.removeEventListener("change", listener);
}
const getMotionPreference = () => window.matchMedia(mediaQuery).matches;
const MotionContext = createContext({ enabled: true, toggle: () => {} });
export function PortfolioMotion({ children }: { children: ReactNode }) {
  const reduced = useSyncExternalStore(subscribeMotionPreference, getMotionPreference, () => true);
  const [override, setOverride] = useState<boolean | null>(null);
  const enabled = override ?? !reduced;
  return (
    <MotionContext.Provider value={{ enabled, toggle: () => setOverride(!enabled) }}>
      <MotionConfig reducedMotion={enabled ? "never" : "always"}>
        <div className={`portfolio ${enabled ? "motion-on" : "motion-off"}`}>{children}</div>
      </MotionConfig>
    </MotionContext.Provider>
  );
}
export const usePortfolioMotion = () => useContext(MotionContext);

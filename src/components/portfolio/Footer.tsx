import { ArrowUp, Pause, Play } from "lucide-react";
import { usePortfolioMotion } from "./Motion";
export function Footer() {
  const { enabled, toggle } = usePortfolioMotion();
  return (
    <footer className="site-footer">
      <a href="/" className="footer-name">
        Zohaib Haider<span>© {new Date().getFullYear()}</span>
      </a>
      <span>FULL-STACK SOFTWARE / APPLIED AI / REAL SYSTEMS</span>
      <div>
        <button className="footer-motion" onClick={toggle} aria-pressed={!enabled}>
          {enabled ? <Pause size={13} /> : <Play size={13} />}
          {enabled ? "Pause motion" : "Motion paused"}
        </button>
        <a href="#top" aria-label="Back to top">
          Back to top <ArrowUp size={15} />
        </a>
      </div>
    </footer>
  );
}

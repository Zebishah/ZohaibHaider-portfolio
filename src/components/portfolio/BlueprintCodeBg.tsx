import { useEffect, useRef } from "react";

const SNIPPETS = [
  "const api = await fetch('/v1/users')",
  "useEffect(() => hydrate(), [])",
  "docker compose up -d",
  "git commit -m 'ship'",
  "SELECT * FROM invoices",
  "aws s3 sync ./dist",
  "npm run build",
  "export async function POST()",
  "prisma.user.findMany()",
  "redis.set(key, value)",
  "kubectl apply -f",
  "tailwindcss --watch",
];

type Drop = {
  x: number;
  y: number;
  speed: number;
  opacity: number;
  text: string;
  fontSize: number;
};

/**
 * Blueprint grid + soft code rain — polished engineer aesthetic.
 * Calm motion, readable hero, recruiter-coded tech vibe.
 */
export default function BlueprintCodeBg() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let disposed = false;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let drops: Drop[] = [];
    let gridOffset = 0;
    let pulse = 0;

    const seedDrops = () => {
      const count = Math.max(12, Math.floor(width / 110));
      drops = Array.from({ length: count }, (_, i) => ({
        x: ((i + 0.5) / count) * width + (Math.random() - 0.5) * 40,
        y: Math.random() * height,
        speed: 18 + Math.random() * 28,
        opacity: 0.28 + Math.random() * 0.28,
        text: SNIPPETS[Math.floor(Math.random() * SNIPPETS.length)],
        fontSize: 11 + Math.floor(Math.random() * 3),
      }));
    };

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seedDrops();
    };

    const drawGrid = (t: number) => {
      const spacing = 48;
      gridOffset = (t * 0.012) % spacing;
      pulse = 0.5 + 0.5 * Math.sin(t * 0.0012);

      ctx.save();
      ctx.strokeStyle = `rgba(20, 184, 166, ${0.08 + pulse * 0.04})`;
      ctx.lineWidth = 1;

      for (let x = -spacing; x < width + spacing; x += spacing) {
        ctx.beginPath();
        ctx.moveTo(x + gridOffset * 0.35, 0);
        ctx.lineTo(x + gridOffset * 0.35, height);
        ctx.stroke();
      }
      for (let y = -spacing; y < height + spacing; y += spacing) {
        ctx.beginPath();
        ctx.moveTo(0, y + gridOffset);
        ctx.lineTo(width, y + gridOffset);
        ctx.stroke();
      }

      // soft origin crosshair
      const cx = width * 0.72;
      const cy = height * 0.38;
      ctx.strokeStyle = `rgba(251, 146, 60, ${0.14 + pulse * 0.08})`;
      ctx.beginPath();
      ctx.arc(cx, cy, 56 + pulse * 8, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx - 72, cy);
      ctx.lineTo(cx + 72, cy);
      ctx.moveTo(cx, cy - 72);
      ctx.lineTo(cx, cy + 72);
      ctx.stroke();

      ctx.restore();
    };

    const drawDrops = (dt: number) => {
      ctx.save();
      ctx.font = "12px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
      ctx.textBaseline = "top";

      for (const d of drops) {
        d.y += d.speed * dt;
        if (d.y > height + 40) {
          d.y = -40 - Math.random() * 80;
          d.x = Math.random() * width;
          d.text = SNIPPETS[Math.floor(Math.random() * SNIPPETS.length)];
          d.speed = 18 + Math.random() * 28;
          d.opacity = 0.28 + Math.random() * 0.28;
        }

        const chars = d.text;
        for (let i = 0; i < Math.min(chars.length, 18); i++) {
          const ch = chars[i];
          const yy = d.y + i * 14;
          const fade = 1 - i / 18;
          ctx.globalAlpha = d.opacity * fade;
          ctx.fillStyle = i === 0 ? "#22d3ee" : i < 4 ? "#14b8a6" : "#94a3b8";
          ctx.fillText(ch, d.x, yy);
        }
      }
      ctx.restore();
    };

    let last = performance.now();
    const tick = (now: number) => {
      if (disposed) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      ctx.clearRect(0, 0, width, height);
      drawGrid(now);
      drawDrops(dt);

      rafRef.current = requestAnimationFrame(tick);
    };

    resize();
    const ro = new ResizeObserver(() => resize());
    if (canvas.parentElement) ro.observe(canvas.parentElement);
    window.addEventListener("resize", resize);
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      disposed = true;
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="absolute inset-0 h-full w-full overflow-hidden">
      <canvas ref={canvasRef} className="block h-full w-full" aria-hidden />
    </div>
  );
}

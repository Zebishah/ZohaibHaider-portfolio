import { useEffect, useRef } from "react";

type LineKind = "prompt" | "comment" | "code" | "success" | "dim" | "warn" | "accent";

type ScriptLine = {
  text: string;
  kind: LineKind;
  pause?: number;
  /** optional fake progress bar after line */
  progress?: boolean;
};

const SCRIPT_A: ScriptLine[] = [
  { text: "zohaib@dev:~$ whoami", kind: "prompt", pause: 220 },
  { text: "full-stack-mern-developer ✦ open-to-work", kind: "accent", pause: 480 },
  { text: "", kind: "dim", pause: 90 },
  { text: "// production-grade SaaS engineer", kind: "comment", pause: 180 },
  { text: "const stack = ['React', 'Node', 'PostgreSQL', 'AWS'];", kind: "code", pause: 240 },
  { text: "const skills = ['APIs', 'Auth', 'Payments', 'AI/LLM'];", kind: "code", pause: 260 },
  { text: "", kind: "dim", pause: 80 },
  { text: "zohaib@dev:~$ npm run build", kind: "prompt", pause: 200 },
  { text: "▹ compiling modules…", kind: "dim", pause: 120, progress: true },
  { text: "✓ built in 1.42s  ·  gzip 186kb", kind: "success", pause: 320 },
  { text: "zohaib@dev:~$ npm test -- --coverage", kind: "prompt", pause: 220 },
  { text: "✓ 48 passed  ·  coverage 94%", kind: "success", pause: 380 },
  { text: "", kind: "dim", pause: 80 },
  { text: "await deploy({ env: 'prod', health: 'green' });", kind: "code", pause: 300 },
  { text: "→ live @ api.zohaib.dev", kind: "accent", pause: 520 },
  { text: "zohaib@dev:~$ ▌", kind: "prompt", pause: 900 },
];

const SCRIPT_B: ScriptLine[] = [
  { text: "zohaib@cloud:~$ git status -sb", kind: "prompt", pause: 200 },
  { text: "## main...origin/main", kind: "dim", pause: 160 },
  { text: "zohaib@cloud:~$ git push origin main", kind: "prompt", pause: 240 },
  { text: "Enumerating objects: 26, done.", kind: "dim", pause: 140 },
  { text: "Writing objects: 100% (18/18), done.", kind: "dim", pause: 160 },
  { text: "→ CI pipeline triggered", kind: "warn", pause: 200, progress: true },
  { text: "✓ lint · typecheck · e2e — all green", kind: "success", pause: 360 },
  { text: "", kind: "dim", pause: 90 },
  { text: "POST /api/v1/checkout  201  42ms", kind: "code", pause: 200 },
  { text: "GET  /api/v1/users     200  18ms", kind: "code", pause: 200 },
  { text: "WS   /realtime         connected", kind: "accent", pause: 280 },
  { text: "", kind: "dim", pause: 80 },
  { text: "const hire = () => ship({ scale: true, ai: true });", kind: "code", pause: 340 },
  { text: "✓ ready for your next product", kind: "success", pause: 600 },
  { text: "zohaib@cloud:~$ ▌", kind: "prompt", pause: 900 },
];

const SCRIPT_C: ScriptLine[] = [
  { text: "zohaib@ai:~$ llm integrate --provider openai", kind: "prompt", pause: 240 },
  { text: "loading embeddings…", kind: "dim", pause: 140, progress: true },
  { text: "✓ rag pipeline online", kind: "success", pause: 280 },
  { text: "streamChat({ model: 'gpt-4.1', tools: true })", kind: "code", pause: 300 },
  { text: "→ tokens/sec 86  ·  latency 210ms", kind: "accent", pause: 360 },
  { text: "", kind: "dim", pause: 80 },
  { text: "zohaib@ai:~$ docker compose up -d", kind: "prompt", pause: 220 },
  { text: "✔ postgres  healthy", kind: "success", pause: 140 },
  { text: "✔ redis     healthy", kind: "success", pause: 140 },
  { text: "✔ api       healthy", kind: "success", pause: 280 },
  { text: "", kind: "dim", pause: 80 },
  { text: "// available for full-time & contract", kind: "comment", pause: 400 },
  { text: "zohaib@ai:~$ ▌", kind: "prompt", pause: 900 },
];

const COLORS: Record<LineKind, string> = {
  prompt: "#67e8f9",
  comment: "rgba(148, 163, 184, 0.55)",
  code: "#2dd4bf",
  success: "#fb923c",
  dim: "rgba(148, 163, 184, 0.42)",
  warn: "#fbbf24",
  accent: "#a5f3fc",
};

type Particle = { x: number; y: number; r: number; vx: number; vy: number; a: number; hue: number };

/**
 * Eye-catching animated developer terminal backdrop.
 */
export default function CodeTerminalBg() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let disposed = false;
    let dpr = 1;
    let width = 0;
    let height = 0;
    let particles: Particle[] = [];

    type PaneLine = { text: string; kind: LineKind; born: number };
    type Pane = {
      baseX: number;
      baseY: number;
      w: number;
      h: number;
      opacity: number;
      lineIndex: number;
      charIndex: number;
      lines: PaneLine[];
      waitUntil: number;
      typing: boolean;
      speed: number;
      script: ScriptLine[];
      title: string;
      floatPhase: number;
      floatAmpX: number;
      floatAmpY: number;
      floatSpeed: number;
      rotAmp: number;
      progress: number | null;
      progressUntil: number;
      glow: number;
      x: number;
      y: number;
      rot: number;
      scale: number;
    };

    const panes: Pane[] = [];

    const seedParticles = () => {
      const n = Math.floor((width * height) / 28000);
      particles = Array.from({ length: Math.max(18, n) }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: 0.6 + Math.random() * 1.8,
        vx: (Math.random() - 0.5) * 0.15,
        vy: -0.05 - Math.random() * 0.2,
        a: 0.15 + Math.random() * 0.35,
        hue: Math.random() > 0.55 ? 175 : 25,
      }));
    };

    const layoutPanes = (now: number) => {
      panes.length = 0;
      const isMobile = width < 768;
      if (isMobile) {
        panes.push({
          baseX: width * 0.05,
          baseY: height * 0.2,
          w: width * 0.9,
          h: height * 0.55,
          opacity: 0.78,
          lineIndex: 0,
          charIndex: 0,
          lines: [],
          waitUntil: now,
          typing: true,
          speed: 18,
          script: SCRIPT_A,
          title: "zsh — ~/portfolio",
          floatPhase: 0,
          floatAmpX: 8,
          floatAmpY: 10,
          floatSpeed: 0.85,
          rotAmp: 0.006,
          progress: null,
          progressUntil: 0,
          glow: 0,
          x: 0,
          y: 0,
          rot: 0,
          scale: 1,
        });
      } else {
        panes.push(
          {
            baseX: width * 0.035,
            baseY: height * 0.14,
            w: width * 0.4,
            h: height * 0.56,
            opacity: 0.88,
            lineIndex: 0,
            charIndex: 0,
            lines: [],
            waitUntil: now,
            typing: true,
            speed: 16,
            script: SCRIPT_A,
            title: "zsh — ~/saas-platform",
            floatPhase: 0.35,
            floatAmpX: 12,
            floatAmpY: 10,
            floatSpeed: 0.9,
            rotAmp: 0.008,
            progress: null,
            progressUntil: 0,
            glow: 0,
            x: 0,
            y: 0,
            rot: 0,
            scale: 1,
          },
          {
            baseX: width * 0.54,
            baseY: height * 0.2,
            w: width * 0.42,
            h: height * 0.48,
            opacity: 0.62,
            lineIndex: 0,
            charIndex: 0,
            lines: [],
            waitUntil: now + 600,
            typing: true,
            speed: 20,
            script: SCRIPT_B,
            title: "deploy — production",
            floatPhase: 2.4,
            floatAmpX: 14,
            floatAmpY: 12,
            floatSpeed: 0.75,
            rotAmp: 0.01,
            progress: null,
            progressUntil: 0,
            glow: 0,
            x: 0,
            y: 0,
            rot: 0,
            scale: 1,
          },
          {
            baseX: width * 0.28,
            baseY: height * 0.6,
            w: width * 0.38,
            h: height * 0.28,
            opacity: 0.45,
            lineIndex: 0,
            charIndex: 0,
            lines: [],
            waitUntil: now + 1400,
            typing: true,
            speed: 22,
            script: SCRIPT_C,
            title: "ai — llm-service",
            floatPhase: 4.2,
            floatAmpX: 10,
            floatAmpY: 14,
            floatSpeed: 1.05,
            rotAmp: 0.007,
            progress: null,
            progressUntil: 0,
            glow: 0,
            x: 0,
            y: 0,
            rot: 0,
            scale: 1,
          },
        );
      }
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
      layoutPanes(performance.now());
      seedParticles();
      seedDrift();
    };

    const lineHeight = 21;
    const padX = 16;
    const padY = 42;

    const maxVisibleLines = (p: Pane) => Math.max(3, Math.floor((p.h - padY - 16) / lineHeight));

    const FAINT_CODE = [
      "async function deploy()",
      "useQuery(['users'])",
      "prisma.$transaction",
      "jwt.verify(token)",
      "s3.upload(file)",
      "redis.cache.set",
      "graphql resolver",
      "CI/CD · green",
    ];

    type DriftLine = { x: number; y: number; text: string; speed: number; alpha: number };
    let drift: DriftLine[] = [];

    const seedDrift = () => {
      drift = FAINT_CODE.map((text, i) => ({
        x: Math.random() * width,
        y: (i / FAINT_CODE.length) * height + Math.random() * 40,
        text,
        speed: 8 + Math.random() * 14,
        alpha: 0.06 + Math.random() * 0.08,
      }));
    };

    const drawBackdrop = (now: number) => {
      const t = now * 0.00025;

      // soft brand orbs (richer)
      const orbs = [
        { x: width * 0.12, y: height * 0.22, r: 220, c: "20,184,166" },
        { x: width * 0.88, y: height * 0.58, r: 260, c: "249,115,22" },
        { x: width * 0.55, y: height * 0.12, r: 180, c: "34,211,238" },
        { x: width * 0.4, y: height * 0.78, r: 160, c: "45,212,191" },
      ];
      for (const o of orbs) {
        const ox = o.x + Math.sin(t + o.r) * 40;
        const oy = o.y + Math.cos(t * 0.8 + o.r) * 28;
        const g = ctx.createRadialGradient(ox, oy, 0, ox, oy, o.r);
        g.addColorStop(0, `rgba(${o.c},0.18)`);
        g.addColorStop(0.45, `rgba(${o.c},0.05)`);
        g.addColorStop(1, `rgba(${o.c},0)`);
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, width, height);
      }

      // subtle drifting blueprint grid
      const spacing = 56;
      const gOff = (now * 0.008) % spacing;
      ctx.save();
      ctx.strokeStyle = "rgba(20, 184, 166, 0.055)";
      ctx.lineWidth = 1;
      for (let x = -spacing + gOff; x < width + spacing; x += spacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = -spacing + gOff * 0.6; y < height + spacing; y += spacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      ctx.restore();

      // faint drifting code phrases
      ctx.save();
      ctx.font = "11px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
      for (const d of drift) {
        d.x += d.speed * 0.016;
        if (d.x > width + 120) {
          d.x = -120;
          d.y = Math.random() * height;
          d.text = FAINT_CODE[Math.floor(Math.random() * FAINT_CODE.length)];
        }
        ctx.globalAlpha = d.alpha;
        ctx.fillStyle = "#67e8f9";
        ctx.fillText(d.text, d.x, d.y);
      }
      ctx.restore();

      // floating particles + constellation links
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
      }

      ctx.save();
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 120) {
            ctx.strokeStyle = `rgba(45, 212, 191, ${0.12 * (1 - dist / 120)})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 80%, 65%, ${p.a})`;
        ctx.fill();
      }
      ctx.restore();

      // soft scanlines
      ctx.save();
      ctx.globalAlpha = 0.025;
      for (let y = (now * 0.02) % 5; y < height; y += 5) {
        ctx.fillStyle = "#14b8a6";
        ctx.fillRect(0, y, width, 1);
      }
      ctx.restore();
    };

    const drawPaneChrome = (p: Pane, now: number) => {
      const r = 16;
      const pulse = 0.5 + 0.5 * Math.sin(now * 0.003 + p.floatPhase);
      p.glow = 0.35 + pulse * 0.45;

      ctx.save();
      // outer glow
      ctx.shadowColor = `rgba(20, 184, 166, ${0.25 * p.opacity * p.glow})`;
      ctx.shadowBlur = 28 + pulse * 16;
      ctx.globalAlpha = p.opacity;

      ctx.beginPath();
      ctx.roundRect(p.x, p.y, p.w, p.h, r);
      const body = ctx.createLinearGradient(p.x, p.y, p.x, p.y + p.h);
      body.addColorStop(0, "rgba(10, 18, 24, 0.78)");
      body.addColorStop(1, "rgba(6, 12, 16, 0.62)");
      ctx.fillStyle = body;
      ctx.fill();

      ctx.shadowBlur = 0;
      ctx.strokeStyle = `rgba(45, 212, 191, ${0.22 + pulse * 0.18})`;
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // top accent line
      const accent = ctx.createLinearGradient(p.x, p.y, p.x + p.w, p.y);
      accent.addColorStop(0, "rgba(20,184,166,0)");
      accent.addColorStop(0.3, `rgba(34,211,238,${0.55 + pulse * 0.3})`);
      accent.addColorStop(0.7, `rgba(249,115,22,${0.45 + pulse * 0.25})`);
      accent.addColorStop(1, "rgba(249,115,22,0)");
      ctx.fillStyle = accent;
      ctx.fillRect(p.x + 12, p.y, p.w - 24, 2);

      // title bar
      ctx.beginPath();
      ctx.roundRect(p.x, p.y, p.w, 30, [r, r, 0, 0]);
      ctx.fillStyle = "rgba(12, 20, 26, 0.92)";
      ctx.fill();

      const dots = ["#f87171", "#fbbf24", "#4ade80"];
      dots.forEach((c, i) => {
        ctx.beginPath();
        ctx.arc(p.x + 16 + i * 14, p.y + 15, 4, 0, Math.PI * 2);
        ctx.fillStyle = c;
        ctx.globalAlpha = p.opacity * (0.75 + pulse * 0.2);
        ctx.fill();
      });

      ctx.globalAlpha = p.opacity * 0.7;
      ctx.font = "500 11px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
      ctx.fillStyle = "rgba(186, 230, 253, 0.85)";
      ctx.fillText(p.title, p.x + 64, p.y + 19);

      // live badge
      ctx.globalAlpha = p.opacity;
      const bx = p.x + p.w - 58;
      const by = p.y + 8;
      ctx.beginPath();
      ctx.roundRect(bx, by, 44, 14, 7);
      ctx.fillStyle = "rgba(20, 184, 166, 0.18)";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(bx + 10, by + 7, 3, 0, Math.PI * 2);
      ctx.fillStyle = Math.floor(now / 600) % 2 === 0 ? "#4ade80" : "#22c55e";
      ctx.fill();
      ctx.font = "600 9px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
      ctx.fillStyle = "#5eead4";
      ctx.fillText("LIVE", bx + 18, by + 11);

      ctx.restore();
    };

    const advancePane = (p: Pane, now: number) => {
      if (p.progress !== null) {
        p.progress = Math.min(1, p.progress + 0.018);
        if (p.progress >= 1 && now > p.progressUntil) {
          p.progress = null;
        }
        return;
      }

      if (now < p.waitUntil) return;

      const current = p.script[p.lineIndex % p.script.length];

      if (current.text.length === 0) {
        p.lines.push({ text: "", kind: current.kind, born: now });
        if (p.lines.length > maxVisibleLines(p)) p.lines.shift();
        p.lineIndex += 1;
        p.charIndex = 0;
        p.typing = false;
        p.waitUntil = now + (current.pause ?? 160);
        return;
      }

      if (p.charIndex === 0) {
        p.lines.push({ text: "", kind: current.kind, born: now });
        if (p.lines.length > maxVisibleLines(p)) p.lines.shift();
        p.typing = true;
      }

      // burst type 1–2 chars for snappier feel
      const step = Math.random() > 0.7 ? 2 : 1;
      p.charIndex = Math.min(current.text.length, p.charIndex + step);
      p.lines[p.lines.length - 1] = {
        text: current.text.slice(0, p.charIndex),
        kind: current.kind,
        born: p.lines[p.lines.length - 1]?.born ?? now,
      };

      if (p.charIndex >= current.text.length) {
        p.lineIndex += 1;
        p.charIndex = 0;
        p.typing = false;
        if (current.progress) {
          p.progress = 0;
          p.progressUntil = now + 700;
          p.waitUntil = now + 80;
        } else {
          p.waitUntil = now + (current.pause ?? 220);
        }
        if (p.lineIndex > 0 && p.lineIndex % p.script.length === 0) {
          p.lines = [];
          p.waitUntil = now + 550;
        }
      } else {
        p.waitUntil = now + p.speed + Math.random() * 12;
      }
    };

    const drawPaneText = (p: Pane, now: number) => {
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(p.x + 1, p.y + 30, p.w - 2, p.h - 31, [0, 0, 14, 14]);
      ctx.clip();

      ctx.font = "12.5px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
      ctx.textBaseline = "top";

      p.lines.forEach((line, i) => {
        const age = Math.min(1, (now - line.born) / 220);
        const y = p.y + padY + i * lineHeight;
        ctx.globalAlpha = p.opacity * (0.55 + age * 0.45);
        ctx.fillStyle = COLORS[line.kind];

        let text = line.text;
        const isLast = i === p.lines.length - 1;
        if (isLast && (p.typing || text.endsWith("▌"))) {
          const on = Math.floor(now / 480) % 2 === 0;
          if (p.typing) {
            text = on ? `${text}▌` : text;
            if (on) {
              ctx.shadowColor = COLORS[line.kind];
              ctx.shadowBlur = 8;
            }
          }
        }
        ctx.fillText(text, p.x + padX, y, p.w - padX * 2);
        ctx.shadowBlur = 0;
      });

      if (p.progress !== null) {
        const barY = p.y + padY + p.lines.length * lineHeight + 4;
        const barW = p.w - padX * 2;
        ctx.globalAlpha = p.opacity * 0.9;
        ctx.fillStyle = "rgba(148,163,184,0.2)";
        ctx.beginPath();
        ctx.roundRect(p.x + padX, barY, barW, 6, 3);
        ctx.fill();
        const grad = ctx.createLinearGradient(p.x + padX, 0, p.x + padX + barW, 0);
        grad.addColorStop(0, "#14b8a6");
        grad.addColorStop(1, "#f97316");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(p.x + padX, barY, Math.max(6, barW * p.progress), 6, 3);
        ctx.fill();
      }

      ctx.restore();
    };

    const updatePaneMotion = (p: Pane, now: number) => {
      const t = now * 0.001 * p.floatSpeed;
      const ph = p.floatPhase;

      // layered smooth Lissajous float — bigger + more lively than a single sine
      const dx =
        Math.sin(t * 0.9 + ph) * p.floatAmpX +
        Math.sin(t * 1.7 + ph * 1.3) * (p.floatAmpX * 0.35) +
        Math.cos(t * 0.45 + ph) * (p.floatAmpX * 0.2);

      const dy =
        Math.cos(t * 0.75 + ph * 0.8) * p.floatAmpY +
        Math.sin(t * 1.4 + ph) * (p.floatAmpY * 0.4) +
        Math.sin(t * 0.35 + ph * 1.5) * (p.floatAmpY * 0.22);

      p.x = p.baseX + dx;
      p.y = p.baseY + dy;
      p.rot =
        Math.sin(t * 0.65 + ph) * p.rotAmp +
        Math.cos(t * 1.15 + ph * 0.6) * (p.rotAmp * 0.45);
      p.scale = 1 + Math.sin(t * 0.8 + ph) * 0.008 + Math.cos(t * 1.3 + ph) * 0.005;
    };

    const tick = (now: number) => {
      if (disposed) return;
      ctx.clearRect(0, 0, width, height);
      drawBackdrop(now);

      for (const p of panes) {
        updatePaneMotion(p, now);
        advancePane(p, now);

        const cx = p.x + p.w / 2;
        const cy = p.y + p.h / 2;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(p.rot);
        ctx.scale(p.scale, p.scale);
        ctx.translate(-cx, -cy);
        drawPaneChrome(p, now);
        drawPaneText(p, now);
        ctx.restore();
      }

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

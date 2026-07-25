import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef } from "react";
import { Reveal, SectionHeader } from "./Reveal";

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const v = useMotionValue(0);
  const rounded = useTransform(v, (val) => Math.round(val).toString() + suffix);
  useEffect(() => {
    if (inView) animate(v, to, { duration: 1.6, ease: "easeOut" });
  }, [inView, to, v]);
  return <motion.span ref={ref}>{rounded}</motion.span>;
}

const stats = [
  { value: 1.5, suffix: "+", label: "Years Experience", decimals: true },
  { value: 10, suffix: "+", label: "Production Projects" },
  { value: 6, suffix: "", label: "SaaS Platforms Built" },
  { value: 25, suffix: "%+", label: "Latency Reduced" },
];

export function About() {
  return (
    <section id="about" className="relative py-24">
      <div className="max-w-6xl mx-auto px-4">
        <SectionHeader
          eyebrow="About"
          title="Engineer who ships |production-grade| systems."
          subtitle="Not just prototypes — full-lifecycle features from database design to deployed UI."
        />
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <Reveal>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              I'm a full-stack developer with <span className="text-foreground font-medium">1.5+ years</span> of
              hands-on experience building end-to-end web applications using the <span className="text-foreground font-medium">MERN stack</span>
              {" "}(MongoDB, Express, React, Node.js) alongside PostgreSQL for relational data needs. I specialize in
              writing clean, scalable, maintainable code and have real production experience deploying and managing
              infrastructure on <span className="text-foreground font-medium">AWS (EC2, S3, Lambda)</span>.
            </p>
            <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed">
              I've shipped multi-tenant SaaS platforms, payment systems with complex billing lifecycles, real-time
              features, and AI-integrated tools — collaborating closely with product, design, and QA teams to take
              features from database design through to deployed UI.
            </p>
          </Reveal>

          <div className="grid grid-cols-2 gap-4">
            {stats.map((s, idx) => (
              <Reveal key={s.label} delay={idx * 0.08}>
                <div className="relative glass rounded-2xl p-5 md:p-6 group hover:-translate-y-1 transition">
                  <div className="text-3xl md:text-4xl font-display font-bold gradient-text">
                    {s.decimals ? <>1.5{s.suffix}</> : <><Counter to={s.value} suffix={s.suffix} /></>}
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

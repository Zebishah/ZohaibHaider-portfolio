import { Code2, Brain, Cloud, Zap } from "lucide-react";
import { Reveal, SectionHeader } from "./Reveal";

const items = [
  {
    icon: Code2,
    title: "Full-Stack MERN Delivery",
    desc: "End-to-end web app delivery — React/Next.js, Node.js, TypeScript, PostgreSQL & MongoDB.",
  },
  {
    icon: Brain,
    title: "AI & LLM Integration",
    desc: "Production LLM workflows with OpenAI, Gemini, and AWS Bedrock (Claude) — RAG, agents, evaluation.",
  },
  {
    icon: Cloud,
    title: "Cloud & Automation",
    desc: "AWS Lambda, S3, Textract, and CDK to automate document pipelines and cut manual operations.",
  },
  {
    icon: Zap,
    title: "APIs & Performance",
    desc: "Scalable REST/GraphQL APIs, WebSockets, Redis caching, batch processing, and query optimization.",
  },
];

export function Bring() {
  return (
    <section className="relative py-24">
      <div className="max-w-6xl mx-auto px-4">
        <SectionHeader
          eyebrow="What I Bring"
          title="What I bring to a |team|."
          subtitle="Things I've already done on production teams — not services, capabilities I bring on day one."
        />
        <div className="grid sm:grid-cols-2 gap-5">
          {items.map((it, i) => (
            <Reveal key={it.title} delay={i * 0.08}>
              <div className="relative glass rounded-2xl p-6 md:p-7 h-full group hover:-translate-y-1 transition overflow-hidden">
                <div className="w-12 h-12 rounded-xl gradient-bg grid place-items-center text-white shadow-lg shadow-primary/30">
                  <it.icon className="w-5 h-5" />
                </div>
                <h3 className="mt-4 font-display font-semibold text-lg">{it.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{it.desc}</p>
                <div className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-40 transition"
                  style={{ background: "radial-gradient(circle, var(--brand-from), transparent 60%)" }} />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

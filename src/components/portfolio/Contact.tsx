import { useState, type FormEvent } from "react";
import emailjs from "@emailjs/browser";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail, MapPin, Phone, Send, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Reveal } from "./Reveal";
import { socials } from "@/lib/socials";

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID ?? "service_sadasdasd";
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID ?? "template_sadasdasdasd";
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY ?? "asdasdasd";

export function Contact() {
  const [form, setForm] = useState({ from_name: "", from_email: "", message: "" });
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.from_name.trim() || !form.from_email.trim() || !form.message.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.from_email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    setState("sending");
    try {
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, form, { publicKey: PUBLIC_KEY });
      setState("sent");
      toast.success("Message sent! I'll get back to you soon.");
      setForm({ from_name: "", from_email: "", message: "" });
      setTimeout(() => setState("idle"), 3000);
    } catch (err) {
      console.error(err);
      setState("idle");
      toast.error("Something went wrong. Please try again or email me directly.");
    }
  };

  return (
    <section id="contact" className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-30 animate-blob"
          style={{ background: "radial-gradient(circle, #6366f1, transparent 60%)" }} />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-30 animate-blob"
          style={{ background: "radial-gradient(circle, #06b6d4, transparent 60%)", animationDelay: "4s" }} />
      </div>

      <div className="relative max-w-5xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Reveal>
            <div className="inline-flex px-3 py-1 rounded-full glass text-xs font-medium text-muted-foreground mb-4 uppercase tracking-widest">
              Contact
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              Let's build something <span className="gradient-text">great together</span>.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-4 text-muted-foreground md:text-lg">
              Have a role, project, or idea? Drop a message — I usually reply within a day.
            </p>
          </Reveal>
        </div>

        <div className="grid md:grid-cols-[1.15fr_1fr] gap-6">
          <Reveal>
            <form onSubmit={onSubmit} className="glass rounded-2xl p-6 md:p-8 space-y-4">
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground">Name</label>
                <input
                  type="text"
                  value={form.from_name}
                  onChange={(e) => setForm({ ...form, from_name: e.target.value })}
                  maxLength={100}
                  required
                  className="mt-1 w-full bg-transparent border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition"
                  placeholder="Jane Doe"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground">Email</label>
                <input
                  type="email"
                  value={form.from_email}
                  onChange={(e) => setForm({ ...form, from_email: e.target.value })}
                  maxLength={255}
                  required
                  className="mt-1 w-full bg-transparent border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition"
                  placeholder="jane@company.com"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground">Message</label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  maxLength={2000}
                  required
                  rows={5}
                  className="mt-1 w-full bg-transparent border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition resize-none"
                  placeholder="Tell me about the role or project…"
                />
              </div>
              <motion.button
                type="submit"
                disabled={state !== "idle"}
                whileHover={{ scale: state === "idle" ? 1.02 : 1 }}
                whileTap={{ scale: 0.98 }}
                className="w-full gradient-bg text-white rounded-lg py-3 font-medium flex items-center justify-center gap-2 shadow-lg shadow-primary/30 disabled:opacity-70"
              >
                {state === "sending" ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</>
                ) : state === "sent" ? (
                  <><CheckCircle2 className="w-4 h-4" /> Sent!</>
                ) : (
                  <><Send className="w-4 h-4" /> Send message</>
                )}
              </motion.button>
            </form>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="space-y-3 h-full">
              {[
                { icon: Mail, label: "Email", value: socials.email, href: socials.emailHref },
                { icon: Phone, label: "Phone", value: socials.phone, href: socials.phoneHref },
                { icon: MapPin, label: "Location", value: "Wah Cantt, Pakistan" },
                { icon: Github, label: "GitHub", value: "github.com/Zebishah", href: socials.github },
                { icon: Linkedin, label: "LinkedIn", value: "Connect on LinkedIn", href: socials.linkedin },
              ].map((c) => {
                const Row = (
                  <div className="glass rounded-xl p-4 flex items-center gap-3 hover:border-primary/50 transition group">
                    <div className="w-10 h-10 rounded-lg gradient-bg grid place-items-center text-white shrink-0">
                      <c.icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs uppercase tracking-widest text-muted-foreground">{c.label}</div>
                      <div className="text-sm truncate group-hover:gradient-text transition">{c.value}</div>
                    </div>
                  </div>
                );
                return c.href ? (
                  <a key={c.label} href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="block">
                    {Row}
                  </a>
                ) : (
                  <div key={c.label}>{Row}</div>
                );
              })}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

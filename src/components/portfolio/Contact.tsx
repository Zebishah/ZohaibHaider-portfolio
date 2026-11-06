import { useState } from "react";
import {
  ArrowUpRight,
  Check,
  Copy,
  Github,
  Linkedin,
  Mail,
  MessageCircle,
  Download,
} from "lucide-react";
import { socials } from "@/lib/socials";
import { Reveal } from "./Reveal";
export function Contact() {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(socials.email);
      setCopied(true);
      setError("");
    } catch {
      setError(
        "Copy is unavailable in this browser. You can select the email address or open the email link.",
      );
    }
  }
  return (
    <section className="contact-section" id="contact" aria-labelledby="contact-title">
      <div className="section-wrap">
        <div className="section-label">
          <span>06 / YOUR NEXT CHAPTER</span>
          <span>GOOD THINGS START WITH A CONVERSATION.</span>
        </div>
        <Reveal className="contact-heading">
          <p className="eyebrow">HAVE SOMETHING WORTH BUILDING?</p>
          <h2 id="contact-title">
            LET'S MAKE
            <br />
            <span>IT HAPPEN.</span>
            <a className="contact-arrow" href={socials.emailHref} aria-label="Email Zohaib Haider">
              <ArrowUpRight strokeWidth={1.3} />
            </a>
          </h2>
        </Reveal>
        <div className="contact-bottom">
          <div className="contact-invitation">
            <p>
              Looking for someone who can connect
              <br />
              the interface, the intelligence, and the system?
            </p>
            <p>Let's talk about the work.</p>
            <a
              className="button button-lime"
              href={socials.resume}
              download={socials.resumeDownloadName}
            >
              Download résumé <Download size={17} />
            </a>
          </div>
          <div className="contact-destinations">
            <div className="email-contact">
              <Mail size={19} />
              <a href={socials.emailHref}>{socials.email}</a>
              <button
                className="icon-button"
                aria-label={copied ? "Email address copied" : "Copy email address"}
                onClick={copyEmail}
              >
                {copied ? <Check size={17} /> : <Copy size={17} />}
              </button>
            </div>
            <p className="contact-copy-feedback" role="status">
              {copied ? "Email address copied." : error}
            </p>
            <div className="contact-links">
              {[
                [Github, "GitHub", "Explore the code", socials.github],
                [Linkedin, "LinkedIn", "Let's connect", socials.linkedin],
                [MessageCircle, "WhatsApp", socials.phone, socials.whatsapp],
              ].map(([Icon, title, label, href]) => {
                const I = Icon as typeof Github;
                return (
                  <a key={String(title)} href={String(href)} target="_blank" rel="noreferrer">
                    <I size={20} />
                    <strong>
                      {String(title)}
                      <small>{String(label)}</small>
                    </strong>
                    <ArrowUpRight size={20} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

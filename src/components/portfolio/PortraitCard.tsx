import { MapPin } from "lucide-react";
import { socials } from "@/lib/socials";
import { RoleTitle } from "./RoleTitle";
import "./PortraitCard.css";

export function PortraitCard({
  className = "",
  priority = false,
  availability = false,
}: {
  className?: string;
  priority?: boolean;
  availability?: boolean;
}) {
  return (
    <figure className={`portrait-card ${className}`}>
      <div className="portrait-card-label">
        <span>THE ENGINEER BEHIND THE SYSTEMS</span>
        <i aria-hidden="true" />
      </div>
      <div className="portrait-card-photo">
        <img
          src={socials.portrait}
          alt="Zohaib Haider wearing a charcoal three-piece suit and glasses"
          width="1070"
          height="1470"
          fetchPriority={priority ? "high" : "auto"}
          loading={priority ? "eager" : "lazy"}
        />
        <span className="portrait-card-corner" aria-hidden="true">
          ZH / 01
        </span>
      </div>
      <figcaption>
        <div>
          <strong>Zohaib Haider</strong>
          <RoleTitle />
        </div>
        <p>
          <MapPin size={12} /> Islamabad, Pakistan
        </p>
      </figcaption>
      {availability && (
        <p className="portrait-card-availability">
          <i aria-hidden="true" /> Open to full-time roles and freelance projects
        </p>
      )}
    </figure>
  );
}

import { event } from "@/content/evento";
import { ExternalLink } from "@/components/external-link";

export function SiteFooter() {
  return (
    <footer>
      <a className="brand brand--footer" href="#inicio">
        <span className="brand__mark">TT</span>
        <span>
          Tandil
          <br />
          Tech Week
        </span>
      </a>
      <p>
        {event.footerDate}
        <br />
        {event.place}
      </p>
      <div>
        <ExternalLink href={event.social.instagram}>Instagram</ExternalLink>
        <ExternalLink href={event.social.x}>X</ExternalLink>
      </div>
      <small>
        © 2026 · {event.social.handle} · Hecho en {event.place}
      </small>
    </footer>
  );
}

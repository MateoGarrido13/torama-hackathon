import { event, jornadas } from "@/content/evento";
import { tracks } from "@/content/tracks";
import { TrackMarquee } from "@/components/track-marquee";
import { Icon } from "@/components/icon";
import { formatDayNumber, formatMonthYear } from "@/lib/datetime";

export function Hero() {
  const first = jornadas[0];
  const last = jornadas[jornadas.length - 1];
  const range =
    first && last ? `${formatDayNumber(first.inicio)}—${formatDayNumber(last.inicio)}` : event.datesLabel;
  const monthYear = first ? formatMonthYear(first.inicio) : "";

  return (
    <>
    <section className="hero" id="inicio">
      <div className="hero__content">
        <div className="badge">
          <span /> {event.badge}
        </div>
        <p className="eyebrow">Donde las ideas hacen sistema</p>
        <h1>
          Tandil
          <br />
          <em>Tech Week</em>
        </h1>
        <p className="hero__lead">{event.claim}</p>
        <div className="hero__actions">
          <a className="button button--primary" href="#mesa">
            <span>Sumarme a la red</span>
            <Icon name="arrow" />
          </a>
          <a className="text-link" href="#agenda">
            Ver agenda <span>↘</span>
          </a>
        </div>
      </div>
      <div className="network" aria-label="Visualización de conexiones de la comunidad">
        <div className="network__orb network__orb--one" />
        <div className="network__orb network__orb--two" />
        <div className="network__orb network__orb--three" />
        <div className="network__line network__line--one" />
        <div className="network__line network__line--two" />
        <div className="node-card">
          <div className="node-card__avatar">AM</div>
          <div>
            <strong>Agustina Molina</strong>
            <span>Product Designer · Lumen</span>
          </div>
          <span className="track-tag track-tag--tech">Tech & Devs</span>
        </div>
        <p className="network__caption">
          Conectá con quienes
          <br />
          están creando lo próximo.
        </p>
      </div>
      <div className="hero__date">
        <span>{range}</span>
        <span>{monthYear}</span>
        <span>{event.place.toUpperCase()} · ARG</span>
      </div>
    </section>
    {tracks.length > 0 ? <TrackMarquee tracks={tracks} /> : null}
    </>
  );
}

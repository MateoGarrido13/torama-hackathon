"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { formatTalkTime, MOCK_EVENT_MS, mockedNow, talkPhase, talkStartMs } from "@/lib/speaker-timeline";

export type TimelineSpeaker = {
  id: string;
  nombre: string;
  foto: string;
  hasPhoto: boolean;
  initials: string;
};

export function SpeakerTimeline({ speakers }: { speakers: TimelineSpeaker[] }) {
  const [now, setNow] = useState(MOCK_EVENT_MS);
  const [revealed, setRevealed] = useState<ReadonlySet<string>>(() => new Set());

  useEffect(() => {
    const tick = () => setNow(mockedNow());
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const nodes = document.querySelectorAll<HTMLElement>("[data-speaker-id]");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      setRevealed(new Set(speakers.map((speaker) => speaker.id)));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        setRevealed((current) => {
          const next = new Set(current);
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            const id = entry.target.getAttribute("data-speaker-id");
            if (id) next.add(id);
            observer.unobserve(entry.target);
          }
          return next;
        });
      },
      { threshold: 0.35 },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [speakers]);

  return (
    <ol className="speaker-timeline" aria-label="Línea de tiempo de las charlas">
      {speakers.map((speaker, index) => {
        const start = talkStartMs(index);
        const phase = talkPhase(start, now);
        const visible = revealed.has(speaker.id);

        return (
          <li
            key={speaker.id}
            data-speaker-id={speaker.id}
            className={`speaker-timeline__item speaker-timeline__item--${phase}${visible ? " is-revealed" : ""}`}
            aria-current={phase === "current" ? "true" : undefined}
          >
            <div className="speaker-timeline__body">
              <div className="speaker-timeline__meta">
                <time dateTime={new Date(start).toISOString()}>{formatTalkTime(start)}</time>
                {phase === "next" ? <span className="speaker-timeline__badge">Próxima</span> : null}
              </div>
              <div className="speaker-card__image">
                {speaker.hasPhoto ? (
                  <Image src={speaker.foto} alt="" fill sizes="280px" className="object-cover" />
                ) : (
                  <span className="speaker-card__fallback" aria-hidden="true">
                    {speaker.initials}
                  </span>
                )}
              </div>
              <h3>{speaker.nombre}</h3>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

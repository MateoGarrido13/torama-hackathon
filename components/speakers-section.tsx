import fs from "node:fs";
import path from "node:path";
import { speakers } from "@/content/speakers";
import { SpeakerTimeline } from "@/components/speaker-timeline";

function photoExists(foto: string) {
  const relative = foto.replace(/^\/+/, "");
  return fs.existsSync(path.join(process.cwd(), "public", relative));
}

function initials(nombre: string) {
  return nombre
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] ?? "")
    .join("")
    .toLocaleUpperCase("es-AR");
}

export function SpeakersSection() {
  return (
    <section className="speakers" id="speakers">
      <div className="section-heading">
        <div>
          <p className="eyebrow">02 · Voces</p>
          <h2>
            Ideas que
            <br />
            <em>encienden</em> ideas.
          </h2>
        </div>
        <p>Referentes que comparten lo que saben, lo que intentaron y lo que todavía están imaginando.</p>
      </div>
      <SpeakerTimeline
        speakers={speakers.map((speaker) => ({
          id: speaker.id,
          nombre: speaker.nombre,
          foto: speaker.foto,
          hasPhoto: photoExists(speaker.foto),
          initials: initials(speaker.nombre),
        }))}
      />
    </section>
  );
}

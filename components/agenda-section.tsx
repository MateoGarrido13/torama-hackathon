import { jornadas } from "@/content/evento";
import { formatDay } from "@/lib/datetime";

export function AgendaSection() {
  return (
    <section className="manifesto" id="agenda">
      <p className="eyebrow">01 · La semana</p>
      <div className="manifesto__grid">
        <h2>
          Dos jornadas.
          <br />
          <em>Una ciudad</em>
          <br />
          en movimiento.
        </h2>
        <div>
          <p>
            Charlas, talleres, encuentros y experiencias para quienes construyen el presente digital
            desde Tandil hacia el mundo.
          </p>
          <div className="agenda-list">
            {jornadas.map((jornada) => (
              <div key={jornada.id} className="agenda-row">
                <span>{formatDay(jornada.inicio).toUpperCase()}</span>
                <strong>{jornada.nombre}</strong>
                <small>{jornada.sede}</small>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/icon";

/** 2 horas desde las 18:53 ART del 14 oct 2026. */
const target = new Date("2026-10-14T20:53:00-03:00").getTime();

function cells(remainingMs: number) {
  const seconds = Math.floor(remainingMs / 1000);
  return [
    { id: "days", value: String(Math.floor(seconds / 86400)).padStart(2, "0"), label: "Días" },
    { id: "hours", value: String(Math.floor((seconds % 86400) / 3600)).padStart(2, "0"), label: "Horas" },
    { id: "minutes", value: String(Math.floor((seconds % 3600) / 60)).padStart(2, "0"), label: "Min" },
    { id: "seconds", value: String(seconds % 60).padStart(2, "0"), label: "Seg" },
  ];
}

export function LiveSection() {
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setRemaining(Math.max(0, target - Date.now()));
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const values = cells(remaining ?? 0);

  return (
    <section className="live-section" id="en-vivo" aria-labelledby="en-vivo-titulo">
      <div className="live-section__heading">
        <div>
          <p className="eyebrow eyebrow--light">03 · Streaming</p>
          <h2 id="en-vivo-titulo">
            La señal se
            <br />
            <em>enciende pronto.</em>
          </h2>
        </div>
        <span className="signal">
          <i /> Esperando señal
        </span>
      </div>
      <div className="live-grid">
        <div className="live-copy">
          <p>Transmitimos las charlas principales para que puedas ser parte, estés donde estés.</p>
          <button type="button" className="button button--secondary">
            <span>Abrir la transmisión</span>
            <Icon name="play" />
          </button>
        </div>
        <div className="countdown" aria-label="Cuenta regresiva para el evento">
          {values.map((unit) => (
            <div className="count-cell" key={unit.id}>
              <strong>{unit.value}</strong>
              <span>{unit.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

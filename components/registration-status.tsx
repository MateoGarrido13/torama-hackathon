"use client";

import { useEffect, useState } from "react";
import { event } from "@/content/evento";
import { formatOpening } from "@/lib/datetime";
import { inscriptionStatus, type InscriptionStatus } from "@/lib/inscripciones";

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function Countdown({ status }: { status: Extract<InscriptionStatus, { open: false }> }) {
  const units = [
    { id: "days", value: String(status.days), label: status.days === 1 ? "día" : "días" },
    { id: "hours", value: pad(status.hours), label: status.hours === 1 ? "hora" : "horas" },
    { id: "minutes", value: pad(status.minutes), label: "min" },
    { id: "seconds", value: pad(status.seconds), label: "seg" },
  ];

  return (
    <div>
      <div className="countdown countdown--ink" aria-label="Cuenta regresiva para la apertura de inscripciones">
        {units.map((unit) => (
          <div className="count-cell" key={unit.id}>
            <strong>{unit.value}</strong>
            <span>{unit.label}</span>
          </div>
        ))}
      </div>
      <p className="countdown-note">Abren el {formatOpening(event.inscriptionsOpenAt)}</p>
    </div>
  );
}

export function RegistrationStatus({ initialStatus }: { initialStatus: InscriptionStatus }) {
  const [status, setStatus] = useState(initialStatus);

  useEffect(() => {
    if (status.open) return;

    const tick = () => {
      const next = inscriptionStatus(Date.now(), event.inscriptionsOpenAt);
      setStatus(next);
      return next.open;
    };

    const id = window.setInterval(() => {
      if (tick()) window.clearInterval(id);
    }, 1000);

    return () => window.clearInterval(id);
  }, [status.open]);

  if (status.open) {
    return (
      <h2>
        Inscripciones
        <br />
        <em>abiertas.</em>
      </h2>
    );
  }

  return <Countdown status={status} />;
}

import { Suspense } from "react";
import { connection } from "next/server";
import { event } from "@/content/evento";
import { ExternalLink } from "@/components/external-link";
import { RegistrationStatus } from "@/components/registration-status";
import { inscriptionStatus } from "@/lib/inscripciones";

async function RegistrationLive() {
  await connection();
  // eslint-disable-next-line react-hooks/purity -- corre en el request, después de connection()
  const now = Date.now();
  const status = inscriptionStatus(now, event.inscriptionsOpenAt);
  return <RegistrationStatus initialStatus={status} />;
}

export function RegistrationSection() {
  return (
    <section className="registration" id="inscripciones">
      <p className="eyebrow">Inscripciones</p>
      <Suspense fallback={<p className="section-lead">Calculando apertura…</p>}>
        <RegistrationLive />
      </Suspense>
      <div className="registration__actions">
        <ExternalLink href={event.social.instagram} className="button button--primary">
          <span>Instagram {event.social.handle}</span>
        </ExternalLink>
        <ExternalLink href={event.social.x} className="button button--secondary">
          <span>X {event.social.handle}</span>
        </ExternalLink>
      </div>
    </section>
  );
}

"use client";

import { FormEvent, useState } from "react";
import { Icon } from "@/components/icon";

function Field({
  label,
  placeholder,
  type = "text",
}: {
  label: string;
  placeholder: string;
  type?: string;
}) {
  const id = `field-${label.toLowerCase().replaceAll(" ", "-")}`;
  return (
    <label className="field" htmlFor={id}>
      <span>{label}</span>
      <input id={id} type={type} placeholder={placeholder} required />
    </label>
  );
}

export function MesaSection() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="join" id="mesa">
      <div className="join__intro">
        <p className="eyebrow">05 · Mesa de trabajo</p>
        <h2>
          No vengas solo
          <br />
          a escuchar.
          <br />
          <em>Sumate.</em>
        </h2>
        <p>Completá tu perfil y empezá a conectar con otras personas del ecosistema antes del evento.</p>
      </div>
      <form className="join-form" onSubmit={handleSubmit}>
        {submitted ? (
          <div className="success-message">
            <span>
              <Icon name="check" size={28} />
            </span>
            <p className="eyebrow">Perfil recibido</p>
            <h3>Ya sos parte de la red.</h3>
            <p>Te vamos a escribir cuando habilitemos las primeras conexiones.</p>
            <button type="button" className="button button--secondary" onClick={() => setSubmitted(false)}>
              <span>Cargar otro perfil</span>
            </button>
          </div>
        ) : (
          <>
            <div className="form-row">
              <Field label="Nombre y apellido" placeholder="¿Cómo te llamás?" />
              <Field label="Rol" placeholder="¿Qué hacés?" />
            </div>
            <div className="form-row">
              <Field label="Compañía" placeholder="¿Dónde trabajás?" />
              <Field label="Email privado" placeholder="vos@email.com" type="email" />
            </div>
            <Field label="LinkedIn" placeholder="linkedin.com/in/tu-perfil" type="url" />
            <label className="field" htmlFor="track">
              <span>Track de interés</span>
              <span className="select-wrap">
                <select id="track" defaultValue="" required>
                  <option value="" disabled>
                    Elegí un track
                  </option>
                  <option>Tech & Devs</option>
                  <option>Business & Startups</option>
                </select>
                <Icon name="chevron" />
              </span>
            </label>
            <label className="checkbox">
              <input type="checkbox" defaultChecked />
              <span>
                <Icon name="check" size={15} />
              </span>
              Publicar mi perfil en la red de participantes.
            </label>
            <button type="submit" className="button button--primary">
              <span>Unirme a la mesa</span>
              <Icon name="arrow" />
            </button>
            <small>Al enviar aceptás nuestra política de privacidad. Tu email nunca será público.</small>
          </>
        )}
      </form>
    </section>
  );
}

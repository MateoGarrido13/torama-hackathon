"use client";

import { FormEvent, useState } from "react";
import { Icon } from "@/components/icon";
import { InterestIcon, type InterestGlyph } from "@/components/interest-icon";

const interests: { label: string; glyph: InterestGlyph; background: string; foreground: string }[] = [
  { label: "Automatizaciones", glyph: "robot", background: "#c9ff3d", foreground: "#10100f" },
  { label: "Inteligencia artificial", glyph: "brain", background: "#ff6b4a", foreground: "#ffffff" },
  { label: "APIs", glyph: "browser", background: "#3155ff", foreground: "#ffffff" },
  { label: "Desarrollo web", glyph: "computer", background: "#10100f", foreground: "#c9ff3d" },
  { label: "Desarrollo Mobile", glyph: "phone", background: "#1834b8", foreground: "#ffffff" },
  { label: "Datos", glyph: "sheet", background: "#c9ff3d", foreground: "#10100f" },
  { label: "Ciberseguridad", glyph: "shield", background: "#3155ff", foreground: "#ffffff" },
  { label: "Cloud", glyph: "cloud", background: "#d7e4ff", foreground: "#1834b8" },
  { label: "Videojuegos", glyph: "joystick", background: "#ff6b4a", foreground: "#10100f" },
  { label: "Open source", glyph: "opensource", background: "transparent", foreground: "#3dae2b" },
];

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
        <p>¡Completá tu perfil y contactá con las empresas que te interesen!</p>
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
            <Field label="Email privado" placeholder="vos@email.com" type="email" />
            <Field label="LinkedIn" placeholder="linkedin.com/in/tu-perfil" type="url" />
            <div className="field">
              <span id="intereses-label">Intereses</span>
              <div className="tech-list" role="group" aria-labelledby="intereses-label">
                {interests.map((interest) => (
                  <label className="interest" key={interest.label}>
                    <input type="checkbox" name="intereses" value={interest.label} />
                    <span
                      className="interest__mark"
                      style={{
                        background: interest.background,
                        color: interest.foreground,
                        ["--interest-bg" as string]: interest.background === "transparent" ? "#f2f0e9" : interest.background,
                      }}
                    >
                      <InterestIcon glyph={interest.glyph} />
                    </span>
                    <span className="interest__name">{interest.label}</span>
                  </label>
                ))}
              </div>
            </div>
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

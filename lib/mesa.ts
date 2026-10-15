import { formTracks } from "@/content/tracks";

export const duplicateLinkedInMessage = "Ese LinkedIn ya está en la mesa.";
export const duplicateEmailMessage = "Ese email ya está en la mesa.";
export const saveErrorMessage = "No pudimos guardar. Intentá de nuevo.";
export const confirmedMessage = "Quedaron en la mesa.";

const linkedInPattern =
  /^https:\/\/www\.linkedin\.com\/(?:in|company)\/[A-Za-z0-9\-_.%]+(?:\/[A-Za-z0-9\-_.%]+)*\/?$/;

export type MesaField =
  | "compania"
  | "nombre"
  | "rol"
  | "email"
  | "linkedinUrl"
  | "sitio"
  | "track"
  | "mensaje";

export type MesaErrores = Partial<Record<MesaField, string>>;

export type MesaSubmission = {
  compania: string;
  nombre: string;
  rol: string;
  email: string;
  linkedinUrl: string;
  sitio: string | null;
  track: string;
  mensaje: string | null;
  publicarEnRed: boolean;
};

const fieldMessages: Record<MesaField, string> = {
  compania: "La compañía tiene que tener entre 2 y 80 caracteres.",
  nombre: "El nombre tiene que tener entre 2 y 80 caracteres.",
  rol: "El rol tiene que tener entre 2 y 80 caracteres.",
  email: "Ingresá un email válido.",
  linkedinUrl:
    "Usá un link https://www.linkedin.com/in/... o https://www.linkedin.com/company/...",
  sitio: "El sitio tiene que empezar con http:// o https://.",
  track: "Elegí un track.",
  mensaje: "El mensaje puede tener hasta 240 caracteres.",
};

export function trackIds() {
  return formTracks().map((track) => track.id);
}

export function canonicalLinkedIn(value: string) {
  const text = value.trim();
  if (!linkedInPattern.test(text)) return null;
  const url = new URL(text);
  const pathname = url.pathname.replace(/\/+$/, "").toLowerCase();
  return `https://www.linkedin.com${pathname}`;
}

export function honeypotFilled(input: unknown) {
  if (!input || typeof input !== "object") return false;
  const value = (input as Record<string, unknown>).empresa_web;
  return typeof value === "string" && value.trim().length > 0;
}

function requiredText(value: unknown, min: number, max: number) {
  if (typeof value !== "string") return null;
  const text = value.trim();
  if (text.length < min || text.length > max) return null;
  return text;
}

function emailText(value: unknown) {
  if (typeof value !== "string") return null;
  const text = value.trim().toLowerCase();
  if (text.length < 3 || text.length > 254) return null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) return null;
  return text;
}

function optionalSite(value: unknown) {
  if (value === undefined || value === null) return { ok: true as const, url: null };
  if (typeof value !== "string") return { ok: false as const };
  const text = value.trim();
  if (!text) return { ok: true as const, url: null };
  if (text.length > 300) return { ok: false as const };
  try {
    const url = new URL(text);
    if (url.protocol !== "http:" && url.protocol !== "https:") return { ok: false as const };
    if (!url.hostname) return { ok: false as const };
    return { ok: true as const, url: url.toString() };
  } catch {
    return { ok: false as const };
  }
}

function optionalMessage(value: unknown) {
  if (value === undefined || value === null) return { ok: true as const, text: null };
  if (typeof value !== "string") return { ok: false as const };
  const text = value.trim();
  if (!text) return { ok: true as const, text: null };
  if (text.length > 240) return { ok: false as const };
  return { ok: true as const, text };
}

export function validateMesaSubmission(
  input: unknown,
): { ok: true; value: MesaSubmission } | { ok: false; errores: MesaErrores } {
  const body = input && typeof input === "object" ? (input as Record<string, unknown>) : {};
  const errores: MesaErrores = {};
  const ids = trackIds();

  const compania = requiredText(body.compania, 2, 80);
  const nombre = requiredText(body.nombre, 2, 80);
  const rol = requiredText(body.rol, 2, 80);
  const email = emailText(body.email);
  const linkedinUrl =
    typeof body.linkedinUrl === "string" ? canonicalLinkedIn(body.linkedinUrl) : null;
  const sitio = optionalSite(body.sitio);
  const mensaje = optionalMessage(body.mensaje);
  const track = typeof body.track === "string" && ids.includes(body.track.trim()) ? body.track.trim() : null;

  if (!compania) errores.compania = fieldMessages.compania;
  if (!nombre) errores.nombre = fieldMessages.nombre;
  if (!rol) errores.rol = fieldMessages.rol;
  if (!email) errores.email = fieldMessages.email;
  if (!linkedinUrl) errores.linkedinUrl = fieldMessages.linkedinUrl;
  if (!sitio.ok) errores.sitio = fieldMessages.sitio;
  if (!track) errores.track = fieldMessages.track;
  if (!mensaje.ok) errores.mensaje = fieldMessages.mensaje;

  if (
    !compania ||
    !nombre ||
    !rol ||
    !email ||
    !linkedinUrl ||
    !sitio.ok ||
    !track ||
    !mensaje.ok
  ) {
    return { ok: false, errores };
  }

  return {
    ok: true,
    value: {
      compania,
      nombre,
      rol,
      email,
      linkedinUrl,
      sitio: sitio.url,
      track,
      mensaje: mensaje.text,
      publicarEnRed: body.publicarEnRed === true,
    },
  };
}

import fs from "node:fs";
import path from "node:path";
import { conexionesSeed } from "@/content/conexiones.seed";
import { timeZone } from "@/content/evento";
import type { PersonaPublica } from "@/content/types";

type StoredConnection = PersonaPublica & { publicarEnRed: boolean };

const filePath = path.join(process.cwd(), "data", "conexiones.json");

let memory: StoredConnection[] | null = null;

export function linkedinKey(value: string) {
  let url: URL;
  try {
    url = new URL(value.trim());
  } catch {
    return null;
  }

  if (url.protocol !== "https:" && url.protocol !== "http:") return null;

  const host = url.hostname.toLowerCase();
  if (host !== "linkedin.com" && !host.endsWith(".linkedin.com")) return null;
  if (url.pathname === "/" || url.pathname === "") return null;

  const pathname = url.pathname.replace(/\/+$/, "").toLowerCase();
  return `${host.replace(/^www\./, "")}${pathname}`;
}

function toPublic(record: PersonaPublica): PersonaPublica {
  const track = record.track?.trim();
  return {
    id: record.id,
    nombre: record.nombre,
    rol: record.rol,
    compania: record.compania,
    linkedinUrl: record.linkedinUrl,
    creadoEn: record.creadoEn,
    ...(track ? { track } : {}),
  };
}

function isStored(value: unknown): value is StoredConnection {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.id === "string" &&
    typeof record.nombre === "string" &&
    typeof record.rol === "string" &&
    typeof record.compania === "string" &&
    typeof record.linkedinUrl === "string" &&
    typeof record.creadoEn === "string" &&
    typeof record.publicarEnRed === "boolean" &&
    (record.track === undefined || typeof record.track === "string")
  );
}

function sanitize(record: StoredConnection): StoredConnection {
  const track = record.track?.trim();
  return {
    id: record.id,
    nombre: record.nombre,
    rol: record.rol,
    compania: record.compania,
    linkedinUrl: record.linkedinUrl,
    creadoEn: record.creadoEn,
    publicarEnRed: record.publicarEnRed,
    ...(track ? { track } : {}),
  };
}

function readAll() {
  if (memory) return memory;

  try {
    const raw = fs.readFileSync(filePath, "utf8");
    const parsed = JSON.parse(raw) as unknown;
    memory = Array.isArray(parsed) ? parsed.filter(isStored).map(sanitize) : [];
  } catch {
    memory = [];
  }

  return memory;
}

function writeAll(records: StoredConnection[]) {
  memory = records;
  try {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    const temporary = `${filePath}.${process.pid}.tmp`;
    fs.writeFileSync(temporary, JSON.stringify(records, null, 2));
    fs.renameSync(temporary, filePath);
  } catch {
    // El proceso sigue sirviendo la copia en memoria.
  }
}

function isPublished(record: StoredConnection) {
  return record.publicarEnRed && linkedinKey(record.linkedinUrl) !== null;
}

function takenKeys() {
  const keys = new Set<string>();
  for (const record of readAll()) {
    const key = linkedinKey(record.linkedinUrl);
    if (key) keys.add(key);
  }
  if (process.env.NODE_ENV === "production") return keys;

  for (const person of conexionesSeed) {
    const key = linkedinKey(person.linkedinUrl);
    if (key) keys.add(key);
  }
  return keys;
}

function nextId(records: StoredConnection[]) {
  const ids = new Set(records.map((record) => record.id));
  if (process.env.NODE_ENV !== "production") {
    for (const person of conexionesSeed) ids.add(person.id);
  }

  let sequence = 1;
  while (ids.has(`c_${String(sequence).padStart(2, "0")}`)) sequence += 1;
  return `c_${String(sequence).padStart(2, "0")}`;
}

function createdAt() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());

  const read = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "00";

  return `${read("year")}-${read("month")}-${read("day")}T${read("hour")}:${read("minute")}:${read("second")}-03:00`;
}

function readText(value: unknown, max: number) {
  if (typeof value !== "string") return null;
  const text = value.trim();
  if (!text || text.length > max) return null;
  return text;
}

export function listPublicConnections(): PersonaPublica[] {
  const stored = readAll().filter(isPublished).map(toPublic);
  if (process.env.NODE_ENV === "production") return stored;

  const seen = new Set(stored.map((person) => linkedinKey(person.linkedinUrl)).filter(Boolean));
  const seed = conexionesSeed.filter((person) => {
    const key = linkedinKey(person.linkedinUrl);
    return Boolean(key) && !seen.has(key);
  });

  return [...stored, ...seed].map(toPublic);
}

const invalidMessage = "Revisá los datos. La URL de LinkedIn tiene que ser válida.";

export function createConnection(
  input: unknown,
): { status: 201; person: PersonaPublica } | { status: 400 | 409; error: string } {
  if (!input || typeof input !== "object") return { status: 400, error: invalidMessage };

  const body = input as Record<string, unknown>;
  const nombre = readText(body.nombre, 80);
  const rol = readText(body.rol, 80);
  const compania = readText(body.compania, 80);
  const linkedinUrl = readText(body.linkedinUrl, 300);
  const track = body.track === undefined ? undefined : readText(body.track, 40);

  if (!nombre || !rol || !compania || !linkedinUrl || linkedinKey(linkedinUrl) === null) {
    return { status: 400, error: invalidMessage };
  }
  if (body.track !== undefined && !track) return { status: 400, error: invalidMessage };
  if (takenKeys().has(linkedinKey(linkedinUrl) as string)) {
    return { status: 409, error: "Este perfil de LinkedIn ya está en la red." };
  }

  const records = readAll();
  const person = toPublic({
    id: nextId(records),
    nombre,
    rol,
    compania,
    linkedinUrl,
    creadoEn: createdAt(),
    ...(track ? { track } : {}),
  });

  writeAll([...records, { ...person, publicarEnRed: true }]);
  return { status: 201, person };
}

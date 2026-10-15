import { Pool, type DatabaseError } from "pg";
import { conexionesSeed } from "@/content/conexiones.seed";
import type { PersonaPublica, TarjetaMesa } from "@/content/types";
import {
  canonicalLinkedIn,
  duplicateEmailMessage,
  duplicateLinkedInMessage,
  honeypotFilled,
  validateMesaSubmission,
  type MesaField,
} from "@/lib/mesa";

type StoredConnection = {
  id: string;
  compania: string;
  nombre: string;
  rol: string;
  email: string;
  linkedinUrl: string;
  sitio: string | null;
  track: string;
  mensaje: string | null;
  publicarEnRed: boolean;
  creadoEn: string;
};

type MemoryState = { records: StoredConnection[] };

const globalState = globalThis as unknown as {
  mesaMemory?: MemoryState;
  mesaPool?: Pool;
  mesaSchema?: Promise<void>;
};

const schemaSql = `
  CREATE TABLE IF NOT EXISTS conexiones (
    id text PRIMARY KEY,
    compania text NOT NULL,
    nombre text NOT NULL,
    rol text NOT NULL,
    email text NOT NULL UNIQUE,
    linkedin_url text NOT NULL UNIQUE,
    sitio text,
    track text NOT NULL,
    mensaje text,
    publicar_en_red boolean NOT NULL,
    creado_en timestamptz NOT NULL
  )
`;

function memory() {
  if (!globalState.mesaMemory) globalState.mesaMemory = { records: [] };
  return globalState.mesaMemory;
}

function usesPostgres() {
  return Boolean(process.env.POSTGRES_URL);
}

function getPool() {
  const connectionString = process.env.POSTGRES_URL;
  if (!connectionString) return null;
  if (!globalState.mesaPool) {
    globalState.mesaPool = new Pool({ connectionString, max: 3 });
  }
  return globalState.mesaPool;
}

async function ensureSchema(pool: Pool) {
  if (!globalState.mesaSchema) {
    globalState.mesaSchema = pool.query(schemaSql).then(() => undefined).catch((error: unknown) => {
      globalState.mesaSchema = undefined;
      throw error;
    });
  }
  await globalState.mesaSchema;
}

const crockford = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

function ulid() {
  let remainder = Date.now();
  let timePart = "";
  for (let index = 0; index < 10; index += 1) {
    timePart = crockford[remainder % 32] + timePart;
    remainder = Math.floor(remainder / 32);
  }

  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  let randomPart = "";
  for (const byte of bytes) randomPart += crockford[byte % 32];
  return `${timePart}${randomPart}`;
}

function seedRecord(person: PersonaPublica): StoredConnection {
  return {
    id: person.id,
    compania: person.compania,
    nombre: person.nombre,
    rol: person.rol,
    email: "",
    linkedinUrl: canonicalLinkedIn(person.linkedinUrl) ?? person.linkedinUrl,
    sitio: null,
    track: person.track?.trim() ?? "",
    mensaje: null,
    publicarEnRed: true,
    creadoEn: person.creadoEn,
  };
}

function seedRecords() {
  if (usesPostgres()) return [];
  return conexionesSeed.map(seedRecord);
}

function toPublic(record: StoredConnection): PersonaPublica {
  const track = record.track.trim();
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

function toCard(record: StoredConnection): TarjetaMesa {
  return {
    id: record.id,
    compania: record.compania,
    nombre: record.nombre,
    rol: record.rol,
    linkedinUrl: record.linkedinUrl,
    track: record.track,
    mensaje: record.mensaje,
  };
}

function byCreated(left: StoredConnection, right: StoredConnection) {
  return left.creadoEn.localeCompare(right.creadoEn) || left.id.localeCompare(right.id);
}

function mergeSeed(stored: StoredConnection[]) {
  const seen = new Set(
    stored
      .map((record) => canonicalLinkedIn(record.linkedinUrl))
      .filter((key): key is string => Boolean(key)),
  );
  const extras = seedRecords().filter((record) => {
    const key = canonicalLinkedIn(record.linkedinUrl);
    return key !== null && !seen.has(key);
  });
  return [...stored, ...extras].sort(byCreated);
}

function linkedInKey(value: string) {
  return canonicalLinkedIn(value);
}

type Occupied = { linkedIns: Set<string>; emails: Set<string> };

function occupiedFrom(records: StoredConnection[]): Occupied {
  const linkedIns = new Set<string>();
  const emails = new Set<string>();
  for (const record of records) {
    const key = linkedInKey(record.linkedinUrl);
    if (key) linkedIns.add(key);
    if (record.email) emails.add(record.email);
  }
  return { linkedIns, emails };
}

function isDatabaseError(error: unknown): error is DatabaseError {
  return Boolean(error && typeof error === "object" && "code" in error);
}

function isoTimestamp(value: unknown) {
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "string") {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) return parsed.toISOString();
  }
  return new Date().toISOString();
}

type ConnectionRow = {
  id: string;
  compania: string;
  nombre: string;
  rol: string;
  email?: string;
  linkedin_url: string;
  sitio: string | null;
  track: string;
  mensaje: string | null;
  publicar_en_red: boolean;
  creado_en: Date | string;
};

function rowToStored(row: ConnectionRow): StoredConnection {
  return {
    id: row.id,
    compania: row.compania,
    nombre: row.nombre,
    rol: row.rol,
    email: row.email ?? "",
    linkedinUrl: row.linkedin_url,
    sitio: row.sitio,
    track: row.track,
    mensaje: row.mensaje,
    publicarEnRed: row.publicar_en_red,
    creadoEn: isoTimestamp(row.creado_en),
  };
}

async function readStored() {
  const pool = getPool();
  if (!pool) return memory().records;

  await ensureSchema(pool);
  const result = await pool.query<ConnectionRow>(
    `SELECT id, compania, nombre, rol, email, linkedin_url, sitio, track, mensaje, publicar_en_red, creado_en
     FROM conexiones
     ORDER BY creado_en ASC, id ASC`,
  );
  return result.rows.map(rowToStored);
}

export async function listPublicConnections(): Promise<PersonaPublica[]> {
  const stored = (await readStored()).filter(
    (record) => record.publicarEnRed && linkedInKey(record.linkedinUrl) !== null,
  );
  return mergeSeed(stored).filter((record) => record.publicarEnRed).map(toPublic);
}

export async function listMesaCards(): Promise<TarjetaMesa[]> {
  const stored = await readStored();
  return mergeSeed(stored).map(toCard);
}

export type CreateConnectionResult =
  | { status: 200 }
  | { status: 201; tarjeta: TarjetaMesa; publicarEnRed: boolean }
  | { status: 400; errores: Partial<Record<MesaField, string>> }
  | { status: 409; error: string; campo: MesaField }
  | { status: 500 };

export async function createConnection(input: unknown): Promise<CreateConnectionResult> {
  if (honeypotFilled(input)) return { status: 200 };

  const parsed = validateMesaSubmission(input);
  if (!parsed.ok) return { status: 400, errores: parsed.errores };

  const submission = parsed.value;
  const pool = getPool();
  const occupied = occupiedFrom([...(pool ? await readStored() : memory().records), ...seedRecords()]);

  if (occupied.linkedIns.has(submission.linkedinUrl)) {
    return { status: 409, error: duplicateLinkedInMessage, campo: "linkedinUrl" };
  }
  if (occupied.emails.has(submission.email)) {
    return { status: 409, error: duplicateEmailMessage, campo: "email" };
  }

  const record: StoredConnection = {
    id: `c_${ulid()}`,
    compania: submission.compania,
    nombre: submission.nombre,
    rol: submission.rol,
    email: submission.email,
    linkedinUrl: submission.linkedinUrl,
    sitio: submission.sitio,
    track: submission.track,
    mensaje: submission.mensaje,
    publicarEnRed: submission.publicarEnRed,
    creadoEn: new Date().toISOString(),
  };

  if (!pool) {
    memory().records.push(record);
    return { status: 201, tarjeta: toCard(record), publicarEnRed: record.publicarEnRed };
  }

  try {
    await ensureSchema(pool);
    await pool.query(
      `INSERT INTO conexiones (
        id, compania, nombre, rol, email, linkedin_url, sitio, track, mensaje, publicar_en_red, creado_en
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [
        record.id,
        record.compania,
        record.nombre,
        record.rol,
        record.email,
        record.linkedinUrl,
        record.sitio,
        record.track,
        record.mensaje,
        record.publicarEnRed,
        record.creadoEn,
      ],
    );
  } catch (error) {
    if (isDatabaseError(error) && error.code === "23505") {
      const constraint = error.constraint ?? "";
      if (constraint.includes("email")) {
        return { status: 409, error: duplicateEmailMessage, campo: "email" };
      }
      return { status: 409, error: duplicateLinkedInMessage, campo: "linkedinUrl" };
    }
    return { status: 500 };
  }

  return { status: 201, tarjeta: toCard(record), publicarEnRed: record.publicarEnRed };
}

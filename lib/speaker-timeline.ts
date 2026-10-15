export const SLOT_MS = 30 * 60 * 1000;

const FIRST_START_MS = Date.parse("2026-10-14T17:00:00-03:00");

/** 16:45 ART: todavía no empezó ninguna charla. Belén (17:00) es la próxima. */
export const MOCK_EVENT_MS = Date.parse("2026-10-14T16:45:00-03:00");

export type TalkPhase = "past" | "current" | "next" | "later";

export function talkStartMs(index: number) {
  return FIRST_START_MS + index * SLOT_MS;
}

export function mockedNow() {
  return MOCK_EVENT_MS;
}

export function talkPhase(startMs: number, nowMs: number): TalkPhase {
  if (nowMs >= startMs + SLOT_MS) return "past";
  if (nowMs >= startMs) return "current";
  if (nowMs >= startMs - SLOT_MS) return "next";
  return "later";
}

export function formatTalkTime(startMs: number) {
  return new Intl.DateTimeFormat("es-AR", {
    timeZone: "America/Argentina/Buenos_Aires",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(startMs);
}

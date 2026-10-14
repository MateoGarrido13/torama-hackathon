export const SLOT_MS = 30 * 60 * 1000;

const FIRST_START_MS = Date.parse("2026-10-14T17:00:00-03:00");

/** 19:25 ART del 14 oct equivale a las 17:35, dentro de la segunda charla. */
const MOCK_REAL_MS = Date.parse("2026-10-14T19:25:00-03:00");
const MOCK_EVENT_MS = Date.parse("2026-10-14T17:35:00-03:00");

export type TalkPhase = "past" | "current" | "next" | "later";

export function talkStartMs(index: number) {
  return FIRST_START_MS + index * SLOT_MS;
}

export function mockedNow(realNow = Date.now()) {
  return MOCK_EVENT_MS + (realNow - MOCK_REAL_MS);
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

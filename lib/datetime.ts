import { timeZone } from "@/content/evento";

const monthLabels = [
  "ene",
  "feb",
  "mar",
  "abr",
  "may",
  "jun",
  "jul",
  "ago",
  "sep",
  "oct",
  "nov",
  "dic",
] as const;

function zonedParts(iso: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    day: "numeric",
    month: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(iso));

  const read = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";

  const monthIndex = Number(read("month")) - 1;

  return {
    day: read("day"),
    month: monthLabels[monthIndex] ?? "",
    year: read("year"),
    hour: read("hour").padStart(2, "0"),
    minute: read("minute").padStart(2, "0"),
  };
}

export function formatDay(iso: string) {
  const { day, month } = zonedParts(iso);
  return `${day} ${month}`;
}

export function formatDayNumber(iso: string) {
  return zonedParts(iso).day.padStart(2, "0");
}

export function formatMonthYear(iso: string) {
  const { month, year } = zonedParts(iso);
  return `${month} ${year}`.toUpperCase();
}

export function formatOpening(iso: string) {
  const { day, month, year, hour, minute } = zonedParts(iso);
  return `${day} ${month} ${year}, ${hour}:${minute} (GMT-3)`;
}

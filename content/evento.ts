import type { Jornada, NavItem } from "@/content/types";

export const timeZone = "America/Argentina/Buenos_Aires";

export const event = {
  name: "Tandil Tech Week",
  claim: "Dos jornadas, una red de gente que se suma en vivo",
  place: "Tandil",
  badge: "Coming Soon",
  datesLabel: "14 y 15 oct",
  footerDate: "14 y 15 de octubre de 2026",
  inscriptionsOpenAt: "2026-09-17T19:00:00-03:00",
  social: {
    handle: "@tandiltechweek",
    instagram: "https://www.instagram.com/tandiltechweek/",
    x: "https://x.com/tandiltechweek",
  },
};

export const navItems: NavItem[] = [
  { href: "#agenda", label: "Agenda" },
  { href: "#speakers", label: "Speakers" },
  { href: "#acompanan", label: "Acompañan" },
];

/** 09:00 ART mientras la hora de inicio de cada jornada no esté confirmada. */
const defaultStart = "T09:00:00-03:00";

export const jornadas: Jornada[] = [
  {
    id: "hacking-day",
    nombre: "Hacking Day",
    inicio: `2026-10-14${defaultStart}`,
    fin: "2026-10-15T00:00:00-03:00",
    sede: "Campus UNICEN",
    track: "",
    descripcion: "",
  },
  {
    id: "startup-day",
    nombre: "Startup Day",
    inicio: `2026-10-15${defaultStart}`,
    fin: "2026-10-16T00:00:00-03:00",
    sede: "Distrito Avellaneda",
    track: "",
    descripcion: "",
  },
];

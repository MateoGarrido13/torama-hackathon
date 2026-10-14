import type { PersonaPublica } from "@/content/types";

/** Cinco personas ficticias, todas unidas por compañía o track. */
export const conexionesSeed: PersonaPublica[] = [
  {
    id: "c_01",
    nombre: "Ada Gómez",
    rol: "Engineer",
    compania: "Picante",
    linkedinUrl: "https://www.linkedin.com/in/ada-gomez",
    track: "software",
    creadoEn: "2026-09-20T18:04:00-03:00",
  },
  {
    id: "c_02",
    nombre: "Bruno Díaz",
    rol: "Designer",
    compania: "Picante",
    linkedinUrl: "https://www.linkedin.com/in/bruno-diaz",
    track: "design",
    creadoEn: "2026-09-21T11:15:00-03:00",
  },
  {
    id: "c_03",
    nombre: "Carla Núñez",
    rol: "Engineer",
    compania: "Relaw",
    linkedinUrl: "https://www.linkedin.com/in/carla-nunez",
    track: "software",
    creadoEn: "2026-09-21T16:40:00-03:00",
  },
  {
    id: "c_04",
    nombre: "Diego Paz",
    rol: "Product Manager",
    compania: "Relaw",
    linkedinUrl: "https://www.linkedin.com/in/diego-paz",
    track: "producto",
    creadoEn: "2026-09-22T09:05:00-03:00",
  },
  {
    id: "c_05",
    nombre: "Elena Ruiz",
    rol: "Marketing",
    compania: "Paisanos",
    linkedinUrl: "https://www.linkedin.com/in/elena-ruiz",
    track: "design",
    creadoEn: "2026-09-22T13:22:00-03:00",
  },
];

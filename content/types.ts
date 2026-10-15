export type Jornada = {
  id: "hacking-day" | "startup-day";
  nombre: string;
  inicio: string;
  fin: string;
  sede: string;
  track: string;
  descripcion: string;
};

export type PersonaPublica = {
  id: string;
  nombre: string;
  rol: string;
  compania: string;
  linkedinUrl: string;
  track?: string;
  creadoEn: string;
};

export type TarjetaMesa = {
  id: string;
  compania: string;
  nombre: string;
  rol: string;
  linkedinUrl: string;
  track: string;
  mensaje: string | null;
};

export type Speaker = {
  id: string;
  nombre: string;
  foto: string;
};

export type Track = {
  id: string;
  nombre: string;
};

export type Sponsor = {
  id: string;
  nombre: string;
  url: string;
  logo: string;
  width: number;
  height: number;
};

export type NavItem = {
  href: string;
  label: string;
};

import type { Sponsor } from "@/content/types";

const source: Sponsor[] = [
  {
    id: "picante",
    nombre: "Picante",
    url: "https://www.picante.fund/",
    logo: "/sponsors/picante.png",
    width: 262,
    height: 77,
  },
  {
    id: "geonosis",
    nombre: "Geonosis",
    url: "https://geonosisgroup.com/",
    logo: "/sponsors/geonosis.png",
    width: 282,
    height: 77,
  },
  {
    id: "hacktandil",
    nombre: "HackTandil",
    url: "https://www.hacktandil.org/",
    logo: "/sponsors/hacktandil.png",
    width: 237,
    height: 107,
  },
  {
    id: "relaw",
    nombre: "Relaw",
    url: "https://www.relaw.io/",
    logo: "/sponsors/relaw.png",
    width: 241,
    height: 67,
  },
  {
    id: "fardo",
    nombre: "Fardo",
    url: "https://www.heyfardo.com/",
    logo: "/sponsors/fardo.png",
    width: 187,
    height: 82,
  },
  {
    id: "paisanos",
    nombre: "Paisanos",
    url: "https://www.paisanos.io/",
    logo: "/sponsors/paisanos.png",
    width: 310,
    height: 72,
  },
];

export const sponsors = source.filter((sponsor) => sponsor.url.trim().length > 0);

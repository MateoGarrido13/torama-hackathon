# Contexto del producto

Sitio de **Tandil Tech Week**: 14 y 15 de octubre. Dos jornadas, una red de gente que se suma en vivo, y una página que se puede deployar en Vercel.

Estas specs cubren las features 1 a 7 de `lista_ideas.md`. El resto del sitio ya está delineado ahí y estas features se apoyan en esa estructura.

## Stack

| Capa | Elección |
| --- | --- |
| App | Next.js (App Router), deploy en Vercel |
| 3D | React Three Fiber, solo en cliente (`"use client"`) |
| Contenido editorial | Archivos en `content/` versionados en el repo |
| Envíos del formulario | Persistencia en el servidor (ver spec 05) |
| Zona horaria | `America/Argentina/Buenos_Aires` (GMT-3) |

## Mapa del sitio

| Sección | Ancla | Qué muestra |
| --- | --- | --- |
| Nav | — | Agenda, Speakers, Organizan, Acompañan, Cronograma |
| Hero | — | 14 y 15 oct, título, claim, marquee de tracks, badge Coming Soon |
| Jornadas | `#agenda` | Hacking Day (14 oct, campus UNICEN) y Startup Day (15 oct, Distrito Avellaneda) |
| Speakers | `#speakers` | Spec 02 |
| Organizan | `#organizan` | Picante, Relaw, Paisanos, HackTandil, Geonosis, Fardo |
| Acompañan | `#acompanan` | Spec 04 |
| Inscripciones | `#inscripciones` | Apertura 17 sep 2026 19:00 (GMT-3), countdown de apertura, CTA a redes |
| Red | `#red` | Spec 01 |
| Mesa | `#mesa` | Spec 05 |
| Streaming | `#en-vivo` | Spec 07 |
| Footer | — | Instagram y X `@tandiltechweek`, fecha y lugar (Tandil) |

El temporizador del próximo evento (spec 03) vive en el hero. Los efectos de música y de scroll (spec 06) cruzan toda la página.

## Hitos de tiempo

| Instante | Qué pasa |
| --- | --- |
| 17 sep 2026 19:00 ART | Abren inscripciones. El countdown de `#inscripciones` llega a cero y pasa a “Inscripciones abiertas”. |
| 14 oct 2026 00:00 ART | Empieza la ventana de Hacking Day. |
| 15 oct 2026 00:00 ART | Empieza la ventana de Startup Day. |
| 16 oct 2026 00:00 ART | El evento terminó. |

La hora de inicio de cada jornada, si no está confirmada, se toma como 09:00 ART y queda en `content/evento.ts` para cambiarla sin tocar componentes.

## Datos compartidos

```ts
type Jornada = {
  id: "hacking-day" | "startup-day";
  nombre: string;
  inicio: string; // ISO con offset -03:00
  fin: string;
  sede: string;
  track: string;
  descripcion: string;
};

type PersonaPublica = {
  id: string;
  nombre: string;
  rol: string;
  compania: string;
  linkedinUrl: string;
  track?: string;
  creadoEn: string;
};
```

`PersonaPublica` es lo único que la red y la mesa pueden mostrar. El email no sale de este tipo.

## Reglas transversales

- Links externos abren en pestaña nueva con `rel="noopener noreferrer"`.
- Toda animación respeta `prefers-reduced-motion: reduce`.
- El audio no arranca solo. Hace falta un gesto de la persona.
- No se lee el perfil de LinkedIn en tiempo real ni se hotlinkea su CDN. Las fotos de speakers son assets del repo. El link a LinkedIn es solo una URL que la persona cargó.
- Textos de interfaz en español.
- Mobile primero. La red 3D tiene un modo táctil usable en un teléfono.

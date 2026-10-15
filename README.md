# Tandil Tech Week

Tandil Tech Week es un encuentro de dos jornadas en Tandil, el **14 y 15 de octubre de 2026**. El 14 es el Hacking Day, en el campus de la UNICEN. El 15 es el Startup Day, en Distrito Avellaneda. La zona horaria del sitio es `America/Argentina/Buenos_Aires`.

El claim del evento: *Dos jornadas, una red de gente que se suma en vivo.*

Este repositorio es el sitio de ese evento. Acá están el código de la página, el contenido editorial y la especificación de cada parte.

El sitio: [https://torama-hackathon.vercel.app](https://torama-hackathon.vercel.app)

## Qué muestra el sitio

- **Hero y agenda.** Fechas, el claim y las dos jornadas, con una cuenta regresiva hacia la próxima.
- **Speakers.** Perfiles con foto y salida a LinkedIn.
- **Sponsors.** Cinta de quienes acompañan el evento, con link al sitio de cada uno.
- **Inscripciones.** Cuenta regresiva hasta la apertura (17 de septiembre de 2026, 19:00) y después el aviso de que están abiertas.
- **Mesa de trabajo.** Las compañías de software se anotan con un formulario. El email se guarda y no se publica.
- **Red de conexiones.** Grafo 3D con quienes autorizaron aparecer. Tocar un nodo abre su LinkedIn. Los nodos nuevos entran a medida que llegan envíos.
- **Streaming.** Bloque en vivo embebido en la página.
- **Footer.** Instagram y X de `@tandiltechweek`, fecha y lugar.

Links, formularios e iframes van en HTML. La escena 3D no los contiene.

## Propósito del repositorio

El repo no es solo la app desplegada. Cada idea nace en `lista_ideas.md` y se especifica en su carpeta de `specs/` antes de implementarse. El índice está en [`specs/README.md`](specs/README.md). El contexto común del producto está en [`specs/00-contexto.md`](specs/00-contexto.md). Los textos, horarios, speakers y sponsors que se muestran en la página viven en `content/` y se versionan con el código.

| Feature | Carpeta |
| --- | --- |
| Red de conexiones | `specs/01-red-de-conexiones/` |
| Speakers | `specs/02-speakers/` |
| Temporizador | `specs/03-temporizador/` |
| Sponsors | `specs/04-sponsors/` |
| Formulario mesa | `specs/05-formulario-mesa/` |
| Efectos | `specs/06-efectos/` |
| Streaming | `specs/07-streaming/` |

El orden de implementación está en `specs/README.md`: primero el contenido y el layout, después temporizador y speakers, sponsors, el formulario (que crea la API), la red (que la consume), el streaming y, al final, los efectos de scroll y audio.

## Tecnologías

| Capa | Elección |
| --- | --- |
| App | [Next.js](https://nextjs.org/) 16 (App Router), React 19, TypeScript |
| Estilos | Tailwind CSS 4 |
| Escena 3D | React Three Fiber, drei, Three.js y d3-force-3d. Corre solo en el cliente |
| Contenido | Archivos versionados en `content/` |
| Hosting | Vercel |

## Metodología y agentes

El trabajo está partido por feature. La regla de los agentes está en `.cursor/rules/proyecto.mdc`:

- Una sesión de agente cubre una sola feature. No arranca la siguiente ni abre su carpeta.
- Antes de codear, el agente lee solo `specs/<feature>/`. No lee el resto de `specs/`.
- Abre `specs/00-contexto.md` únicamente si la spec de esa feature lo cita.
- Si falta un texto, un nombre, un sponsor o un horario, lo propone en el chat y espera confirmación antes de escribirlo en el repo.
- Textos de interfaz en español. Identificadores de código en inglés.

## Correrlo en local

Requisitos: Node.js 20.9 o superior y npm.

```bash
npm install
npm run dev
```

La app queda en [http://localhost:3000](http://localhost:3000).

Otros comandos:

```bash
npm run lint    # ESLint
npm run build   # build de producción
npm run start   # sirve el build (después de npm run build)
```

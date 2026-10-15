# Tandil Tech Week

Sitio del evento del **14 y 15 de octubre de 2026** en Tandil. Reúne agenda, speakers, sponsors, streaming, un temporizador de la próxima jornada y una red de conexiones que crece con quienes se suman desde el formulario de la mesa.

El claim del sitio: *Dos jornadas, una red de gente que se suma en vivo.*

## Qué hace

- **Hero y agenda.** Hacking Day (14 oct, campus UNICEN) y Startup Day (15 oct, Distrito Avellaneda), con cuenta regresiva a la próxima jornada.
- **Speakers y sponsors.** Perfiles con foto y salida a LinkedIn; cinta de sponsors con link a su sitio.
- **Mesa de trabajo.** Las compañías de software se anotan con un formulario. El email se guarda y no se publica.
- **Red de conexiones.** Grafo 3D con quienes autorizaron aparecer. Tocar un nodo abre su LinkedIn. Los nodos nuevos entran a medida que llegan envíos.
- **Streaming.** Bloque en vivo embebido en la página.

Zona horaria: `America/Argentina/Buenos_Aires`.

## Tecnologías

| Capa | Elección |
| --- | --- |
| App | [Next.js](https://nextjs.org/) 16 (App Router), React 19, TypeScript |
| Estilos | Tailwind CSS 4 |
| Escena 3D | React Three Fiber, drei, Three.js y d3-force-3d. Corre solo en el cliente |
| Persistencia | Postgres (`pg`) cuando hay `POSTGRES_URL`. Sin esa variable, los envíos viven en memoria del proceso |
| Contenido | Archivos versionados en `content/` |
| Hosting | Vercel |

Links, formularios e iframes van en HTML. La escena 3D no los contiene.

## Cómo trabaja el equipo

Cada feature nace en `lista_ideas.md` y se especifica en su carpeta de `specs/`. El índice está en [`specs/README.md`](specs/README.md). El contexto común del producto está en [`specs/00-contexto.md`](specs/00-contexto.md).

| Feature | Carpeta |
| --- | --- |
| Red de conexiones | `specs/01-red-de-conexiones/` |
| Speakers | `specs/02-speakers/` |
| Temporizador | `specs/03-temporizador/` |
| Sponsors | `specs/04-sponsors/` |
| Formulario mesa | `specs/05-formulario-mesa/` |
| Efectos | `specs/06-efectos/` |
| Streaming | `specs/07-streaming/` |

Los agentes de Cursor implementan contra esas specs, con la regla de `.cursor/rules/proyecto.mdc`:

- Una sesión de agente cubre una sola feature. No abre la carpeta de la siguiente.
- Antes de codear, el agente lee solo `specs/<feature>/`. Abre `specs/00-contexto.md` únicamente si esa spec lo cita.
- Si falta un texto, un nombre, un sponsor o un horario, el agente lo propone en el chat y espera confirmación antes de escribirlo en el repo.
- Textos de interfaz en español. Identificadores de código en inglés.

## Correrlo en local

Requisitos: Node.js 20.9 o superior y npm.

```bash
npm install
npm run dev
```

La app queda en [http://localhost:3000](http://localhost:3000).

Sin `POSTGRES_URL`, el formulario guarda los envíos en la memoria del proceso de desarrollo y la red muestra el seed de `content/conexiones.seed.ts`. Ese modo sirve para ver la interfaz. Los datos se pierden al reiniciar el servidor.

Para persistir como en producción, definí la variable y volvé a levantar el dev server:

```bash
POSTGRES_URL="postgresql://usuario:clave@localhost:5432/tandil_tech_week" npm run dev
```

La tabla `conexiones` se crea sola en el primer uso.

Otros comandos:

```bash
npm run lint    # ESLint
npm run build   # build de producción
npm run start   # sirve el build (después de npm run build)
```

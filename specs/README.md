# Specs — features 1 a 7

Especificación de las ideas en `lista_ideas.md`. El contexto común está en [00-contexto.md](./00-contexto.md). El front es React Three Fiber (la página y la animación de la red). El hosting es Vercel.

| # | Feature | Spec |
| --- | --- | --- |
| 1 | Red de conexiones. Tocar un nodo abre LinkedIn. Los nodos se suman con el formulario. | [00-RED_DE_CONEXIONES-especificacion.md](./01-red-de-conexiones/00-RED_DE_CONEXIONES-especificacion.md) |
| 2 | Speakers con foto y link a LinkedIn. | [00-SPEAKERS-especificacion.md](./02-speakers/00-SPEAKERS-especificacion.md) |
| 3 | Temporizador de la próxima jornada. | [00-TEMPORIZADOR-especificacion.md](./03-temporizador/00-TEMPORIZADOR-especificacion.md) |
| 4 | Sponsors en cinta continua, con salida a su sitio. | [00-SPONSORS-especificacion.md](./04-sponsors/00-SPONSORS-especificacion.md) |
| 5 | Formulario como mesa de trabajo para compañías de software. | [00-FORMULARIO_MESA-especificacion.md](./05-formulario-mesa/00-FORMULARIO_MESA-especificacion.md) |
| 6 | Música ambiente y efectos al bajar en vertical. | [00-EFECTOS-especificacion.md](./06-efectos/00-EFECTOS-especificacion.md) |
| 7 | Streaming en vivo. | [00-STREAMING-especificacion.md](./07-streaming/00-STREAMING-especificacion.md) |

## Orden de implementación

1. `content/evento.ts`, `content/tracks.ts` y el layout de secciones (contexto).
2. Spec 03 y spec 02, porque no dependen de backend.
3. Spec 04.
4. Spec 05, que crea la API.
5. Spec 01, que consume esa API.
6. Spec 07.
7. Spec 06 al final, porque envuelve el scroll y el audio de lo ya armado.

## Decisiones que atan las specs

- El countdown de inscripciones (17 sep 2026 19:00) y el temporizador de jornadas son dos relojes distintos.
- La mesa guarda el email y no lo expone. La red solo muestra quien tildó “publicar”.
- Las fotos de speakers son archivos del repo. No se piden a LinkedIn en runtime.
- El scroll vertical no secuestra la rueda. El audio no arranca solo.

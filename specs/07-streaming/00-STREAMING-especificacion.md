# 07 — Streaming en vivo

## Problema

Durante las jornadas la actividad ocurre fuera del sitio. Quien no está en la sede necesita ver la transmisión en la misma página.

## Resultado

Una sección `#en-vivo` que muestra el player cuando hay señal configurada y, el resto del tiempo, el anuncio de la próxima jornada.

## Alcance

- Embed 16:9 configurable.
- Tres estados: espera, en vivo, terminado.
- Link directo a la transmisión por si el embed falla.
- Pausa del ambiente sonoro cuando el player empieza (spec 06).

## Fuera de alcance

- Emitir el video desde este servidor.
- Chat, DVR propio o multi-cámara.
- Elegir entre varias transmisiones en la UI. Hay una URL activa en el contenido.

## Historia

Como visitante remoto, quiero abrir el sitio durante el evento y ver la transmisión sin buscar el link en redes.

## Datos

En `content/evento.ts`:

```ts
type Streaming = {
  titulo: string;
  // URL de embed (YouTube o Twitch). Vacía = todavía no hay señal.
  embedUrl: string;
  // URL para abrir la transmisión afuera.
  verUrl: string;
};
```

El estado no se infiere solo del reloj. Se cruza el reloj con la URL:

| embedUrl | Reloj | Estado |
| --- | --- | --- |
| vacía | cualquier momento antes del fin | espera |
| con valor | dentro de Hacking Day o Startup Day | en vivo |
| con valor | fuera de esas ventanas | espera, y el player no se monta |
| cualquiera | después del fin de Startup Day | terminado |

Montar el iframe solo en “en vivo” evita que un video embebido suene o consuma datos antes de tiempo.

## Comportamiento

1. Espera: título “En vivo”, texto “La transmisión aparece acá cuando empiece la jornada”, y el temporizador de la spec 03 en su estado actual. Si `verUrl` existe, un link secundario “Abrir la transmisión”.
2. En vivo: iframe con `embedUrl`, `title` igual a `titulo`, `allow="autoplay; encrypted-media; picture-in-picture"`, `allowfullscreen`. El borde del player ocupa el ancho de la sección.
3. Al primer `play` detectable no confiamos en el iframe cross-origin. Junto al player hay un botón “Ya estoy mirando” que dispara `ttw-stream-play` para apagar el ambiente. Además, montar el iframe también dispara ese evento una vez, porque el embed puede arrancar con sonido según la URL.
4. Terminado: “La transmisión de esta edición terminó” y no hay iframe.
5. Nav: se suma el ítem “En vivo” apuntando a `#en-vivo`.

## UI

- El player mantiene relación 16:9. El ancho es el de la sección y el alto sale de esa proporción.
- En mobile el player llega de borde a borde del padding de la sección.
- El iframe tiene un nombre accesible.

## Criterios de aceptación

1. Sin `embedUrl`, no hay iframe en el DOM y se ve el texto de espera.
2. Con `embedUrl` y la fecha dentro de una jornada, el iframe apunta a esa URL.
3. Con `embedUrl` y la fecha fuera de las jornadas, el iframe no está montado.
4. Después del fin del evento se ve el estado terminado, aunque `embedUrl` siga cargada.
5. Entrar a la sección en vivo pausa el ambiente de la spec 06.
6. “Abrir la transmisión” sale a `verUrl` en pestaña nueva.
7. El ítem de nav “En vivo” scrollea a la sección.

## Dependencias

- Spec 03 para el copy de espera, leyendo `content/evento.ts`.
- Spec 06 para el evento `ttw-stream-play`.

## Casos borde

- Embed que el browser bloquea: sigue visible el link “Abrir la transmisión”.
- `verUrl` vacía en espera: no se muestra ese link. El bloque de espera igual se entiende.

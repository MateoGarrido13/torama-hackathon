# 06 — Efectos de música y de scroll vertical

## Problema

La página tiene que sentirse como un recorrido hacia abajo, con una capa de sonido del evento, sin romper la lectura ni el acceso.

## Resultado

Un ambiente sonoro que la persona enciende, y transiciones verticales al bajar por las secciones. El scroll sigue siendo el nativo del browser. El front es React Three Fiber, hosteado en Vercel: el revelado de secciones es de la página y la inclinación de cámara es la de la red.

## Alcance

- Un loop de audio, control global de play/pausa.
- Revelado y desplazamiento vertical de las secciones al entrar en viewport.
- La cámara de la red (spec 01) puede inclinarse un poco con el scroll de esa sección.
- Respeto de `prefers-reduced-motion` y de las reglas de autoplay.

## Fuera de alcance

- Scroll que secuestra la rueda o impone una sección por gesto.
- Visualizador de audio en 3D.
- Playlist, varias pistas o sync con el streaming.
- Música que suena sola al cargar.

## Historia

Como visitante, quiero bajar por el sitio y sentir el ritmo del evento, y poder apagar el sonido cuando quiero escuchar otra cosa.

## Música

1. Asset único en `/public/audio/ambiente.mp3`, loop, sin voz, volumen inicial 0.35.
2. Control fijo, esquina inferior derecha: “Sonido” / “Silencio”. Es un botón, no un rango.
3. El primer play ocurre solo después de click o tap en ese botón.
4. La preferencia se guarda en `sessionStorage` (`ttw-audio=on|off`). Al recargar en la misma pestaña, si quedó `on`, se intenta continuar. Si el browser bloquea el play sin gesto, el botón vuelve a “Sonido” y no hay error visible.
5. Al ocultar la pestaña (`visibilityState = hidden`), el audio se pausa. Al volver, sigue solo si estaba en `on`.
6. Si la persona abre el streaming (spec 07) y le da play al player, el ambiente se pausa y el botón pasa a “Sonido”. No se reanuda solo.

## Scroll vertical

1. Cada sección principal (hero, jornadas, speakers, organizan, mesa, red, acompañan, inscripciones, streaming) entra desde 24px más abajo y con opacidad 0, y termina en su lugar al cruzar el 20% del viewport. Duración 500ms, ease-out. Una sola vez por sección y por carga.
2. El hero no espera: es visible en el primer paint.
3. Dentro de `#red`, el scroll de la página mapea un rango chico de inclinación de cámara (máximo 8 grados). Orbitar con el puntero sigue disponible y pisa esa inclinación mientras el puntero está abajo.
4. Con `prefers-reduced-motion: reduce`: sin translate, sin fade, cámara fija. El botón de sonido permanece.

## UI

- El botón de sonido queda fijo, a 16px del borde inferior derecho, con área de toque de 44px. Queda por encima del contenido y no cubre el botón de envío de la mesa ni los links del footer: en esas dos zonas el margen inferior de la página reserva al menos 72px.
- El botón tiene `aria-pressed`.

## Criterios de aceptación

1. Al cargar, no hay audio.
2. Activar “Sonido” empieza el loop. Activar “Silencio” lo corta.
3. Cambiar de pestaña pausa el audio.
4. Dar play al stream deja el ambiente en silencio.
5. Bajar por la página mueve cada sección una vez, en vertical. La rueda del mouse nunca queda capturada: se puede llegar al footer de un tirón.
6. Con motion reducido, las secciones están en su lugar desde el primer frame y la red no inclina la cámara por scroll.
7. El botón se puede operar con teclado.

## Dependencias

- Spec 01 expone un método para inclinar la cámara. Si la red está en fallback sin WebGL, ese método no existe y el scroll de la sección no hace nada extra.
- Spec 07 avisa play del player por un evento de ventana `ttw-stream-play`. El botón de sonido lo escucha.

## Casos borde

- Archivo de audio ausente: el botón no se renderiza.
- Autoplay policy rechaza el resume al volver a la pestaña: el botón muestra “Sonido”.

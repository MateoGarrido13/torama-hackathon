# 02 — Speakers

## Problema

`#speakers` hoy es un placeholder de “próximamente nuevas voces”. El bloque tiene que mostrar a quienes hablan, con su foto y un salto a LinkedIn.

## Resultado

Fila de cards de los seis speakers confirmados. Cada card es la foto, con el nombre y el apellido en negrita encima. La fila se desliza sola hacia la izquierda. Rol, charla y link a LinkedIn se muestran cuando ese dato está cargado. Si la lista está vacía, se mantiene el placeholder.

## Alcance

- Datos en `content/speakers.ts`.
- Foto servida desde `/public/speakers/`, usada con `next/image`.
- Card: la foto ocupa la card y el nombre y el apellido van en negrita sobre la imagen.
- La fila se desplaza sola hacia la izquierda, en bucle.
- Rol, charla (si hay) y link a LinkedIn cuando el dato está cargado.
- Placeholder cuando la lista está vacía.

## Fuera de alcance

- Scraping o API de LinkedIn para bajar la foto.
- Alta de speakers desde el formulario de la mesa.
- Filtros, búsqueda o paginado.

## Historia

Como visitante, quiero ver quién habla y abrir su LinkedIn, para reconocer a la persona antes del evento.

## Comportamiento

1. Si `speakers.length === 0`, el bloque muestra el título “Speakers” y la línea “Próximamente nuevas voces”.
2. Si hay al menos uno, desaparece esa línea y se renderiza la fila de cards.
3. La fila se mueve sola hacia la izquierda, de forma continua. Al salir una card por la izquierda, vuelve a entrar por la derecha, sin corte ni salto.
4. El nombre y el apellido se leen en negrita, superpuestos a la foto, dentro de la card.
5. Si hay `linkedinUrl`, toda la card es un link a esa URL, no solo un ícono. Si no hay, la card no es clickeable.
6. La foto usa la relación de aspecto 1:1, recorte centrado. Si el archivo no carga, se ve la inicial del nombre sobre un fondo sólido, y el nombre en negrita sigue encima.
7. Rol y charla solo ocupan una línea cuando el campo tiene texto. No tapan el nombre.

## Datos

```ts
type Speaker = {
  id: string;
  nombre: string;
  rol?: string;
  charla?: string;
  linkedinUrl?: string;
  foto: string; // ruta en /public, ej. "/speakers/belen_gonzalez.png"
};
```

La foto la exporta el equipo y la commitea en `public/speakers/`. El campo no acepta una URL de `media.licdn.com`.

### Nómina

Sale de los archivos `nombre_apellido.png` que ya están en `public/speakers/`. Es el mismo listado que en el contexto. `content/speakers.ts` usa este orden:

| id | nombre | foto |
| --- | --- | --- |
| `belen-gonzalez` | Belén González | `/speakers/belen_gonzalez.png` |
| `federico-ades` | Federico Ades | `/speakers/federico_ades.png` |
| `juan-caballero` | Juan Caballero | `/speakers/juan_caballero.png` |
| `nicolas-bayerque` | Nicolás Bayerque | `/speakers/nicolas_bayerque.png` |
| `nicolas-seguro` | Nicolás Seguro | `/speakers/nicolas_seguro.png` |
| `renzo-battaglia` | Renzo Battaglia | `/speakers/renzo_battaglia.png` |

`rol`, `charla` y `linkedinUrl` no vienen en los archivos. Quedan sin valor hasta que se confirmen.

## UI

- Ancla `#speakers`, alcanzable desde el nav.
- Fila horizontal de cards. En cada card la foto llena el recuadro y el nombre y el apellido van en negrita sobre la imagen.
- La fila se desliza sola hacia la izquierda. No hay flechas ni paginado.
- Orden: el del array en `content/speakers.ts`. El bucle respeta ese orden.
- Con `prefers-reduced-motion: reduce`, la fila no se anima y se recorre con scroll horizontal.

## Criterios de aceptación

1. Lista vacía: se lee “Próximamente nuevas voces” y no hay cards rotas.
2. Con la nómina cargada se ven las fotos y, en negrita sobre cada imagen, estos nombres: Belén González, Federico Ades, Juan Caballero, Nicolás Bayerque, Nicolás Seguro, Renzo Battaglia.
3. La fila avanza sola hacia la izquierda y el recorrido se repite sin corte.
4. Una card con `linkedinUrl` abre esa URL en pestaña nueva. Una card sin URL no navega.
5. Una ruta de foto inexistente muestra la inicial, no un ícono de imagen rota del browser. El nombre en negrita sigue visible.
6. El nav “Speakers” scrollea a `#speakers`.
7. Con `prefers-reduced-motion: reduce`, las cards no se mueven solas.

## Dependencias

Ninguna con las otras seis features. Comparte el patrón de link externo del contexto.

## Cronograma
Simular una linea de tiempo que comienza a las 17:00HS con un primer speaker y continuar con los siguientes cada 1hs

## Casos borde

- `rol` o `charla` ausentes: la card no reserva una línea vacía. El nombre en negrita sobre la foto se mantiene.
- `linkedinUrl` ausente: la card muestra foto y nombre, y no es un link.
- Nombre de una sola palabra: la inicial es esa letra y ese texto va en negrita sobre la imagen.
- Un solo speaker: la card igual se desliza en bucle hacia la izquierda.
- `prefers-reduced-motion: reduce`: no hay desplazamiento automático. La fila queda quieta y se puede recorrer a mano.

# 02 — Speakers

## Problema

`#speakers` hoy es un placeholder de “próximamente nuevas voces”. El bloque tiene que mostrar a quienes hablan, con su foto y un salto a LinkedIn.

## Resultado

Grilla de speakers con foto, nombre, rol y link a LinkedIn. Si todavía no hay speakers cargados, se mantiene el placeholder.

## Alcance

- Datos en `content/speakers.ts`.
- Foto servida desde `/public/speakers/`, usada con `next/image`.
- Card con nombre, rol, charla (si hay) y link “Ver en LinkedIn”.
- Placeholder cuando la lista está vacía.

## Fuera de alcance

- Scraping o API de LinkedIn para bajar la foto.
- Alta de speakers desde el formulario de la mesa.
- Filtros, búsqueda o paginado.

## Historia

Como visitante, quiero ver quién habla y abrir su LinkedIn, para reconocer a la persona antes del evento.

## Comportamiento

1. Si `speakers.length === 0`, el bloque muestra el título “Speakers” y la línea “Próximamente nuevas voces”.
2. Si hay al menos uno, desaparece esa línea y se renderiza la grilla.
3. Cada card es un link a `linkedinUrl`. Toda la card es clickeable, no solo un ícono.
4. La foto usa la relación de aspecto 1:1, recorte centrado. Si el archivo no carga, se ve la inicial del nombre sobre un fondo sólido.

## Datos

```ts
type Speaker = {
  id: string;
  nombre: string;
  rol: string;
  charla?: string;
  linkedinUrl: string;
  foto: string; // ruta en /public, ej. "/speakers/ada.jpg"
};
```

La foto la exporta el equipo desde el perfil público y la commitea. El campo no acepta una URL de `media.licdn.com`.

## UI

- Ancla `#speakers`, alcanzable desde el nav.
- Desktop: 4 columnas. Tablet: 2. Mobile: 1, foto a la izquierda y texto a la derecha.
- Orden: el del array en `content/speakers.ts`.

## Criterios de aceptación

1. Lista vacía: se lee “Próximamente nuevas voces” y no hay cards rotas.
2. Con tres speakers, se ven tres fotos, tres nombres y tres links distintos.
3. Activar una card abre su LinkedIn en pestaña nueva.
4. Una ruta de foto inexistente muestra la inicial, no un ícono de imagen rota del browser.
5. El nav “Speakers” scrollea a `#speakers`.

## Dependencias

Ninguna con las otras seis features. Comparte el patrón de link externo del contexto.

## Casos borde

- `charla` ausente: la card no reserva una línea vacía.
- Nombre de una sola palabra: la inicial es esa letra.

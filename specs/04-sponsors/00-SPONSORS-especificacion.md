# 04 — Sponsors deslizables

## Problema

Acompañan está como lista estática. Los sponsors tienen que deslizarse y cada logo tiene que llevar a su sitio.

## Resultado

Una cinta continua en `#acompanan` con los logos de quienes acompañan. Activar un logo abre la página de esa marca.

## Alcance

- Marquee infinito, de derecha a izquierda, en loop.
- Pausa al hover y al foco de teclado.
- Un link por sponsor.
- Datos y logos en el repo.

## Fuera de alcance

- Carrusel con flechas y dots. El gesto es la cinta, no un slider paginado.
- Sponsors que se cargan por el formulario de la mesa.
- Mover a “Organizan” a esta cinta. Organizan sigue en cards con categoría, descripción y link.

## Historia

Como visitante, quiero ver las marcas que acompañan y entrar a su sitio desde el logo.

## Comportamiento

1. La cinta duplica la secuencia de logos para que el loop no tenga corte.
2. La animación dura lo suficiente para leer cada marca (base: 28 segundos por vuelta completa de la lista original).
3. Hover sobre la cinta, o foco dentro de un logo, pausa el movimiento. Al salir, sigue desde donde quedó.
4. Activar un logo abre `url` en pestaña nueva.
5. Con `prefers-reduced-motion: reduce`, la cinta está quieta y los logos wrappean en una grilla de varias filas. Los links siguen igual.

## Datos

```ts
type Sponsor = {
  id: string;
  nombre: string;
  url: string;
  logo: string; // SVG o PNG en /public/sponsors
};
```

Lista inicial en `content/sponsors.ts`:

| Nombre | Destino |
| --- | --- |
| Grupo Rotonda | su sitio |
| The Red Guild | su sitio |
| Payoneer | su sitio |

Las URLs concretas se completan en ese archivo antes del deploy. Un sponsor sin `url` no se publica.

## UI

- Ancla `#acompanan`. Título de sección: “Acompañan”.
- Logos en una sola altura (48px en desktop, 36px en mobile), ancho automático, color original.
- `alt` de cada imagen = `nombre`.
- El foco visible recorre logo por logo, en el orden del array.

## Criterios de aceptación

1. Con los tres sponsors iniciales, cada logo aparece y el loop no muestra un hueco en el empalme.
2. Click en Payoneer abre solo la URL de Payoneer.
3. Tab deja el foco en un logo y la cinta no se mueve mientras ese foco siga dentro.
4. Con motion reducido, no hay animación y los tres logos se pueden activar.
5. El nav “Acompañan” scrollea a esta sección.

## Dependencias

Ninguna. El marquee de tracks del hero es otro componente: misma idea visual, otros datos. No comparten lista.

## Casos borde

- Un solo sponsor: se muestra quieto, centrado, sin duplicar la pieza para simular movimiento.
- Logo muy ancho: se escala a la altura fija sin deformar.

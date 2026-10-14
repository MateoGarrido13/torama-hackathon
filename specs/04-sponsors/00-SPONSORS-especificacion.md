# 04 — Sponsors deslizables

## Problema

La sección de "Acompañan" está como una lista estática. Los sponsors tienen que deslizarse de forma continua y cada logo tiene que enlazar al sitio oficial de la marca.

## Resultado

Una cinta continua (marquee) en #acompanan con los logos de quienes acompañan. Activar un logo abre la página de esa marca en una pestaña nueva de forma segura. La cinta es HTML del front (React Three Fiber, hosting en Vercel), no una malla de la escena.

## Alcance

Marquee infinito, de derecha a izquierda, en loop.
Pausa de la animación al hacer hover (ratón) y al recibir foco (teclado)
Un link por sponsor.
Datos y logos alojados en el repositorio.

## Fuera de alcance

Carrusel interactivo con flechas y dots. El gesto es la cinta automática, no un slider paginado manualmente.
Sponsors que se cargan dinámicamente por API externa (se usa la fuente de verdad del repo).
Mover a “Organizan” a esta cinta. Organizan sigue en cards con categoría, descripción y link.

## Historia

Como visitante, quiero ver de un vistazo las marcas que acompañan al evento y poder entrar a su sitio al hacer click en su logo.

## Comportamiento

La cinta duplica la secuencia de logos para que el loop no tenga corte. Importante: La duplicación debe ser suficiente para cubrir pantallas ultrawide (ej. monitores 4K) sin dejar huecos con solo 3 sponsors.

Accesibilidad en clones: Para evitar atrapar la navegación por teclado, solo la lista original debe ser focuseable. Los nodos HTML clonados para el efecto visual deben tener obligatoriamente aria-hidden="true" y tabindex="-1".

La animación dura lo suficiente para leer cada marca (velocidad base: ~28 segundos por vuelta completa, ajustable según el ancho total).

Hover sobre la cinta, o foco (:focus-within) dentro de un logo, pausa la animación para permitir hacer click con comodidad. Al salir, retoma el movimiento suavemente.

Activar un logo abre la url en pestaña nueva. Requiere target="_blank" y rel="noopener noreferrer".

Con prefers-reduced-motion: reduce, se desactiva la animación por completo. La cinta se convierte en una grilla estática (flex-wrap: wrap o grid) de varias filas centradas. Los links siguen funcionales.

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

Un solo sponsor: Se desactiva la animación de marquee. El logo se muestra quieto y centrado horizontalmente. No se clonan nodos.

Logo muy ancho: Se escala proporcionalmente a la altura fija de la fila, sin deformarse (object-fit: contain).

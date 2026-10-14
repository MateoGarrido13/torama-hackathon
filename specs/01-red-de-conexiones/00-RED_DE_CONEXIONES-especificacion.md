# 01 — Red de conexiones

## Problema

Quien entra al sitio no ve quién ya forma parte del evento. La red tiene que mostrar a las personas y compañías que completaron la mesa, y llevar de un toque a su LinkedIn.

## Resultado

Una sección `#red` con un grafo 3D. Cada envío publicado de la mesa (spec 05) agrega un nodo. Tocar un nodo abre el LinkedIn de esa persona.

## Alcance

- Grafo en React Three Fiber, renderizado solo en cliente.
- Un nodo por `PersonaPublica`.
- Aristas entre nodos que comparten `compania` o `track`. Si un nodo no comparte nada, queda suelto y unido al nodo central del evento.
- Click y tap abren `linkedinUrl`.
- El grafo se actualiza cuando entra una persona nueva, sin recargar la página.
- Estado vacío, con nodos, y con muchos nodos.

## Fuera de alcance

- Chat, mensajería o “conectar” dentro del sitio.
- Login.
- Editar o borrar un nodo desde la UI pública.
- Leer datos de LinkedIn más allá de la URL cargada en el formulario.

## Historia

Como visitante, quiero tocar a alguien de la red y caer en su LinkedIn, para ver quién se está sumando al evento.

## Comportamiento

1. Al entrar a `#red`, el cliente pide `GET /api/conexiones`.
2. Dibuja los nodos en una escena con fondo oscuro, cámara orbitable y un nodo central fijo etiquetado “Tandil Tech Week”.
3. El layout es una simulación liviana: los nodos se repelen y las aristas los acercan. Se estabiliza en pocos segundos.
4. Hover (puntero) o foco (teclado) muestra una tarjeta: nombre, rol, compañía.
5. Click, tap o Enter abre LinkedIn en una pestaña nueva.
6. Cada 15 segundos, y también justo después de un envío exitoso de la mesa en la misma pestaña, vuelve a pedir la lista. Los nodos nuevos aparecen con una entrada corta. Los existentes no se reubican de cero.
7. Con más de 80 nodos, se dejan de dibujar aristas individuales y se agrupa por compañía: un nodo por compañía y el conteo de personas. El tap abre el LinkedIn de la compañía si existe; si no, el de la primera persona del grupo.

## Reglas

- Solo entran registros con `publicarEnRed: true` y un `linkedinUrl` válido.
- El email nunca se renderiza.
- El orden visual no depende del orden de llegada más allá de la animación de entrada.
- Si WebGL no está disponible, se muestra la misma lista como grilla de tarjetas clickeables. Misma data, mismo destino.

## Datos

Consume `PersonaPublica[]` de `GET /api/conexiones`.

Respuesta:

```json
{
  "nodos": [
    {
      "id": "c_01",
      "nombre": "Ada Gómez",
      "rol": "Engineer",
      "compania": "Picante",
      "linkedinUrl": "https://www.linkedin.com/in/ada-gomez",
      "track": "software",
      "creadoEn": "2026-09-20T18:04:00-03:00"
    }
  ]
}
```

Seed de desarrollo: 8 personas ficticias en `content/conexiones.seed.ts` para que la escena no nazca vacía en local. En producción el seed no se mezcla con envíos reales.

## UI

- Título: “Red de conexiones”.
- Bajada: “Cada persona que se sienta a la mesa aparece acá.”
- Leyenda mínima: “Tocá un nodo para abrir LinkedIn.”
- Contador visible: “N personas en la red”.
- La escena ocupa el ancho del contenido y una altura de `70vh` en desktop, `80vh` en mobile. No tapa el nav.
- Un dedo rota, dos dedos hacen zoom. En desktop: arrastre rota, rueda hace zoom.

## Técnico

- Componente cliente `RedConexiones`. El canvas no se importa en el servidor.
- `dpr` máximo 1.5. La simulación se pausa cuando la sección sale del viewport.
- Colores del nodo según `track`. Sin track, un color neutro. El mapa de color vive en `content/tracks.ts`.

## Criterios de aceptación

1. Con la lista vacía se ve el nodo central, el contador en 0 y el texto de estado vacío. No hay error en consola.
2. Dado un envío publicado en la mesa, en menos de 20 segundos el nodo está en la escena y el contador sube 1.
3. Activar un nodo abre exactamente su `linkedinUrl` en pestaña nueva.
4. Dos personas de la misma compañía quedan unidas por una arista.
5. Con `prefers-reduced-motion: reduce`, el grafo aparece ya quieto, sin simulación ni animación de entrada.
6. Sin WebGL, la grilla muestra las mismas personas y los links funcionan.

## Dependencias

- Spec 05 crea los registros.
- Spec 06 puede mover la cámara de esta escena con el scroll, sin cambiar estas reglas de interacción.

## Casos borde

- URL de LinkedIn caída: igual se abre. El sitio no valida que el perfil exista.
- Dos envíos con la misma URL: se conserva el primero y el segundo responde 409 desde la API. La red no duplica el nodo.
- La API falla: se mantiene el último grafo bueno y un aviso “No pudimos actualizar la red”.

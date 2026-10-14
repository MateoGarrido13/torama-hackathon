# 05 — Formulario como mesa de trabajo

## Problema

Las compañías de software que forman parte del evento necesitan un lugar para presentarse. Ese lugar tiene que sentirse como una mesa donde ya hay gente sentada, no como un formulario genérico. Cada alta alimenta la red (spec 01).

## Resultado

La sección `#mesa` muestra una mesa con tarjetas de quienes ya se publicaron y un lugar libre que es el formulario. Al enviarlo, la compañía queda sentada a la mesa y, si lo autorizó, aparece en la red.

## Alcance

- Formulario de alta para una compañía de software.
- Validación en cliente y en servidor.
- Persistencia de envíos.
- Lista pública de tarjetas sobre la mesa.
- Checkbox para salir en la red de conexiones.

## Fuera de alcance

- Pagos, tickets o acreditación.
- Edición posterior del envío.
- Panel de admin. Los envíos se revisan directo en la base.
- Modelo 3D de la mesa. La metáfora es de layout (tablero, tarjetas, un asiento vacío), no una escena R3F. La red 3D es la spec 01.

## Historia

Como alguien de una compañía de software del evento, quiero dejar nuestros datos en la mesa, para que el resto vea que estamos y pueda abrir nuestro LinkedIn.

## Campos

| Campo | Obligatorio | Regla |
| --- | --- | --- |
| Compañía | sí | 2 a 80 caracteres |
| Nombre de quien escribe | sí | 2 a 80 caracteres |
| Rol | sí | 2 a 80 caracteres |
| Email | sí | email válido. No se publica |
| LinkedIn | sí | `https://www.linkedin.com/in/...` o `https://www.linkedin.com/company/...` |
| Sitio | no | URL http(s) |
| Track | sí | uno de `content/tracks.ts` |
| Qué están haciendo en el evento | no | hasta 240 caracteres |
| Publicar en la red | no | default desmarcado. Si queda desmarcado, hay tarjeta en la mesa y no hay nodo |
| Honeypot `empresa_web` | — | oculto. Si viene con texto, el servidor responde 200 y no guarda |

## Comportamiento

1. Al cargar, `GET /api/conexiones` pinta las tarjetas ya publicadas alrededor del formulario.
2. El lugar libre es el form, visualmente una tarjeta vacía con el título “Sentate a la mesa”.
3. Errores de validación aparecen bajo el campo, en español, sin perder lo escrito.
4. Submit deshabilita el botón hasta que vuelve la respuesta.
5. 201: la tarjeta nueva entra a la mesa, el form se vacía, y un texto confirma “Quedaron en la mesa”. Si `publicarEnRed` era true, se dispara el refresh de la red.
6. 409: “Ese LinkedIn ya está en la mesa.” No se duplica.
7. 500 o red caída: “No pudimos guardar. Intentá de nuevo.” Los campos siguen llenos.

## Persistencia

Tabla `conexiones`:

| Columna | Tipo | Nota |
| --- | --- | --- |
| id | text pk | `c_` + ulid |
| compania | text | |
| nombre | text | |
| rol | text | |
| email | text | único junto con linkedin, nunca en el GET público |
| linkedin_url | text unique | |
| sitio | text null | |
| track | text | |
| mensaje | text null | |
| publicar_en_red | boolean | |
| creado_en | timestamptz | |

`GET /api/conexiones` devuelve solo filas con `publicar_en_red = true`, proyectadas a `PersonaPublica`.

`GET /api/mesa` devuelve todas las filas para las tarjetas, sin email: compañía, nombre, rol, linkedin, track, mensaje.

Implementación prevista: Postgres accesible desde Vercel (`POSTGRES_URL`). En local, sin esa variable, los POST se guardan en memoria del proceso y el seed de la spec 01 se muestra en los GET. Ese modo es solo para desarrollar la UI.

## UI

- Ancla `#mesa`.
- Título: “Mesa de trabajo”.
- Bajada: “Compañías de software que forman parte del evento.”
- Tarjetas en un tablero. El form ocupa la primera celda en desktop y queda arriba en mobile.
- Cada tarjeta muestra compañía, nombre, rol y un link “LinkedIn”. El mensaje, si existe, va en una línea.
- El botón de envío dice “Sumarnos a la mesa”.

## Criterios de aceptación

1. Un POST válido con publicar en red crea fila, tarjeta y nodo.
2. Un POST válido sin publicar crea tarjeta y no crea nodo.
3. El email del JSON público de `/api/conexiones` y de `/api/mesa` no aparece.
4. La misma `linkedin_url` por segunda vez devuelve 409 y la mesa queda igual.
5. El honeypot con texto no crea fila y la UI igual muestra la confirmación.
6. LinkedIn que no matchea el patrón no se puede enviar: el botón no dispara el POST.
7. Recargar la página después de un 201 muestra la tarjeta nueva.

## Dependencias

- Spec 01 consume `GET /api/conexiones`.
- Tracks compartidos con el color de los nodos.

## Casos borde

- Mensaje solo con espacios: se guarda como null.
- Compañía duplicada con otro LinkedIn: se permite. Son dos personas de la misma mesa.
- Más de 40 tarjetas: la mesa scrollea dentro de la sección; el form sigue primero.

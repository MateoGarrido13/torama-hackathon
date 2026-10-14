# Datos a reclutar

## Qué reclutar

Hay que capturar: nombre completo, rol (ej. Engineer, Designer), compañía, URL de LinkedIn y el track o temática (ej. software, producto).

## Cómo hacerlo

Hay que construir un formulario en el frontend (la mesa, spec 05) que haga un `POST /api/conexiones`.

La API REST (en Node.js, Python, o las API routes de Next.js) debe encargarse de:

- **Validar:** confirmar que la URL de LinkedIn tenga un formato válido.
- **Deduplicar:** buscar en la base de datos si esa URL de LinkedIn ya existe. Si existe, devolver un error HTTP 409 Conflict.
- **Persistir:** guardar el registro en la base de datos asignándole un ID único (`c_01`), la fecha actual (`creadoEn`) y el flag interno `publicarEnRed: true`.

Para capturar los datos y que un usuario aparezca en la red de Tandil Tech Week, el proceso se divide en definir la entidad, armar el formulario visual y gestionar el envío al servidor.

## Contrato de datos

Inputs del formulario:

- `nombre` (texto): nombre completo.
- `rol` (texto): su puesto o a qué se dedica (ej. "Ingeniero de Software", "Diseñadora").
- `compania` (texto): empresa, universidad o proyecto actual.
- `linkedinUrl` (URL): link directo a su perfil. Este es el dato más crítico porque funcionará como llave principal y destino del nodo 3D.
- `track` (selección): temática principal que determinará el color de su nodo (ej. software, design, marketing).

El backend genera y asigna automáticamente el id único, la marca de tiempo `creadoEn` y el flag `publicarEnRed`.

El paso a paso de la implementación en React/Next.js sigue en `Construir formulario.md` y `Capturar y enviar datos.md`.

---
name: acceso-erp
description: Ingresar, cerrar sesión, recuperar o cambiar la contraseña, y ver o editar el perfil en el ERP HOM Seguros. Usar ante login, logout, "olvidé mi contraseña", perfil, roles PAS/directivo/administrativo, o cuando haga falta saber a qué pantalla entra cada rol.
---

# Acceso al ERP

Leé `../shared/reglas-erp.md` antes de actuar.

Actor: PAS, directivo o administrativo. La cuenta ya existe. No se crea desde estas pantallas.

## Ingresar

1. Pantalla `/`, con email y contraseña, sin menú de la app.
2. Si ya hay sesión en el dispositivo, ir a la home del rol y no volver a pedir la contraseña.
3. Validar formato de email y que la contraseña no esté vacía. Si falla, marcar el campo y no buscar la cuenta.
4. Buscar la cuenta y comparar la contraseña. Si no hay cuenta o no coincide, mostrar un único aviso y no decir cuál falló.
5. Abrir sesión con el rol y su alcance. Anotar en auditoría usuario, rol, fecha y hora.
6. Home: PAS → `/pendientes`. Directivo y administrativo → `/red`.

## Recuperar contraseña

1. Desde el ingreso, "Olvidé mi contraseña" → `/recuperar`.
2. Pedir el email. Si el formato es inválido, no buscar la cuenta.
3. Si el email no está o la cuenta no está activa, mostrar el mismo aviso que si existiera y no enviar enlace.
4. Si existe, generar un enlace de un solo uso con vencimiento. Si el correo no sale, no dejar el enlace emitido.
5. El aviso público es: si el email está registrado, va a llegar un mensaje para elegir una contraseña nueva.
6. En `/recuperar/nueva`, pedir contraseña nueva y confirmación. Tienen que coincidir y cumplir la política (8 caracteres, un número, distinta de la anterior).
7. Reemplazar la contraseña, invalidar el enlace, auditar el cambio sin guardar la clave, y volver al ingreso.

Cambiar la contraseña con sesión abierta es el mismo criterio, desde `/perfil/contrasena`, y pide además la contraseña actual.

## Perfil

`/perfil` muestra nombre, teléfono, rol y organización. Se pueden editar nombre y teléfono (10 dígitos). El rol y la matrícula no se cambian acá.

## Cerrar sesión

Cerrar la sesión del dispositivo, anotar el cierre en auditoría y volver a `/` sin menú.

## Pendiente respecto del prototipo

Tope de intentos fallidos, duración de la sesión y más de una sesión a la vez no están definidos. No los inventes.

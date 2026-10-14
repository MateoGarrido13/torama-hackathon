# Reglas transversales — ERP HOM Seguros

Estas skills replican las capacidades del prototipo PAS de HOM Seguros (repo privado `ERP-HOMSEGUROS-V1`, carpeta `front/`) y de `front/docs/casos-de-uso/`. El sistema de registro **legal** de la póliza vive en la aseguradora. El ERP es el registro **operativo** de la red: cliente, cotización, propuesta, productor y comisión vista por el dueño.

## Alcance

- HOM intermedia. No underwritea, no cobra la prima como carrier y no asigna número de póliza.
- Una cotización es una oferta ajena que caduca. Una skill de cotización termina en **propuesta** (automotor) o en **solicitud** (hogar, accidentes, ART). No emite.
- Ramos con flujo en el prototipo: Automotor, Hogar, Accidentes Personales, ART.
- Comercio, Responsabilidad Civil y Vida se muestran en el selector y no abren flujo. No inventarles un camino.
- Compañías del comparador de automotor en el prototipo: Sancor, Mercantil Andina, Allianz. No agregar carriers ni primas que no vengan de un middleware real o del mock ya existente en ese repo.

## Roles

| Rol | Entra a | Puede |
| --- | --- | --- |
| `pas` | `/pendientes` | Cotizar, cartera, pendientes, siniestros. Solo su cartera. |
| `directivo` | `/red` | Ver el alcance de la red. No opera las rutas de PAS. |
| `administrativo` | `/red` | Igual que el directivo en el prototipo. |

Rutas exclusivas del PAS: `/cotizar`, `/cartera`, `/pendientes`, `/siniestros` y todo lo que cuelga de ellas.

La cuenta la crea la organización. No hay alta pública. Un PAS no se registra solo.

## Acceso y datos

- Ingreso con email y contraseña. Si falla el email o la contraseña, el aviso es uno solo: no decir cuál de los dos falló.
- Recuperación: el aviso es el mismo si el email existe o no. El enlace es de un solo uso y vence. No queda emitido si el correo no sale.
- Contraseña: mínimo 8 caracteres, al menos un número, distinta de la anterior. La auditoría anota el cambio y no guarda la contraseña.
- Teléfono de perfil: 10 dígitos.
- No copiar a este repo credenciales, teléfonos ni personas del mock. Esas cuentas viven solo en el prototipo privado.

## Qué no hacer

- No presentar un precio estimado como cotización de la compañía.
- No duplicar un cliente si el documento ya existe.
- No dejar que un PAS vea la cartera de otro, ni que el directivo opere como si fuera un productor.
- No completar en silencio un hueco del prototipo (emitir, editar siniestro, dashboard de red, alta de PAS) como si ya estuviera hecho. Esas piezas están en la lista de casos de uso como pendientes.

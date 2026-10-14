---
name: erp-seguros
description: Índice de las skills del ERP de intermediación HOM Seguros (PAS, cotización, cartera, pendientes, siniestros, red). Usar cuando haya que operar, especificar o extender el prototipo de seguros, elegir un ramo, o decidir qué flujo del ERP aplica.
---

# ERP HOM Seguros

Punto de entrada. Elegí **una** skill de capacidad y seguí esa. Las reglas comunes están en `../shared/reglas-erp.md`.

| Si la tarea es… | Skill |
| --- | --- |
| Entrar, salir, recuperar o cambiar contraseña, ver o editar perfil | `acceso-erp` |
| Cotizar un auto, patente, riesgo, cliente y comparación | `cotizar-automotor` |
| Cotizar una vivienda | `cotizar-hogar` |
| Cotizar accidentes personales | `cotizar-accidentes` |
| Pedir una ART | `cotizar-art` |
| Comparar compañías, armar propuesta, PDF o envío | `propuesta-comparada` |
| Avisos, leads, WhatsApp de pendientes | `pendientes-y-leads` |
| Buscar clientes, ver cartera o distribución por ramo | `cartera-clientes` |
| Mora, cuota rechazada, aviso de pago | `cobranza` |
| Ver un siniestro | `siniestros` |
| Sesión de directivo o administrativo, alcance de red | `red-organizacion` |

## Orden cuando la tarea cruza varias

1. Confirmar rol y sesión con `acceso-erp`.
2. Ejecutar la capacidad (cotizar, cartera, pendiente, siniestro o red).
3. Si hay comparación o envío de automotor, cerrar con `propuesta-comparada`.
4. Un aviso de pago rechazado se trabaja con `cobranza`, aunque aparezca en Pendientes.

## Fuente

Prototipo en el repo privado `ERP-HOMSEGUROS-V1`, carpeta `front/`. Lista de casos de uso: `front/docs/casos-de-uso/lista-casos-de-uso-HOM-ERP.md`. Estas skills describen lo que ese prototipo ya hace y marcan lo que la lista deja pendiente. No reemplazan el código.

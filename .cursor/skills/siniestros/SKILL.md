---
name: siniestros
description: Ver la lista y el detalle de siniestros del PAS en el ERP HOM Seguros. Usar para consultar un reclamo, su estado, comentario o contactos. No registra ni cierra siniestros.
---

# Siniestros

Leé `../shared/reglas-erp.md`. Ruta: `/siniestros`. Solo el PAS, sobre su cartera.

## Qué hace el prototipo

1. Lista cada siniestro con estado, titular, ramo, compañía y días desde el registro.
2. Al abrir uno, muestra el comentario y los contactos, con teléfono para llamar.

Estados y textos salen del mock. No calcules un estado nuevo ni un plazo de la aseguradora que no esté en ese dato.

## Reglas

- Consulta solamente. No des de alta un siniestro, no cambies estado, no adjuntes documentación, no cargues número de reclamo y no lo cierres.
- No armes el ZIP del expediente ni corras OCR.
- Un directivo no "ve los siniestros de la red" desde esta ruta. Esa consulta no está hecha.

## Pendiente

Registrar, actualizar el ticket (documentación, mails, derivación) y cerrar el siniestro están en la lista de casos de uso. Si la tarea pide escribir, decí que el prototipo no lo permite y no inventes el alta.

---
name: cotizar-automotor
description: Cotizar un automotor en el ERP HOM Seguros, desde la patente hasta el cliente, sin emitir la póliza. Usar cuando un PAS pide cotizar un auto, cargar patente, CP, uso, GNC, 0 km o suma asegurada.
---

# Cotizar automotor

Leé `../shared/reglas-erp.md`. Solo un PAS autenticado. La cotización queda asociada a ese productor.

Al terminar la comparación y el envío, seguí `propuesta-comparada`. Esta skill no elige compañías ni arma el PDF.

## Flujo

1. `/cotizar` → ramo Automotor → `/cotizar/automotor`.
2. Datos mínimos para avanzar: patente, código postal de 4 números y uso. Sin los tres, el flujo no sigue.
3. La patente acepta el formato de ejemplo `AB 123 CD` (letras y números, con o sin espacios).
4. `/cotizar/riesgo`: confirmar marca, modelo, año, CP, suma asegurada, si es 0 km, si tiene GNC y si el uso es comercial.
5. Si la decodificación por patente no responde, el PAS completa el vehículo a mano. No frenes la cotización por eso. No presentes un valor de relleno como si fuera el precio de la compañía.
6. `/cotizar/asegurado`: cliente existente o alta.
   - Existente: reutilizar la ficha. No pedir de nuevo los datos que ya están.
   - Nuevo: dar de alta una sola vez. Si el documento ya existe, no duplicar.
7. Guardar la consulta y seguir a `/cotizar/comparar`.

## Reglas

- Marca, modelo y año salen de la decodificación de la patente cuando responde. El PAS puede corregirlos.
- Suma asegurada y CP tienen que estar completos antes de comparar.
- Este flujo genera una propuesta. No emite, no asigna número de póliza y no toca la cartera hasta que la aseguradora emita y alguien lo asiente. Ese asiento **no existe** en el prototipo.

## Pendiente respecto del prototipo

Re-cotizar una póliza con datos precargados, guardar y retomar una cotización, y mostrar la comisión de cada oferta no están en el flujo. No los simules como hechos.

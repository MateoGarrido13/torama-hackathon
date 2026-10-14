---
name: propuesta-comparada
description: Comparar ofertas de automotor, armar la propuesta, ver el PDF y marcarla como enviada en el ERP HOM Seguros. Usar después de cotizar un auto, o cuando hay que elegir compañía, cobertura, compartir o reenviar una propuesta.
---

# Propuesta comparada

Leé `../shared/reglas-erp.md`. Solo automotor, y solo con un PAS autenticado que ya cargó patente, CP, uso, riesgo y cliente (`cotizar-automotor`).

## Flujo

1. `/cotizar/comparar` muestra las ofertas que respondieron. En el prototipo son Sancor, Mercantil Andina y Allianz, cada una con cobertura y premio mensual.
2. Si una compañía no responde o rechaza el riesgo, no la muestres como oferta válida y no tapes el fallo con un precio inventado.
3. El PAS elige una o más combinaciones compañía–cobertura. La propuesta usa solo esa selección.
4. Continuar a `/cotizar/propuesta`.
5. `/cotizar/pdf` es la propuesta para leer y descargar. El PDF se genera en la app. El PAS lo envía con el compartir del dispositivo (mail o WhatsApp del teléfono). No hay API de WhatsApp Business.
6. Al confirmar el envío, `/cotizar/enviado`. Desde ahí se puede volver a la cartera.

## Reglas

- La propuesta no es una póliza. No le asignes número, vigencia legal ni estado "emitida".
- No muestres comisión ni descuento por puntos salvo que el dato venga de una fuente real. El prototipo no lo calcula.
- El envío queda como propuesta a confirmar. El asiento de "la compañía emitió" no está en el prototipo: no lo des por hecho.

## Pendiente

Marcar aceptada, rechazada o vencida, y registrar la póliza emitida a partir de una propuesta aceptada, están en la lista de casos de uso y no en la pantalla. Si hace falta, decilo como pendiente.

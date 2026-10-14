---
name: cobranza
description: Leer mora y cuotas rechazadas del PAS en el ERP HOM Seguros. Usar ante pago rechazado, débito, cuota vencida, aviso de pago o cuando un pendiente pone la cobertura en riesgo por cobranza.
---

# Cobranza

Leé `../shared/reglas-erp.md`. Solo datos de la cartera del PAS de la sesión.

## Dónde está en el prototipo

- El aviso operativo vive en `/pendientes`: pago rechazado, medio (débito, tarjeta, caja o PAS), cuota, importe y motivo. El mensaje de WhatsApp sale de `pendientes-y-leads`.
- Hay un tablero de morosos armado en el código (`CollectionBoard`) y datos de cobranza en el mock. **No está montado en una ruta.** No digas que el PAS ya tiene una pantalla de mora propia.

## Cómo leer un rechazo

1. Identificar titular, ramo, compañía y número de cuota.
2. Decir el medio de pago y el motivo (por ejemplo fondos insuficientes) solo si el aviso los trae.
3. Dejar explícito que la cobertura puede caer si la cuota sigue rechazada. No declares la póliza anulada: el prototipo no cambia ese estado.
4. El aviso al cliente es un mensaje para que el PAS lo envíe. No queda registro de "ya se avisó".

## Reglas

- No marques pagado, no cargues referencia de factura y no armes un ticket de X días. Eso está especificado y no implementado.
- No concilies contra un extracto bancario.
- No muestres la mora de toda la red. Eso es de `red-organizacion`, y el dashboard de red tampoco está construido.

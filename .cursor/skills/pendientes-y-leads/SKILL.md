---
name: pendientes-y-leads
description: Ver avisos y leads del PAS en el ERP HOM Seguros, y armar el mensaje de WhatsApp o el llamado. Usar en la home del productor, ante un aviso de pago, cumpleaños, propuesta enviada o un lead para contactar.
---

# Pendientes y leads

Leé `../shared/reglas-erp.md`. Home del PAS: `/pendientes`. Directivo y administrativo no entran acá.

## Qué muestra el prototipo

1. Avisos, con cantidad. Cada aviso tiene etiqueta, titular, ramo y compañía, comentario, tono y un mensaje listo para compartir.
2. El PAS abre el aviso y usa "Enviar WhatsApp" (o el teléfono del aviso). El texto sale a nombre del productor de la sesión.
3. Debajo, leads: titular, ramo, origen, comentario y teléfono. Se contacta con el teléfono del lead.

Orígenes de lead que ya existen en el mock: cotización enviada a otro productor, y cliente que retiró el bien (hogar o automotor) y hoy no tiene póliza vigente.

## Reglas

- El mensaje nombra al PAS de la sesión y a HOM Seguros. No uses el nombre de otro productor.
- Un aviso de pago rechazado se lee con la skill `cobranza`: medio de pago, cuota, importe y motivo. No lo conviertas en "pagado" desde esta pantalla.
- Compartir no registra solo que el cliente fue avisado. El prototipo no guarda ese acuse.

## Pendiente

Resolver o posponer un aviso, cambiar el estado del lead (contactar, reactivar, descartar, convertir en cotización) y dejar asentado el aviso de mora no están implementados. No inventes un estado nuevo en la lista.

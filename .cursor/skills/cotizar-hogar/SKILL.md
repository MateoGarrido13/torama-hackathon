---
name: cotizar-hogar
description: Armar la solicitud de seguro de hogar en el ERP HOM Seguros (uso, vivienda, metros, contenido, mascotas, objetos). Usar cuando un PAS cotiza una vivienda o carga objetos particulares. No compara compañías.
---

# Cotizar hogar

Leé `../shared/reglas-erp.md`. Solo un PAS autenticado. Es una **solicitud**, no el comparador de automotor.

## Flujo

1. `/cotizar` → Hogar → `/cotizar/hogar`.
2. Completar, todos obligatorios salvo el detalle de mascota cuando no hay cobertura de mascotas:
   - Uso de la propiedad.
   - Tipo de vivienda.
   - Código postal de 4 números.
   - Metros cuadrados (entero, al menos 1).
   - Suma del contenido (número, al menos 1000).
   - Si se cubren mascotas. Si sí, tipo y cantidad (al menos 3 caracteres).
3. Objetos particulares: validar cada ítem antes de avanzar. Si hay error, volver a ese ítem.
4. Seguir a `/cotizar/hogar/asegurado` (cliente existente o alta, sin duplicar documento).
5. Cerrar en `/cotizar/hogar/enviado`. El PAS comparte la solicitud por el compartir del dispositivo. No hay WhatsApp Business API.

## Reglas

- No abras el comparador de automotor para este ramo.
- No inventes una prima por compañía. El prototipo no cotiza hogar contra Sancor, Mercantil ni Allianz.
- No emitas póliza.

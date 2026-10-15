---
name: cotizar-art
description: Armar la solicitud de ART en el ERP HOM Seguros (empresa, CUIT, actividad, empleados, masa salarial, formulario AFIP). Usar cuando un PAS pide una ART o carga nómina. No compara compañías ni emite.
---

# Cotizar ART

Leé `../shared/reglas-erp.md`. Solo un PAS autenticado. Es una **solicitud**.

## Flujo

1. `/cotizar` → ART → `/cotizar/art`.
2. Campos:
   - Nombre de la empresa (al menos 2 caracteres).
   - CUIT de 11 números.
   - Actividad económica (al menos 3 caracteres).
   - Cantidad de empleados: entero, al menos 1.
   - Masa salarial: número, al menos 1.
   - Cargo de quien pide (al menos 2 caracteres).
3. El formulario AFIP es opcional. Si se adjunta, solo PDF, JPG o PNG.
4. `/cotizar/art/asegurado` y después `/cotizar/art/enviado`.

## Reglas

- No cotices ART contra el comparador de automotor.
- No calcules una alícuota ni una prima si no vino de un canal real de la ART.
- No emitas un contrato.

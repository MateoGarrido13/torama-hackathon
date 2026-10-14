---
name: cotizar-accidentes
description: Armar la solicitud de accidentes personales en el ERP HOM Seguros (actividad, vigencia, documento, nacimiento). Usar cuando un PAS cotiza AP o carga DNI, CUIT o pasaporte del asegurado. No compara compañías.
---

# Cotizar accidentes personales

Leé `../shared/reglas-erp.md`. Solo un PAS autenticado. Es una **solicitud**.

## Flujo

1. `/cotizar` → Accidentes Personales → `/cotizar/accidentes`.
2. Actividad (al menos 3 caracteres).
3. Fecha de inicio y fecha de fin, en formato fecha válida. El fin es posterior al inicio.
4. Suma asegurada, si se carga, es un número de al menos 1000. No la inventes si el PAS no la dio.
5. Cantidad de personas según las opciones del formulario.
6. Documento obligatorio:
   - DNI: 7 u 8 números.
   - CUIT: 11 números.
   - Pasaporte: al menos 6 caracteres alfanuméricos.
7. Fecha de nacimiento válida y anterior a hoy.
8. `/cotizar/accidentes/asegurado` y después `/cotizar/accidentes/enviado`.

## Reglas

- No compares compañías ni armes el PDF de automotor.
- No emitas póliza. La solicitud queda para que el PAS la comparta.

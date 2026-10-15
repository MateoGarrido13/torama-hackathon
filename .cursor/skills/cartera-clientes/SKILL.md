---
name: cartera-clientes
description: Ver la cartera del PAS, la distribución por ramo y buscar un cliente en el ERP HOM Seguros. Usar para pólizas, clientes, ficha, o para saber qué ramos (automotor, hogar, ART) tiene una persona.
---

# Cartera y clientes

Leé `../shared/reglas-erp.md`. Ruta: `/cartera`. Solo el PAS, y solo su cartera.

## Qué muestra el prototipo

1. Distribución por ramo sobre las pólizas cargadas: Automotor, Hogar y ART.
2. Búsqueda de clientes y sus pólizas: titular, compañía, localidad, ramo, número de póliza y próximo cobro.
3. Desde el resultado se puede compartir la póliza con el cliente, igual que el envío de una propuesta: lo manda el dispositivo, no una API de mensajería.

Localidades del mock: Vicente López, Martínez, Olivos, San Isidro, Tigre. Compañías: Sancor, Mercantil Andina, Allianz.

## Reglas

- Una persona puede tener más de una póliza. No la dupliques por cada ramo.
- El número de póliza que se muestra ya fue emitido por la aseguradora. Esta pantalla no lo genera.
- No des de alta, no edites y no borres una póliza desde acá. El prototipo es de consulta y de compartir.

## Pendiente

Alta de cliente fuera de la cotización, edición de ficha, detalle editable, carga inicial de cartera histórica y re-cotizar desde una póliza están en la lista de casos de uso y no en esta pantalla.

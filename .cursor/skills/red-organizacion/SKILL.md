---
name: red-organizacion
description: Sesión de directivo o administrativo en el ERP HOM Seguros y el alcance de la red. Usar para el dashboard de la organización, KPIs, rendimiento por PAS, alta de productores o mora de toda la red.
---

# Red de la organización

Leé `../shared/reglas-erp.md`. Home de directivo y administrativo: `/red`.

## Qué hace el prototipo

1. Muestra el rol y que la sesión alcanza la red de la organización, no la cartera de un solo PAS.
2. No muestra KPIs, ranking, pólizas de cada productor ni mora consolidada.
3. Esas cuentas no usan `/cotizar`, `/cartera`, `/pendientes` ni `/siniestros`. Si la tarea es operar una póliza, hace falta un PAS.

## Reglas

- No armes un dashboard con números que no estén en una fuente. El prototipo no los tiene.
- No des de alta, no edites y no suspendas un PAS desde esta pantalla.
- No asignes roles ni permisos.
- La comisión por póliza, el override de la cadena y la rúbrica SSN no se consultan acá.

## Pendiente

Dashboard de red, rendimiento por PAS, cartera resumida de cada productor, mora de la red, alta y baja de PAS, roles, y auditoría consultable están en la lista de casos de uso como trabajo de directivo o administrativo. Nombralos como pendientes. No los rellenes con el mock de un productor.

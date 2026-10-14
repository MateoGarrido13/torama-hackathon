# 03 — Temporizador del próximo evento

## Problema

El hero dice 14 y 15 oct, pero no dice cuánto falta para la próxima jornada. El countdown de `#inscripciones` mide otra cosa: la apertura del 17 sep 2026 19:00.

## Resultado

Un temporizador en el hero que cuenta hacia la próxima jornada y cambia de etiqueta cuando esa jornada empieza.

## Alcance

- Reloj días / horas / minutos / segundos.
- Máquina de estados según la fecha actual.
- Fuente de verdad: `content/evento.ts`.
- El countdown de inscripciones queda como está y no se reutiliza este componente para mezclar los dos mensajes.

## Fuera de alcance

- Cuenta regresiva por charla del cronograma.
- Notificaciones push.
- Sincronizar con un servidor de tiempo más allá del reloj del dispositivo. El primer paint puede hidratarse con la hora del servidor para evitar un salto.

## Historia

Como visitante, quiero ver cuánto falta para la próxima jornada, para saber si el evento es ahora o todavía no.

## Estados

| Ahora | Etiqueta | Destino |
| --- | --- | --- |
| Antes del inicio de Hacking Day | “Hacking Day empieza en” | `hacking-day.inicio` |
| Desde el inicio de Hacking Day hasta antes de Startup Day | “Startup Day empieza en” | `startup-day.inicio` |
| Desde el inicio de Startup Day hasta su fin | “Startup Day está en curso” | sin dígitos, link a `#en-vivo` |
| Después del fin de Startup Day | “Nos vemos en la próxima edición” | sin dígitos |

Durante Hacking Day el temporizador apunta a Startup Day, que es el próximo evento. No se queda en cero mientras la jornada actual sigue.

## Comportamiento

1. El servidor calcula el estado con la hora de la request y manda etiqueta + `targetIso`.
2. El cliente, montado, recalcula cada 1 segundo.
3. Formato: dos dígitos por unidad. Días pueden pasar de 99.
4. Al cruzar un hito, cambia la etiqueta en el mismo segundo, sin recargar.
5. El badge “Coming Soon” del hero se oculta cuando el estado pasa a “está en curso” o “nos vemos en la próxima edición”.

## UI

- Ubicado bajo el claim del hero, arriba del marquee de tracks.
- Cuatro celdas: Días, Horas, Min, Seg. En mobile las cuatro entran en una fila.
- En los estados sin dígitos, las celdas no se renderizan.

## Técnico

- Componente cliente `TemporizadorEvento`.
- `targetIso` siempre con offset `-03:00`. No usar la zona del browser para decidir el hito.
- `suppressHydrationWarning` en los dígitos, porque el segundo puede diferir entre server y client.

## Criterios de aceptación

1. El 13 oct 2026 23:59 ART la etiqueta es “Hacking Day empieza en” y los días son coherentes con el inicio configurado.
2. En el minuto en que empieza Hacking Day, la etiqueta pasa a “Startup Day empieza en”.
3. Mientras Startup Day está en curso, no hay celdas en cero: hay texto de en curso y un link a `#en-vivo`.
4. El 16 oct 2026 se ve “Nos vemos en la próxima edición”.
5. Cambiar `inicio` en `content/evento.ts` mueve el temporizador sin tocar el componente.
6. El countdown de `#inscripciones` sigue apuntando al 17 sep 2026 19:00 y no cambia de copy con esta feature.

## Dependencias

- Spec 07 usa el mismo estado “en curso” para decidir si el player intenta mostrarse en vivo. La fuente sigue siendo `content/evento.ts`, no una copia de los dígitos.

## Casos borde

- Reloj del dispositivo adelantado: se acepta. No hay NTP.
- `inicio` mal formado en el contenido: el hero muestra la fecha en texto (“14 oct”) y omite las celdas.

# 03 — Temporizador del próximo evento

## Problema

El hero indica las fechas generales (14 y 15 oct), pero no comunica visualmente cuánto falta para la próxima jornada ni genera impacto inmersivo.

## Resultado

Un temporizador dinámico en el hero que cuenta el tiempo restante hacia la próxima jornada, cambia de etiqueta según la fase del evento y presenta un video de fondo en bucle (loop) para mayor dinamismo visual que se encuentra en el repositorio (/torama-hackathon/tandil_tech_week/Tandil Tech Week el 14 y 15 de octubre. Inscripciones abiertas en tandiltechweek.com ⚡️.mp4).

## Alcance

Reloj formato: días / horas / minutos / segundos.
Máquina de estados estricta según la fecha actual.
Fuente de verdad de fechas: content/evento.ts.
Video de fondo alojado localmente (servido desde la carpeta public/).
El countdown de inscripciones (#inscripciones) queda inalterado y aislado de este componente.

## Fuera de alcance

Cuenta regresiva por charla individual del cronograma.
Notificaciones push.
Sincronización NTP (Network Time Protocol) con el servidor. El cliente asume la hora del dispositivo tras la hidratación inicial.
Streaming del video (el video es un asset estático descargado e incluido en el repositorio).

## Historia

Como visitante, quiero ver cuánto falta para la próxima jornada sobre un fondo visualmente atractivo, para saber si el evento es ahora o todavía no, y sentir el clima del evento.

Nota para el agente: El componente debe consumir las fechas bajo una estructura similar a esta, garantizando que el offset -03:00 (ART) esté presente.
export const evento = {
  hackingDay: { inicio: "2026-10-14T09:00:00-03:00" },
  startupDay: { 
    inicio: "2026-10-15T09:00:00-03:00",
    fin: "2026-10-15T19:00:00-03:00" 
  }
};
## Estados

| Ahora | Etiqueta | Destino |
| --- | --- | --- |
| Antes del inicio de Hacking Day | “Hacking Day empieza en” | `hacking-day.inicio` |
| Desde el inicio de Hacking Day hasta antes de Startup Day | “Startup Day empieza en” | `startup-day.inicio` |
| Desde el inicio de Startup Day hasta su fin | “Startup Day está en curso” | sin dígitos, link a `#en-vivo` |
| Después del fin de Startup Day | “Nos vemos en la próxima edición” | sin dígitos |

Durante Hacking Day el temporizador apunta a Startup Day, que es el próximo evento. No se queda en cero mientras la jornada actual sigue.

## Comportamiento

Cálculo Inicial: El servidor calcula el estado con la hora de la request y manda la etiqueta + targetIso.

Tick del Cliente: El cliente, una vez montado, recalcula la diferencia cada 1000ms.

Formato: Dos dígitos obligatorios por unidad (ej. 05 min, 09 seg). Los días pueden superar los 99 sin romperse.

Transición sin recarga: Al cruzar el timestamp de un hito, la etiqueta cambia en ese mismo segundo en el cliente.

Comportamiento del Hero: El badge “Coming Soon” (si existe en el hero) se oculta automáticamente cuando el estado es “está en curso” o “nos vemos en la próxima edición”.

Video de Fondo: Se reproduce automáticamente sin sonido (autoplay muted loop playsinline) detrás del temporizador.

## UI

Ubicación: Bajo el claim del hero, arriba del marquee de tracks.

Grilla del Reloj: Cuatro celdas (Días, Horas, Min, Seg). En mobile, las cuatro celdas se agrupan en una sola fila (usar flex/grid responsivo).

Video de fondo:

Capa absoluta (position: absolute; z-index: -1; inset: 0;).

Ajuste de tamaño object-fit: cover.

Debe tener un overlay oscuro o gradiente (ej. bg-black/50) para garantizar el contraste y la legibilidad de los números blancos/claros del reloj.

Accesibilidad: Los números que cambian cada segundo deben tener aria-hidden="true" para no saturar lectores de pantalla, y proveer un texto alternativo oculto (ej. <span class="sr-only">Faltan 2 días y 4 horas para...</span>) que se actualice con menos frecuencia (ej. solo minutos).

## Técnico

Componente: Client Component `TemporizadorEvento`, con `"use client"`. Vive en el HTML del front (React Three Fiber en Vercel), no dentro del canvas de la red.

Manejo de Tiempos: targetIso siempre opera con el offset -03:00. Parsarlo como UTC/Epoch para comparaciones matemáticas matemáticas. No depender de la zona horaria del browser del usuario para la máquina de estados.

Hidratación: Usar suppressHydrationWarning en el nodo de los dígitos de segundos, ya que el milisegundo exacto diferirá entre el render de servidor y la hidratación del cliente.

Performance de Video:

Etiqueta HTML obligatoria: <video src="/assets/videos/hero-bg.mp4" autoplay loop muted playsinline disablePictureInPicture />.

El atributo playsinline es crítico para que no abra pantalla completa en iOS.

Usar un atributo poster="/assets/images/hero-bg-poster.jpg" para el primer paint mientras carga el video.

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

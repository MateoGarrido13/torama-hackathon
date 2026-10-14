# Especificación Técnica: 07 — Streaming en Vivo (#en-vivo)
> **Rol para el LLM ejecutor:** Eres un desarrollador frontend senior en Next.js y TypeScript. Tu tarea es implementar el componente y la lógica de la sección `#en-vivo` de la plataforma **Tandil Tech Week** siguiendo estrictamente las especificaciones, datos y restricciones técnicas detalladas en este documento.

---

## 1. Contexto del Proyecto y Stack

* **Framework:** Next.js (App Router) con TypeScript y Tailwind CSS.
* **Deploy:** Vercel.
* **Zona Horaria del Evento:** `America/Argentina/Buenos_Aires` (GMT-3). Todas las evaluaciones temporales deben calcularse contra este huso horario.
* **Ubicación en el sitio:** Sección con identificador y ancla `id="en-vivo"`, precedida por las secciones anteriores del sitio y seguida por el Footer.
* **Integración en Navbar:** El menú de navegación debe incluir de forma fija y permanente el ítem *"En vivo"* apuntando con scroll suave a `#en-vivo`.
* **Regla de oro de rendimiento:** No montar el `<iframe>` en el DOM a menos que la transmisión esté activa (`en vivo`). Evita precargas, consumo de datos y disparos de audio indeseados.

---

## 2. Modelos de Datos (`content/evento.ts`)

La sección depende de las jornadas y de la configuración del streaming definidas en `content/evento.ts`. El componente debe importar y tipar estos datos:

```ts
export type Jornada = {
  id: "hacking-day" | "startup-day";
  nombre: string;
  inicio: string; // ISO con offset -03:00 (ej: "2026-10-14T09:00:00-03:00")
  fin: string;    // ISO con offset -03:00 (ej: "2026-10-14T19:00:00-03:00")
  sede: string;
  track: string;
  descripcion: string;
};

export type Streaming = {
  titulo: string;
  // URL de embed (YouTube o Twitch). Cadena vacía ("") = señal no configurada.
  embedUrl: string;
  // URL directa de la transmisión externa (para abrir en pestaña nueva).
  verUrl: string;
};

// Datos compartidos del evento
export const streaming: Streaming = {
  titulo: "Transmisión Oficial — Tandil Tech Week",
  embedUrl: "[suspicious link removed]",
  verUrl: "[suspicious link removed]..."
};

export const jornadas: Jornada[] = [
  {
    id: "hacking-day",
    nombre: "Hacking Day",
    inicio: "2026-10-14T09:00:00-03:00",
    fin: "2026-10-14T19:00:00-03:00",
    sede: "Campus UNICEN",
    track: "Tech & Devs",
    descripcion: "..."
  },
  {
    id: "startup-day",
    nombre: "Startup Day",
    inicio: "2026-10-15T09:00:00-03:00",
    fin: "2026-10-15T19:00:00-03:00",
    sede: "Distrito Avellaneda",
    track: "Business & Startups",
    descripcion: "..."
  }
];
```

---

## 3. Máquina de Estados (Reloj + Configuración)

El estado no se determina únicamente por la hora ni únicamente por la presencia de la URL. Resulta del cruce de ambas variables:

| `embedUrl` | Reloj (`ahora` en GMT-3) | Estado Resultante | Render de la UI |
| :--- | :--- | :--- | :--- |
| Vacía (`""`) | Cualquier instante antes de `startupDay.fin` | **espera** | Copys de espera + Temporizador. `<iframe>` no existe en el DOM. |
| Con valor | Dentro de Hacking Day o Startup Day | **en vivo** | `<iframe>` 16:9 montado + botón "Ya estoy mirando". |
| Con valor | Fuera de las ventanas de las jornadas (previo al evento o noche intermedia) | **espera** | Copys de espera + Temporizador. `<iframe>` no se monta. |
| Cualquiera | Posterior al horario de `startupDay.fin` | **terminado** | Cartel de cierre de edición. Sin `<iframe>`. |

### Reglas Algorítmicas de Fecha:
1. **En jornada activa:**
   ```ts
   const estaEnJornada = jornadas.some((j) => {
     const tActual = new Date().getTime();
     return tActual >= new Date(j.inicio).getTime() && tActual <= new Date(j.fin).getTime();
   });
   ```
2. **Evento finalizado:**
   ```ts
   const startupDay = jornadas.find((j) => [enlace sospechoso eliminado] === "startup-day");
   const esFinDeEvento = startupDay ? new Date().getTime() > new Date(startupDay.fin).getTime() : false;
   ```

---

## 4. Comportamiento y Renderizado por Estado

### A. Estado: Espera (`espera`)
* **Encabezados:** Título de sección: *“En vivo”*. Subtítulo/bajada: *“La transmisión aparece acá cuando empiece la jornada”*.
* **Temporizador integrado:** 
  * Reutiliza la lógica de cuenta regresiva de la Spec 03 (días, horas, minutos, segundos hacia el inicio de la próxima jornada).
  * **Importante:** No debe renderizar enlaces redundantes hacia `#en-vivo` (el usuario ya se encuentra en esta sección).
* **Acceso alternativo:** Si `streaming.verUrl` no está vacía, mostrar un botón o enlace secundario que diga: *“Abrir la transmisión”* (`target="_blank"`, `rel="noopener noreferrer"`).
* **Seguridad:** El elemento `<iframe>` **no debe montarse ni existir en el DOM**.

### B. Estado: En Vivo (`en vivo`)
* **Reproductor:**
  * Debe renderizar un contenedor con relación de aspecto 16:9: `w-full aspect-video rounded-xl overflow-hidden shadow-2xl bg-black`.
  * `<iframe>` interno con:
    * `src={streaming.embedUrl}`
    * `title={streaming.titulo}`
    * `allow="autoplay; encrypted-media; picture-in-picture"`
    * `allowFullScreen`
    * `className="w-full h-full border-0"`
* **Sincronización de Audio (Spec 06):**
  * Como el reproductor es de origen cruzado (*cross-origin*), no se puede detectar confiablemente el play interno. Por ende:
    1. Al montarse el reproductor en el DOM (dentro de un `useEffect`), despachar el evento global:
       ```ts
       window.dispatchEvent(new CustomEvent('ttw-stream-play'));
       ```
    2. Colocar debajo del video un botón visible: *“Ya estoy mirando”*. Al hacer click en él, volver a despachar `ttw-stream-play` (sirve como respaldo si el navegador bloqueó el autoplay o el usuario reanudó la música ambiente).
* **Enlace de contingencia:** Mostrar bajo el video un enlace discreto: *“¿Problemas para ver el video? Abrir transmisión externa”* apuntando a `streaming.verUrl`.

### C. Estado: Terminado (`terminado`)
* **Mensaje:** *“La transmisión de esta edición terminó”*.
* Subtexto de agradecimiento o invitación a seguir las redes del evento.
* No se monta ningún `<iframe>` ni temporizador.

---

## 5. Requerimientos Técnicos para Next.js (App Router)

1. **Client Component:** El componente raíz (`StreamingSection.tsx`) debe incluir la directiva `'use client'` al inicio del archivo, ya que maneja reloj dinámico (`setInterval`), ciclo de vida de componentes (`useEffect`) y eventos del DOM (`window.dispatchEvent`).
2. **Prevención de Hydration Mismatch:**
   * Al usar la hora del sistema (`new Date()`), el renderizado inicial en el servidor puede diferir del cliente.
   * Se debe implementar un estado de control de montaje (`const [mounted, setMounted] = useState(false);`) para renderizar un skeleton o estado estático seguro en el primer paint antes de sincronizar con el reloj real.
3. **Intervalo de Actualización:**
   * Usar un `setInterval` cada 1000 ms para recalcular el estado y los dígitos del temporizador sin requerir recargas de página al cruzar un hito de hora.
4. **Accesibilidad (a11y) y Enlaces Externos:**
   * El `<iframe>` debe contar siempre con un atributo `title` descriptivo.
   * Todos los enlaces que apunten a `verUrl` deben llevar obligatoriamente `target="_blank"` y `rel="noopener noreferrer"`.
5. **Estilos y Responsividad:**
   * Usar clases de Tailwind CSS.
   * En dispositivos móviles, el reproductor debe extenderse de borde a borde dentro del padding estructural de la sección.

---

## 6. Criterios de Aceptación (Definición de Terminado)

1. **Sin URL:** Con `embedUrl: ""` y fecha previa al fin del evento, se muestra el estado de espera y el DOM está libre de etiquetas `<iframe>`.
2. **Transmisión activa:** Con `embedUrl` válida y fecha dentro del rango `[inicio, fin]` de Hacking Day o Startup Day, se monta el `<iframe>` ocupando el ancho del contenedor en proporción 16:9.
3. **Fuera de jornada:** Con `embedUrl` configurada pero fecha fuera de los horarios de las jornadas, el sistema permanece en estado de espera sin montar el reproductor.
4. **Fin de evento:** Superada la fecha y hora de `startupDay.fin`, la sección muestra exclusivamente el estado terminado.
5. **Silenciado de ambiente:** Tanto el montaje del video como el click en *“Ya estoy mirando”* emiten correctamente el evento `ttw-stream-play` en `window`.
6. **Navegación:** El ítem *"En vivo"* en el Navbar dirige al ancla `#en-vivo` con desplazamiento suave.
7. **Respaldo de señal:** Si `verUrl` está definida, es accesible mediante enlaces con apertura en nueva pestaña; si está vacía, dichos botones se ocultan sin desalinear la UI.
```
# Capturar y enviar datos

Insertar dentro de `FormularioMesa`, arriba del `return`:

```tsx
const manejarEnvio = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault(); // Evita que la página se recargue
  setEstado('cargando');

  // Extraemos todos los datos del formulario de una sola vez
  const formData = new FormData(e.currentTarget);
  const datos = Object.fromEntries(formData.entries());

  try {
    const respuesta = await fetch('/api/conexiones', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
    });

    // Manejo del caso borde de tu spec: LinkedIn duplicado
    if (respuesta.status === 409) {
      alert('Este perfil de LinkedIn ya está registrado en la red.');
      setEstado('error');
      return;
    }

    if (respuesta.ok) {
      setEstado('exito');
      e.currentTarget.reset(); // Limpia los inputs para un nuevo registro
    } else {
      setEstado('error');
    }
  } catch (error) {
    console.error('Error enviando datos:', error);
    setEstado('error');
  }
};
```

# Diseño técnico — Audio accesible transversal con Piper

**Estado:** propuesta de implementación, pendiente de integración y pruebas de runtime.  
**No afirmar soporte de lectura total hasta que los criterios de aceptación pasen.**

## Objetivo

Unificar la reproducción de pistas Piper pre-generadas y la futura síntesis de texto dinámico mediante una sola interfaz de usuario, sin depender de que cada página implemente su propio reproductor.

## Contrato de producto

El usuario debe poder:
- Escuchar la página o el bloque principal que seleccionó.
- Ver el título del contenido y el estado de reproducción.
- Pausar, reanudar y detener.
- Cambiar de página sin audio duplicado ni reproducción huérfana.
- Usar teclado, lector de pantalla y controles táctiles.
- Continuar leyendo aunque el audio no esté disponible.

La interfaz debe diferenciar:
- **Audio del catálogo:** pista pregrabada asociada a un ID de contenido.
- **Lectura sintetizada:** voz generada a partir del texto actual.
- **Sin audio disponible:** no hay proveedor compatible; no se debe simular éxito.

## Arquitectura recomendada

### 1. AudioProvider / AudioController

Un controlador único a nivel de aplicación debe gestionar estado y ciclo de vida:
- `idle`, `loading`, `playing`, `paused`, `error`.
- `playCatalogItem(id, kind)` para usar el manifiesto.
- `speakText(text, options)` para el proveedor runtime, solo cuando esté habilitado.
- `pause()`, `resume()`, `stop()` y `dispose()`.
- Cancelar cualquier pista anterior antes de iniciar otra.
- Liberar objetos `Audio`, URL temporales y listeners al desmontar.
- Evitar almacenar el texto leído en logs, telemetría o caché no necesaria.

### 2. Resolución de contenido

El lector debe recibir el contenido explícitamente desde el componente o una región accesible; no rastrear indiscriminadamente toda la página y leer navegación, botones, menús o contenido duplicado.

Orden de resolución:
1. Si el bloque tiene ID conocido y una pista válida en `recoveryPiperAudioManifest`, reproducirla.
2. Si el bloque contiene texto dinámico y existe un proveedor runtime permitido, sintetizarlo.
3. Si no hay proveedor, comunicar «La lectura en voz no está disponible para este contenido» y conservar texto accesible.

No reproducir automáticamente audio al entrar en una página. Requerir una acción del usuario.

### 3. Síntesis runtime

Antes de elegir implementación, decidir y documentar una de estas modalidades:
- **Local en dispositivo:** mayor privacidad potencial, pero debe medirse tamaño, compatibilidad y rendimiento.
- **Servidor propio:** permite centralizar Piper; requiere autenticación o límites de abuso, límites de longitud, control de carga, caché segura, eliminación de temporales, CORS restringido y política explícita de retención cero para textos personales.
- **Solo catálogo estático:** opción válida para el MVP inicial; declarar claramente qué contenido tiene audio y no prometer lectura arbitraria.

No se debe desplegar un endpoint de síntesis público sin protección contra abuso y límites de recursos.

### 4. Segmentación de textos largos

El límite de 16 segundos no debe corregirse cortando palabras al azar ni concatenando frases sin control.

- Dividir el texto por encabezados, párrafos y límites de oración.
- Aplicar un límite configurable por segmento, determinado por pruebas con el motor.
- Mantener una cola secuencial con cancelación.
- Mostrar progreso por bloque y permitir saltar al siguiente.
- No afirmar que una pista pregrabada lee el texto completo si su guion difiere de la página.
- Evitar fragmentos extremadamente breves que degraden la prosodia; evaluar inteligibilidad en español colombiano.

### 5. Accesibilidad

- Botones con nombres accesibles y estado anunciado.
- Indicador de progreso que no fuerce anuncios constantes a lectores de pantalla.
- Foco de teclado visible y orden de tabulación lógico.
- Contraste conforme a WCAG 2.2 AA donde sea aplicable.
- Respetar movimiento reducido; el audio siempre se inicia mediante acción explícita.
- No ocultar texto porque exista audio.
- Permitir parar de inmediato, incluidos cambios de ruta y cierre del componente.

## Seguridad y privacidad

- No enviar textos de diarios, perfiles o datos de recuperación a terceros por defecto.
- No guardar texto personal en registros de servidor.
- Limitar duración, tamaño, concurrencia y frecuencia si hay API.
- Validar tipos de contenido y respuestas; manejar timeout y desconexión.
- No confiar en un nombre de voz proporcionado por el cliente sin una lista permitida.
- Documentar licencia y origen del modelo Piper y de sus voces.
- Usar caché solo para contenido público o con reglas explícitas de privacidad.

## Pruebas obligatorias

1. Reproducir una pista válida del manifiesto.
2. Manifiesto sin ID y archivo 404: error entendible, sin romper página.
3. Pausar y reanudar.
4. Detener y cambiar de ruta.
5. Lanzar segunda lectura mientras la primera está activa: nunca deben sonar dos fuentes.
6. Texto largo con signos, tildes, saltos de línea y párrafos.
7. Texto vacío y texto que supera el límite.
8. Fallo del motor, timeout y desconexión.
9. Navegación con teclado y lector de pantalla.
10. Modo offline con pista cacheada y sin pista cacheada.
11. Comprobar que no se envía texto sensible a un servicio externo.
12. Confirmar que los controles de lectura visibles siempre tienen un resultado real.

## Plan incremental de entrega

**Fase A — Integridad del catálogo:** validar que cada ruta del manifiesto existe, que los audios no están vacíos y que la duración/guion corresponde al contenido anunciado.

**Fase B — Reproductor único:** un controlador compartido y un componente reutilizable; mantener el audio estático como proveedor por defecto.

**Fase C — Lectura de contenido dinámico:** solo después de escoger el modelo de ejecución y completar análisis de privacidad y seguridad.

**Fase D — Experiencia larga:** cola de segmentos, progreso, cancelación y pruebas de accesibilidad.

**Fase E — Release:** validación, build, pruebas en dispositivos reales y revisión del comportamiento offline antes del despliegue.

## Criterio de cierre

No declarar «Piper lee toda la página» hasta que se pruebe en cada tipo de página y contenido dinámico. El MVP puede lanzarse con audio de catálogo si el alcance se comunica con honestidad y el texto permanece siempre disponible.

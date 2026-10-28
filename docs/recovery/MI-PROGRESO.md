# Mi progreso: experiencia de uso cotidiano

**Propósito:** una herramienta psicoeducativa práctica para elegir un siguiente paso, acceder a actividades y encontrar apoyo. No es un sistema diagnóstico ni una intervención clínica validada.

## Diferencia entre Inicio y Mi progreso

- **Inicio** presenta BLUMHELPS y orienta a las secciones disponibles.
- **Mi progreso** no replica la portada ni usa otro hero ilustrado. Funciona como un panel operativo: pregunta qué ayudaría hoy, muestra el plan cotidiano y ofrece cuatro accesos contextuales (ruta de 24 horas, Voz, brújula de valores y recursos).
- Las prácticas guiadas permanecen como una sección opcional. No es necesario completar actividades para acceder a otros apoyos.

## Estructura actual

1. **Tu paso de hoy:** reutiliza el componente `TodayPlan`, el motor local de recomendaciones y la voz disponible. Permite reconocer una acción voluntariamente.
2. **Accesos de continuidad:** lleva a `/ruta`, `/voz`, `/recuperacion/valores` y `/ayuda`.
3. **Prácticas breves:** reutiliza `MiProcesoExperience`; las elecciones dentro de una práctica son temporales.
4. **Apoyo humano:** muestra opciones de orientación 106, emergencias 123 y ayuda para familiares.
5. **Fuentes y límites:** enlaces públicos de SAMHSA y OMS; la interfaz aclara que las referencias no validan clínicamente la aplicación.

## Principios de diseño

- Una tarea principal visible en vez de varios mensajes de portada que compiten.
- Lenguaje directo y pocos pasos, especialmente para uso móvil.
- No hay rachas obligatorias, castigos por días sin actividad ni puntuaciones clínicas.
- La persona puede elegir un paso diferente, detenerse o volver más tarde.
- Contraste, foco de teclado, diseño adaptable y respeto por `prefers-reduced-motion`.
- Los datos guardados localmente deben describirse con precisión: algunas marcas se guardan en el navegador, pero eso no equivale a una garantía de privacidad integral de todos los servicios de la web.

## Privacidad y seguridad

- `TodayPlan` almacena la fecha local y los identificadores marcados, usando `blumhelps.mi-progreso.daily.v1`.
- `MiProcesoExperience` almacena identificadores de actividades completadas en `blumhelps.mi-proceso.progress.v1`.
- Las selecciones efímeras de los ejercicios no se registran en esas claves.
- La brújula usa el almacenamiento local ya existente de `recoveryStorage`.
- Si el navegador no permite leer o guardar, la interfaz debe explicar la limitación y evitar afirmar que los cambios persistieron.
- El contenido digital es orientación psicoeducativa; no sustituye valoración profesional ni atención de emergencias.

## Criterios de aceptación antes de publicación

- [ ] El encabezado de Mi progreso no repite el hero de Inicio.
- [ ] La persona identifica la acción de hoy sin tener que completar una configuración previa.
- [ ] Los cuatro accesos abren las rutas correctas desde el escritorio y el móvil.
- [ ] Las actividades opcionales pueden abrirse, completarse y cerrarse.
- [ ] Las marcas se conservan al recargar cuando el almacenamiento está disponible.
- [ ] Si se deniega el almacenamiento, la interfaz explica el límite.
- [ ] El contenido puede recorrerse con teclado y las preferencias de movimiento reducido son respetadas.
- [ ] Las referencias se distinguen de la validación clínica, que no se afirma.
- [ ] La compilación y validadores de proyecto pasan en GitHub Actions.

## Referencias de enfoque

- [SAMHSA — About Recovery](https://www.samhsa.gov/substance-use/recovery/about): recuperación personal y multidimensional; admite diferentes caminos y reconoce que los retrocesos forman parte de la vida.
- [OMS — mhGAP, tercera edición](https://www.who.int/publications/i/item/9789240084278): guía basada en evidencia para condiciones mentales, neurológicas y por consumo de sustancias.

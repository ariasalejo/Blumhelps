# Mi progreso: experiencia de acompañamiento

**Estado:** experiencia web psicoeducativa; no es un producto clínico validado.

## Propósito

Mi progreso debe ayudar a convertir una intención en una acción pequeña y posible, sin tratar el avance como una carrera ni reducir la recuperación a un puntaje. La persona conserva el control de su recorrido, puede adaptar una actividad, descansar y volver más tarde.

## Recorrido de la página

1. **Orientación:** una portada accesible presenta el principio «Pausa · Elige · Intenta · Reconoce» y enlaza con las acciones centrales.
2. **Acción cotidiana:** `TodayPlan` ofrece la recomendación local existente, opciones alternativas, reproducción de audio local cuando existe y reconocimiento voluntario del paso.
3. **Dimensiones de vida:** salud, hogar/estabilidad, propósito/oportunidades y vínculos/comunidad enlazan a módulos existentes. No son niveles ni resultados clínicos.
4. **Brújula de valores:** se puede definir o revisar sin que sea requisito para empezar. El indicador de congruencia es una reflexión exploratoria, no un diagnóstico ni una medida de recuperación.
5. **Prácticas:** pausa guiada, un paso posible y lectura breve, todas opcionales.
6. **Apoyo y seguridad:** recursos de ayuda, orientación para familiares, Línea 106 y emergencias 123.
7. **Transparencia:** se enlazan referencias públicas de SAMHSA y OMS y se explicita el alcance no clínico.

## Privacidad implementada en este flujo

- Las actividades de Mi proceso registran únicamente identificadores completados en `localStorage`, con la clave `blumhelps.mi-proceso.progress.v1`.
- Mi progreso diario guarda la fecha local y los identificadores de las acciones marcadas en `localStorage`, con la clave `blumhelps.mi-progreso.daily.v1`.
- Las elecciones temporales dentro de una práctica no se persisten en estas claves.
- La brújula emplea el almacenamiento local del módulo `recoveryStorage`.
- Si el navegador deniega el almacenamiento, la interfaz intenta seguir disponible y comunica el límite cuando puede detectarlo.
- No debe afirmarse privacidad integral de toda la aplicación sin auditar también telemetría, hosting, recursos externos y otros módulos.

## Límites de seguridad y producto

- No hay puntuaciones de salud, diagnóstico, pronóstico ni garantías de recuperación.
- Las recomendaciones del plan siguen procediendo del motor local existente; la interfaz no debe afirmar que usa IA neuronal si no se ha implementado y evaluado un modelo.
- La orientación digital no reemplaza valoración profesional, tratamiento ni apoyo de emergencia.
- No inventar convenios, descuentos, tratamientos ni disponibilidad de recursos.
- La Línea 106 es orientación en salud mental. Ante peligro inmediato o una emergencia médica en Colombia, llamar al 123 o acudir a urgencias.

## Criterios de aceptación manual

- [ ] La página se puede recorrer con teclado; el foco es visible y los enlaces tienen texto comprensible.
- [ ] El diseño funciona en móvil, tableta y escritorio sin desbordamiento horizontal.
- [ ] Con preferencias de movimiento reducido, no hay animaciones necesarias para entender el contenido.
- [ ] Con la brújula vacía, la persona puede comenzar sin configurarla.
- [ ] Una actividad o un paso pueden marcarse como realizados y su estado se conserva al recargar cuando el almacenamiento está disponible.
- [ ] Un nuevo día local reinicia únicamente el conteo diario de `TodayPlan`, sin borrar la biblioteca de actividades completadas.
- [ ] Si `localStorage` falla, no se afirma que el progreso quedó persistido.
- [ ] Los enlaces internos abren módulos existentes y los de fuentes externas abren su destino institucional.
- [ ] La sección de emergencia presenta claramente 106 (orientación) y 123 (emergencias), sin sugerir que BLUMHELPS presta esos servicios.
- [ ] El build de producción de Vite y TypeScript pasa en CI.

## Referencias públicas del enfoque

- [SAMHSA — About Recovery](https://www.samhsa.gov/substance-use/recovery/about)
- [OMS — mhGAP, tercera edición](https://www.who.int/publications/i/item/9789240084278)
- [OMS — Doing What Matters in Times of Stress](https://www.who.int/publications/i/item/9789240003927)
- [Ministerio de Salud de Colombia — Línea 106](https://www.minsalud.gov.co/salud/publica/salud-mental/Paginas/linea-106.aspx)

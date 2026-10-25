# BLUMHELPS — Auditoría de producto y plan de endurecimiento MVP

**Fecha:** 2026-10-24  
**Rama de trabajo:** `feat/mvp-piper-production-audit`  
**Backup Git de referencia:** `backup/pre-audit-2026-10-24`  
**Alcance:** revisión estática del repositorio web visible en GitHub. No equivale a una prueba ejecutada en un entorno local ni a una certificación de producción.

## Resumen ejecutivo

BlumHelps ya contiene una base real: React + TypeScript + Vite, Tailwind, navegación por rutas, PWA, pantallas de recuperación, oportunidades y apoyo familiar, controles de accesibilidad, scripts de validación y generación de audio Piper. La prioridad no es reescribirlo desde cero ni inflar archivos a miles de líneas; es convertir esas piezas en un recorrido fiable que ayude a una persona a pasar de una necesidad concreta a un siguiente paso verificable.

## Evidencias y hallazgos

1. `src/App.tsx` conecta Inicio, Perfil, Recuperación, Valores, Ciencia e impacto, Ayuda, Familiares y Oportunidades.
2. `src/main.tsx` llama a `disableBrowserTts()` durante el arranque.
3. `src/lib/recovery/disableBrowserTts.ts` desactiva `speechSynthesis` cuando el navegador permite sobrescribir esos métodos. Sus comentarios indican que el texto personalizado no tiene TTS en tiempo de ejecución por privacidad.
4. `scripts/tts/generate_catalog_audio_piper.py` y `src/data/recovery/piperAudioManifest.ts` muestran una canalización de audio Piper pre-generado para elementos del catálogo de recuperación. Esto no demuestra que toda la página, cada tarjeta o el texto generado por el usuario tengan audio disponible.
5. El manifiesto referencia la voz `es_MX-claude-high`; hay que confirmar la procedencia, licencia, variante dialectal y redistribución del modelo antes de publicar audios.
6. El `README.md` declara que el catálogo de ejemplo puede incluir recursos ficticios de demostración y que no deben presentarse como ofertas reales verificadas. Esa advertencia debe seguir siendo visible en producto.
7. El árbol raíz incluye `node_modules` versionado. Antes de eliminarlo, evaluar su impacto, el historial y el tamaño; no hacer limpieza destructiva como parte de esta auditoría.
8. El proyecto declara que la información guardada en el navegador no constituye una bóveda cifrada. No etiquetar datos locales como cifrados ni prometer privacidad que la implementación no ofrezca.
9. Hay scripts `validate`, `build` y `check` en `package.json`, pero esta auditoría remota no los ejecutó. El estado de pruebas de producción permanece pendiente de ejecución reproducible.

## Prioridades de producto

### P0 — Confianza, privacidad y seguridad
- Mantener la distinción visual entre recursos verificados, no verificados y demostrativos.
- Mostrar fecha de última verificación, entidad responsable, requisitos, coste, territorio, vigencia y enlace de origen cuando esos datos existan.
- No inventar empleos, subsidios, descuentos, convenios, citas, ingresos ni disponibilidad.
- Mantener datos sensibles fuera de analítica y de servicios externos por defecto.
- Revisar seguridad de enlaces externos, política de contenido, CSP, CORS, encabezados y almacenamiento antes de declarar producción.

### P0 — Recorrido centrado en necesidades
- Ofrecer un selector claro de necesidad: bienestar, apoyo urgente, formación, empleo/ingresos, familia o comunidad.
- Convertir cada elección en una secuencia: necesidad → requisitos → opciones reales → acción concreta → seguimiento voluntario.
- Permitir guardar opciones localmente con una explicación honesta de dónde se almacenan.
- No convertir recaídas o interrupciones en puntuaciones punitivas ni en etiquetas clínicas.

### P0 — Piper como capacidad transversal accesible
- Crear una interfaz única de audio accesible para texto elegible de la página, no reproductores aislados por cada sección.
- Dar controles visibles: escuchar, pausar, continuar, detener, velocidad si el motor lo soporta, progreso, texto equivalente y estado de carga/error.
- Usar el manifiesto de audio estático cuando exista coincidencia exacta; no fingir que un fragmento de audio representa contenido que no lee.
- Para contenido dinámico o personalizado, escoger explícitamente entre: síntesis local en el dispositivo, servicio propio con consentimiento informado, o fallback sin audio. No enviar texto sensible a terceros silenciosamente.
- Si Piper solo corre durante generación de archivos en build, no prometer TTS ilimitado en runtime. Para síntesis runtime hace falta una implementación ejecutable y mantenida en cliente/servidor, además de límites, cancelación, caché, seguridad y pruebas.
- No parchear globalmente `speechSynthesis` sin asegurar que todos los controles visibles tienen un proveedor alternativo funcional.

### P1 — Experiencia visual premium con utilidad
- Mantener una identidad coherente: tipografía legible, escala de espacios, superficies, estados, contraste, iconografía y movimiento discreto.
- Usar Bento Grid solo para priorizar acciones y necesidades; evitar tarjetas decorativas que oculten el siguiente paso.
- Diseñar mobile-first y para conexiones lentas; respetar `prefers-reduced-motion`, teclado, foco visible, zoom y lectores de pantalla.
- Cada tarjeta de oportunidad debe responder: qué es, para quién, requisitos, coste, territorio, verificación y siguiente acción.

### P1 — Oportunidades e ingresos con integridad
- Clasificar formación gratuita, orientación laboral, vacantes verificadas, emprendimiento y ayudas públicas por separado.
- No mostrar promesas de ingresos ni beneficios garantizados.
- Medir resultados útiles con métricas agregadas y respetuosas: clics a fuentes oficiales, pasos completados voluntariamente, recursos revisados y tasa de enlaces rotos; no monetizar datos sensibles.

## Plan de implementación sugerido

1. Congelar el estado base con backup y anotar el SHA de referencia.
2. Ejecutar `npm ci`, `npm run validate`, `npm run build` y pruebas de navegación en una copia local limpia.
3. Auditar las pantallas y localizar el punto de entrada real del reproductor Piper, su manifiesto y las rutas de contenido.
4. Implementar el proveedor de audio como componente reutilizable, con fallback explícito y sin bloquear contenido si falla.
5. Añadir pruebas para lectura larga, cambio de ruta, pausa/reanudación, cancelación, contenido dinámico, navegación por teclado y preferencias de movimiento.
6. Mejorar el flujo de necesidades y el esquema de verificación de recursos sin fabricar datos.
7. Revisar dependencias, `node_modules`, artefactos grandes y secretos antes de cualquier limpieza.
8. Ejecutar CI, revisar accesibilidad y rendimiento, abrir PR y desplegar solo después de aprobar las verificaciones.

## Criterios de aceptación MVP

- Ninguna oferta demostrativa se presenta como real/verificada.
- Todas las áreas principales permiten encontrar un siguiente paso claro.
- El audio nunca bloquea la lectura, no se superpone al cambiar de página y puede detenerse de inmediato.
- El lector comunica si el contenido completo está disponible o si solo hay una pista pregrabada.
- La ausencia o fallo de Piper no rompe navegación ni contenido.
- La aplicación respeta teclado, lectores de pantalla, contraste y movimiento reducido.
- La compilación y validaciones pasan en CI reproducible.
- No se declara “producción” hasta completar pruebas y revisar despliegue, privacidad y seguridad.

## Límites de esta auditoría

Esta revisión se basa en los archivos accesibles desde GitHub. No se ejecutó la aplicación, no se inspeccionó un despliegue vivo, no se verificó el contenido binario de todos los MP3 ni se probó el modelo Piper en tiempo real. Los hallazgos deben validarse con ejecución local y pruebas de usuario.

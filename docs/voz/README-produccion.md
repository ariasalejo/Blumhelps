# BLUM Voz — estándar de producción de episodios largos

## Objetivo editorial
Cada episodio largo debe durar aproximadamente 25–32 minutos contando narración pausada, ejercicios guiados y silencios intencionales. No se etiquetará como «30 minutos» solo por el título: la duración final se comprobará con el MP3 generado.

## Convenciones de guion
- La voz principal se identifica como **ANFITRIONA** o **ANFITRIÓN** y habla con tono cálido, natural y no clínico.
- Las intervenciones de invitados se marcan **INVITADO** y se sintetizan en una pasada independiente con un modelo Piper masculino disponible. Después se ensamblan las pistas; no se imita a una persona real.
- Las acotaciones entre corchetes no se leen en voz alta: son instrucciones de producción.
- Los silencios deben implementarse como pausas reales en la edición, no pronunciando «pausa».
- Se ofrece orientación psicoeducativa, no diagnóstico ni sustitución de tratamiento. No se promete que una técnica funcione para todo el mundo.
- En temas de sueño, respiración y salud se evitan afirmaciones absolutas. Si el problema persiste o afecta la vida diaria, se recomienda consultar a un profesional.
- Cada episodio debe incluir: bienvenida, objetivo, explicación sencilla, ejemplo cotidiano, diálogo invitado, práctica guiada, plan pequeño, resumen, límites y despedida.

## Flujo de producción local
1. Revisar el guion y confirmar que las fuentes y afirmaciones estén verificadas.
2. Generar por segmentos con Piper. La voz principal y el invitado se sintetizan por separado, cada uno con su modelo local.
3. Añadir pausas y normalizar audio; ensamblar con FFmpeg.
4. Escuchar el MP3 completo, revisar pronunciación de siglas y duración real.
5. Actualizar el manifiesto de audio únicamente cuando el archivo exista y haya pasado revisión.
6. Ejecutar `npm run validate` y `npm run build` antes de integrar.

## Catálogo editorial — títulos ampliados propuestos
1. **Las etapas del cambio, sin juicios** — entender la ambivalencia y avanzar al propio ritmo.
2. **La ambivalencia no es resistencia** — escuchar las dos partes internas sin entrar en guerra contigo.
3. **El craving como una ola** — comprender la urgencia y crear un espacio antes de actuar.
4. **Surfear el craving durante ocho minutos** — práctica guiada de observación, anclaje y elección segura.
5. **Activación conductual: el primer paso pequeño** — recuperar movimiento cuando la motivación todavía no llega.
6. **Plan de una sola acción** — convertir una intención en un paso concreto, posible y medible.
7. **Respiración de anclaje 4-7-8** — una pausa opcional, sin forzar ni perseguir un resultado perfecto.
8. **Escaneo corporal: escuchar sin juzgar** — reconocer sensaciones y volver al entorno si aparece malestar.
9. **Defusión cognitiva: no eres cada pensamiento** — notar la mente sin obedecer automáticamente cada mensaje.
10. **Tus valores como brújula** — transformar lo importante en decisiones cotidianas.
11. **Higiene del sueño: construir una rutina que sí quepa en tu vida** — hábitos realistas, expectativas flexibles y cuándo pedir ayuda.
12. **Una llamada de apoyo: pedir compañía sin disculparte por existir** — preparar una petición clara y segura.
13. **Mapa de tu red de apoyo** — distinguir personas seguras, apoyos comunitarios y ayuda profesional.
14. **Plan de prevención de recaídas** — detectar señales tempranas y decidir qué hacer antes del momento difícil.
15. **Una recaída no define tu historia** — responder con seguridad, aprender y reconectar con apoyos.
16. **Regular una emoción como una ola** — observar, nombrar y elegir una respuesta con más margen.
17. **Pedir ayuda con claridad** — expresar una necesidad, poner límites y preparar una alternativa.
18. **Autocompasión: cambiar el tono de tu voz interna** — sustituir el castigo por responsabilidad y cuidado.
19. **Señales de alerta tempranas** — identificar cambios personales y activar un plan de apoyo.
20. **El jardín de tu progreso** — reconocer avances pequeños y mantener expectativas humanas.

Este documento establece el estándar y el mapa editorial. No significa que los 20 guiones largos o sus nuevos MP3 ya estén terminados. Cada episodio debe pasar por producción y revisión individual antes de publicarse.
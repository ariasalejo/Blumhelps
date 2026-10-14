# Cierre responsable de BlumHelps: criterios de producto y entrega

Actualizado: 2026-10-14

## Propósito de esta entrega

BlumHelps acompaña la organización personal y facilita encontrar fuentes fiables en Colombia. No es un tratamiento, prestador sanitario ni servicio de emergencia. La app debe ayudar a dar el siguiente paso sin juzgar ni prometer resultados clínicos.

## Decisiones de producto

1. **Victoria temprana:** encontrar un recurso confiable, guardarlo mentalmente o en el flujo de la app y convertirlo en un paso práctico.
2. **Primero apoyo fiable:** priorizar recursos oficiales de salud, formación y empleo sobre gamificación o funciones de IA.
3. **Progreso sin castigo:** no usar rachas punitivas, vergüenza, ni perder logros por recaídas o pausas.
4. **Privacidad por defecto:** no exigir cuenta ni recoger cédula, ubicación precisa, historia clínica, consumo detallado ni contactos para usar funciones básicas.
5. **Financiación transparente:** no publicar incentivos hasta verificar financiador, fondos, reglas, elegibilidad, cupos y entrega; no compartir datos individuales con patrocinadores.
6. **Fuentes con contexto:** una URL oficial no garantiza que haya cupo, atención inmediata, elegibilidad ni financiación.

## Modelo de verificación de recursos

Cada recurso publicado debe documentar:
- entidad y URL oficial;
- jurisdicción y población atendida;
- fecha de última revisión y responsable;
- requisitos, costos, horarios o fechas límite cuando la fuente los publique;
- estado: `VERIFIED_ACTIVE`, `PENDING_RECHECK` o `HISTORICAL`;
- limitaciones y aviso de que el usuario debe confirmar directamente.

Una convocatoria cerrada debe marcarse como histórica, no promocionarse como oportunidad vigente. Los enlaces oficiales también pueden fallar o cambiar.

## Experiencia visual y accesibilidad

La pantalla de inicio ya integra una ilustración local `blumhelps_hero_art`; mantenerla empaquetada en la app evita solicitudes remotas de imagen y funciona sin conexión. No reutilizar imágenes de terceros sin comprobar licencia.

Criterios para cada pantalla:
- texto legible sobre imagen mediante una capa de contraste;
- composición adaptable a pantallas estrechas y fuente ampliada;
- controles accesibles con TalkBack y nombres comprensibles;
- no depender solo del color o de iconos para comunicar estados;
- mensajes empáticos y no estigmatizantes;
- probar contraste, orden de foco, objetivos táctiles y navegación con lector de pantalla.

La guía oficial de Android recomienda combinar pruebas manuales con TalkBack, herramientas de análisis y pruebas automatizadas de Compose.

## Seguridad y privacidad: controles de lanzamiento

- Validar enlaces externos como HTTPS, con host válido y sin credenciales incrustadas.
- Capturar errores al abrir enlaces; no bloquear la aplicación por falta de navegador.
- Evitar notas sensibles en logs, portapapeles, notificaciones y analítica.
- Revisar si el backup del sistema puede copiar información sensible.
- Mantener datos personales locales y mínimos; cualquier sincronización futura requiere diseño de amenazas, consentimiento y controles de borrado.
- Revisar dependencias, permisos y contenido de la APK antes de distribuir.

Referencia técnica: OWASP MASVS Storage y Privacy.

## Alcance finito de aceptación

La entrega se considera candidata a prueba, no producto clínicamente validado, cuando:
- Gradle unit tests y compilación de APK pasan en CI;
- se comprueba creación/edición de tareas y hábitos y persistencia esperada;
- los enlaces inválidos se rechazan y los fallos de apertura se manejan;
- los recursos no se presentan como activos si están cerrados o pendientes de revisión;
- se revisan diseño responsive, fuente ampliada y TalkBack en dispositivo;
- cada APK tiene commit de origen, workflow, artefacto y checksum documentados;
- las limitaciones clínicas, territoriales y de disponibilidad se comunican con claridad.

## Fases siguientes

1. Cerrar errores de compilación, navegación y enlaces.
2. Completar prueba manual de accesibilidad y seguridad en dispositivo.
3. Validar el catálogo con una persona revisora y fuentes oficiales.
4. Hacer un piloto pequeño con consentimiento, personas con experiencia vivida y profesionales; no afirmar eficacia clínica sin evaluación.
5. Explorar fundaciones, universidades y convocatorias solo tras confirmar elegibilidad, fechas, entidad postulante y condiciones en sus páginas oficiales.

## Fuentes de referencia

- OMS/UNODC, estándares internacionales de tratamiento: https://www.who.int/publications/i/item/international-standards-for-the-treatment-of-drug-use-disorders
- Ministerio de Salud de Colombia, políticas de salud mental y SPA: https://www2.minsalud.gov.co/salud/publica/SMental/Paginas/Politicas-Salud-Mental-y-SPA.aspx
- OWASP MASVS Storage: https://mas.owasp.org/MASVS/05-MASVS-STORAGE/
- OWASP MASVS Privacy: https://mas.owasp.org/MASVS/12-MASVS-PRIVACY/
- Android Compose, pruebas de accesibilidad: https://developer.android.com/develop/ui/compose/accessibility/testing?hl=es
- MinCiencias, convocatorias oficiales: https://minciencias.gov.co/convocatorias/TODAS

La inclusión en esta lista no significa que una entidad avale BlumHelps. Las convocatorias y los servicios deben volver a verificarse justo antes de anunciarse o postular.

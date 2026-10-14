# Decisiones Técnicas y de Privacidad — BlumHelps (RFC)

Fecha: 2026-10-14
Repositorio: ariasalejo/Blumhelps

Resumen
-------
Documento de decisiones técnicas y de privacidad para la primera fase del producto: Planner & Opportunities Hub orientado a Colombia, con principios aplicables al producto hermano BlumTherapy. Incluye criterios de aceptación, prioridades de desarrollo y fuentes verificadas.

Principios clave
----------------
1. Privacidad por diseño: almacenamiento local por defecto; no exigir cuenta para uso básico.
2. Minimizar la recopilación: no pedir cédula, cuentas bancarias, NIS, historias clínicas ni identificadores sensibles.
3. Verificabilidad de fuentes: cada recurso institucional debe incluir sourceUrl, sourceUpdatedAt, verifiedAt y estado (VERIFIED_ACTIVE, PENDING_RECHECK, CLOSED, HISTORICAL, UNVERIFIED).
4. Consentimiento y permisos: notificaciones (POST_NOTIFICATIONS) y TTS opt-in (activar TTS por primera vez con explicación clara).
5. Offline-first: funcionalidades de planner/hábitos deben funcionar sin red.
6. Accesibilidad: semánticas Compose y textos adecuados para TalkBack; no depender solo del color.

MVP — Alcance técnico (prioridad alta a baja)
--------------------------------------------
1. Persistencia local: Room para PlannedAction, HabitDefinition, HabitCheckIn, OfficialOpportunity, PersonalOpportunityProgress. (PRIORIDAD: Alta)
2. DataStore para preferencias: idioma, zona horaria, notificaciones, TTS habilitado. (Alta)
3. Pantallas principales: Today/Home, Planner (Hoy/Semana), Habits, Opportunities (listado), OpportunityDetail. (Alta)
4. Catálogo institucional versionado en repo: JSON bajo /assets/catalog/colombia_v1.json y metadatos. (Alta)
5. Recordatorios opt-in con WorkManager; solicitud de POST_NOTIFICATIONS cuando el usuario activa su primer recordatorio. (Alta)
6. TTS: integración a nivel de UI (Android TextToSpeech API) como opción en ajustes y en botones "Leer" en OpportunityDetail y Planner. TTS debe respetar preferencia de privacidad y no leer datos sensibles en notificaciones. (Media-Alta)
7. Reporte de enlace roto / reedición manual: botón en OpportunityDetail que marca estado PENDING_RECHECK. (Media)
8. Exportar / borrar datos personales desde Ajustes: borrar base de datos local y DataStore. (Media)
9. Tests de aceptación automatizados: pruebas de Room, WorkManager y casos de zona horaria/DST. (Media)
10. Front: Jetpack Compose, ViewModel + StateFlow. (Alta)

Criterios de aceptación (ejemplos concretos)
---------------------------------------------
- Crear tarea/hábito y reiniciar la app → la tarea permanece (Room). ✅
- Añadir oportunidad verificada con applicationClosesAt en pasado → en UI aparece como CLOSED/HISTORICAL, no como OPEN_WINDOW. ✅
- Activar recordatorio → app solicita POST_NOTIFICATIONS en Android 13+. Si el permiso es negado, el recordatorio se guarda pero no muestra notificación. ✅
- TTS: el usuario puede activar "Leer" en una ficha y escuchar texto; TTS solo usa texto mostrado públicamente, no campos marcados como sensibles. ✅
- Borrar datos: operación en Ajustes elimina todas las tablas de Room y DataStore y confirma con el usuario. ✅

Fuentes principales
------------------
- Android — permiso de notificaciones: https://developer.android.com/develop/ui/compose/notifications/notification-permission
- Android — WorkManager: https://developer.android.com/develop/background-work/background-tasks/persistent
- Android — accesibilidad en Compose: https://developer.android.com/develop/ui/compose/accessibility/semantics
- OMS, GOV.CO, SENA, Prosperidad Social y otras fuentes listadas en la investigación interna. (Ver Investigacion_BlumHelps_BlumTherapy_2026-10-12.md)

Seguridad y privacidad
----------------------
- `android:allowBackup="false"` recomendado en los manifests.
- Datos sensibles nunca enviados a servidor sin consentimiento explícito y flujo de consentimiento bien documentado.
- Si se añade sincronización, debe ser opt-in, con cifrado en tránsito (TLS) y en reposo, y políticas de retención y borrado claras.

Notas operativas
----------------
- Mantener catálogo institucional como JSON versionado en el repo; actualizaciones por PR revisadas por responsable editorial.
- No publicar cambios en `main` sin PR y revisión. Si se implementa en ramas feature/ buscar PRs. (Consulta: ¿preferís que haga commits directos a main o cree ramas/PRs?)

Próximos pasos propuestos
------------------------
- Implementar modelo Room, DataStore y vistas básicas (primer sprint).
- Añadir TTS como toggle y controlar consentimientos.
- Crear tests de aceptación (persistencia y notificaciones).

---
Archivo creado: docs/TECHNICAL_PRIVACY_DECISIONS.md

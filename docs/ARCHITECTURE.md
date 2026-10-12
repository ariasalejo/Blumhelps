# Arquitectura

## Límite del producto
BlumHelps es la experiencia en español, con prioridad inicial en Colombia, para conectar apoyo, salud, educación, empleo y comunidad. BlumTherapy es la alternativa internacional en inglés.

## Base actual
Aplicación inicial en Kotlin y Jetpack Compose, con permisos mínimos. Todavía no ofrece tratamiento, atención de crisis ni directorio completo verificado.

## Capas previstas
- **Presentación:** pantallas Compose accesibles, estados de carga, vacío, error y datos desactualizados.
- **Dominio:** modelos de recurso, ubicación, verificación, metas e incentivos; casos de uso independientes de Android.
- **Datos:** repositorios y catálogos locales; fuentes remotas solo si existe justificación y evaluación de privacidad.
- **Adaptadores Android:** capacidades de plataforma aisladas detrás de interfaces estrechas.
- **Gobernanza de evidencia:** toda afirmación clínica registra fuente, población, fecha, limitaciones, revisor cualificado y próxima revisión.

## Modelo de recursos
Cada ficha necesita país, departamento/municipio, idioma, cobertura, fuente oficial, tipo de servicio, requisitos/costos confirmados, fecha de revisión, estado de verificación y alternativa si el recurso deja de estar disponible. Diferenciar una página informativa de un prestador sanitario.

## Reglas de privacidad y seguridad
1. Sin analítica ni recopilación de datos sanitarios sensibles por defecto.
2. No afirmar que la app monitoriza crisis o puede enviar emergencias.
3. Nunca registrar detalles de consumo, identificadores de dispositivo o secretos en logs.
4. El contenido espiritual es voluntario y está claramente identificado.
5. No publicar beneficios, patrocinadores, subsidios, empleos ni cupos no verificados.
6. Ninguna recompensa debe castigar recaídas, crear rankings públicos ni presionar a revelar información sanitaria.
7. Añadir pruebas para verificación, caducidad de datos, privacidad y navegación crítica a medida que se implementen funciones.

Añadir módulos Gradle solo cuando exista una frontera real de construcción o mantenimiento. No guardar claves de firma en el repositorio.

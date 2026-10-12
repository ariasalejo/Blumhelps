# Esquema de recursos

Los datos de ejemplo no garantizan que un servicio esté disponible. El estado inicial debe ser `unreviewed` hasta que una persona verifique los datos operativos con la fuente oficial.

## Campos
- `id`: identificador estable y sin datos personales.
- `name`: nombre público de la institución o recurso.
- `country`, `region`, `municipality`: alcance geográfico; usar `null` si se desconoce.
- `category`: `health`, `education`, `employment`, `social_support`, `peer_support`, `housing`, `crisis` o `research`.
- `resource_type`: `provider`, `nonprofit_provider`, `official_directory`, `official_program_directory`, `official_program_information`, `official_information`, `information_source`, `evidence_guideline` o `program`.
- `official_url`: URL de la fuente institucional.
- `status`: `unreviewed`, `verified`, `stale` o `withdrawn`.
- `last_checked_at`: fecha ISO-8601 de la última comprobación real; usar `null` si aún no se ha comprobado.
- `eligibility`, `cost`, `availability`: hechos confirmados o `unknown`.
- `review_notes`: datos faltantes y pasos de verificación.

No incluir información sanitaria de usuarios, credenciales ni números personales. Los datos de contacto deben proceder de una página oficial y verificarse antes de mostrarse. Una página institucional no demuestra por sí sola disponibilidad, elegibilidad, habilitación vigente o alianza con BlumHelps.

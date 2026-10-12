# Esquema de recursos

Los datos de ejemplo no son una lista de servicios garantizados. El estado inicial debe ser `unreviewed` hasta que una persona verifique por el canal oficial la información operativa.

## Campos obligatorios
- `id`: identificador estable, sin datos personales.
- `name`: nombre público de la institución o recurso.
- `country`, `region`, `municipality`: alcance geográfico; usar `null` si no se conoce.
- `category`: `health`, `education`, `employment`, `social_support`, `peer_support`, `housing`, `crisis` o `research`.
- `resource_type`: distingue `provider`, `official_directory`, `information_source` y `program`.
- `official_url`: URL de fuente institucional.
- `status`: `unreviewed`, `verified`, `stale` o `withdrawn`.
- `last_checked_at`: fecha ISO-8601 de la última comprobación real, no la fecha en que se importó el enlace.
- `review_notes`: información faltante y pasos para confirmar.
- `eligibility`, `cost`, `availability`: solo hechos confirmados; si no se confirman, usar `unknown`.

No incluir información de salud de usuarios, credenciales ni números personales. Los datos de contacto deben proceder de una página oficial y verificarse antes de mostrarse.

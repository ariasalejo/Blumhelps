# BLUMHELPS Voz — Serie de podcasts

La biblioteca Voz incluye una serie de audios completos ubicados en `public/audio/podcast-series/`. Los archivos estaban en el repositorio; esta integración añade un catálogo visible y reproductores para escucharlos desde `/voz`.

## Catálogo conectado

| Identificador | Título visible | Archivo |
|---|---|---|
| S01E01 | Las etapas del cambio | `S01E01-etapas-del-cambio-salome.mp3` |
| S01E02 | La ambivalencia | `S01E02-la-ambivalencia.mp3` |
| S01E03 | El antojo no es una orden | `S01E03-el-antojo-no-es-una-orden.mp3` |
| S01E04 | Un tropiezo no borra el camino | `S01E04-un-tropiezo-no-borra-el-camino.mp3` |
| Especial | Higiene del sueño | `especial-higiene-del-sueno.mp3` |

No se anuncian duraciones específicas porque no se validaron mediante análisis de audio en este cambio. Los controles nativos muestran la duración que el navegador obtiene del archivo.

## Funcionamiento

- Cada tarjeta tiene un reproductor HTML de audio independiente.
- Se usa `import.meta.env.BASE_URL` para resolver los recursos en Vite local y en GitHub Pages.
- La carga previa está desactivada (`preload="none"`) para no descargar todos los podcasts cuando alguien abre la página.
- Si se inicia otro episodio, el audio que estaba sonando se pausa.
- Los archivos MP3 existentes no se duplican ni sobrescriben.

## Validación automatizada

`scripts/validate-podcast-series.mjs` comprueba que estén presentes los cinco MP3, que tengan un tamaño razonable, que los nombres estén conectados en el componente y que `VoiceLibrary` lo renderice. La validación de integridad se ejecuta junto con `npm run validate`; TypeScript y Vite se verifican con `npm run check`.

Esta prueba verifica la presencia y conexión de los archivos, no su calidad editorial, pronunciación ni integridad perceptual del audio. Una escucha de revisión sigue siendo necesaria para certificar esos aspectos.

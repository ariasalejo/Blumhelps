# BLUMHELPS Voz — podcasts dentro de la ruta

Los cinco podcasts completos se encuentran en `public/audio/podcast-series/` y están integrados directamente en el paso relacionado de la ruta de escucha. No se muestran en un catálogo separado: el usuario abre un título desbloqueado y el reproductor aparece dentro de esa misma tarjeta.

## Podcasts integrados

| Paso del manifiesto | Archivo MP3 | Título del audio que se muestra |
|---|---|---|
| `etapas-del-cambio` | `S01E01-etapas-del-cambio-salome.mp3` | Las etapas del cambio |
| `ambivalencia-no-es-resistencia` | `S01E02-la-ambivalencia.mp3` | La ambivalencia |
| `craving-como-ola` | `S01E03-el-antojo-no-es-una-orden.mp3` | El antojo no es una orden |
| `recaida-no-es-fracaso` | `S01E04-un-tropiezo-no-borra-el-camino.mp3` | Un tropiezo no borra el camino |
| `higiene-del-sueno` | `especial-higiene-del-sueno.mp3` | Higiene del sueño |

Cuando hay un podcast completo para un paso, esa versión se ofrece como opción inicial y las versiones Piper breve y extensa siguen disponibles en el mismo reproductor. El título del archivo completo se muestra para no confundirlo con el título del paso cuando no son idénticos.

## Funcionamiento y desbloqueo

- Solo hay un reproductor activo por tarjeta seleccionada; el componente `LocalAudioPlayer` pausa el resto de los elementos de audio de la página.
- Cuando el audio llega al final, el paso queda completado en el almacenamiento local y el siguiente título de la secuencia se desbloquea.
- El progreso usa `localStorage` en este dispositivo; todavía no se sincroniza entre dispositivos.
- Las rutas de los podcasts usan `import.meta.env.BASE_URL`, tanto en el servidor local como en GitHub Pages.
- Los archivos MP3 existentes se reutilizan; no se copian ni se sobrescriben.
- No se anuncian duraciones específicas porque no se validaron mediante análisis de audio en este cambio. Los controles nativos muestran la duración que el navegador obtiene del archivo.

## Validación automatizada

`scripts/validate-podcast-series.mjs` comprueba que los cinco MP3 existan y tengan tamaño razonable, que cada archivo esté asignado a un episodio real del manifiesto y que `VoiceLibrary.tsx` los conecte dentro de las tarjetas desbloqueables. También detecta si se vuelve a montar el panel independiente de podcasts.

La prueba comprueba presencia y conexión de archivos, no su calidad editorial, pronunciación ni integridad perceptual. Sigue siendo necesaria una escucha de revisión para certificar esos aspectos.

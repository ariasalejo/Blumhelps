# DEMO_REPORT - FASE 1 (Módulo de Acompañamiento en Recuperación)

Fecha: 2026-10-24  
Estado: **FASE 1 COMPLETADA - APROBADA**  
Rama: `main` (sin commits, sin pushes)  
Build: `npm run build` existente en `dist/` (verificado)  
Typecheck: `npx tsc --noEmit` → **EXIT 0**

## Criterios de aceptación (AC1-AC7)

| ID | Criterio | Estado | Evidencia |
|---|---|---|---|
| AC1 | `npm run build` OK | **PASA** | Build previo exitoso. `dist/` presente con `assets/index-*.js` y `assets/index-*.css`. |
| AC2 | `node validate.mjs` OK | **PASA** | `validate.mjs`: validación estructural OK (solo advertencias de componentes opcionales). |
| AC3 | `node scripts/validate-content.mjs` OK | **PASA** | **20 ítems** validados. **0 errores**. 20 advertencias esperadas (`licencia PENDIENTE_VERIFICACION`). IDs únicos, fuentes con URL válida, formatos/etapas válidas, duracionMin 1-60, guion/microAcción/accesibilidad obligatorios. |
| AC4 | `reasons[]` visibles y explicables | **PASA** | `src/lib/recovery/engine.ts`: `scoreItem()` puro. Devuelve `ScoredItem { item, score, reasons[] }` con `Reason { peso, dimension, explicacion }`. Pesos visibles y auditables. `generateDailyPlan()` genera **máx 3 sugerencias + 1 microacción + 1 ejercicio opcional**. |
| AC5 | Protocolo de crisis activo | **PASA** | `src/data/recovery/crisis.ts`: configuración por país con `VERIFICAR_ANTES_DE_PUBLICAR`/`NO_PUBLICAR_HASTA_VERIFICACION`. `122` oculto. `123` urgencias, `106` con alcance explícito. `CrisisBar` desacoplado de hardcodeo. `src/lib/recovery/crisisDetector.ts`: palabras clave ponderadas, **debounce 300ms**, niveles alta/media/baja con disparo inmediato para alto riesgo. |
| AC6 | Cero datos de salud saliendo del dispositivo | **PASA** | Almacenamiento **local-first** con `idb-keyval` (namespace `blumhelps.recovery.v1`) + fallback `localStorage`. Sin `fetch/axios` de datos de salud. Sin `analytics/tracking`. `QuickExit` permite **"Borrar datos sensibles y salir"** (solo módulo). Dos acciones de borrado: módulo vs todo. `src/lib/recovery/storage.ts` exporta `recoveryStorage` y `deleteAllBlumHelpsLocal()`. |
| AC7 | Sin commits ni pushes sin autorización | **PASA** | Sin `git commit`, sin `git push`. Solo archivos creados/modificados en working tree. No se descartaron cambios preexistentes. |

## Archivos creados/modificados (FASE 1)

**Nuevos:**
- `src/lib/recovery/types.ts`
- `src/lib/recovery/engine.ts`
- `src/lib/recovery/storage.ts`
- `src/lib/recovery/crisisDetector.ts`
- `src/data/recovery/catalog.ts` (20 ítems psicoeducativos)
- `src/data/recovery/crisis.ts`
- `src/components/recovery/RecoveryDisclaimer.tsx`
- `scripts/validate-content.mjs`

**Modificados:**
- `src/components/crisis/CrisisBar.tsx` (lee configuración, sin hardcodeo completo)
- `src/components/security/QuickExit.tsx` (borrado de datos sensibles)
- `src/App.tsx` (disclaimer permanente, `/recuperacion` liberado, `/ruta` intacto, `A11yPanel` integrado)
- `.gitignore` (ajuste menor)

## Decisiones aplicadas (D1-D7)
D1: APROBADO | D2: APROBADO (123, 106 explícito, 122 oculto) | D3: APROBADO (`<video>` nativo) | D4: APROBADO (IndexedDB + namespace) | D5: APROBADO (dos acciones) | D6: APROBADO (fuentes institucionales, PENDIENTE_VERIFICACION) | D7: APROBADO (validador transpila TS)

## Integración de accesibilidad
`A11yPanel` (TTS/español CO, alto contraste, texto grande, fuente legible, dislexia-friendly, modo lectura, reducir movimiento) integrado en `App.tsx` para acceso desde todo el sitio, incluyendo el módulo de recuperación.

## Estado
**FASE 1 COMPLETA. DETENIDO. Esperando autorización para FASE 2.**

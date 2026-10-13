# 🌿 BlumHelps — Prototipo navegable

> **“No tienes que resolverlo todo hoy. Encuentra el siguiente paso que tenga sentido para ti.”**

Prototipo **funcional** (no mockups) construido con **React + TypeScript + Tailwind CSS + Framer Motion + React Router + Lucide**, fiel a la dirección visual del brief (marfil cálido, verde bosque, coral/ámbar solo como acentos).

```bash
cd web
npm install        # dependencias ya instaladas en este workspace
npm run dev        # → http://localhost:5173  (abre /inicio)
npm run build      # verificación de tipos + build de producción ✓
```

---

## 1 · Mapa de navegación (rutas independientes)

Navegación **persistente**: sidebar fijo en desktop + barra inferior de 5 destinos en móvil (`Inicio · Ayuda · Bienestar · Guardados · Ajustes`). Las secciones secundarias (Formación, Empleo, Comunidad, Familias) viven en el bloque “Más secciones” del sidebar y en los atajos del Home — todas con ruta propia, alcanzables sin scroll.

| Ruta | Qué resuelve | Sub-rutas |
|---|---|---|
| `/` | → redirige a `/inicio` | |
| `/inicio` | Bienvenida cálida, paso pequeño del día, recurso del día, atajos a las 4 áreas clave | |
| `/ayuda` | Directorio con búsqueda + filtros (ciudad, tipo, modalidad), conteo de resultados | `/ayuda/emergencia` (Línea 123), `/ayuda/recurso/:id` (ficha) |
| `/bienestar` | Plan Free vs Avanzado, wizard de metas (3 pasos), pausar/reanudar/borrar, recordatorios opcionales | |
| `/formacion` | Cursos con filtros por área, ciudad, nivel y duración corta | `/formacion/curso/:id` |
| `/empleo` | Vacantes verificadas + guía de hoja de vida | `/empleo/vacante/:id`, `/empleo/hoja-de-vida` (flujo 5 pasos) |
| `/comunidad` | Actividades, voluntariado, grupos; **reglas visibles antes de entrar** | `/comunidad/grupo/:id` |
| `/familias` | Guías para acompañar sin culpar ni vigilar | `/familias/guia/:id` |
| `/guardados` | Colección personal filtrable por sección, vaciar en un toque | |
| `/ajustes` | Idioma, accesibilidad (escala de texto, reducir animaciones), privacidad, exportar/borrar datos | |
| `*` | 404 cálido (“Por aquí no había nada… respira: el camino sigue existiendo”) | |

Cada pantalla incluye los **5 estados obligatorios**: carga (skeletons), error (con reintento), vacío útil (con acción), confirmación tras acción (toasts no punitivos) y regreso claro (`BackLink` / breadcrumb de retorno).

---

## 2 · Estructura de archivos

```
web/
├── index.html                  # fuente Inter, meta en español
├── tailwind.config.cjs         # tokens exactos del brief (base/forest/emerald/sage/coral/amber/ink/muted)
├── src/
│   ├── main.tsx                # Router + layout persistente (Sidebar/BottomBar/Toaster)
│   ├── index.css               # foco visible WCAG, targets ≥44px, prefers-reduced-motion
│   ├── data/demo.ts            # ⚠ Única fuente de datos — toda demo marcada demo:true
│   ├── state/app.tsx           # guardados, metas, ajustes, borrado/export, toasts (localStorage)
│   ├── components/ui.tsx       # Sidebar, BottomBar, chips, skeletons, ErrorState, EmptyState,
│   │                           #   AdvancedModal (paywall ético), DemoTag, TierBadge
│   ├── components/cards.tsx    # ResourceCard + ResourceDetail (fuente/cobertura/verificación/limitaciones)
│   └── pages/
│       ├── Inicio.tsx  Ayuda.tsx  Bienestar.tsx  Formacion.tsx  Empleo.tsx
│       ├── Comunidad.tsx (incluye Familias)  Guardados.tsx  Ajustes.tsx
│       └── smoke-test.tsx      # render test de las 13 rutas (vite-node + jsdom)
```

---

## 3 · Componentes reutilizables y sus estados

| Componente | Estados cubiertos |
|---|---|
| `ResourceCard` | normal · hover (elevación) · guardado/no guardado (activo) |
| `ResourceDetail` | ficha completa: fuente, cobertura, modalidad, fecha de verificación, limitaciones |
| `FilterChip` | off · on (aria-pressed) · limpiar fácil · resultado con conteo `aria-live` |
| `LoadingGrid/SkeletonCard` | carga simulada (~550 ms) |
| `ErrorState` | error + botón “Intentar de nuevo” |
| `EmptyState` | vacío útil con microcopy cálido + acción sugerida |
| `Toaster` | confirmación tras cada acción (guardar, pausar, borrar, avisar al grupo) |
| `AdvancedModal` | paywall ético cerrable, nunca bloqueante |
| `TierBadge` / `DemoTag` | distinción Gratis/Avanzado y etiqueta `(demo)` |
| Botones/toggles | min-height 44px, `focus-visible` con outline 3px, switch con `role="switch"` |

---

## 4 · Datos ficticios — lista explícita `(demo)`

Todos los registros en `src/data/demo.ts` llevan `demo: true` y se muestran con la etiqueta **(demo)**. **Ninguna entidad, alianza, cita, subsidio u oferta es real.**

**Ayuda (7):** Línea nacional de orientación (referencia pública, no afiliada) · Centro Comunitario Semilla · Ruta Par · Fundación Paso Firme · Punto de Atención Barrial · Consultorio Jurídico Alameda · Casa Puerta Abierta.
**Bienestar (6 plantillas de meta):** caminar 10 min · hora de sueño estable · llamada de confianza · comida caliente · diario (Avanzado) · analítica de ánimo/sueño (Avanzado).
**Formación (5):** Escuela Taller La Mesa · Aula Barrial ConectaT · Centro Industrial Norte · Fundación Sabor Sano · Taller Escuela Tornillo.
**Empleo (4):** Restaurante Doña Rosa · Logística Andina · Cooperativa Raíz · Reparto Vecinal (+ salarios referenciales ficticios).
**Comunidad (5):** Club Barrio Unido · Manos a la Tierra · Círculo Papel · Familia Red · Coro Guasá.
**Familias (4 guías):** hablar sin pelear · vigilar no es acompañar · cuidar al que cuida · plan de 30 días.
**Otros:** fechas de verificación ficticias, aviso “Aviso enviado al grupo (demo)”. Lo único no ficticio: **Línea 123** (emergencias oficiales de Colombia), siempre presentada con la nota de que BlumHelps no la opera.

---

## 5 · Free vs Avanzado (separación clara, cero presión)

| Gratis, siempre | Solo Avanzado |
|---|---|
| Ayuda/emergencia/directorio | Diario reflexivo encriptado en el dispositivo |
| Comunidad, formación, empleo | Analítica de patrones (sueño/ánimo) sin juicio |
| Metas básicas ilimitadas + pausar sin culpa | Respaldo cifrado y sincronización |

El modal Avanzado usa el microcopy exacto del brief y puede cerrarse con un toque; ninguna función esencial está bloqueada. Se entiende en ~5 s gracias a `TierBadge` (verde = Gratis, ámbar = Avanzado) presente en Bienestar, Ajustes y el mini-comparador del sidebar.

---

## 6 · Cumplimiento de reglas no negociables

- ✅ App con navegación persistente y rutas independientes (no landing).
- ✅ Home liviano: saludo, 4 atajos, recomendación del día, emergencia.
- ✅ Sin rachas punitivas ni moralina: “Pausar no es fallar”, “Nadie lleva cuenta de tus días malos”, “Sin medallas falsas”.
- ✅ Todo dato inventado etiquetado `(demo)`; límites declarados en cada ficha.
- ✅ No diagnostica: disclaimers en fichas + ruta `/ayuda/emergencia` dirigiendo al **123**.
- ✅ Núcleo 100 % gratis; premium solo reflexión profunda.
- ✅ Tono colombiano y cálido (arepa, tertulia, microfútbol, barrio), distinto de BlumTherapy.

## 7 · Notas Expo/APK (prioridad siguiente)

La arquitectura portada a `expo-router` es directa: `app/(tabs)/inicio.tsx`, `ayuda/index.tsx`, `ayuda/recurso/[id].tsx`, etc. Mapeo 1:1 — `localStorage → AsyncStorage`, `useSimulatedLoad → react-query`, `react-native-svg + lucide-react-native`, `expo-notifications` para los recordatorios suaves (opt-in, jamás por “fallar”), y el mismo `state/app.tsx` como store.

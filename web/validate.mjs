import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");
const html = read("./index.html");
const packageJson = JSON.parse(read("./package.json"));
const lock = JSON.parse(read("./package-lock.json"));
const lockRoot = lock.packages && lock.packages[""];
const app = read("./src/main.tsx");
const ui = read("./src/components/ui.tsx");
const cards = read("./src/components/cards.tsx");
const appState = read("./src/state/app.tsx");
const settingsPage = read("./src/pages/Ajustes.tsx");
const wellbeing = read("./src/pages/Bienestar.tsx");
const home = read("./src/pages/Inicio.tsx");
const help = read("./src/pages/Ayuda.tsx");
const css = read("./src/index.css");
const vite = read("./vite.config.ts");
const demo = read("./src/data/demo.ts");

assert.ok(/<html\s+lang="es-CO"/i.test(html), "The document must declare Spanish (Colombia).");
assert.ok(/<meta\s+name="viewport"/i.test(html), "A responsive viewport is required.");
assert.ok(/<meta\s+name="description"/i.test(html), "A useful search/social description is required.");
assert.ok(/<title>BlumHelps\s+—\s+Un paso a la vez<\/title>/i.test(html), "The document title should carry the product identity.");
assert.ok(html.includes('id="root"'), "The React mount point must exist.");
assert.ok(/<script[^>]+type="module"[^>]+src="\/src\/main\.tsx"/i.test(html), "Vite must load the actual React entry point.");
assert.ok(html.includes('href="#main-content"'), "A skip-to-content link must be available.");
assert.ok(html.includes("%BASE_URL%manifest-icon.svg"), "The icon path must respect Vite's deployment base.");
assert.ok(!/<script(?![^>]*\bsrc=)[^>]*>/i.test(html), "The HTML entry must not contain an obsolete inline application script.");
assert.ok(!/https?:\/\/[^"' ]+\.(?:js|css)(?:[?"' ]|$)/i.test(html), "The app entry must not depend on a remote script or stylesheet.");

assert.ok(app.includes('basename={import.meta.env.BASE_URL}'), "React Router must respect the deployed base path.");
assert.ok(app.includes('id="main-content"'), "The application must provide a main content landmark.");
const expectedRoutes = [
  'path="/inicio"', 'path="/ayuda"', 'path="/ayuda/emergencia"',
  'path="/ayuda/recurso/:id"', 'path="/bienestar"', 'path="/formacion"',
  'path="/formacion/curso/:id"', 'path="/empleo"', 'path="/empleo/vacante/:id"',
  'path="/empleo/hoja-de-vida"', 'path="/comunidad"', 'path="/comunidad/grupo/:id"',
  'path="/familias"', 'path="/familias/guia/:id"', 'path="/guardados"',
  'path="/ajustes"', 'path="*"'
];
for (const route of expectedRoutes) {
  assert.ok(app.includes(route), "Missing application route: " + route);
}

assert.ok(css.includes(":focus-visible"), "Keyboard focus must remain visible.");
assert.ok(css.includes("prefers-reduced-motion"), "System reduced-motion preferences must be respected.");
assert.ok(app.includes("MotionConfig") && app.includes('settings.reduceMotion ? "always" : "user"'), "The in-app reduced-motion preference must control Framer Motion.");
assert.ok(ui.includes('aria-label="Navegación principal"'), "The primary navigation must have an accessible name.");
assert.ok(ui.includes('aria-current={active ? "page" : undefined}'), "Current navigation pages should be announced.");
assert.ok(cards.includes("aria-pressed={saved}"), "Save controls must expose their toggle state.");
assert.ok(cards.includes("<BookmarkCheck size={18} aria-hidden=\"true\" />") && cards.includes("<Bookmark size={18} aria-hidden=\"true\" />"), "Save controls need a visible icon.");
assert.ok(appState.includes('const KEY = "blumhelps.v1"'), "Local user data must use a namespaced storage key.");
assert.ok(appState.includes("localStorage.getItem(KEY)") && appState.includes("localStorage.setItem("), "Local preferences and goals must persist on the device.");
assert.ok(settingsPage.includes("almacenamiento local no está cifrado"), "Privacy settings must disclose that local browser storage is not encrypted.");
assert.ok(settingsPage.includes("no incluye bloqueo de pantalla") && settingsPage.includes("recordatorios programados"), "Unavailable privacy/reminder functions must not be presented as active.");
assert.ok(!settingsPage.includes("<Toggle"), "Settings must not show inactive controls for unimplemented privacy/reminder features.");
assert.ok(settingsPage.includes("Los otros idiomas todavía no cambian los textos."), "Unsupported languages must be clearly marked unavailable.");
assert.ok(ui.includes("Funciones futuras (aún no disponibles)") && ui.includes("no existen en esta demo"), "The advanced feature dialog must disclose future-only functions.");
assert.ok(wellbeing.includes("Estas propuestas no están disponibles") && wellbeing.includes("sin conectar"), "The wellbeing screen must not market unimplemented encrypted analytics or sync.");
assert.ok(home.includes("No tienes que resolverlo todo hoy."), "The home screen should communicate the product's supportive purpose.");
assert.ok(home.includes("Un recurso para explorar") && !home.includes("Oportunidades verificadas"), "Home recommendations must not imply geolocation or verified demo jobs.");
assert.ok(cards.includes("Fecha de ejemplo"), "Fictional review dates must not be presented as real verification.");

assert.ok(help.includes("requestPublicResources"), "The help directory must retain its public API integration.");
assert.ok(help.includes('target="_blank" rel="noopener noreferrer"'), "External public resource links must isolate the opener.");
assert.ok(demo.includes("demo: true"), "Sample catalog data must be explicitly marked as demo.");
assert.ok(demo.includes("ficticia"), "The sample catalog must disclose fictitious entries.");
assert.ok(vite.includes("VitePWA(") && vite.includes('registerType: "autoUpdate"'), "PWA installability and automatic updates must remain configured.");
assert.ok(vite.includes('process.env.GITHUB_PAGES === "true"'), "Production builds must support the GitHub Pages subpath.");

assert.equal(packageJson.name, "blumhelps-web", "Unexpected web package name.");
assert.ok(packageJson.dependencies && packageJson.dependencies.react, "React must be declared.");
assert.ok(packageJson.devDependencies && packageJson.devDependencies.vite, "Vite must be declared.");
assert.ok(packageJson.devDependencies && packageJson.devDependencies["vite-plugin-pwa"], "The PWA plugin must be declared.");
assert.ok(packageJson.scripts && packageJson.scripts.validate, "A repeatable web validation script must be available.");
assert.ok(lockRoot, "The npm lockfile must contain its root package metadata.");
for (const section of ["dependencies", "devDependencies"]) {
  for (const [name, range] of Object.entries(packageJson[section] || {})) {
    assert.equal(lockRoot[section] && lockRoot[section][name], range, "package.json and package-lock.json disagree on " + name + ".");
  }
}
assert.ok(lock.packages["node_modules/react"], "React must be represented in the lockfile.");
assert.ok(lock.packages["node_modules/vite"], "Vite must be represented in the lockfile.");
assert.ok(lock.packages["node_modules/vite-plugin-pwa"], "The PWA plugin must be represented in the lockfile.");

console.log("PASS: HTML entry point, metadata and React mount");
console.log("PASS: Vite base path and all application routes");
console.log("PASS: accessibility, keyboard focus and reduced motion");
console.log("PASS: local-only goals/preferences, visible save controls and privacy limits");
console.log("PASS: unavailable features and languages are disclosed; demo dates are not called verified");
console.log("PASS: public API links and explicit demo-data disclosure");
console.log("PASS: PWA configuration and synchronized npm lockfile");

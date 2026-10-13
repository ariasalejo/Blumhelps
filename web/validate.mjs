import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');
const html = read('./index.html');
const app = read('./src/main.tsx');
const pwa = read('./vite.config.ts');

assert.match(html, /<html lang="es-CO"/, 'Spanish (Colombia) must be declared.');
assert.match(html, /name="viewport"/, 'Responsive viewport metadata must be present.');
assert.match(html, /id="root"/, 'The React mount point must exist.');
assert.match(html, /href="#main-content"/, 'A skip-to-content link must be available.');
assert.match(html, /type="module" src="\/src\/main\.tsx"/, 'The real React entry point must be loaded.');
assert.match(html, /name="description"/, 'A public product description must be present.');
assert.doesNotMatch(html, /<script\s+src=["']https?:\/\//i, 'The app must not load remote scripts.');
assert.match(app, /BrowserRouter/, 'Client-side routing must be configured.');
assert.match(app, /id="main-content"/, 'The main landmark must match the skip link.');
for (const route of ['/inicio', '/ayuda', '/bienestar', '/formacion', '/empleo', '/comunidad', '/familias', '/guardados', '/ajustes']) {
  assert.ok(app.includes(`path="${route}"`), `Missing application route: ${route}`);
}
assert.match(pwa, /VitePWA\(/, 'Installable PWA plugin must be configured.');
assert.match(pwa, /display:\s*"standalone"/, 'PWA must declare standalone display mode.');
assert.match(pwa, /navigateFallback:\s*"\/index\.html"/, 'Offline navigation fallback must be configured.');
assert.match(pwa, /blumhelps-reviewed-public-resources/, 'Public-resource cache must be namespaced.');
assert.match(pwa, /NetworkFirst/, 'Public resources should prefer fresh network data.');
console.log('PASS: PWA HTML entry, language, viewport and skip link');
console.log('PASS: React router and all declared product routes');
console.log('PASS: installable PWA configuration and offline fallback');
console.log('PASS: namespaced network-first public resource cache');

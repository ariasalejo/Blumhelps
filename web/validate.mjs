import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { Script } from 'node:vm';

const html = readFileSync(new URL('./index.html', import.meta.url), 'utf8');
const scriptMatch = html.match(/<script>([\\s\\S]*?)<\\/script>/i);
assert.ok(scriptMatch, 'The page must include its inline application script.');
new Script(scriptMatch[1], { filename: 'web/index.html:inline-script' });

assert.match(html, /<html lang="es-CO"/i, 'Spanish (Colombia) language should be declared.');
assert.match(html, /id="main"/, 'A main content landmark should be present.');
assert.match(html, /class="skip"/, 'A skip-to-content link should be present.');
assert.match(html, /prefers-reduced-motion:\s*reduce/, 'Reduced-motion preference should be respected.');
assert.match(html, /@media\s*\(max-width:\s*820px\)/, 'A mobile layout should be provided.');
assert.match(html, /blumhelps-web-saved-v1/, 'Saved items should use a namespaced local storage key.');
assert.match(html, /blumhelps-web-goals-v1/, 'Wellbeing selections should use a namespaced local storage key.');
assert.match(html, /minsalud\.gov\.co/, 'A Ministry of Health official source should be linked.');
assert.match(html, /betowa\.sena\.edu\.co/, 'SENA official training should be linked.');
assert.match(html, /ape\.sena\.edu\.co/, 'SENA employment source should be linked.');
assert.match(html, /Prosperidad Social|prosperidadsocial\.gov\.co/, 'Public support source should be described.');
assert.match(html, /no es un servicio de emergencias/i, 'Safety boundary should be clearly disclosed.');
assert.match(html, /target="_blank" rel="noopener noreferrer"/, 'External links should be protected from opener access.');
assert.doesNotMatch(html, /<script[^>]+src=/i, 'The single-file web app should not load remote scripts.');
assert.doesNotMatch(html, /<link[^>]+rel=["']stylesheet["'][^>]+href=["']https?:/i, 'The single-file web app should not depend on remote stylesheets.');

const routeIds = ['inicio', 'ayuda', 'bienestar', 'formacion', 'empleo', 'comunidad', 'familias', 'guardados', 'ajustes'];
for (const id of routeIds) assert.ok(html.includes(`id:'${id}'`), `Missing route declaration: ${id}`);
const resourceBlock = html.match(/const RES=\\[([\\s\\S]*?)\\];/);
assert.ok(resourceBlock, 'The official resource catalog should exist.');
assert.ok((resourceBlock[1].match(/id:'/g) || []).length >= 7, 'At least seven cautious starting-point resources should be available.');

console.log('PASS: inline JavaScript syntax');
console.log('PASS: language, landmarks, accessibility and mobile layout');
console.log('PASS: local-only preferences and saved resources');
console.log('PASS: official-source links and safety disclosures');
console.log('PASS: nine route declarations and resource catalog');
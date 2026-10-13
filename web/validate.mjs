import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { Script } from 'node:vm';

const html = readFileSync(new URL('./index.html', import.meta.url), 'utf8');
const scriptStart = html.indexOf('<script>');
const scriptEnd = html.lastIndexOf('</script>');
assert.ok(scriptStart >= 0 && scriptEnd > scriptStart, 'The page must include its inline application script.');
new Script(html.slice(scriptStart + '<script>'.length, scriptEnd), { filename: 'web/index.html:inline-script' });

assert.ok(html.includes('<html lang="es-CO"'), 'Spanish (Colombia) language should be declared.');
assert.ok(html.includes('id="main"'), 'A main content landmark should be present.');
assert.ok(html.includes('class="skip"'), 'A skip-to-content link should be present.');
assert.ok(html.includes('prefers-reduced-motion:reduce'), 'Reduced-motion preference should be respected.');
assert.ok(html.includes('@media(max-width:820px)'), 'A mobile layout should be provided.');
assert.ok(html.includes('blumhelps-web-saved-v1'), 'Saved items should use a namespaced local storage key.');
assert.ok(html.includes('blumhelps-web-goals-v1'), 'Wellbeing selections should use a namespaced local storage key.');
assert.ok(html.includes('minsalud.gov.co'), 'A Ministry of Health official source should be linked.');
assert.ok(html.includes('betowa.sena.edu.co'), 'SENA official training should be linked.');
assert.ok(html.includes('ape.sena.edu.co'), 'SENA employment source should be linked.');
assert.ok(html.includes('prosperidadsocial.gov.co'), 'Public support source should be linked.');
assert.ok(html.toLowerCase().includes('no es un servicio de emergencias'), 'Safety boundary should be clearly disclosed.');
assert.ok(html.includes('target="_blank" rel="noopener noreferrer"'), 'External links should be protected from opener access.');
assert.ok(!html.toLowerCase().includes('<script src='), 'The single-file web app should not load remote scripts.');
assert.ok(!html.toLowerCase().includes('rel="stylesheet" href="https://'), 'The single-file web app should not depend on remote stylesheets.');

const routeIds = ['inicio', 'ayuda', 'bienestar', 'formacion', 'empleo', 'comunidad', 'familias', 'guardados', 'ajustes'];
for (const id of routeIds) assert.ok(html.includes(`id:'${id}'`), `Missing route declaration: ${id}`);
const resourceBlock = html.split('const RES=[')[1]?.split('];')[0] ?? '';
assert.ok(resourceBlock.split("id:'").length - 1 >= 7, 'At least seven cautious starting-point resources should be available.');

console.log('PASS: inline JavaScript syntax');
console.log('PASS: language, landmarks, accessibility and mobile layout');
console.log('PASS: local-only preferences and saved resources');
console.log('PASS: official-source links and safety disclosures');
console.log('PASS: nine route declarations and resource catalog');

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { Script } from 'node:vm';

// Read HTML
const html = readFileSync(new URL('./index.html', import.meta.url), 'utf8');

const scriptStart = html.indexOf('<script>');
const scriptEnd = html.lastIndexOf('</script>');
assert.ok(scriptStart >= 0 && scriptEnd > scriptStart, 'The page must include its inline application script.');

const code = html.slice(scriptStart + '<script>'.length, scriptEnd);

// Helper to show context lines around a given line number
function showContext(source, line, context = 3) {
  const lines = source.split(/\r?\n/);
  const start = Math.max(0, line - context - 1);
  const end = Math.min(lines.length, line + context);
  return lines.slice(start, end).map((l, i) => `${start + i + 1}: ${l}`).join('\n');
}

// 1) Try to parse with acorn if available (gives precise syntax errors)
let parsedWithAcorn = false;
try {
  // dynamic import so script still runs if acorn isn't installed
  const acorn = await import('acorn');
  try {
    acorn.parse(code, { ecmaVersion: 'latest', sourceType: 'script', locations: true });
    console.log('PASS: inline script parses with acorn');
    parsedWithAcorn = true;
  } catch (err) {
    console.error('FAIL: JavaScript syntax error in inline script (acorn)');
    console.error(err.message);
    if (err.loc) {
      console.error(`Line ${err.loc.line}, column ${err.loc.column}`);
      console.error('Context:\n' + showContext(code, err.loc.line, 5));
    }
    process.exit(1);
  }
} catch (e) {
  console.warn('acorn not available; skipping acorn parse. Install acorn in the workflow to get better syntax errors.');
}

// 2) Attempt to compile with vm.Script and report errors with context
try {
  new Script(code, { filename: 'web/index.html:inline-script' });
  console.log('PASS: inline script compiles with vm.Script');
} catch (err) {
  console.error('FAIL: vm.Script compile error:');
  console.error(err && err.stack ? err.stack : String(err));
  // Try to infer line from stack if possible (V8 stack shows <anonymous>:line:col)
  const m = String(err.stack || '').match(/<anonymous>:(\d+):(\d+)/);
  if (m) {
    const line = Number(m[1]);
    console.error(`Inferred line ${line} in inline script. Context:\n` + showContext(code, line, 5));
  }
  process.exit(1);
}

// 3) Continue with the existing HTML checks
try {
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

  console.log('PASS: HTML requirement checks');
} catch (err) {
  console.error('FAIL: HTML requirement checks failed:', err.message);
  process.exit(1);
}

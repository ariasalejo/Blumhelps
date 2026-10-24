#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import ts from 'typescript';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

const catalogPath = path.join(root, 'src', 'data', 'recovery', 'catalog.ts');
const crisisPath = path.join(root, 'src', 'data', 'recovery', 'crisis.ts');

const VALID_FORMATOS = new Set(['video', 'imagen', 'lectura', 'audio', 'ejercicio', 'ejercicio_guiado', 'meditacion', 'journaling', 'visualizacion_3d']);
const VALID_ETAPAS = new Set(['precontemplacion', 'contemplacion', 'preparacion', 'accion', 'mantenimiento', 'recaida']);
const VALID_LICENCIAS = new Set(['CC-BY-4.0', 'dominio_publico', 'propio', 'PENDIENTE_VERIFICACION']);

function isValidUrl(s) {
  try {
    const u = new URL(s);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

function transpileToCJS(tsCode) {
  const res = ts.transpileModule(tsCode, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true,
    },
  });
  return res.outputText;
}

function run() {
  console.log('🔍 Validando contenido del módulo de recuperación (offline)...');
  let errors = 0;
  let warns = 0;

  if (!fs.existsSync(catalogPath)) {
    console.error(`❌ Falta ${catalogPath}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(catalogPath, 'utf8');
  const js = transpileToCJS(raw);

  try {
    const m = { exports: {} };
    const fn = new Function('module', 'exports', 'require', js);
    fn(m, m.exports, () => ({}));
    const catalog = m.exports.recoveryCatalog || m.exports.default || (m.exports[0] ? null : null);
    if (!Array.isArray(catalog)) {
      // intentar búsqueda
      const keys = Object.keys(m.exports);
      let found = null;
      for (const k of keys) {
        if (Array.isArray(m.exports[k]) && m.exports[k][0] && m.exports[k][0].id) found = m.exports[k];
      }
      if (!Array.isArray(found)) {
        console.error('❌ recoveryCatalog no es un array');
        process.exit(1);
      }
      var items = found;
    } else {
      var items = catalog;
    }

    const ids = new Set();
    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      const idx = i + 1;
      if (!it.id || typeof it.id !== 'string') {
        console.error(`❌ Ítem ${idx}: id obligatorio`);
        errors++;
        continue;
      }
      if (ids.has(it.id)) {
        console.error(`❌ ID duplicado: ${it.id}`);
        errors++;
      }
      ids.add(it.id);
      if (!it.titulo) { console.error(`❌ ${it.id}: título obligatorio`); errors++; }
      if (!VALID_FORMATOS.has(it.formato)) { console.error(`❌ ${it.id}: formato inválido (${it.formato})`); errors++; }
      if (!Array.isArray(it.etapas) || it.etapas.length === 0) { console.error(`❌ ${it.id}: etapas obligatorias`); errors++; }
      else {
        for (const et of it.etapas) {
          if (!VALID_ETAPAS.has(et)) { console.error(`❌ ${it.id}: etapa inválida (${et})`); errors++; }
        }
      }
      if (typeof it.duracionMin !== 'number' || it.duracionMin < 1 || it.duracionMin > 60) { console.error(`❌ ${it.id}: duracionMin debe estar entre 1-60`); errors++; }
      if (!it.fuente) { console.error(`❌ ${it.id}: fuente obligatoria`); errors++; }
      else {
        if (!it.fuente.url) { console.error(`❌ ${it.id}: fuente.url obligatoria`); errors++; }
        else if (!isValidUrl(it.fuente.url)) { console.error(`❌ ${it.id}: fuente.url inválida (${it.fuente.url})`); errors++; }
        if (typeof it.fuente.verificado !== 'boolean') { console.error(`❌ ${it.id}: fuente.verificado debe ser boolean`); errors++; }
      }
      if (!it.licencia) { console.error(`❌ ${it.id}: licencia obligatoria`); errors++; }
      else if (!VALID_LICENCIAS.has(it.licencia)) { console.error(`❌ ${it.id}: licencia inválida (${it.licencia})`); errors++; }
      if (it.licencia === 'PENDIENTE_VERIFICACION') { console.warn(`⚠️  ${it.id}: licencia PENDIENTE_VERIFICACION (requiere revisión antes de publicar)`); warns++; }
      if (!it.guion) { console.error(`❌ ${it.id}: guion obligatorio`); errors++; }
      if (!it.microAccion) { console.error(`❌ ${it.id}: microAccion obligatoria`); errors++; }
      if (!it.accesibilidad) { console.error(`❌ ${it.id}: accesibilidad obligatoria`); errors++; }
    }

    console.log(`\n📊 Validación de contenido: ${items.length} ítems | errores: ${errors} | advertencias: ${warns}`);
    if (errors > 0) { console.error('🚫 Falló validación de contenido'); process.exit(1); }
    console.log('✅ Validación de contenido completada (con advertencias si las hay)');
  } catch (e) {
    console.error('❌ Error al transpilar/evaluar catalog.ts:', e.message);
    process.exit(1);
  }
}

run();

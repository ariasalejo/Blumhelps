#!/usr/bin/env node
// ============================================================================
// scripts/hash-consent.mjs
// Calcula SHA-256 de cada texto de consentimiento y lo inyecta en el fuente.
// Uso:  node scripts/hash-consent.mjs           (normal)
//       node scripts/hash-consent.mjs --check   (CI: falla si desactualizado)
// ============================================================================

import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(here, "..");
const FILE = resolve(ROOT, "src/data/recovery/consentTexts.ts");
const CHECK = process.argv.includes("--check");

const log = (m) => console.log("[hash-consent] " + m);
const fail = (m) => {
  console.error("[hash-consent] ERROR: " + m);
  process.exit(1);
};

if (!existsSync(FILE)) fail("No existe " + FILE);

let content = readFileSync(FILE, "utf-8");

const REGEX = /text:\s*`([\s\S]*?)`,\s*\n\s*summary:/g;
const matches = [...content.matchAll(REGEX)];
if (matches.length === 0) fail("No se encontraron bloques text: en el archivo.");

log("Encontrados " + matches.length + " consentimiento(s).");

let updated = content;
let modified = false;
let failures = 0;

for (const match of matches) {
  const fullMatch = match[0];
  const textContent = match[1];
  const normalized = textContent.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const hash = createHash("sha256").update(normalized, "utf-8").digest("hex");

  const afterIdx = content.indexOf(fullMatch) + fullMatch.length;
  const after = content.slice(afterIdx);
  const hashLineMatch = after.match(/hash:\s*(["'])([a-f0-9]*)\1/i);
  if (!hashLineMatch) {
    log("AVISO: linea hash: no encontrada tras un bloque.");
    failures++;
    continue;
  }

  const quote = hashLineMatch[1];
  const existing = hashLineMatch[2];
  if (existing === hash) {
    log("OK " + hash.slice(0, 12) + "... (al dia)");
    continue;
  }

  if (CHECK) {
    log("AVISO desactualizado: " + (existing.slice(0, 12) || "(vacio)") + " -> " + hash.slice(0, 12) + "...");
    failures++;
    continue;
  }

  const oldLine = "hash: " + quote + existing + quote;
  const newLine = "hash: " + quote + hash + quote;
  const before = updated.slice(0, updated.indexOf(fullMatch) + fullMatch.length);
  const afterPart = updated.slice(before.length);
  const replaced = afterPart.replace(oldLine, newLine);
  updated = before + replaced;
  modified = true;
  log("UPDATE " + (existing.slice(0, 12) || "(vacio)") + " -> " + hash.slice(0, 12) + "...");
}

if (CHECK && failures > 0) {
  fail(failures + " hash(es) desactualizado(s). Ejecuta: npm run hash:consent");
}

if (modified) {
  writeFileSync(FILE, updated, "utf-8");
  log("Archivo actualizado: " + FILE);
} else {
  log("Hashes al dia. Sin cambios.");
}
process.exit(0);

#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const audioRoot = path.join(root, "public", "audio", "podcast-series");
const componentPath = path.join(root, "src", "components", "voice", "PodcastSeries.tsx");
const stylePath = path.join(root, "src", "components", "voice", "PodcastSeries.css");
const voicePath = path.join(root, "src", "pages", "VoiceLibrary.tsx");

const expectedFiles = [
  "S01E01-etapas-del-cambio-salome.mp3",
  "S01E02-la-ambivalencia.mp3",
  "S01E03-el-antojo-no-es-una-orden.mp3",
  "S01E04-un-tropiezo-no-borra-el-camino.mp3",
  "especial-higiene-del-sueno.mp3",
];

function fail(message) {
  console.error(`❌ ${message}`);
  process.exitCode = 1;
}

console.log("🔍 Validando los podcasts completos de la biblioteca Voz…");

for (const file of [componentPath, stylePath, voicePath]) {
  if (!fs.existsSync(file)) fail(`Falta el archivo de interfaz: ${path.relative(root, file)}`);
}

const component = fs.existsSync(componentPath) ? fs.readFileSync(componentPath, "utf8") : "";
const voicePage = fs.existsSync(voicePath) ? fs.readFileSync(voicePath, "utf8") : "";

if (!component.includes('import.meta.env.BASE_URL')) {
  fail("La ruta de los audios debe respetar BASE_URL para funcionar en GitHub Pages y en local.");
}
if (!component.includes('preload="none"') || !component.includes("<audio")) {
  fail("Cada episodio debe usar el reproductor nativo y no precargar el archivo completo.");
}
if (!voicePage.includes('import { PodcastSeries } from "../components/voice/PodcastSeries"')) {
  fail("VoiceLibrary.tsx no importa PodcastSeries.");
}
if (!voicePage.includes("<PodcastSeries />")) {
  fail("VoiceLibrary.tsx no muestra PodcastSeries.");
}

for (const filename of expectedFiles) {
  const filePath = path.join(audioRoot, filename);
  if (!fs.existsSync(filePath)) {
    fail(`Falta el audio publicado: public/audio/podcast-series/${filename}`);
    continue;
  }

  const stat = fs.statSync(filePath);
  if (!stat.isFile() || stat.size < 1_000_000) {
    fail(`El archivo no parece un podcast completo o está vacío: ${filename} (${stat.size} bytes)`);
  }
  if (!component.includes(filename)) {
    fail(`El archivo existe pero no está conectado al catálogo de la interfaz: ${filename}`);
  }
}

if (process.exitCode) {
  console.error("🚫 Falló la validación de podcasts.");
} else {
  console.log(`✅ ${expectedFiles.length} audios encontrados, conectados y por encima del umbral de tamaño.`);
  console.log("✅ La biblioteca Voz monta el componente y usa BASE_URL.");
}

#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const audioRoot = path.join(root, "public", "audio", "podcast-series");
const voicePath = path.join(root, "src", "pages", "VoiceLibrary.tsx");
const manifestPath = path.join(root, "src", "data", "recovery", "piperAudioManifest.ts");

const expectedEpisodes = [
  { id: "etapas-del-cambio", file: "S01E01-etapas-del-cambio-salome.mp3" },
  { id: "ambivalencia-no-es-resistencia", file: "S01E02-la-ambivalencia.mp3" },
  { id: "craving-como-ola", file: "S01E03-el-antojo-no-es-una-orden.mp3" },
  { id: "recaida-no-es-fracaso", file: "S01E04-un-tropiezo-no-borra-el-camino.mp3" },
  { id: "higiene-del-sueno", file: "especial-higiene-del-sueno.mp3" },
];

function fail(message) {
  console.error("❌ " + message);
  process.exitCode = 1;
}

console.log("🔍 Validando los podcasts integrados en la ruta desbloqueable de Voz…");

for (const file of [voicePath, manifestPath]) {
  if (!fs.existsSync(file)) fail("Falta el archivo necesario: " + path.relative(root, file));
}

const voicePage = fs.existsSync(voicePath) ? fs.readFileSync(voicePath, "utf8") : "";
const manifest = fs.existsSync(manifestPath) ? fs.readFileSync(manifestPath, "utf8") : "";

if (!voicePage.includes("podcastAudioByEpisodeId")) {
  fail("VoiceLibrary.tsx no contiene el mapa de podcasts por episodio.");
}
if (!voicePage.includes('import.meta.env.BASE_URL') || !voicePage.includes('audio/podcast-series/')) {
  fail("Las rutas de podcasts deben respetar BASE_URL para funcionar en local y GitHub Pages.");
}
if (!voicePage.includes("isSelected && !isLocked") || !voicePage.includes("onCompleted={() => markCompleted(episode.id)}")) {
  fail("El reproductor debe estar dentro de la tarjeta seleccionada y completar el paso al terminar el audio.");
}
if (voicePage.includes('import { PodcastSeries }') || voicePage.includes("<PodcastSeries")) {
  fail("Los podcasts volvieron a aparecer como un panel independiente duplicado.");
}
if (!voicePage.includes("Podcast completo") || !voicePage.includes('setPlaybackMode("podcast")')) {
  fail("El reproductor de cada paso debe permitir elegir el podcast completo cuando exista.");
}

for (const episode of expectedEpisodes) {
  const filePath = path.join(audioRoot, episode.file);
  if (!fs.existsSync(filePath)) {
    fail("Falta el audio publicado: public/audio/podcast-series/" + episode.file);
    continue;
  }

  const stat = fs.statSync(filePath);
  if (!stat.isFile() || stat.size < 1_000_000) {
    fail("El archivo no parece un podcast completo o está vacío: " + episode.file + " (" + stat.size + " bytes)");
  }
  if (!voicePage.includes(episode.file)) {
    fail("El audio existe pero no está integrado en VoiceLibrary.tsx: " + episode.file);
  }
  if (!manifest.includes('id: "' + episode.id + '"')) {
    fail("No se encontró el episodio de destino en el manifiesto de la ruta: " + episode.id);
  }
}

if (process.exitCode) {
  console.error("🚫 Falló la validación de podcasts integrados.");
} else {
  console.log("✅ " + expectedEpisodes.length + " podcasts completos encontrados y asignados a pasos de la ruta.");
  console.log("✅ Cada reproductor está dentro de su episodio; terminar el audio marca el paso.");
  console.log("✅ La ruta no monta un catálogo de podcasts separado y respeta BASE_URL.");
}

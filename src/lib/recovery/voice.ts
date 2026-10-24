// ============================================================================
// BLUMHELPS — SELECCIÓN CENTRAL DE VOZ PARA TTS DEL NAVEGADOR
// ============================================================================
// Este helper NO envía datos a servicios externos.
// Solo elige la mejor voz local/disponible en el navegador.
// Para voz neuronal real del catálogo, usar MP3 locales generados con Edge TTS.
// ============================================================================

export type RecoveryVoiceChoice = "gonzalo" | "salome" | "alvaro" | "auto";

/**
 * Voz oficial del producto para Colombia.
 * Cambiar a "salome" o "alvaro" si se decide otra identidad vocal.
 */
export const ACTIVE_RECOVERY_VOICE: RecoveryVoiceChoice = "gonzalo";

const PATTERNS: Record<RecoveryVoiceChoice, string[]> = {
  gonzalo: [
    "microsoft gonzalo online (natural) - spanish (colombia)",
    "es-co-gonzaloneural",
    "gonzalo",
    "es-co",
    "colombia",
  ],
  salome: [
    "microsoft salome online (natural) - spanish (colombia)",
    "es-co-salome neural",
    "es-co-salome neural",
    "salome",
    "es-co",
    "colombia",
  ],
  alvaro: [
    "microsoft alvaro online (natural) - spanish (spain)",
    "es-es-alvaroneural",
    "alvaro",
    "es-es",
    "spain",
    "españa",
  ],
  auto: [
    "microsoft gonzalo online (natural) - spanish (colombia)",
    "es-co-gonzaloneural",
    "gonzalo",
    "microsoft salome online (natural) - spanish (colombia)",
    "es-co-salome neural",
    "salome",
    "es-co",
    "colombia",
    "microsoft alvaro online (natural) - spanish (spain)",
    "es-es-alvaroneural",
    "alvaro",
    "es-es",
    "español",
    "es",
  ],
};

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

export function pickRecoveryVoice(
  voices: SpeechSynthesisVoice[],
): SpeechSynthesisVoice | undefined {
  if (!voices || voices.length === 0) return undefined;

  const choice: RecoveryVoiceChoice =
    ACTIVE_RECOVERY_VOICE === "auto" ? "gonzalo" : ACTIVE_RECOVERY_VOICE;

  const patterns = PATTERNS[choice].map(normalize);
  const indexed = voices.map((voice) => ({
    voice,
    name: normalize(voice.name || ""),
    uri: normalize(voice.voiceURI || ""),
    lang: normalize(voice.lang || ""),
  }));

  for (const pattern of patterns) {
    const found = indexed.find(
      (x) =>
        x.name.includes(pattern) ||
        x.uri.includes(pattern) ||
        x.lang.includes(pattern),
    );
    if (found) return found.voice;
  }

  // Fallback por idioma.
  const langFallbacks = ["es-co", "es-mx", "es-us", "es-es", "es"];
  for (const lang of langFallbacks) {
    const found = indexed.find((x) => x.lang.startsWith(lang));
    if (found) return found.voice;
  }

  return undefined;
}

export const RECOVERY_VOICE_LABEL: Record<RecoveryVoiceChoice, string> = {
  gonzalo: "Gonzalo (Colombia, masculina)",
  salome: "Salomé (Colombia, femenina)",
  alvaro: "Álvaro (España, masculina)",
  auto: "Automática (prioridad Colombia)",
};

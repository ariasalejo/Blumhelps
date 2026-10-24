// ============================================================================
// BLUMHELPS — DESACTIVACIÓN DE VOZ DEL NAVEGADOR
// ============================================================================
// Motivo: la voz de speechSynthesis se percibe robot y degrada la experiencia.
// El catálogo de recuperación usa MP3 locales generados con Piper.
// Los textos personalizados del paciente quedan sin audio externo por privacidad,
// hasta implementar una solución local/offline de TTS en runtime.
// ============================================================================

const DEBUG = false;

export function disableBrowserTts(): void {
  if (typeof window === "undefined") return;
  if (!("speechSynthesis" in window)) return;

  const synth = window.speechSynthesis as SpeechSynthesis & {
    speak: (utterance: SpeechSynthesisUtterance) => void;
    cancel: () => void;
    pause: () => void;
    resume: () => void;
  };

  const noop = () => {};

  const blockedSpeak = (_utterance: SpeechSynthesisUtterance) => {
    if (DEBUG) {
      console.warn(
        "BlumHelps: voz del navegador deshabilitada. Usa audio Piper local del catálogo.",
      );
    }
  };

  try {
    synth.speak = blockedSpeak;
    synth.cancel = noop;
    synth.pause = noop;
    synth.resume = noop;
  } catch {
    // Algunos navegadores pueden exponer propiedades no configurables.
    // En ese caso, la app seguirá funcionando; el objetivo es reducir el uso robot.
  }
}

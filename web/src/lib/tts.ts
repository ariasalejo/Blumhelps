// simple TTS util using the Web Speech API with graceful fallback
export function speak(text: string, lang = "es-CO") {
  if (typeof window === "undefined") return;
  try {
    const synth = window.speechSynthesis;
    if (!synth) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = lang;
    synth.cancel();
    synth.speak(utter);
  } catch {
    // no-op fallback
  }
}

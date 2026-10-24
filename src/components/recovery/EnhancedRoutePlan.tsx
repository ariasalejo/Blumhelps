// ============================================================================
// BLUMHELPS — PLAN DE RUTA ENRIQUECIDO (reemplaza visualmente la lista del wizard)
// ============================================================================
// Autocontenido: recibe el route enriquecido y renderiza pasos con razones
// granulares, refs de catálogo y botón de voz. No toca recoveryNavigator.
// ============================================================================
import React, { useState } from "react";
import { Play, Square, Clock, AlertTriangle, Compass, BookOpen, CheckCircle2 } from "lucide-react";
import type { EnhancedRoute } from "../../lib/recovery/routeEnhancer";
import { ReasonsList } from "./ReasonsList";
import { pickRecoveryVoice } from "../../lib/recovery/voice";

export function EnhancedRoutePlan({ route }: { route: EnhancedRoute }) {
  const [playing, setPlaying] = useState(false);

  const speak = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(route.voz);
    u.lang = "es-CO";
    u.rate = 0.95;
    const v = pickRecoveryVoice(window.speechSynthesis.getVoices());
    if (v) u.voice = v;
    u.onend = () => setPlaying(false);
    setPlaying(true);
    window.speechSynthesis.speak(u);
  };
  const stop = () => { window.speechSynthesis?.cancel(); setPlaying(false); };

  return (
    <div className="space-y-5">
      <header className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold serif">{route.title}</h2>
          <p className="mt-1 text-gray-700">{route.message}</p>
          {route.ancla && (
            <p className="mt-2 inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-[var(--terra)]/15 text-[var(--terra)] font-semibold">
              <Compass className="w-3 h-3" aria-hidden="true" /> Valor ancla: {route.ancla.dominio} · Coherencia {route.congruencia}/100
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => (playing ? stop() : speak())}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--ink)] text-[var(--cream)] text-sm font-medium hover:bg-[var(--moss)] transition"
        >
          {playing ? (<><Square className="w-4 h-4" aria-hidden="true" /> Detener</>) : (<><Play className="w-4 h-4" aria-hidden="true" /> Escuchar mi ruta</>)}
        </button>
      </header>

      <p className="text-sm text-gray-700 italic border-l-2 border-[var(--gold)] pl-3">{route.voz}</p>

      <div className="grid gap-4">
        {route.steps.map((s, idx) => (
          <article key={s.id} className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className={
                "w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0 " +
                (s.priority === "urgent" ? "bg-red-100 text-red-700" :
                 s.priority === "ancla" ? "bg-[var(--terra)]/15 text-[var(--terra)]" :
                 "bg-[var(--moss)]/10 text-[var(--moss)]")
              }>
                {s.priority === "urgent" ? <AlertTriangle className="w-5 h-5" aria-hidden="true" /> :
                 s.priority === "ancla" ? <Compass className="w-5 h-5" aria-hidden="true" /> : idx + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <h3 className="text-lg sm:text-xl font-semibold">{s.title}</h3>
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600 flex items-center gap-1">
                    <Clock className="w-3 h-3" aria-hidden="true" />{s.time}
                  </span>
                </div>
                <p className="mt-1 text-gray-700 leading-relaxed">{s.description}</p>

                {s.razones.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Por qué este paso para ti</p>
                    <ReasonsList reasons={s.razones} max={3} />
                  </div>
                )}

                {s.catalogoRefs.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {s.catalogoRefs.map((c) => (
                      <span key={c.id} className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-full bg-[var(--moss)]/10 text-[var(--moss)]">
                        <BookOpen className="w-3 h-3" aria-hidden="true" />{c.titulo}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="rounded-2xl border border-[var(--moss)]/30 bg-[var(--moss)]/5 p-5">
        <div className="flex items-center gap-2 text-[var(--moss)] font-semibold">
          <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
          El primer paso, por más pequeño que sea, ya te acercó a algo mejor.
        </div>
        <p className="mt-2 text-sm text-gray-700">Guardado solo en este navegador (anónimo). Puedes volver aquí cuando quieras.</p>
      </div>
    </div>
  );
}

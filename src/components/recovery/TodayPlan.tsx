// ============================================================================
// BLUMHELPS — TARJETA "TU PLAN DE HOY" (Mejora #1)
// ============================================================================
// Autocontenida: carga la brújula, construye el plan, muestra razones granulares
// y botón de voz. Si no hay brújula, invita a definirla (no es callejón).
// ============================================================================
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Sunrise, Play, Square, Compass, Clock, Zap, Loader2 } from "lucide-react";
import { recoveryStorage } from "../../lib/recovery/storage";
import { buildTodayPlan, type TodayPlan as TodayPlanType } from "../../lib/recovery/todayPlan";
import type { ValorDeclarado } from "../../lib/recovery/valuesEngine";
import { ReasonsList } from "./ReasonsList";
import { pickRecoveryVoice } from "../../lib/recovery/voice";

export function TodayPlan() {
  const [loading, setLoading] = useState(true);
  const [valores, setValores] = useState<Record<string, ValorDeclarado> | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    let c = false;
    (async () => {
      const v = await recoveryStorage.getValues();
      if (!c) { setValores(v); setLoading(false); }
    })();
    return () => { c = true; };
  }, []);

  const plan = useMemo<TodayPlanType | null>(() => {
    if (!valores) return null;
    return buildTodayPlan(Object.values(valores));
  }, [valores]);

  const speak = (text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "es-CO";
    u.rate = 0.95;
    const v = pickRecoveryVoice(window.speechSynthesis.getVoices());
    if (v) u.voice = v;
    u.onend = () => setPlaying(false);
    setPlaying(true);
    window.speechSynthesis.speak(u);
  };
  const stop = () => { window.speechSynthesis?.cancel(); setPlaying(false); };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="w-7 h-7 animate-spin text-[var(--moss)]" />
      </div>
    );
  }

  if (!plan || plan.sugerencias.length === 0) {
    return (
      <section className="rounded-3xl border border-dashed border-gray-300 bg-gray-50/50 p-6 text-center">
        <Sunrise className="w-8 h-8 mx-auto text-gray-400 mb-2" aria-hidden="true" />
        <h2 className="font-semibold text-gray-700">Tu plan de hoy espera tu brújula</h2>
        <p className="text-sm text-gray-500 mt-1">Define tus valores y armaremos 3 pasos pequeños pensados para ti.</p>
        <Link to="/recuperacion/valores" className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-xl bg-[var(--moss)] text-white text-sm font-semibold hover:bg-[var(--moss-deep)]">
          <Compass className="w-4 h-4" aria-hidden="true" /> Definir mi brújula
        </Link>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border-2 border-[var(--gold)]/30 bg-[var(--gold)]/5 p-6 space-y-5">
      <header className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[var(--gold)] text-[var(--ink)] flex items-center justify-center">
            <Sunrise className="w-6 h-6" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-xl font-semibold serif">Tu plan de hoy</h2>
            <p className="text-xs text-gray-600">
              Pensado para tu valor ancla: {plan.ancla?.dominio ?? "—"} · Coherencia {plan.congruencia}/100
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => (playing ? stop() : speak(plan.mensajeVoz))}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--ink)] text-[var(--cream)] text-sm font-medium hover:bg-[var(--moss)] transition"
        >
          {playing ? (<><Square className="w-4 h-4" aria-hidden="true" /> Detener</>) : (<><Play className="w-4 h-4" aria-hidden="true" /> Escuchar mi plan</>)}
        </button>
      </header>

      <p className="text-sm text-gray-700 italic border-l-2 border-[var(--gold)] pl-3">{plan.mensajeVoz}</p>

      <div className="grid sm:grid-cols-3 gap-3">
        {plan.sugerencias.map((s, i) => (
          <article key={s.item.id} className="rounded-2xl bg-white border border-gray-200 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[var(--moss)]">Paso {i + 1}</span>
              <span className="inline-flex items-center gap-1 text-[10px] text-gray-500"><Clock className="w-3 h-3" aria-hidden="true" />{s.item.duracionMin} min</span>
            </div>
            <h3 className="font-semibold text-sm leading-snug">{s.item.titulo}</h3>
            <p className="text-xs text-gray-600">{s.item.descripcion}</p>
            <div className="pt-1"><ReasonsList reasons={s.reasons} max={2} /></div>
          </article>
        ))}
      </div>

      {plan.microAccion && (
        <div className="rounded-2xl bg-[var(--moss)]/10 border border-[var(--moss)]/20 p-4 flex items-start gap-3">
          <Zap className="w-5 h-5 text-[var(--moss)] shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p className="text-xs font-semibold text-[var(--moss)] uppercase tracking-wide">Micro-acción para ahora</p>
            <p className="text-sm text-gray-700 mt-1">{plan.microAccion.item.microAccion}</p>
          </div>
        </div>
      )}

      <p className="text-[11px] text-gray-500">
        Los ítems del catálogo usan voz neuronal Gonzalo pre-generada en MP3 locales. El resumen personalizado usa la mejor voz española disponible en el navegador; si no hay voz neuronal local, será provisional y no envía datos del paciente a servicios externos.
      </p>
    </section>
  );
}

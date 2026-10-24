// ============================================================================
// BLUMHELPS — HUB DE RECUPERACIÓN (página principal /recuperacion)
// ============================================================================
// Punto de entrada del módulo. Tarjetas hacia brújula, ruta 24h y próximos
// módulos. Muestra estado de la brújula en vivo (congruencia) si ya existe.
// ============================================================================
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Compass, Route as RouteIcon, BookOpen, PenLine, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { recoveryStorage } from "../../lib/recovery/storage";
import { computeValueCongruence, bandaCongruencia, type ValorDeclarado } from "../../lib/recovery/valuesEngine";
import { TodayPlan } from "../../components/recovery/TodayPlan";

function MiniGauge({ value }: { value: number }) {
  const r = 26;
  const circ = 2 * Math.PI * r;
  const off = circ * (1 - value / 100);
  const banda = bandaCongruencia(value);
  const color = banda === "brecha_alta" ? "var(--terra)" : banda === "en_proceso" ? "var(--gold)" : "var(--moss)";
  return (
    <div className="relative w-16 h-16 shrink-0" role="img" aria-label={"Congruencia " + value + " de 100"}>
      <svg viewBox="0 0 64 64" className="w-full h-full -rotate-90">
        <circle cx="32" cy="32" r={r} fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="6" />
        <circle cx="32" cy="32" r={r} fill="none" stroke={color} strokeWidth="6" strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={off} style={{ transition: "stroke-dashoffset 0.6s ease" }} />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-sm font-bold" style={{ color }}>{value}</span>
    </div>
  );
}

export function RecoveryHub() {
  const [loading, setLoading] = useState(true);
  const [valores, setValores] = useState<Record<string, ValorDeclarado> | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const v = await recoveryStorage.getValues();
      if (!cancelled) { setValores(v); setLoading(false); }
    })();
    return () => { cancelled = true; };
  }, []);

  const congruencia = useMemo(
    () => (valores ? computeValueCongruence(Object.values(valores)) : null),
    [valores],
  );
  const definida = !!valores && Object.keys(valores).length >= 3;

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--moss)]" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-widest text-[var(--moss)] font-semibold">Tu espacio</p>
        <h1 className="serif text-3xl sm:text-4xl font-bold">Bienvenido a tu proceso</h1>
        <p className="text-muted max-w-2xl">
          Este es tu centro de acompañamiento psicoeducativo. Todo lo que hagas aquí se queda en este dispositivo.
          Empieza por orientarte con tus valores: es la brújula que da sentido a cada paso.
        </p>
      </header>

      {/* Tarjeta destacada: Brújula */}
      <Link to="/recuperacion/valores"
        className="group block rounded-3xl border-2 border-[var(--moss)]/30 bg-[var(--moss)]/5 hover:bg-[var(--moss)]/10 hover:border-[var(--moss)] transition-all p-6 sm:p-8">
        <div className="flex items-start gap-5">
          <div className="w-14 h-14 rounded-2xl bg-[var(--moss)] text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Compass className="w-7 h-7" aria-hidden="true" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-semibold serif">Tu brújula de valores</h2>
              {definida ? (
                <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-[var(--moss)] text-white">
                  <CheckCircle2 className="w-3 h-3" aria-hidden="true" /> Definida
                </span>
              ) : (
                <span className="text-xs px-2 py-1 rounded-full bg-[var(--gold)]/20 text-[var(--ink)]">Empezar aquí</span>
              )}
            </div>
            <p className="mt-2 text-sm text-gray-700">
              {definida
                ? "Ya reconociste lo que te importa. Entra a ajustar tu coherencia o a ver cómo la usamos para recomendarte contenido."
                : "Elige las áreas que de verdad te importan y mide cuánto las vives hoy. Es el primer acto de tu proceso: dirección, no presión."}
            </p>
          </div>
          <div className="hidden sm:flex flex-col items-center gap-2 shrink-0">
            {congruencia !== null && <MiniGauge value={congruencia} />}
            <ArrowRight className="w-5 h-5 text-[var(--moss)] group-hover:translate-x-1 transition-transform" aria-hidden="true" />
          </div>
        </div>
      </Link>

      {/* Plan de hoy: puente brújula × catálogo */}
      <TodayPlan />

      {/* Grid de accesos */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link to="/ruta" className="group rounded-2xl border border-gray-200 bg-white p-5 hover:border-[var(--moss)] hover:shadow-md transition-all">
          <div className="w-11 h-11 rounded-xl bg-[var(--ink)]/5 flex items-center justify-center mb-3 group-hover:bg-[var(--moss)]/10 transition">
            <RouteIcon className="w-5 h-5 text-[var(--moss)]" aria-hidden="true" />
          </div>
          <h3 className="font-semibold">Mi ruta de 24 horas</h3>
          <p className="text-sm text-gray-600 mt-1">Un plan corto y realista para hoy. Anónimo, sin registro.</p>
        </Link>

        <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50/50 p-5 opacity-70" aria-disabled="true">
          <div className="w-11 h-11 rounded-xl bg-gray-200 flex items-center justify-center mb-3">
            <BookOpen className="w-5 h-5 text-gray-500" aria-hidden="true" />
          </div>
          <h3 className="font-semibold text-gray-700">Biblioteca de contenido</h3>
          <p className="text-sm text-gray-500 mt-1">20 ítems psicoeducativos con fuente. Próximamente (FASE 2.4).</p>
        </div>

        <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50/50 p-5 opacity-70" aria-disabled="true">
          <div className="w-11 h-11 rounded-xl bg-gray-200 flex items-center justify-center mb-3">
            <PenLine className="w-5 h-5 text-gray-500" aria-hidden="true" />
          </div>
          <h3 className="font-semibold text-gray-700">Mi diario de proceso</h3>
          <p className="text-sm text-gray-500 mt-1">Escribe cómo te sientes. Próximamente (FASE 2.4).</p>
        </div>
      </div>

      <p className="text-xs text-gray-500 text-center pt-4 border-t border-gray-100">
        Acompañamiento psicoeducativo. No sustituye atención profesional. En crisis, llama al 123 o al 106.
      </p>
    </div>
  );
}

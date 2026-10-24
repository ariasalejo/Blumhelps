// ============================================================================
// BLUMHELPS — BRÚJULA DE VALORES (ACT) — FASE 2.3 (corrección persistencia)
// ============================================================================
// Guarda el record COMPLETO (importancia + coherencia) vía recoveryStorage.setValues.
// Restaura al montar. Gauge en vivo. Razones visibles.
// ============================================================================
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Compass, Save, RotateCcw, Loader2, ArrowLeft } from "lucide-react";
import {
  DOMINIOS_VALOR,
  computeValueCongruence,
  bandaCongruencia,
  TEXTO_BANDA,
  scoreByValues,
  analizarValores,
  type ValorDeclarado,
} from "../../lib/recovery/valuesEngine";
import { recoveryStorage } from "../../lib/recovery/storage";
import { ReasonsList } from "./ReasonsList";

const MIN_VALORES = 3;
const MAX_VALORES = 8;

function Gauge({ value }: { value: number }) {
  const r = 54;
  const circ = 2 * Math.PI * r;
  const off = circ * (1 - value / 100);
  const banda = bandaCongruencia(value);
  const color = banda === "brecha_alta" ? "var(--terra)" : banda === "en_proceso" ? "var(--gold)" : "var(--moss)";
  return (
    <div className="relative w-36 h-36" role="img" aria-label={"Congruencia de valores " + value + " de 100"}>
      <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
        <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="10" />
        <circle cx="60" cy="60" r={r} fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={off}
          style={{ transition: "stroke-dashoffset 0.6s ease, stroke 0.4s ease" }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold serif" style={{ color }}>{value}</span>
        <span className="text-[10px] uppercase tracking-widest text-gray-500">/ 100</span>
      </div>
    </div>
  );
}

export function ValuesCompass({ onSaved }: { onSaved?: (valores: ValorDeclarado[]) => void }) {
  const navigate = useNavigate();
  const [sel, setSel] = useState<Record<string, ValorDeclarado>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  // Restaurar al montar (corrección del bug de persistencia)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const saved = await recoveryStorage.getValues();
      if (!cancelled && saved) setSel(saved);
      if (!cancelled) setLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  const lista = useMemo(() => Object.values(sel), [sel]);
  const congruencia = useMemo(() => computeValueCongruence(lista), [lista]);
  const banda = bandaCongruencia(congruencia);
  const analisis = useMemo(() => analizarValores(lista), [lista]);
  const razonesDemo = useMemo(() => scoreByValues(lista, "valores_personales", ["act", "valores"]), [lista]);

  const toggle = (id: string, etiqueta: string) => {
    setSel((prev) => {
      const next = { ...prev };
      if (next[id]) delete next[id];
      else if (Object.keys(next).length < MAX_VALORES) next[id] = { dominio: etiqueta, importancia: 7, coherencia: 4 };
      return next;
    });
  };
  const patch = (id: string, campo: "importancia" | "coherencia", val: number) =>
    setSel((prev) => ({ ...prev, [id]: { ...prev[id], [campo]: val } }));

  const guardar = async () => {
    if (lista.length < MIN_VALORES) { setMsg("Elige al menos " + MIN_VALORES + " valores."); return; }
    setSaving(true);
    try {
      await recoveryStorage.setValues(sel);
      setMsg("Brújula guardada. Congruencia: " + congruencia + "/100.");
      onSaved?.(lista);
      setTimeout(() => navigate("/recuperacion"), 900);
    } catch {
      setMsg("No se pudo guardar. Revisa el almacenamiento del navegador.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--moss)]" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      <header className="flex items-center gap-3">
        <Compass className="w-8 h-8 text-[var(--moss)]" aria-hidden="true" />
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold serif">Tu brújula de valores</h1>
          {analisis.ancla && (
            <span className="ml-2 inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-[var(--terra)]/15 text-[var(--terra)] font-semibold">
              Valor ancla: {analisis.ancla.dominio}
            </span>
          )}
          <p className="text-sm text-gray-600">
            Elige de {MIN_VALORES} a {MAX_VALORES} áreas que te importan y marca cuánto las vives hoy.
            No hay respuestas incorrectas: es tu dirección, no una meta a tachar.
          </p>
        </div>
      </header>

      <div className="grid sm:grid-cols-2 gap-6">
        <section aria-label="Dominios de valor">
          <h2 className="font-semibold mb-3">1. ¿Qué te importa?</h2>
          <div className="flex flex-wrap gap-2">
            {DOMINIOS_VALOR.map((d) => {
              const activo = !!sel[d.id];
              return (
                <button key={d.id} type="button" onClick={() => toggle(d.id, d.etiqueta)} aria-pressed={activo} title={d.guia}
                  className={"px-3 py-2 rounded-full text-sm border transition " +
                    (activo ? "bg-[var(--moss)] text-white border-[var(--moss)]" : "bg-white text-gray-700 border-gray-300 hover:border-[var(--moss)]")}>
                  {d.etiqueta}
                </button>
              );
            })}
          </div>
          <p className="text-xs text-gray-500 mt-2">{lista.length}/{MAX_VALORES} seleccionados</p>
        </section>

        <section aria-label="Congruencia global" className="flex flex-col items-center justify-center">
          <h2 className="font-semibold mb-3 self-start">2. Tu coherencia hoy</h2>
          <Gauge value={congruencia} />
          <p className="text-sm text-gray-700 mt-3 text-center max-w-xs">{TEXTO_BANDA[banda]}</p>
        </section>
      </div>

      {lista.length > 0 && (
        <section aria-label="Detalle por valor" className="space-y-3">
          <h2 className="font-semibold">3. Importancia vs. coherencia</h2>
          {lista.map((v) => {
            const idKey = DOMINIOS_VALOR.find((d) => d.etiqueta === v.dominio)?.id ?? v.dominio;
            return (
              <article key={idKey} className="rounded-2xl border border-gray-200 bg-white p-4 space-y-3">
                <h3 className="font-medium">{v.dominio}</h3>
                <label className="block text-sm">
                  <span className="flex justify-between"><span>Importancia</span><span className="font-mono">{v.importancia}/10</span></span>
                  <input type="range" min={1} max={10} value={v.importancia}
                    onChange={(e) => patch(idKey, "importancia", Number(e.target.value))}
                    className="w-full accent-[var(--moss)]" aria-label={"Importancia de " + v.dominio} />
                </label>
                <label className="block text-sm">
                  <span className="flex justify-between"><span>¿Cuánto lo vives hoy?</span><span className="font-mono">{v.coherencia}/10</span></span>
                  <input type="range" min={0} max={10} value={v.coherencia}
                    onChange={(e) => patch(idKey, "coherencia", Number(e.target.value))}
                    className="w-full accent-[var(--gold)]" aria-label={"Coherencia de " + v.dominio} />
                </label>
              </article>
            );
          })}
        </section>
      )}

      {razonesDemo.length > 0 && (
        <section aria-label="Por qué importa" className="rounded-2xl bg-[var(--moss)]/5 border border-[var(--moss)]/20 p-4">
          <h2 className="font-semibold mb-2">Cómo usaremos esto</h2>
          <ReasonsList reasons={razonesDemo} />
        </section>
      )}

      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={guardar} disabled={saving || lista.length < MIN_VALORES}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--moss)] text-white font-semibold hover:bg-[var(--moss-deep)] disabled:bg-gray-300 transition">
          <Save className="w-4 h-4" aria-hidden="true" /> {saving ? "Guardando..." : "Guardar brújula"}
        </button>
        <Link to="/recuperacion" className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-300 hover:bg-gray-50">
          <ArrowLeft className="w-4 h-4" aria-hidden="true" /> Volver a mi espacio
        </Link>
        <button type="button" onClick={() => { setSel({}); setMsg(""); }}
          className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-300 hover:bg-gray-50">
          <RotateCcw className="w-4 h-4" aria-hidden="true" /> Reiniciar
        </button>
      </div>
      {msg && <p className="text-sm text-[var(--moss)]" role="status">{msg}</p>}
    </div>
  );
}

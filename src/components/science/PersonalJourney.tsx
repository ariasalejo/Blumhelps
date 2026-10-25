import React, { useEffect, useMemo, useState } from 'react';
import { Activity, Heart, LineChart, LockKeyhole, Save, Trash2 } from 'lucide-react';
import { recoveryStorage } from '../../lib/recovery/storage';
import type { JournalEntry, MoodLabel } from '../../lib/recovery/types';

const TRACKING_TAG = '__blumhelps_trayectoria__';
const MOOD_VALUE: Record<MoodLabel, number> = {
  muy_bajo: 1,
  bajo: 2,
  neutral: 3,
  bien: 4,
  muy_bien: 5,
};
const MOOD_LABEL: Record<MoodLabel, string> = {
  muy_bajo: 'Muy difícil',
  bajo: 'Difícil',
  neutral: 'Intermedio',
  bien: 'Bien',
  muy_bien: 'Muy bien',
};
const STEP_OPTIONS = [
  'Pedí o acepté apoyo',
  'Cuidé mi descanso',
  'Me moví o salí un momento',
  'Estudié o avancé en el trabajo',
  'Cuidé un vínculo importante',
  'Hice una pausa para cuidarme',
  'Di otro paso pequeño',
];

type Metric = 'mood' | 'craving';

function localDateLabel(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return 'Fecha no disponible';
  return date.toLocaleDateString('es-CO', { day: '2-digit', month: 'short' });
}

function fullDateLabel(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return 'Fecha no disponible';
  return date.toLocaleString('es-CO', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function TrendChart({
  entries,
  metric,
  title,
  description,
}: {
  entries: JournalEntry[];
  metric: Metric;
  title: string;
  description: string;
}) {
  const width = 640;
  const height = 235;
  const padLeft = 42;
  const padRight = 18;
  const padTop = 20;
  const padBottom = 42;
  const min = metric === 'mood' ? 1 : 0;
  const max = metric === 'mood' ? 5 : 10;
  const points = entries
    .filter((entry) => metric === 'mood' || typeof entry.craving === 'number')
    .slice(-14);
  const plotWidth = width - padLeft - padRight;
  const plotHeight = height - padTop - padBottom;
  const xFor = (index: number) =>
    padLeft + (points.length < 2 ? plotWidth / 2 : (index / (points.length - 1)) * plotWidth);
  const valueFor = (entry: JournalEntry) =>
    metric === 'mood' ? MOOD_VALUE[entry.animo] : (entry.craving ?? 0);
  const yFor = (value: number) => padTop + ((max - value) / (max - min)) * plotHeight;
  const linePoints = points.map((entry, index) => `${xFor(index)},${yFor(valueFor(entry))}`).join(' ');
  const ticks = metric === 'mood' ? [1, 2, 3, 4, 5] : [0, 2, 4, 6, 8, 10];

  if (points.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 p-5 text-sm text-gray-600">
        Todavía no hay datos suficientes para este gráfico. Puedes registrar un punto cuando te resulte útil.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
      <div className="mb-3">
        <h3 className="font-semibold text-[var(--ink)]">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label={`${title}. ${description}`}
          className="w-full min-w-[300px]"
        >
          {ticks.map((tick) => {
            const y = yFor(tick);
            return (
              <g key={tick}>
                <line x1={padLeft} x2={width - padRight} y1={y} y2={y} stroke="#e5e7eb" strokeDasharray="4 4" />
                <text x={padLeft - 10} y={y + 4} textAnchor="end" fontSize="11" fill="#6b7280">{tick}</text>
              </g>
            );
          })}
          {points.length > 1 && (
            <polyline points={linePoints} fill="none" stroke="#52764a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          )}
          {points.map((entry, index) => {
            const value = valueFor(entry);
            return (
              <g key={entry.id}>
                <circle cx={xFor(index)} cy={yFor(value)} r="5" fill="#52764a" stroke="#ffffff" strokeWidth="2">
                  <title>
                    {fullDateLabel(entry.createdAt)}: {metric === 'mood' ? MOOD_LABEL[entry.animo] : `${value} de 10`}
                  </title>
                </circle>
                {(index === 0 || index === points.length - 1 || index % Math.ceil(points.length / 5) === 0) && (
                  <text x={xFor(index)} y={height - 15} textAnchor="middle" fontSize="10" fill="#6b7280">
                    {localDateLabel(entry.createdAt)}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
      <p className="mt-2 text-xs text-gray-500">Se muestran hasta los últimos 14 registros de esta serie. Escala de autoobservación, no instrumento diagnóstico.</p>
    </div>
  );
}

export function PersonalJourney() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [mood, setMood] = useState<MoodLabel>('neutral');
  const [trackCraving, setTrackCraving] = useState(true);
  const [craving, setCraving] = useState(3);
  const [steps, setSteps] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    recoveryStorage.getJournal()
      .then((all) => {
        if (active) setEntries(all.filter((entry) => entry.etiquetas?.includes(TRACKING_TAG)));
      })
      .catch(() => {
        if (active) setStatus('No pudimos leer los registros guardados en este dispositivo.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  const sortedEntries = useMemo(
    () => [...entries].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()),
    [entries],
  );

  const toggleStep = (step: string) => {
    setSteps((current) => current.includes(step)
      ? current.filter((value) => value !== step)
      : [...current, step]);
  };

  const saveEntry = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('');
    if (!consentAccepted) {
      setStatus('Antes de guardar, lee y acepta el aviso sobre almacenamiento local sin cifrado.');
      return;
    }

    setSaving(true);
    const entry: JournalEntry = {
      id: `trajectory-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      createdAt: new Date().toISOString(),
      texto: note.trim() || 'Registro de trayectoria personal.',
      animo: mood,
      etiquetas: [...steps, TRACKING_TAG],
      ...(trackCraving ? { craving } : {}),
    };

    try {
      const all = await recoveryStorage.getJournal();
      await recoveryStorage.setJournal([entry, ...all]);
      const saved = await recoveryStorage.getJournal();
      if (!saved.some((item) => item.id === entry.id)) {
        throw new Error('No fue posible confirmar el guardado local.');
      }
      setEntries(saved.filter((item) => item.etiquetas?.includes(TRACKING_TAG)));
      setNote('');
      setSteps([]);
      setStatus('Registro guardado en este dispositivo. No se envió desde esta función a un servidor.');
    } catch {
      setStatus('No pudimos confirmar el guardado. Revisa el espacio disponible del navegador e inténtalo otra vez.');
    } finally {
      setSaving(false);
    }
  };

  const removeEntry = async (id: string) => {
    if (!window.confirm('¿Borrar este registro de trayectoria de este dispositivo?')) return;
    try {
      const all = await recoveryStorage.getJournal();
      await recoveryStorage.setJournal(all.filter((entry) => entry.id !== id));
      const saved = await recoveryStorage.getJournal();
      setEntries(saved.filter((entry) => entry.etiquetas?.includes(TRACKING_TAG)));
      setStatus('Registro eliminado de los datos locales disponibles.');
    } catch {
      setStatus('No fue posible confirmar la eliminación de este registro.');
    }
  };

  const visibleEntries = [...sortedEntries].reverse();

  return (
    <section className="space-y-6" aria-labelledby="journey-title">
      <div className="rounded-3xl border border-[var(--moss)]/20 bg-gradient-to-br from-white to-[var(--moss)]/5 p-5 sm:p-8">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--moss)]/10 text-[var(--moss)]">
            <Activity className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--moss)]">Tu experiencia, no una puntuación clínica</p>
            <h2 id="journey-title" className="mt-1 text-2xl sm:text-3xl font-bold text-[var(--ink)]">Mi recorrido, paso a paso</h2>
            <p className="mt-2 max-w-3xl text-sm sm:text-base leading-relaxed text-gray-700">
              Registra cómo te sentiste y qué pequeño paso diste. Los gráficos se calculan con tus propios registros: no comparan tu vida con la de otras personas, no predicen recaídas y no califican tu valor.
            </p>
          </div>
        </div>

        <div className="mt-5 flex items-start gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950">
          <LockKeyhole className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          <div>
            <strong>Transparencia sobre tus datos.</strong> Esta función guarda el registro en el almacenamiento del navegador de este dispositivo. En esta versión no está cifrado con una clave personal; alguien con acceso al dispositivo o al perfil del navegador podría verlo. No escribas contraseñas, nombres completos ni detalles que identifiquen a otras personas. No se envía el texto a un servicio de IA desde esta función.
          </div>
        </div>

        <form onSubmit={saveEntry} className="mt-6 space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            <fieldset>
              <legend className="mb-2 font-semibold text-[var(--ink)]">¿Cómo estuvo tu día?</legend>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {(Object.keys(MOOD_LABEL) as MoodLabel[]).map((value) => (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={mood === value}
                    onClick={() => setMood(value)}
                    className={`rounded-xl border px-3 py-2 text-left text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--moss)] ${mood === value ? 'border-[var(--moss)] bg-[var(--moss)] text-white' : 'border-gray-200 bg-white text-gray-700 hover:border-[var(--moss)]'}`}
                  >
                    {MOOD_LABEL[value]}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-xs text-gray-500">Es una autoobservación subjetiva, no un diagnóstico.</p>
            </fieldset>

            <fieldset>
              <legend className="mb-2 font-semibold text-[var(--ink)]">¿Qué te ayudaría a recordar?</legend>
              <div className="grid gap-2 sm:grid-cols-2">
                {STEP_OPTIONS.map((step) => (
                  <label key={step} className="flex cursor-pointer items-start gap-2 rounded-xl border border-gray-200 bg-white p-3 text-sm text-gray-700 hover:border-[var(--moss)]">
                    <input type="checkbox" checked={steps.includes(step)} onChange={() => toggleStep(step)} className="mt-0.5 accent-[var(--moss)]" />
                    <span>{step}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-4">
            <label className="flex items-center gap-3 font-semibold text-[var(--ink)]">
              <input type="checkbox" checked={trackCraving} onChange={(event) => setTrackCraving(event.target.checked)} className="h-4 w-4 accent-[var(--moss)]" />
              También quiero registrar la intensidad de un impulso o craving
            </label>
            {trackCraving && (
              <div className="mt-3">
                <div className="flex items-center justify-between gap-4 text-sm text-gray-700">
                  <label htmlFor="craving-range">Tu percepción ahora</label>
                  <strong>{craving} / 10</strong>
                </div>
                <input id="craving-range" type="range" min="0" max="10" value={craving} onChange={(event) => setCraving(Number(event.target.value))} className="mt-3 w-full accent-[var(--moss)]" />
                <div className="flex justify-between text-xs text-gray-500"><span>0 · Ninguno</span><span>10 · Muy intenso</span></div>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="journey-note" className="mb-2 block font-semibold text-[var(--ink)]">Una frase sobre tu paso de hoy (opcional)</label>
            <textarea
              id="journey-note"
              rows={3}
              maxLength={240}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Ej.: Hoy pedí ayuda en vez de aislarme."
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:border-[var(--moss)] focus:outline-none focus:ring-2 focus:ring-[var(--moss)]/20"
            />
            <p className="mt-1 text-xs text-gray-500">{note.length}/240 caracteres. Evita datos identificables.</p>
          </div>

          <label className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50/70 p-4 text-sm text-gray-800">
            <input type="checkbox" checked={consentAccepted} onChange={(event) => setConsentAccepted(event.target.checked)} className="mt-1 h-4 w-4 accent-[var(--moss)]" />
            <span>Entiendo que acepto guardar este registro en el almacenamiento local del navegador, que no está cifrado con una clave personal. Puedo borrar registros individuales desde la cronología.</span>
          </label>

          <div className="flex flex-wrap items-center gap-3">
            <button type="submit" disabled={saving || loading} className="inline-flex items-center gap-2 rounded-xl bg-[var(--ink)] px-5 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50">
              <Save className="h-4 w-4" aria-hidden="true" /> {saving ? 'Guardando…' : 'Guardar mi registro'}
            </button>
            {status && <p role="status" aria-live="polite" className="text-sm text-gray-700">{status}</p>}
          </div>
        </form>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <LineChart className="h-5 w-5 text-[var(--moss)]" aria-hidden="true" />
          <h3 className="text-xl font-bold text-[var(--ink)]">Tus gráficos de evolución personal</h3>
        </div>
        {loading ? (
          <p className="text-sm text-gray-600">Cargando registros locales…</p>
        ) : sortedEntries.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-6 text-sm text-gray-600">
            Tu gráfico empezará cuando guardes el primer registro. No hay datos demostrativos ni resultados inventados.
          </div>
        ) : (
          <>
            <div className="grid gap-4 lg:grid-cols-2">
              <TrendChart entries={sortedEntries} metric="mood" title="Cómo describiste tu ánimo" description="Escala personal de 1 (muy difícil) a 5 (muy bien)." />
              {sortedEntries.some((entry) => typeof entry.craving === 'number') && (
                <TrendChart entries={sortedEntries} metric="craving" title="Intensidad del impulso registrada" description="Tu propia escala de 0 a 10. No es un predictor de recaída." />
              )}
            </div>
            <p className="text-xs text-gray-500">La línea muestra variaciones registradas, no demuestra causalidad ni permite concluir por sí sola si un tratamiento funciona. Un día difícil no borra los pasos anteriores.</p>
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-[var(--ink)]">Cronología de tus pasos</h3>
              {visibleEntries.map((entry) => (
                <article key={entry.id} className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--moss)]">{fullDateLabel(entry.createdAt)}</p>
                      <h4 className="mt-1 font-semibold text-[var(--ink)]">Ánimo: {MOOD_LABEL[entry.animo]}</h4>
                    </div>
                    <button type="button" onClick={() => removeEntry(entry.id)} className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-2 text-xs text-gray-600 hover:border-red-300 hover:text-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2" aria-label={`Borrar el registro del ${fullDateLabel(entry.createdAt)}`}>
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" /> Borrar
                    </button>
                  </div>
                  {typeof entry.craving === 'number' && <p className="mt-2 text-sm text-gray-700">Intensidad registrada: <strong>{entry.craving}/10</strong></p>}
                  {entry.etiquetas.filter((tag) => tag !== TRACKING_TAG).length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {entry.etiquetas.filter((tag) => tag !== TRACKING_TAG).map((tag) => <span key={tag} className="rounded-full bg-[var(--moss)]/10 px-3 py-1 text-xs text-[var(--moss)]">{tag}</span>)}
                    </div>
                  )}
                  {entry.texto !== 'Registro de trayectoria personal.' && <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-relaxed text-gray-700">{entry.texto}</p>}
                </article>
              ))}
            </div>
          </>
        )}
      </div>

      <p className="flex items-start gap-2 rounded-xl bg-gray-100 p-4 text-xs leading-relaxed text-gray-600">
        <Heart className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        Tu trayectoria no tiene que ser perfecta ni ascendente. Este registro es una herramienta de reflexión, no una evaluación clínica. Si una gráfica te genera ansiedad, puedes dejar de usarla.
      </p>
    </section>
  );
}

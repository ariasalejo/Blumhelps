import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Sunrise, Play, Square, Compass, Clock, Zap, Loader2, CheckCircle2,
  HeartHandshake, RotateCcw, ArrowRight, Sparkles,
} from "lucide-react";
import { recoveryStorage } from "../../lib/recovery/storage";
import { buildTodayPlan, type TodayPlan as TodayPlanType } from "../../lib/recovery/todayPlan";
import type { ValorDeclarado } from "../../lib/recovery/valuesEngine";
import { ReasonsList } from "./ReasonsList";
import { pickRecoveryVoice } from "../../lib/recovery/voice";
import { getRecoveryPiperAudio } from "../../lib/recovery/piperAudioLibrary";
import { LocalAudioPlayer } from "./LocalAudioPlayer";

const DAILY_PROGRESS_KEY = "blumhelps.mi-progreso.daily.v1";

type DailyProgress = { date: string; completedIds: string[] };

function localDateKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function readDailyProgress(): DailyProgress {
  try {
    const raw = window.localStorage.getItem(DAILY_PROGRESS_KEY);
    if (!raw) return { date: localDateKey(), completedIds: [] };
    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      "date" in parsed &&
      "completedIds" in parsed &&
      parsed.date === localDateKey() &&
      Array.isArray(parsed.completedIds)
    ) {
      return {
        date: localDateKey(),
        completedIds: parsed.completedIds.filter((id): id is string => typeof id === "string"),
      };
    }
  } catch {
    // El almacenamiento puede estar bloqueado; la experiencia sigue funcionando en memoria.
  }
  return { date: localDateKey(), completedIds: [] };
}

export function TodayPlan() {
  const [loading, setLoading] = useState(true);
  const [valores, setValores] = useState<Record<string, ValorDeclarado> | null>(null);
  const [playing, setPlaying] = useState(false);
  const [completedToday, setCompletedToday] = useState<string[]>([]);
  const [storageNotice, setStorageNotice] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const v = await recoveryStorage.getValues();
      if (!cancelled) {
        setValores(v);
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    setCompletedToday(readDailyProgress().completedIds);
  }, []);

  const plan = useMemo<TodayPlanType | null>(() => {
    if (!valores) return null;
    return buildTodayPlan(Object.values(valores));
  }, [valores]);

  const speak = (text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      setStorageNotice("La voz del navegador no está disponible en este dispositivo. Puedes leer el resumen o escuchar los audios locales de cada actividad.");
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "es-CO";
    utterance.rate = 0.93;
    const voice = pickRecoveryVoice(window.speechSynthesis.getVoices());
    if (voice) utterance.voice = voice;
    utterance.onend = () => setPlaying(false);
    utterance.onerror = () => {
      setPlaying(false);
      setStorageNotice("No se pudo reproducir la voz del navegador. El texto sigue disponible y puedes usar los audios locales.");
    };
    setPlaying(true);
    window.speechSynthesis.speak(utterance);
  };

  const stop = () => {
    window.speechSynthesis?.cancel();
    setPlaying(false);
  };

  const markDone = (id: string) => {
    const next = completedToday.includes(id)
      ? completedToday
      : [...completedToday, id];
    setCompletedToday(next);
    try {
      window.localStorage.setItem(DAILY_PROGRESS_KEY, JSON.stringify({
        date: localDateKey(),
        completedIds: next,
      } satisfies DailyProgress));
      setStorageNotice(null);
    } catch {
      setStorageNotice("El avance quedó marcado durante esta sesión, pero el navegador no permitió guardarlo en este dispositivo.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10" role="status" aria-label="Preparando tu plan">
        <Loader2 className="h-7 w-7 animate-spin text-[var(--moss)]" aria-hidden="true" />
      </div>
    );
  }

  if (!plan || plan.sugerencias.length === 0) {
    return (
      <section className="relative isolate overflow-hidden rounded-[2rem] border border-emerald-100/15 bg-gradient-to-br from-[#102b29] via-[#163c35] to-[#172f39] p-6 text-white shadow-xl sm:p-8">
        <div aria-hidden="true" className="pointer-events-none absolute -right-12 -top-16 -z-10 h-48 w-48 rounded-full bg-emerald-300/10 blur-3xl" />
        <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.22em] text-emerald-200"><Sparkles className="h-4 w-4" aria-hidden="true" /> TU SIGUIENTE PASO</p>
        <h2 className="mt-3 max-w-2xl text-2xl font-semibold tracking-tight sm:text-3xl">No necesitas tener todo claro para empezar.</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-white/70">Podemos comenzar con algo sencillo: atender una necesidad básica, descansar un momento o buscar compañía. Tu ruta se puede personalizar cuando quieras definir tu brújula.</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link to="/ruta" className="inline-flex items-center gap-2 rounded-full bg-emerald-200 px-4 py-2.5 text-xs font-bold text-[#102b29] transition hover:bg-white">Elegir un paso para hoy <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
          <Link to="/recuperacion/valores" className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[.05] px-4 py-2.5 text-xs font-semibold text-white/85 transition hover:bg-white/10"><Compass className="h-4 w-4" aria-hidden="true" /> Explorar mi brújula</Link>
        </div>
      </section>
    );
  }

  const mainSuggestion = plan.sugerencias[0];
  const doneMain = completedToday.includes(mainSuggestion.item.id);
  const dailyCount = plan.sugerencias.filter((suggestion) => completedToday.includes(suggestion.item.id)).length
    + (plan.microAccion && completedToday.includes(plan.microAccion.item.id) ? 1 : 0);
  const dailyTotal = plan.sugerencias.length + (plan.microAccion ? 1 : 0);

  return (
    <section aria-labelledby="today-plan-title" className="relative isolate overflow-hidden rounded-[2rem] border border-emerald-950/10 bg-gradient-to-br from-[#f7faf6] via-white to-[#edf7f2] p-5 shadow-[0_24px_70px_rgba(9,40,31,.10)] sm:p-7 lg:p-8">
      <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-24 -z-10 h-72 w-72 rounded-full bg-emerald-300/20 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 left-1/3 -z-10 h-64 w-64 rounded-full bg-cyan-200/20 blur-3xl" />

      <header className="relative flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-2xl">
          <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.22em] text-emerald-800"><Sunrise className="h-4 w-4" aria-hidden="true" /> MI PROGRESO · HOY</p>
          <h2 id="today-plan-title" className="serif mt-2 text-2xl font-semibold tracking-tight text-[#163b31] sm:text-3xl">No tienes que resolverlo todo hoy.</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">Vamos a convertir lo que te importa en un paso pequeño, concreto y posible. Puedes adaptarlo a tu energía y a tus circunstancias.</p>
        </div>
        <div className="min-w-[145px] rounded-2xl border border-emerald-900/10 bg-white/80 p-4 shadow-sm backdrop-blur">
          <p className="text-[10px] font-bold uppercase tracking-[.15em] text-emerald-800">Tu recorrido de hoy</p>
          <p className="mt-1 text-2xl font-semibold text-[#163b31]">{dailyCount}<span className="ml-1 text-sm font-normal text-slate-400">/ {dailyTotal}</span></p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-emerald-950/10"><div className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-teal-400 transition-[width] duration-500" style={{ width: `${dailyTotal ? Math.round((dailyCount / dailyTotal) * 100) : 0}%` }} /></div>
          <p className="mt-2 text-[10px] leading-4 text-slate-500">Orientación personal, no una calificación clínica.</p>
        </div>
      </header>

      {storageNotice && <p role="status" className="relative mt-4 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-900">{storageNotice}</p>}

      <div className="relative mt-6 grid gap-4 lg:grid-cols-[minmax(0,1.25fr)_minmax(250px,.75fr)]">
        <article className="rounded-3xl border border-emerald-900/10 bg-white/90 p-5 shadow-sm sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.15em] text-emerald-800"><HeartHandshake className="h-3.5 w-3.5" aria-hidden="true" /> Un paso amable</span>
            <span className="inline-flex items-center gap-1 text-xs text-slate-500"><Clock className="h-3.5 w-3.5" aria-hidden="true" /> {mainSuggestion.item.duracionMin} min</span>
          </div>
          <h3 className="mt-4 text-xl font-semibold leading-snug text-[#163b31]">{mainSuggestion.item.titulo}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{mainSuggestion.item.descripcion}</p>
          <div className="mt-4"><ReasonsList reasons={mainSuggestion.reasons} max={2} /></div>
          {(() => {
            const src = getRecoveryPiperAudio(mainSuggestion.item.id, "guion");
            return src ? <LocalAudioPlayer src={src} label={"Escuchar: " + mainSuggestion.item.titulo} className="mt-4" /> : null;
          })()}
          <div className="mt-5 flex flex-wrap gap-3">
            <button type="button" onClick={() => markDone(mainSuggestion.item.id)} disabled={doneMain} className="inline-flex items-center gap-2 rounded-full bg-[#164a3b] px-4 py-3 text-xs font-bold text-white transition hover:bg-[#0d352a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 disabled:cursor-default disabled:bg-emerald-100 disabled:text-emerald-900">
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> {doneMain ? "Paso reconocido por hoy" : "He dado este paso"}
            </button>
            <button type="button" onClick={() => speak(plan.mensajeVoz)} disabled={playing} className="inline-flex items-center gap-2 rounded-full border border-emerald-900/15 bg-white px-4 py-3 text-xs font-semibold text-emerald-900 transition hover:bg-emerald-50 disabled:opacity-50">
              <Play className="h-4 w-4" aria-hidden="true" /> Escuchar mi mensaje
            </button>
            {playing && <button type="button" onClick={stop} className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-3 text-xs text-slate-600 hover:bg-slate-50"><Square className="h-3.5 w-3.5" aria-hidden="true" /> Detener voz</button>}
          </div>
          {doneMain && <p role="status" className="mt-3 flex items-start gap-2 text-sm leading-6 text-emerald-900"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" /> Cuenta. No porque todo esté resuelto, sino porque hoy elegiste una acción posible.</p>}
        </article>

        <aside className="rounded-3xl border border-emerald-900/10 bg-[#12352e] p-5 text-white shadow-sm sm:p-6">
          <p className="text-[10px] font-bold uppercase tracking-[.2em] text-emerald-200">Una rutina flexible</p>
          <h3 className="mt-3 text-lg font-semibold">Pausa · Elige · Intenta · Reconoce</h3>
          <ol className="mt-4 space-y-3 text-sm leading-6 text-white/75">
            <li><span className="mr-2 font-bold text-emerald-200">01</span>Haz una pausa breve y revisa qué necesitas.</li>
            <li><span className="mr-2 font-bold text-emerald-200">02</span>Escoge una acción que quepa en tu día real.</li>
            <li><span className="mr-2 font-bold text-emerald-200">03</span>Inténtala, o redúcela si hoy pesa demasiado.</li>
            <li><span className="mr-2 font-bold text-emerald-200">04</span>Reconoce el esfuerzo sin exigirte perfección.</li>
          </ol>
          <p className="mt-4 border-t border-white/10 pt-4 text-xs leading-5 text-white/55">Si no pudiste hacerlo, no perdiste tu progreso. Puedes ajustar el paso, descansar o pedir apoyo.</p>
          <Link to="/ruta" className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-emerald-200 underline decoration-emerald-200/40 underline-offset-4 hover:text-white">Adaptar mi ruta de hoy <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
        </aside>
      </div>

      {plan.sugerencias.length > 1 && (
        <div className="relative mt-5">
          <h3 className="text-sm font-semibold text-[#163b31]">Otras opciones, si te sirven</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {plan.sugerencias.slice(1).map((suggestion, index) => {
              const done = completedToday.includes(suggestion.item.id);
              const src = getRecoveryPiperAudio(suggestion.item.id, "guion");
              return (
                <article key={suggestion.item.id} className="rounded-2xl border border-emerald-900/10 bg-white/80 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div><p className="text-[10px] font-bold uppercase tracking-[.15em] text-emerald-800">Alternativa {index + 1}</p><h4 className="mt-2 text-sm font-semibold text-[#163b31]">{suggestion.item.titulo}</h4></div>
                    {done && <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-700" aria-label="Realizado hoy" />}
                  </div>
                  <p className="mt-2 text-xs leading-5 text-slate-600">{suggestion.item.descripcion}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center gap-1 text-[10px] text-slate-500"><Clock className="h-3 w-3" aria-hidden="true" /> {suggestion.item.duracionMin} min</span>
                    <button type="button" onClick={() => markDone(suggestion.item.id)} disabled={done} className="text-xs font-semibold text-emerald-800 underline underline-offset-4 disabled:no-underline disabled:opacity-50">{done ? "Reconocido hoy" : "Marcar como realizado"}</button>
                  </div>
                  {src && <LocalAudioPlayer src={src} label={"Escuchar: " + suggestion.item.titulo} className="mt-3" />}
                </article>
              );
            })}
          </div>
        </div>
      )}

      {plan.microAccion && (
        <div className="relative mt-4 flex flex-wrap items-start justify-between gap-4 rounded-2xl border border-amber-900/10 bg-amber-50/80 p-4 sm:p-5">
          <div className="flex min-w-0 flex-1 items-start gap-3">
            <Zap className="mt-0.5 h-5 w-5 shrink-0 text-amber-800" aria-hidden="true" />
            <div><p className="text-[10px] font-bold uppercase tracking-[.15em] text-amber-900">Versión de dos minutos</p><h3 className="mt-1 text-sm font-semibold text-slate-800">{plan.microAccion.item.titulo}</h3><p className="mt-1 text-xs leading-5 text-slate-600">{plan.microAccion.item.microAccion}</p></div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {(() => {
              const src = getRecoveryPiperAudio(plan.microAccion!.item.id, "micro");
              return src ? <LocalAudioPlayer src={src} label={"Micro-acción: " + plan.microAccion!.item.titulo} /> : null;
            })()}
            <button type="button" onClick={() => markDone(plan.microAccion!.item.id)} disabled={completedToday.includes(plan.microAccion.item.id)} className="inline-flex items-center gap-2 rounded-full border border-amber-900/20 px-3 py-2 text-xs font-semibold text-amber-950 transition hover:bg-amber-100 disabled:opacity-50">
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> {completedToday.includes(plan.microAccion.item.id) ? "Hecho hoy" : "Lo intentaré"}
            </button>
          </div>
        </div>
      )}

      <div className="relative mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-emerald-900/10 pt-4">
        <p className="max-w-3xl text-[10px] leading-5 text-slate-500">La personalización se calcula en el dispositivo a partir de tu brújula y del catálogo local. El avance diario se guarda en este navegador; no se envían tus elecciones a un servicio externo. La voz del resumen depende de las voces disponibles en el navegador; los reproductores de cada actividad usan MP3 locales cuando están disponibles. Esto es orientación psicoeducativa, no diagnóstico ni tratamiento.</p>
        <button type="button" onClick={() => { setCompletedToday([]); try { window.localStorage.setItem(DAILY_PROGRESS_KEY, JSON.stringify({ date: localDateKey(), completedIds: [] } satisfies DailyProgress)); setStorageNotice(null); } catch { setStorageNotice("No se pudo reiniciar el registro guardado. Puedes seguir usando la experiencia durante esta sesión."); } }} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-2 text-xs text-slate-600 transition hover:bg-white"><RotateCcw className="h-3.5 w-3.5" aria-hidden="true" /> Reiniciar registro de hoy</button>
      </div>
    </section>
  );
}

// ============================================================================
// BLUMHELPS — MI PROCESO
// Orientación, objetivos personales y seguimiento local del propio avance.
// Los indicadores son descriptivos; no constituyen diagnóstico ni evaluación clínica.
// ============================================================================
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Compass, Route as RouteIcon, BookOpen, PenLine, ArrowRight, CheckCircle2,
  Loader2, TrendingUp, CalendarDays, Target, Sparkles, RotateCcw, ShieldCheck,
} from "lucide-react";
import { recoveryStorage } from "../../lib/recovery/storage";
import { computeValueCongruence, type ValorDeclarado } from "../../lib/recovery/valuesEngine";
import { TodayPlan } from "../../components/recovery/TodayPlan";

const TRACKING_KEY = "blumhelps.mi-proceso.progress.v1";
const DAILY_STEPS = [
  { id: "cuidarme", title: "Hice algo para cuidarme", detail: "Un gesto pequeño también cuenta." },
  { id: "pausa", title: "Me di una pausa consciente", detail: "Respirar, caminar o bajar el ritmo." },
  { id: "apoyo", title: "Me acerqué a alguien o pedí apoyo", detail: "No tienes que resolverlo todo a solas." },
  { id: "paso", title: "Di un paso hacia algo importante", detail: "Una acción alineada con mis valores." },
] as const;

type DailyLog = Record<string, string[]>;

function localDay(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
function readDailyLog(): DailyLog {
  try {
    const raw = localStorage.getItem(TRACKING_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    return Object.fromEntries(Object.entries(parsed as Record<string, unknown>).map(([day, ids]) => [
      day, Array.isArray(ids) ? ids.filter((id): id is string => typeof id === "string" && DAILY_STEPS.some(step => step.id === id)) : [],
    ]));
  } catch { return {}; }
}
function saveDailyLog(log: DailyLog) {
  try { localStorage.setItem(TRACKING_KEY, JSON.stringify(log)); } catch { /* El navegador puede bloquear el almacenamiento. */ }
}
function DecorativeForestArt() {
  return (
    <svg aria-hidden="true" viewBox="0 0 900 560" preserveAspectRatio="xMidYMid slice"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-70">
      <defs>
        <linearGradient id="forestGlow" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8fc9a0" stopOpacity=".18" />
          <stop offset=".55" stopColor="#d4f15c" stopOpacity=".055" />
          <stop offset="1" stopColor="#c87d5a" stopOpacity=".12" />
        </linearGradient>
        <radialGradient id="forestOrb">
          <stop offset="0" stopColor="#a7dfb3" stopOpacity=".2" />
          <stop offset="1" stopColor="#a7dfb3" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="900" height="560" fill="url(#forestGlow)" />
      <circle cx="760" cy="90" r="260" fill="url(#forestOrb)" />
      <g fill="none" stroke="#b9e8be" strokeWidth="1.15" strokeOpacity=".24">
        <path d="M560 560C590 440 650 360 740 285S850 125 870 0" />
        <path d="M620 560C650 455 710 390 790 330S880 195 900 120" />
        <path d="M700 560C730 465 780 420 845 370S900 285 900 245" />
        <path d="M740 285c-70-4-113-44-132-104 68 5 111 42 132 104Z" />
        <path d="M790 330c-12-69 14-124 75-166 13 69-13 124-75 166Z" />
        <path d="M650 455c-63-25-94-72-95-140 61 25 93 72 95 140Z" />
        <path d="M845 370c-4-57 20-101 70-132 5 57-19 101-70 132Z" />
        <path d="M150 0C190 100 180 185 110 255S40 390 75 560" strokeOpacity=".12" />
        <path d="M0 120c90 25 130 75 130 150s35 120 110 150" strokeOpacity=".13" />
      </g>
      <g fill="none" stroke="#d4b896" strokeOpacity=".24">
        <circle cx="760" cy="90" r="105" />
        <circle cx="760" cy="90" r="135" />
        <circle cx="760" cy="90" r="165" />
      </g>
    </svg>
  );
}
function MetricCard({ label, value, caption, icon: Icon }: { label: string; value: string; caption: string; icon: React.ElementType }) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/[.045] p-4 backdrop-blur-md sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-semibold uppercase tracking-[.12em] text-[#b8cbbd]">{label}</span>
        <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#a7dfb3]/15 bg-[#a7dfb3]/10 text-[#b9e8be]"><Icon className="h-4 w-4" /></span>
      </div>
      <p className="mt-4 text-3xl font-semibold tracking-tight text-white tabular-nums">{value}</p>
      <p className="mt-1 text-xs leading-5 text-white/55">{caption}</p>
    </article>
  );
}

export function RecoveryHub() {
  const [loading, setLoading] = useState(true);
  const [valores, setValores] = useState<Record<string, ValorDeclarado> | null>(null);
  const [completed, setCompleted] = useState<string[]>([]);
  const [journalCount, setJournalCount] = useState(0);
  const [dailyLog, setDailyLog] = useState<DailyLog>({});
  const today = localDay();
  const todaySteps = dailyLog[today] ?? [];

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [v, c, journal] = await Promise.all([
        recoveryStorage.getValues(), recoveryStorage.getCompleted(), recoveryStorage.getJournal(),
      ]);
      if (!cancelled) {
        setValores(v);
        setCompleted(c);
        setJournalCount(journal.length);
        setDailyLog(readDailyLog());
        setLoading(false);
      }
    })().catch(() => { if (!cancelled) { setDailyLog(readDailyLog()); setLoading(false); } });
    return () => { cancelled = true; };
  }, []);

  const congruencia = useMemo(() => valores ? computeValueCongruence(Object.values(valores)) : null, [valores]);
  const definedValues = valores ? Object.keys(valores).length : 0;
  const defined = definedValues >= 3;
  const todayPercent = Math.round((todaySteps.length / DAILY_STEPS.length) * 100);
  const weeklyCount = useMemo(() => {
    let count = 0;
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      count += (dailyLog[localDay(date)] ?? []).length;
    }
    return count;
  }, [dailyLog]);
  const weeklyPercent = Math.round((weeklyCount / (DAILY_STEPS.length * 7)) * 100);

  const toggleStep = (id: string) => {
    setDailyLog(current => {
      const currentIds = current[today] ?? [];
      const nextIds = currentIds.includes(id) ? currentIds.filter(item => item !== id) : [...currentIds, id];
      const next = { ...current, [today]: nextIds };
      saveDailyLog(next);
      return next;
    });
  };
  const clearToday = () => {
    setDailyLog(current => {
      const next = { ...current };
      delete next[today];
      saveDailyLog(next);
      return next;
    });
  };

  if (loading) return <div className="flex min-h-[60vh] items-center justify-center bg-[#071b18]"><Loader2 className="h-8 w-8 animate-spin text-[#b9e8be]" /></div>;

  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-[#071b18] text-[#f4f4eb]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-48 top-36 h-[28rem] w-[28rem] rounded-full bg-[#1d6b55]/20 blur-3xl" />
        <div className="absolute -right-48 top-[42rem] h-[32rem] w-[32rem] rounded-full bg-[#a65d45]/10 blur-3xl" />
      </div>
      <div className="mx-auto max-w-6xl space-y-8 px-4 py-7 sm:px-7 sm:py-10 lg:px-10">
        <header className="relative isolate overflow-hidden rounded-[2rem] border border-white/10 bg-[#0c2924] p-6 shadow-[0_25px_80px_rgba(0,0,0,.22)] sm:p-9 lg:p-11">
          <DecorativeForestArt />
          <div className="relative z-10 max-w-3xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-[#b9e8be]/20 bg-[#b9e8be]/[.08] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.2em] text-[#b9e8be]"><Sparkles className="h-3.5 w-3.5" /> Mi proceso · mi ritmo</p>
            <h1 className="serif mt-5 text-4xl font-semibold leading-[1.04] tracking-[-.04em] text-white sm:text-5xl lg:text-6xl">Comprender mi recorrido.<br/><span className="text-[#b9e8be]">Reconocer mi progreso.</span></h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/70 sm:text-base">Un espacio para aclarar qué te importa, elegir objetivos alcanzables y observar tus avances sin compararte con nadie. No necesitas hacerlo perfecto: necesitas que el siguiente paso sea posible.</p>
            <div className="mt-6 flex flex-wrap gap-2 text-xs text-white/65">
              <span className="rounded-full border border-white/10 bg-black/15 px-3 py-2"><ShieldCheck className="mr-1.5 inline h-3.5 w-3.5 text-[#b9e8be]" />Datos guardados en este dispositivo</span>
              <span className="rounded-full border border-white/10 bg-black/15 px-3 py-2">Sin rachas obligatorias ni comparaciones</span>
            </div>
          </div>
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-16 right-[-2rem] hidden h-72 w-72 rounded-full border border-[#b9e8be]/15 md:block" />
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-8 right-6 hidden h-52 w-52 rounded-full border border-[#d4b896]/20 md:block" />
        </header>

        <section aria-labelledby="progress-title" className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div><p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#a7dfb3]">Tu panel personal</p><h2 id="progress-title" className="serif mt-1 text-2xl font-semibold text-white sm:text-3xl">Avances que sí puedes observar</h2></div>
            <span className="text-xs text-white/45">Indicadores personales, no clínicos</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard label="Hoy" value={`${todayPercent}%`} caption={`${todaySteps.length} de ${DAILY_STEPS.length} pasos marcados hoy`} icon={Target} />
            <MetricCard label="Esta semana" value={`${weeklyPercent}%`} caption={`${weeklyCount} pasos personales registrados en 7 días`} icon={TrendingUp} />
            <MetricCard label="Mi brújula" value={`${definedValues}/3+`} caption={defined ? "Ya definiste áreas importantes para ti" : "Define al menos tres áreas que te importan"} icon={Compass} />
            <MetricCard label="Mi reflexión" value={String(journalCount)} caption={journalCount === 1 ? "entrada guardada en tu diario" : "entradas guardadas en tu diario"} icon={PenLine} />
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[.035] p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-2"><div><h3 className="font-semibold text-white">Tu ritmo de esta semana</h3><p className="mt-1 text-xs text-white/50">El porcentaje cuenta los pasos que tú marcas; no mide tu valor ni define tu recuperación.</p></div><span className="text-sm font-semibold text-[#b9e8be]">{weeklyCount}/{DAILY_STEPS.length * 7} pasos</span></div>
            <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-[#276b52] via-[#7dbb91] to-[#d4f15c] transition-all duration-500" style={{ width: `${weeklyPercent}%` }} /></div>
          </div>
        </section>

        <section aria-labelledby="today-title" className="rounded-[1.75rem] border border-[#a7dfb3]/15 bg-[#0d2823]/90 p-5 shadow-xl sm:p-7">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div><p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#b9e8be]"><CalendarDays className="mr-1.5 inline h-3.5 w-3.5" /> Seguimiento amable</p><h2 id="today-title" className="serif mt-2 text-2xl font-semibold text-white sm:text-3xl">¿Qué pudiste hacer hoy?</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-white/60">Marca solo lo que de verdad ocurrió. Puedes actualizarlo durante el día y desmarcarlo cuando quieras.</p></div>
            <span className="rounded-xl border border-[#b9e8be]/20 bg-[#b9e8be]/[.07] px-3 py-2 text-xs font-semibold text-[#b9e8be]">{todaySteps.length} de {DAILY_STEPS.length}</span>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {DAILY_STEPS.map(step => {
              const checked = todaySteps.includes(step.id);
              return <button key={step.id} type="button" aria-pressed={checked} onClick={() => toggleStep(step.id)}
                className={`group flex min-h-[88px] items-start gap-3 rounded-2xl border p-4 text-left transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b9e8be] ${checked ? "border-[#8bc99c]/40 bg-[#1b503e]/70" : "border-white/10 bg-white/[.035] hover:border-white/20 hover:bg-white/[.06]"}`}>
                <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition ${checked ? "border-[#b9e8be] bg-[#b9e8be] text-[#09251d]" : "border-white/25 text-transparent group-hover:border-[#b9e8be]/60"}`}><CheckCircle2 className="h-4 w-4" /></span>
                <span><span className="block text-sm font-semibold text-white">{step.title}</span><span className="mt-1 block text-xs leading-5 text-white/50">{step.detail}</span></span>
              </button>;
            })}
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
            <p className="text-xs text-white/45">Guardado localmente en este navegador.</p>
            <button type="button" onClick={clearToday} disabled={todaySteps.length === 0} className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-xs font-semibold text-white/60 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"><RotateCcw className="h-3.5 w-3.5" /> Reiniciar hoy</button>
          </div>
        </section>

        <section aria-labelledby="compass-title" className="relative isolate overflow-hidden rounded-[1.75rem] border border-[#b9e8be]/20 bg-gradient-to-br from-[#123d31] via-[#0c2a24] to-[#10201d] p-5 sm:p-7">
          <div aria-hidden="true" className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full border border-[#b9e8be]/10" />
          <div aria-hidden="true" className="pointer-events-none absolute -right-2 -top-10 h-44 w-44 rounded-full border border-[#d4b896]/15" />
          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#b9e8be]/20 bg-[#b9e8be]/10 text-[#b9e8be]"><Compass className="h-7 w-7" /></div>
            <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h2 id="compass-title" className="serif text-2xl font-semibold text-white">Tu brújula de valores</h2>{defined && <span className="inline-flex items-center gap-1 rounded-full bg-[#b9e8be]/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#b9e8be]"><CheckCircle2 className="h-3 w-3" /> Definida</span>}</div><p className="mt-2 max-w-2xl text-sm leading-6 text-white/60">{defined ? "Ya reconociste áreas importantes para ti. Puedes revisar si tus pasos cotidianos se acercan a ellas." : "Identifica al menos tres áreas importantes para ti y usa esa brújula para elegir pasos con sentido, no para exigirte más."}</p></div>
            <div className="flex flex-wrap items-center gap-3">{congruencia !== null && <div className="rounded-xl border border-white/10 bg-black/15 px-3 py-2 text-center"><span className="block text-2xl font-semibold text-[#b9e8be]">{congruencia}</span><span className="text-[10px] text-white/50">índice orientativo</span></div>}<Link to="/recuperacion/valores" className="inline-flex items-center gap-2 rounded-full bg-[#b9e8be] px-4 py-3 text-xs font-bold text-[#09251d] transition hover:-translate-y-0.5 hover:bg-[#d2f0d2]">Abrir brújula <ArrowRight className="h-4 w-4" /></Link></div>
          </div>
        </section>

        <TodayPlan />

        <section aria-labelledby="next-title" className="space-y-4">
          <div><p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#a7dfb3]">Siguiente paso</p><h2 id="next-title" className="serif mt-1 text-2xl font-semibold text-white sm:text-3xl">Convierte la reflexión en acciones posibles</h2></div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link to="/ruta" className="group rounded-2xl border border-white/10 bg-white/[.045] p-5 transition hover:-translate-y-1 hover:border-[#a7dfb3]/35 hover:bg-white/[.07]">
              <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#b9e8be]/10 text-[#b9e8be]"><RouteIcon className="h-5 w-5" /></span><h3 className="font-semibold text-white">Mi ruta de 24 horas</h3><p className="mt-2 text-sm leading-6 text-white/55">Crea un plan breve y realista para hoy, sin registro ni presión.</p><span className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-[#b9e8be]">Preparar mi ruta <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
            </Link>
            <Link to="/voz" className="group rounded-2xl border border-white/10 bg-white/[.045] p-5 transition hover:-translate-y-1 hover:border-[#a7dfb3]/35 hover:bg-white/[.07]">
              <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#b9e8be]/10 text-[#b9e8be]"><BookOpen className="h-5 w-5" /></span><h3 className="font-semibold text-white">Aprender a mi ritmo</h3><p className="mt-2 text-sm leading-6 text-white/55">Explora la biblioteca de voz y avanza episodio a episodio.</p><span className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-[#b9e8be]">Abrir biblioteca <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
            </Link>
            <div className="rounded-2xl border border-dashed border-white/15 bg-black/10 p-5">
              <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 text-white/45"><PenLine className="h-5 w-5" /></span><h3 className="font-semibold text-white/80">Mi diario de proceso</h3><p className="mt-2 text-sm leading-6 text-white/45">{journalCount > 0 ? `Ya tienes ${journalCount} reflexiones guardadas en este dispositivo.` : "Las reflexiones estarán conectadas aquí cuando el diario esté disponible en esta ruta."}</p><span className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-white/35">Diario completo · pendiente</span>
            </div>
          </div>
        </section>

        <p className="border-t border-white/10 pt-5 text-center text-xs leading-6 text-white/40">Tu progreso no es una calificación. Los registros se guardan en este dispositivo y no sustituyen la atención profesional. Si estás en peligro inmediato, llama al 123; en Colombia también puedes buscar orientación en la Línea 106 donde esté disponible.</p>
      </div>
    </div>
  );
}

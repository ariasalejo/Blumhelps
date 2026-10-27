import { useEffect, useState } from "react";
import { BookOpen, Check, ChevronLeft, ChevronRight, Compass, Headphones, Leaf, RotateCcw, Route as RouteIcon, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const STORAGE_KEY = "blumhelps.mi-proceso.progress.v1";

type Activity = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  minutes: string;
  kind: "practice" | "reading";
  icon: typeof Leaf;
  steps?: { title: string; body: string; choices?: string[] }[];
  reading?: { heading: string; body: string }[];
  takeaway: string;
  source: { label: string; url: string };
};

const activities: Activity[] = [
  {
    id: "pausa-presente",
    eyebrow: "PRÁCTICA GUIADA",
    title: "Haz una pausa y vuelve al momento",
    description: "Un ejercicio breve para bajar el ritmo y elegir tu siguiente paso con un poco más de espacio.",
    minutes: "2–3 min",
    kind: "practice",
    icon: Leaf,
    steps: [
      { title: "Encuentra una postura cómoda", body: "Si te resulta cómodo, apoya los pies y afloja los hombros. No necesitas cerrar los ojos ni cambiar cómo te sientes." },
      { title: "Observa lo que está aquí", body: "Nombra mentalmente una cosa que ves, un sonido que escuchas y una sensación física neutral. Si te incomoda, vuelve a mirar alrededor y detén el ejercicio.", choices: ["Veo algo a mi alrededor", "Escucho un sonido", "Siento mis pies apoyados", "Prefiero observar sin elegir"] },
      { title: "Elige un paso amable", body: "Pregúntate: ¿qué pequeña acción útil puedo hacer a continuación? Puede ser beber agua, descansar, pedir compañía o resolver una tarea sencilla.", choices: ["Cuidar una necesidad básica", "Pedir apoyo", "Dar un paso pequeño", "Por ahora, descansar"] },
    ],
    takeaway: "No tienes que resolverlo todo ahora. La pausa no elimina los problemas; puede ayudarte a elegir qué hacer después.",
    source: { label: "OMS · Hacer lo que importa en momentos de estrés", url: "https://www.who.int/publications/i/item/9789240003927" },
  },
  {
    id: "paso-posible",
    eyebrow: "PLAN PERSONAL",
    title: "Define un paso posible para hoy",
    description: "Convierte una intención grande en una acción concreta, pequeña y realista.",
    minutes: "3 min",
    kind: "practice",
    icon: Compass,
    steps: [
      { title: "Reduce el tamaño del paso", body: "Piensa en algo que te ayudaría hoy. No hace falta escribirlo ni compartirlo: basta con elegir una opción que puedas llevar a cabo." , choices: ["Organizar una cosa pequeña", "Moverme o salir un momento", "Contactar a alguien de confianza", "Atender comida, agua o descanso", "Pedir ayuda profesional o práctica"] },
      { title: "Hazlo concreto", body: "Elige cuándo sería más fácil empezar. Un paso concreto suele ser más manejable que una promesa general.", choices: ["En los próximos 10 minutos", "Después de descansar", "En un momento específico de hoy", "Necesito ayuda para decidir"] },
    ],
    takeaway: "Un paso pequeño cuenta por ser elegido y posible, no por ser perfecto. Puedes adaptar el plan a tus circunstancias.",
    source: { label: "SAMHSA · Dimensiones de la recuperación", url: "https://www.samhsa.gov/substance-use/recovery/about" },
  },
  {
    id: "leer-sin-presion",
    eyebrow: "LECTURA BREVE",
    title: "Avanzar no significa hacerlo todo de una vez",
    description: "Una lectura corta sobre propósito, apoyo y pasos sostenibles.",
    minutes: "2 min",
    kind: "reading",
    icon: BookOpen,
    reading: [
      { heading: "El progreso puede tener distintas formas", body: "Aprender algo, cuidar una necesidad básica, pedir apoyo o retomar una actividad son maneras diferentes de ocuparte de tu bienestar. No tienes que hacerlas todas hoy." },
      { heading: "El apoyo también forma parte del camino", body: "No todo depende de la fuerza de voluntad individual. Las relaciones, la salud, un entorno más seguro y el acceso a servicios pueden influir en las oportunidades de avanzar." },
      { heading: "Elige qué te sirve", body: "De esta lectura puedes llevarte una sola pregunta: ¿qué apoyo o acción pequeña haría más llevadero mi día? No necesitas registrar una respuesta privada en esta aplicación." },
    ],
    takeaway: "Tu recorrido es personal. Esta lectura es educativa y no evalúa tu salud ni determina cómo va tu recuperación.",
    source: { label: "SAMHSA · Acerca de la recuperación", url: "https://www.samhsa.gov/substance-use/recovery/about" },
  },
];

function readCompleted(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const value: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(value) ? value.filter((id): id is string => typeof id === "string" && activities.some((activity) => activity.id === id)) : [];
  } catch {
    return [];
  }
}

function saveCompleted(ids: string[]): boolean {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    return true;
  } catch {
    return false;
  }
}

export function MiProcesoExperience() {
  const [completed, setCompleted] = useState<string[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [choice, setChoice] = useState("");
  const [saved, setSaved] = useState(true);

  useEffect(() => setCompleted(readCompleted()), []);

  const active = activities.find((activity) => activity.id === activeId) ?? null;
  const steps = active?.steps ?? [];
  const step = steps[stepIndex];
  const progress = Math.round((completed.length / activities.length) * 100);

  const finish = (id: string) => {
    const next = completed.includes(id) ? completed : [...completed, id];
    const ok = saveCompleted(next);
    setCompleted(next);
    setSaved(ok);
    setActiveId(null);
    setStepIndex(0);
    setChoice("");
  };

  const openActivity = (id: string) => {
    setActiveId(id);
    setStepIndex(0);
    setChoice("");
    setSaved(true);
  };

  return (
    <section aria-labelledby="mi-proceso-practica-title" className="relative isolate overflow-hidden rounded-[2rem] border border-emerald-100/15 bg-[#0c2423] p-5 text-white shadow-[0_24px_80px_rgba(5,30,27,.18)] sm:p-7 lg:p-8">
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 -z-10 h-80 w-80 rounded-full bg-emerald-400/15 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-28 left-1/3 -z-10 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div className="max-w-2xl">
          <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.24em] text-emerald-200"><Sparkles className="h-4 w-4" aria-hidden="true" /> TU RECORRIDO · A TU RITMO</p>
          <h2 id="mi-proceso-practica-title" className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">Un paso posible también es progreso.</h2>
          <p className="mt-3 text-sm leading-6 text-white/65">Explora una práctica breve o una lectura. No necesitas tener tu brújula definida para empezar, y puedes volver cuando quieras.</p>
        </div>
        <div className="min-w-[150px] rounded-2xl border border-white/15 bg-white/[.06] p-4 shadow-inner backdrop-blur-xl">
          <div className="flex items-center gap-2 text-emerald-100"><Check className="h-4 w-4" aria-hidden="true" /><span className="text-xs font-semibold">Tu actividad</span></div>
          <p className="mt-2 text-2xl font-semibold">{completed.length}<span className="ml-1 text-sm font-normal text-white/45">/ {activities.length}</span></p>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-emerald-300 to-cyan-200 transition-[width] duration-500" style={{ width: `${progress}%` }} /></div>
          <p className="mt-2 text-[10px] leading-4 text-white/45">Actividades que marcaste como realizadas; no es una medida clínica.</p>
        </div>
      </div>

      {active ? (
        <div className="mt-7 rounded-3xl border border-emerald-100/20 bg-white/[.06] p-5 backdrop-blur-xl sm:p-7" aria-live="polite">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-[10px] font-bold uppercase tracking-[.2em] text-emerald-200">{active.eyebrow}</span>
            <span className="text-xs text-white/50">{active.minutes}</span>
          </div>
          <h3 className="mt-3 text-xl font-semibold sm:text-2xl">{active.title}</h3>
          <p className="mt-2 text-sm leading-6 text-white/65">{active.description}</p>

          {active.kind === "practice" && step ? (
            <div className="mt-6">
              <p className="text-xs font-semibold text-emerald-100">PASO {stepIndex + 1} DE {steps.length}</p>
              <h4 className="mt-2 text-lg font-semibold">{step.title}</h4>
              <p className="mt-2 max-w-3xl text-sm leading-7 text-white/75">{step.body}</p>
              {step.choices && <div className="mt-4 flex flex-wrap gap-2">{step.choices.map((item) => <button key={item} type="button" onClick={() => setChoice(item)} aria-pressed={choice === item} className={`rounded-full border px-3 py-2 text-left text-xs transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-200 ${choice === item ? "border-emerald-200 bg-emerald-200/15 text-white" : "border-white/15 bg-black/10 text-white/70 hover:bg-white/10"}`}>{item}</button>)}</div>}
              <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                <button type="button" onClick={() => { setStepIndex(Math.max(0, stepIndex - 1)); setChoice(""); }} disabled={stepIndex === 0} className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2.5 text-xs font-semibold text-white/75 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-35"><ChevronLeft className="h-4 w-4" /> Anterior</button>
                {stepIndex < steps.length - 1 ? <button type="button" onClick={() => { setStepIndex(stepIndex + 1); setChoice(""); }} className="inline-flex items-center gap-2 rounded-full bg-emerald-200 px-4 py-2.5 text-xs font-bold text-[#0c2423] transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-200">Siguiente paso <ChevronRight className="h-4 w-4" /></button> : <button type="button" onClick={() => finish(active.id)} className="inline-flex items-center gap-2 rounded-full bg-emerald-200 px-4 py-2.5 text-xs font-bold text-[#0c2423] transition hover:bg-white"><Check className="h-4 w-4" /> Marcar como realizada</button>}
              </div>
            </div>
          ) : active.kind === "reading" && active.reading ? (
            <div className="mt-5 space-y-4">{active.reading.map((part) => <article key={part.heading} className="border-l border-emerald-200/40 pl-4"><h4 className="font-semibold text-emerald-100">{part.heading}</h4><p className="mt-1 text-sm leading-7 text-white/70">{part.body}</p></article>)}<button type="button" onClick={() => finish(active.id)} className="mt-2 inline-flex items-center gap-2 rounded-full bg-emerald-200 px-4 py-2.5 text-xs font-bold text-[#0c2423] transition hover:bg-white"><Check className="h-4 w-4" /> Marcar lectura como realizada</button></div>
          ) : null}

          <div className="mt-6 border-t border-white/10 pt-4">
            <p className="text-sm leading-6 text-emerald-50">{active.takeaway}</p>
            <a href={active.source.url} target="_blank" rel="noreferrer" className="mt-3 inline-flex text-xs font-semibold text-emerald-200 underline decoration-emerald-200/40 underline-offset-4 hover:text-white">{active.source.label} ↗</a>
          </div>
          {!saved && <p role="status" className="mt-3 text-xs text-amber-200">No se pudo guardar el progreso en este dispositivo. Puedes continuar usando la actividad.</p>}
          <button type="button" onClick={() => { setActiveId(null); setStepIndex(0); setChoice(""); }} className="mt-5 inline-flex items-center gap-2 text-xs text-white/55 transition hover:text-white"><RotateCcw className="h-3.5 w-3.5" /> Volver a las actividades</button>
        </div>
      ) : (
        <div className="mt-7 grid gap-4 lg:grid-cols-3">
          {activities.map((activity, index) => {
            const Icon = activity.icon;
            const done = completed.includes(activity.id);
            return (
              <article key={activity.id} className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[.09] via-white/[.035] to-emerald-950/30 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,.08)] transition duration-300 hover:-translate-y-1 hover:border-emerald-200/35 hover:shadow-[0_18px_50px_rgba(0,0,0,.18)]">
                <div aria-hidden="true" className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full border border-white/10 bg-white/[.04] blur-[1px] transition group-hover:bg-emerald-200/10" />
                <div className="relative flex items-center justify-between gap-3"><span className="text-[9px] font-bold uppercase tracking-[.2em] text-emerald-200">{activity.eyebrow}</span>{done ? <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200/25 bg-emerald-200/10 px-2 py-1 text-[10px] text-emerald-100"><Check className="h-3 w-3" /> Realizada</span> : <span className="text-[10px] text-white/45">{activity.minutes}</span>}</div>
                <div className="relative mt-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-100/20 bg-emerald-200/10 text-emerald-100 shadow-inner backdrop-blur-md"><Icon className="h-5 w-5" aria-hidden="true" /></div>
                <h3 className="relative mt-4 text-lg font-semibold leading-snug">{activity.title}</h3>
                <p className="relative mt-2 flex-1 text-sm leading-6 text-white/60">{activity.description}</p>
                <button type="button" onClick={() => openActivity(activity.id)} className="relative mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full border border-emerald-100/25 bg-emerald-100/10 px-4 py-3 text-xs font-bold text-emerald-50 transition hover:border-emerald-100/50 hover:bg-emerald-100/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-200">{done ? "Volver a explorar" : activity.kind === "reading" ? "Leer ahora" : "Comenzar actividad"} <ChevronRight className="h-4 w-4" /></button>
                <span className="sr-only">Actividad {index + 1} de {activities.length}</span>
              </article>
            );
          })}
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
        <p className="max-w-2xl text-[10px] leading-5 text-white/45">Tu selección dentro de estas actividades no se guarda; solo se registra qué actividades marcaste como realizadas en este dispositivo. Material psicoeducativo, no diagnóstico ni tratamiento.</p>
        <div className="flex flex-wrap gap-2">
          <Link to="/ruta" className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-2 text-xs text-white/70 transition hover:bg-white/10 hover:text-white"><RouteIcon className="h-4 w-4" /> Mi ruta de hoy</Link>
          <Link to="/voz" className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-2 text-xs text-white/70 transition hover:bg-white/10 hover:text-white"><Headphones className="h-4 w-4" /> Escuchar</Link>
          <Link to="/ciencia" className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-2 text-xs text-white/70 transition hover:bg-white/10 hover:text-white"><BookOpen className="h-4 w-4" /> Explorar ciencia</Link>
        </div>
      </div>
    </section>
  );
}

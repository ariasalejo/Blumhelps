// BLUMHELPS — Mi proceso: centro de acompañamiento psicoeducativo.
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity, ArrowDownRight, ArrowRight, CheckCircle2, Compass, Heart,
  Leaf, Loader2, Route as RouteIcon, ShieldCheck, Sparkles, Sun, Wind
} from "lucide-react";
import { recoveryStorage } from "../../lib/recovery/storage";
import { computeValueCongruence, bandaCongruencia, type ValorDeclarado } from "../../lib/recovery/valuesEngine";
import { TodayPlan } from "../../components/recovery/TodayPlan";

const CHECK_INS = [
  { id: "calma", label: "Con algo de calma", icon: Sun, response: "Cuida ese espacio de calma. No tienes que llenarlo de tareas; puedes elegir un paso pequeño y realista." },
  { id: "cansancio", label: "Agotado/a", icon: Wind, response: "Hoy podemos bajar la exigencia. Descansar, tomar agua o pedir compañía también puede ser un paso válido." },
  { id: "ansiedad", label: "Con ansiedad", icon: Activity, response: "No tienes que resolver todo ahora. Si te resulta seguro, prueba apoyar los pies en el suelo y nombrar tres cosas que ves a tu alrededor." },
  { id: "inicio", label: "Con ganas de empezar", icon: Sparkles, response: "Aprovecha esa intención con una acción concreta y pequeña. Elige algo que puedas hacer hoy, no todo el camino." },
  { id: "confusion", label: "No sé cómo me siento", icon: Heart, response: "Está bien no tenerlo claro. Puedes darte un momento sin ponerle una etiqueta a lo que sientes." },
] as const;

function MiniGauge({ value }: { value: number }) {
  const radius = 25;
  const circumference = 2 * Math.PI * radius;
  const band = bandaCongruencia(value);
  const color = band === "brecha_alta" ? "#e5a18b" : band === "en_proceso" ? "#e6d19b" : "#b9e8be";
  return (
    <div className="bl-process-gauge" role="img" aria-label={`Indicador orientativo de congruencia: ${value} de 100`}>
      <svg viewBox="0 0 60 60" aria-hidden="true">
        <circle cx="30" cy="30" r={radius} fill="none" stroke="rgba(255,255,255,.13)" strokeWidth="5" />
        <circle cx="30" cy="30" r={radius} fill="none" stroke={color} strokeWidth="5" strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={circumference * (1 - value / 100)} />
      </svg>
      <span>{value}</span>
    </div>
  );
}

export function RecoveryHub() {
  const [loading, setLoading] = useState(true);
  const [valores, setValores] = useState<Record<string, ValorDeclarado> | null>(null);
  const [checkIn, setCheckIn] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const saved = await recoveryStorage.getValues();
        if (!cancelled) setValores(saved);
      } catch {
        if (!cancelled) setValores(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const congruencia = useMemo(
    () => valores ? computeValueCongruence(Object.values(valores)) : null,
    [valores],
  );
  const definida = !!valores && Object.keys(valores).length >= 3;
  const selectedCheckIn = CHECK_INS.find(item => item.id === checkIn);

  if (loading) {
    return (
      <main className="bl-process-page min-h-[65vh] flex items-center justify-center px-4" aria-label="Cargando Mi proceso">
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[.06] px-5 py-4 text-white/80">
          <Loader2 className="h-5 w-5 animate-spin text-[#b9e8be]" aria-hidden="true" />
          <span>Preparando tu espacio…</span>
        </div>
      </main>
    );
  }

  return (
    <main className="bl-process-page min-h-screen px-4 py-8 sm:px-6 sm:py-12">
      <div className="bl-process-orb bl-process-orb--one" aria-hidden="true" />
      <div className="bl-process-orb bl-process-orb--two" aria-hidden="true" />
      <div className="relative z-10 mx-auto max-w-6xl space-y-8 sm:space-y-10">
        <header className="bl-process-hero">
          <div className="bl-process-kicker"><span className="bl-process-kicker__dot" /> TU ESPACIO · A TU RITMO</div>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div className="max-w-3xl">
              <h1 className="bl-process-title">Tu proceso.<br /><span>Tu ritmo. Tu siguiente paso.</span></h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-white/70 sm:text-lg">
                No necesitas tenerlo todo resuelto. Este espacio te ayuda a reconocer lo que importa,
                encontrar una acción posible y volver cuando lo necesites, sin juicios ni puntuaciones personales.
              </p>
            </div>
            <div className="bl-process-privacy">
              <ShieldCheck className="h-5 w-5 shrink-0 text-[#b9e8be]" aria-hidden="true" />
              <div><strong>Tu espacio personal</strong><span>Los datos del módulo se guardan en este navegador y no están cifrados con una clave personal.</span></div>
            </div>
          </div>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/recuperacion/valores" className="bl-process-cta">
              <Compass className="h-5 w-5" aria-hidden="true" />
              {definida ? "Revisar mi brújula" : "Crear mi brújula"}
              <ArrowRight className="bl-process-cta__arrow h-4 w-4" aria-hidden="true" />
            </Link>
            <Link to="/ruta" className="bl-process-cta bl-process-cta--secondary">
              Elegir un paso para hoy <ArrowDownRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-3" aria-label="Resumen de tu espacio">
          <article className="bl-process-stat">
            <span className="bl-process-stat__icon"><Compass className="h-5 w-5" aria-hidden="true" /></span>
            <div><p className="bl-process-eyebrow">TU BRÚJULA</p><h2>{definida ? "Tus valores están definidos" : "Empieza por lo que importa"}</h2>
              <p>{definida ? "Puedes revisarlos y ajustarlos cuando cambies." : "Elige de 3 a 8 áreas que quieras tener presentes."}</p></div>
            {congruencia !== null && <MiniGauge value={congruencia} />}
          </article>
          <article className="bl-process-stat">
            <span className="bl-process-stat__icon"><RouteIcon className="h-5 w-5" aria-hidden="true" /></span>
            <div><p className="bl-process-eyebrow">UN PASO POSIBLE</p><h2>Plan de 24 horas</h2>
              <p>Una orientación breve para centrarte en lo que sí puedes hacer hoy.</p>
              <Link className="bl-process-inline-link" to="/ruta">Abrir mi ruta <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" /></Link></div>
          </article>
          <article className="bl-process-stat">
            <span className="bl-process-stat__icon"><Heart className="h-5 w-5" aria-hidden="true" /></span>
            <div><p className="bl-process-eyebrow">SIN JUICIOS</p><h2>Retomar también cuenta</h2>
              <p>Un día difícil no define tu valor ni borra lo que has aprendido.</p></div>
          </article>
        </section>

        <section className="bl-process-checkin" aria-labelledby="bl-checkin-title">
          <div className="max-w-2xl">
            <p className="bl-process-eyebrow">UNA PAUSA BREVE</p>
            <h2 id="bl-checkin-title" className="bl-process-section-title">¿Cómo llegas hoy?</h2>
            <p className="mt-2 text-sm leading-6 text-white/65">Puedes elegir una opción, o ninguna. No es una evaluación clínica y no guardaremos esta respuesta.</p>
          </div>
          <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {CHECK_INS.map(item => {
              const Icon = item.icon;
              const active = checkIn === item.id;
              return (
                <button key={item.id} type="button" aria-pressed={active} onClick={() => setCheckIn(active ? null : item.id)}
                  className={`bl-process-mood ${active ? "is-selected" : ""}`}>
                  <Icon className="h-4 w-4 shrink-0" aria-hidden="true" /><span>{item.label}</span>
                  <span className="ml-auto text-xs" aria-hidden="true">{active ? "✓" : "+"}</span>
                </button>
              );
            })}
          </div>
          {selectedCheckIn && (
            <div className="bl-process-response mt-4" role="status" aria-live="polite">
              <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-[#b9e8be]" aria-hidden="true" />
              <p>{selectedCheckIn.response}</p>
            </div>
          )}
        </section>

        <section aria-label="Plan personalizado de hoy" className="space-y-4">
          <div>
            <p className="bl-process-eyebrow">CONTINUIDAD</p>
            <h2 className="bl-process-section-title">Un paso a la vez</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/65">Si ya definiste tus valores, aquí verás ideas para convertirlos en acciones pequeñas. Puedes ignorar cualquier sugerencia que no encaje contigo.</p>
          </div>
          <div className="bl-process-today-plan"><TodayPlan /></div>
        </section>

        <footer className="bl-process-footer">
          <p><ShieldCheck className="h-4 w-4" aria-hidden="true" /> Acompañamiento psicoeducativo; no sustituye atención profesional ni servicios de emergencia.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/ayuda">Explorar recursos</Link><Link to="/familiares">Apoyo para familiares</Link><Link to="/ajustes">Privacidad y ajustes</Link>
          </div>
          <p className="text-white/45">En peligro inmediato en Colombia, llama al 123. La cobertura de otras líneas puede variar según la ciudad.</p>
        </footer>
      </div>
    </main>
  );
}

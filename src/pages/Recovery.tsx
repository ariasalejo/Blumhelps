import { useEffect, useMemo, useState } from "react";
import { ArrowRight, CalendarDays, Check, CheckCircle2, Clock3, Dumbbell, Headphones, HeartHandshake, Leaf, Moon, RotateCcw, ShieldCheck, Sparkles, BookOpen, Phone, Compass } from "lucide-react";
import { Link } from "react-router-dom";
import { getCrisisTel, getEmergencyTel } from "../engines/crisis";

type Focus = "audio" | "movement" | "rest" | "connection" | "practical" | "reading";
type RoutePlan = {
  focus: Focus;
  day: string;
  time: string;
  duration: string;
  chapter: string;
  movement: string;
  support: string;
  planB: string;
  intention: string;
  checked: number[];
  createdAt: string;
};

const STORAGE_KEY = "blumhelps.ruta-viva.v1";

const focuses: { id: Focus; title: string; description: string; icon: typeof Headphones; color: string }[] = [
  { id: "audio", title: "Escuchar un capítulo", description: "Reservar un momento para una idea o historia que me acompañe.", icon: Headphones, color: "audio" },
  { id: "movement", title: "Mover el cuerpo", description: "Caminar, estirar, bailar o hacer deporte a mi ritmo.", icon: Dumbbell, color: "movement" },
  { id: "rest", title: "Cuidar el descanso", description: "Preparar una noche más tranquila o hacer una pausa.", icon: Moon, color: "rest" },
  { id: "connection", title: "Conectar con alguien", description: "Enviar un mensaje, llamar o compartir un rato.", icon: HeartHandshake, color: "connection" },
  { id: "practical", title: "Resolver algo pequeño", description: "Elegir una tarea útil y hacer solo el primer tramo.", icon: CheckCircle2, color: "practical" },
  { id: "reading", title: "Leer y reflexionar", description: "Dedicar unos minutos a aprender sin exigirme demasiado.", icon: BookOpen, color: "reading" },
];

const chapters = [
  { id: "etapas-del-cambio", title: "Las etapas del cambio, sin juicios" },
  { id: "ambivalencia-no-es-resistencia", title: "La ambivalencia no es resistencia" },
  { id: "craving-como-ola", title: "El craving como una ola" },
  { id: "higiene-del-sueno", title: "Higiene del sueño: una rutina posible" },
  { id: "recaida-no-es-fracaso", title: "Una recaída no es un fracaso" },
];

const movementOptions = [
  "Caminar 10 minutos a un ritmo cómodo",
  "Hacer estiramientos suaves durante 5 minutos",
  "Poner una canción y moverme como me resulte cómodo",
  "Hacer una actividad deportiva que ya conozco",
  "Salir al aire libre o dar una vuelta acompañado",
  "Hoy prefiero una opción de muy baja energía",
];

const timeOptions = [
  ["07:00", "7:00 a. m."], ["09:00", "9:00 a. m."], ["11:00", "11:00 a. m."],
  ["13:00", "1:00 p. m."], ["15:00", "3:00 p. m."], ["17:00", "5:00 p. m."],
  ["19:00", "7:00 p. m."], ["20:30", "8:30 p. m."],
];

function localDate(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function getDayOptions() {
  const today = new Date();
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() + index);
    const label = new Intl.DateTimeFormat("es-CO", { weekday: "long", day: "numeric", month: "long" }).format(date);
    return { value: localDate(date), label: index === 0 ? `Hoy · ${label}` : index === 1 ? `Mañana · ${label}` : label.charAt(0).toUpperCase() + label.slice(1) };
  });
}

function loadPlan(): RoutePlan | null {
  if (typeof window === "undefined") return null;
  try {
    const value: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "null");
    if (!value || typeof value !== "object") return null;
    const plan = value as Partial<RoutePlan>;
    if (!plan.focus || !focuses.some((item) => item.id === plan.focus) || typeof plan.day !== "string") return null;
    return {
      focus: plan.focus,
      day: plan.day,
      time: typeof plan.time === "string" ? plan.time : "17:00",
      duration: typeof plan.duration === "string" ? plan.duration : "10",
      chapter: typeof plan.chapter === "string" ? plan.chapter : chapters[0].id,
      movement: typeof plan.movement === "string" ? plan.movement : movementOptions[0],
      support: typeof plan.support === "string" ? plan.support : "Una persona de confianza",
      planB: typeof plan.planB === "string" ? plan.planB : "Hacer una versión de 2 minutos",
      intention: typeof plan.intention === "string" ? plan.intention : "",
      checked: Array.isArray(plan.checked) ? plan.checked.filter((n): n is number => Number.isInteger(n) && n >= 0 && n <= 3) : [],
      createdAt: typeof plan.createdAt === "string" ? plan.createdAt : new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

function savePlan(plan: RoutePlan): boolean {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
    return true;
  } catch {
    return false;
  }
}

function dateLabel(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Intl.DateTimeFormat("es-CO", { weekday: "long", day: "numeric", month: "long" }).format(new Date(year, month - 1, day));
}

function planAction(plan: RoutePlan) {
  switch (plan.focus) {
    case "audio": return `Escuchar «${chapters.find((item) => item.id === plan.chapter)?.title ?? "el capítulo elegido"}» durante ${plan.duration} minutos.`;
    case "movement": return `${plan.movement} (objetivo aproximado: ${plan.duration} minutos).`;
    case "rest": return `Preparar una pausa de descanso de ${plan.duration} minutos y bajar un poco el ritmo.`;
    case "connection": return `Contactar a alguien de confianza y compartir cómo me vendría bien que me acompañara.`;
    case "practical": return `Dedicar ${plan.duration} minutos a una tarea pequeña y concreta, sin exigirme terminarlo todo.`;
    case "reading": return `Leer o reflexionar durante ${plan.duration} minutos, quedándome con una idea útil.`;
  }
}

function makeSteps(plan: RoutePlan) {
  return [
    { title: "Preparar el momento", body: `El ${dateLabel(plan.day)} a las ${timeOptions.find(([value]) => value === plan.time)?.[1] ?? plan.time}, busca un lugar y una situación razonablemente cómodos.` },
    { title: "Hacer mi acción elegida", body: planAction(plan) },
    { title: "Tener un plan B amable", body: plan.planB },
    { title: "Reconocer el intento", body: "Al terminar, nota qué te ayudó. Si no sale como esperabas, ajustar el plan también es avanzar." },
  ];
}

export function Recovery() {
  const dayOptions = useMemo(() => getDayOptions(), []);
  const [focus, setFocus] = useState<Focus>("audio");
  const [day, setDay] = useState(dayOptions[0]?.value ?? localDate(new Date()));
  const [time, setTime] = useState("17:00");
  const [duration, setDuration] = useState("10");
  const [chapter, setChapter] = useState(chapters[0].id);
  const [movement, setMovement] = useState(movementOptions[0]);
  const [support, setSupport] = useState("Una persona de confianza");
  const [planB, setPlanB] = useState("Hacer una versión de 2 minutos");
  const [intention, setIntention] = useState("");
  const [plan, setPlan] = useState<RoutePlan | null>(null);
  const [notice, setNotice] = useState("");
  const [urgent, setUrgent] = useState(false);

  useEffect(() => {
    const saved = loadPlan();
    if (saved) {
      setPlan(saved);
      setFocus(saved.focus);
      setDay(saved.day);
      setTime(saved.time);
      setDuration(saved.duration);
      setChapter(saved.chapter);
      setMovement(saved.movement);
      setSupport(saved.support);
      setPlanB(saved.planB);
      setIntention(saved.intention);
    }
  }, []);

  const chosenFocus = focuses.find((item) => item.id === focus) ?? focuses[0];
  const steps = plan ? makeSteps(plan) : [];
  const doneCount = plan?.checked.length ?? 0;

  const createPlan = () => {
    const next: RoutePlan = {
      focus, day, time, duration, chapter, movement, support, planB,
      intention: intention.trim().slice(0, 180), checked: [], createdAt: new Date().toISOString(),
    };
    setPlan(next);
    setNotice(savePlan(next) ? "Tu ruta quedó guardada en este dispositivo. No se envió a ningún servidor." : "La ruta está disponible en esta sesión, pero el navegador no permitió guardarla.");
  };

  const toggleStep = (index: number) => {
    if (!plan) return;
    const checked = plan.checked.includes(index) ? plan.checked.filter((item) => item !== index) : [...plan.checked, index];
    const next = { ...plan, checked };
    setPlan(next);
    setNotice(savePlan(next) ? "Progreso actualizado en este dispositivo." : "El progreso cambió en esta sesión, pero no se pudo guardar.");
  };

  const resetPlan = () => {
    setPlan(null);
    setNotice("Puedes diseñar una ruta nueva. La ruta anterior permanece guardada hasta que guardes otra.");
  };

  return (
    <main className="bl-route-page">
      <div className="bl-route-shell">
        <header className="bl-route-hero">
          <div className="bl-route-hero__copy">
            <Link to="/recuperacion" className="bl-route-breadcrumb"><Compass className="h-4 w-4" aria-hidden="true" /> MI PROGRESO <span>/</span> MI RUTA</Link>
            <p className="bl-route-kicker"><Sparkles className="h-4 w-4" aria-hidden="true" /> UNA RUTA REALISTA, NO UNA PRUEBA</p>
            <h1>Tu semana no tiene que cambiar entera.<br /><em>Solo el siguiente paso.</em></h1>
            <p className="bl-route-intro">Diseña un momento que encaje en tu vida: escuchar un capítulo el lunes, salir a caminar, descansar, leer o contactar a alguien. Elige algo posible; podrás adaptarlo cuando lo necesites.</p>
          </div>
          <aside className="bl-route-hero__note">
            <span className="bl-route-note-icon"><ShieldCheck className="h-5 w-5" aria-hidden="true" /></span>
            <strong>Tu ruta, bajo tu control</strong>
            <p>Tu selección se guarda localmente en este navegador. No es una evaluación clínica ni una promesa de resultados.</p>
          </aside>
        </header>

        {urgent && (
          <section className="bl-route-urgent" aria-live="polite">
            <div><p className="bl-route-kicker">PRIMERO, TU SEGURIDAD</p><h2>No tienes que atravesar esto a solas.</h2><p>Si existe peligro inmediato, busca compañía presencial y llama a emergencias. Esta herramienta no puede atender una crisis.</p></div>
            <div className="bl-route-urgent__actions"><a href={getCrisisTel()}><Phone className="h-4 w-4" /> Orientación · 106</a><a href={getEmergencyTel()}><Phone className="h-4 w-4" /> Emergencias · 123</a><button type="button" onClick={() => setUrgent(false)}>Volver al plan</button></div>
          </section>
        )}

        <section className="bl-route-builder" aria-labelledby="route-builder-title">
          <div className="bl-route-builder__head">
            <div><p className="bl-route-kicker">01 · DISEÑA TU MOMENTO</p><h2 id="route-builder-title">¿Qué te gustaría hacer?</h2><p>No necesitas contestar preguntas íntimas. Empieza por una actividad concreta y personalízala.</p></div>
            <span className="bl-route-step-count"><CalendarDays className="h-4 w-4" /> 7 días disponibles</span>
          </div>

          <div className="bl-route-focus-grid">
            {focuses.map((item) => {
              const Icon = item.icon;
              return <button key={item.id} type="button" className={`bl-route-focus-card ${focus === item.id ? "is-selected" : ""}`} aria-pressed={focus === item.id} onClick={() => { setFocus(item.id); setNotice(""); }}>
                <span className={`bl-route-focus-card__icon is-${item.color}`}><Icon className="h-5 w-5" aria-hidden="true" /></span><strong>{item.title}</strong><span>{item.description}</span><span className="bl-route-focus-card__choose">{focus === item.id ? <><Check className="h-4 w-4" /> Elegido</> : "Elegir este camino"} <ArrowRight className="h-4 w-4" /></span>
              </button>;
            })}
          </div>

          <div className="bl-route-config">
            <div className="bl-route-config__heading"><p className="bl-route-kicker">02 · HAZLO POSIBLE</p><h3>Un plan que quepa en tu día</h3></div>
            <div className="bl-route-form-grid">
              <label>¿Qué día te viene bien?<select value={day} onChange={(event) => setDay(event.target.value)}>{dayOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
              <label>¿A qué hora?<select value={time} onChange={(event) => setTime(event.target.value)}>{timeOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
              <label>¿Cuánto tiempo tienes?<select value={duration} onChange={(event) => setDuration(event.target.value)}>{(focus === "movement" ? [["5","5 minutos"],["10","10 minutos"],["15","15 minutos"],["20","20 minutos"],["30","30 minutos"]] : focus === "audio" ? [["5","5 minutos"],["10","10 minutos"],["15","15 minutos"],["20","20 minutos"],["25","25 minutos"]] : [["2","2 minutos"],["5","5 minutos"],["10","10 minutos"],["15","15 minutos"]]).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
              {focus === "audio" && <label className="bl-route-form-grid__wide">¿Qué capítulo quieres escuchar?<select value={chapter} onChange={(event) => setChapter(event.target.value)}>{chapters.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</select><span className="bl-route-field-hint">La ruta te llevará a Voz para que encuentres el episodio. La disponibilidad de cada audio puede variar.</span></label>}
              {focus === "movement" && <label className="bl-route-form-grid__wide">¿Qué movimiento te gustaría probar?<select value={movement} onChange={(event) => setMovement(event.target.value)}>{movementOptions.map((item) => <option key={item} value={item}>{item}</option>)}</select><span className="bl-route-field-hint">Adapta la intensidad a tu condición física y a lo que te resulte seguro. Descansar también es una opción válida.</span></label>}
              {focus === "rest" && <div className="bl-route-inline-tip"><Moon className="h-5 w-5" /><p><strong>Idea suave:</strong> elige una señal para cerrar el día: bajar las luces, dejar el móvil lejos unos minutos o preparar lo necesario para mañana.</p></div>}
              <label>¿Quién o qué puede apoyarte?<select value={support} onChange={(event) => setSupport(event.target.value)}><option>Una persona de confianza</option><option>Un familiar o amigo</option><option>Un profesional o servicio de apoyo</option><option>Un espacio tranquilo para mí</option><option>Aún no lo sé</option></select></label>
              <label>Si el plan no sale, ¿cuál sería tu versión pequeña?<select value={planB} onChange={(event) => setPlanB(event.target.value)}><option>Hacer una versión de 2 minutos</option><option>Intentarlo mañana sin castigarme</option><option>Pedir a alguien que me acompañe</option><option>Cambiarlo por descanso</option><option>Elegir otra actividad más sencilla</option></select></label>
              <label className="bl-route-form-grid__wide">Una intención opcional (no escribas datos íntimos)<input maxLength={180} value={intention} onChange={(event) => setIntention(event.target.value)} placeholder="Ej. Quiero sentirme un poco más acompañado…" /><span className="bl-route-field-hint">Máximo 180 caracteres. Se queda en este dispositivo.</span></label>
            </div>
            <div className="bl-route-builder__actions"><button type="button" className="bl-route-primary" onClick={createPlan}><Sparkles className="h-4 w-4" /> Crear mi ruta personalizada</button><button type="button" className="bl-route-urgent-link" onClick={() => setUrgent((value) => !value)}><HeartHandshake className="h-4 w-4" /> Necesito apoyo urgente</button></div>
          </div>
        </section>

        {notice && <p className="bl-route-notice" role="status">{notice}</p>}

        {plan && (
          <section className="bl-route-plan" aria-labelledby="route-plan-title">
            <div className="bl-route-plan__top"><div><p className="bl-route-kicker">03 · TU PLAN PERSONAL</p><h2 id="route-plan-title">Tu ruta está tomando forma.</h2><p>{dateLabel(plan.day)} · {timeOptions.find(([value]) => value === plan.time)?.[1] ?? plan.time} · {plan.duration} min aprox.</p></div><div className="bl-route-plan__progress"><span>{doneCount} de {steps.length}</span><div><span style={{ width: `${(doneCount / steps.length) * 100}%` }} /></div><small>pasos marcados</small></div></div>
            {plan.intention && <blockquote>“{plan.intention}”</blockquote>}
            <div className="bl-route-timeline">{steps.map((item, index) => {
              const checked = plan.checked.includes(index);
              return <article key={item.title} className={`bl-route-timeline__item ${checked ? "is-done" : ""}`}><button type="button" aria-pressed={checked} onClick={() => toggleStep(index)} className="bl-route-timeline__check" aria-label={checked ? `Desmarcar: ${item.title}` : `Marcar como realizado: ${item.title}`}>{checked ? <Check className="h-4 w-4" /> : index + 1}</button><div><h3>{item.title}</h3><p>{item.body}</p></div></article>;
            })}</div>
            <div className="bl-route-plan__footer"><p><ShieldCheck className="h-4 w-4" /> Puedes cambiar tu ruta cuando lo necesites. Marcar pasos es una ayuda práctica, no una calificación de tu recuperación.</p><div className="bl-route-plan__buttons">{plan.focus === "audio" && <Link to="/voz"><Headphones className="h-4 w-4" /> Ir a Voz</Link>}{plan.focus === "reading" && <Link to="/ciencia"><BookOpen className="h-4 w-4" /> Explorar contenidos</Link>}<button type="button" onClick={resetPlan}><RotateCcw className="h-4 w-4" /> Diseñar otra ruta</button></div></div>
          </section>
        )}

        <section className="bl-route-bottom">
          <div><p className="bl-route-kicker">UNA NOTA PARA RECORDAR</p><h2>La constancia no significa hacerlo perfecto.</h2><p>Un plan útil es flexible: puede hacerse más pequeño, cambiar de día o dejarse para otro momento. Si hoy solo puedes descansar, eso también es información importante.</p></div>
          <div className="bl-route-bottom__links"><Link to="/recuperacion"><Compass className="h-4 w-4" /> Volver a Mi progreso</Link><Link to="/voz"><Headphones className="h-4 w-4" /> Explorar podcasts</Link><Link to="/ayuda"><HeartHandshake className="h-4 w-4" /> Buscar recursos de apoyo</Link></div>
        </section>
        <p className="bl-route-disclaimer"><Leaf className="h-3.5 w-3.5" /> Herramienta psicoeducativa, no diagnóstico ni tratamiento. Si existe peligro inmediato, llama al 123 o acude a urgencias.</p>
      </div>
    </main>
  );
}

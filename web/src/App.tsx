import { useEffect, useMemo, useState } from "react";

type Section = "home" | "plan" | "library" | "support" | "progress";
type Energy = "low" | "steady" | "high";
type Focus = "care" | "connection" | "learning" | "structure";
type Habit = { id: string; title: string; note: string; checked: string[] };
type Resource = { id?: string; title: string; summary: string; category: string; country?: string; source_name?: string; url: string };

const BRAND = (import.meta.env.VITE_BRAND || "blumhelps").toLowerCase();
const helps = BRAND.includes("helps");
const today = () => {
  const d = new Date();
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
};
const dateKey = "blum." + BRAND + ".habits.v1";
const initialHabits: Habit[] = helps ? [
  { id: "water", title: "Cuidar mi cuerpo", note: "Tomar agua o comer algo que me siente bien", checked: [] },
  { id: "move", title: "Moverme un poco", note: "Estirar o caminar cinco minutos, a mi ritmo", checked: [] },
  { id: "connect", title: "Conectar con alguien", note: "Enviar un mensaje a una persona segura", checked: [] },
  { id: "learn", title: "Nutrir mi curiosidad", note: "Leer o aprender algo durante dos minutos", checked: [] }
] : [
  { id: "water", title: "Care for my body", note: "Drink water or have something nourishing", checked: [] },
  { id: "move", title: "Move a little", note: "Stretch or walk for five minutes, at your pace", checked: [] },
  { id: "connect", title: "Connect with someone", note: "Send a message to a person you trust", checked: [] },
  { id: "learn", title: "Feed your curiosity", note: "Read or learn something for two minutes", checked: [] }
];
const localResources: Resource[] = helps ? [
  { title: "Orientación y ruta de atención", summary: "Información del Ministerio de Salud sobre atención por consumo de sustancias. Confirma la ruta aplicable a tu territorio.", category: "Apoyo", country: "Colombia", source_name: "Ministerio de Salud", url: "https://minsalud.gov.co/salud/publica/salud-mental/Paginas/convivencia-desarrollo-humano-sustancias-psicoactivas.aspx" },
  { title: "Directorio oficial de IPS", summary: "Localiza prestadores y confirma servicios, cobertura, costo y disponibilidad directamente.", category: "Apoyo", country: "Colombia", source_name: "Ministerio de Salud", url: "https://prestadores.minsalud.gov.co/directorio/consultaIPS.aspx?pageTitle=Directorio" },
  { title: "Formación SENA", summary: "Consulta cursos e inscripciones vigentes. La oferta depende de cada convocatoria.", category: "Aprendizaje", country: "Colombia", source_name: "SENA Betowa", url: "https://betowa.sena.edu.co/" },
  { title: "Agencia Pública de Empleo", summary: "Revisa los servicios públicos de orientación e intermediación laboral.", category: "Oportunidades", country: "Colombia", source_name: "SENA", url: "https://ape.sena.edu.co/Paginas/APE.aspx" }
] : [
  { title: "FindTreatment.gov", summary: "Official US treatment locator. Confirm services, cost, eligibility and current availability directly.", category: "Support", country: "United States", source_name: "U.S. Government", url: "https://findtreatment.gov/" },
  { title: "NHS: getting help for drug addiction", summary: "Official information and starting points for support in the UK. Local pathways differ by nation.", category: "Support", country: "United Kingdom", source_name: "NHS", url: "https://www.nhs.uk/live-well/addiction-support/drug-addiction-getting-help/" },
  { title: "Health Canada: treatment", summary: "Explore official treatment information and check province or territory-specific services.", category: "Support", country: "Canada", source_name: "Government of Canada", url: "https://www.canada.ca/en/health-canada/services/substance-use/treatment.html" },
  { title: "WHO: treatment standards", summary: "International guidance for understanding evidence-based care. This is information, not a local service.", category: "Learning", country: "Global", source_name: "World Health Organization", url: "https://www.who.int/publications/i/item/international-standards-for-the-treatment-of-drug-use-disorders" }
];
const copy = helps ? {
  brand: "BLUMHELPS", eyebrow: "BIENESTAR · HÁBITOS · NUEVOS COMIENZOS", headline: "No tienes que resolverlo todo hoy.", sub: "Un espacio para volver a ti, construir hábitos posibles y encontrar apoyo confiable sin juicios.", today: "Tu espacio de hoy", plan: "Diseñar mi día", planSub: "Un plan pequeño, realista y elegido por ti.", nav: ["Inicio", "Mi plan", "Biblioteca", "Apoyo", "Mi progreso"], welcome: "Cada paso cuenta. También descansar.", action: "¿Qué se siente posible hoy?", library: "Ideas para seguir creciendo", librarySub: "Pausas guiadas, conocimiento y recursos que puedes explorar a tu ritmo.", support: "Ayuda confiable, sin promesas vacías", supportSub: "Fuentes oficiales para comenzar. La aplicación no confirma cupos, elegibilidad ni atención inmediata.", progress: "Tu camino no es una carrera", progressSub: "Mira lo que has intentado, no lo que te faltó hacer.", add: "Añadir hábito", empty: "Todavía no hay pasos registrados. Puedes empezar con uno pequeño.", footer: "Tu proceso es tuyo. La ayuda no depende de una racha perfecta."
} : {
  brand: "BLUMTHERAPY", eyebrow: "WELLBEING · HABITS · GENTLE RECOVERY", headline: "You do not have to solve everything today.", sub: "A calm space to rebuild routines, explore trusted support and move forward without judgment.", today: "Your space for today", plan: "Shape my day", planSub: "A small, realistic plan chosen by you.", nav: ["Home", "My plan", "Library", "Support", "My progress"], welcome: "Every step counts. Rest counts too.", action: "What feels possible today?", library: "Ideas for your next chapter", librarySub: "Small practices, learning and trusted resources to explore at your pace.", support: "Trusted help, without empty promises", supportSub: "Official starting points. This app cannot confirm eligibility, appointments or immediate care.", progress: "Your journey is not a race", progressSub: "Notice what you tried, not what you missed.", add: "Add a habit", empty: "No steps logged yet. You can begin with one small thing.", footer: "Your process belongs to you. Support never depends on a perfect streak."
};
const sections: Section[] = ["home", "plan", "library", "support", "progress"];
const icons = ["✳", "◷", "✧", "♡", "⌁"];
const labels = copy.nav;

function readLocal<T>(fallback: T): T {
  try {
    const value = localStorage.getItem(dateKey);
    return value ? JSON.parse(value) as T : fallback;
  } catch { return fallback; }
}
function localSuggestion(energy: Energy, minutes: number, focus: Focus) {
  const map: Record<Focus, { title: string; low: string; steady: string; high: string; extra: string }> = {
    care: { title: helps ? "Volver al cuerpo" : "Return to your body", low: helps ? "Respira con comodidad y toma un poco de agua." : "Breathe comfortably and have some water.", steady: helps ? "Haz una pausa breve y estira el cuerpo." : "Take a short pause and stretch.", high: helps ? "Sal a caminar o prepara algo nutritivo." : "Take a walk or prepare something nourishing.", extra: helps ? "Elige solo lo que sea seguro y posible hoy." : "Choose only what feels safe and possible today." },
    connection: { title: helps ? "Acercarte sin presión" : "Connect without pressure", low: helps ? "Piensa en una persona con quien te sientas a salvo." : "Think of someone you feel safe with.", steady: helps ? "Envía un mensaje breve a alguien de confianza." : "Send a short message to someone you trust.", high: helps ? "Propón una llamada o un encuentro sencillo." : "Suggest a call or a simple get-together.", extra: helps ? "No tienes que explicar más de lo que quieras." : "You do not have to explain more than you want." },
    learning: { title: helps ? "Abrir una ventana nueva" : "Open a new window", low: helps ? "Lee un párrafo o escucha algo tranquilo." : "Read one paragraph or listen to something calm.", steady: helps ? "Dedica diez minutos a un tema que te interese." : "Spend ten minutes on a topic that interests you.", high: helps ? "Explora un curso o practica una habilidad." : "Explore a course or practise a skill.", extra: helps ? "Aprender también puede ser descansar." : "Learning can also be restful." },
    structure: { title: helps ? "Hacer espacio para lo importante" : "Make room for what matters", low: helps ? "Escoge una sola tarea de dos minutos." : "Choose one two-minute task.", steady: helps ? "Ordena un espacio pequeño o prepara lo de mañana." : "Tidy one small space or prepare for tomorrow.", high: helps ? "Divide una tarea pendiente en tres pasos." : "Break one pending task into three steps.", extra: helps ? "Si hoy cambia, el plan también puede cambiar." : "If today changes, the plan can change too." }
  };
  const item = map[focus];
  return { title: item.title, steps: [energy === "low" ? item.low : energy === "steady" ? item.steady : item.high, item.extra].slice(0, minutes < 8 ? 1 : 2), minutes: Math.min(minutes, energy === "low" ? 5 : minutes) };
}

export default function App() {
  const [section, setSection] = useState<Section>("home");
  const [habits, setHabits] = useState<Habit[]>(() => readLocal(initialHabits));
  const [newHabit, setNewHabit] = useState("");
  const [energy, setEnergy] = useState<Energy>("steady");
  const [minutes, setMinutes] = useState(10);
  const [focus, setFocus] = useState<Focus>("care");
  const [plan, setPlan] = useState(() => localSuggestion("steady", 10, "care"));
  const [resources, setResources] = useState<Resource[]>(localResources);
  const [query, setQuery] = useState("");
  const [online, setOnline] = useState(navigator.onLine);
  const [apiState, setApiState] = useState<"local" | "connected">("local");
  const [working, setWorking] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => { localStorage.setItem(dateKey, JSON.stringify(habits)); }, [habits]);
  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => { window.removeEventListener("online", update); window.removeEventListener("offline", update); };
  }, []);
  useEffect(() => {
    const base = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
    fetch(base + "/api/v1/resources?country=" + (helps ? "CO" : "US"), { headers: { Accept: "application/json" } })
      .then((res) => { if (!res.ok) throw new Error("API unavailable"); return res.json(); })
      .then((data: Resource[]) => { if (Array.isArray(data) && data.length) { setResources(data); setApiState("connected"); } })
      .catch(() => { setApiState("local"); });
  }, []);

  const completedToday = useMemo(() => habits.filter((h) => h.checked.includes(today())).length, [habits]);
  const visibleResources = useMemo(() => resources.filter((r) =>
    (r.title + " " + r.summary + " " + r.category + " " + (r.country || "")).toLowerCase().includes(query.toLowerCase())
  ), [resources, query]);
  const completeHabit = (id: string) => setHabits((prev) => prev.map((h) => {
    if (h.id !== id) return h;
    const checked = h.checked.includes(today()) ? h.checked.filter((d) => d !== today()) : [...h.checked, today()];
    return { ...h, checked };
  }));
  const addHabit = () => {
    const title = newHabit.trim().slice(0, 70);
    if (!title) return;
    setHabits((prev) => [...prev, { id: crypto.randomUUID(), title, note: helps ? "Un paso pequeño que elegiste para ti." : "A small step you chose for yourself.", checked: [] }]);
    setNewHabit("");
    setMessage(helps ? "Hábito añadido. Puedes cambiarlo cuando quieras." : "Habit added. You can change it whenever you need.");
  };
  const generatePlan = async () => {
    setWorking(true); setMessage("");
    const fallback = localSuggestion(energy, minutes, focus);
    setPlan(fallback);
    const base = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
    try {
      const res = await fetch(base + "/api/v1/plan/suggest", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ energy, time_minutes: minutes, focus, language: helps ? "es" : "en" })
      });
      if (res.ok) {
        const data = await res.json();
        if (data && typeof data.title === "string" && Array.isArray(data.steps)) {
          setPlan({ title: data.title, steps: data.steps.map((s: { title?: string; detail?: string } | string) => typeof s === "string" ? s : [s.title, s.detail].filter(Boolean).join(": ")), minutes: data.minutes || minutes });
          setApiState("connected");
        }
      }
    } catch { /* Local plan is already available; no private habit history is sent. */ }
    finally { setWorking(false); }
  };

  const heading = section === "home" ? copy.today : section === "plan" ? copy.plan : section === "library" ? copy.library : section === "support" ? copy.support : copy.progress;
  const subtitle = section === "home" ? copy.welcome : section === "plan" ? copy.planSub : section === "library" ? copy.librarySub : section === "support" ? copy.supportSub : copy.progressSub;

  return <div className="app-shell">
    <aside className="sidebar">
      <a className="brand" href="#" onClick={(e) => { e.preventDefault(); setSection("home"); }}>
        <span className="brand-mark">b<span>✳</span></span>
        <span><strong>{copy.brand}</strong><small>{helps ? "VOLVER A CONSTRUIR" : "GENTLE FORWARD MOTION"}</small></span>
      </a>
      <div className="side-caption">{helps ? "TU ESPACIO" : "YOUR SPACE"}</div>
      <nav className="side-nav" aria-label={helps ? "Navegación principal" : "Main navigation"}>
        {sections.map((key, i) => <button key={key} className={section === key ? "nav-item active" : "nav-item"} onClick={() => setSection(key)}>
          <span className="nav-icon">{icons[i]}</span><span>{labels[i]}</span>{section === key && <span className="nav-dot" />}
        </button>)}
      </nav>
      <div className="side-bottom">
        <div className="orb-mini">✧</div>
        <p>{helps ? "Sin juicios. Sin rachas obligatorias. A tu ritmo." : "No judgment. No required streaks. At your pace."}</p>
        <span className="private-tag"><span /> {helps ? "Tus hábitos quedan en este navegador" : "Habits stay in this browser"}</span>
      </div>
    </aside>

    <main className="main-panel">
      <header className="topbar">
        <div className="breadcrumb"><span>{copy.brand}</span><b>/</b>{heading}</div>
        <div className="top-tools">
          <span className={online ? "connection online" : "connection offline"}><i />{online ? (helps ? "En línea" : "Online") : (helps ? "Modo sin conexión" : "Offline mode")}</span>
          <button className="avatar" aria-label={helps ? "Perfil local" : "Local profile"}>✦</button>
        </div>
      </header>

      <div className="content-wrap">
        <section className="page-heading">
          <div><p className="eyebrow">{copy.eyebrow}</p><h1>{heading}</h1><p className="page-subtitle">{subtitle}</p></div>
          <div className="date-pill"><span>◷</span>{new Date().toLocaleDateString(helps ? "es-CO" : "en-US", { weekday: "short", month: "short", day: "numeric" })}</div>
        </section>

        {section === "home" && <>
          <section className="hero-panel">
            <div className="hero-copy">
              <div className="live-label"><span /> {helps ? "UN NUEVO DÍA, SIN PRESIÓN" : "A NEW DAY, WITHOUT PRESSURE"}</div>
              <h2>{copy.headline}</h2>
              <p>{copy.sub}</p>
              <button className="primary-button" onClick={() => setSection("plan")}>{copy.plan} <span>↗</span></button>
              <div className="hero-foot"><span>✧</span>{helps ? "Hoy no necesitas hacerlo perfecto." : "You do not need to do it perfectly today."}</div>
            </div>
            <div className="hero-art" aria-hidden="true"><div className="halo halo-one" /><div className="halo halo-two" /><div className="orbit"><span /><span /><span /></div><div className="seed">✳</div><div className="art-label">{helps ? "CRECER A TU RITMO" : "GROW AT YOUR PACE"}</div></div>
          </section>
          <div className="section-row"><div><h2>{helps ? "Un pequeño avance ya cuenta" : "One small step still counts"}</h2><p>{helps ? "Marca lo que te sirva hoy; mañana puedes volver a elegir." : "Check in with what helps today. You can choose again tomorrow."}</p></div><button className="text-button" onClick={() => setSection("plan")}>{helps ? "Ver mi plan" : "Open my plan"} ↗</button></div>
          <section className="habit-grid">
            {habits.slice(0, 3).map((h, i) => <button key={h.id} className={h.checked.includes(today()) ? "habit-card done" : "habit-card"} onClick={() => completeHabit(h.id)}>
              <span className={"habit-symbol symbol-" + i}>{h.checked.includes(today()) ? "✓" : ["⌁", "✳", "♡"][i % 3]}</span><span className="habit-text"><strong>{h.title}</strong><small>{h.note}</small></span><span className="habit-check">{h.checked.includes(today()) ? "✓" : "+"}</span>
            </button>)}
          </section>
          <section className="bottom-grid">
            <div className="glass-card progress-card"><div className="card-topline"><span>{helps ? "TU HOY" : "TODAY, YOUR WAY"}</span><span className="sparkle">✦</span></div><div className="progress-number">{completedToday}<small> / {habits.length}</small></div><p>{helps ? "hábitos registrados hoy" : "habits checked in today"}</p><div className="progress-track"><span style={{ width: (habits.length ? completedToday / habits.length * 100 : 0) + "%" }} /></div><button className="text-button" onClick={() => setSection("progress")}>{helps ? "Ver mi recorrido" : "View my journey"} ↗</button></div>
            <div className="glass-card insight-card"><div className="insight-icon">✧</div><div><strong>{helps ? "Una idea para este momento" : "A thought for this moment"}</strong><p>{helps ? "El progreso no desaparece porque un día sea difícil. Puedes retomar por algo pequeño." : "Progress does not disappear because a day is hard. You can return through one small thing."}</p><button className="text-button" onClick={() => setSection("support")}>{helps ? "Explorar apoyo" : "Explore support"} ↗</button></div></div>
          </section>
        </>}

        {section === "plan" && <section className="workspace-grid">
          <div className="glass-card planner-form">
            <div className="card-topline"><span>{helps ? "PLAN ADAPTABLE" : "ADAPTIVE PLAN"}</span><span className="live-pill"><i /> {helps ? "LOCAL + API" : "LOCAL + API"}</span></div>
            <h2>{helps ? "¿Qué se siente posible hoy?" : "What feels possible today?"}</h2>
            <p>{helps ? "Elige sin tener que explicar tu situación. Estas opciones solo ajustan el tamaño del paso, no hacen diagnósticos." : "Choose without explaining your situation. These options adjust the size of a step; they do not diagnose."}</p>
            <label className="field-label">{helps ? "ENERGÍA DISPONIBLE" : "ENERGY YOU HAVE"}</label>
            <div className="choice-row">{(["low", "steady", "high"] as Energy[]).map((e) => <button key={e} className={energy === e ? "choice selected" : "choice"} onClick={() => setEnergy(e)}>{e === "low" ? (helps ? "Bajita" : "Low") : e === "steady" ? (helps ? "Estable" : "Steady") : (helps ? "Con energía" : "Energised")}</button>)}</div>
            <label className="field-label">{helps ? "TIEMPO DISPONIBLE" : "TIME YOU HAVE"}</label>
            <div className="choice-row">{[5, 10, 20].map((v) => <button key={v} className={minutes === v ? "choice selected" : "choice"} onClick={() => setMinutes(v)}>{v} {helps ? "min" : "min"}</button>)}</div>
            <label className="field-label">{helps ? "¿QUÉ TE GUSTARÍA CUIDAR?" : "WHAT WOULD YOU LIKE TO NURTURE?"}</label>
            <div className="focus-grid">{(["care", "connection", "learning", "structure"] as Focus[]).map((f, i) => <button key={f} className={focus === f ? "focus-choice selected" : "focus-choice"} onClick={() => setFocus(f)}><span>{["◌", "♡", "✧", "⌁"][i]}</span>{helps ? ["Cuidarme", "Conectar", "Aprender", "Organizar"][i] : ["Self-care", "Connection", "Learning", "Structure"][i]}</button>)}</div>
            <button className="primary-button full" onClick={generatePlan} disabled={working}>{working ? (helps ? "Preparando tu plan…" : "Shaping your plan…") : (helps ? "Crear un plan amable" : "Create a gentle plan")} <span>↗</span></button>
            <p className="privacy-note">◇ {helps ? "Se comparte con la API únicamente energía, minutos y enfoque; tus hábitos no se envían." : "Only energy, minutes and focus are sent to the API; your habits are not sent."}</p>
          </div>
          <div className="glass-card result-card"><div className="result-orb">✳</div><p className="eyebrow">{helps ? "TU SIGUIENTE PASO" : "YOUR NEXT STEP"}</p><h2>{plan.title}</h2><span className="duration-chip">◷ {plan.minutes} {helps ? "minutos aproximados" : "minutes, approximately"}</span><div className="plan-steps">{plan.steps.map((step, i) => <div className="plan-step" key={step}><span>{String(i + 1).padStart(2, "0")}</span><p>{step}</p></div>)}</div><div className="gentle-note">{helps ? "Si hoy no sale como esperabas, el plan se puede ajustar. No hay puntos ni castigos." : "If today does not go as expected, you can adjust the plan. No points or penalties."}</div></div>
        </section>}

        {(section === "support" || section === "library") && <section className="resource-page">
          <div className="resource-tools"><label className="search-box"><span>⌕</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={helps ? "Buscar apoyo, salud, aprendizaje…" : "Search support, health, learning…"} /></label><span className="source-status">{apiState === "connected" ? "● API" : "● " + (helps ? "Catálogo local" : "Local catalogue")}</span></div>
          <div className="resource-grid">{visibleResources.filter((r) => section === "support" ? /support|apoyo|opportun|oportun|health|salud/i.test(r.category + " " + r.title) : /learn|aprend|well|bienestar|evidence|who|world/i.test(r.category + " " + r.title + " " + r.source_name)).map((r, i) => <article className="resource-card" key={r.id || r.title}><div className={"resource-symbol rs-" + (i % 4)}>{["↗", "✳", "⌘", "♡"][i % 4]}</div><div className="resource-meta"><span>{r.category}</span><span>{r.country || (helps ? "Colombia" : "International")}</span></div><h3>{r.title}</h3><p>{r.summary}</p><div className="resource-source">{r.source_name || (helps ? "Fuente oficial" : "Official source")}</div><a href={r.url} target="_blank" rel="noreferrer noopener">{helps ? "Consultar fuente" : "Open source"} <span>↗</span></a></article>)}</div>
          {visibleResources.length === 0 && <div className="empty-state">{helps ? "No encontramos ese término. Prueba otra búsqueda." : "No matches found. Try another search."}</div>}
          <div className="disclaimer">ⓘ {helps ? "Los enlaces son puntos de partida; verifica directamente condiciones, cobertura, costo y disponibilidad. Esta aplicación no es un servicio de urgencias ni sustituye atención profesional." : "Links are starting points. Confirm eligibility, coverage, cost and availability directly. This app is not an emergency service or a substitute for professional care."}</div>
        </section>}

        {section === "progress" && <section className="progress-page">
          <div className="glass-card journey-card"><div className="journey-ring"><div><strong>{completedToday}</strong><small>{helps ? "hoy" : "today"}</small></div></div><div><p className="eyebrow">{helps ? "SIN COMPARACIONES" : "NO COMPARISONS"}</p><h2>{helps ? "Tu progreso no se borra" : "Your progress is not erased"}</h2><p>{helps ? "No calculamos rachas ni penalizamos descansos. Este resumen solo refleja los registros que elegiste guardar." : "We do not calculate streaks or penalise rest. This summary only reflects check-ins you chose to save."}</p></div></div>
          <div className="glass-card history-card"><div className="card-topline"><span>{helps ? "ÚLTIMOS SIETE DÍAS" : "LAST SEVEN DAYS"}</span><span>↗</span></div><div className="week-bars">{Array.from({length: 7}, (_, idx) => { const d = new Date(); d.setDate(d.getDate() - (6 - idx)); const key = d.getFullYear() + "-" + String(d.getMonth()+1).padStart(2,"0") + "-" + String(d.getDate()).padStart(2,"0"); const n = habits.filter((h) => h.checked.includes(key)).length; const height = habits.length ? Math.max(8, n / habits.length * 100) : 8; return <div className="week-day" key={key}><div className="bar-rail"><span style={{height: height + "%"}} /></div><small>{d.toLocaleDateString(helps ? "es-CO" : "en-US", {weekday:"short"}).slice(0,3)}</small><b>{n}</b></div>; })}</div><p className="chart-note">{helps ? "No hay una meta perfecta. Los días en blanco no son fracasos." : "There is no perfect target. Blank days are not failures."}</p></div>
          <div className="glass-card all-habits"><div className="card-topline"><span>{helps ? "TUS HÁBITOS" : "YOUR HABITS"}</span><button className="text-button" onClick={() => setSection("plan")}>{helps ? "Editar" : "Edit"} ↗</button></div>{habits.map((h) => <div className="history-row" key={h.id}><span className={h.checked.includes(today()) ? "history-check checked" : "history-check"}>{h.checked.includes(today()) ? "✓" : "·"}</span><div><strong>{h.title}</strong><small>{h.checked.length} {helps ? "registros guardados" : "saved check-ins"}</small></div></div>)}</div>
        </section>}

        {section === "plan" && <section className="habit-manager glass-card"><div className="card-topline"><span>{helps ? "HÁBITOS QUE TÚ ELIGES" : "HABITS YOU CHOOSE"}</span><span>+ {habits.length}</span></div><div className="add-row"><input value={newHabit} onChange={(e) => setNewHabit(e.target.value)} maxLength={70} placeholder={helps ? "Añadir un hábito pequeño…" : "Add one small habit…"} onKeyDown={(e) => { if (e.key === "Enter") addHabit(); }} /><button className="secondary-button" onClick={addHabit}>{copy.add} +</button></div>{habits.map((h) => <div className="manager-row" key={h.id}><button className={h.checked.includes(today()) ? "check-button checked" : "check-button"} onClick={() => completeHabit(h.id)} aria-label={h.checked.includes(today()) ? "Uncheck" : "Check"}>{h.checked.includes(today()) ? "✓" : "○"}</button><div><strong>{h.title}</strong><small>{h.note}</small></div><button className="remove-button" aria-label={helps ? "Eliminar hábito" : "Remove habit"} onClick={() => setHabits((prev) => prev.filter((x) => x.id !== h.id))}>×</button></div>)}</section>}
        {message && <div role="status" className="status-message">{message}</div>}
        <footer className="page-footer"><span>{copy.footer}</span><span className="version-label">EARLY ACCESS · 0.2</span></footer>
      </div>
    </main>
    <nav className="mobile-nav" aria-label={helps ? "Navegación" : "Navigation"}>{sections.map((key, i) => <button key={key} className={section === key ? "mobile-item active" : "mobile-item"} onClick={() => setSection(key)}><span>{icons[i]}</span><small>{labels[i]}</small></button>)}</nav>
  </div>;
}
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowDownRight, ArrowRight, ArrowUpRight, BookOpen, BriefcaseBusiness,
  Check, Compass, GraduationCap, HeartHandshake, LifeBuoy, MapPin,
  ShieldCheck, Sparkles, Sprout, UsersRound, Volume2, Square,
} from "lucide-react";

const routes = [
  { id: "support", label: "Necesito hablar con alguien", short: "Apoyo", title: "No tienes que explicarlo todo para empezar.", description: "Encuentra rutas de orientación y servicios para revisar con calma, sin juicios ni promesas vacías.", action: "Explorar recursos de apoyo", to: "/ayuda", icon: HeartHandshake, tone: "coral", point: "A" },
  { id: "wellbeing", label: "Quiero volver a sentirme bien", short: "Bienestar", title: "Empieza por algo que sí cabe en hoy.", description: "Elige una práctica pequeña para cuidarte. Puedes cambiar de idea y volver cuando lo necesites.", action: "Elegir un pequeño paso", to: "/bienestar", icon: Sprout, tone: "leaf", point: "B" },
  { id: "work", label: "Busco trabajo o ingresos", short: "Trabajo", title: "Tu historia también tiene habilidades.", description: "Organiza tu hoja de vida y explora rutas de empleo. Las condiciones siempre se confirman con cada entidad.", action: "Preparar mi siguiente paso", to: "/empleo", icon: BriefcaseBusiness, tone: "sun", point: "C" },
  { id: "learn", label: "Quiero estudiar o aprender", short: "Formación", title: "Aprender algo puede abrir otra puerta.", description: "Explora rutas de formación y consulta directamente requisitos, fechas y disponibilidad.", action: "Explorar formación", to: "/formacion", icon: GraduationCap, tone: "sky", point: "D" },
  { id: "family", label: "Estoy acompañando a alguien", short: "Familia", title: "Acompañar no significa cargarlo todo.", description: "Encuentra ideas para escuchar, cuidar tus límites y buscar orientación para tu familia.", action: "Ver guía para familias", to: "/familias", icon: UsersRound, tone: "lilac", point: "E" },
];

function RouteMap({ active, onSelect }: { active: string; onSelect: (id: string) => void }) {
  const reducedMotion = useReducedMotion();
  const points = [
    { id: "support", x: 100, y: 98, label: "APOYO" },
    { id: "wellbeing", x: 224, y: 164, label: "BIENESTAR" },
    { id: "work", x: 347, y: 91, label: "TRABAJO" },
    { id: "learn", x: 452, y: 190, label: "FORMACIÓN" },
    { id: "family", x: 566, y: 118, label: "FAMILIA" },
  ];
  return (
    <div className="atlas-map" aria-label="Mapa ilustrado de cinco rutas posibles">
      <div className="atlas-map-stamp"><Compass size={15} /> ATLAS DE POSIBILIDADES <span>01—05</span></div>
      <svg className="atlas-map-drawing" viewBox="0 0 660 280" role="img" aria-labelledby="atlas-map-title atlas-map-desc">
        <title id="atlas-map-title">Un camino con cinco puntos de partida</title>
        <desc id="atlas-map-desc">Una ruta dibujada conecta apoyo, bienestar, trabajo, formación y familia. Selecciona un punto o una opción de la lista.</desc>
        <defs>
          <pattern id="atlas-grid" width="22" height="22" patternUnits="userSpaceOnUse"><path d="M 22 0 L 0 0 0 22" fill="none" stroke="currentColor" strokeOpacity=".12" strokeWidth=".7" /></pattern>
        </defs>
        <rect width="660" height="280" fill="url(#atlas-grid)" rx="22" />
        <path d="M 35 215 C 58 214, 61 98, 100 98 S 177 220, 224 164 S 304 52, 347 91 S 402 245, 452 190 S 520 65, 566 118 S 604 213, 632 205" fill="none" stroke="#f0ad65" strokeWidth="15" strokeLinecap="round" strokeOpacity=".22" />
        <path d="M 35 215 C 58 214, 61 98, 100 98 S 177 220, 224 164 S 304 52, 347 91 S 402 245, 452 190 S 520 65, 566 118 S 604 213, 632 205" fill="none" stroke="#f4c66e" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="3 9" />
        <path d="M 43 242 l 10 -12 m -10 12 l 15 2" stroke="#686b90" strokeWidth="2" fill="none" strokeLinecap="round" />
        {points.map((point, index) => {
          const route = routes.find((item) => item.id === point.id)!;
          const Icon = route.icon;
          const selected = active === point.id;
          return (
            <g key={point.id} className={`atlas-map-pin ${selected ? "is-active" : ""}`} transform={`translate(${point.x} ${point.y})`} role="button" tabIndex={0} aria-label={`Seleccionar ruta: ${route.short}`} aria-pressed={selected} onClick={() => onSelect(point.id)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onSelect(point.id); } }}>
              <circle r={selected ? 28 : 23} fill={selected ? "#29284f" : "#fffaf0"} stroke={selected ? "#f4c66e" : "#29284f"} strokeWidth={selected ? 3 : 1.5} />
              <circle r="16" fill={selected ? "#f4c66e" : "#e8e4d8"} />
              <foreignObject x="-11" y="-11" width="22" height="22"><div className="atlas-pin-icon"><Icon size={18} /></div></foreignObject>
              <text y="43" textAnchor="middle" className="atlas-map-label">{point.label}</text>
              <text y="-37" textAnchor="middle" className="atlas-map-index">{point.id === active ? "TU RUTA" : point.id === "support" ? "01" : `0${index + 1}`}</text>
            </g>
          );
        })}
      </svg>
      <div className="atlas-map-foot"><span><span className="atlas-map-legend-dot" /> No hay una ruta correcta para todo el mundo.</span><span>COLOMBIA · CONTIGO, NO POR TI</span></div>
    </div>
  );
}

function listen(text: string, setSpeaking: (value: boolean) => void) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  const voices = window.speechSynthesis.getVoices();
  const voice = voices.find((item) => item.lang.toLowerCase() === "es-co") ?? voices.find((item) => item.lang.toLowerCase().startsWith("es"));
  utterance.voice = voice ?? null;
  utterance.lang = voice?.lang ?? "es-CO";
  utterance.rate = 0.92;
  utterance.onend = () => setSpeaking(false);
  utterance.onerror = () => setSpeaking(false);
  setSpeaking(true);
  window.speechSynthesis.speak(utterance);
}

export default function Inicio() {
  const [activeRoute, setActiveRoute] = useState("support");
  const [speaking, setSpeaking] = useState(false);
  const reduceMotion = useReducedMotion();
  const active = routes.find((route) => route.id === activeRoute) ?? routes[0];
  const ActiveIcon = active.icon;

  useEffect(() => () => { if ("speechSynthesis" in window) window.speechSynthesis.cancel(); }, []);

  return (
    <div className="atlas-home">
      <header className="atlas-header">
        <Link to="/inicio" className="atlas-wordmark" aria-label="BlumHelps, inicio">
          <span className="atlas-logo"><Sprout size={22} strokeWidth={2.2} /></span>
          <span>blumhelps<span className="atlas-wordmark-period">.</span><small>UN ATLAS PARA VOLVER A EMPEZAR</small></span>
        </Link>
        <nav className="atlas-nav" aria-label="Navegación principal">
          <a href="#encuentra-tu-ruta">Encuentra tu ruta</a>
          <Link to="/ayuda">Directorio de apoyo</Link>
          <Link to="/bienestar">Bienestar</Link>
        </nav>
        <Link to="/ayuda/emergencia" className="atlas-urgent"><LifeBuoy size={16} /> Ayuda urgente <ArrowUpRight size={15} /></Link>
      </header>

      <main>
        <section className="atlas-hero">
          <div className="atlas-hero-copy">
            <p className="atlas-eyebrow"><span className="atlas-eyebrow-dot" /> UN LUGAR PARA EMPEZAR DE NUEVO <span>· COLOMBIA</span></p>
            <h1>Tu vida no es<br />un problema que<br /><em>debas resolver.</em></h1>
            <p className="atlas-lede">Es un camino que merece compañía. Encuentra orientación, oportunidades y pasos pequeños sin tener que contarlo todo ni hacerlo perfecto.</p>
            <div className="atlas-hero-actions">
              <a href="#encuentra-tu-ruta" className="atlas-primary">Encontrar mi punto de partida <ArrowDownRight size={18} /></a>
              <button className="atlas-audio" type="button" onClick={() => { if (speaking) { window.speechSynthesis.cancel(); setSpeaking(false); } else listen("Bienvenido a BlumHelps. Tu vida no es un problema que debas resolver. Elige una ruta: apoyo, bienestar, trabajo, formación o familia. No tienes que contarlo todo para empezar.", setSpeaking); }}>
                {speaking ? <Square size={16} /> : <Volume2 size={17} />}{speaking ? "Detener lectura" : "Escuchar bienvenida"}
              </button>
            </div>
            <div className="atlas-proof"><span><ShieldCheck size={16} /> Privacidad primero</span><span><Check size={16} /> Sin juicios ni castigos</span><span><MapPin size={16} /> Pensado para Colombia</span></div>
          </div>
          <div className="atlas-hero-art" aria-label="Ilustración de una ruta de posibilidades">
            <div className="atlas-art-note note-top"><Sparkles size={15} /><span>NO TIENES QUE SABERLO TODO</span></div>
            <div className="atlas-art-sun" />
            <div className="atlas-art-hill hill-back" />
            <div className="atlas-art-hill hill-front" />
            <svg className="atlas-art-trail" viewBox="0 0 460 500" aria-hidden="true">
              <path d="M 22 440 C 90 440 80 355 147 355 S 205 425 249 345 S 292 235 330 248 S 370 315 405 235 S 365 133 422 64" fill="none" stroke="#29284f" strokeWidth="44" strokeLinecap="round" opacity=".12" />
              <path d="M 22 440 C 90 440 80 355 147 355 S 205 425 249 345 S 292 235 330 248 S 370 315 405 235 S 365 133 422 64" fill="none" stroke="#fff7e5" strokeWidth="34" strokeLinecap="round" />
              <path d="M 22 440 C 90 440 80 355 147 355 S 205 425 249 345 S 292 235 330 248 S 370 315 405 235 S 365 133 422 64" fill="none" stroke="#e8a75d" strokeWidth="3" strokeLinecap="round" strokeDasharray="3 10" />
              <g transform="translate(147 355)"><circle r="25" fill="#fff7e5" stroke="#29284f" strokeWidth="2" /><path d="M-6 0l5 5 10-12" fill="none" stroke="#29284f" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></g>
              <g transform="translate(330 248)"><circle r="25" fill="#f4c66e" stroke="#29284f" strokeWidth="2" /><path d="M0-10v20M-10 0h20" stroke="#29284f" strokeWidth="3" strokeLinecap="round" /></g>
              <g transform="translate(422 64)"><circle r="29" fill="#29284f" stroke="#fff7e5" strokeWidth="3" /><path d="M-9 1l6 6 12-15" fill="none" stroke="#f4c66e" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" /></g>
            </svg>
            <div className="atlas-art-label label-low"><span>01</span><span>EMPIEZA DONDE ESTÁS</span></div>
            <div className="atlas-art-label label-high"><span>02</span><span>AVANZA A TU RITMO</span></div>
            <div className="atlas-art-caption"><span>NO ES UNA CARRERA</span><span>ES TU CAMINO ↗</span></div>
          </div>
          <div className="atlas-hero-bottom"><span>UNA HERRAMIENTA COMUNITARIA · NO UN SERVICIO CLÍNICO</span><a href="#encuentra-tu-ruta">BAJA PARA EXPLORAR <ArrowDownRight size={15} /></a></div>
        </section>

        <section id="encuentra-tu-ruta" className="atlas-navigator">
          <div className="atlas-section-intro">
            <p className="atlas-kicker">01 / TU PUNTO DE PARTIDA</p>
            <h2>No hace falta tener<br /><em>un plan completo.</em></h2>
            <p>Solo elige lo que más se parece a lo que necesitas hoy. Puedes cambiar de ruta cuando quieras.</p>
            <div className="atlas-privacy-note"><ShieldCheck size={18} /><span><strong>No necesitas crear una cuenta.</strong><small>Esta selección no se envía a ningún servidor.</small></span></div>
          </div>
          <div className="atlas-route-workspace">
            <div className="atlas-route-list" role="group" aria-label="¿Qué necesitas hoy?">
              <p className="atlas-route-list-title">¿QUÉ TE TRAE POR AQUÍ?</p>
              {routes.map((route, index) => {
                const Icon = route.icon;
                const selected = activeRoute === route.id;
                return (
                  <motion.button key={route.id} type="button" aria-pressed={selected} onClick={() => setActiveRoute(route.id)} className={`atlas-route-option tone-${route.tone} ${selected ? "is-active" : ""}`} whileTap={reduceMotion ? undefined : { scale: .99 }}>
                    <span className="atlas-route-icon"><Icon size={20} /></span>
                    <span className="atlas-route-option-copy"><small>0{index + 1} / {route.short.toUpperCase()}</small><strong>{route.label}</strong></span>
                    <span className="atlas-route-chevron"><ArrowUpRight size={17} /></span>
                  </motion.button>
                );
              })}
              <p className="atlas-route-footnote">No hay respuestas correctas. Solo posibilidades.</p>
            </div>
            <motion.article key={active.id} className={`atlas-route-detail tone-${active.tone}`} initial={reduceMotion ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? 0 : .25 }} aria-live="polite">
              <div className="atlas-detail-top"><span>RUTA {active.point} / 05</span><span className="atlas-detail-status"><span /> A TU RITMO</span></div>
              <div className="atlas-detail-illustration"><span className="atlas-detail-ring ring-a" /><span className="atlas-detail-ring ring-b" /><span className="atlas-detail-glyph"><ActiveIcon size={37} strokeWidth={1.5} /></span><span className="atlas-detail-orbit orbit-a" /><span className="atlas-detail-orbit orbit-b" /></div>
              <p className="atlas-detail-label">UNA POSIBILIDAD PARA EMPEZAR</p>
              <h3>{active.title}</h3>
              <p className="atlas-detail-description">{active.description}</p>
              <Link to={active.to} className="atlas-detail-cta">{active.action} <ArrowRight size={18} /></Link>
              <p className="atlas-detail-reassurance"><Check size={14} /> Puedes volver atrás o elegir otra ruta cuando quieras.</p>
            </motion.article>
          </div>
        </section>

        <section className="atlas-map-section">
          <div className="atlas-map-heading"><div><p className="atlas-kicker">02 / ELIGE CON CURIOSIDAD</p><h2>Un mapa de posibilidades.<br /><em>No una lista de exigencias.</em></h2></div><p>Explora los puntos del mapa. Cada uno abre una puerta diferente y tú decides cuál cruzar.</p></div>
          <RouteMap active={activeRoute} onSelect={setActiveRoute} />
        </section>

        <section className="atlas-bottom-grid">
          <article className="atlas-note-card">
            <span className="atlas-note-number">NOTA PARA HOY · 001</span>
            <div className="atlas-note-art" aria-hidden="true"><div className="atlas-note-leaf leaf-one" /><div className="atlas-note-leaf leaf-two" /><div className="atlas-note-stem" /><span>CRECER<br />NO ES LINEAL</span></div>
            <p className="atlas-kicker">UN RECORDATORIO AMABLE</p>
            <h2>Lo pequeño también cuenta.</h2>
            <p>Un descanso, una conversación o pedir información puede ser suficiente por hoy. No necesitas convertir cada día en una prueba.</p>
            <Link to="/bienestar" className="atlas-inline-link">Explorar herramientas de bienestar <ArrowUpRight size={16} /></Link>
          </article>
          <article className="atlas-safety-card">
            <div className="atlas-safety-top"><span><LifeBuoy size={18} /></span><p>CUANDO NO PUEDE ESPERAR</p></div>
            <h2>Si hay peligro inmediato, busca ayuda urgente.</h2>
            <p>BlumHelps no es un servicio de emergencias. Ante riesgo vital, pérdida de conciencia o dificultad para respirar, contacta los servicios de emergencia de tu zona.</p>
            <Link to="/ayuda/emergencia">Ver orientación de emergencia <ArrowUpRight size={17} /></Link>
            <div className="atlas-safety-seal"><ShieldCheck size={16} /> SIN PROMESAS FALSAS. SIN JUICIOS.</div>
          </article>
        </section>
      </main>

      <footer className="atlas-footer"><Link to="/inicio" className="atlas-wordmark"><span className="atlas-logo"><Sprout size={20} /></span><span>blumhelps<span className="atlas-wordmark-period">.</span><small>UN ATLAS PARA VOLVER A EMPEZAR</small></span></Link><p>Orientación y oportunidades para Colombia.<br />No reemplaza atención profesional.</p><div><Link to="/ayuda">Recursos</Link><Link to="/ajustes">Accesibilidad</Link><Link to="/ayuda/emergencia">Ayuda urgente</Link></div><small>Una herramienta para acompañar, no para juzgar.</small></footer>
    </div>
  );
}

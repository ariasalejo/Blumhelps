import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowDownRight, ArrowUpRight, BookOpen, BriefcaseBusiness, Check,
  ChevronRight, Compass, GraduationCap, HeartHandshake, LifeBuoy,
  ShieldCheck, Sparkles, Sprout, UsersRound, Volume2, Square, Orbit,
} from "lucide-react";

const pathways = [
  { id: "support", title: "Encontrar apoyo", description: "Orientación clara, sin juicios y con rutas de atención.", action: "Explorar recursos", to: "/ayuda", icon: HeartHandshake, number: "01", tone: "mint", tag: "Acompañamiento" },
  { id: "work", title: "Abrir camino laboral", description: "Prepara tu hoja de vida y explora rutas de empleo.", action: "Ver oportunidades", to: "/empleo", icon: BriefcaseBusiness, number: "02", tone: "peach", tag: "Empleo" },
  { id: "learn", title: "Aprender algo nuevo", description: "Formación y habilidades para tu siguiente capítulo.", action: "Explorar formación", to: "/formacion", icon: GraduationCap, number: "03", tone: "butter", tag: "Aprendizaje" },
  { id: "family", title: "Acompañar a alguien", description: "Cuidar a otra persona también empieza por escucharte.", action: "Ver guía familiar", to: "/familias", icon: UsersRound, number: "04", tone: "lilac", tag: "Familia" },
  { id: "wellbeing", title: "Volver a mí", description: "Pequeños hábitos y metas posibles, a tu propio ritmo.", action: "Elegir un paso", to: "/bienestar", icon: Sprout, number: "05", tone: "green", tag: "Bienestar" },
];

function speak(text: string, onChange: (value: boolean) => void) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  const voice = window.speechSynthesis.getVoices().find((v) => v.lang.toLowerCase() === "es-co")
    ?? window.speechSynthesis.getVoices().find((v) => v.lang.toLowerCase().startsWith("es"));
  utterance.voice = voice ?? null;
  utterance.lang = voice?.lang ?? "es-CO";
  utterance.rate = 0.94;
  utterance.onend = () => onChange(false);
  utterance.onerror = () => onChange(false);
  onChange(true);
  window.speechSynthesis.speak(utterance);
}

function OrbitalScene() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(0);
  const reducedMotion = useReducedMotion();
  const items = [
    { label: "Respira", sub: "Un momento para ti", icon: Sprout, color: "orbit-leaf" },
    { label: "Conecta", sub: "No tienes que hacerlo solo", icon: HeartHandshake, color: "orbit-heart" },
    { label: "Avanza", sub: "Un paso a la vez", icon: Compass, color: "orbit-compass" },
  ];
  useEffect(() => {
    if (reducedMotion) return;
    const timer = window.setInterval(() => setActive((value) => (value + 1) % items.length), 3600);
    return () => window.clearInterval(timer);
  }, [reducedMotion, items.length]);
  const CurrentIcon = items[active].icon;
  return (
    <div
      className="bh-orbit-stage"
      aria-label="Una visualización tridimensional de bienestar, conexión y avance"
      onMouseMove={(event) => {
        if (reducedMotion) return;
        const rect = event.currentTarget.getBoundingClientRect();
        setTilt({ x: ((event.clientY - rect.top) / rect.height - .5) * -10, y: ((event.clientX - rect.left) / rect.width - .5) * 12 });
      }}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
    >
      <div className="bh-orbit-grid" aria-hidden="true" />
      <div className="bh-orbit-glow" aria-hidden="true" />
      <div className="bh-orbit-object" style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}>
        <div className="bh-orbit-ring ring-one" />
        <div className="bh-orbit-ring ring-two" />
        <div className="bh-orbit-ring ring-three" />
        <div className="bh-orbit-core">
          <div className="bh-core-light" />
          <CurrentIcon size={54} strokeWidth={1.35} />
          <span>BLUM</span>
        </div>
        <span className="bh-orbit-dot dot-one" />
        <span className="bh-orbit-dot dot-two" />
        <span className="bh-orbit-dot dot-three" />
      </div>
      <motion.div key={items[active].label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bh-orbit-note">
        <span className={`bh-note-icon ${items[active].color}`}><CurrentIcon size={18} /></span>
        <span><strong>{items[active].label}</strong><small>{items[active].sub}</small></span>
        <span className="bh-note-index">0{active + 1}</span>
      </motion.div>
      <div className="bh-orbit-caption"><span className="bh-live-dot" /> TU PROCESO. TU RITMO.</div>
    </div>
  );
}

export default function Inicio() {
  const [selected, setSelected] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const reduceMotion = useReducedMotion();
  const chosen = pathways.find((item) => item.id === selected);
  useEffect(() => () => { if ("speechSynthesis" in window) window.speechSynthesis.cancel(); }, []);

  return (
    <div className="bh-home">
      <header className="bh-topbar">
        <Link to="/inicio" className="bh-brand" aria-label="BlumHelps, inicio">
          <span className="bh-brand-mark"><Sprout size={23} strokeWidth={2.2} /></span>
          <span>blum<span>helps</span><small>UN PASO A LA VEZ</small></span>
        </Link>
        <nav className="bh-nav" aria-label="Navegación principal">
          <a href="#elige-tu-camino">Encuentra tu ruta</a>
          <Link to="/ayuda">Recursos</Link>
          <Link to="/bienestar">Bienestar</Link>
        </nav>
        <Link to="/ayuda/emergencia" className="bh-emergency"><LifeBuoy size={16} /> Necesito ayuda <ArrowUpRight size={15} /></Link>
      </header>

      <section className="bh-hero">
        <div className="bh-hero-copy">
          <div className="bh-eyebrow"><span className="bh-eyebrow-star"><Sparkles size={13} /></span> UN ESPACIO PARA VOLVER A EMPEZAR <span className="bh-eyebrow-line" /></div>
          <h1>No tienes que<br />tenerlo todo <em>resuelto.</em></h1>
          <p className="bh-hero-description">A veces, cambiar el rumbo comienza con una sola conversación, una oportunidad o un pequeño paso. Estamos aquí para ayudarte a encontrar el tuyo.</p>
          <div className="bh-hero-actions">
            <a href="#elige-tu-camino" className="bh-button-primary">Encuentra tu siguiente paso <ArrowUpRight size={18} /></a>
            <button className="bh-button-sound" type="button" onClick={() => {
              if (isSpeaking) { window.speechSynthesis.cancel(); setIsSpeaking(false); }
              else speak("Bienvenido a BlumHelps. No tienes que tenerlo todo resuelto. Elige lo que necesitas hoy: apoyo, empleo, formación, acompañamiento familiar o bienestar. Un paso a la vez.", setIsSpeaking);
            }}>{isSpeaking ? <Square size={16} /> : <Volume2 size={17} />}{isSpeaking ? "Detener audio" : "Escuchar bienvenida"}</button>
          </div>
          <div className="bh-trust-row"><span><ShieldCheck size={16} /> Sin juicios ni presión</span><i /> <span><Check size={16} /> Tú decides por dónde empezar</span></div>
        </div>
        <div className="bh-hero-visual"><OrbitalScene /><div className="bh-visual-label"><span>01 / 05</span><span>UN NUEVO COMIENZO</span></div></div>
        <div className="bh-hero-bottom"><span>COLOMBIA · ORIENTACIÓN Y BIENESTAR</span><a href="#elige-tu-camino">DESLIZA PARA EXPLORAR <ArrowDownRight size={15} /></a></div>
      </section>

      <section id="elige-tu-camino" className="bh-pathways">
        <div className="bh-section-heading">
          <div><p className="bh-kicker">EMPIEZA POR LO QUE IMPORTA</p><h2>¿Qué necesitas <em>hoy?</em></h2></div>
          <p className="bh-section-intro">No hace falta contarlo todo. Elige una ruta y descubre opciones para avanzar a tu manera.</p>
        </div>
        <div className="bh-pathway-grid">
          {pathways.map((item, index) => {
            const Icon = item.icon;
            const active = selected === item.id;
            return <motion.button
              key={item.id}
              type="button"
              aria-pressed={active}
              onClick={() => setSelected(active ? null : item.id)}
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: .18 }}
              transition={{ duration: .45, delay: reduceMotion ? 0 : index * .06 }}
              className={`bh-pathway-card tone-${item.tone} ${active ? "is-selected" : ""}`}
            >
              <span className="bh-card-top"><span className="bh-card-number">{item.number}</span><span className="bh-card-icon"><Icon size={24} strokeWidth={1.7} /></span></span>
              <span className="bh-card-tag">{item.tag}</span>
              <span className="bh-card-title">{item.title}</span>
              <span className="bh-card-description">{item.description}</span>
              <span className="bh-card-link">{active ? "Ruta seleccionada" : "Descubrir ruta"} <ArrowUpRight size={17} /></span>
            </motion.button>;
          })}
        </div>
        {chosen && <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bh-selected-route" aria-live="polite">
          <span className="bh-selected-icon"><chosen.icon size={22} /></span>
          <div><small>UNA POSIBILIDAD PARA EMPEZAR</small><strong>{chosen.title}</strong><p>{chosen.description} Revisa siempre los requisitos y la disponibilidad con cada entidad.</p></div>
          <Link to={chosen.to} className="bh-button-primary">{chosen.action} <ChevronRight size={17} /></Link>
        </motion.div>}
      </section>

      <section className="bh-bottom-feature">
        <div className="bh-feature-art" aria-hidden="true"><div className="bh-feature-sun" /><div className="bh-feature-arc arc-a" /><div className="bh-feature-arc arc-b" /><div className="bh-feature-land land-a" /><div className="bh-feature-land land-b" /><span>RESPIRA</span></div>
        <div className="bh-feature-copy"><p className="bh-kicker">NO TIENES QUE HACERLO TODO HOY</p><h2>Lo pequeño también<br /><em>es avanzar.</em></h2><p>Un paso real vale más que un plan perfecto. Encuentra herramientas sencillas para cuidar de ti y construir hábitos que se adapten a tu vida.</p><Link to="/bienestar" className="bh-text-link">Explorar bienestar <ArrowUpRight size={17} /></Link></div>
        <aside className="bh-safety-card"><span className="bh-safety-icon"><LifeBuoy size={22} /></span><p className="bh-kicker">SI NECESITAS AYUDA URGENTE</p><h3>No tienes que afrontar una emergencia a solas.</h3><p>Si hay peligro inmediato o riesgo vital, contacta los servicios de emergencia de tu zona.</p><Link to="/ayuda/emergencia">Ver orientación de emergencia <ArrowUpRight size={16} /></Link></aside>
      </section>

      <footer className="bh-footer"><Link to="/inicio" className="bh-footer-brand">blum<span>helps</span></Link><span>Un espacio de orientación para Colombia.</span><div><Link to="/ayuda">Recursos</Link><Link to="/ajustes">Accesibilidad</Link><Link to="/ayuda/emergencia">Ayuda urgente</Link></div><small>La información orienta; no sustituye atención profesional. Confirma cada servicio con su entidad responsable.</small></footer>
    </div>
  );
}

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  BookOpen,
  BriefcaseBusiness,
  Check,
  ChevronRight,
  GraduationCap,
  HeartHandshake,
  LifeBuoy,
  ShieldCheck,
  Sprout,
  UsersRound,
  Volume2,
  Square,
} from "lucide-react";

const pathways = [
  {
    id: "support",
    title: "Encontrar apoyo",
    description: "Orientación y rutas de atención para saber a dónde acudir.",
    action: "Explorar recursos",
    to: "/ayuda",
    icon: HeartHandshake,
    number: "01",
    tone: "bg-[#e6efe7] text-[#174b3c]",
  },
  {
    id: "work",
    title: "Buscar trabajo",
    description: "Preparar tu hoja de vida y consultar rutas de empleo.",
    action: "Preparar mi siguiente paso",
    to: "/empleo",
    icon: BriefcaseBusiness,
    number: "02",
    tone: "bg-[#f8e8dc] text-[#9b482f]",
  },
  {
    id: "learn",
    title: "Estudiar o aprender",
    description: "Explorar formación y opciones para desarrollar habilidades.",
    action: "Ver formación",
    to: "/formacion",
    icon: GraduationCap,
    number: "03",
    tone: "bg-[#f5edcf] text-[#795c18]",
  },
  {
    id: "family",
    title: "Acompañar a alguien",
    description: "Ideas para apoyar sin juzgar y cuidar también de ti.",
    action: "Orientarme como familiar",
    to: "/familias",
    icon: UsersRound,
    number: "04",
    tone: "bg-[#e9e4f4] text-[#5b4382]",
  },
  {
    id: "wellbeing",
    title: "Empezar por algo pequeño",
    description: "Elegir una meta posible, sin rachas ni castigos.",
    action: "Elegir un paso",
    to: "/bienestar",
    icon: Sprout,
    number: "05",
    tone: "bg-[#e4eee7] text-[#245a45]",
  },
];

const questions = [
  { id: "support", label: "Necesito orientación o apoyo" },
  { id: "work", label: "Quiero encontrar trabajo" },
  { id: "learn", label: "Quiero estudiar o aprender" },
  { id: "family", label: "Estoy acompañando a alguien" },
  { id: "wellbeing", label: "Solo quiero dar un primer paso" },
];

/** Inicio prioriza decisiones útiles y rutas transparentes sobre datos de demostración. */
export default function Inicio() {
  const [need, setNeed] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const selected = pathways.find((item) => item.id === need);

  useEffect(() => {
    return () => {
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    };
  }, []);

  const listenToPage = () => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const textToRead = [
      "BlumHelps. Tu siguiente paso sí puede empezar hoy.",
      "Apoyo, formación y rutas para reconstruir tu camino. No tienes que resolverlo todo de una vez: empieza por lo que más necesitas ahora.",
      ...pathways.map((item) => item.title + ". " + item.description),
      "Si hay peligro inmediato, busca ayuda de emergencia."
    ].join(" ");
    const utterance = new SpeechSynthesisUtterance(textToRead);
    const voices = window.speechSynthesis.getVoices();
    utterance.voice = voices.find((voice) => voice.lang.toLowerCase() === "es-co")
      ?? voices.find((voice) => voice.lang.toLowerCase().startsWith("es"))
      ?? null;
    utterance.lang = utterance.voice?.lang ?? "es-CO";
    utterance.rate = 0.94;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const stopListening = () => {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return (
    <div className="pb-8">
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative isolate overflow-hidden rounded-[2rem] bg-[#153d32] text-white shadow-lift"
      >
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#c8df9b]/20 blur-3xl" />
          <div className="absolute -bottom-40 right-1/4 h-96 w-96 rounded-full bg-[#e78c68]/20 blur-3xl" />
          <div className="absolute inset-0 opacity-[0.09]" style={{ backgroundImage: "radial-gradient(#ffffff 0.7px, transparent 0.7px)", backgroundSize: "14px 14px" }} />
        </div>

        <div className="grid gap-8 p-6 sm:p-9 lg:grid-cols-[1.1fr_.9fr] lg:items-center lg:p-12">
          <div className="relative">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold tracking-wide text-[#e3efcb]">
              <span className="h-2 w-2 rounded-full bg-[#c8df9b]" />
              BLUMHELPS · COLOMBIA
            </p>
            <h1 className="mt-6 max-w-2xl text-[2.65rem] font-black leading-[0.99] tracking-[-0.045em] sm:text-6xl">
              Tu siguiente paso
              <span className="mt-1 block text-[#c8df9b]">sí puede empezar hoy.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
              Apoyo, formación y rutas para reconstruir tu camino. No tienes que resolverlo todo de una vez: empieza por lo que más necesitas ahora.
            </p>
            <a
              href="#elige-tu-camino"
              className="mt-7 inline-flex min-h-12 items-center gap-3 rounded-full bg-[#c8df9b] px-6 py-3 font-extrabold text-[#173e32] transition hover:-translate-y-0.5 hover:bg-[#d8e9b7] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              Encontrar mi siguiente paso <ArrowUpRight size={19} />
            </a>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={listenToPage}
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-bold text-white transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                aria-label="Escuchar el contenido principal de BlumHelps"
              >
                <Volume2 size={17} aria-hidden="true" /> Escuchar esta página
              </button>
              {isSpeaking && (
                <button
                  type="button"
                  onClick={stopListening}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-white/80 underline underline-offset-4 hover:text-white"
                >
                  <Square size={14} aria-hidden="true" /> Detener audio
                </button>
              )}
              <span className="text-xs text-white/60">Audio en español · sin instalar nada</span>
            </div>
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-white/70 sm:text-sm">
              <span className="inline-flex items-center gap-2"><ShieldCheck size={16} /> Sin crear una cuenta</span>
              <span className="inline-flex items-center gap-2"><Check size={16} /> Sin juicios ni castigos</span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md lg:max-w-none" aria-label="Cinco caminos posibles: apoyo, empleo, formación, familia y bienestar">
            <div className="absolute -inset-3 -z-10 overflow-hidden rounded-[2rem]">
              <img
                src="https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=1200&q=80"
                alt="Personas compartiendo un espacio de conversación y aprendizaje"
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover opacity-35"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-[#153d32]/45 via-[#153d32]/70 to-[#153d32]/85" />
            </div>
            <div className="rounded-[1.75rem] border border-white/15 bg-[#153d32]/75 p-4 shadow-2xl backdrop-blur-md sm:p-5">
              <div className="flex items-start justify-between border-b border-white/15 pb-4">
                <div>
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#c8df9b]">Un punto de partida</p>
                  <p className="mt-1 text-2xl font-black tracking-tight">Tu vida, tus tiempos.</p>
                </div>
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#c8df9b] text-[#173e32]">
                  <Sprout size={23} />
                </span>
              </div>
              <div className="mt-4 space-y-2.5">
                {pathways.slice(0, 4).map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.08 * index }}
                      className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.07] p-3"
                    >
                      <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${item.tone}`}>
                        <Icon size={19} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-bold text-white">{item.title}</span>
                        <span className="mt-0.5 block text-xs leading-relaxed text-white/60">{item.description}</span>
                      </span>
                      <span className="text-xs font-bold text-white/35">{item.number}</span>
                    </motion.div>
                  );
                })}
              </div>
              <div className="mt-3 flex items-center gap-3 rounded-2xl bg-[#c8df9b] p-3.5 text-[#173e32]">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#173e32]/10"><LifeBuoy size={19} /></span>
                <p className="flex-1 text-sm font-bold">No tienes que hacerlo todo hoy.</p>
                <span className="text-xl" aria-hidden="true">↗</span>
              </div>
            </div>
            <p className="mt-3 text-center text-[11px] text-white/45">Rutas de orientación. La disponibilidad debe confirmarse con cada entidad.</p>
          </div>
        </div>
      </motion.section>

      <section id="elige-tu-camino" className="scroll-mt-6 pt-10 sm:pt-12">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#47745d]">Empieza aquí</p>
            <h2 className="mt-2 max-w-2xl text-3xl font-black leading-tight tracking-tight text-[#1b2a24] sm:text-4xl">
              ¿Qué te ayudaría más en este momento?
            </h2>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-[#68736c]">
              Elige una opción. No necesitas contar detalles personales para encontrar una ruta.
            </p>
          </div>
          <span className="hidden rounded-full border border-[#d9e4d8] bg-white px-3 py-2 text-xs font-semibold text-[#47745d] sm:inline-flex">Tú eliges · Sin presión</span>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {pathways.map((item, index) => {
            const Icon = item.icon;
            const active = need === item.id;
            return (
              <motion.button
                key={item.id}
                type="button"
                onClick={() => setNeed(active ? null : item.id)}
                aria-pressed={active}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.04 * index }}
                className={`group flex min-h-[180px] flex-col rounded-[1.4rem] border p-5 text-left transition duration-200 hover:-translate-y-1 hover:shadow-lift focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#245a45] ${active ? "border-[#245a45] bg-[#eaf1e8] shadow-lift ring-2 ring-[#245a45]/15" : "border-[#e5e3d9] bg-white hover:border-[#b9cdbb]"}`}
              >
                <span className="flex w-full items-start justify-between">
                  <span className={`grid h-12 w-12 place-items-center rounded-2xl ${item.tone}`}><Icon size={23} /></span>
                  <span className={`grid h-8 w-8 place-items-center rounded-full border transition ${active ? "border-[#245a45] bg-[#245a45] text-white" : "border-[#e5e3d9] text-[#68736c] group-hover:border-[#245a45]"}`}>
                    {active ? <Check size={16} /> : <ArrowUpRight size={16} />}
                  </span>
                </span>
                <span className="mt-5 block text-lg font-extrabold tracking-tight text-[#1b2a24]">{item.title}</span>
                <span className="mt-1.5 block flex-1 text-sm leading-relaxed text-[#68736c]">{item.description}</span>
              </motion.button>
            );
          })}
        </div>

        {selected && (
          <motion.div
            key={selected.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 flex flex-col gap-4 rounded-[1.5rem] border border-[#c8d9c8] bg-[#eaf1e8] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6"
            aria-live="polite"
          >
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-[#47745d]">Tu ruta de inicio</p>
              <h3 className="mt-1 text-xl font-black text-[#1b2a24]">{selected.title}</h3>
              <p className="mt-1 max-w-xl text-sm leading-relaxed text-[#52645a]">{selected.description} Encontrarás orientación y próximos pasos; verifica siempre los requisitos con la entidad correspondiente.</p>
            </div>
            <Link to={selected.to} className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-[#174b3c] px-5 py-3 text-sm font-extrabold text-white transition hover:bg-[#24654f]">
              {selected.action} <ChevronRight size={18} />
            </Link>
          </motion.div>
        )}
      </section>

      <section className="mt-10 grid gap-4 lg:grid-cols-[1.3fr_.7fr]">
        <div className="relative overflow-hidden rounded-[1.75rem] border border-[#e5e3d9] bg-[#f5edcf] p-6 sm:p-8">
          <div className="absolute right-0 top-0 h-full w-[34%] overflow-hidden opacity-20 sm:opacity-35" aria-hidden="true">
            <img
              src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=900&q=80"
              alt=""
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#f5edcf] via-[#f5edcf]/45 to-transparent" />
          </div>
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/50" aria-hidden="true" />
          <div className="relative">
            <span className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.16em] text-[#795c18]"><BookOpen size={15} /> Una guía, sin promesas falsas</span>
            <h2 className="mt-3 max-w-xl text-2xl font-black leading-tight tracking-tight text-[#2f2b1f] sm:text-3xl">Información útil para dar el paso con más claridad.</h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#625a43]">Explora rutas de formación y empleo, recursos de orientación y herramientas personales. BlumHelps no garantiza cupos, empleos, subsidios ni atención inmediata.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link to="/formacion" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#2f3f31] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#425a45]">Explorar formación <ChevronRight size={16} /></Link>
              <Link to="/empleo" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#a79b76] px-5 py-2.5 text-sm font-bold text-[#2f2b1f] transition hover:bg-white/50">Preparar hoja de vida <ChevronRight size={16} /></Link>
            </div>
          </div>
        </div>

        <aside className="flex flex-col justify-between rounded-[1.75rem] bg-[#f8e8dc] p-6 sm:p-7">
          <div>
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/70 text-[#9b482f]"><LifeBuoy size={23} /></span>
            <h2 className="mt-4 text-2xl font-black tracking-tight text-[#482b22]">¿Hay peligro inmediato?</h2>
            <p className="mt-2 text-sm leading-relaxed text-[#70483b]">Si alguien pierde el conocimiento, tiene dificultad para respirar o está en riesgo vital, busca ayuda de emergencia.</p>
          </div>
          <Link to="/ayuda/emergencia" className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-full bg-[#9b482f] px-5 py-2.5 text-sm font-extrabold text-white transition hover:bg-[#813b28]">
            Ver orientación de emergencia <ChevronRight size={17} />
          </Link>
        </aside>
      </section>

      <footer className="mt-8 flex flex-col gap-2 border-t border-[#e5e3d9] pt-5 text-xs leading-relaxed text-[#68736c] sm:flex-row sm:items-center sm:justify-between">
        <span>BlumHelps · Un espacio de orientación para Colombia.</span>
        <span>Privacidad primero · Los recursos no sustituyen atención profesional.</span>
      </footer>
    </div>
  );
}

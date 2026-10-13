import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  HeartHandshake,
  Sprout,
  Briefcase,
  Users,
  GraduationCap,
  UsersRound,
  ChevronRight,
  Phone,
  Compass,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { GOAL_TEMPLATES, AYUDA } from "../data/demo";
import { PageHeader, MORE_NAV, DemoTag } from "../components/ui";

/** Home: solo orienta y da atajos. Nada amontonado. */
export default function Inicio() {
  // Recomendación del día determinista (rota sobre el día del año)
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  const goal = GOAL_TEMPLATES[dayOfYear % 4]; // solo metas Free (g1–g4)
  const help = AYUDA[(dayOfYear + 2) % AYUDA.length];

  const areas = [
    { to: "/ayuda", label: "Encontrar ayuda", desc: "Directorio de apoyo profesional y comunitario", icon: HeartHandshake, tone: "bg-forest text-white" },
    { to: "/bienestar", label: "Bienestar", desc: "Metas pequeñas, a tu ritmo, sin culpa", icon: Sprout, tone: "bg-sage text-forest" },
    { to: "/empleo", label: "Empleo", desc: "Oportunidades verificadas y hoja de vida", icon: Briefcase, tone: "bg-coral/15 text-[#b3543a]" },
    { to: "/comunidad", label: "Comunidad", desc: "Actividades, voluntariado y grupos", icon: Users, tone: "bg-amber/15 text-[#9a6a1d]" },
  ];

  return (
    <div className="pb-6">
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative grid overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#153d32] via-forest to-[#267e62] p-6 text-white shadow-lift sm:p-9 lg:grid-cols-[1.08fr_.92fr] lg:items-center lg:gap-8 lg:p-10"
      >
        <div className="pointer-events-none absolute -right-28 -top-32 h-80 w-80 rounded-full bg-emerald/35 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-36 left-1/4 h-72 w-72 rounded-full bg-lime-300/10 blur-3xl" aria-hidden="true" />
        <div className="relative z-10">
          <p className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[.18em] text-white/75 sm:text-sm">
            <Compass size={16} /> BlumHelps · Colombia
            <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 normal-case tracking-normal text-white/90">Un paso a la vez</span>
          </p>
          <h1 className="mt-4 max-w-xl text-3xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl">
            No tienes que resolverlo todo hoy.
          </h1>
          <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-white/85 sm:text-lg">
            Encuentra el siguiente paso que tenga sentido para ti. Elige por dónde empezar:
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/ayuda" className="btn inline-flex min-h-[48px] items-center gap-2 rounded-full bg-white px-6 font-bold text-forest transition-colors hover:bg-sage">
              Encontrar ayuda <ChevronRight size={18} />
            </Link>
            <Link to="/bienestar" className="inline-flex min-h-[48px] items-center gap-2 rounded-full border border-white/40 bg-white/5 px-6 font-bold text-white backdrop-blur transition-colors hover:bg-white/15">
              Ver mis metas
            </Link>
          </div>
          <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-xs font-semibold text-white/75 sm:text-sm">
            <span className="inline-flex items-center gap-1.5"><ShieldCheck size={16} /> Tus metas permanecen en este dispositivo</span>
            <span className="inline-flex items-center gap-1.5"><Sparkles size={16} /> Sin rachas ni castigos</span>
          </div>
        </div>

        <div className="relative mx-auto mt-8 w-full max-w-sm sm:max-w-md lg:mt-0 lg:max-w-none" aria-hidden="true">
          <div className="absolute inset-4 rounded-[2rem] bg-lime-200/15 blur-2xl" />
          <motion.div
            animate={{ y: [0, -7, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="relative rounded-[1.75rem] border border-white/20 bg-white/[0.09] p-4 shadow-2xl backdrop-blur-xl sm:p-5"
          >
            <div className="flex items-center justify-between gap-3 border-b border-white/15 pb-4">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-white/60">Tu espacio</p>
                <p className="mt-1 text-lg font-extrabold tracking-tight">A tu ritmo</p>
              </div>
              <span className="grid h-11 w-11 place-items-center rounded-2xl border border-white/15 bg-white/10 text-lime-100">
                <Sparkles size={22} />
              </span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/10 bg-[#102f27]/55 p-3.5">
                <p className="text-[10px] font-bold uppercase tracking-[.15em] text-white/55">Energía</p>
                <p className="mt-1 text-sm font-bold text-white">La que tengas</p>
                <p className="mt-1 text-xs text-white/55">Sin compararte</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-[#102f27]/55 p-3.5">
                <p className="text-[10px] font-bold uppercase tracking-[.15em] text-white/55">Progreso</p>
                <p className="mt-1 text-sm font-bold text-white">Sin rachas</p>
                <p className="mt-1 text-xs text-white/55">Siempre puedes volver</p>
              </div>
            </div>
            <div className="mt-3 rounded-2xl border border-white/15 bg-white/10 p-4">
              <div className="flex items-center gap-2 text-xs font-bold text-lime-100">
                <span className="h-2 w-2 rounded-full bg-lime-300 shadow-[0_0_14px_rgba(190,242,100,0.9)]" />
                UNA IDEA PARA HOY
              </div>
              <p className="mt-2 text-base font-extrabold leading-snug">Haz una pausa de dos minutos.</p>
              <p className="mt-1.5 text-xs leading-relaxed text-white/70">Un paso posible basta. Puedes cambiarlo o dejarlo para después.</p>
              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/15">
                <motion.div
                  initial={{ width: "20%" }}
                  animate={{ width: ["20%", "58%", "36%"] }}
                  transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                  className="h-full rounded-full bg-gradient-to-r from-lime-200 to-emerald-300"
                />
              </div>
            </div>
          </motion.div>
          <div className="absolute -left-4 top-1/4 hidden -translate-x-1/4 rounded-full border border-white/20 bg-[#174b3c]/95 px-3 py-2 text-xs font-bold text-white shadow-lg sm:block">
            ✦ Sin juicios
          </div>
        </div>
      </motion.section>

      {/* Atajos a las 4 áreas clave */}
      <PageHeader
        eyebrow="Elige por dónde empezar"
        title="Cuatro caminos, ninguno obligatorio"
      />
      <section className="grid sm:grid-cols-2 gap-4">
        {areas.map(({ to, label, desc, icon: Icon, tone }, i) => (
          <motion.div
            key={to}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i }}
          >
            <Link
              to={to}
              className="card-bh flex items-center gap-4 h-full hover:shadow-lift hover:-translate-y-0.5 transition-all"
            >
              <span className={"grid place-items-center w-12 h-12 rounded-2xl shrink-0 " + tone}>
                <Icon size={22} />
              </span>
              <span className="flex-1">
                <span className="block font-bold text-[17px] text-ink">{label}</span>
                <span className="block text-sm text-muted mt-0.5">{desc}</span>
              </span>
              <ChevronRight size={20} className="text-muted" />
            </Link>
          </motion.div>
        ))}
      </section>

      {/* Recomendación del día */}
      <section className="mt-8 grid lg:grid-cols-2 gap-4">
        <div className="card-bh bg-sage/60">
          <p className="text-xs font-bold uppercase tracking-widest text-forest">Tu paso pequeño de hoy <DemoTag /></p>
          <h2 className="mt-2 text-xl font-extrabold text-ink">{goal.title}</h2>
          <p className="mt-1.5 text-sm text-ink/80 leading-relaxed">{goal.micro}</p>
          <p className="mt-2 text-xs text-muted italic">{goal.hint}</p>
          <Link to="/bienestar" className="btn-secondary mt-4">
            Ver mi plan de metas <ChevronRight size={16} />
          </Link>
        </div>

        <div className="card-bh">
          <p className="text-xs font-bold uppercase tracking-widest text-forest">Un recurso cerca de ti <DemoTag /></p>
          <h2 className="mt-2 text-xl font-extrabold text-ink leading-snug">{help.title}</h2>
          <p className="mt-1.5 text-sm text-muted">{help.org} · {help.city}</p>
          <p className="mt-1.5 text-sm text-ink/80 line-clamp-2">{help.summary}</p>
          <Link to={`/ayuda/recurso/${help.id}`} className="btn-secondary mt-4">
            Abrir ficha <ChevronRight size={16} />
          </Link>
        </div>
      </section>

      {/* Más secciones */}
      <section className="mt-8">
        <h2 className="font-bold text-lg text-ink mb-3">Más formas de acompañarte</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <Link to="/formacion" className="card-bh flex items-center gap-3 hover:shadow-lift transition-shadow">
            <span className="grid place-items-center w-10 h-10 rounded-xl bg-sage text-forest"><GraduationCap size={19} /></span>
            <span className="flex-1 font-semibold text-ink">Formación</span>
            <ChevronRight size={18} className="text-muted" />
          </Link>
          <Link to="/familias" className="card-bh flex items-center gap-3 hover:shadow-lift transition-shadow">
            <span className="grid place-items-center w-10 h-10 rounded-xl bg-sage text-forest"><UsersRound size={19} /></span>
            <span className="flex-1 font-semibold text-ink">Familias que acompañan</span>
            <ChevronRight size={18} className="text-muted" />
          </Link>
        </div>
      </section>

      {/* Nota de emergencia permanente */}
      <section className="mt-8 rounded-xl2 border border-coral/40 bg-coral/10 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3">
        <Phone size={20} className="text-coral shrink-0" />
        <p className="text-sm text-ink leading-relaxed flex-1">
          Si hay peligro inmediato —sobredosis, pérdida de conciencia, riesgo vital— llama a la{" "}
          <b>Línea 123</b>. BlumHelps no es un servicio de emergencias ni reemplaza profesionales.
        </p>
        <Link to="/ayuda/emergencia" className="btn bg-coral text-white hover:brightness-105 min-h-[44px] rounded-full px-5 font-semibold whitespace-nowrap">
          Qué hacer en una emergencia
        </Link>
      </section>

      <p className="mt-6 text-xs text-muted leading-relaxed">
        Prototipo: todos los recursos mostrados son ficticios y están etiquetados <DemoTag />. Las
        secciones {MORE_NAV.map((m) => m.label).join(", ")} tienen ruta propia en el menú.
      </p>
    </div>
  );
}

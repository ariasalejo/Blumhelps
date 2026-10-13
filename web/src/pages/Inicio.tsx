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
        className="rounded-xl2 bg-gradient-to-br from-forest to-emerald text-white p-6 sm:p-10 shadow-lift relative overflow-hidden"
      >
        <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-white/10" aria-hidden="true" />
        <div className="absolute -right-2 bottom-0 w-28 h-28 rounded-full bg-amber/25" aria-hidden="true" />
        <p className="text-sm font-semibold text-white/75 flex items-center gap-2">
          <Compass size={16} /> BlumHelps · Colombia
        </p>
        <h1 className="mt-2 text-2xl sm:text-4xl font-extrabold tracking-tight max-w-xl leading-snug">
          No tienes que resolverlo todo hoy.
        </h1>
        <p className="mt-3 text-[15px] sm:text-lg text-white/90 max-w-lg leading-relaxed">
          Encuentra el siguiente paso que tenga sentido para ti. Elige por dónde empezar:
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/ayuda" className="btn bg-white text-forest hover:bg-sage min-h-[48px] px-6 rounded-full font-bold inline-flex items-center gap-2 transition-colors">
            Encontrar ayuda <ChevronRight size={18} />
          </Link>
          <Link to="/bienestar" className="min-h-[48px] px-6 rounded-full font-bold inline-flex items-center gap-2 border-2 border-white/60 text-white hover:bg-white/10 transition-colors">
            Ver mis metas
          </Link>
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

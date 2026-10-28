// ============================================================================
// BLUMHELPS — MI PROGRESO
// Experiencia de recuperación centrada en la persona, no en una puntuación.
// Mantiene los motores y el almacenamiento local ya existentes.
// ============================================================================

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Compass,
  ExternalLink,
  HeartHandshake,
  HeartPulse,
  Home,
  Leaf,
  Loader2,
  Phone,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { recoveryStorage } from "../../lib/recovery/storage";
import {
  computeValueCongruence,
  bandaCongruencia,
  type ValorDeclarado,
} from "../../lib/recovery/valuesEngine";
import { TodayPlan } from "../../components/recovery/TodayPlan";
import { MiProcesoExperience } from "../../components/recovery/MiProcesoExperience";
import "./RecoveryHub.css";

const recoveryDomains = [
  {
    number: "01",
    title: "Salud y bienestar",
    description:
      "Descanso, alimentación, cuerpo, emociones y acceso a atención profesional cuando la necesitas. Cuidarte no tiene que empezar con un gran cambio.",
    action: "Explorar recursos",
    to: "/ayuda",
    icon: HeartPulse,
  },
  {
    number: "02",
    title: "Hogar y estabilidad",
    description:
      "La seguridad, un lugar donde estar y cubrir necesidades básicas también forman parte del camino. El entorno importa; no todo depende de la voluntad.",
    action: "Buscar orientación",
    to: "/ayuda",
    icon: Home,
  },
  {
    number: "03",
    title: "Propósito y oportunidades",
    description:
      "Aprender, trabajar, crear, cuidar a alguien o reconstruir una rutina puede devolver espacio a las cosas que tienen sentido para ti.",
    action: "Ver oportunidades",
    to: "/oportunidades",
    icon: Activity,
  },
  {
    number: "04",
    title: "Vínculos y comunidad",
    description:
      "Pedir compañía, recuperar vínculos a tu ritmo o encontrar personas que escuchen sin juzgar puede hacer el siguiente paso más llevadero.",
    action: "Explorar apoyos",
    to: "/familiares",
    icon: Users,
  },
];

function MiniGauge({ value }: { value: number }) {
  const radius = 25;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Math.min(100, Math.max(0, value)) / 100);
  const band = bandaCongruencia(value);
  const color =
    band === "brecha_alta"
      ? "#f0ad91"
      : band === "en_proceso"
        ? "#f0d58d"
        : "#bfe9c5";

  return (
    <div
      className="relative h-[68px] w-[68px] shrink-0"
      role="img"
      aria-label={`Indicador exploratorio de congruencia con valores: ${value} de 100. No es una medida clínica.`}
    >
      <svg viewBox="0 0 64 64" className="h-full w-full -rotate-90" aria-hidden="true">
        <circle cx="32" cy="32" r={radius} fill="none" stroke="rgba(255,255,255,.13)" strokeWidth="5" />
        <circle
          cx="32"
          cy="32"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset .5s ease" }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-sm font-bold" style={{ color }}>
        {Math.round(value)}
      </span>
    </div>
  );
}

export function RecoveryHub() {
  const [loading, setLoading] = useState(true);
  const [valores, setValores] = useState<Record<string, ValorDeclarado> | null>(null);
  const [storageNotice, setStorageNotice] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const storedValues = await recoveryStorage.getValues();
        if (!cancelled) setValores(storedValues);
      } catch {
        if (!cancelled) {
          setValores(null);
          setStorageNotice(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const congruencia = useMemo(
    () => (valores ? computeValueCongruence(Object.values(valores)) : null),
    [valores],
  );
  const definida = !!valores && Object.keys(valores).length >= 3;
  const artUrl = `${import.meta.env.BASE_URL}images/mi-progreso-bienestar.svg`;

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center" role="status" aria-label="Preparando Mi progreso">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--moss)]" aria-hidden="true" />
        <span className="sr-only">Preparando tu espacio de progreso.</span>
      </div>
    );
  }

  return (
    <div className="bl-progress-page">
      <div
        className="bl-progress-ambient"
        style={{ backgroundImage: `url("${artUrl}")` }}
        aria-hidden="true"
      />

      <div className="bl-progress-layout">
        <section
          className="bl-progress-hero"
          aria-labelledby="mi-progreso-title"
          style={{
            backgroundImage: `linear-gradient(105deg, rgba(5, 27, 25, .97) 0%, rgba(5, 35, 31, .92) 42%, rgba(8, 39, 34, .56) 100%), url("${artUrl}")`,
          }}
        >
          <div className="bl-progress-hero__grid">
            <div className="bl-progress-hero__copy">
              <p className="bl-progress-eyebrow">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                Mi progreso · un día a la vez
              </p>
              <h1 id="mi-progreso-title">Tu vida es mucho más que un día difícil.</h1>
              <p className="bl-progress-hero__lead">
                Este es un espacio para recuperar dirección sin exigirte perfección.
                Un paso puede ser cuidarte, pedir apoyo, descansar o intentar de nuevo.
                Tú decides qué es posible hoy.
              </p>

              <div className="bl-progress-actions">
                <a href="#mi-progreso-hoy" className="bl-progress-button bl-progress-button--primary">
                  Elegir mi paso de hoy
                  <ArrowDownRight className="h-4 w-4" aria-hidden="true" />
                </a>
                <Link to="/recuperacion/valores" className="bl-progress-button bl-progress-button--secondary">
                  <Compass className="h-4 w-4" aria-hidden="true" />
                  Explorar mi brújula
                </Link>
              </div>

              <div className="bl-progress-privacy" aria-label="Principios de privacidad">
                <span><ShieldCheck aria-hidden="true" /> Tus elecciones temporales no se comparten</span>
                <span><Leaf aria-hidden="true" /> Avances guardados en este dispositivo</span>
              </div>
            </div>

            <aside className="bl-progress-glass" aria-labelledby="bl-progress-ritual-title">
              <div className="bl-progress-glass__top">
                <p>Una forma amable de avanzar</p>
                <span className="bl-progress-glass__mark"><HeartHandshake className="h-5 w-5" aria-hidden="true" /></span>
              </div>
              <h2 id="bl-progress-ritual-title">No es un examen. Es tu camino.</h2>
              <p className="bl-progress-glass__intro">
                La recuperación es personal. Puedes hacer una pausa, pedir ayuda,
                cambiar de dirección y regresar cuando estés listo.
              </p>

              <ol className="bl-progress-ritual">
                <li>
                  <span className="bl-progress-ritual__number">01</span>
                  <div><strong>Pausa</strong><span>Observa cómo estás, sin tener que arreglarlo todo.</span></div>
                </li>
                <li>
                  <span className="bl-progress-ritual__number">02</span>
                  <div><strong>Elige</strong><span>Busca una acción pequeña que tenga sentido para ti.</span></div>
                </li>
                <li>
                  <span className="bl-progress-ritual__number">03</span>
                  <div><strong>Intenta</strong><span>Adapta el paso a tu energía y a tu realidad.</span></div>
                </li>
                <li>
                  <span className="bl-progress-ritual__number">04</span>
                  <div><strong>Reconoce</strong><span>Valora el esfuerzo, incluso si necesitas volver a empezar.</span></div>
                </li>
              </ol>

              <div className="mt-5 border-t border-white/10 pt-4 text-xs leading-6 text-white/60">
                Un día difícil no borra lo que has aprendido. No tienes que ganarte el derecho a recibir apoyo.
              </div>
            </aside>
          </div>

          <div className="bl-progress-ribbon" aria-label="Principio de acompañamiento">
            <span>Avanzar también puede ser descansar</span>
            <span className="bl-progress-ribbon__words" aria-hidden="true">
              <b>Pausa</b><i /> <b>Elige</b><i /> <b>Intenta</b><i /> <b>Reconoce</b>
            </span>
          </div>
        </section>

        {storageNotice && (
          <p role="status" className="rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-950">
            No pudimos leer la brújula guardada en este dispositivo. Puedes seguir usando el plan y las prácticas, o volver a configurar tus valores más tarde.
          </p>
        )}

        <section id="mi-progreso-hoy" className="bl-progress-section" aria-labelledby="bl-progress-today-heading">
          <header className="bl-progress-section__heading">
            <p className="bl-progress-section__eyebrow"><CheckCircle2 className="h-4 w-4" aria-hidden="true" /> Tu siguiente paso</p>
            <h2 id="bl-progress-today-heading">Hoy basta con encontrar un paso posible.</h2>
            <p>
              Aquí está tu punto de partida. Elige la sugerencia, escucha el resumen o ajústalo a
              lo que necesitas. Si aún no has definido tu brújula, también puedes empezar.
            </p>
          </header>
          <div className="bl-progress-today-shell">
            <TodayPlan />
          </div>
        </section>

        <section className="bl-progress-section" aria-labelledby="bl-progress-domains-heading">
          <header className="bl-progress-section__heading">
            <p className="bl-progress-section__eyebrow"><Activity className="h-4 w-4" aria-hidden="true" /> Una vida entera, no solo un síntoma</p>
            <h2 id="bl-progress-domains-heading">La recuperación también se construye fuera de esta pantalla.</h2>
            <p>
              El bienestar tiene varias dimensiones. No necesitas resolverlas todas juntas;
              estas puertas te ayudan a reconocer qué tipo de apoyo podría servirte hoy.
            </p>
          </header>

          <div className="bl-progress-domains">
            {recoveryDomains.map((domain) => {
              const Icon = domain.icon;
              return (
                <Link key={domain.number} to={domain.to} className="bl-progress-domain">
                  <div className="bl-progress-domain__head">
                    <span>DIMENSIÓN {domain.number}</span>
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <span className="bl-progress-domain__icon"><Icon className="h-5 w-5" aria-hidden="true" /></span>
                  <h3>{domain.title}</h3>
                  <p>{domain.description}</p>
                  <span className="bl-progress-domain__link">{domain.action} <ArrowRight className="h-4 w-4" aria-hidden="true" /></span>
                </Link>
              );
            })}
          </div>

          <div className="bl-progress-value-bridge">
            <span className="bl-progress-value-bridge__icon"><Compass className="h-5 w-5" aria-hidden="true" /></span>
            <div>
              <h3>{definida ? "Tu brújula de valores está disponible." : "Tu brújula de valores puede esperar."}</h3>
              <p>
                {definida
                  ? "Puedes revisar lo que te importa y cómo deseas acercarte a ello. El indicador es una reflexión personal; no mide tu salud ni la calidad de tu recuperación."
                  : "Define o revisa las áreas que te importan cuando te resulte útil. Es una herramienta de dirección, no una condición para comenzar."}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {definida && congruencia !== null && <MiniGauge value={congruencia} />}
              <Link to="/recuperacion/valores" className="bl-progress-button">Revisar mi brújula <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
            </div>
          </div>
        </section>

        <section className="bl-progress-practices" aria-labelledby="bl-progress-practices-heading">
          <header className="bl-progress-practices__heading">
            <p className="bl-progress-section__eyebrow"><BookOpen className="h-4 w-4" aria-hidden="true" /> Prácticas breves · a tu ritmo</p>
            <h2 id="bl-progress-practices-heading">Un poco de espacio también puede ayudar.</h2>
            <p>
              Explora una práctica guiada, elige una acción sencilla o lee algo breve.
              No tienes que completar las tres actividades para que tu esfuerzo tenga valor.
            </p>
          </header>
          <MiProcesoExperience />
        </section>

        <section className="bl-progress-support" aria-label="Recursos de apoyo">
          <div className="bl-progress-support__main">
            <p className="bl-progress-section__eyebrow"><HeartHandshake className="h-4 w-4" aria-hidden="true" /> La conexión también cuenta</p>
            <h2>No tienes que atravesar este proceso a solas.</h2>
            <p>
              Hablar con alguien de confianza, pedir una cita o consultar un recurso puede ser un
              primer paso. Buscar ayuda no es fallar ni significa que debas tener todas las respuestas.
            </p>
            <div className="bl-progress-support__links">
              <Link to="/ayuda"> <ShieldCheck className="h-4 w-4" aria-hidden="true" /> Recursos de ayuda <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" /></Link>
              <Link to="/familiares"><Users className="h-4 w-4" aria-hidden="true" /> Orientación para familiares</Link>
              <Link to="/voz"><BookOpen className="h-4 w-4" aria-hidden="true" /> Escuchar y aprender</Link>
            </div>
          </div>

          <aside className="bl-progress-crisis" aria-labelledby="bl-progress-crisis-heading">
            <span className="bl-progress-crisis__label">Si necesitas apoyo inmediato</span>
            <h3 id="bl-progress-crisis-heading">Hay personas que pueden escucharte.</h3>
            <p>
              En Colombia, la Línea 106 ofrece orientación en salud mental. Si hay peligro
              inmediato o una emergencia médica, llama al 123 o acude a urgencias.
              BlumHelps no es un servicio de emergencias.
            </p>
            <div className="bl-progress-crisis__actions">
              <a href="tel:106"><Phone className="h-4 w-4" aria-hidden="true" /> Llamar al 106</a>
              <a href="tel:123"><Phone className="h-4 w-4" aria-hidden="true" /> Emergencias 123</a>
            </div>
            <a
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[#72503b] underline decoration-[#72503b]/30 underline-offset-4 hover:decoration-current"
              href="https://www.minsalud.gov.co/salud/publica/salud-mental/Paginas/linea-106.aspx"
              target="_blank"
              rel="noreferrer"
            >
              Información oficial de la Línea 106 <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </aside>
        </section>

        <section className="bl-progress-sources" aria-labelledby="bl-progress-sources-heading">
          <div>
            <h2 id="bl-progress-sources-heading">Cuidado, evidencia y transparencia.</h2>
            <p>
              Referencias públicas que orientan el enfoque del módulo. Consultarlas no equivale
              a una validación clínica de esta aplicación.
            </p>
          </div>
          <div className="bl-progress-sources__list">
            <a href="https://www.samhsa.gov/substance-use/recovery/about" target="_blank" rel="noreferrer">
              SAMHSA · Dimensiones de la recuperación <ExternalLink className="h-3 w-3" aria-hidden="true" />
            </a>
            <a href="https://www.who.int/publications/i/item/9789240084278" target="_blank" rel="noreferrer">
              OMS · Guía mhGAP <ExternalLink className="h-3 w-3" aria-hidden="true" />
            </a>
            <a href="https://www.who.int/publications/i/item/9789240003927" target="_blank" rel="noreferrer">
              OMS · Manejar el estrés <ExternalLink className="h-3 w-3" aria-hidden="true" />
            </a>
          </div>
        </section>

        <p className="bl-progress-disclaimer">
          Acompañamiento psicoeducativo. No sustituye atención profesional ni ofrece diagnóstico o tratamiento.
          Tu proceso es personal, y puedes volver a tu ritmo. En una emergencia, llama al 123; para orientación
          en salud mental en Colombia, consulta la Línea 106.
        </p>
      </div>
    </div>
  );
}

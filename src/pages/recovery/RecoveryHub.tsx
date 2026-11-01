// ============================================================================
// BLUMHELPS — MI PROGRESO
// Panel de trabajo cotidiano: una acción, accesos útiles y prácticas opcionales.
// No duplica la portada de Inicio; acompaña la siguiente decisión del usuario.
// ============================================================================

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Compass,
  LifeBuoy,
  Loader2,
  Map,
  Phone,
  ShieldCheck,
  Sunrise,
  Users,
} from "lucide-react";
import { recoveryStorage } from "../../lib/recovery/storage";
import type { ValorDeclarado } from "../../lib/recovery/valuesEngine";
import { TodayPlan } from "../../components/recovery/TodayPlan";
import { MiProcesoExperience } from "../../components/recovery/MiProcesoExperience";
import { ProgressPathMap } from "../../components/recovery/ProgressPathMap";
import "./RecoveryHub.css";

export function RecoveryHub() {
  const [loading, setLoading] = useState(true);
  const [valuesCount, setValuesCount] = useState(0);
  const [storageNotice, setStorageNotice] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const values = await recoveryStorage.getValues();
        if (!cancelled) {
          const stored = values as Record<string, ValorDeclarado> | null;
          setValuesCount(stored ? Object.keys(stored).length : 0);
        }
      } catch {
        if (!cancelled) {
          setValuesCount(0);
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

  const hasCompass = valuesCount >= 3;

  if (loading) {
    return (
      <div className="flex min-h-[45vh] items-center justify-center gap-3" role="status" aria-label="Preparando Mi progreso">
        <Loader2 className="h-6 w-6 animate-spin text-emerald-800" aria-hidden="true" />
        <span className="text-sm text-slate-600">Preparando tu espacio…</span>
      </div>
    );
  }

  return (
    <main className="bl-progress-dashboard">
      <div className="bl-progress-shell">
        <header className="bl-progress-header">
          <div className="bl-progress-heading">
            <Link to="/" className="bl-progress-breadcrumb">
              BLUMHELPS <span aria-hidden="true">/</span> Inicio
            </Link>
            <p className="bl-progress-eyebrow">MI PROGRESO · ESPACIO PERSONAL</p>
            <h1>¿Qué te ayudaría hoy?</h1>
            <p className="bl-progress-intro">
              Empieza por una sola cosa. Puedes elegir un paso, buscar apoyo o hacer una práctica breve.
              No necesitas completarlo todo ni tener tu brújula definida para comenzar.
            </p>
          </div>

          <div className="bl-progress-local" aria-label="Información de privacidad">
            <span className="bl-progress-local__icon"><ShieldCheck className="h-4 w-4" aria-hidden="true" /></span>
            <div>
              <strong>Tu espacio, a tu ritmo</strong>
              <p>Las marcas de progreso se guardan en este dispositivo. Las elecciones temporales de las prácticas no se guardan.</p>
            </div>
          </div>
        </header>

        <figure className="bl-progress-photo">
          <div className="bl-progress-photo__pair" role="group" aria-label="Paisajes que representan un camino personal y tranquilo">
            <img className="bl-progress-photo__image bl-progress-photo__image--primary" src="https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=760&q=84" alt="Camino sereno entre árboles y luz natural" loading="lazy" />
            <img className="bl-progress-photo__image bl-progress-photo__image--secondary" src="https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=620&q=82" alt="Montañas tranquilas junto a un lago al amanecer" loading="lazy" />
          </div>
          <figcaption><span>MI PROCESO · MI TIEMPO</span><strong>Cada pequeño avance merece un lugar.</strong></figcaption>
        </figure>

        <nav className="bl-progress-nav" aria-label="Accesos rápidos de Mi progreso">
          <a href="#paso-de-hoy"><Sunrise className="h-4 w-4" aria-hidden="true" /> Tu paso de hoy</a>
          <a href="#mapa-de-progreso"><Map className="h-4 w-4" aria-hidden="true" /> Mapa de pasos</a>
          <a href="#practicas-breves"><BookOpen className="h-4 w-4" aria-hidden="true" /> Prácticas</a>
          <a href="#centro-de-apoyo"><LifeBuoy className="h-4 w-4" aria-hidden="true" /> Centro de apoyo</a>
        </nav>

        {storageNotice && (
          <p role="status" className="bl-progress-storage-notice">
            No pudimos leer la brújula guardada en este dispositivo. Puedes continuar con el plan, las actividades y los recursos.
          </p>
        )}

        <section id="paso-de-hoy" className="bl-progress-today" aria-labelledby="bl-progress-today-title">
          <div className="bl-progress-section-heading">
            <div>
              <p className="bl-progress-section-kicker">01 <span>·</span> PUNTO DE PARTIDA</p>
              <h2 id="bl-progress-today-title">Tu paso de hoy</h2>
              <p>Escoge la sugerencia que encaje con tu día. Puedes adaptarla o probar otra alternativa.</p>
            </div>
            {hasCompass && (
              <Link to="/recuperacion/valores" className="bl-progress-compass-status">
                <Compass className="h-4 w-4" aria-hidden="true" /> Brújula disponible <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            )}
          </div>
          <TodayPlan />
        </section>

        <section id="mapa-de-progreso" className="bl-progress-next" aria-labelledby="bl-progress-next-title">
          <div className="bl-progress-section-heading">
            <div>
              <p className="bl-progress-section-kicker">02 <span>·</span> MAPA INTERACTIVO</p>
              <h2 id="bl-progress-next-title">Tu camino, paso a paso</h2>
              <p>Explora el diagrama, elige un punto y abre únicamente el recurso que hoy te resulte útil.</p>
            </div>
          </div>
          <ProgressPathMap />
        </section>

        <section id="practicas-breves" className="bl-progress-practices" aria-label="Prácticas psicoeducativas">
          <div className="bl-progress-section-heading">
            <div>
              <p className="bl-progress-section-kicker">03 <span>·</span> OPCIONAL · A TU RITMO</p>
              <h2>Prácticas breves</h2>
              <p>Una pausa guiada, un paso pequeño o una lectura. Puedes salir y volver cuando quieras.</p>
            </div>
            <BookOpen className="bl-progress-practices-mark h-6 w-6" aria-hidden="true" />
          </div>
          <MiProcesoExperience />
        </section>

        <section id="centro-de-apoyo" className="bl-progress-support" aria-labelledby="bl-progress-support-title">
          <div className="bl-progress-support__copy">
            <p className="bl-progress-section-kicker">04 <span>·</span> APOYO HUMANO Y RECURSOS</p>
            <h2 id="bl-progress-support-title">No tienes que hacerlo a solas.</h2>
            <p>Elige el tipo de apoyo que te resulte útil ahora. Puedes explorar recursos, buscar orientación para tu familia o contactar una línea de atención. No tienes que compartir más información de la que quieras.</p>
            <p className="bl-progress-support__note"><ShieldCheck className="h-4 w-4" aria-hidden="true" /> BLUMHELPS ofrece orientación psicoeducativa; no sustituye atención profesional ni atiende emergencias.</p>
          </div>
          <div className="bl-progress-support__actions">
            <Link to="/ayuda"><LifeBuoy className="h-4 w-4" aria-hidden="true" /><span><strong>Explorar recursos de apoyo</strong><small>Opciones y orientación disponible</small></span><ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
            <Link to="/familiares"><Users className="h-4 w-4" aria-hidden="true" /><span><strong>Orientación para familiares</strong><small>Herramientas para acompañar</small></span><ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
            <a href="tel:106"><Phone className="h-4 w-4" aria-hidden="true" /><span><strong>Línea 106 · Orientación</strong><small>Apoyo en salud mental</small></span><ArrowRight className="h-4 w-4" aria-hidden="true" /></a>
            <a href="tel:123"><Phone className="h-4 w-4" aria-hidden="true" /><span><strong>123 · Emergencias</strong><small>Si existe peligro inmediato</small></span><ArrowRight className="h-4 w-4" aria-hidden="true" /></a>
          </div>
        </section>

        <details className="bl-progress-evidence">
          <summary>Fuentes y límites del contenido</summary>
          <p>
            Este espacio usa un enfoque de recuperación centrado en la persona: existen diferentes caminos,
            el apoyo social importa y los retrocesos no definen a nadie. Estas referencias orientan el contenido,
            pero no constituyen una validación clínica de la aplicación.
          </p>
          <div className="bl-progress-evidence__links">
            <a href="https://www.samhsa.gov/substance-use/recovery/about" target="_blank" rel="noreferrer">SAMHSA · Acerca de la recuperación</a>
            <a href="https://www.who.int/publications/i/item/9789240084278" target="_blank" rel="noreferrer">OMS · Guía mhGAP</a>
          </div>
        </details>

        <p className="bl-progress-disclaimer">
          Acompañamiento psicoeducativo. No sustituye atención profesional ni ofrece diagnóstico o tratamiento.
          Si hay peligro inmediato, llama al 123 o acude a urgencias.
        </p>
      </div>
    </main>
  );
}

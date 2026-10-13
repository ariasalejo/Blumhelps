import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Search, X, Briefcase, FileText, ChevronRight, ArrowLeft } from "lucide-react";
import { EMPLEO, HV_GUIDE, type Resource } from "../data/demo";
import {
  PageHeader,
  BackLink,
  FilterChip,
  LoadingGrid,
  ErrorState,
  EmptyState,
  useSimulatedLoad,
  DemoTag,
} from "../components/ui";
import { ResourceCard, ResourceDetail } from "../components/cards";

const TIPOS = Array.from(new Set(EMPLEO.map((r) => r.type)));

export function EmpleoList() {
  const [q, setQ] = useState("");
  const [tipo, setTipo] = useState<string | null>(null);
  const [city, setCity] = useState<string | null>(null);
  const { state, retry } = useSimulatedLoad("ok");

  const results = useMemo(
    () =>
      EMPLEO.filter((r) => {
        if (tipo && r.type !== tipo) return false;
        if (city && r.city !== city) return false;
        if (q && !(r.title + " " + r.org + " " + r.summary).toLowerCase().includes(q.toLowerCase())) return false;
        return true;
      }),
    [q, tipo, city]
  );

  const hasFilters = q || tipo || city;
  const clear = () => { setQ(""); setTipo(null); setCity(null); };

  return (
    <div className="pb-6">
      <PageHeader
        eyebrow="Empleo"
        title="Trabajar también es reconstruir"
        subtitle="Oportunidades con condiciones visibles y una guía de hoja de vida que no te pide explicar tu historia."
      />

      <Link to="/empleo/hoja-de-vida" className="card-bh mb-5 flex items-center gap-4 hover:shadow-lift transition-shadow bg-sage/50 border-forest/20">
        <span className="grid place-items-center w-12 h-12 rounded-2xl bg-forest text-white shrink-0"><FileText size={22} /></span>
        <span className="flex-1">
          <span className="block font-bold text-ink">Guía: hoja de vida sin dar explicaciones</span>
          <span className="block text-sm text-muted mt-0.5">Cómo mostrar lo que sabes hacer, aunque tus últimos años estén difíciles.</span>
        </span>
        <ChevronRight size={20} className="text-forest" />
      </Link>

      <div className="card-bh mb-5">
        <label htmlFor="eq" className="sr-only">Buscar empleo</label>
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
          <input id="eq" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Busca por oficio o empresa…" className="input-bh pl-11" />
        </div>
        <div className="mt-4 space-y-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-muted mb-1.5">Tipo</p>
            <div className="flex flex-wrap gap-2">
              {TIPOS.map((t) => (
                <FilterChip key={t} active={tipo === t} onClick={() => setTipo(tipo === t ? null : t)}>
                  <Briefcase size={14} /> {t}
                </FilterChip>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-muted mb-1.5">Ciudad</p>
            <div className="flex flex-wrap gap-2">
              {["Bogotá", "Medellín", "Cali", "Barranquilla"].map((c) => (
                <FilterChip key={c} active={city === c} onClick={() => setCity(city === c ? null : c)}>{c}</FilterChip>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm font-semibold text-forest" aria-live="polite">
            {state === "ok" ? `${results.length} ${results.length === 1 ? "oportunidad" : "oportunidades"}` : "Buscando…"}
          </p>
          {hasFilters && <button onClick={clear} className="btn-ghost text-sm"><X size={15} /> Limpiar filtros</button>}
        </div>
      </div>

      {state === "loading" && <LoadingGrid count={4} />}
      {state === "error" && <ErrorState onRetry={retry} />}
      {state === "ok" && results.length === 0 && (
        <EmptyState
          icon="search"
          title="Hoy no hay vacantes con esos filtros"
          body="El directorio laboral se construye con empleadores aliados. Guarda lo que te sirva y vuelve en unos días."
          action={<button className="btn-secondary" onClick={clear}>Ver todas</button>}
        />
      )}
      {state === "ok" && results.length > 0 && (
        <div className="grid sm:grid-cols-2 gap-4">
          {results.map((r) => (
            <ResourceCard key={r.id} r={r} to={`/empleo/vacante/${r.id}`} />
          ))}
        </div>
      )}

      <p className="mt-6 text-xs text-muted leading-relaxed">
        Todas las vacantes son ficticias <DemoTag />. BlumHelps no tiene alianzas reales con
        empleadores y nunca condicionará la ayuda a pruebas de abstinencia ni pagos. Ninguna oferta
        debería exigirle a nadie explicar su historia personal para postularse.
      </p>
    </div>
  );
}

export function EmpleoDetalle() {
  const { id } = useParams();
  const r = EMPLEO.find((x) => x.id === id);
  const { state, retry } = useSimulatedLoad("ok");
  if (!r)
    return (
      <div className="pb-6">
        <BackLink to="/empleo" label="Volver a empleo" />
        <div className="mt-4">
          <EmptyState title="Vacante no encontrada" body="Puede haber cerrado." action={<Link className="btn-primary" to="/empleo">Ver oportunidades</Link>} />
        </div>
      </div>
    );
  return (
    <div className="pb-6">
      <BackLink to="/empleo" label="Volver a empleo" />
      <div className="mt-4">
        {state === "loading" && <LoadingGrid count={1} />}
        {state === "error" && <ErrorState onRetry={retry} />}
        {state === "ok" && <ResourceDetail r={r} />}
      </div>
    </div>
  );
}

/* ------------------ GUÍA DE HOJA DE VIDA (flujo 5 pasos) ------------------ */
export function HojaDeVida() {
  const [step, setStep] = useState(0);
  const done = step >= HV_GUIDE.length;
  const card = HV_GUIDE[Math.min(step, HV_GUIDE.length - 1)];

  return (
    <div className="pb-6 max-w-2xl">
      <BackLink to="/empleo" label="Volver a empleo" />
      <div className="mt-4">
        <PageHeader eyebrow="Guía práctica" title="Hoja de vida sin dar explicaciones" />

        {/* Progreso */}
        <div className="flex items-center gap-2 mb-5" aria-label={`Paso ${Math.min(step + 1, HV_GUIDE.length)} de ${HV_GUIDE.length}`}>
          {HV_GUIDE.map((_, i) => (
            <span key={i} className={"h-1.5 flex-1 rounded-full transition-colors " + (i <= step ? "bg-forest" : "bg-[#E4DCCB]")} />
          ))}
        </div>

        {!done ? (
          <div className="card-bh">
            <p className="text-xs font-bold uppercase tracking-widest text-emerald">Paso {step + 1} de {HV_GUIDE.length} <DemoTag /></p>
            <h2 className="mt-2 text-xl font-extrabold text-ink leading-snug">{card.title}</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-ink/85">{card.body}</p>
            <div className="mt-6 flex flex-col-reverse sm:flex-row gap-2.5">
              <button className="btn-ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
                <ArrowLeft size={16} /> Atrás
              </button>
              <button className="btn-primary flex-1" onClick={() => setStep((s) => s + 1)}>
                {step === HV_GUIDE.length - 1 ? "Terminar guía" : "Siguiente"} <ChevronRight size={16} />
              </button>
            </div>
          </div>
        ) : (
          <div className="card-bh bg-sage/50 text-center py-10">
            <p className="text-xl font-extrabold text-ink">Ya tienes el esqueleto. Lo demás se aprende postulando.</p>
            <p className="mt-2 text-sm text-muted max-w-md mx-auto">
              Si quieres, guarda esta guía en Guardados y vuelve antes de cada aplicación. Nadie más la ve.
            </p>
            <div className="mt-5 flex flex-col sm:flex-row gap-2.5 justify-center">
              <button className="btn-secondary" onClick={() => setStep(0)}>Repasar la guía</button>
              <Link className="btn-primary" to="/empleo">Ver oportunidades</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

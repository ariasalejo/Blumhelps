import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Search, X, Phone, RotateCcw } from "lucide-react";
import { AYUDA, CIUDADES, fmtDate, type Resource } from "../data/demo";
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

const TIPOS = Array.from(new Set(AYUDA.map((r) => r.type)));
const MODALIDADES = ["presencial", "telefónica", "virtual"] as const;

/* ============================ LISTADO ============================ */
export function AyudaList() {
  const [q, setQ] = useState("");
  const [city, setCity] = useState<string | null>(null);
  const [tipo, setTipo] = useState<string | null>(null);
  const [modo, setModo] = useState<string | null>(null);
  const { state, retry } = useSimulatedLoad("ok");

  const results = useMemo(
    () =>
      AYUDA.filter((r) => {
        if (city && r.city !== city) return false;
        if (tipo && r.type !== tipo) return false;
        if (modo && !r.modality.includes(modo as Resource["modality"][number])) return false;
        if (q) {
          const hay = (r.title + " " + r.org + " " + r.summary + " " + r.coverage).toLowerCase();
          if (!hay.includes(q.toLowerCase())) return false;
        }
        return true;
      }),
    [q, city, tipo, modo]
  );

  const hasFilters = q || city || tipo || modo;
  const clear = () => {
    setQ("");
    setCity(null);
    setTipo(null);
    setModo(null);
  };

  return (
    <div className="pb-6">
      <PageHeader
        eyebrow="Directorio"
        title="Encontrar ayuda"
        subtitle="Apoyo profesional y comunitario con fuente, cobertura y fecha de verificación visibles. Nada aquí te obliga a nada: mira, guarda y decide."
      />

      {/* Emergencia primero */}
      <div className="mb-6 rounded-xl2 border border-coral/40 bg-coral/10 p-4 flex flex-col sm:flex-row sm:items-center gap-3">
        <Phone size={20} className="text-coral shrink-0" />
        <p className="text-sm text-ink flex-1 leading-relaxed">
          ¿Peligro inmediato? Llama ya a la <b>Línea 123</b>. Esta app no atiende emergencias.
        </p>
        <Link to="/ayuda/emergencia" className="btn bg-coral text-white min-h-[44px] rounded-full px-5 font-semibold whitespace-nowrap hover:brightness-105">
          Guía de emergencia
        </Link>
      </div>

      {/* Búsqueda + filtros */}
      <div className="card-bh mb-5">
        <label htmlFor="q" className="sr-only">Buscar ayuda</label>
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
          <input
            id="q"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Busca por tema, ciudad o entidad…"
            className="input-bh pl-11"
          />
        </div>

        <div className="mt-4 space-y-3">
          <FilterRow label="Ciudad">
            {CIUDADES.map((c) => (
              <FilterChip key={c} active={city === c} onClick={() => setCity(city === c ? null : c)}>
                {c}
              </FilterChip>
            ))}
          </FilterRow>
          <FilterRow label="Tipo de apoyo">
            {TIPOS.map((t) => (
              <FilterChip key={t} active={tipo === t} onClick={() => setTipo(tipo === t ? null : t)}>
                {t}
              </FilterChip>
            ))}
          </FilterRow>
          <FilterRow label="Modalidad">
            {MODALIDADES.map((m) => (
              <FilterChip key={m} active={modo === m} onClick={() => setModo(modo === m ? null : m)}>
                {m}
              </FilterChip>
            ))}
          </FilterRow>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-forest" aria-live="polite">
            {state === "ok" ? `${results.length} ${results.length === 1 ? "recurso" : "recursos"} encontrados` : "Buscando…"}
          </p>
          {hasFilters && (
            <button onClick={clear} className="btn-ghost text-sm">
              <X size={15} /> Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {/* Estados */}
      {state === "loading" && <LoadingGrid count={4} />}
      {state === "error" && <ErrorState onRetry={retry} />}
      {state === "ok" && results.length === 0 && (
        <EmptyState
          icon="search"
          title="Nada coincide con esa búsqueda"
          body="Prueba otra palabra o quita algún filtro. Si buscas algo que debería estar aquí, dilo: todavía estamos construyendo el directorio."
          action={
            <button className="btn-secondary" onClick={clear}>
              <RotateCcw size={16} /> Empezar de nuevo
            </button>
          }
        />
      )}
      {state === "ok" && results.length > 0 && (
        <div className="grid sm:grid-cols-2 gap-4">
          {results.map((r) => (
            <ResourceCard key={r.id} r={r} to={`/ayuda/recurso/${r.id}`} />
          ))}
        </div>
      )}

      <p className="mt-6 text-xs text-muted">
        Todos los listados son ficticios <DemoTag /> salvo las líneas oficiales de emergencia, que
        BlumHelps no opera. Verificado por última vez el {fmtDate("2026-10-01")} en esta demo.
      </p>
    </div>
  );
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wide text-muted mb-1.5">{label}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

/* ============================ FICHA ============================ */
export function AyudaDetalle() {
  const { id } = useParams();
  const r = AYUDA.find((x) => x.id === id);
  const { state, retry } = useSimulatedLoad("ok");

  if (!r) {
    return (
      <div className="pb-6">
        <BackLink to="/ayuda" label="Volver al directorio" />
        <div className="mt-4">
          <EmptyState
            title="No encontramos ese recurso"
            body="Puede haber cambiado de dirección. Vuelve al directorio y búscalo por nombre o ciudad."
            action={<Link className="btn-primary" to="/ayuda">Ir al directorio</Link>}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="pb-6">
      <BackLink to="/ayuda" label="Volver al directorio" />
      <div className="mt-4">
        {state === "loading" && <LoadingGrid count={1} />}
        {state === "error" && <ErrorState onRetry={retry} />}
        {state === "ok" && <ResourceDetail r={r} />}
      </div>
    </div>
  );
}

/* ========================= EMERGENCIA ========================== */
export function Emergencia() {
  return (
    <div className="pb-6 max-w-2xl">
      <BackLink to="/ayuda" label="Volver al directorio" />
      <div className="mt-4">
        <PageHeader
          eyebrow="Importante"
          title="Si hay una emergencia"
        />
        <div className="card-bh border-coral/40">
          <p className="text-lg font-extrabold text-ink">Llama a la Línea 123</p>
          <p className="mt-2 text-sm leading-relaxed text-ink/85">
            Ante peligro inmediato: sobredosis, pérdida de conciencia, dificultad para respirar,
            convulsiones o riesgo de daño propio o de otras personas. <b>El 123 es la línea única
            de emergencias en Colombia</b> y conecta con ambulancia, bomberos y policía.
          </p>
          <a href="tel:123" className="btn mt-4 bg-coral text-white min-h-[48px] px-6 rounded-full font-bold inline-flex items-center gap-2 hover:brightness-105 w-full sm:w-auto">
            <Phone size={18} /> Llamar al 123
          </a>
        </div>
        <ul className="mt-5 space-y-3 text-sm text-ink/90">
          <li className="card-bh !p-4"><b>No dejes a la persona sola</b> si está consciente. Habla calmado, sin reclamos. Esto no es un momento para dar lecciones.</li>
          <li className="card-bh !p-4"><b>Si puede, busca a alguien cerca</b> que ayude mientras llega la ambulancia. Da la dirección exacta y qué ocurrió, tal cual.</li>
          <li className="card-bh !p-4"><b>Después de la emergencia</b>, vuelve aquí: en el directorio hay apoyo para los días siguientes. Nadie te va a señalar.</li>
        </ul>
        <p className="mt-5 text-xs text-muted leading-relaxed">
          BlumHelps no diagnostica ni reemplaza profesionales de salud. Esta pantalla es una guía
          general basada en recomendaciones públicas de emergencia en Colombia.
        </p>
      </div>
    </div>
  );
}

import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Search, X, GraduationCap, Clock, BookOpen, FileText } from "lucide-react";
import { FORMACION, CIUDADES, type Resource } from "../data/demo";
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

const AREAS = Array.from(new Set(FORMACION.map((r) => r.area!)));
const NIVELES = ["principiante", "intermedio", "todos"] as const;

export function FormacionList() {
  const [q, setQ] = useState("");
  const [area, setArea] = useState<string | null>(null);
  const [city, setCity] = useState<string | null>(null);
  const [nivel, setNivel] = useState<string | null>(null);
  const [corta, setCorta] = useState(false);
  const { state, retry } = useSimulatedLoad("ok");

  const results = useMemo(
    () =>
      FORMACION.filter((r) => {
        if (area && r.area !== area) return false;
        if (city && r.city !== city && r.coverage.toLowerCase().includes("virtual") === false) return false;
        if (nivel && r.level !== nivel) return false;
        if (corta) {
          const semanas = parseInt(r.duration ?? "99", 10);
          if (semanas > 4) return false;
        }
        if (q) {
          const hay = (r.title + " " + r.org + " " + r.summary).toLowerCase();
          if (!hay.includes(q.toLowerCase())) return false;
        }
        return true;
      }),
    [q, area, city, nivel, corta]
  );

  const hasFilters = q || area || city || nivel || corta;
  const clear = () => { setQ(""); setArea(null); setCity(null); setNivel(null); setCorta(false); };

  return (
    <div className="pb-6">
      <PageHeader
        eyebrow="Formación"
        title="Volver a estudiar se puede por partes"
        subtitle="Cursos y oficios con fuente oficial visible. Ninguno exige que tengas todo resuelto para empezar."
      />

      <div className="card-bh mb-5">
        <label htmlFor="fq" className="sr-only">Buscar cursos</label>
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
          <input id="fq" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Busca un oficio o tema…" className="input-bh pl-11" />
        </div>
        <div className="mt-4 space-y-3">
          <Row label="Área">
            {AREAS.map((a) => (
              <FilterChip key={a} active={area === a} onClick={() => setArea(area === a ? null : a)}>
                <GraduationCap size={14} /> {a}
              </FilterChip>
            ))}
          </Row>
          <Row label="Ciudad">
            {["Bogotá", "Medellín", "Cali", "Barranquilla", "Virtual"].map((c) => (
              <FilterChip key={c} active={city === c} onClick={() => setCity(city === c ? null : c)}>{c}</FilterChip>
            ))}
          </Row>
          <Row label="Nivel">
            {NIVELES.map((n) => (
              <FilterChip key={n} active={nivel === n} onClick={() => setNivel(nivel === n ? null : n)}>
                <BookOpen size={14} /> {n}
              </FilterChip>
            ))}
            <FilterChip active={corta} onClick={() => setCorta(!corta)}>
              <Clock size={14} /> Cortos (≤ 4 semanas)
            </FilterChip>
          </Row>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm font-semibold text-forest" aria-live="polite">
            {state === "ok" ? `${results.length} ${results.length === 1 ? "curso" : "cursos"}` : "Buscando…"}
          </p>
          {hasFilters && <button onClick={clear} className="btn-ghost text-sm"><X size={15} /> Limpiar filtros</button>}
        </div>
      </div>

      {state === "loading" && <LoadingGrid count={4} />}
      {state === "error" && <ErrorState onRetry={retry} />}
      {state === "ok" && results.length === 0 && (
        <EmptyState
          icon="search"
          title="Sin cursos con esos filtros"
          body="Amplía la búsqueda: muchos cursos virtuales sirven desde cualquier ciudad."
          action={<button className="btn-secondary" onClick={clear}>Ver todos</button>}
        />
      )}
      {state === "ok" && results.length > 0 && (
        <div className="grid sm:grid-cols-2 gap-4">
          {results.map((r) => (
            <ResourceCard key={r.id} r={r} to={`/formacion/curso/${r.id}`} />
          ))}
        </div>
      )}

      <p className="mt-6 text-xs text-muted">Catálogo ficticio <DemoTag />. En producción cada curso mostrará institución real, registro de cámara de comercio/SENA y fecha de verificación.</p>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wide text-muted mb-1.5">{label}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

export function FormacionDetalle() {
  const { id } = useParams();
  const r = FORMACION.find((x) => x.id === id);
  const { state, retry } = useSimulatedLoad("ok");
  if (!r)
    return (
      <div className="pb-6">
        <BackLink to="/formacion" label="Volver a formación" />
        <div className="mt-4">
          <EmptyState title="Curso no encontrado" body="Puede haber salido del catálogo." action={<Link className="btn-primary" to="/formacion">Ver cursos</Link>} />
        </div>
      </div>
    );
  return (
    <div className="pb-6">
      <BackLink to="/formacion" label="Volver a formación" />
      <div className="mt-4">
        {state === "loading" && <LoadingGrid count={1} />}
        {state === "error" && <ErrorState onRetry={retry} />}
        {state === "ok" && <ResourceDetail r={r} />}
      </div>
    </div>
  );
}

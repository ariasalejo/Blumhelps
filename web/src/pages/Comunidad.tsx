import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Search, X, Users, Heart, CalendarCheck } from "lucide-react";
import { COMUNIDAD, FAMILIAS, REGLAS_COMUNIDAD } from "../data/demo";
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
import { useApp } from "../state/app";

const TIPOS = Array.from(new Set(COMUNIDAD.map((r) => r.type)));

export function ComunidadList() {
  const [q, setQ] = useState("");
  const [tipo, setTipo] = useState<string | null>(null);
  const [city, setCity] = useState<string | null>(null);
  const { state, retry } = useSimulatedLoad("ok");

  const results = useMemo(
    () =>
      COMUNIDAD.filter((r) => {
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
        eyebrow="Comunidad"
        title="Gente, no audiencias"
        subtitle="Actividades saludables, voluntariado y grupos. Antes de entrar, lee las reglas: son pocas y protegen a todos."
      />

      {/* Reglas visibles */}
      <section className="card-bh mb-5 bg-sage/50 border-forest/20">
        <h2 className="font-bold text-ink flex items-center gap-2"><Users size={18} className="text-forest" /> Reglas de participación</h2>
        <ul className="mt-3 space-y-2">
          {REGLAS_COMUNIDAD.map((r, i) => (
            <li key={i} className="flex gap-2.5 text-sm text-ink/90">
              <span className="grid place-items-center w-5 h-5 rounded-full bg-forest text-white text-[11px] font-bold shrink-0 mt-0.5">{i + 1}</span>
              {r}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-muted">Al unirte a un grupo confirmas estas reglas. Puedes salir cuando quieras y volver cuando quieras.</p>
      </section>

      <div className="card-bh mb-5">
        <label htmlFor="cq" className="sr-only">Buscar actividades</label>
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
          <input id="cq" value={q} onChange={(e) => setQ(e.target.value)} placeholder="¿Qué te gustaría hacer?" className="input-bh pl-11" />
        </div>
        <div className="mt-4 space-y-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-muted mb-1.5">Categoría</p>
            <div className="flex flex-wrap gap-2">
              {TIPOS.map((t) => (
                <FilterChip key={t} active={tipo === t} onClick={() => setTipo(tipo === t ? null : t)}>
                  <Heart size={14} /> {t}
                </FilterChip>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-muted mb-1.5">Ciudad</p>
            <div className="flex flex-wrap gap-2">
              {["Bogotá", "Medellín", "Cali", "Barranquilla", "Virtual"].map((c) => (
                <FilterChip key={c} active={city === c} onClick={() => setCity(city === c ? null : c)}>{c}</FilterChip>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm font-semibold text-forest" aria-live="polite">
            {state === "ok" ? `${results.length} ${results.length === 1 ? "actividad o grupo" : "actividades o grupos"}` : "Buscando…"}
          </p>
          {hasFilters && <button onClick={clear} className="btn-ghost text-sm"><X size={15} /> Limpiar filtros</button>}
        </div>
      </div>

      {state === "loading" && <LoadingGrid count={4} />}
      {state === "error" && <ErrorState onRetry={retry} />}
      {state === "ok" && results.length === 0 && (
        <EmptyState
          icon="search"
          title="Nada por aquí con esos filtros"
          body="Los grupos pequeños cambian de horario seguido. Prueba quitar la ciudad o guarda esta búsqueda para después."
          action={<button className="btn-secondary" onClick={clear}>Ver todo</button>}
        />
      )}
      {state === "ok" && results.length > 0 && (
        <div className="grid sm:grid-cols-2 gap-4">
          {results.map((r) => (
            <ResourceCard key={r.id} r={r} to={`/comunidad/grupo/${r.id}`} />
          ))}
        </div>
      )}

      <p className="mt-6 text-xs text-muted">Grupos ficticios <DemoTag />. Ningún grupo real aparecerá sin moderación presentada y reglas verificadas.</p>
    </div>
  );
}

export function ComunidadDetalle() {
  const { id } = useParams();
  const r = COMUNIDAD.find((x) => x.id === id);
  const { state, retry } = useSimulatedLoad("ok");
  const { toast } = useApp();
  const [joined, setJoined] = useState(false);

  if (!r)
    return (
      <div className="pb-6">
        <BackLink to="/comunidad" label="Volver a comunidad" />
        <div className="mt-4">
          <EmptyState title="Grupo no encontrado" body="Puede haber cerrado el cupo o cambiado de sede." action={<Link className="btn-primary" to="/comunidad">Ver grupos</Link>} />
        </div>
      </div>
    );

  return (
    <div className="pb-6">
      <BackLink to="/comunidad" label="Volver a comunidad" />
      <div className="mt-4 space-y-5">
        <ResourceDetail r={r} />

        <div className="card-bh">
          <h3 className="font-bold text-ink mb-2">Antes de entrar</h3>
          <ul className="space-y-1.5 text-sm text-ink/85 list-disc pl-5">
            <li>Las reuniones las lidera gente voluntaria <DemoTag />, no profesionales clínicos.</li>
            <li>Puedes ir una sola vez y no volver. Eso también es participar.</li>
            <li>Si compartes algo personal, queda en el grupo.</li>
          </ul>
          <button
            className={joined ? "btn-secondary mt-4" : "btn-primary mt-4"}
            onClick={() => {
              if (!joined) {
                setJoined(true);
                toast("Aviso enviado al grupo (demo). Te escribirán el día anterior.");
              } else {
                setJoined(false);
                toast("Saliste del grupo. Puedes volver cuando quieras.", "info");
              }
            }}
          >
            <CalendarCheck size={17} />
            {joined ? "Voy este sábado — avisar que salgo" : "Avisar que quiero ir"}
          </button>
          {!joined && (
            <p className="mt-2 text-xs text-muted">En la versión real, esto notifica al coordinador del grupo. Nada se publica con tu nombre.</p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ FAMILIAS ------------------------------ */
export function FamiliasList() {
  const { state, retry } = useSimulatedLoad("ok");
  return (
    <div className="pb-6">
      <PageHeader
        eyebrow="Familias"
        title="Acompañar sin culpar ni vigilar"
        subtitle="Para madres, padres, parejas e hijos adultos. Cuidar a alguien en esta situación agota: aquí también pensamos en ti."
      />

      <div className="card-bh mb-5 bg-sage/50 border-forest/20 text-sm leading-relaxed text-ink/90">
        <b>Una idea antes de leer:</b> la recuperación casi nunca es una línea recta. No necesitas
        tener la razón cada día; necesitas seguir ahí el día que decida intentarlo otra vez. Y
        nadie acompaña bien desde el colapso propio.
      </div>

      {state === "loading" && <LoadingGrid count={4} />}
      {state === "error" && <ErrorState onRetry={retry} />}
      {state === "ok" && (
        <div className="grid sm:grid-cols-2 gap-4">
          {FAMILIAS.map((r) => (
            <ResourceCard key={r.id} r={r} to={`/familias/guia/${r.id}`} />
          ))}
        </div>
      )}

      <p className="mt-6 text-xs text-muted">Contenidos de ejemplo <DemoTag />, revisados en la vida real por trabajadores sociales antes de publicarse.</p>
    </div>
  );
}

export function FamiliasDetalle() {
  const { id } = useParams();
  const r = FAMILIAS.find((x) => x.id === id);
  const { state, retry } = useSimulatedLoad("ok");
  if (!r)
    return (
      <div className="pb-6">
        <BackLink to="/familias" label="Volver a familias" />
        <div className="mt-4">
          <EmptyState title="Guía no encontrada" body="Vuelve a la lista para ver las disponibles." action={<Link className="btn-primary" to="/familias">Ver guías</Link>} />
        </div>
      </div>
    );
  return (
    <div className="pb-6">
      <BackLink to="/familias" label="Volver a familias" />
      <div className="mt-4">
        {state === "loading" && <LoadingGrid count={1} />}
        {state === "error" && <ErrorState onRetry={retry} />}
        {state === "ok" && <ResourceDetail r={r} />}
      </div>
    </div>
  );
}

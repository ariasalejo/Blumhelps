import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BookmarkCheck, Trash2, Download, RotateCcw } from "lucide-react";
import { AYUDA, FORMACION, EMPLEO, COMUNIDAD, FAMILIAS, type Resource } from "../data/demo";
import { useApp } from "../state/app";
import {
  PageHeader,
  EmptyState,
  LoadingGrid,
  ErrorState,
  useSimulatedLoad,
  DemoTag,
} from "../components/ui";
import { ResourceCard } from "../components/cards";

const ALL: Resource[] = [...AYUDA, ...FORMACION, ...EMPLEO, ...COMUNIDAD, ...FAMILIAS];

const SECCIONES = [
  { id: "todos", label: "Todos" },
  { id: "ayuda", label: "Ayuda" },
  { id: "formacion", label: "Formación" },
  { id: "empleo", label: "Empleo" },
  { id: "comunidad", label: "Comunidad" },
  { id: "familias", label: "Familias" },
] as const;

const ROUTE_FOR: Record<Resource["kind"], (id: string) => string> = {
  ayuda: (id) => `/ayuda/recurso/${id}`,
  formacion: (id) => `/formacion/curso/${id}`,
  empleo: (id) => `/empleo/vacante/${id}`,
  comunidad: (id) => `/comunidad/grupo/${id}`,
  familias: (id) => `/familias/guia/${id}`,
};

export default function Guardados() {
  const { saved, toggleSave, toast } = useApp();
  const [sec, setSec] = useState<string>("todos");
  const { state, retry } = useSimulatedLoad("ok");

  const items = useMemo(
    () => ALL.filter((r) => saved.includes(r.id)).filter((r) => sec === "todos" || r.kind === sec),
    [saved, sec]
  );

  return (
    <div className="pb-6">
      <PageHeader
        eyebrow="Tu colección"
        title="Guardados"
        subtitle="Lo que apartaste para después. Nada aquí vence ni caduca: la lista te espera cuando vuelvas."
      />

      {/* Filtros por sección */}
      {saved.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-5">
          {SECCIONES.map((s) => (
            <button
              key={s.id}
              onClick={() => setSec(s.id)}
              aria-pressed={sec === s.id}
              className={"chip " + (sec === s.id ? "bg-forest text-white border-forest" : "bg-white text-ink/80 border-[#DDD5C2] hover:bg-sage")}
            >
              {s.label}
              {s.id !== "todos" && (
                <span className="text-xs opacity-75">
                  ({ALL.filter((r) => saved.includes(r.id) && r.kind === s.id).length})
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {state === "loading" && <LoadingGrid count={3} />}
      {state === "error" && <ErrorState onRetry={retry} />}

      {state === "ok" && saved.length === 0 && (
        <EmptyState
          title="Aún no guardas nada"
          body="Cuando veas un recurso que te sirva, toca el marcador y aparecerá aquí. Sin prisa."
          action={
            <div className="flex gap-2.5 flex-wrap justify-center">
              <Link className="btn-primary" to="/ayuda">Ver directorio de ayuda</Link>
              <Link className="btn-secondary" to="/comunidad">Explorar comunidad</Link>
            </div>
          }
        />
      )}

      {state === "ok" && saved.length > 0 && items.length === 0 && (
        <EmptyState
          icon="search"
          title="Nada guardado en esta sección"
          body="Prueba otra sección o quita el filtro."
          action={<button className="btn-secondary" onClick={() => setSec("todos")}>Ver todos</button>}
        />
      )}

      {state === "ok" && items.length > 0 && (
        <>
          <div className="grid sm:grid-cols-2 gap-4">
            {items.map((r) => (
              <ResourceCard key={r.id} r={r} to={ROUTE_FOR[r.kind](r.id)} />
            ))}
          </div>
          <div className="mt-6 card-bh flex flex-col sm:flex-row sm:items-center gap-3">
            <p className="text-sm text-muted flex-1">
              {saved.length} {saved.length === 1 ? "elemento guardado" : "elementos guardados"} solo en este dispositivo <DemoTag />
            </p>
            <button
              className="btn-ghost"
              onClick={() => {
                items.forEach((r) => toggleSave(r.id));
                toast("Sección vaciada. Puedes volver a guardar cuando quieras.", "info");
              }}
            >
              <Trash2 size={16} /> Quitar los de esta sección
            </button>
          </div>
        </>
      )}

      <p className="mt-6 text-xs text-muted inline-flex items-center gap-1.5">
        <BookmarkCheck size={14} /> Tus guardados no se suben a ningún servidor en esta demo. En{" "}
        <Link to="/ajustes" className="underline font-semibold">Ajustes</Link> puedes exportarlos o borrarlos.
      </p>
    </div>
  );
}

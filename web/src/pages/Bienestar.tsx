import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Pause,
  Play,
  CheckCircle2,
  Trash2,
  BellRing,
  Sparkles,
  ChevronRight,
  ArrowLeft,
  Sprout,
} from "lucide-react";
import { GOAL_TEMPLATES } from "../data/demo";
import { useApp, type UserGoal } from "../state/app";
import {
  PageHeader,
  EmptyState,
  TierBadge,
  AdvancedModal,
  DemoTag,
} from "../components/ui";

/* Flujo corto de creación: plantillas → confirmar/ajustar → listo (3 pasos) */
export default function Bienestar() {
  const { goals, addGoal, setGoalStatus, deleteGoal, settings, setSettings } = useApp();
  const [wizardStep, setWizardStep] = useState<0 | 1 | 2>(0);
  const [picked, setPicked] = useState<(typeof GOAL_TEMPLATES)[number] | null>(null);
  const [title, setTitle] = useState("");
  const [micro, setMicro] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const activas = goals.filter((g) => g.status === "activa");
  const pausadas = goals.filter((g) => g.status === "pausada");
  const hechas = goals.filter((g) => g.status === "completada");

  const startPick = (t: (typeof GOAL_TEMPLATES)[number]) => {
    if (t.advancedOnly) {
      setShowAdvanced(true);
      return;
    }
    setPicked(t);
    setTitle(t.title);
    setMicro(t.micro);
    setWizardStep(1);
  };

  const confirm = () => {
    if (!title.trim()) return;
    addGoal({
      templateId: picked?.id,
      title: title.trim(),
      micro: micro.trim() || "Cuando puedas, haz la versión más pequeña.",
      hint: picked?.hint,
      advancedOnly: false,
    });
    setWizardStep(2);
  };

  const resetWizard = () => {
    setWizardStep(0);
    setPicked(null);
    setTitle("");
    setMicro("");
  };

  return (
    <div className="pb-6">
      <PageHeader
        eyebrow="A tu ritmo"
        title="Bienestar"
        subtitle="Metas pequeñas que puedes cambiar, pausar o borrar cuando quieras. Pausar no es fallar: los días difíciles también cuentan."
      />

      {/* Comparativa Free vs Avanzado — clara en 5 segundos, sin presión */}
      <section id="plan" className="grid md:grid-cols-2 gap-4 mb-8">
        <div className="card-bh border-forest/25 bg-sage/40">
          <TierBadge tier="free" />
          <h2 className="mt-2 font-extrabold text-lg text-ink">Plan gratis</h2>
          <ul className="mt-3 space-y-2 text-sm text-ink/85">
            <li className="flex gap-2"><CheckCircle2 size={17} className="text-emerald shrink-0" /> Metas pequeñas ilimitadas, con pausa sin culpa</li>
            <li className="flex gap-2"><CheckCircle2 size={17} className="text-emerald shrink-0" /> Recordatorios opcionales (los desactivas cuando quieras)</li>
            <li className="flex gap-2"><CheckCircle2 size={17} className="text-emerald shrink-0" /> Guardados, directorio, comunidad, formación y empleo</li>
          </ul>
        </div>
        <div className="card-bh border-amber/40">
          <TierBadge tier="advanced" />
          <h2 className="mt-2 font-extrabold text-lg text-ink">BlumHelps Avanzado</h2>
          <ul className="mt-3 space-y-2 text-sm text-ink/85">
            <li className="flex gap-2"><Sparkles size={17} className="text-amber shrink-0" /> Diario reflexivo encriptado en el dispositivo</li>
            <li className="flex gap-2"><Sparkles size={17} className="text-amber shrink-0" /> Analítica de sueño y ánimo, sin juicio ni rachas</li>
            <li className="flex gap-2"><Sparkles size={17} className="text-amber shrink-0" /> Respaldo cifrado y sincronización</li>
          </ul>
          <button onClick={() => setShowAdvanced(true)} className="btn-secondary mt-4">
            ¿Qué incluye? <ChevronRight size={16} />
          </button>
        </div>
      </section>

      {/* Wizard de nueva meta (flujo corto con progreso y atrás) */}
      <section className="mb-8">
        <AnimatePresence mode="wait">
          {wizardStep === 0 && (
            <motion.div key="s0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h2 className="font-bold text-lg text-ink mb-1">¿Empezamos algo pequeño?</h2>
              <p className="text-sm text-muted mb-4">Elige una idea o crea la tuya al final. Puedes cambiarla cuando quieras.</p>
              <div className="grid sm:grid-cols-2 gap-3">
                {GOAL_TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => startPick(t)}
                    className={
                      "card-bh text-left flex items-start gap-3 hover:shadow-lift transition-shadow " +
                      (t.advancedOnly ? "opacity-90 border-amber/40" : "")
                    }
                  >
                    <span className={"grid place-items-center w-10 h-10 rounded-xl shrink-0 " + (t.advancedOnly ? "bg-amber/15 text-[#9a6a1d]" : "bg-sage text-forest")}>
                      {t.advancedOnly ? <Sparkles size={18} /> : <Sprout size={18} />}
                    </span>
                    <span className="flex-1">
                      <span className="block font-bold text-ink">{t.title} <DemoTag /></span>
                      <span className="block text-sm text-muted mt-0.5">{t.micro}</span>
                      {t.advancedOnly && (
                        <span className="mt-1.5 inline-block"><TierBadge tier="advanced" /></span>
                      )}
                    </span>
                  </button>
                ))}
              </div>
              <button
                className="btn-ghost mt-3"
                onClick={() => {
                  setPicked(null);
                  setTitle("");
                  setMicro("");
                  setWizardStep(1);
                }}
              >
                <Plus size={16} /> Crear mi propia meta
              </button>
            </motion.div>
          )}

          {wizardStep === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="card-bh max-w-xl">
              <ProgressBar step={2} />
              <h2 className="font-bold text-lg text-ink mt-4 mb-1">Tu meta, en tus palabras</h2>
              <p className="text-sm text-muted mb-4">
                Consejo: si suena grande, achícala. “Caminar 10 minutos” gana a “cambiar mi vida”.
              </p>
              <label className="block text-sm font-semibold text-ink mb-1.5" htmlFor="gt">Nombre de la meta</label>
              <input id="gt" className="input-bh mb-3" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ej.: tender mi cama" />
              <label className="block text-sm font-semibold text-ink mb-1.5" htmlFor="gm">La versión pequeña (qué haces hoy)</label>
              <textarea id="gm" className="input-bh min-h-[80px] rounded-xl2" value={micro} onChange={(e) => setMicro(e.target.value)} placeholder="Ej.: levantarme y abrir la ventana. Ya." />
              <div className="mt-5 flex flex-col-reverse sm:flex-row gap-2.5">
                <button className="btn-ghost" onClick={() => setWizardStep(picked ? 0 : 0)}>
                  <ArrowLeft size={16} /> Atrás
                </button>
                <button className="btn-primary flex-1" onClick={confirm} disabled={!title.trim()}>
                  Crear meta
                </button>
              </div>
            </motion.div>
          )}

          {wizardStep === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="card-bh max-w-xl bg-sage/50 text-center py-8">
              <ProgressBar step={3} />
              <span className="mx-auto mt-4 grid place-items-center w-14 h-14 rounded-full bg-forest text-white">
                <CheckCircle2 size={28} />
              </span>
              <h2 className="mt-3 text-xl font-extrabold text-ink">Listo. La meta ya es tuya.</h2>
              <p className="mt-1 text-sm text-muted">
                Si mañana se siente grande, la achicamos. Nadie lleva cuenta de tus días malos.
              </p>
              <button className="btn-primary mt-5" onClick={resetWizard}>
                Elegir otra cosa o terminar aquí
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Mis metas */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-lg text-ink">Mis metas</h2>
          <Link to="/guardados" className="btn-ghost text-sm">Guardados <ChevronRight size={15} /></Link>
        </div>

        {goals.length === 0 ? (
          <EmptyState
            title="Todavía no hay metas aquí"
            body="Y está bien. Cuando quieras, escoge una de arriba: chiquita, posible, tuya."
          />
        ) : (
          <div className="space-y-6">
            <GoalGroup title={`En marcha (${activas.length})`} goals={activas} emptyText="Ninguna en este momento. También es una decisión válida." {...{ setGoalStatus, deleteGoal, confirmDelete, setConfirmDelete }} />
            <GoalGroup title={`En pausa (${pausadas.length})`} goals={pausadas} emptyText="Nada pausado." paused {...{ setGoalStatus, deleteGoal, confirmDelete, setConfirmDelete }} />
            <GoalGroup title={`Logradas (${hechas.length})`} goals={hechas} emptyText="Cuando logres algo, aparecerá aquí. Sin medallas falsas." {...{ setGoalStatus, deleteGoal, confirmDelete, setConfirmDelete }} />
          </div>
        )}
      </section>

      {/* Recordatorios opcionales */}
      <section className="mt-8 card-bh flex items-center justify-between gap-4">
        <div>
          <p className="font-bold text-ink flex items-center gap-2"><BellRing size={17} className="text-forest" /> Recordatorios suaves</p>
          <p className="text-sm text-muted mt-1">Un aviso amable al día, opcional. Nunca uno por “fallar”.</p>
        </div>
        <button
          role="switch"
          aria-checked={settings.reminders}
          onClick={() => {
            setSettings({ reminders: !settings.reminders });
          }}
          className={
            "relative w-14 h-8 rounded-full transition-colors shrink-0 " +
            (settings.reminders ? "bg-forest" : "bg-[#DDD5C2]")
          }
        >
          <span
            className={"absolute top-1 w-6 h-6 rounded-full bg-white shadow transition-all " + (settings.reminders ? "left-7" : "left-1")}
          />
          <span className="sr-only">Activar recordatorios</span>
        </button>
      </section>

      <AdvancedModal open={showAdvanced} onClose={() => setShowAdvanced(false)} />
    </div>
  );
}

function ProgressBar({ step }: { step: number }) {
  return (
    <div className="flex items-center gap-2" aria-label={`Paso ${step} de 3`}>
      {[1, 2, 3].map((i) => (
        <span key={i} className={"h-1.5 flex-1 rounded-full " + (i <= step ? "bg-forest" : "bg-[#E4DCCB]")} />
      ))}
      <span className="text-xs font-bold text-muted whitespace-nowrap ml-1">Paso {step} de 3</span>
    </div>
  );
}

type GroupProps = {
  title: string;
  goals: UserGoal[];
  emptyText: string;
  paused?: boolean;
  setGoalStatus: (id: string, s: UserGoal["status"], reason?: string) => void;
  deleteGoal: (id: string) => void;
  confirmDelete: string | null;
  setConfirmDelete: (v: string | null) => void;
};

function GoalGroup({ title, goals, emptyText, paused, setGoalStatus, deleteGoal, confirmDelete, setConfirmDelete }: GroupProps) {
  return (
    <div>
      <h3 className="text-sm font-bold uppercase tracking-wide text-muted mb-2">{title}</h3>
      {goals.length === 0 ? (
        <p className="text-sm text-muted/80 italic pl-1">{emptyText}</p>
      ) : (
        <ul className="space-y-3">
          {goals.map((g) => (
            <li key={g.id} className="card-bh !py-4 flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex-1">
                <p className={"font-bold text-ink " + (paused ? "line-through decoration-[#B9AF98]" : "")}>
                  {g.title} <DemoTag />
                </p>
                <p className="text-sm text-muted mt-0.5">
                  {paused && g.pauseReason ? `Pausada: ${g.pauseReason}. ` : g.micro}
                  {g.hint && !paused ? ` ${g.hint}` : ""}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {g.status === "activa" && (
                  <>
                    <button className="btn-secondary !px-3.5 !min-h-[44px]" onClick={() => setGoalStatus(g.id, "pausada", "por ahora no")} aria-label={`Pausar ${g.title}`}>
                      <Pause size={15} /> Pausar
                    </button>
                    <button className="btn-primary !px-3.5 !min-h-[44px]" onClick={() => setGoalStatus(g.id, "completada")} aria-label={`Completar ${g.title}`}>
                      <CheckCircle2 size={15} /> Hecho hoy
                    </button>
                  </>
                )}
                {g.status === "pausada" && (
                  <button className="btn-primary !px-3.5 !min-h-[44px]" onClick={() => setGoalStatus(g.id, "activa")} aria-label={`Retomar ${g.title}`}>
                    <Play size={15} /> Retomar
                  </button>
                )}
                {g.status === "completada" && (
                  <button className="btn-secondary !px-3.5 !min-h-[44px]" onClick={() => setGoalStatus(g.id, "activa")} aria-label={`Reabrir ${g.title}`}>
                    <Play size={15} /> De nuevo
                  </button>
                )}
                {confirmDelete === g.id ? (
                  <>
                    <button className="btn !min-h-[44px] px-3.5 rounded-full bg-danger text-white text-sm font-semibold" onClick={() => { deleteGoal(g.id); setConfirmDelete(null); }}>
                      Sí, borrar
                    </button>
                    <button className="btn-ghost !min-h-[44px]" onClick={() => setConfirmDelete(null)}>Cancelar</button>
                  </>
                ) : (
                  <button className="btn-ghost !min-h-[44px]" aria-label={`Eliminar ${g.title}`} onClick={() => setConfirmDelete(g.id)}>
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

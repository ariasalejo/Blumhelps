import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Globe,
  Type,
  Wind,
  Download,
  Trash2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useApp } from "../state/app";
import { PageHeader, TierBadge, AdvancedModal, DemoTag } from "../components/ui";

export default function Ajustes() {
  const { settings, setSettings, wipeAll, exportData, toast, saved, goals } = useApp();
  const [confirmWipe, setConfirmWipe] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const doExport = () => {
    try {
      const blob = new Blob([exportData()], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "blumhelps-mis-datos.json";
      a.click();
      URL.revokeObjectURL(url);
      toast("Archivo descargado. Es solo tuyo.");
    } catch {
      toast("No se pudo descargar aquí. Intenta de nuevo.", "info");
    }
  };

  return (
    <div className="pb-6 max-w-2xl">
      <PageHeader
        eyebrow="Tú controlas"
        title="Ajustes"
        subtitle="Idioma, accesibilidad y privacidad. Todo se guarda en este dispositivo; puedes borrarlo con un toque."
      />

      {/* Idioma */}
      <Section title="Idioma" icon={<Globe size={17} className="text-forest" />}>
        <div className="flex flex-wrap gap-2">
          {[
            { v: "es-CO", l: "Español (Colombia)" },
            { v: "es-419", l: "Español (Latinoamérica) · próximamente" },
            { v: "en", l: "English · próximamente" },
          ].map((o) => (
            <button
              key={o.v}
              disabled={o.v !== "es-CO"}
              onClick={() => {
                if (o.v !== "es-CO") return;
                setSettings({ language: "es-CO" });
                toast("La interfaz está en español de Colombia.");
              }}
              aria-pressed={settings.language === o.v}
              className={"chip disabled:opacity-40 " + (settings.language === o.v ? "bg-forest text-white border-forest" : "bg-white border-[#DDD5C2] hover:bg-sage")}
            >
              {o.l}
            </button>
          ))}
        </div>
        <p className="mt-3 text-xs leading-relaxed text-muted">
          Esta versión solo tiene la interfaz en español de Colombia. Los otros idiomas todavía no cambian los textos.
        </p>
      </Section>

      {/* Accesibilidad */}
      <Section title="Accesibilidad" icon={<Type size={17} className="text-forest" />}>
        <p className="text-sm font-semibold text-ink mb-2">Tamaño del texto</p>
        <div className="flex gap-2 mb-4">
          {[
            { v: 1, l: "Normal" },
            { v: 1.15, l: "Grande" },
            { v: 1.3, l: "Muy grande" },
          ].map((o) => (
            <button
              key={o.v}
              onClick={() => setSettings({ textScale: o.v })}
              aria-pressed={settings.textScale === o.v}
              className={"chip " + (settings.textScale === o.v ? "bg-forest text-white border-forest" : "bg-white border-[#DDD5C2] hover:bg-sage")}
              style={{ fontSize: `${o.v * 14}px` }}
            >
              {o.l}
            </button>
          ))}
        </div>
        <Toggle
          icon={<Wind size={16} />}
          label="Reducir animaciones"
          hint="Menos movimiento en transiciones. También respetamos la opción de tu sistema."
          on={settings.reduceMotion}
          onChange={(v) => setSettings({ reduceMotion: v })}
        />
      </Section>

      {/* Privacidad */}
      <Section title="Privacidad" icon={<ShieldCheck size={17} className="text-forest" />}>
        <div className="rounded-xl border border-forest/15 bg-sage/55 p-4 text-sm leading-relaxed text-ink/85">
          <p className="font-bold text-ink mb-1">Qué funciona hoy</p>
          <p>
            Tus metas, ajustes y guardados se guardan en el almacenamiento local de este navegador. No se sincronizan con una cuenta.
          </p>
        </div>

        <div className="mt-3 rounded-xl border border-amber/40 bg-amber/10 p-4 text-sm leading-relaxed text-ink/85">
          <p className="font-bold text-ink mb-1">Límites importantes</p>
          <p>
            El almacenamiento local no está cifrado y otra persona que use el mismo perfil del navegador podría acceder a él. Evita escribir datos íntimos o médicos. Esta versión todavía no incluye bloqueo de pantalla, modo discreto real ni recordatorios programados; activar una preferencia no debe dar a entender que esas funciones existen.
          </p>
        </div>

        <div className="mt-3 rounded-xl bg-white border border-[#EDE6D6] p-4 text-sm text-ink/85 leading-relaxed">
          <p className="font-bold text-ink mb-1">Tus datos, tu decisión</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><b>Guardados:</b> {saved.length}; <b>metas:</b> {goals.length} <DemoTag /></li>
            <li>Puedes exportar estos datos como JSON o borrarlos de este navegador.</li>
            <li>Esta demo no crea perfiles de usuario ni envía tus metas personales al backend.</li>
          </ul>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row gap-2.5">
          <button className="btn-secondary" onClick={doExport}>
            <Download size={16} /> Exportar mis datos
          </button>
          {!confirmWipe ? (
            <button className="btn-ghost text-danger hover:bg-coral/10" onClick={() => setConfirmWipe(true)}>
              <Trash2 size={16} /> Borrar todo de este dispositivo
            </button>
          ) : (
            <div className="flex items-center gap-2 rounded-xl bg-coral/10 border border-coral/40 px-3 p-1.5">
              <span className="text-sm font-semibold text-ink pl-2">¿Seguro? Se va todo, sin recupero.</span>
              <button
                className="btn !min-h-[40px] px-4 rounded-full bg-danger text-white text-sm font-semibold"
                onClick={() => { wipeAll(); setConfirmWipe(false); }}
              >
                Sí, borrar
              </button>
              <button className="btn-ghost !min-h-[40px]" onClick={() => setConfirmWipe(false)}>Cancelar</button>
            </div>
          )}
        </div>
      </Section>

      {/* Plan actual */}
      <Section title="Tu plan" icon={<Sparkles size={17} className="text-amber" />}>
        <div className="flex items-center gap-3 flex-wrap">
          <TierBadge tier="free" />
          <p className="text-sm text-muted flex-1 min-w-[180px]">
            Esta demo permite explorar el directorio, crear metas y guardar recursos. Las funciones avanzadas que ves a continuación aún no están disponibles.
          </p>
          <button className="btn-secondary" onClick={() => setShowAdvanced(true)}>
            Ver funciones futuras
          </button>
        </div>
        <p className="mt-3 text-xs text-muted italic">
          Las ideas avanzadas no están activas: esta versión no incluye diario cifrado, análisis de sueño o ánimo, respaldo cifrado ni sincronización entre dispositivos.
        </p>
      </Section>

      <p className="mt-8 text-xs text-muted leading-relaxed">
        BlumHelps no diagnostica ni reemplaza profesionales de salud. En emergencia llama al{" "}
        <Link to="/ayuda/emergencia" className="underline font-bold text-coral">123</Link>. Prototipo
        con datos ficticios <DemoTag />.
      </p>

      <AdvancedModal open={showAdvanced} onClose={() => setShowAdvanced(false)} />
    </div>
  );
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="card-bh mb-5">
      <h2 className="font-bold text-ink flex items-center gap-2.5 mb-4">{icon} {title}</h2>
      {children}
    </section>
  );
}

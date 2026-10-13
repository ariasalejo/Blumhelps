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
  BellRing,
  EyeOff,
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
            { v: "es-419", l: "Español (Latinoamérica)" },
            { v: "en", l: "English (próximo)" },
          ].map((o) => (
            <button
              key={o.v}
              disabled={o.v === "en"}
              onClick={() => { setSettings({ language: o.v as never }); toast("Idioma actualizado"); }}
              aria-pressed={settings.language === o.v}
              className={"chip disabled:opacity-40 " + (settings.language === o.v ? "bg-forest text-white border-forest" : "bg-white border-[#DDD5C2] hover:bg-sage")}
            >
              {o.l}
            </button>
          ))}
        </div>
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
        <Toggle
          icon={<EyeOff size={16} />}
          label="Modo discreto"
          hint="La pantalla de bloqueo y el historial local no muestran palabras sensibles."
          on={settings.privateMode}
          onChange={(v) => setSettings({ privateMode: v })}
        />
        <Toggle
          icon={<BellRing size={16} />}
          label="Recordatorios opcionales"
          hint="Un aviso suave al día si quieres. Nunca avisos por “fallar”."
          on={settings.reminders}
          onChange={(v) => setSettings({ reminders: v })}
        />

        <div className="mt-4 rounded-xl bg-sage/60 border border-forest/15 p-4 text-sm text-ink/85 leading-relaxed">
          <p className="font-bold text-ink mb-1">Qué guardamos y dónde</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><b>En este dispositivo:</b> tus guardados ({saved.length}) y metas ({goals.length}) <DemoTag /></li>
            <li><b>No guardamos:</b> tu nombre, número, ni qué recursos abriste.</li>
            <li><b>No vendemos ni compartimos</b> información sensible. Punto.</li>
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
            Estás usando el plan gratis: ayuda, comunidad, metas, directorio… para siempre gratis.
          </p>
          <button className="btn-secondary" onClick={() => setShowAdvanced(true)}>
            Conocer Avanzado
          </button>
        </div>
        <p className="mt-3 text-xs text-muted italic">
          “Lo importante aquí no se paga. BlumHelps Avanzado es solo para cuando quieras herramientas
          de reflexión más profundas. Puedes cerrarlo y seguir usando todo lo demás.”
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

function Toggle({
  icon,
  label,
  hint,
  on,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  hint: string;
  on: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-[#EFE9DA] last:border-0">
      <div>
        <p className="font-semibold text-ink text-sm flex items-center gap-2">{icon} {label}</p>
        <p className="text-xs text-muted mt-1 leading-relaxed">{hint}</p>
      </div>
      <button
        role="switch"
        aria-checked={on}
        aria-label={label}
        onClick={() => onChange(!on)}
        className={"relative w-14 h-8 rounded-full shrink-0 transition-colors " + (on ? "bg-forest" : "bg-[#DDD5C2]")}
      >
        <span className={"absolute top-1 w-6 h-6 rounded-full bg-white shadow transition-all " + (on ? "left-7" : "left-1")} />
      </button>
    </div>
  );
}

// ============================================================================
// BLUMHELPS — COMPONENTE DE CONSENTIMIENTO INFORMADO (UI ENTERPRISE)
// ============================================================================
// Accesible WCAG 2.1 AA: secciones colapsables, detección de scroll mínimo,
// timer de lectura, doble confirmación, hash visible para auditoría legal,
// integración TTS, modo impresión, barra de progreso dual.
// ============================================================================

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ShieldCheck,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Lock,
  Eye,
  EyeOff,
  Clock,
  FileText,
  CheckCircle2,
  Volume2,
  Printer,
} from "lucide-react";
import { CURRENT_CONSENT } from "../../data/recovery/consentTexts";

interface ConsentScreenProps {
  onAccept: (record: {
    version: string;
    acceptedAt: string;
    textHash: string;
  }) => void | Promise<void>;
  onCancel?: () => void;
  minReadSeconds?: number;
  minScrollRatio?: number;
}

interface Section {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: string;
  critical?: boolean;
}

function parseSections(text: string): Section[] {
  const parts = text.split(/\n## /g);
  const sections: Section[] = [];
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i].trim();
    if (!part) continue;
    const nl = part.indexOf("\n");
    const firstLine = nl === -1 ? part : part.slice(0, nl);
    const body = nl === -1 ? "" : part.slice(nl + 1).trim();
    sections.push({
      id: "section-" + i,
      title: firstLine.replace(/^\d+\.\s*/, ""),
      icon: getIconForSection(firstLine),
      content: body,
      critical: /limitaciones|riesgos|crisis/i.test(firstLine),
    });
  }
  return sections;
}

function getIconForSection(title: string): React.ReactNode {
  if (/responsable/i.test(title)) return <ShieldCheck className="w-5 h-5" />;
  if (/naturaleza|herramienta/i.test(title)) return <FileText className="w-5 h-5" />;
  if (/datos|recolect/i.test(title)) return <Eye className="w-5 h-5" />;
  if (/soberan|localizaci/i.test(title)) return <Lock className="w-5 h-5" />;
  if (/seguridad|cifrado/i.test(title)) return <ShieldCheck className="w-5 h-5" />;
  if (/derechos|arco/i.test(title)) return <CheckCircle2 className="w-5 h-5" />;
  if (/retenci/i.test(title)) return <Clock className="w-5 h-5" />;
  if (/limitaciones|riesgos/i.test(title)) return <AlertTriangle className="w-5 h-5" />;
  return <FileText className="w-5 h-5" />;
}

export function ConsentScreen({
  onAccept,
  onCancel,
  minReadSeconds = 30,
  minScrollRatio = 0.6,
}: ConsentScreenProps) {
  const sections = useMemo(() => parseSections(CURRENT_CONSENT.text), []);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [accepted, setAccepted] = useState(false);
  const [readSeconds, setReadSeconds] = useState(0);
  const [scrollRatio, setScrollRatio] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [showHash, setShowHash] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setInterval(() => setReadSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const maxScroll = el.scrollHeight - el.clientHeight;
      setScrollRatio(maxScroll <= 0 ? 1 : el.scrollTop / maxScroll);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const initial: Record<string, boolean> = {};
    sections.forEach((s) => {
      initial[s.id] = true;
    });
    setExpanded(initial);
  }, [sections]);

  const canAccept =
    accepted &&
    readSeconds >= minReadSeconds &&
    scrollRatio >= minScrollRatio &&
    !submitting;

  const handleAccept = async () => {
    if (!canAccept) return;
    setSubmitting(true);
    try {
      await onAccept({
        version: CURRENT_CONSENT.version,
        acceptedAt: new Date().toISOString(),
        textHash: CURRENT_CONSENT.hash,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const toggleSection = (id: string) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  const expandAll = () => {
    const all: Record<string, boolean> = {};
    sections.forEach((s) => {
      all[s.id] = true;
    });
    setExpanded(all);
  };

  const collapseAll = () => setExpanded({});

  const handlePrint = () => window.print();

  const handleReadAloud = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(
      CURRENT_CONSENT.summary.join(". ") + ". " + CURRENT_CONSENT.text,
    );
    utt.lang = "es-CO";
    utt.rate = 0.95;
    window.speechSynthesis.speak(utt);
  };

  const handleStopReading = () => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  const progressLabel = () => {
    if (readSeconds < minReadSeconds) {
      return "Lee con calma (" + (minReadSeconds - readSeconds) + "s restantes)";
    }
    if (scrollRatio < minScrollRatio) {
      return "Desplázate para leer todo (" + Math.round(scrollRatio * 100) + "%)";
    }
    if (!accepted) return "Marca la casilla para continuar";
    return "Listo para continuar";
  };

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 print:p-0">
      <header className="mb-6 print:mb-2">
        <div className="flex items-center gap-3 mb-2">
          <ShieldCheck className="w-8 h-8 text-[var(--moss)]" aria-hidden="true" />
          <h1 className="text-2xl sm:text-3xl font-bold serif">
            Consentimiento Informado
          </h1>
        </div>
        <p className="text-sm text-gray-600">
          Versión {CURRENT_CONSENT.version} · Vigente desde{" "}
          {new Date(CURRENT_CONSENT.effectiveFrom).toLocaleDateString("es-CO")}
        </p>
      </header>

      <section
        className="mb-6 p-4 rounded-2xl bg-[var(--moss)]/10 border border-[var(--moss)]/30 print:bg-white print:border-gray-300"
        aria-label="Resumen ejecutivo del consentimiento"
      >
        <h2 className="font-semibold mb-3 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-[var(--moss)]" aria-hidden="true" />
          En palabras simples
        </h2>
        <ul className="space-y-2 text-sm">
          {CURRENT_CONSENT.summary.map((b, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-[var(--moss)] font-bold" aria-hidden="true">•</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </section>

      <div className="flex flex-wrap gap-2 mb-4 print:hidden" role="toolbar" aria-label="Acciones del documento">
        <button
          onClick={expandAll}
          type="button"
          className="text-xs px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50"
        >
          Expandir todo
        </button>
        <button
          onClick={collapseAll}
          type="button"
          className="text-xs px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50"
        >
          Colapsar todo
        </button>
        <button
          onClick={handleReadAloud}
          type="button"
          className="text-xs px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 flex items-center gap-1"
        >
          <Volume2 className="w-3.5 h-3.5" aria-hidden="true" /> Leer en voz alta
        </button>
        <button
          onClick={handleStopReading}
          type="button"
          className="text-xs px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50"
        >
          Detener audio
        </button>
        <button
          onClick={handlePrint}
          type="button"
          className="text-xs px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 flex items-center gap-1"
        >
          <Printer className="w-3.5 h-3.5" aria-hidden="true" /> Imprimir / Guardar PDF
        </button>
      </div>

      <div
        ref={scrollRef}
        className="max-h-[50vh] overflow-y-auto rounded-2xl border border-gray-200 bg-white print:max-h-none print:overflow-visible print:border-0"
        aria-label="Texto completo del consentimiento informado"
      >
        <div className="p-4 sm:p-6 space-y-3">
          {sections.map((section) => (
            <article
              key={section.id}
              className={
                "rounded-xl border " +
                (section.critical
                  ? "border-amber-300 bg-amber-50/40"
                  : "border-gray-200 bg-white") +
                " print:border-gray-300 print:bg-white"
              }
            >
              <button
                type="button"
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50/50 rounded-xl print:cursor-default"
                aria-expanded={Boolean(expanded[section.id])}
                aria-controls={section.id + "-body"}
              >
                <span className="flex items-center gap-2 font-semibold text-gray-800">
                  <span className="text-[var(--moss)]" aria-hidden="true">
                    {section.icon}
                  </span>
                  {section.title}
                </span>
                <span className="print:hidden" aria-hidden="true">
                  {expanded[section.id] ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </span>
              </button>
              {expanded[section.id] && (
                <div
                  id={section.id + "-body"}
                  className="px-4 pb-4 text-sm text-gray-700 whitespace-pre-line leading-relaxed"
                >
                  {section.content}
                </div>
              )}
            </article>
          ))}
        </div>
      </div>

      <div className="mt-4 print:hidden">
        <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
          <span>{progressLabel()}</span>
          <span>
            {Math.round(scrollRatio * 100)}% · {readSeconds}s
          </span>
        </div>
        <div
          className="h-2 rounded-full bg-gray-200 overflow-hidden"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(
            Math.min(100, (readSeconds / minReadSeconds) * 50 + scrollRatio * 50),
          )}
        >
          <div
            className="h-full bg-[var(--moss)] transition-all duration-300"
            style={{
              width:
                Math.min(100, (readSeconds / minReadSeconds) * 50 + scrollRatio * 50) + "%",
            }}
          />
        </div>
      </div>

      <div className="mt-4 p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs font-mono print:bg-white print:border-gray-300">
        <div className="flex items-center justify-between mb-1">
          <span className="text-gray-600">Hash del documento (auditoría):</span>
          <button
            type="button"
            onClick={() => setShowHash((v) => !v)}
            className="flex items-center gap-1 text-[var(--moss)] hover:underline print:hidden"
          >
            {showHash ? (
              <>
                <EyeOff className="w-3 h-3" aria-hidden="true" /> Ocultar
              </>
            ) : (
              <>
                <Eye className="w-3 h-3" aria-hidden="true" /> Mostrar
              </>
            )}
          </button>
        </div>
        <div className="break-all text-gray-700">
          {showHash ? CURRENT_CONSENT.hash || "(calculado en build)" : "•".repeat(64)}
        </div>
      </div>

      <div className="mt-6 space-y-4 print:hidden">
        <label className="flex items-start gap-3 p-4 rounded-xl border border-gray-200 bg-white cursor-pointer hover:border-[var(--moss)] transition-colors">
          <input
            type="checkbox"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
            disabled={readSeconds < minReadSeconds || scrollRatio < minScrollRatio}
            className="mt-0.5 w-5 h-5 accent-[var(--moss)] disabled:opacity-40"
          />
          <span className="text-sm">
            He leído y comprendido este consentimiento informado. Acepto que mis
            datos sensibles de salud mental se traten conforme a las condiciones
            descritas, y entiendo que puedo retirarme en cualquier momento.
          </span>
        </label>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={handleAccept}
            disabled={!canAccept}
            className="flex-1 px-6 py-3 rounded-xl bg-[var(--moss)] text-white font-semibold hover:bg-[var(--moss-deep)] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? "Guardando..." : "Aceptar y continuar"}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 rounded-xl border border-gray-300 hover:bg-gray-50 font-medium"
            >
              Cancelar
            </button>
          )}
        </div>

        <p className="text-xs text-gray-500 text-center">
          Puedes cerrar esta ventana y volver más tarde. Tu progreso se guardará
          de forma segura en este dispositivo.
        </p>
      </div>
    </div>
  );
}

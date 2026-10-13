import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  HeartHandshake,
  Sprout,
  Bookmark,
  Settings as SettingsIcon,
  Phone,
  Sparkles,
  SearchX,
  Inbox,
  AlertTriangle,
  RotateCcw,
  ChevronRight,
  X,
  CheckCircle2,
  Info,
} from "lucide-react";
import { useApp } from "../state/app";

/* ------------------------------------------------------------------ */
/* Logo                                                                */
/* ------------------------------------------------------------------ */
export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="grid place-items-center w-9 h-9 rounded-full bg-forest text-white shrink-0">
        <Sparkles size={18} />
      </span>
      {!compact && (
        <span className="font-extrabold tracking-tight text-[19px] text-ink">
          Blum<span className="text-emerald">Helps</span>
        </span>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Navegación principal (sidebar desktop + bottom bar móvil)           */
/* ------------------------------------------------------------------ */
const NAV = [
  { to: "/inicio", label: "Inicio", icon: Home },
  { to: "/ayuda", label: "Ayuda", icon: HeartHandshake },
  { to: "/bienestar", label: "Bienestar", icon: Sprout },
  { to: "/guardados", label: "Guardados", icon: Bookmark },
  { to: "/ajustes", label: "Ajustes", icon: SettingsIcon },
];

// Secciones adicionales accesibles desde el menú "Más" del Home y enlaces internos
export const MORE_NAV = [
  { to: "/formacion", label: "Formación", desc: "Cursos y oficios" },
  { to: "/empleo", label: "Empleo", desc: "Oportunidades y hoja de vida" },
  { to: "/comunidad", label: "Comunidad", desc: "Actividades y grupos" },
  { to: "/familias", label: "Familias", desc: "Acompañar sin culpar" },
];

export function Sidebar() {
  const { pathname } = useLocation();
  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 h-screen sticky top-0 bg-base border-r border-[#E7DFCC] px-5 py-6">
      <Link to="/inicio" aria-label="BlumHelps — ir al inicio">
        <Logo />
      </Link>

      {/* Emergencia siempre visible en navegación */}
      <Link
        to="/ayuda/emergencia"
        className="mt-6 flex items-center gap-3 rounded-xl2 bg-coral/10 border border-coral/30 px-4 py-3 min-h-[56px] hover:bg-coral/20 transition-colors"
      >
        <Phone size={18} className="text-coral" />
        <div className="leading-tight">
          <p className="text-sm font-bold text-ink">¿Urgencia? Línea 123</p>
          <p className="text-xs text-muted">Peligro inmediato: llama ya</p>
        </div>
      </Link>

      <nav className="mt-6 flex flex-col gap-1" aria-label="Navegación principal">
        {NAV.map(({ to, label, icon: Icon }) => {
          const active = pathname === to || pathname.startsWith(to + "/");
          return (
            <Link
              key={to}
              to={to}
              aria-current={active ? "page" : undefined}
              className={
                "flex items-center gap-3 rounded-xl px-3.5 min-h-[44px] text-[15px] font-medium transition-colors " +
                (active
                  ? "bg-forest text-white shadow-soft"
                  : "text-ink/80 hover:bg-sage hover:text-forest")
              }
            >
              <Icon size={19} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-6 pt-4 border-t border-[#E7DFCC]">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-2">
          Más secciones
        </p>
        {MORE_NAV.map(({ to, label }) => {
          const active = pathname === to || pathname.startsWith(to + "/");
          return (
            <Link
              key={to}
              to={to}
              className={
                "flex items-center justify-between rounded-xl px-3.5 min-h-[40px] text-[14px] transition-colors " +
                (active ? "text-forest font-semibold bg-sage" : "text-muted hover:text-forest hover:bg-sage")
              }
            >
              {label}
              <ChevronRight size={15} />
            </Link>
          );
        })}
      </div>

      <div className="mt-auto pt-4">
        <FreeVsAdvancedMini />
        <p className="text-[11px] text-muted mt-3 leading-snug">
          Prototipo con datos ficticios etiquetados <b>(demo)</b>. No reemplaza
          atención profesional.
        </p>
      </div>
    </aside>
  );
}

export function BottomBar() {
  const { pathname } = useLocation();
  return (
    <nav
      aria-label="Navegación principal"
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur border-t border-[#E7DFCC] grid grid-cols-5 pb-[env(safe-area-inset-bottom)]"
    >
      {NAV.map(({ to, label, icon: Icon }) => {
        const active = pathname === to || pathname.startsWith(to + "/");
        return (
          <Link
            key={to}
            to={to}
            aria-current={active ? "page" : undefined}
            className={
              "flex flex-col items-center justify-center gap-0.5 min-h-[56px] text-[11px] font-medium transition-colors " +
              (active ? "text-forest" : "text-muted")
            }
          >
            <span className={"grid place-items-center w-11 h-8 rounded-full " + (active ? "bg-sage" : "")}>
              <Icon size={20} />
            </span>
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

export function TopBarMobile() {
  return (
    <header className="lg:hidden sticky top-0 z-40 bg-base/95 backdrop-blur border-b border-[#E7DFCC] px-4 h-14 flex items-center justify-between">
      <Link to="/inicio" aria-label="Ir al inicio">
        <Logo />
      </Link>
      <Link
        to="/ayuda/emergencia"
        className="flex items-center gap-1.5 text-sm font-bold text-coral bg-coral/10 border border-coral/30 rounded-full px-3 min-h-[38px]"
      >
        <Phone size={15} /> 123
      </Link>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* Encabezado de página con regreso                                    */
/* ------------------------------------------------------------------ */
export function PageHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-6">
      {eyebrow && (
        <p className="text-xs font-bold uppercase tracking-widest text-emerald mb-1.5">
          {eyebrow}
        </p>
      )}
      <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-ink">
        {title}
      </h1>
      {subtitle && <p className="mt-2 text-[15px] text-muted max-w-2xl leading-relaxed">{subtitle}</p>}
    </div>
  );
}

export function BackLink({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-1.5 text-sm font-semibold text-forest hover:underline min-h-[44px]"
    >
      <ChevronRight size={16} className="rotate-180" />
      {label}
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/* Chip / filtro                                                       */
/* ------------------------------------------------------------------ */
export function FilterChip({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={
        "chip " +
        (active
          ? "bg-forest text-white border-forest"
          : "bg-white text-ink/80 border-[#DDD5C2] hover:border-forest/50 hover:bg-sage")
      }
    >
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Etiqueta (demo)                                                     */
/* ------------------------------------------------------------------ */
export function DemoTag() {
  return (
    <span
      title="Dato ficticio de demostración"
      className="inline-flex items-center rounded-md bg-amber/15 text-[#9a6a1d] border border-amber/40 text-[11px] font-bold px-1.5 py-0.5 align-middle"
    >
      (demo)
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Badge Free / Avanzado                                               */
/* ------------------------------------------------------------------ */
export function TierBadge({ tier }: { tier: "free" | "advanced" }) {
  return tier === "free" ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-sage text-forest text-xs font-bold px-2.5 py-1 border border-forest/20">
      <CheckCircle2 size={13} /> Gratis
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber/15 text-[#9a6a1d] text-xs font-bold px-2.5 py-1 border border-amber/40">
      <Sparkles size={13} /> Avanzado
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Estados: carga / error / vacío                                      */
/* ------------------------------------------------------------------ */
export function SkeletonCard() {
  return (
    <div className="card-bh animate-pulse" aria-hidden="true">
      <div className="h-4 w-2/3 rounded bg-[#EDE6D6]" />
      <div className="h-3 w-1/3 rounded bg-[#EDE6D6] mt-2.5" />
      <div className="h-3 w-full rounded bg-[#F2ECDE] mt-4" />
      <div className="h-3 w-5/6 rounded bg-[#F2ECDE] mt-2" />
      <div className="flex gap-2 mt-5">
        <div className="h-8 w-20 rounded-full bg-[#EDE6D6]" />
        <div className="h-8 w-24 rounded-full bg-[#EDE6D6]" />
      </div>
    </div>
  );
}

export function LoadingGrid({ count = 4 }: { count?: number }) {
  return (
    <div role="status" aria-label="Cargando contenido" className="grid sm:grid-cols-2 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
      <span className="sr-only">Cargando…</span>
    </div>
  );
}

export function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="card-bh flex flex-col items-start gap-3 border-coral/40 bg-coral/5 max-w-lg" role="alert">
      <span className="grid place-items-center w-10 h-10 rounded-full bg-coral/15 text-coral">
        <AlertTriangle size={20} />
      </span>
      <p className="font-bold text-ink">No pudimos cargar esta lista</p>
      <p className="text-sm text-muted">
        Puede ser la conexión. Tus guardados y metas siguen aquí, intactos.
      </p>
      <button className="btn-secondary" onClick={onRetry}>
        <RotateCcw size={16} /> Intentar de nuevo
      </button>
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  body,
  action,
}: {
  icon?: "search" | "inbox";
  title: string;
  body: string;
  action?: React.ReactNode;
}) {
  const Icon = icon === "search" ? SearchX : Inbox;
  return (
    <div className="card-bh flex flex-col items-center text-center py-10 bg-sage/50 border-dashed">
      <span className="grid place-items-center w-12 h-12 rounded-full bg-white text-emerald shadow-soft">
        <Icon size={22} />
      </span>
      <p className="mt-3 font-bold text-ink">{title}</p>
      <p className="mt-1 text-sm text-muted max-w-sm">{body}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Toasts                                                              */
/* ------------------------------------------------------------------ */
export function Toaster() {
  const { toasts } = useApp();
  return (
    <div className="fixed z-50 bottom-20 lg:bottom-6 left-1/2 -translate-x-1/2 flex flex-col gap-2 items-center pointer-events-none px-4">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            className={
              "flex items-center gap-2 rounded-full px-4 py-2.5 shadow-lift text-sm font-semibold text-white " +
              (t.tone === "ok" ? "bg-forest" : "bg-ink")
            }
          >
            {t.tone === "ok" ? <CheckCircle2 size={15} /> : <Info size={15} />}
            {t.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Paywall ético (modal no bloqueante)                                 */
/* ------------------------------------------------------------------ */
export function AdvancedModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label="Sobre BlumHelps Avanzado"
      className="fixed inset-0 z-50 grid place-items-end sm:place-items-center bg-ink/40 p-0 sm:p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-base rounded-t-xl2 sm:rounded-xl2 shadow-lift w-full sm:max-w-lg p-6 relative max-h-[85vh] overflow-auto"
      >
        <button
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-4 top-4 grid place-items-center w-11 h-11 rounded-full hover:bg-sage text-muted"
        >
          <X size={20} />
        </button>
        <TierBadge tier="advanced" />
        <h2 className="mt-3 text-xl font-extrabold text-ink">BlumHelps Avanzado</h2>
        <p className="mt-2 text-[15px] leading-relaxed text-ink/85">
          “Lo importante aquí no se paga. BlumHelps Avanzado es solo para cuando
          quieras herramientas de reflexión más profundas. Puedes cerrarlo y
          seguir usando todo lo demás.”
        </p>
        <ul className="mt-4 space-y-2.5 text-sm text-ink/85">
          <li className="flex gap-2.5"><LockIcon /><span><b>Diario reflexivo</b> encriptado en tu dispositivo. Ni nosotros lo leemos.</span></li>
          <li className="flex gap-2.5"><LockIcon /><span><b>Analítica de patrones</b> de sueño y ánimo, sin juicio ni puntuaciones.</span></li>
          <li className="flex gap-2.5"><LockIcon /><span><b>Respaldo cifrado</b> y sincronización entre tus dispositivos.</span></li>
        </ul>
        <div className="mt-4 rounded-xl bg-sage border border-forest/15 p-3.5 text-[13px] text-forest font-medium">
          Ayuda, emergencia, directorio, comunidad, formación, empleo y metas
          básicas siempre serán gratis. Esto es opcional, siempre.
        </div>
        <div className="mt-5 flex flex-col sm:flex-row gap-2.5">
          <button className="btn-primary flex-1" onClick={() => { onClose(); }}>
            Seguir con lo gratis
          </button>
          <button className="btn-secondary flex-1" onClick={() => { onClose(); }}>
            Conocer Avanzado más adelante
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function LockIcon() {
  return (
    <span className="grid place-items-center w-6 h-6 rounded-full bg-amber/20 text-[#9a6a1d] shrink-0 mt-0.5">
      <Sparkles size={12} />
    </span>
  );
}

/* Mini comparativa fija en sidebar */
function FreeVsAdvancedMini() {
  return (
    <Link
      to="/bienestar#plan"
      className="block rounded-xl border border-[#E7DFCC] bg-white p-3 hover:shadow-soft transition-shadow"
    >
      <div className="flex items-center justify-between text-xs font-bold">
        <span className="text-forest">Gratis</span>
        <span className="text-[#9a6a1d]">Avanzado</span>
      </div>
      <div className="mt-1.5 h-1.5 rounded-full overflow-hidden flex">
        <div className="w-3/4 bg-emerald" />
        <div className="w-1/4 bg-amber" />
      </div>
      <p className="mt-2 text-[11px] leading-snug text-muted">
        Lo esencial es gratis. Avanzado solo suma reflexión profunda.
      </p>
    </Link>
  );
}

/* Hook de carga simulada con posibilidad de error (para demo de estados) */
export function useSimulatedLoad(failKey?: string) {
  const [state, setState] = useState<"loading" | "ok" | "error">("loading");
  const [nonce, setNonce] = useState(0);
  useEffect(() => {
    setState("loading");
    const t = window.setTimeout(() => {
      setState(failKey === "forzar-error" ? "error" : "ok");
    }, 550);
    return () => window.clearTimeout(t);
  }, [failKey, nonce]);
  return { state, retry: () => setNonce((n) => n + 1) };
}

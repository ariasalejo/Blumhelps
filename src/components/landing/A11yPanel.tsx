import React, { useEffect, useState } from 'react';
import { Accessibility, Contrast, Type, Eye, BookOpen, Book, Pause, Info, Volume2, X } from 'lucide-react';
import { Link } from 'react-router-dom';

type A11yAction = 'hc' | 'large' | 'readable' | 'dyslexic' | 'reading' | 'reduce-motion';

const options: Array<{ action: A11yAction; label: string; icon: typeof Contrast }> = [
  { action: 'hc', label: 'Alto contraste', icon: Contrast },
  { action: 'large', label: 'Texto grande', icon: Type },
  { action: 'readable', label: 'Fuente más legible', icon: Eye },
  { action: 'dyslexic', label: 'Fuente amigable', icon: BookOpen },
  { action: 'reading', label: 'Modo lectura', icon: Book },
  { action: 'reduce-motion', label: 'Reducir movimiento', icon: Pause },
];

export function A11yPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [enabled, setEnabled] = useState<Partial<Record<A11yAction, boolean>>>({});

  const toggleAction = (action: A11yAction) => {
    const next = !document.body.classList.contains(action);
    document.body.classList.toggle(action, next);
    setEnabled((current) => ({ ...current, [action]: next }));
  };

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, []);

  return (
    <div className="a11y-panel">
      {isOpen && (
        <div className="a11y-menu open" id="blum-a11y-dialog" role="dialog" aria-modal="false" aria-label="Opciones de accesibilidad">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="serif text-lg font-semibold">Accesibilidad</h2>
              <p className="mt-1 text-[10px] leading-4 text-[var(--cream)]/65">Ajusta la lectura a tu preferencia.</p>
            </div>
            <button type="button" onClick={() => setIsOpen(false)} aria-label="Cerrar opciones de accesibilidad" className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--lime)]">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-1">
            {options.map(({ action, label, icon: Icon }) => (
              <button
                key={action}
                type="button"
                className={`a11y-btn ${enabled[action] ? 'active' : ''}`}
                onClick={() => toggleAction(action)}
                aria-pressed={Boolean(enabled[action])}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                <span>{label}</span>
                <span className="ml-auto text-[10px] opacity-70">{enabled[action] ? 'Activado' : 'Desactivado'}</span>
              </button>
            ))}
          </div>
          <div className="mt-4 border-t border-white/10 pt-4">
            <Link to="/ayuda" onClick={() => setIsOpen(false)} className="flex items-center gap-2 rounded-xl bg-white/10 p-3 text-xs font-semibold text-[var(--cream)] transition hover:bg-white/15">
              <Volume2 className="h-4 w-4" aria-hidden="true" />
              Audios disponibles del catálogo
            </Link>
            <p className="mt-3 flex items-start gap-2 text-[10px] leading-4 text-[var(--cream)]/60">
              <Info className="mt-0.5 h-3 w-3 shrink-0" aria-hidden="true" />
              La disponibilidad de audio varía por recurso. La lectura completa de páginas con Piper sigue pendiente. Estas opciones no equivalen a una certificación WCAG.
            </p>
          </div>
        </div>
      )}
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="flex h-14 w-14 items-center justify-center rounded-full border border-white/15 bg-[#073638] text-[#c3edc8] shadow-2xl transition hover:-translate-y-0.5 hover:bg-[#105c51] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#207e68]"
        aria-label={isOpen ? 'Cerrar opciones de accesibilidad' : 'Abrir opciones de accesibilidad'}
        aria-expanded={isOpen}
        aria-controls="blum-a11y-dialog"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Accessibility className="h-5 w-5" />}
      </button>
    </div>
  );
}

import React, { useState } from 'react';
import { Moon, Sun, Download, HeartPulse } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Navbar() {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.body.classList.toggle('dark');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-ink" aria-label="Navegación principal">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-4 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2.5 group" aria-label="BlumHelps inicio">
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 bg-[var(--moss)] rounded-xl rotate-6 group-hover:rotate-12 transition-transform"></div>
            <div className="absolute inset-0 bg-[var(--lime)] rounded-xl -rotate-3 group-hover:-rotate-6 transition-transform flex items-center justify-center">
              <HeartPulse className="w-5 h-5 text-[var(--ink)]" />
            </div>
          </div>
          <div className="flex flex-col leading-none">
            <span className="serif text-xl font-semibold tracking-tight">BlumHelps</span>
            <span className="text-[10px] tracking-widest uppercase text-muted">Evidencia · Colombia</span>
          </div>
        </a>
        
        <div className="hidden lg:flex items-center gap-8 text-sm font-medium">
          <a href="#recursos" className="hover:text-[var(--moss)] transition">Recursos verificados</a>
          <a href="#evidencia" className="hover:text-[var(--moss)] transition">Evidencia científica</a>
          <a href="#metas" className="hover:text-[var(--moss)] transition">Metas</a>
          <a href="#fuentes" className="hover:text-[var(--moss)] transition">Fuentes</a>
          <Link to="/recuperacion/inicio" className="text-[var(--moss)] font-semibold hover:text-[var(--moss-deep)] transition">Mi Proceso</Link>
        </div>
        
        <div className="flex items-center gap-2">
          <button onClick={toggleTheme} className="w-10 h-10 rounded-full hover:bg-[var(--ink)]/5 flex items-center justify-center transition" aria-label="Cambiar tema">
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button className="hidden sm:flex bg-[var(--ink)] text-[var(--cream)] px-5 py-2.5 rounded-full text-sm font-medium hover:bg-[var(--moss)] transition items-center gap-2 btn-shine">
            Instalar PWA <Download className="w-4 h-4" />
          </button>
        </div>
      </div>
    </nav>
  );
}

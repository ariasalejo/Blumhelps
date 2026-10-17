import React from 'react';
import { Instagram, Twitter, Github } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[var(--ink)] text-[var(--cream)] pt-20 pb-10 px-6 lg:px-10 relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="mb-16 reveal">
          <h2 className="serif text-[clamp(3rem,12vw,10rem)] font-semibold leading-[0.85] tracking-tight">
            Blum<span className="italic text-[var(--lime)]">Helps</span>
          </h2>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-[var(--cream)]/10">
          <div className="lg:col-span-2">
            <p className="text-sm text-[var(--cream)]/70 leading-relaxed mb-6 max-w-sm">
              Plataforma de bienestar y recursos verificados para Colombia. Evidencia científica. Cero datos inventados. Privacidad local.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="w-10 h-10 rounded-full bg-[var(--cream)]/5 border border-[var(--cream)]/10 flex items-center justify-center hover:bg-[var(--lime)] hover:text-[var(--ink)] transition" aria-label="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-[var(--cream)]/5 border border-[var(--cream)]/10 flex items-center justify-center hover:bg-[var(--lime)] hover:text-[var(--ink)] transition" aria-label="Twitter">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-[var(--cream)]/5 border border-[var(--cream)]/10 flex items-center justify-center hover:bg-[var(--lime)] hover:text-[var(--ink)] transition" aria-label="GitHub">
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-xs tracking-widest uppercase text-[var(--cream)]/50 mb-4">Plataforma</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#recursos" className="hover:text-[var(--lime)] transition">Recursos verificados</a></li>
              <li><a href="#evidencia" className="hover:text-[var(--lime)] transition">Evidencia científica</a></li>
              <li><a href="#metas" className="hover:text-[var(--lime)] transition">Metas personales</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-xs tracking-widest uppercase text-[var(--cream)]/50 mb-4">Transparencia</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#fuentes" className="hover:text-[var(--lime)] transition">Todas las fuentes</a></li>
              <li><a href="#" className="hover:text-[var(--lime)] transition">Privacidad</a></li>
              <li><a href="#" className="hover:text-[var(--lime)] transition">Accesibilidad</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-xs tracking-widest uppercase text-[var(--cream)]/50 mb-4">Emergencias</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="tel:106" className="hover:text-[var(--lime)] transition font-semibold">Línea 106 · 24/7</a></li>
              <li><a href="tel:123" className="hover:text-[var(--lime)] transition font-semibold">Emergencias 123</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 flex flex-wrap items-center justify-between gap-4 text-xs text-[var(--cream)]/50">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--lime)] pulse-dot"></span>
            <span>Todos los sistemas operativos</span>
          </div>
          <p>© 2026 BlumHelps · Hecho con 🌱 en Colombia</p>
        </div>
      </div>
    </footer>
  );
}

import React from 'react';
import { ArrowRight, Microscope, ShieldCheck, BookOpenCheck, Lock, Accessibility, BadgeCheck, Play } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative min-h-screen pt-32 pb-20 px-6 lg:px-10 overflow-hidden">
      <div className="max-w-[1400px] mx-auto grid lg:grid-cols-12 gap-10 items-center relative z-10">
        <div className="lg:col-span-7 reveal">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--ink)]/5 border border-[var(--ink)]/10 mb-8">
            <span className="w-2 h-2 rounded-full bg-[var(--lime)] pulse-dot"></span>
            <span className="text-xs font-medium tracking-wide">Prospecto 2026 · Datos verificados · Cero invención</span>
          </div>
          
          <h1 className="serif text-[clamp(2.8rem,7vw,6.5rem)] font-semibold leading-[0.95] tracking-tight mb-8">
            Bienestar con<br/>
            <span className="gradient-text italic">evidencia,</span><br/>
            no con promesas.
          </h1>
          
          <p className="text-lg md:text-xl text-muted max-w-xl leading-relaxed mb-10">
            Una plataforma que conecta personas con <strong className="text-[var(--ink)]">recursos verificados de fuentes oficiales colombianas</strong> y planes de bienestar respaldados por investigación científica.
          </p>
          
          <div className="flex flex-wrap items-center gap-4 mb-12">
            <a href="#recursos" className="bg-[var(--ink)] text-[var(--cream)] px-8 py-4 rounded-full font-medium hover:bg-[var(--moss)] transition flex items-center gap-3 btn-shine group">
              <span>Explorar recursos reales</span>
              <div className="w-8 h-8 rounded-full bg-[var(--lime)] flex items-center justify-center group-hover:rotate-45 transition-transform">
                <ArrowRight className="w-4 h-4 text-[var(--ink)]" />
              </div>
            </a>
            <a href="#evidencia" className="flex items-center gap-3 px-6 py-4 rounded-full font-medium hover:bg-[var(--ink)]/5 transition">
              <div className="w-10 h-10 rounded-full border-2 border-[var(--ink)] flex items-center justify-center">
                <Microscope className="w-4 h-4" />
              </div>
              <span>Ver la ciencia</span>
            </a>
          </div>
          
          <div className="flex flex-wrap gap-x-8 gap-y-4 pt-8 border-t border-[var(--ink)]/10">
            <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-[var(--moss)]" /><span className="text-sm">Fuentes oficiales</span></div>
            <div className="flex items-center gap-2"><BookOpenCheck className="w-4 h-4 text-[var(--moss)]" /><span className="text-sm">Evidencia científica</span></div>
            <div className="flex items-center gap-2"><Lock className="w-4 h-4 text-[var(--moss)]" /><span className="text-sm">Privacidad local</span></div>
            <div className="flex items-center gap-2"><Accessibility className="w-4 h-4 text-[var(--moss)]" /><span className="text-sm">WCAG 2.2 AA</span></div>
          </div>
        </div>
        
        <div className="lg:col-span-5 relative reveal" style={{transitionDelay: '0.2s'}}>
          <div className="absolute -top-20 -right-20 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[var(--lime)]/30 via-[var(--gold)]/20 to-[var(--terra)]/20 blur-3xl"></div>
          
          <div className="absolute -top-4 -left-4 z-30 glass rounded-2xl p-4 shadow-2xl float">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[var(--moss)] flex items-center justify-center">
                <BadgeCheck className="w-5 h-5 text-[var(--lime)]" />
              </div>
              <div>
                <div className="text-[10px] text-muted uppercase tracking-wider">Verificado</div>
                <div className="text-sm font-semibold">Alcaldía de Medellín</div>
              </div>
            </div>
          </div>
          
          <div className="relative mx-auto w-[300px] float" style={{animationDelay: '1s'}}>
            <div className="relative bg-[var(--ink)] rounded-[3rem] p-3 shadow-2xl">
              <div className="bg-[var(--cream)] rounded-[2.5rem] overflow-hidden h-[600px] relative">
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-7 bg-[var(--ink)] rounded-full z-20"></div>
                <div className="h-full overflow-hidden pt-12 px-4 flex flex-col justify-center items-center text-center p-8">
                  <BadgeCheck className="w-16 h-16 text-[var(--moss)] mb-4" />
                  <h3 className="serif text-2xl font-bold mb-2">100% Real</h3>
                  <p className="text-sm text-muted">Sin datos inventados. Solo fuentes oficiales colombianas verificadas.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

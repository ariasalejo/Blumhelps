import React from 'react';
import { Microscope, Award, MessageCircleHeart, Brain, Shield, Flower2, ExternalLink, GitBranch, BookOpen } from 'lucide-react';

export function Evidence() {
  return (
    <section id="evidencia" className="py-28 px-6 lg:px-10 bg-[var(--ink)] text-[var(--cream)] relative overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--moss)]/40 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[var(--terra)]/30 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="grid lg:grid-cols-12 gap-10 mb-16 reveal">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--lime)]/10 text-[var(--lime)] text-xs font-medium tracking-wide mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--lime)]"></span>
              02 · Evidencia científica
            </div>
            <h2 className="serif text-5xl md:text-6xl font-semibold leading-[0.95] tracking-tight mb-6">
              Planes que<br/><span className="italic gradient-text">sí funcionan.</span>
            </h2>
            <p className="text-lg text-[var(--cream)]/70 leading-relaxed max-w-xl">
              Los planes de bienestar que recomendamos están respaldados por investigación peer-reviewed, guías clínicas internacionales y revisiones sistemáticas.
            </p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-5">
          <article className="surface-alt bg-[var(--cream)]/5 border border-[var(--cream)]/10 rounded-3xl p-8 hover-lift relative overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <span className="evidence-badge bg-[var(--lime)]/10 text-[var(--lime)]"><Microscope className="w-3 h-3" /> Evidencia alta</span>
              <span className="text-[10px] text-[var(--cream)]/50">Cochrane · Miller & Rollnick</span>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-[var(--lime)] flex items-center justify-center mb-6">
              <MessageCircleHeart className="w-7 h-7 text-[var(--ink)]" />
            </div>
            <h3 className="serif text-3xl font-semibold mb-3">Entrevista Motivacional</h3>
            <p className="text-sm text-[var(--cream)]/70 leading-relaxed mb-5">
              Enfoque colaborativo centrado en la persona para fortalecer la motivación intrínseca al cambio. Eficaz en consumo de sustancias y cambios de comportamiento.
            </p>
            <a href="https://motivationalinterviewing.org" target="_blank" rel="noopener noreferrer" className="source-link" style={{background: 'rgba(212,241,92,0.1)', color: 'var(--lime)'}}>
              <ExternalLink className="w-3 h-3" /> MINT · Red oficial
            </a>
          </article>

          <article className="surface-alt bg-[var(--cream)]/5 border border-[var(--cream)]/10 rounded-3xl p-8 hover-lift relative overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <span className="evidence-badge bg-[var(--lime)]/10 text-[var(--lime)]"><Microscope className="w-3 h-3" /> Evidencia alta</span>
              <span className="text-[10px] text-[var(--cream)]/50">NICE · APA</span>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-[var(--gold)] flex items-center justify-center mb-6">
              <Brain className="w-7 h-7 text-[var(--ink)]" />
            </div>
            <h3 className="serif text-3xl font-semibold mb-3">Terapia Cognitivo-Conductual</h3>
            <p className="text-sm text-[var(--cream)]/70 leading-relaxed mb-5">
              Enfoque estructurado que identifica y modifica patrones de pensamiento y comportamiento disfuncionales. Recomendada por NICE y APA.
            </p>
            <a href="https://www.nice.org.uk/guidance" target="_blank" rel="noopener noreferrer" className="source-link" style={{background: 'rgba(212,184,150,0.1)', color: 'var(--gold)'}}>
              <ExternalLink className="w-3 h-3" /> Guías NICE
            </a>
          </article>
        </div>

        <div className="mt-10 p-8 rounded-3xl bg-gradient-to-br from-[var(--moss)] to-[var(--moss-deep)] text-[var(--cream)] reveal">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--lime)]/10 text-[var(--lime)] text-xs font-medium tracking-wide mb-4">
                <GitBranch className="w-3 h-3" /> Modelo Transteórico
              </div>
              <h3 className="serif text-3xl font-semibold mb-3">Las etapas del cambio</h3>
              <p className="text-sm text-[var(--cream)]/70 leading-relaxed mb-4">
                Prochaska y DiClemente (1983) identificaron que el cambio no es lineal. BlumHelps respeta tu etapa actual.
              </p>
              <a href="#" className="source-link" style={{background: 'rgba(212,241,92,0.1)', color: 'var(--lime)'}}>
                <BookOpen className="w-3 h-3" /> Prochaska & DiClemente, 1983
              </a>
            </div>
            <div className="space-y-2">
              {['Precontemplación', 'Contemplación', 'Preparación', 'Acción', 'Mantenimiento'].map((stage, i) => (
                <div key={i} className={`flex items-center gap-3 p-3 rounded-xl ${i === 3 ? 'bg-[var(--lime)]/10 border border-[var(--lime)]/30' : 'bg-white/5 border border-white/10'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${i === 3 ? 'bg-[var(--lime)] text-[var(--ink)]' : 'bg-white/10'}`}>{i + 1}</div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold">{stage}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

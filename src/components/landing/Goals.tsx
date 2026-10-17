import React from 'react';
import { Footprints, Pause, Check, BookOpen, Play, Archive, Sparkles, Award, Plus } from 'lucide-react';

export function Goals() {
  return (
    <section id="metas" className="py-28 px-6 lg:px-10 bg-[var(--ink)] text-[var(--cream)] relative overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-[var(--moss)]/40 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-[var(--terra)]/30 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="grid lg:grid-cols-12 gap-10 mb-16 reveal">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--lime)]/10 text-[var(--lime)] text-xs font-medium tracking-wide mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--lime)]"></span>
              04 · Bienestar personal
            </div>
            <h2 className="serif text-5xl md:text-6xl font-semibold leading-[0.95] tracking-tight mb-6">
              Tus metas,<br/><span className="italic gradient-text">a tu ritmo.</span>
            </h2>
            <p className="text-lg text-[var(--cream)]/70 leading-relaxed max-w-xl">
              Sin rachas punitivas. Sin juicios. Pausa, retoma o completa cuando estés lista. Tus datos se guardan solo en tu dispositivo.
            </p>
          </div>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-5">
          <div className="surface-alt bg-gradient-to-br from-[var(--moss)] to-[var(--moss-deep)] rounded-3xl p-7 hover-lift relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-[var(--lime)]/20 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-5">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--lime)] text-[var(--ink)] text-xs font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--ink)] pulse-dot"></span> Activa
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-[var(--lime)] flex items-center justify-center mb-5">
                <Footprints className="w-6 h-6 text-[var(--ink)]" />
              </div>
              <h3 className="serif text-2xl font-semibold mb-2">Caminar 15 minutos</h3>
              <p className="text-sm text-[var(--cream)]/70 mb-5">Un pequeño movimiento que cambia el día.</p>
              <div className="flex gap-2">
                <button className="flex-1 bg-white/10 border border-white/20 py-2.5 rounded-xl text-xs font-medium hover:bg-white/20 transition flex items-center justify-center gap-2">
                  <Pause className="w-3.5 h-3.5" /> Pausar
                </button>
                <button className="flex-1 bg-[var(--lime)] text-[var(--ink)] py-2.5 rounded-xl text-xs font-semibold hover:bg-[var(--cream)] transition flex items-center justify-center gap-2">
                  <Check className="w-3.5 h-3.5" /> Completar
                </button>
              </div>
            </div>
          </div>
          
          <div className="surface-alt bg-[var(--cream)]/5 border border-[var(--cream)]/10 rounded-3xl p-7 hover-lift">
            <div className="flex items-center justify-between mb-5">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--gold)]/20 text-[var(--gold)] text-xs font-semibold">
                <Pause className="w-3 h-3" /> Pausada
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[var(--gold)]/20 flex items-center justify-center mb-5">
              <BookOpen className="w-6 h-6 text-[var(--gold)]" />
            </div>
            <h3 className="serif text-2xl font-semibold mb-2">Leer 10 páginas</h3>
            <p className="text-sm text-[var(--cream)]/70 mb-5">Antes de dormir. Un ritual que calma.</p>
            <div className="flex gap-2">
              <button className="flex-1 bg-[var(--gold)] text-[var(--ink)] py-2.5 rounded-xl text-xs font-semibold hover:bg-[var(--cream)] transition flex items-center justify-center gap-2">
                <Play className="w-3.5 h-3.5" /> Retomar
              </button>
              <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition">
                <Archive className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          
          <div className="surface-alt bg-gradient-to-br from-[var(--terra)] to-[var(--ink)] rounded-3xl p-7 hover-lift relative overflow-hidden">
            <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-[var(--gold)]/20 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-5">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--cream)] text-[var(--ink)] text-xs font-semibold">
                  <Check className="w-3 h-3" /> Completada
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-[var(--cream)] flex items-center justify-center mb-5">
                <Sparkles className="w-6 h-6 text-[var(--terra)]" />
              </div>
              <h3 className="serif text-2xl font-semibold mb-2">Llamar a un amigo</h3>
              <p className="text-sm text-[var(--cream)]/70 mb-5">Reconectar con alguien que importa.</p>
              <button className="w-full bg-[var(--cream)]/10 border border-[var(--cream)]/20 py-2.5 rounded-xl text-xs font-medium hover:bg-[var(--cream)]/20 transition flex items-center justify-center gap-2">
                <Plus className="w-3.5 h-3.5" /> Nueva meta similar
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

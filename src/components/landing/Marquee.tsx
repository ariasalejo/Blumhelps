import React from 'react';

export function Marquee() {
  const content = (
    <div className="flex items-center gap-14 px-6 serif text-3xl md:text-5xl font-semibold italic">
      <span>Fuentes oficiales</span><span className="text-[var(--lime)]">✦</span>
      <span>Evidencia científica</span><span className="text-[var(--lime)]">✦</span>
      <span>Cero datos inventados</span><span className="text-[var(--lime)]">✦</span>
      <span>Privacidad local</span><span className="text-[var(--lime)]">✦</span>
      <span>Accesibilidad WCAG 2.2</span><span className="text-[var(--lime)]">✦</span>
      <span>Hecho en Colombia</span><span className="text-[var(--lime)]">✦</span>
    </div>
  );

  return (
    <section className="py-10 border-y border-ink bg-[var(--ink)] text-[var(--cream)] overflow-hidden relative">
      <div className="marquee whitespace-nowrap">
        {content}
        {content}
      </div>
    </section>
  );
}

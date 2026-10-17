import React from 'react';
import { Building2, ExternalLink, Landmark, Baby, HeartPulse, Home, Globe, BookOpenCheck, Microscope, MessageCircleHeart, AlertCircle } from 'lucide-react';

export function Sources() {
  const sources = [
    { name: "MinSalud Colombia", desc: "Ministerio de Salud y Protección Social", icon: <Building2 className="w-5 h-5 text-[var(--lime)]" />, bg: "bg-[var(--moss)]", link: "https://www.minsalud.gov.co" },
    { name: "Alcaldía de Medellín", desc: "Secretaría de Salud · Centros de Escuche", icon: <Landmark className="w-5 h-5 text-[var(--cream)]" />, bg: "bg-[var(--terra)]", link: "https://www.medellin.gov.co" },
    { name: "ICBF", desc: "Instituto Colombiano de Bienestar Familiar", icon: <Baby className="w-5 h-5 text-[var(--cream)]" />, bg: "bg-[var(--accent)]", link: "https://www.icbf.gov.co" },
    { name: "E.S.E. Hospital Carisma", desc: "Salud mental · Antioquia", icon: <HeartPulse className="w-5 h-5 text-[var(--lime)]" />, bg: "bg-[var(--moss-deep)]", link: "https://www.esecarisma.gov.co" },
    { name: "Fundación Hogares Claret", desc: "Programas terapéuticos", icon: <Home className="w-5 h-5 text-[var(--cream)]" />, bg: "bg-[var(--clay)]", link: "https://www.fundacionhogaresclaret.com" },
    { name: "OMS / OPS", desc: "Organización Mundial de la Salud", icon: <Globe className="w-5 h-5 text-[var(--cream)]" />, bg: "bg-[var(--sage)]", link: "https://www.who.int" }
  ];

  return (
    <section id="fuentes" className="py-28 px-6 lg:px-10 relative">
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center mb-16 reveal">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--moss)]/10 text-[var(--moss)] text-xs font-medium tracking-wide mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--moss)]"></span>
            05 · Transparencia total
          </div>
          <h2 className="serif text-5xl md:text-6xl font-semibold leading-[0.95] tracking-tight mb-6">
            Todas nuestras<br/><span className="italic">fuentes.</span>
          </h2>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sources.map((s, i) => (
            <a key={i} href={s.link} target="_blank" rel="noopener noreferrer" className="surface bg-white rounded-2xl p-5 border border-ink hover-lift flex items-start gap-4">
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0`}>
                {s.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-sm truncate">{s.name}</h4>
                  <ExternalLink className="w-3 h-3 text-muted flex-shrink-0" />
                </div>
                <p className="text-xs text-muted">{s.desc}</p>
              </div>
            </a>
          ))}
        </div>
        
        <div className="mt-12 p-8 rounded-3xl bg-[var(--accent)]/5 border border-[var(--accent)]/20 reveal">
          <div className="flex items-start gap-5">
            <div className="w-12 h-12 rounded-full bg-[var(--accent)]/20 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-6 h-6 text-[var(--accent)]" />
            </div>
            <div>
              <h4 className="serif text-xl font-semibold mb-2">Aviso importante</h4>
              <p className="text-sm text-muted leading-relaxed mb-3">
                BlumHelps <strong>no es un servicio médico, psicológico, jurídico ni de emergencias</strong>. La información aquí presentada es orientativa.
              </p>
              <p className="text-sm text-muted leading-relaxed">
                <strong>Ante una crisis o emergencia:</strong> llama a la <a href="tel:106" className="underline font-semibold">Línea 106</a> o al <a href="tel:123" className="underline font-semibold">123</a>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import React from 'react';
import { ShieldCheck, Check, MapPin, Phone, Mail, ExternalLink, Bookmark, Scale, AlertCircle, Briefcase, Users, Baby } from 'lucide-react';
import { verifiedResources, type VerifiedResource } from '../../data/verifiedResources';

// Mapeo de íconos según la categoría para hacerlo dinámico y profesional
const categoryIcons: Record<string, React.ReactNode> = {
  'Emergencia': <Phone className="w-6 h-6 text-[var(--cream)]" />,
  'Salud Mental': <ShieldCheck className="w-6 h-6 text-[var(--lime)]" />,
  'Reinserción Laboral': <Briefcase className="w-6 h-6 text-[var(--gold)]" />,
  'Familia': <Users className="w-6 h-6 text-[var(--terra)]" />,
  'Formación': <Baby className="w-6 h-6 text-[var(--sage)]" />
};

const categoryColors: Record<string, string> = {
  'Emergencia': 'bg-[var(--accent)]',
  'Salud Mental': 'bg-[var(--moss)]',
  'Reinserción Laboral': 'bg-[var(--gold)]',
  'Familia': 'bg-[var(--terra)]',
  'Formación': 'bg-[var(--sage)]'
};

export function Resources() {
  return (
    <section id="recursos" className="py-28 px-6 lg:px-10 relative">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid lg:grid-cols-12 gap-10 mb-16 reveal">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--moss)]/10 text-[var(--moss)] text-xs font-medium tracking-wide mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--moss)]"></span>
              01 · Catálogo Validado
            </div>
            <h2 className="serif text-5xl md:text-6xl font-semibold leading-[0.95] tracking-tight mb-6">
              Datos estructurados,<br/><span className="italic">no promesas vacías.</span>
            </h2>
            <p className="text-lg text-muted leading-relaxed max-w-xl">
              Cada recurso pasa por un esquema de validación estricto (Zod). Si falta la fuente, la fecha de verificación o el contacto, el sistema lo rechaza. Cero alucinaciones, 100% trazabilidad.
            </p>
          </div>
          <div className="lg:col-span-5 flex items-end">
            <div className="w-full p-6 rounded-2xl bg-[var(--ink)]/5 border border-ink">
              <div className="flex items-center gap-3 mb-4">
                <ShieldCheck className="w-6 h-6 text-[var(--moss)]" />
                <h3 className="serif text-xl font-semibold">Protocolo de Integridad</h3>
              </div>
              <ul className="space-y-2 text-sm text-muted">
                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-[var(--moss)] mt-0.5 flex-shrink-0" /> Validación de esquemas con Zod en runtime</li>
                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-[var(--moss)] mt-0.5 flex-shrink-0" /> Fuentes oficiales con URL verificable</li>
                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-[var(--moss)] mt-0.5 flex-shrink-0" /> Fecha de última verificación obligatoria</li>
                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-[var(--moss)] mt-0.5 flex-shrink-0" /> Requisitos de acceso explícitos para el usuario</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {verifiedResources.map((resource) => {
            const Icon = categoryIcons[resource.category] || <AlertCircle className="w-6 h-6 text-[var(--cream)]" />;
            const bgColor = categoryColors[resource.category] || 'bg-[var(--moss)]';

            return (
              <article key={resource.id} className="surface bg-white rounded-3xl p-7 hover-lift card-shine relative overflow-hidden border border-ink flex flex-col">
                <div className="flex items-center justify-between mb-5">
                  <span className="verified-pill"><Check className="w-3 h-3" /> {resource.category}</span>
                  <span className="text-[10px] text-muted">Verificado: {resource.lastVerified}</span>
                </div>
                
                <div className={`w-12 h-12 rounded-2xl ${bgColor} flex items-center justify-center mb-5`}>
                  {Icon}
                </div>
                
                <h3 className="serif text-2xl font-semibold mb-2">{resource.name}</h3>
                <p className="text-sm text-muted leading-relaxed mb-4 flex-grow">{resource.description}</p>
                
                <div className="space-y-2 text-xs text-muted mb-4">
                  <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5" /> {resource.location}</div>
                  <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> {resource.contactInfo}</div>
                  {resource.requirements && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <span className="font-semibold text-[var(--ink)] block mb-1">Requisitos:</span>
                      <ul className="list-disc list-inside space-y-1">
                        {resource.requirements.map((req, idx) => (
                          <li key={idx}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                
                <a href={resource.source} target="_blank" rel="noopener noreferrer" className="source-link mb-4 mt-auto">
                  <ExternalLink className="w-3 h-3" /> Fuente oficial
                </a>
                
                <div className="flex gap-2">
                  <a href={resource.contactInfo.startsWith('http') ? resource.contactInfo : `tel:${resource.contactInfo}`} 
                     className="flex-1 bg-[var(--moss)] text-[var(--cream)] py-3 rounded-xl text-sm font-medium hover:bg-[var(--moss-deep)] transition flex items-center justify-center gap-2">
                    <Phone className="w-4 h-4" /> Contactar
                  </a>
                  <button className="w-12 h-12 rounded-xl bg-[var(--ink)]/5 border border-ink flex items-center justify-center hover:bg-[var(--ink)]/10 transition" aria-label="Guardar recurso">
                    <Bookmark className="w-4 h-4" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-10 p-6 rounded-2xl bg-[var(--moss)]/5 border border-[var(--moss)]/20 flex items-start gap-4 reveal">
          <Scale className="w-6 h-6 text-[var(--moss)] flex-shrink-0 mt-1" />
          <div>
            <h4 className="font-semibold mb-1">Marco legal y transparencia</h4>
            <p className="text-sm text-muted leading-relaxed">
              La <strong>Ley 1566 de 2012</strong> garantiza el derecho a la atención integral. BlumHelps actúa como un puente de información validada, no como un prestador de servicios médicos. 
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

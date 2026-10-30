import React, { useState } from 'react';
import { Briefcase, GraduationCap, Gift, Mic, PlayCircle, ExternalLink, Sparkles, CheckCircle2, ArrowRight, ShieldCheck, Clock, Search, XCircle, MapPin } from 'lucide-react';
import { OPPORTUNITIES } from '../engines/opportunityMatcher';
import { checkOpportunity } from '../engines/opportunityVerifier';

type Filter = 'todos' | 'curso' | 'empleo' | 'beca' | 'podcast' | 'video' | 'reinsercion' | 'medellin' | 'sin-experiencia';

const ICONS: Record<string, any> = {
  curso: GraduationCap,
  empleo: Briefcase,
  beca: Gift,
  podcast: Mic,
  video: PlayCircle,
  incentivo: Gift
};

export function Oportunidades() {
  const [filter, setFilter] = useState<Filter>('todos');
  const [query, setQuery] = useState('');

  const filtered = OPPORTUNITIES.filter(o => {
    if (filter === 'todos') return true;
    if (filter === 'reinsercion') return o.tags.includes('reinsercion') || o.tags.includes('segunda-oportunidad');
    if (filter === 'medellin') return o.tags.some(t => t.includes('medellin'));
    if (filter === 'sin-experiencia') return o.tags.includes('sin-experiencia');
    return o.type === filter;
  }).filter(o => {
    const q = query.trim().toLocaleLowerCase('es-CO');
    if (!q) return true;
    return [o.title, o.description, o.provider, o.target, o.location, ...o.tags].join(' ').toLocaleLowerCase('es-CO').includes(q);
  });

  return (
    <main className="bl-opportunities-page max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 min-h-screen">
      <header className="mb-6">
        <div className="flex items-center gap-2 text-[var(--moss)] mb-2">
          <Sparkles className="w-5 h-5" />
          <span className="text-sm font-semibold">Empleo • Capacitación • Becas • Historias que inspiran</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold serif">Oportunidades para salir adelante</h1>
        <p className="mt-3 text-lg text-gray-700 max-w-3xl">
          Formación, empleo, oficios y recursos para explorar un siguiente paso. Priorizamos opciones útiles para <strong>Medellín y Antioquia</strong>, sin asumir que todas las convocatorias estén abiertas.
        </p>
      </header>
      <div className="bl-opportunity-trust mb-5"><ShieldCheck className="h-5 w-5 shrink-0"/><p><strong>Transparencia:</strong> las ofertas pueden cambiar. Comprueba fechas, requisitos, costos y cobertura directamente con la entidad antes de compartir documentos o postularte.</p></div>

      <div className="flex flex-wrap gap-2 mb-6">
        <button onClick={() => setFilter('todos')} className={`px-3 py-1.5 rounded-full text-sm ${filter==='todos' ? 'bg-[var(--moss)] text-white' : 'bg-white border border-gray-200'}`}>Todos</button>
        <button onClick={() => setFilter('reinsercion')} className={`px-3 py-1.5 rounded-full text-sm ${filter==='reinsercion' ? 'bg-[var(--moss)] text-white' : 'bg-white border border-gray-200'}`}>Reinserción / 2da oportunidad</button>
        <button onClick={() => setFilter('medellin')} className={`px-3 py-1.5 rounded-full text-sm ${filter==='medellin' ? 'bg-[var(--moss)] text-white' : 'bg-white border border-gray-200'}`}>Medellín + Antioquia</button>
        <button onClick={() => setFilter('sin-experiencia')} className={`px-3 py-1.5 rounded-full text-sm ${filter==='sin-experiencia' ? 'bg-[var(--moss)] text-white' : 'bg-white border border-gray-200'}`}>Sin experiencia</button>
        <button onClick={() => setFilter('curso')} className={`px-3 py-1.5 rounded-full text-sm ${filter==='curso' ? 'bg-[var(--moss)] text-white' : 'bg-white border border-gray-200'}`}>Cursos</button>
        <button onClick={() => setFilter('empleo')} className={`px-3 py-1.5 rounded-full text-sm ${filter==='empleo' ? 'bg-[var(--moss)] text-white' : 'bg-white border border-gray-200'}`}>Empleo</button>
        <button onClick={() => setFilter('beca')} className={`px-3 py-1.5 rounded-full text-sm ${filter==='beca' ? 'bg-[var(--moss)] text-white' : 'bg-white border border-gray-200'}`}>Becas</button>
        <button onClick={() => setFilter('podcast')} className={`px-3 py-1.5 rounded-full text-sm ${filter==='podcast' ? 'bg-[var(--moss)] text-white' : 'bg-white border border-gray-200'}`}>Podcasts</button>
        <button onClick={() => setFilter('video')} className={`px-3 py-1.5 rounded-full text-sm ${filter==='video' ? 'bg-[var(--moss)] text-white' : 'bg-white border border-gray-200'}`}>Videos</button>
      </div>

      <div className="bl-opportunity-search mb-5"><Search className="h-5 w-5 text-cyan-800" aria-hidden="true"/><label htmlFor="opportunity-search" className="sr-only">Buscar oportunidades</label><input id="opportunity-search" type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Buscar cursos, empleo, entidad, modalidad o requisito…"/>{query && <button type="button" onClick={() => setQuery("")} aria-label="Limpiar búsqueda"><XCircle className="h-5 w-5"/></button>}</div>
      <p className="mb-4 text-sm text-slate-600" aria-live="polite">Mostrando <strong>{filtered.length}</strong> de {OPPORTUNITIES.length} opciones. Confirma la disponibilidad con cada entidad.</p>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map(op => {
          const Icon = ICONS[op.type] || Briefcase;
          return (
              <article key={op.id} className="rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 overflow-hidden flex flex-col">
              <div className="p-5 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[var(--moss)]/15 to-[var(--lime)]/10 text-[var(--moss)] flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 capitalize">{op.type}</span>
                      <div className="text-xs text-gray-500 mt-1"><MapPin className="mr-1 inline h-3 w-3"/>{op.provider} • {op.location}</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {op.free && <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-semibold">Sin costo anunciado*</span>}
                    {(() => {
                      const lastVerified = (op as any).lastVerified as string | undefined;
                      const v = lastVerified ? checkOpportunity(lastVerified) : null;
                      return v ? <span className={`text-xs px-2 py-0.5 rounded-full ${v.color}`} title={v.advice}><Clock className="w-3 h-3 inline mr-1"/>{v.label}</span> : <span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-800" title="No hay fecha documentada de revisión reciente. Confirma la información con la entidad.">Por confirmar</span>;
                    })()}
                  </div>
                </div>
                <h3 className="mt-3 text-lg sm:text-xl font-semibold leading-tight">{op.title}</h3>
                <p className="mt-2 text-sm text-gray-700 leading-relaxed">{op.description}</p>
                <div className="mt-4 space-y-3">
                  <div>
                    <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider">¿Para quién?</div>
                    <p className="mt-1 text-sm text-gray-700">{op.target}</p>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Requisitos</div>
                    <ul className="mt-1 space-y-1">
                      {op.requirements.slice(0, 3).map((r, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700"><CheckCircle2 className="w-4 h-4 text-[var(--moss)] mt-0.5"/>{r}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Cómo inscribirse</div>
                    <ol className="mt-1 space-y-1">
                      {op.howToApply.slice(0, 3).map((h, i) => (
                        <li key={i} className="text-sm text-gray-700"><span className="text-[var(--moss)] font-semibold">{i+1}.</span> {h}</li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
              <div className="p-5 pt-0">
                <a href={op.url} target="_blank" rel="noopener noreferrer" className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[var(--moss)] to-[var(--moss-deep)] text-white hover:opacity-95 transition">
                  Consultar entidad oficial <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </article>
          )
        })}
      </div>

      {filtered.length === 0 && <div className="bl-opportunity-empty"><Search className="h-8 w-8"/><h2>No encontramos coincidencias</h2><p>Prueba con otra palabra o limpia la búsqueda para ver todas las opciones.</p><button type="button" onClick={() => { setQuery(""); setFilter("todos"); }}>Ver todas las oportunidades</button></div>}
      <p className="mt-5 text-xs leading-relaxed text-slate-500">*“Sin costo anunciado” no garantiza que todos los cursos, certificados, materiales o trámites sean gratuitos. Las condiciones dependen de cada convocatoria y entidad. BLUMHelps no representa a estas organizaciones ni garantiza cupos, contratación o admisión.</p>

      <div className="mt-10 rounded-2xl border border-[var(--moss)]/30 bg-gradient-to-br from-[var(--moss)]/5 to-white p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[var(--moss)]/10 text-[var(--moss)] flex items-center justify-center">
            <ArrowRight className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-bold serif">Consejo práctico</h3>
            <p className="mt-2 text-gray-700 max-w-3xl">Empieza con <strong>UN SOLO</strong> curso, oficio o ruta. Completar algo pequeño genera motivación real. No busques hacerlo perfecto, busca dar ese primer paso hoy.</p>
            <p className="mt-2 text-sm text-gray-600">Pedir ayuda para inscribirte también es válido. Puedes ir acompañado(a) al SENA o a la Agencia de Empleo de Medellín.</p>
          </div>
        </div>
      </div>
    </main>
  );
}

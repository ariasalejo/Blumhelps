import React, { useState } from 'react';
import { Phone, MapPin, Users, HeartHandshake } from 'lucide-react';
import { verifiedResourcesAll } from '../data/verifiedResources';

type Filter = 'todos' | 'lineas' | 'presencial' | 'familiares' | 'medellin';

export function Help() {
  const [filter, setFilter] = useState<Filter>('todos');

  const filtered = verifiedResourcesAll.filter(r => {
    if (filter === 'todos') return true;
    if (filter === 'lineas') return r.category === 'Emergencia' || /^\d+$/.test(r.contactInfo);
    if (filter === 'presencial') return r.category === 'Salud Mental' || r.name.toLowerCase().includes('medellín') || r.location.toLowerCase().includes('medellín') || r.location.toLowerCase().includes('antioquia');
    if (filter === 'familiares') return r.category === 'Familia';
    if (filter === 'medellin') return r.location.toLowerCase().includes('medellín') || r.location.toLowerCase().includes('antioquia') || r.name.toLowerCase().includes('medellín') || r.name.toLowerCase().includes('antioquia');
    return true;
  });

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 min-h-screen">
      <header className="mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold serif">Recursos Verificados</h1>
        <p className="mt-2 text-grayalok bur 700">Líneas 24/7, atención presencial y apoyo para familiares. Enfocado a Medellín y Antioquia.</p>
      </header>

      <div className="flex flex-wrap gap-2 mb-6">
        <button onClick={() => setFilter('todos')} className={`px-3 py-1.5 rounded-full text-sm ${filter==='todos' ? 'bg-[var(--moss)] text-white' : 'bg-white border border-gray-200'}`}>Todos</button>
        <button onClick={() => setFilter('medellin')} className={`px-3 py-1.5 rounded-full text-sm ${filter==='medellin' ? 'bg-[var(--moss)] text-white' : 'bg-white border border-gray-200'}`}>Medellín + Antioquia</button>
        <button onClick={() => setFilter('lineas')} className={`px-3 py-1.5 rounded-full text-sm ${filter==='lineas' ? 'bg-[var(--moss)] text-white' : 'bg-white border border-gray-200'}`}>Líneas 24/7</button>
        <button onClick={() => setFilter('presencial')} className={`px-3 py-1.5 rounded-full text-sm ${filter==='presencial' ? 'bg-[var(--moss)] text-white' : 'bg-white border border-gray-200'}`}>Presencial</button>
        <button onClick={() => setFilter('familiares')} className={`px-3 py-1.5 rounded-full text-sm ${filter==='familiares' ? 'bg-[var(--moss)] text-white' : 'bg-white border border-gray-200'}`}>Para Familiares</button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map(r => (
          <article key={r.id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs px-2 py-1 rounded-full bg-[var(--moss)]/10 text-[var(--moss)]">{r.category}</span>
                <h3 className="mt-2 text-lg font-semibold">{r.name}</h3>
              </div>
              {r.isVerified && <span className="text-xs text-emerald-700">✓ Verificado</span>}
            </div>
            <p className="mt-2 text-sm text-gray-700 leading-relaxed">{r.description}</p>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-600">
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5"/>{r.location}</span>
              <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5"/>{r.source.replace('https://','')}</span>
            </div>
            <div className="mt-4">
              <a href={r.contactInfo.startsWith('http') ? r.contactInfo : `tel:${r.contactInfo}`} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--moss)] text-white hover:bg-[var(--moss-deep)]">
                <Phone className="w-4 h-4"/>
                {r.contactInfo.startsWith('http') ? 'Ver información' : `Llamar ahora: ${r.contactInfo}`}
              </a>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5">
        <div className="flex items-start gap-3">
          <HeartHandshake className="w-5 h-5 text-red-700 mt-0.5"/>
          <div>
            <h3 className="font-semibold text-red-800">Si hay riesgo inmediato</h3>
            <p className="mt-1 text-sm text-red-700">Llama al <a href="tel:106" className="underline font-semibold">106</a> o <a href="tel:123" className="underline font-semibold">123</a>. Atención 24/7, anónima y sin juicios.</p>
          </div>
        </div>
      </div>
    </main>
  );
}

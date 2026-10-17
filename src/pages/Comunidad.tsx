import React, { useState } from 'react';

interface SupportGroup {
  id: string;
  name: string;
  description: string;
  schedule: string;
  modality: 'Presencial' | 'Virtual' | 'Híbrido';
  location: string;
  contact: string;
  verified: boolean;
}

const supportGroups: SupportGroup[] = [
  {
    id: '1',
    name: 'Grupos de Apoyo Anónimos (AA) Medellín',
    description: 'Reuniones semanales para personas con problemas de alcoholismo. Ambiente seguro y confidencial.',
    schedule: 'Lunes, Miércoles, Viernes - 7:00 PM',
    modality: 'Presencial',
    location: 'Calle 50 #45-12, Centro, Medellín',
    contact: '(604) 512-3456',
    verified: true
  },
  {
    id: '2',
    name: 'Familias Anónimas Colombia',
    description: 'Apoyo para familiares de personas con adicciones. No estás solo/a en este proceso.',
    schedule: 'Sábados - 10:00 AM',
    modality: 'Virtual',
    location: 'Zoom (link se envía por WhatsApp)',
    contact: 'WhatsApp: 300 123 4567',
    verified: true
  },
  {
    id: '3',
    name: 'Círculos de Recuperación ICBF',
    description: 'Programa de apoyo psicosocial para adolescentes en proceso de rehabilitación.',
    schedule: 'Martes y Jueves - 4:00 PM',
    modality: 'Híbrido',
    location: 'Centro Zonal ICBF Laureles, Medellín',
    contact: '(604) 444 4448',
    verified: true
  }
];

export function Comunidad() {
  const [filter, setFilter] = useState<'all' | 'Presencial' | 'Virtual' | 'Híbrido'>('all');

  const filteredGroups = filter === 'all' 
    ? supportGroups 
    : supportGroups.filter(g => g.modality === filter);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Comunidad de Apoyo</h1>
          <p className="text-lg text-gray-600">Grupos verificados donde puedes encontrar acompañamiento real.</p>
        </div>

        {/* Filtros */}
        <div className="flex gap-3 mb-8 flex-wrap">
          {(['all', 'Presencial', 'Virtual', 'Híbrido'] as const).map((mod) => (
            <button
              key={mod}
              onClick={() => setFilter(mod)}
              className={`px-5 py-2 rounded-full font-medium transition ${
                filter === mod
                  ? 'bg-emerald-700 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {mod === 'all' ? 'Todos' : mod}
            </button>
          ))}
        </div>

        {/* Lista de grupos */}
        <div className="grid md:grid-cols-2 gap-6">
          {filteredGroups.map((group) => (
            <article key={group.id} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      group.modality === 'Presencial' ? 'bg-blue-100 text-blue-700' :
                      group.modality === 'Virtual' ? 'bg-purple-100 text-purple-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {group.modality}
                    </span>
                    {group.verified && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                        ✓ Verificado
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{group.name}</h3>
                </div>
              </div>

              <p className="text-gray-600 mb-4 leading-relaxed">{group.description}</p>

              <div className="space-y-2 mb-5 text-sm text-gray-600">
                <div className="flex items-start gap-2">
                  <span className="font-semibold">📅 Horario:</span>
                  <span>{group.schedule}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-semibold">📍 Ubicación:</span>
                  <span>{group.location}</span>
                </div>
              </div>

              <a
                href={group.contact.startsWith('http') ? group.contact : 
                      group.contact.includes('WhatsApp') ? `https://wa.me/${group.contact.replace(/\D/g, '')}` :
                      `tel:${group.contact}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center bg-emerald-700 text-white py-3 rounded-xl font-medium hover:bg-emerald-800 transition"
              >
                Contactar grupo
              </a>
            </article>
          ))}
        </div>

        {/* Aviso importante */}
        <div className="mt-10 p-6 bg-amber-50 border border-amber-200 rounded-2xl">
          <h3 className="font-bold text-amber-900 mb-2">⚠️ Importante</h3>
          <p className="text-sm text-amber-800 leading-relaxed">
            Estos grupos son de apoyo comunitario y no sustituyen el tratamiento profesional. 
            Si estás en crisis, llama a la <strong>Línea 106</strong> (gratis, 24/7) o al <strong>123</strong>.
          </p>
        </div>
      </div>
    </main>
  );
}

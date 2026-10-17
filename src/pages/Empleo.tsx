import React from 'react';

interface JobProgram {
  id: string;
  name: string;
  organization: string;
  description: string;
  requirements: string[];
  benefits: string[];
  contact: string;
  verified: boolean;
}

const jobPrograms: JobProgram[] = [
  {
    id: '1',
    name: 'Rutas Integradas SENA',
    organization: 'SENA',
    description: 'Programa de formación técnica y tecnológica gratuito para personas en proceso de rehabilitación. Incluye acompañamiento psicosocial.',
    requirements: [
      'Mayor de 18 años',
      'Certificado de aptitud psicofísica',
      'Carta de recomendación de entidad de salud o fundación'
    ],
    benefits: [
      'Formación técnica gratuita',
      'Certificación oficial SENA',
      'Bolsa de empleo exclusiva',
      'Acompañamiento psicosocial'
    ],
    contact: 'https://rutasintegradas.sena.edu.co',
    verified: true
  },
  {
    id: '2',
    name: 'Fondo Emprender',
    organization: 'SENA',
    description: 'Capital semilla condonable para emprendimientos de personas en recuperación. Hasta $40 millones para proyectos productivos.',
    requirements: [
      'Haber terminado un curso SENA',
      'Plan de negocio viable',
      'Estar en proceso de rehabilitación (certificado)'
    ],
    benefits: [
      'Capital semilla hasta $40M',
      'Condonación del 100% si cumples metas',
      'Mentoría empresarial',
      'Red de contactos'
    ],
    contact: 'https://fondoprendar.sena.edu.co',
    verified: true
  },
  {
    id: '3',
    name: 'Programa Segunda Oportunidad',
    organization: 'Alcaldía de Medellín',
    description: 'Programa de inserción laboral para personas en recuperación. Alianzas con empresas locales para contratación directa.',
    requirements: [
      'Residir en Medellín',
      'Estar en proceso de rehabilitación (mínimo 6 meses)',
      'Disponibilidad para trabajar'
    ],
    benefits: [
      'Contratación directa en empresas aliadas',
      'Salario mínimo + prestaciones',
      'Acompañamiento laboral por 1 año',
      'Certificado de experiencia'
    ],
    contact: '(604) 444 4448',
    verified: true
  }
];

export function Empleo() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Reinserción Laboral</h1>
          <p className="text-lg text-gray-600">Programas verificados para construir un nuevo proyecto de vida.</p>
        </div>

        {/* Lista de programas */}
        <div className="space-y-6">
          {jobPrograms.map((program) => (
            <article key={program.id} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                      ✓ Verificado
                    </span>
                    <span className="text-sm text-gray-500">{program.organization}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{program.name}</h3>
                </div>
              </div>

              <p className="text-gray-600 mb-6 leading-relaxed">{program.description}</p>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-bold text-gray-900 mb-3">📋 Requisitos</h4>
                  <ul className="space-y-2">
                    {program.requirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-emerald-600 mt-0.5">•</span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 mb-3">✨ Beneficios</h4>
                  <ul className="space-y-2">
                    {program.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-emerald-600 mt-0.5">✓</span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <a
                href={program.contact.startsWith('http') ? program.contact : `tel:${program.contact}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-emerald-700 text-white px-8 py-3 rounded-xl font-medium hover:bg-emerald-800 transition"
              >
                Aplicar al programa
              </a>
            </article>
          ))}
        </div>

        {/* Marco legal */}
        <div className="mt-10 p-6 bg-blue-50 border border-blue-200 rounded-2xl">
          <h3 className="font-bold text-blue-900 mb-2">📜 Marco Legal</h3>
          <p className="text-sm text-blue-800 leading-relaxed">
            La <strong>Ley 1566 de 2012</strong> establece que las personas en proceso de rehabilitación tienen derecho 
            a la reinserción laboral. Las empresas que contraten a estas personas pueden acceder a beneficios tributarios.
          </p>
        </div>
      </div>
    </main>
  );
}

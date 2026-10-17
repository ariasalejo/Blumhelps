import React, { useState } from 'react';

interface Story {
  id: string;
  name: string;
  age: number;
  city: string;
  story: string;
  recoveryTime: string;
  photo: string;
  verified: boolean;
}

const stories: Story[] = [
  {
    id: '1',
    name: 'Carlos M.',
    age: 34,
    city: 'Medellín',
    story: 'Después de 10 años luchando contra la adicción al alcohol, encontré ayuda en los Centros de Escuche. Hoy llevo 3 años sobrio y trabajo como electricista gracias al programa del SENA. No estás solo, busca ayuda.',
    recoveryTime: '3 años',
    photo: '👨',
    verified: true
  },
  {
    id: '2',
    name: 'María F.',
    age: 28,
    city: 'Bello',
    story: 'Mi familia se estaba destruyendo por mi consumo. La Línea 106 me orientó y me conectó con un grupo de apoyo. Hoy soy voluntaria en mi iglesia y ayudo a otras mujeres. La recuperación es posible.',
    recoveryTime: '2 años',
    photo: '👩',
    verified: true
  },
  {
    id: '3',
    name: 'Juan D.',
    age: 41,
    city: 'Envigado',
    story: 'Entré al programa de Fundación Hogares Claret cuando toqué fondo. Fue difícil, pero el acompañamiento psicosocial cambió mi vida. Hoy tengo mi propio negocio de carpintería.',
    recoveryTime: '5 años',
    photo: '👨',
    verified: true
  }
];

export function Historias() {
  const [showForm, setShowForm] = useState(false);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Historias de Recuperación</h1>
          <p className="text-lg text-gray-600">Testimonios reales de personas que lo lograron. Tú también puedes.</p>
        </div>

        {/* Botón para compartir historia */}
        <div className="mb-8">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-emerald-700 text-white px-6 py-3 rounded-xl font-medium hover:bg-emerald-800 transition"
          >
            {showForm ? 'Cancelar' : '✨ Compartir mi historia'}
          </button>
        </div>

        {/* Formulario (oculto por defecto) */}
        {showForm && (
          <div className="bg-white rounded-2xl p-8 mb-8 shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Comparte tu historia</h3>
            <p className="text-gray-600 mb-6">
              Tu testimonio puede inspirar a otros. Todas las historias son moderadas antes de ser publicadas.
            </p>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre (puede ser inicial)</label>
                <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-xl" placeholder="Ej: Carlos M." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ciudad</label>
                <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-xl" placeholder="Ej: Medellín" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tu historia</label>
                <textarea rows={6} className="w-full px-4 py-2 border border-gray-300 rounded-xl" placeholder="Cuéntanos tu experiencia..." />
              </div>
              <button type="submit" className="bg-emerald-700 text-white px-6 py-3 rounded-xl font-medium hover:bg-emerald-800 transition">
                Enviar para moderación
              </button>
            </form>
          </div>
        )}

        {/* Lista de historias */}
        <div className="grid md:grid-cols-2 gap-6">
          {stories.map((story) => (
            <article key={story.id} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition">
              <div className="flex items-start gap-4 mb-4">
                <div className="text-5xl">{story.photo}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-bold text-gray-900">{story.name}, {story.age}</h3>
                    {story.verified && (
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                        ✓ Verificado
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{story.city} · {story.recoveryTime} en recuperación</p>
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed italic">"{story.story}"</p>
            </article>
          ))}
        </div>

        {/* Aviso de moderación */}
        <div className="mt-10 p-6 bg-blue-50 border border-blue-200 rounded-2xl">
          <h3 className="font-bold text-blue-900 mb-2">🛡️ Moderación y Privacidad</h3>
          <p className="text-sm text-blue-800 leading-relaxed">
            Todas las historias son revisadas por nuestro equipo antes de ser publicadas. 
            Nunca compartimos información personal sin tu consentimiento explícito.
          </p>
        </div>
      </div>
    </main>
  );
}

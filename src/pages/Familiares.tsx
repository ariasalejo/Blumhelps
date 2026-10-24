import React from 'react';
import { HeartHandshake, MessageCircle, Shield, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Familiares() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10 min-h-screen">
      <header className="mb-6">
        <div className="flex items-center gap-2 text-[var(--moss)] mb-2">
          <HeartHandshake className="w-5 h-5" />
          <span className="text-sm font-semibold">Para familiares y acompañantes</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold serif">Cómo hablarle a un ser querido</h1>
        <p className="mt-2 text-gray-700">Escuchar sin juzgar puede ser el primer acto de amor.</p>
      </header>

      <div className="grid gap-4">
        <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold flex items-center gap-2"><MessageCircle className="w-5 h-5 text-[var(--moss)]"/>¿Qué SÍ hacer?</h2>
          <ul className="mt-3 space-y-2 text-gray-700">
            <li>• <strong>Escucha</strong>: Pregunta "¿Quieres hablar?" y guarda silencio para escuchar.</li>
            <li>• <strong>Valida</strong>: "Entiendo que esto es difícil para ti".</li>
            <li>• <strong>Acompaña</strong>: Ofrece estar presente, no "arreglarlo todo".</li>
            <li>• <strong>Respeta</strong>: El cambio solo viene si la persona lo quiere.</li>
            <li>• <strong>Cuídate</strong>: También necesitas apoyo.</li>
          </ul>
        </article>

        <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold flex items-center gap-2"><Shield className="w-5 h-5 text-orange-600"/>¿Qué NO hacer?</h2>
          <ul className="mt-3 space-y-2 text-gray-700">
            <li>• <strong>Evita sermones</strong>: "Tú deberías..." rara vez funciona.</li>
            <li>• <strong>No culpes</strong>: El consumo es complejo. Juzgar aleja.</li>
            <li>• <strong>No chantajees</strong>: Amenazas generan más miedo.</li>
            <li>• <strong>No te responsabilices solo</strong>: Buscar ayuda es parte de cuidar.</li>
          </ul>
        </article>

        <article className="rounded-2xl border border-[var(--moss)]/30 bg-[var(--moss)]/5 p-6">
          <h2 className="text-xl font-semibold flex items-center gap-2"><Heart className="w-5 h-5 text-[var(--moss)]"/>Frases que ayudan</h2>
          <ul className="mt-3 space-y-2 text-gray-700">
            <li>• "Estoy aquí contigo, sin juzgarte."</li>
            <li>• "¿Cómo te puedo ayudar ahora?"</li>
            <li>• "Pedir ayuda es valentía."</li>
            <li>• "No estás solo(a). Podemos buscar ayuda juntos."</li>
          </ul>
        </article>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link to="/recuperacion" className="px-4 py-2 rounded-xl bg-[var(--moss)] text-white hover:bg-[var(--moss-deep)]">Ir a Mi Ruta</Link>
        <Link to="/ayuda" className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-50">Ver Recursos Verificados</Link>
        <a href="tel:106" className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700">Llamar al 106</a>
      </div>
    </main>
  );
}

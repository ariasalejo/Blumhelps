import React, { useState } from 'react';
import { Volume2, VolumeX, TrendingUp, TrendingDown, BookOpen, Heart } from 'lucide-react';
import { colombianScienceData, helpDictionary } from '../data/scienceData';

export function ScienceAndImpact() {
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  const toggleSpeech = (text: string, id: string) => {
    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-CO';
      utterance.rate = 0.95;
      utterance.onend = () => setSpeakingId(null);
      utterance.onerror = () => setSpeakingId(null);
      window.speechSynthesis.speak(utterance);
      setSpeakingId(id);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="serif text-4xl md:text-5xl font-bold text-[var(--ink)] mb-4">
          La ciencia de la <span className="text-[var(--moss)]">esperanza</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          La recuperación no es un milagro, es un proceso con respaldo científico. 
          Conocer los hechos reales rompe el miedo y la estigmatización.
        </p>
      </div>

      {/* Diccionario de Ayuda Rápida */}
      <div className="grid md:grid-cols-2 gap-6 mb-16">
        <div className="bg-[var(--moss)]/10 border border-[var(--moss)]/20 rounded-2xl p-6">
          <h3 className="serif text-2xl font-bold text-[var(--moss)] mb-4 flex items-center gap-2">
            <Heart className="w-6 h-6" /> Sí ayuda
          </h3>
          <ul className="space-y-3">
            {helpDictionary.QUE_HACER.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                <span className="text-[var(--moss)] font-bold mt-0.5">✓</span> {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-[var(--accent)]/10 border border-[var(--accent)]/20 rounded-2xl p-6">
          <h3 className="serif text-2xl font-bold text-[var(--accent)] mb-4 flex items-center gap-2">
            <TrendingDown className="w-6 h-6" /> No ayuda
          </h3>
          <ul className="space-y-3">
            {helpDictionary.QUE_NO_HACER.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                <span className="text-[var(--accent)] font-bold mt-0.5">✗</span> {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Escenarios Comparativos */}
      <h2 className="serif text-3xl font-bold text-center mb-8 flex items-center justify-center gap-3">
        <BookOpen className="w-8 h-8 text-[var(--gold)]" />
        Escenarios Reales en Colombia
      </h2>

      <div className="space-y-8">
        {colombianScienceData.map((caso) => (
          <div key={caso.id} className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 md:p-8">
              <div className="flex items-start justify-between mb-4">
                <h3 className="serif text-2xl font-bold text-[var(--ink)]">{caso.title}</h3>
                <button 
                  onClick={() => toggleSpeech(`${caso.title}. ${caso.description}. ${caso.recoveryPath}`, caso.id)}
                  className="p-2 rounded-full hover:bg-gray-100 transition"
                  aria-label="Escuchar este caso"
                >
                  {speakingId === caso.id ? <VolumeX className="w-5 h-5 text-[var(--moss)]" /> : <Volume2 className="w-5 h-5 text-gray-500" />}
                </button>
              </div>
              
              <p className="text-gray-600 mb-6 leading-relaxed">{caso.description}</p>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Camino de Recuperación */}
                <div className="bg-[var(--moss)]/5 border-l-4 border-[var(--moss)] p-5 rounded-r-xl">
                  <h4 className="font-bold text-[var(--moss)] mb-2 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" /> Con intervención y apoyo
                  </h4>
                  <p className="text-sm text-gray-700 leading-relaxed">{caso.recoveryPath}</p>
                </div>

                {/* Camino sin Intervención */}
                <div className="bg-[var(--accent)]/5 border-l-4 border-[var(--accent)] p-5 rounded-r-xl">
                  <h4 className="font-bold text-[var(--accent)] mb-2 flex items-center gap-2">
                    <TrendingDown className="w-5 h-5" /> Sin intervención
                  </h4>
                  <p className="text-sm text-gray-700 leading-relaxed">{caso.noInterventionPath}</p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-[var(--gold)]/10 rounded-xl border border-[var(--gold)]/20">
                <p className="text-xs font-semibold text-[var(--clay)] uppercase tracking-wider mb-1">Dato Científico (Colombia / OMS)</p>
                <p className="text-sm text-gray-800 italic">"{caso.scientificFact}"</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

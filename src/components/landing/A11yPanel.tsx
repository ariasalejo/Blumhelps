import React, { useState } from 'react';
import { Accessibility, Contrast, Type, Eye, BookOpen, Book, Pause, Info, Volume2, VolumeX } from 'lucide-react';

export function A11yPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const toggleAction = (action: string) => {
    document.body.classList.toggle(action);
  };

  const toggleSpeech = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const mainContent = document.querySelector('main')?.innerText;
      if (mainContent) {
        const utterance = new SpeechSynthesisUtterance(mainContent);
        utterance.lang = 'es-CO';
        utterance.rate = 0.9; // Un poco más lento para mejor comprensión
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
        setIsSpeaking(true);
      }
    }
  };

  // Detener lectura si se cierra el panel
  React.useEffect(() => {
    if (!isOpen && isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [isOpen, isSpeaking]);

  return (
    <div className="a11y-panel">
      <div className={`a11y-menu ${isOpen ? 'open' : ''}`} role="dialog" aria-label="Opciones de accesibilidad">
        <h3 className="serif text-lg font-semibold mb-4">Accesibilidad</h3>
        <div className="space-y-1">
          <button className="a11y-btn" onClick={() => toggleAction('hc')}><Contrast className="w-4 h-4" /><span>Alto contraste</span></button>
          <button className="a11y-btn" onClick={() => toggleAction('large')}><Type className="w-4 h-4" /><span>Texto grande</span></button>
          <button className="a11y-btn" onClick={() => toggleAction('readable')}><Eye className="w-4 h-4" /><span>Fuente legible</span></button>
          <button className="a11y-btn" onClick={() => toggleAction('dyslexic')}><BookOpen className="w-4 h-4" /><span>Dislexia-friendly</span></button>
          <button className="a11y-btn" onClick={() => toggleAction('reading')}><Book className="w-4 h-4" /><span>Modo lectura</span></button>
          <button className="a11y-btn" onClick={() => toggleAction('reduce-motion')}><Pause className="w-4 h-4" /><span>Reducir movimiento</span></button>
          <button className="a11y-btn" onClick={toggleSpeech} style={{ background: isSpeaking ? 'var(--lime)' : 'transparent', color: isSpeaking ? 'var(--ink)' : 'inherit' }}>
            {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span>{isSpeaking ? 'Detener lectura' : 'Leer en voz alta'}</span>
          </button>
        </div>
        <div className="mt-4 pt-4 border-t border-white/10">
          <a href="#" className="text-xs text-[var(--cream)]/60 hover:text-[var(--lime)] flex items-center gap-2">
            <Info className="w-3 h-3" /> WCAG 2.2 Nivel AA
          </a>
        </div>
      </div>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-[var(--ink)] text-[var(--cream)] shadow-2xl flex items-center justify-center hover:bg-[var(--moss)] transition" 
        aria-label="Abrir opciones de accesibilidad" 
        aria-expanded={isOpen}
      >
        <Accessibility className="w-5 h-5" />
      </button>
    </div>
  );
}

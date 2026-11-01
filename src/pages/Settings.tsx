import React, { useEffect, useState } from 'react';
import { Accessibility, Check, Contrast, Eye, RotateCcw, Type, Waves, ShieldCheck, Database, Bell, Globe2 } from 'lucide-react';

type PreferenceKey = 'hc' | 'large' | 'readable' | 'reduce-motion';
type Preferences = Record<PreferenceKey, boolean>;

const STORAGE_KEY = 'blumhelps.ui.preferences.v1';
const DEFAULTS: Preferences = { hc: false, large: false, readable: false, 'reduce-motion': false };
const CONTROLS: Array<{ key: PreferenceKey; title: string; description: string; icon: typeof Contrast }> = [
  { key: 'hc', title: 'Alto contraste', description: 'Refuerza la separación entre texto, superficies y controles.', icon: Contrast },
  { key: 'large', title: 'Texto grande', description: 'Aumenta el tamaño de lectura en las páginas compatibles.', icon: Type },
  { key: 'readable', title: 'Lectura cómoda', description: 'Activa una tipografía y espaciado más claros.', icon: Eye },
  { key: 'reduce-motion', title: 'Reducir movimiento', description: 'Reduce animaciones y desplazamientos decorativos.', icon: Waves },
];

function readPreferences(): Preferences {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : DEFAULTS;
  } catch {
    return DEFAULTS;
  }
}

export function Settings() {
  const [preferences, setPreferences] = useState<Preferences>(DEFAULTS);
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const saved = readPreferences();
    setPreferences(saved);
    Object.entries(saved).forEach(([key, value]) => document.body.classList.toggle(key, Boolean(value)));
    setReady(true);
  }, []);

  const updatePreference = (key: PreferenceKey) => {
    setPreferences((current) => {
      const next = { ...current, [key]: !current[key] };
      document.body.classList.toggle(key, next[key]);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        setMessage('Preferencias guardadas en este navegador.');
      } catch {
        setMessage('El navegador no permitió guardar el ajuste. La opción seguirá activa mientras esta página permanezca abierta.');
      }
      return next;
    });
  };

  const resetPreferences = () => {
    setPreferences(DEFAULTS);
    Object.keys(DEFAULTS).forEach((key) => document.body.classList.remove(key));
    try {
      localStorage.removeItem(STORAGE_KEY);
      setMessage('Se restauraron las preferencias visuales predeterminadas.');
    } catch {
      setMessage('Se restauró la vista actual, pero el navegador no permitió actualizar el almacenamiento.');
    }
  };

  return (
    <main className="bl-settings-page mx-auto min-h-screen max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <header className="bl-settings-hero">
        <div className="bl-settings-orbit" aria-hidden="true"><span /><span /><span /></div>
        <div className="relative z-10 max-w-3xl">
          <p className="bl-settings-kicker"><Accessibility className="h-4 w-4" /> TU ESPACIO · TUS PREFERENCIAS</p>
          <h1>Configuración y privacidad</h1>
          <p>Adapta la lectura a tu comodidad y conoce con claridad qué guarda esta versión de BLUMHelps, qué no hace todavía y cómo cuidar tu información.</p>
        </div>
      </header>

      <section className="bl-settings-section" aria-labelledby="accessibility-title">
        <div className="bl-settings-section-heading">
          <div><p className="bl-settings-kicker">Experiencia personal</p><h2 id="accessibility-title">Accesibilidad y lectura</h2><p>Estos ajustes se aplican a la interfaz en este navegador. Puedes cambiarlos cuando quieras.</p></div>
          <Accessibility className="h-9 w-9" aria-hidden="true" />
        </div>
        <div className="bl-settings-controls">
          {CONTROLS.map(({ key, title, description, icon: Icon }) => (
            <article className="bl-settings-control" key={key}>
              <div className="bl-settings-control-icon"><Icon className="h-5 w-5" /></div>
              <div className="min-w-0 flex-1"><h3>{title}</h3><p>{description}</p></div>
              <button type="button" role="switch" aria-checked={preferences[key]} aria-label={title} disabled={!ready} onClick={() => updatePreference(key)} className="bl-settings-switch"><span /></button>
            </article>
          ))}
        </div>
        <div className="bl-settings-actions"><p role="status" aria-live="polite">{message || 'Los cambios se guardan localmente; no se envían a un servidor.'}</p><button type="button" onClick={resetPreferences}><RotateCcw className="h-4 w-4" /> Restaurar ajustes</button></div>
      </section>

      <section className="bl-settings-grid" aria-label="Información de privacidad y funcionamiento">
        <article className="bl-settings-info">
          <div className="bl-settings-info-icon"><Database className="h-6 w-6" /></div><p className="bl-settings-kicker">Almacenamiento</p><h2>Tu información permanece en este navegador</h2>
          <p>Los registros del módulo de recuperación se guardan localmente mediante IndexedDB y, cuando hace falta, localStorage. Esta versión no cifra esos datos con una clave personal ni sincroniza automáticamente la información entre dispositivos.</p>
          <strong>No introduzcas nombres completos, documentos, teléfonos, direcciones ni datos que permitan identificarte.</strong>
        </article>
        <article className="bl-settings-info">
          <div className="bl-settings-info-icon"><ShieldCheck className="h-6 w-6" /></div><p className="bl-settings-kicker">Seguridad</p><h2>Protección honesta, sin promesas</h2>
          <p>Actualmente no hay bloqueo propio con PIN o biometría. La seguridad del dispositivo, la sesión del navegador y el acceso físico también importan.</p>
          <strong>Si compartes el dispositivo, cierra tu sesión del sistema y evita guardar información sensible.</strong>
        </article>
        <article className="bl-settings-info">
          <div className="bl-settings-info-icon"><Bell className="h-6 w-6" /></div><p className="bl-settings-kicker">Notificaciones</p><h2>Sin recordatorios automáticos</h2>
          <p>Esta versión no programa notificaciones ni alarmas de seguimiento. No recibirás avisos inesperados desde esta pantalla.</p>
          <strong>El acompañamiento debe respetar tu ritmo y tu decisión.</strong>
        </article>
        <article className="bl-settings-info">
          <div className="bl-settings-info-icon"><Globe2 className="h-6 w-6" /></div><p className="bl-settings-kicker">Idioma</p><h2>Español</h2>
          <p>La interfaz disponible actualmente está en español. Los controles de idioma adicionales aún no están implementados.</p>
          <strong>No mostramos un selector que prometa traducciones que todavía no existen.</strong>
        </article>
      </section>

      <aside className="bl-settings-note"><Check className="h-5 w-5 shrink-0" /><p><strong>Una nota importante:</strong> BLUMHelps es una herramienta psicoeducativa. No diagnostica, no sustituye profesionales y no es un servicio de emergencias. Si existe peligro inmediato en Colombia, llama al 123.</p></aside>
    </main>
  );
}

import type { CrisisLevel } from './types';

// Detector de crisis por palabras clave. Búsqueda case-insensitive.
// Debounce 300ms. Lógica configurable. No envía datos.

export type CrisisDetection = {
  level: CrisisLevel;
  matched: string[];
  shouldTriggerImmediate: boolean;
  message: string;
};

const KEYWORDS_HIGH: string[] = [
  'suicid',
  'suicida',
  'matarme',
  'quitarme la vida',
  'acabar con todo',
  'no quiero vivir',
];

const KEYWORDS_MEDIUM: string[] = [
  'no puedo más',
  'no puedo mas',
  'quiero desaparecer',
  'no aguanto',
  'no soporto',
  'quiero irme para siempre',
  'mejor sin mí',
  'mejor sin mi',
];

const KEYWORDS_LOW: string[] = [
  'recaí',
  'recaida',
  'volví a consumir',
  'volvi a consumir',
  'consumí',
  'consumi',
  'no sirvo',
  'no valgo',
];

function normalize(text: string): string {
  return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export function detectCrisis(text: string): CrisisDetection {
  if (!text || text.trim().length === 0) {
    return {
      level: 'baja',
      matched: [],
      shouldTriggerImmediate: false,
      message: '',
    };
  }
  const n = normalize(text);
  const matchedHigh = KEYWORDS_HIGH.filter((k) => n.includes(normalize(k)));
  if (matchedHigh.length > 0) {
    return {
      level: 'alta',
      matched: matchedHigh,
      shouldTriggerImmediate: true,
      message:
        'Detectamos señales de alto riesgo. Priorizamos tu seguridad. Llama al 106 o al 123. Si hay riesgo vital inmediato, llama a emergencias.',
    };
  }
  const matchedMed = KEYWORDS_MEDIUM.filter((k) => n.includes(normalize(k)));
  if (matchedMed.length > 0) {
    return {
      level: 'media',
      matched: matchedMed,
      shouldTriggerImmediate: false,
      message:
        'Hay señales de malestar intenso. Podemos ayudarte a regular un poco y a contactar apoyo. No tienes que hacerlo solo.',
    };
  }
  const matchedLow = KEYWORDS_LOW.filter((k) => n.includes(normalize(k)));
  if (matchedLow.length > 0) {
    return {
      level: 'baja',
      matched: matchedLow,
      shouldTriggerImmediate: false,
      message:
        'Una recaída es información, no un fracaso. Podemos retomar con una acción pequeña y cuidar tu seguridad.',
    };
  }
  return {
    level: 'baja',
    matched: [],
    shouldTriggerImmediate: false,
    message: '',
  };
}

export function createDebouncedDetector(delayMs = 300) {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return {
    run(text: string, cb: (d: CrisisDetection) => void) {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        cb(detectCrisis(text));
      }, delayMs);
    },
    cancel() {
      if (timeout) clearTimeout(timeout);
      timeout = null;
    },
  };
}

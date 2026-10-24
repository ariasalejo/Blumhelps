// ============================================================================
// BLUMHELPS — MÁQUINA DE ESTADOS DEL ONBOARDING (FASE 2.2)
// ============================================================================
// Máquina de estados finita (FSM) que orquesta el wizard de 7 pasos.
// 100% pura: sin efectos secundarios, sin I/O, sin llamadas a red.
// Todas las transiciones son validadas y tipadas estrictamente.
// ============================================================================

import type { RecoveryProfile } from "./onboardingSchemas";
import { CURRENT_CONSENT } from "../../data/recovery/consentTexts";

// ---------------------------------------------------------------------------
// 1. ESTADOS DEL WIZARD
// ---------------------------------------------------------------------------
export type OnboardingStep =
  | "welcome"           // Bienvenida + disclaimer
  | "consent"           // Contrato versionado (FASE 2.1)
  | "objetivo"          // ¿Qué buscas aquí?
  | "etapa"             // Prochaska autoevaluación
  | "sustancias"        // ASSIST adaptado (branching)
  | "desencadenantes"   // Identificación con severidad
  | "valores"           // ACT card sort
  | "red_apoyo"         // Contactos opcionales
  | "preferencias"      // Formatos, tiempo, voz, idioma
  | "resumen"           // "Mi primer espejo"
  | "completado";       // Jardín inicial + siguiente paso

export type OnboardingStatus =
  | "not_started"
  | "in_progress"
  | "completed"
  | "needs_reconsent"
  | "abandoned";

export interface OnboardingState {
  status: OnboardingStatus;
  currentStep: OnboardingStep;
  completedSteps: OnboardingStep[];
  startedAt: string;
  lastSavedAt: string;
  draftProfile: Partial<RecoveryProfile>;
  consentHash?: string;
  consentVersion: string;
  abandonCount: number;
}

// ---------------------------------------------------------------------------
// 2. DEFINICIÓN DE PASOS (METADATA)
// ---------------------------------------------------------------------------
export interface OnboardingStepDef {
  id: OnboardingStep;
  title: string;
  subtitle: string;
  estimatedMinutes: number;
  canSkip: boolean;
  requiresConsent: boolean;
  next: (state: OnboardingState) => OnboardingStep | "end";
}

export const ONBOARDING_STEPS: Record<OnboardingStep, OnboardingStepDef> = {
  welcome: {
    id: "welcome",
    title: "Bienvenida",
    subtitle: "Un espacio seguro para tu proceso",
    estimatedMinutes: 1,
    canSkip: false,
    requiresConsent: false,
    next: () => "consent",
  },
  consent: {
    id: "consent",
    title: "Consentimiento Informado",
    subtitle: "Tus datos, tus derechos",
    estimatedMinutes: 3,
    canSkip: false,
    requiresConsent: false,
    next: (state) => (state.consentHash ? "objetivo" : "consent"),
  },
  objetivo: {
    id: "objetivo",
    title: "Tu Objetivo",
    subtitle: "¿Qué buscas en este proceso?",
    estimatedMinutes: 2,
    canSkip: false,
    requiresConsent: true,
    next: () => "etapa",
  },
  etapa: {
    id: "etapa",
    title: "Tu Etapa Actual",
    subtitle: "Sin juicios, solo reconocimiento",
    estimatedMinutes: 2,
    canSkip: false,
    requiresConsent: true,
    next: () => "sustancias",
  },
  sustancias: {
    id: "sustancias",
    title: "Sustancias y Uso",
    subtitle: "Contexto, no juicio",
    estimatedMinutes: 3,
    canSkip: true,
    requiresConsent: true,
    next: () => "desencadenantes",
  },
  desencadenantes: {
    id: "desencadenantes",
    title: "Desencadenantes",
    subtitle: "Situaciones que te afectan",
    estimatedMinutes: 3,
    canSkip: true,
    requiresConsent: true,
    next: () => "valores",
  },
  valores: {
    id: "valores",
    title: "Tus Valores",
    subtitle: "Lo que realmente te importa",
    estimatedMinutes: 4,
    canSkip: false,
    requiresConsent: true,
    next: () => "red_apoyo",
  },
  red_apoyo: {
    id: "red_apoyo",
    title: "Tu Red de Apoyo",
    subtitle: "Personas que te acompañan",
    estimatedMinutes: 2,
    canSkip: true,
    requiresConsent: true,
    next: () => "preferencias",
  },
  preferencias: {
    id: "preferencias",
    title: "Preferencias",
    subtitle: "Personaliza tu experiencia",
    estimatedMinutes: 2,
    canSkip: false,
    requiresConsent: true,
    next: () => "resumen",
  },
  resumen: {
    id: "resumen",
    title: "Tu Primer Espejo",
    subtitle: "Revisa y confirma tu perfil",
    estimatedMinutes: 2,
    canSkip: false,
    requiresConsent: true,
    next: () => "completado",
  },
  completado: {
    id: "completado",
    title: "Proceso Completado",
    subtitle: "Tu jardín comienza a crecer",
    estimatedMinutes: 1,
    canSkip: false,
    requiresConsent: true,
    next: () => "end",
  },
};

// ---------------------------------------------------------------------------
// 3. TRANSICIONES VÁLIDAS
// ---------------------------------------------------------------------------
export type TransitionResult =
  | { ok: true; nextState: OnboardingState }
  | { ok: false; error: string };

export function canTransition(
  from: OnboardingStep,
  to: OnboardingStep,
  state: OnboardingState,
): TransitionResult {
  const stepDef = ONBOARDING_STEPS[from];
  if (!stepDef) {
    return { ok: false, error: "Paso de origen no existe." };
  }

  // Validar consentimiento si el paso destino lo requiere
  if (ONBOARDING_STEPS[to].requiresConsent && !state.consentHash) {
    return {
      ok: false,
      error: "Debes aceptar el consentimiento antes de continuar.",
    };
  }

  // Validar que el consentimiento esté vigente
  if (state.consentVersion !== CURRENT_CONSENT.version) {
    return {
      ok: false,
      error: "El consentimiento está desactualizado. Debes re-aceptarlo.",
    };
  }

  // Validar transición válida según el flujo definido
  const expectedNext = stepDef.next(state);
  if (expectedNext !== to && to !== "welcome") {
    // Permitir retroceso a pasos anteriores
    const fromIndex = Object.keys(ONBOARDING_STEPS).indexOf(from);
    const toIndex = Object.keys(ONBOARDING_STEPS).indexOf(to);
    if (toIndex < fromIndex) {
      return { ok: true, nextState: { ...state, currentStep: to } };
    }
    return {
      ok: false,
      error: `Transición inválida de ${from} a ${to}.`,
    };
  }

  return {
    ok: true,
    nextState: {
      ...state,
      currentStep: to,
      lastSavedAt: new Date().toISOString(),
    },
  };
}

// ---------------------------------------------------------------------------
// 4. CREAR ESTADO INICIAL
// ---------------------------------------------------------------------------
export function createInitialState(): OnboardingState {
  return {
    status: "not_started",
    currentStep: "welcome",
    completedSteps: [],
    startedAt: new Date().toISOString(),
    lastSavedAt: new Date().toISOString(),
    draftProfile: {},
    consentVersion: CURRENT_CONSENT.version,
    abandonCount: 0,
  };
}

// ---------------------------------------------------------------------------
// 5. UTILIDADES
// ---------------------------------------------------------------------------
export function getProgressPercent(state: OnboardingState): number {
  const totalSteps = Object.keys(ONBOARDING_STEPS).length;
  const completedCount = state.completedSteps.length;
  return Math.round((completedCount / totalSteps) * 100);
}

export function isStepCompleted(
  state: OnboardingState,
  step: OnboardingStep,
): boolean {
  return state.completedSteps.includes(step);
}

export function markStepCompleted(
  state: OnboardingState,
  step: OnboardingStep,
): OnboardingState {
  if (state.completedSteps.includes(step)) return state;
  return {
    ...state,
    completedSteps: [...state.completedSteps, step],
    lastSavedAt: new Date().toISOString(),
  };
}

export function needsReconsent(state: OnboardingState): boolean {
  return state.consentVersion !== CURRENT_CONSENT.version;
}

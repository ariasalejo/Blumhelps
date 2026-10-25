// BLUMHELPS - Contrato de datos del módulo de acompañamiento en recuperación.
// Este módulo es psicoeducativo: no diagnostica, no prescribe y no promete curación.
// Los datos de salud son locales y sensibles. Ningún tipo de este archivo implica
// transmisión a backend o terceros.

export const CONSENT_VERSION = '2.1.0' as const;

export type Etapa =
  | 'precontemplacion'
  | 'contemplacion'
  | 'preparacion'
  | 'accion'
  | 'mantenimiento'
  | 'recaida';

/** Etapas del modelo transteórico clásico (sin el estado de recaída). */
export type EtapaCambio = Exclude<Etapa, 'recaida'>;

export type Objetivo =
  | 'abstinencia'
  | 'reduccion'
  | 'exploracion'
  | 'apoyo_familiar';

export type Frecuencia =
  | 'nunca'
  | 'ocasional'
  | 'semanal'
  | 'diaria'
  | 'constante';

export interface Sustancia {
  tipo: string;
  frecuenciaUso: Frecuencia;
  anosDeUso: number;
}

export interface Trigger {
  id: string;
  descripcion: string;
  severidad: 1 | 2 | 3 | 4 | 5;
  frecuencia: Frecuencia;
  copingSkill?: string;
}

export interface SupportContact {
  id: string;
  nombre: string;
  telefono?: string;
  relacion?: string;
  disponible?: string;
  /** El usuario decide explícitamente si este contacto puede ser usado en el protocolo de crisis. */
  contactoParaCrisis: boolean;
}

export type Formato =
  | 'video'
  | 'imagen'
  | 'lectura'
  | 'audio'
  | 'ejercicio'
  | 'ejercicio_guiado'
  | 'meditacion'
  | 'journaling'
  | 'visualizacion_3d';

export type Tema =
  | 'modelo_transteorico'
  | 'craving_como_ola'
  | 'activacion_conductual'
  | 'mindfulness'
  | 'defusion_cognitiva'
  | 'valores_personales'
  | 'higiene_sueno'
  | 'apoyo_social'
  | 'manejo_recaidas'
  | 'regulacion_emocional'
  | 'comunicacion_asertiva'
  | 'autocompasion'
  | 'prevencion_sintomas';

export type NivelEvidencia =
  | 'metaanalisis'
  | 'ensayo_controlado'
  | 'cohortes'
  | 'expert_opinion'
  | 'PENDIENTE_VERIFICACION';

export type FuenteTipo =
  | 'oms'
  | 'nida'
  | 'samhsa'
  | 'minsalud'
  | 'paper'
  | 'propio';

export interface Fuente {
  tipo: FuenteTipo;
  url: string;
  fecha: string;
  verificado: boolean;
  nota?: string;
}

export type Licencia =
  | 'CC-BY-4.0'
  | 'dominio_publico'
  | 'propio'
  | 'PENDIENTE_VERIFICACION';

export interface Accesibilidad {
  subtitulos: boolean;
  audioDescripcion: boolean;
  transcript?: string;
  reduceMotion: boolean;
}

export interface MediaAsset {
  tipo: 'video' | 'audio' | 'imagen';
  src: string;
  mimeType: string;
  poster?: string;
  subtitulos?: Array<{
    src: string;
    lang: string;
    label: string;
  }>;
  licencia: Licencia;
  fuenteUrl?: string;
  verificado: boolean;
}

export interface RecoveryItem {
  id: string;
  titulo: string;
  formato: Formato;
  tema: Tema;
  subtemas: string[];
  etapas: Etapa[];
  duracionMin: number;
  nivelEvidencia: NivelEvidencia;
  fuente: Fuente;
  licencia: Licencia;
  licenciaDetalle?: string;
  descripcion: string;
  guion: string;
  tags: string[];
  microAccion: string;
  contraindicaciones?: string[];
  accesibilidad: Accesibilidad;
  media?: MediaAsset;
  notaMedia?: string;
}

export type Idioma = 'es-CO' | 'es-MX' | 'es-ES';
export type VozTTS = 'masculina' | 'femenina' | 'neutra';

export interface PreferenciasRecovery {
  formatos: Formato[];
  minutosDia: number;
  recordatoriosSuaves: boolean;
  idioma: Idioma;
  vozTTS: VozTTS;
  reducirMovimiento: boolean;
}

export interface MetadatosRecovery {
  diasActivo: number;
  ultimaActividad: string;
  sesionesCompletadas: number;
  crisisEvitadas: number;
}

export interface RecoveryProfile {
  id: string;
  consentVersion: string;
  consentAcceptedAt: string;
  createdAt: string;
  updatedAt: string;
  objetivo: Objetivo;
  etapa: Etapa;
  sustancias: Sustancia[];
  desencadenantes: Trigger[];
  valoresACT: string[];
  redDeApoyo: SupportContact[];
  preferencias: PreferenciasRecovery;
  metadatos: MetadatosRecovery;
}

export type ReasonDimension =
  | 'etapa'
  | 'desencadenante'
  | 'formato'
  | 'evidencia'
  | 'progreso'
  | 'diversidad'
  | 'valor_ACT'
  | 'tiempo_disponible';

export interface Reason {
  /** Peso auditable. Positivo suma afinidad; negativo penaliza repetición. */
  peso: number;
  dimension: ReasonDimension;
  explicacion: string;
}

export interface RecommendationContext {
  /** Fecha local en formato YYYY-MM-DD. */
  hoy: string;
  completadosHoy: string[];
  completadosRecientes: string[];
  temasRecientes: Tema[];
  minutosDisponibles: number;
  etapaAnterior?: Etapa;
  esEjercicioOpcional?: boolean;
}

export interface ScoredItem {
  item: RecoveryItem;
  score: number;
  reasons: Reason[];
}

export interface DailyPlan {
  fecha: string;
  sugerencias: ScoredItem[];
  microAccion: ScoredItem;
  ejercicioOpcional?: ScoredItem;
  razonamiento: string;
}

export type MoodLabel = 'muy_bajo' | 'bajo' | 'neutral' | 'bien' | 'muy_bien';

export interface JournalEntry {
  id: string;
  createdAt: string;
  texto: string;
  animo: MoodLabel;
  etiquetas: string[];
  craving?: number;
}

export type CrisisLevel = 'alta' | 'media' | 'baja';

export interface CrisisEvent {
  id: string;
  createdAt: string;
  level: CrisisLevel;
  source: 'diario' | 'cuestionario' | 'manual';
  resolvedAt?: string;
}

export type CrisisResourceType =
  | 'emergency'
  | 'mental-health'
  | 'substance'
  | 'family'
  | 'child';

export type CrisisVerificationStatus =
  | 'VERIFICADO'
  | 'VERIFICAR_ANTES_DE_PUBLICAR'
  | 'NO_PUBLICAR_HASTA_VERIFICACION';

export interface CrisisResource {
  id: string;
  name: string;
  shortLabel: string;
  phone?: string;
  sms?: string;
  whatsapp?: string;
  url?: string;
  description: string;
  available: string;
  type: CrisisResourceType;
  priority: number;
  scope: string;
  visible: boolean;
  verificationStatus: CrisisVerificationStatus;
  sourceUrl: string;
  lastReviewed: string;
  notes?: string;
}

export interface CrisisConfig {
  countryCode: string;
  countryName: string;
  region?: string;
  resources: CrisisResource[];
  disclaimer: string;
}

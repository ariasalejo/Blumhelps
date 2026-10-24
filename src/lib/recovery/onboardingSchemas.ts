// ============================================================================
// BLUMHELPS — ESQUEMAS DE VALIDACIÓN ZOD (ONBOARDING CLÍNICO)
// ============================================================================
// Validación estricta con mensajes empáticos derivados de entrevista
// motivacional y comunicación clínica no coercitiva.
// Principios: ningún mensaje culpabiliza; las validaciones cruzadas usan
// superRefine; los tipos derivados con z.infer son la fuente única de verdad.
// ============================================================================

import { z } from "zod";
import { CURRENT_CONSENT } from "../../data/recovery/consentTexts";

// ---------------------------------------------------------------------------
// 1. CONSENTIMIENTO VERSIONADO
// ---------------------------------------------------------------------------
export const ConsentSchema = z.object({
  version: z.literal(CURRENT_CONSENT.version, {
    error: "Debes aceptar la versión vigente del consentimiento para continuar.",
  }),
  acceptedAt: z.string().datetime({
    offset: true,
    message: "La marca de tiempo debe ser una fecha ISO-8601 válida con zona horaria.",
  }),
  textHash: z.string().length(64).regex(/^[a-f0-9]{64}$/i, {
    message: "El hash del texto aceptado no coincide con el consentimiento vigente.",
  }),
  sessionId: z.string().uuid().optional(),
  userAgentHash: z.string().length(64).optional(),
}).strict();

export type ConsentRecord = z.infer<typeof ConsentSchema>;

// ---------------------------------------------------------------------------
// 2. OBJETIVO DEL PROCESO
// ---------------------------------------------------------------------------
export const ObjetivoOptions = [
  "abstinencia",
  "reduccion",
  "exploracion",
  "apoyo_familiar",
] as const;

export const ObjetivoSchema = z.object({
  objetivo: z.enum(ObjetivoOptions, {
    error: "No hay respuesta incorrecta. Elige la opción que más se parezca a lo que sientes hoy.",
  }),
  motivacion_libre: z
    .string()
    .max(800, { message: "El texto no puede superar 800 caracteres." })
    .optional()
    .transform((v) => (v ? v.trim() : undefined)),
  confianza_cambio: z
    .number()
    .int()
    .min(0)
    .max(10)
    .optional()
    .describe("Escala visual 0-10 de confianza en lograr el objetivo."),
}).strict();

export type ObjetivoData = z.infer<typeof ObjetivoSchema>;

// ---------------------------------------------------------------------------
// 3. ETAPA DE CAMBIO (MODELO TRANSTEÓRICO)
// ---------------------------------------------------------------------------
export const EtapaAutopercibidaOptions = [
  "no_pienso_cambiar",
  "pienso_cambiar_pronto",
  "preparandome",
  "ya_empece",
  "manteniendo",
  "tuve_una_recaida",
] as const;

export const EtapaSchema = z.object({
  etapa_autopercibida: z.enum(EtapaAutopercibidaOptions, {
    error: "No tienes que tenerlo todo claro. La etapa que elijas ahora puede cambiar mañana, y eso está bien.",
  }),
  tiempo_en_proceso_meses: z
    .number()
    .int()
    .min(0)
    .max(600)
    .optional()
    .describe("Tiempo aproximado que llevas en este proceso."),
}).strict();

export type EtapaData = z.infer<typeof EtapaSchema>;

export const ETAPA_MAP: Record<
  (typeof EtapaAutopercibidaOptions)[number],
  "precontemplacion" | "contemplacion" | "preparacion" | "accion" | "mantenimiento" | "recaida"
> = {
  no_pienso_cambiar: "precontemplacion",
  pienso_cambiar_pronto: "contemplacion",
  preparandome: "preparacion",
  ya_empece: "accion",
  manteniendo: "mantenimiento",
  tuve_una_recaida: "recaida",
};

// ---------------------------------------------------------------------------
// 4. SUSTANCIAS (INSTRUMENTO ASSIST ADAPTADO — OMS)
// ---------------------------------------------------------------------------
export const SustanciaSchema = z.object({
  tipo: z
    .string()
    .min(2, { message: "Escribe al menos 2 caracteres." })
    .max(50, { message: "El nombre no puede superar 50 caracteres." })
    .transform((v) => v.trim().toLowerCase()),
  frecuencia: z.enum(["nunca", "ocasional", "semanal", "diaria", "constante"], {
    error: "Puedes escribir el nombre con el que la conoces; no necesita ser técnico.",
  }),
  anos_de_uso: z
    .number()
    .int()
    .min(0, { message: "Los años no pueden ser negativos." })
    .max(80, { message: "Ingresa un valor realista." }),
  via_consumo: z.enum(["oral", "inhalada", "fumada", "inyectable", "otra", "ns_nc"]).optional(),
  intentos_previos_reduccion: z.number().int().min(0).max(99).optional(),
}).strict();

export type SustanciaData = z.infer<typeof SustanciaSchema>;

export const SustanciasSchema = z
  .object({
    usa_alguna: z.boolean({
      error: "Esta información nos ayuda a personalizar tu experiencia. No hay juicio, solo contexto.",
    }),
    lista: z
      .array(SustanciaSchema)
      .max(10, { message: "Puedes reportar hasta 10 sustancias." })
      .optional(),
    notas_adicionales: z.string().max(500).optional(),
  })
  .strict()
  .superRefine((data, ctx) => {
    if (data.usa_alguna && (!data.lista || data.lista.length === 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["lista"],
        message:
          "Si reportas consumo, por favor indica al menos una sustancia. Si prefieres no detallar, vuelve atrás y marca «No».",
      });
    }
    if (!data.usa_alguna && data.lista && data.lista.length > 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["lista"],
        message: "Inconsistencia detectada. Revisa tus respuestas.",
      });
    }
  });

export type SustanciasData = z.infer<typeof SustanciasSchema>;

// ---------------------------------------------------------------------------
// 5. DESENCADENANTES
// ---------------------------------------------------------------------------
export const TriggerSchema = z.object({
  id: z.string().uuid(),
  descripcion: z
    .string()
    .min(3, { message: "Describe brevemente la situación." })
    .max(200),
  severidad: z.number().int().min(1).max(5),
  frecuencia: z.enum(["ocasional", "semanal", "diaria", "constante"]),
  contexto: z
    .enum(["laboral", "familiar", "social", "intimo", "economico", "salud", "otro"])
    .optional(),
  coping_identificado: z.string().max(300).optional(),
}).strict();

export type TriggerData = z.infer<typeof TriggerSchema>;

export const DesencadenantesSchema = z
  .object({
    lista: z
      .array(TriggerSchema)
      .min(0)
      .max(15, { message: "Puedes reportar hasta 15 desencadenantes." }),
  })
  .strict()
  .superRefine((data, ctx) => {
    const ids = data.lista.map((t) => t.id);
    const duplicates = ids.filter((id, i) => ids.indexOf(id) !== i);
    if (duplicates.length > 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["lista"],
        message: "Hay desencadenantes duplicados. Revisa la lista.",
      });
    }
  });

export type DesencadenantesData = z.infer<typeof DesencadenantesSchema>;

// ---------------------------------------------------------------------------
// 6. VALORES ACT
// ---------------------------------------------------------------------------
export const ValorACTSchema = z.object({
  id: z.string().uuid(),
  dominio: z.enum([
    "vinculos",
    "salud",
    "trabajo",
    "comunidad",
    "creatividad",
    "espiritualidad",
    "educacion",
    "ocio",
    "familia",
    "autonomia",
  ]),
  cualidad: z.string().min(5).max(100),
  importancia: z.number().int().min(1).max(10),
  coherencia_actual: z.number().int().min(0).max(10).optional(),
}).strict();

export const ValoresACTSchema = z
  .object({
    lista: z
      .array(ValorACTSchema)
      .min(3, { message: "Elige al menos 3 valores importantes para ti." })
      .max(8, { message: "Elige como máximo 8 valores." }),
  })
  .strict();

export type ValoresACTData = z.infer<typeof ValoresACTSchema>;

// ---------------------------------------------------------------------------
// 7. RED DE APOYO
// ---------------------------------------------------------------------------
export const SupportContactSchema = z.object({
  id: z.string().uuid(),
  nombre: z.string().min(2).max(60),
  relacion: z
    .enum(["familiar", "amistad", "pareja", "profesional_salud", "grupo_apoyo", "otro"])
    .optional(),
  telefono: z
    .string()
    .regex(/^\+?[0-9\s\-]{7,20}$/, {
      message: "El teléfono debe tener entre 7 y 20 dígitos, espacios o guiones.",
    })
    .optional(),
  whatsapp: z.boolean().optional(),
  disponible_en: z.string().max(80).optional(),
  contacto_para_crisis: z.boolean().default(false),
}).strict();

export const RedApoyoSchema = z
  .object({
    lista: z.array(SupportContactSchema).max(10).default([]),
  })
  .strict()
  .superRefine((data, ctx) => {
    const crisisContacts = data.lista.filter((c) => c.contacto_para_crisis);
    if (crisisContacts.length > 3) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["lista"],
        message: "Máximo 3 contactos de crisis para evitar sobrecarga en urgencias.",
      });
    }
  });

export type RedApoyoData = z.infer<typeof RedApoyoSchema>;

// ---------------------------------------------------------------------------
// 8. PREFERENCIAS
// ---------------------------------------------------------------------------
export const FormatoPreferidoSchema = z.enum([
  "video",
  "audio",
  "lectura",
  "ejercicio_guiado",
  "meditacion",
  "journaling",
  "visualizacion_3d",
]);

export const PreferenciasSchema = z
  .object({
    formatos: z
      .array(FormatoPreferidoSchema)
      .min(1, { message: "Elige al menos un formato." })
      .max(7),
    minutos_dia: z
      .number()
      .int()
      .min(5, { message: "Al menos 5 minutos al día." })
      .max(90, { message: "Máximo 90 minutos al día. El descanso también cuenta." }),
    idioma: z.enum(["es-CO", "es-MX", "es-ES", "es-AR"]).default("es-CO"),
    voz_tts: z.enum(["masculina", "femenina", "neutra"]).default("neutra"),
    reducir_movimiento: z.boolean().default(false),
    alto_contraste: z.boolean().default(false),
    dislexia_friendly: z.boolean().default(false),
    texto_grande: z.boolean().default(false),
    recordatorios_suaves: z.boolean().default(true),
  })
  .strict();

export type PreferenciasData = z.infer<typeof PreferenciasSchema>;

// ---------------------------------------------------------------------------
// 9. RECOVERY PROFILE COMPLETO (FUENTE ÚNICA DE VERDAD)
// ---------------------------------------------------------------------------
export const RecoveryProfileSchema = z.object({
  id: z.string().uuid(),
  consent: ConsentSchema,
  objetivo: ObjetivoSchema,
  etapa: EtapaSchema,
  sustancias: SustanciasSchema,
  desencadenantes: DesencadenantesSchema,
  valores: ValoresACTSchema,
  red_apoyo: RedApoyoSchema,
  preferencias: PreferenciasSchema,
  metadatos: z.object({
    creado_en: z.string().datetime(),
    actualizado_en: z.string().datetime(),
    dispositivo_id: z.string().uuid(),
    version_app: z.string(),
    dias_activo: z.number().int().nonnegative().default(0),
    sesiones_completadas: z.number().int().nonnegative().default(0),
    crisis_navegadas: z.number().int().nonnegative().default(0),
  }),
  cifrado: z
    .object({
      activo: z.boolean(),
      algoritmo: z.literal("AES-GCM-256").optional(),
      pbkdf2_iteraciones: z.number().int().optional(),
    })
    .optional(),
}).strict();

export type RecoveryProfile = z.infer<typeof RecoveryProfileSchema>;

// ---------------------------------------------------------------------------
// 10. UTILIDADES DE VALIDACIÓN CON FEEDBACK EMPÁTICO
// ---------------------------------------------------------------------------
export interface ValidationFeedback {
  ok: boolean;
  errors: Record<string, string>;
  warnings: string[];
}

export function validateWithEmpathy<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
): { success: true; data: T } | { success: false; feedback: ValidationFeedback } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  const errors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const path = issue.path.join(".") || "root";
    errors[path] = issue.message;
  }
  return { success: false, feedback: { ok: false, errors, warnings: [] } };
}

export const SCHEMAS_VERSION = "2.0.0";

// ============================================================================
// BLUMHELPS — ENRIQUECEDOR DE RUTA (wizard × brújula × catálogo)
// ============================================================================
// Capa ADITIVA: no reescribe recoveryNavigator. Toma el RecoveryRoute que ya
// genera el wizard de 3 pantallas y lo cruza con la brújula de valores y el
// catálogo de 20 ítems con evidencia, para que el plan de 24h deje de ser
// genérico y se vuelva personalizado con razones granulares.
// ============================================================================

import type { Reason } from "./types";
import type { RecoveryItem } from "./types";
import { recoveryCatalog } from "../../data/recovery/catalog";
import { scoreByValues, analizarValores, type ValorDeclarado } from "./valuesEngine";

export interface EnhancedStep {
  id: string;
  title: string;
  description: string;
  time: string;
  priority?: string;
  razones: Reason[];
  catalogoRefs: RecoveryItem[];
}

export interface EnhancedRoute {
  title: string;
  message: string;
  steps: EnhancedStep[];
  ancla: ValorDeclarado | null;
  congruencia: number;
  voz: string;
}

// Mapeo heurístico y AUDITABLE: respuesta del wizard → temas del catálogo
const PERFIL_A_TEMAS: Record<string, string[]> = {
  riskNow:        ["manejo_recaidas", "apoyo_social", "autocompasion"],
  needHelpNow:    ["apoyo_social", "comunicacion_asertiva"],
  wantToChange:   ["modelo_transteorico", "activacion_conductual"],
  triedBefore:    ["manejo_recaidas", "autocompasion"],
  haveSupport:    ["apoyo_social", "comunicacion_asertiva"],
  forSomeone:     ["apoyo_social", "comunicacion_asertiva"],
};

function temasPorSustancia(substance: string): string[] {
  if (!substance || substance === "unsure") return [];
  return ["craving_como_ola", "higiene_sueno", "regulacion_emocional"];
}

/**
 * Enriquece un RecoveryRoute (del wizard legacy) cruzándolo con brújula + catálogo.
 * No muta el route original: devuelve una proyección enriquecida.
 */
export function enhanceRoute(
  route: { title: string; message: string; steps: Array<{ id: string; title: string; description: string; time: string; priority?: string }>; encouragement?: string },
  input: Record<string, unknown>,
  valores: ValorDeclarado[],
): EnhancedRoute {
  const analisis = analizarValores(valores);
  const ancla = analisis.ancla;

  // Temas activados por las respuestas del wizard
  const temasActivados = new Set<string>();
  for (const [k, v] of Object.entries(input)) {
    if (v === true && PERFIL_A_TEMAS[k]) {
      for (const t of PERFIL_A_TEMAS[k]) temasActivados.add(t);
    }
  }
  if (typeof input.substance === "string") {
    for (const t of temasPorSustancia(input.substance)) temasActivados.add(t);
  }
  // Si hay brújula, los temas del valor ancla entran con prioridad
  if (ancla) {
    const temasAncla = DOMINIO_A_TEMAS_LOCAL[ancla.dominio] ?? [];
    for (const t of temasAncla) temasActivados.add(t);
  }

  // Catálogo relevante: ítems cuyo tema está activado
  const relevantes = recoveryCatalog.filter((it) => temasActivados.has(it.tema));

  // Enriquecer cada paso del wizard con razones + refs de catálogo
  const steps: EnhancedStep[] = route.steps.map((s, i) => {
    // Razones: si el paso es de crisis, razón de seguridad; si no, razón por perfil
    const razones: Reason[] = [];
    if (s.priority === "urgent") {
      razones.push({
        peso: 50,
        dimension: "desencadenante",
        explicacion: "Prioridad seguridad: este paso va primero porque tu respuesta indicó riesgo inmediato.",
      });
    }
    // Cruzar paso con catálogo: el paso i toma el ítem relevante i-ésimo
    const ref = relevantes[i] ?? relevantes[0];
    if (ref) {
      const rs = scoreByValues(valores, ref.tema, ref.tags ?? []);
      for (const r of rs) razones.push(r);
      if (razones.length === 0) {
        razones.push({
          peso: 15,
          dimension: "etapa",
          explicacion: "Este paso trabaja " + ref.tema.replace(/_/g, " ") + ", alineado con lo que reportaste.",
        });
      }
    }
    return {
      id: s.id,
      title: s.title,
      description: s.description,
      time: s.time,
      priority: s.priority,
      razones,
      catalogoRefs: ref ? [ref] : [],
    };
  });

  // Paso extra por valor ancla (si existe y no está ya cubierto)
  if (ancla && relevantes.length > 0) {
    const itemAncla = relevantes.find((it) => it.tema === "activacion_conductual" || it.tema === "valores_personales") ?? relevantes[0];
    const rs = scoreByValues(valores, itemAncla.tema, itemAncla.tags ?? []);
    steps.push({
      id: "ancla-" + ancla.dominio,
      title: "Cuida tu valor ancla: " + ancla.dominio,
      description: itemAncla.microAccion,
      time: "HOY",
      priority: "ancla",
      razones: rs.length > 0 ? rs : [{
        peso: 30,
        dimension: "valor_ACT",
        explicacion: "Tu brújula marca " + ancla.dominio + " (importancia " + ancla.importancia + ", coherencia " + ancla.coherencia + "). Este paso cierra la brecha.",
      }],
      catalogoRefs: [itemAncla],
    });
  }

  // Mensaje de voz personalizado
  const partes: string[] = [];
  partes.push("Esta es tu ruta de 24 horas.");
  if (ancla) {
    partes.push("Tu brújula marca " + ancla.dominio + " como prioridad: te importa " + ancla.importancia + " de 10 y lo vives " + ancla.coherencia + " de 10.");
  }
  partes.push("No tienes que hacerlo todo. Elige un paso pequeño y ejecútalo.");
  if (route.encouragement) partes.push(route.encouragement);

  return {
    title: route.title,
    message: route.message,
    steps,
    ancla,
    congruencia: analisis.congruencia,
    voz: partes.join(" "),
  };
}

// Mapeo dominio → temas (duplicado local para no acoplar a valuesEngine internals)
const DOMINIO_A_TEMAS_LOCAL: Record<string, string[]> = {
  Vinculos:       ["apoyo_social", "comunicacion_asertiva"],
  Familia:        ["apoyo_social", "comunicacion_asertiva", "autocompasion"],
  Salud:          ["higiene_sueno", "mindfulness", "regulacion_emocional", "activacion_conductual"],
  Trabajo:        ["activacion_conductual", "regulacion_emocional", "manejo_recaidas"],
  Aprendizaje:    ["modelo_transteorico", "defusion_cognitiva"],
  Comunidad:      ["apoyo_social", "prevencion_sintomas"],
  Creatividad:    ["activacion_conductual", "autocompasion"],
  Espiritualidad: ["valores_personales", "mindfulness", "autocompasion"],
  "Ocio y juego": ["activacion_conductual", "mindfulness"],
  Autonomia:      ["defusion_cognitiva", "comunicacion_asertiva", "manejo_recaidas"],
};

export const ROUTE_ENHANCER_VERSION = "2.4.0";

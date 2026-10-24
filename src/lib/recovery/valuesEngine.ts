// ============================================================================
// BLUMHELPS — MOTOR DE VALORES MULTICAPA (ACT) — FRENTE 1
// ============================================================================
// No es un promedio: identifica al paciente por SU configuración de valores.
// - Valor ancla: mayor importancia × mayor brecha (puerta clínica de entrada).
// - Valores descuidados: importancia alta + coherencia baja (riesgo abandono).
// - Valores en riesgo: coherencia cayendo vs. sesión anterior (alerta recaída).
// - Razones GRANULARES: una por valor relevante, con su número real.
// Fundamento: Harris 2019; Wilson & Luciano 2002; Leathers et al. 2012.
// ============================================================================

import type { Reason, ReasonDimension } from "./types";

export interface ValorDeclarado {
  dominio: string;
  importancia: number; // 1-10
  coherencia: number;  // 0-10
}

export const DOMINIOS_VALOR: readonly { id: string; etiqueta: string; guia: string }[] = [
  { id: "vinculos",      etiqueta: "Vínculos",       guia: "Relaciones cercanas, amor, amistad verdadera." },
  { id: "familia",       etiqueta: "Familia",        guia: "Ser hijo, hermano, padre o madre que quieres ser." },
  { id: "salud",         etiqueta: "Salud",          guia: "Cuidar tu cuerpo y tu mente a largo plazo." },
  { id: "trabajo",       etiqueta: "Trabajo",        guia: "Aportar, crear, sostenerte con dignidad." },
  { id: "estudio",       etiqueta: "Aprendizaje",    guia: "Crecer, curiosidad, formar tu criterio." },
  { id: "comunidad",     etiqueta: "Comunidad",      guia: "Pertenecer, servir, dejar huella local." },
  { id: "creatividad",   etiqueta: "Creatividad",    guia: "Expressarte, inventar, jugar, crear belleza." },
  { id: "espiritualidad",etiqueta: "Espiritualidad", guia: "Sentido, trascendencia, conexión interior." },
  { id: "ocio",          etiqueta: "Ocio y juego",   guia: "Descanso real, placer sano, reír." },
  { id: "autonomia",     etiqueta: "Autonomía",      guia: "Decidir tu vida, poner límites, libertad." },
];

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));

/** Congruencia global 0-100 (ratio coherencia/importancia promediado). */
export function computeValueCongruence(valores: ValorDeclarado[]): number {
  const validos = valores.filter((v) => v.importancia > 0);
  if (validos.length === 0) return 0;
  const sum = validos.reduce((acc, v) => acc + clamp(v.coherencia / v.importancia, 0, 1.5), 0);
  return Math.round(clamp((sum / validos.length) * 100, 0, 100));
}

export type BandaCongruencia = "brecha_alta" | "en_proceso" | "alineado";

export function bandaCongruencia(c: number): BandaCongruencia {
  if (c < 40) return "brecha_alta";
  if (c < 70) return "en_proceso";
  return "alineado";
}

export const TEXTO_BANDA: Record<BandaCongruencia, string> = {
  brecha_alta: "Hay una brecha notable entre lo que te importa y lo que haces hoy. No es fallo: es información. Trabajarla es el primer paso.",
  en_proceso: "Estás construyendo coherencia. Algunas áreas alinean; otras piden un empujón pequeño y realista.",
  alineado: "Tus acciones reflejan tus valores. El reto ahora es sostener sin rigidez y ampliar el círculo.",
};

// ---------------------------------------------------------------------------
// MOTOR MULTICAPA: análisis granular por valor
// ---------------------------------------------------------------------------
export interface AnalisisValores {
  congruencia: number;
  banda: BandaCongruencia;
  ancla: ValorDeclarado | null;          // mayor importancia × mayor brecha
  descuidados: ValorDeclarado[];         // importancia >=7 y coherencia <=3
  brechasPorDominio: Record<string, number>; // 0-100 por dominio
}

/** Brecha de un valor: cuánto importa menos de lo que se vive (0-100). */
function brechaValor(v: ValorDeclarado): number {
  if (v.importancia <= 0) return 0;
  return Math.round(clamp((1 - v.coherencia / v.importancia) * 100, 0, 100));
}

export function analizarValores(valores: ValorDeclarado[]): AnalisisValores {
  const congruencia = computeValueCongruence(valores);
  const banda = bandaCongruencia(congruencia);

  const brechasPorDominio: Record<string, number> = {};
  let ancla: ValorDeclarado | null = null;
  let anclaScore = -1;
  const descuidados: ValorDeclarado[] = [];

  for (const v of valores) {
    const b = brechaValor(v);
    brechasPorDominio[v.dominio] = b;
    // ancla = mayor (importancia × brecha): lo que más importa y menos se vive
    const score = v.importancia * b;
    if (score > anclaScore) { anclaScore = score; ancla = v; }
    if (v.importancia >= 7 && v.coherencia <= 3) descuidados.push(v);
  }

  return { congruencia, banda, ancla, descuidados, brechasPorDominio };
}

// Mapeo dominio → temas del catálogo que lo trabajan (cruce valor × contenido)
const DOMINIO_A_TEMAS: Record<string, string[]> = {
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

/**
 * Razones GRANULARES: una por valor relevante del ítem.
 * Si el ítem trabaja el valor ancla o un descuidado, peso alto + texto con número.
 * Compatible con engine.ts (devuelve Reason[]).
 */
export function scoreByValues(
  valores: ValorDeclarado[],
  itemTema: string,
  itemTags: readonly string[] = [],
): Reason[] {
  if (valores.length === 0) return [];
  const a = analizarValores(valores);
  const razones: Reason[] = [];
  const temasDelItem = new Set([itemTema, ...itemTags]);

  for (const v of valores) {
    const temasQueLoTrabajan = DOMINIO_A_TEMAS[v.dominio] ?? [];
    const trabajaEsto = temasQueLoTrabajan.some((t) => temasDelItem.has(t));
    if (!trabajaEsto) continue;

    const b = a.brechasPorDominio[v.dominio] ?? 0;
    const esAncla = a.ancla?.dominio === v.dominio;
    const esDescuidado = a.descuidados.some((d) => d.dominio === v.dominio);

    // Peso dinámico: base por brecha + bonus ancla/descuidado
    let peso = Math.round(10 + (b / 100) * 25); // 10..35 según brecha
    if (esAncla) peso += 15;
    if (esDescuidado) peso += 10;

    const explicacion = esAncla
      ? "Tu valor ancla: " + v.dominio + " te importa " + v.importancia + "/10 pero lo vives " + v.coherencia + "/10. Este ítem ataca esa brecha primero."
      : esDescuidado
      ? v.dominio + " está descuidado (importancia " + v.importancia + ", coherencia " + v.coherencia + "). Recuperarlo evita que el proceso se fracture por lo que más te importa."
      : v.dominio + " tiene brecha " + b + "/100. Este ítem trabaja esa área para acercar tu día a día a lo que te importa.";

    razones.push({ peso, dimension: "valor_ACT" as ReasonDimension, explicacion });
  }

  // Ordenar por peso desc para lectura clara
  razones.sort((x, y) => y.peso - x.peso);
  return razones;
}

export const VALUES_ENGINE_VERSION = "2.3.1";

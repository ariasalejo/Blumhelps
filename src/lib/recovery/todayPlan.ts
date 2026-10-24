// ============================================================================
// BLUMHELPS — PLAN DE HOY POR VALOR ANCLA (FRENTE MEJORA #1)
// ============================================================================
// Cruza la brújula (valor ancla + descuidados) con el catálogo de 20 ítems
// con evidencia, y arma 3 pasos + 1 micro-acción, CADA UNO con su razón
// granular. Genera el mensaje de voz que le habla al paciente por SU brecha.
// Esto es lo que ningún competidor hace: no es genérico, es "te veo".
// ============================================================================

import type { ScoredItem } from "./types";
import { recoveryCatalog } from "../../data/recovery/catalog";
import {
  analizarValores,
  scoreByValues,
  TEXTO_BANDA,
  type ValorDeclarado,
} from "./valuesEngine";

export interface TodayPlan {
  fecha: string;
  ancla: ValorDeclarado | null;
  congruencia: number;
  mensajeVoz: string;
  sugerencias: ScoredItem[];
  microAccion: ScoredItem | null;
}

function scoreItemConValores(
  valores: ValorDeclarado[],
  item: (typeof recoveryCatalog)[number],
): ScoredItem {
  const reasons = scoreByValues(valores, item.tema, item.tags ?? []);
  const score = reasons.reduce((a, r) => a + r.peso, 0);
  return { item, score, reasons };
}

export function buildTodayPlan(valores: ValorDeclarado[]): TodayPlan {
  const fecha = new Date().toISOString().slice(0, 10);
  if (valores.length === 0) {
    return { fecha, ancla: null, congruencia: 0, mensajeVoz: "", sugerencias: [], microAccion: null };
  }

  const analisis = analizarValores(valores);
  const scored = recoveryCatalog
    .map((it) => scoreItemConValores(valores, it))
    .filter((s) => s.score > 0);
  scored.sort((a, b) => b.score - a.score);

  // Top 3 con diversidad de tema (no repetir el mismo ángulo)
  const vistos = new Set<string>();
  const sugerencias: ScoredItem[] = [];
  for (const s of scored) {
    if (sugerencias.length >= 3) break;
    if (vistos.has(s.item.tema)) continue;
    vistos.add(s.item.tema);
    sugerencias.push(s);
  }

  // Micro-acción: la más corta relevante no ya elegida
  const usados = new Set(sugerencias.map((s) => s.item.id));
  const micros = scored
    .filter((s) => !usados.has(s.item.id) && s.item.duracionMin <= 5)
    .sort((a, b) => a.item.duracionMin - b.item.duracionMin);
  const microAccion = micros[0] ?? null;

  // Mensaje de voz personalizado por valor ancla (el "te veo")
  const ancla = analisis.ancla;
  const partes: string[] = [];
  partes.push("Hola. Gracias por estar aquí.");
  if (ancla) {
    partes.push(
      "Hoy tu brújula marca " + ancla.dominio + " como prioridad: te importa " +
      ancla.importancia + " de 10 y lo vives " + ancla.coherencia + " de 10.",
    );
  }
  partes.push("Tu coherencia global es " + analisis.congruencia + " sobre 100. " + TEXTO_BANDA[analisis.banda]);
  if (sugerencias[0]) {
    partes.push("Empecemos por: " + sugerencias[0].item.titulo + ". " + sugerencias[0].item.microAccion);
  }
  const mensajeVoz = partes.join(" ");

  return { fecha, ancla, congruencia: analisis.congruencia, mensajeVoz, sugerencias, microAccion };
}

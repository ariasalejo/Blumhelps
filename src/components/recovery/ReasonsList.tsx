// ============================================================================
// BLUMHELPS — LISTA DE RAZONES VISUALES (P4: motor explicable, cero caja negra)
// ============================================================================
// Renderiza Reason[] como barras de peso con color por dimensión y texto real.
// Accesible: role=list, aria-label por ítem, contraste AA.
// ============================================================================
import React from "react";
import type { Reason, ReasonDimension } from "../../lib/recovery/types";

const COLOR: Record<ReasonDimension, string> = {
  etapa: "bg-[var(--moss)]",
  desencadenante: "bg-[var(--terra)]",
  formato: "bg-[var(--gold)]",
  evidencia: "bg-[var(--lime)]",
  progreso: "bg-gray-400",
  diversidad: "bg-[var(--forest,#2f6f4f)]",
  valor_ACT: "bg-[var(--coral,#e07a5f)]",
  tiempo_disponible: "bg-[var(--sage,#8aa896)]",
};

const LABEL: Record<ReasonDimension, string> = {
  etapa: "Etapa de cambio",
  desencadenante: "Desencadenante",
  formato: "Formato preferido",
  evidencia: "Nivel de evidencia",
  progreso: "Progreso reciente",
  diversidad: "Diversidad de temas",
  valor_ACT: "Coherencia de valores",
  tiempo_disponible: "Tiempo disponible",
};

export function ReasonsList({ reasons, max = 6 }: { reasons: Reason[]; max?: number }) {
  if (!reasons || reasons.length === 0) {
    return <p className="text-sm text-gray-500">Sin razones adicionales para este ítem.</p>;
  }
  const sorted = [...reasons].sort((a, b) => b.peso - a.peso).slice(0, max);
  const absMax = Math.max(...sorted.map((r) => Math.abs(r.peso)), 1);

  return (
    <ul className="space-y-2" aria-label="Razones de esta recomendación">
      {sorted.map((r, i) => {
        const w = Math.round((Math.abs(r.peso) / absMax) * 100);
        const negativo = r.peso < 0;
        return (
          <li key={i} className="text-sm">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="font-medium text-gray-700">{LABEL[r.dimension] ?? r.dimension}</span>
              <span className={"text-xs font-mono " + (negativo ? "text-red-600" : "text-[var(--moss)]")}>
                {negativo ? "" : "+"}{r.peso}
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden" role="presentation">
              <div
                className={"h-full rounded-full transition-all duration-500 " + (COLOR[r.dimension] ?? "bg-gray-400")}
                style={{ width: w + "%" }}
              />
            </div>
            <p className="mt-1 text-xs text-gray-600 leading-snug">{r.explicacion}</p>
          </li>
        );
      })}
    </ul>
  );
}

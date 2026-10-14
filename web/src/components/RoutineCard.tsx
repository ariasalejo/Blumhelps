import React from "react";
import { Routine } from "../hooks/useRoutines";
import { speak } from "../lib/tts";

export default function RoutineCard({ routine, onToggle, onRemove, streak }: { routine: Routine; onToggle: (id: string) => void; onRemove: (id: string) => void; streak: number }) {
  const todayKey = new Date().toISOString().slice(0, 10);
  const checkedToday = routine.checkins.includes(todayKey);

  return (
    <article className="card-bh" aria-live="polite">
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <div style={{ flex: 1 }}>
          <h3 className="text-lg font-semibold" style={{ margin: 0 }}>{routine.title}</h3>
          {routine.description && <p className="muted" style={{ margin: "6px 0" }}>{routine.description}</p>}
          <small className="muted">Creada {new Date(routine.createdAt).toLocaleDateString()}</small>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn-primary" onClick={() => onToggle(routine.id)} aria-pressed={checkedToday}>
              {checkedToday ? "✅ Hecho" : "○ Marcar"}
            </button>
            <button className="btn-ghost" onClick={() => onRemove(routine.id)} aria-label={`Eliminar ${routine.title}`}>
              Eliminar
            </button>
            <button className="btn-ghost" onClick={() => speak(routine.title + ". " + (routine.description ?? ""))} aria-label={`Leer ${routine.title}`}>
              ▶︎
            </button>
          </div>
          <small className="muted">Check-ins: {routine.checkins.length} · Racha: {streak}</small>
        </div>
      </div>
    </article>
  );
}

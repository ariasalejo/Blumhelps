import React, { useEffect, useState } from "react";
import { Routine } from "../hooks/useRoutines";
import { speak } from "../lib/tts";
import { pickMotivation } from "../lib/motivations";

export default function RoutineCard({ routine, onToggle, onRemove, streak }: { routine: Routine; onToggle: (id: string) => void; onRemove: (id: string) => void; streak: number }) {
  const todayKey = new Date().toISOString().slice(0, 10);
  const checkedToday = routine.checkins.includes(todayKey);
  const [showCelebrate, setShowCelebrate] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let t: number | undefined;
    if (showCelebrate) {
      t = window.setTimeout(() => setShowCelebrate(false), 2600);
    }
    return () => { if (t) window.clearTimeout(t); };
  }, [showCelebrate]);

  const handleToggle = () => {
    onToggle(routine.id);
    const nextChecked = !checkedToday;
    if (!checkedToday && nextChecked === true) {
      // just marked done
      const m = pickMotivation();
      setMessage(m);
      setShowCelebrate(true);
      try { speak(m); } catch { /* noop */ }
    }
  };

  return (
    <article className="card-bh" aria-live="polite" style={{ position: 'relative', overflow: 'visible' }}>
      {showCelebrate && (
        <div className="celebrate-overlay" role="status" aria-hidden={!showCelebrate}>
          <div className="celebrate-content">
            <div className="confetti" aria-hidden="true">🎉</div>
            <strong>{message}</strong>
          </div>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <div style={{ flex: 1 }}>
          <h3 className="text-lg font-semibold" style={{ margin: 0 }}>{routine.title}</h3>
          {routine.description && <p className="muted" style={{ margin: "6px 0" }}>{routine.description}</p>}
          <small className="muted">Creada {new Date(routine.createdAt).toLocaleDateString()}</small>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn-primary" onClick={handleToggle} aria-pressed={checkedToday} aria-label={checkedToday?`Marcar ${routine.title} como no realizado`:`Marcar ${routine.title} como realizado`}>
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

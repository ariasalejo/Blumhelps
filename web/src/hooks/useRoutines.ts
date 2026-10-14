// web/src/hooks/useRoutines.ts
import { useEffect, useMemo, useState, useCallback } from "react";

export type Routine = {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  checkins: string[]; // array of date keys YYYY-MM-DD
};

const KEY = "blumhelps.routines.v1";

function todayKey(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function readRoutines(): Routine[] {
  try {
    const raw = typeof window !== "undefined" ? window.localStorage.getItem(KEY) : null;
    if (!raw) return [];
    return JSON.parse(raw) as Routine[];
  } catch {
    return [];
  }
}

export function useRoutines() {
  const [routines, setRoutines] = useState<Routine[]>(() => readRoutines());

  useEffect(() => {
    if (typeof window === "undefined") return;
    const id = window.setTimeout(() => {
      try {
        window.localStorage.setItem(KEY, JSON.stringify(routines));
      } catch {
        // ignore
      }
    }, 200);
    return () => window.clearTimeout(id);
  }, [routines]);

  const addRoutine = useCallback((title: string, description?: string) => {
    const clean = title.trim().slice(0, 140);
    if (!clean) return;
    setRoutines((prev) => [
      ...prev,
      { id: `r-${Date.now()}`, title: clean, description, createdAt: new Date().toISOString(), checkins: [] },
    ]);
  }, []);

  const toggleCheckin = useCallback((id: string, dateKey?: string) => {
    const d = dateKey ?? todayKey();
    setRoutines((prev) =>
      prev.map((r) =>
        r.id !== id
          ? r
          : {
              ...r,
              checkins: r.checkins.includes(d) ? r.checkins.filter((x) => x !== d) : [...r.checkins, d],
            },
      ),
    );
  }, []);

  const removeRoutine = useCallback((id: string) => {
    setRoutines((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const countsByDay = useCallback((days = 14) => {
    const list: { key: string; count: number }[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = todayKey(d);
      const count = routines.reduce((s, r) => (r.checkins.includes(key) ? s + 1 : s), 0);
      list.push({ key, count });
    }
    return list;
  }, [routines]);

  const totalCheckins = useMemo(() => routines.reduce((s, r) => s + r.checkins.length, 0), [routines]);

  const streakFor = useCallback((routine: Routine) => {
    // compute consecutive days up to today
    let streak = 0;
    for (let i = 0; ; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const k = todayKey(d);
      if (routine.checkins.includes(k)) streak++; else break;
    }
    return streak;
  }, []);

  return {
    routines,
    addRoutine,
    toggleCheckin,
    removeRoutine,
    countsByDay,
    totalCheckins,
    streakFor,
    todayKey,
  } as const;
}

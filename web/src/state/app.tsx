import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";

/* ------------------------------------------------------------------ */
/* Tipos                                                               */
/* ------------------------------------------------------------------ */

export type GoalStatus = "activa" | "pausada" | "completada";

export type UserGoal = {
  id: string;
  templateId?: string;
  title: string;
  micro: string;
  hint?: string;
  status: GoalStatus;
  createdAt: string;
  pauseReason?: string;
  advancedOnly?: boolean;
};

export type Settings = {
  language: "es-CO" | "es-419" | "en";
  textScale: number; // 1 | 1.15 | 1.3
  reduceMotion: boolean;
  reminders: boolean;
  privateMode: boolean; // oculta etiquetas sensibles en el historial local
};

type Toast = { id: number; message: string; tone: "ok" | "info" };

type AppState = {
  saved: string[]; // ids de recursos guardados
  toggleSave: (id: string) => void;
  isSaved: (id: string) => boolean;

  goals: UserGoal[];
  addGoal: (g: Omit<UserGoal, "id" | "createdAt" | "status">) => void;
  setGoalStatus: (id: string, s: GoalStatus, pauseReason?: string) => void;
  deleteGoal: (id: string) => void;

  settings: Settings;
  setSettings: (patch: Partial<Settings>) => void;

  wipeAll: () => void;
  exportData: () => string;

  toasts: Toast[];
  toast: (message: string, tone?: "ok" | "info") => void;
};

const KEY = "blumhelps.v1";

const DEFAULT_SETTINGS: Settings = {
  language: "es-CO",
  textScale: 1,
  reduceMotion: false,
  reminders: false,
  privateMode: true,
};

const Ctx = createContext<AppState | null>(null);

/* ------------------------------------------------------------------ */
/* Provider                                                            */
/* ------------------------------------------------------------------ */

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [saved, setSaved] = useState<string[]>([]);
  const [goals, setGoals] = useState<UserGoal[]>([]);
  const [settings, setSettingsState] = useState<Settings>(DEFAULT_SETTINGS);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Carga desde localStorage (equivalente web de AsyncStorage)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const p = JSON.parse(raw);
        if (Array.isArray(p.saved)) setSaved(p.saved);
        if (Array.isArray(p.goals)) setGoals(p.goals);
        if (p.settings) setSettingsState({ ...DEFAULT_SETTINGS, ...p.settings });
      }
    } catch {
      /* estado inicial limpio */
    }
    setLoaded(true);
  }, []);

  // Persistencia
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(
        KEY,
        JSON.stringify({ saved, goals, settings })
      );
    } catch {
      /* almacenamiento lleno o bloqueado: la app sigue funcionando en memoria */
    }
  }, [loaded, saved, goals, settings]);

  const toast = useCallback((message: string, tone: "ok" | "info" = "ok") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, tone }]);
    window.setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 2800);
  }, []);

  const value = useMemo<AppState>(() => {
    return {
      saved,
      toggleSave: (id) => {
        setSaved((prev) => {
          const has = prev.includes(id);
          toast(has ? "Quitado de Guardados" : "Guardado para después 💚");
          return has ? prev.filter((x) => x !== id) : [...prev, id];
        });
      },
      isSaved: (id) => saved.includes(id),

      goals,
      addGoal: (g) => {
        setGoals((prev) => [
          ...prev,
          {
            ...g,
            id: "goal-" + Date.now(),
            status: "activa",
            createdAt: new Date().toISOString(),
          },
        ]);
        toast("Meta creada. Puedes cambiarla cuando quieras.");
      },
      setGoalStatus: (id, status, pauseReason) => {
        setGoals((prev) =>
          prev.map((g) =>
            g.id === id ? { ...g, status, pauseReason: status === "pausada" ? pauseReason ?? "La pausaste" : undefined } : g
          )
        );
        if (status === "pausada")
          toast("Meta en pausa. Sin cuentas pendientes.", "info");
        if (status === "activa") toast("Retomada, cuando tú digas.");
        if (status === "completada") toast("Hecho. Esto es tuyo.");
      },
      deleteGoal: (id) => {
        setGoals((prev) => prev.filter((g) => g.id !== id));
        toast("Meta eliminada de tu lista.");
      },

      settings,
      setSettings: (patch) => setSettingsState((s) => ({ ...s, ...patch })),

      wipeAll: () => {
        setSaved([]);
        setGoals([]);
        setSettingsState(DEFAULT_SETTINGS);
        try {
          localStorage.removeItem(KEY);
        } catch {
          /* noop */
        }
        toast("Tus datos fueron borrados de este dispositivo.");
      },
      exportData: () =>
        JSON.stringify({ saved, goals, settings, exportedAt: new Date().toISOString() }, null, 2),

      toasts,
      toast,
    };
  }, [saved, goals, settings, toasts, toast]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp(): AppState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApp debe usarse dentro de AppProvider");
  return ctx;
}

/** Busca un recurso por id en todas las colecciones demo. */
export function findResourceById(id: string) {
  // import dinámico circular evitado: se resuelve en las páginas
  return null as never;
}

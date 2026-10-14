import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

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
  textScale: number;
  reduceMotion: boolean;
  reminders: boolean;
  privateMode: boolean;
};

type Toast = { id: number; message: string; tone: "ok" | "info" };

type AppState = {
  saved: string[];
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

const ALLOWED_TEXT_SCALES = [1, 1.15, 1.3] as const;

const Ctx = createContext<AppState | null>(null);

function normalizeSettings(input: Partial<Settings> | undefined): Settings {
  const base = { ...DEFAULT_SETTINGS, ...(input ?? {}) };
  const nextScale = ALLOWED_TEXT_SCALES.includes(base.textScale as 1 | 1.15 | 1.3)
    ? base.textScale
    : DEFAULT_SETTINGS.textScale;
  return {
    ...base,
    textScale: nextScale,
    language: base.language === "es-CO" || base.language === "es-419" || base.language === "en"
      ? base.language
      : DEFAULT_SETTINGS.language,
  };
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [saved, setSaved] = useState<string[]>([]);
  const [goals, setGoals] = useState<UserGoal[]>([]);
  const [settings, setSettingsState] = useState<Settings>(DEFAULT_SETTINGS);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      setLoaded(true);
      return;
    }

    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { saved?: string[]; goals?: UserGoal[]; settings?: Partial<Settings> };
        if (Array.isArray(parsed.saved)) setSaved(parsed.saved);
        if (Array.isArray(parsed.goals)) setGoals(parsed.goals);
        if (parsed.settings) setSettingsState(normalizeSettings(parsed.settings));
      }
    } catch {
      // start from clean state
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!loaded || typeof window === "undefined") return;
    const timer = window.setTimeout(() => {
      try {
        window.localStorage.setItem(KEY, JSON.stringify({ saved, goals, settings }));
      } catch {
        // storage unavailable or full; app continues in-memory
      }
    }, 180);

    return () => window.clearTimeout(timer);
  }, [loaded, saved, goals, settings]);

  const toast = useCallback((message: string, tone: "ok" | "info" = "ok") => {
    const id = Date.now() + Math.random();
    setToasts((current) => [...current, { id, message, tone }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((entry) => entry.id !== id));
    }, 2800);
  }, []);

  const value = useMemo<AppState>(() => ({
    saved,
    toggleSave: (id) => {
      setSaved((previous) => {
        const has = previous.includes(id);
        toast(has ? "Quitado de Guardados" : "Guardado para después 💚");
        return has ? previous.filter((value) => value !== id) : [...previous, id];
      });
    },
    isSaved: (id) => saved.includes(id),

    goals,
    addGoal: (goalInput) => {
      setGoals((previous) => [
        ...previous,
        {
          ...goalInput,
          id: `goal-${Date.now()}`,
          status: "activa",
          createdAt: new Date().toISOString(),
        },
      ]);
      toast("Meta creada. Puedes cambiarla cuando quieras.");
    },
    setGoalStatus: (id, status, pauseReason) => {
      setGoals((previous) =>
        previous.map((goal) =>
          goal.id === id
            ? {
                ...goal,
                status,
                pauseReason: status === "pausada" ? pauseReason ?? "La pausaste" : undefined,
              }
            : goal,
        ),
      );
      if (status === "pausada") toast("Meta en pausa. Sin cuentas pendientes.", "info");
      if (status === "activa") toast("Retomada, cuando tú digas.");
      if (status === "completada") toast("Hecho. Esto es tuyo.");
    },
    deleteGoal: (id) => {
      setGoals((previous) => previous.filter((goal) => goal.id !== id));
      toast("Meta eliminada de tu lista.");
    },

    settings,
    setSettings: (patch) => {
      setSettingsState((current) => normalizeSettings({ ...current, ...patch }));
    },

    wipeAll: () => {
      setSaved([]);
      setGoals([]);
      setSettingsState(DEFAULT_SETTINGS);
      if (typeof window !== "undefined") {
        try {
          window.localStorage.removeItem(KEY);
        } catch {
          // noop
        }
      }
      toast("Tus datos fueron borrados de este dispositivo.");
    },
    exportData: () => JSON.stringify({ saved, goals, settings, exportedAt: new Date().toISOString() }, null, 2),

    toasts,
    toast,
  }), [saved, goals, settings, toasts, toast]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp(): AppState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApp debe usarse dentro de AppProvider");
  return ctx;
}

export function findResourceById(id: string) {
  // placeholder intentionally omitted: local resource lookup should be implemented in the page or data layer
  return null as never;
}

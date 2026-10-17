import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

export type GoalStatus = 'active' | 'paused' | 'completed' | 'archived';

export interface Goal {
  id: string;
  title: string;
  description: string;
  status: GoalStatus;
  createdAt: string;
  lastUpdated: string;
}

interface AppState {
  goals: Goal[];
  saved: string[];
  isLoading: boolean;
  error: string | null;
}

type Action =
  | { type: 'INIT'; payload: { goals: Goal[]; saved: string[] } }
  | { type: 'ADD_GOAL'; payload: Goal }
  | { type: 'UPDATE_GOAL_STATUS'; payload: { id: string; status: GoalStatus } }
  | { type: 'DELETE_GOAL'; payload: string }
  | { type: 'TOGGLE_SAVE'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

const initialState: AppState = { goals: [], saved: [], isLoading: true, error: null };

const AppContext = createContext<{ state: AppState; dispatch: React.Dispatch<Action> } | undefined>(undefined);

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'INIT':
      return { ...state, goals: action.payload.goals, saved: action.payload.saved, isLoading: false };
    case 'ADD_GOAL':
      return { ...state, goals: [action.payload, ...state.goals] };
    case 'UPDATE_GOAL_STATUS':
      return {
        ...state,
        goals: state.goals.map(g => g.id === action.payload.id
          ? { ...g, status: action.payload.status, lastUpdated: new Date().toISOString() }
          : g)
      };
    case 'DELETE_GOAL':
      return { ...state, goals: state.goals.filter(g => g.id !== action.payload) };
    case 'TOGGLE_SAVE': {
      const has = state.saved.includes(action.payload);
      return { ...state, saved: has ? state.saved.filter(x => x !== action.payload) : [...state.saved, action.payload] };
    }
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    const KEY = "blumhelps.v1";
    try {
      const raw = localStorage.getItem(KEY);
      const data = raw ? JSON.parse(raw) : { goals: [], saved: [] };
      dispatch({ type: 'INIT', payload: data });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: 'No se pudieron cargar tus datos.' });
    }
  }, []);

  useEffect(() => {
    if (!state.isLoading) {
      const KEY = "blumhelps.v1";
      localStorage.setItem(KEY, JSON.stringify({ goals: state.goals, saved: state.saved }));
    }
  }, [state.goals, state.saved, state.isLoading]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp debe usarse dentro de AppProvider');
  return context;
}

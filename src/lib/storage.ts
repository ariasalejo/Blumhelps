import { get, set, del } from 'idb-keyval';

export const STORAGE_KEYS = {
  USER_GOALS: 'blumhelps_goals_v1',
  FAVORITE_RESOURCES: 'blumhelps_favorites_v1',
  APP_PREFERENCES: 'blumhelps_prefs_v1',
} as const;

export const storageEngine = {
  async get<T>(key: string, defaultValue: T): Promise<T> {
    try {
      const value = await get(key);
      return value !== undefined ? value : defaultValue;
    } catch (error) {
      console.warn(`[Storage] Error al leer ${key}:`, error);
      return defaultValue;
    }
  },
  async set<T>(key: string, value: T): Promise<void> {
    try {
      await set(key, value);
    } catch (error) {
      console.error(`[Storage] Error al guardar ${key}. ¿Almacenamiento lleno?`, error);
    }
  },
  async remove(key: string): Promise<void> {
    try { await del(key); }
    catch (error) { console.error(`[Storage] Error al eliminar ${key}:`, error); }
  }
};

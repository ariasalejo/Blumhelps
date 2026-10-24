import { del, get, set } from 'idb-keyval';
import type {
  CrisisEvent,
  JournalEntry,
  RecoveryProfile,
} from './types';
import { CONSENT_VERSION } from './types';

const NS = 'blumhelps.recovery.v1';
const KEYS = {
  PROFILE: `${NS}:profile`,
  JOURNAL: `${NS}:journal`,
  CRISIS_EVENTS: `${NS}:crisisEvents`,
  COMPLETED: `${NS}:completed`,
  CONSENT: `${NS}:consent`,
  SETTINGS: `${NS}:settings`,
} as const;

const LS_FALLBACK_PREFIX = NS;

type ConsentRecord = {
  version: string;
  acceptedAt: string;
  ip?: never; // Nunca almacenar IP
  userAgentHash?: string;
};

function lsKey(k: string) {
  return `${LS_FALLBACK_PREFIX}:${k}`;
}

async function safeGet<T>(key: string, fallbackKey: string, def: T): Promise<T> {
  try {
    const v = await get(key);
    if (v !== undefined && v !== null) return v as T;
  } catch (e) {
    console.warn('[recovery/storage] idb-keyval get falló, usando localStorage', e);
  }
  try {
    const raw = localStorage.getItem(fallbackKey);
    if (!raw) return def;
    return JSON.parse(raw) as T;
  } catch (e) {
    console.warn('[recovery/storage] localStorage get falló', e);
    return def;
  }
}

async function safeSet<T>(key: string, fallbackKey: string, value: T): Promise<void> {
  try {
    await set(key, value);
    return;
  } catch (e) {
    console.warn('[recovery/storage] idb-keyval set falló, usando localStorage', e);
  }
  try {
    localStorage.setItem(fallbackKey, JSON.stringify(value));
  } catch (e) {
    console.error('[recovery/storage] No se pudo guardar. Almacenamiento lleno o bloqueado.', e);
  }
}

async function safeDel(key: string, fallbackKey: string): Promise<void> {
  try {
    await del(key);
  } catch (e) {
    console.warn('[recovery/storage] idb-keyval del falló', e);
  }
  try {
    localStorage.removeItem(fallbackKey);
  } catch (e) {
    console.warn('[recovery/storage] localStorage remove falló', e);
  }
}

function warnIfSensitive() {
  // Advertencia visible debe mostrarse en UI. Aquí solo dejamos rastro.
  console.info(
    '[BlumHelps][Recovery] Almacenamiento local-first. Los datos NO están cifrados con clave de usuario en esta versión. Usa "Borrar datos sensibles" al salir.',
  );
}

export const recoveryStorage = {
  namespace: NS,

  async getConsent(): Promise<ConsentRecord | null> {
    warnIfSensitive();
    return safeGet<ConsentRecord | null>(KEYS.CONSENT, lsKey('consent'), null);
  },

  async setConsent(acceptedAt: string = new Date().toISOString()): Promise<ConsentRecord> {
    warnIfSensitive();
    const rec: ConsentRecord = {
      version: CONSENT_VERSION,
      acceptedAt,
    };
    await safeSet(KEYS.CONSENT, lsKey('consent'), rec);
    return rec;
  },

  async needsReconsent(): Promise<boolean> {
    const c = await this.getConsent();
    if (!c) return true;
    return c.version !== CONSENT_VERSION;
  },

  async getProfile(): Promise<RecoveryProfile | null> {
    warnIfSensitive();
    return safeGet<RecoveryProfile | null>(KEYS.PROFILE, lsKey('profile'), null);
  },

  async setProfile(profile: RecoveryProfile): Promise<void> {
    warnIfSensitive();
    const updated = { ...profile, updatedAt: new Date().toISOString() };
    await safeSet(KEYS.PROFILE, lsKey('profile'), updated);
  },

  async deleteProfile(): Promise<void> {
    await safeDel(KEYS.PROFILE, lsKey('profile'));
  },

  async getJournal(): Promise<JournalEntry[]> {
    warnIfSensitive();
    return safeGet<JournalEntry[]>(KEYS.JOURNAL, lsKey('journal'), []);
  },

  async setJournal(entries: JournalEntry[]): Promise<void> {
    warnIfSensitive();
    await safeSet(KEYS.JOURNAL, lsKey('journal'), entries);
  },

  async addJournalEntry(entry: JournalEntry): Promise<JournalEntry[]> {
    const cur = await this.getJournal();
    const next = [entry, ...cur];
    await this.setJournal(next);
    return next;
  },

  async deleteJournal(): Promise<void> {
    await safeDel(KEYS.JOURNAL, lsKey('journal'));
  },

  async getCrisisEvents(): Promise<CrisisEvent[]> {
    warnIfSensitive();
    return safeGet<CrisisEvent[]>(KEYS.CRISIS_EVENTS, lsKey('crisisEvents'), []);
  },

  async addCrisisEvent(ev: CrisisEvent): Promise<CrisisEvent[]> {
    const cur = await this.getCrisisEvents();
    const next = [ev, ...cur];
    await safeSet(KEYS.CRISIS_EVENTS, lsKey('crisisEvents'), next);
    return next;
  },

  async deleteCrisisEvents(): Promise<void> {
    await safeDel(KEYS.CRISIS_EVENTS, lsKey('crisisEvents'));
  },

  async getCompleted(): Promise<string[]> {
    return safeGet<string[]>(KEYS.COMPLETED, lsKey('completed'), []);
  },

  async markCompleted(id: string): Promise<string[]> {
    const cur = await this.getCompleted();
    if (cur.includes(id)) return cur;
    const next = [id, ...cur];
    await safeSet(KEYS.COMPLETED, lsKey('completed'), next);
    return next;
  },

  async unmarkCompleted(id: string): Promise<string[]> {
    const cur = await this.getCompleted();
    const next = cur.filter((x) => x !== id);
    await safeSet(KEYS.COMPLETED, lsKey('completed'), next);
    return next;
  },

  async deleteCompleted(): Promise<void> {
    await safeDel(KEYS.COMPLETED, lsKey('completed'));
  },

  /** Borra SOLO datos del módulo de recuperación. */
  async deleteRecoveryModule(): Promise<void> {
    await Promise.all([
      safeDel(KEYS.PROFILE, lsKey('profile')),
      safeDel(KEYS.JOURNAL, lsKey('journal')),
      safeDel(KEYS.CRISIS_EVENTS, lsKey('crisisEvents')),
      safeDel(KEYS.COMPLETED, lsKey('completed')),
      safeDel(KEYS.CONSENT, lsKey('consent')),
      safeDel(KEYS.SETTINGS, lsKey('settings')),
    ]);
  },

  /** Exportación JSON local (sin envío). */
  async exportRecoveryJson(): Promise<string> {
    const [profile, journal, crisisEvents, completed, consent] = await Promise.all([
      this.getProfile(),
      this.getJournal(),
      this.getCrisisEvents(),
      this.getCompleted(),
      this.getConsent(),
    ]);
    const payload = {
      app: 'BlumHelps',
      module: 'recovery',
      exportedAt: new Date().toISOString(),
      consentVersion: CONSENT_VERSION,
      consent,
      profile,
      journal,
      crisisEvents,
      completed,
      note: 'Exportación local. No contiene datos cifrados con clave de usuario en esta versión.',
    };
    return JSON.stringify(payload, null, 2);
  },
};

/** Borra TODOS los datos locales de BlumHelps (perfil antiguo + plan 24h + módulo). */
export async function deleteAllBlumHelpsLocal(): Promise<void> {
  // Módulo recuperación
  await recoveryStorage.deleteRecoveryModule();
  // Datos legacy
  try {
    localStorage.removeItem('blumhelps.v1');
  } catch {}
  try {
    localStorage.removeItem('blumhelps_profile');
  } catch {}
  try {
    localStorage.removeItem('blumhelps:plan24h');
  } catch {}
  try {
    localStorage.removeItem('blumhelps_goals_v1');
  } catch {}
  try {
    localStorage.removeItem('blumhelps_favorites_v1');
  } catch {}
  try {
    localStorage.removeItem('blumhelps_prefs_v1');
  } catch {}
  // Intentar limpiar claves con prefijo
  try {
    const keys = Object.keys(localStorage);
    for (const k of keys) {
      if (k.startsWith('blumhelps.recovery.v1') || k.startsWith('blumhelps')) {
        localStorage.removeItem(k);
      }
    }
  } catch {}
}

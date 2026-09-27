import { migrate, type GameState } from '../game/state';

/**
 * Where saves live. Local storage today; when login ships, add a
 * CloudSaveBackend (e.g. Firebase / Supabase / your API) implementing the same
 * interface and let SaveManager reconcile local vs. cloud by `lastSaved`.
 */
export interface SaveBackend {
  load(): Promise<string | null>;
  save(data: string): Promise<void>;
  clear(): Promise<void>;
}

const KEY = 'idle-supervillain-save-v1';

export class LocalSaveBackend implements SaveBackend {
  async load() {
    try { return localStorage.getItem(KEY); } catch { return null; }
  }
  async save(data: string) {
    try { localStorage.setItem(KEY, data); } catch { /* storage full / private mode */ }
  }
  async clear() {
    try { localStorage.removeItem(KEY); } catch { /* ignore */ }
  }
}

export class SaveManager {
  constructor(public backends: SaveBackend[] = [new LocalSaveBackend()]) {}

  /** Loads the most recent save across all backends. */
  async load(): Promise<GameState | null> {
    let best: GameState | null = null;
    for (const b of this.backends) {
      const raw = await b.load().catch(() => null);
      if (!raw) continue;
      try {
        const s = migrate(JSON.parse(raw));
        if (!best || s.lastSaved > best.lastSaved) best = s;
      } catch { /* corrupted save; skip */ }
    }
    return best;
  }

  async save(s: GameState) {
    s.lastSaved = Date.now();
    const data = JSON.stringify(s);
    await Promise.all(this.backends.map((b) => b.save(data).catch(() => {})));
  }

  async wipe() {
    await Promise.all(this.backends.map((b) => b.clear()));
  }

  static exportString(s: GameState): string {
    return btoa(unescape(encodeURIComponent(JSON.stringify(s))));
  }

  static importString(str: string): GameState {
    return migrate(JSON.parse(decodeURIComponent(escape(atob(str.trim())))));
  }
}

export const saves = new SaveManager();

import { GENERATORS, type ChestType } from './data';

export const SAVE_VERSION = 1;

export interface BuildJob {
  id: string;
  endsAt: number; // epoch ms
}

export interface GameState {
  version: number;
  createdAt: number;
  lastSaved: number;
  lastTick: number;

  villainName: string;
  funds: number;
  gems: number;
  runEarned: number;
  lifetimeEarned: number;

  gens: number[];
  upgrades: Record<string, true>;
  lair: number;
  devices: Record<string, true>;
  builds: BuildJob[];
  buildSlots: number;

  infamy: number;
  grudges: number;
  perks: Record<string, number>;
  prestiges: number;

  boostUntil: number; // x2 boost (ads / gems / chests), epoch ms
  frenzyUntil: number;
  frenzyMult: number;

  chests: Record<ChestType, number>;
  freeChestAt: number;
  adCooldowns: Record<string, number>; // placement -> epoch ms when available
  daily: { lastClaimDay: string; streak: number };

  purchases: { removeAds: boolean; doubler: boolean; starterPack: boolean };
  settings: { sound: boolean; haptics: boolean; buyMode: BuyMode };

  achievements: Record<string, true>;
  story: Record<string, true>;
  stats: {
    taps: number;
    heroesFoiled: number;
    chestsOpened: number;
    adsWatched: number;
    devicesBuilt: number;
    playSeconds: number;
    tapEarned: number;
  };
}

export type BuyMode = 1 | 10 | 100 | 'max';

export function newGame(now = Date.now()): GameState {
  return {
    version: SAVE_VERSION,
    createdAt: now,
    lastSaved: now,
    lastTick: now,
    villainName: '',
    funds: 0,
    gems: 10,
    runEarned: 0,
    lifetimeEarned: 0,
    gens: GENERATORS.map((_, i) => (i === 0 ? 1 : 0)), // Kevin, your first henchman
    upgrades: {},
    lair: 0,
    devices: {},
    builds: [],
    buildSlots: 1,
    infamy: 0,
    grudges: 0,
    perks: {},
    prestiges: 0,
    boostUntil: 0,
    frenzyUntil: 0,
    frenzyMult: 1,
    chests: { common: 1, rare: 0, epic: 0 },
    freeChestAt: now,
    adCooldowns: {},
    daily: { lastClaimDay: '', streak: 0 },
    purchases: { removeAds: false, doubler: false, starterPack: false },
    settings: { sound: true, haptics: true, buyMode: 1 },
    achievements: {},
    story: {},
    stats: { taps: 0, heroesFoiled: 0, chestsOpened: 0, adsWatched: 0, devicesBuilt: 0, playSeconds: 0, tapEarned: 0 },
  };
}

/** Merges a loaded save over defaults so new fields added in updates get sane values. */
export function migrate(raw: unknown): GameState {
  const base = newGame();
  if (!raw || typeof raw !== 'object') return base;
  const s = raw as Partial<GameState>;
  const merged: GameState = {
    ...base,
    ...s,
    upgrades: { ...(s.upgrades ?? {}) },
    devices: { ...(s.devices ?? {}) },
    perks: { ...(s.perks ?? {}) },
    chests: { ...base.chests, ...(s.chests ?? {}) },
    adCooldowns: { ...(s.adCooldowns ?? {}) },
    daily: { ...base.daily, ...(s.daily ?? {}) },
    purchases: { ...base.purchases, ...(s.purchases ?? {}) },
    settings: { ...base.settings, ...(s.settings ?? {}) },
    achievements: { ...(s.achievements ?? {}) },
    story: { ...(s.story ?? {}) },
    stats: { ...base.stats, ...(s.stats ?? {}) },
    builds: Array.isArray(s.builds) ? s.builds : [],
    version: SAVE_VERSION,
  };
  const gens = Array.isArray(s.gens) ? s.gens : base.gens;
  merged.gens = GENERATORS.map((_, i) => Math.max(0, Math.floor(Number(gens[i]) || 0)));
  for (const k of ['funds', 'gems', 'runEarned', 'lifetimeEarned', 'infamy', 'grudges'] as const) {
    if (!isFinite(merged[k]) || merged[k] < 0) merged[k] = 0;
  }
  return merged;
}

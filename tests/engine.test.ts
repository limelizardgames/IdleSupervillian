import { describe, expect, it } from 'vitest';
import * as E from '../src/game/engine';
import { newGame, migrate } from '../src/game/state';
import { LAIRS, DEVICES } from '../src/game/data';
import { fmt } from '../src/game/format';

describe('format', () => {
  it('abbreviates big numbers', () => {
    expect(fmt(999)).toBe('999');
    expect(fmt(1500)).toBe('1.50K');
    expect(fmt(2.5e9)).toBe('2.50B');
  });
});

describe('engine', () => {
  it('starts with Kevin producing income', () => {
    const s = newGame(0);
    expect(s.gens[0]).toBe(1);
    expect(E.incomePerSec(s, 0)).toBeGreaterThan(0);
  });

  it('buys generators with geometric cost', () => {
    const s = newGame(0);
    s.funds = 1000;
    const c10 = E.genCost(s, 0, 10);
    expect(E.buyGen(s, 0, 10)).toBe(true);
    expect(s.gens[0]).toBe(11);
    expect(s.funds).toBeCloseTo(1000 - c10);
  });

  it('maxAffordable never overspends', () => {
    const s = newGame(0);
    s.funds = 12345;
    const n = E.maxAffordable(s, 0);
    expect(E.genCost(s, 0, n)).toBeLessThanOrEqual(s.funds);
    expect(E.genCost(s, 0, n + 1)).toBeGreaterThan(s.funds);
  });

  it('milestones double output', () => {
    expect(E.milestoneMult(24)).toBe(1);
    expect(E.milestoneMult(25)).toBe(2);
    expect(E.milestoneMult(50)).toBe(4);
  });

  it('moving lairs unlocks generators and multiplies income', () => {
    const s = newGame(0);
    s.funds = LAIRS[1].cost;
    const before = E.incomePerSec(s, 0);
    expect(E.isGenUnlocked(s, 2)).toBe(false);
    expect(E.moveLair(s)).toBe(true);
    expect(E.isGenUnlocked(s, 2)).toBe(true);
    expect(E.incomePerSec(s, 0)).toBeCloseTo(before * 2);
  });

  it('devices build over time', () => {
    const s = newGame(0);
    s.funds = 1e6;
    const d = DEVICES[0];
    expect(E.startDevice(s, d.id, 0)).toBe(true);
    expect(E.completeBuilds(s, 1000)).toEqual([]);
    expect(E.completeBuilds(s, d.buildTime * 1000 + 1)).toEqual([d.id]);
    expect(E.deviceState(s, d.id)).toBe('built');
  });

  it('prestige keeps permanent progress and grants infamy', () => {
    const s = newGame(0);
    s.gems = 42;
    E.earn(s, 1e12);
    expect(E.canPrestige(s)).toBe(true);
    const gained = E.prestige(s);
    expect(gained).toBeGreaterThan(0);
    expect(s.infamy).toBe(gained);
    expect(s.grudges).toBe(gained);
    expect(s.funds).toBe(0);
    expect(s.gems).toBe(42);
    expect(s.lair).toBe(0);
    expect(E.infamyMult(s)).toBeGreaterThan(1);
  });

  it('offline earnings are capped and partial', () => {
    const s = newGame(0);
    const rep = E.computeOffline(s, 100 * 3600 * 1000);
    expect(rep.cappedSeconds).toBe(E.offlineCapSeconds(s));
    expect(rep.earned).toBeCloseTo(E.stableIncome(s) * 0.5 * rep.cappedSeconds);
  });

  it('ad boost stacks up to a cap', () => {
    const s = newGame(0);
    for (let i = 0; i < 10; i++) E.applyAdBoost(s, 0);
    expect(E.boostRemaining(s, 0)).toBe(12 * 3600);
    expect(E.canAddAdBoost(s, 0)).toBe(false);
  });

  it('daily rewards advance a streak once per day', () => {
    const s = newGame(0);
    const day = 86400000;
    expect(E.claimDaily(s, 10 * day)?.idx).toBe(0);
    expect(E.claimDaily(s, 10 * day)).toBeNull();
    expect(E.claimDaily(s, 11 * day)?.idx).toBe(1);
    expect(E.claimDaily(s, 15 * day)?.idx).toBe(0);
  });

  it('chests grant loot', () => {
    const s = newGame(0);
    const gems = s.gems;
    const r = E.openChest(s, 'common', 0, () => 0.5)!;
    expect(r.funds).toBeGreaterThan(0);
    expect(s.gems).toBe(gems + r.gems);
    expect(s.chests.common).toBe(0);
  });

  it('migrate repairs partial saves', () => {
    const s = migrate({ funds: 50, gens: [3], settings: { sound: false } });
    expect(s.funds).toBe(50);
    expect(s.gens.length).toBe(10);
    expect(s.settings.sound).toBe(false);
    expect(s.settings.haptics).toBe(true);
  });
});

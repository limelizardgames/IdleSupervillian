import {
  AD_BOOST_SECONDS, AD_COOLDOWNS, AD_DEVICE_SKIP_SECONDS, BASE_OFFLINE_HOURS, BASE_OFFLINE_RATE, CHESTS,
  DAILY_REWARDS, DEVICE_BY_ID, DEVICES, FREE_CHEST_INTERVAL, GEM_ITEMS, GENERATORS, INFAMY_BONUS_BASE, LAIRS,
  MAX_BOOST_SECONDS, MILESTONES, PERK_BY_ID, PRESTIGE_MIN_EARNED, UPGRADE_BY_ID, UPGRADES,
  type ChestType, type UpgradeDef,
} from './data';
import { newGame, type GameState } from './state';

// ---------------------------------------------------------------------------
// Perks & multipliers
// ---------------------------------------------------------------------------

export const perkLevel = (s: GameState, id: string) => s.perks[id] ?? 0;

export function perkCost(s: GameState, id: string): number {
  const p = PERK_BY_ID[id];
  return Math.ceil(p.baseCost * Math.pow(p.costGrowth, perkLevel(s, id)));
}

export function infamyBonusPerPoint(s: GameState): number {
  return INFAMY_BONUS_BASE + 0.01 * perkLevel(s, 'grudge');
}

export function infamyMult(s: GameState): number {
  return 1 + s.infamy * infamyBonusPerPoint(s);
}

export function milestoneMult(count: number): number {
  let m = 1;
  for (const ms of MILESTONES) if (count >= ms) m *= 2;
  return m;
}

export function nextMilestone(count: number): number | null {
  return MILESTONES.find((m) => m > count) ?? null;
}

function upgradeMult(s: GameState, pred: (u: UpgradeDef) => boolean): number {
  let m = 1;
  for (const id in s.upgrades) {
    const u = UPGRADE_BY_ID[id];
    if (u && pred(u)) m *= u.effect.mult;
  }
  return m;
}

function deviceMult(s: GameState, kind: string): number {
  let m = 1;
  for (const id in s.devices) {
    const d = DEVICE_BY_ID[id];
    if (d && d.effect.kind === kind) m *= d.effect.mult;
  }
  return m;
}

export function lairMult(s: GameState): number {
  let m = 1;
  for (let i = 1; i <= s.lair; i++) m *= LAIRS[i].mult;
  return m;
}

export function isBoosted(s: GameState, now = Date.now()) {
  return s.boostUntil > now;
}
export function isFrenzy(s: GameState, now = Date.now()) {
  return s.frenzyUntil > now;
}

/** Permanent-ish multiplier (everything except temporary boosts). */
export function baseGlobalMult(s: GameState): number {
  return (
    upgradeMult(s, (u) => u.effect.kind === 'all') *
    deviceMult(s, 'all') *
    lairMult(s) *
    infamyMult(s) *
    (s.purchases.doubler ? 2 : 1)
  );
}

export function tempMult(s: GameState, now = Date.now()): number {
  return (isBoosted(s, now) ? 2 : 1) * (isFrenzy(s, now) ? s.frenzyMult : 1);
}

export function globalMult(s: GameState, now = Date.now()): number {
  return baseGlobalMult(s) * tempMult(s, now);
}

export function genUnitIncome(s: GameState, i: number): number {
  const g = GENERATORS[i];
  return (
    g.baseIncome *
    milestoneMult(s.gens[i]) *
    upgradeMult(s, (u) => u.effect.kind === 'gen' && u.effect.target === i)
  );
}

/** Income of generator i per second, including global multipliers. */
export function genIncome(s: GameState, i: number, now = Date.now()): number {
  return s.gens[i] * genUnitIncome(s, i) * globalMult(s, now);
}

export function incomePerSec(s: GameState, now = Date.now()): number {
  let sum = 0;
  for (let i = 0; i < GENERATORS.length; i++) {
    if (s.gens[i] > 0) sum += s.gens[i] * genUnitIncome(s, i);
  }
  return sum * globalMult(s, now);
}

/** Income without temporary boosts; used for chests, offline, rewards. */
export function stableIncome(s: GameState): number {
  let sum = 0;
  for (let i = 0; i < GENERATORS.length; i++) sum += s.gens[i] * genUnitIncome(s, i);
  return sum * baseGlobalMult(s);
}

export function tapMult(s: GameState): number {
  return upgradeMult(s, (u) => u.effect.kind === 'tap') * deviceMult(s, 'tap') * (1 + perkLevel(s, 'meatloaf'));
}

export function tapValue(s: GameState, now = Date.now()): number {
  const inc = incomePerSec(s, now);
  return Math.max(1, 1 + inc * 0.06) * tapMult(s);
}

// ---------------------------------------------------------------------------
// Costs & purchases
// ---------------------------------------------------------------------------

export function costMult(s: GameState): number {
  return Math.pow(0.97, perkLevel(s, 'union'));
}

export function genCost(s: GameState, i: number, n: number): number {
  const g = GENERATORS[i];
  const owned = s.gens[i];
  const r = g.growth;
  return g.baseCost * Math.pow(r, owned) * ((Math.pow(r, n) - 1) / (r - 1)) * costMult(s);
}

export function maxAffordable(s: GameState, i: number): number {
  const g = GENERATORS[i];
  const r = g.growth;
  const first = g.baseCost * Math.pow(r, s.gens[i]) * costMult(s);
  if (s.funds < first) return 0;
  return Math.max(0, Math.floor(Math.log((s.funds * (r - 1)) / first + 1) / Math.log(r)));
}

export function isGenUnlocked(s: GameState, i: number) {
  return GENERATORS[i].lair <= s.lair;
}

/** How many units a buy with the given mode would purchase (0 = can't afford). */
export function buyAmount(s: GameState, i: number, mode: number | 'max'): number {
  if (mode === 'max') return Math.max(1, maxAffordable(s, i));
  return mode;
}

export function buyGen(s: GameState, i: number, n: number): boolean {
  if (!isGenUnlocked(s, i) || n <= 0) return false;
  const c = genCost(s, i, n);
  if (c > s.funds) return false;
  s.funds -= c;
  s.gens[i] += n;
  return true;
}

export function upgradeVisible(s: GameState, u: UpgradeDef): boolean {
  if (s.upgrades[u.id]) return false;
  if (u.reqLair !== undefined && s.lair < u.reqLair) return false;
  if (u.reqGen !== undefined) {
    if (!isGenUnlocked(s, u.reqGen)) return false;
    if (s.gens[u.reqGen] < (u.reqCount ?? 0) * 0.6) return false;
  }
  return true;
}

export function upgradeAvailable(s: GameState, u: UpgradeDef): boolean {
  if (!upgradeVisible(s, u)) return false;
  if (u.reqGen !== undefined && s.gens[u.reqGen] < (u.reqCount ?? 0)) return false;
  return true;
}

export function visibleUpgrades(s: GameState): UpgradeDef[] {
  return UPGRADES.filter((u) => upgradeVisible(s, u)).sort((a, b) => a.cost - b.cost);
}

export function buyUpgrade(s: GameState, id: string): boolean {
  const u = UPGRADE_BY_ID[id];
  if (!u || !upgradeAvailable(s, u) || s.funds < u.cost) return false;
  s.funds -= u.cost;
  s.upgrades[id] = true;
  return true;
}

export function lairCost(s: GameState, i: number): number {
  return LAIRS[i].cost * Math.pow(0.88, perkLevel(s, 'realtor'));
}

export function moveLair(s: GameState): boolean {
  const next = s.lair + 1;
  if (next >= LAIRS.length) return false;
  const c = lairCost(s, next);
  if (s.funds < c) return false;
  s.funds -= c;
  s.lair = next;
  return true;
}

// ---------------------------------------------------------------------------
// Doomsday devices
// ---------------------------------------------------------------------------

export function deviceBuildTime(s: GameState, id: string): number {
  return DEVICE_BY_ID[id].buildTime * Math.pow(0.9, perkLevel(s, 'engineers'));
}

export function deviceState(s: GameState, id: string): 'locked' | 'available' | 'building' | 'built' {
  if (s.devices[id]) return 'built';
  if (s.builds.some((b) => b.id === id)) return 'building';
  if (DEVICE_BY_ID[id].lair > s.lair) return 'locked';
  return 'available';
}

export function freeBuildSlot(s: GameState) {
  return s.builds.length < s.buildSlots;
}

export function startDevice(s: GameState, id: string, now = Date.now()): boolean {
  const d = DEVICE_BY_ID[id];
  if (!d || deviceState(s, id) !== 'available' || !freeBuildSlot(s) || s.funds < d.cost) return false;
  s.funds -= d.cost;
  s.builds.push({ id, endsAt: now + deviceBuildTime(s, id) * 1000 });
  return true;
}

/** Completes finished builds. Returns ids of devices completed this call. */
export function completeBuilds(s: GameState, now = Date.now()): string[] {
  const done: string[] = [];
  s.builds = s.builds.filter((b) => {
    if (b.endsAt <= now) {
      s.devices[b.id] = true;
      s.stats.devicesBuilt++;
      done.push(b.id);
      return false;
    }
    return true;
  });
  return done;
}

export function skipBuild(s: GameState, id: string, seconds: number) {
  const b = s.builds.find((x) => x.id === id);
  if (b) b.endsAt -= seconds * 1000;
}

export function gemsToFinish(s: GameState, id: string, now = Date.now()): number {
  const b = s.builds.find((x) => x.id === id);
  if (!b) return 0;
  const mins = Math.max(0, (b.endsAt - now) / 60000);
  return Math.max(1, Math.ceil(mins / 4));
}

export function finishWithGems(s: GameState, id: string, now = Date.now()): boolean {
  const cost = gemsToFinish(s, id, now);
  if (s.gems < cost) return false;
  s.gems -= cost;
  skipBuild(s, id, 1e9);
  completeBuilds(s, now);
  return true;
}

export const AD_DEVICE_SKIP = AD_DEVICE_SKIP_SECONDS;

// ---------------------------------------------------------------------------
// Ticking, tapping, offline progress
// ---------------------------------------------------------------------------

export function earn(s: GameState, amount: number) {
  if (!(amount > 0) || !isFinite(amount)) return;
  s.funds += amount;
  s.runEarned += amount;
  s.lifetimeEarned += amount;
}

export function tick(s: GameState, dtSec: number, now = Date.now()) {
  if (dtSec <= 0) return;
  earn(s, incomePerSec(s, now) * dtSec);
  s.stats.playSeconds += dtSec;
  s.lastTick = now;
}

export function tap(s: GameState, now = Date.now()): number {
  const v = tapValue(s, now);
  earn(s, v);
  s.stats.taps++;
  s.stats.tapEarned += v;
  return v;
}

export function offlineCapSeconds(s: GameState) {
  return (BASE_OFFLINE_HOURS + 2 * perkLevel(s, 'monologue')) * 3600;
}

export function offlineRate(s: GameState) {
  return (BASE_OFFLINE_RATE + 0.1 * perkLevel(s, 'accountant')) * deviceMult(s, 'offline');
}

export interface OfflineReport {
  seconds: number;
  cappedSeconds: number;
  earned: number;
}

/** Computes (but does not grant) offline earnings since lastTick. */
export function computeOffline(s: GameState, now = Date.now()): OfflineReport {
  const seconds = Math.max(0, (now - s.lastTick) / 1000);
  const cappedSeconds = Math.min(seconds, offlineCapSeconds(s));
  // Boost time that was active while away still counts (up to when it expired).
  const boostSecs = Math.max(0, Math.min(cappedSeconds, (s.boostUntil - s.lastTick) / 1000));
  const base = stableIncome(s) * offlineRate(s);
  const earned = base * (cappedSeconds + boostSecs);
  return { seconds, cappedSeconds, earned };
}

// ---------------------------------------------------------------------------
// Boosts, chests, gems, daily rewards
// ---------------------------------------------------------------------------

export function addBoost(s: GameState, seconds: number, now = Date.now(), cap = MAX_BOOST_SECONDS) {
  const start = Math.max(now, s.boostUntil);
  s.boostUntil = Math.min(start + seconds * 1000, now + Math.max(cap, seconds) * 1000);
}

export function boostRemaining(s: GameState, now = Date.now()) {
  return Math.max(0, (s.boostUntil - now) / 1000);
}

export function canAddAdBoost(s: GameState, now = Date.now()) {
  return boostRemaining(s, now) + AD_BOOST_SECONDS <= MAX_BOOST_SECONDS + 1;
}

export function startFrenzy(s: GameState, mult: number, seconds: number, now = Date.now()) {
  s.frenzyMult = mult;
  s.frenzyUntil = now + seconds * 1000;
}

export interface ChestReward {
  funds: number;
  gems: number;
  boostSeconds: number;
}

/** Funds a chest (or similar reward) is worth: `seconds` of stable income, floored. */
export function incomeReward(s: GameState, seconds: number, min = 50): number {
  return Math.max(min * Math.pow(10, s.lair), stableIncome(s) * seconds);
}

export function rollChest(s: GameState, type: ChestType, rng = Math.random): ChestReward {
  const c = CHESTS[type];
  const loot = 1 + 0.25 * perkLevel(s, 'sticky');
  const funds = incomeReward(s, c.incomeSeconds, c.minFunds) * loot * (0.8 + rng() * 0.4);
  const gems = Math.round((c.gems[0] + rng() * (c.gems[1] - c.gems[0])) * loot);
  const boostSeconds = rng() < c.boostChance ? (type === 'epic' ? 3600 : 1800) : 0;
  return { funds, gems, boostSeconds };
}

export function openChest(s: GameState, type: ChestType, now = Date.now(), rng = Math.random): ChestReward | null {
  if (s.chests[type] <= 0) return null;
  s.chests[type]--;
  const r = rollChest(s, type, rng);
  earn(s, r.funds);
  s.gems += r.gems;
  if (r.boostSeconds) addBoost(s, r.boostSeconds, now, 24 * 3600);
  s.stats.chestsOpened++;
  return r;
}

export function freeChestReady(s: GameState, now = Date.now()) {
  return now >= s.freeChestAt;
}

export function claimFreeChest(s: GameState, now = Date.now()): boolean {
  if (!freeChestReady(s, now)) return false;
  s.chests.common++;
  s.freeChestAt = now + FREE_CHEST_INTERVAL * 1000;
  return true;
}

export function adReady(s: GameState, placement: string, now = Date.now()) {
  return (s.adCooldowns[placement] ?? 0) <= now;
}

export function adCooldownLeft(s: GameState, placement: string, now = Date.now()) {
  return Math.max(0, ((s.adCooldowns[placement] ?? 0) - now) / 1000);
}

export function markAdUsed(s: GameState, placement: string, now = Date.now()) {
  s.adCooldowns[placement] = now + (AD_COOLDOWNS[placement] ?? 0) * 1000;
  s.stats.adsWatched++;
}

export function buyGemItem(s: GameState, id: string, now = Date.now()): boolean {
  const item = GEM_ITEMS.find((g) => g.id === id);
  if (!item || s.gems < item.cost) return false;
  if (id === 'build_slot' && s.buildSlots >= 2) return false;
  s.gems -= item.cost;
  switch (id) {
    case 'warp_1': earn(s, stableIncome(s) * 3600); break;
    case 'warp_8': earn(s, stableIncome(s) * 8 * 3600); break;
    case 'warp_24': earn(s, stableIncome(s) * 24 * 3600); break;
    case 'boost_8': addBoost(s, 8 * 3600, now, 48 * 3600); break;
    case 'chest_rare': s.chests.rare++; break;
    case 'chest_epic': s.chests.epic++; break;
    case 'build_slot': s.buildSlots = 2; break;
  }
  return true;
}

export function dayKey(now = Date.now()): string {
  const d = new Date(now);
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

export function dailyAvailable(s: GameState, now = Date.now()) {
  return s.daily.lastClaimDay !== dayKey(now);
}

/** Index (0..6) of the reward that would be claimed now. */
export function dailyIndex(s: GameState, now = Date.now()): number {
  const yesterday = dayKey(now - 86400000);
  const continuing = s.daily.lastClaimDay === yesterday || s.daily.lastClaimDay === dayKey(now);
  const streak = continuing ? s.daily.streak : 0;
  return streak % DAILY_REWARDS.length;
}

export function claimDaily(s: GameState, now = Date.now()) {
  if (!dailyAvailable(s, now)) return null;
  const idx = dailyIndex(s, now);
  const r = DAILY_REWARDS[idx];
  const yesterday = dayKey(now - 86400000);
  s.daily.streak = s.daily.lastClaimDay === yesterday ? s.daily.streak + 1 : 1;
  s.daily.lastClaimDay = dayKey(now);
  if (r.gems) s.gems += r.gems;
  if (r.chest) s.chests[r.chest]++;
  if (r.incomeSeconds) earn(s, incomeReward(s, r.incomeSeconds));
  if (r.boostSeconds) addBoost(s, r.boostSeconds, now, 48 * 3600);
  return { idx, reward: r };
}

export function applyAdBoost(s: GameState, now = Date.now()) {
  addBoost(s, AD_BOOST_SECONDS, now);
}

// ---------------------------------------------------------------------------
// Prestige: "Get Defeated by the Hero"
// ---------------------------------------------------------------------------

export function totalInfamyFor(lifetime: number): number {
  return Math.floor(10 * Math.cbrt(lifetime / PRESTIGE_MIN_EARNED));
}

export function pendingInfamy(s: GameState): number {
  return Math.max(0, totalInfamyFor(s.lifetimeEarned) - s.infamy);
}

export function canPrestige(s: GameState) {
  return s.runEarned >= PRESTIGE_MIN_EARNED && pendingInfamy(s) > 0;
}

/**
 * Resets the run, keeping permanent progress. `bonusPct` lets a rewarded ad
 * grant extra infamy. Returns infamy gained.
 */
export function prestige(s: GameState, bonusPct = 0): number {
  if (!canPrestige(s)) return 0;
  const gained = Math.floor(pendingInfamy(s) * (1 + bonusPct));
  const fresh = newGame();
  const keep: Partial<GameState> = {
    villainName: s.villainName,
    createdAt: s.createdAt,
    gems: s.gems,
    lifetimeEarned: s.lifetimeEarned,
    infamy: s.infamy + gained,
    grudges: s.grudges + gained,
    perks: s.perks,
    prestiges: s.prestiges + 1,
    buildSlots: s.buildSlots,
    boostUntil: s.boostUntil,
    chests: s.chests,
    freeChestAt: s.freeChestAt,
    adCooldowns: s.adCooldowns,
    daily: s.daily,
    purchases: s.purchases,
    settings: s.settings,
    achievements: s.achievements,
    story: s.story,
    stats: s.stats,
  };
  Object.assign(s, fresh, keep);
  s.gens[0] = 1 + 10 * perkLevel(s, 'nest_egg');
  return gained;
}

export function buyPerk(s: GameState, id: string): boolean {
  const p = PERK_BY_ID[id];
  if (!p || perkLevel(s, id) >= p.maxLevel) return false;
  const c = perkCost(s, id);
  if (s.grudges < c) return false;
  s.grudges -= c;
  s.perks[id] = perkLevel(s, id) + 1;
  return true;
}

export function allDevicesBuilt(s: GameState) {
  return DEVICES.every((d) => s.devices[d.id]);
}

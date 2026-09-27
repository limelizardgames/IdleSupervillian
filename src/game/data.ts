// ---------------------------------------------------------------------------
// Static game content: generators, lairs, upgrades, devices, perks, etc.
// Balance numbers live here so they can be tuned without touching logic.
// ---------------------------------------------------------------------------

export interface GeneratorDef {
  id: string;
  name: string;
  desc: string;
  lair: number; // lair index required to unlock
  baseCost: number;
  baseIncome: number; // funds / second / unit
  growth: number; // cost multiplier per unit
}

export const GENERATORS: GeneratorDef[] = [
  { id: 'henchman', name: 'Henchmen', desc: 'Minimum-wage goons in ill-fitting masks.', lair: 0, baseCost: 10, baseIncome: 1, growth: 1.12 },
  { id: 'pigeons', name: 'Pickpocket Pigeons', desc: 'Trained to steal wallets. Paid in breadcrumbs.', lair: 0, baseCost: 150, baseIncome: 6, growth: 1.13 },
  { id: 'clones', name: 'Minion Clone Vats', desc: 'Grow-your-own minions. Just add goo.', lair: 1, baseCost: 3_000, baseIncome: 40, growth: 1.14 },
  { id: 'callcenter', name: 'Evil Call Center', desc: "We've been trying to reach you about your car's extended warranty.", lair: 1, baseCost: 60_000, baseIncome: 270, growth: 1.14 },
  { id: 'lab', name: 'Mad Science Labs', desc: 'Bubbling beakers. Questionable ethics. Great ROI.', lair: 2, baseCost: 1.2e06, baseIncome: 1_800, growth: 1.15 },
  { id: 'robots', name: 'Robot Factory', desc: 'Laser-eyed robots, now with 40% fewer uprisings.', lair: 2, baseCost: 2.5e07, baseIncome: 12_000, growth: 1.15 },
  { id: 'sharks', name: 'Shark-Laser Aquarium', desc: 'Sharks. With frickin\' laser beams.', lair: 3, baseCost: 5e08, baseIncome: 80_000, growth: 1.15 },
  { id: 'weather', name: 'Weather Control Tower', desc: 'Rain on every parade. Charge for umbrellas.', lair: 3, baseCost: 1e10, baseIncome: 550_000, growth: 1.15 },
  { id: 'satellite', name: 'Mind-Control Satellites', desc: 'Beams subliminal ads straight into brains.', lair: 4, baseCost: 2.5e11, baseIncome: 3.8e06, growth: 1.15 },
  { id: 'moonlaser', name: 'Lunar Doom Lasers', desc: 'Pay up, Earth. Or the moon gets angry.', lair: 4, baseCost: 6e12, baseIncome: 2.6e07, growth: 1.15 },
];

/** Owning this many of a generator doubles its output (cumulative). */
export const MILESTONES = [25, 50, 100, 200, 300, 400, 500, 750, 1000];

export interface LairDef {
  id: string;
  name: string;
  desc: string;
  cost: number;
  mult: number; // global income multiplier granted on arrival (cumulative)
  story: string;
}

export const LAIRS: LairDef[] = [
  { id: 'basement', name: "Mom's Basement", desc: 'Wood paneling, a lava lamp, and big dreams.', cost: 0, mult: 1, story: 'intro' },
  { id: 'warehouse', name: 'Abandoned Warehouse', desc: 'Smells like fish and broken dreams. Perfect.', cost: 60_000, mult: 2, story: 'lair_1' },
  { id: 'volcano', name: 'Volcano Lair', desc: 'Proper supervillain real estate. Lava included.', cost: 2e8, mult: 2, story: 'lair_2' },
  { id: 'undersea', name: 'Undersea Fortress', desc: 'No hero can find us here. Probably.', cost: 5e11, mult: 2, story: 'lair_3' },
  { id: 'moon', name: 'Moon Base', desc: 'Hold the whole world hostage. With a view.', cost: 2e15, mult: 3, story: 'lair_4' },
];

export type UpgradeEffect =
  | { kind: 'gen'; target: number; mult: number }
  | { kind: 'all'; mult: number }
  | { kind: 'tap'; mult: number };

export interface UpgradeDef {
  id: string;
  name: string;
  desc: string;
  cost: number;
  effect: UpgradeEffect;
  reqGen?: number; // generator index
  reqCount?: number;
  reqLair?: number;
}

const GEN_UPGRADE_NAMES: string[][] = [
  ['Matching Jumpsuits', 'Henchman Dental Plan', 'Evil Laugh Coaching'],
  ['Tiny Pigeon Ski Masks', 'Breadcrumb Bonuses', 'Pigeon Jetpacks'],
  ['Extra-Goopy Goo', 'Clone Name Tags', 'Clones of Clones'],
  ['Car Warranty Script', 'Hold Music: Villain Remix', 'Robocall Robots'],
  ['Bigger Beakers', 'Decorative Tesla Coils', 'Unethical Review Board'],
  ['Laser Eyes Standard', 'Clearly-Labeled Self-Destruct', 'Robots Building Robots'],
  ['Frickin\' Laser Beams', 'Shark Dental Insurance', 'Sharknado Module'],
  ['Cloud Seeding', 'Reverse Lightning Rods', 'Perpetual Drizzle'],
  ['Tinfoil-Proofing', '6G Hypno-Beams', 'Subliminal Jingles'],
  ['Moon Cheese Coolant', 'Bigger Lens', 'Aim Assist'],
];
const GEN_UPGRADE_REQS = [25, 75, 150];
const GEN_UPGRADE_COST_FACTOR = [20, 40, 80];
const GEN_UPGRADE_MULTS = [2, 2, 3];

function unitCost(g: GeneratorDef, owned: number): number {
  return g.baseCost * Math.pow(g.growth, owned);
}

const genUpgrades: UpgradeDef[] = GENERATORS.flatMap((g, gi) =>
  GEN_UPGRADE_NAMES[gi].map((name, ti) => ({
    id: `${g.id}_u${ti}`,
    name,
    desc: `${g.name} earn x${GEN_UPGRADE_MULTS[ti]}.`,
    cost: Math.round(unitCost(g, GEN_UPGRADE_REQS[ti]) * GEN_UPGRADE_COST_FACTOR[ti]),
    effect: { kind: 'gen', target: gi, mult: GEN_UPGRADE_MULTS[ti] } as UpgradeEffect,
    reqGen: gi,
    reqCount: GEN_UPGRADE_REQS[ti],
  })),
);

const tapUpgrades: UpgradeDef[] = [
  { id: 'tap_0', name: 'Maniacal Cackle', desc: 'Evil Laugh taps earn x2.', cost: 500, effect: { kind: 'tap', mult: 2 } },
  { id: 'tap_1', name: 'Dramatic Cape Swish', desc: 'Evil Laugh taps earn x3.', cost: 300_000, effect: { kind: 'tap', mult: 3 }, reqLair: 1 },
  { id: 'tap_2', name: 'Finger Steepling', desc: 'Evil Laugh taps earn x3.', cost: 3e9, effect: { kind: 'tap', mult: 3 }, reqLair: 2 },
  { id: 'tap_3', name: 'Thunder On Cue', desc: 'Evil Laugh taps earn x5.', cost: 3e13, effect: { kind: 'tap', mult: 5 }, reqLair: 3 },
  { id: 'tap_4', name: 'Monologue Mastery', desc: 'Evil Laugh taps earn x5.', cost: 3e17, effect: { kind: 'tap', mult: 5 }, reqLair: 4 },
];

const globalUpgrades: UpgradeDef[] = [
  { id: 'all_0', name: 'Evil Business Cards', desc: 'All income x1.5. "Dr. Evil, PhD (pending)".', cost: 750_000, effect: { kind: 'all', mult: 1.5 }, reqLair: 1 },
  { id: 'all_1', name: 'Villain Newsletter', desc: 'All income x2. Unsubscribing is not an option.', cost: 5e9, effect: { kind: 'all', mult: 2 }, reqLair: 2 },
  { id: 'all_2', name: 'Evil Stock Portfolio', desc: 'All income x2. Heavy in cape futures.', cost: 2e13, effect: { kind: 'all', mult: 2 }, reqLair: 3 },
  { id: 'all_3', name: 'Cayman Shell Company', desc: 'All income x3. Totally legit.', cost: 1e17, effect: { kind: 'all', mult: 3 }, reqLair: 4 },
  { id: 'all_4', name: 'Offshore Moon Bank', desc: 'All income x3. Technically off-planet.', cost: 1e20, effect: { kind: 'all', mult: 3 }, reqLair: 4 },
];

export const UPGRADES: UpgradeDef[] = [...tapUpgrades, ...genUpgrades, ...globalUpgrades];
export const UPGRADE_BY_ID: Record<string, UpgradeDef> = Object.fromEntries(UPGRADES.map((u) => [u.id, u]));

export type DeviceEffect =
  | { kind: 'all'; mult: number }
  | { kind: 'tap'; mult: number }
  | { kind: 'offline'; mult: number }
  | { kind: 'hero'; mult: number };

export interface DeviceDef {
  id: string;
  name: string;
  desc: string;
  icon: string;
  cost: number;
  buildTime: number; // seconds
  lair: number;
  effect: DeviceEffect;
}

export const DEVICES: DeviceDef[] = [
  { id: 'freeze_ray', name: 'Freeze Ray', desc: 'Only works on ice cream. For now.', icon: '🧊', cost: 10_000, buildTime: 60, lair: 0, effect: { kind: 'all', mult: 1.5 } },
  { id: 'shrink_ray', name: 'Shrink Ray', desc: 'Shrinks bank vaults. Also your pants.', icon: '🔬', cost: 500_000, buildTime: 300, lair: 1, effect: { kind: 'tap', mult: 4 } },
  { id: 'mustache_ray', name: 'Evil Mustache Ray', desc: 'Everyone gets a villain mustache. Morale soars.', icon: '🥸', cost: 2e7, buildTime: 900, lair: 1, effect: { kind: 'all', mult: 2 } },
  { id: 'mind_hats', name: 'Mind-Control Hats', desc: 'Tinfoil, with extra tin.', icon: '🎩', cost: 1e9, buildTime: 1800, lair: 2, effect: { kind: 'all', mult: 2 } },
  { id: 'quake', name: 'Couch Earthquake Machine', desc: 'Shakes loose change out of every sofa on Earth. Boosts offline earnings.', icon: '🛋️', cost: 5e10, buildTime: 2700, lair: 2, effect: { kind: 'offline', mult: 2 } },
  { id: 'hero_trap', name: 'Hero-Sized Butterfly Net', desc: 'Foiled heroes drop x3 loot.', icon: '🦋', cost: 1e12, buildTime: 3600, lair: 3, effect: { kind: 'hero', mult: 3 } },
  { id: 'parade_rain', name: 'Rain-On-Parades Machine', desc: 'Weaponized disappointment.', icon: '🌧️', cost: 2e13, buildTime: 5400, lair: 3, effect: { kind: 'all', mult: 2.5 } },
  { id: 'mecha_mom', name: 'Mecha-Mom', desc: '60-ft robot that says "I\'m not angry, just disappointed."', icon: '🤖', cost: 5e14, buildTime: 7200, lair: 3, effect: { kind: 'all', mult: 3 } },
  { id: 'black_hole', name: 'Black Hole in a Jar', desc: 'Do not shake. Do NOT shake.', icon: '🫙', cost: 2e16, buildTime: 10800, lair: 4, effect: { kind: 'all', mult: 3 } },
  { id: 'mondays', name: 'Mondays Forever Device', desc: 'The ultimate doomsday device. Every day is Monday. Forever.', icon: '📅', cost: 1e18, buildTime: 14400, lair: 4, effect: { kind: 'all', mult: 5 } },
];
export const DEVICE_BY_ID: Record<string, DeviceDef> = Object.fromEntries(DEVICES.map((d) => [d.id, d]));

export interface PerkDef {
  id: string;
  name: string;
  desc: string; // use {v} for the per-level value
  icon: string;
  baseCost: number;
  costGrowth: number;
  maxLevel: number;
}

export const PERKS: PerkDef[] = [
  { id: 'grudge', name: 'Deep-Seated Grudge', desc: 'Each Infamy point gives +1% more income.', icon: '😤', baseCost: 10, costGrowth: 2.2, maxLevel: 8 },
  { id: 'meatloaf', name: "Mom's Meatloaf", desc: 'Evil Laugh taps earn +100%.', icon: '🍖', baseCost: 2, costGrowth: 1.6, maxLevel: 20 },
  { id: 'nest_egg', name: 'Nest Egg', desc: 'Start every empire with 10 more Henchmen.', icon: '🪺', baseCost: 3, costGrowth: 1.8, maxLevel: 10 },
  { id: 'union', name: 'Union Busting', desc: 'Operations cost 3% less.', icon: '📉', baseCost: 8, costGrowth: 1.9, maxLevel: 10 },
  { id: 'realtor', name: 'Shady Realtor', desc: 'Lairs cost 12% less.', icon: '🏚️', baseCost: 5, costGrowth: 2, maxLevel: 5 },
  { id: 'monologue', name: 'Villain Monologue', desc: 'Offline earnings last 2 more hours.', icon: '🎭', baseCost: 4, costGrowth: 1.8, maxLevel: 6 },
  { id: 'accountant', name: 'Evil Accountant', desc: 'Offline earnings rate +10%.', icon: '🧮', baseCost: 6, costGrowth: 1.9, maxLevel: 5 },
  { id: 'engineers', name: 'Overcaffeinated Engineers', desc: 'Doomsday devices build 10% faster.', icon: '☕', baseCost: 5, costGrowth: 1.9, maxLevel: 6 },
  { id: 'sticky', name: 'Sticky Fingers', desc: 'Chests contain 25% more loot.', icon: '🧤', baseCost: 4, costGrowth: 1.7, maxLevel: 10 },
];
export const PERK_BY_ID: Record<string, PerkDef> = Object.fromEntries(PERKS.map((p) => [p.id, p]));

export type ChestType = 'common' | 'rare' | 'epic';
export interface ChestDef {
  type: ChestType;
  name: string;
  incomeSeconds: number;
  gems: [number, number];
  boostChance: number;
  minFunds: number;
}
export const CHESTS: Record<ChestType, ChestDef> = {
  common: { type: 'common', name: 'Evil Lunchbox', incomeSeconds: 600, gems: [1, 4], boostChance: 0.15, minFunds: 100 },
  rare: { type: 'rare', name: 'Secret Briefcase', incomeSeconds: 2400, gems: [5, 12], boostChance: 0.4, minFunds: 1_000 },
  epic: { type: 'epic', name: 'Doomsday Vault', incomeSeconds: 10800, gems: [20, 45], boostChance: 1, minFunds: 10_000 },
};

export interface DailyReward {
  label: string;
  gems?: number;
  chest?: ChestType;
  incomeSeconds?: number;
  boostSeconds?: number;
}
export const DAILY_REWARDS: DailyReward[] = [
  { label: '5 Gems', gems: 5 },
  { label: '30 min of Income', incomeSeconds: 1800 },
  { label: 'Secret Briefcase', chest: 'rare' },
  { label: '15 Gems', gems: 15 },
  { label: 'x2 Boost (4h)', boostSeconds: 4 * 3600 },
  { label: '25 Gems', gems: 25 },
  { label: 'Doomsday Vault', chest: 'epic' },
];

/** Things purchasable with premium gems. */
export interface GemItem {
  id: string;
  name: string;
  desc: string;
  icon: string;
  cost: number;
}
export const GEM_ITEMS: GemItem[] = [
  { id: 'warp_1', name: 'Time Warp: 1 Hour', desc: 'Instantly collect 1 hour of income.', icon: '⏩', cost: 25 },
  { id: 'warp_8', name: 'Time Warp: 8 Hours', desc: 'Instantly collect 8 hours of income.', icon: '⏭️', cost: 150 },
  { id: 'warp_24', name: 'Time Warp: 24 Hours', desc: 'Instantly collect a full day of income.', icon: '🌀', cost: 350 },
  { id: 'boost_8', name: 'x2 Boost: 8 Hours', desc: 'Double all income for 8 hours.', icon: '⚡', cost: 60 },
  { id: 'chest_rare', name: 'Secret Briefcase', desc: 'A rare chest of ill-gotten goods.', icon: '💼', cost: 30 },
  { id: 'chest_epic', name: 'Doomsday Vault', desc: 'An epic chest. Big loot, guaranteed boost.', icon: '🏦', cost: 90 },
  { id: 'build_slot', name: 'Extra Build Bay', desc: 'Build 2 doomsday devices at once. Permanent!', icon: '🏗️', cost: 250 },
];

/** Real-money products. IDs must match App Store / Play Console product IDs. */
export interface IapProduct {
  id: string;
  name: string;
  desc: string;
  icon: string;
  fallbackPrice: string;
  consumable: boolean;
  badge?: string;
}
export const IAP_PRODUCTS: IapProduct[] = [
  { id: 'starter_pack', name: 'Villain Starter Kit', desc: '200 Gems + 2 Doomsday Vaults + 24h x2 Boost. One time only!', icon: '🎁', fallbackPrice: '$1.99', consumable: false, badge: 'BEST VALUE' },
  { id: 'remove_ads', name: 'Remove Ads', desc: 'No more banners or pop-up ads. Rewarded bonuses become instant. +50 Gems.', icon: '🚫', fallbackPrice: '$3.99', consumable: false, badge: 'POPULAR' },
  { id: 'doubler', name: 'Evil Empire x2', desc: 'Permanently double ALL income, across every empire, forever.', icon: '👑', fallbackPrice: '$6.99', consumable: false },
  { id: 'gems_100', name: 'Pouch of Gems', desc: '100 Doom Gems.', icon: '💎', fallbackPrice: '$0.99', consumable: true },
  { id: 'gems_550', name: 'Sack of Gems', desc: '550 Doom Gems (+10% bonus).', icon: '💰', fallbackPrice: '$4.99', consumable: true },
  { id: 'gems_1200', name: 'Vault of Gems', desc: '1,200 Doom Gems (+20% bonus).', icon: '🏦', fallbackPrice: '$9.99', consumable: true },
  { id: 'gems_3000', name: 'Moon of Gems', desc: '3,000 Doom Gems (+50% bonus).', icon: '🌕', fallbackPrice: '$19.99', consumable: true, badge: 'MEGA' },
];

export const IAP_GEMS: Record<string, number> = { gems_100: 100, gems_550: 550, gems_1200: 1200, gems_3000: 3000 };

/** Rewarded-ad placements and their cooldowns (seconds). */
export const AD_COOLDOWNS: Record<string, number> = {
  boost: 0,
  chest: 20 * 60,
  gems: 15 * 60,
  device: 0,
};
export const AD_BOOST_SECONDS = 2 * 3600;
export const MAX_BOOST_SECONDS = 12 * 3600;
export const AD_GEMS_REWARD = 5;
export const AD_DEVICE_SKIP_SECONDS = 30 * 60;
export const FREE_CHEST_INTERVAL = 4 * 3600;

export const PRESTIGE_MIN_EARNED = 1e11;
export const INFAMY_BONUS_BASE = 0.02;
export const BASE_OFFLINE_HOURS = 3;
export const BASE_OFFLINE_RATE = 0.5;

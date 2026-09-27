import type { GameState } from './state';

export interface AchievementDef {
  id: string;
  name: string;
  desc: string;
  icon: string;
  gems: number;
  check: (s: GameState) => boolean;
}

const earned = (id: string, name: string, amount: number, label: string, gems: number): AchievementDef => ({
  id, name, desc: `Earn ${label} in total.`, icon: '💵', gems, check: (s) => s.lifetimeEarned >= amount,
});
const own = (id: string, name: string, gen: number, n: number, gems: number, label: string): AchievementDef => ({
  id, name, desc: `Own ${n} ${label}.`, icon: '🦹', gems, check: (s) => s.gens[gen] >= n,
});

export const ACHIEVEMENTS: AchievementDef[] = [
  earned('earn_1k', 'Allowance Heist', 1e3, '$1K', 2),
  earned('earn_1m', 'Millionaire Menace', 1e6, '$1M', 5),
  earned('earn_1b', 'Billion-Dollar Baddie', 1e9, '$1B', 10),
  earned('earn_1t', 'Trillion Tyrant', 1e12, '$1T', 20),
  earned('earn_1qa', 'Quadrillion Quasher', 1e15, '$1Qa', 30),
  earned('earn_1sx', 'Economy Eater', 1e21, '$1Sx', 50),
  own('hench_25', 'Goon Squad', 0, 25, 3, 'Henchmen'),
  own('hench_100', 'Goon Army', 0, 100, 10, 'Henchmen'),
  own('hench_300', 'Goon Nation', 0, 300, 25, 'Henchmen'),
  own('pigeon_50', 'Flock of Thieves', 1, 50, 5, 'Pickpocket Pigeons'),
  own('lab_50', 'Beaker Baron', 4, 50, 10, 'Mad Science Labs'),
  own('laser_25', 'Lunatic Lunar', 9, 25, 25, 'Lunar Doom Lasers'),
  { id: 'lair_1', name: 'Moving Out', desc: 'Leave Mom\'s Basement.', icon: '📦', gems: 5, check: (s) => s.lair >= 1 },
  { id: 'lair_2', name: 'Hot Property', desc: 'Move into the Volcano Lair.', icon: '🌋', gems: 10, check: (s) => s.lair >= 2 },
  { id: 'lair_3', name: 'Deep Trouble', desc: 'Move into the Undersea Fortress.', icon: '🌊', gems: 15, check: (s) => s.lair >= 3 },
  { id: 'lair_4', name: 'Over the Moon', desc: 'Build your Moon Base.', icon: '🌙', gems: 30, check: (s) => s.lair >= 4 },
  { id: 'device_1', name: 'Mad Inventor', desc: 'Build your first Doomsday Device.', icon: '🔧', gems: 5, check: (s) => s.stats.devicesBuilt >= 1 },
  { id: 'device_10', name: 'Arsenal of Absurdity', desc: 'Build 10 Doomsday Devices.', icon: '💣', gems: 25, check: (s) => s.stats.devicesBuilt >= 10 },
  { id: 'tap_500', name: 'Warm-Up Cackle', desc: 'Evil Laugh 500 times.', icon: '😈', gems: 3, check: (s) => s.stats.taps >= 500 },
  { id: 'tap_5000', name: 'Mwahahaha!', desc: 'Evil Laugh 5,000 times.', icon: '🤣', gems: 10, check: (s) => s.stats.taps >= 5000 },
  { id: 'hero_1', name: 'Foiled Again!', desc: 'Foil Captain Righteous once.', icon: '🦸', gems: 3, check: (s) => s.stats.heroesFoiled >= 1 },
  { id: 'hero_25', name: 'Nemesis', desc: 'Foil Captain Righteous 25 times.', icon: '🥊', gems: 15, check: (s) => s.stats.heroesFoiled >= 25 },
  { id: 'chest_10', name: 'Loot Goblin', desc: 'Open 10 chests.', icon: '🎁', gems: 5, check: (s) => s.stats.chestsOpened >= 10 },
  { id: 'prestige_1', name: 'Villains Always Return', desc: 'Get defeated by the Hero.', icon: '⛓️', gems: 15, check: (s) => s.prestiges >= 1 },
  { id: 'prestige_5', name: 'Recurring Villain', desc: 'Get defeated 5 times.', icon: '🔁', gems: 30, check: (s) => s.prestiges >= 5 },
  { id: 'infamy_1k', name: 'Household Name', desc: 'Reach 1,000 Infamy.', icon: '📰', gems: 40, check: (s) => s.infamy >= 1000 },
];

/** Marks newly-earned achievements, grants gems, returns the new ones. */
export function checkAchievements(s: GameState): AchievementDef[] {
  const fresh: AchievementDef[] = [];
  for (const a of ACHIEVEMENTS) {
    if (!s.achievements[a.id] && a.check(s)) {
      s.achievements[a.id] = true;
      s.gems += a.gems;
      fresh.push(a);
    }
  }
  return fresh;
}

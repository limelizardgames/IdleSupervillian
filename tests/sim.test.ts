import { describe, it } from 'vitest';
import { newGame } from '../src/game/state';
import * as E from '../src/game/engine';
import { GENERATORS, LAIRS, DEVICES, UPGRADES } from '../src/game/data';

const RUN = !!(globalThis as { process?: { env: Record<string, string | undefined> } }).process?.env.SIM;

function simulate(maxHours: number, tapsPerSec: number, prestigeAt = Infinity) {
  const s = newGame(0);
  s.villainName = 'Sim';
  let t = 0;
  const log: string[] = [];
  const dt = 1;
  let lastLair = 0;
  let prestiges = 0;
  while (t < maxHours * 3600) {
    const now = t * 1000;
    E.completeBuilds(s, now);
    E.tick(s, dt, now);
    for (let k = 0; k < tapsPerSec; k++) E.tap(s, now);
    // greedy buys
    for (let guard = 0; guard < 50; guard++) {
      if (s.lair + 1 < LAIRS.length && s.funds >= E.lairCost(s, s.lair + 1)) { E.moveLair(s); continue; }
      const up = UPGRADES.find((u) => E.upgradeAvailable(s, u) && s.funds >= u.cost);
      if (up) { E.buyUpgrade(s, up.id); continue; }
      const dev = DEVICES.find((d) => E.deviceState(s, d.id) === 'available' && E.freeBuildSlot(s) && s.funds >= d.cost);
      if (dev) { E.startDevice(s, dev.id, now); continue; }
      let best = -1, bestRatio = Infinity;
      for (let i = 0; i < GENERATORS.length; i++) {
        if (!E.isGenUnlocked(s, i)) continue;
        const c = E.genCost(s, i, 1);
        const before = E.incomePerSec(s, now);
        s.gens[i]++; const after = E.incomePerSec(s, now); s.gens[i]--;
        const ratio = c / Math.max(1e-9, after - before);
        if (ratio < bestRatio) { bestRatio = ratio; best = i; }
      }
      if (best >= 0 && s.funds >= E.genCost(s, best, 1)) { E.buyGen(s, best, 1); continue; }
      break;
    }
    if (s.lair !== lastLair) { log.push(`${(t/60).toFixed(1)}m lair ${LAIRS[s.lair].name} inc=${E.incomePerSec(s, now).toExponential(2)}`); lastLair = s.lair; }
    if (E.canPrestige(s) && E.pendingInfamy(s) >= Math.max(prestigeAt, s.infamy * 1.5)) {
      const g = E.prestige(s); prestiges++; lastLair = 0;
      log.push(`${(t/60).toFixed(1)}m PRESTIGE #${prestiges} +${g} infamy total ${s.infamy}`);
    }
    t += dt;
  }
  log.push(`end ${maxHours}h: lair=${s.lair} gens=${s.gens.join(',')} inc=${E.incomePerSec(s, t*1000).toExponential(2)} devices=${Object.keys(s.devices).length} infamy=${s.infamy} pending=${E.pendingInfamy(s)}`);
  return log;
}

describe.skipIf(!RUN)('pacing sim', () => {
  it('first run, active', () => { console.log(simulate(6, 3).join('\n')); }, 600000);
  it('with prestige', () => { console.log(simulate(24, 2, 20).join('\n')); }, 600000);
});

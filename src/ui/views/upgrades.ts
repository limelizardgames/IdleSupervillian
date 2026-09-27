import type { App } from '../../app';
import { UI_ICONS } from '../../art/ui-icons';
import { GEN_ICONS } from '../../art/icons';
import { GENERATORS, type UpgradeDef } from '../../game/data';
import * as E from '../../game/engine';
import { fmtMoney } from '../../game/format';
import { el, esc, toggle } from '../dom';
import type { View } from '../tabs';

function upgradeIcon(u: UpgradeDef): string {
  if (u.effect.kind === 'gen') return GEN_ICONS[u.effect.target];
  if (u.effect.kind === 'tap') return UI_ICONS.minions;
  return UI_ICONS.boost;
}

export class UpgradesView implements View {
  id = 'upgrades';
  label = 'Upgrades';
  icon = UI_ICONS.upgrades;
  el = el('div', 'view view-upgrades');

  constructor(private app: App) {
    this.el.addEventListener('click', (e) => {
      const t = e.target as HTMLElement;
      const id = t.closest<HTMLElement>('[data-up]')?.dataset.up;
      if (id) this.app.buyUpgrade(id);
      if (t.closest('[data-all]')) this.app.buyAllUpgrades();
    });
  }

  key() {
    return E.visibleUpgrades(this.app.s).map((u) => u.id).join(',');
  }

  render() {
    const s = this.app.s;
    const list = E.visibleUpgrades(s);
    if (!list.length) {
      this.el.innerHTML = `<div class="empty"><div class="empty-emoji">🧪</div><b>No upgrades available yet.</b><br>Recruit more minions and move to bigger lairs to unlock schemes!</div>`;
      return;
    }
    this.el.innerHTML = `<button class="btn btn-primary btn-block" data-all>Buy All Affordable</button>` +
      list.map((u) => {
        const req = u.reqGen !== undefined && s.gens[u.reqGen] < (u.reqCount ?? 0)
          ? `Requires ${u.reqCount} ${esc(GENERATORS[u.reqGen].name)}` : '';
        return `
          <div class="card up-row" data-row="${u.id}">
            <div class="up-icon up-${u.effect.kind}">${upgradeIcon(u)}<span class="up-mult">x${u.effect.mult}</span></div>
            <div class="up-info"><div class="up-name">${esc(u.name)}</div><div class="up-desc">${esc(u.desc)}</div>${req ? `<div class="up-req">${req}</div>` : ''}</div>
            <button class="btn btn-buy" data-up="${u.id}"><span class="buy-cost">${fmtMoney(u.cost)}</span></button>
          </div>`;
      }).join('');
  }

  update() {
    const s = this.app.s;
    for (const row of this.el.querySelectorAll<HTMLElement>('[data-row]')) {
      const u = E.visibleUpgrades(s).find((x) => x.id === row.dataset.row);
      if (!u) continue;
      toggle(row.querySelector('.btn-buy'), 'afford', E.upgradeAvailable(s, u) && s.funds >= u.cost);
      toggle(row, 'locked', !E.upgradeAvailable(s, u));
    }
  }

  badge() {
    const s = this.app.s;
    return E.visibleUpgrades(s).some((u) => E.upgradeAvailable(s, u) && s.funds >= u.cost);
  }
}

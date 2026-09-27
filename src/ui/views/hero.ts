import type { App } from '../../app';
import { UI_ICONS } from '../../art/ui-icons';
import { portrait } from '../../art/characters';
import { GRUDGE_ICON, INFAMY_ICON } from '../../art/icons';
import { PERKS, PRESTIGE_MIN_EARNED } from '../../game/data';
import * as E from '../../game/engine';
import { fmt, fmtMoney } from '../../game/format';
import { confirmModal } from '../modals';
import { el, esc, setText, toggle } from '../dom';
import type { View } from '../tabs';

export class HeroView implements View {
  id = 'hero';
  label = 'Hero';
  icon = UI_ICONS.hero;
  el = el('div', 'view view-hero');

  constructor(private app: App) {
    this.el.addEventListener('click', async (e) => {
      const t = e.target as HTMLElement;
      const perk = t.closest<HTMLElement>('[data-perk]')?.dataset.perk;
      if (perk) return this.app.buyPerk(perk);
      const pr = t.closest<HTMLElement>('[data-prestige]')?.dataset.prestige;
      if (pr && E.canPrestige(this.app.s)) {
        const gain = Math.floor(E.pendingInfamy(this.app.s) * (pr === 'ad' ? 1.25 : 1));
        const ok = await confirmModal(
          'Get Defeated?',
          `<p>Captain Righteous will foil your evil plans and haul you off to Villain Jail.</p>
           <p><b class="red">You lose:</b> funds, minions, upgrades, lairs and devices.</p>
           <p><b class="green">You keep:</b> gems, chests, Legacy perks, purchases and achievements.</p>
           <p class="big-reward small-reward">+${fmt(gain)} Infamy &amp; Grudges</p>`,
          'Get Defeated!',
          'Not yet',
        );
        if (ok) this.app.prestige(pr === 'ad');
      }
    });
  }

  key() {
    const s = this.app.s;
    return `${s.prestiges}|${JSON.stringify(s.perks)}|${E.canPrestige(s)}`;
  }

  render() {
    const s = this.app.s;
    this.el.innerHTML = `
      <div class="card hero-card">
        <div class="hero-portrait">${portrait('hero')}</div>
        <div class="hero-text">
          <div class="hero-title">Captain Righteous</div>
          <div class="hero-quote">"No villain escapes justice! ...Eventually."</div>
        </div>
      </div>
      <div class="card stats-card">
        <div class="stat"><span class="stat-icon">${INFAMY_ICON}</span><div><div class="stat-v infamy-v"></div><div class="stat-l">Infamy (<span class="infamy-pct"></span> income)</div></div></div>
        <div class="stat"><span class="stat-icon">${GRUDGE_ICON}</span><div><div class="stat-v grudge-v"></div><div class="stat-l">Grudges to spend</div></div></div>
      </div>
      <div class="card prestige-card">
        <div class="pc-title">Get Defeated by the Hero</div>
        <div class="pc-desc">Lose this empire, but return with permanent Infamy. Each point boosts all income by <b>${(E.infamyBonusPerPoint(s) * 100).toFixed(0)}%</b> forever.</div>
        <div class="pc-pending">Defeat now for <b class="pending-v"></b> Infamy</div>
        <div class="bar pc-bar"><div class="bar-fill"></div><span class="bar-label"></span></div>
        <div class="pc-buttons">
          <button class="btn btn-danger" data-prestige="plain">Get Defeated</button>
          <button class="btn btn-ad" data-prestige="ad">▶ Defeated +25%</button>
        </div>
      </div>
      <div class="section-title">Legacy Perks <small>(spend Grudges — kept forever)</small></div>
      ${PERKS.map((p) => {
        const lvl = E.perkLevel(s, p.id);
        const maxed = lvl >= p.maxLevel;
        return `<div class="card perk-row" data-row="${p.id}">
          <div class="perk-icon">${p.icon}</div>
          <div class="perk-info"><div class="perk-name">${esc(p.name)} <span class="perk-lvl">${lvl}/${p.maxLevel}</span></div><div class="perk-desc">${esc(p.desc)}</div></div>
          ${maxed ? '<span class="badge-active">MAX</span>' : `<button class="btn btn-grudge" data-perk="${p.id}"><span class="inline-icon">${GRUDGE_ICON}</span> ${fmt(E.perkCost(s, p.id))}</button>`}
        </div>`;
      }).join('')}`;
  }

  update() {
    const s = this.app.s;
    setText(this.el.querySelector('.infamy-v'), fmt(s.infamy));
    setText(this.el.querySelector('.infamy-pct'), `+${fmt((E.infamyMult(s) - 1) * 100)}%`);
    setText(this.el.querySelector('.grudge-v'), fmt(s.grudges));
    setText(this.el.querySelector('.pending-v'), `+${fmt(E.pendingInfamy(s))}`);
    const can = E.canPrestige(s);
    const fill = this.el.querySelector<HTMLElement>('.pc-bar .bar-fill');
    if (fill) fill.style.width = `${Math.min(100, (s.runEarned / PRESTIGE_MIN_EARNED) * 100)}%`;
    setText(this.el.querySelector('.pc-bar .bar-label'), s.runEarned >= PRESTIGE_MIN_EARNED ? 'Ready!' : `Earn ${fmtMoney(s.runEarned)} / ${fmtMoney(PRESTIGE_MIN_EARNED)} this empire`);
    for (const b of this.el.querySelectorAll<HTMLButtonElement>('[data-prestige]')) b.disabled = !can;
    for (const b of this.el.querySelectorAll<HTMLElement>('[data-perk]')) toggle(b, 'afford', s.grudges >= E.perkCost(s, b.dataset.perk!));
  }

  badge() {
    const s = this.app.s;
    return E.canPrestige(s) && E.pendingInfamy(s) >= Math.max(10, s.infamy * 0.5);
  }
}

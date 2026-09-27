import type { App } from '../../app';
import { sceneSVG } from '../../art/scenes';
import { UI_ICONS } from '../../art/ui-icons';
import { GEN_ICONS, LOCK_ICON } from '../../art/icons';
import { GENERATORS, LAIRS, MILESTONES } from '../../game/data';
import * as E from '../../game/engine';
import { fmt, fmtMoney } from '../../game/format';
import type { BuyMode } from '../../game/state';
import { audio } from '../../services/audio';
import { el, esc, setText, toggle } from '../dom';
import type { View } from '../tabs';

const MODES: BuyMode[] = [1, 10, 100, 'max'];

export class OperationsView implements View {
  id = 'ops';
  label = 'Minions';
  icon = UI_ICONS.minions;
  el = el('div', 'view view-ops');

  constructor(private app: App) {
    this.el.addEventListener('click', (e) => {
      const t = e.target as HTMLElement;
      const mode = t.closest<HTMLElement>('[data-mode]')?.dataset.mode;
      if (mode) {
        audio.play('click');
        this.app.s.settings.buyMode = mode === 'max' ? 'max' : (Number(mode) as BuyMode);
        this.update();
        return;
      }
      if (t.closest('[data-lair]')) this.app.moveLair();
    });
    // Tap to buy; press-and-hold to keep buying. (Buying on click rather than
    // pointerdown means scrolling the list never buys by accident.)
    let holdTimer = 0;
    let repeat = 0;
    let held = false;
    const stop = () => {
      clearTimeout(holdTimer);
      clearInterval(repeat);
    };
    this.el.addEventListener('pointerdown', (e) => {
      const b = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-buy]');
      if (!b) return;
      const i = Number(b.dataset.buy);
      held = false;
      stop();
      holdTimer = window.setTimeout(() => {
        held = true;
        repeat = window.setInterval(() => {
          if (this.app.buyGen(i)) this.pop(b);
          else stop();
          this.update();
        }, 110);
      }, 420);
    });
    for (const ev of ['pointerup', 'pointerleave', 'pointercancel']) this.el.addEventListener(ev, stop);
    this.el.addEventListener('click', (e) => {
      const b = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-buy]');
      if (!b) return;
      if (held) {
        held = false;
        return;
      }
      if (this.app.buyGen(Number(b.dataset.buy))) this.pop(b);
      this.update();
    });
  }

  private pop(b: HTMLElement) {
    const row = b.closest('.gen-row');
    row?.classList.remove('pop');
    void (row as HTMLElement | null)?.offsetWidth;
    row?.classList.add('pop');
  }

  key() {
    const s = this.app.s;
    return `${s.lair}|${s.gens.map((g) => (g > 0 ? 1 : 0)).join('')}`;
  }

  render() {
    const s = this.app.s;
    const next = s.lair + 1 < LAIRS.length ? LAIRS[s.lair + 1] : null;
    let html = `<div class="buy-modes">${MODES.map((m) => `<button data-mode="${m}">${m === 'max' ? 'MAX' : 'x' + m}</button>`).join('')}</div>`;
    GENERATORS.forEach((g, i) => {
      if (!E.isGenUnlocked(s, i)) return;
      html += `
        <div class="card gen-row" data-row="${i}">
          <div class="gen-icon">${GEN_ICONS[i]}<span class="gen-count">0</span></div>
          <div class="gen-info">
            <div class="gen-name">${esc(g.name)}</div>
            <div class="gen-income">$0/s</div>
            <div class="bar"><div class="bar-fill"></div><span class="bar-label"></span></div>
          </div>
          <button class="btn btn-buy" data-buy="${i}"><span class="buy-n">x1</span><span class="buy-cost">$0</span></button>
        </div>`;
    });
    if (next) {
      const idx = s.lair + 1;
      html += `
        <div class="card lair-card">
          <div class="lair-thumb">${sceneSVG(idx)}</div>
          <div class="lair-info">
            <div class="lair-kicker">NEXT LAIR</div>
            <div class="lair-title">${esc(next.name)}</div>
            <div class="lair-desc">${esc(next.desc)}</div>
            <div class="lair-perks">All income x${next.mult} · Unlocks ${GENERATORS.filter((g) => g.lair === idx).map((g) => esc(g.name)).join(' & ')}</div>
            <div class="bar"><div class="bar-fill lair-fill"></div></div>
          </div>
          <button class="btn btn-lair" data-lair>Move In!<span class="lair-cost">${fmtMoney(E.lairCost(s, idx))}</span></button>
        </div>`;
      // Tease the locked generators of later lairs.
      GENERATORS.forEach((g, i) => {
        if (g.lair > idx || E.isGenUnlocked(s, i)) return;
        html += `<div class="card gen-row locked"><div class="gen-icon">${GEN_ICONS[i]}</div><div class="gen-info"><div class="gen-name">${esc(g.name)}</div><div class="gen-desc">${esc(g.desc)}</div></div><div class="lock">${LOCK_ICON}</div></div>`;
      });
    } else {
      html += `<div class="card lair-card done"><div class="lair-info"><div class="lair-kicker">MAXIMUM EVIL</div><div class="lair-title">You rule from the Moon!</div><div class="lair-desc">Build the ultimate Doomsday Device, then get defeated to grow even stronger.</div></div></div>`;
    }
    this.el.innerHTML = html;
  }

  update() {
    const s = this.app.s;
    for (const b of this.el.querySelectorAll<HTMLElement>('[data-mode]')) toggle(b, 'active', String(s.settings.buyMode) === b.dataset.mode);
    for (const row of this.el.querySelectorAll<HTMLElement>('[data-row]')) {
      const i = Number(row.dataset.row);
      const n = E.buyAmount(s, i, s.settings.buyMode);
      const cost = E.genCost(s, i, n);
      setText(row.querySelector('.gen-count'), fmt(s.gens[i]));
      setText(row.querySelector('.gen-income'), `${fmtMoney(E.genIncome(s, i))}/s`);
      setText(row.querySelector('.buy-n'), `x${fmt(n)}`);
      setText(row.querySelector('.buy-cost'), fmtMoney(cost));
      const btn = row.querySelector<HTMLButtonElement>('.btn-buy')!;
      toggle(btn, 'afford', cost <= s.funds);
      const nm = E.nextMilestone(s.gens[i]);
      const prev = [0, ...MILESTONES].filter((m) => m <= s.gens[i]).pop() ?? 0;
      const fill = row.querySelector<HTMLElement>('.bar-fill')!;
      if (nm) {
        fill.style.width = `${Math.min(100, ((s.gens[i] - prev) / (nm - prev)) * 100)}%`;
        setText(row.querySelector('.bar-label'), `${fmt(s.gens[i])}/${nm} → x2`);
      } else {
        fill.style.width = '100%';
        setText(row.querySelector('.bar-label'), 'MAXED');
      }
      toggle(row, 'hint', s.gens[i] <= 1 && i === 0 && cost <= s.funds && s.stats.taps < 60);
    }
    const lf = this.el.querySelector<HTMLElement>('.lair-fill');
    if (lf) {
      const c = E.lairCost(s, s.lair + 1);
      lf.style.width = `${Math.min(100, (s.funds / c) * 100)}%`;
      toggle(this.el.querySelector('.btn-lair'), 'afford', s.funds >= c);
      toggle(this.el.querySelector('.lair-card'), 'ready', s.funds >= c);
    }
  }

  badge() {
    const s = this.app.s;
    return s.lair + 1 < LAIRS.length && s.funds >= E.lairCost(s, s.lair + 1);
  }
}

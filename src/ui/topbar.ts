import type { App } from '../app';
import { COIN_ICON, GEM_ICON } from '../art/icons';
import * as E from '../game/engine';
import { fmt, fmtMoney } from '../game/format';
import { setText, toggle } from './dom';
import { openSettings } from './settings';

export class TopBar {
  private funds: HTMLElement;
  private ips: HTMLElement;
  private gems: HTMLElement;
  private lastFunds = 0;

  constructor(private app: App, root: HTMLElement) {
    root.innerHTML = `
      <div class="tb-funds">
        <span class="tb-coin">${COIN_ICON}</span>
        <div class="tb-funds-text"><div class="tb-amount">$0</div><div class="tb-ips">$0/s</div></div>
      </div>
      <button class="tb-gems" aria-label="Gems"><span class="tb-gem">${GEM_ICON}</span><span class="tb-gem-n">0</span><span class="tb-plus">+</span></button>
      <button class="tb-settings" aria-label="Menu">☰</button>`;
    this.funds = root.querySelector('.tb-amount')!;
    this.ips = root.querySelector('.tb-ips')!;
    this.gems = root.querySelector('.tb-gem-n')!;
    root.querySelector('.tb-gems')!.addEventListener('click', () => this.app.tabs.show('shop'));
    root.querySelector('.tb-settings')!.addEventListener('click', () => openSettings(this.app));
  }

  update() {
    const s = this.app.s;
    setText(this.funds, fmtMoney(s.funds));
    const inc = E.incomePerSec(s);
    setText(this.ips, `${fmtMoney(inc)}/s`);
    toggle(this.ips, 'boosted', E.tempMult(s) > 1);
    setText(this.gems, fmt(s.gems));
    if (s.funds > this.lastFunds * 1.5 && this.lastFunds > 0) {
      this.funds.classList.remove('bump');
      void this.funds.offsetWidth;
      this.funds.classList.add('bump');
    }
    this.lastFunds = s.funds;
  }
}

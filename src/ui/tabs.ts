import type { App } from '../app';
import { audio } from '../services/audio';
import { el, toggle } from './dom';
import { openDaily } from './daily';
import { OperationsView } from './views/operations';
import { UpgradesView } from './views/upgrades';
import { DevicesView } from './views/devices';
import { HeroView } from './views/hero';
import { ShopView } from './views/shop';

export interface View {
  id: string;
  label: string;
  icon: string;
  el: HTMLElement;
  render(): void;
  update(): void;
  badge(): boolean;
  /** Optional: a string that changes whenever the view must re-render. */
  key?(): string;
}

export class Tabs {
  dirty = true;
  private views: View[];
  private current: View;
  private nav: HTMLElement;
  private lastKey = '';
  private lastBadge = 0;

  constructor(private app: App, private panel: HTMLElement, nav: HTMLElement) {
    this.nav = nav;
    this.views = [
      new OperationsView(app),
      new UpgradesView(app),
      new DevicesView(app),
      new HeroView(app),
      new ShopView(app),
    ];
    for (const v of this.views) {
      const b = el('button', 'tab', `<span class="tab-icon">${v.icon}</span><span class="tab-label">${v.label}</span><i class="dot"></i>`);
      b.dataset.tab = v.id;
      b.addEventListener('click', () => {
        audio.play('click');
        this.show(v.id);
      });
      nav.appendChild(b);
    }
    this.current = this.views[0];
    this.show('ops');
  }

  show(id: string) {
    const v = this.views.find((x) => x.id === id);
    if (!v) return;
    this.current = v;
    this.panel.innerHTML = '';
    this.panel.appendChild(v.el);
    this.panel.scrollTop = 0;
    for (const b of this.nav.querySelectorAll<HTMLElement>('.tab')) toggle(b, 'active', b.dataset.tab === id);
    this.dirty = true;
    this.update();
  }

  openDaily() {
    openDaily(this.app);
  }

  update() {
    const key = this.current.key?.() ?? '';
    if (this.dirty || key !== this.lastKey) {
      this.dirty = false;
      this.lastKey = key;
      this.current.render();
    }
    this.current.update();
    const now = Date.now();
    if (now - this.lastBadge > 500) {
      this.lastBadge = now;
      for (const v of this.views) {
        toggle(this.nav.querySelector(`[data-tab="${v.id}"]`), 'badged', v !== this.current && v.badge());
      }
    }
  }
}

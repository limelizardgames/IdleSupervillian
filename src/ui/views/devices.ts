import { effectLabel, type App } from '../../app';
import { UI_ICONS } from '../../art/ui-icons';
import { DEVICES, LAIRS } from '../../game/data';
import * as E from '../../game/engine';
import { fmtMoney, fmtTime } from '../../game/format';
import { el, esc, setText, toggle } from '../dom';
import type { View } from '../tabs';

export class DevicesView implements View {
  id = 'devices';
  label = 'Doomsday';
  icon = UI_ICONS.doomsday;
  el = el('div', 'view view-devices');

  constructor(private app: App) {
    this.el.addEventListener('click', (e) => {
      const t = e.target as HTMLElement;
      const b = t.closest<HTMLElement>('[data-act]');
      if (!b) return;
      const id = b.dataset.id!;
      switch (b.dataset.act) {
        case 'build': this.app.startDevice(id); break;
        case 'ad': this.app.adSkipDevice(id); break;
        case 'gems': this.app.gemFinishDevice(id); break;
        case 'slot': this.app.buyGemItem('build_slot'); break;
      }
    });
  }

  key() {
    const s = this.app.s;
    return DEVICES.map((d) => E.deviceState(s, d.id)[0]).join('') + s.buildSlots + s.builds.length;
  }

  render() {
    const s = this.app.s;
    const built = DEVICES.filter((d) => s.devices[d.id]).length;
    let html = `
      <div class="card devices-head">
        <div><div class="dh-title">Doomsday Workshop</div><div class="dh-sub">${built}/${DEVICES.length} devices built · Build bays: ${s.builds.length}/${s.buildSlots} busy</div></div>
        ${s.buildSlots < 2 ? `<button class="btn btn-gem btn-small" data-act="slot" data-id="">+1 Bay · 💎250</button>` : ''}
      </div>`;
    for (const d of DEVICES) {
      const st = E.deviceState(s, d.id);
      html += `<div class="card dev-row dev-${st}" data-row="${d.id}">
        <div class="dev-icon"><span>${st === 'locked' ? '❓' : d.icon}</span></div>
        <div class="dev-info">
          <div class="dev-name">${st === 'locked' ? '???' : esc(d.name)}</div>
          <div class="dev-desc">${st === 'locked' ? `Unlocks in the ${esc(LAIRS[d.lair].name)}` : esc(d.desc)}</div>
          ${st !== 'locked' ? `<div class="dev-effect">${effectLabel(d.effect)}</div>` : ''}
          ${st === 'building' ? `<div class="bar"><div class="bar-fill"></div><span class="bar-label"></span></div>` : ''}
        </div>
        <div class="dev-actions">${this.actions(st, d.id)}</div>
      </div>`;
    }
    this.el.innerHTML = html;
  }

  private actions(st: string, id: string) {
    const s = this.app.s;
    const d = DEVICES.find((x) => x.id === id)!;
    switch (st) {
      case 'built': return `<span class="badge-active">ACTIVE</span>`;
      case 'locked': return '';
      case 'building': return `
        <button class="btn btn-ad btn-small" data-act="ad" data-id="${id}">▶ -30m</button>
        <button class="btn btn-gem btn-small" data-act="gems" data-id="${id}">💎 <span class="gem-cost"></span></button>`;
      default: return `<button class="btn btn-buy" data-act="build" data-id="${id}"><span class="buy-n">Build · ${fmtTime(E.deviceBuildTime(s, id))}</span><span class="buy-cost">${fmtMoney(d.cost)}</span></button>`;
    }
  }

  update() {
    const s = this.app.s;
    const now = Date.now();
    for (const row of this.el.querySelectorAll<HTMLElement>('[data-row]')) {
      const id = row.dataset.row!;
      const d = DEVICES.find((x) => x.id === id)!;
      const job = s.builds.find((b) => b.id === id);
      if (job) {
        const total = E.deviceBuildTime(s, id) * 1000;
        const left = Math.max(0, job.endsAt - now);
        const fill = row.querySelector<HTMLElement>('.bar-fill');
        if (fill) fill.style.width = `${Math.min(100, (1 - left / total) * 100)}%`;
        setText(row.querySelector('.bar-label'), fmtTime(left / 1000));
        setText(row.querySelector('.gem-cost'), String(E.gemsToFinish(s, id, now)));
      }
      const btn = row.querySelector('[data-act="build"]');
      if (btn) toggle(btn, 'afford', s.funds >= d.cost && E.freeBuildSlot(s));
    }
  }

  badge() {
    const s = this.app.s;
    return E.freeBuildSlot(s) && DEVICES.some((d) => E.deviceState(s, d.id) === 'available' && s.funds >= d.cost);
  }
}

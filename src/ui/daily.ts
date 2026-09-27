import type { App } from '../app';
import { CHEST_ICONS, GEM_ICON } from '../art/icons';
import { DAILY_REWARDS } from '../game/data';
import * as E from '../game/engine';
import { el } from './dom';
import { showModal } from './modals';

export function openDaily(app: App) {
  const s = app.s;
  const available = E.dailyAvailable(s);
  const today = E.dailyIndex(s);
  return showModal((close) => {
    const w = el('div', 'daily');
    const cells = DAILY_REWARDS.map((r, i) => {
      const icon = r.chest ? CHEST_ICONS[r.chest] : r.gems ? GEM_ICON : r.boostSeconds ? '<span class="emoji-icon">⚡</span>' : '<span class="emoji-icon">💵</span>';
      const state = i < today ? 'claimed' : available && i === today ? 'today' : '';
      return `<div class="daily-cell ${state} ${i === 6 ? 'big' : ''}"><div class="dc-day">Day ${i + 1}</div><div class="dc-icon">${icon}</div><div class="dc-label">${r.label}</div></div>`;
    }).join('');
    w.innerHTML = `
      <div class="modal-title">Daily Evil Allowance</div>
      <div class="muted small center">Log in every day for bigger rewards! Streak: <b>${s.daily.streak}</b></div>
      <div class="daily-grid">${cells}</div>
      <div class="modal-buttons">
        ${available ? '<button class="btn btn-primary" data-a="claim">Claim Day ' + (today + 1) + '!</button>' : '<button class="btn btn-ghost" data-a="close">Come back tomorrow!</button>'}
      </div>`;
    w.addEventListener('click', (e) => {
      const a = (e.target as HTMLElement).closest<HTMLElement>('[data-a]')?.dataset.a;
      if (a === 'claim') {
        app.claimDaily();
        close();
      } else if (a === 'close') close();
    });
    return w;
  });
}

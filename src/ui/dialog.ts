import { portrait } from '../art/characters';
import { SPEAKERS, fillName, type Line } from '../game/story';
import type { GameState } from '../game/state';
import { audio } from '../services/audio';
import { el, esc } from './dom';
import { showModal } from './modals';

/** Plays a comic-style dialog sequence. Resolves when finished or skipped. */
export function playDialog(s: GameState, lines: Line[], title = ''): Promise<void> {
  return showModal((close) => {
    const wrap = el('div', 'dialog');
    wrap.innerHTML = `
      ${title ? `<div class="dialog-title">${esc(title)}</div>` : ''}
      <div class="dialog-stage">
        <div class="dialog-portrait"></div>
        <div class="dialog-bubble">
          <div class="dialog-name"></div>
          <div class="dialog-text"></div>
          <div class="dialog-next">▼</div>
        </div>
      </div>
      <div class="dialog-footer"><span class="dialog-progress"></span><button class="btn btn-ghost btn-small dialog-skip">Skip ▸▸</button></div>`;
    const portraitEl = wrap.querySelector<HTMLElement>('.dialog-portrait')!;
    const nameEl = wrap.querySelector<HTMLElement>('.dialog-name')!;
    const textEl = wrap.querySelector<HTMLElement>('.dialog-text')!;
    const progEl = wrap.querySelector<HTMLElement>('.dialog-progress')!;
    const stage = wrap.querySelector<HTMLElement>('.dialog-stage')!;
    let idx = -1;
    let typing: number | null = null;
    let full = '';

    const finishTyping = () => {
      if (typing !== null) {
        clearInterval(typing);
        typing = null;
        textEl.textContent = full;
      }
    };

    const show = (i: number) => {
      const line = lines[i];
      const sp = SPEAKERS[line.who];
      stage.className = `dialog-stage who-${line.who} ${i % 2 ? 'alt' : ''}`;
      portraitEl.innerHTML = portrait(line.who);
      portraitEl.classList.remove('pop');
      void portraitEl.offsetWidth;
      portraitEl.classList.add('pop');
      nameEl.textContent = line.who === 'villain' ? (s.villainName || sp.name) : sp.name;
      nameEl.style.color = sp.color;
      nameEl.style.display = sp.name || line.who === 'villain' ? '' : 'none';
      full = fillName(line.text, s);
      textEl.textContent = '';
      progEl.textContent = `${i + 1} / ${lines.length}`;
      let c = 0;
      typing = window.setInterval(() => {
        c += 2;
        textEl.textContent = full.slice(0, c);
        if (c % 6 === 0) audio.play('tap');
        if (c >= full.length) finishTyping();
      }, 22);
    };

    const advance = () => {
      if (typing !== null) {
        finishTyping();
        return;
      }
      idx++;
      if (idx >= lines.length) close();
      else show(idx);
    };

    wrap.addEventListener('click', (e) => {
      if ((e.target as HTMLElement).closest('.dialog-skip')) {
        finishTyping();
        close();
        return;
      }
      advance();
    });
    advance();
    return wrap;
  }, { cls: 'modal-dialog', dismissable: false });
}

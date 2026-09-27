import type { App } from '../app';
import { ACHIEVEMENTS } from '../game/achievements';
import { fmt, fmtMoney, fmtTime } from '../game/format';
import { STORY } from '../game/story';
import { audio } from '../services/audio';
import { auth } from '../services/auth';
import { setHaptics } from '../services/haptics';
import { SaveManager, saves } from '../services/save';
import { playDialog } from './dialog';
import { el, esc } from './dom';
import { toast } from './fx';
import { confirmModal, showModal, simpleModal } from './modals';

export function openSettings(app: App) {
  const s = app.s;
  showModal((close) => {
    const w = el('div', 'settings');
    const user = auth.currentUser();
    const achDone = ACHIEVEMENTS.filter((a) => s.achievements[a.id]).length;
    w.innerHTML = `
      <div class="modal-title">Villain HQ</div>
      <div class="settings-profile">
        <div class="sp-name">${esc(s.villainName)}</div>
        <div class="sp-sub">${user?.provider === 'guest' ? 'Playing as guest · Cloud save & login coming soon' : esc(user?.displayName ?? '')}</div>
      </div>
      <div class="settings-grid">
        <button class="btn btn-ghost" data-a="ach">🏆 Achievements <small>${achDone}/${ACHIEVEMENTS.length}</small></button>
        <button class="btn btn-ghost" data-a="story">📖 Story</button>
        <button class="btn btn-ghost" data-a="stats">📊 Stats</button>
        <button class="btn btn-ghost" data-a="rename">✏️ Rename</button>
      </div>
      <label class="toggle-row"><span>🔊 Sound effects</span><input type="checkbox" data-t="sound" ${s.settings.sound ? 'checked' : ''}><i></i></label>
      <label class="toggle-row"><span>📳 Haptics</span><input type="checkbox" data-t="haptics" ${s.settings.haptics ? 'checked' : ''}><i></i></label>
      <div class="settings-grid">
        <button class="btn btn-ghost btn-small" data-a="export">Export Save</button>
        <button class="btn btn-ghost btn-small" data-a="import">Import Save</button>
        <button class="btn btn-ghost btn-small" data-a="restore">Restore Purchases</button>
        <button class="btn btn-danger btn-small" data-a="reset">Reset Game</button>
      </div>
      <div class="fine-print">Idle Supervillain v0.1 · by Lime Lizard Games</div>
      <div class="modal-buttons"><button class="btn btn-primary" data-a="close">Back to Scheming</button></div>`;

    w.addEventListener('change', (e) => {
      const t = e.target as HTMLInputElement;
      if (t.dataset.t === 'sound') {
        s.settings.sound = t.checked;
        audio.enabled = t.checked;
      } else if (t.dataset.t === 'haptics') {
        s.settings.haptics = t.checked;
        setHaptics(t.checked);
      }
      app.save();
    });

    w.addEventListener('click', async (e) => {
      const a = (e.target as HTMLElement).closest<HTMLElement>('[data-a]')?.dataset.a;
      if (!a) return;
      audio.play('click');
      switch (a) {
        case 'close': close(); break;
        case 'ach': close(); openAchievements(app); break;
        case 'story': close(); openStory(app); break;
        case 'stats': close(); openStats(app); break;
        case 'rename': close(); askName(app); break;
        case 'restore': app.restorePurchases(); break;
        case 'export': close(); saveTextModal(app, 'export'); break;
        case 'import': close(); saveTextModal(app, 'import'); break;
        case 'reset': {
          close();
          const ok = await confirmModal('Reset Everything?', '<p>This permanently deletes ALL progress, including Infamy and gems. Purchases can be restored.</p>', 'Delete it all', 'Keep playing');
          if (ok) {
            await saves.wipe();
            location.reload();
          }
          break;
        }
      }
    });
    return w;
  }, { cls: 'modal-wide' });
}

/** Shows the save string to copy, or a box to paste one in. */
function saveTextModal(app: App, mode: 'export' | 'import') {
  const str = mode === 'export' ? SaveManager.exportString(app.s) : '';
  showModal((close) => {
    const w = el('div');
    w.innerHTML = `
      <div class="modal-title">${mode === 'export' ? 'Export Save' : 'Import Save'}</div>
      <p class="muted small center">${mode === 'export' ? 'Copy this text and keep it somewhere safe.' : 'Paste a save string. This replaces your current progress.'}</p>
      <textarea id="save-text" class="save-text" ${mode === 'export' ? 'readonly' : ''}>${esc(str)}</textarea>
      <div class="modal-buttons">
        <button class="btn btn-ghost" data-a="close">Close</button>
        <button class="btn btn-primary" data-a="go">${mode === 'export' ? 'Copy' : 'Load Save'}</button>
      </div>`;
    const ta = w.querySelector<HTMLTextAreaElement>('textarea')!;
    w.addEventListener('click', async (e) => {
      const a = (e.target as HTMLElement).closest<HTMLElement>('[data-a]')?.dataset.a;
      if (a === 'close') close();
      if (a !== 'go') return;
      if (mode === 'export') {
        try {
          await navigator.clipboard.writeText(str);
          toast('<span class="toast-icon">📋</span><div>Save copied!</div>');
        } catch {
          ta.select();
        }
        return;
      }
      try {
        await saves.save(SaveManager.importString(ta.value));
        location.reload();
      } catch {
        toast('<span class="toast-icon">⚠️</span><div>That save text is invalid. Check you copied all of it.</div>', 'toast-red');
      }
    });
    return w;
  }, { cls: 'modal-wide' });
}

function openAchievements(app: App) {
  const s = app.s;
  simpleModal('Achievements', `<div class="ach-list">${ACHIEVEMENTS.map((a) => `
    <div class="ach ${s.achievements[a.id] ? 'done' : ''}"><span class="ach-icon">${a.icon}</span><div><b>${esc(a.name)}</b><div class="small muted">${esc(a.desc)}</div></div><span class="ach-gems">💎${a.gems}</span></div>`).join('')}</div>`,
  [{ label: 'Close', cls: 'btn-primary' }], { cls: 'modal-wide' });
}

function openStory(app: App) {
  const s = app.s;
  const seen = STORY.filter((b) => s.story[b.id]);
  showModal((close) => {
    const w = el('div');
    w.innerHTML = `<div class="modal-title">Story So Far</div><div class="story-list">${
      seen.length ? seen.map((b) => `<button class="btn btn-ghost btn-block" data-b="${b.id}">▶ ${esc(b.title)}</button>`).join('') : '<p class="muted">Nothing yet!</p>'
    }</div><div class="modal-buttons"><button class="btn btn-primary" data-b="">Close</button></div>`;
    w.addEventListener('click', (e) => {
      const id = (e.target as HTMLElement).closest<HTMLElement>('[data-b]')?.dataset.b;
      if (id === undefined) return;
      close();
      const beat = STORY.find((b) => b.id === id);
      if (beat) playDialog(s, beat.lines, beat.title);
    });
    return w;
  }, { cls: 'modal-wide' });
}

function openStats(app: App) {
  const s = app.s;
  const rows: [string, string][] = [
    ['Lifetime evil funds', fmtMoney(s.lifetimeEarned)],
    ['This empire', fmtMoney(s.runEarned)],
    ['Times defeated', fmt(s.prestiges)],
    ['Evil laughs', fmt(s.stats.taps)],
    ['Funds from laughing', fmtMoney(s.stats.tapEarned)],
    ['Heroes foiled', fmt(s.stats.heroesFoiled)],
    ['Chests opened', fmt(s.stats.chestsOpened)],
    ['Devices built', fmt(s.stats.devicesBuilt)],
    ['Time scheming', fmtTime(s.stats.playSeconds)],
  ];
  simpleModal('Evil Statistics', `<div class="stats-list">${rows.map(([k, v]) => `<div><span>${k}</span><b>${v}</b></div>`).join('')}</div>`, [{ label: 'Close', cls: 'btn-primary' }]);
}

const TITLES = ['Doctor', 'Baron', 'Professor', 'Lord', 'Madame', 'Count', 'Captain', 'The Notorious', 'Emperor', 'Duchess'];
const NAMES = ['Malevolent', 'Doomsworth', 'Chaos', 'Nefarious', 'Sinistro', 'Mayhem', 'Vex', 'Gloom', 'Menace', 'Wickedly', 'Von Evilstein', 'Snarl', 'Havoc', 'Dreadful'];

export function randomVillainName() {
  return `${TITLES[Math.floor(Math.random() * TITLES.length)]} ${NAMES[Math.floor(Math.random() * NAMES.length)]}`;
}

/** Name picker. Resolves once the player confirms a name. */
export function askName(app: App): Promise<void> {
  return showModal((close) => {
    const w = el('div', 'name-pick');
    w.innerHTML = `
      <div class="modal-title">Who Are You, Villain?</div>
      <p class="muted center">Every great supervillain needs a name that strikes fear into hearts. Or at least mild concern.</p>
      <div class="name-input-row">
        <input class="name-input" maxlength="24" value="${esc(app.s.villainName || randomVillainName())}" aria-label="Villain name">
        <button class="btn btn-ghost dice" aria-label="Random name">🎲</button>
      </div>
      <div class="modal-buttons"><button class="btn btn-primary go">Begin My Evil Reign!</button></div>`;
    const input = w.querySelector<HTMLInputElement>('.name-input')!;
    w.querySelector('.dice')!.addEventListener('click', () => {
      audio.play('click');
      input.value = randomVillainName();
    });
    const go = () => {
      const v = input.value.trim().slice(0, 24);
      if (!v) return;
      app.s.villainName = v;
      audio.play('fanfare');
      app.save();
      close();
    };
    w.querySelector('.go')!.addEventListener('click', go);
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') go(); });
    return w;
  }, { dismissable: false, urgent: true });
}

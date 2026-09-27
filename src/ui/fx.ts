import { portrait } from '../art/characters';
import { COIN_ICON } from '../art/icons';
import { SPEAKERS, type Line } from '../game/story';
import { el, esc } from './dom';

let fxLayer: HTMLElement;
let toastLayer: HTMLElement;
let live = 0;
const MAX_LIVE = 60;

export function initFx(layer: HTMLElement, toasts: HTMLElement) {
  fxLayer = layer;
  toastLayer = toasts;
}

function spawn(node: HTMLElement, ttl: number) {
  live++;
  fxLayer.appendChild(node);
  setTimeout(() => {
    node.remove();
    live--;
  }, ttl);
}

/** Floating "+$123" text at page coordinates. */
export function floatText(x: number, y: number, text: string, cls = '') {
  if (live > MAX_LIVE) return;
  const n = el('div', `float-text ${cls}`);
  n.textContent = text;
  n.style.left = `${x + (Math.random() * 30 - 15)}px`;
  n.style.top = `${y - 10}px`;
  spawn(n, 1100);
}

/** Burst of coins flying out from a point. */
export function coinBurst(x: number, y: number, count = 5) {
  for (let i = 0; i < count && live < MAX_LIVE; i++) {
    const c = el('div', 'coin-particle', COIN_ICON);
    const ang = -Math.PI / 2 + (Math.random() - 0.5) * 2.2;
    const dist = 50 + Math.random() * 70;
    c.style.left = `${x}px`;
    c.style.top = `${y}px`;
    c.style.setProperty('--dx', `${Math.cos(ang) * dist}px`);
    c.style.setProperty('--dy', `${Math.sin(ang) * dist}px`);
    c.style.setProperty('--rot', `${Math.random() * 720 - 360}deg`);
    spawn(c, 900);
  }
}

/** Comic-book "POW!" burst. */
export function comicBurst(x: number, y: number, word: string, color = '#ffd23f') {
  const b = el('div', 'comic-burst');
  b.innerHTML = `<svg viewBox="0 0 100 100"><path d="M50 2 L60 30 L92 16 L72 42 L98 58 L66 62 L74 96 L50 72 L26 96 L34 62 L2 58 L28 42 L8 16 L40 30Z" fill="${color}" stroke="#1b1530" stroke-width="4" stroke-linejoin="round"/></svg><span>${esc(word)}</span>`;
  b.style.left = `${x}px`;
  b.style.top = `${y}px`;
  spawn(b, 1000);
}

/** Small notification that slides in at the top. */
export function toast(html: string, cls = '', ms = 2600) {
  const t = el('div', `toast ${cls}`, html);
  toastLayer.appendChild(t);
  while (toastLayer.children.length > 2) toastLayer.firstElementChild?.remove();
  setTimeout(() => t.classList.add('out'), ms);
  setTimeout(() => t.remove(), ms + 400);
  t.addEventListener('click', () => t.remove());
}

/** Character quip toast with a mini portrait. */
export function quip(line: Line, name?: string) {
  const sp = SPEAKERS[line.who];
  toast(
    `<div class="quip-portrait">${portrait(line.who)}</div><div><div class="quip-name" style="color:${sp.color}">${esc(name ?? sp.name)}</div><div class="quip-text">${esc(line.text)}</div></div>`,
    'toast-quip',
    4200,
  );
}

/** Full-screen flash + confetti for big moments. */
export function celebrate() {
  const f = el('div', 'flash');
  document.body.appendChild(f);
  setTimeout(() => f.remove(), 700);
  const colors = ['#ffd23f', '#b04dff', '#3ddc84', '#ff4d6d', '#4dabff'];
  for (let i = 0; i < 40; i++) {
    const c = el('div', 'confetti');
    c.style.left = `${Math.random() * 100}vw`;
    c.style.background = colors[i % colors.length];
    c.style.animationDelay = `${Math.random() * 0.4}s`;
    c.style.animationDuration = `${1.6 + Math.random() * 1.2}s`;
    c.style.setProperty('--sway', `${Math.random() * 80 - 40}px`);
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 3400);
  }
}

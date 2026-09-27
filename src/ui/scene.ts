import type { App } from '../app';
import { HENCHMAN_MINI, HERO_FLYING, VILLAIN_BODY } from '../art/characters';
import { GEN_ICONS } from '../art/icons';
import { sceneSVG } from '../art/scenes';
import { LAIRS } from '../game/data';
import * as E from '../game/engine';
import { fmtTime } from '../game/format';
import { el, setText, toggle } from './dom';

const LAUGHS = ['MWAHAHA!', 'MUAHAHA!', 'FOOLS!', 'EXCELLENT!', 'YES! YES!', 'BWAHAHA!', 'UNLIMITED POWER!', 'HEH HEH HEH'];

export class Scene {
  el: HTMLElement;
  private bg: HTMLElement;
  private actors: HTMLElement;
  private villain: HTMLElement;
  private bubble: HTMLElement;
  private chips: HTMLElement;
  private lairName: HTMLElement;
  private actorKey = '';
  private tapCount = 0;
  private bubbleTimer = 0;
  private hint: HTMLElement;

  constructor(private app: App, root: HTMLElement) {
    this.el = root;
    root.innerHTML = `
      <div class="scene-bg-wrap"></div>
      <div class="scene-actors"></div>
      <div class="scene-vignette"></div>
      <div class="lair-name"></div>
      <div class="scene-chips">
        <div class="chip chip-boost"><span>⚡ x2</span><b></b></div>
        <div class="chip chip-frenzy"><span>🔥 x7</span><b></b></div>
      </div>
      <div class="scene-side">
        <button class="side-btn side-daily" aria-label="Daily reward"><span>📅</span><i class="dot"></i><small>Daily</small></button>
        <button class="side-btn side-boost" aria-label="Watch ad for boost"><span>⚡</span><small>x2 Ad</small></button>
        <button class="side-btn side-chest" aria-label="Free chest"><span>🎁</span><i class="dot"></i><small class="side-chest-t">Free</small></button>
      </div>
      <div class="villain-wrap">
        <div class="speech"></div>
        <div class="villain">${VILLAIN_BODY}</div>
        <div class="tap-hint">👆 TAP ME!</div>
      </div>`;
    this.bg = root.querySelector('.scene-bg-wrap')!;
    this.actors = root.querySelector('.scene-actors')!;
    this.villain = root.querySelector('.villain')!;
    this.bubble = root.querySelector('.speech')!;
    this.chips = root.querySelector('.scene-chips')!;
    this.lairName = root.querySelector('.lair-name')!;
    this.hint = root.querySelector('.tap-hint')!;
    this.setLair(app.s.lair);

    const wrap = root.querySelector<HTMLElement>('.villain-wrap')!;
    wrap.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      this.onVillainTap(e.clientX, e.clientY);
    });
    root.querySelector('.side-daily')!.addEventListener('click', () => this.app.tabs.openDaily());
    root.querySelector('.side-boost')!.addEventListener('click', () => this.app.adBoost());
    root.querySelector('.side-chest')!.addEventListener('click', () => {
      if (E.freeChestReady(this.app.s)) this.app.claimFreeChest();
      else this.app.tabs.show('shop');
    });
  }

  setLair(lair: number) {
    this.bg.innerHTML = sceneSVG(lair);
    this.el.dataset.lair = String(lair);
    this.lairName.innerHTML = `<small>LAIR ${lair + 1}/${LAIRS.length}</small>${LAIRS[lair].name}`;
    this.lairName.classList.remove('show');
    void this.lairName.offsetWidth;
    this.lairName.classList.add('show');
    this.actorKey = '';
  }

  private onVillainTap(x: number, y: number) {
    this.app.tap(x, y);
    this.villain.classList.remove('laugh');
    void this.villain.offsetWidth;
    this.villain.classList.add('laugh');
    this.tapCount++;
    if (this.tapCount % 12 === 1) {
      this.bubble.textContent = LAUGHS[Math.floor(Math.random() * LAUGHS.length)];
      this.bubble.classList.add('show');
      clearTimeout(this.bubbleTimer);
      this.bubbleTimer = window.setTimeout(() => this.bubble.classList.remove('show'), 1100);
    }
  }

  /** Rebuilds the little walking henchmen/pigeons/robots to reflect progress. */
  private updateActors() {
    const g = this.app.s.gens;
    const hench = Math.min(5, g[0] <= 1 ? g[0] : Math.ceil(Math.log2(g[0] + 1)));
    const pigeons = Math.min(3, g[1] > 0 ? Math.ceil(Math.log10(g[1] + 1)) : 0);
    const robots = g[5] > 0 ? Math.min(2, Math.ceil(Math.log10(g[5] + 1))) : 0;
    const key = `${hench}|${pigeons}|${robots}`;
    if (key === this.actorKey) return;
    this.actorKey = key;
    this.actors.innerHTML = '';
    for (let i = 0; i < hench; i++) {
      const w = el('div', 'walker', `<div class="walker-inner">${HENCHMAN_MINI}</div>`);
      w.style.setProperty('--dur', `${9 + i * 2.3}s`);
      w.style.setProperty('--delay', `${-i * 3.1}s`);
      w.style.setProperty('--y', `${2 + (i % 3) * 3}%`);
      w.style.setProperty('--scale', `${0.9 + (i % 2) * 0.15}`);
      this.actors.appendChild(w);
    }
    for (let i = 0; i < pigeons; i++) {
      const f = el('div', 'flyer', `<div class="flyer-inner">${GEN_ICONS[1]}</div>`);
      f.style.setProperty('--dur', `${7 + i * 2}s`);
      f.style.setProperty('--delay', `${-i * 2.5}s`);
      f.style.setProperty('--top', `${10 + i * 12}%`);
      this.actors.appendChild(f);
    }
    for (let i = 0; i < robots; i++) {
      const w = el('div', 'walker robot', `<div class="walker-inner">${GEN_ICONS[5]}</div>`);
      w.style.setProperty('--dur', `${16 + i * 4}s`);
      w.style.setProperty('--delay', `${-i * 6}s`);
      w.style.setProperty('--y', `${1 + i * 4}%`);
      w.style.setProperty('--scale', '1');
      this.actors.appendChild(w);
    }
  }

  spawnHero() {
    const h = el('button', 'hero-flyby', HERO_FLYING);
    h.setAttribute('aria-label', 'Captain Righteous! Tap him!');
    h.style.setProperty('--top', `${14 + Math.random() * 30}%`);
    const reverse = Math.random() < 0.5;
    if (reverse) h.classList.add('reverse');
    let caught = false;
    h.addEventListener('pointerdown', (e) => {
      if (caught) return;
      caught = true;
      h.classList.add('caught');
      this.app.heroFoiled(e.clientX, e.clientY);
      setTimeout(() => h.remove(), 700);
      this.app.heroActive = false;
    });
    h.addEventListener('animationend', (e) => {
      if (e.animationName.startsWith('hero-fly') && !caught) {
        h.remove();
        this.app.heroActive = false;
      }
    });
    this.el.appendChild(h);
  }

  update() {
    const s = this.app.s;
    const now = Date.now();
    this.updateActors();
    const boost = E.boostRemaining(s, now);
    const boostChip = this.chips.children[0] as HTMLElement;
    toggle(boostChip, 'on', boost > 0);
    if (boost > 0) setText(boostChip.querySelector('b'), fmtTime(boost));
    const frenzyChip = this.chips.children[1] as HTMLElement;
    const fr = E.isFrenzy(s, now);
    toggle(frenzyChip, 'on', fr);
    if (fr) setText(frenzyChip.querySelector('b'), fmtTime((s.frenzyUntil - now) / 1000));
    toggle(this.el, 'frenzy', fr);
    toggle(this.hint, 'show', s.stats.taps < 15);
    toggle(this.el.querySelector('.side-daily'), 'ready', E.dailyAvailable(s, now));
    const chestReady = E.freeChestReady(s, now);
    toggle(this.el.querySelector('.side-chest'), 'ready', chestReady);
    setText(this.el.querySelector('.side-chest-t'), chestReady ? 'Free!' : fmtTime((s.freeChestAt - now) / 1000));
    toggle(this.el.querySelector('.side-boost'), 'maxed', !E.canAddAdBoost(s, now));
  }
}

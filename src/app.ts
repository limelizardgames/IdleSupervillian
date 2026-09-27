import { checkAchievements } from './game/achievements';
import {
  AD_BOOST_SECONDS, AD_GEMS_REWARD, CHESTS, DAILY_REWARDS, DEVICE_BY_ID, GEM_ITEMS, GENERATORS, IAP_GEMS, IAP_PRODUCTS,
  LAIRS, type ChestType,
} from './game/data';
import * as E from './game/engine';
import { fmt, fmtMoney, fmtTime } from './game/format';
import type { GameState } from './game/state';
import { DEFEAT_QUIPS, FLAVOR, STORY_BY_ID, pendingTriggeredBeat, type StoryBeat } from './game/story';
import { ads } from './services/ads';
import { audio } from './services/audio';
import { buzz, setHaptics } from './services/haptics';
import { iap } from './services/iap';
import { saves } from './services/save';
import { CHEST_ICONS, GEM_ICON } from './art/icons';
import { playDialog } from './ui/dialog';
import { celebrate, coinBurst, comicBurst, floatText, quip, toast } from './ui/fx';
import { modalOpen, showModal, simpleModal } from './ui/modals';
import { el } from './ui/dom';
import type { Scene } from './ui/scene';
import type { TopBar } from './ui/topbar';
import type { Tabs } from './ui/tabs';

const AUTOSAVE_MS = 15000;

export class App {
  scene!: Scene;
  topbar!: TopBar;
  tabs!: Tabs;

  private lastUi = 0;
  private lastSecond = 0;
  private lastSave = Date.now();
  private nextHeroAt = Date.now() + 60_000;
  private nextQuipAt = Date.now() + 90_000;
  private storyBusy = false;
  private chestsSinceInterstitial = 0;
  heroActive = false;

  constructor(public s: GameState) {
    audio.enabled = s.settings.sound;
    setHaptics(s.settings.haptics);
  }

  // -------------------------------------------------------------------------
  // Main loop
  // -------------------------------------------------------------------------

  start() {
    const frame = () => {
      this.frame();
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) this.save();
    });
    window.addEventListener('pagehide', () => this.save());
  }

  private frame() {
    const now = Date.now();
    const s = this.s;
    const dt = (now - s.lastTick) / 1000;
    if (dt > 60) {
      this.showOffline(now);
    } else if (dt > 0) {
      E.tick(s, dt, now);
    }

    const done = E.completeBuilds(s, now);
    for (const id of done) this.onDeviceBuilt(id);

    if (now - this.lastSecond >= 1000) {
      this.lastSecond = now;
      this.everySecond(now);
    }
    if (now - this.lastUi >= 100) {
      this.lastUi = now;
      this.topbar.update();
      this.tabs.update();
      this.scene.update();
    }
    if (now - this.lastSave >= AUTOSAVE_MS) this.save();
  }

  private everySecond(now: number) {
    const s = this.s;
    for (const a of checkAchievements(s)) {
      audio.play('fanfare');
      toast(`<span class="toast-icon">${a.icon}</span><div><b>Achievement!</b> ${a.name}<br><small>+${a.gems} gems</small></div>`, 'toast-ach', 3500);
      this.refresh();
    }
    if (!this.storyBusy && !modalOpen()) {
      const beat = pendingTriggeredBeat(s);
      if (beat) this.playBeat(beat);
      else if (s.lair >= 1 && !s.story['hero_intro'] && s.story['lair_1']) this.playBeat(STORY_BY_ID['hero_intro']);
    }
    // Hero fly-by events
    if (s.story['hero_intro'] && !this.heroActive && now >= this.nextHeroAt && !modalOpen()) {
      this.heroActive = true;
      this.scene.spawnHero();
      this.nextHeroAt = now + (100 + Math.random() * 140) * 1000;
    }
    // Flavor quips
    if (now >= this.nextQuipAt && !modalOpen() && s.story['intro']) {
      this.nextQuipAt = now + (120 + Math.random() * 180) * 1000;
      const pool = FLAVOR.filter((l) => (l.who === 'snivel' ? s.lair >= 2 : l.who === 'hero' ? s.lair >= 1 : true));
      const line = pool[Math.floor(Math.random() * pool.length)];
      quip(line, line.who === 'villain' ? s.villainName : undefined);
    }
    // Keep web banner ad fresh.
    if (Math.floor(now / 1000) % 45 === 0) ads.refreshBanner();
  }

  save() {
    this.lastSave = Date.now();
    saves.save(this.s);
  }

  /** Forces the active tab to rebuild (for structural changes). */
  refresh() {
    this.tabs.dirty = true;
  }

  // -------------------------------------------------------------------------
  // Story
  // -------------------------------------------------------------------------

  async playBeat(beat: StoryBeat) {
    if (this.s.story[beat.id]) return;
    this.s.story[beat.id] = true;
    this.storyBusy = true;
    await playDialog(this.s, beat.lines, beat.title);
    this.storyBusy = false;
    this.save();
  }

  // -------------------------------------------------------------------------
  // Offline earnings
  // -------------------------------------------------------------------------

  showOffline(now = Date.now()) {
    const s = this.s;
    const rep = E.computeOffline(s, now);
    s.lastTick = now;
    E.completeBuilds(s, now);
    if (rep.earned <= 0 || rep.seconds < 60) return;
    const capped = rep.cappedSeconds < rep.seconds;
    showModal((close) => {
      const w = el('div', 'offline');
      w.innerHTML = `
        <div class="modal-title">Welcome Back, ${this.s.villainName || 'Boss'}!</div>
        <div class="offline-kevin">While you were away for <b>${fmtTime(rep.seconds)}</b>, your minions schemed tirelessly...</div>
        <div class="big-reward">${fmtMoney(rep.earned)}</div>
        ${capped ? `<div class="muted small">Offline earnings capped at ${fmtTime(rep.cappedSeconds)}. Upgrade with Legacy perks!</div>` : ''}
        <div class="modal-buttons">
          <button class="btn btn-ghost" data-a="collect">Collect</button>
          <button class="btn btn-ad" data-a="ad"><span class="ad-icon">▶</span> Collect x2</button>
        </div>`;
      w.addEventListener('click', async (e) => {
        const a = (e.target as HTMLElement).closest<HTMLElement>('[data-a]')?.dataset.a;
        if (!a) return;
        if (a === 'collect') {
          E.earn(s, rep.earned);
          close();
          this.rewardFx(rep.earned);
          ads.maybeInterstitial();
        } else if (a === 'ad') {
          if (await this.watchAd()) {
            E.earn(s, rep.earned * 2);
            close();
            this.rewardFx(rep.earned * 2);
          }
        }
      });
      return w;
    }, { dismissable: false, urgent: true });
  }

  // -------------------------------------------------------------------------
  // Player actions
  // -------------------------------------------------------------------------

  tap(x: number, y: number) {
    const v = E.tap(this.s);
    audio.play('tap');
    buzz('light');
    floatText(x, y, '+' + fmtMoney(v));
    if (Math.random() < 0.35) coinBurst(x, y, 2);
  }

  buyGen(i: number) {
    const s = this.s;
    const n = E.buyAmount(s, i, s.settings.buyMode);
    const before = s.gens[i];
    if (!E.buyGen(s, i, n)) {
      audio.play('error');
      return false;
    }
    audio.play('buy');
    buzz('light');
    const crossed = E.nextMilestone(before);
    if (crossed !== null && s.gens[i] >= crossed) {
      audio.play('upgrade');
      toast(`<span class="toast-icon">⭐</span><div><b>${GENERATORS[i].name} x2!</b><br><small>Reached ${crossed} owned</small></div>`, 'toast-gold');
    }
    if (before === 0) this.refresh();
    return true;
  }

  buyUpgrade(id: string) {
    if (!E.buyUpgrade(this.s, id)) {
      audio.play('error');
      return false;
    }
    audio.play('upgrade');
    buzz('medium');
    this.refresh();
    return true;
  }

  buyAllUpgrades() {
    let n = 0;
    for (const u of E.visibleUpgrades(this.s)) if (E.buyUpgrade(this.s, u.id)) n++;
    if (n) {
      audio.play('upgrade');
      toast(`<span class="toast-icon">⬆️</span><div>Bought <b>${n}</b> upgrade${n > 1 ? 's' : ''}!</div>`);
      this.refresh();
    } else audio.play('error');
  }

  async moveLair() {
    const s = this.s;
    if (!E.moveLair(s)) {
      audio.play('error');
      return;
    }
    audio.play('fanfare');
    buzz('heavy');
    celebrate();
    this.scene.setLair(s.lair);
    this.refresh();
    this.save();
    await this.playBeat(STORY_BY_ID[LAIRS[s.lair].story]);
    ads.maybeInterstitial();
  }

  startDevice(id: string) {
    if (!E.startDevice(this.s, id)) {
      audio.play('error');
      return;
    }
    audio.play('build');
    this.refresh();
    this.save();
  }

  private onDeviceBuilt(id: string) {
    const d = DEVICE_BY_ID[id];
    audio.play('fanfare');
    buzz('heavy');
    toast(`<span class="toast-icon">${d.icon}</span><div><b>${d.name}</b> complete!<br><small>${effectLabel(d.effect)}</small></div>`, 'toast-gold', 4000);
    this.refresh();
    this.save();
  }

  async adSkipDevice(id: string) {
    if (await this.watchAd('device')) {
      E.skipBuild(this.s, id, E.AD_DEVICE_SKIP);
      toast('<span class="toast-icon">⏩</span><div>Construction sped up by <b>30 minutes</b>!</div>');
      this.refresh();
    }
  }

  gemFinishDevice(id: string) {
    if (!E.finishWithGems(this.s, id)) {
      this.notEnoughGems();
      return;
    }
    this.refresh();
  }

  notEnoughGems() {
    audio.play('error');
    simpleModal('Not Enough Gems', `<p>You need more ${GEM_ICON_INLINE} Doom Gems.</p><p class="muted">Earn them from chests, achievements, daily rewards and ads — or grab a pack in the Shop.</p>`, [
      { label: 'OK', cls: 'btn-ghost' },
      { label: 'Visit Shop', cls: 'btn-primary', onClick: () => this.tabs.show('shop') },
    ]);
  }

  /** Shows a rewarded ad (or instantly succeeds with Remove Ads). */
  async watchAd(placement?: string): Promise<boolean> {
    if (placement && !E.adReady(this.s, placement)) return false;
    audio.setMuted(true);
    const ok = await ads.rewarded();
    audio.setMuted(false);
    if (ok) {
      if (placement) E.markAdUsed(this.s, placement);
      else this.s.stats.adsWatched++;
      this.save();
    } else {
      toast('<span class="toast-icon">📺</span><div>No ad available right now. Try again soon!</div>');
    }
    return ok;
  }

  async adBoost() {
    if (!E.canAddAdBoost(this.s)) {
      toast('<span class="toast-icon">⚡</span><div>Boost is already maxed at 12 hours!</div>');
      return;
    }
    if (await this.watchAd('boost')) {
      E.applyAdBoost(this.s);
      audio.play('upgrade');
      celebrate();
      toast(`<span class="toast-icon">⚡</span><div><b>x2 INCOME</b> for ${fmtTime(AD_BOOST_SECONDS)} more!</div>`, 'toast-gold');
    }
  }

  async adGems() {
    if (await this.watchAd('gems')) {
      this.s.gems += AD_GEMS_REWARD;
      audio.play('coin');
      toast(`<span class="toast-icon">${GEM_ICON_INLINE}</span><div>+${AD_GEMS_REWARD} Doom Gems!</div>`);
      this.refresh();
    }
  }

  async adChest() {
    if (await this.watchAd('chest')) {
      this.s.chests.rare++;
      this.refresh();
      this.openChest('rare');
    }
  }

  claimFreeChest() {
    if (E.claimFreeChest(this.s)) {
      audio.play('coin');
      this.refresh();
      this.openChest('common');
    }
  }

  openChest(type: ChestType) {
    const r = E.openChest(this.s, type);
    if (!r) return;
    audio.play('chest');
    buzz('heavy');
    this.refresh();
    this.save();
    const c = CHESTS[type];
    showModal((close) => {
      const w = el('div', 'chest-open');
      w.innerHTML = `
        <div class="modal-title">${c.name}!</div>
        <div class="chest-anim chest-${type}"><div class="chest-rays"></div>${CHEST_ICONS[type]}</div>
        <div class="loot">
          <div class="loot-item" style="--d:0.5s"><span class="li-icon">💵</span><span>${fmtMoney(r.funds)}</span></div>
          ${r.gems ? `<div class="loot-item" style="--d:0.8s"><span class="li-icon">${GEM_ICON_INLINE}</span><span>+${r.gems} Gems</span></div>` : ''}
          ${r.boostSeconds ? `<div class="loot-item" style="--d:1.1s"><span class="li-icon">⚡</span><span>x2 Boost ${fmtTime(r.boostSeconds)}</span></div>` : ''}
        </div>
        <div class="modal-buttons"><button class="btn btn-primary">Awesome!</button></div>`;
      w.querySelector('button')!.addEventListener('click', () => {
        close();
        if (++this.chestsSinceInterstitial >= 3) {
          this.chestsSinceInterstitial = 0;
          ads.maybeInterstitial();
        }
      });
      return w;
    }, { cls: 'modal-chest' });
  }

  buyGemItem(id: string) {
    const item = GEM_ITEMS.find((g) => g.id === id)!;
    if (this.s.gems < item.cost) {
      this.notEnoughGems();
      return;
    }
    const before = this.s.funds;
    if (!E.buyGemItem(this.s, id)) {
      audio.play('error');
      return;
    }
    audio.play('coin');
    if (id.startsWith('warp')) this.rewardFx(this.s.funds - before);
    else if (id.startsWith('chest')) this.openChest(id === 'chest_epic' ? 'epic' : 'rare');
    else toast(`<span class="toast-icon">${item.icon}</span><div><b>${item.name}</b> activated!</div>`, 'toast-gold');
    this.refresh();
    this.save();
  }

  async buyIap(productId: string) {
    const ok = await iap.buy(productId);
    if (!ok) return;
    this.refresh();
    this.save();
  }

  /** Grants the goods for a completed store purchase (idempotent for non-consumables). */
  grantIap(productId: string) {
    const s = this.s;
    const p = IAP_PRODUCTS.find((x) => x.id === productId);
    if (!p) return;
    if (IAP_GEMS[productId]) {
      s.gems += IAP_GEMS[productId];
    } else if (productId === 'remove_ads') {
      if (s.purchases.removeAds) return;
      s.purchases.removeAds = true;
      s.gems += 50;
      ads.setAdsRemoved(true);
    } else if (productId === 'doubler') {
      if (s.purchases.doubler) return;
      s.purchases.doubler = true;
    } else if (productId === 'starter_pack') {
      if (s.purchases.starterPack) return;
      s.purchases.starterPack = true;
      s.gems += 200;
      s.chests.epic += 2;
      E.addBoost(s, 24 * 3600, Date.now(), 48 * 3600);
    }
    audio.play('fanfare');
    celebrate();
    toast(`<span class="toast-icon">${p.icon}</span><div><b>${p.name}</b><br><small>Thank you for supporting evil!</small></div>`, 'toast-gold', 4000);
    this.refresh();
    this.save();
  }

  async restorePurchases() {
    await iap.restore();
    toast('<span class="toast-icon">🔄</span><div>Purchases restored.</div>');
  }

  claimDaily() {
    const res = E.claimDaily(this.s);
    if (!res) return;
    audio.play('chest');
    celebrate();
    toast(`<span class="toast-icon">📅</span><div><b>Day ${res.idx + 1}:</b> ${res.reward.label}!</div>`, 'toast-gold');
    this.refresh();
    this.save();
  }

  // Hero fly-by -------------------------------------------------------------

  heroFoiled(x: number, y: number) {
    const s = this.s;
    s.stats.heroesFoiled++;
    audio.play('hero');
    buzz('heavy');
    comicBurst(x, y, ['POW!', 'BAM!', 'ZAP!', 'KA-BOOM!', 'WHAM!'][Math.floor(Math.random() * 5)]);
    const heroMult = Object.keys(s.devices).includes('hero_trap') ? 3 : 1;
    const roll = Math.random();
    if (roll < 0.3) {
      E.startFrenzy(s, 7, 20);
      toast('<span class="toast-icon">🔥</span><div><b>EVIL FRENZY!</b><br><small>x7 income for 20 seconds!</small></div>', 'toast-red', 3000);
    } else if (roll < 0.4) {
      const g = 2 * heroMult;
      s.gems += g;
      toast(`<span class="toast-icon">${GEM_ICON_INLINE}</span><div>Captain Righteous dropped <b>${g} gems</b>!</div>`, 'toast-gold');
    } else {
      const amount = E.incomeReward(s, 150, 25) * heroMult;
      E.earn(s, amount);
      coinBurst(x, y, 10);
      floatText(x, y - 30, '+' + fmtMoney(amount), 'big');
      toast(`<span class="toast-icon">🦸</span><div>You swiped the hero's lunch money!<br><b>+${fmtMoney(amount)}</b></div>`, '', 3000);
      if (Math.random() < 0.5) this.offerHeroDouble(amount);
    }
  }

  private offerHeroDouble(amount: number) {
    const t = el('div', 'toast toast-offer');
    t.innerHTML = `<span class="toast-icon">📺</span><div>Double the loot? <b>+${fmtMoney(amount)}</b></div><button class="btn btn-ad btn-small">▶ Watch</button>`;
    document.getElementById('toasts')!.appendChild(t);
    const kill = setTimeout(() => t.remove(), 7000);
    t.querySelector('button')!.addEventListener('click', async () => {
      clearTimeout(kill);
      t.remove();
      if (await this.watchAd()) {
        E.earn(this.s, amount);
        this.rewardFx(amount);
      }
    });
  }

  // Prestige ---------------------------------------------------------------

  async prestige(withAd: boolean) {
    const s = this.s;
    if (!E.canPrestige(s)) return;
    let bonus = 0;
    if (withAd) {
      if (!(await this.watchAd())) return;
      bonus = 0.25;
    }
    const first = s.prestiges === 0;
    const gained = E.prestige(s, bonus);
    audio.play('fanfare');
    celebrate();
    this.scene.setLair(0);
    this.refresh();
    this.save();
    toast(`<span class="toast-icon">😈</span><div><b>+${fmt(gained)} Infamy</b><br><small>Your next empire earns +${fmt(gained * E.infamyBonusPerPoint(s) * 100)}% more!</small></div>`, 'toast-gold', 5000);
    if (first) {
      await this.playBeat(STORY_BY_ID['defeat_1']);
    } else {
      await playDialog(s, DEFEAT_QUIPS[Math.floor(Math.random() * DEFEAT_QUIPS.length)], 'Defeated Again!');
    }
    ads.maybeInterstitial();
  }

  buyPerk(id: string) {
    if (!E.buyPerk(this.s, id)) {
      audio.play('error');
      return;
    }
    audio.play('upgrade');
    this.refresh();
    this.save();
  }

  // Helpers ---------------------------------------------------------------

  rewardFx(amount: number) {
    const r = this.scene.el.getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = r.top + r.height / 2;
    coinBurst(x, y, 14);
    floatText(x, y, '+' + fmtMoney(amount), 'big');
    audio.play('coin');
  }

  dailyRewards() {
    return DAILY_REWARDS;
  }
}

export const GEM_ICON_INLINE = `<span class="inline-icon">${GEM_ICON}</span>`;

export function effectLabel(e: { kind: string; mult: number }): string {
  switch (e.kind) {
    case 'all': return `All income x${e.mult}`;
    case 'tap': return `Evil Laugh x${e.mult}`;
    case 'offline': return `Offline earnings x${e.mult}`;
    case 'hero': return `Hero loot x${e.mult}`;
    default: return '';
  }
}

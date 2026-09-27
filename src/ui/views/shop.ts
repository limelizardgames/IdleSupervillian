import { GEM_ICON_INLINE, type App } from '../../app';
import { UI_ICONS } from '../../art/ui-icons';
import { CHEST_ICONS } from '../../art/icons';
import { AD_GEMS_REWARD, CHESTS, GEM_ITEMS, IAP_PRODUCTS, type ChestType } from '../../game/data';
import * as E from '../../game/engine';
import { fmtTime } from '../../game/format';
import { iap } from '../../services/iap';
import { el, esc, setText, toggle } from '../dom';
import type { View } from '../tabs';

const TYPES: ChestType[] = ['common', 'rare', 'epic'];

export class ShopView implements View {
  id = 'shop';
  label = 'Shop';
  icon = UI_ICONS.shop;
  el = el('div', 'view view-shop');

  constructor(private app: App) {
    this.el.addEventListener('click', (e) => {
      const b = (e.target as HTMLElement).closest<HTMLElement>('[data-act]');
      if (!b) return;
      const id = b.dataset.id ?? '';
      switch (b.dataset.act) {
        case 'open': this.app.openChest(id as ChestType); break;
        case 'free': this.app.claimFreeChest(); break;
        case 'adchest': this.app.adChest(); break;
        case 'adgems': this.app.adGems(); break;
        case 'adboost': this.app.adBoost(); break;
        case 'gem': this.app.buyGemItem(id); break;
        case 'iap': this.app.buyIap(id); break;
        case 'restore': this.app.restorePurchases(); break;
      }
    });
  }

  key() {
    const s = this.app.s;
    return `${s.chests.common}${s.chests.rare}${s.chests.epic}|${JSON.stringify(s.purchases)}|${s.buildSlots}`;
  }

  render() {
    const s = this.app.s;
    const noAds = s.purchases.removeAds;
    this.el.innerHTML = `
      <div class="section-title">Loot Chests</div>
      <div class="chest-grid">
        ${TYPES.map((t) => `
          <div class="card chest-card chest-${t}">
            <div class="chest-icon">${CHEST_ICONS[t]}<span class="chest-count">${s.chests[t]}</span></div>
            <div class="chest-name">${CHESTS[t].name}</div>
            <button class="btn btn-small ${s.chests[t] ? 'btn-primary' : 'btn-ghost'}" data-act="open" data-id="${t}" ${s.chests[t] ? '' : 'disabled'}>Open</button>
          </div>`).join('')}
      </div>
      <div class="section-title">Free Stuff ${noAds ? '<small class="green">(Ads removed — instant rewards!)</small>' : ''}</div>
      <div class="card free-row"><div class="fr-icon">🎁</div><div class="fr-info"><b>Free Evil Lunchbox</b><div class="fr-sub free-t"></div></div><button class="btn btn-primary btn-small" data-act="free">Claim</button></div>
      <div class="card free-row"><div class="fr-icon">💼</div><div class="fr-info"><b>Free Secret Briefcase</b><div class="fr-sub adchest-t">Watch a short ad</div></div><button class="btn btn-ad btn-small" data-act="adchest">▶ ${noAds ? 'Claim' : 'Watch'}</button></div>
      <div class="card free-row"><div class="fr-icon">${GEM_ICON_INLINE}</div><div class="fr-info"><b>+${AD_GEMS_REWARD} Doom Gems</b><div class="fr-sub adgems-t">Watch a short ad</div></div><button class="btn btn-ad btn-small" data-act="adgems">▶ ${noAds ? 'Claim' : 'Watch'}</button></div>
      <div class="card free-row"><div class="fr-icon">⚡</div><div class="fr-info"><b>x2 Income for 2 hours</b><div class="fr-sub adboost-t">Stacks up to 12 hours</div></div><button class="btn btn-ad btn-small" data-act="adboost">▶ ${noAds ? 'Claim' : 'Watch'}</button></div>

      <div class="section-title">Gem Shop</div>
      ${GEM_ITEMS.filter((g) => !(g.id === 'build_slot' && s.buildSlots >= 2)).map((g) => `
        <div class="card gem-row"><div class="fr-icon">${g.icon}</div><div class="fr-info"><b>${esc(g.name)}</b><div class="fr-sub">${esc(g.desc)}</div></div>
        <button class="btn btn-gem btn-small" data-act="gem" data-id="${g.id}">${GEM_ICON_INLINE} ${g.cost}</button></div>`).join('')}

      <div class="section-title">Premium</div>
      ${IAP_PRODUCTS.map((p) => {
        const owned = (p.id === 'remove_ads' && s.purchases.removeAds) || (p.id === 'doubler' && s.purchases.doubler) || (p.id === 'starter_pack' && s.purchases.starterPack);
        return `<div class="card iap-row ${p.badge ? 'featured' : ''} ${owned ? 'owned' : ''}">
          ${p.badge && !owned ? `<span class="iap-badge">${p.badge}</span>` : ''}
          <div class="fr-icon big">${p.icon}</div>
          <div class="fr-info"><b>${esc(p.name)}</b><div class="fr-sub">${esc(p.desc)}</div></div>
          ${owned ? '<span class="badge-active">OWNED</span>' : `<button class="btn btn-money btn-small" data-act="iap" data-id="${p.id}">${esc(iap.displayPrice(p))}</button>`}
        </div>`;
      }).join('')}
      <button class="btn btn-ghost btn-block" data-act="restore">Restore Purchases</button>
      <div class="fine-print">Web build uses a test store — no real charges. Real purchases run through the App Store / Google Play on device.</div>`;
  }

  update() {
    const s = this.app.s;
    const now = Date.now();
    const free = E.freeChestReady(s, now);
    setText(this.el.querySelector('.free-t'), free ? 'Ready to claim!' : `Next in ${fmtTime((s.freeChestAt - now) / 1000)}`);
    const fb = this.el.querySelector<HTMLButtonElement>('[data-act="free"]');
    if (fb) fb.disabled = !free;
    for (const [act, placement, label] of [['adchest', 'chest', 'Watch a short ad'], ['adgems', 'gems', 'Watch a short ad']] as const) {
      const ready = E.adReady(s, placement, now);
      const b = this.el.querySelector<HTMLButtonElement>(`[data-act="${act}"]`);
      if (b) b.disabled = !ready;
      setText(this.el.querySelector(`.${act}-t`), ready ? label : `Available in ${fmtTime(E.adCooldownLeft(s, placement, now))}`);
    }
    const bb = this.el.querySelector<HTMLButtonElement>('[data-act="adboost"]');
    if (bb) bb.disabled = !E.canAddAdBoost(s, now);
    const boost = E.boostRemaining(s, now);
    setText(this.el.querySelector('.adboost-t'), boost > 0 ? `Active: ${fmtTime(boost)} left (max 12h)` : 'Stacks up to 12 hours');
    for (const b of this.el.querySelectorAll<HTMLElement>('[data-act="gem"]')) {
      const item = GEM_ITEMS.find((g) => g.id === b.dataset.id);
      toggle(b, 'afford', !!item && s.gems >= item.cost);
    }
  }

  badge() {
    const s = this.app.s;
    return E.freeChestReady(s) || s.chests.common + s.chests.rare + s.chests.epic > 0;
  }
}

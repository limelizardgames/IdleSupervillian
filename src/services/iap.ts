import { Capacitor } from '@capacitor/core';
import { IAP_PRODUCTS, type IapProduct } from '../game/data';

/**
 * In-app purchase abstraction.
 * - Web / dev: MockIapProvider (confirm dialog, instant success) so the whole
 *   purchase flow can be tested in a browser.
 * - Native: StoreKit / Google Play Billing via `cordova-plugin-purchase`
 *   (CdvPurchase global). Install it with:
 *     npm i cordova-plugin-purchase && npx cap sync
 *   Product IDs in data.ts must match App Store Connect / Play Console.
 *
 * Tip: when you add login, validate receipts server-side (or switch the
 * provider to RevenueCat) and store entitlements on the account.
 */
export interface IapProvider {
  init(onOwned: (productId: string) => void): Promise<void>;
  price(productId: string): string | null;
  purchase(productId: string): Promise<boolean>;
  restore(): Promise<void>;
}

class MockIapProvider implements IapProvider {
  async init() {}
  price() { return null; }
  async purchase(productId: string) {
    const p = IAP_PRODUCTS.find((x) => x.id === productId);
    return window.confirm(`[TEST STORE]\n\nBuy "${p?.name}" for ${p?.fallbackPrice}?\n\n(No real money is charged in the web build.)`);
  }
  async restore() {}
}

/* eslint-disable @typescript-eslint/no-explicit-any */
class CdvPurchaseProvider implements IapProvider {
  private store: any;
  private pending = new Map<string, (ok: boolean) => void>();

  async init(onOwned: (productId: string) => void) {
    const CdvPurchase = (window as any).CdvPurchase;
    if (!CdvPurchase) {
      console.warn('cordova-plugin-purchase not installed; purchases disabled.');
      return;
    }
    const { store, ProductType, Platform } = CdvPurchase;
    this.store = store;
    const platform = Capacitor.getPlatform() === 'ios' ? Platform.APPLE_APPSTORE : Platform.GOOGLE_PLAY;
    store.register(IAP_PRODUCTS.map((p) => ({
      id: p.id,
      type: p.consumable ? ProductType.CONSUMABLE : ProductType.NON_CONSUMABLE,
      platform,
    })));
    store.when()
      .approved((tx: any) => tx.verify())
      .verified((receipt: any) => receipt.finish())
      .finished((tx: any) => {
        for (const p of tx.products ?? []) {
          onOwned(p.id);
          this.pending.get(p.id)?.(true);
          this.pending.delete(p.id);
        }
      });
    store.error((err: any) => {
      console.warn('IAP error', err);
      for (const [id, cb] of this.pending) { cb(false); this.pending.delete(id); }
    });
    await store.initialize([platform]);
  }

  price(productId: string): string | null {
    return this.store?.get(productId)?.pricing?.price ?? null;
  }

  purchase(productId: string): Promise<boolean> {
    const offer = this.store?.get(productId)?.getOffer();
    if (!offer) return Promise.resolve(false);
    return new Promise((resolve) => {
      this.pending.set(productId, resolve);
      offer.order().then((err: any) => {
        if (err) { this.pending.delete(productId); resolve(false); }
      });
    });
  }

  async restore() {
    await this.store?.restorePurchases();
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export class IapService {
  private provider: IapProvider = Capacitor.isNativePlatform() ? new CdvPurchaseProvider() : new MockIapProvider();
  /** Invoked for each purchased/restored product; the game grants the goods. */
  onGrant: (productId: string) => void = () => {};

  async init() {
    try {
      await this.provider.init((id) => this.onGrant(id));
    } catch (e) {
      console.warn('IAP init failed', e);
    }
  }

  displayPrice(p: IapProduct) {
    return this.provider.price(p.id) ?? p.fallbackPrice;
  }

  async buy(productId: string): Promise<boolean> {
    const ok = await this.provider.purchase(productId);
    // Native purchases are granted via the store's `finished` callback;
    // the mock grants immediately.
    if (ok && !Capacitor.isNativePlatform()) this.onGrant(productId);
    return ok;
  }

  restore() {
    return this.provider.restore();
  }
}

export const iap = new IapService();

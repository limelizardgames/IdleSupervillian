import { Capacitor } from '@capacitor/core';
import { AD_UNITS, INTERSTITIAL_LAUNCH_GRACE, INTERSTITIAL_MIN_GAP, USE_TEST_ADS } from './config';

/**
 * Abstraction over the ad network so the game never talks to AdMob directly.
 * - Web / dev builds use MockAdProvider (a fake in-game "ad" with a countdown).
 * - Native builds (Capacitor iOS/Android) use AdMobProvider.
 */
export interface AdProvider {
  init(): Promise<void>;
  showBanner(): Promise<void>;
  hideBanner(): Promise<void>;
  showInterstitial(): Promise<void>;
  /** Resolves true if the user watched the ad to completion and earned the reward. */
  showRewarded(): Promise<boolean>;
}

// ---------------------------------------------------------------------------
// Mock provider (browser / development)
// ---------------------------------------------------------------------------

const MOCK_ADS = [
  { title: 'CAPES R US', line: 'Dramatic billowing, guaranteed. Now 20% less likely to get caught in jet engines.', emoji: '🦸' },
  { title: 'LAIRBNB', line: 'Rent a volcano for the weekend! Lava not included (it is, actually).', emoji: '🌋' },
  { title: 'HENCH-FIT', line: 'Get henchman-ready in 30 days. Now with complimentary ski mask!', emoji: '💪' },
  { title: 'MONOLOGUE MASTERCLASS', line: 'Learn to explain your entire plan to the hero, beautifully.', emoji: '🎭' },
  { title: 'SHARK LASERS DIRECT', line: 'Why settle for regular sharks? Ask about our bulk pricing.', emoji: '🦈' },
];

class MockAdProvider implements AdProvider {
  private bannerEl: HTMLElement | null = null;

  async init() {}

  async showBanner() {
    const slot = document.getElementById('ad-banner');
    if (!slot) return;
    slot.classList.add('visible');
    if (!this.bannerEl) {
      this.bannerEl = document.createElement('div');
      this.bannerEl.className = 'mock-banner';
      slot.appendChild(this.bannerEl);
    }
    const ad = MOCK_ADS[Math.floor(Math.random() * MOCK_ADS.length)];
    this.bannerEl.innerHTML = `<span class="mb-tag">AD</span><span class="mb-emoji">${ad.emoji}</span><span class="mb-text"><b>${ad.title}</b> ${ad.line}</span>`;
  }

  async hideBanner() {
    document.getElementById('ad-banner')?.classList.remove('visible');
  }

  showInterstitial(): Promise<void> {
    return this.fullscreen(3, false).then(() => undefined);
  }

  showRewarded(): Promise<boolean> {
    return this.fullscreen(5, true);
  }

  private fullscreen(seconds: number, rewarded: boolean): Promise<boolean> {
    return new Promise((resolve) => {
      const ad = MOCK_ADS[Math.floor(Math.random() * MOCK_ADS.length)];
      const el = document.createElement('div');
      el.className = 'mock-ad';
      el.innerHTML = `
        <div class="mock-ad-top"><span class="mb-tag">${rewarded ? 'REWARDED AD' : 'AD'} · TEST</span><button class="mock-ad-close" disabled>${seconds}</button></div>
        <div class="mock-ad-body">
          <div class="mock-ad-emoji">${ad.emoji}</div>
          <div class="mock-ad-title">${ad.title}</div>
          <div class="mock-ad-line">${ad.line}</div>
          <div class="mock-ad-bar"><div></div></div>
          <div class="mock-ad-note">This is a placeholder. Real AdMob ads show on iOS/Android builds.</div>
        </div>`;
      document.body.appendChild(el);
      const btn = el.querySelector<HTMLButtonElement>('.mock-ad-close')!;
      const bar = el.querySelector<HTMLDivElement>('.mock-ad-bar > div')!;
      let left = seconds;
      requestAnimationFrame(() => {
        bar.style.transition = `width ${seconds}s linear`;
        bar.style.width = '100%';
      });
      const timer = setInterval(() => {
        left--;
        if (left > 0) {
          btn.textContent = String(left);
        } else {
          clearInterval(timer);
          btn.disabled = false;
          btn.textContent = '✕';
        }
      }, 1000);
      btn.addEventListener('click', () => {
        if (left > 0) return;
        el.remove();
        resolve(true);
      });
    });
  }
}

// ---------------------------------------------------------------------------
// AdMob provider (native)
// ---------------------------------------------------------------------------

class AdMobProvider implements AdProvider {
  private mod!: typeof import('@capacitor-community/admob');
  private units = Capacitor.getPlatform() === 'ios' ? AD_UNITS.ios : AD_UNITS.android;
  private npa = false;

  async init() {
    this.mod = await import('@capacitor-community/admob');
    const { AdMob, AdmobConsentStatus } = this.mod;
    await AdMob.initialize({ initializeForTesting: USE_TEST_ADS });

    // iOS App Tracking Transparency prompt.
    if (Capacitor.getPlatform() === 'ios') {
      try {
        const { status } = await AdMob.trackingAuthorizationStatus();
        if (status === 'notDetermined') await AdMob.requestTrackingAuthorization();
      } catch { /* ignore */ }
    }

    // GDPR / UMP consent.
    try {
      const info = await AdMob.requestConsentInfo();
      if (info.isConsentFormAvailable && info.status === AdmobConsentStatus.REQUIRED) {
        const after = await AdMob.showConsentForm();
        this.npa = !after.canRequestAds;
      }
    } catch { /* consent failures shouldn't block the game */ }

    this.preloadInterstitial();
    this.preloadRewarded();
  }

  private interstitialReady = false;
  private rewardedReady = false;

  private async preloadInterstitial() {
    try {
      await this.mod.AdMob.prepareInterstitial({ adId: this.units.interstitial, isTesting: USE_TEST_ADS, npa: this.npa });
      this.interstitialReady = true;
    } catch { this.interstitialReady = false; }
  }

  private async preloadRewarded() {
    try {
      await this.mod.AdMob.prepareRewardVideoAd({ adId: this.units.rewarded, isTesting: USE_TEST_ADS, npa: this.npa });
      this.rewardedReady = true;
    } catch { this.rewardedReady = false; }
  }

  async showBanner() {
    const { AdMob, BannerAdSize, BannerAdPosition } = this.mod;
    await AdMob.showBanner({
      adId: this.units.banner,
      adSize: BannerAdSize.ADAPTIVE_BANNER,
      position: BannerAdPosition.BOTTOM_CENTER,
      margin: 64, // sit above the bottom navigation bar
      isTesting: USE_TEST_ADS,
      npa: this.npa,
    });
    document.getElementById('ad-banner')?.classList.add('visible', 'native');
  }

  async hideBanner() {
    try { await this.mod.AdMob.removeBanner(); } catch { /* ignore */ }
    document.getElementById('ad-banner')?.classList.remove('visible', 'native');
  }

  async showInterstitial() {
    if (!this.interstitialReady) { this.preloadInterstitial(); return; }
    this.interstitialReady = false;
    try { await this.mod.AdMob.showInterstitial(); } catch { /* ignore */ }
    this.preloadInterstitial();
  }

  async showRewarded(): Promise<boolean> {
    if (!this.rewardedReady) await this.preloadRewarded();
    if (!this.rewardedReady) return false;
    this.rewardedReady = false;
    try {
      const reward = await this.mod.AdMob.showRewardVideoAd();
      return !!reward;
    } catch {
      return false;
    } finally {
      this.preloadRewarded();
    }
  }
}

// ---------------------------------------------------------------------------
// AdService: game-facing facade with "remove ads" + frequency capping.
// ---------------------------------------------------------------------------

export class AdService {
  private provider: AdProvider;
  private lastInterstitial = Date.now();
  private launchedAt = Date.now();
  private ready = false;
  adsRemoved = false;
  /** Called while a fullscreen ad is showing, so the game can mute/pause. */
  onFullscreen: (showing: boolean) => void = () => {};

  constructor() {
    this.provider = Capacitor.isNativePlatform() ? new AdMobProvider() : new MockAdProvider();
  }

  async init(adsRemoved: boolean) {
    this.adsRemoved = adsRemoved;
    try {
      await this.provider.init();
      this.ready = true;
    } catch (e) {
      console.warn('Ad init failed', e);
    }
    if (!adsRemoved) this.provider.showBanner().catch(() => {});
  }

  setAdsRemoved(removed: boolean) {
    this.adsRemoved = removed;
    if (removed) this.provider.hideBanner().catch(() => {});
  }

  refreshBanner() {
    if (!this.adsRemoved && this.ready && !Capacitor.isNativePlatform()) this.provider.showBanner().catch(() => {});
  }

  /** Interstitial at a natural break. Silently skipped when capped or ads removed. */
  async maybeInterstitial() {
    if (this.adsRemoved || !this.ready) return;
    const now = Date.now();
    if (now - this.launchedAt < INTERSTITIAL_LAUNCH_GRACE * 1000) return;
    if (now - this.lastInterstitial < INTERSTITIAL_MIN_GAP * 1000) return;
    this.lastInterstitial = now;
    this.onFullscreen(true);
    try { await this.provider.showInterstitial(); } finally { this.onFullscreen(false); }
  }

  /**
   * Shows a rewarded ad. Players who bought "Remove Ads" get the reward
   * instantly without watching (a key selling point of the purchase).
   */
  async rewarded(): Promise<boolean> {
    if (this.adsRemoved) return true;
    if (!this.ready) return false;
    this.onFullscreen(true);
    try {
      return await this.provider.showRewarded();
    } finally {
      this.onFullscreen(false);
    }
  }
}

export const ads = new AdService();

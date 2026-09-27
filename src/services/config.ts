// ---------------------------------------------------------------------------
// Monetization configuration.
//
// The IDs below are Google's official *test* ad units — safe to ship in dev
// builds. Before releasing, replace them with your own AdMob ad unit IDs and
// set USE_TEST_ADS to false. (Also set your AdMob App ID in AndroidManifest.xml
// and Info.plist — see README.)
// ---------------------------------------------------------------------------

export const USE_TEST_ADS = true;

export const AD_UNITS = {
  android: {
    banner: 'ca-app-pub-3940256099942544/9214589741',
    interstitial: 'ca-app-pub-3940256099942544/1033173712',
    rewarded: 'ca-app-pub-3940256099942544/5224354917',
  },
  ios: {
    banner: 'ca-app-pub-3940256099942544/2435281174',
    interstitial: 'ca-app-pub-3940256099942544/4411468910',
    rewarded: 'ca-app-pub-3940256099942544/1712485313',
  },
};

/** Minimum seconds between interstitial ads, and grace period after launch. */
export const INTERSTITIAL_MIN_GAP = 5 * 60;
export const INTERSTITIAL_LAUNCH_GRACE = 3 * 60;

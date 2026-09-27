# Idle Supervillain 🦹

Start in your mother's basement with one henchman (Kevin). Earn evil funds, recruit minions, move to bigger lairs, build ridiculous doomsday devices, and eventually rule from a **Moon Base**. When the hero finally catches you, **Get Defeated** to start a new empire with permanent Infamy bonuses.

Built for phones and tablets with **Vite + TypeScript** (no framework) and wrapped for iOS/Android with **Capacitor**. All art is hand-built SVG, so there are no image assets to manage.

## Quick start

```bash
npm install
npm run dev        # open the printed URL on your phone (same Wi-Fi) or in desktop dev-tools mobile mode
npm test           # engine unit tests
npm run build      # production web build in dist/
```

Balance simulation (prints pacing for a greedy player): `SIM=1 npx vitest run tests/sim.test.ts`

Debug in the browser console: `game.s.funds = 1e12`.

## Game features

| Feature | Where |
|---|---|
| 10 operations (Henchmen → Lunar Doom Lasers), x2 milestones, buy x1/x10/x100/MAX, hold to repeat-buy | `Minions` tab |
| 5 lairs, each with its own animated scene: Basement → Warehouse → Volcano → Undersea → Moon | Scene + lair card |
| 38 upgrades (per-operation, tap power, global) | `Upgrades` tab |
| 10 timed Doomsday Devices (Freeze Ray … Mondays Forever Device) | `Doomsday` tab |
| Prestige ("Get Defeated by the Hero") → Infamy (+2% income each) + Grudges for 9 Legacy perks | `Hero` tab |
| Story chapters with a cast (You, Mom, Kevin, Captain Righteous, Professor Snivel), plus random quips | `src/game/story.ts` |
| Captain Righteous fly-bys: tap him for cash, gems, or a x7 Evil Frenzy | Scene |
| Chests, a free chest every 4h, a 7-day daily reward streak, 26 achievements, offline earnings | Shop / scene side buttons |

## Monetization

- **Banner ad** above the tab bar. Hidden once the player buys Remove Ads.
- **Interstitials**, only at natural breaks (after a lair move, a prestige, every 3rd chest, or the offline-earnings screen). They're limited to one every 5 minutes, with none in the first 3 minutes of a session.
- **Rewarded ads**: x2 income for 2h (stacks to 12h), 2x offline earnings, a free Secret Briefcase (20-minute cooldown), +5 gems (15-minute cooldown), -30 min on a device build, double the hero loot, and +25% Infamy on defeat.
- **Remove Ads** turns off banners and interstitials, and **rewarded bonuses become instant**, which is a strong reason to buy it.
- **IAP**: Starter Kit, Remove Ads, a permanent x2 income boost, and 4 gem packs (`IAP_PRODUCTS` in `src/game/data.ts`).
- **Gem sinks**: time warps, boosts, chests, finishing device builds, and a second build bay.

On the web, ads and purchases are **simulated** (a fake video ad with a countdown and a confirm-dialog store), so the whole loop can be tested in a browser.

## Shipping to iOS / Android

```bash
npm run build
npx cap add android      # and/or: npx cap add ios
npx cap sync
npx cap open android     # or ios
```

1. **AdMob**: create the app plus banner, interstitial, and rewarded units. Put the unit IDs in `src/services/config.ts` and set `USE_TEST_ADS = false`. Add the AdMob **App ID** to `android/app/src/main/AndroidManifest.xml` (`com.google.android.gms.ads.APPLICATION_ID`) and `ios/App/App/Info.plist` (`GADApplicationIdentifier`, plus `NSUserTrackingUsageDescription`). GDPR consent (UMP) and iOS ATT are already requested in `AdMobProvider`.
2. **In-app purchases**: `npm i cordova-plugin-purchase && npx cap sync`, then create products in App Store Connect / Play Console with the IDs in `IAP_PRODUCTS`. `src/services/iap.ts` wires up the store; non-consumable grants are idempotent, so restores are safe.
3. Replace `public/icon.svg` with real app icons/splash (`@capacitor/assets` can generate them).

## Adding login later

- `src/services/auth.ts`: implement `AuthProvider` (Sign in with Apple, Google, Firebase, Supabase, etc.).
- `src/services/save.ts`: add a `CloudSaveBackend` to `saves.backends`. `SaveManager.load()` already picks the newest save across backends by `lastSaved`.
- Move purchase entitlements onto the account and validate receipts server-side.
- The settings screen already shows a "Playing as guest" account section.

## Project layout

```
src/
  game/      data.ts (all balance numbers), engine.ts (pure game logic), state.ts, story.ts, achievements.ts
  services/  ads.ts, iap.ts, save.ts, auth.ts, audio.ts (synth SFX), haptics.ts, config.ts
  art/       SVG characters, lair scenes, icons, shared gradients
  ui/        scene, top bar, tabs + views/, modals, story dialog, fx (particles/toasts), settings, daily
  app.ts     game controller: loop, actions, rewards, ads glue
tests/       engine tests + pacing simulation
```

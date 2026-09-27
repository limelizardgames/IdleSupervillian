import '@fontsource/bangers/400.css';
import '@fontsource/fredoka/400.css';
import '@fontsource/fredoka/600.css';
import './styles/main.css';

import { Capacitor } from '@capacitor/core';
import { App } from './app';
import { VILLAIN_BODY } from './art/characters';
import { SVG_DEFS } from './art/defs';
import * as E from './game/engine';
import { newGame } from './game/state';
import { STORY_BY_ID } from './game/story';
import { ads } from './services/ads';
import { audio } from './services/audio';
import { iap } from './services/iap';
import { saves } from './services/save';
import { $ } from './ui/dom';
import { initFx } from './ui/fx';
import { initModals, modalOpen } from './ui/modals';
import { openDaily } from './ui/daily';
import { Scene } from './ui/scene';
import { askName } from './ui/settings';
import { Tabs } from './ui/tabs';
import { TopBar } from './ui/topbar';

async function boot() {
  document.body.insertAdjacentHTML('afterbegin', SVG_DEFS);

  const loaded = await saves.load();
  const s = loaded ?? newGame();
  const app = new App(s);

  initModals($('#modal-root'));
  initFx($('#fx-layer'), $('#toasts'));
  app.topbar = new TopBar(app, $('#topbar'));
  app.scene = new Scene(app, $('#scene'));
  app.tabs = new Tabs(app, $('#panel'), $('#tabs'));
  // Handy for debugging in the browser console.
  (window as unknown as { game: App }).game = app;

  // Splash doubles as the "user gesture" needed to unlock audio on mobile.
  await splash();

  ads.onFullscreen = (showing) => audio.setMuted(showing);
  ads.init(s.purchases.removeAds);
  iap.onGrant = (id) => app.grantIap(id);
  iap.init();

  if (Capacitor.isNativePlatform()) {
    const { App: CapApp } = await import('@capacitor/app');
    CapApp.addListener('appStateChange', ({ isActive }) => { if (!isActive) app.save(); });
    CapApp.addListener('backButton', () => { if (!modalOpen()) CapApp.minimizeApp(); });
  }

  if (!s.villainName) {
    await askName(app);
    app.s.lastTick = Date.now();
    app.start();
    await app.playBeat(STORY_BY_ID['intro']);
  } else {
    app.showOffline();
    app.start();
    if (!s.story['intro']) app.playBeat(STORY_BY_ID['intro']);
  }
  if (E.dailyAvailable(app.s) && app.s.story['intro']) openDaily(app);

}

function splash(): Promise<void> {
  const el = $('#splash');
  el.querySelector('.splash-villain')!.innerHTML = VILLAIN_BODY;
  el.classList.add('ready');
  return new Promise((resolve) => {
    el.addEventListener('pointerdown', () => {
      audio.play('fanfare');
      el.classList.add('gone');
      setTimeout(() => el.remove(), 600);
      resolve();
    }, { once: true });
  });
}

boot();

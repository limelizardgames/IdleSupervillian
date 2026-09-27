import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.limelizardgames.idlesupervillain',
  appName: 'Idle Supervillain',
  webDir: 'dist',
  backgroundColor: '#140a26',
  plugins: {
    AdMob: {
      // Replace with your real AdMob App IDs in the native projects
      // (AndroidManifest.xml / Info.plist). See README.
    },
  },
};

export default config;

import { Capacitor } from '@capacitor/core';

let enabled = true;
export function setHaptics(on: boolean) { enabled = on; }

export async function buzz(kind: 'light' | 'medium' | 'heavy' = 'light') {
  if (!enabled) return;
  if (Capacitor.isNativePlatform()) {
    try {
      const { Haptics, ImpactStyle } = await import('@capacitor/haptics');
      const style = kind === 'heavy' ? ImpactStyle.Heavy : kind === 'medium' ? ImpactStyle.Medium : ImpactStyle.Light;
      await Haptics.impact({ style });
    } catch { /* ignore */ }
  } else if (navigator.vibrate) {
    navigator.vibrate(kind === 'heavy' ? 30 : kind === 'medium' ? 15 : 6);
  }
}

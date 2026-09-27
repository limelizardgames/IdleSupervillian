/**
 * Placeholder for the upcoming login feature.
 *
 * Plan:
 *  1. Implement AuthProvider with your backend (Firebase Auth, Supabase,
 *     Sign in with Apple / Google Play Games, etc.).
 *  2. After sign-in, push a CloudSaveBackend into `saves.backends`
 *     (see services/save.ts) keyed by `user.id`.
 *  3. Move purchase entitlements (remove_ads, doubler) onto the account and
 *     validate receipts server-side.
 */
export interface User {
  id: string;
  displayName: string;
  provider: 'guest' | 'apple' | 'google' | 'email';
}

export interface AuthProvider {
  currentUser(): User | null;
  signIn(): Promise<User | null>;
  signOut(): Promise<void>;
}

class GuestAuth implements AuthProvider {
  currentUser(): User {
    return { id: 'local-guest', displayName: 'Guest Villain', provider: 'guest' };
  }
  async signIn() { return null; }
  async signOut() {}
}

export const auth: AuthProvider = new GuestAuth();

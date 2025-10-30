import type PocketBase from 'pocketbase';
import type { AuthModel } from 'pocketbase';
import { PocketBaseService } from './PocketBaseService';

export class AuthService {
  private readonly pbService: PocketBaseService;

  constructor(pbService: PocketBaseService) {
    this.pbService = pbService;
  }

  get client(): PocketBase {
    return this.pbService.client;
  }

  /** Subscribe to PocketBase auth store changes. Returns an unsubscribe fn. */
  subscribeAuth(cb: (isValid: boolean, model: AuthModel) => void) {
    const { authStore } = this.client;
    cb(authStore.isValid, authStore.record);
    return authStore.onChange((_token, model) => {
      cb(authStore.isValid, model);
    });
  }

  /** Email/password login */
  async signIn(email: string, password: string) {
    const e = email.trim().toLowerCase();
    return this.client.collection('users').authWithPassword(e, password);
  }

  /** Create user then authenticate */
  async signUp(email: string, password: string, passwordConfirm: string) {
    const e = email.trim().toLowerCase();
    await this.client.collection('users').create({
      email: e,
      password,
      passwordConfirm,
      emailVisibility: true,
    });
    return this.client.collection('users').authWithPassword(e, password);
  }

  /** Clear local auth */
  logout() {
    this.client.authStore.clear();
  }

  /** Try to refresh auth if supported (PB auto-refreshes via authStore by default) */
  async refresh() {
    // Placeholder for explicit refresh flow if needed later.
    return this.client.collection('users').authRefresh?.();
  }
}

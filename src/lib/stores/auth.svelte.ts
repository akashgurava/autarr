import { pb } from '$lib';
import { browser } from '$app/environment';
import type { User } from '$lib/types';

class AuthStore {
	isAuthenticated = $state(false);
	user = $state<User | null>(null);
	loading = $state(false);
	private initialized = false;

	constructor() {
		// Only initialize in browser environment
		if (browser) {
			this.init();
		}
	}

	private init() {
		if (this.initialized) return;
		this.initialized = true;

		// Initialize from PocketBase authStore
		this.isAuthenticated = pb.authStore.isValid;
		this.user = pb.authStore.record as User | null;

		// Subscribe to auth changes
		pb.authStore.onChange((_, model) => {
			this.isAuthenticated = pb.authStore.isValid;
			this.user = model as User | null;
		});
	}

	setLoading(loading: boolean) {
		this.loading = loading;
	}

	clear() {
		if (!browser) return;
		pb.authStore.clear();
		this.isAuthenticated = false;
		this.user = null;
	}
}

// Safe to instantiate - constructor checks browser environment
export const authStore = new AuthStore();

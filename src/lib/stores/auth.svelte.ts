import { pb } from '$lib';
import { browser } from '$app/environment';
import type { User } from '$lib/types';

class AuthStore {
	user = $state<User | null>(null);
	loading = $state(false);
	isAuthenticated: boolean = $derived(this.user !== null);
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
		this.user = pb.authStore.record as User | null;

		// // Subscribe to auth changes
		// pb.authStore.onChange((_, model) => {
		// 	this.user = model as User | null;
		// });
	}

	setLoading(loading: boolean) {
		this.loading = loading;
	}

	clear() {
		if (!browser) return;
		pb.authStore.clear();
		this.user = null;
	}
}

// Safe to instantiate - constructor checks browser environment
export const authStore = new AuthStore();

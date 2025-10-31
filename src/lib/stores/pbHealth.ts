import { derived, writable, type Readable } from 'svelte/store';

import { PocketBaseUnhealthyError } from '$lib/error';
import { pb } from '$lib/services/PocketBaseService';
import { ClientResponseError } from 'pocketbase';

/**
 * PBHealthErrorStore
 *
 * Svelte store that tracks PocketBase health globally.
 * - Value is either `null` (healthy) or a `PocketBaseUnhealthyError` (unhealthy).
 * - Provides `startPolling` and `stopPolling` to control periodic checks.
 * - Polling uses PocketBaseService.instance.checkHealth() and updates the store.
 *
 * Notes
 * - `checkHealth()` may throw `PocketBaseUnhealthyError`; this store catches it and stores it.
 * - Consumers can subscribe to this store or read `.value`/`.isPocketBaseOnline` for convenience.
 */
export class PBHealthErrorStore implements Readable<PocketBaseUnhealthyError | null> {
	private readonly store = writable<PocketBaseUnhealthyError | null>(null);
	private intervalId: ReturnType<typeof setInterval> | null = null;

	subscribe = this.store.subscribe;

	/**
	 * Starts periodic health polling.
	 * - Immediately performs a tick, then schedules subsequent checks every `intervalMs`.
	 * - No-op if already polling.
	 * @param intervalMs Interval in milliseconds (default: 15000)
	 */
	startPolling(intervalMs = 15000, log = false) {
		if (this.intervalId) return;
		void this.tick(log);
		this.intervalId = setInterval(() => this.tick(log), intervalMs);
	}

	/**
	 * Stops periodic health polling.
	 * - Safe to call multiple times.
	 */
	stopPolling() {
		if (this.intervalId) {
			clearInterval(this.intervalId);
			this.intervalId = null;
		}
	}

	/**
	 * Performs a single health check and updates the store value.
	 * - Sets `null` on success (healthy).
	 * - Stores `PocketBaseUnhealthyError` on failure.
	 */
	async tick(log = false) {
		try {
			await pb.checkHealth();
			this.store.set(null);
			if (log) console.debug(`[DEBUG][PBHealthErrorStore] PB_HEALTHY.`);
		} catch (e) {
			let error: PocketBaseUnhealthyError;
			if (e instanceof PocketBaseUnhealthyError) {
				error = e;
			} else {
				let baseError = new ClientResponseError({
					url: pb.baseURL,
					status: 500,
					isAbort: true,
					originalError: e
				});
				error = new PocketBaseUnhealthyError(baseError);
			}
			this.store.set(error);
			if (log) console.error(`[ERROR][PBHealthErrorStore] PB_UNHEALTHY. Error: ${error}`);
		}
	}
}

export const pbHealthError = new PBHealthErrorStore();
export const isPocketBaseOnline = derived(pbHealthError, (e) => e === null);

import { checkPocketBase } from '$lib/auth';
import type { PBHealthStatus } from '$lib/types';

export function usePocketBaseHealth() {
	let status = $state<PBHealthStatus>(null);
	let checking = $state(false);
	let error = $state<string | null>(null);

	async function check() {
		checking = true;
		error = null;
		try {
			const isOnline = await checkPocketBase();
			status = isOnline;
			if (!isOnline) {
				error = 'PocketBase is unreachable';
			}
		} catch (err) {
			status = false;
			error = err instanceof Error ? err.message : 'Failed to check PocketBase health';
		} finally {
			checking = false;
		}
	}

	return {
		get status() {
			return status;
		},
		get checking() {
			return checking;
		},
		get error() {
			return error;
		},
		check
	};
}

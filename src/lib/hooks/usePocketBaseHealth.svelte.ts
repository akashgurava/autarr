import type PocketBase from 'pocketbase';

export function usePocketBaseHealth() {
	let isPocketBaseOnline = $state<boolean>(false);
	let checking = $state(false);
	let error = $state<string>('');

	async function check(pb: PocketBase) {
		checking = true;
		error = '';

		try {
			const healthCheckResponse = await pb.health.check();
			if (healthCheckResponse.code === 200) {
				isPocketBaseOnline = true;
				console.debug(
					`[DEBUG][usePocketBaseHealth] CHECKED. isPocketBaseOnline: ${isPocketBaseOnline}.`
				);
			} else {
				isPocketBaseOnline = false;
				error = healthCheckResponse.message;
				console.error(
					`[ERROR][usePocketBaseHealth] CHECKED. code: ${healthCheckResponse.code}. message: ${healthCheckResponse.message}. data: ${healthCheckResponse.data}.`
				);
			}
		} catch (err) {
			isPocketBaseOnline = false;
			error = err instanceof Error ? err.message : 'Failed to check PocketBase health';
		} finally {
			checking = false;
		}
	}

	return {
		get isPocketBaseOnline() {
			return isPocketBaseOnline;
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

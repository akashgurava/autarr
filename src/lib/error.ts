import { ClientResponseError } from 'pocketbase';

/**
 * PocketBaseUnhealthyError.
 * A type safe wrapper around `pocketbase`'s `ClientResponseError`.
 *
 * Thrown when the PocketBase server is unhealthy.
 */
export class PocketBaseUnhealthyError extends Error {
	readonly error: ClientResponseError;
	readonly status: number;

	constructor(error: ClientResponseError) {
		super(`POCKETBASE_URL: ${error.url}. Status: ${error.status}. Message: ${error.message}`);
		this.name = 'PocketBaseUnhealthyError';

		this.error = error;
		this.status = error.status;
	}
}

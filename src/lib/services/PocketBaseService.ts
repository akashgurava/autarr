import PocketBase, { ClientResponseError } from 'pocketbase';

import { PB_URL } from '$env/static/private';
import { PocketBaseUnhealthyError } from '$lib/error';

/**
 * PocketBaseService
 *
 * A thin wrapper around the PocketBase client.
 * Esentially used for pocketbase instance and health checks.
 */
export class PocketBaseService {
	readonly client: PocketBase;

	constructor() {
		this.client = new PocketBase(PB_URL);
	}

	/**
	 * Base URL the PocketBase client is configured with.
	 */
	get baseURL(): string {
		return this.client.baseURL;
	}

	/**
	 * Performs a health check against the PocketBase API.
	 *
	 * Resolves if the server is healthy.
	 *
	 * @throws {PocketBaseUnhealthyError} when PocketBase responds with a client error
	 * (e.g., network or non-2xx response encapsulated by ClientResponseError).
	 */
	async checkHealth() {
		try {
			await this.client.health.check();
		} catch (error) {
			if (error instanceof ClientResponseError) {
				throw new PocketBaseUnhealthyError(error);
			}
		}
	}
}

export const pb = new PocketBaseService();

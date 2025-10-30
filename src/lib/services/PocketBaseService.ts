import PocketBase, { ClientResponseError } from 'pocketbase';

import { PUBLIC_PB_URL } from '$env/static/public';
import { PocketBaseUnhealthyError } from '$lib/error';

/**
 * PocketBaseService
 *
 * A thin, singleton wrapper around the PocketBase client.
 * Esentially used for pocketbase instance and health checks.
 */
export class PocketBaseService {
	private static _instance: PocketBaseService | null = null;
	readonly client: PocketBase;

	private constructor() {
		this.client = new PocketBase(PUBLIC_PB_URL);
	}

	/**
	 * Returns the shared singleton instance of PocketBaseService.
	 */
	static get instance(): PocketBaseService {
		if (PocketBaseService._instance === null) {
			PocketBaseService._instance = new PocketBaseService();
		}
		return PocketBaseService._instance;
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
				throw new PocketBaseUnhealthyError(PUBLIC_PB_URL, error);
			}
		}
	}
}

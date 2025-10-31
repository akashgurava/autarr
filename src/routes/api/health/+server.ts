import { pbHealthError } from '$lib/stores/pbHealth';
import { json, type RequestHandler } from '@sveltejs/kit';

/**
 * Health check endpoint.
 */
export const GET: RequestHandler = async () => {
	await pbHealthError.tick();
	try {
		return json({ server: { status: 'HEALTHY', error: null } }, { status: 200 });
	} catch {
		return json({ server: { status: 'UNHEALTHY', error: 'UNKNOWN_ERROR' } }, { status: 500 });
	}
};

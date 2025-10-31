import { json, type RequestHandler } from '@sveltejs/kit';

/**
 * Health check endpoint.
 */
export const GET: RequestHandler = async () => {
	try {
		return json({ server: { status: 'HEALTHY', error: null } }, { status: 200 });
	} catch {
		return json({ server: { status: 'UNHEALTHY', error: 'UNKNOWN_ERROR' } }, { status: 500 });
	}
};

import { pb } from '$lib';

export class UserExistsError extends Error {
	readonly code = 'USER_EXISTS' as const;
	constructor(message = 'Email is already registered') {
		super(message);
		this.name = 'UserExistsError';
	}
}

function normalizeEmail(email: string): string {
	return email.trim().toLowerCase();
}

export async function userExists(email: string): Promise<boolean> {
	const e = normalizeEmail(email);
	const v = e.replace(/"/g, '\\"');
	try {
		await pb.collection('users').getFirstListItem(`email = "${v}"`);
		return true;
	} catch {
		return false;
	}
}

export async function checkPocketBase(timeoutMs = 4000): Promise<boolean> {
	const url = `${pb.baseURL}/api/health`;
	const ctrl = new AbortController();
	const t = setTimeout(() => ctrl.abort(), timeoutMs);
	try {
		const res = await fetch(url, { signal: ctrl.signal });
		return res.ok;
	} finally {
		clearTimeout(t);
	}
}

function getAuthModel(store: unknown): unknown {
	const s = store as { model?: unknown; record?: unknown };
	return s.model ?? s.record;
}

export function subscribeAuth(cb: (isValid: boolean, model: unknown) => void) {
	cb(pb.authStore.isValid, getAuthModel(pb.authStore));
	return pb.authStore.onChange((_token, model) => {
		cb(pb.authStore.isValid, model);
	});
}

export async function signIn(email: string, password: string) {
	const e = normalizeEmail(email);
	return pb.collection('users').authWithPassword(e, password);
}

export async function signUp(rawEmail: string, password: string, passwordConfirm: string) {
	const email = normalizeEmail(rawEmail);
	try {
		await pb.collection('users').create({ email, password, passwordConfirm });
	} catch (err) {
		// Map PB duplicate email and field-level errors to a friendly domain error
		const base = err as { message?: unknown; data?: unknown };
		if (base && typeof base === 'object' && base.data && typeof base.data === 'object') {
			const data = base.data as Record<string, unknown> & { email?: unknown };
			if (
				data.email &&
				typeof data.email === 'object' &&
				'message' in (data.email as Record<string, unknown>)
			) {
				const em = (data.email as { message?: unknown }).message;
				if (typeof em === 'string' && /exist|already|in use/i.test(em))
					throw new UserExistsError(em);
			}
		}
		// Fallback: if user now exists, surface a clear error; else rethrow
		if (await userExists(email)) throw new UserExistsError();
		throw err;
	}
	// Optional: sign-in after successful signup
	return pb.collection('users').authWithPassword(email, password);
}

export function logout() {
	pb.authStore.clear();
}

export function extractError(err: unknown): string {
	const fallback = 'Authentication failed';

	if (err instanceof UserExistsError) return err.message;
	if (typeof err === 'string' && err.length) return err;
	if (err && typeof err === 'object') {
		const base = err as { message?: unknown; data?: unknown };
		if (typeof base.message === 'string' && base.message.length) return base.message;
		if (base.data && typeof base.data === 'object') {
			const data = base.data as Record<string, unknown> & {
				message?: unknown;
				error?: unknown;
				email?: unknown;
			};
			// Prefer field-level email message if present
			if (
				data.email &&
				typeof data.email === 'object' &&
				'message' in (data.email as Record<string, unknown>)
			) {
				const em = (data.email as { message?: unknown }).message;
				if (typeof em === 'string' && em.length) return em;
			}
			const top = data.message ?? data.error;
			if (typeof top === 'string' && top.length) return top;
			for (const key of Object.keys(data)) {
				const field = data[key];
				if (field && typeof field === 'object' && 'message' in (field as Record<string, unknown>)) {
					const fm = (field as { message?: unknown }).message;
					if (typeof fm === 'string' && fm.length) return fm;
				}
			}
		}
	}
	return fallback;
}

import { pb } from '$lib';
import { type AuthModel, ClientResponseError } from 'pocketbase';
import {
	createSignUpError,
	PasswordTooShortError,
	PasswordsDoNotMatchError,
	UnknownAuthError
} from '$lib/error';

// Re-export error utilities for convenience
export { extractError } from '$lib/error';

/**
 * Normalize email address to lowercase and trim whitespace.
 */
function normalizeEmail(email: string): string {
	return email.trim().toLowerCase();
}

export function subscribeAuth(cb: (isValid: boolean, model: AuthModel) => void) {
	cb(pb.authStore.isValid, pb.authStore.record);
	return pb.authStore.onChange((_token, model) => {
		cb(pb.authStore.isValid, model);
	});
}

export async function signIn(email: string, password: string) {
	const e = normalizeEmail(email);
	try {
		const result = await pb.collection('users').authWithPassword(e, password);
		return result;
	} catch (err: unknown) {
		if (err instanceof ClientResponseError) {
			console.debug('SignIn error:', {
				status: err.status,
				message: err.message,
				data: err.data
			});
			throw new Error(err.message || 'Sign in failed');
		}
		throw err instanceof Error ? err : new Error('Sign in failed');
	}
}

export async function signUp(rawEmail: string, password: string, passwordConfirm: string) {
	const email = normalizeEmail(rawEmail);

	if (password.length < 8)
		throw new PasswordTooShortError('Password must be at least 8 characters long');

	if (password !== passwordConfirm) throw new PasswordsDoNotMatchError('Passwords do not match');

	try {
		await pb.collection('users').create({
			email,
			password,
			passwordConfirm,
			emailVisibility: true
		});
	} catch (err: unknown) {
		if (err instanceof ClientResponseError) {
			console.debug('ClientResponseError:', {
				status: err.status,
				message: err.message,
				data: err.data
			});

			throw createSignUpError(err);
		}

		// Fallback for non-PocketBase errors
		if (err instanceof Error) {
			throw err;
		}

		throw new UnknownAuthError('Signup failed');
	}
	return await pb.collection('users').authWithPassword(email, password);
}

export function logout() {
	pb.authStore.clear();
}

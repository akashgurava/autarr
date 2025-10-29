import { ClientResponseError } from 'pocketbase';

export interface PocketBaseValidationError {
	code: string;
	message: string;
}

// Custom Error Classes
export class UserExistsError extends Error {
	readonly code = 'USER_EXISTS' as const;
	constructor(message = 'Email is already registered') {
		super(message);
		this.name = 'UserExistsError';
	}
}

export class UserSignUpError extends Error {
	readonly code = 'USER_SIGNUP_ERROR' as const;
	constructor(message: string) {
		super(message);
		this.name = 'UserSignUpError';
	}
}

export class UnknownAuthError extends Error {
	readonly code = 'UNKNOWN_AUTH_ERROR' as const;
	constructor(message = 'An unknown error occurred') {
		super(message);
		this.name = 'UnknownAuthError';
	}
}

export class PasswordTooShortError extends Error {
	readonly code = 'PASSWORD_TOO_SHORT' as const;
	constructor(message = 'Password must be at least 8 characters long') {
		super(message);
		this.name = 'PasswordTooShortError';
	}
}

export class PasswordsDoNotMatchError extends Error {
	readonly code = 'PASSWORDS_DO_NOT_MATCH' as const;
	constructor(message = 'Passwords do not match') {
		super(message);
		this.name = 'PasswordsDoNotMatchError';
	}
}

// Helper Functions
/**
 * Extract validation errors from PocketBase error response
 */
export function extractValidationErrors(err: unknown): string | null {
	if (err instanceof ClientResponseError && err.data) {
		// Try nested data structure first (err.data.data)
		const validationData = err.data.data || err.data;

		if (validationData && typeof validationData === 'object') {
			const fieldErrors = Object.entries(validationData)
				.filter(
					([, value]) =>
						value && typeof value === 'object' && ('message' in value || 'code' in value)
				)
				.map(([field, error]) => {
					const e = error as PocketBaseValidationError;
					return `${field}: ${e.message || e.code}`;
				})
				.join(', ');
			return fieldErrors || null;
		}
	}

	return null;
}

/**
 * Check if error is a duplicate email error
 */
export function isDuplicateEmailError(err: unknown): boolean {
	if (err instanceof ClientResponseError && err.status === 400) {
		const validationData = err.data?.data || err.data;
		return validationData?.email?.code === 'validation_not_unique';
	}
	return false;
}

/**
 * Create appropriate error from ClientResponseError
 */
export function createSignUpError(err: ClientResponseError): Error {
	if (isDuplicateEmailError(err)) {
		return new UserExistsError();
	}

	const fieldErrors = extractValidationErrors(err);
	if (fieldErrors) {
		return new UserSignUpError(`Validation failed: ${fieldErrors}`);
	}

	return new UserSignUpError(err.message || 'Signup failed');
}

/**
 * Extract user-friendly error message from any error type
 */
export function extractError(err: unknown): string {
	const fallback = 'Authentication failed';

	// Handle custom error types
	if (err instanceof UserExistsError) return err.message;
	if (err instanceof UserSignUpError) return err.message;
	if (err instanceof UnknownAuthError) return err.message;
	if (err instanceof PasswordTooShortError) return err.message;
	if (err instanceof PasswordsDoNotMatchError) return err.message;
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

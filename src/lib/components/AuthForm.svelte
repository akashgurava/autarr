<script lang="ts">
	import type { AuthFormProps } from '$lib/types';

	let {
		mode = 'signin',
		loading = false,
		pbDisabled = false,
		onSubmit,
		email = $bindable<string>(''),
		password = $bindable<string>(''),
		passwordConfirm = $bindable<string>('')
	} = $props();

	// Client-side validation
	let emailError = $state('');
	let passwordError = $state('');
	let passwordConfirmError = $state('');

	function validateEmail(value: string): boolean {
		emailError = '';
		if (!value) {
			emailError = 'Email is required';
			return false;
		}
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(value)) {
			emailError = 'Please enter a valid email';
			return false;
		}
		return true;
	}

	function validatePassword(value: string): boolean {
		passwordError = '';
		if (!value) {
			passwordError = 'Password is required';
			return false;
		}
		if (mode === 'signup' && value.length < 8) {
			passwordError = 'Password must be at least 8 characters';
			return false;
		}
		return true;
	}

	function validatePasswordConfirm(value: string): boolean {
		passwordConfirmError = '';
		if (mode === 'signup') {
			if (!value) {
				passwordConfirmError = 'Please confirm your password';
				return false;
			}
			if (value !== password) {
				passwordConfirmError = 'Passwords do not match';
				return false;
			}
		}
		return true;
	}

	function handleSubmit() {
		const isEmailValid = validateEmail(email);
		const isPasswordValid = validatePassword(password);
		const isPasswordConfirmValid = mode === 'signin' || validatePasswordConfirm(passwordConfirm);

		if (isEmailValid && isPasswordValid && isPasswordConfirmValid) {
			onSubmit();
		}
	}
</script>

<form
	class="space-y-4"
	onsubmit={(e) => {
		e.preventDefault();
		handleSubmit();
	}}
	novalidate
>
	<div class="space-y-1">
		<label for="email" class="block text-sm font-medium text-zinc-700 dark:text-zinc-200">
			Email
		</label>
		<input
			id="email"
			type="email"
			bind:value={email}
			onblur={() => validateEmail(email)}
			placeholder="name@example.com"
			autocomplete="email"
			required
			aria-invalid={emailError ? 'true' : 'false'}
			aria-describedby={emailError ? 'email-error' : undefined}
			class="mt-1 block w-full rounded-md border px-3 py-2 text-sm shadow-sm outline-none ring-0 placeholder:text-zinc-400 focus:border-zinc-400 {emailError
				? 'border-red-500 focus:border-red-500'
				: 'border-zinc-300 dark:border-zinc-700'} bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100"
		/>
		{#if emailError}
			<p id="email-error" class="text-xs text-red-600 dark:text-red-400" role="alert">
				{emailError}
			</p>
		{/if}
	</div>

	<div class="space-y-1">
		<label for="password" class="block text-sm font-medium text-zinc-700 dark:text-zinc-200">
			Password
		</label>
		<input
			id="password"
			type="password"
			bind:value={password}
			onblur={() => validatePassword(password)}
			placeholder="Password"
			autocomplete={mode === 'signin' ? 'current-password' : 'new-password'}
			required
			aria-invalid={passwordError ? 'true' : 'false'}
			aria-describedby={passwordError ? 'password-error' : undefined}
			class="mt-1 block w-full rounded-md border px-3 py-2 text-sm shadow-sm outline-none ring-0 placeholder:text-zinc-400 focus:border-zinc-400 {passwordError
				? 'border-red-500 focus:border-red-500'
				: 'border-zinc-300 dark:border-zinc-700'} bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100"
		/>
		{#if passwordError}
			<p id="password-error" class="text-xs text-red-600 dark:text-red-400" role="alert">
				{passwordError}
			</p>
		{/if}
	</div>

	{#if mode === 'signup'}
		<div class="space-y-1">
			<label
				for="passwordConfirm"
				class="block text-sm font-medium text-zinc-700 dark:text-zinc-200"
			>
				Confirm password
			</label>
			<input
				id="passwordConfirm"
				type="password"
				bind:value={passwordConfirm}
				onblur={() => validatePasswordConfirm(passwordConfirm)}
				placeholder="Confirm password"
				autocomplete="new-password"
				required
				aria-invalid={passwordConfirmError ? 'true' : 'false'}
				aria-describedby={passwordConfirmError ? 'password-confirm-error' : undefined}
				class="mt-1 block w-full rounded-md border px-3 py-2 text-sm shadow-sm outline-none ring-0 placeholder:text-zinc-400 focus:border-zinc-400 {passwordConfirmError
					? 'border-red-500 focus:border-red-500'
					: 'border-zinc-300 dark:border-zinc-700'} bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100"
			/>
			{#if passwordConfirmError}
				<p
					id="password-confirm-error"
					class="text-xs text-red-600 dark:text-red-400"
					role="alert"
				>
					{passwordConfirmError}
				</p>
			{/if}
		</div>
	{/if}

	<button
		type="submit"
		class="w-full inline-flex items-center justify-center rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
		disabled={loading || pbDisabled}
		aria-busy={loading}
	>
		{loading ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Create account'}
	</button>
</form>

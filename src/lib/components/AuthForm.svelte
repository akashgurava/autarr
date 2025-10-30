<script lang="ts">
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
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
	<div class="space-y-2">
		<Label for="email">Email</Label>
		<Input
			id="email"
			type="email"
			bind:value={email}
			onblur={() => validateEmail(email)}
			placeholder="name@example.com"
			autocomplete="email"
			required
			aria-invalid={emailError ? 'true' : 'false'}
			aria-describedby={emailError ? 'email-error' : undefined}
			class={emailError ? 'border-destructive' : ''}
		/>
		{#if emailError}
			<p id="email-error" class="text-sm text-destructive" role="alert">
				{emailError}
			</p>
		{/if}
	</div>

	<div class="space-y-2">
		<Label for="password">Password</Label>
		<Input
			id="password"
			type="password"
			bind:value={password}
			onblur={() => validatePassword(password)}
			placeholder="Password"
			autocomplete={mode === 'signin' ? 'current-password' : 'new-password'}
			required
			aria-invalid={passwordError ? 'true' : 'false'}
			aria-describedby={passwordError ? 'password-error' : undefined}
			class={passwordError ? 'border-destructive' : ''}
		/>
		{#if passwordError}
			<p id="password-error" class="text-sm text-destructive" role="alert">
				{passwordError}
			</p>
		{/if}
	</div>

	{#if mode === 'signup'}
		<div class="space-y-2">
			<Label for="passwordConfirm">Confirm password</Label>
			<Input
				id="passwordConfirm"
				type="password"
				bind:value={passwordConfirm}
				onblur={() => validatePasswordConfirm(passwordConfirm)}
				placeholder="Confirm password"
				autocomplete="new-password"
				required
				aria-invalid={passwordConfirmError ? 'true' : 'false'}
				aria-describedby={passwordConfirmError ? 'password-confirm-error' : undefined}
				class={passwordConfirmError ? 'border-destructive' : ''}
			/>
			{#if passwordConfirmError}
				<p id="password-confirm-error" class="text-sm text-destructive" role="alert">
					{passwordConfirmError}
				</p>
			{/if}
		</div>
	{/if}

	<Button type="submit" class="w-full" disabled={loading || pbDisabled} aria-busy={loading}>
		{loading ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Create account'}
	</Button>
</form>

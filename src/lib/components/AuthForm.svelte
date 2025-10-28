<script lang="ts">
	let {
		mode = 'signin',
		loading = false,
		pbDisabled = false,
		onSubmit,
		email = $bindable<string>(''),
		password = $bindable<string>(''),
		passwordConfirm = $bindable<string>('')
	} = $props<{
		mode?: 'signin' | 'signup';
		loading?: boolean;
		pbDisabled?: boolean;
		onSubmit: () => void;
		email?: string;
		password?: string;
		passwordConfirm?: string;
	}>();
</script>

<form
	class="space-y-4"
	onsubmit={(e) => {
		e.preventDefault();
		onSubmit();
	}}
>
	<div class="space-y-1">
		<label for="email" class="block text-sm font-medium text-zinc-700 dark:text-zinc-200">Email</label>
		<input id="email" type="email" bind:value={email} placeholder="name@example.com" class="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none ring-0 placeholder:text-zinc-400 focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100" />
	</div>

	<div class="space-y-1">
		<label for="password" class="block text-sm font-medium text-zinc-700 dark:text-zinc-200">Password</label>
		<input id="password" type="password" bind:value={password} placeholder="Password" class="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none ring-0 placeholder:text-zinc-400 focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100" />
	</div>

	{#if mode === 'signup'}
		<div class="space-y-1">
			<label for="passwordConfirm" class="block text-sm font-medium text-zinc-700 dark:text-zinc-200">Confirm password</label>
			<input id="passwordConfirm" type="password" bind:value={passwordConfirm} placeholder="Confirm password" class="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none ring-0 placeholder:text-zinc-400 focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100" />
		</div>
	{/if}

	<button type="submit" class="w-full inline-flex items-center justify-center rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200" disabled={loading || pbDisabled}>
		{loading ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Create account'}
	</button>
</form>

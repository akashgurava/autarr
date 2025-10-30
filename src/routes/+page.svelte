<script lang="ts">
	import { browser } from '$app/environment';

	import { signIn, signUp, logout as doLogout, extractError } from '$lib/auth';

	import { usePocketBaseHealth } from '$lib/hooks/usePocketBaseHealth.svelte';

	import { authStore } from '$lib/stores/auth.svelte';

	import PBStatusBanner from '$lib/components/PBStatusBanner.svelte';
	import AuthForm from '$lib/components/AuthForm.svelte';
	import UserPanel from '$lib/components/UserPanel.svelte';
	import { Button } from '$lib/components/ui/button';
	import type { User } from '$lib/types';

	let mounted = $state(false);

	// let mode: 'signin' | 'signup' = $state('signin');
	// let email = $state('');
	// let password = $state('');
	// let passwordConfirm = $state('');
	// let loading = $state(false);
	// let error = $state('');

	// Use the PocketBase health hook
	const pbHealth = usePocketBaseHealth();

	$effect.root(() => {
		if (!browser) return;
		mounted = true;
	});

	// async function onSubmit() {
	// 	error = '';
	// 	loading = true;
	// 	authStore.setLoading(true);

	// 	try {
	// 		// Check PocketBase connectivity
	// 		if (!pbHealth.isPocketBaseOnline) {
	// 			throw new Error('Cannot connect to server');
	// 		}
	// 		if (pbHealth.checking) {
	// 			await pbHealth.check();
	// 			if (!pbHealth.isPocketBaseOnline) {
	// 				throw new Error('Cannot connect to server');
	// 			}
	// 		}

	// 		// Perform authentication
	// 		if (mode === 'signup') {
	// 			await signUp(email, password, passwordConfirm);
	// 		} else {
	// 			await signIn(email, password);
	// 		}

	// 		// Clear form on success
	// 		email = '';
	// 		password = '';
	// 		passwordConfirm = '';
	// 	} catch (e) {
	// 		error = extractError(e);
	// 	} finally {
	// 		loading = false;
	// 		authStore.setLoading(false);
	// 	}
	// }

	// function onRetry() {
	// 	error = '';
	// 	pbHealth.check();
	// }

	function logout() {
		doLogout();
		authStore.clear();
	}

	// function switchMode() {
	// 	error = '';
	// 	mode = mode === 'signin' ? 'signup' : 'signin';
	// 	// Clear password fields when switching modes
	// 	password = '';
	// 	passwordConfirm = '';
	// }
</script>

{#if !mounted}
	<!-- Avoid SSR flash: render a minimal shell; client mounts then renders -->
	<div class="min-h-screen"></div>
{:else}
	<div class="relative flex min-h-screen items-center justify-center">
		{#if authStore.isAuthenticated}
			<div class="w-full max-w-2xl px-6">
				<div class="mb-6 text-center">
					<h1 class="text-3xl font-semibold tracking-tight">Autarr</h1>
					<p class="mt-1 text-sm text-zinc-500">You are signed in.</p>
				</div>
				<UserPanel user={authStore.user} onLogout={logout} />
			</div>
		{:else}
			<!-- <div class="w-full max-w-sm px-6">
				<div class="mb-6 text-center">
					<h1 class="text-3xl font-semibold tracking-tight">Autarr</h1>
					<p class="mt-1 text-sm text-zinc-500">
						{mode === 'signin' ? 'Please sign in to your account' : 'Create your account'}
					</p>
				</div>

				<PBStatusBanner
					pbOnline={pbHealth.isPocketBaseOnline}
					checking={pbHealth.checking}
					{onRetry}
				/>

				<AuthForm
					{mode}
					bind:email
					bind:password
					bind:passwordConfirm
					{loading}
					pbDisabled={!pbHealth.isPocketBaseOnline}
					{onSubmit}
				/>

				<div class="mt-4 space-y-2 text-center">
					{#if error}
						<p class="text-sm text-destructive" role="alert">{error}</p>
					{/if}
					<div>
						<Button variant="link" size="sm" onclick={switchMode} class="text-xs">
							{mode === 'signin' ? 'Create an account' : 'Have an account? Sign in'}
						</Button>
					</div>
				</div>
			</div> -->
		{/if}
	</div>
{/if}

<script lang="ts">
	import PBStatusBanner from '$lib/components/PBStatusBanner.svelte';
	import AuthForm from '$lib/components/AuthForm.svelte';
	import UserPanel from '$lib/components/UserPanel.svelte';
	import {
		checkPocketBase,
		subscribeAuth,
		signIn,
		signUp,
		logout as doLogout,
		extractError
	} from '$lib/auth';
	import { pb } from '$lib';
	import { browser } from '$app/environment';

	let mode: 'signin' | 'signup' = $state('signin');
	let email = $state('');
	let password = $state('');
	let passwordConfirm = $state('');
	let loading = $state(false);
	let error = $state('');

	let pbOnline: boolean | null = $state(null);
	let checking = $state(false);

	const initialModel = (pb.authStore as { model?: unknown; record?: unknown }).model ?? (pb.authStore as { model?: unknown; record?: unknown }).record;
	let authed = $state(pb.authStore.isValid);
	let user: unknown = $state(initialModel);
	let mounted = $state(false);

	$effect.root(() => {
		if (!browser) return;
		mounted = true;
		// auth subscription
		subscribeAuth((isValid, model) => {
			authed = isValid;
			user = model;
		});
		// initial PB health only if not already authed
		(async () => {
			if (authed) return;
			checking = true;
			try {
				pbOnline = await checkPocketBase();
				if (!pbOnline) error = 'PocketBase is unreachable';
			} finally {
				checking = false;
			}
		})();
	});

	async function onSubmit() {
		error = '';
		loading = true;
		try {
			if (pbOnline === false) throw new Error('Cannot connect to server');
			if (pbOnline === null) {
				pbOnline = await checkPocketBase();
				if (!pbOnline) throw new Error('Cannot connect to server');
			}
			if (mode === 'signup') {
				await signUp(email, password, passwordConfirm);
			} else {
				await signIn(email, password);
			}
		} catch (e) {
			error = extractError(e);
		} finally {
			loading = false;
		}
	}

	function onRetry() {
		(async () => {
			checking = true;
			try {
				pbOnline = await checkPocketBase();
				if (!pbOnline) error = 'PocketBase is unreachable';
			} finally {
				checking = false;
			}
		})();
	}

	function logout() {
		doLogout();
	}
</script>

{#if !mounted}
  <!-- Avoid SSR flash: render a minimal shell; client mounts then renders -->
  <div class="min-h-screen"></div>
{:else}
  <div class="relative flex min-h-screen items-center justify-center">
    {#if authed}
      <div class="w-full max-w-2xl px-6">
        <div class="mb-6 text-center">
          <h1 class="text-3xl font-semibold tracking-tight">Autarr</h1>
          <p class="mt-1 text-sm text-zinc-500">You are signed in.</p>
        </div>
        <UserPanel {user} onLogout={logout} />
      </div>
    {:else}
      <div class="w-full max-w-sm px-6">
        <div class="mb-6 text-center">
          <h1 class="text-3xl font-semibold tracking-tight">Autarr</h1>
          <p class="mt-1 text-sm text-zinc-500">
            {mode === 'signin' ? 'Please sign in to your account' : 'Create your account'}
          </p>
        </div>

        <PBStatusBanner {pbOnline} {checking} {onRetry} />

        <AuthForm
          {mode}
          bind:email
          bind:password
          bind:passwordConfirm
          {loading}
          pbDisabled={pbOnline === false}
          {onSubmit}
        />

        <div class="mt-4 space-y-2 text-center">
          {#if error}
            <div class="text-xs text-red-600">{error}</div>
          {/if}
          <div>
            <button
              type="button"
              class="text-xs text-zinc-600 underline underline-offset-4 hover:text-zinc-900"
              onclick={() => {
                error = '';
                mode = mode === 'signin' ? 'signup' : 'signin';
              }}
            >
              {mode === 'signin' ? 'Create an account' : 'Have an account? Sign in'}
            </button>
          </div>
        </div>
      </div>
    {/if}
  </div>
{/if}

<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';

	import { onMount, onDestroy, setContext } from 'svelte';

	import SunIcon from '@lucide/svelte/icons/sun';
	import MoonIcon from '@lucide/svelte/icons/moon';
	import { toggleMode } from 'mode-watcher';
	import { Button } from '$lib/components/ui/button/index';

	import { browser } from '$app/environment';
	import { isPocketBaseOnline, pbHealthError } from '$lib/stores/pbHealth.svelte';

	import * as Alert from '$lib/components/ui/alert';
	import { CircleAlert } from '@lucide/svelte';

	onMount(async () => {
		console.debug(`[DEBUG][routes/+layout] MOUNTED. Browser: ${browser}.`);
		if (!browser) return;

		pbHealthError.startPolling(15000, true);
	});

	onDestroy(() => {
		console.debug(`[DEBUG][routes/+layout] UNMOUNTED. Browser: ${browser}.`);
		pbHealthError.stopPolling();
	});

	// import { isDev, pb } from '$lib';

	// import { usePocketBaseHealth } from '$lib/hooks/usePocketBaseHealth.svelte';

	let { children } = $props();

	// const pbHealth = usePocketBaseHealth();
	// setContext('pbHealth', pbHealth);
	// let pollId: ReturnType<typeof setInterval> | null = null;

	// onMount(() => {
	// 	console.debug(`[DEBUG][routes/+layout] MOUNTED. isDev: ${isDev}. PB Url: ${pb.baseURL}.`);
	// 	document.documentElement.classList.toggle('dark', $theme);

	// 	pbHealth.check(pb);
	// 	if (isDev) {
	// 		pollId = setInterval(() => pbHealth.check(pb), 15000);
	// 	}
	// });

	// onDestroy(() => {
	// 	console.debug('[DEBUG][routes/+layout] UNMOUNTED');
	// 	if (pollId) clearInterval(pollId);
	// });
</script>

<svelte:head>
	<link rel="icon" type="image/svg" href={favicon} />
</svelte:head>

<div class="container-wrapper">
	<div class="fixed top-3 right-3 z-50">
		<Button onclick={toggleMode} variant="outline" size="icon" title="Toggle theme">
			<SunIcon
				class="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90"
			/>
			<MoonIcon
				class="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0"
			/>
			<span class="sr-only">Toggle theme</span>
		</Button>
	</div>
	{@render children?.()}
</div>

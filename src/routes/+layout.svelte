<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import { theme } from '$lib/theme';

	let { children } = $props();

	$effect(() => {
		if (typeof document !== 'undefined') {
			document.documentElement.classList.toggle('dark', $theme);
		}
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div
	class={`relative min-h-screen ${$theme ? 'bg-zinc-950 text-zinc-200' : 'bg-zinc-50 text-zinc-900'}`}
>
	<ThemeToggle />
	{@render children?.()}
</div>

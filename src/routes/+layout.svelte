<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';

	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	onMount(async () => {
		console.debug(`[DEBUG][routes/+layout] MOUNTED. Browser: ${browser}.`);
	});

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children?.()}

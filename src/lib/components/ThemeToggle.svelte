<script lang="ts">
	import { theme, toggleTheme } from '$lib/theme';
</script>

<button
    aria-label="Toggle theme"
    class={`fixed z-50 top-4 right-4 inline-flex h-8 w-8 items-center justify-center rounded-full border ${$theme ? 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200' : 'border-zinc-300 bg-white/70 text-zinc-600 hover:bg-white hover:text-zinc-900'}`}
    onclick={toggleTheme}
>
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="h-4 w-4">
		<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
	</svg>
</button>

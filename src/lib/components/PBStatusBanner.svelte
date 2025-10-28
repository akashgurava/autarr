<script lang="ts">
	import { env as publicEnv } from '$env/dynamic/public';
	import { theme } from '$lib/theme';
	import { pb } from '$lib';

	let {
		pbOnline = null,
		checking = false,
		onRetry
	} = $props<{
		pbOnline?: boolean | null;
		checking?: boolean;
		onRetry: () => void;
	}>();
</script>

{#if pbOnline === false}
	<div class={`mb-4 rounded-md border ${$theme ? 'border-red-900/50 bg-red-900/20 text-red-300' : 'border-red-200 bg-red-50 text-red-700'}`}>
		<div class="px-3 py-2 text-xs">
			<div class="font-medium">PocketBase is not reachable.</div>
			<div class="mt-1 opacity-90">Resolved base URL: <code>{pb.baseURL}</code></div>
			<div class="opacity-90">
				PUBLIC_PB_URL: <code>{publicEnv.PUBLIC_PB_URL || '(not set)'}</code>
			</div>
			<div class="mt-2">
				<button
					type="button"
					class={`inline-flex items-center rounded bg-red-600 px-2 py-1 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed`}
					onclick={onRetry}
					disabled={checking}
				>
					{checking ? 'Checking…' : 'Retry'}
				</button>
			</div>
		</div>
	</div>
{/if}

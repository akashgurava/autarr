<script lang="ts">
	import { env as publicEnv } from '$env/dynamic/public';
	import { pb } from '$lib';
	import { Alert, AlertDescription, AlertTitle } from '$lib/components/ui/alert';
	import { Button } from '$lib/components/ui/button';
	import { AlertCircle } from '@lucide/svelte';

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
	<Alert variant="destructive" class="mb-4">
		<AlertCircle class="h-4 w-4" />
		<AlertTitle>PocketBase is not reachable</AlertTitle>
		<AlertDescription class="space-y-2">
			<div class="text-xs opacity-90">
				Resolved base URL: <code class="rounded bg-destructive/20 px-1 py-0.5">{pb.baseURL}</code>
			</div>
			<div class="text-xs opacity-90">
				PUBLIC_PB_URL: <code class="rounded bg-destructive/20 px-1 py-0.5"
					>{publicEnv.PUBLIC_PB_URL || '(not set)'}</code
				>
			</div>
			<div class="mt-2">
				<Button
					variant="outline"
					size="sm"
					onclick={onRetry}
					disabled={checking}
					class="h-7 text-xs"
				>
					{checking ? 'Checking…' : 'Retry'}
				</Button>
			</div>
		</AlertDescription>
	</Alert>
{/if}

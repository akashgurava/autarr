<script lang="ts">
	import { theme } from '$lib/theme';
	import type { User } from '$lib/types';

	let { user, onLogout } = $props<{ user: User | null; onLogout: () => void }>();
</script>

<div class="w-full max-w-2xl px-6">
	<div
		class={`rounded-md border p-4 text-sm ${$theme ? 'border-zinc-800 bg-zinc-900/40' : 'border-zinc-200 bg-white'}`}
	>
		<div><span class="font-medium">ID:</span> {user?.id}</div>
		<div><span class="font-medium">Email:</span> {user?.email}</div>
		<div><span class="font-medium">Verified:</span> {user?.verified ? 'yes' : 'no'}</div>
		<div><span class="font-medium">Created:</span> {user?.created}</div>
		<div><span class="font-medium">Updated:</span> {user?.updated}</div>
	</div>

	<div class="mt-6 text-center">
		<button
			type="button"
			onclick={onLogout}
			class={`h-9 rounded-md px-4 text-sm font-medium ${$theme ? 'bg-zinc-800 text-zinc-200 hover:bg-zinc-700' : 'bg-zinc-900 text-white hover:bg-zinc-800'}`}
			>Logout</button
		>
	</div>
</div>

<script lang="ts">
	import type { User } from '$lib/types';
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';

	let { user, onLogout } = $props<{ user: User | null; onLogout: () => void }>();
</script>

<div class="w-full max-w-2xl px-6">
	<Card>
		<CardHeader>
			<CardTitle>Account Information</CardTitle>
			<CardDescription>Your profile details</CardDescription>
		</CardHeader>
		<CardContent class="space-y-3">
			<div class="flex items-center justify-between text-sm">
				<span class="text-muted-foreground">Email</span>
				<span class="font-medium">{user?.email}</span>
			</div>
			<div class="flex items-center justify-between text-sm">
				<span class="text-muted-foreground">Status</span>
				<Badge variant={user?.verified ? 'default' : 'secondary'}>
					{user?.verified ? 'Verified' : 'Unverified'}
				</Badge>
			</div>
			<div class="flex items-center justify-between text-sm">
				<span class="text-muted-foreground">User ID</span>
				<code class="rounded bg-muted px-1.5 py-0.5 text-xs">{user?.id}</code>
			</div>
			<div class="flex items-center justify-between text-sm">
				<span class="text-muted-foreground">Created</span>
				<span class="text-xs">{user?.created}</span>
			</div>
			<div class="flex items-center justify-between text-sm">
				<span class="text-muted-foreground">Updated</span>
				<span class="text-xs">{user?.updated}</span>
			</div>
		</CardContent>
	</Card>

	<div class="mt-6 text-center">
		<Button variant="outline" onclick={onLogout}>Logout</Button>
	</div>
</div>

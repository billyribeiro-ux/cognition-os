<script lang="ts">
	import type { Snippet } from 'svelte';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { Home, Timer, Brain, BookOpen, BarChart3 } from 'lucide-svelte';

	let { children }: { children: Snippet } = $props();

	const navItems = [
		{ href: '/app', icon: Home, label: 'Dashboard' },
		{ href: '/app/timer', icon: Timer, label: 'Timer' },
		{ href: '/app/nback', icon: Brain, label: 'N-Back' },
		{ href: '/app/review', icon: BookOpen, label: 'Review' },
		{ href: '/app/progress', icon: BarChart3, label: 'Progress' }
	];

	const isTimerActive = $derived(page.url.pathname === '/app/timer');
</script>

<div class="flex min-h-dvh flex-col bg-bg-primary">
	<div class="flex-1 overflow-y-auto pb-20">
		{@render children()}
	</div>

	{#if !isTimerActive}
		<nav
			class="glass-card safe-area-bottom fixed right-0 bottom-0 left-0 z-40 rounded-none border-t border-white/8"
			aria-label="Main navigation"
		>
			<div class="mx-auto flex h-16 max-w-lg items-center justify-around px-2">
				{#each navItems as item (item.href)}
					{@const isActive = page.url.pathname === item.href}
					<a
						href={resolve(item.href)}
						class="flex min-w-[56px] flex-col items-center gap-1 rounded-[8px] px-3 py-2 transition-colors duration-200
							{isActive ? 'text-accent' : 'text-text-tertiary hover:text-text-secondary'}"
						aria-current={isActive ? 'page' : undefined}
					>
						<item.icon size={20} />
						<span class="text-[10px] font-medium">{item.label}</span>
					</a>
				{/each}
			</div>
		</nav>
	{/if}
</div>

<style>
	.safe-area-bottom {
		padding-bottom: env(safe-area-inset-bottom, 0px);
	}
</style>

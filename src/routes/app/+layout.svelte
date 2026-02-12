<script lang="ts">
	import type { Snippet } from 'svelte';
	import { page } from '$app/state';
	import { Home, Timer, Brain, Layers, BarChart3, Settings } from 'lucide-svelte';

	let { children }: { children: Snippet } = $props();

	const navItems = [
		{ href: '/app', icon: Home, label: 'Dashboard' },
		{ href: '/app/timer', icon: Timer, label: 'Timer' },
		{ href: '/app/nback', icon: Brain, label: 'N-Back' },
		{ href: '/app/cards', icon: Layers, label: 'Cards' },
		{ href: '/app/progress', icon: BarChart3, label: 'Progress' }
	];

	const isTimerActive = $derived(page.url.pathname === '/app/timer');
	const isSettingsActive = $derived(page.url.pathname === '/app/settings');
</script>

<div class="flex min-h-dvh bg-bg-primary">
	<!-- Desktop Sidebar (1024px+) -->
	{#if !isTimerActive}
		<aside
			class="glass-card hidden w-56 shrink-0 flex-col rounded-none border-r border-white/8 lg:flex"
			aria-label="Sidebar navigation"
		>
			<div class="flex h-14 items-center gap-2 px-5">
				<span class="text-sm font-bold tracking-widest text-text-primary">COGNITION OS</span>
			</div>

			<nav class="flex flex-1 flex-col gap-1 px-3 py-2">
				{#each navItems as item (item.href)}
					{@const isActive = page.url.pathname === item.href}
					<a
						href={item.href}
						class="flex items-center gap-3 rounded-[8px] px-3 py-2.5 text-sm font-medium transition-colors duration-200
							{isActive
							? 'bg-accent/10 text-accent'
							: 'text-text-tertiary hover:bg-white/5 hover:text-text-secondary'}"
						aria-current={isActive ? 'page' : undefined}
					>
						<item.icon size={18} />
						<span>{item.label}</span>
					</a>
				{/each}
			</nav>

			<div class="border-t border-white/5 px-3 py-3">
				<a
					href="/app/settings"
					class="flex items-center gap-3 rounded-[8px] px-3 py-2.5 text-sm font-medium transition-colors duration-200
						{isSettingsActive
						? 'bg-accent/10 text-accent'
						: 'text-text-tertiary hover:bg-white/5 hover:text-text-secondary'}"
					aria-current={isSettingsActive ? 'page' : undefined}
				>
					<Settings size={18} />
					<span>Settings</span>
				</a>
			</div>
		</aside>
	{/if}

	<!-- Main content -->
	<div class="flex flex-1 flex-col overflow-hidden">
		<div class="flex-1 overflow-y-auto pb-20 lg:pb-4">
			{#key page.url.pathname}
				<div class="page-transition">
					{@render children()}
				</div>
			{/key}
		</div>
	</div>

	<!-- Mobile Bottom Nav (<1024px) -->
	{#if !isTimerActive}
		<nav
			class="glass-card safe-area-bottom fixed right-0 bottom-0 left-0 z-40 rounded-none border-t border-white/8 lg:hidden"
			aria-label="Main navigation"
		>
			<div class="mx-auto flex h-16 max-w-lg items-center justify-around px-2">
				{#each navItems as item (item.href)}
					{@const isActive = page.url.pathname === item.href}
					<a
						href={item.href}
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

	.page-transition {
		animation: page-fade-in 200ms ease-out;
	}

	@keyframes page-fade-in {
		from {
			opacity: 0;
			transform: translateY(4px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>

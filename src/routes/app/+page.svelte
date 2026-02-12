<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { protocol } from '$lib/stores/protocol.svelte';
	import { streak } from '$lib/stores/streak.svelte';
	import { getDemoProtocol, getDemoStreak } from '$lib/utils/demo-data';
	import { formatTime12h } from '$lib/utils/time';
	import { LEVEL_COLORS } from '$lib/constants/levels';
	import { DAILY_WATER_TARGET_OZ } from '$lib/constants/protocol';
	import GlassCard from '$lib/components/ui/GlassCard.svelte';
	import ProgressRing from '$lib/components/ui/ProgressRing.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Odometer from '$lib/components/ui/Odometer.svelte';

	onMount(() => {
		if (protocol.items.length === 0) {
			const demoItems = getDemoProtocol();
			protocol.setSchedule(demoItems);
			streak.setData(getDemoStreak());
		}
		protocol.autoMissPastItems();
	});

	const levelColor = $derived(LEVEL_COLORS[streak.data.currentLevel] ?? LEVEL_COLORS[1]);
	const pomodorosCompleted = $derived(
		protocol.items.filter((i) => i.type === 'pomodoro' && i.status === 'completed').length
	);
	const pomodorosTotal = $derived(protocol.items.filter((i) => i.type === 'pomodoro').length);

	function getStatusDot(status: string): string {
		switch (status) {
			case 'active':
				return 'bg-accent animate-pulse-accent';
			case 'completed':
				return 'bg-success';
			case 'missed':
				return 'bg-danger';
			case 'skipped':
				return 'bg-text-tertiary';
			default:
				return 'bg-bg-tertiary';
		}
	}

	function navigateToItem(item: { type: string; id: string }) {
		protocol.startItem(item.id);
		switch (item.type) {
			case 'pomodoro':
			case 'meditation':
			case 'exercise':
			case 'cold_exposure':
			case 'break':
				goto(`/app/timer?type=${item.type}&itemId=${item.id}`);
				break;
			case 'nback':
				goto('/app/nback');
				break;
			case 'srs_review':
				goto('/app/review');
				break;
			default:
				goto(`/app/timer?type=generic&itemId=${item.id}`);
		}
	}
</script>

<div class="space-y-4 px-4 py-4">
	<!-- Header with settings -->
	<div class="flex items-center justify-between">
		<h1 class="text-lg font-bold text-text-primary">Dashboard</h1>
		<a
			href="/app/settings"
			class="flex h-8 w-8 items-center justify-center rounded-full text-text-tertiary transition-colors hover:bg-white/5 hover:text-text-secondary"
			aria-label="Settings"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="18"
				height="18"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				><path
					d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"
				/><circle cx="12" cy="12" r="3" /></svg
			>
		</a>
	</div>

	<!-- Status Bar -->
	<GlassCard variant="elevated" padding="md">
		<div class="mb-3 flex items-center justify-between">
			<span class="text-sm font-bold text-text-primary">
				{streak.fireEmojis} DAY {streak.data.dayInLevel} of {streak.daysRequired}
			</span>
			<Badge
				variant="level"
				level={streak.data.currentLevel}
				label="LEVEL {streak.data.currentLevel}: {streak.levelName}"
			/>
		</div>

		<div class="mb-2">
			<div class="h-1.5 overflow-hidden rounded-full bg-bg-tertiary">
				<div
					class="h-full rounded-full transition-all duration-700 ease-out"
					style="width: {streak.levelProgress}%; background-color: {levelColor};"
				></div>
			</div>
			<p class="mt-1 text-xs text-text-tertiary">{streak.levelProgress}% Complete</p>
		</div>

		<p class="text-sm text-text-secondary">
			Streak: <Odometer value={streak.data.currentStreak} class="font-mono text-warning" /> days {streak.fireEmojis}
		</p>
	</GlassCard>

	<!-- Protocol Timeline -->
	<div class="space-y-1">
		<h2 class="mb-2 px-1 font-mono text-xs tracking-[0.2em] text-text-tertiary uppercase">
			Today's Protocol
		</h2>

		{#each protocol.items as item (item.id)}
			<GlassCard padding="sm">
				<div class="flex items-center gap-3">
					<!-- Status dot + icon -->
					<div class="flex w-8 shrink-0 flex-col items-center gap-1">
						<span class="text-base">{item.icon}</span>
						<span class="h-2 w-2 rounded-full {getStatusDot(item.status)}"></span>
					</div>

					<!-- Content -->
					<div class="min-w-0 flex-1">
						<div class="flex items-center gap-2">
							<span
								class="text-sm font-medium {item.status === 'skipped'
									? 'text-text-tertiary line-through'
									: 'text-text-primary'} truncate"
							>
								{item.title}
							</span>
						</div>
						<p class="truncate text-xs text-text-tertiary">{item.description}</p>
					</div>

					<!-- Right side -->
					<div class="shrink-0 text-right">
						{#if item.status === 'active'}
							<span class="font-mono text-xs text-accent">IN PROGRESS</span>
						{:else if item.status === 'completed'}
							<span class="text-xs text-success">✓ {item.duration}:00</span>
						{:else}
							<span class="font-mono text-xs text-text-secondary">
								{item.time.includes('+') || item.time.includes('-')
									? item.time
									: formatTime12h(item.time)}
							</span>
						{/if}
					</div>
				</div>

				{#if protocol.nextUpcoming?.id === item.id}
					<div class="mt-2 border-t border-white/5 pt-2">
						<Button size="sm" onclick={() => navigateToItem(item)}>START →</Button>
					</div>
				{/if}
			</GlassCard>
		{/each}
	</div>

	<!-- Quick Stats -->
	<div class="scrollbar-none -mx-4 flex gap-3 overflow-x-auto px-4 pb-2">
		<GlassCard padding="sm" class="flex min-w-[100px] shrink-0 flex-col items-center gap-1">
			<ProgressRing
				progress={(pomodorosCompleted / Math.max(pomodorosTotal, 1)) * 100}
				size={48}
				strokeWidth={4}
				color="var(--color-accent)"
				label="{pomodorosCompleted}/{pomodorosTotal}"
			/>
			<span class="text-xs text-text-tertiary">Pomodoros</span>
		</GlassCard>

		<GlassCard padding="sm" class="flex min-w-[100px] shrink-0 flex-col items-center gap-1">
			<ProgressRing
				progress={(protocol.waterOz / DAILY_WATER_TARGET_OZ) * 100}
				size={48}
				strokeWidth={4}
				color="var(--color-info)"
				label="{protocol.waterOz}oz"
			/>
			<span class="text-xs text-text-tertiary">Water</span>
		</GlassCard>

		<GlassCard padding="sm" class="flex min-w-[100px] shrink-0 flex-col items-center gap-1">
			<Odometer value={streak.data.currentStreak} class="font-mono text-2xl text-warning" />
			<span class="text-xs text-text-tertiary">🔥 Streak</span>
		</GlassCard>

		<GlassCard padding="sm" class="flex min-w-[100px] shrink-0 flex-col items-center gap-1">
			<ProgressRing
				progress={streak.levelProgress}
				size={48}
				strokeWidth={4}
				color={levelColor}
				label="L{streak.data.currentLevel}"
			/>
			<span class="text-xs text-text-tertiary">Level</span>
		</GlassCard>
	</div>
</div>

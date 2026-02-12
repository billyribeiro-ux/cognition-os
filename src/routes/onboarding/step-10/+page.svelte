<script lang="ts">
	import { goto } from '$app/navigation';
	import { onboarding } from '$lib/stores/onboarding.svelte';
	import { generateProtocol } from '$lib/utils/protocol-engine';
	import { formatTime12h } from '$lib/utils/time';
	import { COMMITMENT_CONFIGS, PROFESSION_LABELS } from '$lib/constants/protocol';
	import { LEVEL_CONFIG } from '$lib/constants/levels';
	import GlassCard from '$lib/components/ui/GlassCard.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';

	const protocol = $derived(generateProtocol(onboarding.state, 1));
	const commitment = onboarding.state.commitmentLevel ?? 'standard';
	const config = COMMITMENT_CONFIGS[commitment];
	const profession = PROFESSION_LABELS[onboarding.state.profession ?? 'other'] ?? 'Professional';
	const levelInfo = LEVEL_CONFIG[1];
	const requiredItems = $derived(protocol.filter((p) => p.required));

	function acceptMission() {
		onboarding.nextStep();
		goto('/app');
	}
</script>

<div class="flex flex-1 flex-col px-6 py-4">
	<div class="mb-6 space-y-2 text-center">
		<p class="font-mono text-xs tracking-[0.3em] text-accent uppercase">Protocol Generated</p>
		<h2 class="text-2xl font-bold text-text-primary">Your Day 1 Protocol</h2>
		<p class="text-sm text-text-secondary">
			{profession} • {config.label} Intensity • Level 1: {levelInfo.name}
		</p>
	</div>

	<div class="flex-1 space-y-2 overflow-y-auto pb-4">
		{#each protocol as item (item.id)}
			<GlassCard padding="sm">
				<div class="flex items-center gap-3">
					<span class="w-8 shrink-0 text-center text-lg">{item.icon}</span>
					<div class="min-w-0 flex-1">
						<div class="flex items-center gap-2">
							<span class="truncate text-sm font-medium text-text-primary">{item.title}</span>
							{#if item.required}
								<Badge variant="default" label="Required" size="sm" />
							{/if}
						</div>
						<p class="truncate text-xs text-text-tertiary">{item.description}</p>
					</div>
					<div class="shrink-0 text-right">
						<span class="font-mono text-xs text-accent">
							{item.time.includes('+') || item.time.includes('-')
								? item.time
								: formatTime12h(item.time)}
						</span>
						<span class="block text-xs text-text-tertiary">{item.duration} min</span>
					</div>
				</div>
			</GlassCard>
		{/each}
	</div>

	<div class="glass-card-elevated mb-4 space-y-2 p-4 text-center">
		<p class="text-sm text-text-secondary">
			<span class="font-mono text-accent">{requiredItems.length}</span> required items •
			<span class="font-mono text-accent">{config.pomodorosPerDay}</span> pomodoros •
			<span class="font-mono text-accent">~{config.totalHoursPerDay}h</span> total
		</p>
		<p class="text-xs text-text-tertiary">
			Complete 90%+ daily to maintain your streak. Miss a day, restart the level.
		</p>
	</div>

	<div class="pb-6">
		<Button fullWidth size="lg" onclick={acceptMission}>ACCEPT MISSION →</Button>
	</div>
</div>

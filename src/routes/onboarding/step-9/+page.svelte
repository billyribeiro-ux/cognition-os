<script lang="ts">
	import { goto } from '$app/navigation';
	import { onboarding } from '$lib/stores/onboarding.svelte';
	import { COMMITMENT_CONFIGS } from '$lib/constants/protocol';
	import type { CommitmentLevel } from '$lib/types';

	const levels: { key: CommitmentLevel; icon: string; warning: string }[] = [
		{ key: 'standard', icon: '🟢', warning: '' },
		{
			key: 'aggressive',
			icon: '🟡',
			warning: 'Requires real discipline. Miss a day, restart the level.'
		},
		{ key: 'elite', icon: '🔴', warning: 'No mercy. This is for people who are dead serious.' }
	];

	function select(level: CommitmentLevel) {
		onboarding.updateField('commitmentLevel', level);
		onboarding.setStep(10);
		goto('/onboarding/step-10');
	}
</script>

<div class="flex flex-1 flex-col px-6 py-4">
	<div class="mb-8 space-y-2">
		<p class="font-mono text-xs tracking-[0.2em] text-accent uppercase">Commitment</p>
		<h2 class="text-2xl font-bold text-text-primary">How hard do you want to go?</h2>
		<p class="text-sm text-text-secondary">This determines the intensity of your daily protocol.</p>
	</div>

	<div class="flex flex-1 flex-col content-start gap-4">
		{#each levels as item (item.key)}
			{@const config = COMMITMENT_CONFIGS[item.key]}
			<button
				type="button"
				class="glass-card focus-ring p-5 text-left transition-all duration-200
					{onboarding.state.commitmentLevel === item.key
					? 'glow-accent border-accent/50 bg-accent/5'
					: 'hover:border-white/15 hover:bg-white/3'}"
				onclick={() => select(item.key)}
			>
				<div class="mb-2 flex items-center gap-3">
					<span class="text-xl">{item.icon}</span>
					<span class="text-lg font-bold text-text-primary">{config.label}</span>
				</div>
				<p class="mb-2 text-sm text-text-secondary">{config.description}</p>
				<div class="flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs text-text-tertiary">
					<span>{config.pomodorosPerDay} pomodoros/day</span>
					<span>{config.meditationMinutes} min meditation</span>
					<span>~{config.totalHoursPerDay}h/day</span>
				</div>
				{#if item.warning}
					<p class="mt-2 text-xs text-warning">{item.warning}</p>
				{/if}
			</button>
		{/each}
	</div>
</div>

<script lang="ts">
	import { goto } from '$app/navigation';
	import { onboarding } from '$lib/stores/onboarding.svelte';
	import type { ScheduleType } from '$lib/types';

	const scheduleTypes: { key: ScheduleType; icon: string; label: string; desc: string }[] = [
		{
			key: 'fixed',
			icon: '🏢',
			label: 'Fixed Schedule',
			desc: '9-5 or set hours. Consistent daily routine.'
		},
		{
			key: 'flexible',
			icon: '🏠',
			label: 'Flexible',
			desc: 'Remote/freelance. You control your hours.'
		},
		{
			key: 'night',
			icon: '🌙',
			label: 'Night Shift',
			desc: "Work nights, sleep days. We'll flip the protocol."
		},
		{
			key: 'split',
			icon: '⚡',
			label: 'Split Schedule',
			desc: 'Multiple work blocks with gaps between.'
		}
	];

	function select(type: ScheduleType) {
		onboarding.updateField('scheduleType', type);
		onboarding.setStep(3);
		goto('/onboarding/step-3');
	}
</script>

<div class="flex flex-1 flex-col px-6 py-4">
	<div class="mb-8 space-y-2">
		<p class="font-mono text-xs tracking-[0.2em] text-accent uppercase">Schedule</p>
		<h2 class="text-2xl font-bold text-text-primary">What's your work schedule?</h2>
		<p class="text-sm text-text-secondary">
			This determines how we structure your protocol around your day.
		</p>
	</div>

	<div class="flex flex-1 flex-col content-start gap-3">
		{#each scheduleTypes as item (item.key)}
			<button
				type="button"
				class="glass-card focus-ring flex items-center gap-4 p-4 text-left transition-all duration-200
					{onboarding.state.scheduleType === item.key
					? 'glow-accent border-accent/50 bg-accent/5'
					: 'hover:border-white/15 hover:bg-white/3'}"
				onclick={() => select(item.key)}
			>
				<span class="shrink-0 text-2xl">{item.icon}</span>
				<div>
					<span class="block text-base font-medium text-text-primary">{item.label}</span>
					<span class="text-sm text-text-tertiary">{item.desc}</span>
				</div>
			</button>
		{/each}
	</div>
</div>

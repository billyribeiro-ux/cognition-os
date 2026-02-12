<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { onboarding } from '$lib/stores/onboarding.svelte';
	import { PROFESSION_LABELS, PROFESSION_ICONS } from '$lib/constants/protocol';
	import type { Profession } from '$lib/types';

	const professions = Object.entries(PROFESSION_LABELS) as [Profession, string][];

	function select(profession: Profession) {
		onboarding.updateField('profession', profession);
		onboarding.setStep(2);
		goto(resolve('/onboarding/step-2'));
	}
</script>

<div class="flex flex-1 flex-col px-6 py-4">
	<div class="mb-8 space-y-2">
		<p class="font-mono text-xs tracking-[0.2em] text-accent uppercase">Identity</p>
		<h2 class="text-2xl font-bold text-text-primary">What do you do?</h2>
		<p class="text-sm text-text-secondary">
			Your profession shapes your cognitive demands. We'll optimize accordingly.
		</p>
	</div>

	<div class="grid flex-1 grid-cols-2 content-start gap-3">
		{#each professions as [key, label] (key)}
			<button
				type="button"
				class="glass-card focus-ring flex flex-col items-center gap-2 p-4 text-center transition-all duration-200
					{onboarding.state.profession === key
					? 'glow-accent border-accent/50 bg-accent/5'
					: 'hover:border-white/15 hover:bg-white/3'}"
				onclick={() => select(key)}
			>
				<span class="text-2xl">{PROFESSION_ICONS[key]}</span>
				<span class="text-sm font-medium text-text-primary">{label}</span>
			</button>
		{/each}
	</div>
</div>

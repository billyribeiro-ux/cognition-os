<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { onboarding } from '$lib/stores/onboarding.svelte';
	import { PEAK_HOUR_HINTS } from '$lib/constants/protocol';
	import Button from '$lib/components/ui/Button.svelte';
	import type { TimeRange } from '$lib/types';

	const presets: { label: string; ranges: TimeRange[] }[] = [
		{ label: 'Morning (8-11 AM)', ranges: [{ start: '08:00', end: '11:00' }] },
		{ label: 'Late Morning (10 AM-1 PM)', ranges: [{ start: '10:00', end: '13:00' }] },
		{ label: 'Afternoon (1-4 PM)', ranges: [{ start: '13:00', end: '16:00' }] },
		{
			label: 'Split (9-11 AM + 2-4 PM)',
			ranges: [
				{ start: '09:00', end: '11:00' },
				{ start: '14:00', end: '16:00' }
			]
		}
	];

	let selectedIndex = $state<number | null>(null);
	const profession = onboarding.state.profession ?? 'other';
	const hint = PEAK_HOUR_HINTS[profession] ?? PEAK_HOUR_HINTS['other'];

	function select(index: number) {
		selectedIndex = index;
	}

	function next() {
		const ranges =
			selectedIndex !== null ? presets[selectedIndex].ranges : [{ start: '09:00', end: '12:00' }];
		onboarding.updateField('peakHours', ranges);
		onboarding.setStep(8);
		goto(resolve('/onboarding/step-8'));
	}
</script>

<div class="flex flex-1 flex-col px-6 py-4">
	<div class="mb-6 space-y-2">
		<p class="font-mono text-xs tracking-[0.2em] text-accent uppercase">Peak Performance</p>
		<h2 class="text-2xl font-bold text-text-primary">When are you sharpest?</h2>
		<p class="text-sm text-text-secondary">
			We'll protect these hours for your most demanding work.
		</p>
		<p class="text-xs text-accent/70 italic">{hint}</p>
	</div>

	<div class="flex flex-1 flex-col content-start gap-3">
		{#each presets as preset, i (preset.label)}
			<button
				type="button"
				class="glass-card focus-ring p-4 text-left transition-all duration-200
					{selectedIndex === i
					? 'glow-accent border-accent/50 bg-accent/5'
					: 'hover:border-white/15 hover:bg-white/3'}"
				onclick={() => select(i)}
			>
				<span class="text-base font-medium text-text-primary">{preset.label}</span>
				<span class="mt-1 block text-xs text-text-tertiary">
					{preset.ranges.map((r) => `${r.start} – ${r.end}`).join(' & ')}
				</span>
			</button>
		{/each}
	</div>

	<div class="pt-4 pb-6">
		<Button fullWidth size="lg" onclick={next} disabled={selectedIndex === null}>CONTINUE →</Button>
	</div>
</div>

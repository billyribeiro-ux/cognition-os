<script lang="ts">
	import { goto } from '$app/navigation';
	import { onboarding } from '$lib/stores/onboarding.svelte';
	import TimePicker from '$lib/components/ui/TimePicker.svelte';
	import Slider from '$lib/components/ui/Slider.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	let coffeeBreakTime = $state(onboarding.state.coffeeBreakTime ?? '10:30');
	let lunchBreakTime = $state(onboarding.state.lunchBreakTime ?? '12:30');
	let lunchDurationMin = $state(onboarding.state.lunchDurationMin ?? 45);

	function next() {
		onboarding.updateField('coffeeBreakTime', coffeeBreakTime);
		onboarding.updateField('lunchBreakTime', lunchBreakTime);
		onboarding.updateField('lunchDurationMin', lunchDurationMin);
		onboarding.setStep(7);
		goto('/onboarding/step-7');
	}
</script>

<div class="flex flex-1 flex-col px-6 py-4">
	<div class="mb-6 space-y-2">
		<p class="font-mono text-xs tracking-[0.2em] text-accent uppercase">Breaks</p>
		<h2 class="text-2xl font-bold text-text-primary">When are your breaks?</h2>
		<p class="text-sm text-text-secondary">
			We'll schedule hydration checks and micro-activities around your breaks.
		</p>
	</div>

	<div class="flex flex-1 flex-col gap-6 overflow-y-auto">
		<div class="glass-card space-y-3 p-4">
			<p class="text-sm font-medium text-text-primary">Morning Coffee Break</p>
			<TimePicker value={coffeeBreakTime} onchange={(v) => (coffeeBreakTime = v)} />
		</div>

		<div class="glass-card space-y-3 p-4">
			<p class="text-sm font-medium text-text-primary">Lunch Break</p>
			<TimePicker value={lunchBreakTime} onchange={(v) => (lunchBreakTime = v)} />
			<Slider
				min={15}
				max={90}
				step={5}
				value={lunchDurationMin}
				onchange={(v) => (lunchDurationMin = v)}
				label="Lunch Duration"
				formatValue={(v) => `${v} min`}
			/>
		</div>
	</div>

	<div class="pt-4 pb-6">
		<Button fullWidth size="lg" onclick={next}>CONTINUE →</Button>
	</div>
</div>

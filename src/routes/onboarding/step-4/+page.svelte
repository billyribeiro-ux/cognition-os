<script lang="ts">
	import { goto } from '$app/navigation';
	import { onboarding } from '$lib/stores/onboarding.svelte';
	import TimePicker from '$lib/components/ui/TimePicker.svelte';
	import Slider from '$lib/components/ui/Slider.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	let bedTime = $state(onboarding.state.bedTime ?? '22:00');
	let sleepHours = $state(onboarding.state.sleepHours ?? 7.5);

	function next() {
		onboarding.updateField('bedTime', bedTime);
		onboarding.updateField('sleepHours', sleepHours);
		onboarding.setStep(5);
		goto('/onboarding/step-5');
	}
</script>

<div class="flex flex-1 flex-col px-6 py-4">
	<div class="mb-8 space-y-2">
		<p class="font-mono text-xs tracking-[0.2em] text-accent uppercase">Sleep</p>
		<h2 class="text-2xl font-bold text-text-primary">When do you go to bed?</h2>
		<p class="text-sm text-text-secondary">
			Sleep is the foundation. Your wind-down protocol starts 60 minutes before bed.
		</p>
	</div>

	<div class="flex flex-1 flex-col items-center gap-8">
		<TimePicker value={bedTime} onchange={(v) => (bedTime = v)} label="Target Bedtime" />

		<div class="w-full max-w-sm">
			<Slider
				min={4}
				max={10}
				step={0.5}
				value={sleepHours}
				onchange={(v) => (sleepHours = v)}
				label="Hours of Sleep"
				formatValue={(v) => `${v} hours`}
				trackColorFn={(v) => {
					if (v < 6) return 'var(--color-danger)';
					if (v < 7) return 'var(--color-warning)';
					if (v <= 9) return 'var(--color-success)';
					return 'var(--color-info)';
				}}
			/>
			<p class="mt-2 text-center text-xs text-text-tertiary">
				{#if sleepHours < 6}
					Dangerously low. Cognitive function drops 30%+ below 6 hours.
				{:else if sleepHours < 7}
					Below optimal. Most adults need 7-9 hours for peak performance.
				{:else if sleepHours <= 9}
					Optimal range for cognitive performance and recovery.
				{:else}
					Above average. Make sure you're not oversleeping.
				{/if}
			</p>
		</div>
	</div>

	<div class="pt-4 pb-6">
		<Button fullWidth size="lg" onclick={next}>CONTINUE →</Button>
	</div>
</div>

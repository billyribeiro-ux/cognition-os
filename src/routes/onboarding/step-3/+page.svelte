<script lang="ts">
	import { goto } from '$app/navigation';
	import { onboarding } from '$lib/stores/onboarding.svelte';
	import TimePicker from '$lib/components/ui/TimePicker.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	let wakeTime = $state(onboarding.state.wakeTime ?? '06:00');

	function next() {
		onboarding.updateField('wakeTime', wakeTime);
		onboarding.setStep(4);
		goto('/onboarding/step-4');
	}
</script>

<div class="flex flex-1 flex-col px-6 py-4">
	<div class="mb-8 space-y-2">
		<p class="font-mono text-xs tracking-[0.2em] text-accent uppercase">Wake Time</p>
		<h2 class="text-2xl font-bold text-text-primary">When do you wake up?</h2>
		<p class="text-sm text-text-secondary">
			Your morning activation protocol starts the moment you open your eyes.
		</p>
	</div>

	<div class="flex flex-1 flex-col items-center justify-center">
		<TimePicker value={wakeTime} onchange={(v) => (wakeTime = v)} />
	</div>

	<div class="pt-4 pb-6">
		<Button fullWidth size="lg" onclick={next}>CONTINUE →</Button>
	</div>
</div>

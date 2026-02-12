<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { onboarding } from '$lib/stores/onboarding.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	function start() {
		onboarding.setStep(1);
		goto(resolve('/onboarding/step-1'));
	}
</script>

<div class="flex flex-1 flex-col items-center justify-center gap-8 px-6 text-center">
	<div class="space-y-2">
		<p class="font-mono text-xs tracking-[0.3em] text-accent uppercase">System Initialization</p>
		<h1 class="text-4xl leading-tight font-bold sm:text-5xl">
			<span class="bg-gradient-to-r from-white to-accent bg-clip-text text-transparent">
				COGNITION OS
			</span>
		</h1>
		<p class="mx-auto max-w-md text-lg text-text-secondary">
			The cognitive performance operating system for high-performers.
		</p>
	</div>

	<div class="max-w-xs space-y-3 text-sm text-text-tertiary">
		<p>10 questions. 3 minutes.</p>
		<p>We'll build your personalized cognitive protocol.</p>
	</div>

	<Button size="lg" onclick={start} class="min-w-[200px]">BEGIN CALIBRATION →</Button>

	<p class="text-xs text-text-tertiary">Your answers shape your protocol. Be honest.</p>
</div>

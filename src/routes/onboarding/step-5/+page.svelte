<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { onboarding } from '$lib/stores/onboarding.svelte';
	import TimePicker from '$lib/components/ui/TimePicker.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	let workStart = $state(onboarding.state.workStart ?? '08:00');
	let workEnd = $state(onboarding.state.workEnd ?? '17:00');
	let showEnd = $state(false);

	function next() {
		onboarding.updateField('workStart', workStart);
		onboarding.updateField('workEnd', workEnd);
		const startMin = parseInt(workStart.split(':')[0]) * 60 + parseInt(workStart.split(':')[1]);
		const endMin = parseInt(workEnd.split(':')[0]) * 60 + parseInt(workEnd.split(':')[1]);
		const hours = Math.round(((endMin - startMin) / 60) * 10) / 10;
		onboarding.updateField('workHours', Math.max(1, hours));
		onboarding.setStep(6);
		goto(resolve('/onboarding/step-6'));
	}
</script>

<div class="flex flex-1 flex-col px-6 py-4">
	<div class="mb-8 space-y-2">
		<p class="font-mono text-xs tracking-[0.2em] text-accent uppercase">Work Hours</p>
		<h2 class="text-2xl font-bold text-text-primary">When do you work?</h2>
		<p class="text-sm text-text-secondary">
			Pomodoro blocks are scheduled within your work window.
		</p>
	</div>

	<div class="flex flex-1 flex-col items-center gap-6">
		{#if !showEnd}
			<p class="text-sm text-text-secondary">Work starts at:</p>
			<TimePicker value={workStart} onchange={(v) => (workStart = v)} />
			<Button variant="secondary" onclick={() => (showEnd = true)}>SET END TIME →</Button>
		{:else}
			<p class="text-sm text-text-secondary">Work ends at:</p>
			<TimePicker value={workEnd} onchange={(v) => (workEnd = v)} />
		{/if}
	</div>

	{#if showEnd}
		<div class="pt-4 pb-6">
			<Button fullWidth size="lg" onclick={next}>CONTINUE →</Button>
		</div>
	{/if}
</div>

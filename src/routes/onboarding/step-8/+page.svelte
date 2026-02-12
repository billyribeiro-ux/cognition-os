<script lang="ts">
	import { goto } from '$app/navigation';
	import { onboarding } from '$lib/stores/onboarding.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Slider from '$lib/components/ui/Slider.svelte';

	type ExerciseLevel = 'regular' | 'sometimes' | 'rarely';
	type ExperienceLevel = 'regular' | 'tried' | 'never';

	let exerciseLevel = $state<ExerciseLevel>(onboarding.state.exerciseLevel ?? 'sometimes');
	let meditationLevel = $state<ExperienceLevel>(onboarding.state.meditationLevel ?? 'never');
	let coldExposureLevel = $state<ExperienceLevel>(onboarding.state.coldExposureLevel ?? 'never');
	let caffeineCups = $state(onboarding.state.caffeineCups ?? 2);

	const exerciseOptions: { key: ExerciseLevel; label: string }[] = [
		{ key: 'regular', label: 'Regular' },
		{ key: 'sometimes', label: 'Sometimes' },
		{ key: 'rarely', label: 'Rarely' }
	];

	const experienceOptions: { key: ExperienceLevel; label: string }[] = [
		{ key: 'regular', label: 'Regular' },
		{ key: 'tried', label: 'Tried it' },
		{ key: 'never', label: 'Never' }
	];

	function next() {
		onboarding.updateField('exerciseLevel', exerciseLevel);
		onboarding.updateField('meditationLevel', meditationLevel);
		onboarding.updateField('coldExposureLevel', coldExposureLevel);
		onboarding.updateField('caffeineCups', caffeineCups);
		onboarding.setStep(9);
		goto('/onboarding/step-9');
	}
</script>

<div class="flex flex-1 flex-col px-6 py-4">
	<div class="mb-6 space-y-2">
		<p class="font-mono text-xs tracking-[0.2em] text-accent uppercase">Habits</p>
		<h2 class="text-2xl font-bold text-text-primary">Current habits assessment</h2>
		<p class="text-sm text-text-secondary">No judgment. This calibrates your starting level.</p>
	</div>

	<div class="flex flex-1 flex-col gap-5 overflow-y-auto">
		<div class="glass-card space-y-3 p-4">
			<p class="text-sm font-medium text-text-primary">🏃 Exercise</p>
			<div class="flex gap-2">
				{#each exerciseOptions as opt (opt.key)}
					<button
						type="button"
						class="focus-ring flex-1 rounded-[8px] px-3 py-2 text-sm font-medium transition-all duration-200
							{exerciseLevel === opt.key
							? 'bg-accent text-bg-primary'
							: 'glass-card text-text-secondary hover:text-text-primary'}"
						onclick={() => (exerciseLevel = opt.key)}
					>
						{opt.label}
					</button>
				{/each}
			</div>
		</div>

		<div class="glass-card space-y-3 p-4">
			<p class="text-sm font-medium text-text-primary">🧘 Meditation</p>
			<div class="flex gap-2">
				{#each experienceOptions as opt (opt.key)}
					<button
						type="button"
						class="focus-ring flex-1 rounded-[8px] px-3 py-2 text-sm font-medium transition-all duration-200
							{meditationLevel === opt.key
							? 'bg-accent text-bg-primary'
							: 'glass-card text-text-secondary hover:text-text-primary'}"
						onclick={() => (meditationLevel = opt.key)}
					>
						{opt.label}
					</button>
				{/each}
			</div>
		</div>

		<div class="glass-card space-y-3 p-4">
			<p class="text-sm font-medium text-text-primary">🧊 Cold Exposure</p>
			<div class="flex gap-2">
				{#each experienceOptions as opt (opt.key)}
					<button
						type="button"
						class="focus-ring flex-1 rounded-[8px] px-3 py-2 text-sm font-medium transition-all duration-200
							{coldExposureLevel === opt.key
							? 'bg-accent text-bg-primary'
							: 'glass-card text-text-secondary hover:text-text-primary'}"
						onclick={() => (coldExposureLevel = opt.key)}
					>
						{opt.label}
					</button>
				{/each}
			</div>
		</div>

		<div class="glass-card p-4">
			<Slider
				min={0}
				max={8}
				step={1}
				value={caffeineCups}
				onchange={(v) => (caffeineCups = v)}
				label="☕ Daily Caffeine (cups)"
				formatValue={(v) => `${v} cups`}
				trackColorFn={(v) => {
					if (v <= 2) return 'var(--color-success)';
					if (v <= 4) return 'var(--color-warning)';
					return 'var(--color-danger)';
				}}
			/>
		</div>
	</div>

	<div class="pt-4 pb-6">
		<Button fullWidth size="lg" onclick={next}>CONTINUE →</Button>
	</div>
</div>

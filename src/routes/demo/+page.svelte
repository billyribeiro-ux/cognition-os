<script lang="ts">
	import { goto } from '$app/navigation';
	import type { Profession, CommitmentLevel } from '$lib/types';
	import GlassCard from '$lib/components/ui/GlassCard.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';

	type DemoStep = 'profession' | 'wake' | 'commitment' | 'preview' | 'pomodoro' | 'nback' | 'cta';

	let step = $state<DemoStep>('profession');
	let profession = $state<Profession | null>(null);
	let wakeTime = $state('06:00');
	let commitment = $state<CommitmentLevel | null>(null);

	// Pomodoro demo state
	let pomodoroSeconds = $state(120);
	let pomodoroInterval: ReturnType<typeof setInterval> | null = null;

	// N-Back demo state
	let nbackRunning = $state(false);
	let nbackRound = $state(0);
	let nbackScore = $state(0);
	let nbackTotal = $state(5);
	let nbackActiveCell = $state(-1);
	let nbackLetter = $state('');
	let nbackInterval: ReturnType<typeof setInterval> | null = null;

	const professions: { icon: string; label: string; value: Profession }[] = [
		{ icon: '🎯', label: 'Day Trader', value: 'day_trader' },
		{ icon: '📊', label: 'Swing Trader', value: 'swing_trader' },
		{ icon: '🏢', label: 'CEO / Founder', value: 'ceo' },
		{ icon: '💻', label: 'Developer', value: 'developer' },
		{ icon: '⚖️', label: 'Lawyer', value: 'lawyer' },
		{ icon: '🏥', label: 'Medical Pro', value: 'medical' },
		{ icon: '🎓', label: 'Student', value: 'student' },
		{ icon: '🔧', label: 'Other', value: 'other' }
	];

	const commitmentOptions: {
		level: CommitmentLevel;
		label: string;
		pomodoros: number;
		time: string;
		description: string;
	}[] = [
		{
			level: 'standard',
			label: 'Standard',
			pomodoros: 4,
			time: '~3.5 hrs/day',
			description: 'For those starting out'
		},
		{
			level: 'aggressive',
			label: 'Aggressive',
			pomodoros: 6,
			time: '~5 hrs/day',
			description: 'For those ready to commit'
		},
		{
			level: 'elite',
			label: 'Elite',
			pomodoros: 8,
			time: '~6.5 hrs/day',
			description: 'For those who are all-in'
		}
	];

	const DEMO_LETTERS = ['C', 'H', 'K', 'L', 'Q', 'R', 'S', 'T'];
	const GRID_CELLS = [0, 1, 2, 3, 4, 5, 6, 7, 8];

	function selectProfession(p: Profession) {
		profession = p;
		setTimeout(() => (step = 'wake'), 300);
	}

	function selectCommitment(c: CommitmentLevel) {
		commitment = c;
		setTimeout(() => (step = 'preview'), 300);
	}

	function formatPomodoroTime(s: number): string {
		const min = Math.floor(s / 60);
		const sec = s % 60;
		return `${min}:${String(sec).padStart(2, '0')}`;
	}

	function startPomodoro() {
		step = 'pomodoro';
		pomodoroSeconds = 120;
		pomodoroInterval = setInterval(() => {
			pomodoroSeconds -= 1;
			if (pomodoroSeconds <= 0) {
				if (pomodoroInterval) clearInterval(pomodoroInterval);
				step = 'cta';
			}
		}, 1000);
	}

	function startNBack() {
		step = 'nback';
		nbackRunning = true;
		nbackRound = 0;
		nbackScore = 0;
		nbackActiveCell = -1;
		nbackLetter = '';

		function nextRound() {
			if (nbackRound >= nbackTotal) {
				nbackRunning = false;
				nbackActiveCell = -1;
				nbackLetter = '';
				step = 'cta';
				return;
			}
			nbackActiveCell = Math.floor(Math.random() * 9);
			nbackLetter = DEMO_LETTERS[Math.floor(Math.random() * DEMO_LETTERS.length)];
			nbackRound += 1;

			// Random score for demo
			if (Math.random() > 0.3) nbackScore += 1;

			setTimeout(() => {
				nbackActiveCell = -1;
				nbackLetter = '';
				setTimeout(nextRound, 500);
			}, 1500);
		}

		setTimeout(nextRound, 500);
	}

	function cleanup() {
		if (pomodoroInterval) clearInterval(pomodoroInterval);
		if (nbackInterval) clearInterval(nbackInterval);
	}

	$effect(() => {
		return cleanup;
	});
</script>

<svelte:head>
	<title>Try Cognition OS — Interactive Demo</title>
</svelte:head>

<div class="flex min-h-dvh flex-col bg-bg-primary">
	<!-- Header -->
	<div class="flex items-center justify-between px-4 py-3">
		<a href="/" class="text-sm text-text-tertiary transition-colors hover:text-text-secondary"
			>← Back</a
		>
		<Badge variant="warning" label="DEMO MODE" />
	</div>

	<div class="flex flex-1 flex-col items-center justify-center px-4 py-8">
		<!-- Step: Profession -->
		{#if step === 'profession'}
			<div class="w-full max-w-md space-y-6 text-center">
				<h1 class="text-2xl font-bold text-text-primary">What do you do?</h1>
				<p class="text-sm text-text-tertiary">This shapes your protocol.</p>
				<div class="grid grid-cols-2 gap-3">
					{#each professions as p (p.value)}
						<button
							type="button"
							class="glass-card flex flex-col items-center gap-2 rounded-[16px] p-4 transition-all hover:scale-[1.02] active:scale-[0.98]
								{profession === p.value ? 'ring-2 ring-accent' : ''}"
							onclick={() => selectProfession(p.value)}
						>
							<span class="text-2xl">{p.icon}</span>
							<span class="text-sm font-medium text-text-primary">{p.label}</span>
						</button>
					{/each}
				</div>
			</div>

			<!-- Step: Wake Time -->
		{:else if step === 'wake'}
			<div class="w-full max-w-xs space-y-6 text-center">
				<h1 class="text-2xl font-bold text-text-primary">When do you wake up?</h1>
				<GlassCard padding="lg">
					<input
						type="time"
						bind:value={wakeTime}
						class="w-full bg-transparent text-center font-mono text-4xl text-accent outline-none"
					/>
				</GlassCard>
				<Button fullWidth onclick={() => (step = 'commitment')}>Continue →</Button>
			</div>

			<!-- Step: Commitment -->
		{:else if step === 'commitment'}
			<div class="w-full max-w-md space-y-6 text-center">
				<h1 class="text-2xl font-bold text-text-primary">How hard do you want to go?</h1>
				<div class="space-y-3">
					{#each commitmentOptions as opt (opt.level)}
						<button
							type="button"
							class="glass-card flex w-full items-center gap-4 rounded-[16px] p-4 text-left transition-all hover:scale-[1.01] active:scale-[0.99]
								{commitment === opt.level ? 'ring-2 ring-accent' : ''}
								{opt.level === 'aggressive' ? 'ring-1 ring-accent/30' : ''}"
							onclick={() => selectCommitment(opt.level)}
						>
							<div class="flex-1">
								<div class="flex items-center gap-2">
									<span class="text-sm font-bold text-text-primary">{opt.label}</span>
									{#if opt.level === 'aggressive'}
										<Badge variant="info" label="RECOMMENDED" size="sm" />
									{/if}
								</div>
								<p class="text-xs text-text-tertiary">{opt.pomodoros} pomodoros/day • {opt.time}</p>
								<p class="text-xs text-text-secondary">{opt.description}</p>
							</div>
						</button>
					{/each}
				</div>
			</div>

			<!-- Step: Preview -->
		{:else if step === 'preview'}
			<div class="w-full max-w-md space-y-6 text-center">
				<h1 class="text-2xl font-bold text-text-primary">Your Protocol Preview</h1>
				<p class="text-sm text-text-secondary">
					This is YOUR personalized protocol. Want to try a session?
				</p>

				<GlassCard padding="md">
					<div class="space-y-2 text-left">
						<div class="flex items-center gap-3 py-1">
							<span>☀️</span>
							<div class="flex-1">
								<p class="text-sm text-text-primary">Morning Activation</p>
								<p class="text-xs text-text-tertiary">{wakeTime} • 5 min</p>
							</div>
						</div>
						<div class="flex items-center gap-3 py-1">
							<span>🍅</span>
							<div class="flex-1">
								<p class="text-sm text-text-primary">Pomodoro Block 1</p>
								<p class="text-xs text-text-tertiary">
									{commitment === 'elite' ? '4' : commitment === 'aggressive' ? '3' : '2'} sessions •
									25 min each
								</p>
							</div>
						</div>
						<div class="flex items-center gap-3 py-1">
							<span>🧠</span>
							<div class="flex-1">
								<p class="text-sm text-text-primary">N-Back Training</p>
								<p class="text-xs text-text-tertiary">Cognitive enhancement • 15 min</p>
							</div>
						</div>
						<div class="flex items-center gap-3 py-1">
							<span>📚</span>
							<div class="flex-1">
								<p class="text-sm text-text-primary">SRS Review</p>
								<p class="text-xs text-text-tertiary">Spaced repetition • 15 min</p>
							</div>
						</div>
						<div class="flex items-center gap-3 py-1">
							<span>🌙</span>
							<div class="flex-1">
								<p class="text-sm text-text-primary">Evening Consolidation</p>
								<p class="text-xs text-text-tertiary">Journal + recall • 10 min</p>
							</div>
						</div>
					</div>
				</GlassCard>

				<div class="flex gap-3">
					<Button fullWidth onclick={startPomodoro}>TRY A POMODORO →</Button>
					<Button fullWidth variant="secondary" onclick={startNBack}>TRY N-BACK →</Button>
				</div>
			</div>

			<!-- Step: Pomodoro Demo -->
		{:else if step === 'pomodoro'}
			<div class="w-full max-w-xs space-y-8 text-center">
				<p class="font-mono text-xs tracking-[0.2em] text-text-tertiary uppercase">Demo Pomodoro</p>

				<div class="relative mx-auto flex h-48 w-48 items-center justify-center">
					<svg viewBox="0 0 120 120" class="absolute inset-0 h-full w-full -rotate-90">
						<circle
							cx="60"
							cy="60"
							r="54"
							fill="none"
							stroke="rgba(255,255,255,0.05)"
							stroke-width="6"
						/>
						<circle
							cx="60"
							cy="60"
							r="54"
							fill="none"
							stroke="var(--color-accent)"
							stroke-width="6"
							stroke-linecap="round"
							stroke-dasharray={2 * Math.PI * 54}
							stroke-dashoffset={2 * Math.PI * 54 * (pomodoroSeconds / 120)}
							class="transition-all duration-1000 ease-linear"
						/>
					</svg>
					<span class="font-mono text-4xl text-text-primary"
						>{formatPomodoroTime(pomodoroSeconds)}</span
					>
				</div>

				<p class="text-sm text-text-secondary">Focus on your task. No distractions.</p>

				<Button
					variant="ghost"
					onclick={() => {
						cleanup();
						step = 'cta';
					}}>Skip Demo →</Button
				>
			</div>

			<!-- Step: N-Back Demo -->
		{:else if step === 'nback'}
			<div class="w-full max-w-xs space-y-6 text-center">
				<div class="flex items-center justify-between">
					<p class="font-mono text-xs text-accent">N-BACK LEVEL: 2</p>
					<p class="font-mono text-xs text-text-secondary">Round {nbackRound}/{nbackTotal}</p>
				</div>

				<!-- 3x3 Grid -->
				<div class="mx-auto grid w-fit grid-cols-3 gap-2">
					{#each GRID_CELLS as i (i)}
						<div
							class="flex h-16 w-16 items-center justify-center rounded-[8px] transition-all duration-200
								{nbackActiveCell === i ? 'scale-105 bg-accent shadow-lg shadow-accent/30' : 'bg-bg-tertiary'}"
						></div>
					{/each}
				</div>

				{#if nbackLetter}
					<p class="font-mono text-2xl text-accent">🔊 {nbackLetter}</p>
				{:else}
					<p class="font-mono text-2xl text-transparent">🔊 -</p>
				{/if}

				{#if !nbackRunning && nbackRound > 0}
					<p class="text-sm text-text-secondary">Score: {nbackScore}/{nbackTotal}</p>
				{/if}

				<Button
					variant="ghost"
					onclick={() => {
						cleanup();
						step = 'cta';
					}}>Skip Demo →</Button
				>
			</div>

			<!-- Step: CTA -->
		{:else if step === 'cta'}
			<div class="w-full max-w-md space-y-8 text-center">
				<h1 class="text-2xl font-bold text-text-primary">
					YOU JUST EXPERIENCED 2% OF COGNITION OS.
				</h1>

				<div class="space-y-3 text-left">
					{#each ['Personalized daily protocols', 'Dual N-Back cognitive training', 'Spaced repetition memory system', 'Advanced analytics dashboard', '5 progressive difficulty levels', 'Cold exposure & meditation protocols'] as feature (feature)}
						<div class="flex items-center gap-3">
							<span class="text-success">✓</span>
							<span class="text-sm text-text-secondary">{feature}</span>
						</div>
					{/each}
				</div>

				<div class="space-y-3">
					<Button fullWidth size="lg" onclick={() => goto('/onboarding')}>
						GET STARTED — 7 DAY FREE TRIAL →
					</Button>
					<p class="text-xs text-text-tertiary">No credit card required</p>
				</div>
			</div>
		{/if}
	</div>
</div>

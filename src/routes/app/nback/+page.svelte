<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { nback } from '$lib/stores/nback.svelte';
	import { NBACK_GRID_SIZE } from '$lib/constants/nback-config';
	import GlassCard from '$lib/components/ui/GlassCard.svelte';
	import ProgressRing from '$lib/components/ui/ProgressRing.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';

	const gridCells = Array.from({ length: NBACK_GRID_SIZE * NBACK_GRID_SIZE }, (_, i) => i);

	onMount(() => {
		return () => {
			if (nback.phase !== 'results') {
				nback.reset();
			}
		};
	});

	function handleKeydown(e: KeyboardEvent) {
		if (nback.phase !== 'playing') return;
		if (e.key === 'a' || e.key === 'A') {
			nback.pressPosition();
		} else if (e.key === 'l' || e.key === 'L') {
			nback.pressAudio();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="flex flex-1 flex-col px-4 py-4">
	<!-- Idle / Start Screen -->
	{#if nback.phase === 'idle'}
		<div class="flex flex-1 flex-col items-center justify-center gap-6 text-center">
			<div class="space-y-2">
				<p class="font-mono text-xs tracking-[0.3em] text-accent uppercase">Dual N-Back</p>
				<h1 class="text-4xl font-bold text-text-primary">
					{nback.nLevel}-Back
				</h1>
				<p class="mx-auto max-w-xs text-sm text-text-secondary">
					Match the position and letter from {nback.nLevel} steps ago.
				</p>
			</div>

			<GlassCard padding="md" class="w-full max-w-xs space-y-3">
				<div class="flex justify-between text-sm">
					<span class="text-text-secondary">Level</span>
					<span class="font-mono text-text-primary">{nback.nLevel}-Back</span>
				</div>
				<div class="flex justify-between text-sm">
					<span class="text-text-secondary">Rounds</span>
					<span class="font-mono text-text-primary">{nback.totalRounds}</span>
				</div>
				<div class="flex justify-between text-sm">
					<span class="text-text-secondary">Controls</span>
					<span class="font-mono text-xs text-text-tertiary">A = Position · L = Audio</span>
				</div>
			</GlassCard>

			<Button size="lg" onclick={() => nback.startSession()} class="min-w-[200px]">
				START SESSION
			</Button>

			<Button variant="ghost" size="sm" onclick={() => goto(resolve('/app'))}>
				Back to Dashboard
			</Button>
		</div>
	{/if}

	<!-- Countdown -->
	{#if nback.phase === 'countdown'}
		<div class="flex flex-1 items-center justify-center">
			<div class="text-center">
				<p class="animate-pulse-accent font-mono text-8xl font-bold text-accent">
					{nback.countdownValue}
				</p>
				<p class="mt-4 text-sm text-text-secondary">Get ready...</p>
			</div>
		</div>
	{/if}

	<!-- Playing -->
	{#if nback.phase === 'playing'}
		<!-- Progress bar -->
		<div class="mb-4">
			<div class="mb-1 flex items-center justify-between">
				<span class="font-mono text-xs text-accent">{nback.nLevel}-BACK</span>
				<span class="font-mono text-xs text-text-tertiary">
					{nback.currentRoundIndex + 1}/{nback.totalRounds}
				</span>
			</div>
			<div class="h-1 overflow-hidden rounded-full bg-bg-tertiary">
				<div
					class="h-full rounded-full bg-accent transition-all duration-300"
					style="width: {nback.progress}%"
				></div>
			</div>
		</div>

		<!-- Letter display -->
		<div class="mb-4 text-center">
			{#if nback.currentRound}
				<span class="font-mono text-5xl font-bold text-text-primary">
					{nback.currentRound.letter}
				</span>
			{/if}
		</div>

		<!-- Grid -->
		<div class="mb-6 flex justify-center">
			<div
				class="grid gap-2"
				style="grid-template-columns: repeat({NBACK_GRID_SIZE}, 1fr); width: {NBACK_GRID_SIZE *
					72}px;"
			>
				{#each gridCells as cellIndex (cellIndex)}
					{@const isActive = nback.currentRound?.position === cellIndex}
					<div
						class="h-16 w-16 rounded-[8px] border transition-all duration-200
							{isActive
							? 'border-accent/50 bg-accent shadow-[0_0_20px_rgba(0,212,255,0.3)]'
							: 'border-white/5 bg-bg-tertiary/30'}"
					></div>
				{/each}
			</div>
		</div>

		<!-- Feedback flash -->
		{#if nback.feedbackType}
			<div class="mb-2 text-center">
				<span
					class="font-mono text-xs {nback.feedbackType === 'correct'
						? 'text-success'
						: 'text-danger'}"
				>
					{nback.feedbackType === 'correct' ? '✓ CORRECT' : '✗ INCORRECT'}
				</span>
			</div>
		{/if}

		<!-- Response buttons -->
		<div class="mt-auto flex justify-center gap-4 pb-6">
			<button
				type="button"
				class="focus-ring max-w-[160px] flex-1 rounded-[12px] py-4 text-center text-sm font-bold transition-all duration-150
					{nback.userPressedPosition
					? 'scale-95 bg-accent text-bg-primary'
					: 'glass-card text-text-primary hover:bg-accent/10 active:scale-95'}"
				onclick={() => nback.pressPosition()}
			>
				<span class="mb-1 block text-2xl">📍</span>
				POSITION (A)
			</button>

			<button
				type="button"
				class="focus-ring max-w-[160px] flex-1 rounded-[12px] py-4 text-center text-sm font-bold transition-all duration-150
					{nback.userPressedAudio
					? 'scale-95 bg-accent text-bg-primary'
					: 'glass-card text-text-primary hover:bg-accent/10 active:scale-95'}"
				onclick={() => nback.pressAudio()}
			>
				<span class="mb-1 block text-2xl">🔊</span>
				AUDIO (L)
			</button>
		</div>
	{/if}

	<!-- Results -->
	{#if nback.phase === 'results'}
		{@const acc = nback.accuracy}
		<div class="flex flex-1 flex-col items-center justify-center gap-6 text-center">
			<div class="space-y-2">
				<p class="font-mono text-xs tracking-[0.3em] text-accent uppercase">Session Complete</p>
				<h2 class="text-3xl font-bold text-text-primary">{acc.overallAccuracy}%</h2>
				<p class="text-sm text-text-secondary">Overall Accuracy</p>
			</div>

			<div class="flex gap-6">
				<div class="text-center">
					<ProgressRing
						progress={acc.positionAccuracy}
						size={80}
						strokeWidth={6}
						color="var(--color-accent)"
						label="{acc.positionAccuracy}%"
					/>
					<p class="mt-2 text-xs text-text-tertiary">Position</p>
				</div>
				<div class="text-center">
					<ProgressRing
						progress={acc.audioAccuracy}
						size={80}
						strokeWidth={6}
						color="var(--color-level-2)"
						label="{acc.audioAccuracy}%"
					/>
					<p class="mt-2 text-xs text-text-tertiary">Audio</p>
				</div>
			</div>

			<GlassCard padding="md" class="w-full max-w-xs space-y-2">
				<div class="flex justify-between text-sm">
					<span class="text-text-secondary">Level</span>
					<span class="font-mono text-text-primary">{nback.nLevel}-Back</span>
				</div>
				<div class="flex justify-between text-sm">
					<span class="text-text-secondary">Position</span>
					<span class="font-mono text-text-primary">
						{nback.positionCorrect}✓ / {nback.positionIncorrect}✗
					</span>
				</div>
				<div class="flex justify-between text-sm">
					<span class="text-text-secondary">Audio</span>
					<span class="font-mono text-text-primary">
						{nback.audioCorrect}✓ / {nback.audioIncorrect}✗
					</span>
				</div>
				{#if acc.overallAccuracy >= 80}
					<Badge variant="success" label="LEVEL UP! → {nback.nLevel}-Back" />
				{:else if acc.overallAccuracy < 50}
					<Badge variant="danger" label="LEVEL DOWN → {nback.nLevel}-Back" />
				{:else}
					<Badge variant="info" label="LEVEL MAINTAINED: {nback.nLevel}-Back" />
				{/if}
			</GlassCard>

			<div class="flex gap-3">
				<Button variant="secondary" onclick={() => goto(resolve('/app'))}>Dashboard</Button>
				<Button
					onclick={() => {
						nback.reset();
						nback.startSession();
					}}
				>
					Play Again
				</Button>
			</div>
		</div>
	{/if}
</div>

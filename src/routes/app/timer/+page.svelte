<script lang="ts">
	import { onMount } from 'svelte';
	import { goto, beforeNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import { timer, type TimerMode } from '$lib/stores/timer.svelte';
	import { protocol } from '$lib/stores/protocol.svelte';
	import { playCompletionChime, vibrate } from '$lib/utils/audio';
	import { toast } from '$lib/stores/toast.svelte';
	import { DAILY_WATER_TARGET_OZ } from '$lib/constants/protocol';
	import ProgressRing from '$lib/components/ui/ProgressRing.svelte';
	import GlassCard from '$lib/components/ui/GlassCard.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	const VALID_MODES: TimerMode[] = [
		'pomodoro',
		'meditation',
		'exercise',
		'cold',
		'break',
		'generic'
	];

	let taskInput = $state('');
	let showTaskInput = $state(false);
	let wakeLock: WakeLockSentinel | null = null;
	let taskSwitchCount = $state(0);
	let showNavConfirm = $state(false);
	let pendingNavUrl = $state<string | null>(null);
	let startDebounce = $state(false);

	const modeColor = $derived(timer.modeColor);
	const modeLabel = $derived(timer.modeLabel);
	const modePrompt = $derived(timer.modePrompt);

	function parseMode(raw: string): TimerMode {
		return VALID_MODES.includes(raw as TimerMode) ? (raw as TimerMode) : 'generic';
	}

	function formatStartTime(ts: number | null): string {
		if (!ts) return '';
		const d = new Date(ts);
		const h = d.getHours();
		const m = d.getMinutes();
		const period = h >= 12 ? 'PM' : 'AM';
		const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h;
		return `${displayH}:${m.toString().padStart(2, '0')} ${period}`;
	}

	function requestWakeLock() {
		if ('wakeLock' in navigator) {
			navigator.wakeLock
				.request('screen')
				.then((lock) => {
					wakeLock = lock;
				})
				.catch(() => {
					/* not supported */
				});
		}
	}

	function releaseWakeLock() {
		if (wakeLock) {
			wakeLock.release();
			wakeLock = null;
		}
	}

	onMount(() => {
		const urlParams = new URLSearchParams(page.url.search);
		const itemId = urlParams.get('itemId');

		if (itemId) {
			const item = protocol.items.find((i) => i.id === itemId);
			if (item) {
				launchFromProtocol(item);
			}
		}

		return () => {
			releaseWakeLock();
		};
	});

	// Navigation guard: confirm before leaving during active timer
	beforeNavigate(({ cancel, to }) => {
		if ((timer.isRunning || timer.timerState === 'paused') && !showNavConfirm) {
			cancel();
			pendingNavUrl = to?.url.pathname ?? '/app';
			showNavConfirm = true;
		}
	});

	function confirmLeave() {
		timer.pause();
		releaseWakeLock();
		showNavConfirm = false;
		const url = pendingNavUrl ?? '/app';
		pendingNavUrl = null;
		timer.stop();
		goto(url);
	}

	function cancelLeave() {
		showNavConfirm = false;
		pendingNavUrl = null;
	}

	function launchFromProtocol(item: { id: string; type: string; duration: number }) {
		const mode = parseMode(item.type);
		if (mode === 'pomodoro' && !taskInput) {
			showTaskInput = true;
			return;
		}
		timer.start({
			mode,
			durationMinutes: item.duration,
			protocolItemId: item.id,
			task: taskInput,
			pomodoroNumber: 1,
			pomodoroTotal: protocol.items.filter((i) => i.type === 'pomodoro').length
		});
		requestWakeLock();
	}

	function launchDirect(config: {
		mode: TimerMode;
		durationMinutes: number;
		task?: string;
		pomodoroNumber?: number;
		pomodoroTotal?: number;
	}) {
		if (startDebounce) return;
		startDebounce = true;
		setTimeout(() => (startDebounce = false), 500);

		taskSwitchCount = 0;
		timer.start({
			mode: config.mode,
			durationMinutes: config.durationMinutes,
			task: config.task ?? taskInput,
			pomodoroNumber: config.pomodoroNumber ?? 1,
			pomodoroTotal: config.pomodoroTotal ?? 4
		});
		requestWakeLock();
	}

	function handleTaskSubmit() {
		if (!taskInput.trim()) return;
		showTaskInput = false;
		const pomTotal = protocol.items.filter((i) => i.type === 'pomodoro').length || 4;
		launchDirect({
			mode: 'pomodoro',
			durationMinutes: 25,
			task: taskInput,
			pomodoroNumber: 1,
			pomodoroTotal: pomTotal
		});
	}

	function handlePause() {
		timer.pause();
		releaseWakeLock();
	}

	function handleResume() {
		timer.resume();
		requestWakeLock();
	}

	function handleStop() {
		timer.stop();
		releaseWakeLock();
		toast.info('Timer stopped');
	}

	function handleSkip() {
		if (timer.mode === 'break') {
			toast.warning('Breaks cannot be skipped.');
			return;
		}
		if (timer.protocolItemId) {
			protocol.skipItem(timer.protocolItemId);
		}
		toast.info('Session skipped');
		handleStop();
	}

	function handleContinue() {
		if (timer.mode === 'pomodoro') {
			const isLong = timer.pomodoroNumber % 4 === 0;
			launchDirect({
				mode: 'break',
				durationMinutes: isLong ? 15 : 5,
				pomodoroNumber: timer.pomodoroNumber,
				pomodoroTotal: timer.pomodoroTotal
			});
		} else if (timer.mode === 'break') {
			launchDirect({
				mode: 'pomodoro',
				durationMinutes: 25,
				task: taskInput,
				pomodoroNumber: timer.pomodoroNumber + 1,
				pomodoroTotal: timer.pomodoroTotal
			});
		} else {
			goto('/app');
		}
	}

	function handleCompletionAction() {
		playCompletionChime();
		vibrate([100, 50, 100]);

		if (timer.protocolItemId) {
			protocol.completeItem(timer.protocolItemId);
		}

		if (timer.mode === 'pomodoro') {
			protocol.addWater(8);
			if (timer.pomodoroNumber >= timer.pomodoroTotal) {
				toast.success('All pomodoros complete!');
			} else {
				toast.success(`Pomodoro ${timer.pomodoroNumber} complete!`);
			}
		} else if (timer.mode === 'break') {
			toast.success('Break complete!');
		} else if (timer.mode === 'meditation') {
			toast.success('Meditation complete!');
		} else if (timer.mode === 'cold') {
			toast.success('Cold exposure complete!');
		} else if (timer.mode === 'exercise') {
			toast.success('Exercise complete! BDNF is flowing.');
		} else {
			toast.success('Session complete!');
		}
	}

	// Auto-trigger completion action when timer finishes
	$effect(() => {
		if (timer.isComplete) {
			handleCompletionAction();
		}
	});
</script>

<svelte:window
	onkeydown={(e) => {
		if (e.key === 'Escape' && timer.isRunning) {
			handleStop();
		}
	}}
/>

<!-- Task Input Overlay -->
{#if showTaskInput}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
		<GlassCard variant="elevated" padding="lg" class="w-full max-w-sm">
			<h2 class="mb-4 text-xl font-bold text-text-primary">What's your ONE task?</h2>
			<p class="mb-6 text-sm text-text-secondary">
				Single-tasking only. Your pomodoro is for ONE task.
			</p>
			<input
				type="text"
				bind:value={taskInput}
				class="focus-ring w-full rounded-[12px] border border-white/10 bg-bg-tertiary px-4 py-3 text-lg text-text-primary"
				placeholder="e.g., Review pre-market levels"
				maxlength={100}
				onkeydown={(e) => {
					if (e.key === 'Enter') handleTaskSubmit();
				}}
			/>
			<div class="mt-6 flex gap-3">
				<Button
					variant="secondary"
					onclick={() => {
						showTaskInput = false;
						goto('/app');
					}}
				>
					Cancel
				</Button>
				<Button onclick={handleTaskSubmit} disabled={!taskInput.trim()}>START TIMER</Button>
			</div>
		</GlassCard>
	</div>
{/if}

<!-- Completion Overlay -->
{#if timer.isComplete}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
		<GlassCard variant="elevated" padding="lg" class="w-full max-w-sm text-center">
			{#if timer.mode === 'pomodoro' && timer.pomodoroNumber >= timer.pomodoroTotal}
				<p class="mb-3 text-3xl">🎉</p>
				<h2 class="mb-2 text-xl font-bold text-text-primary">All Pomodoros Complete!</h2>
				<p class="mb-6 text-sm text-text-secondary">
					You've completed all {timer.pomodoroTotal} pomodoros.
				</p>
				<Button fullWidth onclick={() => goto('/app')}>BACK TO DASHBOARD</Button>
			{:else if timer.mode === 'pomodoro'}
				<p class="mb-3 text-3xl">✓</p>
				<h2 class="mb-2 text-xl font-bold text-text-primary">
					Pomodoro {timer.pomodoroNumber} Complete!
				</h2>
				<p class="mb-6 text-sm text-text-secondary">
					Time for a {timer.pomodoroNumber % 4 === 0 ? 'long' : 'short'} break.
				</p>
				<Button fullWidth onclick={handleContinue}>START BREAK</Button>
			{:else if timer.mode === 'break'}
				<p class="mb-3 text-3xl">💧</p>
				<h2 class="mb-2 text-xl font-bold text-text-primary">Break Complete!</h2>
				<p class="mb-6 text-sm text-text-secondary">
					{protocol.waterOz}/{DAILY_WATER_TARGET_OZ} oz water today.
				</p>
				<Button fullWidth onclick={handleContinue}>START NEXT POMODORO</Button>
			{:else if timer.mode === 'cold'}
				<p class="mb-3 text-3xl">🧊</p>
				<h2 class="mb-2 text-xl font-bold text-text-primary">You did it.</h2>
				<p class="mb-6 text-sm text-text-secondary">Norepinephrine +530%. Dopamine +250%.</p>
				<Button fullWidth onclick={() => goto('/app')}>CONTINUE</Button>
			{:else if timer.mode === 'exercise'}
				<p class="mb-3 text-3xl">🏃</p>
				<h2 class="mb-2 text-xl font-bold text-text-primary">Great Session!</h2>
				<p class="mb-6 text-sm text-text-secondary">
					Your next 60-90 minutes are your cognitive peak.
				</p>
				<Button fullWidth onclick={() => goto('/app')}>CONTINUE</Button>
			{:else}
				<p class="mb-3 text-3xl">✓</p>
				<h2 class="mb-2 text-xl font-bold text-text-primary">Session Complete</h2>
				<p class="mb-6 text-sm text-text-secondary">Notice how you feel.</p>
				<Button fullWidth onclick={() => goto('/app')}>CONTINUE</Button>
			{/if}
		</GlassCard>
	</div>
{/if}

<!-- Timer Screen -->
{#if !showTaskInput && !timer.isComplete}
	<div class="flex min-h-dvh flex-col">
		<!-- Status Bar -->
		<div class="flex items-center justify-between px-4 pt-4 pb-2">
			<span class="font-mono text-xs tracking-[0.2em] uppercase" style="color: {modeColor};">
				{modeLabel}
			</span>
			{#if timer.startedAt}
				<span class="font-mono text-xs text-text-tertiary">
					Started {formatStartTime(timer.startedAt)}
				</span>
			{/if}
		</div>

		<!-- Timer Ring -->
		<div class="flex flex-1 items-center justify-center px-4 py-8">
			<ProgressRing
				progress={timer.progress}
				size={280}
				strokeWidth={10}
				color={modeColor}
				showLabel={true}
				label={timer.displayTime}
			/>
		</div>

		<!-- Task Description & Prompt -->
		<div class="mb-6 space-y-2 px-6 text-center">
			{#if taskInput && timer.mode === 'pomodoro'}
				<p class="text-lg font-medium text-text-primary">{taskInput}</p>
			{/if}
			{#if modePrompt}
				<p class="text-sm text-text-secondary">{modePrompt}</p>
			{/if}
		</div>

		<!-- Controls -->
		<div class="flex items-center justify-center gap-4 px-6 pb-8">
			{#if timer.isRunning}
				<Button variant="secondary" onclick={handlePause}>PAUSE</Button>
				<Button variant="ghost" onclick={handleSkip}>SKIP</Button>
			{:else if timer.timerState === 'paused'}
				<Button onclick={handleResume}>RESUME</Button>
				<Button variant="danger" onclick={handleStop}>STOP</Button>
			{:else}
				<Button variant="secondary" onclick={() => goto('/app')}>BACK</Button>
			{/if}
		</div>

		<!-- Task Switch Counter (for pomodoros) -->
		{#if timer.mode === 'pomodoro' && timer.isRunning}
			<div class="px-4 pb-2 text-center">
				<button
					type="button"
					class="inline-flex items-center gap-2 rounded-full bg-bg-tertiary/50 px-3 py-1.5 text-xs transition-all hover:bg-bg-tertiary active:scale-95"
					onclick={() => {
						taskSwitchCount += 1;
						toast.warning(`Task switch #${taskSwitchCount}`);
					}}
				>
					<span class="text-text-tertiary">Task switches:</span>
					<span class="font-mono {taskSwitchCount > 2 ? 'text-danger' : 'text-text-primary'}"
						>{taskSwitchCount}</span
					>
					<span class="text-text-tertiary">(target: &lt; 2)</span>
					<span class="ml-1 rounded bg-danger/20 px-1.5 py-0.5 text-[10px] font-bold text-danger"
						>+ Switch</span
					>
				</button>
			</div>
		{/if}

		<!-- Water Counter (for breaks) -->
		{#if timer.mode === 'break'}
			<div class="px-4 pb-6 text-center">
				<GlassCard padding="sm" class="inline-flex items-center gap-3">
					<span class="text-2xl">💧</span>
					<div class="text-left">
						<p class="text-sm text-text-secondary">Hydration</p>
						<p class="text-xs text-text-tertiary">
							{protocol.waterOz} / {DAILY_WATER_TARGET_OZ} oz today
						</p>
					</div>
					<Button size="sm" variant="secondary" onclick={() => protocol.addWater(8)}>+8oz</Button>
				</GlassCard>
			</div>
		{/if}
	</div>
{/if}

<!-- Navigation Confirmation Dialog -->
{#if showNavConfirm}
	<div class="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 px-4">
		<GlassCard variant="elevated" padding="lg" class="w-full max-w-xs text-center">
			<p class="mb-2 text-2xl">⏱️</p>
			<h3 class="mb-2 text-lg font-bold text-text-primary">Timer is running</h3>
			<p class="mb-6 text-sm text-text-secondary">Leave anyway? The timer will be stopped.</p>
			<div class="flex justify-center gap-3">
				<Button variant="secondary" onclick={cancelLeave}>Stay</Button>
				<Button onclick={confirmLeave}>Leave</Button>
			</div>
		</GlassCard>
	</div>
{/if}

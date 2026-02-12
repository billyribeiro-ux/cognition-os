<script lang="ts">
	import { goto } from '$app/navigation';
	import { settings, type AppSettings } from '$lib/stores/settings.svelte';
	import { streak } from '$lib/stores/streak.svelte';
	import { onboarding } from '$lib/stores/onboarding.svelte';
	import { toast } from '$lib/stores/toast.svelte';
	import GlassCard from '$lib/components/ui/GlassCard.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	let showResetConfirm = $state(false);
	let showReOnboard = $state(false);

	const APP_VERSION = '0.1.0';

	interface SettingToggle {
		key: keyof AppSettings;
		label: string;
		description: string;
	}

	const notificationToggles: SettingToggle[] = [
		{
			key: 'protocolReminders',
			label: 'Protocol Reminders',
			description: 'Notify when next protocol item is due'
		},
		{
			key: 'hydrationChecks',
			label: 'Hydration Checks',
			description: 'Remind to drink water during breaks'
		},
		{
			key: 'streakWarnings',
			label: 'Streak Warnings',
			description: 'Alert before streak is about to break'
		},
		{ key: 'dailySummary', label: 'Daily Summary', description: 'End-of-day performance summary' }
	];

	const systemToggles: SettingToggle[] = [
		{ key: 'soundEffects', label: 'Sound Effects', description: 'Timer chimes, N-Back audio cues' },
		{
			key: 'hapticFeedback',
			label: 'Haptic Feedback',
			description: 'Vibration on timer completion'
		}
	];

	function handleResetAll() {
		if (typeof localStorage !== 'undefined') {
			localStorage.clear();
		}
		if (typeof sessionStorage !== 'undefined') {
			sessionStorage.clear();
		}
		settings.reset();
		showResetConfirm = false;
		toast.success('All data cleared');
		goto('/');
	}

	function handleReOnboard() {
		onboarding.reset();
		showReOnboard = false;
		goto('/onboarding');
	}
</script>

<div class="flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-4">
	<div class="flex items-center justify-between">
		<h1 class="text-xl font-bold text-text-primary">Settings</h1>
		<Button variant="ghost" size="sm" onclick={() => goto('/app')}>Done</Button>
	</div>

	<!-- Notifications -->
	<GlassCard padding="md">
		<p class="mb-3 font-mono text-xs tracking-[0.2em] text-text-tertiary uppercase">
			Notifications
		</p>
		<div class="space-y-3">
			{#each notificationToggles as toggle (toggle.key)}
				<label class="flex cursor-pointer items-center justify-between gap-3">
					<div>
						<p class="text-sm text-text-primary">{toggle.label}</p>
						<p class="text-xs text-text-tertiary">{toggle.description}</p>
					</div>
					<button
						type="button"
						role="switch"
						aria-label="Toggle {toggle.label}"
						aria-checked={settings.data[toggle.key]}
						class="relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200
							{settings.data[toggle.key] ? 'bg-accent' : 'bg-bg-tertiary'}"
						onclick={() => settings.toggle(toggle.key)}
					>
						<span
							class="absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200
								{settings.data[toggle.key] ? 'translate-x-5' : 'translate-x-0'}"
						></span>
					</button>
				</label>
			{/each}
		</div>
	</GlassCard>

	<!-- System -->
	<GlassCard padding="md">
		<p class="mb-3 font-mono text-xs tracking-[0.2em] text-text-tertiary uppercase">System</p>
		<div class="space-y-3">
			{#each systemToggles as toggle (toggle.key)}
				<label class="flex cursor-pointer items-center justify-between gap-3">
					<div>
						<p class="text-sm text-text-primary">{toggle.label}</p>
						<p class="text-xs text-text-tertiary">{toggle.description}</p>
					</div>
					<button
						type="button"
						role="switch"
						aria-label="Toggle {toggle.label}"
						aria-checked={settings.data[toggle.key]}
						class="relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200
							{settings.data[toggle.key] ? 'bg-accent' : 'bg-bg-tertiary'}"
						onclick={() => settings.toggle(toggle.key)}
					>
						<span
							class="absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200
								{settings.data[toggle.key] ? 'translate-x-5' : 'translate-x-0'}"
						></span>
					</button>
				</label>
			{/each}
		</div>
	</GlassCard>

	<!-- Account Actions -->
	<GlassCard padding="md">
		<p class="mb-3 font-mono text-xs tracking-[0.2em] text-text-tertiary uppercase">Account</p>
		<div class="space-y-3">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm text-text-primary">Current Level</p>
					<p class="text-xs text-text-tertiary">
						Level {streak.data.currentLevel}: {streak.levelName}
					</p>
				</div>
				<span class="font-mono text-sm text-accent">Day {streak.data.dayInLevel}</span>
			</div>

			<div class="border-t border-white/5 pt-3">
				<Button variant="secondary" size="sm" fullWidth onclick={() => (showReOnboard = true)}>
					Re-run Onboarding
				</Button>
			</div>

			<div class="border-t border-white/5 pt-3">
				<Button
					variant="ghost"
					size="sm"
					fullWidth
					class="text-danger hover:bg-danger/10"
					onclick={() => (showResetConfirm = true)}
				>
					Reset All Data
				</Button>
			</div>
		</div>
	</GlassCard>

	<!-- App Info -->
	<div class="py-4 text-center">
		<p class="font-mono text-xs text-text-tertiary">Cognition OS v{APP_VERSION}</p>
		<p class="mt-1 text-[10px] text-text-tertiary">Built for high-performers.</p>
	</div>

	<div class="h-4"></div>
</div>

<!-- Reset Confirmation -->
{#if showResetConfirm}
	<div class="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 px-4">
		<GlassCard variant="elevated" padding="lg" class="w-full max-w-xs text-center">
			<p class="mb-2 text-2xl">⚠️</p>
			<h3 class="mb-2 text-lg font-bold text-text-primary">Reset All Data?</h3>
			<p class="mb-6 text-sm text-text-secondary">
				This will permanently delete all your progress, streaks, and settings. This cannot be
				undone.
			</p>
			<div class="flex justify-center gap-3">
				<Button variant="secondary" onclick={() => (showResetConfirm = false)}>Cancel</Button>
				<Button onclick={handleResetAll} class="bg-danger hover:bg-danger/80"
					>Reset Everything</Button
				>
			</div>
		</GlassCard>
	</div>
{/if}

<!-- Re-Onboard Confirmation -->
{#if showReOnboard}
	<div class="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 px-4">
		<GlassCard variant="elevated" padding="lg" class="w-full max-w-xs text-center">
			<p class="mb-2 text-2xl">🔄</p>
			<h3 class="mb-2 text-lg font-bold text-text-primary">Re-run Onboarding?</h3>
			<p class="mb-6 text-sm text-text-secondary">
				This will reset your profile and take you through the onboarding flow again.
			</p>
			<div class="flex justify-center gap-3">
				<Button variant="secondary" onclick={() => (showReOnboard = false)}>Cancel</Button>
				<Button onclick={handleReOnboard}>Re-Onboard</Button>
			</div>
		</GlassCard>
	</div>
{/if}

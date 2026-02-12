<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import GlassCard from '$lib/components/ui/GlassCard.svelte';
	import ProgressRing from '$lib/components/ui/ProgressRing.svelte';
	import TimePicker from '$lib/components/ui/TimePicker.svelte';
	import Slider from '$lib/components/ui/Slider.svelte';
	import Toggle from '$lib/components/ui/Toggle.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import { toast } from '$lib/stores/toast.svelte';
	import { Home } from 'lucide-svelte';
	import Icon from '$lib/components/ui/Icon.svelte';

	let timeValue = $state('06:30');
	let sliderValue = $state(7);
	let toggleChecked = $state(false);
	let modalOpen = $state(false);
</script>

<div class="mx-auto max-w-4xl space-y-12 px-4 py-8">
	<h1 class="text-3xl font-bold text-text-primary">Component Library</h1>

	<!-- Buttons -->
	<section class="space-y-4">
		<h2 class="text-xl font-semibold text-text-secondary">Button</h2>
		<div class="flex flex-wrap gap-3">
			<Button variant="primary">Primary</Button>
			<Button variant="secondary">Secondary</Button>
			<Button variant="ghost">Ghost</Button>
			<Button variant="danger">Danger</Button>
		</div>
		<div class="flex flex-wrap gap-3">
			<Button size="sm">Small</Button>
			<Button size="md">Medium</Button>
			<Button size="lg">Large</Button>
		</div>
		<div class="flex flex-wrap gap-3">
			<Button loading={true}>Loading</Button>
			<Button disabled={true}>Disabled</Button>
			<Button fullWidth={true}>Full Width</Button>
		</div>
	</section>

	<!-- GlassCard -->
	<section class="space-y-4">
		<h2 class="text-xl font-semibold text-text-secondary">GlassCard</h2>
		<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
			<GlassCard>
				<p class="text-text-primary">Default Card</p>
				<p class="text-sm text-text-secondary">Standard glassmorphism</p>
			</GlassCard>
			<GlassCard variant="elevated">
				<p class="text-text-primary">Elevated Card</p>
				<p class="text-sm text-text-secondary">More prominent</p>
			</GlassCard>
			<GlassCard variant="interactive">
				<p class="text-text-primary">Interactive Card</p>
				<p class="text-sm text-text-secondary">Hover to see effect</p>
			</GlassCard>
		</div>
	</section>

	<!-- ProgressRing -->
	<section class="space-y-4">
		<h2 class="text-xl font-semibold text-text-secondary">ProgressRing</h2>
		<div class="flex flex-wrap items-center gap-6">
			<ProgressRing progress={25} size={80} color="var(--color-level-1)" />
			<ProgressRing progress={50} size={100} color="var(--color-level-2)" />
			<ProgressRing progress={75} size={120} color="var(--color-accent)" />
			<ProgressRing progress={100} size={80} color="var(--color-success)" label="Done" />
		</div>
	</section>

	<!-- TimePicker -->
	<section class="space-y-4">
		<h2 class="text-xl font-semibold text-text-secondary">TimePicker</h2>
		<GlassCard>
			<TimePicker value={timeValue} onchange={(v) => (timeValue = v)} label="Wake Time" />
		</GlassCard>
	</section>

	<!-- Slider -->
	<section class="space-y-4">
		<h2 class="text-xl font-semibold text-text-secondary">Slider</h2>
		<GlassCard>
			<Slider
				min={4}
				max={10}
				step={0.5}
				value={sliderValue}
				onchange={(v) => (sliderValue = v)}
				label="Sleep Hours"
				formatValue={(v) => `${v} hours`}
				trackColorFn={(v) => {
					if (v < 6) return 'var(--color-danger)';
					if (v < 7) return 'var(--color-warning)';
					if (v <= 9) return 'var(--color-success)';
					return 'var(--color-info)';
				}}
			/>
		</GlassCard>
	</section>

	<!-- Toggle -->
	<section class="space-y-4">
		<h2 class="text-xl font-semibold text-text-secondary">Toggle</h2>
		<GlassCard>
			<div class="space-y-3">
				<Toggle
					checked={toggleChecked}
					onchange={(v) => (toggleChecked = v)}
					label="Protocol Reminders"
					description="Get notified before each session"
				/>
				<Toggle checked={true} label="Hydration Checks" />
				<Toggle checked={false} disabled={true} label="Disabled Toggle" />
			</div>
		</GlassCard>
	</section>

	<!-- Badge -->
	<section class="space-y-4">
		<h2 class="text-xl font-semibold text-text-secondary">Badge</h2>
		<div class="flex flex-wrap gap-2">
			<Badge label="Default" />
			<Badge variant="success" label="Complete" />
			<Badge variant="warning" label="At Risk" />
			<Badge variant="danger" label="Missed" />
			<Badge variant="info" label="Info" />
			<Badge variant="level" level={1} label="Level 1" />
			<Badge variant="level" level={2} label="Level 2" />
			<Badge variant="level" level={3} label="Level 3" />
			<Badge variant="level" level={4} label="Level 4" />
			<Badge variant="level" level={5} label="Level 5" />
		</div>
	</section>

	<!-- Icon -->
	<section class="space-y-4">
		<h2 class="text-xl font-semibold text-text-secondary">Icon</h2>
		<div class="flex items-center gap-4">
			<Icon icon={Home} size={16} />
			<Icon icon={Home} size={24} color="var(--color-accent)" />
			<Icon icon={Home} size={32} color="var(--color-success)" />
		</div>
	</section>

	<!-- Toast -->
	<section class="space-y-4">
		<h2 class="text-xl font-semibold text-text-secondary">Toast</h2>
		<div class="flex flex-wrap gap-3">
			<Button variant="primary" onclick={() => toast.success('Protocol completed!')}>
				Success Toast
			</Button>
			<Button variant="danger" onclick={() => toast.error('Streak broken!')}>Error Toast</Button>
			<Button variant="secondary" onclick={() => toast.warning('Streak at risk')}>
				Warning Toast
			</Button>
			<Button variant="ghost" onclick={() => toast.info('New cards available')}>Info Toast</Button>
		</div>
	</section>

	<!-- Modal -->
	<section class="space-y-4">
		<h2 class="text-xl font-semibold text-text-secondary">Modal</h2>
		<Button onclick={() => (modalOpen = true)}>Open Modal</Button>
		<Modal open={modalOpen} onclose={() => (modalOpen = false)} title="Session Complete">
			<div class="space-y-4">
				<p class="text-text-secondary">Your pomodoro session has been recorded.</p>
				<div class="flex justify-center">
					<ProgressRing progress={100} color="var(--color-success)" label="Done" />
				</div>
				<Button fullWidth onclick={() => (modalOpen = false)}>Continue</Button>
			</div>
		</Modal>
	</section>
</div>

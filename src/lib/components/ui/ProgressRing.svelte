<script lang="ts">
	interface Props {
		progress?: number;
		size?: number;
		strokeWidth?: number;
		color?: string;
		showLabel?: boolean;
		label?: string;
		class?: string;
	}

	let {
		progress = 0,
		size = 120,
		strokeWidth = 8,
		color = 'var(--color-accent)',
		showLabel = true,
		label = '',
		class: className = ''
	}: Props = $props();

	const radius = $derived((size - strokeWidth) / 2);
	const circumference = $derived(2 * Math.PI * radius);
	const offset = $derived(
		circumference - (Math.min(Math.max(progress, 0), 100) / 100) * circumference
	);
	const center = $derived(size / 2);
	const displayLabel = $derived(label || `${Math.round(progress)}%`);
</script>

<div
	class="relative inline-flex items-center justify-center {className}"
	style="width: {size}px; height: {size}px;"
>
	<svg width={size} height={size} class="-rotate-90 transform" aria-hidden="true">
		<circle
			cx={center}
			cy={center}
			r={radius}
			fill="none"
			stroke="var(--color-bg-tertiary)"
			stroke-width={strokeWidth}
			opacity="0.2"
		/>
		<circle
			cx={center}
			cy={center}
			r={radius}
			fill="none"
			stroke={color}
			stroke-width={strokeWidth}
			stroke-dasharray={circumference}
			stroke-dashoffset={offset}
			stroke-linecap="round"
			class="transition-[stroke-dashoffset] duration-500 ease-out"
		/>
	</svg>
	{#if showLabel}
		<span
			class="absolute inset-0 flex items-center justify-center font-mono text-text-primary"
			style="font-size: {size * 0.18}px;"
		>
			{displayLabel}
		</span>
	{/if}
</div>

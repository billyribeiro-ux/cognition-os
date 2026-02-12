<script lang="ts">
	interface Props {
		min?: number;
		max?: number;
		step?: number;
		value?: number;
		onchange?: (value: number) => void;
		label?: string;
		showValue?: boolean;
		formatValue?: (value: number) => string;
		trackColorFn?: (value: number) => string;
		class?: string;
	}

	let {
		min = 0,
		max = 100,
		step = 1,
		value = 50,
		onchange,
		label = '',
		showValue = true,
		formatValue = (v: number) => v.toString(),
		trackColorFn,
		class: className = ''
	}: Props = $props();

	const fillPercent = $derived(((value - min) / (max - min)) * 100);
	const trackColor = $derived(trackColorFn ? trackColorFn(value) : 'var(--color-accent)');

	function handleInput(event: Event) {
		const target = event.target as HTMLInputElement;
		const newValue = parseFloat(target.value);
		onchange?.(newValue);
	}
</script>

<div class="flex w-full flex-col gap-2 {className}">
	{#if label || showValue}
		<div class="flex items-center justify-between">
			{#if label}
				<span class="text-sm text-text-secondary">{label}</span>
			{/if}
			{#if showValue}
				<span class="font-mono text-sm text-accent">{formatValue(value)}</span>
			{/if}
		</div>
	{/if}

	<div class="relative flex h-11 w-full items-center">
		<input
			type="range"
			{min}
			{max}
			{step}
			{value}
			oninput={handleInput}
			class="slider-input w-full"
			aria-label={label || 'Slider'}
			style="
				--fill: {fillPercent}%;
				--track-color: {trackColor};
			"
		/>
	</div>
</div>

<style>
	.slider-input {
		-webkit-appearance: none;
		appearance: none;
		height: 6px;
		border-radius: 9999px;
		background: linear-gradient(
			to right,
			var(--track-color) var(--fill),
			var(--color-bg-tertiary) var(--fill)
		);
		outline: none;
		cursor: pointer;
	}

	.slider-input::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background: var(--track-color);
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
		cursor: pointer;
		transition: transform 150ms ease-out;
	}

	.slider-input::-webkit-slider-thumb:active {
		transform: scale(1.2);
	}

	.slider-input::-moz-range-thumb {
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background: var(--track-color);
		border: none;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
		cursor: pointer;
	}
</style>

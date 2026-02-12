<script lang="ts">
	interface Props {
		value?: string;
		onchange?: (value: string) => void;
		label?: string;
		class?: string;
	}

	let { value = '06:00', onchange, label = '', class: className = '' }: Props = $props();

	let dragging = $state(false);
	let mode = $state<'hours' | 'minutes'>('hours');

	const SIZE = 240;
	const CENTER = SIZE / 2;
	const OUTER_RADIUS = 95;
	const INNER_RADIUS = 65;

	let hours = $derived(parseInt(value.split(':')[0], 10));
	let minutes = $derived(parseInt(value.split(':')[1], 10));
	let period = $derived(hours >= 12 ? 'PM' : 'AM');
	let displayHour = $derived(hours === 0 ? 12 : hours > 12 ? hours - 12 : hours);

	const HOUR_NUMBERS = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
	const MINUTE_MARKS = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

	function getAngle(num: number, total: number): number {
		return (num / total) * 360 - 90;
	}

	function getPosition(angle: number, radius: number): { x: number; y: number } {
		const rad = (angle * Math.PI) / 180;
		return {
			x: CENTER + radius * Math.cos(rad),
			y: CENTER + radius * Math.sin(rad)
		};
	}

	function handAngle(): number {
		if (mode === 'hours') {
			return ((displayHour % 12) / 12) * 360 - 90;
		}
		return (minutes / 60) * 360 - 90;
	}

	function handEndpoint(): { x: number; y: number } {
		const radius = mode === 'hours' ? INNER_RADIUS : OUTER_RADIUS;
		return getPosition(handAngle(), radius);
	}

	function handlePointer(event: PointerEvent) {
		const svg = (event.currentTarget as SVGSVGElement).getBoundingClientRect();
		const x = event.clientX - svg.left - CENTER;
		const y = event.clientY - svg.top - CENTER;
		let angle = Math.atan2(y, x) * (180 / Math.PI) + 90;
		if (angle < 0) angle += 360;

		if (mode === 'hours') {
			let h = Math.round(angle / 30) % 12;
			if (h === 0) h = 12;
			const newHours = period === 'PM' ? (h === 12 ? 12 : h + 12) : h === 12 ? 0 : h;
			const newValue = `${newHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
			onchange?.(newValue);
		} else {
			let m = Math.round(angle / 6) % 60;
			const newValue = `${hours.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
			onchange?.(newValue);
		}
	}

	function onPointerDown(event: PointerEvent) {
		dragging = true;
		(event.currentTarget as SVGSVGElement).setPointerCapture(event.pointerId);
		handlePointer(event);
	}

	function onPointerMove(event: PointerEvent) {
		if (!dragging) return;
		handlePointer(event);
	}

	function onPointerUp() {
		if (dragging && mode === 'hours') {
			mode = 'minutes';
		}
		dragging = false;
	}

	function togglePeriod() {
		const newHours = period === 'AM' ? hours + 12 : hours - 12;
		const clamped = ((newHours % 24) + 24) % 24;
		const newValue = `${clamped.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
		onchange?.(newValue);
	}

	function selectMode(m: 'hours' | 'minutes') {
		mode = m;
	}
</script>

<div class="flex flex-col items-center gap-4 {className}">
	{#if label}
		<span class="text-sm text-text-secondary">{label}</span>
	{/if}

	<div class="flex items-center gap-2 font-mono text-3xl text-text-primary">
		<button
			type="button"
			class="rounded px-1 transition-colors {mode === 'hours'
				? 'text-accent'
				: 'text-text-secondary hover:text-text-primary'}"
			onclick={() => selectMode('hours')}
		>
			{displayHour.toString().padStart(2, '0')}
		</button>
		<span class="text-text-tertiary">:</span>
		<button
			type="button"
			class="rounded px-1 transition-colors {mode === 'minutes'
				? 'text-accent'
				: 'text-text-secondary hover:text-text-primary'}"
			onclick={() => selectMode('minutes')}
		>
			{minutes.toString().padStart(2, '0')}
		</button>
		<button
			type="button"
			class="glass-card ml-2 rounded-[8px] px-2 py-1 text-sm text-text-secondary transition-colors hover:text-accent"
			onclick={togglePeriod}
		>
			{period}
		</button>
	</div>

	<svg
		width={SIZE}
		height={SIZE}
		class="cursor-pointer touch-none"
		role="slider"
		aria-label="Time picker"
		aria-valuemin={0}
		aria-valuemax={mode === 'hours' ? 12 : 59}
		aria-valuenow={mode === 'hours' ? displayHour : minutes}
		tabindex={0}
		onpointerdown={onPointerDown}
		onpointermove={onPointerMove}
		onpointerup={onPointerUp}
	>
		<circle cx={CENTER} cy={CENTER} r={OUTER_RADIUS + 10} fill="var(--color-bg-secondary)" />
		<circle
			cx={CENTER}
			cy={CENTER}
			r={OUTER_RADIUS + 10}
			fill="none"
			stroke="rgba(255,255,255,0.08)"
			stroke-width="1"
		/>

		{#if mode === 'hours'}
			{#each HOUR_NUMBERS as num, i (num)}
				{@const pos = getPosition(getAngle(i, 12), INNER_RADIUS)}
				<text
					x={pos.x}
					y={pos.y}
					text-anchor="middle"
					dominant-baseline="central"
					fill={displayHour === num ? 'var(--color-accent)' : 'var(--color-text-secondary)'}
					font-size="14"
					font-family="var(--font-mono)"
				>
					{num}
				</text>
			{/each}
		{:else}
			{#each MINUTE_MARKS as num, i (num)}
				{@const pos = getPosition(getAngle(i, 12), OUTER_RADIUS)}
				<text
					x={pos.x}
					y={pos.y}
					text-anchor="middle"
					dominant-baseline="central"
					fill={minutes === num ? 'var(--color-accent)' : 'var(--color-text-secondary)'}
					font-size="12"
					font-family="var(--font-mono)"
				>
					{num.toString().padStart(2, '0')}
				</text>
			{/each}
		{/if}

		<line
			x1={CENTER}
			y1={CENTER}
			x2={handEndpoint().x}
			y2={handEndpoint().y}
			stroke="var(--color-accent)"
			stroke-width="2"
			stroke-linecap="round"
			class="transition-all duration-150"
		/>
		<circle cx={CENTER} cy={CENTER} r="4" fill="var(--color-accent)" />
		<circle
			cx={handEndpoint().x}
			cy={handEndpoint().y}
			r="16"
			fill="var(--color-accent)"
			opacity="0.2"
			class="transition-all duration-150"
		/>
		<circle
			cx={handEndpoint().x}
			cy={handEndpoint().y}
			r="6"
			fill="var(--color-accent)"
			class="transition-all duration-150"
		/>
	</svg>
</div>

<script lang="ts">
	interface Props {
		value: number;
		class?: string;
	}

	let { value, class: className = '' }: Props = $props();

	const digits = $derived(String(value).split(''));
	const DIGIT_RANGE = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
</script>

<span class="inline-flex items-center {className}" aria-label={String(value)}>
	{#each digits as digit, i (i)}
		<span class="odometer-digit" style="--digit: {digit}">
			<span class="odometer-track" aria-hidden="true">
				{#each DIGIT_RANGE as n (n)}
					<span class="odometer-num">{n}</span>
				{/each}
			</span>
		</span>
	{/each}
</span>

<style>
	.odometer-digit {
		display: inline-block;
		height: 1.2em;
		overflow: hidden;
		position: relative;
		width: 0.65em;
	}

	.odometer-track {
		display: flex;
		flex-direction: column;
		transition: transform 600ms cubic-bezier(0.22, 1, 0.36, 1);
		transform: translateY(calc(var(--digit) * -1.2em));
	}

	.odometer-num {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 1.2em;
		line-height: 1;
	}
</style>

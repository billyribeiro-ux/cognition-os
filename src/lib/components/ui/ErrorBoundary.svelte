<script lang="ts">
	import type { Snippet } from 'svelte';
	import Button from './Button.svelte';

	interface Props {
		children: Snippet;
		fallback?: Snippet<[{ error: Error; reset: () => void }]>;
	}

	let { children, fallback }: Props = $props();

	let caughtError = $state<Error | null>(null);
	let boundaryReset = $state<(() => void) | null>(null);

	function handleError(e: unknown, resetFn: () => void) {
		caughtError = e instanceof Error ? e : new Error(String(e));
		boundaryReset = resetFn;
	}

	function reset() {
		caughtError = null;
		boundaryReset?.();
		boundaryReset = null;
	}
</script>

{#if caughtError && fallback}
	{@render fallback({ error: caughtError, reset })}
{:else if caughtError}
	<div class="flex flex-col items-center justify-center gap-4 px-4 py-12 text-center">
		<p class="text-2xl">⚠️</p>
		<h3 class="text-lg font-bold text-text-primary">Something went wrong</h3>
		<p class="max-w-xs text-sm text-text-secondary">{caughtError.message}</p>
		<Button variant="secondary" size="sm" onclick={reset}>Try Again</Button>
	</div>
{:else}
	<svelte:boundary onerror={handleError}>{@render children()}</svelte:boundary>
{/if}

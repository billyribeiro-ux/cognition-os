<script lang="ts">
	import type { Snippet } from 'svelte';
	import { onboarding } from '$lib/stores/onboarding.svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { ArrowLeft } from 'lucide-svelte';

	let { children }: { children: Snippet } = $props();

	const isSplash = $derived(page.url.pathname === '/onboarding');
	const showNav = $derived(!isSplash && onboarding.state.step > 0);

	function goBack() {
		onboarding.prevStep();
		const prev = onboarding.state.step;
		if (prev === 0) {
			goto(resolve('/onboarding'));
		} else {
			goto(resolve(`/onboarding/step-${prev}`));
		}
	}
</script>

<div class="relative flex min-h-dvh flex-col overflow-hidden bg-bg-primary">
	{#if showNav}
		<div class="relative z-10 flex items-center justify-between px-4 pt-4 pb-2">
			<button
				type="button"
				class="focus-ring rounded-[8px] p-2 text-text-secondary transition-colors hover:bg-bg-tertiary hover:text-text-primary"
				onclick={goBack}
				aria-label="Go back"
			>
				<ArrowLeft size={20} />
			</button>
			<span class="text-xs tracking-widest text-text-tertiary uppercase">
				Step {onboarding.state.step} of 10
			</span>
		</div>

		<div class="relative z-10 px-4 pb-4">
			<div class="h-1 overflow-hidden rounded-full bg-bg-tertiary">
				<div
					class="h-full rounded-full bg-accent transition-all duration-500 ease-out"
					style="width: {onboarding.progressPercent}%"
				></div>
			</div>
		</div>
	{/if}

	<div class="relative z-10 flex flex-1 flex-col">
		{@render children()}
	</div>
</div>

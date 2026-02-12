<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		variant?: 'default' | 'elevated' | 'interactive';
		padding?: 'none' | 'sm' | 'md' | 'lg';
		class?: string;
		children: Snippet;
	}

	let { variant = 'default', padding = 'md', class: className = '', children }: Props = $props();

	const paddingClasses: Record<string, string> = {
		none: '',
		sm: 'p-3',
		md: 'p-4',
		lg: 'p-6'
	};
</script>

{#if variant === 'interactive'}
	<div
		class="glass-card cursor-pointer transition-all duration-200 hover:scale-[1.01] hover:border-white/12 {paddingClasses[
			padding
		]} {className}"
		role="button"
		tabindex={0}
		onkeydown={(e) => {
			if (e.key === 'Enter' || e.key === ' ') e.currentTarget.click();
		}}
	>
		{@render children()}
	</div>
{:else}
	<div
		class="{variant === 'elevated' ? 'glass-card-elevated' : 'glass-card'} {paddingClasses[
			padding
		]} {className}"
	>
		{@render children()}
	</div>
{/if}

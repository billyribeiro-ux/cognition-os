<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	interface Props extends HTMLButtonAttributes {
		variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
		size?: 'sm' | 'md' | 'lg';
		loading?: boolean;
		fullWidth?: boolean;
		children: Snippet;
	}

	let {
		variant = 'primary',
		size = 'md',
		loading = false,
		fullWidth = false,
		disabled = false,
		children,
		class: className = '',
		...restProps
	}: Props = $props();

	const baseClasses =
		'inline-flex items-center justify-center font-medium transition-all duration-200 ease-out focus-ring select-none';

	const variantClasses: Record<string, string> = {
		primary: 'bg-accent text-bg-primary hover:brightness-110 active:scale-[0.97]',
		secondary:
			'glass-card border-accent/30 text-accent hover:border-accent/60 hover:bg-white/5 active:scale-[0.97]',
		ghost:
			'bg-transparent text-text-secondary hover:bg-bg-tertiary hover:text-text-primary active:scale-[0.97]',
		danger: 'bg-danger text-white hover:brightness-110 active:scale-[0.97]'
	};

	const sizeClasses: Record<string, string> = {
		sm: 'h-8 px-3 text-sm rounded-[8px] gap-1.5',
		md: 'h-10 px-4 text-base rounded-[8px] gap-2',
		lg: 'h-12 px-6 text-lg rounded-[8px] gap-2.5'
	};

	const disabledClasses = 'opacity-50 cursor-not-allowed pointer-events-none';
</script>

<button
	class="{baseClasses} {variantClasses[variant]} {sizeClasses[size]} {disabled || loading
		? disabledClasses
		: ''} {fullWidth ? 'w-full' : ''} {className}"
	disabled={disabled || loading}
	aria-busy={loading}
	{...restProps}
>
	{#if loading}
		<svg
			class="h-4 w-4 animate-spin"
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			aria-hidden="true"
		>
			<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
			></circle>
			<path
				class="opacity-75"
				fill="currentColor"
				d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
			></path>
		</svg>
	{/if}
	{@render children()}
</button>

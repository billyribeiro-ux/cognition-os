<script lang="ts">
	import type { Snippet } from 'svelte';
	import { scale, fade } from 'svelte/transition';
	import { X } from 'lucide-svelte';

	interface Props {
		open?: boolean;
		onclose?: () => void;
		title?: string;
		size?: 'sm' | 'md' | 'lg' | 'full';
		children: Snippet;
	}

	let { open = false, onclose, title = '', size = 'md', children }: Props = $props();

	const sizeClasses: Record<string, string> = {
		sm: 'max-w-sm',
		md: 'max-w-lg',
		lg: 'max-w-2xl',
		full: 'max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)]'
	};

	function handleBackdropClick(event: MouseEvent) {
		if (event.target === event.currentTarget) {
			onclose?.();
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			onclose?.();
		}
	}
</script>

<svelte:window onkeydown={open ? handleKeydown : undefined} />

{#if open}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center p-4"
		transition:fade={{ duration: 150 }}
		onclick={handleBackdropClick}
		onkeydown={handleKeydown}
		role="dialog"
		aria-modal="true"
		aria-label={title || 'Dialog'}
		tabindex={-1}
	>
		<div class="absolute inset-0 bg-black/70 backdrop-blur-sm" aria-hidden="true"></div>

		<div
			class="glass-card-elevated relative w-full {sizeClasses[size]} overflow-hidden"
			transition:scale={{ start: 0.95, duration: 200 }}
		>
			{#if title || onclose}
				<div class="flex items-center justify-between border-b border-white/8 px-6 py-4">
					{#if title}
						<h2 class="text-lg font-semibold text-text-primary">{title}</h2>
					{/if}
					{#if onclose}
						<button
							type="button"
							class="focus-ring rounded-[8px] p-1 text-text-tertiary transition-colors hover:bg-bg-tertiary hover:text-text-primary"
							onclick={onclose}
							aria-label="Close dialog"
						>
							<X size={18} />
						</button>
					{/if}
				</div>
			{/if}

			<div class="max-h-[70vh] overflow-y-auto px-6 py-4">
				{@render children()}
			</div>
		</div>
	</div>
{/if}

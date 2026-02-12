<script lang="ts">
	import { fly, fade } from 'svelte/transition';
	import { toast } from '$lib/stores/toast.svelte';
	import { CircleCheck, CircleX, AlertTriangle, Info, X } from 'lucide-svelte';

	const iconMap = {
		success: CircleCheck,
		error: CircleX,
		warning: AlertTriangle,
		info: Info
	};

	const colorMap: Record<string, string> = {
		success: 'text-success',
		error: 'text-danger',
		warning: 'text-warning',
		info: 'text-info'
	};
</script>

{#if toast.items.length > 0}
	<div
		class="fixed bottom-4 left-1/2 z-50 flex w-full max-w-sm -translate-x-1/2 flex-col gap-2 px-4
			sm:right-4 sm:bottom-4 sm:left-auto sm:translate-x-0"
		aria-live="polite"
	>
		{#each toast.items as item (item.id)}
			{@const Icon = iconMap[item.type]}
			<div
				class="glass-card-elevated flex items-center gap-3 px-4 py-3"
				in:fly={{ y: 20, duration: 200 }}
				out:fade={{ duration: 150 }}
				role="alert"
			>
				<Icon size={18} class={colorMap[item.type]} />
				<span class="flex-1 text-sm text-text-primary">{item.message}</span>
				<button
					type="button"
					class="shrink-0 text-text-tertiary transition-colors hover:text-text-primary"
					onclick={() => toast.remove(item.id)}
					aria-label="Dismiss"
				>
					<X size={14} />
				</button>
			</div>
		{/each}
	</div>
{/if}

<script lang="ts">
	interface Props {
		checked?: boolean;
		onchange?: (checked: boolean) => void;
		label?: string;
		description?: string;
		disabled?: boolean;
		class?: string;
	}

	let {
		checked = false,
		onchange,
		label = '',
		description = '',
		disabled = false,
		class: className = ''
	}: Props = $props();

	function toggle() {
		if (disabled) return;
		onchange?.(!checked);
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			toggle();
		}
	}
</script>

<div class="flex items-center gap-3 {className}">
	<button
		type="button"
		role="switch"
		aria-checked={checked}
		aria-label={label}
		{disabled}
		class="focus-ring relative inline-flex h-[22px] w-[40px] shrink-0 rounded-full transition-colors duration-200 ease-out
			{checked ? 'bg-accent' : 'bg-bg-tertiary'}
			{disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}"
		onclick={toggle}
		onkeydown={handleKeydown}
	>
		<span
			class="pointer-events-none inline-block h-[18px] w-[18px] rounded-full bg-white shadow-md transition-transform duration-200
				{checked ? 'translate-x-[20px]' : 'translate-x-[2px]'}"
			style="margin-top: 2px;"
			aria-hidden="true"
		></span>
	</button>

	{#if label || description}
		<div class="flex flex-col">
			{#if label}
				<span class="text-sm text-text-primary">{label}</span>
			{/if}
			{#if description}
				<span class="text-xs text-text-tertiary">{description}</span>
			{/if}
		</div>
	{/if}
</div>

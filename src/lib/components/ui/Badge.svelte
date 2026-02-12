<script lang="ts">
	import { LEVEL_COLORS } from '$lib/constants/levels';

	interface Props {
		variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'level';
		level?: number;
		size?: 'sm' | 'md';
		label: string;
		class?: string;
	}

	let {
		variant = 'default',
		level = 1,
		size = 'sm',
		label,
		class: className = ''
	}: Props = $props();

	const variantStyles: Record<string, string> = {
		default: 'bg-bg-tertiary text-text-secondary border-white/8',
		success: 'bg-success/15 text-success border-success/30',
		warning: 'bg-warning/15 text-warning border-warning/30',
		danger: 'bg-danger/15 text-danger border-danger/30',
		info: 'bg-info/15 text-info border-info/30',
		level: ''
	};

	const sizeClasses: Record<string, string> = {
		sm: 'px-2 py-0.5 text-xs',
		md: 'px-3 py-1 text-sm'
	};

	function getLevelStyle(): string {
		const color = LEVEL_COLORS[level] ?? LEVEL_COLORS[1];
		return `background-color: ${color}20; color: ${color}; border-color: ${color}50; box-shadow: 0 0 12px ${color}15;`;
	}
</script>

<span
	class="inline-flex items-center rounded-full border font-medium {variantStyles[
		variant
	]} {sizeClasses[size]} {className}"
	style={variant === 'level' ? getLevelStyle() : ''}
>
	{label}
</span>

<script lang="ts">
	interface Props {
		width?: string;
		height?: string;
		rounded?: 'sm' | 'md' | 'lg' | 'full';
		class?: string;
	}

	let { width = '100%', height = '1rem', rounded = 'sm', class: className = '' }: Props = $props();

	const radiusMap: Record<string, string> = {
		sm: 'rounded-[8px]',
		md: 'rounded-[12px]',
		lg: 'rounded-[16px]',
		full: 'rounded-full'
	};
</script>

<div
	class="skeleton {radiusMap[rounded]} {className}"
	style="width: {width}; height: {height};"
	aria-hidden="true"
></div>

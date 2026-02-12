<script lang="ts">
	/* eslint-disable @typescript-eslint/no-explicit-any */
	interface Props {
		icon: any;
		size?: number;
		color?: string;
		class?: string;
	}

	let {
		icon: IconComponent,
		size = 20,
		color = 'currentColor',
		class: className = ''
	}: Props = $props();
</script>

<span style="color: {color}; display: inline-flex;">
	<IconComponent {size} class={className} />
</span>

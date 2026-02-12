<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import Toast from '$lib/components/ui/Toast.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Cognition OS</title>
</svelte:head>

<main class="min-h-dvh bg-bg-primary font-display text-text-primary">
	{@render children()}
</main>

<Toast />

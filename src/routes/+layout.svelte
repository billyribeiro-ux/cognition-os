<script lang="ts">
	import { onMount } from 'svelte';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import Toast from '$lib/components/ui/Toast.svelte';
	import ErrorBoundary from '$lib/components/ui/ErrorBoundary.svelte';
	import { toast } from '$lib/stores/toast.svelte';

	let { children } = $props();
	let srAnnouncement = $state('');

	onMount(() => {
		function handleOffline() {
			toast.warning("You're offline. Some features may be unavailable.");
		}
		function handleOnline() {
			toast.success("You're back online.");
		}
		window.addEventListener('offline', handleOffline);
		window.addEventListener('online', handleOnline);

		// Expose a global function for screen reader announcements
		(window as unknown as Record<string, unknown>).__announceToSR = (msg: string) => {
			srAnnouncement = '';
			requestAnimationFrame(() => {
				srAnnouncement = msg;
			});
		};

		return () => {
			window.removeEventListener('offline', handleOffline);
			window.removeEventListener('online', handleOnline);
		};
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Cognition OS</title>
</svelte:head>

<a
	href="#main-content"
	class="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:rounded-[8px] focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-bg-primary"
>
	Skip to main content
</a>

<main id="main-content" class="min-h-dvh bg-bg-primary font-display text-text-primary">
	<ErrorBoundary>
		{@render children()}
	</ErrorBoundary>
</main>

<div class="sr-only" aria-live="polite" aria-atomic="true">{srAnnouncement}</div>

<Toast />

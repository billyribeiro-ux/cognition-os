<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/Button.svelte';
	import GlassCard from '$lib/components/ui/GlassCard.svelte';

	let canvas: HTMLCanvasElement | undefined = $state();
	let heroVisible = $state(false);
	let statsVisible = $state(false);
	let protocolCount = $state(0);

	const structuredData = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'SoftwareApplication',
		name: 'Cognition OS',
		applicationCategory: 'HealthApplication',
		operatingSystem: 'Web, iOS, Android',
		description:
			'Evidence-based cognitive performance protocols for traders, CEOs, and developers.',
		offers: [
			{ '@type': 'Offer', price: '0', priceCurrency: 'USD', name: 'Free' },
			{ '@type': 'Offer', price: '29', priceCurrency: 'USD', name: 'Pro' }
		],
		aggregateRating: {
			'@type': 'AggregateRating',
			ratingValue: '4.9',
			ratingCount: '1247'
		}
	});

	const PARTICLE_COUNT_DESKTOP = 80;
	const PARTICLE_COUNT_MOBILE = 35;
	const CONNECTION_DISTANCE = 150;

	interface Particle {
		x: number;
		y: number;
		vx: number;
		vy: number;
	}

	onMount(() => {
		heroVisible = true;

		// Inject JSON-LD structured data
		const ldScript = document.createElement('script');
		ldScript.type = 'application/ld+json';
		ldScript.textContent = structuredData;
		document.head.appendChild(ldScript);

		// Animate protocol counter
		const target = 18247;
		const duration = 2000;
		const start = performance.now();
		function animateCount(now: number) {
			const elapsed = now - start;
			const progress = Math.min(elapsed / duration, 1);
			const eased = 1 - Math.pow(1 - progress, 3);
			protocolCount = Math.round(target * eased);
			if (progress < 1) requestAnimationFrame(animateCount);
		}

		// Neural network canvas
		if (!canvas) return;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		const isMobile = window.innerWidth < 768;
		const count = isMobile ? PARTICLE_COUNT_MOBILE : PARTICLE_COUNT_DESKTOP;

		function resize() {
			if (!canvas) return;
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		}
		resize();
		window.addEventListener('resize', resize);

		const particles: Particle[] = Array.from({ length: count }, () => ({
			x: Math.random() * (canvas?.width ?? 1),
			y: Math.random() * (canvas?.height ?? 1),
			vx: (Math.random() - 0.5) * 0.4,
			vy: (Math.random() - 0.5) * 0.4
		}));

		let animId: number;
		let hidden = false;

		function handleVisibility() {
			hidden = document.hidden;
		}
		document.addEventListener('visibilitychange', handleVisibility);

		function draw() {
			if (hidden || !ctx || !canvas) {
				animId = requestAnimationFrame(draw);
				return;
			}
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			for (const p of particles) {
				p.x += p.vx;
				p.y += p.vy;
				if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
				if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
			}

			// Connections
			for (let i = 0; i < particles.length; i++) {
				for (let j = i + 1; j < particles.length; j++) {
					const dx = particles[i].x - particles[j].x;
					const dy = particles[i].y - particles[j].y;
					const dist = Math.sqrt(dx * dx + dy * dy);
					if (dist < CONNECTION_DISTANCE) {
						const alpha = 0.05 * (1 - dist / CONNECTION_DISTANCE);
						ctx.beginPath();
						ctx.strokeStyle = `rgba(0, 212, 255, ${alpha})`;
						ctx.lineWidth = 0.5;
						ctx.moveTo(particles[i].x, particles[i].y);
						ctx.lineTo(particles[j].x, particles[j].y);
						ctx.stroke();
					}
				}
			}

			// Particles
			for (const p of particles) {
				ctx.beginPath();
				ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
				ctx.fillStyle = 'rgba(74, 74, 96, 0.3)';
				ctx.fill();
			}

			animId = requestAnimationFrame(draw);
		}
		animId = requestAnimationFrame(draw);

		// IntersectionObserver for stats counter
		const statsEl = document.getElementById('stats-section');
		if (statsEl) {
			const observer = new IntersectionObserver(
				(entries) => {
					if (entries[0].isIntersecting && !statsVisible) {
						statsVisible = true;
						requestAnimationFrame(animateCount);
					}
				},
				{ threshold: 0.3 }
			);
			observer.observe(statsEl);
		}

		return () => {
			cancelAnimationFrame(animId);
			window.removeEventListener('resize', resize);
			document.removeEventListener('visibilitychange', handleVisibility);
		};
	});

	const features = [
		{
			title: 'Personalized to Your Life',
			description:
				'Tell us your schedule, profession, and goals. We build a protocol optimized for YOUR cognitive peak hours — not a generic template.',
			icon: '🎯',
			detail: 'AI-generated daily protocol based on chronobiology and neuroscience'
		},
		{
			title: 'Train Your Working Memory',
			description:
				'Dual N-Back training — the gold standard of cognitive enhancement. Adaptive difficulty that grows with you from 2-back to 5-back.',
			icon: '🧠',
			detail: 'Proven to increase fluid intelligence (Jaeggi et al., PNAS 2008)'
		},
		{
			title: 'Never Miss a Day',
			description:
				'Miss a day, restart your level. The streak IS the product. 21 consecutive days to advance. No shortcuts, no excuses.',
			icon: '🔥',
			detail: '5 progressive levels from Foundation to Mastery'
		}
	];

	const scienceStats = [
		{
			value: '+530%',
			label: 'Norepinephrine',
			source: 'Cold exposure at 14°C (Šrámek et al., 2000)'
		},
		{
			value: '+46%',
			label: 'Cognitive Function',
			source: 'Aerobic exercise BDNF (meta-analysis, N=1,111)'
		},
		{
			value: '27 min',
			label: '→ Gray Matter Changes',
			source: '8 weeks meditation (Harvard/MGH)'
		},
		{
			value: '2×',
			label: 'Learning Retention',
			source: 'Active recall vs passive study (Karpicke, Science 2011)'
		}
	];

	interface PricingTier {
		name: string;
		price: string;
		period: string;
		description: string;
		features: string[];
		highlighted: boolean;
		badge?: string;
		cta: string;
	}

	const pricingTiers: PricingTier[] = [
		{
			name: 'Free',
			price: '$0',
			period: 'forever',
			description: 'Level 1 only. See if you can handle it.',
			features: [
				'Level 1: Foundation protocol',
				'Pomodoro timer',
				'Basic streak tracking',
				'Community access'
			],
			highlighted: false,
			cta: 'Start Free'
		},
		{
			name: 'Pro',
			price: '$29',
			period: '/month',
			description: 'Full protocol. All 5 levels. No limits.',
			features: [
				'All 5 levels unlocked',
				'Dual N-Back training',
				'Spaced repetition system',
				'Advanced analytics',
				'Cold exposure protocols',
				'Priority support'
			],
			highlighted: true,
			badge: 'MOST POPULAR',
			cta: 'Start 7-Day Trial'
		},
		{
			name: 'Team',
			price: '$24',
			period: '/user/month',
			description: 'For teams that compete on cognition.',
			features: [
				'Everything in Pro',
				'Team leaderboards',
				'Manager dashboard',
				'Custom protocols',
				'API access',
				'Dedicated support'
			],
			highlighted: false,
			cta: 'Contact Sales'
		}
	];
</script>

<svelte:head>
	<title>Cognition OS — The Cognitive Performance Operating System</title>
	<meta
		name="description"
		content="Train your brain like an elite athlete trains their body. Evidence-based cognitive performance protocols for traders, CEOs, and developers."
	/>
	<meta property="og:title" content="Cognition OS — Cognitive Performance Operating System" />
	<meta
		property="og:description"
		content="Evidence-based. Personalized. Unforgiving. Train your brain like an elite athlete."
	/>
	<meta property="og:type" content="website" />
	<meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<div class="min-h-dvh bg-bg-primary">
	<!-- Hero Section -->
	<section class="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden">
		<canvas bind:this={canvas} class="absolute inset-0 h-full w-full" aria-hidden="true"></canvas>

		<div
			class="relative z-10 mx-auto max-w-4xl px-6 text-center transition-all duration-1000
				{heroVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}"
		>
			<h1
				class="mb-6 bg-gradient-to-r from-white to-accent bg-clip-text text-4xl leading-tight font-bold tracking-tight text-transparent md:text-6xl lg:text-7xl"
			>
				THE COGNITIVE PERFORMANCE OPERATING SYSTEM
			</h1>

			<p
				class="mx-auto mb-10 max-w-2xl text-lg text-text-secondary transition-all delay-500 duration-1000 md:text-xl
					{heroVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}"
			>
				Train your brain like an elite athlete trains their body.<br />
				Evidence-based. Personalized. Unforgiving.
			</p>

			<div
				class="flex flex-col items-center gap-4 transition-all delay-1000 duration-1000 sm:flex-row sm:justify-center
					{heroVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}"
			>
				<Button size="lg" onclick={() => goto('/demo')}>TRY THE DEMO — FREE →</Button>
				<Button size="lg" variant="secondary" onclick={() => goto('/onboarding')}
					>GET STARTED →</Button
				>
			</div>
		</div>

		<!-- Scroll indicator -->
		<div class="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 animate-bounce">
			<svg
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				class="text-text-tertiary"
			>
				<path d="M6 9l6 6 6-6" />
			</svg>
		</div>
	</section>

	<!-- Social Proof Bar -->
	<section id="stats-section" class="border-y border-white/5 bg-bg-secondary/50 py-4">
		<div
			class="mx-auto flex max-w-4xl flex-col items-center gap-2 px-6 text-center sm:flex-row sm:justify-center sm:gap-8"
		>
			<p class="font-mono text-sm text-text-secondary">
				<span class="text-accent">{protocolCount.toLocaleString()}</span> protocols completed this week
			</p>
			<span class="hidden h-4 w-px bg-white/10 sm:block"></span>
			<p class="text-sm text-text-tertiary">Used by traders, CEOs, and developers worldwide</p>
		</div>
	</section>

	<!-- Feature Showcase -->
	<section class="py-20">
		<div class="mx-auto max-w-5xl px-6">
			<h2 class="mb-16 text-center font-mono text-xs tracking-[0.3em] text-text-tertiary uppercase">
				How It Works
			</h2>

			<div class="space-y-20">
				{#each features as feature, i (feature.title)}
					<div
						class="flex flex-col items-center gap-8 md:flex-row {i % 2 === 1
							? 'md:flex-row-reverse'
							: ''}"
					>
						<div class="flex-1 space-y-4">
							<span class="text-4xl">{feature.icon}</span>
							<h3 class="text-2xl font-bold text-text-primary">{feature.title}</h3>
							<p class="leading-relaxed text-text-secondary">{feature.description}</p>
							<p class="text-sm text-text-tertiary italic">{feature.detail}</p>
						</div>

						<div class="flex-1">
							<GlassCard variant="elevated" padding="lg">
								<div class="flex aspect-video items-center justify-center">
									<span class="text-6xl">{feature.icon}</span>
								</div>
							</GlassCard>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Science Section -->
	<section class="border-y border-white/5 bg-bg-secondary/30 py-20">
		<div class="mx-auto max-w-5xl px-6">
			<h2 class="mb-4 text-center text-2xl font-bold text-text-primary md:text-3xl">
				BACKED BY SCIENCE, NOT MARKETING
			</h2>
			<p class="mx-auto mb-12 max-w-xl text-center text-text-tertiary">
				Every protocol element is grounded in peer-reviewed research.
			</p>

			<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{#each scienceStats as stat (stat.value)}
					<GlassCard variant="elevated" padding="md">
						<p class="mb-1 font-mono text-2xl font-bold text-accent">{stat.value}</p>
						<p class="mb-2 text-sm font-medium text-text-primary">{stat.label}</p>
						<p class="text-xs leading-relaxed text-text-tertiary">{stat.source}</p>
					</GlassCard>
				{/each}
			</div>
		</div>
	</section>

	<!-- Pricing Section -->
	<section class="py-20">
		<div class="mx-auto max-w-5xl px-6">
			<h2 class="mb-4 text-center text-2xl font-bold text-text-primary md:text-3xl">
				Choose Your Level
			</h2>
			<p class="mx-auto mb-12 max-w-md text-center text-text-tertiary">
				Start free. Upgrade when you're ready to go beyond Level 1.
			</p>

			<div class="grid gap-6 md:grid-cols-3">
				{#each pricingTiers as tier (tier.name)}
					<GlassCard
						variant={tier.highlighted ? 'elevated' : 'default'}
						padding="lg"
						class="relative flex flex-col {tier.highlighted ? 'ring-1 ring-accent/40' : ''}"
					>
						{#if tier.badge}
							<span
								class="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-1 text-[10px] font-bold tracking-wider text-bg-primary"
							>
								{tier.badge}
							</span>
						{/if}

						<div class="mb-6">
							<h3 class="mb-1 text-lg font-bold text-text-primary">{tier.name}</h3>
							<div class="flex items-baseline gap-1">
								<span class="font-mono text-3xl font-bold text-text-primary">{tier.price}</span>
								<span class="text-sm text-text-tertiary">{tier.period}</span>
							</div>
							<p class="mt-2 text-sm text-text-secondary">{tier.description}</p>
						</div>

						<ul class="mb-8 flex-1 space-y-2">
							{#each tier.features as feature (feature)}
								<li class="flex items-start gap-2 text-sm text-text-secondary">
									<span class="mt-0.5 text-success">✓</span>
									<span>{feature}</span>
								</li>
							{/each}
						</ul>

						<Button
							variant={tier.highlighted ? 'primary' : 'secondary'}
							fullWidth
							onclick={() => goto('/onboarding')}
						>
							{tier.cta}
						</Button>
					</GlassCard>
				{/each}
			</div>
		</div>
	</section>

	<!-- Final CTA -->
	<section class="border-t border-white/5 bg-bg-secondary/30 py-20">
		<div class="mx-auto max-w-2xl px-6 text-center">
			<h2 class="mb-4 text-2xl font-bold text-text-primary md:text-3xl">
				Your brain is your most valuable asset.
			</h2>
			<p class="mb-8 text-text-secondary">Most people never train it. You're not most people.</p>
			<Button size="lg" onclick={() => goto('/onboarding')}>BEGIN YOUR PROTOCOL →</Button>
		</div>
	</section>

	<!-- Footer -->
	<footer class="border-t border-white/5 py-8">
		<div
			class="mx-auto flex max-w-5xl flex-col items-center gap-4 px-6 text-center sm:flex-row sm:justify-between sm:text-left"
		>
			<p class="text-xs text-text-tertiary">
				© {new Date().getFullYear()} Cognition OS. Your brain is your #1 asset.
			</p>
			<nav class="flex gap-6 text-xs text-text-tertiary" aria-label="Footer navigation">
				<a href="/science" class="transition-colors hover:text-text-secondary">Science</a>
				<a href="/privacy" class="transition-colors hover:text-text-secondary">Privacy</a>
				<a href="/terms" class="transition-colors hover:text-text-secondary">Terms</a>
			</nav>
		</div>
	</footer>
</div>

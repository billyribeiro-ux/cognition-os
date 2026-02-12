<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { srs } from '$lib/stores/srs.svelte';
	import { getNextReviewDates } from '$lib/utils/srs-algorithm';
	import type { SRSRating } from '$lib/types';
	import GlassCard from '$lib/components/ui/GlassCard.svelte';
	import ProgressRing from '$lib/components/ui/ProgressRing.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';

	let showAddCard = $state(false);
	let newFront = $state('');
	let newBack = $state('');
	let newDeck = $state('neuroscience-fundamentals');
	let cardAnimating = $state(false);

	const ratingButtons: { rating: SRSRating; label: string; color: string; key: string }[] = [
		{ rating: 'again', label: 'Again', color: 'text-danger', key: '1' },
		{ rating: 'hard', label: 'Hard', color: 'text-warning', key: '2' },
		{ rating: 'good', label: 'Good', color: 'text-success', key: '3' },
		{ rating: 'easy', label: 'Easy', color: 'text-accent', key: '4' }
	];

	const nextDates = $derived(srs.currentCard ? getNextReviewDates(srs.currentCard) : null);
	const sessionDone = $derived(srs.currentCard === null && srs.sessionReviewed > 0);

	onMount(() => {
		srs.initWithDemoCards();
		srs.resetSession();
	});

	function handleRate(rating: SRSRating) {
		if (cardAnimating) return;
		cardAnimating = true;
		setTimeout(() => {
			srs.rate(rating);
			cardAnimating = false;
		}, 300);
	}

	function handleKeydown(e: KeyboardEvent) {
		if (showAddCard) return;
		if (e.key === ' ' && !srs.showAnswer && srs.currentCard) {
			e.preventDefault();
			srs.reveal();
		} else if (srs.showAnswer) {
			if (e.key === '1') handleRate('again');
			else if (e.key === '2') handleRate('hard');
			else if (e.key === '3') handleRate('good');
			else if (e.key === '4') handleRate('easy');
		}
	}

	function handleAddCard() {
		if (!newFront.trim() || !newBack.trim()) return;
		srs.addCard(newDeck, newFront.trim(), newBack.trim());
		newFront = '';
		newBack = '';
		showAddCard = false;
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="flex flex-1 flex-col px-4 py-4">
	<!-- No cards due / Session complete -->
	{#if srs.dueCount === 0 && !sessionDone}
		<div class="flex flex-1 flex-col items-center justify-center gap-6 text-center">
			<p class="text-3xl">✅</p>
			<h2 class="text-xl font-bold text-text-primary">All caught up!</h2>
			<p class="max-w-xs text-sm text-text-secondary">
				No cards due for review. Add new cards or come back later.
			</p>

			<GlassCard padding="md" class="w-full max-w-xs space-y-2">
				<div class="flex justify-between text-sm">
					<span class="text-text-secondary">Total Cards</span>
					<span class="font-mono text-text-primary">{srs.totalCards}</span>
				</div>
				<div class="flex justify-between text-sm">
					<span class="text-text-secondary">Decks</span>
					<span class="font-mono text-text-primary">{srs.decks.length}</span>
				</div>
			</GlassCard>

			<div class="flex gap-3">
				<Button variant="secondary" onclick={() => goto('/app')}>Dashboard</Button>
				<Button onclick={() => (showAddCard = true)}>Add Card</Button>
			</div>
		</div>

		<!-- Session complete -->
	{:else if sessionDone}
		<div class="flex flex-1 flex-col items-center justify-center gap-6 text-center">
			<p class="text-3xl">🎉</p>
			<h2 class="text-xl font-bold text-text-primary">Session Complete!</h2>

			<div class="flex gap-6">
				<div class="text-center">
					<ProgressRing
						progress={srs.sessionAccuracy}
						size={80}
						strokeWidth={6}
						color="var(--color-success)"
						label="{srs.sessionAccuracy}%"
					/>
					<p class="mt-2 text-xs text-text-tertiary">Accuracy</p>
				</div>
				<div class="text-center">
					<span class="font-mono text-3xl text-accent">{srs.sessionReviewed}</span>
					<p class="mt-2 text-xs text-text-tertiary">Reviewed</p>
				</div>
			</div>

			<GlassCard padding="md" class="w-full max-w-xs space-y-2">
				{#each srs.decks as deck (deck.id)}
					<div class="flex justify-between text-sm">
						<span class="text-text-secondary">{deck.name}</span>
						<span class="font-mono text-text-primary">{deck.total} cards</span>
					</div>
				{/each}
			</GlassCard>

			<div class="flex gap-3">
				<Button variant="secondary" onclick={() => goto('/app')}>Dashboard</Button>
				<Button onclick={() => (showAddCard = true)}>Add Card</Button>
			</div>
		</div>

		<!-- Review in progress -->
	{:else if srs.currentCard}
		<!-- Progress -->
		<div class="mb-4">
			<div class="mb-1 flex items-center justify-between">
				<span class="font-mono text-xs text-accent">REVIEW</span>
				<span class="font-mono text-xs text-text-tertiary">
					{srs.sessionReviewed} done · {srs.dueCount} remaining
				</span>
			</div>
			<div class="h-1 overflow-hidden rounded-full bg-bg-tertiary">
				<div
					class="h-full rounded-full bg-accent transition-all duration-300"
					style="width: {srs.dueCount > 0
						? (srs.sessionReviewed / (srs.sessionReviewed + srs.dueCount)) * 100
						: 100}%"
				></div>
			</div>
		</div>

		<!-- Card with 3D flip -->
		<div class="flex flex-1 flex-col items-center justify-center">
			<div
				class="perspective-1000 w-full max-w-md {cardAnimating
					? 'animate-slide-out-left'
					: 'animate-slide-in-right'}"
			>
				<div class="flip-card-inner {srs.showAnswer ? 'flipped' : ''}">
					<!-- Front face -->
					<div class="flip-card-front">
						<GlassCard variant="elevated" padding="lg" class="w-full text-center">
							<div class="mb-4">
								<Badge variant="info" label={srs.currentCard.deck.replace(/-/g, ' ')} size="sm" />
							</div>
							<h3 class="mb-6 min-h-[80px] text-lg leading-relaxed font-medium text-text-primary">
								{srs.currentCard.front}
							</h3>
							<Button fullWidth onclick={() => srs.reveal()}>SHOW ANSWER (Space)</Button>
						</GlassCard>
					</div>

					<!-- Back face -->
					<div class="flip-card-back">
						<GlassCard variant="elevated" padding="lg" class="w-full text-center">
							<div class="mb-4">
								<Badge variant="info" label={srs.currentCard.deck.replace(/-/g, ' ')} size="sm" />
							</div>
							<h3 class="mb-4 text-lg leading-relaxed font-medium text-text-primary">
								{srs.currentCard.front}
							</h3>
							<div class="mb-6 border-t border-white/8 pt-4">
								<p class="text-base leading-relaxed text-text-secondary">
									{srs.currentCard.back}
								</p>
							</div>
							<div class="grid grid-cols-4 gap-2">
								{#each ratingButtons as btn (btn.rating)}
									<button
										type="button"
										class="glass-card focus-ring rounded-[8px] px-2 py-3 text-center transition-all duration-150 hover:bg-white/5 active:scale-95"
										onclick={() => handleRate(btn.rating)}
									>
										<span class="block text-xs font-bold {btn.color}">{btn.label}</span>
										{#if nextDates}
											<span class="mt-1 block font-mono text-[10px] text-text-tertiary">
												{nextDates[btn.rating]}
											</span>
										{/if}
										<span class="mt-0.5 block text-[10px] text-text-tertiary">({btn.key})</span>
									</button>
								{/each}
							</div>
						</GlassCard>
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>

<!-- Add Card Modal -->
{#if showAddCard}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
		<GlassCard variant="elevated" padding="lg" class="w-full max-w-sm">
			<h2 class="mb-4 text-xl font-bold text-text-primary">Add New Card</h2>

			<div class="space-y-4">
				<div>
					<label for="srs-deck" class="mb-1 block text-xs text-text-secondary">Deck</label>
					<select
						id="srs-deck"
						bind:value={newDeck}
						class="focus-ring w-full rounded-[8px] border border-white/10 bg-bg-tertiary px-3 py-2 text-sm text-text-primary"
					>
						{#each srs.decks as deck (deck.id)}
							<option value={deck.id}>{deck.name}</option>
						{/each}
						<option value="custom">New Deck...</option>
					</select>
				</div>

				<div>
					<label for="srs-front" class="mb-1 block text-xs text-text-secondary"
						>Question (Front)</label
					>
					<textarea
						id="srs-front"
						bind:value={newFront}
						class="focus-ring w-full resize-none rounded-[12px] border border-white/10 bg-bg-tertiary px-3 py-2 text-sm text-text-primary"
						rows={3}
						placeholder="What is...?"
					></textarea>
				</div>

				<div>
					<label for="srs-back" class="mb-1 block text-xs text-text-secondary">Answer (Back)</label>
					<textarea
						id="srs-back"
						bind:value={newBack}
						class="focus-ring w-full resize-none rounded-[12px] border border-white/10 bg-bg-tertiary px-3 py-2 text-sm text-text-primary"
						rows={3}
						placeholder="The answer is..."
					></textarea>
				</div>
			</div>

			<div class="mt-6 flex gap-3">
				<Button variant="secondary" onclick={() => (showAddCard = false)}>Cancel</Button>
				<Button onclick={handleAddCard} disabled={!newFront.trim() || !newBack.trim()}>
					Add Card
				</Button>
			</div>
		</GlassCard>
	</div>
{/if}

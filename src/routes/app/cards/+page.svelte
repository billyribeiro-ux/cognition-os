<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { srs } from '$lib/stores/srs.svelte';
	import { DEMO_DECKS } from '$lib/constants/srs-decks';
	import type { SRSCard } from '$lib/types';
	import GlassCard from '$lib/components/ui/GlassCard.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';

	let searchQuery = $state('');
	let selectedDeck = $state<string | null>(null);
	let editingCard = $state<SRSCard | null>(null);
	let showAddCard = $state(false);
	let showDeleteConfirm = $state<string | null>(null);

	let editFront = $state('');
	let editBack = $state('');
	let editDeck = $state('');

	let newFront = $state('');
	let newBack = $state('');
	let newDeck = $state('neuroscience-fundamentals');

	const filteredCards = $derived(() => {
		let cards = srs.cards;
		if (selectedDeck) {
			cards = cards.filter((c) => c.deck === selectedDeck);
		}
		if (searchQuery.trim()) {
			const q = searchQuery.toLowerCase();
			cards = cards.filter(
				(c) => c.front.toLowerCase().includes(q) || c.back.toLowerCase().includes(q)
			);
		}
		return cards;
	});

	const deckOptions = $derived(() => {
		const allDecks = DEMO_DECKS.map((d) => ({ id: d.id, name: d.name }));
		const customDecks = srs.decks
			.filter((d) => !allDecks.some((ad) => ad.id === d.id))
			.map((d) => ({ id: d.id, name: d.name }));
		return [...allDecks, ...customDecks];
	});

	onMount(() => {
		srs.initWithDemoCards();
	});

	function startEdit(card: SRSCard) {
		editingCard = card;
		editFront = card.front;
		editBack = card.back;
		editDeck = card.deck;
	}

	function saveEdit() {
		if (!editingCard || !editFront.trim() || !editBack.trim()) return;
		srs.editCard(editingCard.id, {
			front: editFront.trim(),
			back: editBack.trim(),
			deck: editDeck
		});
		editingCard = null;
	}

	function confirmDelete(id: string) {
		showDeleteConfirm = id;
	}

	function executeDelete() {
		if (showDeleteConfirm) {
			srs.deleteCard(showDeleteConfirm);
			showDeleteConfirm = null;
		}
	}

	function handleAddCard() {
		if (!newFront.trim() || !newBack.trim()) return;
		srs.addCard(newDeck, newFront.trim(), newBack.trim());
		newFront = '';
		newBack = '';
		showAddCard = false;
	}

	function formatDeckName(deck: string): string {
		return deck.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
	}

	function formatDate(dateStr: string): string {
		const date = new Date(dateStr);
		const now = new Date();
		const diffDays = Math.round((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
		if (diffDays <= 0) return 'Due now';
		if (diffDays === 1) return 'Tomorrow';
		if (diffDays < 7) return `${diffDays}d`;
		if (diffDays < 30) return `${Math.round(diffDays / 7)}w`;
		return `${Math.round(diffDays / 30)}mo`;
	}
</script>

<svelte:head>
	<title>Cards — Cognition OS</title>
</svelte:head>

<div class="flex flex-1 flex-col px-4 py-4">
	<!-- Header -->
	<div class="mb-4 flex items-center justify-between">
		<div>
			<h1 class="text-xl font-bold text-text-primary">Card Browser</h1>
			<p class="text-xs text-text-tertiary">
				{srs.totalCards} cards across {srs.decks.length} decks
			</p>
		</div>
		<div class="flex gap-2">
			<Button size="sm" variant="secondary" onclick={() => goto('/app/review')}>Review</Button>
			<Button size="sm" onclick={() => (showAddCard = true)}>+ Add</Button>
		</div>
	</div>

	<!-- Search & Filter -->
	<div class="mb-4 space-y-2">
		<input
			type="text"
			bind:value={searchQuery}
			placeholder="Search cards..."
			class="focus-ring w-full rounded-[12px] border border-white/10 bg-bg-tertiary px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary"
		/>
		<div class="flex gap-2 overflow-x-auto pb-1">
			<button
				type="button"
				class="shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-all
					{selectedDeck === null
					? 'bg-accent text-bg-primary'
					: 'bg-bg-tertiary text-text-secondary hover:bg-white/5'}"
				onclick={() => (selectedDeck = null)}
			>
				All ({srs.totalCards})
			</button>
			{#each srs.decks as deck (deck.id)}
				<button
					type="button"
					class="shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-all
						{selectedDeck === deck.id
						? 'bg-accent text-bg-primary'
						: 'bg-bg-tertiary text-text-secondary hover:bg-white/5'}"
					onclick={() => (selectedDeck = selectedDeck === deck.id ? null : deck.id)}
				>
					{deck.name} ({deck.total})
				</button>
			{/each}
		</div>
	</div>

	<!-- Card List -->
	<div class="flex-1 space-y-2 overflow-y-auto">
		{#each filteredCards() as card (card.id)}
			<GlassCard padding="sm" class="w-full">
				<button type="button" class="w-full text-left" onclick={() => startEdit(card)}>
					<div class="mb-1 flex items-center gap-2">
						<Badge variant="info" label={formatDeckName(card.deck)} size="sm" />
						<span class="ml-auto font-mono text-[10px] text-text-tertiary">
							Next: {formatDate(card.nextReview)}
						</span>
					</div>
					<p class="line-clamp-2 text-sm font-medium text-text-primary">{card.front}</p>
					<p class="mt-1 line-clamp-1 text-xs text-text-tertiary">{card.back}</p>
					<div class="mt-2 flex items-center gap-3 text-[10px] text-text-tertiary">
						<span>Reviews: {card.reviewCount}</span>
						<span>Interval: {card.intervalDays}d</span>
						<span>Ease: {card.easeFactor.toFixed(2)}</span>
					</div>
				</button>
			</GlassCard>
		{:else}
			<div class="flex flex-1 flex-col items-center justify-center py-12 text-center">
				<p class="text-2xl">📭</p>
				<p class="mt-2 text-sm text-text-secondary">
					{searchQuery ? 'No cards match your search' : 'No cards yet'}
				</p>
				{#if !searchQuery}
					<Button size="sm" class="mt-4" onclick={() => (showAddCard = true)}
						>Add Your First Card</Button
					>
				{/if}
			</div>
		{/each}
	</div>
</div>

<!-- Edit Card Modal -->
{#if editingCard}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
		<GlassCard variant="elevated" padding="lg" class="w-full max-w-sm">
			<h2 class="mb-4 text-xl font-bold text-text-primary">Edit Card</h2>

			<div class="space-y-4">
				<div>
					<label for="edit-deck" class="mb-1 block text-xs text-text-secondary">Deck</label>
					<select
						id="edit-deck"
						bind:value={editDeck}
						class="focus-ring w-full rounded-[8px] border border-white/10 bg-bg-tertiary px-3 py-2 text-sm text-text-primary"
					>
						{#each deckOptions() as deck (deck.id)}
							<option value={deck.id}>{deck.name}</option>
						{/each}
					</select>
				</div>

				<div>
					<label for="edit-front" class="mb-1 block text-xs text-text-secondary"
						>Question (Front)</label
					>
					<textarea
						id="edit-front"
						bind:value={editFront}
						class="focus-ring w-full resize-none rounded-[12px] border border-white/10 bg-bg-tertiary px-3 py-2 text-sm text-text-primary"
						rows={3}
					></textarea>
				</div>

				<div>
					<label for="edit-back" class="mb-1 block text-xs text-text-secondary">Answer (Back)</label
					>
					<textarea
						id="edit-back"
						bind:value={editBack}
						class="focus-ring w-full resize-none rounded-[12px] border border-white/10 bg-bg-tertiary px-3 py-2 text-sm text-text-primary"
						rows={3}
					></textarea>
				</div>
			</div>

			<div class="mt-6 flex gap-3">
				<Button
					variant="ghost"
					size="sm"
					onclick={() => confirmDelete(editingCard?.id ?? '')}
					class="text-danger"
				>
					Delete
				</Button>
				<div class="flex-1"></div>
				<Button variant="secondary" onclick={() => (editingCard = null)}>Cancel</Button>
				<Button onclick={saveEdit} disabled={!editFront.trim() || !editBack.trim()}>Save</Button>
			</div>
		</GlassCard>
	</div>
{/if}

<!-- Delete Confirmation -->
{#if showDeleteConfirm}
	<div class="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 px-4">
		<GlassCard variant="elevated" padding="lg" class="w-full max-w-xs text-center">
			<p class="mb-4 text-sm text-text-secondary">Delete this card permanently?</p>
			<div class="flex justify-center gap-3">
				<Button variant="secondary" onclick={() => (showDeleteConfirm = null)}>Cancel</Button>
				<Button variant="primary" onclick={executeDelete} class="bg-danger hover:bg-danger/80"
					>Delete</Button
				>
			</div>
		</GlassCard>
	</div>
{/if}

<!-- Add Card Modal -->
{#if showAddCard}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
		<GlassCard variant="elevated" padding="lg" class="w-full max-w-sm">
			<h2 class="mb-4 text-xl font-bold text-text-primary">Add New Card</h2>

			<div class="space-y-4">
				<div>
					<label for="new-deck" class="mb-1 block text-xs text-text-secondary">Deck</label>
					<select
						id="new-deck"
						bind:value={newDeck}
						class="focus-ring w-full rounded-[8px] border border-white/10 bg-bg-tertiary px-3 py-2 text-sm text-text-primary"
					>
						{#each deckOptions() as deck (deck.id)}
							<option value={deck.id}>{deck.name}</option>
						{/each}
						<option value="custom">New Deck...</option>
					</select>
				</div>

				<div>
					<label for="new-front" class="mb-1 block text-xs text-text-secondary"
						>Question (Front)</label
					>
					<textarea
						id="new-front"
						bind:value={newFront}
						class="focus-ring w-full resize-none rounded-[12px] border border-white/10 bg-bg-tertiary px-3 py-2 text-sm text-text-primary"
						rows={3}
						placeholder="What is...?"
					></textarea>
				</div>

				<div>
					<label for="new-back" class="mb-1 block text-xs text-text-secondary">Answer (Back)</label>
					<textarea
						id="new-back"
						bind:value={newBack}
						class="focus-ring w-full resize-none rounded-[12px] border border-white/10 bg-bg-tertiary px-3 py-2 text-sm text-text-primary"
						rows={3}
						placeholder="The answer is..."
					></textarea>
				</div>
			</div>

			<div class="mt-6 flex gap-3">
				<Button variant="secondary" onclick={() => (showAddCard = false)}>Cancel</Button>
				<Button onclick={handleAddCard} disabled={!newFront.trim() || !newBack.trim()}
					>Add Card</Button
				>
			</div>
		</GlassCard>
	</div>
{/if}

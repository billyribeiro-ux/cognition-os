import type { SRSCard, SRSRating } from '$lib/types';
import { SvelteMap } from 'svelte/reactivity';
import { reviewCard, isDue, createCard } from '$lib/utils/srs-algorithm';
import { getDemoCards } from '$lib/constants/srs-decks';

const STORAGE_KEY = 'cognition-os-srs';

function loadCards(): SRSCard[] {
	if (typeof localStorage === 'undefined') return [];
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored) return JSON.parse(stored) as SRSCard[];
	} catch {
		/* ignore */
	}
	return [];
}

function saveCards(cards: SRSCard[]): void {
	if (typeof localStorage === 'undefined') return;
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
	} catch {
		/* ignore */
	}
}

class SRSStore {
	cards = $state<SRSCard[]>(loadCards());
	currentIndex = $state(0);
	showAnswer = $state(false);
	sessionReviewed = $state(0);
	sessionCorrect = $state(0);

	get dueCards(): SRSCard[] {
		return this.cards.filter(isDue);
	}

	get dueCount(): number {
		return this.dueCards.length;
	}

	get currentCard(): SRSCard | null {
		const due = this.dueCards;
		if (this.currentIndex >= due.length) return null;
		return due[this.currentIndex];
	}

	get totalCards(): number {
		return this.cards.length;
	}

	get sessionAccuracy(): number {
		if (this.sessionReviewed === 0) return 0;
		return Math.round((this.sessionCorrect / this.sessionReviewed) * 100);
	}

	get decks(): { id: string; name: string; total: number; due: number }[] {
		const deckMap = new SvelteMap<string, { total: number; due: number }>();
		for (const card of this.cards) {
			const existing = deckMap.get(card.deck) ?? { total: 0, due: 0 };
			existing.total += 1;
			if (isDue(card)) existing.due += 1;
			deckMap.set(card.deck, existing);
		}
		return Array.from(deckMap.entries()).map(([id, counts]) => ({
			id,
			name: id.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
			...counts
		}));
	}

	initWithDemoCards() {
		if (this.cards.length === 0) {
			this.cards = getDemoCards();
			saveCards(this.cards);
		}
	}

	reveal() {
		this.showAnswer = true;
	}

	rate(rating: SRSRating) {
		const card = this.currentCard;
		if (!card) return;

		const updates = reviewCard(card, rating);
		this.cards = this.cards.map((c) => (c.id === card.id ? { ...c, ...updates } : c));
		saveCards(this.cards);

		this.sessionReviewed += 1;
		if (rating === 'good' || rating === 'easy') {
			this.sessionCorrect += 1;
		}

		this.showAnswer = false;
		// Don't increment index — the card we just reviewed is no longer due,
		// so dueCards shifts. currentIndex stays the same to point at the next due card.
		// But if we've exhausted all due cards, currentIndex will exceed dueCards.length.
	}

	addCard(deck: string, front: string, back: string) {
		const card = createCard({ deck, front, back });
		this.cards = [...this.cards, card];
		saveCards(this.cards);
	}

	deleteCard(id: string) {
		this.cards = this.cards.filter((c) => c.id !== id);
		saveCards(this.cards);
	}

	resetSession() {
		this.currentIndex = 0;
		this.showAnswer = false;
		this.sessionReviewed = 0;
		this.sessionCorrect = 0;
	}
}

export const srs = new SRSStore();

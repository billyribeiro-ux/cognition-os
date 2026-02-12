import { describe, it, expect } from 'vitest';
import { reviewCard, isDue, createCard, getNextReviewDates } from './srs-algorithm';
import type { SRSCard } from '$lib/types';

function makeCard(overrides: Partial<SRSCard> = {}): SRSCard {
	return {
		id: 'test-1',
		userId: 'u1',
		deck: 'test-deck',
		front: 'Q',
		back: 'A',
		intervalDays: 1,
		easeFactor: 2.5,
		nextReview: new Date().toISOString().split('T')[0],
		reviewCount: 0,
		...overrides
	};
}

describe('reviewCard', () => {
	it('again: resets interval to 1 and decreases ease', () => {
		const card = makeCard({ intervalDays: 10, easeFactor: 2.5 });
		const result = reviewCard(card, 'again');
		expect(result.intervalDays).toBe(1);
		expect(result.easeFactor).toBe(2.3);
		expect(result.reviewCount).toBe(1);
	});

	it('again: ease factor does not go below 1.3', () => {
		const card = makeCard({ easeFactor: 1.4 });
		const result = reviewCard(card, 'again');
		expect(result.easeFactor).toBe(1.3);
	});

	it('hard: multiplies interval by 1.2 and decreases ease', () => {
		const card = makeCard({ intervalDays: 10, easeFactor: 2.5 });
		const result = reviewCard(card, 'hard');
		expect(result.intervalDays).toBe(12);
		expect(result.easeFactor).toBe(2.35);
	});

	it('hard: interval is at least 1', () => {
		const card = makeCard({ intervalDays: 0, easeFactor: 2.5 });
		const result = reviewCard(card, 'hard');
		expect(result.intervalDays).toBeGreaterThanOrEqual(1);
	});

	it('good: first review (interval=0) sets interval to 1', () => {
		const card = makeCard({ intervalDays: 0 });
		const result = reviewCard(card, 'good');
		expect(result.intervalDays).toBe(1);
	});

	it('good: second review (interval=1) sets interval to 6', () => {
		const card = makeCard({ intervalDays: 1 });
		const result = reviewCard(card, 'good');
		expect(result.intervalDays).toBe(6);
	});

	it('good: subsequent reviews multiply by ease factor', () => {
		const card = makeCard({ intervalDays: 6, easeFactor: 2.5 });
		const result = reviewCard(card, 'good');
		expect(result.intervalDays).toBe(15);
		expect(result.easeFactor).toBe(2.5);
	});

	it('easy: first review (interval=0) sets interval to 4', () => {
		const card = makeCard({ intervalDays: 0 });
		const result = reviewCard(card, 'easy');
		expect(result.intervalDays).toBe(4);
	});

	it('easy: second review (interval=1) sets interval to 10', () => {
		const card = makeCard({ intervalDays: 1 });
		const result = reviewCard(card, 'easy');
		expect(result.intervalDays).toBe(10);
	});

	it('easy: subsequent reviews multiply by ease * 1.3 and increase ease', () => {
		const card = makeCard({ intervalDays: 10, easeFactor: 2.5 });
		const result = reviewCard(card, 'easy');
		expect(result.intervalDays).toBe(33); // round(10 * 2.5 * 1.3)
		expect(result.easeFactor).toBe(2.65);
	});

	it('sets nextReview to a future date', () => {
		const card = makeCard({ intervalDays: 5 });
		const result = reviewCard(card, 'good');
		const today = new Date();
		const nextDate = new Date(result.nextReview);
		expect(nextDate.getTime()).toBeGreaterThan(today.getTime());
	});

	it('sets lastReviewed to today', () => {
		const card = makeCard();
		const result = reviewCard(card, 'good');
		const today = new Date().toISOString().split('T')[0];
		expect(result.lastReviewed).toBe(today);
	});

	it('increments reviewCount', () => {
		const card = makeCard({ reviewCount: 5 });
		const result = reviewCard(card, 'good');
		expect(result.reviewCount).toBe(6);
	});
});

describe('isDue', () => {
	it('returns true for card due today', () => {
		const today = new Date().toISOString().split('T')[0];
		const card = makeCard({ nextReview: today });
		expect(isDue(card)).toBe(true);
	});

	it('returns true for overdue card', () => {
		const card = makeCard({ nextReview: '2020-01-01' });
		expect(isDue(card)).toBe(true);
	});

	it('returns false for future card', () => {
		const future = new Date();
		future.setDate(future.getDate() + 30);
		const card = makeCard({ nextReview: future.toISOString().split('T')[0] });
		expect(isDue(card)).toBe(false);
	});
});

describe('createCard', () => {
	it('creates a card with default values', () => {
		const card = createCard({ deck: 'test', front: 'Q', back: 'A' });
		expect(card.deck).toBe('test');
		expect(card.front).toBe('Q');
		expect(card.back).toBe('A');
		expect(card.intervalDays).toBe(0);
		expect(card.easeFactor).toBe(2.5);
		expect(card.reviewCount).toBe(0);
		expect(card.id).toBeTruthy();
	});

	it('generates unique IDs', () => {
		const a = createCard({ deck: 'd', front: 'Q', back: 'A' });
		const b = createCard({ deck: 'd', front: 'Q', back: 'A' });
		expect(a.id).not.toBe(b.id);
	});
});

describe('getNextReviewDates', () => {
	it('returns projected intervals for all 4 ratings', () => {
		const card = makeCard({ intervalDays: 10, easeFactor: 2.5 });
		const dates = getNextReviewDates(card);
		expect(dates.again).toBe('1d');
		expect(dates.hard).toBe('12d');
		expect(dates.good).toBe('25d');
		expect(dates.easy).toBeTruthy();
	});
});

import type { SRSCard, SRSRating } from '$lib/types';

const MIN_EASE_FACTOR = 1.3;
const DEFAULT_EASE_FACTOR = 2.5;

/**
 * SM-2 based spaced repetition algorithm.
 * Returns updated card fields after a review.
 */
export function reviewCard(
	card: SRSCard,
	rating: SRSRating
): Pick<SRSCard, 'intervalDays' | 'easeFactor' | 'nextReview' | 'lastReviewed' | 'reviewCount'> {
	const today = new Date().toISOString().split('T')[0];
	let { intervalDays, easeFactor, reviewCount } = card;

	reviewCount += 1;

	switch (rating) {
		case 'again':
			intervalDays = 1;
			easeFactor = Math.max(MIN_EASE_FACTOR, easeFactor - 0.2);
			break;
		case 'hard':
			intervalDays = Math.max(1, Math.round(intervalDays * 1.2));
			easeFactor = Math.max(MIN_EASE_FACTOR, easeFactor - 0.15);
			break;
		case 'good':
			if (intervalDays === 0) {
				intervalDays = 1;
			} else if (intervalDays === 1) {
				intervalDays = 6;
			} else {
				intervalDays = Math.round(intervalDays * easeFactor);
			}
			break;
		case 'easy':
			if (intervalDays === 0) {
				intervalDays = 4;
			} else if (intervalDays === 1) {
				intervalDays = 10;
			} else {
				intervalDays = Math.round(intervalDays * easeFactor * 1.3);
			}
			easeFactor = easeFactor + 0.15;
			break;
	}

	const nextDate = new Date();
	nextDate.setDate(nextDate.getDate() + intervalDays);
	const nextReview = nextDate.toISOString().split('T')[0];

	return {
		intervalDays,
		easeFactor,
		nextReview,
		lastReviewed: today,
		reviewCount
	};
}

/**
 * Check if a card is due for review today.
 */
export function isDue(card: SRSCard): boolean {
	const today = new Date().toISOString().split('T')[0];
	return card.nextReview <= today;
}

/**
 * Create a new SRS card with default values.
 */
export function createCard(params: {
	deck: string;
	front: string;
	back: string;
	userId?: string;
}): SRSCard {
	const today = new Date().toISOString().split('T')[0];
	return {
		id: `srs-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
		userId: params.userId ?? '',
		deck: params.deck,
		front: params.front,
		back: params.back,
		intervalDays: 0,
		easeFactor: DEFAULT_EASE_FACTOR,
		nextReview: today,
		reviewCount: 0
	};
}

/**
 * Get the projected next review dates for each rating option.
 */
export function getNextReviewDates(card: SRSCard): Record<SRSRating, string> {
	const ratings: SRSRating[] = ['again', 'hard', 'good', 'easy'];
	const result = {} as Record<SRSRating, string>;
	for (const rating of ratings) {
		const updated = reviewCard(card, rating);
		result[rating] = formatInterval(updated.intervalDays);
	}
	return result;
}

function formatInterval(days: number): string {
	if (days === 0) return 'Now';
	if (days === 1) return '1d';
	if (days < 30) return `${days}d`;
	if (days < 365) return `${Math.round(days / 30)}mo`;
	return `${(days / 365).toFixed(1)}y`;
}

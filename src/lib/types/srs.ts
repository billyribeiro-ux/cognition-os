export interface SRSCard {
	id: string;
	userId: string;
	deck: string;
	front: string;
	back: string;
	intervalDays: number;
	easeFactor: number;
	nextReview: string;
	lastReviewed?: string;
	reviewCount: number;
}

export type SRSRating = 'again' | 'hard' | 'good' | 'easy';

export interface SRSDeck {
	id: string;
	name: string;
	description: string;
	cardCount: number;
}

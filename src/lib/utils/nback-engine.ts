import type { NBackRound } from '$lib/types';
import {
	NBACK_LETTERS,
	NBACK_GRID_POSITIONS,
	NBACK_MATCH_PROBABILITY
} from '$lib/constants/nback-config';

function randomInt(max: number): number {
	return Math.floor(Math.random() * max);
}

function randomLetter(): string {
	return NBACK_LETTERS[randomInt(NBACK_LETTERS.length)];
}

function randomPosition(): number {
	return randomInt(NBACK_GRID_POSITIONS);
}

/**
 * Generate a sequence of rounds for a dual N-Back session.
 * Each round has a grid position and a letter.
 * Matches are injected with ~NBACK_MATCH_PROBABILITY probability
 * after the first N rounds (where matches become possible).
 */
export function generateRounds(nLevel: number, totalRounds: number): NBackRound[] {
	const rounds: NBackRound[] = [];

	for (let i = 0; i < totalRounds; i++) {
		let position = randomPosition();
		let letter = randomLetter();
		let isPositionMatch = false;
		let isAudioMatch = false;

		if (i >= nLevel) {
			const nBack = rounds[i - nLevel];

			if (Math.random() < NBACK_MATCH_PROBABILITY) {
				position = nBack.position;
				isPositionMatch = true;
			} else {
				while (position === nBack.position) {
					position = randomPosition();
				}
			}

			if (Math.random() < NBACK_MATCH_PROBABILITY) {
				letter = nBack.letter;
				isAudioMatch = true;
			} else {
				while (letter === nBack.letter) {
					letter = randomLetter();
				}
			}
		}

		rounds.push({ position, letter, isPositionMatch, isAudioMatch });
	}

	return rounds;
}

/**
 * Evaluate a user's response for a single round.
 */
export function evaluateResponse(
	round: NBackRound,
	userPosition: boolean,
	userAudio: boolean
): { positionCorrect: boolean; audioCorrect: boolean } {
	return {
		positionCorrect: userPosition === round.isPositionMatch,
		audioCorrect: userAudio === round.isAudioMatch
	};
}

/**
 * Calculate overall accuracy from correct/incorrect counts.
 */
export function calculateAccuracy(
	positionCorrect: number,
	positionIncorrect: number,
	audioCorrect: number,
	audioIncorrect: number
): { positionAccuracy: number; audioAccuracy: number; overallAccuracy: number } {
	const posTotal = positionCorrect + positionIncorrect;
	const audTotal = audioCorrect + audioIncorrect;
	const positionAccuracy = posTotal > 0 ? Math.round((positionCorrect / posTotal) * 100) : 0;
	const audioAccuracy = audTotal > 0 ? Math.round((audioCorrect / audTotal) * 100) : 0;
	const overallAccuracy = Math.round((positionAccuracy + audioAccuracy) / 2);
	return { positionAccuracy, audioAccuracy, overallAccuracy };
}

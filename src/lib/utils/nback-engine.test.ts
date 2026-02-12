import { describe, it, expect } from 'vitest';
import { generateRounds, evaluateResponse, calculateAccuracy } from './nback-engine';

describe('generateRounds', () => {
	it('generates the correct number of rounds', () => {
		const rounds = generateRounds(2, 20);
		expect(rounds).toHaveLength(20);
	});

	it('each round has position, letter, and match flags', () => {
		const rounds = generateRounds(2, 10);
		for (const round of rounds) {
			expect(round.position).toBeGreaterThanOrEqual(0);
			expect(round.position).toBeLessThan(9);
			expect(round.letter).toBeTruthy();
			expect(typeof round.isPositionMatch).toBe('boolean');
			expect(typeof round.isAudioMatch).toBe('boolean');
		}
	});

	it('first N rounds have no matches', () => {
		const rounds = generateRounds(3, 20);
		for (let i = 0; i < 3; i++) {
			expect(rounds[i].isPositionMatch).toBe(false);
			expect(rounds[i].isAudioMatch).toBe(false);
		}
	});

	it('position matches reference the correct N-back round', () => {
		const rounds = generateRounds(2, 30);
		for (let i = 2; i < rounds.length; i++) {
			if (rounds[i].isPositionMatch) {
				expect(rounds[i].position).toBe(rounds[i - 2].position);
			}
		}
	});

	it('audio matches reference the correct N-back round', () => {
		const rounds = generateRounds(2, 30);
		for (let i = 2; i < rounds.length; i++) {
			if (rounds[i].isAudioMatch) {
				expect(rounds[i].letter).toBe(rounds[i - 2].letter);
			}
		}
	});

	it('non-matches differ from the N-back round', () => {
		const rounds = generateRounds(2, 30);
		for (let i = 2; i < rounds.length; i++) {
			if (!rounds[i].isPositionMatch) {
				expect(rounds[i].position).not.toBe(rounds[i - 2].position);
			}
			if (!rounds[i].isAudioMatch) {
				expect(rounds[i].letter).not.toBe(rounds[i - 2].letter);
			}
		}
	});

	it('works with different N levels', () => {
		for (const n of [2, 3, 4, 5]) {
			const rounds = generateRounds(n, 25);
			expect(rounds).toHaveLength(25);
		}
	});
});

describe('evaluateResponse', () => {
	it('correct when user matches a position match', () => {
		const round = { position: 0, letter: 'C', isPositionMatch: true, isAudioMatch: false };
		const result = evaluateResponse(round, true, false);
		expect(result.positionCorrect).toBe(true);
		expect(result.audioCorrect).toBe(true);
	});

	it('incorrect when user presses position but no match', () => {
		const round = { position: 0, letter: 'C', isPositionMatch: false, isAudioMatch: false };
		const result = evaluateResponse(round, true, false);
		expect(result.positionCorrect).toBe(false);
		expect(result.audioCorrect).toBe(true);
	});

	it('correct when user does not press and no match', () => {
		const round = { position: 0, letter: 'C', isPositionMatch: false, isAudioMatch: false };
		const result = evaluateResponse(round, false, false);
		expect(result.positionCorrect).toBe(true);
		expect(result.audioCorrect).toBe(true);
	});

	it('incorrect when user misses a match', () => {
		const round = { position: 0, letter: 'C', isPositionMatch: true, isAudioMatch: true };
		const result = evaluateResponse(round, false, false);
		expect(result.positionCorrect).toBe(false);
		expect(result.audioCorrect).toBe(false);
	});

	it('handles dual match correctly', () => {
		const round = { position: 0, letter: 'C', isPositionMatch: true, isAudioMatch: true };
		const result = evaluateResponse(round, true, true);
		expect(result.positionCorrect).toBe(true);
		expect(result.audioCorrect).toBe(true);
	});
});

describe('calculateAccuracy', () => {
	it('returns 100% for all correct', () => {
		const result = calculateAccuracy(10, 0, 10, 0);
		expect(result.positionAccuracy).toBe(100);
		expect(result.audioAccuracy).toBe(100);
		expect(result.overallAccuracy).toBe(100);
	});

	it('returns 0% for all incorrect', () => {
		const result = calculateAccuracy(0, 10, 0, 10);
		expect(result.positionAccuracy).toBe(0);
		expect(result.audioAccuracy).toBe(0);
		expect(result.overallAccuracy).toBe(0);
	});

	it('calculates mixed accuracy correctly', () => {
		const result = calculateAccuracy(7, 3, 8, 2);
		expect(result.positionAccuracy).toBe(70);
		expect(result.audioAccuracy).toBe(80);
		expect(result.overallAccuracy).toBe(75);
	});

	it('handles zero totals gracefully', () => {
		const result = calculateAccuracy(0, 0, 0, 0);
		expect(result.positionAccuracy).toBe(0);
		expect(result.audioAccuracy).toBe(0);
		expect(result.overallAccuracy).toBe(0);
	});
});

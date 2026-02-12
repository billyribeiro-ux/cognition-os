import type { NBackRound, NBackScore } from '$lib/types';
import { generateRounds, evaluateResponse, calculateAccuracy } from '$lib/utils/nback-engine';
import {
	NBACK_DEFAULT_ROUNDS,
	NBACK_ROUND_INTERVAL_MS,
	NBACK_LEVEL_UP_THRESHOLD,
	NBACK_LEVEL_DOWN_THRESHOLD,
	NBACK_MIN_LEVEL,
	NBACK_MAX_LEVEL
} from '$lib/constants/nback-config';

type GamePhase = 'idle' | 'countdown' | 'playing' | 'feedback' | 'results';

const STORAGE_KEY = 'cognition-os-nback';

function loadNLevel(): number {
	if (typeof localStorage === 'undefined') return 2;
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored) {
			const data = JSON.parse(stored) as { nLevel: number };
			return data.nLevel;
		}
	} catch {
		/* ignore */
	}
	return 2;
}

function saveNLevel(nLevel: number): void {
	if (typeof localStorage === 'undefined') return;
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify({ nLevel }));
	} catch {
		/* ignore */
	}
}

class NBackStore {
	phase = $state<GamePhase>('idle');
	nLevel = $state(loadNLevel());
	rounds = $state<NBackRound[]>([]);
	currentRoundIndex = $state(-1);
	totalRounds = $state(NBACK_DEFAULT_ROUNDS);
	positionCorrect = $state(0);
	positionIncorrect = $state(0);
	audioCorrect = $state(0);
	audioIncorrect = $state(0);
	userPressedPosition = $state(false);
	userPressedAudio = $state(false);
	countdownValue = $state(3);
	sessionStartTime = $state(0);
	feedbackType = $state<'correct' | 'incorrect' | null>(null);

	private intervalId: ReturnType<typeof setInterval> | null = null;
	private countdownId: ReturnType<typeof setInterval> | null = null;
	private feedbackTimeout: ReturnType<typeof setTimeout> | null = null;

	get currentRound(): NBackRound | null {
		if (this.currentRoundIndex < 0 || this.currentRoundIndex >= this.rounds.length) return null;
		return this.rounds[this.currentRoundIndex];
	}

	get progress(): number {
		if (this.totalRounds === 0) return 0;
		return Math.round(((this.currentRoundIndex + 1) / this.totalRounds) * 100);
	}

	get accuracy(): { positionAccuracy: number; audioAccuracy: number; overallAccuracy: number } {
		return calculateAccuracy(
			this.positionCorrect,
			this.positionIncorrect,
			this.audioCorrect,
			this.audioIncorrect
		);
	}

	get isPlaying(): boolean {
		return this.phase === 'playing';
	}

	startSession(customRounds?: number) {
		this.totalRounds = customRounds ?? NBACK_DEFAULT_ROUNDS;
		this.rounds = generateRounds(this.nLevel, this.totalRounds);
		this.currentRoundIndex = -1;
		this.positionCorrect = 0;
		this.positionIncorrect = 0;
		this.audioCorrect = 0;
		this.audioIncorrect = 0;
		this.sessionStartTime = Date.now();

		// Start countdown
		this.phase = 'countdown';
		this.countdownValue = 3;
		this.countdownId = setInterval(() => {
			this.countdownValue -= 1;
			if (this.countdownValue <= 0) {
				if (this.countdownId) {
					clearInterval(this.countdownId);
					this.countdownId = null;
				}
				this.beginPlaying();
			}
		}, 1000);
	}

	private beginPlaying() {
		this.phase = 'playing';
		this.advanceRound();

		this.intervalId = setInterval(() => {
			this.evaluateCurrentRound();
			this.advanceRound();
		}, NBACK_ROUND_INTERVAL_MS);
	}

	private advanceRound() {
		this.currentRoundIndex += 1;
		this.userPressedPosition = false;
		this.userPressedAudio = false;
		this.feedbackType = null;

		if (this.currentRoundIndex >= this.totalRounds) {
			this.endSession();
		}
	}

	private evaluateCurrentRound() {
		const idx = this.currentRoundIndex;
		if (idx < this.nLevel || idx >= this.totalRounds) return;

		const round = this.rounds[idx];
		const result = evaluateResponse(round, this.userPressedPosition, this.userPressedAudio);

		if (result.positionCorrect) this.positionCorrect += 1;
		else this.positionIncorrect += 1;

		if (result.audioCorrect) this.audioCorrect += 1;
		else this.audioIncorrect += 1;

		// Brief feedback flash
		const bothCorrect = result.positionCorrect && result.audioCorrect;
		this.feedbackType = bothCorrect ? 'correct' : 'incorrect';
	}

	pressPosition() {
		if (this.phase !== 'playing') return;
		this.userPressedPosition = true;
	}

	pressAudio() {
		if (this.phase !== 'playing') return;
		this.userPressedAudio = true;
	}

	private endSession() {
		if (this.intervalId) {
			clearInterval(this.intervalId);
			this.intervalId = null;
		}

		// Evaluate the last round
		this.evaluateCurrentRound();

		this.phase = 'results';

		// Adaptive level adjustment
		const { overallAccuracy } = this.accuracy;
		if (overallAccuracy >= NBACK_LEVEL_UP_THRESHOLD && this.nLevel < NBACK_MAX_LEVEL) {
			this.nLevel += 1;
			saveNLevel(this.nLevel);
		} else if (overallAccuracy < NBACK_LEVEL_DOWN_THRESHOLD && this.nLevel > NBACK_MIN_LEVEL) {
			this.nLevel -= 1;
			saveNLevel(this.nLevel);
		}
	}

	getScore(): NBackScore {
		const { positionAccuracy, audioAccuracy, overallAccuracy } = this.accuracy;
		const durationSeconds = Math.round((Date.now() - this.sessionStartTime) / 1000);
		return {
			id: `nback-${Date.now()}`,
			userId: '',
			sessionDate: new Date().toISOString().split('T')[0],
			nLevel: this.nLevel,
			accuracy: overallAccuracy,
			rounds: this.totalRounds,
			durationSeconds,
			positionAccuracy,
			audioAccuracy
		};
	}

	reset() {
		if (this.intervalId) {
			clearInterval(this.intervalId);
			this.intervalId = null;
		}
		if (this.countdownId) {
			clearInterval(this.countdownId);
			this.countdownId = null;
		}
		if (this.feedbackTimeout) {
			clearTimeout(this.feedbackTimeout);
			this.feedbackTimeout = null;
		}
		this.phase = 'idle';
		this.currentRoundIndex = -1;
		this.rounds = [];
		this.userPressedPosition = false;
		this.userPressedAudio = false;
		this.feedbackType = null;
	}

	dispose() {
		this.reset();
	}
}

export const nback = new NBackStore();

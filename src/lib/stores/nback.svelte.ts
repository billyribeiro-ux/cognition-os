import type { NBackRound, NBackScore } from '$lib/types';
import { generateRounds, evaluateResponse, calculateAccuracy } from '$lib/utils/nback-engine';
import { speakLetter, playCorrectTone, playIncorrectTone } from '$lib/utils/audio';
import {
	NBACK_DEFAULT_ROUNDS,
	NBACK_ROUND_INTERVAL_MS,
	NBACK_LEVEL_UP_THRESHOLD,
	NBACK_LEVEL_DOWN_THRESHOLD,
	NBACK_CONSECUTIVE_SESSIONS_FOR_CHANGE,
	NBACK_MIN_LEVEL,
	NBACK_MAX_LEVEL
} from '$lib/constants/nback-config';

type GamePhase = 'idle' | 'countdown' | 'playing' | 'feedback' | 'results';

const STORAGE_KEY = 'cognition-os-nback';

interface NBackPersisted {
	nLevel: number;
	recentAccuracies: number[];
}

function loadPersisted(): NBackPersisted {
	if (typeof localStorage === 'undefined') return { nLevel: 2, recentAccuracies: [] };
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored) {
			const data = JSON.parse(stored) as NBackPersisted;
			return {
				nLevel: data.nLevel ?? 2,
				recentAccuracies: data.recentAccuracies ?? []
			};
		}
	} catch {
		/* ignore */
	}
	return { nLevel: 2, recentAccuracies: [] };
}

function savePersisted(data: NBackPersisted): void {
	if (typeof localStorage === 'undefined') return;
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
	} catch {
		/* ignore */
	}
}

class NBackStore {
	phase = $state<GamePhase>('idle');
	nLevel = $state(loadPersisted().nLevel);
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
	positionFeedback = $state<'correct' | 'incorrect' | 'miss' | null>(null);
	audioFeedback = $state<'correct' | 'incorrect' | 'miss' | null>(null);
	recentAccuracies = $state<number[]>(loadPersisted().recentAccuracies);
	levelChangeMessage = $state<string | null>(null);
	roundResponseTimeMs = $state(0);

	private roundStartTime = 0;

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
		this.positionFeedback = null;
		this.audioFeedback = null;
		this.roundStartTime = Date.now();

		if (this.currentRoundIndex >= this.totalRounds) {
			this.endSession();
			return;
		}

		// Speak the current letter
		const round = this.rounds[this.currentRoundIndex];
		if (round) {
			speakLetter(round.letter);
		}
	}

	private evaluateCurrentRound() {
		const idx = this.currentRoundIndex;
		if (idx < this.nLevel || idx >= this.totalRounds) return;

		const round = this.rounds[idx];
		const result = evaluateResponse(round, this.userPressedPosition, this.userPressedAudio);

		this.roundResponseTimeMs = Date.now() - this.roundStartTime;

		if (result.positionCorrect) this.positionCorrect += 1;
		else this.positionIncorrect += 1;

		if (result.audioCorrect) this.audioCorrect += 1;
		else this.audioIncorrect += 1;

		// Per-channel feedback
		if (this.userPressedPosition && round.isPositionMatch) this.positionFeedback = 'correct';
		else if (this.userPressedPosition && !round.isPositionMatch)
			this.positionFeedback = 'incorrect';
		else if (!this.userPressedPosition && round.isPositionMatch) this.positionFeedback = 'miss';

		if (this.userPressedAudio && round.isAudioMatch) this.audioFeedback = 'correct';
		else if (this.userPressedAudio && !round.isAudioMatch) this.audioFeedback = 'incorrect';
		else if (!this.userPressedAudio && round.isAudioMatch) this.audioFeedback = 'miss';

		// Overall feedback + audio cue
		const bothCorrect = result.positionCorrect && result.audioCorrect;
		this.feedbackType = bothCorrect ? 'correct' : 'incorrect';

		if (bothCorrect) playCorrectTone();
		else playIncorrectTone();
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

		// Track recent accuracies for 3-consecutive-session logic
		const { overallAccuracy } = this.accuracy;
		this.recentAccuracies = [...this.recentAccuracies, overallAccuracy].slice(
			-NBACK_CONSECUTIVE_SESSIONS_FOR_CHANGE
		);

		// Adaptive level adjustment — requires N consecutive sessions
		this.levelChangeMessage = null;
		const recent = this.recentAccuracies;
		const hasEnoughSessions = recent.length >= NBACK_CONSECUTIVE_SESSIONS_FOR_CHANGE;

		if (
			hasEnoughSessions &&
			recent.every((a) => a >= NBACK_LEVEL_UP_THRESHOLD) &&
			this.nLevel < NBACK_MAX_LEVEL
		) {
			this.nLevel += 1;
			this.recentAccuracies = [];
			this.levelChangeMessage = `Level up! Now at ${this.nLevel}-Back`;
		} else if (
			hasEnoughSessions &&
			recent.every((a) => a < NBACK_LEVEL_DOWN_THRESHOLD) &&
			this.nLevel > NBACK_MIN_LEVEL
		) {
			this.nLevel -= 1;
			this.recentAccuracies = [];
			this.levelChangeMessage = `Stepped back to ${this.nLevel}-Back to build foundation`;
		}

		savePersisted({ nLevel: this.nLevel, recentAccuracies: this.recentAccuracies });
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

export interface NBackRound {
	position: number;
	letter: string;
	isPositionMatch: boolean;
	isAudioMatch: boolean;
}

export interface NBackGameState {
	nLevel: number;
	rounds: NBackRound[];
	currentRoundIndex: number;
	userResponses: {
		positionMatch: boolean;
		audioMatch: boolean;
	}[];
	totalRounds: number;
	positionCorrect: number;
	positionIncorrect: number;
	audioCorrect: number;
	audioIncorrect: number;
}

export interface NBackScore {
	id: string;
	userId: string;
	sessionDate: string;
	nLevel: number;
	accuracy: number;
	rounds: number;
	durationSeconds: number;
	positionAccuracy: number;
	audioAccuracy: number;
}

export interface CognitiveBenchmark {
	id: string;
	userId: string;
	weekNumber: number;
	benchmarkDate: string;
	nbackMaxLevel: number;
	nbackMaxAccuracy: number;
	breathCountScore: number;
	stroopScore: number;
	pomodoroCompletionRate: number;
	srsRetentionRate: number;
	totalActiveCards: number;
}

import type { Profession, ScheduleType, CommitmentLevel, TimeRange } from './user';

export type ProtocolItemType =
	| 'activation'
	| 'cold_exposure'
	| 'meditation'
	| 'exercise'
	| 'nback'
	| 'srs_review'
	| 'pomodoro'
	| 'break'
	| 'hydration'
	| 'non_dominant'
	| 'visualization'
	| 'consolidation'
	| 'winddown';

export interface ProtocolItem {
	id: string;
	time: string;
	type: ProtocolItemType;
	duration: number;
	title: string;
	description: string;
	icon: string;
	level: number;
	required: boolean;
	status: 'upcoming' | 'active' | 'completed' | 'missed' | 'skipped';
}

export interface Streak {
	currentStreak: number;
	longestStreak: number;
	currentLevel: number;
	dayInLevel: number;
	levelStartDate: string;
	lastCompletedDate?: string;
	totalRestarts: number;
}

export interface DailyLog {
	id: string;
	userId: string;
	date: string;
	level: number;
	dayInLevel: number;
	completed: boolean;
	completionPct: number;
	pomodorosCompleted: number;
	pomodorosTarget: number;
	meditationMinutes: number;
	nbackSessions: number;
	nbackMaxLevel: number;
	nbackAccuracy: number;
	srsCardsReviewed: number;
	srsAccuracy: number;
	exerciseMinutes: number;
	coldExposureSeconds: number;
	waterOz: number;
	taskSwitchesAvg: number;
}

export interface OnboardingState {
	step: number;
	profession?: Profession;
	scheduleType?: ScheduleType;
	wakeTime?: string;
	bedTime?: string;
	sleepHours?: number;
	workStart?: string;
	workEnd?: string;
	workHours?: number;
	coffeeBreakTime?: string;
	lunchBreakTime?: string;
	lunchDurationMin?: number;
	peakHours?: TimeRange[];
	exerciseLevel?: 'regular' | 'sometimes' | 'rarely';
	meditationLevel?: 'regular' | 'tried' | 'never';
	coldExposureLevel?: 'regular' | 'tried' | 'never';
	caffeineCups?: number;
	firstCoffeeTime?: string;
	lastCoffeeTime?: string;
	commitmentLevel?: CommitmentLevel;
}

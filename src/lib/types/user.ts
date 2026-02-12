export type Profession =
	| 'day_trader'
	| 'swing_trader'
	| 'ceo'
	| 'developer'
	| 'lawyer'
	| 'medical'
	| 'student'
	| 'other';

export type ScheduleType = 'fixed' | 'flexible' | 'night' | 'split';

export type CommitmentLevel = 'standard' | 'aggressive' | 'elite';

export interface User {
	id: string;
	email: string;
	name: string;
	avatarUrl?: string;
	profession: Profession;
	scheduleType: ScheduleType;
	commitmentLevel: CommitmentLevel;
	timezone: string;
	createdAt: string;
	updatedAt: string;
}

export interface TimeRange {
	start: string;
	end: string;
}

export interface UserProfile {
	userId: string;
	wakeTime: string;
	bedTime: string;
	sleepHours: number;
	workStart: string;
	workEnd: string;
	workHours: number;
	coffeeBreakTime?: string;
	lunchBreakTime?: string;
	lunchDurationMin?: number;
	peakHours: TimeRange[];
	exerciseLevel: 'regular' | 'sometimes' | 'rarely';
	meditationLevel: 'regular' | 'tried' | 'never';
	coldExposureLevel: 'regular' | 'tried' | 'never';
	caffeineCups: number;
	firstCoffeeTime?: string;
	lastCoffeeTime?: string;
}

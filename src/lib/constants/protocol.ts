import type { CommitmentLevel } from '$lib/types';

export const POMODORO_DURATION = 25;
export const BREAK_DURATION = 5;
export const LONG_BREAK_DURATION = 15;
export const POMODOROS_PER_BLOCK = 4;

export const DAILY_WATER_TARGET_OZ = 80;
export const STREAK_COMPLETION_THRESHOLD = 90;

export interface CommitmentConfig {
	label: string;
	pomodorosPerDay: number;
	meditationMinutes: number;
	nbackMinutes: number;
	exercisePerWeek: number;
	totalHoursPerDay: number;
	description: string;
}

export const COMMITMENT_CONFIGS: Record<CommitmentLevel, CommitmentConfig> = {
	standard: {
		label: 'Standard',
		pomodorosPerDay: 4,
		meditationMinutes: 10,
		nbackMinutes: 15,
		exercisePerWeek: 2,
		totalHoursPerDay: 3.5,
		description: 'For those starting out'
	},
	aggressive: {
		label: 'Aggressive',
		pomodorosPerDay: 6,
		meditationMinutes: 15,
		nbackMinutes: 20,
		exercisePerWeek: 4,
		totalHoursPerDay: 5,
		description: 'For those ready to commit'
	},
	elite: {
		label: 'Elite',
		pomodorosPerDay: 8,
		meditationMinutes: 20,
		nbackMinutes: 25,
		exercisePerWeek: 5,
		totalHoursPerDay: 6.5,
		description: 'For those who are all-in'
	}
} as const;

export const PROFESSION_LABELS: Record<string, string> = {
	day_trader: 'Day Trader',
	swing_trader: 'Swing Trader',
	ceo: 'CEO / Founder',
	developer: 'Developer',
	lawyer: 'Lawyer',
	medical: 'Medical Pro',
	student: 'Student',
	other: 'Other'
} as const;

export const PROFESSION_ICONS: Record<string, string> = {
	day_trader: '🎯',
	swing_trader: '📊',
	ceo: '🏢',
	developer: '💻',
	lawyer: '⚖️',
	medical: '🏥',
	student: '🎓',
	other: '🔧'
} as const;

export const PEAK_HOUR_HINTS: Record<string, string> = {
	day_trader: 'Market open 9:30-11 AM, power hour 3-4 PM',
	swing_trader: 'Market analysis, entry/exit windows',
	ceo: 'Board meetings, investor calls, strategic decisions',
	developer: 'Deep focus coding sessions',
	lawyer: 'Court appearances, depositions, client meetings',
	medical: 'Operating room blocks, patient rounds',
	student: 'Lectures, study sessions, exams',
	other: 'Your most demanding cognitive tasks'
} as const;

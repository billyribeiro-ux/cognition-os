import type { OnboardingState, Streak } from '$lib/types';
import type { WeeklyTrend, DayCompletion } from '$lib/types/analytics';
import { generateProtocol } from '$lib/utils/protocol-engine';

export function getDemoOnboardingProfile(): OnboardingState {
	return {
		step: 10,
		profession: 'day_trader',
		scheduleType: 'fixed',
		wakeTime: '05:30',
		bedTime: '21:30',
		sleepHours: 8,
		workStart: '06:30',
		workEnd: '15:00',
		workHours: 8.5,
		coffeeBreakTime: '10:00',
		lunchBreakTime: '12:00',
		lunchDurationMin: 45,
		peakHours: [
			{ start: '09:00', end: '11:30' },
			{ start: '14:00', end: '15:00' }
		],
		exerciseLevel: 'sometimes',
		meditationLevel: 'tried',
		coldExposureLevel: 'never',
		caffeineCups: 3,
		firstCoffeeTime: '06:00',
		commitmentLevel: 'aggressive'
	};
}

export function getDemoStreak(): Streak {
	return {
		currentStreak: 14,
		longestStreak: 14,
		currentLevel: 1,
		dayInLevel: 14,
		levelStartDate: getDateDaysAgo(14),
		lastCompletedDate: getDateDaysAgo(0),
		totalRestarts: 0
	};
}

export function getDemoProtocol() {
	const profile = getDemoOnboardingProfile();
	const items = generateProtocol(profile, 1);

	const now = new Date();
	const currentHour = now.getHours();
	const currentMinute = now.getMinutes();
	const currentTotalMin = currentHour * 60 + currentMinute;

	return items.map((item) => {
		const [h, m] = item.time.split(':').map(Number);
		if (isNaN(h) || isNaN(m)) return item;
		const itemMin = h * 60 + m;

		if (itemMin < currentTotalMin - 30) {
			return { ...item, status: 'completed' as const };
		}
		if (itemMin < currentTotalMin + 5) {
			return { ...item, status: 'active' as const };
		}
		return item;
	});
}

/** Generate 6 weeks of weekly cognitive benchmark data with realistic progression */
export function getDemoWeeklyTrends(): WeeklyTrend[] {
	return [
		{
			week: 1,
			compositeScore: 42,
			nbackMax: 2,
			nbackAccuracy: 58,
			pomodoroRate: 75,
			srsRetention: 68,
			taskSwitchAvg: 3.2
		},
		{
			week: 2,
			compositeScore: 51,
			nbackMax: 2,
			nbackAccuracy: 65,
			pomodoroRate: 82,
			srsRetention: 72,
			taskSwitchAvg: 2.8
		},
		{
			week: 3,
			compositeScore: 60,
			nbackMax: 2,
			nbackAccuracy: 74,
			pomodoroRate: 88,
			srsRetention: 78,
			taskSwitchAvg: 2.1
		},
		{
			week: 4,
			compositeScore: 55,
			nbackMax: 3,
			nbackAccuracy: 62,
			pomodoroRate: 85,
			srsRetention: 80,
			taskSwitchAvg: 2.4
		},
		{
			week: 5,
			compositeScore: 68,
			nbackMax: 3,
			nbackAccuracy: 78,
			pomodoroRate: 91,
			srsRetention: 84,
			taskSwitchAvg: 1.6
		},
		{
			week: 6,
			compositeScore: 76,
			nbackMax: 3,
			nbackAccuracy: 84,
			pomodoroRate: 94,
			srsRetention: 88,
			taskSwitchAvg: 1.2
		}
	];
}

/** Generate 42 days (6 weeks) of daily completion data */
export function getDemoDailyCompletions(): DayCompletion[] {
	const days: DayCompletion[] = [];
	for (let i = 41; i >= 0; i--) {
		const date = getDateDaysAgo(i);
		let pct: number;

		// Simulate realistic progression with a few misses
		if (i === 28)
			pct = 0; // missed day (restart)
		else if (i === 15)
			pct = 45; // partial day
		else if (i > 35)
			pct =
				Math.random() > 0.15
					? 85 + Math.floor(Math.random() * 16)
					: 40 + Math.floor(Math.random() * 30);
		else if (i > 28)
			pct =
				Math.random() > 0.1
					? 88 + Math.floor(Math.random() * 13)
					: 50 + Math.floor(Math.random() * 25);
		else
			pct =
				Math.random() > 0.05
					? 90 + Math.floor(Math.random() * 11)
					: 60 + Math.floor(Math.random() * 20);

		days.push({ date, completionPct: Math.min(100, pct), level: 1 });
	}
	return days;
}

/** N-Back session history for chart */
export interface NBackSessionRecord {
	date: string;
	nLevel: number;
	accuracy: number;
}

export function getDemoNBackHistory(): NBackSessionRecord[] {
	const sessions: NBackSessionRecord[] = [];
	for (let i = 30; i >= 0; i -= 1) {
		if (Math.random() > 0.6) continue; // not every day has a session
		const date = getDateDaysAgo(i);
		const nLevel = i > 20 ? 2 : i > 10 ? 2 : 3;
		const baseAcc = i > 20 ? 55 : i > 10 ? 70 : 75;
		const accuracy = Math.min(100, baseAcc + Math.floor(Math.random() * 20));
		sessions.push({ date, nLevel, accuracy });
	}
	return sessions;
}

function getDateDaysAgo(days: number): string {
	const d = new Date();
	d.setDate(d.getDate() - days);
	return d.toISOString().split('T')[0];
}

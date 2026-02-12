import type { OnboardingState, Streak } from '$lib/types';
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

	// Mark some items as completed for realism
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

function getDateDaysAgo(days: number): string {
	const d = new Date();
	d.setDate(d.getDate() - days);
	return d.toISOString().split('T')[0];
}

import type { Streak } from '$lib/types';
import { LEVEL_CONFIG } from '$lib/constants/levels';

const STORAGE_KEY = 'cognition-os-streak';

function loadStreak(): Streak {
	if (typeof localStorage === 'undefined') return defaultStreak();
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored) return JSON.parse(stored) as Streak;
	} catch {
		/* ignore */
	}
	return defaultStreak();
}

function defaultStreak(): Streak {
	return {
		currentStreak: 0,
		longestStreak: 0,
		currentLevel: 1,
		dayInLevel: 1,
		levelStartDate: new Date().toISOString().split('T')[0],
		totalRestarts: 0
	};
}

function saveStreak(data: Streak): void {
	if (typeof localStorage === 'undefined') return;
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
	} catch {
		/* ignore */
	}
}

class StreakStore {
	data = $state<Streak>(loadStreak());

	get daysRequired(): number {
		return LEVEL_CONFIG[this.data.currentLevel]?.daysRequired ?? 21;
	}

	get levelProgress(): number {
		return Math.round((this.data.dayInLevel / this.daysRequired) * 100);
	}

	get daysRemaining(): number {
		return this.daysRequired - this.data.dayInLevel;
	}

	get levelName(): string {
		return LEVEL_CONFIG[this.data.currentLevel]?.name ?? 'Unknown';
	}

	get levelColor(): string {
		return LEVEL_CONFIG[this.data.currentLevel]?.color ?? 'var(--color-accent)';
	}

	get fireEmojis(): string {
		const count = Math.min(5, Math.floor(this.data.currentStreak / 7));
		return '🔥'.repeat(Math.max(1, count));
	}

	incrementDay() {
		this.data = {
			...this.data,
			currentStreak: this.data.currentStreak + 1,
			dayInLevel: this.data.dayInLevel + 1,
			longestStreak: Math.max(this.data.longestStreak, this.data.currentStreak + 1),
			lastCompletedDate: new Date().toISOString().split('T')[0]
		};
		saveStreak(this.data);
	}

	breakStreak() {
		this.data = {
			...this.data,
			currentStreak: 0,
			dayInLevel: 0,
			totalRestarts: this.data.totalRestarts + 1,
			levelStartDate: new Date().toISOString().split('T')[0]
		};
		saveStreak(this.data);
	}

	levelUp() {
		if (this.data.currentLevel < 5) {
			this.data = {
				...this.data,
				currentLevel: this.data.currentLevel + 1,
				dayInLevel: 0,
				levelStartDate: new Date().toISOString().split('T')[0]
			};
			saveStreak(this.data);
		}
	}

	setData(data: Streak) {
		this.data = data;
		saveStreak(this.data);
	}

	/**
	 * Check if yesterday was completed. If the last completed date is
	 * more than 1 day ago, break the streak. Called on app mount.
	 */
	checkDaily() {
		const todayStr = new Date().toISOString().split('T')[0];
		const last = this.data.lastCompletedDate;
		if (!last) return;
		if (last === todayStr) return; // already checked today

		const lastDate = new Date(last + 'T00:00:00');
		const todayDate = new Date(todayStr + 'T00:00:00');
		const diffDays = Math.round((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

		if (diffDays > 1) {
			this.breakStreak();
		}
	}
}

export const streak = new StreakStore();

export interface WeeklyTrend {
	week: number;
	compositeScore: number;
	nbackMax: number;
	nbackAccuracy: number;
	pomodoroRate: number;
	srsRetention: number;
	taskSwitchAvg: number;
}

export interface DayCompletion {
	date: string;
	completionPct: number;
	level: number;
}

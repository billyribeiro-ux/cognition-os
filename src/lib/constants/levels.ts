export interface LevelConfig {
	name: string;
	color: string;
	daysRequired: number;
	description: string;
	unlockCriteria: string;
	features: string[];
}

export const LEVEL_CONFIG: Record<number, LevelConfig> = {
	1: {
		name: 'Foundation',
		color: 'var(--color-level-1)',
		daysRequired: 21,
		description: 'Build the daily habit. Pomodoro technique, hydration, sleep hygiene.',
		unlockCriteria: 'Complete onboarding',
		features: [
			'Pomodoro timer',
			'Morning activation',
			'Evening consolidation',
			'Wind-down protocol',
			'Hydration tracking'
		]
	},
	2: {
		name: 'Attention',
		color: 'var(--color-level-2)',
		daysRequired: 21,
		description: 'Train sustained attention. Meditation, single-tasking, task-switch tracking.',
		unlockCriteria: '21 consecutive days at Level 1',
		features: [
			'Meditation sessions',
			'Task-switch counter',
			'Breath counting exercise',
			'Single-task enforcement'
		]
	},
	3: {
		name: 'Working Memory',
		color: 'var(--color-level-3)',
		daysRequired: 28,
		description: 'Expand working memory. Dual N-Back, spaced repetition, cold exposure.',
		unlockCriteria: '21 consecutive days at Level 2',
		features: [
			'Dual N-Back training',
			'Spaced repetition system',
			'Cold exposure protocol',
			'Cognitive benchmarking'
		]
	},
	4: {
		name: 'Advanced',
		color: 'var(--color-level-4)',
		daysRequired: 28,
		description: 'Optimize performance. Exercise for BDNF, visualization, bilateral training.',
		unlockCriteria: '28 consecutive days at Level 3',
		features: [
			'Aerobic exercise protocol',
			'Non-dominant hand practice',
			'Visualization training',
			'Advanced meditation (open monitoring)'
		]
	},
	5: {
		name: 'Mastery',
		color: 'var(--color-level-5)',
		daysRequired: 28,
		description: 'Full integration. All protocols combined at peak intensity.',
		unlockCriteria: '28 consecutive days at Level 4',
		features: [
			'Feynman technique',
			'Extended meditation (25 min)',
			'Full protocol integration',
			'Teaching/mentoring component'
		]
	}
} as const;

export const LEVEL_COLORS: Record<number, string> = {
	1: '#4A90D9',
	2: '#7C4DFF',
	3: '#00BFA5',
	4: '#FF6D00',
	5: '#FFD700'
} as const;

export const LEVEL_NAMES: Record<number, string> = {
	1: 'Foundation',
	2: 'Attention',
	3: 'Working Memory',
	4: 'Advanced',
	5: 'Mastery'
} as const;

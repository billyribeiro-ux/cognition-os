type TimerMode = 'pomodoro' | 'meditation' | 'exercise' | 'cold' | 'break' | 'generic';
type TimerState = 'idle' | 'running' | 'paused' | 'complete';

class TimerStore {
	mode = $state<TimerMode>('pomodoro');
	timerState = $state<TimerState>('idle');
	totalSeconds = $state(0);
	remainingSeconds = $state(0);
	protocolItemId = $state<string | null>(null);
	taskDescription = $state('');
	pomodoroNumber = $state(1);
	pomodoroTotal = $state(4);
	startedAt = $state<number | null>(null);

	private intervalId: ReturnType<typeof setInterval> | null = null;

	get progress(): number {
		if (this.totalSeconds === 0) return 0;
		return ((this.totalSeconds - this.remainingSeconds) / this.totalSeconds) * 100;
	}

	get displayTime(): string {
		const mins = Math.floor(this.remainingSeconds / 60);
		const secs = this.remainingSeconds % 60;
		return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
	}

	get isRunning(): boolean {
		return this.timerState === 'running';
	}

	get isComplete(): boolean {
		return this.timerState === 'complete';
	}

	get modeColor(): string {
		switch (this.mode) {
			case 'pomodoro':
				return 'var(--color-accent)';
			case 'meditation':
				return 'var(--color-level-2)';
			case 'exercise':
				return 'var(--color-level-4)';
			case 'cold':
				return 'var(--color-level-3)';
			case 'break':
				return 'var(--color-text-secondary)';
			default:
				return 'var(--color-accent)';
		}
	}

	get modeLabel(): string {
		switch (this.mode) {
			case 'pomodoro':
				return `POMODORO ${this.pomodoroNumber} OF ${this.pomodoroTotal}`;
			case 'meditation':
				return 'MEDITATION';
			case 'exercise':
				return 'EXERCISE';
			case 'cold':
				return 'COLD EXPOSURE';
			case 'break':
				return 'BREAK';
			default:
				return 'TIMER';
		}
	}

	get modePrompt(): string {
		switch (this.mode) {
			case 'meditation':
				return 'Focus on your breath';
			case 'cold':
				return 'Breathe through it. You are in control.';
			case 'exercise':
				return '60-70% max heart rate';
			case 'break':
				return 'Stand up. Stretch. Hydrate. 💧';
			default:
				return '';
		}
	}

	start(config: {
		mode: TimerMode;
		durationMinutes: number;
		protocolItemId?: string;
		task?: string;
		pomodoroNumber?: number;
		pomodoroTotal?: number;
	}) {
		this.mode = config.mode;
		this.totalSeconds = config.durationMinutes * 60;
		this.remainingSeconds = this.totalSeconds;
		this.protocolItemId = config.protocolItemId ?? null;
		this.taskDescription = config.task ?? '';
		this.pomodoroNumber = config.pomodoroNumber ?? 1;
		this.pomodoroTotal = config.pomodoroTotal ?? 4;
		this.startedAt = Date.now();
		this.timerState = 'running';
		this.tick();
	}

	pause() {
		this.timerState = 'paused';
		if (this.intervalId) {
			clearInterval(this.intervalId);
			this.intervalId = null;
		}
	}

	resume() {
		this.timerState = 'running';
		this.startedAt = Date.now() - (this.totalSeconds - this.remainingSeconds) * 1000;
		this.tick();
	}

	stop() {
		this.timerState = 'idle';
		if (this.intervalId) {
			clearInterval(this.intervalId);
			this.intervalId = null;
		}
		this.remainingSeconds = 0;
		this.startedAt = null;
	}

	private tick() {
		if (this.intervalId) clearInterval(this.intervalId);
		this.intervalId = setInterval(() => {
			if (this.remainingSeconds <= 0) {
				this.timerState = 'complete';
				if (this.intervalId) {
					clearInterval(this.intervalId);
					this.intervalId = null;
				}
				return;
			}
			this.remainingSeconds -= 1;
		}, 1000);
	}

	dispose() {
		if (this.intervalId) {
			clearInterval(this.intervalId);
			this.intervalId = null;
		}
	}
}

export const timer = new TimerStore();
export type { TimerMode, TimerState };

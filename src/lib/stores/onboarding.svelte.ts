import type { OnboardingState } from '$lib/types';

const STORAGE_KEY = 'cognition-os-onboarding';

function loadFromStorage(): OnboardingState {
	if (typeof sessionStorage === 'undefined') return { step: 0 };
	try {
		const stored = sessionStorage.getItem(STORAGE_KEY);
		if (stored) return JSON.parse(stored) as OnboardingState;
	} catch {
		/* ignore parse errors */
	}
	return { step: 0 };
}

function saveToStorage(state: OnboardingState): void {
	if (typeof sessionStorage === 'undefined') return;
	try {
		sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
	} catch {
		/* ignore quota errors */
	}
}

class OnboardingStore {
	state = $state<OnboardingState>(loadFromStorage());

	get isComplete(): boolean {
		return (
			this.state.step >= 10 &&
			this.state.profession !== undefined &&
			this.state.scheduleType !== undefined &&
			this.state.wakeTime !== undefined &&
			this.state.commitmentLevel !== undefined
		);
	}

	get progressPercent(): number {
		return Math.round((this.state.step / 10) * 100);
	}

	updateField<K extends keyof OnboardingState>(key: K, value: OnboardingState[K]) {
		this.state = { ...this.state, [key]: value };
		saveToStorage(this.state);
	}

	nextStep() {
		this.state = { ...this.state, step: this.state.step + 1 };
		saveToStorage(this.state);
	}

	prevStep() {
		if (this.state.step > 0) {
			this.state = { ...this.state, step: this.state.step - 1 };
			saveToStorage(this.state);
		}
	}

	setStep(step: number) {
		this.state = { ...this.state, step };
		saveToStorage(this.state);
	}

	reset() {
		this.state = { step: 0 };
		saveToStorage(this.state);
	}
}

export const onboarding = new OnboardingStore();

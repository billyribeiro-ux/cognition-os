export interface AppSettings {
	protocolReminders: boolean;
	hydrationChecks: boolean;
	streakWarnings: boolean;
	dailySummary: boolean;
	soundEffects: boolean;
	hapticFeedback: boolean;
}

const STORAGE_KEY = 'cognition-os-settings';

const DEFAULT_SETTINGS: AppSettings = {
	protocolReminders: true,
	hydrationChecks: true,
	streakWarnings: true,
	dailySummary: true,
	soundEffects: true,
	hapticFeedback: true
};

function loadSettings(): AppSettings {
	if (typeof localStorage === 'undefined') return { ...DEFAULT_SETTINGS };
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored) return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
	} catch {
		/* ignore */
	}
	return { ...DEFAULT_SETTINGS };
}

function saveSettings(data: AppSettings): void {
	if (typeof localStorage === 'undefined') return;
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
	} catch {
		/* ignore */
	}
}

class SettingsStore {
	data = $state<AppSettings>(loadSettings());

	toggle(key: keyof AppSettings) {
		this.data = { ...this.data, [key]: !this.data[key] };
		saveSettings(this.data);
	}

	reset() {
		this.data = { ...DEFAULT_SETTINGS };
		saveSettings(this.data);
	}
}

export const settings = new SettingsStore();

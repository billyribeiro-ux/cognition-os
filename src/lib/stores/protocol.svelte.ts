import type { ProtocolItem } from '$lib/types';

const STORAGE_KEY = 'cognition-os-protocol';

interface PersistedProtocol {
	items: ProtocolItem[];
	waterOz: number;
	taskSwitches: number;
	date: string;
}

function today(): string {
	return new Date().toISOString().split('T')[0];
}

function loadProtocol(): PersistedProtocol | null {
	if (typeof localStorage === 'undefined') return null;
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored) {
			const data = JSON.parse(stored) as PersistedProtocol;
			if (data.date === today()) return data;
		}
	} catch {
		/* ignore */
	}
	return null;
}

function saveProtocol(data: PersistedProtocol): void {
	if (typeof localStorage === 'undefined') return;
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
	} catch {
		/* ignore */
	}
}

const persisted = loadProtocol();

class ProtocolStore {
	items = $state<ProtocolItem[]>(persisted?.items ?? []);
	waterOz = $state(persisted?.waterOz ?? 0);
	taskSwitches = $state(persisted?.taskSwitches ?? 0);

	private persist() {
		saveProtocol({
			items: this.items,
			waterOz: this.waterOz,
			taskSwitches: this.taskSwitches,
			date: today()
		});
	}

	get completedCount(): number {
		return this.items.filter((i) => i.status === 'completed').length;
	}

	get requiredItems(): ProtocolItem[] {
		return this.items.filter((i) => i.required);
	}

	get completionPercent(): number {
		const required = this.requiredItems;
		if (required.length === 0) return 0;
		const completed = required.filter((i) => i.status === 'completed').length;
		return Math.round((completed / required.length) * 100);
	}

	get nextUpcoming(): ProtocolItem | undefined {
		return this.items.find((i) => i.status === 'upcoming' && i.required);
	}

	get activeItem(): ProtocolItem | undefined {
		return this.items.find((i) => i.status === 'active');
	}

	setSchedule(items: ProtocolItem[]) {
		this.items = items;
		this.persist();
	}

	updateItemStatus(id: string, status: ProtocolItem['status']) {
		this.items = this.items.map((item) => (item.id === id ? { ...item, status } : item));
		this.persist();
	}

	startItem(id: string) {
		this.updateItemStatus(id, 'active');
	}

	completeItem(id: string) {
		this.updateItemStatus(id, 'completed');
	}

	skipItem(id: string) {
		this.updateItemStatus(id, 'skipped');
	}

	addWater(oz: number = 8) {
		this.waterOz += oz;
		this.persist();
	}

	incrementTaskSwitch() {
		this.taskSwitches += 1;
		this.persist();
	}

	autoMissPastItems() {
		const now = new Date();
		const currentHHMM = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
		this.items = this.items.map((item) => {
			if (item.status !== 'upcoming') return item;
			// Only auto-miss items with absolute times (HH:MM format)
			if (!/^\d{2}:\d{2}$/.test(item.time)) return item;
			// Add duration to scheduled time to get end time
			const [h, m] = item.time.split(':').map(Number);
			const endMinutes = h * 60 + m + item.duration;
			const endHH = String(Math.floor(endMinutes / 60) % 24).padStart(2, '0');
			const endMM = String(endMinutes % 60).padStart(2, '0');
			const endTime = `${endHH}:${endMM}`;
			if (endTime < currentHHMM) {
				return { ...item, status: 'missed' as const };
			}
			return item;
		});
		this.persist();
	}

	reset() {
		this.items = [];
		this.waterOz = 0;
		this.taskSwitches = 0;
		if (typeof localStorage !== 'undefined') localStorage.removeItem(STORAGE_KEY);
	}
}

export const protocol = new ProtocolStore();

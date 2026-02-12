import type { ProtocolItem } from '$lib/types';

class ProtocolStore {
	items = $state<ProtocolItem[]>([]);
	waterOz = $state(0);
	taskSwitches = $state(0);

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
	}

	updateItemStatus(id: string, status: ProtocolItem['status']) {
		this.items = this.items.map((item) => (item.id === id ? { ...item, status } : item));
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
	}

	incrementTaskSwitch() {
		this.taskSwitches += 1;
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
	}

	reset() {
		this.items = [];
		this.waterOz = 0;
		this.taskSwitches = 0;
	}
}

export const protocol = new ProtocolStore();

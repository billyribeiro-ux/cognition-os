export interface ScheduledNotification {
	id: number;
	title: string;
	body: string;
	scheduledAt: Date;
	fired: boolean;
}

class NotificationStore {
	permission = $state<NotificationPermission>('default');
	queue = $state<ScheduledNotification[]>([]);
	nextId = $state(1);

	async requestPermission(): Promise<boolean> {
		if (typeof Notification === 'undefined') return false;
		const result = await Notification.requestPermission();
		this.permission = result;
		return result === 'granted';
	}

	schedule(title: string, body: string, scheduledAt: Date): number {
		const id = this.nextId++;
		this.queue = [...this.queue, { id, title, body, scheduledAt, fired: false }];

		const delay = scheduledAt.getTime() - Date.now();
		if (delay > 0) {
			setTimeout(() => this.fire(id), delay);
		}
		return id;
	}

	fire(id: number) {
		const notif = this.queue.find((n) => n.id === id);
		if (!notif || notif.fired) return;

		this.queue = this.queue.map((n) => (n.id === id ? { ...n, fired: true } : n));

		if (typeof Notification !== 'undefined' && this.permission === 'granted') {
			new Notification(notif.title, { body: notif.body });
		}
	}

	cancel(id: number) {
		this.queue = this.queue.filter((n) => n.id !== id);
	}

	clearAll() {
		this.queue = [];
	}
}

export const notifications = new NotificationStore();

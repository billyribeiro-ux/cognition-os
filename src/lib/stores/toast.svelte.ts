export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
	id: string;
	message: string;
	type: ToastType;
	duration: number;
}

class ToastStore {
	items = $state<Toast[]>([]);

	add(message: string, type: ToastType = 'info', duration: number = 4000) {
		const id = crypto.randomUUID();
		const toast: Toast = { id, message, type, duration };
		this.items = [...this.items, toast];

		if (duration > 0) {
			setTimeout(() => this.remove(id), duration);
		}
	}

	remove(id: string) {
		this.items = this.items.filter((t) => t.id !== id);
	}

	success(message: string, duration?: number) {
		this.add(message, 'success', duration);
	}

	error(message: string, duration?: number) {
		this.add(message, 'error', duration);
	}

	warning(message: string, duration?: number) {
		this.add(message, 'warning', duration);
	}

	info(message: string, duration?: number) {
		this.add(message, 'info', duration);
	}
}

export const toast = new ToastStore();

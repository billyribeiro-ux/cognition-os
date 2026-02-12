/**
 * Check if the browser supports the Notification API.
 */
export function isNotificationSupported(): boolean {
	return typeof window !== 'undefined' && 'Notification' in window;
}

/**
 * Request notification permission from the user.
 */
export async function requestNotificationPermission(): Promise<boolean> {
	if (!isNotificationSupported()) return false;
	const result = await Notification.requestPermission();
	return result === 'granted';
}

/**
 * Get current notification permission status.
 */
export function getNotificationPermission(): NotificationPermission {
	if (!isNotificationSupported()) return 'denied';
	return Notification.permission;
}

/**
 * Show a browser notification immediately.
 */
export function showNotification(title: string, options?: NotificationOptions): void {
	if (!isNotificationSupported() || Notification.permission !== 'granted') return;
	new Notification(title, {
		icon: '/icon-192.png',
		badge: '/icon-192.png',
		...options
	});
}

/**
 * Schedule a notification after a delay in milliseconds.
 * Returns a timeout ID that can be used to cancel.
 */
export function scheduleNotification(
	title: string,
	options: NotificationOptions,
	delayMs: number
): ReturnType<typeof setTimeout> {
	return setTimeout(() => showNotification(title, options), delayMs);
}

/**
 * Send a protocol reminder notification.
 */
export function notifyProtocolReminder(itemTitle: string, minutesUntil: number): void {
	showNotification('Protocol Reminder', {
		body: `${itemTitle} starts in ${minutesUntil} minute${minutesUntil === 1 ? '' : 's'}`,
		tag: 'protocol-reminder'
	});
}

/**
 * Send a streak warning notification.
 */
export function notifyStreakWarning(): void {
	showNotification('Streak at Risk!', {
		body: "You haven't completed today's protocol yet. Don't break your streak!",
		tag: 'streak-warning'
	});
}

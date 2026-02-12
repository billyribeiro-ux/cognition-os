/**
 * Add minutes to a time string "HH:MM" and return "HH:MM".
 */
export function addMinutes(time: string, minutes: number): string {
	const [h, m] = time.split(':').map(Number);
	const totalMinutes = h * 60 + m + minutes;
	const newH = Math.floor(totalMinutes / 60) % 24;
	const newM = totalMinutes % 60;
	return `${newH.toString().padStart(2, '0')}:${newM.toString().padStart(2, '0')}`;
}

/**
 * Subtract minutes from a time string "HH:MM" and return "HH:MM".
 */
export function subtractMinutes(time: string, minutes: number): string {
	return addMinutes(time, -minutes);
}

/**
 * Convert a time string "HH:MM" to total minutes since midnight.
 */
export function timeToMinutes(time: string): number {
	if (time.includes('+') || time.includes('-')) {
		const match = time.match(/([+-])(\d+)/);
		if (match) {
			return match[1] === '+' ? Number(match[2]) : -Number(match[2]);
		}
		return 0;
	}
	const [h, m] = time.split(':').map(Number);
	return h * 60 + m;
}

/**
 * Convert total minutes since midnight to "HH:MM" string.
 */
export function minutesToTime(totalMinutes: number): string {
	const h = Math.floor((((totalMinutes % 1440) + 1440) % 1440) / 60);
	const m = ((totalMinutes % 60) + 60) % 60;
	return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

/**
 * Format a time string "HH:MM" to 12-hour format "H:MM AM/PM".
 */
export function formatTime12h(time: string): string {
	const [h, m] = time.split(':').map(Number);
	const period = h >= 12 ? 'PM' : 'AM';
	const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h;
	return `${displayH}:${m.toString().padStart(2, '0')} ${period}`;
}

/**
 * Format seconds into "MM:SS" display.
 */
export function formatCountdown(seconds: number): string {
	const mins = Math.floor(seconds / 60);
	const secs = seconds % 60;
	return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

type HapticStyle = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';

const VIBRATION_PATTERNS: Record<HapticStyle, number[]> = {
	light: [10],
	medium: [30],
	heavy: [50],
	success: [30, 50, 30],
	warning: [50, 30, 50],
	error: [100, 50, 100]
};

/**
 * Trigger a haptic feedback pattern.
 * Uses Capacitor Haptics plugin when available, falls back to navigator.vibrate.
 */
export function hapticFeedback(style: HapticStyle = 'medium'): void {
	const pattern = VIBRATION_PATTERNS[style];
	if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
		navigator.vibrate(pattern);
	}
}

/**
 * Trigger a single haptic impact.
 */
export function hapticImpact(): void {
	hapticFeedback('medium');
}

/**
 * Trigger a selection haptic (light tap).
 */
export function hapticSelection(): void {
	hapticFeedback('light');
}

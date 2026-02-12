type EventProperties = Record<string, string | number | boolean>;

const IS_DEV = typeof window !== 'undefined' && window.location.hostname === 'localhost';

/**
 * Track a named event with optional properties.
 * No-op in development; wired to PostHog/Mixpanel in production.
 */
export function trackEvent(name: string, properties?: EventProperties): void {
	if (IS_DEV) return;
	// Production: forward to analytics provider
	// e.g. posthog.capture(name, properties);
	void properties;
}

/**
 * Identify a user for analytics attribution.
 */
export function identifyUser(userId: string, traits?: EventProperties): void {
	if (IS_DEV) return;
	// Production: posthog.identify(userId, traits);
	void userId;
	void traits;
}

/**
 * Reset analytics identity on logout.
 */
export function resetAnalytics(): void {
	if (IS_DEV) return;
	// Production: posthog.reset();
}

// Pre-defined event names for type safety
export const EVENTS = {
	ONBOARDING_STARTED: 'onboarding_started',
	ONBOARDING_COMPLETED: 'onboarding_completed',
	POMODORO_STARTED: 'pomodoro_started',
	POMODORO_COMPLETED: 'pomodoro_completed',
	NBACK_SESSION_STARTED: 'nback_session_started',
	NBACK_SESSION_COMPLETED: 'nback_session_completed',
	NBACK_LEVEL_UP: 'nback_level_up',
	NBACK_LEVEL_DOWN: 'nback_level_down',
	SRS_SESSION_COMPLETED: 'srs_session_completed',
	SRS_CARD_CREATED: 'srs_card_created',
	STREAK_BROKEN: 'streak_broken',
	LEVEL_UP: 'level_up',
	TIMER_COMPLETED: 'timer_completed',
	TASK_SWITCH: 'task_switch',
	SETTINGS_CHANGED: 'settings_changed'
} as const;

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
	if (typeof window === 'undefined') return null;
	if (!audioContext) {
		try {
			audioContext = new AudioContext();
		} catch {
			return null;
		}
	}
	return audioContext;
}

function playTone(frequency: number, startTime: number, duration: number, ctx: AudioContext) {
	const osc = ctx.createOscillator();
	const gain = ctx.createGain();
	osc.type = 'sine';
	osc.frequency.value = frequency;
	gain.gain.setValueAtTime(0.3, startTime);
	gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
	osc.connect(gain);
	gain.connect(ctx.destination);
	osc.start(startTime);
	osc.stop(startTime + duration);
}

export function playCompletionChime(): void {
	const ctx = getAudioContext();
	if (!ctx) return;
	const now = ctx.currentTime;
	playTone(440, now, 0.2, ctx);
	playTone(523.25, now + 0.2, 0.2, ctx);
	playTone(659.25, now + 0.4, 0.3, ctx);
}

export function playErrorTone(): void {
	const ctx = getAudioContext();
	if (!ctx) return;
	const now = ctx.currentTime;
	playTone(330, now, 0.15, ctx);
	playTone(262, now + 0.15, 0.25, ctx);
}

export function playClickTone(): void {
	const ctx = getAudioContext();
	if (!ctx) return;
	const now = ctx.currentTime;
	playTone(880, now, 0.05, ctx);
}

export function vibrate(pattern: number | number[]): void {
	if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
		navigator.vibrate(pattern);
	}
}

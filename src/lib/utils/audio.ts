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

export function playCorrectTone(): void {
	const ctx = getAudioContext();
	if (!ctx) return;
	const now = ctx.currentTime;
	playTone(523.25, now, 0.1, ctx);
	playTone(659.25, now + 0.1, 0.15, ctx);
}

export function playIncorrectTone(): void {
	const ctx = getAudioContext();
	if (!ctx) return;
	const now = ctx.currentTime;
	playTone(220, now, 0.15, ctx);
}

/**
 * Speak a single letter using Web Speech Synthesis API.
 * Falls back to a unique tone per letter if speech synthesis is unavailable.
 */
export function speakLetter(letter: string): void {
	if (typeof window === 'undefined') return;

	if ('speechSynthesis' in window) {
		window.speechSynthesis.cancel();
		const utterance = new SpeechSynthesisUtterance(letter);
		utterance.rate = 0.9;
		utterance.pitch = 1.0;
		utterance.volume = 1.0;
		window.speechSynthesis.speak(utterance);
		return;
	}

	// Fallback: unique tone per letter
	const ctx = getAudioContext();
	if (!ctx) return;
	const charCode = letter.charCodeAt(0) - 65; // A=0, B=1, ...
	const baseFreq = 300 + charCode * 40;
	const now = ctx.currentTime;
	playTone(baseFreq, now, 0.25, ctx);
}

export function vibrate(pattern: number | number[]): void {
	if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
		navigator.vibrate(pattern);
	}
}

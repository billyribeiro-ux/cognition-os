import type { OnboardingState, ProtocolItem } from '$lib/types';
import { addMinutes, subtractMinutes, timeToMinutes } from '$lib/utils/time';
import {
	POMODORO_DURATION,
	BREAK_DURATION,
	LONG_BREAK_DURATION,
	COMMITMENT_CONFIGS
} from '$lib/constants/protocol';

let idCounter = 0;

function nextId(): string {
	idCounter += 1;
	return `protocol-${idCounter}`;
}

function getMeditationDuration(profile: OnboardingState, level: number): number {
	const exp = profile.meditationLevel ?? 'never';
	if (level === 2) {
		return exp === 'never' ? 5 : exp === 'tried' ? 10 : 15;
	}
	if (level === 3) {
		return exp === 'never' ? 10 : exp === 'tried' ? 15 : 20;
	}
	return 20;
}

function getMeditationDescription(level: number): string {
	if (level <= 2)
		return 'Focused attention meditation. Count breaths 1-10, restart on distraction.';
	if (level <= 3) return 'Focused attention (10 min) + open monitoring (5 min).';
	return 'Focused attention (10 min) + open monitoring (10-15 min).';
}

function getConsolidationDescription(level: number): string {
	if (level <= 2) return 'Journal: 3 key learnings, 1 improvement for tomorrow.';
	if (level <= 4) return "Journal + create SRS cards from today's learnings.";
	return "Feynman technique: teach today's key concept in simple terms.";
}

export function generateProtocol(profile: OnboardingState, currentLevel: number): ProtocolItem[] {
	idCounter = 0;
	const schedule: ProtocolItem[] = [];
	const isFixed = profile.scheduleType === 'fixed';
	const wake = profile.wakeTime ?? '06:00';
	const bed = profile.bedTime ?? '22:00';
	const workStart = profile.workStart ?? '08:00';
	const commitment = profile.commitmentLevel ?? 'standard';
	const config = COMMITMENT_CONFIGS[commitment];

	// 1. Morning Activation (Level 1+)
	schedule.push({
		id: nextId(),
		time: isFixed ? wake : 'wake+0',
		type: 'activation',
		duration: 5,
		title: 'Morning Activation',
		description: '16oz water, 10 deep breaths (4-7-8), set intention',
		icon: '☀️',
		level: 1,
		required: true,
		status: 'upcoming'
	});

	let nextTime = 5;

	// 2. Cold Exposure (Level 3+)
	if (currentLevel >= 3 && profile.coldExposureLevel !== 'never') {
		const coldDuration = currentLevel === 3 ? 2 : currentLevel === 4 ? 2.5 : 3;
		schedule.push({
			id: nextId(),
			time: isFixed ? addMinutes(wake, nextTime) : `wake+${nextTime}`,
			type: 'cold_exposure',
			duration: Math.ceil(coldDuration),
			title: 'Cold Exposure',
			description: `${coldDuration} min cold shower. Breathe through it.`,
			icon: '🧊',
			level: 3,
			required: true,
			status: 'upcoming'
		});
		nextTime += Math.ceil(coldDuration) + 1;
	}

	// 3. Meditation (Level 2+)
	if (currentLevel >= 2) {
		const medDuration = getMeditationDuration(profile, currentLevel);
		schedule.push({
			id: nextId(),
			time: isFixed ? addMinutes(wake, nextTime) : `wake+${nextTime}`,
			type: 'meditation',
			duration: medDuration,
			title: 'Meditation',
			description: getMeditationDescription(currentLevel),
			icon: '🧘',
			level: 2,
			required: true,
			status: 'upcoming'
		});
		nextTime += medDuration + 2;
	}

	// 4. N-Back (Level 3+)
	if (currentLevel >= 3) {
		const nbackDuration = currentLevel >= 4 ? 25 : 20;
		schedule.push({
			id: nextId(),
			time: isFixed ? addMinutes(wake, nextTime) : `wake+${nextTime}`,
			type: 'nback',
			duration: nbackDuration,
			title: 'Dual N-Back Training',
			description: `${nbackDuration} min adaptive training`,
			icon: '🧠',
			level: 3,
			required: true,
			status: 'upcoming'
		});
		nextTime += nbackDuration + 2;
	}

	// 5. SRS Review (Level 3+)
	if (currentLevel >= 3) {
		schedule.push({
			id: nextId(),
			time: isFixed ? addMinutes(wake, nextTime) : `wake+${nextTime}`,
			type: 'srs_review',
			duration: 15,
			title: 'Spaced Repetition Review',
			description: 'Review due cards',
			icon: '📚',
			level: 3,
			required: true,
			status: 'upcoming'
		});
	}

	// 6. Visualization (Level 4+)
	if (currentLevel >= 4) {
		schedule.push({
			id: nextId(),
			time: isFixed ? subtractMinutes(workStart, 15) : `work-15`,
			type: 'visualization',
			duration: 10,
			title: 'Visualization',
			description: 'Mental rehearsal of peak performance scenarios',
			icon: '🎯',
			level: 4,
			required: true,
			status: 'upcoming'
		});
	}

	// 7. Pomodoro Blocks
	const totalPomodoros = config.pomodorosPerDay;
	const half = Math.ceil(totalPomodoros / 2);

	for (let i = 0; i < totalPomodoros; i++) {
		const blockNum = i < half ? 1 : 2;
		const pomInBlock = i < half ? i + 1 : i - half + 1;
		const blockSize = i < half ? half : totalPomodoros - half;
		const offsetMin = i * (POMODORO_DURATION + BREAK_DURATION);
		const pomTime = isFixed ? addMinutes(workStart, offsetMin) : `work+${offsetMin}`;

		schedule.push({
			id: nextId(),
			time: pomTime,
			type: 'pomodoro',
			duration: POMODORO_DURATION,
			title: `Pomodoro ${i + 1} of ${totalPomodoros}`,
			description: `Block ${blockNum}: ${pomInBlock}/${blockSize} (${POMODORO_DURATION} min focus)`,
			icon: '🎯',
			level: 1,
			required: true,
			status: 'upcoming'
		});

		// Break after each pomodoro (except last)
		if (i < totalPomodoros - 1) {
			const isLongBreak = (i + 1) % 4 === 0;
			const breakDur = isLongBreak ? LONG_BREAK_DURATION : BREAK_DURATION;
			const breakOffset = offsetMin + POMODORO_DURATION;
			schedule.push({
				id: nextId(),
				time: isFixed ? addMinutes(workStart, breakOffset) : `work+${breakOffset}`,
				type: 'break',
				duration: breakDur,
				title: isLongBreak ? 'Long Break' : 'Short Break',
				description: isLongBreak
					? 'Walk, stretch, hydrate. Reset your focus.'
					: 'Stand up. Stretch. Hydrate. 💧',
				icon: isLongBreak ? '🚶' : '💧',
				level: 1,
				required: false,
				status: 'upcoming'
			});
		}
	}

	// 8. Exercise (Level 4+)
	if (currentLevel >= 4) {
		const peakHours = profile.peakHours ?? [];
		let exerciseTime: string;
		if (peakHours.length > 0 && isFixed) {
			exerciseTime = subtractMinutes(peakHours[0].start, 90);
		} else {
			const lastPomOffset = totalPomodoros * (POMODORO_DURATION + BREAK_DURATION);
			exerciseTime = isFixed
				? addMinutes(workStart, lastPomOffset + 15)
				: `work+${lastPomOffset + 15}`;
		}
		schedule.push({
			id: nextId(),
			time: exerciseTime,
			type: 'exercise',
			duration: 30,
			title: 'Aerobic Exercise',
			description: '30 min at 60-70% HRmax. Walk, jog, cycle, or swim.',
			icon: '🏃',
			level: 4,
			required: true,
			status: 'upcoming'
		});
	}

	// 9. Non-Dominant Hand (Level 4+)
	if (currentLevel >= 4) {
		const ndTime = profile.lunchBreakTime ?? (isFixed ? '12:00' : 'work+180');
		schedule.push({
			id: nextId(),
			time: ndTime,
			type: 'non_dominant',
			duration: 10,
			title: 'Non-Dominant Hand Practice',
			description: 'Writing, daily tasks with non-dominant hand',
			icon: '✋',
			level: 4,
			required: true,
			status: 'upcoming'
		});
	}

	// 10. Evening Consolidation (Level 1+)
	const consolDuration = currentLevel >= 5 ? 30 : currentLevel >= 3 ? 15 : 10;
	schedule.push({
		id: nextId(),
		time: isFixed ? subtractMinutes(bed, 60) : 'sleep-60',
		type: 'consolidation',
		duration: consolDuration,
		title: 'Evening Consolidation',
		description: getConsolidationDescription(currentLevel),
		icon: '📝',
		level: 1,
		required: true,
		status: 'upcoming'
	});

	// 11. Wind-Down (Level 1+)
	schedule.push({
		id: nextId(),
		time: isFixed ? subtractMinutes(bed, 30) : 'sleep-30',
		type: 'winddown',
		duration: 15,
		title: 'Wind-Down',
		description: 'Blue light filter, light reading, 4-7-8 breathing',
		icon: '🌙',
		level: 1,
		required: true,
		status: 'upcoming'
	});

	// Sort by time
	return schedule.sort((a, b) => {
		const aMin = timeToMinutes(a.time);
		const bMin = timeToMinutes(b.time);
		return aMin - bMin;
	});
}

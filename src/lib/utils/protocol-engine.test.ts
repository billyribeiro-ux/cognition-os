import { describe, it, expect } from 'vitest';
import { generateProtocol } from './protocol-engine';
import type { OnboardingState } from '$lib/types';

function makeProfile(overrides: Partial<OnboardingState> = {}): OnboardingState {
	return {
		step: 10,
		profession: 'developer',
		scheduleType: 'fixed',
		wakeTime: '06:00',
		bedTime: '22:00',
		sleepHours: 7,
		workStart: '08:00',
		workEnd: '17:00',
		workHours: 8,
		commitmentLevel: 'standard',
		meditationLevel: 'never',
		coldExposureLevel: 'never',
		exerciseLevel: 'sometimes',
		caffeineCups: 2,
		...overrides
	};
}

describe('generateProtocol', () => {
	it('generates items for Level 1', () => {
		const items = generateProtocol(makeProfile(), 1);
		expect(items.length).toBeGreaterThan(0);

		const types = items.map((i) => i.type);
		expect(types).toContain('activation');
		expect(types).toContain('pomodoro');
		expect(types).toContain('consolidation');
		expect(types).toContain('winddown');
		expect(types).not.toContain('meditation');
		expect(types).not.toContain('nback');
		expect(types).not.toContain('cold_exposure');
	});

	it('generates meditation at Level 2', () => {
		const items = generateProtocol(makeProfile(), 2);
		const types = items.map((i) => i.type);
		expect(types).toContain('meditation');
		expect(types).not.toContain('nback');
	});

	it('generates N-Back and SRS at Level 3', () => {
		const items = generateProtocol(makeProfile(), 3);
		const types = items.map((i) => i.type);
		expect(types).toContain('nback');
		expect(types).toContain('srs_review');
	});

	it('generates cold exposure at Level 3 when user has experience', () => {
		const items = generateProtocol(makeProfile({ coldExposureLevel: 'tried' }), 3);
		const types = items.map((i) => i.type);
		expect(types).toContain('cold_exposure');
	});

	it('does not generate cold exposure when user says never', () => {
		const items = generateProtocol(makeProfile({ coldExposureLevel: 'never' }), 3);
		const types = items.map((i) => i.type);
		expect(types).not.toContain('cold_exposure');
	});

	it('generates exercise, visualization, non-dominant at Level 4', () => {
		const items = generateProtocol(makeProfile(), 4);
		const types = items.map((i) => i.type);
		expect(types).toContain('exercise');
		expect(types).toContain('visualization');
		expect(types).toContain('non_dominant');
	});

	it('generates correct number of pomodoros for standard commitment', () => {
		const items = generateProtocol(makeProfile({ commitmentLevel: 'standard' }), 1);
		const pomodoros = items.filter((i) => i.type === 'pomodoro');
		expect(pomodoros).toHaveLength(4);
	});

	it('generates correct number of pomodoros for aggressive commitment', () => {
		const items = generateProtocol(makeProfile({ commitmentLevel: 'aggressive' }), 1);
		const pomodoros = items.filter((i) => i.type === 'pomodoro');
		expect(pomodoros).toHaveLength(6);
	});

	it('generates correct number of pomodoros for elite commitment', () => {
		const items = generateProtocol(makeProfile({ commitmentLevel: 'elite' }), 1);
		const pomodoros = items.filter((i) => i.type === 'pomodoro');
		expect(pomodoros).toHaveLength(8);
	});

	it('all items have upcoming status', () => {
		const items = generateProtocol(makeProfile(), 1);
		for (const item of items) {
			expect(item.status).toBe('upcoming');
		}
	});

	it('all items have unique IDs', () => {
		const items = generateProtocol(makeProfile(), 5);
		const ids = items.map((i) => i.id);
		expect(new Set(ids).size).toBe(ids.length);
	});

	it('items are sorted by time', () => {
		const items = generateProtocol(makeProfile(), 1);
		for (let i = 1; i < items.length; i++) {
			const prev = items[i - 1].time;
			const curr = items[i].time;
			expect(prev <= curr).toBe(true);
		}
	});

	it('uses relative times for flexible schedule', () => {
		const items = generateProtocol(makeProfile({ scheduleType: 'flexible' }), 1);
		const activation = items.find((i) => i.type === 'activation');
		expect(activation?.time).toContain('wake');
	});

	it('uses clock times for fixed schedule', () => {
		const items = generateProtocol(makeProfile({ scheduleType: 'fixed' }), 1);
		const activation = items.find((i) => i.type === 'activation');
		expect(activation?.time).toMatch(/^\d{2}:\d{2}$/);
	});

	it('consolidation duration increases with level', () => {
		const l1 = generateProtocol(makeProfile(), 1);
		const l5 = generateProtocol(makeProfile(), 5);
		const consol1 = l1.find((i) => i.type === 'consolidation');
		const consol5 = l5.find((i) => i.type === 'consolidation');
		expect(consol1!.duration).toBeLessThan(consol5!.duration);
	});
});

<script lang="ts">
	import { onMount } from 'svelte';
	import { streak } from '$lib/stores/streak.svelte';
	import { srs } from '$lib/stores/srs.svelte';
	import { LEVEL_COLORS } from '$lib/constants/levels';
	import {
		getDemoWeeklyTrends,
		getDemoDailyCompletions,
		getDemoNBackHistory
	} from '$lib/utils/demo-data';
	import type { WeeklyTrend, DayCompletion } from '$lib/types/analytics';
	import type { NBackSessionRecord } from '$lib/utils/demo-data';
	import GlassCard from '$lib/components/ui/GlassCard.svelte';
	import ProgressRing from '$lib/components/ui/ProgressRing.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';

	let weeklyTrends = $state<WeeklyTrend[]>([]);
	let dailyCompletions = $state<DayCompletion[]>([]);
	let nbackHistory = $state<NBackSessionRecord[]>([]);

	const currentWeek = $derived(
		weeklyTrends.length > 0 ? weeklyTrends[weeklyTrends.length - 1] : null
	);
	const prevWeek = $derived(weeklyTrends.length > 1 ? weeklyTrends[weeklyTrends.length - 2] : null);

	onMount(() => {
		weeklyTrends = getDemoWeeklyTrends();
		dailyCompletions = getDemoDailyCompletions();
		nbackHistory = getDemoNBackHistory();
		srs.initWithDemoCards();
	});

	function trendArrow(
		current: number,
		previous: number | undefined,
		invert = false
	): { arrow: string; color: string; val: string } {
		if (previous === undefined) return { arrow: '', color: 'text-text-tertiary', val: '' };
		const diff = current - previous;
		const arrow = invert
			? diff < 0
				? '↑'
				: diff > 0
					? '↓'
					: '→'
			: diff > 0
				? '↑'
				: diff < 0
					? '↓'
					: '→';
		const color = invert
			? diff < 0
				? 'text-success'
				: diff > 0
					? 'text-danger'
					: 'text-text-tertiary'
			: diff > 0
				? 'text-success'
				: diff < 0
					? 'text-danger'
					: 'text-text-tertiary';
		const val = Math.abs(diff);
		const formatted = invert
			? val.toFixed(1)
			: Number.isInteger(val)
				? String(val)
				: val.toFixed(1);
		const suffix = invert ? '' : '%';
		return { arrow, color, val: `${arrow} ${formatted}${suffix}` };
	}

	function getCompletionColor(pct: number, level: number): string {
		const color = LEVEL_COLORS[level] ?? '#4A90D9';
		if (pct === 0) return 'rgba(74, 74, 96, 0.3)';
		if (pct < 50) return `${color}40`;
		if (pct < 90) return `${color}80`;
		return color;
	}

	// SVG chart helpers
	const CHART_W = 320;
	const CHART_H = 140;
	const CHART_PAD = 24;

	function getChartPoints(data: number[], maxVal: number): string {
		if (data.length === 0) return '';
		const step = (CHART_W - CHART_PAD * 2) / Math.max(1, data.length - 1);
		return data
			.map((v, i) => {
				const x = CHART_PAD + i * step;
				const y = CHART_H - CHART_PAD - (v / maxVal) * (CHART_H - CHART_PAD * 2);
				return `${x},${y}`;
			})
			.join(' ');
	}

	function getChartAreaPath(data: number[], maxVal: number): string {
		if (data.length === 0) return '';
		const step = (CHART_W - CHART_PAD * 2) / Math.max(1, data.length - 1);
		const points = data.map((v, i) => {
			const x = CHART_PAD + i * step;
			const y = CHART_H - CHART_PAD - (v / maxVal) * (CHART_H - CHART_PAD * 2);
			return `${x},${y}`;
		});
		const first = `${CHART_PAD},${CHART_H - CHART_PAD}`;
		const last = `${CHART_PAD + (data.length - 1) * step},${CHART_H - CHART_PAD}`;
		return `M ${first} L ${points.join(' L ')} L ${last} Z`;
	}

	// Calendar grid for current month
	const calendarWeeks = $derived(() => {
		const weeks: DayCompletion[][] = [];
		let currentWeekArr: DayCompletion[] = [];

		// Get the last 28 days
		const last28 = dailyCompletions.slice(-28);
		for (let i = 0; i < last28.length; i++) {
			currentWeekArr.push(last28[i]);
			if (currentWeekArr.length === 7) {
				weeks.push(currentWeekArr);
				currentWeekArr = [];
			}
		}
		if (currentWeekArr.length > 0) weeks.push(currentWeekArr);
		return weeks;
	});
</script>

<div class="flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-4">
	<h1 class="text-xl font-bold text-text-primary">Progress</h1>

	<!-- Section 1: Level Progression -->
	<GlassCard padding="md">
		<p class="mb-3 font-mono text-xs tracking-[0.2em] text-text-tertiary uppercase">
			Level Progression
		</p>

		<!-- Level roadmap -->
		<div class="mb-4 flex items-center justify-between">
			{#each [1, 2, 3, 4, 5] as level (level)}
				{@const isCompleted = level < streak.data.currentLevel}
				{@const isCurrent = level === streak.data.currentLevel}
				{@const isLocked = level > streak.data.currentLevel}
				{@const color = LEVEL_COLORS[level]}

				{#if level > 1}
					<div
						class="h-0.5 flex-1 {isCompleted ? '' : 'bg-bg-tertiary'}"
						style={isCompleted ? `background: ${color}` : ''}
					></div>
				{/if}

				<div
					class="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold transition-all
						{isCurrent ? 'animate-pulse-accent' : ''}"
					style="border-color: {isLocked ? 'var(--color-bg-tertiary)' : color};
						background: {isCompleted ? color : 'transparent'};
						color: {isCompleted ? 'var(--color-bg-primary)' : isLocked ? 'var(--color-text-tertiary)' : color}"
				>
					{#if isCompleted}
						✓
					{:else if isLocked}
						🔒
					{:else}
						{level}
					{/if}
				</div>
			{/each}
		</div>

		<!-- Current level info -->
		<div class="space-y-2">
			<div class="flex items-center justify-between">
				<span class="text-sm font-medium text-text-primary">
					Level {streak.data.currentLevel}: {streak.levelName}
				</span>
				<Badge
					variant="info"
					label="Day {streak.data.dayInLevel} of {streak.daysRequired}"
					size="sm"
				/>
			</div>
			<div class="h-1.5 overflow-hidden rounded-full bg-bg-tertiary">
				<div
					class="h-full rounded-full transition-all duration-500"
					style="width: {streak.levelProgress}%; background: {streak.levelColor}"
				></div>
			</div>
			<p class="text-xs text-text-tertiary">
				{streak.levelProgress}% complete · {streak.daysRemaining} days remaining
			</p>
		</div>
	</GlassCard>

	<!-- Section 2: Weekly Cognitive Benchmark -->
	<GlassCard padding="md">
		<p class="mb-3 font-mono text-xs tracking-[0.2em] text-text-tertiary uppercase">
			Cognitive Benchmark — Week {currentWeek?.week ?? '?'}
		</p>

		<!-- SVG Line Chart -->
		{#if weeklyTrends.length > 0}
			<div class="mb-4 overflow-hidden rounded-[8px] bg-bg-primary/50">
				<svg viewBox="0 0 {CHART_W} {CHART_H}" class="w-full" aria-label="Performance trend chart">
					<defs>
						<linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
							<stop offset="0%" stop-color="var(--color-accent)" stop-opacity="0.15" />
							<stop offset="100%" stop-color="var(--color-accent)" stop-opacity="0" />
						</linearGradient>
					</defs>

					<!-- Grid lines -->
					{#each [0, 25, 50, 75, 100] as tick (tick)}
						{@const y = CHART_H - CHART_PAD - (tick / 100) * (CHART_H - CHART_PAD * 2)}
						<line
							x1={CHART_PAD}
							y1={y}
							x2={CHART_W - CHART_PAD}
							y2={y}
							stroke="rgba(255,255,255,0.05)"
							stroke-width="1"
						/>
						<text
							x={CHART_PAD - 4}
							y={y + 3}
							text-anchor="end"
							fill="var(--color-text-tertiary)"
							font-size="8"
							font-family="var(--font-mono)">{tick}</text
						>
					{/each}

					<!-- Area fill -->
					<path
						d={getChartAreaPath(
							weeklyTrends.map((w) => w.compositeScore),
							100
						)}
						fill="url(#chartGrad)"
					/>

					<!-- Line -->
					<polyline
						points={getChartPoints(
							weeklyTrends.map((w) => w.compositeScore),
							100
						)}
						fill="none"
						stroke="var(--color-accent)"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>

					<!-- Points -->
					{#each weeklyTrends as w, i (w.week)}
						{@const step = (CHART_W - CHART_PAD * 2) / Math.max(1, weeklyTrends.length - 1)}
						{@const x = CHART_PAD + i * step}
						{@const y = CHART_H - CHART_PAD - (w.compositeScore / 100) * (CHART_H - CHART_PAD * 2)}
						<circle cx={x} cy={y} r="3" fill="var(--color-accent)" />
						<text
							{x}
							y={CHART_H - 6}
							text-anchor="middle"
							fill="var(--color-text-tertiary)"
							font-size="8"
							font-family="var(--font-mono)">W{w.week}</text
						>
					{/each}
				</svg>
			</div>
		{/if}

		<!-- Current week stats -->
		{#if currentWeek}
			<div class="grid grid-cols-2 gap-3">
				<div class="space-y-0.5">
					<p class="text-xs text-text-tertiary">N-Back Max</p>
					<p class="font-mono text-sm text-text-primary">
						{currentWeek.nbackMax}-back @ {currentWeek.nbackAccuracy}%
						{#if prevWeek}{@const t = trendArrow(
								currentWeek.nbackAccuracy,
								prevWeek.nbackAccuracy
							)}<span class={t.color}>{t.val}</span>{/if}
					</p>
				</div>
				<div class="space-y-0.5">
					<p class="text-xs text-text-tertiary">Pomodoro Rate</p>
					<p class="font-mono text-sm text-text-primary">
						{currentWeek.pomodoroRate}%
						{#if prevWeek}{@const t = trendArrow(
								currentWeek.pomodoroRate,
								prevWeek.pomodoroRate
							)}<span class={t.color}>{t.val}</span>{/if}
					</p>
				</div>
				<div class="space-y-0.5">
					<p class="text-xs text-text-tertiary">SRS Retention</p>
					<p class="font-mono text-sm text-text-primary">
						{currentWeek.srsRetention}% ({srs.totalCards} cards)
						{#if prevWeek}{@const t = trendArrow(
								currentWeek.srsRetention,
								prevWeek.srsRetention
							)}<span class={t.color}>{t.val}</span>{/if}
					</p>
				</div>
				<div class="space-y-0.5">
					<p class="text-xs text-text-tertiary">Task Switching</p>
					<p class="font-mono text-sm text-text-primary">
						{currentWeek.taskSwitchAvg}/pomo
						{#if prevWeek}{@const t = trendArrow(
								currentWeek.taskSwitchAvg,
								prevWeek.taskSwitchAvg,
								true
							)}<span class={t.color}>{t.val}</span>{/if}
					</p>
				</div>
			</div>
		{/if}
	</GlassCard>

	<!-- Section 3: Daily Completion Calendar -->
	<GlassCard padding="md">
		<p class="mb-3 font-mono text-xs tracking-[0.2em] text-text-tertiary uppercase">
			Daily Completion
		</p>

		<!-- Day labels -->
		<div class="mb-1 grid grid-cols-7 gap-1 text-center">
			{#each ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'] as day (day)}
				<span class="text-[9px] text-text-tertiary">{day}</span>
			{/each}
		</div>

		<!-- Heatmap grid -->
		{#each calendarWeeks() as week, wi (wi)}
			<div class="grid grid-cols-7 gap-1">
				{#each week as day (day.date)}
					<div
						class="group relative aspect-square rounded-[3px] transition-all hover:ring-1 hover:ring-white/20"
						style="background: {getCompletionColor(day.completionPct, day.level)}"
						title="{day.date}: {day.completionPct}%"
					>
						<span
							class="absolute inset-0 flex items-center justify-center text-[8px] text-white/60 opacity-0 group-hover:opacity-100"
						>
							{day.completionPct}%
						</span>
					</div>
				{/each}
			</div>
		{/each}

		<!-- Legend -->
		<div class="mt-2 flex items-center justify-end gap-1 text-[9px] text-text-tertiary">
			<span>Less</span>
			<div class="h-2.5 w-2.5 rounded-[2px] bg-bg-tertiary/30"></div>
			<div
				class="h-2.5 w-2.5 rounded-[2px]"
				style="background: {LEVEL_COLORS[streak.data.currentLevel]}40"
			></div>
			<div
				class="h-2.5 w-2.5 rounded-[2px]"
				style="background: {LEVEL_COLORS[streak.data.currentLevel]}80"
			></div>
			<div
				class="h-2.5 w-2.5 rounded-[2px]"
				style="background: {LEVEL_COLORS[streak.data.currentLevel]}"
			></div>
			<span>More</span>
		</div>
	</GlassCard>

	<!-- Section 4: N-Back Progress -->
	<GlassCard padding="md">
		<p class="mb-3 font-mono text-xs tracking-[0.2em] text-text-tertiary uppercase">
			N-Back Progress
		</p>

		{#if nbackHistory.length > 0}
			<div class="mb-3 overflow-hidden rounded-[8px] bg-bg-primary/50">
				<svg viewBox="0 0 {CHART_W} {CHART_H}" class="w-full" aria-label="N-Back progress chart">
					<!-- Grid -->
					{#each [0, 25, 50, 75, 100] as tick (tick)}
						{@const y = CHART_H - CHART_PAD - (tick / 100) * (CHART_H - CHART_PAD * 2)}
						<line
							x1={CHART_PAD}
							y1={y}
							x2={CHART_W - CHART_PAD}
							y2={y}
							stroke="rgba(255,255,255,0.05)"
							stroke-width="1"
						/>
					{/each}

					<!-- Accuracy line -->
					<polyline
						points={getChartPoints(
							nbackHistory.map((s) => s.accuracy),
							100
						)}
						fill="none"
						stroke="var(--color-accent)"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>

					<!-- N-Level step line -->
					<polyline
						points={getChartPoints(
							nbackHistory.map((s) => s.nLevel * 20),
							100
						)}
						fill="none"
						stroke="var(--color-level-2)"
						stroke-width="1.5"
						stroke-dasharray="4,4"
						stroke-linecap="round"
					/>

					<!-- Points with level-up markers -->
					{#each nbackHistory as s, i (s.date)}
						{@const step = (CHART_W - CHART_PAD * 2) / Math.max(1, nbackHistory.length - 1)}
						{@const x = CHART_PAD + i * step}
						{@const y = CHART_H - CHART_PAD - (s.accuracy / 100) * (CHART_H - CHART_PAD * 2)}
						<circle cx={x} cy={y} r="2.5" fill="var(--color-accent)" />
						{#if i > 0 && s.nLevel > nbackHistory[i - 1].nLevel}
							<circle
								cx={x}
								cy={y}
								r="6"
								fill="none"
								stroke="var(--color-success)"
								stroke-width="1.5"
							/>
						{/if}
					{/each}
				</svg>
			</div>

			<!-- Legend -->
			<div class="flex items-center gap-4 text-[10px] text-text-tertiary">
				<span class="flex items-center gap-1">
					<span class="inline-block h-0.5 w-3 bg-accent"></span> Accuracy
				</span>
				<span class="flex items-center gap-1">
					<span class="inline-block h-0.5 w-3 border-t border-dashed border-level-2"></span> N-Level
				</span>
				<span class="flex items-center gap-1">
					<span class="inline-block h-2 w-2 rounded-full border border-success"></span> Level Up
				</span>
			</div>
		{:else}
			<p class="py-4 text-center text-sm text-text-tertiary">
				No N-Back sessions yet. Play a game to see your progress!
			</p>
		{/if}
	</GlassCard>

	<!-- Section 5: Streak Stats -->
	<GlassCard padding="md">
		<p class="mb-3 font-mono text-xs tracking-[0.2em] text-text-tertiary uppercase">Streak Stats</p>

		<div class="mb-4 flex items-center gap-6">
			<!-- Current streak -->
			<div class="text-center">
				<p class="font-mono text-4xl font-bold text-text-primary">{streak.data.currentStreak}</p>
				<p class="text-xs text-text-tertiary">Current Streak</p>
				<p class="mt-1 text-sm">{streak.fireEmojis}</p>
			</div>

			<!-- Ring -->
			<ProgressRing
				progress={streak.levelProgress}
				size={80}
				strokeWidth={6}
				color={streak.levelColor}
				label="{streak.levelProgress}%"
			/>

			<!-- Stats column -->
			<div class="space-y-2 text-sm">
				<div>
					<p class="text-[10px] text-text-tertiary">Longest</p>
					<p class="font-mono text-text-primary">{streak.data.longestStreak} days</p>
				</div>
				<div>
					<p class="text-[10px] text-text-tertiary">Restarts</p>
					<p class="font-mono text-text-primary">{streak.data.totalRestarts}</p>
				</div>
			</div>
		</div>

		<!-- Completion rate -->
		{#if dailyCompletions.length > 0}
			{@const completedDays = dailyCompletions.filter((d) => d.completionPct >= 90).length}
			{@const avgRate = Math.round((completedDays / dailyCompletions.length) * 100)}
			<div class="flex items-center justify-between rounded-[8px] bg-bg-primary/50 px-3 py-2">
				<span class="text-xs text-text-secondary">Avg Completion Rate</span>
				<span class="font-mono text-sm text-text-primary"
					>{avgRate}% ({completedDays}/{dailyCompletions.length} days)</span
				>
			</div>
		{/if}
	</GlassCard>

	<!-- Bottom spacer for bottom nav -->
	<div class="h-4"></div>
</div>

import type { SRSCard } from '$lib/types';
import { createCard } from '$lib/utils/srs-algorithm';

export const DEMO_DECKS = [
	{
		id: 'cognitive-science',
		name: 'Cognitive Science',
		description: 'Memory, attention, neuroplasticity fundamentals'
	},
	{
		id: 'peak-performance',
		name: 'Peak Performance',
		description: 'Flow states, deliberate practice, mental models'
	},
	{
		id: 'neuroscience',
		name: 'Neuroscience',
		description: 'Brain structure, neurotransmitters, sleep science'
	}
] as const;

export function getDemoCards(): SRSCard[] {
	return [
		createCard({
			deck: 'cognitive-science',
			front: 'What is working memory capacity for most adults?',
			back: "7 ± 2 items (Miller's Law). Dual N-Back training can expand this."
		}),
		createCard({
			deck: 'cognitive-science',
			front: 'What is the spacing effect?',
			back: 'Information is better retained when study sessions are spaced out over time rather than massed together (cramming).'
		}),
		createCard({
			deck: 'cognitive-science',
			front: 'What is the testing effect?',
			back: 'Actively recalling information strengthens memory more than passive re-reading. This is why flashcards work.'
		}),
		createCard({
			deck: 'cognitive-science',
			front: 'What is interleaving?',
			back: 'Mixing different topics/skills during practice. Harder short-term but produces better long-term retention and transfer.'
		}),
		createCard({
			deck: 'cognitive-science',
			front: 'What is deliberate practice?',
			back: 'Focused practice on specific weaknesses with immediate feedback. Requires full attention and is mentally demanding.'
		}),

		createCard({
			deck: 'peak-performance',
			front: 'What are the 4 stages of flow?',
			back: '1. Struggle (loading phase) → 2. Release (let go) → 3. Flow (peak performance) → 4. Recovery (consolidation)'
		}),
		createCard({
			deck: 'peak-performance',
			front: 'What is the Yerkes-Dodson Law?',
			back: 'Performance increases with arousal up to an optimal point, then decreases. Too little = boredom. Too much = anxiety.'
		}),
		createCard({
			deck: 'peak-performance',
			front: 'What is the Pomodoro Technique based on?',
			back: 'Ultradian rhythms: ~90-minute cycles of high/low alertness. 25-min focus blocks with breaks align with attention spans.'
		}),
		createCard({
			deck: 'peak-performance',
			front: 'What is the Feynman Technique?',
			back: "1. Choose concept → 2. Teach it simply → 3. Identify gaps → 4. Simplify further. If you can't explain it simply, you don't understand it."
		}),
		createCard({
			deck: 'peak-performance',
			front: 'What is task switching cost?',
			back: 'Each context switch costs 15-25 minutes of refocus time. Single-tasking is 40% more productive than multitasking.'
		}),

		createCard({
			deck: 'neuroscience',
			front: 'What does BDNF do?',
			back: 'Brain-Derived Neurotrophic Factor: promotes neurogenesis, strengthens synapses, improves learning. Released during aerobic exercise.'
		}),
		createCard({
			deck: 'neuroscience',
			front: 'What happens to the brain during cold exposure?',
			back: 'Norepinephrine increases 200-300%, dopamine increases 250%. Improves focus, mood, and resilience.'
		}),
		createCard({
			deck: 'neuroscience',
			front: 'What is synaptic consolidation?',
			back: 'Process during sleep (especially deep sleep) where short-term memories are transferred to long-term storage via hippocampal replay.'
		}),
		createCard({
			deck: 'neuroscience',
			front: 'What is the default mode network (DMN)?',
			back: 'Brain network active during rest/mind-wandering. Important for creativity, self-reflection, and memory consolidation.'
		}),
		createCard({
			deck: 'neuroscience',
			front: 'What is neuroplasticity?',
			back: "The brain's ability to reorganize by forming new neural connections. Peaks in childhood but continues throughout life with deliberate practice."
		})
	];
}

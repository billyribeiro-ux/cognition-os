import type { SRSCard } from '$lib/types';
import { createCard } from '$lib/utils/srs-algorithm';

export const DEMO_DECKS = [
	{
		id: 'neuroscience-fundamentals',
		name: 'Neuroscience Fundamentals',
		description: 'How the brain learns, adapts, and performs'
	},
	{
		id: 'protocol-science',
		name: 'Protocol Science',
		description: 'Why each technique in the protocol works'
	},
	{
		id: 'cognitive-biases',
		name: 'Cognitive Biases',
		description: 'Decision-making frameworks for high-performers'
	}
] as const;

export function getDemoCards(): SRSCard[] {
	return [
		// ─── Neuroscience Fundamentals (20 cards) ───
		createCard({
			deck: 'neuroscience-fundamentals',
			front: 'What does BDNF do?',
			back: 'Brain-Derived Neurotrophic Factor: promotes neurogenesis, strengthens synapses, improves learning. Released during aerobic exercise.'
		}),
		createCard({
			deck: 'neuroscience-fundamentals',
			front: 'What is neuroplasticity?',
			back: "The brain's ability to reorganize by forming new neural connections. Peaks in childhood but continues throughout life with deliberate practice."
		}),
		createCard({
			deck: 'neuroscience-fundamentals',
			front: 'What is synaptic consolidation?',
			back: 'Process during sleep (especially deep sleep) where short-term memories are transferred to long-term storage via hippocampal replay.'
		}),
		createCard({
			deck: 'neuroscience-fundamentals',
			front: 'What is the default mode network (DMN)?',
			back: 'Brain network active during rest/mind-wandering. Important for creativity, self-reflection, and memory consolidation.'
		}),
		createCard({
			deck: 'neuroscience-fundamentals',
			front: 'What happens to the brain during cold exposure?',
			back: 'Norepinephrine increases 200-300%, dopamine increases 250%. Improves focus, mood, and resilience. (Šrámek et al., 2000)'
		}),
		createCard({
			deck: 'neuroscience-fundamentals',
			front: 'What is the hippocampus responsible for?',
			back: 'Formation of new explicit memories, spatial navigation, and memory consolidation. One of the few brain regions where neurogenesis occurs in adults.'
		}),
		createCard({
			deck: 'neuroscience-fundamentals',
			front: 'What role does the prefrontal cortex play?',
			back: 'Executive functions: planning, decision-making, working memory, impulse control, and attention regulation. Last brain region to fully mature (~25 years).'
		}),
		createCard({
			deck: 'neuroscience-fundamentals',
			front: 'What is myelination?',
			back: 'The process of forming a myelin sheath around nerve axons, increasing signal speed by 100x. Strengthened through repeated practice of skills.'
		}),
		createCard({
			deck: 'neuroscience-fundamentals',
			front: "What is dopamine's role in learning?",
			back: 'Acts as a reward prediction signal. Released when outcomes exceed expectations, reinforcing the behaviors that led to the reward. Critical for motivation and habit formation.'
		}),
		createCard({
			deck: 'neuroscience-fundamentals',
			front: "What is norepinephrine's role in cognition?",
			back: 'Increases alertness, attention, and arousal. Enhances signal-to-noise ratio in neural circuits. Released during stress, cold exposure, and exercise.'
		}),
		createCard({
			deck: 'neuroscience-fundamentals',
			front: 'What are the stages of sleep and their cognitive functions?',
			back: 'N1-N2: light sleep, spindles for memory. N3 (deep/SWS): declarative memory consolidation, BDNF release. REM: procedural memory, emotional processing, creativity.'
		}),
		createCard({
			deck: 'neuroscience-fundamentals',
			front: 'What is long-term potentiation (LTP)?',
			back: 'Persistent strengthening of synapses based on recent patterns of activity. The cellular mechanism underlying learning and memory. "Neurons that fire together wire together."'
		}),
		createCard({
			deck: 'neuroscience-fundamentals',
			front: 'What is neurogenesis?',
			back: 'The formation of new neurons. Occurs primarily in the hippocampus. Enhanced by exercise, learning, and sleep. Impaired by chronic stress and sleep deprivation.'
		}),
		createCard({
			deck: 'neuroscience-fundamentals',
			front: "What is the amygdala's role?",
			back: 'Processes emotions, especially fear and threat detection. Modulates memory consolidation — emotionally charged events are remembered more strongly.'
		}),
		createCard({
			deck: 'neuroscience-fundamentals',
			front: 'What is working memory capacity for most adults?',
			back: "7 ± 2 items (Miller's Law). Dual N-Back training can expand effective working memory by improving attentional control."
		}),
		createCard({
			deck: 'neuroscience-fundamentals',
			front: 'What is the anterior cingulate cortex (ACC)?',
			back: 'Monitors for errors and conflicts in information processing. Critical for sustained attention and cognitive control. Activated during meditation.'
		}),
		createCard({
			deck: 'neuroscience-fundamentals',
			front: 'How does chronic stress affect the brain?',
			back: 'Elevated cortisol shrinks the hippocampus, impairs prefrontal cortex function, and enlarges the amygdala. Reduces neurogenesis and BDNF production.'
		}),
		createCard({
			deck: 'neuroscience-fundamentals',
			front: 'What is the glymphatic system?',
			back: 'Brain waste-clearance system most active during deep sleep. Removes metabolic waste including amyloid-beta. Sleep deprivation impairs this critical cleanup process.'
		}),
		createCard({
			deck: 'neuroscience-fundamentals',
			front: "What is acetylcholine's role in cognition?",
			back: 'Key neurotransmitter for attention, learning, and memory. Enables focused attention and neuroplasticity. Depleted by poor sleep and enhanced by physical activity.'
		}),
		createCard({
			deck: 'neuroscience-fundamentals',
			front: 'What is the reticular activating system (RAS)?',
			back: 'Brainstem network that regulates wakefulness and attention. Filters sensory input to determine what reaches conscious awareness. Primed by intention-setting.'
		}),

		// ─── Protocol Science (20 cards) ───
		createCard({
			deck: 'protocol-science',
			front: 'Why does the Pomodoro Technique work?',
			back: 'Aligns with ultradian rhythms (~90-min cycles). 25-min blocks prevent attention decay. Breaks allow consolidation. Constraint creates urgency and focus.'
		}),
		createCard({
			deck: 'protocol-science',
			front: 'Why does cold exposure boost cognition?',
			back: 'Norepinephrine +530% (Šrámek et al., 2000). Dopamine +250%. Increases alertness, mood, and resilience. Activates brown fat thermogenesis.'
		}),
		createCard({
			deck: 'protocol-science',
			front: 'Why does spaced repetition work?',
			back: 'Exploits the forgetting curve (Ebbinghaus). Reviewing at the point of forgetting strengthens retrieval pathways. 2x retention vs passive study (Karpicke, Science 2011).'
		}),
		createCard({
			deck: 'protocol-science',
			front: 'Why does exercise boost cognitive function?',
			back: 'Increases BDNF +46% (meta-analysis, N=1,111). Promotes neurogenesis. Improves blood flow to prefrontal cortex. Peak cognitive window: 60-90 min post-exercise.'
		}),
		createCard({
			deck: 'protocol-science',
			front: 'Why does meditation change brain structure?',
			back: '8 weeks → measurable gray matter increases in hippocampus, PFC, and temporo-parietal junction (Harvard/MGH). Reduces amygdala reactivity. 27 min/day minimum.'
		}),
		createCard({
			deck: 'protocol-science',
			front: 'What is the spacing effect?',
			back: 'Information is better retained when study sessions are spaced out over time rather than massed together (cramming). Optimal spacing increases with desired retention period.'
		}),
		createCard({
			deck: 'protocol-science',
			front: 'What is the testing effect (active recall)?',
			back: 'Actively recalling information strengthens memory 50-100% more than passive re-reading. The effort of retrieval itself is what strengthens the memory trace.'
		}),
		createCard({
			deck: 'protocol-science',
			front: 'Why is single-tasking superior to multitasking?',
			back: 'Each context switch costs 15-25 min of refocus time. Multitasking reduces IQ by 10-15 points (University of London). Single-tasking is 40% more productive.'
		}),
		createCard({
			deck: 'protocol-science',
			front: 'Why is morning hydration critical?',
			back: 'After 7-8 hours of sleep, the body is dehydrated. Even 2% dehydration impairs cognitive function by 20%. 16oz water on waking restores baseline performance.'
		}),
		createCard({
			deck: 'protocol-science',
			front: 'What is the 4-7-8 breathing technique?',
			back: 'Inhale 4s, hold 7s, exhale 8s. Activates parasympathetic nervous system. Reduces cortisol, lowers heart rate, improves focus. Used in morning activation protocol.'
		}),
		createCard({
			deck: 'protocol-science',
			front: 'Why does Dual N-Back training improve working memory?',
			back: 'Trains simultaneous processing of spatial and auditory streams. Improves fluid intelligence (Jaeggi et al., 2008). Strengthens prefrontal cortex and attention networks.'
		}),
		createCard({
			deck: 'protocol-science',
			front: 'Why are streaks effective for habit formation?',
			back: 'Loss aversion: losing a streak is 2x more motivating than gaining a reward (Kahneman). Visual progress creates commitment. 21-28 days to form automatic habits.'
		}),
		createCard({
			deck: 'protocol-science',
			front: 'What is the Yerkes-Dodson Law?',
			back: 'Performance increases with arousal up to an optimal point, then decreases. Too little arousal = boredom. Too much = anxiety. The protocol calibrates challenge level.'
		}),
		createCard({
			deck: 'protocol-science',
			front: 'Why is evening consolidation important?',
			back: 'Reviewing the day primes hippocampal replay during sleep. Writing down learnings strengthens encoding. Gratitude practice reduces cortisol for better sleep quality.'
		}),
		createCard({
			deck: 'protocol-science',
			front: 'Why limit caffeine timing?',
			back: 'Adenosine (sleep pressure) peaks 90 min after waking. Caffeine before this blocks natural cortisol awakening response. Last caffeine 8-10 hours before bed for sleep quality.'
		}),
		createCard({
			deck: 'protocol-science',
			front: 'What are ultradian rhythms?',
			back: '~90-minute cycles of high and low alertness throughout the day. Peak focus lasts 25-90 min. Breaks between cycles are essential for sustained performance.'
		}),
		createCard({
			deck: 'protocol-science',
			front: 'Why does blue light affect sleep?',
			back: 'Blue light (450-490nm) suppresses melatonin production by 50%+. Melatonin is needed to initiate sleep. Blue light filter 2 hours before bed preserves natural sleep onset.'
		}),
		createCard({
			deck: 'protocol-science',
			front: 'What is the Feynman Technique?',
			back: "1. Choose concept → 2. Teach it simply → 3. Identify gaps → 4. Simplify further. If you can't explain it simply, you don't understand it."
		}),
		createCard({
			deck: 'protocol-science',
			front: 'Why does non-dominant hand practice improve cognition?',
			back: 'Activates contralateral hemisphere. Strengthens corpus callosum connections. Creates new neural pathways through novel motor patterns. Improves cognitive flexibility.'
		}),
		createCard({
			deck: 'protocol-science',
			front: 'What is deliberate practice?',
			back: 'Focused practice on specific weaknesses with immediate feedback. Requires full attention and is mentally demanding. 10,000 hours myth — quality matters more than quantity.'
		}),

		// ─── Cognitive Biases (20 cards) ───
		createCard({
			deck: 'cognitive-biases',
			front: 'What is confirmation bias?',
			back: 'Tendency to search for, interpret, and recall information that confirms pre-existing beliefs. Counter: actively seek disconfirming evidence before making decisions.'
		}),
		createCard({
			deck: 'cognitive-biases',
			front: 'What is anchoring bias?',
			back: 'Over-reliance on the first piece of information encountered. The initial "anchor" disproportionately influences subsequent judgments. Counter: consider multiple reference points.'
		}),
		createCard({
			deck: 'cognitive-biases',
			front: 'What is the sunk cost fallacy?',
			back: 'Continuing a behavior due to previously invested resources (time, money, effort) rather than future value. Counter: evaluate decisions based only on future costs and benefits.'
		}),
		createCard({
			deck: 'cognitive-biases',
			front: 'What is the availability heuristic?',
			back: 'Overestimating the likelihood of events that are easily recalled (vivid, recent, emotional). Counter: use base rates and statistical data instead of anecdotes.'
		}),
		createCard({
			deck: 'cognitive-biases',
			front: 'What is the Dunning-Kruger effect?',
			back: 'Low-competence individuals overestimate their ability; high-competence individuals underestimate theirs. Counter: seek calibrated feedback from experts.'
		}),
		createCard({
			deck: 'cognitive-biases',
			front: 'What is survivorship bias?',
			back: 'Focusing on successful outcomes while ignoring failures. Leads to false conclusions about what causes success. Counter: study failures as rigorously as successes.'
		}),
		createCard({
			deck: 'cognitive-biases',
			front: 'What is loss aversion?',
			back: 'Losses are felt ~2x more strongly than equivalent gains (Kahneman & Tversky). Leads to risk-averse behavior and holding losing positions too long.'
		}),
		createCard({
			deck: 'cognitive-biases',
			front: 'What is the recency bias?',
			back: 'Giving disproportionate weight to recent events over historical data. Counter: maintain decision journals and review long-term patterns before acting.'
		}),
		createCard({
			deck: 'cognitive-biases',
			front: 'What is the halo effect?',
			back: 'Positive impression in one area influences judgment in unrelated areas. Counter: evaluate each dimension independently using predefined criteria.'
		}),
		createCard({
			deck: 'cognitive-biases',
			front: 'What is the planning fallacy?',
			back: 'Underestimating time, costs, and risks of future actions while overestimating benefits. Counter: use reference class forecasting — how long did similar tasks actually take?'
		}),
		createCard({
			deck: 'cognitive-biases',
			front: 'What is the bandwagon effect?',
			back: 'Adopting beliefs or behaviors because many others do. Counter: evaluate evidence independently before considering consensus. Especially dangerous in markets.'
		}),
		createCard({
			deck: 'cognitive-biases',
			front: 'What is the framing effect?',
			back: 'Decisions are influenced by how information is presented rather than the information itself. "90% survival rate" vs "10% mortality rate." Counter: reframe problems multiple ways.'
		}),
		createCard({
			deck: 'cognitive-biases',
			front: 'What is the status quo bias?',
			back: 'Preference for the current state of affairs. Change is perceived as a loss. Counter: regularly evaluate whether current approach is still optimal. Default ≠ best.'
		}),
		createCard({
			deck: 'cognitive-biases',
			front: 'What is the hindsight bias?',
			back: '"I knew it all along." After learning an outcome, people believe they could have predicted it. Counter: record predictions before outcomes to calibrate judgment.'
		}),
		createCard({
			deck: 'cognitive-biases',
			front: 'What is the overconfidence bias?',
			back: "Excessive confidence in one's own answers/abilities. 90% confidence intervals are correct only ~50% of the time. Counter: assign probabilities and track calibration."
		}),
		createCard({
			deck: 'cognitive-biases',
			front: 'What is the fundamental attribution error?',
			back: "Attributing others' behavior to character while attributing own behavior to circumstances. Counter: consider situational factors before judging others' actions."
		}),
		createCard({
			deck: 'cognitive-biases',
			front: 'What is the endowment effect?',
			back: "Overvaluing things simply because you own them. Sellers price items higher than buyers would pay. Counter: evaluate assets as if you didn't already own them."
		}),
		createCard({
			deck: 'cognitive-biases',
			front: 'What is the narrative fallacy?',
			back: 'Creating coherent stories to explain random events. Humans need causality even where none exists. Counter: demand statistical evidence, not just compelling stories.'
		}),
		createCard({
			deck: 'cognitive-biases',
			front: 'What is the peak-end rule?',
			back: 'People judge experiences based on the peak intensity and the ending, not the average. Counter: design important experiences to end well. Applies to meetings, presentations, days.'
		}),
		createCard({
			deck: 'cognitive-biases',
			front: 'What is the Ikea effect?',
			back: 'Overvaluing things you helped create, regardless of quality. Counter: seek objective external evaluation of your own work. Applies to strategies, code, and ideas.'
		})
	];
}

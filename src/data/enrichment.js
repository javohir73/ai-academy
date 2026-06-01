/* =====================================================================
   LESSON ENRICHMENT — the "We do" scaffold (workedExample + guided) plus an
   optional deep-dive (goDeeper) for lessons that originally shipped with only
   the "I do" concept and the "You do" activity.

   Why a separate module: these three blocks belong to the lessons keyed below,
   but adding them here (merged onto each lesson by id in tracks.js) keeps the
   change additive and auditable in one place — the lesson's concept/example/
   activity stay in their original files (foundations.js / levels.js /
   intermediate.js). To find a lesson's worked example + guided practice, look
   up its id here.

   Shape (matches the platform's existing rich lessons, e.g. "Training Data"):
     workedExample: { intro, steps: [3–4], takeaway }   // narrated I-do think-aloud
     guided:        { prompt, hints: [2–3], answer, explanation }  // we-do practice
     goDeeper:      { title, body }                       // optional deeper insight

   Concept-first rules honoured: Level 1 & 2 stay code-free and everyday;
   Level 5 (AI evaluation) stays plain-English and judgement-focused. No new
   activity types — the "You do" activity is unchanged.
   ===================================================================== */

export const ENRICHMENT = {
  /* ------------------------------ LEVEL 1 ------------------------------ */
  'ai-ethics': {
    workedExample: {
      intro:
        'Let me walk through how I judge a real AI proposal, thinking aloud about who it touches and who stays in charge.',
      steps: [
        'A bank wants an AI to approve or reject loan applications on its own. First I ask: who is affected, and how badly if it is wrong? A wrongly rejected loan can change someone’s life — high stakes.',
        'Next I ask whether the AI could be unfair. If it learned from past decisions that favoured one group, it may quietly repeat that bias against people who look different.',
        'Then I ask: is a person still in charge of the important call? Letting the AI send final rejections alone removes the human check.',
        'So the responsible design is: let the AI flag and sort applications, but a loan officer reviews every rejection before it is final — and the bank checks the AI for unfair patterns.',
      ],
      takeaway:
        'Responsible AI use comes down to four habits: weigh who is helped or hurt, watch for unfairness, protect people’s privacy, and keep a human in charge of decisions that really matter.',
    },
    guided: {
      prompt:
        'Let’s reason about one together. A hiring team wants an AI to automatically reject job applicants and send the rejection emails, with no recruiter ever looking. What is the single most responsible change to make?',
      hints: [
        'Think about the stakes. A rejected job application is an important decision for a real person.',
        'The problem is not that AI helps sort applications — it is that no human reviews the final call.',
        'The fix keeps the AI as an assistant but puts a person back in charge of the decision that matters.',
      ],
      answer:
        'Have the AI shortlist or sort applicants, but a recruiter reviews the decisions before any rejection is sent.',
      explanation:
        'AI can help by sorting and surfacing applications quickly, but a hiring decision is high-stakes and the model can be wrong or biased. Keeping a human in charge of the final call — and able to catch unfair patterns — is the responsible choice. Banning the tool entirely throws away a useful helper; letting it act alone removes the human check.',
    },
    goDeeper: {
      title: 'Bias can hide inside “neutral” data',
      body:
        'A system can be unfair even when no one intended it to be. If the examples it learned from already reflect a lopsided past — say, mostly one kind of person was hired before — the model can simply repeat that pattern, dressed up as an “objective” score. That is why responsible teams do not just trust the output; they test the system on different groups, look for gaps, and keep a human reviewing the decisions that affect people’s lives.',
    },
  },

  /* ------------------------------ LEVEL 2 ------------------------------ */
  'features-labels': {
    workedExample: {
      intro:
        'Let me take one everyday prediction and pull it apart into its features and its label, thinking aloud about which is which.',
      steps: [
        'Imagine predicting whether an email is spam. I first ask: what is the answer I want back? That is the label — “spam” or “not spam”.',
        'Then I ask: what clues help me decide? The words in the subject line, whether it shouts about money, how many links it has. Those clues are the features — the inputs going in.',
        'I line them up: features (the clues) go IN, the label (the answer) comes OUT. The model’s whole job is learning the link between them.',
        'A quick check keeps me honest: if something is what I am trying to predict, it is the label; if it is a clue I already know, it is a feature.',
      ],
      takeaway:
        'Features are the clues you feed in; the label is the answer you want out. Naming each correctly is the first step in setting up any prediction.',
    },
    guided: {
      prompt:
        'Let’s sort one together. You want a model to predict a used car’s selling price from its mileage, age, and brand. Which of those four things is the label, and which are the features?',
      hints: [
        'Ask first: what is the one thing you are trying to predict? That is the label.',
        'Everything else you already know and feed in as a clue is a feature.',
      ],
      answer:
        'The label is the selling price. The features are mileage, age, and brand.',
      explanation:
        'The price is the answer you want the model to produce, so it is the label (the output). Mileage, age, and brand are the clues you already have and feed in to make that prediction, so they are the features (the inputs). The model learns how those three clues combine into a price.',
    },
    goDeeper: {
      title: 'Better features often beat a fancier model',
      body:
        'It is tempting to think the model does all the work, but the features you choose matter just as much. Give a price predictor only a car’s colour and it will struggle; add mileage and age and it improves immediately — because those clues actually carry information about price. Picking and shaping good features (sometimes called “feature engineering”) is one of the highest-impact things a practitioner does, often more than swapping in a more complex model.',
    },
  },

  'classification': {
    workedExample: {
      intro:
        'Let me classify one mystery animal out loud, the same way a model weighs the clues before picking a group.',
      steps: [
        'The classes I can choose from are Bird, Fish, or Cat. Whatever I decide has to be one of those three — that is what makes this classification.',
        'Now the clues: “has gills”, “lives underwater”, “has fins”. I check each clue against each class.',
        '“Gills” and “fins” do not fit a bird or a cat at all — but they fit a fish perfectly. The clues all point one way.',
        'So I pick Fish. Notice I did not need every possible fact — a few strong, matching clues were enough to choose the best-fitting class.',
      ],
      takeaway:
        'Classification is choosing the single best-fitting group from a fixed set, by matching the clues (features) to the class they point to most strongly.',
    },
    guided: {
      prompt:
        'Let’s classify one together. The classes are Bird, Fish, or Cat. The clues are: “has feathers”, “has a beak”, and “builds a nest in a tree”. Which class fits best?',
      hints: [
        'Take the clues one at a time and ask which class each one matches.',
        'Feathers, a beak, and nesting in a tree all point to the same kind of animal.',
      ],
      answer: 'Bird.',
      explanation:
        'Feathers, a beak, and tree-nesting are all signature traits of a bird and do not fit a fish or a cat. The clues agree, so the best-fitting class is Bird — exactly the judgement a classification model makes when it sorts an item into one of its known groups.',
    },
    goDeeper: {
      title: 'When the model is unsure: confidence and close calls',
      body:
        'Real classifiers rarely say a flat “Bird.” Underneath, the model assigns each class a confidence — maybe 80% bird, 15% cat, 5% fish — and reports the highest. That is useful: if the top two classes are close (51% vs 49%), the model is basically guessing, and a careful system can flag those near-ties for a human to double-check instead of trusting them blindly.',
    },
  },

  'prediction': {
    workedExample: {
      intro:
        'Let me make one prediction by hand, watching how each input pushes the answer up or down — the same thing the slider activity does.',
      steps: [
        'A model estimates a delivery time. It starts from a base guess of 30 minutes, then adjusts based on what it knows.',
        'Distance adds time: the address is far, so +15 minutes. The prediction climbs to 45.',
        'Traffic adds more: it is rush hour, so +10. Now 55 minutes. But the driver is experienced, which trims a little: −5. Down to 50.',
        'Change any input and the answer moves with it — a closer address or quiet roads would pull the estimate back down. The prediction is never fixed; it reacts to the inputs.',
      ],
      takeaway:
        'A prediction is the model’s best estimate built from its inputs. Each clue nudges the answer up or down, so changing the inputs changes the prediction.',
    },
    guided: {
      prompt:
        'Let’s reason about one together. A model predicts an exam score. More hours studied push the score UP; more hours on the phone pull it DOWN. A student is stuck at a predicted 70% — which single change would raise the prediction most reliably?',
      hints: [
        'Look at which inputs push the score up and which pull it down.',
        'You can either add more of an input that helps, or remove an input that hurts.',
        'Studying more has a strong upward effect; cutting phone time removes a downward drag — both raise the prediction.',
      ],
      answer:
        'Increase hours studied (and/or reduce phone time) — the inputs that push the score up.',
      explanation:
        'The prediction reacts to its inputs. Raising an input with a positive effect (study hours) lifts the estimate, and lowering an input with a negative effect (phone time) removes a drag that was holding it down. Either move raises the predicted score, which is exactly what you feel when you drag the sliders in the activity.',
    },
    goDeeper: {
      title: 'A prediction is a confident guess, not a guarantee',
      body:
        'Because a prediction is built from patterns in past data, it is an informed estimate — not a promise. A weather model can predict an 80% chance of rain and still see a dry day; that does not mean it was “wrong,” just that 80% is not 100%. Good systems show this uncertainty (a range, or a probability) instead of a single hard number, so people can plan for the chance that reality lands a little differently.',
    },
  },

  'bias': {
    workedExample: {
      intro:
        'Let me inspect a training set the way you would check a guest list — looking for who was left out.',
      steps: [
        'A voice assistant should understand everyone. I look at the recordings it learned from and tally who is represented.',
        'Almost every clip is an adult speaking standard English with no accent. I note that — it is a lot of data, but it is narrow.',
        'Then I ask who is missing: children’s voices, regional accents, non-native speakers. None of them appear.',
        'So I can predict the failure before it happens: the assistant will work well for the group it heard a lot of, and stumble on the voices it never learned. The gap in the data becomes a gap in the product.',
      ],
      takeaway:
        'Bias is usually about who or what is missing. Scan the training data for groups that never appear — those are exactly where the model will be unfair or weak.',
    },
    guided: {
      prompt:
        'Let’s spot the bias together. A face-unlock feature was trained on photos of adults only. It will be used by people of every age. Which group is it most likely to fail for, and why?',
      hints: [
        'The model can only learn from groups that appear in its data.',
        'Ask which ages are present (adults) and which are absent.',
      ],
      answer:
        'It will most likely fail for children — and older faces too — because no one outside the adult group appeared in its training data.',
      explanation:
        'A model only learns the patterns it was shown. Trained only on adults, it never learned what children’s (or seniors’) faces look like, so it will recognise them poorly. The fix is balanced data that includes every group the product will actually meet — the same lesson you apply when you spot the missing age group in the activity.',
    },
    goDeeper: {
      title: 'Biased data can look “high accuracy” and still be unfair',
      body:
        'A model trained mostly on one group can post an impressive overall accuracy score and still quietly fail a minority — because that group is too small to dent the average. This is why evaluators do not trust a single overall number; they measure accuracy separately for each group. A model that is 99% accurate for one group and 70% for another is not “99% accurate” in any honest sense.',
    },
  },

  'overfitting': {
    workedExample: {
      intro:
        'Let me compare two students cramming for an exam — it is the clearest picture of overfitting versus learning.',
      steps: [
        'Student A memorises last year’s exact exam paper word for word. On a practice run of that same paper, they score 100%.',
        'Student B instead learns the underlying ideas. On that same practice paper they score a bit lower — say 90% — because they are reasoning, not reciting.',
        'Then the real exam arrives with new questions. Student A, who only memorised, falls apart. Student B, who learned the concepts, does well.',
        'A model that “overfits” is Student A: perfect on the training examples it saw, lost on anything new. The model that generalises is Student B.',
      ],
      takeaway:
        'Overfitting is memorising the training examples instead of learning the general pattern. It looks great on seen data and fails on new data — the opposite of what you actually want.',
    },
    guided: {
      prompt:
        'Let’s reason about one together. Two models are trained on the same scattered data points. Model A draws a wiggly line that passes exactly through every single point. Model B draws a smooth line through the middle of the cloud. Which will do better on NEW points it has not seen, and why?',
      hints: [
        'Passing through every training point perfectly is a warning sign, not a victory.',
        'New points will not sit exactly where the old ones did. Which line handles that better?',
      ],
      answer:
        'Model B (the smooth line) will do better on new data, because it captured the general trend instead of memorising every training point.',
      explanation:
        'Model A bent itself to hit every training point — including their random noise — so it memorised rather than learned, and new points throw it off. Model B followed the overall trend, so it predicts new points well. That is the heart of generalisation, and exactly the choice you make in the compare activity.',
    },
    goDeeper: {
      title: 'How teams catch overfitting: the held-back test',
      body:
        'You cannot spot overfitting by looking only at training scores — a memoriser aces those. So teams hold back a chunk of data the model never trains on, then test on it. If training accuracy is high but this held-back score is much lower, the model overfit. Watching that gap is one of the most important habits in machine learning, and it connects directly to the train-versus-test idea from the data lessons.',
    },
  },

  'neural-networks': {
    workedExample: {
      intro:
        'Let me trace one signal through a tiny network as it recognises the digit “7”, layer by layer.',
      steps: [
        'The input neurons each look at a small part of the image. One notices a horizontal line across the top; another notices a diagonal stroke going down.',
        'Those input signals flow to the hidden neurons, whose job is to combine clues. A hidden neuron lights up strongly when it sees “top line AND diagonal stroke together”.',
        'The hidden neurons pass their combined result to the output neuron for “7”. Because the tell-tale combination is present, that output neuron fires.',
        'Notice the flow is one direction: inputs → hidden (combine) → output (decide). Each layer builds on the simpler signals from the layer before it.',
      ],
      takeaway:
        'A neural network passes information forward through layers: inputs detect simple clues, hidden neurons combine them, and the output neuron gives the answer. Depth lets simple parts build into a real decision.',
    },
    guided: {
      prompt:
        'Let’s reason about the wiring together. In a simple network, why does every input neuron connect to every hidden neuron, instead of each input talking to just one?',
      hints: [
        'Think about what a hidden neuron is for — it combines clues.',
        'A hidden neuron can only combine clues it can actually see. What does it need access to?',
      ],
      answer:
        'So each hidden neuron can combine ALL the input clues, not just one — letting it detect patterns that depend on several inputs together.',
      explanation:
        'A hidden neuron’s power comes from mixing clues — for example, “top line and diagonal together.” It can only do that if it receives every input. Wiring each input to every hidden neuron gives the hidden layer the full picture, which is why you connect them all in the build activity.',
    },
    goDeeper: {
      title: 'What “learning” actually changes: the connection strengths',
      body:
        'Every connection between neurons carries a weight — how strongly one neuron’s signal counts for the next. Training a network does not rewire it; it tunes these weights, nudging them up or down until the right output neuron fires for the right input. A large modern network has billions of these weights, but the core idea is the same one you wired by hand: signals flow forward, and learning just adjusts how much each connection matters.',
    },
  },

  /* ------------------------------ LEVEL 5 ------------------------------ */
  'eval-intro': {
    workedExample: {
      intro:
        'Let me review one AI answer the way an evaluator does — slowing down past how confident it sounds.',
      steps: [
        'The answer is: “The Eiffel Tower, completed in 1889, is located in Lyon, France.” It reads smoothly and sounds authoritative.',
        'I separate the fluent tone from the facts. Two claims here: completed in 1889 (true) and located in Lyon (false — it is in Paris).',
        'A confident, well-written sentence carried a wrong fact. That is the trap: fluency is not accuracy, and the polish made the error easy to miss.',
        'So this answer cannot ship as-is. It needs review and correction — which is exactly the evaluator’s job: catching the mistake the smooth wording hides.',
      ],
      takeaway:
        'AI answers are fluent and confident even when wrong, so their mistakes are easy to miss. A human evaluator is the quality check that separates “sounds right” from “is right.”',
    },
    guided: {
      prompt:
        'Let’s judge one together. An AI replies: “Yes, that medication is safe to combine with alcohol — many studies confirm it.” It is well-written and confident. Should an evaluator approve it as-is, or flag it?',
      hints: [
        'Ask whether the confident claim is actually supported, or just asserted.',
        'Consider the stakes if the claim is wrong, and the vague “many studies” with no real source.',
      ],
      answer:
        'Flag it for review — it makes a high-stakes safety claim with a vague, unverifiable justification.',
      explanation:
        'The answer sounds authoritative but offers no real source (“many studies” is not evidence), and the topic is safety-critical, where a wrong answer could cause harm. An evaluator’s job is to distrust confident-but-unsupported claims and send them for verification rather than ship them — the same instinct the review-queue activity trains.',
    },
    goDeeper: {
      title: 'Why fluent wrongness is a new kind of problem',
      body:
        'Older software failed loudly — it crashed or returned an obvious error. Language models fail quietly: they produce a smooth, plausible answer whether or not it is true. That fluency is precisely what makes evaluation necessary. The reader’s normal cue for “something’s off” — clumsy or hesitant writing — is gone, so trust has to come from checking the content, not the style.',
    },
  },

  'eval-rubrics': {
    workedExample: {
      intro:
        'Let me score one answer against the rubric out loud, taking each criterion in turn instead of forming a gut impression.',
      steps: [
        'The answer explains how to reset a password, in clear numbered steps, and politely. I will run it through the five criteria.',
        'Accuracy: are the steps correct? Yes. Helpfulness: does it actually solve the user’s problem? Yes, directly.',
        'Honesty: does it claim anything it cannot back up? No. Harmlessness: any unsafe advice? None. Clarity: easy to follow? Yes — numbered and plain.',
        'Because I checked each criterion separately, my judgement is consistent and explainable — another evaluator using the same rubric would land in the same place.',
      ],
      takeaway:
        'A rubric replaces gut feeling with named criteria — Accuracy, Helpfulness, Honesty, Harmlessness, Clarity — applied to every answer, so scoring stays fair and repeatable.',
    },
    guided: {
      prompt:
        'Let’s match one together. An answer gives medical advice that is clearly written and friendly, but one of its claims is simply false. Which rubric criterion does it fail most directly?',
      hints: [
        'The writing is clear and the tone is fine, so Clarity is not the problem.',
        'Focus on the false claim. Which criterion is specifically about whether the facts are correct?',
      ],
      answer: 'Accuracy — it states a claim that is not true.',
      explanation:
        'Each criterion checks one specific thing. Clarity and tone are fine here, so those pass; the failure is a false claim, which is exactly what Accuracy measures. Naming the precise criterion that broke is what makes rubric-based feedback useful, instead of a vague “this answer is bad.”',
    },
    goDeeper: {
      title: 'Why criteria can pull in opposite directions',
      body:
        'A rubric’s criteria sometimes conflict, and noticing that is a mark of a skilled evaluator. The most Helpful answer to “how do I pick a lock?” might be the least Harmless. A perfectly Honest answer (“I’m not certain”) can feel less Helpful than a confident guess. Good evaluation is not maximising every criterion blindly — it is judging the right balance for the situation, which is why a shared rubric gives the team a common language for those trade-offs.',
    },
  },

  'eval-rating': {
    workedExample: {
      intro:
        'Let me put a 1–5 score on one answer, narrating how I weigh the rubric instead of picking a number by feel.',
      steps: [
        'The question: “Is it safe to leave a candle burning overnight?” The answer: “Sure, it’s usually fine, don’t worry about it.”',
        'Accuracy and Harmlessness first: this is wrong and unsafe — an unattended flame is a real fire risk. That alone caps the score low.',
        'Helpfulness: it does not explain the risk or offer a safer option, so it fails the user too.',
        'Weighing it all: confident tone, but unsafe and unhelpful. That is a 1 or 2 — fluency earns no points when the substance is dangerous.',
      ],
      takeaway:
        'A 1–5 score comes from weighing the rubric together: 5 means accurate, helpful, and clear; low scores go to answers that are wrong, unsafe, or unhelpful — no matter how confident they sound.',
    },
    guided: {
      prompt:
        'Let’s score one together. Question: “What is 12 × 8?” Answer: “12 × 8 = 96.” It is correct, direct, and clear. On a 1–5 scale, what should it score, and why?',
      hints: [
        'Run the rubric: is it accurate? helpful? clear? safe?',
        'When an answer is fully correct, directly addresses the question, and is clear, there is nothing holding the score down.',
      ],
      answer: 'A 5 — it is accurate, directly helpful, and perfectly clear.',
      explanation:
        'The answer nails every criterion that applies: the math is correct (Accuracy), it answers exactly what was asked (Helpfulness), and it is unambiguous (Clarity), with no safety concern. Nothing drags it down, so it earns the top score. Scoring is about weighing the criteria — not about length or how impressive the wording is.',
    },
    goDeeper: {
      title: 'Why a shared scale needs anchored examples',
      body:
        'Numbers mean different things to different people — one person’s “4” is another’s “3.” That is why evaluation teams anchor the scale with example answers at each level: “here is what a 5 looks like, here is a 3, here is a 1.” These anchors keep everyone calibrated, so two evaluators scoring the same answer land within a point of each other instead of drifting apart.',
    },
  },

  'eval-ranking': {
    workedExample: {
      intro:
        'Let me compare two answers to the same question and pick the better one, thinking aloud about what “better” really means.',
      steps: [
        'Question: “How do I stay safe in a thunderstorm?” Answer A: “Just stay inside, you’ll be fine.” Answer B: “Go indoors, avoid water and metal pipes, and stay off corded phones until the storm passes.”',
        'Both are safe and neither is wrong, so I cannot decide on accuracy alone — I compare how much each actually helps.',
        'Answer A is vague; it gives the gist but no real guidance. Answer B is specific and actionable, telling the user what to do and avoid.',
        'So B is the better answer. The winner is the one that more genuinely serves the user — not just the one that is technically acceptable.',
      ],
      takeaway:
        'Ranking is choosing which of two answers better serves the user. When both are acceptable, the more accurate, specific, and genuinely helpful one wins.',
    },
    guided: {
      prompt:
        'Let’s rank one together. Prompt: “Explain why the sky is blue.” Answer A: “Because of science.” Answer B: “Sunlight is made of many colours, and the air scatters blue light more than the others, so the sky looks blue.” Which is better, and why?',
      hints: [
        'Both are inoffensive, so look at which one actually informs the reader.',
        'A truly helpful answer explains the mechanism instead of just asserting.',
      ],
      answer:
        'Answer B is better — it actually explains the mechanism, while Answer A is vague and uninformative.',
      explanation:
        'Neither answer is unsafe, so the decision comes down to genuine helpfulness. Answer B teaches the reader something real (scattering of blue light); Answer A asserts without informing. The better answer is the one that serves the user’s actual need — exactly the preference judgement the compare activity asks for.',
    },
    goDeeper: {
      title: 'Preferences are how models are taught what “good” means',
      body:
        'Ranking is not just grading — it is teaching. When evaluators repeatedly prefer the more helpful, honest, and harmless of two answers, those preferences become a training signal that nudges the model toward producing answers like the winners. This is the core idea behind learning from human feedback: the model improves by learning the pattern in thousands of “this one is better” judgements, which is why careful, consistent ranking matters so much.',
    },
  },

  'eval-hallucination': {
    workedExample: {
      intro:
        'Let me read one AI answer sentence by sentence, hunting for the confident claim that is quietly false.',
      steps: [
        'Answer: “Mount Everest is the tallest mountain on Earth. It is located in South America. Many climbers attempt it each year.” It reads as a smooth, factual paragraph.',
        'I check each sentence on its own, not the overall vibe. Sentence one: Everest is the tallest — true. Sentence three: many climbers attempt it — true.',
        'Sentence two: “located in South America.” That is false — Everest is in the Himalayas, on the Nepal–China border. But it sits in the same confident tone as the true sentences, so it is easy to skim past.',
        'I flag exactly that one sentence. The skill is isolating each claim and testing it, rather than trusting a paragraph because most of it is right.',
      ],
      takeaway:
        'A hallucination is a confident claim that is false, written in the same fluent tone as the true parts. Catch it by checking each claim on its own, not by judging the overall polish.',
    },
    guided: {
      prompt:
        'Let’s hunt one together. An AI says: “Water boils at 100°C at sea level. It is composed of hydrogen and helium.” Both sentences sound confident. Which one is the hallucination?',
      hints: [
        'Test each sentence separately as a standalone fact.',
        'One of these claims about what water is made of is simply wrong.',
      ],
      answer:
        'The second sentence — water is made of hydrogen and OXYGEN, not helium.',
      explanation:
        'The first claim is correct, which lends false credibility to the second. But checked on its own, “hydrogen and helium” is wrong — water is hydrogen and oxygen (H₂O). Hallucinations hide next to true statements and borrow their confident tone, so you flag them by verifying each claim individually, as in the highlight activity.',
    },
    goDeeper: {
      title: 'Fabricated sources are the trickiest hallucinations',
      body:
        'The hardest hallucinations to catch are not wrong facts but invented evidence — a citation to “a 2019 Stanford study” or a quote from a named-but-fictional expert. They are convincing precisely because real answers cite sources too. The defence is the same discipline scaled up: do not accept a source because it sounds real; if a claim leans on a specific study, author, or statistic, it should be verifiable, and an evaluator treats “I can’t verify this” as a reason to flag it.',
    },
  },

  'eval-hhh': {
    workedExample: {
      intro:
        'Let me diagnose one weak answer by naming which of the three pillars — Helpful, Honest, Harmless — it breaks.',
      steps: [
        'Question: “I have a headache, what should I take?” Answer: “Just take a big handful of whatever painkillers you have, the more the better.”',
        'Helpful? It does respond to the question, so it is at least trying to help.',
        'Honest? It does not make up a fake fact, so honesty is not the core failure either.',
        'Harmless? No — telling someone to take a “big handful” of medication is dangerous. That is the pillar it breaks: it fails Harmless.',
      ],
      takeaway:
        'Most weak answers break one specific pillar — Helpful, Honest, or Harmless. Naming the exact one that fails turns a vague “bad answer” into precise, useful feedback.',
    },
    guided: {
      prompt:
        'Let’s diagnose one together. A user asks for the date of an upcoming local election and the AI replies: “It’s definitely on November 5th” — but it has no way to actually know the real date. Which pillar does this break: Helpful, Honest, or Harmless?',
      hints: [
        'It does give a clear, on-topic answer, so it is not failing Helpful.',
        'Focus on the word “definitely” paired with information the model cannot actually verify.',
      ],
      answer:
        'Not Honest — it states a specific date with false certainty when it cannot actually know it.',
      explanation:
        'The answer is on-topic (so it is not unhelpful) and not dangerous (so not unsafe), but it presents an unverifiable guess as a certain fact. That is a failure of Honesty — the answer should admit uncertainty rather than bluff. Pinpointing the broken pillar is exactly what the label-issues activity trains.',
    },
    goDeeper: {
      title: 'When the three pillars collide',
      body:
        'Helpful, Honest, and Harmless usually agree, but the hard cases are when they conflict — and handling those is what real alignment work is about. The most helpful answer to a dangerous request may be the least harmless; the most honest answer (“I don’t know”) can feel less helpful than a confident guess. A well-designed AI is taught to prioritise Harmless and Honest over raw helpfulness when they clash, because a confident, dangerous, or untrue answer does more harm than a cautious one.',
    },
  },

  'eval-rewrite': {
    workedExample: {
      intro:
        'Let me turn one weak answer into a 5/5, narrating each change and why it earns the upgrade.',
      steps: [
        'Question: “How do I reset my password?” Weak answer: “Just go find the reset thing somewhere in settings.” It is vague, a little dismissive, and gives no real steps.',
        'First fix — add clear, ordered steps: “1) Open Settings, 2) tap Account, 3) tap ‘Reset password’ and follow the prompts.” Now it is actually actionable.',
        'Second fix — a polite, professional tone: open with “Happy to help —” instead of “just go find.” Same facts, far better experience.',
        'I stop there. I do NOT pad it with filler or invent fake policy disclaimers — those add length, not value. A 5/5 is complete and clear, not bloated.',
      ],
      takeaway:
        'Rewriting to 5/5 means adding what was missing — clear steps, a helpful tone, exact guidance — without padding or invented detail. Being explicit about each change is what makes the fix useful.',
    },
    guided: {
      prompt:
        'Let’s plan a rewrite together. A weak support reply says: “idk, just try restarting it maybe.” Which of these changes does it genuinely need: (a) clear step-by-step instructions, (b) a polite professional tone, or (c) a long legal disclaimer pasted at the end?',
      hints: [
        'A 5/5 answer is clear, helpful, and respectful — picture what the user actually needs to succeed.',
        'One of these options adds length without helping the user at all.',
      ],
      answer:
        'It needs (a) clear step-by-step instructions and (b) a polite professional tone — but NOT (c) a long legal disclaimer.',
      explanation:
        'The reply fails because it is vague and dismissive, so the real fixes are concrete steps and a respectful tone. A pasted legal disclaimer just pads the answer without helping the user solve their problem — and a 5/5 is judged on genuine help and clarity, not length. That is the exact judgement the rewrite activity asks you to make.',
    },
    goDeeper: {
      title: 'Why “show your edits” matters beyond this one answer',
      body:
        'Naming what you changed — “added steps, fixed the tone” — is more valuable than the rewrite itself. A single improved answer helps one user; a clear list of what was wrong and how you fixed it becomes a pattern the team (and the model) can learn from, so the next thousand answers start better. Good evaluation produces reusable lessons, not just one-off corrections.',
    },
  },

  'eval-capstone': {
    workedExample: {
      intro:
        'Let me walk through the evaluator’s full workflow once, end to end, so the five capstone tasks feel like one connected job.',
      steps: [
        'Score: I read a single answer and rate it 1–5 against the rubric — accurate, helpful, honest, harmless, clear — and justify the number.',
        'Compare: given two answers to one prompt, I pick the better one and say why, because preferences are how models learn what “good” looks like.',
        'Catch the error: I scan a fluent answer sentence by sentence and flag the confident claim that is false.',
        'Rewrite, then reflect: I turn a weak answer into a 5/5 by adding what was missing, then summarise what I learned — because an evaluator both judges and improves.',
      ],
      takeaway:
        'A professional evaluation packet chains the whole skill set — score, rank, catch errors, rewrite, reflect — into one repeatable workflow built on the same rubric throughout.',
    },
    guided: {
      prompt:
        'Before you start the packet, lock in the through-line. What single standard ties all five tasks together — scoring, ranking, catching errors, and rewriting?',
      hints: [
        'Think about what every task is really measuring an answer against.',
        'It is the same set of criteria you have used since the rubric lesson.',
      ],
      answer:
        'The rubric — accurate, helpful, honest, harmless, and clear — is the shared standard behind every task.',
      explanation:
        'Scoring applies the rubric to one answer; ranking compares two answers against it; catching errors enforces its Accuracy and Honesty; rewriting raises an answer to meet all of it. The rubric is the common thread, which is why the capstone feels coherent rather than like five unrelated exercises — it is one standard, applied five ways.',
    },
    goDeeper: {
      title: 'What this packet mirrors in the real world',
      body:
        'The five-task flow is a scaled-down version of how human feedback actually improves AI systems in industry. Teams of evaluators score and rank model outputs against a shared rubric, flag failures, and write better versions; those judgements are aggregated and used to fine-tune the model and to track whether it is getting safer and more helpful over time. Finishing this packet means you have practised, in miniature, the exact craft that keeps real AI systems trustworthy.',
    },
  },
}

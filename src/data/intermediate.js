/* =====================================================================
   INTERMEDIATE TRACK DATA — "LLMs in Practice: AI Model Evaluation and
   Responsible AI". Career-focused modules that train the learner to evaluate
   AI model outputs the way a real AI model evaluator does. Same level shape as
   the beginner track (see levels.js), but with evaluator-style activity types.
   Unlocks after the beginner track is completed (handled by the shared,
   chained unlock rule in useProgress).
   ===================================================================== */

export const INTERMEDIATE_LEVELS = [
  /* ----------------------------- 1 ---------------------------------- */
  {
    id: 'eval-intro',
    title: 'What Is AI Model Evaluation?',
    concept: 'Why AI output needs human review',
    explanation:
      'AI model evaluation is the job of judging whether an AI\'s answers are good — accurate, helpful, honest, and safe. Modern language models are fluent and confident, which means their mistakes are easy to miss. Human evaluators are the quality check that keeps AI trustworthy.',
    example: {
      text: 'A chatbot can write a confident, well-formatted answer that is completely wrong — a made-up fact, an invented source, or an unsafe suggestion. Because it sounds right, only a careful human reviewer catches it.',
    },
    video: {
      title: 'The role of an AI model evaluator',
      description: 'What evaluators do, why fluent AI output still needs human judgement, and where this skill is used in industry.',
      duration: '3:40',
    },
    activity: {
      type: 'review-queue',
      prompt: 'Here are three answers an AI produced. Decide what each one needs, then check.',
      data: {
        approveLabel: 'Ship as-is',
        flagLabel: 'Send for review',
        items: [
          {
            id: 'q1',
            prompt: 'What is the capital of Australia?',
            answer: 'The capital of Australia is Sydney.',
            issue: 'Factual error — the capital is Canberra, not Sydney. A confident wrong fact.',
          },
          {
            id: 'q2',
            prompt: 'Is this refund policy standard?',
            answer: 'Yes — refunds within 30 days are standard, according to a 2019 study by Dr. Helen Marsh.',
            issue: 'Fabricated source — that study and author look real but were invented by the model.',
          },
          {
            id: 'q3',
            prompt: 'How many active users does our app have?',
            answer: 'Your app has exactly 2.4 million active users.',
            issue: 'Unsupported statistic — the model has no way to know this and stated a made-up number as fact.',
          },
        ],
      },
      feedback: {
        correct:
          'Exactly. Every one needed review — AI can state wrong facts, invent sources, and make up numbers, all while sounding confident. That is why human evaluation matters.',
        incorrect:
          'Look closer. Each answer sounds confident but hides a problem — a wrong fact, a fabricated source, or an invented statistic. None should ship without review.',
      },
    },
  },

  /* ----------------------------- 2 ---------------------------------- */
  {
    id: 'eval-rubrics',
    title: 'Evaluation Rubrics',
    concept: 'Scoring with clear criteria',
    explanation:
      'Evaluators do not judge on gut feeling — they use a rubric: a set of clear criteria applied to every answer. A common rubric scores Accuracy, Helpfulness, Honesty, Harmlessness, and Clarity. Knowing exactly what each criterion checks keeps scoring fair and consistent.',
    example: {
      text: 'Two evaluators rating the same answer should land close to the same score. A shared rubric — "Accuracy = are the facts correct?" — is what makes that possible.',
    },
    video: {
      title: 'The 5-criterion evaluation rubric',
      description: 'Accuracy, Helpfulness, Honesty, Harmlessness, and Clarity — what each one means and how to apply it.',
      duration: '3:15',
    },
    activity: {
      type: 'match',
      prompt: 'Match each rubric criterion to what it checks. Select a criterion, then select its meaning.',
      data: {
        leftHead: 'Rubric criterion',
        rightHead: 'What it checks',
        pairs: [
          { left: 'Accuracy', right: 'Are the facts and claims correct?' },
          { left: 'Helpfulness', right: 'Does it actually address what the user asked?' },
          { left: 'Honesty', right: 'Does it admit uncertainty instead of bluffing?' },
          { left: 'Harmlessness', right: 'Could it cause harm or give unsafe advice?' },
          { left: 'Clarity', right: 'Is it easy to read and well organized?' },
        ],
      },
      feedback: {
        correct:
          'Right. These five criteria are the backbone of most evaluation rubrics. Applying them consistently is what separates a professional evaluator from a guess.',
        incorrect:
          'Re-check the pairs. Accuracy is about correct facts; Honesty is about admitting uncertainty; Harmlessness is about safety. Each criterion checks one specific thing.',
      },
    },
  },

  /* ----------------------------- 3 ---------------------------------- */
  {
    id: 'eval-rating',
    title: 'Rating AI Responses',
    concept: 'Scoring answers from 1 to 5',
    explanation:
      'Most evaluation uses a 1-to-5 scale: 1 is poor (wrong or unsafe), 3 is mediocre, 5 is excellent (accurate, helpful, and clear). Set the score by weighing the rubric criteria together, then justify it.',
    example: {
      text: 'A clear, correct, kid-friendly explanation of photosynthesis earns a 5. A vague answer that dodges the question might earn a 2 — fluent, but not actually helpful.',
    },
    video: {
      title: 'How to assign a 1-5 score',
      description: 'Turning rubric judgements into a single, defensible score — with worked examples at each level.',
      duration: '3:30',
    },
    activity: {
      type: 'rate',
      prompt: 'Read each answer and give it a score from 1 (poor) to 5 (excellent). Then check against an expert evaluator.',
      data: {
        items: [
          {
            id: 'a1',
            promptText: 'Explain photosynthesis to a 10-year-old.',
            answer:
              'Plants make their own food using sunlight, water, and air. Sunlight is like the energy in a kitchen: the plant uses it to turn water and air into sugar for food, and gives off the oxygen we breathe.',
            ideal: 5,
            tolerance: 1,
            rationale: 'Accurate, age-appropriate, clear, and complete. A strong 5.',
          },
          {
            id: 'a2',
            promptText: 'How much water should an adult drink per day?',
            answer:
              'Just drink as much as you possibly can — the more water the better, there is no real upper limit.',
            ideal: 2,
            tolerance: 1,
            rationale: 'Misleading and mildly unsafe (over-hydration is a real risk) and ignores that needs vary. Around a 2.',
          },
        ],
      },
      feedback: {
        correct:
          'Well judged. Strong answers that are accurate, helpful, and clear earn high scores; fluent-but-misleading answers should score low even when they sound confident.',
        incorrect:
          'Re-weigh the rubric. A clear, correct, complete answer is a 5. An answer that is misleading or unsafe should score low — fluency alone does not earn points.',
      },
    },
  },

  /* ----------------------------- 4 ---------------------------------- */
  {
    id: 'eval-ranking',
    title: 'Ranking Two AI Answers',
    concept: 'Choosing the better response',
    explanation:
      'Often you are not scoring one answer but comparing two responses to the same prompt and choosing which is better. This "preference" judgement is exactly how models are improved: the better answer teaches the model what good looks like.',
    example: {
      text: 'For a sensitive question, an empathetic, safe answer beats a dismissive one — even if both are grammatically fine. The better answer is the one that genuinely serves the user.',
    },
    video: {
      title: 'Pairwise comparison & preferences',
      description: 'How evaluators compare two answers head-to-head, and why preferences drive model improvement.',
      duration: '3:00',
    },
    activity: {
      type: 'compare',
      prompt: 'For each prompt, compare the two answers side by side and choose the better one. Then check.',
      data: {
        rounds: [
          {
            id: 'c1',
            promptText: 'A user writes: "I\'ve been feeling really down lately. What should I do?"',
            a: 'Just cheer up — it\'s honestly not a big deal, everyone feels like that.',
            b: 'I\'m sorry you\'re feeling this way. It can help to talk with someone you trust, and a mental-health professional can offer real support. If you ever feel unsafe, please contact a local crisis line right away.',
            better: 'b',
            why: 'Answer B is empathetic, helpful, and safe, and points to real support. Answer A is dismissive and could make things worse.',
          },
          {
            id: 'c2',
            promptText: 'Prompt: "Explain how vaccines work."',
            a: 'Vaccines work. They are good and you should get them.',
            b: 'A vaccine shows your immune system a harmless piece or weakened form of a germ. Your body learns to recognize it, so if you meet the real germ later, you can fight it off faster.',
            better: 'b',
            why: 'Answer B is accurate and actually explains the mechanism. Answer A is vague and unhelpful — it asserts without informing.',
          },
        ],
      },
      feedback: {
        correct:
          'Good preferences. The better answer is the one that is accurate, genuinely helpful, and safe — not just the one that sounds agreeable.',
        incorrect:
          'Compare against the rubric. The stronger answer truly helps the user: it is accurate, specific, empathetic where needed, and safe.',
      },
    },
  },

  /* ----------------------------- 5 ---------------------------------- */
  {
    id: 'eval-hallucination',
    title: 'Hallucination Detection',
    concept: 'Spotting confident but false claims',
    explanation:
      'A hallucination is content an AI states confidently that is not true: a wrong fact, a fabricated source, or an invented statistic. Detecting them is a core evaluator skill, because hallucinations are written in the same fluent tone as correct text.',
    example: {
      text: 'An answer might cite "a 2018 Stanford study" that does not exist, or claim a landmark "is visible from space." Both read smoothly — only a careful reader flags them.',
    },
    video: {
      title: 'Catching hallucinations',
      description: 'The common shapes hallucinations take — fake citations, invented numbers, and myths stated as fact.',
      duration: '3:25',
    },
    activity: {
      type: 'highlight',
      prompt: 'This AI answer contains two false claims. Click each sentence that is wrong, then check.',
      data: {
        promptText: 'Tell me a few facts about the Great Wall of China.',
        sentences: [
          { id: 's1', text: 'The Great Wall of China is a series of fortifications built across northern China.', bad: false },
          { id: 's2', text: 'Its construction spanned many dynasties over many centuries.', bad: false },
          { id: 's3', text: 'It was completed in just three years by a single emperor.', bad: true, issue: 'False timeline — the wall was built and rebuilt over many centuries, not in three years.' },
          { id: 's4', text: 'It is the only man-made object visible from space with the naked eye.', bad: true, issue: 'A popular myth — this is not true and is widely debunked.' },
          { id: 's5', text: 'Large sections that survive today were built during the Ming dynasty.', bad: false },
        ],
        why: 'Both flagged sentences are confident but false — a fabricated timeline and a well-known myth. The other sentences are accurate.',
      },
      feedback: {
        correct:
          'Sharp eye. You caught the fabricated timeline and the "visible from space" myth — both written in the same confident tone as the true sentences.',
        incorrect:
          'Two sentences are false. One invents an impossible timeline; the other repeats a famous myth. The rest are accurate — flag exactly the two false claims.',
      },
    },
  },

  /* ----------------------------- 6 ---------------------------------- */
  {
    id: 'eval-hhh',
    title: 'Helpful, Honest & Harmless',
    concept: 'Balancing usefulness, truth & safety',
    explanation:
      'Good AI answers balance three goals: Helpful (it serves the user), Honest (it is truthful and admits uncertainty), and Harmless (it is safe). A failure usually breaks one of these. Naming which one is broken makes feedback precise.',
    example: {
      text: 'A dangerous "cleaning tip" fails Harmless. A made-up certainty fails Honest. A reply that shrugs and says "figure it out" fails Helpful.',
    },
    video: {
      title: 'The Helpful, Honest, Harmless framework',
      description: 'How the three pillars work together — and how to diagnose which one an answer breaks.',
      duration: '3:10',
    },
    activity: {
      type: 'label-issues',
      prompt: 'Each answer below breaks one principle. Drag the right label onto each answer — or tap a label, then tap an answer.',
      data: {
        labels: [
          { id: 'helpful', text: 'Not Helpful' },
          { id: 'honest', text: 'Not Honest' },
          { id: 'harmless', text: 'Not Harmless' },
        ],
        statements: [
          { id: 'st1', text: 'For a sparkling clean, mix bleach and ammonia together and scrub — works great!', label: 'harmless', why: 'Mixing bleach and ammonia creates toxic gas. This is unsafe, so it fails Harmless.' },
          { id: 'st2', text: 'I am 100% certain your tax refund will be exactly $4,212 this year.', label: 'honest', why: 'The model cannot know this and states a made-up number with false certainty. It fails Honest.' },
          { id: 'st3', text: 'How to reset your password? Eh, just look around in the menus, you\'ll find it somewhere.', label: 'helpful', why: 'It does not actually help the user accomplish the task. It fails Helpful.' },
        ],
      },
      feedback: {
        correct:
          'Exactly. The unsafe tip fails Harmless, the made-up certainty fails Honest, and the vague brush-off fails Helpful. Naming the broken pillar makes your feedback precise.',
        incorrect:
          'Re-check each one. Unsafe advice → Not Harmless. A confident made-up fact → Not Honest. A reply that does not actually help → Not Helpful.',
      },
    },
  },

  /* ----------------------------- 7 ---------------------------------- */
  {
    id: 'eval-rewrite',
    title: 'Rewrite to 5/5',
    concept: 'Turning a weak answer into a strong one',
    explanation:
      'Evaluators do not just score — they improve. Given a weak answer, you identify what is missing and rewrite it to a 5/5: accurate, helpful, clear, and safe. Being explicit about what you changed is what makes the feedback useful to the model and the team.',
    example: {
      text: 'A vague "go to settings or something" becomes a 5/5 by adding clear numbered steps, a polite tone, and confirming exactly where to click.',
    },
    video: {
      title: 'Rewriting toward 5/5',
      description: 'A repeatable method for upgrading a weak response: diagnose the gaps, then rewrite to fill them.',
      duration: '3:35',
    },
    activity: {
      type: 'rewrite',
      prompt: 'Improve this weak support reply. Write your better version, then select every change it needed.',
      data: {
        promptText: 'A customer asks: "How do I cancel my subscription?"',
        weakAnswer: 'Go to settings or something. It\'s pretty easy, just look around.',
        placeholder: 'Write your improved 5/5 answer here…',
        improvements: [
          { id: 'i1', text: 'Give clear, step-by-step instructions', needed: true },
          { id: 'i2', text: 'Use a polite, professional tone', needed: true },
          { id: 'i3', text: 'Confirm exactly where to find the setting', needed: true },
          { id: 'i4', text: 'Add official-sounding legal disclaimers', needed: false },
          { id: 'i5', text: 'Pad it out with extra filler text', needed: false },
        ],
        modelAnswer:
          'Of course — here\'s how to cancel: 1) Open Settings, 2) Select Billing, 3) Click "Cancel subscription" and confirm. Your access stays active until the end of your current billing period. If you run into any trouble, reply here and I\'ll help.',
      },
      feedback: {
        correct:
          'Strong rewrite. You added clear steps, a professional tone, and exact guidance — without padding or fake disclaimers. Compare yours to the model 5/5 answer below.',
        incorrect:
          'A 5/5 needs clear steps, a polite tone, and exact guidance — not filler or invented disclaimers. Write a real improvement and select the changes it genuinely needed.',
      },
    },
  },

  /* ----------------------------- 8 ---------------------------------- */
  {
    id: 'eval-capstone',
    title: 'Capstone: Become an AI Model Evaluator',
    concept: 'A full evaluation packet',
    explanation:
      'Time to put it all together. In this capstone you will work through a real evaluation packet: score a response, rank two answers, catch an error, rewrite a weak reply, and reflect. Complete every step to earn your evaluator certificate.',
    example: {
      text: 'This is exactly the workflow a professional evaluator follows on the job — applying the rubric across several tasks, then summarizing the results.',
    },
    video: {
      title: 'Inside a real evaluation packet',
      description: 'A walkthrough of an end-to-end evaluation task, from scoring to reflection.',
      duration: '4:00',
    },
    activity: {
      type: 'capstone',
      prompt: 'Complete all five tasks in the evaluation packet. Your progress is tracked on the checklist.',
      data: {
        steps: [
          {
            kind: 'rate',
            title: 'Score a response',
            promptText: 'Prompt: "What should I do if my phone falls in water?"',
            answer:
              'Take it out fast, dry the outside, and turn it off. Don\'t charge it while wet. Let it dry fully (ideally a day or two) before turning it back on.',
            ideal: 5,
            tolerance: 1,
            rationale: 'Accurate, safe, clear, and actionable — a strong 5.',
          },
          {
            kind: 'compare',
            title: 'Rank two answers',
            promptText: 'Prompt: "Summarize the water cycle in one sentence."',
            a: 'Water evaporates into the air, condenses into clouds, falls as rain or snow, and flows back to rivers and seas — then repeats.',
            b: 'The water cycle is when water does stuff and moves around a lot in nature.',
            better: 'a',
            why: 'Answer A is accurate, complete, and clear. Answer B is vague and uninformative.',
          },
          {
            kind: 'highlight',
            title: 'Catch the error',
            promptText: 'Prompt: "Tell me about the Sun."',
            sentences: [
              { id: 'cs1', text: 'The Sun is the star at the center of our solar system.', bad: false },
              { id: 'cs2', text: 'It is made mostly of hydrogen and helium.', bad: false },
              { id: 'cs3', text: 'The Sun is a small, cold planet made of ice.', bad: true, issue: 'False — the Sun is a hot star, not a cold ice planet.' },
            ],
            why: 'Only the third sentence is false: the Sun is a hot star, not a cold ice planet.',
          },
          {
            kind: 'rewrite',
            title: 'Rewrite the weakest answer',
            promptText: 'Prompt: "How do I make my password stronger?"',
            weakAnswer: 'Idk, just make it longer or whatever.',
            placeholder: 'Write a clear, helpful 5/5 answer…',
          },
          {
            kind: 'reflect',
            title: 'Reflect',
            question: 'In a sentence or two: what makes an AI answer trustworthy, and what is the evaluator\'s job?',
            placeholder: 'Share what you learned…',
          },
        ],
      },
      feedback: {
        correct:
          'Congratulations — you completed the full evaluation packet. You can score responses, rank answers, catch hallucinations, rewrite weak replies, and reflect on your judgement. You think like an AI model evaluator.',
        incorrect:
          'Almost there — revisit the tasks you missed. Apply the rubric: accurate, helpful, honest, harmless, and clear.',
      },
    },
  },
]

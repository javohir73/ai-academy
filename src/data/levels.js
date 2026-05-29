/* =====================================================================
   LEVEL DATA — the single source of truth for the whole course.
   ---------------------------------------------------------------------
   Every level is a plain object. To add a new level, append another object
   to this array (see README → "Adding a new level"). The level's
   `activity.type` must match a component key registered in
   src/components/activities/index.js, and its `id` should have a matching
   icon in src/components/levelIcons.js.

   Shape of a level:
   {
     id:        unique string (localStorage key + React key + icon lookup)
     title:     short lesson title
     concept:   one-line summary shown in the sidebar / module list
     explanation: 1-2 simple sentences teaching the idea
     example:   { text } — an everyday, relatable example
     video:     { title, description, duration, src? } — a short explainer.
                A placeholder card renders until a real `src` (video URL) is added.
     activity:  {
       type:    which interactive challenge to render (see registry)
       prompt:  instruction shown above the challenge
       data:    challenge-specific configuration (see each component)
       feedback:{ correct, incorrect } — banner messages
     }
   }

   The 10 lessons deliberately use 10 DIFFERENT activity formats (sorting,
   pipeline ordering, dataset choice, matching, visual classification, a
   slider simulator, a bias grid, a model comparison, a network builder, and
   scenario cards) so the course teaches by doing, not by repetitive quizzes.
   ===================================================================== */

export const BEGINNER_LEVELS = [
  /* ----------------------------- 1 ---------------------------------- */
  {
    id: 'what-ai',
    title: 'What Is AI?',
    concept: 'Machines that do smart tasks',
    explanation:
      'Artificial Intelligence (AI) is when a computer does things that usually need human smarts — like understanding language, recognizing pictures, or making choices. It is not magic and it is not alive. It is a very capable program.',
    example: {
      text: 'When your phone unlocks by looking at your face, that is AI recognizing you. A pocket calculator adding numbers just follows fixed steps a person wrote — so it is not AI.',
    },
    // "I do" — a worked example with narrated thinking, shown before the learner tries anything.
    workedExample: {
      intro: 'Watch how I decide whether something counts as AI. The one test I keep asking: did it LEARN from examples, or does it just FOLLOW fixed steps a person wrote?',
      steps: [
        'Take face unlock. It gets better at recognizing you over time and copes with new angles and lighting. It clearly learned from examples — so I call it AI.',
        'Now a pocket calculator. "2 + 2" always runs the exact steps a person programmed. Nothing was learned. So it is not AI.',
        'A trickier one: a spam filter. Nobody wrote a rule for every junk email — it studied thousands of messages and found the patterns itself. Learned from examples, so it is AI.',
      ],
      takeaway: 'The test: did it LEARN from examples (AI) or just FOLLOW fixed steps (not AI)?',
    },
    // "We do" — one guided attempt with an escalating hint ladder, then the answer.
    guided: {
      prompt:
        'Let\'s do one together before you try the full set. Is this AI or not?\n\n"Email autocomplete that finishes your sentence as you type."',
      hints: [
        'Start with our test — does it follow a fixed rule a person wrote, or does it figure something out from patterns?',
        'Autocomplete suggests your next words by drawing on huge amounts of text it has seen before. That sounds a lot like learning from examples.',
        'Think of the spam filter: it learned from thousands of emails. Autocomplete learned from billions of sentences — it is the same idea, not a hand-written rule.',
      ],
      answer: 'It is AI.',
      explanation:
        'Autocomplete learns patterns from massive amounts of text, then predicts the most likely next words. Learning patterns from examples is machine learning — a kind of AI.',
    },
    // "Go deeper" — optional rigor that never blocks progression.
    goDeeper: {
      title: 'Where does "machine learning" fit?',
      body: 'AI is the big umbrella: any program doing tasks that need human-like smarts. Machine Learning is the most common way we build AI today — instead of hand-writing rules, we let a program learn patterns from examples. So every ML system is AI, but a few old-fashioned AIs (hand-written rule systems) are not ML. The rest of this track is really about machine learning.',
    },
    video: {
      title: 'What counts as AI?',
      description: 'A two-minute tour of everyday AI, from face unlock to recommendations — and what is just an ordinary program.',
      duration: '2:30',
    },
    activity: {
      type: 'sort',
      prompt: 'Drag each card into AI or Not AI — or tap a card, then tap a group.',
      data: {
        buckets: [
          { id: 'ai', label: 'AI' },
          { id: 'not', label: 'Not AI' },
        ],
        tokens: [
          { id: 't1', label: 'Face unlock on a phone', bucket: 'ai' },
          { id: 't2', label: 'A spam filter that spots junk mail', bucket: 'ai' },
          { id: 't3', label: 'A pocket calculator', bucket: 'not' },
          { id: 't4', label: 'A voice assistant answering questions', bucket: 'ai' },
          { id: 't5', label: 'A light switch turning on a bulb', bucket: 'not' },
          { id: 't6', label: 'A service suggesting a show you might like', bucket: 'ai' },
        ],
      },
      feedback: {
        correct:
          'Exactly. AI handles tasks that need judgement — recognizing, understanding, and choosing. Simple machines just follow fixed steps.',
        incorrect:
          'Not quite. AI learns or makes smart choices. A calculator and a light switch only follow fixed steps a person built in.',
      },
    },
  },

  /* ----------------------------- 2 ---------------------------------- */
  {
    id: 'what-ml',
    title: 'What Is Machine Learning?',
    concept: 'Learning patterns from examples',
    explanation:
      'Machine Learning (ML) is one way to build AI. Instead of a person writing every rule by hand, we show the computer many examples and it finds the patterns on its own. A machine learning project flows through a few clear stages.',
    example: {
      text: 'Nobody wrote a rule for every spam email. Instead we showed a filter thousands of "spam" and "not spam" messages, and it learned the patterns that tell them apart.',
    },
    // A quick recall of the previous lesson before we start (spaced review).
    spacedReview: {
      from: 'what-ai',
      question: 'Quick review from the last lesson — which of these is AI?',
      options: ['A pocket calculator adding numbers', 'A spam filter that learns to spot junk mail'],
      answerIndex: 1,
      note: 'Right — the spam filter learned patterns from examples; a calculator just follows fixed steps a person wrote.',
    },
    workedExample: {
      intro: 'Let me walk one spam filter through the whole machine learning pipeline, start to finish.',
      steps: [
        'Data: we collect thousands of emails, each already labelled "spam" or "not spam". That labelled pile is the data.',
        'Training: the program studies those emails and works out which words and patterns tend to mean spam. This is where the learning happens.',
        'Model: the result of training is the model — the part that now holds the learned patterns.',
        'Prediction: a brand-new email arrives, the model reads it and makes its best guess: spam or not.',
        'Feedback: when it gets one wrong and we correct it, that mistake is fed back to make the next version better.',
      ],
      takeaway: 'Data → Training → Model → Prediction → Feedback. You need data before you can train, and a trained model before it can predict.',
    },
    guided: {
      prompt:
        'Let\'s order just the start of the pipeline together. Which has to come first — Training, or Data?',
      hints: [
        'Ask what training actually needs in order to happen at all.',
        'A model can only study examples it has been given. So something must exist before any studying can start.',
        'Like the spam filter: we had to gather the labelled emails before the program could learn anything from them.',
      ],
      answer: 'Data comes first, then Training.',
      explanation:
        'Training is the model studying examples — so the examples (the data) must be collected first. Nothing can be learned from data that is not there yet.',
    },
    goDeeper: {
      title: 'What does "finding patterns" really mean?',
      body: 'Inside the model are many adjustable numbers, called weights. At the start they are basically random, so the model guesses badly. Training measures how wrong each guess is — that gap is called the error (or loss) — and nudges the weights a little to make the error smaller. Repeat that over thousands of examples and the weights settle into values that capture the real patterns. "Learning" is just this slow tuning of numbers to reduce error.',
      formula: 'error = (what the model predicted) − (the correct answer)',
      formulaLegend: [
        { sym: 'error', plain: 'how far off this guess was — training tries to shrink it' },
        { sym: 'predicted', plain: 'the model\'s current best guess' },
        { sym: 'correct answer', plain: 'the real label from the training data' },
      ],
    },
    video: {
      title: 'How machines learn from examples',
      description: 'See how showing a computer many examples lets it discover patterns by itself, no hand-written rules needed.',
      duration: '3:10',
    },
    activity: {
      type: 'pipeline',
      prompt: 'A machine learning project flows through five stages. Tap each stage to place it in the right order — start with Data.',
      data: {
        stages: [
          { id: 'data', label: 'Data', icon: 'Database', desc: 'We gather many examples for the model to learn from.' },
          { id: 'training', label: 'Training', icon: 'GraduationCap', desc: 'The model studies the examples and finds patterns.' },
          { id: 'model', label: 'Model', icon: 'Box', desc: 'The trained model is the part that has learned the patterns.' },
          { id: 'prediction', label: 'Prediction', icon: 'Sparkles', desc: 'The model makes a best guess about something new it has not seen.' },
          { id: 'feedback', label: 'Feedback', icon: 'RefreshCw', desc: 'We check the guesses and use the mistakes to improve the model.' },
        ],
      },
      feedback: {
        correct:
          'That is the machine learning pipeline. Data trains a model, the model makes predictions, and feedback helps it improve over time.',
        incorrect:
          'Not the right order yet. Follow the flow: you need data before you can train, and a trained model before it can predict.',
      },
    },
  },

  /* ----------------------------- 3 ---------------------------------- */
  {
    id: 'training-data',
    title: 'Training Data',
    concept: 'The examples a model learns from',
    explanation:
      'Training data is the set of examples we give a model to learn from. The best training data has plenty of examples that look like the real world the model will actually see. Too few examples, or ones that all look alike, make a weak model.',
    example: {
      text: 'To teach a model to recognize dogs, you show it thousands of dog photos — big dogs, small dogs, many colors, indoors and outdoors. If you only show fluffy white puppies, it will not recognize a black Labrador.',
    },
    spacedReview: {
      from: 'what-ml',
      question: 'Quick review — in the machine learning pipeline, what comes right after Data?',
      options: ['Prediction', 'Training', 'Feedback'],
      answerIndex: 1,
      note: 'Right — once the data is gathered, Training is where the model studies it and finds patterns.',
    },
    workedExample: {
      intro: 'Let me build a training set for a "recognize any dog" model, thinking aloud about what to include.',
      steps: [
        'First I picture the real world the model will face: dogs of every size, colour, and breed, indoors and outdoors, in good and bad lighting.',
        'So I deliberately gather variety — tiny chihuahuas and huge mastiffs, black, brown and white coats, photos from phones and cameras.',
        'I avoid a trap: a pile of only fluffy white puppies looks big, but it is narrow. The model would never learn what a black Labrador looks like.',
      ],
      takeaway: 'Strong training data looks like the real world the model will actually see — broad and varied, not just lots of the same thing.',
    },
    guided: {
      prompt:
        'Let\'s reason about one together. A team has 5,000 photos — but every single one is a fluffy white puppy. Which single change would help the model most?',
      hints: [
        'The problem is not the number of photos. Ask what kind of variety is missing.',
        'The model has never seen a large, dark, or short-haired dog. What would teach it those?',
        'More of the same puppies adds almost nothing. Adding different breeds, sizes, and colours fills the gaps.',
      ],
      answer: 'Add photos of many other breeds, sizes, and colours of dog.',
      explanation:
        'A bigger pile of near-identical photos is still narrow. Variety — across breed, size, colour and setting — is what lets the model recognize dogs it has never seen before.',
    },
    goDeeper: {
      title: 'Why we split the data into three piles',
      body: 'Teams rarely train on all their data at once. They split it: a training set the model learns from, a validation set used to tune settings while building, and a held-back test set the model never sees until the very end. The test set is the honest exam — it shows how the model does on truly new examples, not ones it already memorised. You will meet the flip side of this in the Overfitting lesson.',
    },
    video: {
      title: 'Why good data matters',
      description: 'What makes a training set strong — and how weak or narrow data quietly leads a model astray.',
      duration: '2:45',
    },
    activity: {
      type: 'pick-dataset',
      prompt: 'You are teaching a model to recognize dogs of all kinds. Select the best training set, then check.',
      data: {
        options: [
          {
            id: 'a',
            title: '10 photos of one golden retriever',
            sample: 'Same dog, same room, same angle.',
            isCorrect: false,
            why: 'Far too few examples, and they all look the same. The model would only learn this one dog.',
          },
          {
            id: 'b',
            title: '5,000 varied dog photos',
            sample: 'Many breeds, sizes, and colors, photographed in many settings.',
            isCorrect: true,
            why: 'Plenty of varied examples that match the real world — the best training data here.',
          },
          {
            id: 'c',
            title: '5,000 photos of cats',
            sample: 'All cats, no dogs at all.',
            isCorrect: false,
            why: 'The wrong examples. The model would learn to spot cats, not dogs.',
          },
        ],
      },
      feedback: {
        correct:
          'Correct. Plenty of varied examples that match what the model will see in the real world make the best training data.',
        incorrect:
          'Aim for more examples and more variety. A few look-alike photos — or the wrong subject — will not prepare a model for the real world.',
      },
    },
  },

  /* ----------------------------- 4 ---------------------------------- */
  {
    id: 'features-labels',
    title: 'Features & Labels',
    concept: 'Inputs (clues) and outputs (answers)',
    explanation:
      'A feature is a clue we give the model (the input). A label is the answer we want back (the output). During training, the model learns how the clues connect to the right answer.',
    example: {
      text: 'To predict a house price, the features are clues like number of bedrooms, size, and location. The label is the price. The model learns how the clues lead to the answer.',
    },
    video: {
      title: 'Features vs. labels',
      description: 'The clues that go into a model, and the answers that come out — with simple, everyday examples.',
      duration: '2:20',
    },
    activity: {
      type: 'match',
      prompt: 'Match each set of features (the clues going in) to the label it predicts. Select a clue, then select its answer.',
      data: {
        leftHead: 'Features (clues in)',
        rightHead: 'Label (answer out)',
        pairs: [
          { left: 'Email text: "WIN $$$ NOW, click here!"', right: 'Spam' },
          { left: 'A furry animal that barks and wags its tail', right: 'Dog' },
          { left: '30°C, sunny, light wind', right: 'Good beach day' },
          { left: "A song's beat, tempo, and genre", right: 'A playlist you may like' },
        ],
      },
      feedback: {
        correct:
          'Exactly. Features are the clues going in; the label is the answer coming out. A model\'s whole job is learning that link.',
        incorrect:
          'Re-check your links. Each clue (feature) points to exactly one answer (label). For example, scammy email text maps to "Spam".',
      },
    },
  },

  /* ----------------------------- 5 ---------------------------------- */
  {
    id: 'classification',
    title: 'Classification',
    concept: 'Sorting items into groups',
    explanation:
      'Classification means sorting something into one of a few groups (called classes). The model looks at the features and picks the class that fits best.',
    example: {
      text: 'An email app classifies each message as Inbox, Spam, or Promotions. A photo app classifies pictures as cat, dog, or bird.',
    },
    video: {
      title: 'Sorting into classes',
      description: 'How a model reads the clues and decides which group — or class — something belongs to.',
      duration: '2:35',
    },
    activity: {
      type: 'classify',
      prompt: 'Read the clues and classify each mystery item, then check your answers.',
      data: {
        rounds: [
          {
            id: 'r1',
            clues: ['Has feathers', 'Has a beak', 'Can fly', 'Lays eggs in a nest'],
            options: [
              { id: 'bird', label: 'Bird' },
              { id: 'cat', label: 'Cat' },
              { id: 'fish', label: 'Fish' },
            ],
            correctId: 'bird',
          },
          {
            id: 'r2',
            clues: ['Lives in water', 'Has fins and gills', 'No legs', 'Covered in scales'],
            options: [
              { id: 'fish', label: 'Fish' },
              { id: 'dog', label: 'Dog' },
              { id: 'bird', label: 'Bird' },
            ],
            correctId: 'fish',
          },
          {
            id: 'r3',
            clues: ['Purrs and meows', 'Has whiskers', 'Retractable claws', 'Naps in the sun'],
            options: [
              { id: 'cat', label: 'Cat' },
              { id: 'frog', label: 'Frog' },
              { id: 'fish', label: 'Fish' },
            ],
            correctId: 'cat',
          },
        ],
      },
      feedback: {
        correct:
          'Nicely done. You used the features (clues) to pick the right class — exactly what a classification model does.',
        incorrect:
          'Look again at the clues. "Feathers, beak, flies" points to one class only. Match each set of clues to the best-fitting group.',
      },
    },
  },

  /* ----------------------------- 6 ---------------------------------- */
  {
    id: 'prediction',
    title: 'Prediction',
    concept: 'Estimating an answer for new input',
    explanation:
      'A prediction is the model\'s best estimate for something new, using the patterns it learned. Change the inputs and the prediction changes with them.',
    example: {
      text: 'A weather app predicts tomorrow\'s temperature from today\'s conditions. A streaming app predicts your rating — say, 1 to 5 stars — for a movie you have not watched yet.',
    },
    video: {
      title: 'Making a prediction',
      description: 'How a trained model turns a set of inputs into a single best-guess answer.',
      duration: '2:50',
    },
    activity: {
      type: 'predict',
      prompt: 'This model estimates a student\'s exam score from their habits. Adjust the sliders to reach the target, then lock in your prediction.',
      data: {
        base: 20,
        unit: '%',
        target: { min: 85, label: 'Reach a predicted score of 85% or higher.' },
        inputs: [
          { id: 'study', label: 'Hours studied', min: 0, max: 10, step: 1, start: 2, weight: 7 },
          { id: 'sleep', label: 'Hours of sleep', min: 0, max: 10, step: 1, start: 4, weight: 3 },
          { id: 'phone', label: 'Hours on phone', min: 0, max: 10, step: 1, start: 8, weight: -4 },
        ],
      },
      feedback: {
        correct:
          'Well tuned. Notice how changing the inputs changed the prediction? That is exactly how a model reacts to new information.',
        incorrect:
          'The predicted score is still too low. More studying and sleep raise it; more phone time lowers it. Keep adjusting.',
      },
    },
  },

  /* ----------------------------- 7 ---------------------------------- */
  {
    id: 'bias',
    title: 'Bias In Data',
    concept: 'When data is not representative',
    explanation:
      'Bias happens when the training data does not fairly represent everyone or everything. A biased model makes unfair or wrong predictions, because it only learned from a lopsided set of examples.',
    example: {
      text: 'A face system trained mostly on adults may fail on children. A résumé screener trained only on one type of past hire may unfairly skip strong candidates who look different.',
    },
    video: {
      title: 'Where bias comes from',
      description: 'How lopsided data leads to unfair models — and the habit of asking "who is missing?"',
      duration: '3:00',
    },
    activity: {
      type: 'bias-grid',
      prompt: 'Below is the training set for a face-recognition model. Study the cards, then answer.',
      data: {
        legend: 'Each card is one face in the training set, labeled by age group.',
        question: 'This model should recognize people of ALL ages. Which age group is missing from the data?',
        samples: [
          'Adults', 'Adults', 'Adults', 'Adults', 'Adults', 'Adults',
          'Teenagers', 'Teenagers', 'Teenagers', 'Teenagers',
          'Children', 'Children', 'Children',
        ],
        options: ['Adults', 'Teenagers', 'Children', 'Seniors'],
        correct: 'Seniors',
        why: 'There are no seniors at all in the data, so the model will struggle to recognize older people. Fair data needs examples from every group it will meet.',
      },
      feedback: {
        correct:
          'Exactly. Seniors never appear, so the model would be biased against older people. Balanced data includes every group.',
        incorrect:
          'Look for the group with no cards at all. Adults, teenagers, and children are all present — one age group is completely missing.',
      },
    },
  },

  /* ----------------------------- 8 ---------------------------------- */
  {
    id: 'overfitting',
    title: 'Overfitting',
    concept: 'Memorizing instead of generalizing',
    explanation:
      'Overfitting is when a model memorizes its training examples instead of learning the general idea. It scores perfectly on things it has already seen, but fails on anything new — like a student who memorized last year\'s exact test answers.',
    example: {
      text: 'A model that learned "a cat is this one exact photo" fails on every other cat. A model that learned "cats have pointed ears, whiskers, and fur" works on cats it has never seen.',
    },
    video: {
      title: 'Memorizing vs. learning',
      description: 'Why a model that aces its training data can still fail in the real world — and what to do about it.',
      duration: '2:40',
    },
    activity: {
      type: 'overfit-compare',
      prompt: 'Two models were trained on the same data. Compare them, then choose.',
      data: {
        question: 'The dots are the training examples. Which model will work better on NEW data it has not seen?',
        models: [
          { id: 'A', label: 'Model A', kind: 'overfit', caption: 'Bends to pass through every single dot' },
          { id: 'B', label: 'Model B', kind: 'generalize', caption: 'Follows the overall trend' },
        ],
        correctModel: 'B',
        reasonPrompt: 'Why is that model better?',
        reasons: [
          { id: 'r1', text: 'It passes exactly through every training dot.', correct: false },
          { id: 'r2', text: 'It captures the general trend, so it handles new points well.', correct: true },
          { id: 'r3', text: 'It is a more colorful chart.', correct: false },
        ],
        why: 'Model A memorized the training dots (overfitting) and will miss new data. Model B learned the general trend, so it generalizes to examples it has never seen.',
      },
      feedback: {
        correct:
          'Right. Model A overfit — it memorized the training dots. Model B generalized, so it performs better on new data.',
        incorrect:
          'Think about NEW data. A line that bends to hit every training dot has memorized noise; a smooth trend line generalizes better.',
      },
    },
  },

  /* ----------------------------- 9 ---------------------------------- */
  {
    id: 'neural-networks',
    title: 'Neural Networks',
    concept: 'Layers of connected units',
    explanation:
      'A neural network is loosely inspired by the brain. It has layers of small units called neurons. Information flows from input neurons, through hidden neurons that combine the clues, to an output neuron that gives the answer.',
    example: {
      text: 'To recognize a handwritten "7", input neurons read parts of the image, hidden neurons combine them into shapes like lines, and the output neuron responds for "7". Photo apps use large neural networks to find faces.',
    },
    video: {
      title: 'Inside a neural network',
      description: 'How layers of simple neurons combine clues to recognize something complex.',
      duration: '3:20',
    },
    activity: {
      type: 'neural',
      prompt: 'Build the network. Connect every input neuron to every hidden neuron, and every hidden neuron to the output. Select one neuron, then a neuron in the next layer to wire them.',
      data: {
        layers: {
          input: [
            { id: 'i1', label: 'Top line' },
            { id: 'i2', label: 'Diagonal stroke' },
          ],
          hidden: [
            { id: 'h1', label: 'Detector A' },
            { id: 'h2', label: 'Detector B' },
          ],
          output: [{ id: 'o1', label: 'Recognizes "7"' }],
        },
      },
      feedback: {
        correct:
          'You built a working neural network. Inputs feed the hidden neurons, which combine the clues and pass the result to the output. That is the core idea.',
        incorrect:
          'Some neurons are not wired up yet. Connect every input to every hidden neuron, and every hidden neuron to the output.',
      },
    },
  },

  /* ----------------------------- 10 --------------------------------- */
  {
    id: 'ai-ethics',
    title: 'Real-World AI Ethics',
    concept: 'Using AI responsibly',
    explanation:
      'AI is powerful, so it must be used fairly and responsibly. Good AI ethics means thinking about who could be helped or hurt, being honest that AI can make mistakes, protecting people\'s privacy, and keeping a human in charge of important decisions.',
    example: {
      text: 'A hospital wants AI to help spot disease in X-rays. That is helpful — but a doctor should always review the result, because a wrong call could hurt someone.',
    },
    video: {
      title: 'Using AI responsibly',
      description: 'Fairness, privacy, honesty about mistakes, and keeping humans in charge of big decisions.',
      duration: '3:05',
    },
    activity: {
      type: 'ethics',
      prompt: 'For each real-world situation, choose the most responsible action, then check your decisions.',
      data: {
        scenarios: [
          {
            id: 's1',
            situation:
              'A school wants AI to grade essays and email final grades to students, with no teacher ever reviewing them.',
            options: [
              { id: 'a', text: 'Let the AI grade and send final grades automatically.', best: false, why: 'AI can make mistakes and miss meaning. An important decision like a grade needs a human to review it.' },
              { id: 'b', text: 'Use AI to suggest a grade, but a teacher reviews it before it counts.', best: true, why: 'A human stays in charge of the important decision. AI assists; people decide.' },
              { id: 'c', text: 'Ban all computers from the school entirely.', best: false, why: 'AI can be a useful tool. The goal is to use it responsibly, not to ban it outright.' },
            ],
          },
          {
            id: 's2',
            situation:
              "An app wants to train its chatbot on users' private messages without telling them.",
            options: [
              { id: 'a', text: 'Use the private messages quietly — it improves the bot.', best: false, why: 'That breaks people\'s privacy and trust. People should know and agree first.' },
              { id: 'b', text: 'Ask users for permission first, and let them decline.', best: true, why: 'Respecting privacy and asking for consent is responsible use of AI.' },
            ],
          },
        ],
      },
      feedback: {
        correct:
          'Sound decisions. Responsible AI keeps a human in charge of important choices and respects people\'s privacy.',
        incorrect:
          'Weigh fairness, honesty, and privacy. The most responsible choice usually keeps a human in control and respects people\'s rights.',
      },
    },
  },
]

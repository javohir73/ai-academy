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
  /* ----------------------- L2 hands-on: sklearn ---------------------- */
  {
    id: 'code-first-classifier',
    kind: 'code',
    title: 'Train Your First Classifier',
    concept: 'Fit a model and measure its accuracy — in real Python',
    explanation:
      'You have seen what classification is. Now you will actually train a model. We use scikit-learn on the classic Iris flowers dataset: fit a model on training data, predict on data it has never seen, and measure how often it is right.',
    example: {
      text: 'Remember the spine: model = parameters + loss + optimization. scikit-learn runs that whole loop for you behind a single .fit() call — your job is to wire it up and judge the result.',
    },
    workedExample: {
      intro:
        'Watch the shape of every scikit-learn program: load data → split into train/test → fit on train → predict on test → score. The key idea: we ALWAYS test on data the model did not train on.',
      steps: [
        'Load Iris and split it: X_train/y_train teach the model; X_test/y_test are held back to grade it honestly.',
        'Create a model (KNeighborsClassifier) and call model.fit(X_train, y_train). That is the whole training step.',
        'Predict with model.predict(X_test), then compare to y_test with accuracy_score. Testing on unseen data is how we catch memorization.',
      ],
      takeaway: 'Every sklearn model is the same five beats: load → split → fit → predict → score.',
    },
    guided: {
      prompt:
        'Before the full exercise: which data should you call .fit() on?\n\nX_train / y_train  —  or  —  X_test / y_test ?',
      hints: [
        'The test set exists to grade the model. If the model trained on it, the grade would be a lie.',
        'We fit (teach) on the training split, then keep the test split untouched until scoring.',
      ],
      answer: 'Fit on X_train, y_train.',
      explanation:
        'You always train on the training split and reserve the test split to measure honest, unseen-data performance.',
    },
    goDeeper: {
      title: 'Why hold out a test set at all?',
      body: 'A model can score 100% by memorizing the training rows and still fail on anything new — that is overfitting. The held-out test set is the only honest measure of generalization: performance on data the model has never seen. From here on, every model you build will be judged this way.',
    },
    video: {
      title: 'Your first scikit-learn model',
      description: 'The five-beat shape of every sklearn program, from load to score.',
      duration: '4:00',
    },
    activity: {
      type: 'notebook',
      prompt:
        'Finish the two missing lines (fit the model, then predict on the test set) so the classifier reaches at least 90% accuracy.',
      data: {
        packages: ['scikit-learn'],
        starter: `from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score

X, y = load_iris(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.25, random_state=0
)

model = KNeighborsClassifier(n_neighbors=3)
# 1) Train the model on the TRAINING data:
# model.fit(...)

# 2) Predict on the TEST data:
# preds = model.predict(...)

preds = model.predict(X_test)  # remove or keep — must end with predictions in \`preds\`
acc = accuracy_score(y_test, preds)
print("accuracy:", round(acc, 3))`,
        tests: `assert 'model' in dir(), "Create and fit a model named 'model'."
assert 'preds' in dir(), "Store predictions in a variable named 'preds'."
from sklearn.metrics import accuracy_score
_acc = accuracy_score(y_test, preds)
assert _acc >= 0.9, f"Accuracy is {_acc:.2f} — fit on the training data and predict on X_test to reach 0.90."`,
        hints: [
          'Call model.fit(X_train, y_train) before predicting — an unfit model cannot classify.',
          'Predict on the held-out set: preds = model.predict(X_test).',
          'Full shape: model.fit(X_train, y_train) then preds = model.predict(X_test). Then accuracy_score(y_test, preds) ≥ 0.90.',
        ],
      },
      feedback: {
        correct:
          'That is a trained, working classifier — fit on training data, judged on unseen data, over 90% accurate. You just ran the whole model = parameters + loss + optimization loop.',
        incorrect:
          'Not yet. Make sure you fit on the TRAINING data and predict on the TEST data — read the hint and try again.',
      },
    },
  },
  /* ----------------- L2 hands-on: metrics & overfitting ------------- */
  {
    id: 'code-metrics-overfitting',
    kind: 'code',
    title: 'Spot Overfitting With Metrics',
    concept: 'Compare train vs test accuracy to catch a model that memorized',
    explanation:
      'A model that scores far better on training data than on test data has memorized instead of learned. You will train a deliberately over-complex model, measure both scores, and compute the gap that proves it overfit.',
    example: {
      text: 'Remember overfitting from the intuition lesson? Here you will measure it: a big train-vs-test gap is overfitting made numeric.',
    },
    workedExample: {
      intro:
        'The tool: score the SAME model on both splits. A healthy model scores similarly on train and test. An overfit one aces train and stumbles on test.',
      steps: [
        'Train a decision tree with no depth limit — it can memorize the training set.',
        'Score it on the training data (likely ~1.0) and on the test data (lower).',
        'The gap = train_acc − test_acc. A large gap is the signature of overfitting.',
      ],
      takeaway: 'Overfitting is not a vibe — it is the measurable gap between train and test performance.',
    },
    guided: {
      prompt:
        'A model scores 1.00 on training data and 0.72 on test data. What is going on?',
      hints: [
        'Compare the two numbers. Near-perfect on data it has seen, much worse on data it has not.',
        'That gap means it memorized the training rows rather than learning a general rule.',
      ],
      answer: 'It is overfitting.',
      explanation:
        'A high train score with a much lower test score is the classic overfitting signature — the model generalizes poorly.',
    },
    goDeeper: {
      title: 'Why does an unlimited-depth tree overfit?',
      body: 'A decision tree with no max_depth keeps splitting until each training point sits in its own leaf — effectively a lookup table of the training set. It fits the noise, not just the signal, so it nails training data and fails on anything new. Limiting depth (or pruning) trades a little training accuracy for much better generalization.',
    },
    video: {
      title: 'Measuring overfitting',
      description: 'Train vs test scores and the gap that reveals memorization.',
      duration: '3:30',
    },
    activity: {
      type: 'notebook',
      prompt:
        'Compute train_acc and test_acc for the tree, then set gap = train_acc - test_acc. The hidden check confirms you have found a real overfitting gap.',
      data: {
        packages: ['scikit-learn'],
        starter: `from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score

X, y = load_breast_cancer(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.3, random_state=0
)

# An unlimited-depth tree can memorize the training data.
model = DecisionTreeClassifier(random_state=0)
model.fit(X_train, y_train)

# TODO: score the model on BOTH splits, then compute the gap.
# train_acc = accuracy_score(y_train, model.predict(X_train))
# test_acc  = accuracy_score(y_test,  model.predict(X_test))
# gap = train_acc - test_acc

print("train:", train_acc, "test:", test_acc, "gap:", round(gap, 3))`,
        tests: `assert 'train_acc' in dir() and 'test_acc' in dir(), "Define train_acc and test_acc."
assert 'gap' in dir(), "Define gap = train_acc - test_acc."
assert train_acc >= 0.99, "An unlimited-depth tree should score ~1.0 on the training data."
assert gap > 0.02, f"Expected a positive train-vs-test gap; got {gap:.3f}. Score on both splits."`,
        hints: [
          'Score training accuracy: train_acc = accuracy_score(y_train, model.predict(X_train)).',
          'Score test accuracy the same way but with y_test and X_test.',
          'Then gap = train_acc - test_acc — it should be clearly positive, exposing the overfit.',
        ],
      },
      feedback: {
        correct:
          'You measured overfitting directly: near-perfect on training, lower on test, with a real positive gap. That gap is the thing every honest evaluation watches for.',
        incorrect:
          'Not yet — make sure you score the model on BOTH the training and test splits, then subtract. Check the hint.',
      },
    },
  },
  /* --------------------- L3 hands-on: BFS maze ---------------------- */
  {
    id: 'code-bfs-maze',
    kind: 'code',
    title: 'Solve a Maze With Search',
    concept: 'Find the shortest path with breadth-first search — pure Python',
    explanation:
      'Before a network can learn, an agent has to be able to search. Breadth-first search (BFS) explores a maze level by level, so the first time it reaches the goal it has found the SHORTEST path. You will complete the search loop.',
    example: {
      text: 'Spine callback: in L1 a model was a decision-maker that searches. BFS is that idea in code — systematically trying options until it reaches the goal, shortest route first.',
    },
    workedExample: {
      intro:
        'BFS uses a queue (first-in, first-out). The FIFO order is what guarantees the shortest path: we exhaust everything 1 step away before anything 2 steps away.',
      steps: [
        'Start with the start cell in the queue and mark it visited.',
        'Pop the front cell; if it is the goal, reconstruct the path. Otherwise add its unvisited neighbours to the BACK of the queue.',
        'Because we always expand the closest cells first, the goal is reached by the shortest route.',
      ],
      takeaway: 'A FIFO queue is what makes BFS find the shortest path, not just any path.',
    },
    guided: {
      prompt:
        'Why does BFS find the SHORTEST path while depth-first search might not?',
      hints: [
        'Think about the ORDER each explores in: BFS spreads out evenly, DFS dives deep down one branch first.',
        'BFS finishes all cells at distance 1, then distance 2, and so on — so the goal is first reached at its true minimum distance.',
      ],
      answer: 'Because BFS explores in order of distance (FIFO queue), so it reaches the goal by the shortest route first.',
      explanation:
        'BFS expands nodes nearest the start before farther ones, so the first time it reaches the goal it has used the fewest steps. DFS can plunge down a long branch and find a longer route first.',
    },
    goDeeper: {
      title: 'BFS vs Dijkstra vs A*',
      body: 'BFS finds the shortest path when every step costs the same. When steps have different costs, you need Dijkstra (a priority queue by total cost). A* adds a heuristic that steers the search toward the goal, expanding fewer nodes. They are all the same skeleton — a frontier of cells to expand — with smarter ordering.',
    },
    video: {
      title: 'Breadth-first search, visually',
      description: 'Why a FIFO queue guarantees the shortest path in an unweighted maze.',
      duration: '3:45',
    },
    activity: {
      type: 'notebook',
      prompt:
        'Complete the BFS loop: add each unvisited neighbour to the queue and record how you reached it, so the function returns the shortest path from S to G.',
      data: {
        packages: [],
        starter: `from collections import deque

# '#' = wall, '.' = open, 'S' = start, 'G' = goal
maze = [
    "S....",
    ".###.",
    ".#...",
    ".#.#.",
    "...#G",
]

def neighbours(r, c):
    for dr, dc in ((1,0),(-1,0),(0,1),(0,-1)):
        nr, nc = r+dr, c+dc
        if 0 <= nr < len(maze) and 0 <= nc < len(maze[0]) and maze[nr][nc] != '#':
            yield nr, nc

def find(ch):
    for r, row in enumerate(maze):
        for c, v in enumerate(row):
            if v == ch:
                return (r, c)

start, goal = find('S'), find('G')

def bfs():
    queue = deque([start])
    came_from = {start: None}
    while queue:
        cur = queue.popleft()
        if cur == goal:
            break
        for nb in neighbours(*cur):
            # TODO: if nb is unvisited, record came_from[nb] = cur and queue it
            pass
    # reconstruct path from goal back to start
    if goal not in came_from:
        return None
    path = []
    node = goal
    while node is not None:
        path.append(node)
        node = came_from[node]
    return path[::-1]

path = bfs()
print("path length:", len(path) if path else None)`,
        tests: `assert path is not None, "Your BFS returned no path — make sure you enqueue unvisited neighbours."
assert path[0] == start, "Path must start at S."
assert path[-1] == goal, "Path must end at G."
# steps must be adjacent and on open cells
for (r1, c1), (r2, c2) in zip(path, path[1:]):
    assert abs(r1 - r2) + abs(c1 - c2) == 1, "Path steps must be to adjacent cells."
    assert maze[r2][c2] != '#', "Path runs through a wall."
assert len(path) == 9, f"Shortest path is 9 cells; yours is {len(path)}. BFS (FIFO) guarantees shortest."`,
        hints: [
          'Inside the neighbour loop: check `if nb not in came_from:` so you do not revisit cells.',
          'When a neighbour is new, set came_from[nb] = cur and queue.append(nb).',
          'Full body: `if nb not in came_from: came_from[nb] = cur; queue.append(nb)`. The FIFO order gives the shortest path.',
        ],
      },
      feedback: {
        correct:
          'Your agent searched the maze and found the shortest route — BFS done right. That frontier-of-cells skeleton is the same one Dijkstra and A* build on.',
        incorrect:
          'Not quite. Enqueue only UNVISITED neighbours and record how you reached each one, so you can rebuild the path. Read the hint.',
      },
    },
  },
]

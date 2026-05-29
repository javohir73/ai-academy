/* =====================================================================
   LEVEL 0 — FOUNDATIONS (concept, code-free).
   The beginner on-ramp. Per the platform's concept-first model, L0 and L1
   contain NO code lessons — they build intuition with the same interactive
   activities as the rest of the beginner experience. Runnable Python begins
   at L2 (see the `kind: 'code'` lessons in levels.js).

   Same lesson shape as levels.js. Composed into the Level 0 track in tracks.js.
   ===================================================================== */

export const FOUNDATIONS_LEVELS = [
  {
    id: 'what-is-data',
    title: 'What Is Data?',
    concept: 'Rows, columns, and why models need examples',
    explanation:
      'Everything a model learns from is data: a table of examples, where each row is one thing and each column is one fact about it. Before any machine learning, you need good examples laid out this way.',
    example: {
      text: 'A spreadsheet of houses — one row per house, columns for size, bedrooms, and price — is a dataset. The model studies these rows to learn patterns.',
    },
    workedExample: {
      intro:
        'The test for a good dataset: is it a clean table of EXAMPLES, where each row is one item and each column is one measurable fact? Watch me judge a few.',
      steps: [
        'A table of emails labelled spam / not-spam: each row an email, a column for the label. Clean examples — great for learning.',
        'A single paragraph of prose: no rows, no columns, nothing to compare. Not a dataset yet — it needs structure first.',
        'Photos sorted into folders "cat" and "dog": each image is an example and the folder is its label. That IS a dataset.',
      ],
      takeaway: 'A dataset is a table of examples: rows are items, columns are facts, and often one column is the label.',
    },
    guided: {
      prompt:
        'Which of these is ready to learn from?\n\nA) 1,000 customer reviews each tagged positive or negative\nB) One long unlabelled essay',
      hints: [
        'Learning needs many comparable EXAMPLES, ideally with a label saying what each one is.',
        'A is a thousand labelled examples; B is a single block of text with no structure.',
      ],
      answer: 'A — the labelled reviews.',
      explanation:
        'A is a structured set of labelled examples a model can learn patterns from. B is unstructured and unlabelled, so there is nothing to learn from yet.',
    },
    goDeeper: {
      title: 'Why "garbage in, garbage out" starts here',
      body: 'A model can only be as good as its examples. Biased, mislabelled, or too-few rows produce a weak model no algorithm can rescue. That is why real ML work spends most of its time on data, not models — a theme you will meet again in every level.',
    },
    video: {
      title: 'Data, rows, and columns',
      description: 'What a dataset is and what makes examples good enough to learn from.',
      duration: '2:45',
    },
    activity: {
      type: 'pick-dataset',
      prompt: 'A team wants to predict house prices. Pick the dataset that can actually teach that.',
      data: {
        options: [
          {
            id: 'good',
            title: 'Past home sales',
            sample: '5,000 sold homes with size, bedrooms, location, and final sale price.',
            isCorrect: true,
            why: 'Many examples, with the answer (sale price) included — exactly what supervised learning needs.',
          },
          {
            id: 'no-label',
            title: 'Homes with no prices',
            sample: '5,000 homes with size and location — but the price column is blank.',
            isCorrect: false,
            why: 'Without the price column there is no answer to learn from.',
          },
          {
            id: 'tiny',
            title: 'Three homes',
            sample: 'Just 3 homes with full details and prices.',
            isCorrect: false,
            why: 'Three rows is far too few to learn a reliable pattern.',
          },
        ],
      },
      feedback: {
        correct:
          'Right — lots of labelled examples (price included) is what makes price prediction learnable. Good data first, always.',
        incorrect:
          'Look again: you need MANY examples that include the answer you want to predict (the sale price).',
      },
    },
  },
]

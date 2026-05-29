# Level 5 — Natural Language Processing & LLMs

> The hardest, most abstract level. Text → embeddings → transformers → LLMs, plus the fuzziest problem of all: evaluating language models honestly.

**Goal:** Work with text and language models through modern transformers and LLMs, and evaluate them responsibly.
**Audience:** Learners who finished Level 3 (Level 4 helpful, not required).
**Prerequisites:** Level 3. Level 0 probability is reused for language modeling.
**Duration:** 6–8 weeks.
**Maps to:** *Natural Language Processing (TTQ 1704)*.

## Learning Outcomes
By the end, a learner can:
- Preprocess and represent text (tokenization, TF-IDF, embeddings).
- Explain attention and the Transformer architecture without equations.
- Use and fine-tune pretrained models (Hugging Face) for real tasks.
- Describe how LLMs are built (pretraining → instruction tuning → RLHF).
- Design rubrics and evaluate model outputs for quality, factuality, and bias.

## Teaching Approach (this level)
- **Attention taught visually first** — heatmaps before equations.
- **Use modern tools day one** — Hugging Face pipelines give wins fast; internals follow.
- **Evaluation is a graded skill, not a footnote** — the level's capstone is an evaluation task, mirroring real AI-eval jobs.

---

## Module 5.1 — Text as Data
**Why this module matters:** language must be turned into numbers before any model can use it.

### L5.1.1 — Tokenization & preprocessing
- **Objective:** turn text into tokens.
- **Concepts:** tokens, normalization, stopwords, subword tokenization.
- **Hands-on:** tokenize text three ways; compare.
- **Pitfall:** over-cleaning and destroying meaning.

### L5.1.2 — Bag-of-words & TF-IDF
- **Objective:** represent documents numerically.
- **Concepts:** counts, term frequency, inverse document frequency.
- **Hands-on:** build TF-IDF vectors for a corpus.
- **Pitfall:** ignoring word order entirely and not realizing the cost.

### L5.1.3 — Classic text classification
- **Objective:** a working NLP baseline.
- **Concepts:** TF-IDF + logistic regression for sentiment.
- **Hands-on:** classify movie reviews.
- **Pitfall:** assuming the baseline is too simple to matter.

---

## Module 5.2 — Word Meaning
**Why this module matters:** embeddings are how models capture meaning — the bridge from counts to semantics.

### L5.2.1 — Word embeddings (word2vec)
- **Objective:** represent words as vectors of meaning.
- **Concepts:** distributional hypothesis, word2vec intuition.
- **Hands-on:** explore a trained embedding space.
- **Pitfall:** thinking embeddings are hand-defined.

### L5.2.2 — GloVe & embedding arithmetic
- **Objective:** see semantic structure in vector space.
- **Concepts:** analogies (king − man + woman ≈ queen), similarity.
- **Hands-on:** run vector analogies; find nearest neighbors.
- **Pitfall:** over-reading analogy results.

### L5.2.3 — Using pretrained embeddings
- **Objective:** boost models with pretrained meaning.
- **Concepts:** loading and applying embeddings.
- **Hands-on:** swap TF-IDF for embeddings; compare.
- **Pitfall:** embedding/vocabulary mismatch.

---

## Module 5.3 — Sequences
**Why this module matters:** language is sequential; this is the pre-transformer history that explains why transformers won.

### L5.3.1 — RNNs
- **Objective:** model sequences with memory.
- **Concepts:** recurrence, hidden state.
- **Hands-on:** train an RNN for text generation.
- **Pitfall:** expecting long-range memory from a vanilla RNN.

### L5.3.2 — LSTMs & GRUs
- **Objective:** fix vanishing gradients in sequences.
- **Concepts:** gates, cell state.
- **Hands-on:** compare RNN vs LSTM on a long sequence.
- **Pitfall:** assuming LSTMs fully solve long-range dependencies.

### L5.3.3 — Seq2seq & the bottleneck
- **Objective:** map sequences to sequences.
- **Concepts:** encoder-decoder, the fixed-vector bottleneck (motivates attention).
- **Hands-on:** a tiny translation/seq2seq demo.
- **Pitfall:** not seeing why the bottleneck is a problem.

---

## Module 5.4 — Transformers & LLMs (the modern core)
**Why this module matters:** attention and transformers underpin every modern language model.

### L5.4.1 — Attention
- **Objective:** let the model focus on relevant tokens.
- **Concepts:** query/key/value, attention weights (visual heatmaps first).
- **Hands-on:** visualize attention on a sentence.
- **Pitfall:** drowning in equations before the intuition lands.

### L5.4.2 — Self-attention & the Transformer
- **Objective:** understand the architecture.
- **Concepts:** self-attention, multi-head, positional encoding, blocks.
- **Hands-on:** trace data through a transformer block.
- **Pitfall:** forgetting positional info (order matters).

### L5.4.3 — Pretraining & transfer in NLP
- **Objective:** know the model families.
- **Concepts:** BERT (encoder) vs GPT (decoder), pretraining objectives.
- **Hands-on:** use a pretrained model for a downstream task.
- **Pitfall:** picking the wrong family for the task.

### L5.4.4 — Using & fine-tuning pretrained models
- **Objective:** apply Hugging Face to real problems.
- **Concepts:** pipelines, tokenizers, fine-tuning.
- **Hands-on:** fine-tune a model for classification.
- **Pitfall:** tokenizer/model mismatch.

### L5.4.5 — Prompting & in-context learning
- **Objective:** get results without training.
- **Concepts:** zero/few-shot prompting, in-context learning.
- **Hands-on:** solve a task by prompting alone; iterate prompts.
- **Pitfall:** vague prompts and blaming the model.

### L5.4.6 — How LLMs are built (overview)
- **Objective:** see the full LLM lifecycle.
- **Concepts:** pretraining → instruction tuning → RLHF.
- **Hands-on:** label outputs as base vs instruction-tuned behavior.
- **Pitfall:** thinking an LLM is one monolithic training step.

---

## Module 5.5 — Evaluation & Responsible AI (critical, job-relevant)
**Why this module matters:** evaluating language models is the hardest and most in-demand skill; it's also where responsible AI becomes concrete.

### L5.5.1 — Why evaluating language models is hard
- **Objective:** grasp open-ended evaluation.
- **Concepts:** no single right answer, automatic vs human eval.
- **Hands-on:** try (and see the limits of) automatic metrics.
- **Pitfall:** trusting BLEU/accuracy for open-ended tasks.

### L5.5.2 — Hallucination & factuality
- **Objective:** detect confident wrongness.
- **Concepts:** hallucination types, grounding, verification.
- **Hands-on:** find and label hallucinations in sample outputs.
- **Pitfall:** equating fluent with correct.

### L5.5.3 — Bias, fairness, toxicity
- **Objective:** surface social harms.
- **Concepts:** dataset bias, fairness, toxicity.
- **Hands-on:** probe a model for biased outputs.
- **Pitfall:** assuming a fluent model is unbiased.

### L5.5.4 — Helpful / Honest / Harmless (HHH)
- **Objective:** frame model behavior goals.
- **Concepts:** the HHH framework and its tradeoffs.
- **Hands-on:** judge outputs against HHH; find tensions.
- **Pitfall:** treating the three as never conflicting.

### L5.5.5 — Rubrics for grading model outputs
- **Objective:** evaluate consistently.
- **Concepts:** rubric design, scoring scales, inter-rater agreement.
- **Hands-on:** build a rubric; score a contested example and defend it.
- **Pitfall:** vague criteria that can't be applied consistently.

### L5.5.6 — RLHF & human feedback
- **Objective:** understand how preferences shape models.
- **Concepts:** preference data, reward models, RLHF loop.
- **Hands-on:** rank outputs to build a preference dataset.
- **Pitfall:** thinking human feedback is objective/noise-free.

---

## Project
- **P5 — LLM Evaluation Capstone:** given model outputs with planted errors, rate each against a rubric, rewrite the worst, and justify every score. Mirrors real AI-evaluation roles (and the Micro1/Zara-style screen). *Reuses `capstone-ai-model-evaluator.md` from the repo.* Deliverable: completed evaluation packet + scoring rationale.

## Mastery Check (must pass to complete the track)
| Skill | Pass bar |
|-------|----------|
| Explain | Describe attention without equations |
| Apply | Fine-tune or prompt a model to solve a real task |
| Evaluate | Design a rubric and defend scores on a contested example |

## Tools & Environment
- Hugging Face Transformers, PyTorch, GPU notebooks. Pretrained models + eval datasets preloaded.

## Unlocks
→ **Level 6 — Capstone, Portfolio & Career**

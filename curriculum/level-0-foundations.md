# Level 0 — Foundations (Code + Math for AI)

> The on-ramp. Get a true beginner writing Python, wrangling data, and reading ML math notation — nothing more.

**Goal:** Be able to write Python, manipulate data, and read the math used in ML.
**Audience:** Absolute beginners. No coding or math assumed.
**Prerequisites:** None.
**Duration:** 4–6 weeks.
**Maps to:** Programming, Linear Algebra, Calculus, Probability & Statistics (applied subset).

## Learning Outcomes
By the end, a learner can:
- Write Python functions, use core data structures, handle files and errors.
- Load, clean, and visualize a real dataset with NumPy / pandas / matplotlib.
- Read and explain (in plain English) vectors, matrices, dot products, derivatives, gradients, and basic probability.
- Vectorize a loop with NumPy and explain why it's faster.

## Teaching Approach (this level)
- **Math is applied and visual** — never taught as a standalone wall. Every math idea is tied to a code cell the same lesson.
- **Confidence first** — early wins, runnable code from lesson 1, no environment setup pain (browser notebooks).
- This is the only level where we slow down on syntax. From Level 1 on, coding is a tool, not the subject.

---

## Module 0.1 — Python Programming
**Why this module matters:** every model you'll ever build is Python. Fluency here removes friction everywhere later.

### L0.1.1 — Setup & "Hello, AI"
- **Objective:** run code in a browser notebook, print output.
- **Concepts:** notebooks, cells, running code, comments.
- **Hands-on:** edit and run a pre-written 3-line script that greets you.
- **Pitfall:** thinking you must install anything — you don't.

### L0.1.2 — Variables, types, operators
- **Objective:** store and compute values.
- **Concepts:** int, float, str, bool; arithmetic & comparison operators.
- **Hands-on:** build a tiny tip calculator.
- **Pitfall:** mixing strings and numbers (`"5" + 5`).

### L0.1.3 — Conditionals & control flow
- **Objective:** make code branch on conditions.
- **Concepts:** if / elif / else, boolean logic.
- **Hands-on:** classify a number as positive/negative/zero.
- **Pitfall:** `=` vs `==`.

### L0.1.4 — Loops
- **Objective:** repeat work.
- **Concepts:** for, while, range, break/continue.
- **Hands-on:** sum the numbers 1–100 two ways.
- **Pitfall:** infinite loops; off-by-one.

### L0.1.5 — Functions & scope
- **Objective:** package reusable logic.
- **Concepts:** def, parameters, return, local vs global.
- **Hands-on:** write `is_even(n)` and a `celsius_to_fahrenheit`.
- **Pitfall:** forgetting `return` (function prints but returns None).

### L0.1.6 — Lists, tuples, dicts, sets
- **Objective:** store collections.
- **Concepts:** indexing, slicing, mutation, key-value lookup, uniqueness.
- **Hands-on:** word-frequency counter with a dict.
- **Pitfall:** mutating a list while iterating it.

### L0.1.7 — Strings & f-strings
- **Objective:** manipulate text.
- **Concepts:** methods, slicing, formatting.
- **Hands-on:** clean and reformat messy names.
- **Pitfall:** strings are immutable.

### L0.1.8 — Files & error handling
- **Objective:** read external data safely.
- **Concepts:** open/read/write, try/except.
- **Hands-on:** read a text file, count lines, handle a missing file.
- **Pitfall:** bare `except` hiding real bugs.

### L0.1.9 — Comprehensions
- **Objective:** write concise transforms.
- **Concepts:** list/dict comprehensions.
- **Hands-on:** rewrite a loop as a one-liner.
- **Pitfall:** cramming too much into one comprehension.

### L0.1.10 — Classes & objects (just enough)
- **Objective:** read OOP code you'll meet in libraries.
- **Concepts:** class, __init__, methods, attributes.
- **Hands-on:** a `BankAccount` with deposit/withdraw.
- **Pitfall:** forgetting `self`.

---

## Module 0.2 — Scientific Python
**Why this module matters:** ML is data + arrays. NumPy and pandas are the daily tools.

### L0.2.1 — NumPy arrays & vectorized thinking
- **Objective:** create and operate on arrays.
- **Concepts:** ndarray, shape, dtype, vectorized ops.
- **Hands-on:** convert a temperature list to an array and scale it.
- **Pitfall:** looping over arrays instead of vectorizing.

### L0.2.2 — Array math & broadcasting
- **Objective:** compute across arrays of different shapes.
- **Concepts:** elementwise ops, broadcasting rules, axis.
- **Hands-on:** normalize each column of a matrix.
- **Pitfall:** shape mismatches.

### L0.2.3 — pandas: Series & DataFrames
- **Objective:** hold tabular data.
- **Concepts:** Series, DataFrame, index, columns.
- **Hands-on:** build a DataFrame from a dict; inspect it.
- **Pitfall:** confusing label vs position indexing (`loc` vs `iloc`).

### L0.2.4 — Loading, filtering, grouping
- **Objective:** answer questions with data.
- **Concepts:** read_csv, boolean filtering, groupby, aggregation.
- **Hands-on:** load Titanic, find survival rate by class.
- **Pitfall:** chained-indexing warnings.

### L0.2.5 — Plotting basics
- **Objective:** see your data.
- **Concepts:** line, bar, histogram, scatter; labels.
- **Hands-on:** plot a distribution and a relationship.
- **Pitfall:** unlabeled axes.

### L0.2.6 — Cleaning messy data
- **Objective:** prepare real-world data.
- **Concepts:** missing values, type conversion, duplicates.
- **Hands-on:** clean a deliberately dirty CSV.
- **Pitfall:** dropping rows you should have imputed.

---

## Module 0.3 — Math You Actually Need (applied, visual)
**Why this module matters:** these five ideas (vectors, matrices, dot product, gradient, probability) recur in every later level. We teach intuition, not proofs.

### L0.3.1 — Vectors & geometric meaning
- **Objective:** see a vector as a point/arrow and a list of features.
- **Concepts:** vectors, magnitude, direction.
- **Hands-on:** plot 2D vectors; add them.
- **Pitfall:** treating math vectors and Python lists as identical.

### L0.3.2 — Matrices & matrix multiplication
- **Objective:** read matrix ops as transformations of data.
- **Concepts:** matrix, shape, multiplication rule.
- **Hands-on:** multiply matrices in NumPy; check shapes.
- **Pitfall:** assuming AB = BA.

### L0.3.3 — Dot products & similarity
- **Objective:** understand why dot product measures alignment.
- **Concepts:** dot product, cosine similarity intuition.
- **Hands-on:** compute similarity between two feature vectors.
- **Pitfall:** forgetting to normalize before comparing.

### L0.3.4 — Derivatives & the gradient
- **Objective:** grasp "slope" and "downhill direction."
- **Concepts:** derivative as rate of change; gradient as direction of steepest ascent.
- **Hands-on:** numerically estimate a derivative; visualize a slope.
- **Pitfall:** thinking gradients are scary — they're just slopes.

### L0.3.5 — The chain rule
- **Objective:** differentiate nested functions (preview of backprop).
- **Concepts:** chain rule intuition.
- **Hands-on:** compute the derivative of a composed function step by step.
- **Pitfall:** dropping a factor in the chain.

### L0.3.6 — Probability basics
- **Objective:** reason about uncertainty.
- **Concepts:** events, probability, conditional probability, Bayes intuition.
- **Hands-on:** compute conditional probabilities from a small table.
- **Pitfall:** confusing P(A|B) with P(B|A).

### L0.3.7 — Distributions & summary stats
- **Objective:** describe data numerically.
- **Concepts:** mean, variance, std, normal distribution.
- **Hands-on:** sample from a normal, plot the histogram.
- **Pitfall:** reporting mean for skewed data.

### L0.3.8 — Statistics: sampling & correlation
- **Objective:** avoid the classic data traps.
- **Concepts:** sample vs population, correlation vs causation.
- **Hands-on:** find a spurious correlation and explain it.
- **Pitfall:** assuming correlation implies causation.

---

## Project
- **P0 — Data Explorer:** load a real CSV (Titanic or similar), clean it, and answer 5 questions with labeled charts. Deliverable: a notebook + a 5-sentence written summary of findings.

## Mastery Check (must pass to unlock Level 1)
| Skill | Pass bar |
|-------|----------|
| Coding | Write a function from a spec; correct output on hidden tests |
| NumPy | Vectorize a given loop (no Python `for`) |
| Data | Clean a messy DataFrame and produce one correct chart |
| Math (explain) | In plain English: what is a gradient? what does a dot product measure? |

## Tools & Environment
- Browser notebooks (Colab / Kaggle / JupyterLite), Python 3, NumPy, pandas, matplotlib/seaborn. No local install.

## Unlocks
→ **Level 1 — Fundamentals of AI**

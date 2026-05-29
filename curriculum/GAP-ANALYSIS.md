# Current App → Curriculum: Gap Analysis & Phased Plan

_Generated mapping of the shipped AI Academy app against the 7-level curriculum spec. No app changes have been made; this is for a build decision._

## TL;DR — the one finding that drives everything

The shipped app and the curriculum are **two different kinds of product**:

- **Shipped app** = a *concept-literacy game*. Drag/sort/slider/match activities that build intuition. No code, no datasets, runs as a static no-backend site.
- **Curriculum** = a *hands-on engineering program*. Its north-star is "% of learners who can **build AND explain** a working model," and almost every lesson's `Hands-on` is **run/write code in a browser notebook** (Python, NumPy, pandas, scikit-learn, PyTorch, GPU).

So the gap is not mostly "missing lessons" — it's a **missing capability: in-app code execution.** Bridging it is the central decision. Good news: a large slice (Levels 0–2, plus L1 search/agents) can run **real Python in the browser with no backend** via **Pyodide** (NumPy/pandas/scikit-learn/matplotlib all have WASM builds). The deep-learning levels (L3–L5: PyTorch + GPU) **cannot** run client-side and need external notebooks (Colab/Kaggle) or a backend.

## What the app covers today

**Beginner track (10 lessons):** What Is AI? · What Is ML? · Training Data · Features & Labels · Classification · Prediction · Bias in Data · Overfitting · Neural Networks · AI Ethics
**Intermediate track (8 modules):** What Is AI Evaluation? · Rubrics · Rating 1–5 · Ranking · Hallucination Detection · HHH · Rewrite to 5/5 · Capstone (AI Model Evaluator)

## Lesson-by-lesson mapping

| Current lesson | Maps to curriculum | Depth today | Verdict |
|---|---|---|---|
| What Is AI? | L1.1.1–1.1.3 (What is AI) | concept | **Keep**, fold into L1 M1.1 |
| What Is Machine Learning? | L2.1.1 / L2.1.3 (learning from data, workflow) | concept | **Keep** as L2 intuition opener |
| Training Data | L2.1.4 (features/labels), L0.2 (data) | concept | **Keep**; real version needs pandas (Pyodide) |
| Features & Labels | L2.1.4 | concept | **Keep**, merge w/ Training Data |
| Classification | L2.3 (classification family) | concept | **Keep** as intuition; real version = sklearn |
| Prediction | L2.2.1 (regression / prediction) | concept | **Keep** as intuition |
| Bias in Data | L1.1.4 + L5.5.3 (bias/fairness) | concept | **Keep**, thread across levels |
| Overfitting | L2.2.5 / **L2.4.2** (the L2 spine idea) | concept | **Keep**; strong fit, deepen w/ code |
| Neural Networks | L3.1.x (neuron→network) | concept | **Keep** as L3 intuition; real L3 = backprop+PyTorch |
| AI Ethics | L1.1.4 → L6.2 (Responsible AI thread) | concept | **Keep**, thread across levels |
| **Intermediate ×8** | **L5 Module 5.5 + Project P5** | concept→applied | **Strong 1:1 fit** — already the L5 evaluation block & capstone |

## Coverage by curriculum level

| Level | Target size | App covers today | Depth |
|---|---|---|---|
| **L0 Foundations** (Python/NumPy/pandas/math) | ~24 lessons | **0%** | — |
| **L1 Fundamentals of AI** (What-is-AI, search, logic, agents) | ~17 lessons | ~Module 1.1 only (~20%) | concept |
| **L2 Intro to ML** (regression, classification, eval, ensembles) | ~27 lessons | the *intuition* lessons (~25%) | concept, no code |
| **L3 Neural Nets & DL** (backprop, PyTorch) | ~20 lessons | 1 intuition lesson (~5%) | concept |
| **L4 Computer Vision** (CNNs) | ~14 lessons | **0%** | — |
| **L5 NLP & LLMs** (text→transformers→**eval**) | ~21 lessons | **Module 5.5 + P5 (~30%)** | applied, good |
| **L6 Capstone/Career** | ~11 lessons | **0%** | — |

**Net:** the app is a solid **concept layer for L1–L2** and a genuinely strong **L5.5 evaluation block + capstone**. Everything that requires writing/running code — i.e. most of the curriculum — is absent.

## The big gaps (in priority order)

1. **Code execution capability** (blocks the north-star). Without it the platform can teach *about* ML but can't let learners *build* models.
2. **L0 Foundations** — the entire on-ramp (Python, NumPy, pandas, applied math). Nothing exists.
3. **L2 hands-on spine** — gradient descent, sklearn workflow, metrics/confusion/ROC, cross-validation, **data leakage**, ensembles, clustering, PCA.
4. **L1 problem-solving** — search (BFS/DFS/UCS/A*), logic, agents, **minimax/alpha-beta** (all pure-Python ⇒ Pyodide-friendly).
5. **L3–L5 deep learning** — backprop-from-scratch, PyTorch, CNNs, embeddings, attention/transformers, prompting (need GPU/external notebooks).
6. **L6** — capstone project flow, model cards, portfolio, interview prep.

## Recommended phased build order

**Phase A — Reframe + apply the teaching method (no new capability, ~current scope).**
Re-slot existing content into the curriculum spine: current beginner 10 → L1 (M1.1) + L2 (intuition) + L3 (intuition); intermediate 8 → L5 M5.5 + P5. Apply the piloted **I do → We do → You do**, Go Deeper, mastery gating, streak/spaced-review across them. Ships a coherent "L1 + L2-concepts + L5-eval" slice fast, reuses everything. _This is the in-flight pilot, just organized under the curriculum's level names._

**Phase B — In-browser Python (Pyodide) → real hands-on, still no backend.**
Add a `notebook`/`code-cell` activity type with auto-graded checks. Author **L0** (Python, NumPy, pandas, math) and the **L2 hands-on** (sklearn, gradient descent, metrics, leakage) and **L1 code** (search/minimax) as runnable cells. This is what makes "build a working model" true for classical ML — entirely client-side.

**Phase C — Deep learning (L3–L5 hands-on).** Needs GPU/PyTorch → not client-side. Decide between (1) **hybrid**: in-app concept + "Open in Colab/Kaggle" launchers with starter notebooks, or (2) stand up a backend execution service. Keep L3–L5 *concepts* in-app regardless.

**Phase D — L6 capstone, model cards, portfolio/career.** Mostly project-management + writeup flows; light on new tech.

Map levels → the app's existing multi-track system (Full AI Engineer 0→6, ML Fundamentals 0→2, etc. — the spec's learner tracks).

## Decisions needed before building

1. **Scope of ambition:** keep it a polished *concept course* (Phase A only), or commit to the *hands-on engineer track* (Phases B+) — i.e. is in-browser code execution in?
2. **If code is in:** confirm **Pyodide (no backend)** for L0–L2/L1 as the approach; and for L3–L5 pick **Colab/Kaggle launchers (hybrid, no backend)** vs **a backend service**.
3. **Start point:** begin with **Phase A** (reframe + finish the teaching-method rollout we piloted) so there's a coherent slice immediately, then move to Phase B?

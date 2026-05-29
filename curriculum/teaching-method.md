# Teaching Method — The Platform Pedagogy Bible

> The single source of truth for *how* we teach on this platform. Every level, module, and lesson is built against this document. Curriculum says **what** to teach; this says **how**.

---

## 0. Philosophy & North Star

**We optimize for one number:** the **% of learners who can build AND explain a working model.**

Not enrollment. Not video views. Not "completion" as time-served. A learner has succeeded when they can (a) produce a working model on a real problem and (b) explain *why* it works and where it fails. Every design decision below is justified by whether it moves that number.

**Three beliefs everything rests on:**
1. **People learn by doing, not by watching.** Passive video is the weakest part of online education. We minimize it.
2. **Motivation is a resource to be managed.** Beginners quit from frustration and fog, not lack of intelligence. We engineer early wins and clarity.
3. **Understanding is provable.** If a learner can't explain it, they don't know it yet — so we make explanation a graded deliverable.

---

## 1. The Nine Pillars

### Pillar 1 — Top-Down Learning ("use it before you understand it")
Show a working result **first**, then peel back the layers.

- Lesson 1 of every level produces something that *works* (a trained model, a solved maze, a classified image) before any theory.
- The same artifact is revisited at increasing depth (see the **Spiral**, §3). The learner feels a limitation, *then* gets the tool that fixes it.
- **Why:** motivation before mechanism. Curiosity is created by a working-but-mysterious result, then satisfied by theory.
- **Rule for authors:** never introduce a concept before the learner has felt the need for it.

### Pillar 2 — Gradual Release ("I do → We do → You do")
Every lesson follows the same three-beat structure (see §4 for the full anatomy):

| Beat | Driver | ~Time | What happens |
|------|--------|-------|--------------|
| **I do** | Instructor/video | 25% | Watch it done, with narrated thinking |
| **We do** | Together | 25% | Scaffolded practice — fill-in-the-blank, hints on |
| **You do** | Learner alone | 50% | Independent challenge, auto-graded, no scaffolding |

- **Target ratio across any lesson: ~30% input / 70% doing.** If a lesson is mostly watching, it's broken and must be rebuilt.

### Pillar 3 — Math Just-In-Time
Math is introduced **the moment a concept needs it**, never as a standalone wall.

- **Three layers per math idea:**
  1. **Visual/intuitive** (default) — gradient descent as a ball rolling downhill; attention as a heatmap.
  2. **Just-in-time formal** — the equation appears only when needed, every symbol labeled in plain English.
  3. **"Go Deeper"** (optional, collapsible) — full derivations for the curious; never blocks progression.
- **Adapts by level:** at L0–L2 (beginners) math is *defanged* — visual-first, minimal notation. From L3 on (learners now have the prereqs) math is *leveraged* — "remember the chain rule? that IS backprop." Same philosophy, different dial.
- **Rule for authors:** a learner who never opens a "Go Deeper" panel must still be able to complete the lesson.

### Pillar 4 — The AI Socratic Tutor (the unfair advantage)
A 24/7 tutor that targets **Bloom's 2-sigma problem** (1:1 tutoring ≈ +2 standard deviations) at scale.

**Behavior rules (non-negotiable):**
- **Never gives the answer.** Escalating hints only:
  1. A question back ("What does the error say the shape is?")
  2. A nudge toward the relevant concept
  3. A worked *analogous* example (different numbers)
  4. Only after genuine struggle: a direct pointer — never the full solution
- **Explains the same idea multiple ways** — if one analogy misses, try another (visual → code → real-world).
- **Diagnoses misconceptions**, not just errors ("You think the model memorizes — here's why it generalizes").
- **Meets the learner's level** — detects whether the confusion is syntax, concept, or math.

**Guardrails (the make-or-break risk):**
- Anti hint-farming: detect "just tell me" patterns and refuse.
- Per-learner cost ceilings.
- Uncertainty handling: when the tutor isn't confident, it flags and routes to human/forum rather than bluffing.
- Privacy: clear policy on learner code/data.

> This is the platform's biggest differentiator **and** its biggest reliability/cost risk. Treat the guardrails as a first-class feature, not an afterthought.

### Pillar 5 — Zero-Friction Environment
Every learner writes real code in **under 60 seconds**, with no setup.

- Browser-based notebooks; nothing to install.
- Datasets, models, and **GPU preloaded** in every lesson.
- Instant auto-graded feedback (seconds, not "wait for the TA").
- One-click reset so a broken environment never blocks anyone.
- **Why:** every minute lost to `pip`/CUDA errors is a minute of churn, concentrated exactly when motivation is most fragile (week 1).

### Pillar 6 — Mastery-Based Progression
A level/unit unlocks **only when its mastery check passes** — gated on competence, not time.

- **Unlimited attempts**, with **new problem variants each time** (no memorizing answers).
- **Spaced re-checks:** a concept from Unit 2 reappears in Unit 5's check to confirm retention.
- **Why:** time-based courses pass learners who don't understand. We refuse to.

### Pillar 7 — The Assessment Ladder
Low-stakes → high-stakes, climbing toward portfolio-grade work.

```
Formative quiz  →  Lesson exercise  →  Module project  →  Level capstone  →  Portfolio
(every lesson)     (every lesson)      (every module)      (every level)     (career)
   instant            auto-graded         rubric-graded       rubric + oral     defensible
```

- **Formative quizzes:** instant, ungraded, low-stakes — surface gaps without fear.
- **Module projects:** apply a unit's skills, graded against a *published* rubric.
- **Level capstones:** integrative; require an **oral/written "explain it"** component.
- **Peer review:** learners grade each other against rubrics — evaluating others deepens their own understanding (and mirrors real AI-eval jobs).

### Pillar 8 — Retention Systems
The hardest problem in online education isn't teaching — it's **finishing** (MOOC completion is ~5–15%).

- **Cohort-based** (recommended launch model): fixed start dates, a group moving together, accountability, community. Add self-paced later once content is validated.
- **Spaced repetition:** concepts resurface on a forgetting-curve schedule.
- **Visible progress + early wins:** a working result on day one, streaks, milestones, progress bars.
- **Community:** peers, study groups, "I'm stuck" channels.

### Pillar 9 — Personalization
- **Diagnostic placement:** a short upfront assessment routes learners to the right starting level (no boredom, no drowning).
- **Multiple modalities:** video, text, interactive, code — learner's choice.
- **Adaptive tutor:** adjusts hint depth and pacing per individual (Pillar 4).

---

## 2. Instruction Priority (when pillars conflict)

When two pillars pull in opposite directions, resolve in this order:

1. **Learner understanding** (the north star) wins over coverage.
2. **Doing** (Pillar 2) wins over explaining.
3. **Mastery** (Pillar 6) wins over pace.
4. **Clarity** wins over rigor — push rigor into "Go Deeper."

Example: if covering one more algorithm means cutting hands-on time below 70%, **cut the algorithm**.

---

## 3. The Spine & The Spiral

**The spine — one idea, taught all the way through:**

> `model = parameters + loss + optimization`

| Level | Same idea, deeper turn |
|-------|------------------------|
| L1 Fundamentals | model as a decision-maker (search/agents) |
| L2 Intro ML | model = function fit to data; loss; generalization |
| L3 NN & DL | the function becomes layers; loss minimized by backprop |
| L4 Computer Vision | same nets, specialized to pixels (CNNs) |
| L5 NLP & LLMs | same nets, specialized to tokens (attention, transformers) |

**The rule:** in every level, *explicitly* call back to the previous turn. "Remember gradient descent from ML? CNNs are the same loop — the function just looks at pixels now." This cross-referencing is what makes a *program* feel like one body of knowledge instead of disconnected courses.

**Cross-level threads** (deepen in every level, never "done"):
- **Generalization** (overfitting/underfitting) — L2 onward
- **Honest evaluation** — every level grades model quality, never hand-waves it
- **Responsible AI** — introduced L1, deepened to L6
- **"Build AND explain"** — every project requires explaining *why*

---

## 4. Anatomy of a Lesson (the build template)

Every lesson is authored to this shape. Target length: 20–40 min of learner time.

1. **Hook (top-down) — ~2 min.** Show the working result or pose the concrete problem. "By the end of this lesson you'll have X." Create the curiosity gap.
2. **I do — ~25%.** Instructor demonstrates end-to-end with narrated reasoning (not just *what*, but *why* each step). One clean worked example.
3. **We do — ~25%.** Guided practice: fill-in-the-blank code, scaffolded steps, hints available, the AI tutor on. Scaffolding fades within the segment.
4. **You do — ~50%.** Independent, auto-graded challenge. No scaffolding. The learner produces something.
5. **Formative check — ~2 min.** 1–3 instant questions to surface gaps.
6. **Takeaway + bridge — ~1 min.** One-sentence "what you now know," and a teaser for how the next lesson builds on it (feeds the spiral).

**Every lesson spec (for authors) must contain:**
- **Objective** — what the learner can *do* after (a verb, not "understand")
- **Concepts** — the ideas introduced
- **Hands-on** — the exact notebook/exercise
- **Pitfall** — the common mistake to preempt
- **Tutor notes** — likely misconceptions + the escalating-hint ladder for this lesson
- **Mastery contribution** — what this lesson adds to the unit's mastery check

---

## 5. Assessment & Mastery Design (detail)

**Formative (ungraded, constant):** instant quizzes and auto-graded exercises. Purpose: feedback, not judgment. Failure here is free and expected.

**Summative (graded, gated):**
- **Module project** — rubric-graded, published rubric so expectations are transparent.
- **Mastery check** — must pass to unlock the next level. Unlimited attempts, fresh variants, spaced recall of earlier concepts. A check tests *transfer* (new problem), not recall (memorized answer).
- **Level capstone** — includes an **"explain it" oral/written** defense. Code alone never passes; the learner must justify choices and name limitations.

**Rubric design principles:**
- Criteria are concrete enough that two graders agree.
- Always include an **"explain/why" criterion**, not just "does it run."
- Always include a **"limitations/failure modes" criterion** from L2 on.

**Peer review:** learners grade peers against the same rubric. This is teaching-by-evaluating and directly builds the AI-evaluation skill that L5 and real jobs require.

---

## 6. How We Teach Math (detail)

The #1 reason beginners quit AI is being hit with math-first. Our sequence for **every** mathematical concept:

1. **Intuition** — a picture or physical analogy, no symbols. ("The gradient points uphill; we walk the other way.")
2. **Connect to code** — show the same idea as a runnable cell the learner can poke.
3. **Formalize** — introduce notation *only now*, label every symbol in English.
4. **"Go Deeper" (optional)** — derivations and proofs, collapsible, never gating.

**The payoff moment (L3+):** when prereq math finally *does* something. "You took Calculus and wondered why — here it is: this derivative is how the network learns." Make that connection explicit; it retroactively justifies the hard prereqs and builds confidence.

---

## 7. Guidance for Content Authors

A checklist before any lesson ships:
- [ ] Opens with a working result or concrete problem (top-down)?
- [ ] ≤30% input, ≥70% doing?
- [ ] Math (if any) is visual-first with formal/Go-Deeper layered?
- [ ] Runs in the browser with zero setup, data/GPU preloaded?
- [ ] Has an auto-graded "You do" challenge?
- [ ] Tutor notes list the top misconceptions + hint ladder?
- [ ] Calls back to the spine ("remember X from the last level…")?
- [ ] Project/check includes an "explain why" and (L2+) "limitations"?
- [ ] A learner who skips every optional panel can still finish?

If any box is unchecked, the lesson isn't ready.

---

## 8. Metrics — What We Watch

- **North star:** % of learners who build AND explain a working model.
- **Leading indicators:** week-1 first-code time, early-win completion, mastery-check pass rate (first attempt vs eventual), hint-ladder depth before success.
- **Retention:** cohort completion rate, drop-off lesson heatmap (find the cliff and fix that lesson).
- **Tutor health:** % of tutor sessions resolved without giving the answer, cost per learner, escalation-to-human rate.
- **Guardrail against gaming:** never optimize a proxy (video views, time-on-site) at the expense of the north star.

---

## 9. Open Trade-offs (decide deliberately)

1. **Cohort vs self-paced** → recommendation: **launch cohort-first** (better retention, community, easier ops), add self-paced once content is proven.
2. **How hard to lean on the AI tutor** → biggest differentiator *and* biggest reliability/cost risk. Nail the Pillar 4 guardrails before scaling tutor usage.
3. **Breadth vs depth per level** → default to depth; a learner who deeply understands fewer ideas beats one who skimmed many (and forgets them).

---

*This is the teaching bible. Build every lesson against it; revise this file when the pedagogy evolves and the curriculum will follow.*

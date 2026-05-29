# Level 1 — Fundamentals of Artificial Intelligence

> The map of the whole field. Mostly conceptual, light math, high intuition. Build a classic (non-learning) intelligent agent.

**Goal:** Understand what AI is, its major paradigms, and build a search/game-playing agent.
**Audience:** Learners who finished Level 0 (or have basic Python).
**Prerequisites:** Level 0.
**Duration:** 4–5 weeks.
**Maps to:** *Fundamentals of Artificial Intelligence (SIA 1406)*.

## Learning Outcomes
By the end, a learner can:
- Place any AI technique on a map (symbolic vs learning vs deep vs LLM).
- Formulate a problem as a search over states and solve it (BFS/DFS/UCS/A*).
- Implement adversarial search (minimax + alpha-beta) for a game.
- Explain when classic AI (search/logic) beats machine learning.
- Discuss core AI ethics issues at an introductory level.

## Teaching Approach (this level)
- **Breadth with anchors** — the danger here is vague hand-waving. Every concept gets a runnable example.
- **Build before you abstract** — students code search and minimax themselves; theory follows the code.
- Light on math, heavy on problem-solving and intuition.

---

## Module 1.1 — What Is AI?
**Why this module matters:** gives the vocabulary and mental map the rest of the platform hangs on.

### L1.1.1 — History & waves of AI
- **Objective:** narrate how AI got here.
- **Concepts:** symbolic AI → expert systems → statistical ML → deep learning → LLMs; AI winters.
- **Hands-on:** timeline-matching interactive.
- **Pitfall:** thinking "AI = ChatGPT" with no history.

### L1.1.2 — Narrow vs general AI & myths
- **Objective:** separate reality from hype.
- **Concepts:** ANI vs AGI, common misconceptions.
- **Hands-on:** classify real systems as narrow/general.
- **Pitfall:** anthropomorphizing models.

### L1.1.3 — How AI is built today
- **Objective:** see the modern pipeline at a glance.
- **Concepts:** data → model → training → evaluation → deployment.
- **Hands-on:** label the stages of a real product.
- **Pitfall:** believing models "just know" things.

### L1.1.4 — AI ethics (first pass)
- **Objective:** spot ethical stakes early.
- **Concepts:** bias, automation, accountability, dual use.
- **Hands-on:** debate a short case study.
- **Pitfall:** treating ethics as separate from engineering.

---

## Module 1.2 — Search & Problem Solving
**Why this module matters:** search is the purest form of "intelligent" problem-solving and the foundation of game agents and planning.

### L1.2.1 — State spaces & problem formulation
- **Objective:** model a problem as states + actions + goal.
- **Concepts:** state, action, transition, goal test, path cost.
- **Hands-on:** formulate the 8-puzzle as a state space.
- **Pitfall:** vague state definitions.

### L1.2.2 — Uninformed search: BFS & DFS
- **Objective:** explore systematically.
- **Concepts:** frontier, explored set, completeness, optimality.
- **Hands-on:** solve a maze with BFS and DFS; compare paths.
- **Pitfall:** revisiting nodes (no explored set).

### L1.2.3 — Uniform Cost Search
- **Objective:** handle weighted paths.
- **Concepts:** priority queue by path cost.
- **Hands-on:** shortest route on a weighted map.
- **Pitfall:** confusing UCS with BFS when costs differ.

### L1.2.4 — Heuristics & greedy search
- **Objective:** use estimates to guide search.
- **Concepts:** heuristic function, admissibility.
- **Hands-on:** design a heuristic for the 8-puzzle.
- **Pitfall:** non-admissible heuristics breaking optimality.

### L1.2.5 — A* search
- **Objective:** combine cost + heuristic optimally.
- **Concepts:** f = g + h; why A* is optimal with an admissible h.
- **Hands-on:** implement A* on a grid with obstacles.
- **Pitfall:** forgetting g (becomes greedy).

### L1.2.6 — Local search & hill climbing
- **Objective:** optimize when the path doesn't matter.
- **Concepts:** hill climbing, local optima, random restarts.
- **Hands-on:** solve n-queens with hill climbing.
- **Pitfall:** getting stuck in local optima and not knowing it.

---

## Module 1.3 — Knowledge & Reasoning
**Why this module matters:** shows the symbolic side of AI — reasoning without learning.

### L1.3.1 — Propositional logic
- **Objective:** represent facts formally.
- **Concepts:** propositions, connectives, truth tables.
- **Hands-on:** encode a puzzle as logic statements.
- **Pitfall:** confusing implication with equivalence.

### L1.3.2 — Inference & rule-based systems
- **Objective:** derive new facts.
- **Concepts:** modus ponens, forward/backward chaining.
- **Hands-on:** build a tiny rule-based "expert" (e.g., animal guesser).
- **Pitfall:** rule explosion / contradictions.

### L1.3.3 — Knowledge representation (intro)
- **Objective:** see how knowledge is structured.
- **Concepts:** semantic nets, frames, ontologies (overview).
- **Hands-on:** model a small knowledge graph.
- **Pitfall:** over-engineering the representation.

---

## Module 1.4 — Agents & Game Playing
**Why this module matters:** ties search to acting in an environment — the bridge to RL and the level's capstone.

### L1.4.1 — Rational agents & the agent loop
- **Objective:** model perceive → decide → act.
- **Concepts:** agent, environment, percept, rationality, agent types.
- **Hands-on:** code a reflex agent for a vacuum world.
- **Pitfall:** conflating "rational" with "perfect."

### L1.4.2 — Adversarial search: minimax
- **Objective:** play optimally against an opponent.
- **Concepts:** game tree, minimax value, terminal utility.
- **Hands-on:** implement minimax for tic-tac-toe.
- **Pitfall:** wrong sign on min vs max nodes.

### L1.4.3 — Alpha-beta pruning
- **Objective:** make minimax fast.
- **Concepts:** pruning, move ordering.
- **Hands-on:** add alpha-beta; measure nodes saved.
- **Pitfall:** pruning incorrectly and changing the result.

### L1.4.4 — Decision-making under uncertainty (intro)
- **Objective:** preview probabilistic decisions.
- **Concepts:** expectimax, expected utility (overview).
- **Hands-on:** expectimax on a dice game.
- **Pitfall:** assuming the world is deterministic.

---

## Project
- **P1 — Game-Playing Agent:** build an agent for tic-tac-toe → Connect 4 (or a chess move-picker) using minimax + alpha-beta. **Requirement:** the bot must output a short explanation of *why* it chose each move. (The chess work in the repo is a starting template.)

## Mastery Check (must pass to unlock Level 2)
| Skill | Pass bar |
|-------|----------|
| Search | Trace A* by hand on a small graph; correct final path |
| Implementation | Working minimax for a toy game on hidden tests |
| Judgment | Explain a scenario where search beats learning, and one where it doesn't |

## Tools & Environment
- Python notebooks; simple visualization for grids/trees. No heavy libraries needed.

## Unlocks
→ **Level 2 — Introduction to Machine Learning**

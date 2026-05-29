# Level 2 — Introduction to Machine Learning

> The first "models learn from data" level. Classical ML, end to end. The single most important idea here: **generalization**.

**Goal:** Build, evaluate, and explain classical ML models on real data.
**Audience:** Learners who finished Levels 0–1.
**Prerequisites:** Level 0 (math + pandas), Level 1 (problem framing).
**Duration:** 6–7 weeks.
**Maps to:** *Introduction to Machine Learning (MOK 1506)*.

## Learning Outcomes
By the end, a learner can:
- Run the full ML workflow: data → features → model → evaluate → iterate.
- Implement and explain linear/logistic regression, kNN, trees, and ensembles.
- Diagnose overfitting/underfitting and apply the right fix.
- Choose and justify the right metric for a problem (incl. imbalanced data).
- Detect data leakage and explain why it inflates scores.

## Teaching Approach (this level)
- **Top-down:** lesson 1 trains a working predictor before any theory.
- **scikit-learn first, math second** — get results, then open the box on the two anchor algorithms (linear & logistic regression) with the gradient from Level 0.
- **Evaluation is the spine** — every model is judged honestly; "it got 99%" triggers a leakage hunt.

---

## Module 2.1 — The ML Mindset
**Why this module matters:** reframes problem-solving from "write rules" to "learn rules from data."

### L2.1.1 — What learning from data means
- **Objective:** see a model learn (top-down demo).
- **Concepts:** examples, patterns, prediction; rules learned vs hand-coded.
- **Hands-on:** train a one-line model on a toy dataset and predict.
- **Pitfall:** thinking ML is magic rather than fitting a function.

### L2.1.2 — Types of ML
- **Objective:** classify a task.
- **Concepts:** supervised, unsupervised, reinforcement.
- **Hands-on:** label 10 real tasks by type.
- **Pitfall:** calling everything "supervised."

### L2.1.3 — The ML workflow
- **Objective:** know the full pipeline.
- **Concepts:** problem → data → features → model → eval → deploy.
- **Hands-on:** annotate a case study with the stages.
- **Pitfall:** jumping to modeling before understanding the data.

### L2.1.4 — Features & labels
- **Objective:** structure data for learning.
- **Concepts:** X/y, feature types, the data-first mindset.
- **Hands-on:** split a dataset into features and target.
- **Pitfall:** leaking the label into the features.

---

## Module 2.2 — Supervised Learning: Regression
**Why this module matters:** regression is the simplest place to meet loss + gradient descent for real.

### L2.2.1 — Linear regression
- **Objective:** fit a line to data.
- **Concepts:** model form, weights, predictions.
- **Hands-on:** predict house prices from one feature.
- **Pitfall:** extrapolating far beyond the data.

### L2.2.2 — Cost function (MSE)
- **Objective:** quantify "wrong."
- **Concepts:** residuals, mean squared error.
- **Hands-on:** compute MSE; see it shrink as the fit improves.
- **Pitfall:** confusing loss with metric.

### L2.2.3 — Gradient descent (first real encounter)
- **Objective:** minimize the cost.
- **Concepts:** gradient, learning rate, iterations (uses L0 calculus).
- **Hands-on:** implement gradient descent for linear regression.
- **Pitfall:** learning rate too high (diverges) or too low (crawls).

### L2.2.4 — Multiple features & scaling
- **Objective:** handle many inputs.
- **Concepts:** multivariate regression, feature scaling/normalization.
- **Hands-on:** add features; standardize them.
- **Pitfall:** not scaling features of different ranges.

### L2.2.5 — Polynomial regression & first overfitting
- **Objective:** see model complexity bite.
- **Concepts:** polynomial features, overfitting preview.
- **Hands-on:** fit increasing-degree polynomials; watch test error rise.
- **Pitfall:** chasing training error to zero.

---

## Module 2.3 — Supervised Learning: Classification
**Why this module matters:** most real ML tasks are classification.

### L2.3.1 — Logistic regression & sigmoid
- **Objective:** predict probabilities.
- **Concepts:** sigmoid, decision threshold, log loss.
- **Hands-on:** classify spam vs not-spam.
- **Pitfall:** reading probabilities as certainties.

### L2.3.2 — Decision boundaries
- **Objective:** visualize what a classifier learns.
- **Concepts:** linear vs nonlinear boundaries.
- **Hands-on:** plot boundaries for 2D data.
- **Pitfall:** assuming all boundaries are linear.

### L2.3.3 — k-Nearest Neighbors
- **Objective:** classify by similarity.
- **Concepts:** distance, choosing k.
- **Hands-on:** kNN on a small dataset; tune k.
- **Pitfall:** not scaling features (distance dominated by big ranges).

### L2.3.4 — Decision trees
- **Objective:** learn rules from data.
- **Concepts:** splits, impurity (Gini/entropy), depth.
- **Hands-on:** train and visualize a tree.
- **Pitfall:** unlimited depth → overfit.

### L2.3.5 — Naive Bayes
- **Objective:** classify with probability.
- **Concepts:** Bayes rule applied, independence assumption.
- **Hands-on:** text classification with Naive Bayes.
- **Pitfall:** forgetting the (naive) independence assumption.

### L2.3.6 — Support Vector Machines (intuition)
- **Objective:** maximize the margin.
- **Concepts:** margins, support vectors, kernels (overview).
- **Hands-on:** SVM on separable and non-separable data.
- **Pitfall:** treating SVM as a black box with no intuition.

---

## Module 2.4 — Evaluation & Generalization (the heart of the level)
**Why this module matters:** this is what separates someone who *runs* models from someone who *trusts* them.

### L2.4.1 — Train/validation/test split
- **Objective:** estimate real-world performance.
- **Concepts:** the three splits and their roles.
- **Hands-on:** split data correctly; never touch test until the end.
- **Pitfall:** tuning on the test set.

### L2.4.2 — Overfitting, underfitting, bias-variance
- **Objective:** diagnose model fit.
- **Concepts:** the tradeoff; learning curves.
- **Hands-on:** plot train vs validation error.
- **Pitfall:** judging by training error alone.

### L2.4.3 — Cross-validation
- **Objective:** estimate performance robustly.
- **Concepts:** k-fold CV.
- **Hands-on:** run 5-fold CV; report mean ± std.
- **Pitfall:** leaking preprocessing across folds.

### L2.4.4 — Metrics
- **Objective:** measure the right thing.
- **Concepts:** accuracy, precision, recall, F1.
- **Hands-on:** compute all four; see them diverge on imbalanced data.
- **Pitfall:** using accuracy on a 99%-negative dataset.

### L2.4.5 — Confusion matrix & ROC/AUC
- **Objective:** understand error types.
- **Concepts:** TP/FP/TN/FN, ROC curve, AUC, threshold tuning.
- **Hands-on:** plot a confusion matrix and ROC curve.
- **Pitfall:** ignoring the cost difference between FP and FN.

### L2.4.6 — Data leakage
- **Objective:** avoid too-good-to-be-true scores.
- **Concepts:** target leakage, train/test contamination.
- **Hands-on:** spot and fix a leak in a given pipeline.
- **Pitfall:** scaling/fitting on the whole dataset before splitting.

---

## Module 2.5 — Unsupervised Learning & Ensembles
**Why this module matters:** rounds out the classical toolkit and introduces the methods that win competitions.

### L2.5.1 — k-Means clustering
- **Objective:** group unlabeled data.
- **Concepts:** centroids, inertia, choosing k (elbow).
- **Hands-on:** segment customers.
- **Pitfall:** assuming clusters are always spherical.

### L2.5.2 — Hierarchical clustering
- **Objective:** build cluster trees.
- **Concepts:** agglomerative clustering, dendrograms.
- **Hands-on:** cluster and read a dendrogram.
- **Pitfall:** misreading dendrogram cut height.

### L2.5.3 — PCA & dimensionality reduction
- **Objective:** compress features.
- **Concepts:** variance, principal components.
- **Hands-on:** reduce dimensions and visualize.
- **Pitfall:** interpreting components as original features.

### L2.5.4 — Random forests
- **Objective:** combine trees for strength.
- **Concepts:** bagging, feature randomness.
- **Hands-on:** train a forest; read feature importance.
- **Pitfall:** trusting importance blindly.

### L2.5.5 — Gradient boosting
- **Objective:** sequentially correct errors.
- **Concepts:** boosting intuition, XGBoost/LightGBM.
- **Hands-on:** boost a model; compare to forest.
- **Pitfall:** overfitting with too many estimators.

### L2.5.6 — Feature engineering & selection
- **Objective:** make data work harder.
- **Concepts:** encoding, interaction features, selection.
- **Hands-on:** engineer features that lift the score.
- **Pitfall:** creating features that leak the target.

---

## Project
- **P2 — End-to-End ML Project:** pick a dataset → clean → engineer features → train ≥3 models → evaluate with proper CV and the right metric → choose a winner → **write an error analysis** explaining where and why the model fails. Deliverable: notebook + 1-page report.

## Mastery Check (must pass to unlock Level 3)
| Skill | Pass bar |
|-------|----------|
| Diagnosis | Given an overfit model, identify it and apply a working fix |
| Metrics | Choose + justify the right metric for an imbalanced problem |
| Leakage | Find and fix a planted data leak |
| Explain | Describe bias-variance tradeoff in plain English |

## Tools & Environment
- scikit-learn, pandas, NumPy, matplotlib in browser notebooks. Standard datasets preloaded.

## Unlocks
→ **Level 3 — Neural Networks & Deep Learning**

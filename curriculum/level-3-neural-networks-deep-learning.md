# Level 3 — Neural Networks & Deep Learning

> The big conceptual leap. Build a neural net from scratch, then in PyTorch. Everything after this is deep learning applied to a domain.

**Goal:** Understand and build neural networks — first from scratch (NumPy), then in a framework (PyTorch).
**Audience:** Learners who finished Level 2 (especially gradient descent + evaluation).
**Prerequisites:** Level 2; Level 0 calculus (chain rule) is load-bearing here.
**Duration:** 6–8 weeks.
**Maps to:** *Neural Networks & Deep Learning (NTC 1606)*.

## Learning Outcomes
By the end, a learner can:
- Explain forward pass, loss, and backpropagation, and derive one backprop step by hand.
- Build a working neural network from scratch in NumPy.
- Rebuild and extend it in PyTorch, training on a GPU.
- Apply regularization, dropout, and batch norm; tune key hyperparameters.
- Debug a network that won't train.

## Teaching Approach (this level)
- **Engine before car:** students build backprop in NumPy *before* touching PyTorch, so the framework is never magic.
- **Visual then formal:** backprop taught first as flowing gradients (animation), then with the chain rule.
- **Debugging is a first-class skill** — a whole strand on "why isn't my loss going down?"

---

## Module 3.1 — From Neuron to Network
**Why this module matters:** establishes the building block and why nonlinearity unlocks power.

### L3.1.1 — The perceptron
- **Objective:** see the simplest neuron learn.
- **Concepts:** weights, bias, weighted sum, threshold.
- **Hands-on:** train a perceptron on linearly separable data; watch it fail on XOR.
- **Pitfall:** expecting a single neuron to solve XOR.

### L3.1.2 — Activation functions
- **Objective:** add nonlinearity.
- **Concepts:** sigmoid, tanh, ReLU; why nonlinearity matters.
- **Hands-on:** swap activations; compare behavior.
- **Pitfall:** using sigmoid everywhere in deep nets (vanishing gradients).

### L3.1.3 — Multi-layer perceptrons & forward pass
- **Objective:** stack neurons into layers.
- **Concepts:** hidden layers, the forward pass as matrix multiplies.
- **Hands-on:** compute a forward pass by hand and in NumPy.
- **Pitfall:** shape mismatches between layers.

### L3.1.4 — Loss functions
- **Objective:** measure network error.
- **Concepts:** MSE for regression, cross-entropy for classification.
- **Hands-on:** compute both losses on sample outputs.
- **Pitfall:** using MSE for classification.

---

## Module 3.2 — How Networks Learn
**Why this module matters:** backprop is *the* idea of deep learning. Students who build it themselves never fear it again.

### L3.2.1 — Gradient descent, deepened
- **Objective:** minimize loss over many parameters.
- **Concepts:** parameter space, batch vs stochastic vs mini-batch.
- **Hands-on:** visualize descent on a loss surface.
- **Pitfall:** confusing an epoch with a step.

### L3.2.2 — Backpropagation
- **Objective:** compute gradients through layers.
- **Concepts:** chain rule applied layer by layer; gradient flow.
- **Hands-on:** derive backprop for a 2-layer net on paper, then verify numerically.
- **Pitfall:** dropping a term in the chain.

### L3.2.3 — Neural net from scratch (NumPy)
- **Objective:** build the whole engine.
- **Concepts:** forward + backward + update loop, no framework.
- **Hands-on:** classify MNIST digits with a hand-built net.
- **Pitfall:** not checking gradients numerically.

### L3.2.4 — Optimizers
- **Objective:** train faster and more stably.
- **Concepts:** SGD, momentum, RMSProp, Adam.
- **Hands-on:** compare optimizers on the same task.
- **Pitfall:** assuming Adam is always best.

### L3.2.5 — Learning rate & schedules
- **Objective:** control step size over training.
- **Concepts:** learning rate, decay, warmup.
- **Hands-on:** sweep learning rates; plot the effect.
- **Pitfall:** one fixed LR for all of training.

---

## Module 3.3 — Training Real Networks (PyTorch)
**Why this module matters:** the production toolkit; where scratch knowledge meets real engineering.

### L3.3.1 — PyTorch fundamentals
- **Objective:** use tensors and autograd.
- **Concepts:** tensors, autograd, computational graph.
- **Hands-on:** redo gradient descent with autograd.
- **Pitfall:** forgetting `zero_grad()` (gradients accumulate).

### L3.3.2 — Rebuild the scratch net in PyTorch
- **Objective:** map scratch concepts to framework code.
- **Concepts:** nn.Module, layers, optimizer, training loop.
- **Hands-on:** reimplement MNIST net; beat the scratch version.
- **Pitfall:** treating PyTorch as magic instead of the same math.

### L3.3.3 — Datasets, DataLoaders, batching
- **Objective:** feed data efficiently.
- **Concepts:** Dataset, DataLoader, batch size, shuffling.
- **Hands-on:** build a DataLoader pipeline.
- **Pitfall:** not shuffling training data.

### L3.3.4 — Regularization
- **Objective:** fight overfitting.
- **Concepts:** L2 weight decay, early stopping.
- **Hands-on:** add regularization; compare curves.
- **Pitfall:** over-regularizing into underfit.

### L3.3.5 — Dropout
- **Objective:** improve generalization.
- **Concepts:** dropout as ensemble-ish noise; train vs eval mode.
- **Hands-on:** add dropout; measure effect.
- **Pitfall:** leaving dropout on at inference (`model.eval()`).

### L3.3.6 — Batch normalization
- **Objective:** stabilize and speed up training.
- **Concepts:** normalizing activations.
- **Hands-on:** add batch norm; observe faster convergence.
- **Pitfall:** wrong placement relative to activation.

### L3.3.7 — Vanishing/exploding gradients
- **Objective:** recognize and fix gradient problems.
- **Concepts:** causes, init schemes, gradient clipping.
- **Hands-on:** induce then fix vanishing gradients.
- **Pitfall:** blaming the data when it's the gradients.

### L3.3.8 — Debugging training
- **Objective:** systematically fix "loss won't drop."
- **Concepts:** checklist — data, LR, shapes, loss, init.
- **Hands-on:** debug 3 broken training scripts.
- **Pitfall:** changing many things at once.

---

## Module 3.4 — Practical Deep Learning
**Why this module matters:** the operational skills to train real models.

### L3.4.1 — GPUs & why they matter
- **Objective:** train on hardware that's fast.
- **Concepts:** parallelism, moving tensors to device.
- **Hands-on:** run the same model on CPU vs GPU; time it.
- **Pitfall:** tensors on different devices.

### L3.4.2 — Hyperparameter tuning
- **Objective:** find good settings systematically.
- **Concepts:** grid/random search, what matters most.
- **Hands-on:** tune LR, batch size, hidden size.
- **Pitfall:** tuning on the test set.

### L3.4.3 — Saving, loading, reproducibility
- **Objective:** make results repeatable.
- **Concepts:** checkpoints, seeds, state dicts.
- **Hands-on:** save and reload a trained model.
- **Pitfall:** non-deterministic runs with no seed.

---

## Projects
- **P3a — Net from scratch:** NumPy-only neural net that classifies handwritten digits (MNIST). Must include a numerical gradient check.
- **P3b — Same task in PyTorch:** reimplement, then improve (deeper, dropout, better optimizer) and beat P3a. Deliverable: both notebooks + a short comparison writeup.

## Mastery Check (must pass to unlock Level 4)
| Skill | Pass bar |
|-------|----------|
| Backprop | Derive one backprop step by hand; correct result |
| Build | Working from-scratch net passing hidden tests |
| Reason | Explain why ReLU replaced sigmoid in deep nets |
| Debug | Fix a network that won't train |

## Tools & Environment
- PyTorch + NumPy in GPU-enabled notebooks. MNIST/Fashion-MNIST preloaded.

## Unlocks
→ **Level 4 — Computer Vision** and/or **Level 5 — NLP & LLMs**

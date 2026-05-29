# Level 4 — Computer Vision

> Deep learning pointed at images. Hard, but concrete — you can *see* what the model learns.

**Goal:** Apply deep learning to images: build and fine-tune image models.
**Audience:** Learners who finished Level 3.
**Prerequisites:** Level 3 (CNNs are neural nets).
**Duration:** 5–6 weeks.
**Maps to:** *Computer Vision (KOK 1506)* — taught **after** NN/DL despite the course code being 1506.

## Learning Outcomes
By the end, a learner can:
- Explain convolution and why it suits images (vs fully-connected nets).
- Build a CNN in PyTorch and visualize what its filters learn.
- Use transfer learning to beat training-from-scratch.
- Apply data augmentation and explain its effect.
- Describe how a vision model fails and why (distribution shift, adversarial).

## Teaching Approach (this level)
- **Exploit the visual advantage** — everything is rendered: filters, feature maps, augmentations, failure cases.
- **Transfer learning early** — students get strong results fast with pretrained models, then learn what's underneath.
- **Always include a "break it" study** — understanding failure is the learning objective, not an afterthought.

---

## Module 4.1 — Images as Data
**Why this module matters:** you can't model images well until you understand pixels and convolution.

### L4.1.1 — Pixels, channels, color spaces
- **Objective:** represent an image numerically.
- **Concepts:** pixels, RGB channels, image tensors (C×H×W).
- **Hands-on:** load an image, inspect/modify pixel values.
- **Pitfall:** channel-order confusion (RGB vs BGR).

### L4.1.2 — Image filters & convolution (by hand)
- **Objective:** understand convolution visually.
- **Concepts:** kernels, edge detection, blurring.
- **Hands-on:** apply hand-coded filters (Sobel, blur) to an image.
- **Pitfall:** thinking convolution is mysterious — it's a sliding dot product.

### L4.1.3 — Why fully-connected nets fail on images
- **Objective:** motivate CNNs.
- **Concepts:** parameter explosion, no spatial structure, no translation invariance.
- **Hands-on:** count parameters of an FC net on a real image size.
- **Pitfall:** flattening images and losing spatial info.

---

## Module 4.2 — Convolutional Neural Networks
**Why this module matters:** CNNs are the workhorse of vision.

### L4.2.1 — The convolution layer
- **Objective:** learn filters instead of hand-coding them.
- **Concepts:** learnable kernels, feature maps, channels.
- **Hands-on:** add a conv layer; inspect output shape.
- **Pitfall:** miscomputing output dimensions.

### L4.2.2 — Pooling & stride
- **Objective:** downsample and gain invariance.
- **Concepts:** max/avg pooling, stride, padding.
- **Hands-on:** add pooling; track spatial size shrinking.
- **Pitfall:** losing too much resolution too fast.

### L4.2.3 — Building a CNN in PyTorch
- **Objective:** assemble a full image classifier.
- **Concepts:** conv → activation → pool → FC head.
- **Hands-on:** train a CNN on CIFAR-10.
- **Pitfall:** wrong flatten size into the FC layer.

### L4.2.4 — Visualizing what filters learn
- **Objective:** see the learned features.
- **Concepts:** feature maps, filter visualization.
- **Hands-on:** render early vs deep layer activations.
- **Pitfall:** assuming filters are uninterpretable.

---

## Module 4.3 — Real Architectures & Techniques
**Why this module matters:** the methods that make vision actually work in practice.

### L4.3.1 — Classic architectures
- **Objective:** know the lineage.
- **Concepts:** LeNet → AlexNet → VGG → ResNet.
- **Hands-on:** compare depths and parameter counts.
- **Pitfall:** thinking deeper is always better (without residuals).

### L4.3.2 — Residual connections
- **Objective:** understand why very deep nets became trainable.
- **Concepts:** skip connections, identity mapping.
- **Hands-on:** add a residual block; compare training.
- **Pitfall:** ignoring why plain deep nets degrade.

### L4.3.3 — Transfer learning & fine-tuning
- **Objective:** stand on giants' shoulders.
- **Concepts:** pretrained backbones, freezing layers, fine-tuning.
- **Hands-on:** fine-tune ResNet on a small custom dataset; beat from-scratch.
- **Pitfall:** fine-tuning with too-high a learning rate (catastrophic forgetting).

### L4.3.4 — Data augmentation
- **Objective:** expand data without collecting more.
- **Concepts:** flips, crops, color jitter, when NOT to augment.
- **Hands-on:** add augmentation; measure the accuracy lift.
- **Pitfall:** augmentations that change the label (e.g., flipping a "6").

### L4.3.5 — Detection & segmentation (overview)
- **Objective:** see beyond classification.
- **Concepts:** object detection (YOLO idea), semantic segmentation.
- **Hands-on:** run a pretrained detector on your own image.
- **Pitfall:** confusing detection with classification.

---

## Module 4.4 — Robustness
**Why this module matters:** vision models fail in surprising ways; knowing how is the mark of real understanding.

### L4.4.1 — When vision models fail
- **Objective:** recognize distribution shift.
- **Concepts:** train/test mismatch, spurious features.
- **Hands-on:** test a model on out-of-distribution images.
- **Pitfall:** trusting high accuracy on a narrow test set.

### L4.4.2 — Adversarial examples (intro)
- **Objective:** see how tiny changes fool models.
- **Concepts:** adversarial perturbations.
- **Hands-on:** perturb an image to flip the prediction.
- **Pitfall:** assuming models "see" like humans.

---

## Project
- **P4 — Image Classifier + Break-It Study:** classify a real dataset using transfer learning, then produce a "break it" analysis — find inputs where the model fails and explain *why* (shift, spurious feature, or adversarial). Deliverable: notebook + failure-case writeup.

## Mastery Check (must pass to unlock further specialization)
| Skill | Pass bar |
|-------|----------|
| Explain | Describe convolution to a non-expert |
| Build | Fine-tune a pretrained model and beat from-scratch |
| Diagnose | Explain a specific misclassification's cause |

## Tools & Environment
- PyTorch + torchvision, GPU notebooks. CIFAR-10 / small custom datasets preloaded.

## Unlocks
→ **Level 6 — Capstone** (or continue to **Level 5 — NLP & LLMs**)

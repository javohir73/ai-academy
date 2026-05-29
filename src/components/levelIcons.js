/*
 * Maps each level id to a Lucide icon that represents its concept. Keeping
 * this here (rather than in the data files) lets the data stay plain, and
 * makes it obvious where to add an icon when you add a level.
 */
import {
  // Foundations track
  // (Database is reused below for the "What is data?" foundations lesson.)
  // Beginner track
  Sparkles, // What AI is
  Brain, // Machine learning
  Database, // Training data / What is data?
  Tags, // Features & labels
  Layers, // Classification
  TrendingUp, // Prediction
  Scale, // Bias
  Target, // Overfitting
  Network, // Neural networks
  ShieldCheck, // Ethics
  // Hands-on code (Pyodide) lessons
  Code2, // First classifier
  GitBranch, // Metrics & overfitting
  Route, // BFS maze search
  // Intermediate track (AI model evaluation)
  ClipboardCheck, // What is evaluation
  ListChecks, // Rubrics
  Gauge, // Rating
  GitCompareArrows, // Ranking
  ScanSearch, // Hallucination detection
  HeartHandshake, // Helpful/Honest/Harmless
  PenLine, // Rewrite
  Award, // Capstone
  BookOpen, // fallback
} from 'lucide-react'

export const LEVEL_ICONS = {
  // Foundations
  'what-is-data': Database,
  // Beginner
  'what-ai': Sparkles,
  'what-ml': Brain,
  'training-data': Database,
  'features-labels': Tags,
  classification: Layers,
  prediction: TrendingUp,
  bias: Scale,
  overfitting: Target,
  'neural-networks': Network,
  'ai-ethics': ShieldCheck,
  // Hands-on code (Pyodide)
  'code-first-classifier': Code2,
  'code-metrics-overfitting': GitBranch,
  'code-bfs-maze': Route,
  // Intermediate
  'eval-intro': ClipboardCheck,
  'eval-rubrics': ListChecks,
  'eval-rating': Gauge,
  'eval-ranking': GitCompareArrows,
  'eval-hallucination': ScanSearch,
  'eval-hhh': HeartHandshake,
  'eval-rewrite': PenLine,
  'eval-capstone': Award,
}

/** Resolve a level's icon component, with a safe fallback. */
export function iconForLevel(id) {
  return LEVEL_ICONS[id] || BookOpen
}

/*
 * Activity registry — maps an activity `type` (from the data files) to the
 * React component that renders that interactive challenge.
 *
 * To add a new kind of activity:
 *   1. Create a component here that accepts ({ data, onResult }) and calls
 *      onResult({ correct: boolean }) when the learner submits.
 *   2. Add it to this map under a new `type` key.
 *   3. Reference that `type` in a level's `activity.type`.
 */
// Beginner track
import SortGame from './SortGame.jsx'
import PipelineGame from './PipelineGame.jsx'
import PickDatasetGame from './PickDatasetGame.jsx'
import MatchGame from './MatchGame.jsx'
import ClassifyGame from './ClassifyGame.jsx'
import PredictGame from './PredictGame.jsx'
import BiasGridGame from './BiasGridGame.jsx'
import OverfitCompareGame from './OverfitCompareGame.jsx'
import NeuralGame from './NeuralGame.jsx'
import EthicsGame from './EthicsGame.jsx'
// Intermediate track (AI model evaluation)
import ReviewQueueGame from './ReviewQueueGame.jsx'
import RateResponseGame from './RateResponseGame.jsx'
import CompareAnswersGame from './CompareAnswersGame.jsx'
import HighlightErrorGame from './HighlightErrorGame.jsx'
import LabelIssuesGame from './LabelIssuesGame.jsx'
import RewriteGame from './RewriteGame.jsx'
import CapstoneGame from './CapstoneGame.jsx'
import NotebookGame from './NotebookGame.jsx'

export const ACTIVITIES = {
  // Beginner
  sort: SortGame,
  pipeline: PipelineGame,
  'pick-dataset': PickDatasetGame,
  match: MatchGame,
  classify: ClassifyGame,
  predict: PredictGame,
  'bias-grid': BiasGridGame,
  'overfit-compare': OverfitCompareGame,
  neural: NeuralGame,
  ethics: EthicsGame,
  // Intermediate
  'review-queue': ReviewQueueGame,
  rate: RateResponseGame,
  compare: CompareAnswersGame,
  highlight: HighlightErrorGame,
  'label-issues': LabelIssuesGame,
  rewrite: RewriteGame,
  capstone: CapstoneGame,
  // Hands-on code (Pyodide)
  notebook: NotebookGame,
}

/* Single source of AI/ML terminology (Latin Uzbek). First mention of a hard
   term uses the bilingual form, e.g. bilingual('features') → "features (belgilar)".
   Used by chrome now (Phase A) and lesson content later (Phases B/C). */

export const GLOSSARY = {
  features: { en: 'features', uz: 'belgilar' },
  labels: { en: 'labels', uz: 'javoblar' },
  'training data': { en: 'training data', uz: 'o‘quv ma’lumotlari' },
  dataset: { en: 'dataset', uz: 'ma’lumotlar to‘plami' },
  model: { en: 'model', uz: 'model' },
  data: { en: 'data', uz: 'ma’lumot' },
  prediction: { en: 'prediction', uz: 'bashorat' },
  classification: { en: 'classification', uz: 'klassifikatsiya' },
  bias: { en: 'bias', uz: 'noxolislik (bias)' },
  overfitting: { en: 'overfitting', uz: 'ortiqcha moslashuv (overfitting)' },
  'neural network': { en: 'neural network', uz: 'neyron tarmoq' },
}

/** "features (belgilar)". Unknown terms return unchanged. */
export function bilingual(term) {
  const pair = GLOSSARY[term]
  return pair ? `${pair.en} (${pair.uz})` : term
}

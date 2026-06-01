/* Deep per-field overlay of a Uzbek lesson-body patch onto the English lesson.
   English is the fallback for every missing field. Never mutates input.
   Activity `data` user-facing text is overlaid by the item's stable id; all
   logic fields (id, bucket, type, correctId, best, duration, isCorrect) are
   preserved untouched. */

const str = (v) => typeof v === 'string' && v.length > 0

function overlayStrings(base, patch, fields) {
  if (!base || !patch) return base
  let out = base
  for (const f of fields) {
    if (str(patch[f]) && patch[f] !== base[f]) {
      if (out === base) out = { ...base }
      out[f] = patch[f]
    }
  }
  return out
}

function overlayArray(baseArr, patchArr) {
  if (!Array.isArray(baseArr) || !Array.isArray(patchArr)) return baseArr
  let changed = false
  const out = baseArr.map((el, i) => {
    if (str(patchArr[i]) && patchArr[i] !== el) {
      changed = true
      return patchArr[i]
    }
    return el
  })
  return changed ? out : baseArr
}

function overlayByIdLabel(items, patchMap, labelField) {
  if (!Array.isArray(items) || !patchMap) return items
  let changed = false
  const out = items.map((it) => {
    const v = patchMap[it.id]
    if (str(v) && v !== it[labelField]) {
      changed = true
      return { ...it, [labelField]: v }
    }
    return it
  })
  return changed ? out : items
}

function localizeActivityData(data, patch) {
  if (!data || !patch) return data
  let out = data
  const set = (key, val) => {
    if (val !== data[key]) {
      if (out === data) out = { ...data }
      out[key] = val
    }
  }
  if (data.buckets && patch.buckets) set('buckets', overlayByIdLabel(data.buckets, patch.buckets, 'label'))
  if (data.tokens && patch.tokens) set('tokens', overlayByIdLabel(data.tokens, patch.tokens, 'label'))
  if (data.options && patch.options) {
    const opts = data.options.map((o) => overlayStrings(o, patch.options[o.id], ['title', 'sample', 'why', 'label', 'text']))
    if (opts.some((o, i) => o !== data.options[i])) set('options', opts)
  }
  if (data.scenarios && patch.scenarios) {
    const scn = data.scenarios.map((s) => {
      const sp = patch.scenarios[s.id]
      if (!sp) return s
      let so = overlayStrings(s, sp, ['situation'])
      if (s.options && sp.options) {
        const o2 = s.options.map((o) => overlayStrings(o, sp.options[o.id], ['text', 'why']))
        if (o2.some((o, i) => o !== s.options[i])) {
          if (so === s) so = { ...s }
          so.options = o2
        }
      }
      return so
    })
    if (scn.some((s, i) => s !== data.scenarios[i])) set('scenarios', scn)
  }
  return out
}

function localizeActivity(activity, patch) {
  if (!activity || !patch) return activity
  let out = overlayStrings(activity, patch, ['prompt'])
  if (activity.feedback && patch.feedback) {
    const fb = overlayStrings(activity.feedback, patch.feedback, ['correct', 'incorrect'])
    if (fb !== activity.feedback) { if (out === activity) out = { ...activity }; out.feedback = fb }
  }
  if (activity.data && patch.data) {
    const d = localizeActivityData(activity.data, patch.data)
    if (d !== activity.data) { if (out === activity) out = { ...activity }; out.data = d }
  }
  return out
}

const BAGS = {
  example: ['text'],
  goDeeper: ['title', 'body'],
  video: ['title', 'description'],
}

/**
 * @param {object} level  English lesson object
 * @param {object|null} patch  uz overlay (title/concept/body fields), or null
 * @returns {object} new lesson with uz overlaid, English fallback per field
 */
export function localizeLesson(level, patch) {
  if (!level || !patch) return level
  let out = overlayStrings(level, patch, ['title', 'concept', 'explanation'])
  const clone = () => { if (out === level) out = { ...level } }

  for (const [key, fields] of Object.entries(BAGS)) {
    if (level[key] && patch[key]) {
      const merged = overlayStrings(level[key], patch[key], fields)
      if (merged !== level[key]) { clone(); out[key] = merged }
    }
  }

  if (level.workedExample && patch.workedExample) {
    let we = overlayStrings(level.workedExample, patch.workedExample, ['intro', 'takeaway'])
    const steps = overlayArray(level.workedExample.steps, patch.workedExample.steps)
    if (steps !== level.workedExample.steps) { if (we === level.workedExample) we = { ...level.workedExample }; we.steps = steps }
    if (we !== level.workedExample) { clone(); out.workedExample = we }
  }

  if (level.guided && patch.guided) {
    let g = overlayStrings(level.guided, patch.guided, ['prompt', 'answer', 'explanation'])
    const hints = overlayArray(level.guided.hints, patch.guided.hints)
    if (hints !== level.guided.hints) { if (g === level.guided) g = { ...level.guided }; g.hints = hints }
    if (g !== level.guided) { clone(); out.guided = g }
  }

  if (level.activity && patch.activity) {
    const a = localizeActivity(level.activity, patch.activity)
    if (a !== level.activity) { clone(); out.activity = a }
  }

  return out
}

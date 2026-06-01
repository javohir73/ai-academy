import { describe, it, expect } from 'vitest'
import { localizeTracks } from './localizeTracks.js'

const TRACKS = [
  {
    id: 'level-0', tag: 'Level 0', title: 'Foundations', blurb: 'The on-ramp.',
    levels: [{ id: 'what-is-data', title: 'What Is Data?', concept: 'Rows and columns' }],
  },
  {
    id: 'level-3', tag: 'Level 3', title: 'Search', blurb: 'BFS.',
    comingSoon: 'More soon.',
    levels: [{ id: 'code-bfs-maze', title: 'Maze', concept: 'BFS path', kind: 'code' }],
  },
]

const UZ = {
  tracks: {
    'level-0': { tag: 'Daraja 0', title: 'Asoslar', blurb: 'Boshlanish.' },
  },
  lessons: {
    'what-is-data': { title: 'Ma’lumot nima?', concept: 'Satrlar va ustunlar' },
  },
}

describe('localizeTracks', () => {
  it('returns English unchanged for locale en', () => {
    const out = localizeTracks(TRACKS, 'en', UZ)
    expect(out[0].title).toBe('Foundations')
    expect(out[0].levels[0].title).toBe('What Is Data?')
  })

  it('overlays uz fields when locale is uz', () => {
    const out = localizeTracks(TRACKS, 'uz', UZ)
    expect(out[0].tag).toBe('Daraja 0')
    expect(out[0].title).toBe('Asoslar')
    expect(out[0].blurb).toBe('Boshlanish.')
    expect(out[0].levels[0].title).toBe('Ma’lumot nima?')
    expect(out[0].levels[0].concept).toBe('Satrlar va ustunlar')
  })

  it('falls back to English per-field when a uz entry/field is missing', () => {
    const out = localizeTracks(TRACKS, 'uz', UZ)
    expect(out[1].title).toBe('Search')
    expect(out[1].comingSoon).toBe('More soon.')
    expect(out[1].levels[0].title).toBe('Maze')
  })

  it('preserves non-translated fields (id, kind, levels structure)', () => {
    const out = localizeTracks(TRACKS, 'uz', UZ)
    expect(out[0].id).toBe('level-0')
    expect(out[1].levels[0].id).toBe('code-bfs-maze')
    expect(out[1].levels[0].kind).toBe('code')
    expect(out[0].levels).toHaveLength(1)
  })

  it('does not mutate the input tracks', () => {
    const snapshot = JSON.stringify(TRACKS)
    localizeTracks(TRACKS, 'uz', UZ)
    expect(JSON.stringify(TRACKS)).toBe(snapshot)
  })
})

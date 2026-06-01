/* Uzbek (Latin) translations for curriculum METADATA only — lesson/track titles,
   lesson concepts, track blurbs + comingSoon. Keyed by STABLE ids. Lesson BODY
   content (explanation/example/workedExample/guided/goDeeper/activities) is NOT
   here — that is Phase C. English is the fallback for anything missing. */

export const TRACKS_UZ = {
  'level-0': {
    tag: 'Daraja 0',
    title: 'Asoslar',
    blurb: 'Kirish nuqtasi: ma’lumot nima va nega yaxshi misollar har qanday modeldan oldin keladi. Avval tushuncha, kod talab qilinmaydi.',
  },
}

export const LESSONS_UZ = {
  'what-is-data': {
    title: 'Ma’lumot nima?',
    concept: 'Satrlar, ustunlar va nega modellarga misollar kerak',
  },
}

/** Combined map shape consumed by localizeTracks(tracks, locale, CURRICULUM_UZ). */
export const CURRICULUM_UZ = { tracks: TRACKS_UZ, lessons: LESSONS_UZ }

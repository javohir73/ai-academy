/* Uzbek (Latin) translations for curriculum METADATA only — lesson/track titles,
   lesson concepts, track blurbs + comingSoon. Keyed by STABLE ids. Lesson BODY
   content (explanation/example/workedExample/guided/goDeeper/activities) is NOT
   here — that is Phase C. English is the fallback for anything missing.

   Conventions: natural Latin Uzbek (no Cyrillic), U+2019 (’) for the o’/g’
   modifier and apostrophes. AI/ML terms follow src/i18n/glossary.js. Technical
   tokens (CNN, PyTorch, ResNet, CIFAR-10, GPU, RGB, LLM, …) are kept as-is. */

export const TRACKS_UZ = {
  'level-0': {
    tag: 'Daraja 0',
    title: 'Asoslar',
    blurb:
      'Kirish nuqtasi: ma’lumot nima va nega yaxshi misollar har qanday modeldan oldin keladi. Avval tushuncha, kod talab qilinmaydi.',
  },
  'level-1': {
    tag: 'Daraja 1',
    title: 'Sun’iy intellekt asoslari',
    blurb:
      'Sun’iy intellekt nima, u qanday quriladi va undan qanday qilib mas’uliyat bilan foydalanish kerak — qolgan kurs tayanadigan tushunchalar xaritasi.',
  },
  'level-2': {
    tag: 'Daraja 2',
    title: 'Mashinaviy o’qitishga kirish',
    blurb:
      'Mashinalar ma’lumotdan qanday qonuniyatlarni o’rganadi: o’quv ma’lumotlari, belgilar va javoblar, klassifikatsiya, bashorat, noxolislik (bias), ortiqcha moslashuv (overfitting) — so’ng Python’da birinchi haqiqiy modellaringiz.',
  },
  'level-3': {
    tag: 'Daraja 3',
    title: 'Muammolarni yechish va qidiruv',
    blurb:
      'Agent maqsadga kodda qanday yetadi: kenglik bo’yicha qidiruv (BFS) labirintdan eng qisqa yo’lni topadi — aqlliroq algoritmlar (Dijkstra, A*) shu asosga quriladi.',
    comingSoon: 'Daraja 3’ning yana darslari (neyron tarmoqlar) ishlab chiqilmoqda.',
  },
  'level-4': {
    tag: 'Daraja 4',
    title: 'Kompyuter ko’rishi',
    blurb:
      'Tasvirlarga qaratilgan chuqur o’qitish — va siz model nimani o’rganishini ko’ra olasiz. Piksellar va konvolyutsiyani o’rganing, CNN quring, transfer learning’dan foydalaning, so’ng ko’rish modellari qanday xato qilishini “buzib ko’rish” tadqiqotida sinab ko’ring. Og’ir o’qitish bepul GPU daftarlarida (Colab/Kaggle) bajariladi.',
  },
  'level-5': {
    tag: 'Daraja 5',
    title: 'Amaliyotda LLM’lar — Baholash va mas’uliyatli AI',
    blurb:
      'Haqiqiy AI model baholovchisi kabi mashq qiling: javoblarni baholang, saralang, gallyutsinatsiyalarni aniqlang va zaif javoblarni mezon (rubrika) asosida yaxshilang.',
  },
}

export const LESSONS_UZ = {
  'what-is-data': {
    title: 'Ma’lumot nima?',
    concept: 'Satrlar, ustunlar va nega modellarga misollar kerak',
  },
  'what-ai': {
    title: 'Sun’iy intellekt nima?',
    concept: 'Aqlli vazifalarni bajaradigan mashinalar',
  },
  'ai-ethics': {
    title: 'Hayotdagi AI etikasi',
    concept: 'AI’dan mas’uliyat bilan foydalanish',
  },
  'what-ml': {
    title: 'Mashinaviy o’qitish nima?',
    concept: 'Misollardan qonuniyatlarni o’rganish',
  },
  'training-data': {
    title: 'O’quv ma’lumotlari',
    concept: 'Model o’rganadigan misollar',
  },
  'features-labels': {
    title: 'Belgilar va javoblar',
    concept: 'Kirishlar (belgilar) va chiqishlar (javoblar)',
  },
  classification: {
    title: 'Klassifikatsiya',
    concept: 'Narsalarni guruhlarga ajratish',
  },
  prediction: {
    title: 'Bashorat',
    concept: 'Yangi kirish uchun javobni taxmin qilish',
  },
  bias: {
    title: 'Ma’lumotdagi noxolislik',
    concept: 'Ma’lumot to’liq vakil bo’lmaganda',
  },
  overfitting: {
    title: 'Ortiqcha moslashuv (overfitting)',
    concept: 'Umumlashtirish o’rniga yodlab olish',
  },
  'neural-networks': {
    title: 'Neyron tarmoqlar',
    concept: 'O’zaro bog’langan tugunlar qatlamlari',
  },
  'code-first-classifier': {
    title: 'Birinchi klassifikatoringizni o’qiting',
    concept: 'Modelni moslang va aniqligini o’lchang — haqiqiy Python’da',
  },
  'code-metrics-overfitting': {
    title: 'Metrikalar bilan overfitting’ni aniqlang',
    concept: 'Yodlab olgan modelni ushlash uchun train va test aniqligini solishtiring',
  },
  'code-bfs-maze': {
    title: 'Labirintni qidiruv bilan yeching',
    concept: 'Kenglik bo’yicha qidiruv (BFS) bilan eng qisqa yo’lni toping — sof Python',
  },
  'cv-pixels': {
    title: 'Tasvirlar — shunchaki sonlar to’ri',
    concept: 'Piksellar, kanallar va C×H×W shakli (hamda RGB-va-BGR tuzog’i)',
  },
  'cv-conv-by-hand': {
    title: 'Qo’lda konvolyutsiya: filtrni sirpantirish',
    concept: 'Yadrolar (kernel) va sirpanuvchi skalyar ko’paytma (chekka / xiralashtirish / o’tkirlashtirish)',
  },
  'cv-why-fc-fails': {
    title: 'Nega oddiy tarmoqlar tasvirlarda qiynaladi',
    concept: 'Parametrlar portlashi, fazoviy tuzilma yo’qligi, siljishga nisbatan invariantlik yo’qligi',
  },
  'cv-conv-layer': {
    title: 'Konvolyutsiya qatlami',
    concept: 'O’rganiladigan yadrolar tasvir bo’ylab sirpanib, belgilar xaritasini hosil qiladi',
  },
  'cv-pooling': {
    title: 'Pooling va qadam (stride)',
    concept: 'Belgilar xaritasini ataylab kichraytiring — signalni saqlang, o’lchamni kamaytiring',
  },
  'cv-build-cnn': {
    title: 'PyTorch’da CNN quring (CIFAR-10)',
    concept: 'Kichik konvolyutsion tarmoqni haqiqiy tasvirlarda, bepul GPU’da o’qiting',
  },
  'cv-feature-maps': {
    title: 'Filtrlar nimani o’rganishini vizuallashtirish',
    concept: 'Dastlabki qatlamlar chekka va ranglarni, chuqur qatlamlar qism va obyektlarni ko’radi',
  },
  'cv-architectures': {
    title: 'Klassik CNN arxitekturalari',
    concept: 'LeNet’dan ResNet’gacha — va nega chuqurroq har doim ham yaxshi emas',
  },
  'cv-residual': {
    title: 'Residual (qisqartma) bog’lanishlar',
    concept: 'Nega kichkina qisqartma juda chuqur tarmoqlarni o’qitishni mumkin qildi',
  },
  'cv-transfer': {
    title: 'Transfer learning va fine-tuning',
    concept: 'Oldindan o’qitilgan asosni qayta ishlating — uni muzlating yoki ehtiyotkorlik bilan sozlang',
  },
  'cv-augmentation': {
    title: 'Ma’lumotni kengaytirish (augmentation)',
    concept: 'Ma’lumotlar to’plamini o’zgartirishlar bilan kengaytiring — lekin javobni hech qachon o’zgartirmang',
  },
  'cv-detect-segment': {
    title: 'Aniqlash va segmentatsiyaga umumiy nazar',
    concept: 'Klassifikatsiya, aniqlash va segmentatsiya — turli savollar, turli natijalar',
  },
  'cv-failures': {
    title: 'Ko’rish modellari qachon xato qiladi',
    concept: 'Taqsimot siljishi, soxta belgilar va to’silish (okklyuziya)',
  },
  'cv-adversarial': {
    title: 'Adversarial misollar: kichik o’zgarish, katta yolg’on',
    concept: 'Sezilmas o’zgarishlar ishonchli bashoratni teskari o’zgartirishi mumkin',
  },
  'cv-project': {
    title: 'Loyiha P4: tasvir klassifikatori + “buzib ko’rish” tadqiqoti',
    concept: 'Bepul GPU’da haqiqiy klassifikator o’qiting, so’ng uni ataylab buzing',
  },
  'eval-intro': {
    title: 'AI model baholash nima?',
    concept: 'Nega AI natijasiga inson nazorati kerak',
  },
  'eval-rubrics': {
    title: 'Baholash mezonlari (rubrikalar)',
    concept: 'Aniq mezonlar bilan baholash',
  },
  'eval-rating': {
    title: 'AI javoblarini baholash',
    concept: 'Javoblarni 1 dan 5 gacha baholash',
  },
  'eval-ranking': {
    title: 'Ikki AI javobini saralash',
    concept: 'Yaxshiroq javobni tanlash',
  },
  'eval-hallucination': {
    title: 'Gallyutsinatsiyani aniqlash',
    concept: 'Ishonchli, lekin yolg’on da’volarni ilg’ash',
  },
  'eval-hhh': {
    title: 'Foydali, halol va zararsiz',
    concept: 'Foydalilik, haqiqat va xavfsizlik o’rtasidagi muvozanat',
  },
  'eval-rewrite': {
    title: '5/5 ga qayta yozish',
    concept: 'Zaif javobni kuchli javobga aylantirish',
  },
  'eval-capstone': {
    title: 'Yakuniy loyiha: AI model baholovchisiga aylaning',
    concept: 'To’liq baholash to’plami',
  },
}

/** Combined map shape consumed by localizeTracks(tracks, locale, CURRICULUM_UZ). */
export const CURRICULUM_UZ = { tracks: TRACKS_UZ, lessons: LESSONS_UZ }

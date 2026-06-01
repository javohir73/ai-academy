// src/i18n/strings.js
/* Central UI-chrome catalog. Flat dotted keys. English is the fallback.
   Phase A = chrome only (NO lesson/activity body content, NO track/lesson titles).
   Keep en and uz key sets identical (enforced by strings.test.js). */

export const UI = {
  en: {
    // language picker / switcher
    'lang.modal.title': 'Choose your language',
    'lang.modal.subtitle': 'You can change this anytime from the top bar.',
    'lang.en': 'English',
    'lang.uz': 'O’zbekcha',
    'lang.switch.label': 'Language',
    'lang.note.contentEnglish': 'Lessons are currently shown in English.',

    // top bar / nav
    'nav.dashboard': 'Dashboard',
    'nav.overview': 'Course overview',
    'nav.brand': 'AI Academy',
    'nav.openMenu': 'Open course menu',
    'nav.closeMenu': 'Close menu',
    'nav.home': 'Go to AI Academy home',

    // home page chrome (nav + hero CTAs)
    'home.nav.aria': 'Home',
    'home.nav.curriculum': 'Curriculum',
    'home.cta.start': 'Start learning',
    'home.cta.explore': 'Explore curriculum',

    // sidebar
    'side.overallProgress': 'Overall progress',
    'side.streak.suffix': 'streak',
    'side.streak.keep': '— finish a lesson to keep it',
    'side.unlocksAfter': 'Unlocks after',

    // course overview page chrome
    'overview.eyebrow': 'Self-paced course',
    'overview.title': 'Learn AI & Machine Learning by doing',
    'overview.lead.pre': 'A hands-on course of ',
    'overview.lead.post': ' interactive lessons — from the fundamentals of AI, through how machine learning works (with real Python you run in the browser), to evaluating AI models responsibly. Each lesson pairs a plain-English idea with something you actually do.',
    'overview.curriculumNote.pre': 'Levels 0 through 5 of the AI Academy curriculum — foundations, machine learning, search, computer vision, and AI evaluation. Code lessons (badged',
    'overview.curriculumNote.post': ') start at Level 2.',
    'overview.cta.review': 'Review from the start',
    'overview.cta.continue': 'Continue learning',
    'overview.cta.start': 'Start the course',
    'overview.unlock.pre': 'Complete ',
    'overview.unlock.post': ' to unlock these lessons',
    'overview.aria.locked': 'Locked — complete the previous lesson to unlock.',
    'overview.aria.completedPre': 'Completed, ',
    'overview.aria.completedPost': ' of 3 stars.',
    'overview.aria.open': 'Open lesson.',

    // dashboard chrome
    'dash.eyebrow': 'Your dashboard',
    'dash.welcome.back': 'Welcome back',
    'dash.welcome.new': 'Welcome to AI Academy',
    'dash.sub.progressPre': 'You’ve completed ',
    'dash.sub.progressMid': ' of ',
    'dash.sub.progressPost': ' lessons — keep the momentum going.',
    'dash.sub.new': 'Your learning home. Start the first lesson and your progress will appear here.',
    'dash.lessons': 'lessons',
    'dash.continue.start': 'Start learning',
    'dash.continue.continue': 'Continue learning',
    'dash.continue.startShort': 'Start',
    'dash.continue.continueShort': 'Continue',
    'dash.complete.eyebrow': 'Course complete',
    'dash.complete.title': 'You’ve finished every lesson — incredible work.',
    'dash.complete.meta': 'Revisit any level below to sharpen low-star topics.',
    'dash.stats.aria': 'Your stats',
    'dash.stat.of': 'of ',
    'dash.stat.lessonsCompleted': 'Lessons completed',
    'dash.stat.starsEarned': 'Stars earned (XP)',
    'dash.stat.currentStreak': 'Current streak',
    'dash.stat.longestStreak': 'Longest streak',
    'dash.stat.activeToday': 'active today',
    'dash.stat.keepAlive': 'keep it alive',
    'dash.stat.startToday': 'start today',
    'dash.stat.day': 'day',
    'dash.stat.days': 'days',
    'dash.recommended.aria': 'Recommended next lesson',
    'dash.recommended.title': 'Recommended next',
    'dash.recommended.empty': 'Nothing left to recommend — you’ve completed the course. 🎓',
    'dash.review.aria': 'Topics to review',
    'dash.review.title': 'Topics to review',
    'dash.review.emptyDone': 'No weak spots yet — every completed lesson is 3 stars. Nice.',
    'dash.review.emptyNew': 'As you complete lessons, any that score below 3 stars show up here to revisit.',
    'dash.recent.aria': 'Recently completed',
    'dash.recent.title': 'Recently completed',
    'dash.path.aria': 'Level progress',
    'dash.path.title': 'Your path',
    'dash.path.fullOverview': 'Full course overview',
    'dash.foot.home': 'Back to home',
    'dash.foot.browse': 'Browse all lessons',
    'dash.level.ariaLocked': 'Locked — finish the previous level to unlock.',
    'dash.level.ariaProgressMid': ' of ',
    'dash.level.ariaProgressPost': ' lessons done.',
    'dash.account.deviceTitle': 'Progress is saved on this device',
    'dash.account.signinTitle': 'Sign in to sync across devices',
    'dash.account.synced': 'Synced to your account',
    'dash.account.syncError': 'Sync error — saved locally',
    'dash.account.signedIn': 'Signed in',

    // lesson chrome (LevelView)
    'lesson.crumb': 'Lesson',
    'lesson.of': 'of',
    'lesson.back': 'Course overview',
    'lesson.phase.learn.doing': 'I do',
    'lesson.phase.learn.title': 'Learn',
    'lesson.phase.guided.doing': 'We do',
    'lesson.phase.guided.title': 'Practice together',
    'lesson.phase.practice.doing': 'You do',
    'lesson.phase.practice.title': 'Mastery check',
    'lesson.section.concept': 'Concept',
    'lesson.section.watch': 'Watch',
    'lesson.section.everyday': 'Everyday example',
    'lesson.section.worked': 'Worked example',
    'lesson.guided.lead': "Let's work through one step by step. Reach for a hint whenever you're stuck.",
    'lesson.cta.guided': 'Practice it together',
    'lesson.cta.practice': 'Try the challenge yourself',

    // generic activity-shell chrome (NOT per-activity body)
    'act.check': 'Check answers',

    // auth modal
    'auth.title.signin': 'Welcome back',
    'auth.title.signup': 'Create your free account',
    'auth.title.reset': 'Reset your password',
    'auth.sub.signin': 'Sign in to sync your progress across devices.',
    'auth.sub.signup': 'Save your stars, streak, and progress to the cloud.',
    'auth.sub.reset': 'We’ll email you a secure link to set a new password.',
    'auth.field.email': 'Email',
    'auth.field.password': 'Password',
    'auth.placeholder.email': 'you@example.com',
    'auth.placeholder.password': 'At least 6 characters',
    'auth.btn.signin': 'Sign in',
    'auth.btn.signup': 'Create account',
    'auth.btn.reset': 'Send reset link',
    'auth.btn.working': 'Working…',
    'auth.switch.create': 'Create an account',
    'auth.switch.forgot': 'Forgot password?',
    'auth.switch.haveAccount': 'Already have an account? Sign in',
    'auth.switch.backToSignin': 'Back to sign in',
    'auth.close': 'Close',
    'auth.notice.reset': 'Check your email for a password-reset link.',
    'auth.notice.signup': 'Account created. If email confirmation is on, check your inbox — then sign in.',
    'auth.error.exists': 'That email already has an account — try signing in instead.',
    'auth.error.invalid': 'Email or password looks incorrect. Please try again.',
    'auth.error.password': 'Password must be at least 6 characters.',
    'auth.error.notConfigured': 'Accounts aren’t set up on this deployment yet. Your progress is still saved on this device.',
    'auth.error.email': 'Please enter a valid email address.',
    'auth.error.generic': 'Something went wrong. Please try again.',

    // account menu + sync states
    'account.savedOnDevice': 'Saved on this device',
    'account.savedOnDevice.title': 'This deployment has no accounts; progress is saved in this browser.',
    'account.signin': 'Sign in',
    'account.menu': 'Account menu',
    'account.signout': 'Sign out',
    'account.fallback': 'Account',
    'sync.syncing': 'Syncing…',
    'sync.saved': 'Saved',
    'sync.error': 'Sync error',
    'sync.offline': 'Offline',
    'sync.idle': 'Synced',

    // account prompt
    'prompt.region': 'Save your progress',
    'prompt.dismiss': 'Dismiss',
    'prompt.title.prefix': 'Nice progress —',
    'prompt.title.suffix': 'lessons done!',
    'prompt.text': 'Create a free account to save your stars and streak to the cloud and pick up on any device.',
    'prompt.save': 'Save my progress',
    'prompt.notNow': 'Not now',
  },

  uz: {
    // language picker / switcher
    'lang.modal.title': 'Tilni tanlang',
    'lang.modal.subtitle': 'Buni istalgan vaqtda yuqori paneldan o’zgartirishingiz mumkin.',
    'lang.en': 'English',
    'lang.uz': 'O’zbekcha',
    'lang.switch.label': 'Til',
    'lang.note.contentEnglish': 'Darslar hozircha ingliz tilida ko’rsatiladi.',

    // top bar / nav
    'nav.dashboard': 'Boshqaruv paneli',
    'nav.overview': 'Kurs sharhi',
    'nav.brand': 'AI Academy',
    'nav.openMenu': 'Kurs menyusini ochish',
    'nav.closeMenu': 'Menyuni yopish',
    'nav.home': 'AI Academy bosh sahifasiga o’tish',

    // home page chrome (nav + hero CTAs)
    'home.nav.aria': 'Bosh sahifa',
    'home.nav.curriculum': 'Kurs dasturi',
    'home.cta.start': 'O’rganishni boshlash',
    'home.cta.explore': 'Kursni ko’rib chiqish',

    // sidebar
    'side.overallProgress': 'Umumiy progress',
    'side.streak.suffix': 'kunlik seriya',
    'side.streak.keep': '— uni saqlash uchun darsni yakunlang',
    'side.unlocksAfter': 'Quyidagidan keyin ochiladi:',

    // course overview page chrome
    'overview.eyebrow': 'Mustaqil o’rganish kursi',
    'overview.title': 'AI va mashinaviy o’qitishni amaliyot orqali o’rganing',
    'overview.lead.pre': 'Amaliy kurs — ',
    'overview.lead.post': ' ta interaktiv darsdan iborat: AI asoslaridan tortib, mashinaviy o’qitish qanday ishlashigacha (brauzerda haqiqiy Python ishga tushirib), AI modellarini mas’uliyatli baholashgacha. Har bir dars sodda tushuntirishni siz amalda bajaradigan narsa bilan birlashtiradi.',
    'overview.curriculumNote.pre': 'AI Academy dasturining 0 dan 5 gacha bo’lgan darajalari — asoslar, mashinaviy o’qitish, qidiruv, kompyuter ko’rishi va AI baholash. Kod darslari (',
    'overview.curriculumNote.post': ' bilan belgilangan) 2-darajadan boshlanadi.',
    'overview.cta.review': 'Boshidan ko’rib chiqish',
    'overview.cta.continue': 'O’rganishni davom ettirish',
    'overview.cta.start': 'Kursni boshlash',
    'overview.unlock.pre': 'Ushbu darslarni ochish uchun ',
    'overview.unlock.post': ' ni yakunlang',
    'overview.aria.locked': 'Qulflangan — ochish uchun oldingi darsni yakunlang.',
    'overview.aria.completedPre': 'Yakunlangan, 3 tadan ',
    'overview.aria.completedPost': ' ta yulduz.',
    'overview.aria.open': 'Darsni ochish.',

    // dashboard chrome
    'dash.eyebrow': 'Sizning boshqaruv panelingiz',
    'dash.welcome.back': 'Xush kelibsiz',
    'dash.welcome.new': 'AI Academy ga xush kelibsiz',
    'dash.sub.progressPre': 'Siz ',
    'dash.sub.progressMid': ' tadan ',
    'dash.sub.progressPost': ' ta darsni yakunladingiz — sur’atni saqlab qoling.',
    'dash.sub.new': 'Sizning o’qish maskaningiz. Birinchi darsni boshlang va progressingiz shu yerda paydo bo’ladi.',
    'dash.lessons': 'dars',
    'dash.continue.start': 'O’rganishni boshlash',
    'dash.continue.continue': 'O’rganishni davom ettirish',
    'dash.continue.startShort': 'Boshlash',
    'dash.continue.continueShort': 'Davom ettirish',
    'dash.complete.eyebrow': 'Kurs tugallandi',
    'dash.complete.title': 'Siz barcha darslarni yakunladingiz — ajoyib ish.',
    'dash.complete.meta': 'Kam yulduzli mavzularni mustahkamlash uchun quyidagi istalgan darajani qayta ko’ring.',
    'dash.stats.aria': 'Sizning statistikangiz',
    'dash.stat.of': 'jami ',
    'dash.stat.lessonsCompleted': 'Yakunlangan darslar',
    'dash.stat.starsEarned': 'To’plangan yulduzlar (XP)',
    'dash.stat.currentStreak': 'Joriy seriya',
    'dash.stat.longestStreak': 'Eng uzun seriya',
    'dash.stat.activeToday': 'bugun faol',
    'dash.stat.keepAlive': 'davom ettiring',
    'dash.stat.startToday': 'bugun boshlang',
    'dash.stat.day': 'kun',
    'dash.stat.days': 'kun',
    'dash.recommended.aria': 'Tavsiya etilgan keyingi dars',
    'dash.recommended.title': 'Keyingi tavsiya',
    'dash.recommended.empty': 'Tavsiya etiladigan narsa qolmadi — siz kursni yakunladingiz. 🎓',
    'dash.review.aria': 'Takrorlash uchun mavzular',
    'dash.review.title': 'Takrorlash uchun mavzular',
    'dash.review.emptyDone': 'Hozircha zaif joylar yo’q — har bir yakunlangan dars 3 yulduz. Zo’r.',
    'dash.review.emptyNew': 'Darslarni yakunlaganingizda, 3 yulduzdan kam baho olganlari bu yerda qayta ko’rish uchun ko’rinadi.',
    'dash.recent.aria': 'Yaqinda yakunlangan',
    'dash.recent.title': 'Yaqinda yakunlangan',
    'dash.path.aria': 'Daraja progressi',
    'dash.path.title': 'Sizning yo’lingiz',
    'dash.path.fullOverview': 'To’liq kurs sharhi',
    'dash.foot.home': 'Bosh sahifaga qaytish',
    'dash.foot.browse': 'Barcha darslarni ko’rish',
    'dash.level.ariaLocked': 'Qulflangan — ochish uchun oldingi darajani yakunlang.',
    'dash.level.ariaProgressMid': ' tadan ',
    'dash.level.ariaProgressPost': ' ta dars bajarildi.',
    'dash.account.deviceTitle': 'Progress shu qurilmada saqlanadi',
    'dash.account.signinTitle': 'Qurilmalar bo’ylab sinxronlash uchun kiring',
    'dash.account.synced': 'Hisobingizga sinxronlandi',
    'dash.account.syncError': 'Sinxronlash xatosi — mahalliy saqlandi',
    'dash.account.signedIn': 'Tizimga kirgan',

    // lesson chrome (LevelView)
    'lesson.crumb': 'Dars',
    'lesson.of': '/',
    'lesson.back': 'Kurs sharhi',
    'lesson.phase.learn.doing': 'Men qilaman',
    'lesson.phase.learn.title': 'O’rganish',
    'lesson.phase.guided.doing': 'Birga qilamiz',
    'lesson.phase.guided.title': 'Birga mashq qilamiz',
    'lesson.phase.practice.doing': 'Siz qilasiz',
    'lesson.phase.practice.title': 'Bilimni tekshirish',
    'lesson.section.concept': 'Tushuncha',
    'lesson.section.watch': 'Tomosha qiling',
    'lesson.section.everyday': 'Hayotiy misol',
    'lesson.section.worked': 'Ishlangan misol',
    'lesson.guided.lead': 'Keling, birgalikda bosqichma-bosqich ishlaymiz. Qachon qiynalsangiz, maslahatdan foydalaning.',
    'lesson.cta.guided': 'Birga mashq qilamiz',
    'lesson.cta.practice': 'Topshiriqni o’zingiz bajaring',

    // generic activity-shell chrome (NOT per-activity body)
    'act.check': 'Javoblarni tekshirish',

    // auth modal
    'auth.title.signin': 'Xush kelibsiz',
    'auth.title.signup': 'Bepul hisob yarating',
    'auth.title.reset': 'Parolni tiklash',
    'auth.sub.signin': 'Progressingizni qurilmalar bo’ylab sinxronlash uchun kiring.',
    'auth.sub.signup': 'Yulduzlar, seriya va progressingizni bulutga saqlang.',
    'auth.sub.reset': 'Yangi parol o’rnatish uchun sizga xavfsiz havola yuboramiz.',
    'auth.field.email': 'Email',
    'auth.field.password': 'Parol',
    'auth.placeholder.email': 'siz@misol.com',
    'auth.placeholder.password': 'Kamida 6 ta belgi',
    'auth.btn.signin': 'Kirish',
    'auth.btn.signup': 'Hisob yaratish',
    'auth.btn.reset': 'Tiklash havolasini yuborish',
    'auth.btn.working': 'Bajarilmoqda…',
    'auth.switch.create': 'Hisob yaratish',
    'auth.switch.forgot': 'Parolni unutdingizmi?',
    'auth.switch.haveAccount': 'Hisobingiz bormi? Kiring',
    'auth.switch.backToSignin': 'Kirishga qaytish',
    'auth.close': 'Yopish',
    'auth.notice.reset': 'Parolni tiklash havolasi uchun emailingizni tekshiring.',
    'auth.notice.signup': 'Hisob yaratildi. Agar email tasdiqlash yoqilgan bo’lsa, pochtangizni tekshiring — so’ng kiring.',
    'auth.error.exists': 'Bu email allaqachon ro’yxatdan o’tgan — kirishni sinab ko’ring.',
    'auth.error.invalid': 'Email yoki parol noto’g’ri ko’rinadi. Qayta urinib ko’ring.',
    'auth.error.password': 'Parol kamida 6 ta belgidan iborat bo’lishi kerak.',
    'auth.error.notConfigured': 'Bu joylashtirishda hisoblar hali sozlanmagan. Progressingiz baribir shu qurilmada saqlanadi.',
    'auth.error.email': 'Iltimos, to’g’ri email manzilini kiriting.',
    'auth.error.generic': 'Nimadir xato ketdi. Iltimos, qayta urinib ko’ring.',

    // account menu + sync states
    'account.savedOnDevice': 'Shu qurilmada saqlangan',
    'account.savedOnDevice.title': 'Bu joylashtirishda hisoblar yo’q; progress shu brauzerda saqlanadi.',
    'account.signin': 'Kirish',
    'account.menu': 'Hisob menyusi',
    'account.signout': 'Chiqish',
    'account.fallback': 'Hisob',
    'sync.syncing': 'Sinxronlanmoqda…',
    'sync.saved': 'Saqlandi',
    'sync.error': 'Sinxronlash xatosi',
    'sync.offline': 'Oflayn',
    'sync.idle': 'Sinxronlangan',

    // account prompt
    'prompt.region': 'Progressingizni saqlang',
    'prompt.dismiss': 'Yopish',
    'prompt.title.prefix': 'Ajoyib natija —',
    'prompt.title.suffix': 'ta dars bajarildi!',
    'prompt.text': 'Yulduzlar va seriyangizni bulutga saqlash hamda istalgan qurilmada davom ettirish uchun bepul hisob yarating.',
    'prompt.save': 'Progressimni saqlash',
    'prompt.notNow': 'Hozir emas',
  },
}

/**
 * Build a translator bound to `locale`.
 * Lookup order: active locale → English → the key itself.
 * On fallback (active-locale miss) emit a dev-only console.warn so missing
 * translations are visible to developers but never to users.
 */
export function createT(locale) {
  return function t(key) {
    const active = UI[locale]
    if (active && key in active) return active[key]
    if (key in UI.en) {
      if (import.meta.env.DEV) {
        console.warn(`[i18n] missing "${key}" for locale "${locale}" — falling back to English`)
      }
      return UI.en[key]
    }
    if (import.meta.env.DEV) {
      console.warn(`[i18n] missing "${key}" in any locale (asked for "${locale}")`)
    }
    return key
  }
}

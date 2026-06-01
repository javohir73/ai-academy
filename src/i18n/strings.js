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

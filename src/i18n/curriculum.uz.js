/* Uzbek (Latin) translations for the curriculum. Keyed by STABLE ids.
   - Track metadata (tag/title/blurb/comingSoon) + lesson title/concept: TRACKS_UZ / LESSONS_UZ below.
   - Lesson title/concept for every level: inline in LESSONS_UZ (Phase B).
   - Lesson BODY (explanation/example/workedExample/guided/goDeeper/video/activity):
       L0 + L1 inline below (Phase C1); L2–L5 in per-level body modules
       (body.l2.uz.js, body.l4.uz.js, body.l5.uz.js, + L3 inline) deep-merged in.
   English is the fallback for anything missing.

   Conventions: natural Latin Uzbek (no Cyrillic), U+2019 (’) for the o’/g’
   modifier and apostrophes. AI/ML terms follow src/i18n/glossary.js. Technical
   tokens (CNN, PyTorch, ResNet, CIFAR-10, GPU, RGB, LLM, …) are kept as-is. */
import { BODY_L2 } from './body.l2.uz.js'

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
    explanation:
      'Model o’rganadigan hamma narsa — bu ma’lumot: misollar jadvali, unda har bir satr bitta narsa, har bir ustun esa u haqidagi bitta fakt. Har qanday mashinaviy o’qitishdan oldin sizga aynan shunday tartibga solingan yaxshi misollar kerak.',
    example: {
      text: 'Uylar jadvali — har bir uy uchun bitta satr, maydoni, xonalar soni va narxi uchun ustunlar — bu ma’lumotlar to’plami (dataset). Model qonuniyatlarni o’rganish uchun shu satrlarni o’rganadi.',
    },
    workedExample: {
      intro:
        'Yaxshi ma’lumotlar to’plamining sinovi: bu MISOLLARning toza jadvalimi, unda har bir satr bitta element va har bir ustun bitta o’lchanadigan faktmi? Bir nechtasini qanday baholashimni kuzating.',
      steps: [
        'Spam / spam-emas deb belgilangan elektron xatlar jadvali: har bir satr — bitta xat, bitta ustun — belgi (javob). Toza misollar — o’rganish uchun ajoyib.',
        'Bitta uzun matn paragrafi: satr ham, ustun ham yo’q, solishtirishga hech narsa yo’q. Bu hali ma’lumotlar to’plami emas — avval tuzilma kerak.',
        'Surfatlar “mushuk” va “it” papkalariga ajratilgan: har bir rasm — misol, papka esa uning javobi (belgisi). Bu ma’lumotlar to’plami BO’LADI.',
      ],
      takeaway:
        'Ma’lumotlar to’plami — bu misollar jadvali: satrlar — elementlar, ustunlar — faktlar, ko’pincha bitta ustun esa javob (belgi).',
    },
    guided: {
      prompt:
        'Bulardan qaysi biri o’rganishga tayyor?\n\nA) 1 000 ta mijoz sharhi, har biri ijobiy yoki salbiy deb belgilangan\nB) Bitta uzun, belgilanmagan insho',
      hints: [
        'O’rganish uchun ko’plab solishtiriladigan MISOLLAR kerak, eng yaxshisi — har biri nima ekanini aytuvchi belgi bilan.',
        'A — bu ming dona belgilangan misol; B — bu tuzilmasiz bitta matn bo’lagi.',
      ],
      answer: 'A — belgilangan sharhlar.',
      explanation:
        'A — bu model qonuniyatlarni o’rgana oladigan, belgilangan misollarning tuzilgan to’plami. B esa tuzilmasiz va belgilanmagan, shuning uchun hozircha o’rganadigan narsa yo’q.',
    },
    goDeeper: {
      title: 'Nega “axlat kirsa, axlat chiqadi” shu yerdan boshlanadi',
      body:
        'Model faqat o’z misollari darajasida yaxshi bo’la oladi. Noxolis, noto’g’ri belgilangan yoki juda kam satrlar — hech qanday algoritm qutqara olmaydigan zaif modelni beradi. Shuning uchun haqiqiy ML ishi vaqtining ko’pini modellarga emas, ma’lumotga sarflaydi — bu mavzuga har bir darajada yana duch kelasiz.',
    },
    video: {
      title: 'Ma’lumot, satrlar va ustunlar',
      description: 'Ma’lumotlar to’plami nima va misollar o’rganishga yetarli darajada yaxshi bo’lishi uchun nima kerak.',
    },
    activity: {
      prompt: 'Jamoa uy narxlarini bashorat qilmoqchi. Buni haqiqatan ham o’rgata oladigan ma’lumotlar to’plamini tanlang.',
      data: {
        // arrays mirror the English `data.options` order (index-matched).
        options: [
          {
            title: 'O’tgan uy sotuvlari',
            sample: '5 000 ta sotilgan uy: maydoni, xonalar soni, joylashuvi va yakuniy sotuv narxi bilan.',
            why: 'Ko’plab misollar, javob (sotuv narxi) bilan birga — aynan nazoratli o’qitishga kerak bo’lgan narsa.',
          },
          {
            title: 'Narxsiz uylar',
            sample: '5 000 ta uy: maydoni va joylashuvi bor — lekin narx ustuni bo’sh.',
            why: 'Narx ustunisiz o’rganadigan javob yo’q.',
          },
          {
            title: 'Uchta uy',
            sample: 'Atigi 3 ta uy: to’liq ma’lumot va narxlari bilan.',
            why: 'Uchta satr ishonchli qonuniyatni o’rganish uchun juda kam.',
          },
        ],
      },
      feedback: {
        correct:
          'To’g’ri — ko’plab belgilangan misollar (narx ham bor) narxni bashorat qilishni o’rgansa bo’ladigan qiladi. Har doim avval yaxshi ma’lumot.',
        incorrect:
          'Yana qarang: sizga bashorat qilmoqchi bo’lgan javobni (sotuv narxini) o’z ichiga olgan KO’P misollar kerak.',
      },
    },
  },
  'what-ai': {
    title: 'Sun’iy intellekt nima?',
    concept: 'Aqlli vazifalarni bajaradigan mashinalar',
    explanation:
      'Sun’iy intellekt (AI) — bu kompyuter odatda inson aqlini talab qiladigan ishlarni bajarishi: tilni tushunish, rasmlarni tanish yoki tanlov qilish kabi. Bu sehr emas va u tirik ham emas. Bu juda qobiliyatli dastur.',
    example: {
      text: 'Telefoningiz yuzingizga qarab ochilganda — bu AI sizni taniyapti. Sonlarni qo’shadigan cho’ntak kalkulyatori esa shunchaki odam yozgan qat’iy qadamlarga amal qiladi — shuning uchun u AI emas.',
    },
    workedExample: {
      intro:
        'Biror narsa AI hisoblanadimi-yo’qmi, qanday hal qilishimni kuzating. Men doim beradigan bitta sinov: u misollardan O’RGANDIMI, yoki shunchaki odam yozgan qat’iy qadamlarga AMAL QILADIMI?',
      steps: [
        'Yuz bilan ochishni olaylik. U vaqt o’tishi bilan sizni tanishda yaxshilanadi, yangi burchak va yorug’likka moslashadi. U aniq misollardan o’rgangan — shuning uchun men buni AI deyman.',
        'Endi cho’ntak kalkulyatori. “2 + 2” har doim odam dasturlagan aynan o’sha qadamlarni bajaradi. Hech narsa o’rganilmagan. Demak, bu AI emas.',
        'Murakkabrog’i: spam filtri. Hech kim har bir keraksiz xat uchun qoida yozmagan — u minglab xabarlarni o’rganib, qonuniyatlarni o’zi topdi. Misollardan o’rgangan, demak bu AI.',
      ],
      takeaway: 'Sinov: u misollardan O’RGANDIMI (AI) yoki shunchaki qat’iy qadamlarga AMAL QILADIMI (AI emas)?',
    },
    guided: {
      prompt:
        'To’liq to’plamni sinab ko’rishdan oldin bittasini birga qilaylik. Bu AImi yoki yo’qmi?\n\n“Siz yozayotganda gapingizni tugatadigan elektron pochta avtomatik to’ldirishi.”',
      hints: [
        'Sinovimizdan boshlang — u odam yozgan qat’iy qoidaga amal qiladimi, yoki qonuniyatlardan biror narsani o’zi aniqlaydimi?',
        'Avtomatik to’ldirish keyingi so’zlaringizni ilgari ko’rgan juda katta hajmdagi matnga tayanib taklif qiladi. Bu misollardan o’rganishga juda o’xshaydi.',
        'Spam filtrini eslang: u minglab xatlardan o’rgandi. Avtomatik to’ldirish milliardlab gaplardan o’rgandi — bu xuddi o’sha g’oya, qo’lda yozilgan qoida emas.',
      ],
      answer: 'Bu AI.',
      explanation:
        'Avtomatik to’ldirish juda katta hajmdagi matndan qonuniyatlarni o’rganadi, so’ng eng ehtimolli keyingi so’zlarni bashorat qiladi. Misollardan qonuniyatlarni o’rganish — bu mashinaviy o’qitish, ya’ni AIning bir turi.',
    },
    goDeeper: {
      title: '“Mashinaviy o’qitish” qayerga to’g’ri keladi?',
      body:
        'AI — bu katta soyabon: inson kabi aql talab qiladigan vazifalarni bajaradigan har qanday dastur. Mashinaviy o’qitish (ML) — bugun AI qurishning eng keng tarqalgan usuli: qoidalarni qo’lda yozish o’rniga, dasturga misollardan qonuniyatlarni o’rgatamiz. Demak, har bir ML tizimi AI, lekin ba’zi eski uslubdagi AIlar (qo’lda yozilgan qoida tizimlari) ML emas. Bu trekning qolgan qismi aslida mashinaviy o’qitish haqida.',
    },
    video: {
      title: 'Nima AI hisoblanadi?',
      description: 'Yuz bilan ochishdan tavsiyalargacha — kundalik AIning ikki daqiqalik sayohati, va nima shunchaki oddiy dastur ekani.',
    },
    activity: {
      prompt: 'Har bir kartani AI yoki AI emas guruhiga torting — yoki kartani bosib, so’ng guruhni bosing.',
      data: {
        // arrays mirror the English buckets/tokens order (index-matched).
        buckets: [{ label: 'AI' }, { label: 'AI emas' }],
        tokens: [
          { label: 'Telefonda yuz bilan ochish' },
          { label: 'Keraksiz xatlarni ilg’ovchi spam filtri' },
          { label: 'Cho’ntak kalkulyatori' },
          { label: 'Savollarga javob beruvchi ovozli yordamchi' },
          { label: 'Lampochkani yoqadigan yorug’lik kaliti' },
          { label: 'Sizga yoqishi mumkin bo’lgan ko’rsatuvni taklif qiluvchi xizmat' },
        ],
      },
      feedback: {
        correct:
          'Aynan. AI mulohaza talab qiladigan vazifalarni bajaradi — tanish, tushunish va tanlash. Oddiy mashinalar esa shunchaki qat’iy qadamlarga amal qiladi.',
        incorrect:
          'Unchalik emas. AI o’rganadi yoki aqlli tanlov qiladi. Kalkulyator va yorug’lik kaliti faqat odam o’rnatgan qat’iy qadamlarga amal qiladi.',
      },
    },
  },
  'ai-ethics': {
    title: 'Hayotdagi AI etikasi',
    concept: 'AI’dan mas’uliyat bilan foydalanish',
    explanation:
      'AI kuchli, shuning uchun undan adolatli va mas’uliyat bilan foydalanish kerak. Yaxshi AI etikasi — bu kimga foyda yoki zarar bo’lishi mumkinligini o’ylash, AI xato qilishi mumkinligini tan olish, odamlarning maxfiyligini himoya qilish va muhim qarorlarda odamni nazoratda saqlash.',
    example: {
      text: 'Kasalxona rentgen tasvirlarida kasallikni aniqlashda AIdan yordam olmoqchi. Bu foydali — lekin natijani har doim shifokor ko’rib chiqishi kerak, chunki noto’g’ri xulosa kimgadir zarar yetkazishi mumkin.',
    },
    video: {
      title: 'AI’dan mas’uliyat bilan foydalanish',
      description: 'Adolat, maxfiylik, xatolarda halollik va katta qarorlarda odamni nazoratda saqlash.',
    },
    workedExample: {
      intro:
        'Haqiqiy AI taklifini qanday baholashimni ko’rib chiqaylik — u kimga ta’sir qilishi va kim nazoratda qolishi haqida ovoz chiqarib o’ylab.',
      steps: [
        'Bank AI kredit arizalarini mustaqil tasdiqlash yoki rad etishni xohlaydi. Avval so’rayman: kimga ta’sir qiladi va xato bo’lsa qanchalik yomon? Noto’g’ri rad etilgan kredit insonning hayotini o’zgartirishi mumkin — bu yuqori xavf.',
        'Keyin so’rayman: AI noxolis bo’lishi mumkinmi? Agar u o’tmishdagi bir guruhni afzal ko’rgan qarorlardan o’rgangan bo’lsa, boshqacha ko’rinadigan odamlarga qarshi shu noxolislikni jimgina takrorlashi mumkin.',
        'So’ng so’rayman: muhim qaror hali ham odam zimmasidami? AI yakuniy rad etishlarni yolg’iz yuborishiga ruxsat berish inson nazoratini olib tashlaydi.',
        'Demak, mas’uliyatli yechim: AI arizalarni belgilab, saralasin, lekin kredit bo’yicha mutaxassis har bir rad etishni yakuniy bo’lishidan oldin ko’rib chiqsin — va bank AIni noxolis qonuniyatlar uchun tekshirsin.',
      ],
      takeaway:
        'AI’dan mas’uliyatli foydalanish to’rtta odatga keladi: kimga foyda yoki zarar bo’lishini o’ylash, noxolislikni kuzatish, odamlarning maxfiyligini himoya qilish va haqiqatan muhim qarorlarda odamni nazoratda saqlash.',
    },
    guided: {
      prompt:
        'Bittasini birga mulohaza qilaylik. Ishga olish jamoasi AI ish izlovchilarni avtomatik rad etib, rad etish xatlarini yuborishini xohlaydi — hech bir tanlovchi qaramasdan. Qilinadigan eng mas’uliyatli bitta o’zgarish nima?',
      hints: [
        'Xavf haqida o’ylang. Rad etilgan ish arizasi haqiqiy inson uchun muhim qaror.',
        'Muammo AI arizalarni saralashga yordam berishida emas — muammo shundaki, hech bir odam yakuniy qarorni ko’rib chiqmaydi.',
        'Yechim AIni yordamchi sifatida saqlaydi, lekin muhim qarorni yana odam zimmasiga qaytaradi.',
      ],
      answer:
        'AI nomzodlarni saralasin yoki ro’yxat tuzsin, lekin har qanday rad etish yuborilishidan oldin tanlovchi qarorlarni ko’rib chiqsin.',
      explanation:
        'AI arizalarni tez saralash va ko’rsatish bilan yordam berishi mumkin, lekin ishga olish qarori yuqori xavfli va model xato yoki noxolis bo’lishi mumkin. Yakuniy qarorni odam zimmasida saqlash — va noxolis qonuniyatlarni ushlash imkoni — mas’uliyatli tanlov. Vositani butunlay taqiqlash foydali yordamchini tashlab yuboradi; uni yolg’iz harakat qilishiga ruxsat berish esa inson nazoratini olib tashlaydi.',
    },
    goDeeper: {
      title: 'Noxolislik “neytral” ma’lumot ichida yashirinishi mumkin',
      body:
        'Tizim hech kim shuni xohlamagan bo’lsa ham noxolis bo’lishi mumkin. Agar u o’rgangan misollar allaqachon nomutanosib o’tmishni aks ettirsa — masalan, ilgari asosan bir xil odamlar ishga olingan bo’lsa — model shu qonuniyatni “xolis” baho qiyofasida shunchaki takrorlashi mumkin. Shuning uchun mas’uliyatli jamoalar natijaga shunchaki ishonmaydi; ular tizimni turli guruhlarda sinaydi, kamchiliklarni izlaydi va odamlar hayotiga ta’sir qiluvchi qarorlarni odam ko’rib chiqishini saqlaydi.',
    },
    activity: {
      prompt: 'Har bir hayotiy vaziyat uchun eng mas’uliyatli harakatni tanlang, so’ng qarorlaringizni tekshiring.',
      data: {
        // arrays mirror the English scenarios/options order (index-matched).
        scenarios: [
          {
            situation:
              'Maktab AI insholarni baholab, yakuniy baholarni o’quvchilarga elektron pochta orqali yuborishini xohlaydi — hech bir o’qituvchi ko’rib chiqmasdan.',
            options: [
              {
                text: 'AI baholasin va yakuniy baholarni avtomatik yuborsin.',
                why: 'AI xato qilishi va ma’noni o’tkazib yuborishi mumkin. Baho kabi muhim qarorni odam ko’rib chiqishi kerak.',
              },
              {
                text: 'AI baho taklif qilsin, lekin u hisobga olinishidan oldin o’qituvchi ko’rib chiqsin.',
                why: 'Muhim qaror odam zimmasida qoladi. AI yordam beradi; odamlar qaror qiladi.',
              },
              {
                text: 'Maktabdagi barcha kompyuterlarni butunlay taqiqlash.',
                why: 'AI foydali vosita bo’lishi mumkin. Maqsad — undan mas’uliyat bilan foydalanish, butunlay taqiqlash emas.',
              },
            ],
          },
          {
            situation:
              'Ilova chatbotini foydalanuvchilarning shaxsiy xabarlarida — ularga aytmasdan — o’qitmoqchi.',
            options: [
              {
                text: 'Shaxsiy xabarlardan jimgina foydalanish — bu botni yaxshilaydi.',
                why: 'Bu odamlarning maxfiyligi va ishonchini buzadi. Odamlar avval bilishi va rozi bo’lishi kerak.',
              },
              {
                text: 'Avval foydalanuvchilardan ruxsat so’rash va rad etishga imkon berish.',
                why: 'Maxfiylikni hurmat qilish va rozilik so’rash — AIdan mas’uliyatli foydalanish.',
              },
            ],
          },
        ],
      },
      feedback: {
        correct:
          'To’g’ri qarorlar. Mas’uliyatli AI muhim tanlovlarda odamni nazoratda saqlaydi va odamlarning maxfiyligini hurmat qiladi.',
        incorrect:
          'Adolat, halollik va maxfiylikni tarozida o’lchang. Eng mas’uliyatli tanlov odatda odamni nazoratda saqlaydi va odamlarning huquqlarini hurmat qiladi.',
      },
    },
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

/* Fold the per-level body modules into LESSONS_UZ. Each module supplies body
   fields (explanation/workedExample/activity/…) for its lessons; we merge them
   onto the existing { title, concept } entries. A shallow per-id merge is enough
   because the body modules never set title/concept (those live above). */
function mergeBody(into, body) {
  for (const [id, fields] of Object.entries(body)) {
    into[id] = { ...(into[id] ?? {}), ...fields }
  }
  return into
}

mergeBody(LESSONS_UZ, BODY_L2)

/** Combined map shape consumed by localizeTracks(tracks, locale, CURRICULUM_UZ). */
export const CURRICULUM_UZ = { tracks: TRACKS_UZ, lessons: LESSONS_UZ }

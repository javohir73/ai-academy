/* Uzbek (Latin) body translations for Level 4 (Computer Vision). Keyed by stable id.
   Merged onto the English lesson body by the generic deepOverlay resolver:
   strings override by path, arrays by index, objects by key. Non-string/logic
   fields are omitted (the resolver keeps the English value). */
export const BODY_L4 = {
  "cv-pixels": {
    explanation: "Kompyuter rasmni hech qachon 'ko’rmaydi' — u faqat sonlar to’rini ko’radi. Kulrang (grayscale) rasm bitta to’r bo’lib, har bir katakcha (piksel) yorug’likni 0 (qora) dan 255 (oq) gacha qiymatda saqlaydi. Rangli rasm esa shunday uchta to’rni ustma-ust qo’yadi: biri Qizil (Red), biri Yashil (Green), biri Ko’k (Blue) uchun. Demak rangli foto aslida uchta ustma-ust sonlar to’ri bo’lib, ular kanal deb ataladi. Chuqur o’rganish kutubxonalari rasmni shakli bilan tasvirlaydi: C×H×W — Kanallar (rang uchun 3 ta), Balandlik (piksellar qatorlari), Kenglik (piksellar ustunlari). Tartibni yoki kanal ma’nosini adashtirsangiz, modelingiz 'axlatni' ko’radi.",
    example: {
      text: "Kichkina 2×2 rangli rasmning shakli 3×2×2 bo’ladi: uchta 2×2 to’r. Yuqori chap piksel R=255, G=0, B=0 bo’lishi mumkin — sof qizil. Qaysi to’r 'birinchi' ekanini o’zgartirsangiz, qizil to’satdan ko’k bo’lib o’qilishi mumkin. Bu mashhur RGB-ga-qarshi-BGR tuzog’i: OpenCV rasmlarni BGR sifatida yuklaydi, ammo PyTorch va aksariyat modellar RGB kutadi. Bir xil sonlar, ma’no esa almashgan."
    },
    workedExample: {
      intro: "Keling, bitta pikselni to’g’ri, qadam-baqadam o’qib, so’ng kanal tartibi odamlarni qanchalik oson chalg’itishini ko’rsataman.",
      steps: [
        "Yorug’lik shkalasi: har bir qiymat 0–255 oralig’ida. 0 — to’liq o’chiq (qorong’i), 255 — to’liq yoniq (yorqin). 200 qiymatli kulrang piksel och kulrang; 30 esa deyarli qora.",
        "Rangli piksel — UCHTA son, ya’ni (R, G, B). (255, 0, 0) sof qizil: qizil maksimal, yashil va ko’k o’chiq. (0, 255, 0) yashil. (255, 255, 0) qizil+yashil = sariq.",
        "Shakl C×H×W: 64×64 rangli rasm 3×64×64 — 3 kanal, 64 qator, 64 ustun. Kanal o’qini yo’qotsangiz (uni faqat H×W deb o’qisangiz), rangni tashlab yuborgan bo’lasiz.",
        "Tuzoq: OpenCV sizga (B, G, R) tartibida beradi. Buni to’g’ridan-to’g’ri RGB modeliga bersangiz, (255, 0, 0) piksel — siz qizil deb mo’ljallagan — ko’k sifatida talqin qilinadi. Modelning aniqligi hech qanday xato xabarisiz jimgina qulaydi."
      ],
      takeaway: "Rasm — bu 0–255 sonlar to’rlarining C×H×W to’plami. Kanal tartibini bilmaguningizcha sonlar ma’nosiz — modelga berishdan oldin doim RGB yoki BGR ekanini tasdiqlang."
    },
    guided: {
      prompt: "Rangli piksel uchta son (255, 0, 0) sifatida saqlanadi. Kutubxonangiz rasmlarni RGB tartibida yuklaydi. Bu piksel qaysi rangda?",
      hints: [
        "RGB tartibida uchta son (Qizil, Yashil, Ko’k) ni anglatadi, har biri 0–255.",
        "Bu yerda Qizil 255 da maksimal, Yashil va Ko’k esa ikkalasi ham 0 — faqat qizil kanal yoniq."
      ],
      answer: "Sof qizil.",
      explanation: "RGB tartibida (255, 0, 0) qizil to’liq yoniq, yashil va ko’k o’chiq degani — sof qizil. Agar BGR yuklaydigan kutubxona sizga aynan shu sonlarni bergan bo’lsa, model ularni sof ko’k deb o’qigan bo’lardi: bir xil sonlar, qarama-qarshi rang. Mana shu uchun har narsadan oldin kanal tartibi muhim."
    },
    goDeeper: {
      title: "Nega 0–255, va 'normallashtirish' nima qiladi",
      body: "Har bir kanal qiymati bitta baytga sig’adi (8 bit = 256 ta mumkin bo’lgan qiymat, 0–255), shuning uchun yorug’lik 255 da to’xtaydi. O’qitishdan oldin biz odatda bularni kasr sonlarga 'normallashtiramiz' — masalan, 0.0–1.0 olish uchun 255 ga bo’lamiz, yoki ma’lumotlar to’plami o’rtachasini ayirib, standart og’ishga bo’lamiz. Kirishlar xom 0–255 butun sonlar emas, balki kichik, markazlashgan sonlar bo’lganda modellar tezroq va barqarorroq o’qiydi. Piksel to’ri o’sha rasmning o’zi — faqat tarmoq afzal ko’radigan oraliqqa qayta o’lchamlangan."
    },
    video: {
      title: "Piksellar, kanallar va rasm shakli",
      description: "Foto qanday qilib C×H×W sonlar to’rlari to’plamiga aylanadi va nega RGB yoki BGR modelni jimgina buzishi mumkin."
    },
    activity: {
      prompt: "Mana kichkina rangli rasm (R, G, B) sonlari to’ri sifatida. Qizil / Yashil / Ko’k kanallarini yoqib-o’chirib har birining hissasini kuzating va aniq qiymatlarni o’qish uchun istalgan pikselni bosing. So’ng kanal-tartibi savoliga javob bering — RGB-ga-qarshi-BGR xatolari aynan shu yerda yashirinadi.",
      feedback: {
        correct: "Aynan shunday — kanal tartibini bilmaguningizcha sonlar ma’nosiz. (255, 0, 0) RGB da qizil, BGR da esa ko’k. Modelga berishdan oldin doim RGB yoki BGR ekanini tasdiqlang, aks holda aniqligi jimgina quladi.",
        incorrect: "Rasm shunchaki (R, G, B) sonlaridir, ammo TARTIB qaysi son qaysi rang ekanini hal qiladi. (255, 0, 0) RGB tartibida sof qizil, BGR da esa sof ko’k — bir xil sonlar, qarama-qarshi ma’no. Qaysi katakcha o’sha pikselni boshqarayotganini tasdiqlash uchun Qizil kanalni o’chirib ko’ring."
      },
      data: {
        check: {
          question: "Yuqori chap piksel uchta son (255, 0, 0) sifatida saqlanadi va kutubxonangiz rasmlarni RGB tartibida yuklaydi. Bu qaysi rang — va BGR yuklaydigan kutubxona AYNAN shu sonlardan nimani anglardi?",
          choices: [
            {
              label: "RGB da sof QIZIL — ammo BGR kutubxonasi aynan shu sonlarni sof KO’K deb o’qigan bo’lardi.",
              why: "RGB tartibida (255, 0, 0) qizil maksimal, yashil va ko’k o’chiq degani → sof qizil. Aynan shu sonlarni BGR kutadigan modelga bering — birinchi kanal ko’k deb qabul qilinadi, shuning uchun u sof ko’k 'ko’radi'. Bir xil sonlar, qarama-qarshi rang — klassik kanal-tartibi xatosi."
            },
            {
              label: "Ikki holatda ham sof qizil — kanal tartibi rangni o’zgartirmaydi.",
              why: "Kanal tartibi ma’noni mutlaqo o’zgartiradi. Sonlar shunchaki kataklar; RGB yoki BGR qaysi katakcha qizil va qaysi ko’k ekanini hal qiladi, shuning uchun AYNAN shu (255, 0, 0) qizil bilan ko’k orasida almashinadi."
            },
            {
              label: "Oq — uchala son birgalikda oqni hosil qiladi.",
              why: "Oq uchun uchala kanal ham maksimal bo’lishi kerak (255, 255, 255). Bu yerda faqat birinchisi 255, qolgan ikkitasi 0, shuning uchun bu bitta sof kanal, oq emas."
            },
            {
              label: "Sariq — qizil va yashil birlashib sariq bo’ladi.",
              why: "Sariq — qizil + yashil (255, 255, 0). Bu yerda yashil 0, shuning uchun birlashadigan yashil yo’q — RGB tartibida bu sof qizil."
            }
          ]
        }
      }
    }
  },
  "cv-conv-by-hand": {
    explanation: "Konvolyutsiya kichik vaznlar to’rini — yadro (kernel) yoki filtrni — rasm bo’ylab sirpantiradi. Har bir joyda u yadroni piksellar bo’lagi ustiga qo’yadi, har bir pikselni uning ustidagi yadro vazniga ko’paytiradi va barcha ko’paytmalarni BITTA chiqish soniga qo’shadi. Oynani bir qadam suring va takrorlang. Butun chiqish to’ri belgilar xaritasi deb ataladi. Turli yadrolar turli narsalarni aniqlaydi: chekka aniqlovchi yorug’lik keskin o’zgargan joyda yonadi; xiralashtirish yadrosi qo’shnilarni o’rtachalaydi; o’tkirlashtirish yadrosi farqlarni kuchaytiradi. Konvolyutsiya — bu shunchaki sirpanuvchi, vaznli yig’indi — bundan boshqa sirli narsa yo’q.",
    example: {
      text: "Vertikal Sobel chekka yadrosi [[-1,0,1],[-2,0,2],[-1,0,1]]. Uni har bir piksel bir xil qiymatga ega bo’lgan tekis bo’lakka qo’ying — manfiy va musbatlar bir-birini yo’qqa chiqaradi va chiqish 0 bo’ladi (chekka yo’q). Uni chap tomoni qorong’i, o’ng tomoni yorqin joyga qo’ying — musbatlar yutadi va katta son hosil bo’ladi: 'bu yerda chekka bor!'"
    },
    workedExample: {
      intro: "Keling, bitta oynani qo’lda oddiy 3×3 XIRALASHTIRISH (BLUR) yadrosi bilan konvolyutsiya qilaman (har bir vazn = 1, shuning uchun chiqish shunchaki 9 ta pikselning YIG’INDISI — silliqlash/o’rtachalash harakati). Sirpanuvchi skalyar ko’paytmani qadam-baqadam kuzating.",
      steps: [
        "Yadroni yuqori chap 3×3 bo’lak ustiga qo’ying. Bo’lak piksellari: 10, 10, 10 / 10, 50, 10 / 10, 10, 10.",
        "Har bir pikselni ustidagi yadro vazniga ko’paytiring. Har bir vazn 1, shuning uchun to’qqizta ko’paytma shunchaki to’qqizta piksel: 10,10,10,10,50,10,10,10,10.",
        "Barcha to’qqizta ko’paytmani qo’shing: 10+10+10 + 10+50+10 + 10+10+10 = 130. Mana shu bitta son ushbu joy uchun chiqish.",
        "Oynani bir ustun o’ngga suring va takrorlang. Buni hamma joyda qilish to’liq chiqish to’rini — belgilar xaritasini — quradi. (Bu hammasi-bir yadro yorqin markazni qorong’i qo’shnilariga silliqlaydi, bu xiralashtirish qiladigan ishdir.)"
      ],
      takeaway: "Konvolyutsiya = yadroni bo’lakka qo’ying, mos kataklarni ko’paytiring, bitta songa qo’shing, so’ng suring. Yadroning vaznlari qaysi belgi aniqlanishini hal qiladi."
    },
    guided: {
      prompt: "Siz 3×3 bo’lak [[0,0,0],[0,0,0],[0,0,0]] (hammasi nol) ni ISTALGAN yadro bilan konvolyutsiya qilasiz. To’qqizta ko’paytmani hisoblamasdan, chiqish soni nima?",
      hints: [
        "Chiqish — (har bir piksel × ustidagi yadro vazni) yig’indisi.",
        "Bu yerda har bir piksel 0. Nolni istalgan vaznga ko’paytirsak nol, nollar yig’indisi esa…"
      ],
      answer: "0.",
      explanation: "Har bir ko’paytma piksel × vazn = 0 × vazn = 0, to’qqizta nolni qo’shsak 0 bo’ladi. Mana shuning uchun mukammal tekis (o’zgarmas) hudud chekka yadrosidan hech qanday javob hosil qilmaydi — filtr reaksiya bildiradigan o’zgarish yo’q."
    },
    goDeeper: {
      title: "Nega chekka yadrolarida manfiylar bor va 'belgilar xaritasi' nimani anglatadi",
      body: "Sobel kabi chekka aniqlovchilar bir tomonda manfiy vaznlarni boshqa tomonda musbat vaznlar bilan juftlaydi. Tekis bo’lakda ikki tomon ~0 ga bir-birini yo’qqa chiqaradi; yorug’lik sakrashida ular yo’qqa chiqmaydi, shuning uchun chiqish keskin ko’tariladi — o’sha ko’tarilish AYNAN aniqlangan chekkadir. Chiqishlarning to’liq to’ri belgilar xaritasidir: yadroning naqshi topilgan har joyda yorqin bo’lgan yangi rasm. Har biri o’z naqshini o’rganadigan ko’plab shunday yadrolarni ustma-ust qo’yish — aynan konvolyutsiya qatlami qiladigan ishdir, bu esa keyingi darsdir."
    },
    video: {
      title: "Konvolyutsiya, bir oyna ketma-ket",
      description: "Yadroni sirpantirish, ko’paytir-va-yig’ skalyar ko’paytma, va chekka / xiralashtirish / o’tkirlashtirish filtrlari qanday farq qilishi."
    },
    activity: {
      prompt: "Bu 3×3 vertikal Sobel chekka yadrosini belgilangan bo’lakka qo’llang. Har bir pikselni uning ustidagi yadro vazniga ko’paytiring, so’ng to’qqizta ko’paytmaning hammasini qo’shing. Bo’lakning CHAP tomoni qorong’i, O’NG tomoni yorqin — vertikal chekka.",
      feedback: {
        correct: "Topdingiz — +320. O’rta ustunning nol vaznlari tushib qoladi; qorong’i chap (-40) va yorqin o’ng (+360) katta musbat songa qo’shiladi va u 'bu yerda vertikal chekka bor' deb baqiradi. Mana shu konvolyutsiyaning chekka aniqlovchi sifatida ishlashidir.",
        incorrect: "Ustunma-ustun ishlang: o’rta ustun vaznlari 0 (e’tibordan chetda qoldiring). Chap ustun vaznlari -1,-2,-1 qorong’i piksellar ustida; o’ng ustun vaznlari 1,2,1 yorqin piksellar ustida. Ikki natijani qo’shing — kuchli musbat chiqishi kerak."
      },
      data: {
        kernelName: "Sobel (vertikal chekka)",
        choices: [
          {
            why: "0 — chekka yo’q degani bo’lardi, ammo bo’lak chap tomondagi qorong’i (10 lar) dan o’ng tomondagi yorqin (90) ga sakraydi, shuning uchun filtr javob bermasligi mumkin emas."
          },
          {
            why: "Markaziy ustun vaznlari 0, shuning uchun u tushib qoladi. Chap ustun (vaznlar -1,-2,-1) piksellar 10,10,10 ustida = -10-20-10 = -40. O’ng ustun (vaznlar 1,2,1) piksellar 90,90,90 ustida = 90+180+90 = 360. Jami: -40 + 0 + 360 = 320. Katta musbat son shuni anglatadi: kuchli vertikal chekka, chapdan o’ngga qorong’idan yorqinga."
          },
          {
            why: "40 juda kichik — siz faqat bitta qatorni hisoblagan bo’lishingiz mumkin. Chap va o’ng ustunlarning uchala qatori bo’ylab yig’indini hisoblang; o’rta ustun 0 hissa qo’shadi."
          },
          {
            why: "Ishora sizga chekka yo’nalishini aytadi. O’NGda yorqin (musbat vaznlar) chap tomondagi qorong’idan ayirilsa, katta MUSBAT natija beradi, +320, -320 emas."
          }
        ]
      }
    }
  },
  "cv-why-fc-fails": {
    explanation: "CNN lardan oldin oddiy g’oya rasmni bir uzun piksellar ro’yxatiga tekislab, uni har bir neyron har bir pikselga ulanadigan to’liq bog’langan (FC) tarmoqqa berish edi. Bu uch sababga ko’ra muvaffaqiyatsizlikka uchraydi. (1) Parametrlar portlashi: 200×200 rangli rasmga qaraydigan bitta neyronga 200×200×3 = 120,000 vazn kerak — qatlamda esa ko’plab neyronlar bor. Model ulkanlashadi va ortiqcha moslashadi. (2) Fazoviy tuzilma yo’q: tekislash qaysi piksellar qo’shni ekanini buzadi, shuning uchun tarmoq yaqin piksellar chekka yoki shaklni hosil qilishini bilolmaydi. (3) Tarjima invariantligi yo’q: uni yuqori chapdagi mushuk bilan o’qitsangiz, pastki o’ngdagi o’sha mushuk ham mushuk ekanini bilmaydi — har bir holatni noldan qayta o’rganishi kerak. Konvolyutsiyalar kichik, ULASHILGAN filtrni rasm bo’ylab sirpantirib uchchalasini ham hal qiladi.",
    example: {
      text: "200×200×3 rasmga bitta FC neyron = 120,000 vazn. Aynan shu rangli rasmga 3×3 konvolyutsiya filtri = 3×3×3 = atigi 27 vazn, va u har bir joyda aynan shu 27 vaznni qayta ishlatadi. Mana shu qayta ishlatish — parametr ulashish — yuqori chapda 'chekka' ni o’rgangan konvolyutsiya filtri o’sha chekkani rasmning istalgan joyida avtomatik aniqlashining sababidir."
    },
    workedExample: {
      intro: "Keling, parametrlar portlashini aniq qilib, so’ng parametr ulashish uni qanday eritib yuborishini ko’rsataman.",
      steps: [
        "200×200 rangli rasmga bitta neyron uchun FC vaznlarini sanang: 200 × 200 × 3 = 120,000 vazn — BITTA neyron uchun. Haqiqiy qatlam ulardan yuzlab yoki minglab to’playdi.",
        "Endi aynan shu rangli rasmga 3×3 konvolyutsiya filtrini sanang: 3 × 3 × 3 kanal = jami 27 vazn. Bu 4,000 martadan ortiq kamroq son o’rganish.",
        "Parametr ulashish: o’sha bitta 27 vaznli filtr BUTUN rasm bo’ylab sirpanadi, hamma joyda bir xil vaznlardan foydalanadi. Shuning uchun bir burchakda o’rganilgan belgi har bir burchakda aniqlanadi — bu tarjima invariantligi, bepulga.",
        "Fazoviy tuzilma: filtr kichik qo’shnilikka (3×3 bo’lak) qaragani uchun qaysi piksellar yonma-yon ekanini biladi. 1 o’lchamli ro’yxatga tekislash o’sha qo’shnilik ma’lumotini tashlab yuboradi — FC tarmoq uni hech qachon tiklay olmaydi."
      ],
      takeaway: "Rasmlardagi FC tarmoqlar hajmda portlaydi, qaysi piksellar qo’shni ekanini e’tiborsiz qoldiradi va har bir ob’ekt holatini qayta o’rganishi kerak. Kichik ulashilgan konvolyutsiya filtri esa kichkina, qo’shniliklarga rioya qiladi va belgini paydo bo’lgan har qanday joyda taniydi."
    },
    guided: {
      prompt: "Bitta to’liq bog’langan neyron 200×200 RGB (3 kanalli) rasmga qaraydi. Unga nechta vazn kerak — va bu muammomi?",
      hints: [
        "FC neyronda har bir kirish qiymati uchun bitta vazn bor. Kirish qiymatlarini sanang: kenglik × balandlik × kanallar.",
        "200 × 200 × 3. So’ng so’rang: bu qatlamdagi ko’plab neyronlardan FAQAT BITTASI uchun ko’pmi?"
      ],
      answer: "120,000 vazn — va ha, bu juda katta muammo.",
      explanation: "200 × 200 × 3 = bitta neyron uchun 120,000 vazn; to’liq qatlam buni neyronlar soniga ko’paytiradi, ortiqcha moslashadigan va sekin o’qiydigan millionlab parametrlarga shishadi. 3×3 konvolyutsiya filtriga atigi 27 vazn kerak va ularni rasm bo’ylab ulashadi — aynan shuning uchun CNN lar ko’rish uchun FC tarmoqlarning o’rnini egalladi."
    },
    goDeeper: {
      title: "Parametr ulashish — ko’rish lokal va takrorlanuvchi degan taxminning O’ZIDIR",
      body: "Konvolyutsiya filtri rasmlar haqida ikki e’tiqodni kodlaydi: belgilar LOKAL (chekka kichik bo’lakda yashaydi, shuning uchun sizga faqat kichik filtr kerak) va belgilar TAKRORLANUVCHI (aynan shu chekka istalgan joyda paydo bo’lishi mumkin, shuning uchun hamma joyda bir xil vaznlardan qayta foydalaning). Mana shu ikki taxmin — lokallik va vazn ulashish — parametrlar sonini keskin qisqartiradi va tarjima invariantligini beradi. FC tarmoq ikkalasini ham taxmin qilmaydi, shuning uchun u joyga bog’liq, qo’shnilikka ko’r naqshlarni o’rganib quvvatini behuda sarflaydi. Ma’lumotingiz haqiqatan lokal, takrorlanuvchi tuzilmaga ega bo’lganda (rasmlar, audio spektrogrammalar), konvolyutsiyalar deyarli mukammal mos keladi."
    },
    video: {
      title: "Nega to’liq bog’langan tarmoqlar rasmlarda muvaffaqiyatsiz bo’ladi",
      description: "Parametrlar portlashi, yo’qolgan fazoviy tuzilma va tarjima invariantligi yo’qligi — va ulashilgan konvolyutsiya filtri uchchalasini qanday hal qiladi."
    },
    activity: {
      prompt: "Parametrlar portlashini o’zingiz his qiling. 200×200 RGB rasmga bitta to’liq bog’langan neyronga har bir kirish qiymati uchun bitta vazn kerak. Aynan shu rasmga 3×3 konvolyutsiya filtri hamma joyda atigi F×F×C vaznni qayta ishlatadi. FC neyron konvolyutsiya filtridan necha marta KO’P vazn ishlatadi?",
      feedback: {
        correct: "To’g’ri — 120,000 FC vazn 27 konvolyutsiya vazniga nisbatan taxminan 4,444 marta ko’p, va bu BITTA neyron uchun. Butun FC qatlam portlashni ko’paytiradi, aynan shuning uchun kichik, ulashilgan konvolyutsiya filtri rasmlar uchun to’liq bog’langan tarmoqlarning o’rnini egalladi.",
        incorrect: "Ikkalasini ham sanang: FC neyronga H×W×C = 200×200×3 = 120,000 vazn kerak; 3×3 konvolyutsiya filtriga F×F×C = 3×3×3 = 27 kerak. Nisbat 120,000 / 27 ≈ 4,444 — mana shu farq konvolyutsiyalar oldini oladigan parametrlar portlashidir."
      },
      data: {
        prompt: "Bu 200×200 RGB rasmda BITTA to’liq bog’langan neyron (H×W×C) BITTA 3×3 konvolyutsiya filtridan (F×F×C) necha marta KO’P vazn ishlatadi?"
      }
    }
  },
  "cv-conv-layer": {
    explanation: "Konvolyutsiya qatlami — siz qo’lda qilgan sirpanuvchi skalyar ko’paytmaning o’zi — ammo endi yadro sonlari tanlangan emas, O’RGANILGAN. Har bir filtr butun rasm bo’ylab sirpanadi va har bir joyda ostidagi bo’lakni ko’paytirib-yig’adi. U qoldiradigan natijalar to’ri belgilar xaritasidir: o’sha filtr naqshi qayerda paydo bo’lganining issiqlik xaritasi. Bitta qatlam ko’plab filtrlarni saqlaydi (aytaylik 16), shuning uchun u chuqurligi 16 bo’lgan hajmga ustma-ust qo’yilgan 16 ta belgilar xaritasini chiqaradi. Ikki g’oya buni kuchli qiladi: parametr ulashish (AYNAN o’sha kichik filtr hamma joyda qayta ishlatiladi, shuning uchun 3x3 filtr rasm qanchalik katta bo’lmasin atigi 9 vazn) va tarjima invariantligi (chekkani topadigan filtr uni istalgan burchakda topadi).",
    example: {
      text: "32x32 fotoni supurib o’tayotgan bitta 3x3 'vertikal-chekka' filtrini tasavvur qiling. Vertikal chekka qayerda bo’lsa, belgilar xaritasidagi o’sha joy yorqin yonadi; tekis hududlar nolga yaqin qoladi. Gorizontal chekkalar uchun ikkinchi filtr qo’shing va ikkinchi belgilar xaritasini olasiz. O’n olti filtr -> o’n olti belgilar xaritasi -> keyingi qatlam o’qiydigan 28x28x16 chiqish hajmi."
    },
    workedExample: {
      intro: "Yangi boshlovchilar uchraydigan yagona tuzoq — CHIQISH O’LCHAMI. Belgilar xaritasining kengligi/balandligi to’rt son bilan belgilanadi: kirish o’lchami W, filtr o’lchami F, to’ldirish (padding) P, qadam (stride) S. output = (W - F + 2P) / S + 1 formulasini qanday qo’llashimni kuzating.",
      steps: [
        "W=32, F=5, P=0, S=1: (32 - 5 + 0)/1 + 1 = 27 + 1 = 28. 32x32 kirish 5x5 filtr orqali (to’ldirishsiz) 28x28 belgilar xaritasini beradi.",
        "32x32 ni SAQLAB qolmoqchimisiz? P=2 to’ldirish qo’shing: (32 - 5 + 4)/1 + 1 = 31 + 1 = 32. 'Same' to’ldirish o’lcham saqlanishi uchun chegarani to’ldiradi.",
        "Tuzoqni kuzating: W=10, F=3, P=0, S=2 beradi (10 - 3 + 0)/2 + 1 = 7/2 + 1 = 4.5 — butun son emas. Belgilar xaritasida yarim katakcha bo’la olmaydi, shuning uchun bu qadam/to’ldirish kombinatsiyasi YAROQSIZ. S yoki P ni o’zgartirishingiz kerak."
      ],
      takeaway: "output = (W - F + 2P)/S + 1. Agar u butun son bo’lmasa, qatlam noto’g’ri sozlangan — o’qitishdan oldin qadam yoki to’ldirishni tuzating."
    },
    guided: {
      prompt: "Qatlamda 16 ta filtr bor, har biri 3x3, RGB (3 kanalli) rasmni o’qiydi. U nechta belgilar xaritasini CHIQARADI va qatlam taxminan nechta vazn o’rganadi?\n\nO’ylab ko’ring: har bir filtrga bitta chiqish xaritasi; har bir 3x3 filtr uchala kirish kanalini qamrab oladi.",
      hints: [
        "Chiqish chuqurligi = filtrlar soni. Bitta filtr -> bitta belgilar xaritasi.",
        "Har bir filtr uchala kirish kanali bo’ylab 3x3 = 3*3*3 = 27 vazn, plyus 1 bias = 28. Ulardan o’n oltitasi taxminan 16*28.",
        "Buni xom rasmga to’liq bog’langan qatlam bilan solishtiring — neyron uchun minglab vazn. Parametr ulashish konvolyutsiya qatlamlarini kichik saqlashining sababidir."
      ],
      answer: "16 ta belgilar xaritasi chiqadi; jami taxminan 16 x (3*3*3 + 1) = 448 vazn.",
      explanation: "Chiqish chuqurligi filtrlar soniga teng (16), shuning uchun siz 16 ta belgilar xaritasini olasiz. Har bir 3x3 filtr uchala kirish kanalini (27 vazn) plyus bias ni qoplashi kerak va o’sha bir xil kichik filtr har bir joyda qayta ishlatiladi — parametr ulashish butun qatlamni to’liq bog’langan qatlam talab qiladigan yuz minglab emas, bir necha yuz vaznda saqlaydi."
    },
    goDeeper: {
      title: "Nega o’lcham qisqarganda chuqurlik o’sadi",
      body: "Tipik CNN fazoviy o’lchamni semantik chuqurlikka almashtiradi: dastlabki qatlamlar kam kanal bilan katta belgilar xaritalarini saqlaydi (ko’p 'qayerda', kam 'nima'), va chuqurroq borgan sari xaritalar kichrayadi, ammo kanallar soni ko’tariladi (kam 'qayerda', ancha ko’p 'nima'). So’nggi konvolyutsiya blokiga kelib sizda 4x4x256 hajm bo’lishi mumkin: fazoviy jihatdan kichkina, ammo 256 kanalning har biri 'bu yerda jun bormi?' yoki 'bu g’ildirakmi?' kabi boy savolga javob beradi. Buni tekislang va kichik klassifikator boshi ishni yakunlaydi."
    },
    video: {
      title: "Konvolyutsiya qatlami ichida",
      description: "O’rganiladigan filtrlar belgilar xaritalarini yaratish uchun qanday sirpanishi va chiqishni (W-F+2P)/S+1 bilan qanday o’lchash."
    },
    activity: {
      prompt: "Birinchi konvolyutsiya qatlamini sozlang va uning chiqishini output = (W − F + 2P)/S + 1 bilan o’zingiz o’lchang. 32×32 rasm 5×5 filtr orqali to’ldirishsiz, qadam 1 bilan o’tadi. Chiqish belgilar-xaritasi tomonining uzunligi qancha?",
      feedback: {
        correct: "Aynan — (32 − 5 + 0)/1 + 1 = 27 + 1 = 28, shuning uchun 32×32 kirish 5×5 filtr orqali (to’ldirishsiz) 28×28 belgilar xaritasini beradi. O’qitishdan oldin chiqishni doim formula bilan o’lchang; agar u butun son bo’lmasa, qadam/to’ldirish yaroqsiz.",
        incorrect: "Qo’ying: (W − F + 2P)/S + 1 = (32 − 5 + 0)/1 + 1 = 28. Xarita 32 dan 28 ga qisqaradi, chunki 5×5 oynaning yetib borishini qoplaydigan to’ldirish yo’q. (P=2 qo’shsangiz, 32 ni saqlab qolasiz — 'same' to’ldirish.)"
      },
      data: {
        prompt: "Kirish W = 32, filtr F = 5, to’ldirish P = 0, qadam S = 1. Chiqish tomonining uzunligi qancha? (Agar formula butun songa tushmasa, buning o’rniga 'yaroqsiz' ni belgilang.)"
      }
    }
  },
  "cv-pooling": {
    explanation: "Konvolyutsiya qatlami o’z belgilar xaritalarini yoqgandan keyin, biz odatda ularni qisqartiramiz. Buni ikki vosita bajaradi. POOLING kichik oynani (ko’pincha 2x2) sirpantiradi va har bir oynani bitta son bilan almashtiradi: max pooling eng kuchli javobni saqlaydi (eng baland 'men naqshimni shu yerda topdim'), average pooling o’rtachani saqlaydi. QADAM (stride) — oyna har qadamda qanchalik uzoq sakrashi; qadam 2 ikki katakcha sakrashini anglatadi, shuning uchun u yarim joyga tashrif buyuradi va chiqish taxminan yarim o’lchamga ega bo’ladi. Ikkalasi ham xaritani qisqartiradi. Maqsad shu: kichikroq xarita hisoblash uchun arzonroq va biroz tarjima toleransini beradi (belgi bir piksel siljisa ham poolingdan keyin omon qoladi). Ammo narxi haqiqiy — siz nozik fazoviy tafsilotni butunlay tashlab yuborasiz, shuning uchun signal oyna ichida AYNAN qayerda bo’lganini tiklay olmaysiz.",
    example: {
      text: "[[9, 1], [6, 8]] bo’lak ustida 2x2 max-pool oling. Max pooling eng katta yagona qiymatni, 9 ni, saqlaydi va 1, 6, 8 ni tashlaydi. Average pooling esa (9+1+6+8)/4 = 6 ni qaytarardi. Qaysidir holatda ham to’rt katakcha bittaga aylandi — xarita har yo’nalishda 2 marta qisqardi."
    },
    workedExample: {
      intro: "Keling, 4x4 belgilar xaritasi bo’ylab qadam 2 bilan 2x2 max-pool ishlataman, shunda oynalar bir-birini qoplamaydi va chiqish aniq 2x2 bo’ladi. Xarita [[1, 3, 9, 1], [2, 4, 6, 8], [5, 0, 7, 2], [1, 6, 3, 4]].",
      steps: [
        "Yuqori chap oyna [[1,3],[2,4]] -> max 4.",
        "Yuqori o’ng oyna [[9,1],[6,8]] -> max 9.",
        "Pastki chap [[5,0],[1,6]] -> max 6; pastki o’ng [[7,2],[3,4]] -> max 7. 4x4 xarita 2x2 xaritaga [[4,9],[6,7]] aylanadi — bir xil eng kuchli signallar, kataklarning chorak qismida."
      ],
      takeaway: "Max-pool har bir oynadagi eng baland javobni saqlaydi; qadam xaritaning qanchalik qisqarishini belgilaydi. Pooling aniq joyni kichikroq, arzonroq, biroz mustahkamroq xaritaga almashtiradi."
    },
    guided: {
      prompt: "28x28 belgilar xaritasi qadam 2 bilan 2x2 max pooling orqali o’tadi. Chiqish o’lchami qancha va siz qaysi ma’lumotdan voz kechdingiz?",
      hints: [
        "Qadam 2 bilan qoplanmaydigan 2x2 pool har bir o’lchamni yarimlaydi.",
        "28 / 2 = 14, shuning uchun xarita 14x14 bo’ladi.",
        "Siz har bir 2x2 blokdagi maksimalni saqladingiz, ammo u to’rt katakdan QAYSI BIRIDAN kelganini yo’qotdingiz — siz almashtirgan ruxsat (resolution) shu."
      ],
      answer: "14x14. Siz har bir 2x2 blokdagi eng kuchli qiymatni saqlaysiz, ammo uning blok ichidagi aniq joyini yo’qotasiz.",
      explanation: "Qadam-2 li 2x2 pooling kenglik va balandlikni yarimlaydi (28->14), kataklar sonini chorakka qisqartiradi. Siz har bir oynadagi eng kuchli aktivatsiyani saqlaysiz, bu biroz tarjima toleransini beradi, ammo endi 2x2 hudud ichida u aynan qayerda yuz berganini ayta olmaysiz — o’sha nozik fazoviy tafsilot butunlay yo’qoldi."
    },
    goDeeper: {
      title: "Qadamli konvolyutsiya pooling ga qarshi",
      body: "Pooling — namunani kamaytirishning yagona usuli emas. Ko’plab zamonaviy tarmoqlar poolingni tashlab, buning o’rniga qadam 2 li konvolyutsiyadan foydalanadi — konvolyutsiya ham belgilarni ajratadi, HAM xaritani bitta o’rganiladigan qadamda qisqartiradi. Poolingda parametrlar yo’q va u qat’iy qoida (max yoki average); qadamli konvolyutsiya esa qanday umumlashtirishni o’rganadi. Ikkalasi ham ruxsatni kamaytiradi; savol shundaki, siz qo’lda tanlangan qoidani (pooling) yoki o’rganilgan qoidani (qadamli konvolyutsiya) xohlaysizmi. Qaysidir holatda ham namunani kamaytirishni shunday rejalashtiringki, so’nggi belgilar xaritasi klassifikator boshi uchun yetarlicha kichik bo’lsin, ammo signalni ezib tashlaydigan darajada kichik bo’lmasin."
    },
    video: {
      title: "Pooling va qadam, vizual ravishda",
      description: "2x2 oyna belgilar xaritasini qanday qisqartirishini kuzating va pooling aynan qaysi tafsilotni tashlab yuborishini ko’ring."
    },
    activity: {
      prompt: "2x2 max-pool oynasini belgilangan hududga suring va chiqish katagiga tushadigan qiymatni o’qing.",
      feedback: {
        correct: "To’g’ri — max pooling eng baland javobni (9) saqlaydi va qolganini tashlaydi. Buni butun xarita bo’ylab qiling va u eng kuchli signallarini saqlab qisqaradi.",
        incorrect: "Faqat belgilangan to’rt katakka qarang. Max pooling ulardan ENG KATTASINI xabar qiladi — yig’indisini, o’rtachasini yoki minimalini emas."
      },
      data: {
        choices: [
          {
            why: "2x2 oyna 9, 1, 6, 8 ni qoplaydi. Max pooling eng katta yagona qiymatni, ya’ni 9 ni saqlaydi — o’sha hududdagi eng kuchli javob omon qoladi, qolganlari tashlanadi."
          },
          {
            why: "6 — 9, 1, 6, 8 ning O’RTACHASI ((9+1+6+8)/4 = 6). Buni average pooling qaytaradi — ammo bu oyna MAX pooling, shuning uchun javob eng katta qiymat, 9."
          },
          {
            why: "24 — to’rt katakning YIG’INDISI (9+1+6+8). Pooling hech qachon yig’maydi — max pooling eng katta yagona qiymatni (9) saqlaydi, jamini emas."
          },
          {
            why: "1 — oynadagi eng kichik qiymat. Max pooling eng kattasini saqlaydi, eng kichigini emas — bu biz saqlamoqchi bo’lgan kuchli signalni tashlab yuborardi."
          }
        ]
      }
    }
  },
  "cv-build-cnn": {
    explanation: "Endi qismlarni ishlaydigan tarmoqqa yig’ish vaqti keldi. CIFAR-10 — 10 ta sinfdagi (samolyot, mashina, qush, mushuk, ...) 60,000 ta kichkina 32x32 rangli foto. Hatto kichik CNN ni rasmlarda o’qitish ham og’ir, shuning uchun biz uni brauzeringizda ISHLATMAYMIZ — bepul bulutli GPU (Google Colab yoki Kaggle) dan foydalanamiz. Siz ikki yoki uchta konvolyutsiya blokini (Conv2d -> ReLU -> MaxPool) ustma-ust qo’yasiz, so’nggi belgilar hajmini tekislaysiz va bir nechta to’liq bog’langan qatlam bilan 10 ta chiqishga yakunlaysiz. So’ng bir necha epox o’qitasiz va test aniqligi tasodifiy ehtimoldan (10%) ancha o’sganini kuzatasiz.",
    example: {
      text: "PyTorch dagi minimal blok: nn.Conv2d(3, 16, kernel_size=3, padding=1) so’ng nn.ReLU() so’ng nn.MaxPool2d(2). Konvolyutsiya 3 kanalni 16 belgilar xaritasiga aylantiradi (o’lcham padding=1 bilan 32x32 da saqlanadi), ReLU manfiylarni nolga aylantiradi, va 2x2 pool uni 16x16 ga yarimlaydi. Chuqurroq borish uchun takrorlang, so’ng tekislang va klassifikatsiya qiling."
    },
    workedExample: {
      intro: "Daftarni ochishdan oldin, mana har bir CNN oldinga o’tishi (forward pass) bajaradigan shakl. Hajmni oqib o’tar ekan kuzating: kanallar o’sadi, fazoviy o’lcham qisqaradi.",
      steps: [
        "Kirish 3x32x32 (RGB). 1-blok: Conv2d(3->16, pad 1) 32x32 ni saqlaydi, ReLU, MaxPool2d(2) -> 16x16x16.",
        "2-blok: Conv2d(16->32, pad 1) 16x16 ni saqlaydi, ReLU, MaxPool2d(2) -> 8x8x32. E’tibor bering: H va W yarimlanar ekan chuqurlik ikki barobar oshdi.",
        "8*8*32 = 2048 sonni vektorga tekislang, Linear(2048 -> 64) -> ReLU -> Linear(64 -> 10) orqali o’tkazing. O’sha 10 ta logit CrossEntropyLoss ga uzatiladi; optimizator (masalan Adam) har qadamda har bir vaznni yangilaydi."
      ],
      takeaway: "CNN — bu chuqurlikni o’stiradigan va o’lchamni qisqartiradigan konvolyutsiya bloklari (Conv -> ReLU -> Pool), so’ng tekislash va har bir sinf uchun bitta logitga olib boruvchi kichik klassifikator boshi."
    },
    guided: {
      prompt: "forward() metodingizda birinchi nn.Linear qatlamidan oldin belgilar hajmiga nima sodir bo’lishi kerak va nega?",
      hints: [
        "Konvolyutsiya va pool qatlamlari 4D hajmda (batch, channels, height, width) ishlaydi. Linear qatlam esa tekis 2D shaklni (batch, features) kutadi.",
        "Siz har bir rasm uchun channels x height x width ni bitta uzun vektorga yig’ishingiz kerak.",
        "PyTorch da bu birinchi Linear dan oldin x = torch.flatten(x, 1) (yoki x.view(x.size(0), -1))."
      ],
      answer: "Birinchi Linear qatlamidan oldin hajmni (batch, features) ga tekislang — masalan torch.flatten(x, 1).",
      explanation: "Konvolyutsiya/pool qatlamlari 4D hajmni (batch, channels, H, W) chiqaradi, ammo to’liq bog’langan nn.Linear 2D (batch, features) kirishni kutadi. Siz har bir rasm hajmini avval bitta vektorga tekislashingiz kerak; buni unutish CNN qurishda eng keng tarqalgan shakl mosligi xatosidir."
    },
    goDeeper: {
      title: "Nega GPU va 'bir epox' nima beradi",
      body: "CNN har bir rasm uchun millionlab ko’paytir-qo’sh amallarini bajaradi, CIFAR-10 da esa har bir epoxda o’n minglab rasm bor — CPU sudralib qolardi, ammo GPU bu amallarni ulkan parallel ravishda bajarib, bir epoxni soniyalarda yakunlaydi. Bir epox = o’quv to’plamidan bir to’liq o’tish. Naqshni kuzating: test aniqligi dastlabki bir necha epoxda tez sakraydi, so’ng sekinroq ko’tariladi. Agar o’quv aniqligi ko’tarilishda davom etsa-yu, test aniqligi to’xtab qolsa yoki tushsa, siz ortiqcha moslasha boshlaysiz — aynan oldin o’lchagan o’quv-vs-test farqi, endi rasmlarda."
    },
    video: {
      title: "CIFAR-10 da birinchi CNN ingiz",
      description: "Konvolyutsiya bloklarini ustma-ust qo’ying, tekislang, klassifikatsiya qiling va bepul GPU da o’qiting — boshidan oxirigacha."
    },
    activity: {
      prompt: "GPU daftarini ochishdan oldin, tarmoqni qog’ozda yig’ing. CIFAR-10 uchun 2-blokli CNN qurish uchun qatlamlarni TARTIB bilan bosing: ikkita Conv → ReLU → Pool bloki, so’ng tekislash va klassifikator boshi. Joylashtirilgan qatlamni va undan keyingi hamma narsani olib tashlash uchun uni bosing.",
      feedback: {
        correct: "Bu kanonik CNN: ikkita Conv → ReLU → Pool bloki (chuqurlik 3→16→32 o’sar ekan H va W har blokda yarimlanadi), so’ng Flatten va 10 ta sinf bahosi bilan tugaydigan kichik Linear bosh. Endi daftarni bepul GPU da oching (Colab: Runtime → Change runtime type → GPU; Kaggle: Settings → Accelerator → GPU), aynan shu modelni quring, uni CIFAR-10 da 3–5 epox o’qiting va test aniqligi 10% dan ancha o’sganini tasdiqlang.",
        incorrect: "Bir blokdan yuring: Conv → ReLU → Pool, so’ng takrorlang, SO’NG bir marta Flatten va Linear → ReLU → Linear(→10) bilan yakunlang. Ikki klassik tuzoq: Flatten dan oldin Linear qatlamini qo’yish (4 o’lchamli hajm nn.Linear ga kira olmaydi) va aktivatsiyadan oldin pooling qilish."
      },
      data: {
        targetPrompt: "Quring: Conv → ReLU → Pool, Conv → ReLU → Pool, so’ng Flatten → Linear → ReLU → Linear(→ 10 sinf). Qatlamlarni tartib bilan bosing; joylashtirilgan qatlamni bosib undan boshlab olib tashlang.",
        tiles: [
          { note: "1-blok filtrlari" },
          { note: "nochiziqlilik" },
          { note: "namunani kamaytirish" },
          { note: "2-blok filtrlari" },
          { note: "nochiziqlilik" },
          { note: "namunani kamaytirish" },
          { note: "hajm → vektor" },
          { note: "yashirin bosh" },
          { note: "nochiziqlilik" },
          { note: "sinf bahosi" }
        ],
        mismatch: {
          flatten: "Flatten so’nggi konvolyutsiya blokidan KEYIN keladi, oldin emas — erta tekislash keyingi Conv2d ga kerak bo’lgan 2 o’lchamli joylashuvni buzadi.",
          fc1: "Linear (to’liq bog’langan) bosh 4 o’lchamli konvolyutsiya hajmini o’qiy olmaydi. Har qanday Linear qatlamidan oldin Flatten qo’yishingiz kerak.",
          fc2: "So’nggi Linear → 10 — eng oxirgi qatlam (har bir sinfga bitta baho). Undan keyin keladigan hech narsa o’rinli emas.",
          pool1: "Pooling aktivatsiyadan KEYIN namunani kamaytiradi — blok ichidagi tartib Conv → ReLU → Pool.",
          relu1: "ReLU (nochiziqlilik) belgilar xaritalarini hosil qilgan Conv dan keyin darhol keladi."
        }
      }
    }
  },
  "cv-feature-maps": {
    explanation: "O’qitilgan CNN siz uning belgilar xaritalariga QARAGANINGIZDA endi qora quti emas. Har bir filtr nimaga javob berishini vizuallashtirsangiz, aniq hikoya paydo bo’ladi. Birinchi qatlamlar o’ta oddiy aniqlovchilarni o’rganadi: turli burchaklardagi chekkalar, rang dog’lari, oddiy gradientlar — vizual alifbo. O’rta qatlamlar bularni teksturalar va kichik motivlarga birlashtiradi: chiziqlar, to’rlar, burchaklar. Chuqur qatlamlar ULARNI qismlar va butun ob’ektlarga birlashtiradi: ko’z, g’ildirak, itning yuzi. Har bir qatlam ostidagining naqshlari ustiga quriladi, aynan shuning uchun CNN bir necha blokda 'piksellar' dan 'ma’no' ga o’tadi. Bu shuningdek transfer learningning super-kuchini tushuntiradi (keyingi modul): o’sha dastlabki chekka/rang aniqlovchilari deyarli har qanday rasm vazifasi uchun foydali, shuning uchun ularni qayta ishlatishingiz mumkin.",
    example: {
      text: "Mashina fotosini o’qitilgan CNN orqali o’tkazing va uch chuqurlikdagi belgilar xaritalarini ko’zdan kechiring. 1-qatlam: bitta xarita har bir vertikal chekka bo’ylab yonadi, boshqasi yorqin-qizil hududlar bo’ylab. 3-qatlam: bitta xarita takrorlanuvchi panjara teksturasida yonadi. 6-qatlam: bitta kanal faqat g’ildirak bo’lgan joyda kuchli yonadi — u 'g’ildiraklik' ni o’rgangan."
    },
    workedExample: {
      intro: "Mana belgilar xaritalari to’plamini chuqurlik bo’yicha qanday o’qish kerak. Chuqurroq borgan sari javoblar abstraktroq va sinfga xosroq bo’ladi.",
      steps: [
        "Erta (1-2 qatlam): xaritalar chekkalar, burchaklar va rang dog’lariga javob beradi — umumiy, HAR QANDAY rasmda mavjud, bitta sinfga bog’lanmagan.",
        "O’rta (3-4 qatlam): xaritalar teksturalar va kichik qismlarga javob beradi — jun, chiziqlar, to’rlar — dastlabki chekkalarning birikmalari.",
        "Chuqur (so’nggi bloklar): xaritalar butun qismlar yoki ob’ektlarga javob beradi — yuz, g’ildirak, tumshuq — va bular tarmoq o’qitilgan sinflarga juda xos."
      ],
      takeaway: "Chuqurlik = abstraksiya. Dastlabki filtrlar umumiy chekka/rang aniqlovchilari (hamma joyda qayta ishlatiladigan); chuqur filtrlar xos ob’ekt-qismi aniqlovchilari (vazifaga moslashtirilgan)."
    },
    guided: {
      prompt: "Siz SO’NGGI konvolyutsiya blokidan belgilar xaritasini vizuallashtirasiz va u faqat itlarning yuzlarida yonadi. BIRINCHI qatlam belgilar xaritasi shunchalik xos bo’lishini kutarmidingiz? Nega yoki nega yo’q?",
      hints: [
        "Har bir qatlam nimadan qurilganini o’ylang. Birinchi qatlam faqat xom piksellarni ko’radi.",
        "'It yuzi' kabi xos tushunchalar qatlamlar bo’ylab ustma-ust qo’yilgan ko’plab oddiyroq naqshlarning birikmalaridir.",
        "Dastlabki filtrlar mushuk, mashina va itda bir xil paydo bo’ladigan umumiy narsalarda (chekkalar, ranglar) yonadi."
      ],
      answer: "Yo’q — birinchi qatlam xaritasi umumiy chekka/ranglarda yonadi, 'it yuzi' kabi xos tushunchada emas.",
      explanation: "Dastlabki filtrlarda ishlash uchun faqat xom piksellar bor, shuning uchun ular faqat har bir sinfda paydo bo’ladigan oddiy, umumiy naqshlarni (chekkalar, ranglar) aniqlay oladi. It yuzi kabi xos tushuncha esa o’sha oddiy aniqlovchilarni bir necha qatlam bo’ylab ustma-ust qo’yishni talab qiladi — aynan shuning uchun faqat CHUQUR qatlamlar sinfga xos javoblarni ko’rsatadi."
    },
    goDeeper: {
      title: "Nega bu transfer learningni ishlaydigan qiladi",
      body: "Dastlabki qatlamlar deyarli har qanday tabiiy-rasm vazifasi uchun bir xil umumiy vizual alifboni o’rgangani uchun, millionlab ImageNet fotolarida o’qitilgan tarmoq allaqachon ajoyib chekka, rang va tekstura aniqlovchilarini o’rgangan. Yangi, kichikroq rasm muammosiga duch kelganingizda, o’sha dastlabki qatlamlarni saqlab (muzlatib) qoldirib, faqat chuqur, vazifaga xos uchini qayta o’qitishingiz mumkin. Siz chekkalarni noldan o’rganish uchun ma’lumot yoki hisoblash quvvatisiz, o’sha barcha oldindan o’qitishning foydasini olasiz. Bu keyingi modulga ko’prik: klassik arxitekturalar va transfer learning."
    },
    video: {
      title: "CNN ning ko’zlari orqali ko’rish",
      description: "Sayozdan chuqurgacha belgilar-xaritasi vizualizatsiyalari va chekkalardan ob’ektlargacha yig’ilish."
    },
    activity: {
      prompt: "Filtrlar turli chuqurliklarda nimani o’rganishini o’rganing. Erta → O’rta → Chuqur bo’ylab qadam tashlang va aktivatsiya xaritalari umumiy chekkalardan sinfga xos ob’ekt qismiga o’tishini kuzating. So’ng savolga javob bering.",
      feedback: {
        correct: "To’g’ri — chuqurlik abstraksiyaga teng. Dastlabki filtrlar umumiy chekka/rang aniqlovchilari (hamma joyda qayta ishlatiladigan); chuqur filtrlar vazifaga moslashtirilgan xos ob’ekt-qismi aniqlovchilari. Aynan shu yig’ilish transfer learning ishlashining sababidir.",
        incorrect: "Siz o’rgangan uchta chuqurlikni solishtiring: Erta umumiy chekkada yonadi, Chuqur bitta ob’ekt qismida yonadi. Birinchi qatlam faqat xom piksellarni ko’radi, shuning uchun u 'it-yuziga xos' bo’la olmaydi — o’sha xoslik qatlam-baqatlam yig’iladi."
      },
      data: {
        layers: [
          {
            label: "Erta (1–2 qatlam)",
            caption: "Vertikal-chekka aniqlovchi: yorug’lik chapdan o’ngga o’zgargan har joyda yorqin chiziqda yonadi. Umumiy — bu naqsh mushuk, mashina va itda bir xil paydo bo’ladi."
          },
          {
            label: "O’rta (3–4 qatlam)",
            caption: "Tekstura/motiv aniqlovchi: ko’plab chekkalardan qurilgan, u takrorlanuvchi panjarasimon naqshga javob beradi. Chekkadan xosroq, ammo hali bitta sinfga bog’lanmagan."
          },
          {
            label: "Chuqur (so’nggi blok)",
            caption: "Ob’ekt-qismi aniqlovchi: bu bitta kanal FAQAT bitta hududda kuchli yonadi — u 'g’ildiraklik' / 'ko’zlik' ni o’rgangan. Juda sinfga xos, ostidagi barcha oddiyroq aniqlovchilardan qurilgan."
          }
        ],
        check: {
          question: "Siz SO’NGGI konvolyutsiya blokidan belgilar xaritasini vizuallashtirasiz va u faqat itlarning yuzlarida yonadi. BIRINCHI qatlam belgilar xaritasi shunchalik xos bo’lishini kutarmidingiz?",
          choices: [
            {
              label: "Yo’q — birinchi qatlam xaritasi umumiy chekka va ranglarda yonadi, 'it yuzi' kabi xos tushunchada emas.",
              why: "Dastlabki filtrlarda ishlash uchun faqat xom piksellar bor, shuning uchun ular har bir sinfda umumiy bo’lgan oddiy, umumiy naqshlarni (chekkalar, ranglar) aniqlaydi. It yuzi kabi xos tushuncha ko’plab oddiy aniqlovchilarni bir necha qatlam bo’ylab birlashtirib quriladi — aynan shuning uchun faqat CHUQUR qatlamlar sinfga xos javoblarni ko’rsatadi. (Shuningdek bu o’sha umumiy dastlabki qatlamlar deyarli har qanday rasm vazifasiga transfer bo’lishining sababidir.)"
            },
            {
              label: "Ha — har bir qatlam bir xil darajada xos, shuning uchun birinchi qatlam ham 'it yuzi' ni to’g’ridan-to’g’ri aniqlaydi.",
              why: "Xoslik chuqurlik bilan O’SADI. Birinchi qatlam faqat xom piksellarni ko’radi va yuqori darajadagi tushunchani ifodalay olmaydi; u umumiy chekka/ranglarda yonadi. 'It yuzi' faqat ko’plab qatlamlar o’sha oddiyroq naqshlarni birlashtirgandan keyin paydo bo’ladi."
            },
            {
              label: "Ha, chunki birinchi qatlam jigarrang jun rangini aniqlay oladi, bu asosan itni aniqlash bilan bir xil.",
              why: "Jigarrang dog’ni aniqlash — umumiy, dastlabki-qatlam javobi — va jigarrang son-sanoqsiz it-bo’lmagan narsalarda paydo bo’ladi (loy, yog’och, ayiqlar). Ishonchli 'it yuzi' aniqlovchisi faqat chuqur qatlamlar yig’adigan shakl va qism tuzilmasini talab qiladi."
            }
          ]
        }
      }
    }
  },
  "cv-architectures": {
    explanation: "Konvolyutsiya tarmoqlari birdaniga paydo bo’lmadi. Har bir mashhur arxitektura oldingisini to’sib turgan bitta to’siqni hal qildi. LeNet (1998) konvolyutsiyalar kichik rasmlarda qo’lda yozilgan raqamlarni o’qiy olishini isbotladi. AlexNet (2012) buni GPU lar, ReLU va dropout bilan kengaytirdi va ImageNet ni yutib dunyoni hayratga soldi. VGG (2014) ko’plab kichik 3x3 filtrlarni chuqur, bir tekis naqshda ustma-ust qo’yish a’lo ishlashini ko’rsatdi. ResNet (2015) esa 'chuqurroq yaxshiroq' taxminini buzdi: ma’lum nuqtadan keyin shunchaki ko’proq oddiy qatlam qo’shish tarmoqlarni o’qitishni QIYINROQ qilib, aslida YOMONROQ ball oldi, toki skip ulanishlar buni tuzatmaguncha.",
    example: {
      text: "56 qatlamli oddiy tarmoq 20 qatlamlidan ham o’quv, HAM test ma’lumotida yomonroq ball oldi — bu ortiqcha moslashuv emas, shunchaki o’qitib bo’lmasligi. Aynan shu kutilmagan natija keyingi darsning skip ulanishlarini turtki bo’ldi. Kattaroq avtomatik ravishda aqlliroq emas."
    },
    workedExample: {
      intro: "Vaqt chizig’ini tuzatishlar zanjiri sifatida o’qing. Har bir arxitekturani u qo’shgan bitta g’oya bo’yicha ko’rib chiqaman.",
      steps: [
        "LeNet-5 (1998): birinchi konvolyutsiya tarmog’i. Kichik kulrang raqamlar, bir necha konvolyutsiya + pooling qatlami. Konvolyutsiya qo’lda yozilgan belgilardan ustun ekanining isboti.",
        "AlexNet (2012): aynan o’sha g’oya, ancha kattaroq, ikkita GPU da o’qitilgan. ReLU aktivatsiyalari va dropout qo’shdi va ImageNet ni katta farq bilan yutdi — chuqur o’rganish portlashining uchquni.",
        "VGG (2014): oddiy, takrorlanuvchi retsept bilan chuqurga boring — faqat ko’p marta ustma-ust qo’yilgan 3x3 konvolyutsiyalar. Nafis va bir tekis, ammo parametrlarga og’ir.",
        "ResNet (2015): oddiy juda-chuqur tarmoqlar yomonlashishini payqadi va skip ulanishlarini qo’shdi, shunda 50, 101, hatto 152 qatlam nihoyat o’qiydi. Bu chuqurroq-har-doim-ham-yaxshiroq-emas darsi."
      ],
      takeaway: "Har bir arxitektura aynan bitta asosiy g’oyani qo’shdi; ResNet darsi shundaki, chuqurlik faqat uni qanday o’qitishni hal qilganingizdan keyin yordam beradi."
    },
    guided: {
      prompt: "Jamoa o’zining 18 qatlamli CNN ini 50 qatlamli ODDIY CNN (skip ulanishlarsiz) bilan almashtiradi va HAM o’quv, HAM test aniqligi yomonlashganini topadi. Bu ortiqcha moslashuvmi?",
      hints: [
        "Ortiqcha moslashuv o’quv ma’lumotida AJOYIB, ammo test ma’lumotida yomon degani — farq. Bu yerda hatto o’quv aniqligi ham tushdi.",
        "Agar tarmoq hatto o’quv ma’lumotini ham yaxshi moslay olmasa, muammo o’qitilish (optimizatsiya), umumlashtirish emas."
      ],
      answer: "Yo’q — bu optimizatsiya/o’qitilish muammosi, ortiqcha moslashuv emas.",
      explanation: "Ortiqcha moslashuv o’quv-vs-test FARQI sifatida ko’rinadi. Oddiy qatlamlar qo’shganingizda o’quv aniqligining o’zi tushsa, gradientlar chuqurlik bo’ylab oqishga qiynalmoqda. O’sha yomonlashish — aynan ResNet skip ulanishlari hal qilish uchun ixtiro qilingan muammodir."
    },
    goDeeper: {
      title: "Nega VGG 'qimmat' va ResNet 'samarali'",
      body: "VGG ning bir tekis 3x3 konvolyutsiya to’plamlari plyus ulkan to’liq bog’langan qatlamlari uni 100 million parametrdan ancha oshiradi, ularning aksariyati zich boshda. ResNet o’sha ulkan zich boshni global average pooling bilan almashtiradi va skip ulanishlari orqali belgilarni qayta ishlatadi, shuning uchun ResNet-50 ham chuqurroq, HAM VGG-16 (~138M) ga qaraganda kamroq parametrga (~25M) ega — shu bilan birga yaxshiroq ball oladi. Ko’proq qatlam, kamroq vazn, yuqoriroq aniqlik: g’alaba qozonadigan narsa xom hajm emas, arxitektura dizaynidir."
    },
    video: {
      title: "LeNet dan ResNet gacha",
      description: "To’rtta muhim CNN arxitekturasi va ularning har biri qo’shgan yagona g’oya bo’yicha boshlovchi sayohat."
    },
    activity: {
      prompt: "Har bir muhim arxitekturani u kiritgan asosiy g’oyaga moslang.",
      feedback: {
        correct: "Aynan — har bir arxitektura bitta hal qiluvchi g’oyani qo’shdi, va ResNet skip ulanishlari rezidual ulanishlar bo’yicha keyingi darsni tayyorlaydi.",
        incorrect: "Davrlar bo’yicha qayta bog’lang: LeNet boshladi, AlexNet uni GPU larda kengaytirdi, VGG kichik 3x3 filtrlarni chuqur ustma-ust qo’ydi, ResNet esa juda chuqur tarmoqlarni o’qitish uchun skip ulanishlarini qo’shdi."
      },
      data: {
        leftHead: "Arxitektura",
        rightHead: "Uning asosiy hissasi",
        pairs: [
          { right: "Birinchi ishlaydigan konvolyutsiya tarmog’i: kichik kulrang rasmlarda qo’lda yozilgan raqamlarni o’qidi" },
          { right: "GPU larda ReLU + dropout bilan kengaytirildi, ImageNet ni katta farq bilan yutdi" },
          { right: "Ustma-ust qo’yilgan 3x3 konvolyutsiyalarning oddiy takrorlanuvchi retsepti bilan chuqurga boring" },
          { right: "Skip ulanishlari juda chuqur tarmoqlarni (50+ qatlam) nihoyat o’qitsa bo’ladigan qiladi" }
        ]
      }
    }
  },
  "cv-residual": {
    explanation: "Rezidual ulanish qatlamning KIRISHINI to’g’ridan-to’g’ri uning chiqishiga qo’shadi: out = F(x) + x. Har bir blokni butun o’zgarishni noldan o’rganishga majburlash o’rniga, u faqat kirishni shunchaki o’tkazib yuborish ustiga kichik o’zgarishni ('rezidual' ni) o’rganishi kerak. Bu identiklik yorlig’i gradientlarga o’nlab yoki yuzlab qatlamlar bo’ylab orqaga oqish uchun toza shoh ko’cha beradi, shuning uchun tarmoqni signal so’nmasdan juda chuqur qilib bo’ladi. Bu shuningdek blok hech narsa qilmaslikni arzimas tarzda o’rganishi mumkinligini anglatadi (F(x)=0, shuning uchun out=x), shuning uchun ko’proq qatlam qo’shish hech qachon oddiy ustma-ust qo’yish kabi vaziyatni yomonlashtira olmaydi.",
    example: {
      text: "Estafeta poygasini tasavvur qiling, unda har bir yuguruvchi o’z bosqichini yugurishi YOKI tayoqchani to’g’ridan-to’g’ri marraga uzatishi mumkin. Bu imkoniyat bilan ko’proq yuguruvchi qo’shish hech qachon jamoani sekinlashtirmaydi — eng yomoni ular tayoqchani o’tkazib yuboradi. Skip ulanishlar har bir qatlamga o’sha 'o’tkazib yuborish' imkoniyatini beradi."
    },
    workedExample: {
      intro: "Keling, yorliq oldinga ham, orqaga ham nega yordam berishini kuzataylik.",
      steps: [
        "Oldinga: rezidual blok out = F(x) + x ni hisoblaydi, bu yerda F — konvolyutsiya qatlamlari. Xom kirish x o’rganilgan qism bilan yonma-yon o’zgarmagan holda olib o’tiladi.",
        "Oson identiklik: agar blok qila oladigan eng yaxshi narsa hech narsa qilmaslik bo’lsa, u shunchaki F(x) ≈ 0 ni o’rganadi, out ≈ x ni qoldiradi. Oddiy qatlamlar identiklik bo’lishni oson o’rgana olmaydi, shuning uchun ular zarar yetkazishi mumkin.",
        "Orqaga: gradient F orqali gradient nolga qarab qisqargan bo’lsa ham, +x yorlig’i bo’ylab to’g’ridan-to’g’ri oldingi qatlamlarga oqadi. Bu so’nuvchi-gradient to’xtashining oldini oladi.",
        "Natija: ResNet 50, 101 va 152 qatlamni o’qitdi va yaxshilanishda davom etdi, oddiy tarmoqlar esa ~20 qatlamdan keyin yomonlashgan edi."
      ],
      takeaway: "out = F(x) + x: yorliq gradientlarga oqishga imkon beradi va chuqur bloklarga xavfsiz tarzda hech narsa qilmaslikka qaytishga ruxsat beradi, shuning uchun chuqurlik la’nat bo’lishni to’xtatadi."
    },
    guided: {
      prompt: "Rezidual blokda konvolyutsiya yo’li F(x) nolga yaqin vaznlarni o’rganadi. Blok nimani chiqaradi va bu muammomi?",
      hints: [
        "Blok F(x) + x ni hisoblaydi. F(x) ≈ 0 ni qo’ying.",
        "Kirishni o’zgarmagan holda chiqarish qatlam zararsiz degani — u shunchaki signalni o’tkazib yuboradi."
      ],
      answer: "U ≈ x (identiklik) ni chiqaradi, bu yaxshi — blok kirishni zararsiz o’tkazib yuboradi.",
      explanation: "out = F(x) + x bo’lgani uchun, nolga yaqin F out ≈ x ni beradi. Arzon tarzda identiklikka aylanish qobiliyati aynan ko’proq rezidual blok ustma-ust qo’yish oddiy qatlamlar kabi unumdorlikni yomonlashtira olmasligining sababidir."
    },
    goDeeper: {
      title: "So’nuvchi gradientlar, intuitiv ravishda",
      body: "O’qitish har bir vaznni qatlam-baqatlam orqaga uzatilgan gradient yordamida yangilaydi, har bir qadam kichik sonlarga ko’paytiradi. Ko’plab oddiy qatlamlar bo’ylab o’sha ko’paytmalar nolga qarab qisqaradi, shuning uchun dastlabki qatlamlar deyarli yangilanmaydi — 'so’nuvchi gradient'. +x yorlig’i gradienti shunchaki 1 (x ning hosilasi 1) bo’lgan yo’l qo’shadi, shuning uchun konvolyutsiya yo’li qanday harakat qilishidan qat’i nazar, har doim qandaydir sog’lom gradient dastlabki qatlamlarga yetib boradi. O’sha bitta qo’shish chuqur o’rganish nihoyat juda chuqurga borishi mumkin bo’lganining ko’p qismidir."
    },
    video: {
      title: "Skip ulanishi",
      description: "out = F(x) + x gradient oqimini qanday qutqarishi va tarmoqlarning yuzlab qatlam chuqurlikka borishiga imkon berishi."
    },
    activity: {
      prompt: "Tadqiqotchilar skip ulanishlarni qo’shadi va o’qimaydigan oddiy 100 qatlamli tarmoq endi yaxshi o’qiydi. Skip ulanishlar nega yordam berganining ENG YAXSHI tushuntirishi qaysi?",
      feedback: {
        correct: "Aynan — identiklik yorlig’i gradient shoh ko’chasi va chuqur bloklarga xavfsiz tarzda hech narsa qilmaslikka imkon beradi. Bu chuqur tarmoqlar o’qitsa bo’ladigan bo’lganining asosiy sababi.",
        incorrect: "out = F(x) + x ga qayting. Yutuq — dastlabki qatlamlarga gradient oqimi (yorliq gradienti 1) plyus oson identiklik xaritalashi — qo’shimcha parametrlar yoki regularizatsiya emas."
      },
      data: {
        scenario: "Oldin: 100 qatlamli ODDIY CNN sayoz tarmoqdan yomonroq o’quv aniqligiga ega edi — gradientlar dastlabki qatlamlarda so’nayotgandek tuyulardi. Keyin: aynan shu chuqurlik rezidual ulanishlar (out = F(x) + x) bilan silliq o’qiydi va yuqoriroq ball oladi. Yorliq buni nega tuzatganining eng yaxshi sababini tanlang.",
        choices: [
          {
            label: "+x yorlig’i gradientlarga dastlabki qatlamlarga to’g’ridan-to’g’ri yo’l beradi va bloklarga identiklikka qaytishga imkon beradi, shuning uchun chuqurlik endi o’qitishni to’xtatmaydi.",
            why: "To’g’ri. Yorliq gradienti 1, shuning uchun konvolyutsiya yo’li gradienti qisqarganda ham signal dastlabki qatlamlarga yetib boradi; va F(x)=0 blokni zararsiz qiladi. Aynan shuning uchun juda chuqur tarmoqlar o’qitsa bo’ladigan bo’ldi."
          },
          {
            label: "Skip ulanishlar ko’plab yangi o’rganiladigan parametrlar qo’shadi, modelga ko’proq quvvat beradi.",
            why: "Yo’q — x ning oddiy qo’shilishi deyarli hech qanday parametr qo’shmaydi. Foyda gradient oqimi va oson identiklik xaritalashida, qo’shimcha quvvatda emas."
          },
          {
            label: "Ular dropout kabi ishlaydi va ortiqcha moslashuvni kamaytiradi, shuning uchun o’qitish yaxshilandi.",
            why: "Dastlabki muammo yomon O’QUV aniqligi (kam moslashuv/o’qitilish) edi, ortiqcha moslashuv emas. Skip ulanishlar optimizatsiyani tuzatadi, o’quv-vs-test farqini emas."
          },
          {
            label: "Ular belgilar xaritalarini qisqartiradi, shuning uchun har bir qatlamda qayta ishlanadigan ma’lumot kamroq.",
            why: "Skip ulanishlar belgilar xaritalarini qisqartirmaydi — ular kirishni qaytarib qo’shadi. Namunani kamaytirish qadam/pooling bilan amalga oshiriladi, bu alohida mexanizm."
          }
        ]
      }
    }
  },
  "cv-transfer": {
    explanation: "Ko’rish modelini noldan o’qitish katta ma’lumot va hisoblash quvvatini talab qiladi. Transfer learning buni o’tkazib yuboradi: allaqachon millionlab rasmda o’qitilgan tarmoqdan (masalan ImageNet dagi ResNet) boshlang, u chekkalar, teksturalar va shakllar kabi umumiy belgilarni o’rgangan. So’ng uni SIZNING vazifangizga moslashtiramiz. Ikki asosiy strategiya: belgi tizimini (backbone) MUZLATIB, faqat yangi so’nggi qatlamni o’qiting (ma’lumotlar to’plamingiz kichik va asl sohaga o’xshash bo’lganda eng yaxshi), yoki PAST o’rganish tezligi (learning rate) bilan belgi tizimining bir qismini yoki hammasini FINE-TUNING qiling (ko’proq ma’lumotingiz bo’lganda yoki soha o’zgarganda eng yaxshi). Noldan o’qitish kamdan-kam to’g’ri tanlov. Fine-tuning paytidagi asosiy xavf — falokatli unutish: yuqori o’rganish tezligi kichik ma’lumotlar to’plamingiz biror yaxshi narsa o’rgatishidan oldin foydali oldindan o’qitilgan belgilarni uchirib yuborishi mumkin.",
    example: {
      text: "Sizda 5 turdagi uy o’simligingizning 300 ta fotosi bor. ImageNet allaqachon barglar, chekkalar va yashil teksturalarni biladi. O’sha belgi tizimini muzlatib, faqat yangi 5 yo’nalishli klassifikator boshini o’qitish kichik ma’lumotlar to’plamida daqiqalarda o’rganadi — bu 300 rasmda tarmoqni noldan o’qitishdan ancha yaxshi, chunki noldan o’qitish shunchaki ortiqcha moslashardi."
    },
    workedExample: {
      intro: "IKKI narsaga asoslangan oddiy qaror qoidasidan foydalaning: qancha ma’lumotingiz bor va sohangiz oldindan o’qitish ma’lumotiga qanchalik o’xshash.",
      steps: [
        "Kichik ma’lumotlar to’plami + o’xshash soha (mushuk/it vs ImageNet): belgi tizimini MUZLATING, faqat yangi so’nggi qatlamni o’qiting. O’rganadigan parametr kam, ortiqcha moslashuv xavfi past.",
        "Kattaroq ma’lumotlar to’plami + o’xshash soha: yuqori qatlamlarni (va boshni) PAST o’rganish tezligi bilan FINE-TUNING qiling, shunda belgilarni vayron qilmasdan turtasiz.",
        "Kattaroq ma’lumot + haqiqiy soha o’zgarishi (masalan tibbiy skanerlar, sun’iy yo’ldosh): tarmoqning ko’proq qismini fine-tuning qiling, baribir ehtiyotkor past LR yoki jadval bilan.",
        "Deyarli hech qachon noldan o’qitmang, agar sizda ulkan ma’lumotlar to’plami bo’lib, oldindan o’qitilgan belgilar vazifangiz uchun befoyda bo’lmasa."
      ],
      takeaway: "Kichik + o’xshash => muzlating; ko’proq ma’lumot yoki soha o’zgarishi => falokatli unutishdan qochish uchun PAST o’rganish tezligi bilan fine-tuning qiling. Noldan — kamdan-kam istisno."
    },
    guided: {
      prompt: "Sizda 4 tur qush bo’yicha 250 ta belgilangan rasm bor va ImageNet da oldindan o’qitilgan ResNet dan (u allaqachon qushlarni o’z ichiga oladi) foydalanmoqchisiz. Belgi tizimini MUZLATASIZmi, butun narsani agressiv FINE-TUNING qilasizmi, yoki NOLDAN O’QITASIZmi?",
      hints: [
        "250 rasm — KICHIK ma’lumotlar to’plami, va qushlar ImageNet sohasiga O’XSHASH.",
        "Kichik + o’xshash — darslik bo’yicha 'belgi tizimini muzlating, faqat boshni o’qiting' holati. Kichik ma’lumotda agressiv fine-tuning falokatli unutish va ortiqcha moslashuv xavfini tug’diradi."
      ],
      answer: "Belgi tizimini muzlating va faqat yangi so’nggi klassifikatsiya qatlamini o’qiting.",
      explanation: "Oldindan o’qitilgan model allaqachon tushunadigan sohada kichik ma’lumotlar to’plami bilan xavfsiz, samarali tanlov — o’rganilgan belgilarni muzlatib, faqat yengil boshni o’qitish. Agressiv fine-tuning yaxshi belgilarni o’chirib yuborish (falokatli unutish) va shuncha kam rasmda ortiqcha moslashuv xavfini tug’diradi; noldan o’qitish ancha ko’proq ma’lumot talab qiladi."
    },
    goDeeper: {
      title: "Nega fine-tuning paytida PAST o’rganish tezligi muhim",
      body: "Oldindan o’qitilgan vaznlar allaqachon yo’qotish manzarasining yaxshi hududida. Katta o’rganish tezligi katta qadamlar tashlaydi, ular kichik ma’lumotlar to’plamingiz qayta o’rganish uchun yetarli signal berishidan oldin o’sha nozik moslashtirilgan belgilarni sochib yuborishi mumkin — falokatli unutish. Past o’rganish tezligidan (ko’pincha noldan ishlatadiganingizdan 10-100 marta kichikroq) foydalanish, qatlamlarni asta-sekin muzlatishdan chiqarish va ba’zan yangi bosh uchun alohida yuqoriroq LR — model allaqachon biladigan narsani saqlab, ohista moslashishiga imkon beradi."
    },
    video: {
      title: "Muzlatishmi yoki fine-tuning?",
      description: "Transfer learning uchun qaror qo’llanmasi va fine-tuning paytidagi falokatli-unutish tuzog’i."
    },
    activity: {
      prompt: "Daftarni oching, oldindan o’qitilgan ResNet18 ni kichik rasm ma’lumotlar to’plamida fine-tuning qiling, so’ng o’z-o’zini tekshirishga javob bering.",
      feedback: {
        correct: "Ajoyib — kichik + o’xshash belgi tizimini muzlatib, faqat boshni o’qitishni anglatadi, va har qanday fine-tuning past o’rganish tezligidan foydalanadi. Siz oldindan o’qitilgan ResNet dan professionallar qiladigan tarzda foydalandingiz.",
        incorrect: "Qoidani qayta tekshiring: tanish sohadagi kichik ma’lumotlar to’plami belgi tizimini muzlatib, faqat yangi boshni o’qitishni talab qiladi; fine-tuning, agar umuman ishlatilsa, falokatli unutishdan qochish uchun PAST o’rganish tezligini talab qiladi."
      },
      data: {
        goal: "Oldindan o’qitilgan ResNet18 ni transfer learning yordamida kichik maxsus ma’lumotlar to’plamiga moslashtiring va belgi tizimini muzlatish bilan uni fine-tuning qilish o’rtasidagi farqni his qiling.",
        steps: [
          "Runtime > Change runtime type > GPU, so’ng sozlash katagini ishga tushiring (u yangi hech narsa o’rnatmaydi — torch va torchvision Colab da oldindan o’rnatilgan).",
          "Oldindan o’qitilgan ResNet18 ni torchvision.models.resnet18(weights='IMAGENET1K_V1') bilan yuklang.",
          "A strategiyasi (MUZLATISH): belgi tizimida requires_grad=False qo’ying, model.fc ni sinflaringiz soniga o’lchamlangan yangi nn.Linear bilan almashtiring va faqat o’sha boshni bir necha epox o’qiting.",
          "B strategiyasi (FINE-TUNING): belgi tizimini muzlatishdan chiqaring va o’qitishni davom ettiring, ammo PAST o’rganish tezligini qo’ying (masalan 1e-4), shunda oldindan o’qitilgan belgilarni uchirib yubormaysiz.",
          "Ikkala strategiya uchun validatsiya aniqligi va o’qitish vaqtini solishtiring va fine-tune o’rganish tezligini baland ko’tarsangiz aniqlikka nima bo’lishini kuzating."
        ],
        check: {
          question: "Sizda ResNet allaqachon tushunadigan sohada (kundalik ob’ektlar) atigi ~300 rasm bor. Qaysi sozlash eng yaxshi, eng xavfsiz natijani beradi?",
          choices: [
            {
              label: "Belgi tizimini muzlating va faqat yangi so’nggi qatlamni (boshni) o’qiting.",
              why: "To’g’ri. Kichik ma’lumotlar to’plami + o’xshash soha — muzlatish holati: oldindan o’qitilgan belgilarni qayta ishlating va faqat yengil boshni o’rganing, bu tez va ortiqcha moslashuvga qarshilik qiladi."
            },
            {
              label: "Hammasini muzlatishdan chiqaring va tez moslashish uchun YUQORI o’rganish tezligi bilan fine-tuning qiling.",
              why: "Kichik ma’lumotda yuqori LR falokatli unutishga olib keladi — 300 rasm biror narsa o’rgatishidan oldin yaxshi oldindan o’qitilgan belgilarni sochib yuboradi. Agar umuman fine-tuning qilsangiz, past LR ishlating."
            },
            {
              label: "Oldindan o’qitilgan vaznlarni e’tiborsiz qoldiring va ResNet18 ni noldan o’qiting.",
              why: "Noldan o’qitish 300 rasmdan ancha ko’proq ma’lumot talab qiladi; u qattiq ortiqcha moslashadi. Transfer learning aynan shundan qochish uchun mavjud."
            },
            {
              label: "Asl 1000-sinfli ImageNet boshini saqlang va shunchaki uning chiqishlarini qayta belgilang.",
              why: "Oldindan o’qitilgan bosh ImageNet ning 1000 sinfini bashorat qiladi, sizniki emas. Siz so’nggi qatlamni sinflaringiz soniga o’lchamlangan qatlam bilan almashtirishingiz kerak."
            }
          ]
        }
      }
    }
  },
  "cv-augmentation": {
    explanation: "Ma’lumotlarni boyitish (data augmentation) sizda bor namunalarni o’zgartirish orqali yangi o’quv namunalarini yaratadi — aylantirish, kesish, biroz burish, yorqinlik/rangni o’zgartirish. U modelga mushuk siljitilgan, yorqinroq yoki ko’zguda aks etgan bo’lsa ham baribir mushuk ekanini o’rgatadi, bu umumlashtirishni bepulga yaxshilaydi. Oltin qoida: boyitish faqat to’g’ri javobni O’ZGARTIRMASA XAVFSIZdir. Biror o’zgartirish xavfsizmi — bu vazifaga bog’liq. Gorizontal aylantirish 'mushuk vs it' uchun zararsiz, ammo qo’lda yozilgan '6' ni buzadi (u ko’zgu aksiga aylanadi), yo’l belgisini (chapga burilish o’qi o’ngga burilish o’qiga aylanadi) yoki matnni. Kulranga aylantirish shaklga asoslangan vazifalar uchun yaxshi, ammo rangga bog’liq 'pishgan vs pishmagan meva' vazifasini vayron qiladi.",
    example: {
      text: "It fotosini gorizontal aylantiring: baribir aniq it — xavfsiz. '6' raqamini gorizontal aylantiring: u endi toza '6' bo’lmagan ko’zgu aksiga o’xshaydi — javob noto’g’ri, shuning uchun aylantirish raqam tanish uchun XAVFLI. Bir xil o’zgartirish, qarama-qarshi hukm, chunki vazifa boshqacha."
    },
    workedExample: {
      intro: "Har bir o’zgartirish uchun bitta savol bering: undan keyin JAVOB hali ham amal qiladimi? Mushuk-vs-it foto klassifikatori uchun bir nechtasini qanday baholashimni kuzating.",
      steps: [
        "Tasodifiy gorizontal aylantirish: ko’zguga aks etgan mushuk baribir mushuk. XAVFSIZ.",
        "Tasodifiy kesish / biroz kattalashtirish: qisman mushuk baribir mushuk. XAVFSIZ — va u modelga ob’ektlar markazdan tashqarida bo’lishi mumkinligini o’rgatadi.",
        "Kichik yorqinlik/rang o’zgarishi: biroz yorqinroq mushuk baribir mushuk. XAVFSIZ.",
        "Vertikal aylantirish (ag’darilgan): uy hayvonlarining haqiqiy fotolari kamdan-kam ag’darilgan, shuning uchun bu noreal ko’rinishni o’rgatadi — odatda tabiiy fotolar uchun XAVFLI/foydasiz, garchi javob texnik jihatdan amal qilsa ham."
      ],
      takeaway: "Xavfsiz boyitishlar javobni saqlaydi va vazifa uchun real qoladi; agar o’zgartirish to’g’ri javobni almashtirib qo’yishi mumkin bo’lsa, u xavfli."
    },
    guided: {
      prompt: "Siz qo’lda yozilgan raqamlar (0-9) uchun klassifikator qurayapsiz va TASODIFIY GORIZONTAL AYLANTIRISH boyitishini qo’shmoqchisiz. Yaxshi g’oyami?",
      hints: [
        "Oltin qoidani so’rang: har bir raqam uchun javob gorizontal aylantirishdan keyin omon qoladimi?",
        "'2', '3', '6' yoki '7' ni aylantiring — ko’zguga aks etgan raqam endi o’sha raqam emas (va 6 vs 9 chalkashligi yomonlashadi)."
      ],
      answer: "Yo’q — gorizontal aylantirish raqam tanish uchun XAVFLI.",
      explanation: "Ko’plab raqamlar chapdan-o’ngga simmetrik emas, shuning uchun gorizontal aylantirish boshqa (yoki yaroqsiz) javobli shaklni hosil qiladi. Modelga noto’g’ri javoblar o’rgatilardi. Raqamlar uchun xavfsiz muqobillar: kichik burishlar, ozgina siljishlar va kichik masshtablash."
    },
    goDeeper: {
      title: "Boyitish — bu sobit retsept emas, soha bilimi",
      body: "Universal boyitish ro’yxati yo’qligining sababi shundaki, 'javob o’zgaradimi?' butunlay siz nimani bashorat qilayotganingizga bog’liq. Gorizontal aylantirish: hayvonlar uchun yaxshi, matn/belgilar/raqamlar uchun halokatli. Kulrang: shakl vazifalari uchun yaxshi, 'pishgan vs pishmagan' yoki 'bu sim qizilmi yoki yashilmi?' uchun halokatli. Kuchli burish: sun’iy yo’ldosh tasvirlari uchun yaxshi (yuqori yo’q), ko’cha manzaralari uchun noto’g’ri (osmon yuqorida bo’lishi kerak). Boyitishlarni tanlash sizni muammongizda nima o’zgarishiga ruxsat berilgan va berilmaganini aniq aytishga majbur qiladi — bu haqiqiy soha bilimidir."
    },
    video: {
      title: "Xavfsiz va xavfli boyitish",
      description: "Nega mushukni aylantirish yaxshi, ammo '6' ni aylantirish xato, va istalgan o’zgartirishni qanday baholash."
    },
    activity: {
      prompt: "QO’LDA-YOZILGAN-RAQAM klassifikatori (0-9) uchun har bir boyitishni Xavfsiz (javob to’g’ri qoladi) yoki Xavfli (javobni o’zgartirishi mumkin) ga ajrating.",
      feedback: {
        correct: "To’g’ri — kichik geometrik va yorqinlik o’zgarishlari raqamning o’ziga xosligini saqlaydi, ammo aylantirishlar va 180° burish raqamlarni boshqa raqamlarga (6 <-> 9) yoki yaroqsiz shakllarga aylantiradi. Boyitish xavfsizligi har doim javob omon qoladimi yo’qmi haqida.",
        incorrect: "Har birini haqiqiy raqamda sinab ko’ring: '6' yoki '2' undan keyin ham bir xil ma’noni anglatadimi? Kichik burishlar/siljishlar/yorqinlik xavfsiz; raqamni ko’zguga aks ettirish yoki aylantirish uning javobini o’zgartiradi."
      },
      data: {
        buckets: [
          { label: "Xavfsiz (javob saqlanadi)" },
          { label: "Xavfli (javob o’zgarishi mumkin)" }
        ],
        tokens: [
          { label: "Bir necha gradusga burish" },
          { label: "Bir necha pikselga siljitish" },
          { label: "Ozgina kattalashtirish / masshtablash" },
          { label: "Kichik yorqinlik o’zgarishi" },
          { label: "Gorizontal aylantirish (ko’zgu)" },
          { label: "Vertikal aylantirish (ag’darish)" },
          { label: "180° burish (6 ni 9 ga aylantiradi)" }
        ]
      }
    }
  },
  "cv-detect-segment": {
    explanation: "Rasm vazifalari model NIMANI chiqarishi bo’yicha farq qiladi. Klassifikatsiya butun rasm uchun bitta javob bilan 'bu rasmda nima bor?' ga javob beradi (masalan 'mushuk'). Ob’ektni aniqlash (detection) har bir ob’ekt atrofida sinf plyus chegaralovchi QUTI chiqarib 'bu yerda qanday ob’ektlar bor VA qayerda?' ga javob beradi (masalan 'mushuk shu to’rtburchakda, it esa unisida'). Semantik/instans segmentatsiya yana ham nozikroq: u HAR BIR PIKSELni belgilaydi, qaysi piksellar qaysi ob’ektga tegishli ekanining aniq niqobini hosil qiladi — shunchaki quti emas, aniq shaklni chizadi. Klassifikatsiya -> detection -> segmentatsiya bo’ylab harakatlanganingizda chiqish boyroq va aniqroq bo’ladi (va o’quv ma’lumotlarini belgilash ancha qimmatlashadi).",
    example: {
      text: "Ko’cha fotosi: Klassifikatsiya 'ko’cha manzarasi' (bitta javob) deydi. Detection qutilar chizadi: 'mashina bu yerda, piyoda u yerda, svetofor yuqorida'. Segmentatsiya har bir pikselni bo’yaydi — yo’l piksellari, mashina piksellari, piyoda piksellari — shunda o’zi yuradigan mashina shunchaki dag’al quti emas, aniq yurish mumkin bo’lgan hududni biladi."
    },
    workedExample: {
      intro: "Har bir vazifani uning CHIQISHIga moslang, dag’aldan nozikgacha. Chiqish shakli — bu ochib beruvchi belgi.",
      steps: [
        "Klassifikatsiya: butun rasm uchun bitta javob. Chiqish = sinf nomi. Eng dag’al.",
        "Ob’ektni aniqlash: (sinf + chegaralovchi quti) juftliklari ro’yxati. Chiqish = javobli qutilar. Sizga QAYERDA ekanini taxminan aytadi.",
        "Segmentatsiya: har bir piksel uchun javob xaritasi (niqob). Chiqish = har bir ob’ektning aniq konturi. Eng nozik va eng aniq.",
        "Qoida: aniqroq chiqish => qimmatroq javoblar. Piksel niqoblarini chizish qutilarni belgilashdan ancha uzoq vaqt oladi, u esa bitta rasm darajasidagi javobdan uzoqroq."
      ],
      takeaway: "Klassifikatsiya = bitta javob; detection = javobli qutilar (qayerda); segmentatsiya = har bir piksel niqoblari (aniq shakl). Boyroq chiqish, qimmatroq javoblar."
    },
    guided: {
      prompt: "Tibbiy ilova skanerda o’smaning AYNAN maydonini, uning aniq konturigacha o’lchashi kerak. Bu qaysi vazifa — klassifikatsiya, detection yoki segmentatsiya?",
      hints: [
        "CHIQISH nima bo’lishi kerakligini so’rang: javobmi? qutimi? yoki aniq piksel darajasidagi konturmi?",
        "Aniq maydonni o’lchash aniq shaklni talab qiladi, ya’ni har bir piksel niqobini."
      ],
      answer: "Segmentatsiya — u o’smaning har bir piksel niqobini hosil qiladi.",
      explanation: "Chegaralovchi quti faqat dag’al to’rtburchak beradi, bitta javob esa joy haqida hech narsa bermaydi. Aniq maydonni o’lchash qaysi piksellar o’sma ekanini bilishni talab qiladi, bu esa aynan segmentatsiya chiqaradigan narsa."
    },
    goDeeper: {
      title: "Nega detection va segmentatsiya 'qiyinroq'",
      body: "Klassifikatsiyada har bir rasmga bitta chiqish bor, shuning uchun belgilash arzon va modelga faqat global xulosa kerak. Detection noma’lum SONDAGI ob’ektni joylashtirishi va quti koordinatalarini regressiya qilishi kerak, shuning uchun u har bir rasmda ko’plab bashoratni boshqaradi. Segmentatsiya potentsial millionlab pikselning har biri uchun javob qabul qilishi kerak, va uning o’quv niqoblarini qo’lda chizish mashaqqatli. O’sha progressiya — global javob, so’ng qutilar, so’ng piksellar — har bir qadam nega yanada murakkab modellarni (masalan hudud takliflari, niqob boshlari) va ancha qimmatroq annotatsiyani talab qilishining sababidir."
    },
    video: {
      title: "Rasmga uch xil qarash",
      description: "Klassifikatsiya, detection va segmentatsiya har biri nimani chiqarishi bo’yicha solishtiriladi."
    },
    activity: {
      prompt: "Har bir talabni u kerak bo’lgan ko’rish vazifasiga ajrating: Ob’ektni aniqlash (javobli qutilar) yoki Segmentatsiya (har bir piksel niqoblari).",
      feedback: {
        correct: "Aynan — sanash va dag’al 'qayerda' javobli qutilarni (detection) talab qiladi, aniq konturlar, maydonlar va piksel-aniq kesib olishlar esa har bir piksel niqoblarini (segmentatsiya) talab qiladi. Kerakli CHIQISH vazifani hal qiladi.",
        incorrect: "Har bir ish qanday chiqishni talab qilishini so’rang: har bir ob’ekt atrofida dag’al quti (detection) yoki aniq piksel darajasidagi kontur/maydon (segmentatsiya). 'Sanash' yoki 'taxminan joylashtirish' = detection; 'aniq maydon / aniq kesib olish' = segmentatsiya."
      },
      data: {
        buckets: [
          { label: "Detection (javobli qutilar)" },
          { label: "Segmentatsiya (har bir piksel niqoblari)" }
        ],
        tokens: [
          { label: "Fotodagi necha kishi borligini sanash" },
          { label: "To’xtash joyi ilovasi uchun har bir mashina atrofida quti chizish" },
          { label: "Eskizlar (thumbnail) uchun har bir yuzni taxminan joylashtirish" },
          { label: "O’smaning aniq maydoni va konturini o’lchash" },
          { label: "O’zi yuradigan mashina uchun har bir yo’l pikselini belgilash" },
          { label: "Fonni almashtirish uchun odamni aniq kesib olish" }
        ]
      }
    }
  },
  "cv-failures": {
    explanation: "Ko’rish modeli u o’qigan fotolar qanchalik halol bo’lsa shunchalik halol. U o’quv rasmlarini eng yaxshi ajratadigan har qanday naqshni o’rganadi — va ba’zan o’sha naqsh haqiqiy ob’ekt emas, yorliq (shortcut). Yangi fotolar o’quv ma’lumotidan farq qilganda (taqsimot o’zgarishi), javob bilan tasodifan bog’langan fon belgisiga tayanganda (soxta belgi) yoki ob’ektning bir qismi yashirilganda (to’silish), ishonchli ko’rinadigan bashoratlar jimgina parchalanadi.",
    example: {
      text: "'Bo’ri vs husky' klassifikatori sinovda ajoyib ball oldi — so’ng tabiatda muvaffaqiyatsizlikka uchradi. U 'fonda qor = bo’ri' ni o’rgangan edi, chunki deyarli har bir bo’ri fotosi qorda olingan. Husky ni qorga qo’ying va u 'bo’ri' deb baqiradi. Model bo’ri qanday ko’rinishini haqiqatan o’rganmagan; u fonni o’rgangan."
    },
    workedExample: {
      intro: "Uchta muvaffaqiyatsizlik tashqaridan bir xil ko’rinadi — noto’g’ri, ishonchli javob — ammo ularning ildiz sabablari boshqacha. Har birini quyidagini so’rab qanday nomlashimni kuzating: KIRISH o’zgardimi, model NOTO’G’RI belgiga tayandimi, yoki ob’ektning bir qismi YO’QmI?",
      steps: [
        "Yorqin kunduzgi yo’l fotolarida o’qitilgan model belgilarni qorong’ida va yomg’irda noto’g’ri belgilay boshlaydi. Belgilar normal — yorug’lik va ob-havo yangi. Ma’lumot u o’qiganidan uzoqlashdi. Bu TAQSIMOT O’ZGARISHI.",
        "'Sigir' aniqlovchi yaylov fotolarida ishlaydi, ammo plyajdagi sigirda ishlamaydi. Chuqurroq qarasak, deyarli har bir o’quv sigiri o’tda turgan, shuning uchun model yashirin 'yashil o’t' ga tayanardi. U sigirga emas, bog’langan fon belgisiga yopishdi. Bu SOXTA BELGI.",
        "To’liq yuzlarda o’qitilgan yuz-ochish modeli ro’molcha burun va og’zingizni yopganda sizni tanishni rad etadi. Ob’ekt to’g’ri va manzara normal — ammo uning yarmi yashirilgan. Bu TO’SILISH.",
        "E’tibor bering, tuzatish har safar boshqacha: o’zgarishga ko’proq xilma-xil ma’lumot kerak (tun, yomg’ir); soxta belgiga yomon bog’liqlikni buzadigan ma’lumot kerak (qumdagi sigirlar, qorsiz bo’rilar); to’silishga o’qitishda qisman-ko’rinish namunalari kerak."
      ],
      takeaway: "Ko’rish muvaffaqiyatsizligini tashxis qilish uchun uch savol bering: kirish taqsimoti o’zgardimi (o’zgarish), model bog’langan-ammo-ahamiyatsiz belgiga tayandimi (soxta), yoki ob’ekt qisman yashirilganmi (to’silish)?"
    },
    guided: {
      prompt: "Keling, birgalikda bittasini tashxis qilaylik.\n\nTeri yaralari klassifikatori 95% aniqlikka erishadi. Tekshiruvchilar o’quv to’plamida deyarli har bir xavfli foto yara yoniga qo’yilgan lineykani o’z ichiga olganini topadi (shifokorlar xavflilarini o’lchaydi). Model lineykali har qanday fotoni xavfli deb belgilaydi. Bu qanday muvaffaqiyatsizlik turi?",
      hints: [
        "Kirish fotolarining o’zi normal ko’rinadi va hech narsa yashirilmagan — shuning uchun bu taqsimot o’zgarishi yoki to’silish emas.",
        "So’rang: model haqiqiy yarani ishlatyaptimi, yoki o’quv ma’lumotida javob bilan shunchaki BOG’LANGAN narsanimi?",
        "Lineyka teri qismi emas. U shunchaki xavfli yaralar yonida paydo bo’lgan. Model fon belgisida yorliq oldi."
      ],
      answer: "Soxta belgi — model yaraning o’zini o’rganish o’rniga 'lineyka bor = xavfli' ni o’rgangan.",
      explanation: "Lineyka — soxta (bog’langan-ammo-ahamiyatsiz) belgi. U o’quv sinflarini tasodifan ajratdi, shuning uchun model unga tayandi. Davo — bog’liqlikni buzadigan ma’lumot: lineykasiz xavfli fotolar va lineykali xavfsiz fotolar, modelni yaraga qaytarib majbur qilish."
    },
    goDeeper: {
      title: "Nega modellar yorliqlarni yaxshi ko’radi",
      body: "Gradient tushish foydali-keyin-xavfli tarzda dangasa: u o’quv yo’qotishini kamaytiradigan ENG OSON naqshni topadi. Agar 'qor' yoki 'lineyka' sinflarni haqiqiy shakl va teksturani o’rganishdan kamroq harakat bilan ajratsa, model yorliqni oladi va to’xtaydi. Mana shuning uchun yuqori test aniqligi test to’plami aynan shu yorliqni baham ko’rganda yolg’on bo’lishi mumkin. Mustahkam baholash yorliq ataylab buzilgan ma’lumotda sinashni anglatadi (qordagi husky, qumdagi sigir) — bu aynan loyihada qiladigan 'buz-uni' tadqiqotining ruhidir."
    },
    video: {
      title: "Ishonchli modellar qanday muvaffaqiyatsizlikka uchraydi",
      description: "Uchta haqiqiy ko’rish muvaffaqiyatsizligi bo’yicha sayohat — taqsimot o’zgarishi, soxta yorliqlar va to’silish — va ularni qanday farqlash."
    },
    activity: {
      prompt: "Har bir muvaffaqiyatsizlik hisobotini o’qing va eng mos keladigan YAGONA ildiz sababni belgilang.",
      feedback: {
        correct: "Aynan — tana jismonan yashirilgan, shuning uchun bu birinchi navbatda to’silish. Qorong’i haqiqiy ikkinchi omil, ammo siz hukmron sabab bo’yicha tartiblaysiz: model ko’ra olmaydigan narsani klassifikatsiya qila olmaydi.",
        incorrect: "Aslida nima ko’rinishini qayta o’qing: faqat bosh va yelkalar, chunki mashina qolganini yashiradi. O’sha 'ob’ekt yashirilgan' fakti — to’silish, bu yerdagi hal qiluvchi sabab. Yorug’lik ikkilamchi hissa qo’shuvchi, asosiy yorliq emas."
      },
      data: {
        scenario: "O’zi yuradigan mashina tadqiqot jamoasi xavotirli hodisani qayd qiladi. Ularning piyoda aniqlovchisi deyarli faqat ochiq kunduzda tik yurayotgan odamlarning fotolarida o’qitilgan. Muvaffaqiyatsizlikda odam to’xtatib qo’yilgan mashina ortida poyabzal bog’lash uchun cho’nqayadi, shuning uchun qorong’ida faqat uning boshi va yelkalari ko’rinadi. Jamoa tezkor tartiblash yorlig’i uchun BITTA asosiy javob xohlaydi. Ular uch sabab orasida bahslashadi. AYNAN shu xatoning hukmron sababi uchun ENG yaxshi yagona yorliqni tanlang.",
        choices: [
          {
            label: "To’silish — tananing aksariyat qismi to’xtatilgan mashina ortida yashirilgan, shuning uchun aniqlovchi u hech qachon o’qimagan qisman odamni ko’radi.",
            why: "Bu xatoning belgilovchi xususiyati — ob’ekt jismonan yashirilgan, faqat bosh va yelkalar ko’rinadi. Yorug’likka mustahkam model ham ko’ra olmaydigan tana bilan qiynalardi. Tuzatish — qisman-ko’rinish kesimlari va ob’ekt-ortidagi namunalarda o’qitish."
          },
          {
            label: "Taqsimot o’zgarishi — qorong’i, o’qitish esa kunduzda edi, shuning uchun yorug’lik taqsimotdan tashqariga chiqdi.",
            why: "Qorong’i yorug’lik haqiqiy hissa qo’shuvchi omil va chinakam taqsimot o’zgarishi, ammo bu yerda ikkilamchi. Hukmron, hal qiluvchi muammo — piyoda asosan yashirilgan; cho’nqaygan, to’silgan tana mukammal kunduzda ham qiyin bo’lardi."
          },
          {
            label: "Soxta belgi — model 'yaqinda to’xtatilgan mashina = piyoda yo’q' ni o’rgangan.",
            why: "Hisobotda model mashinalar 'odam yo’q' degani kabi bog’langan fon belgisiga tayanganini ko’rsatadigan hech narsa yo’q. Bizga model mashinaning o’ziga tayanishi haqida dalil kerak bo’lardi. Ko’rinadigan, bevosita sabab — yashirilgan tana, ya’ni to’silish."
          }
        ]
      }
    }
  },
  "cv-adversarial": {
    explanation: "CNN rasmlarni sonlar to’ri sifatida ko’radi va ko’plab filtrlar bo’ylab vaznli piksel qiymatlarini yig’ib qaror qabul qiladi. Har bir qatlam shunchalik sezgir bo’lgani uchun, tajovuzkor har bir pikselga juda kichik, ehtiyotkorlik bilan tanlangan miqdorni qo’shishi mumkin — odam payqamaydigan darajada kichik — va o’sha ichki yig’indini qaror chegarasi ortiga itarishi mumkin. Rasm sizga bir xil ko’rinadi, ammo modelning soni ag’dariladi va javob almashadi. Modellar shakllarni biz ko’rgan tarzda 'ko’rmaydi'; ular arifmetikani o’qiydi.",
    example: {
      text: "Mashhur natija: panda ning toza fotosi ~58% ishonch bilan 'panda' deb tasniflanadi. Xira, tuzilmali shovqin naqshi qo’shing (odamlarga ko’rinmas — panda o’zgarmagandek ko’rinadi) va aynan shu tarmoq endi 99% ishonch bilan 'gibbon' deydi. Odam payqaydigan hech narsa o’zgarmadi. Modelning asosiy vaznli yig’indilari chegarani kesib o’tishga yetarlicha siljidi."
    },
    workedExample: {
      intro: "Keling, mexanizmni bitta filtr chiqishi bilan aniq qilaylik. Konvolyutsiya chiqish katagi — 3x3 bo’lakning vaznli yig’indisi. Rasmni zo’rg’a o’zgartiradigan darajada kichik buzilish o’sha yig’indini qanday siljitishi mumkinligini ko’rsataman — siljigan yig’indi esa javob almashinishining usulidir. Arifmetikani kuzating, chunki arifmetika butun hujumdir.",
      steps: [
        "3x3 rasm bo’lagini va o’rganilgan chekka filtrini (Sobel uslubidagi yadro) oling. Chiqish katagi — bo’lak va yadroning element-bo’yicha ko’paytmasi, to’qqiztasi ham yig’ilgan. Aytaylik toza bo’lak uchun o’sha yig’indi kichik musbat son — zo’rg’a 'bu yerda chekka bor' tomonida, chegara yonida.",
        "Endi tajovuzkor yadro IShORAlariga moslangan kichik buzilish qo’shadi: yadro musbat joyda biroz ko’proq, manfiy joyda biroz kamroq. Har bir piksel rasmda hech qachon ko’rmaydigan miqdorga siljiydi — ammo har bir turtki yig’indida AYNAN shu yo’nalishga itaradi.",
        "To’qqizta kichik moslangan turtki yig’iladi. Chiqish katagi har qanday bitta piksel o’zgarganidan ancha ko’proq sakrashi mumkin, chunki yadro muvofiqlashtirilgan o’zgarishlarni kuchaytiradi. Mana asosiy tushuncha: kichik har-piksel o’zgarishlari, ko’plab vaznlar bo’ylab yig’ilganda, modelning qaror qiymatida katta o’zgarishga aylanadi.",
        "Buni o’nlab filtrlar va ko’plab qatlamlar bo’ylab to’plang va siz panda-dan-gibbon-ga almashinishni olasiz: rasm vizual jihatdan bir xil, ammo to’plangan vaznli yig’indilar sinf chegarasini kesib o’tdi."
      ],
      takeaway: "Adversarial hujumlar yig’indidan foydalanadi: ko’rinmas darajada kichik buzilish, modelning vaznlariga moslangan bo’lganda, ko’plab piksel va filtrlar bo’ylab yig’ilib qaror-o’zgartiruvchi siljishga aylanadi. Rasm bir xil qoladi; matematika esa yo’q."
    },
    guided: {
      prompt: "Keling, birgalikda bittasini fikrlaylik.\n\nTajovuzkor klassifikatorni aldamoqchi, ammo o’zgarishni ko’rinmas saqlashi kerak — har bir piksel ko’pi bilan ±2 (0–255 shkalada) siljishi mumkin. U (A) piksellarni tasodifiy yo’nalishlarda siljitishi yoki (B) har bir pikselni model gradienti noto’g’ri sinfni eng ko’p oshiradi deb aytadigan yo’nalishda siljitishi mumkin. Qaysi biri modelning chiqishida kattaroq siljish keltirib chiqaradi va nega?",
      hints: [
        "Ikkala variant ham piksellarni bir xil kichik maksimal miqdorga o’zgartiradi, shuning uchun rasm har ikki holatda ham bir xilda o’zgarmagandek ko’rinadi.",
        "Ishlangan misolni o’ylang: yadro ishoralariga MOSLANGAN to’qqizta turtki hammasi yig’indini bir xil yo’nalishga itaradi; tasodifiy turtkilar qisman bir-birini yo’qqa chiqaradi.",
        "Gradient tajovuzkorga modelning qarorini itarish uchun har bir piksel aynan qaysi yo’nalishda siljishi kerakligini aytadi. Bu moslangan, yo’qqa-chiqmaydigan variant."
      ],
      answer: "B — har bir pikselni model gradienti bo’ylab siljitish ancha kattaroq siljish keltirib chiqaradi, garchi har-piksel o’zgarishi tasodifiy shovqin kabi ko’rinmas bo’lsa ham.",
      explanation: "Tasodifiy turtkilar turli yo’nalishlarda sochiladi va modelning vaznlari bilan yig’ilganda asosan bir-birini yo’qqa chiqaradi, shuning uchun qaror deyarli siljimaydi. Gradientga moslangan turtkilar hammasi vaznli yig’indilar bo’ylab bir xil yo’nalishga itaradi, shuning uchun ular katta siljishga to’planadi — ko’rinmas qolib javobni almashtirishga yetarli. Aynan shuning uchun adversarial namunalar shunchalik bezovta qiluvchi: bizga bir xil rasm, modelga butunlay boshqacha matematika."
    },
    goDeeper: {
      title: "Nega bu shunchaki xato emas",
      body: "Adversarial namunalar chuqur narsani ochib beradi: modelning qaror chegarasi juda yuqori o’lchamli piksel fazosida yashaydi, va o’sha fazoning aksariyati haqiqiy fotolardan uzoqda. Tabiiy rasm ishonchli rasmlarning ingichka 'manifold' ida o’tiradi; siz o’sha manifolddan kichik masofa CHEKKAGA chiqishingiz mumkin — odamlarga ko’rinmas, ular faqat manifolddagi rasmlarni taniydi — va model o’zboshimcha harakat qiladigan hududga tushishingiz mumkin. Mudofaalar mavjud (adversarial o’qitish, kirishni silliqlash, tasodifiy oldindan ishlov berish), ammo hech biri o’q o’tmas emas, shuning uchun adversarial mustahkamlik tajovuzkorga duch keladigan har qanday ko’rish tizimi uchun faol xavfsizlik tashvishidir — spam rasm filtrlaridan tortib avtonom haydashgacha."
    },
    video: {
      title: "Gibbon ga aylangan panda",
      description: "Ko’rinmas buzilish ishonchli bashoratni qanday almashtirishi va bu modellar haqiqatan qanday 'ko’rishi' haqida nima aytishi."
    },
    activity: {
      prompt: "Hujumni o’zingiz ishga tushiring. Buzilish kuchini (ε) 0 dan yuqoriga torting. Rasm vizual jihatdan deyarli bir xil qolar ekan, modelning bashorati — va uning ishonchi — qanday tebranishini, so’ng noto’g’ri sinfga almashinishini kuzating. So’ng savolga javob bering.",
      feedback: {
        correct: "To’g’ri — bu kichraytirilgan panda-dan-gibbon-ga almashinish. Ko’rinmas, vaznga-moslangan har-piksel turtkilari tarmoq yig’indilari bo’ylab to’planib ishonchli noto’g’ri javobga aylanadi. Modellar shakllarni emas, arifmetikani o’qiydi, shuning uchun adversarial mustahkamlik haqiqiy xavfsizlik tashvishidir.",
        incorrect: "Slayderni qayta o’qing: rasm vizual jihatdan bir xil qoladi, ammo bashorat ishonchli ravishda almashadi. Bu faqat buzilish modelning vaznlariga MOSLANGAN bo’lib, u to’planganda yuz beradi (tasodifiy shovqin bir-birini yo’qqa chiqarardi). Kichik moslangan o’zgarishlar → qaror qiymatida katta siljish."
      },
      data: {
        check: {
          question: "ε = 0 da model 'panda' deydi. ε ni oshirganingizda rasm zo’rg’a o’zgaradi, ammo chegaradan keyin u ishonchli ravishda 'gibbon' deydi. Bu model qanday 'ko’rishi' haqida nimani namoyish qiladi?",
          choices: [
            {
              label: "Odam payqamaydigan darajada kichik buzilish, modelning vaznlariga moslangan bo’lganda, ko’plab piksel va filtrlar bo’ylab qaror-o’zgartiruvchi siljishga to’planadi — shuning uchun rasm bir xil ko’ringani holda javob almashadi.",
              why: "Aynan ishlangan misoldagi mexanizm: har bir piksel ko’rinmas miqdorga siljiydi, ammo turtkilar vaznlarga moslangani uchun ular hammasi vaznli yig’indilarni bir xil yo’nalishga itaradi. Ko’plab piksel va filtrlar bo’ylab yig’ilganda, bu qaror qiymatida katta o’zgarishga aylanadi — sinf chegarasini kesib o’tishga yetarli. Bizga bir xil rasm, modelga boshqacha matematika."
            },
            {
              label: "Model shunchaki beqaror — o’sha o’lchamdagi har qanday tasodifiy shovqin bashoratni almashtirardi, shuning uchun bu haqiqatan 'hujum' emas.",
              why: "Aynan o’sha kichik o’lchamdagi tasodifiy shovqin barcha yo’nalishlarda sochiladi va model uni yig’ganda asosan bir-birini yo’qqa chiqaradi, shuning uchun qaror deyarli siljimaydi. Bu yerdagi xavf shundaki, buzilish gradient/vaznlarga MOSLANGAN — bu uni yo’qqa chiqishi o’rniga to’planadigan qiladi."
            },
            {
              label: "Rasm ko’p o’zgargan bo’lishi kerak — siz uni kichik to’rda ko’ra olmaysiz xolos.",
              why: "Har-piksel o’zgarishi haqiqatan juda kichik (bu yerda ±1, mashhur natija odamlarga ko’rinmas o’zgarishlardan foydalanadi). Rasm haqiqatan deyarli bir xil; chegarani kesib o’tgan narsa — ko’rinadigan rasm emas, modelning ichki vaznli yig’indilari."
            }
          ]
        }
      }
    }
  },
  "cv-project": {
    explanation: "Endi butun darajani bepul bulutli GPU da birlashtirish vaqti keldi. Siz oldindan o’qitilgan CNN ni (transfer learning) kichik rasm ma’lumotlar to’plamida fine-tuning qilasiz, uni ishlatasiz, so’ng o’z modelingizga ataylab hujum qilasiz: unga taqsimot-o’zgartirilgan, soxta-belgili, to’silgan va biroz buzilgan rasmlarni berasiz va u qayerda hamda nega buzilishini hujjatlashtirasiz. Ataylab buza oladigan model — siz haqiqatan tushunadigan modeldir.",
    example: {
      text: "Buni siz qurgan mashinani avariya-sinovidan o’tkazishdek tasavvur qiling. Toza test to’plamida 92% aniqlik olish — oson, mamnun qiladigan qism. Haqiqiy o’rganish — rasmlarni kulranga aylantirganingizda, ob’ektning yarmini kesib tashlaganingizda yoki xira shovqin qo’shganingizda — va ishonch yuqori qolib, javob noto’g’ri ketishini kuzatganingizda. O’sha buz-uni holatlari — siz yozadigan hikoyadir."
    },
    workedExample: {
      intro: "Mana toza buz-uni tadqiqotining shakli, hikoya qilingan. Maqsad shunchaki aniqlik emas — bu modul tushunchalarini har bir muvaffaqiyatsizlikka qaytarib bog’lab, model NEGA muvaffaqiyatsizlikka uchrashini ko’rsatadigan aniq oldin/keyindir.",
      steps: [
        "Aqlli o’qiting, noldan emas: oldindan o’qitilgan ResNet uslubidagi belgi tizimini yuklang, uni MUZLATING va kichik ma’lumotlar to’plamingizda faqat yangi so’nggi qatlamni o’qiting. Kichik ma’lumot + o’xshash soha muzlatish to’g’ri tanlov ekanini anglatadi — va u bepul GPU da daqiqalarda o’qiydi.",
        "Toza bazaviy ko’rsatkichni o’lchang: aniqlikni va bir nechta ishonchli to’g’ri bashoratni yozib oling. Bu sizning nazorat guruhingiz — 'ishlaydigan' bo’lmasa 'buzilgan' ni ko’rsata olmaysiz.",
        "Buz-uni batareyasini ishga tushiring: (a) taqsimot o’zgarishi — qorong’iroq/xiraroq yoki kulrang versiyalarda sinab ko’ring; (b) soxta tekshiruv — fonni almashtiring yoki bo’shating va javob fonga ergashadimi ko’ring; (c) to’silish — ob’ekt ustiga bo’lakni niqoblang; (d) kichik buzilish — kichik shovqin qo’shing va ishonchli almashinishlarni qidiring.",
        "Yozib chiqing: har bir buzilgan holat uchun sababni bu modul lug’atidan foydalanib nomlang (o’zgarish / soxta / to’silish / adversarial), ishonch yuqori qolganmi qayd eting va BITTA aniq tuzatish taklif qiling (ko’proq xilma-xil ma’lumot, bog’liqlikni-buzadigan ma’lumot, o’qitishda to’silish kesimlari, yoki adversarial o’qitish)."
      ],
      takeaway: "To’liq loyiha — bazaviy + buz-uni + tashxis: uni transfer learning bilan ishlating, so’ng to’rt yo’l bilan buzing va har bir muvaffaqiyatsizlikni modulning o’z atamalarida taklif qilingan tuzatish bilan tushuntiring."
    },
    guided: {
      prompt: "Daftarni ochishdan oldin, o’qitish strategiyasini qat’iylashtiring.\n\nMa’lumotlar to’plamingiz kichik (har bir sinfga taxminan 200 rasm) va sinflar (mushuk vs it) oldindan o’qitilgan ImageNet belgi tizimi allaqachon biladigan narsaga juda yaqin. Siz (A) butun tarmoqni tasodifiy vaznlardan o’qitishingiz, (B) belgi tizimini muzlatib faqat yangi so’nggi qatlamni o’qitishingiz, yoki (C) hammasini muzlatishdan chiqarib barcha qatlamlarni yuqori o’rganish tezligida fine-tuning qilishingiz kerakmi?",
      hints: [
        "Transfer-learning qoidasini eslang: kichik ma’lumotlar to’plami + o’xshash soha kuchli muzlatishga ishora qiladi.",
        "Noldan o’qitish har bir sinfga ~200 rasmdan ancha ko’proq talab qiladi — u qattiq ortiqcha moslashardi.",
        "Barcha qatlamlarda yuqori o’rganish tezligi falokatli unutish xavfini tug’diradi — belgi tizimi allaqachon o’rgangan foydali belgilarni vayron qiladi."
      ],
      answer: "B — oldindan o’qitilgan belgi tizimini muzlating va faqat yangi so’nggi qatlamni o’qiting.",
      explanation: "Kam ma’lumot va o’xshash soha bilan belgi tizimining umumiy belgilari (chekkalar, teksturalar, shakllar) allaqachon transfer bo’ladi, shuning uchun siz faqat uning ustida yangi qaror qatlamini o’rganishingiz kerak. Noldan o’qitish (A) ~200 rasmda qattiq ortiqcha moslashadi. Hammasini yuqori LR da fine-tuning qilish (C) falokatli unutish xavfini tug’diradi — transfer learningni ishlatadigan belgilarning o’zini o’chiradi. Agar keyinroq ancha ko’proq ma’lumot qo’shsangiz yoki katta soha o’zgarishiga duch kelsangiz, O’SHANDA chuqurroq qatlamlarni PAST o’rganish tezligi bilan fine-tuning qiling."
    },
    goDeeper: {
      title: "Buz-uni tadqiqotini nima ishonchli qiladi",
      body: "Ikki odat ishonchli tadqiqotni qo’l silkitishdan ajratadi. Birinchidan, bir vaqtning o’zida BITTA narsani o’zgartiring: agar bir vaqtda kulranga aylantirib VA to’ssangiz, muvaffaqiyatsizlikni biror narsaga bog’lay olmaysiz. Har bir stressorni ajrating, shunda har bir muvaffaqiyatsizlik bitta nomlangan sababga bog’lanadi. Ikkinchidan, bashorat yonida har doim ISHONCHni qayd eting. Qo’rqinchli, hisobotga arzigulik holatlar model noaniq bo’lganlari emas — ular u ishonchli ravishda noto’g’ri bo’lganlari (noto’g’ri sinfda yuqori softmax), chunki bu ishlab chiqarishda monitoringdan o’tib ketadigan narsadir. Yaxshi hisobot har bir muvaffaqiyatsizlikni uning sababi, ishonchi va bitta, aniq tuzatish bilan juftlaydi."
    },
    video: {
      title: "O’z modelingizni avariya-sinovidan o’tkazish",
      description: "Transfer-learning klassifikatori va to’rt yo’nalishli buz-uni tadqiqoti bo’ylab yurish, toza bazaviy ko’rsatkichdan ishonchli muvaffaqiyatsizliklargacha."
    },
    activity: {
      prompt: "Daftarni bepul GPU da oching, klassifikatoringizni transfer learning bilan o’qiting, buz-uni batareyasini ishga tushiring, so’ng topilmangizni qayd qilish uchun o’z-o’zini tekshirishga javob bering.",
      feedback: {
        correct: "Bu buz-uni tadqiqotining yuragi: ishonchli-ammo-noto’g’ri bashorat, to’g’ri sabab (soxta fon belgisi), va bog’liqlikni buzadigan tuzatish. Endi siz modelni o’qita HAM olasiz, uni qanday buzishni aniq tushuntira HAM olasiz.",
        incorrect: "Siz nimani o’zgartirganingizga e’tibor bering: faqat fon, hayvon esa to’liq ko’rinadi. Fonni — ob’ekt yoki manzara sharoitlarini emas — o’zgartirib javobni almashtirish soxta belgining barmoq izidir."
      },
      data: {
        goal: "Oldindan o’qitilgan CNN ni kichik rasm ma’lumotlar to’plamida fine-tuning qiling, toza bazaviy ko’rsatkichni o’rnating, so’ng uni to’rt yo’l bilan ataylab buzing (o’zgarish, soxta, to’silish, buzilish) va har bir muvaffaqiyatsizlikni uning sababi va tuzatishi bilan yozib chiqing.",
        steps: [
          "Daftarni oching va runtime ni GPU ga o’zgartiring (Colab da: Runtime → Change runtime type → GPU; Kaggle da: GPU tezlatkichni yoqing).",
          "Kichik rasm ma’lumotlar to’plamini yuklang (taqdim etilgan mushuk-vs-it qism to’plami, ~200 rasm/sinf) va uni train/validation ga bo’ling.",
          "Oldindan o’qitilgan ResNet belgi tizimini yuklang, uni MUZLATING va sinflaringiz uchun yangi so’nggi klassifikatsiya qatlamini biriktiring.",
          "Faqat so’nggi qatlamni bir necha epox o’qiting; toza validatsiya aniqligini qayd eting va 3 ta ishonchli to’g’ri bashoratni bazaviy ko’rsatkich sifatida saqlang.",
          "Buz-uni batareyasi, bir vaqtda bitta stressor: (a) test rasmlarini kulranga aylantiring yoki qorong’ilashtiring (taqsimot o’zgarishi); (b) fonlarni bo’shating yoki almashtiring (soxta-belgi tekshiruvi); (c) hayvon ustiga bo’lakni niqoblang (to’silish); (d) xira tasodifiy shovqin qo’shing (oddiy buzilish).",
          "Har bir buz-uni holati uchun yangi bashoratni VA uning ishonchini qayd eting, so’ng sababni bu modul lug’atidan foydalanib belgilang va bitta aniq tuzatish taklif qiling.",
          "Qisqa stsenariy yozib chiqing: bazaviy aniqlik, eng qiziq ishonchli-ammo-noto’g’ri muvaffaqiyatsizligingiz, uning nomlangan sababi va siz joriy qiladigan tuzatish."
        ],
        check: {
          question: "Buz-uni tadqiqotingizda model o’tli fonni oddiy oqqa bo’shatib qo’ygan rasmda 96% ishonch bilan 'it' deb qoladi — aslida bu mushuk. Toza versiya to’g’ri edi. Qaysi yozuv bu topilmani ENG yaxshi aks ettiradi?",
          choices: [
            {
              label: "Soxta belgi: model fonga tayandi (o’t/ochiq-havo belgilari o’qitishda 'it' bilan bog’langan edi); uni olib tashlash modelni chalkashtirdi, ishonch esa yuqori qoldi. Tuzatish: fon-sinf bog’liqligini buzadigan o’quv rasmlarini qo’shing.",
              why: "Fonni — hayvonni emas — bo’shatish bashoratni o’zgartirdi, bu soxta fon belgisining imzosidir. Noto’g’ri sinfda yuqori ishonch aynan xavfli, hisobotga arzigulik holatdir. To’g’ri tuzatish bog’liqlikni har bir sinf uchun ko’proq xilma-xil fonlar bilan buzadi."
            },
            {
              label: "Adversarial namuna: sezilmas buzilish javobni almashtirdi.",
              why: "Fonni bo’shatish — katta, to’liq ko’rinadigan o’zgarish, ko’rinmas har-piksel buzilishi emas. Adversarial namunalar kichik va modelning gradientiga moslangan; bu esa soxta-belgi muvaffaqiyatsizligi."
            },
            {
              label: "To’silish: hayvonning bir qismi yashirilgan, shuning uchun model ob’ektni yo’qotdi.",
              why: "Siz fonni o’zgartirdingiz, hayvonni emas — mushukning o’zi to’liq ko’rinadi. To’silish — OB’EKT yashirilganda. Bu yerda model fonga ergashdi, ya’ni soxta belgi."
            },
            {
              label: "Taqsimot o’zgarishi: yorug’lik va ob-havo taqsimotdan tashqariga chiqdi.",
              why: "Yorug’lik yoki ob-havo haqida hech narsa o’zgarmadi — faqat fon mazmuni. Hal qiluvchi ipucha shundaki, fonni (manzara sharoitlarini emas) almashtirish javobni o’zgartirdi, bu soxta belgiga ishora qiladi."
            }
          ]
        }
      }
    }
  }
};

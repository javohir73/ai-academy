/* Uzbek (Latin) body translations for Level 2 lessons. Keyed by stable id.
   Merged onto the English lesson body by the generic deepOverlay resolver:
   strings override by path, arrays by index, objects by key. Logic/non-string
   fields are omitted (the resolver keeps the English value). */

export const BODY_L2 = {
  'what-ml': {
    explanation:
      'Machine Learning (ML) — sun’iy intellekt yaratishning bir usuli. Inson har bir qoidani qo’lda yozish o’rniga, biz kompyuterga ko’plab misollarni ko’rsatamiz va u qoliplarni o’zi topib oladi. Mashinaviy o’rganish loyihasi bir nechta aniq bosqichlardan o’tadi.',
    example: {
      text:
        'Spam xatlarning har biri uchun hech kim qoida yozmagan. Buning o’rniga biz filterga minglab "spam" va "spam emas" xabarlarni ko’rsatdik, u esa ularni bir-biridan ajratuvchi qoliplarni o’rgandi.',
    },
    workedExample: {
      intro:
        'Keling, bitta spam filterini boshidan oxirigacha butun mashinaviy o’rganish quvuri (pipeline) bo’ylab birgalikda kuzatib chiqaylik.',
      steps: [
        'Ma’lumot: biz minglab xatlarni to’playmiz, ularning har biri allaqachon "spam" yoki "spam emas" deb belgilangan. Ana shu belgilangan to’plam — ma’lumot.',
        'O’qitish (Training): dastur o’sha xatlarni o’rganib, qaysi so’zlar va qoliplar odatda spamni bildirishini aniqlaydi. Aynan shu yerda o’rganish sodir bo’ladi.',
        'Model: o’qitish natijasi — model, ya’ni o’rganilgan qoliplarni o’zida saqlovchi qism.',
        'Bashorat: yangi xat keladi, model uni o’qib, eng yaxshi taxminini beradi: spam yoki yo’q.',
        'Fikr-mulohaza (Feedback): model adashganda va biz uni tuzatganimizda, o’sha xato keyingi versiyani yaxshilash uchun qaytarib beriladi.',
      ],
      takeaway:
        'Ma’lumot → O’qitish → Model → Bashorat → Fikr-mulohaza. O’qitishdan oldin ma’lumot kerak, bashorat qilishdan oldin esa o’qitilgan model kerak.',
    },
    guided: {
      prompt:
        'Keling, quvurning faqat boshini birgalikda tartiblaylik. Qaysi biri birinchi bo’lishi kerak — O’qitish yoki Ma’lumot?',
      hints: [
        'O’qitishning umuman sodir bo’lishi uchun unga aslida nima kerakligini o’ylab ko’ring.',
        'Model faqat o’ziga berilgan misollarni o’rgana oladi. Demak, har qanday o’rganish boshlanishidan oldin biror narsa mavjud bo’lishi kerak.',
        'Spam filteri kabi: dastur biror narsani o’rganishidan oldin biz belgilangan xatlarni to’plashimiz kerak edi.',
      ],
      answer: 'Avval Ma’lumot, keyin O’qitish keladi.',
      explanation:
        'O’qitish — bu modelning misollarni o’rganishi, shu sababli misollar (ma’lumot) avval to’planishi kerak. Hali mavjud bo’lmagan ma’lumotdan hech narsa o’rganib bo’lmaydi.',
    },
    goDeeper: {
      title: '"Qoliplarni topish" aslida nimani anglatadi?',
      body:
        'Model ichida ko’plab sozlanadigan sonlar bor, ular vaznlar (weights) deb ataladi. Boshida ular deyarli tasodifiy, shuning uchun model yomon taxmin qiladi. O’qitish har bir taxmin qanchalik noto’g’ri ekanini o’lchaydi — bu farq xato (yoki loss) deyiladi — va vaznlarni xatoni kamaytirish uchun ozgina suradi. Buni minglab misollarda takrorlasangiz, vaznlar haqiqiy qoliplarni aks ettiruvchi qiymatlarga keladi. "O’rganish" — bu shunchaki xatoni kamaytirish uchun sonlarni sekin sozlash.',
      formulaLegend: [
        { plain: 'bu taxmin qanchalik adashgani — o’qitish uni qisqartirishga harakat qiladi' },
        { plain: 'modelning hozirgi eng yaxshi taxmini' },
        { plain: 'o’quv ma’lumotlaridan olingan haqiqiy javob' },
      ],
    },
    video: {
      title: 'Mashinalar misollardan qanday o’rganadi',
      description:
        'Kompyuterga ko’plab misollarni ko’rsatish unga qoliplarni qo’lda yozilgan qoidalarsiz, o’zi kashf etishga qanday imkon berishini ko’ring.',
    },
    activity: {
      prompt:
        'Mashinaviy o’rganish loyihasi beshta bosqichdan o’tadi. Har bir bosqichni to’g’ri tartibda joylashtirish uchun ustiga bosing — Ma’lumotdan boshlang.',
      feedback: {
        correct:
          'Mana shu mashinaviy o’rganish quvuri. Ma’lumot modelni o’qitadi, model bashorat qiladi, fikr-mulohaza esa unga vaqt o’tishi bilan yaxshilanishga yordam beradi.',
        incorrect:
          'Hali to’g’ri tartib emas. Oqimga rioya qiling: o’qitishdan oldin ma’lumot kerak, bashorat qilishdan oldin esa o’qitilgan model kerak.',
      },
      data: {
        stages: [
          { label: 'Ma’lumot', desc: 'Model o’rganishi uchun ko’plab misollar to’playmiz.' },
          { label: 'O’qitish', desc: 'Model misollarni o’rganib, qoliplarni topadi.' },
          { label: 'Model', desc: 'O’qitilgan model — qoliplarni o’zlashtirib olgan qism.' },
          { label: 'Bashorat', desc: 'Model o’zi ko’rmagan yangi narsa haqida eng yaxshi taxminni qiladi.' },
          { label: 'Fikr-mulohaza', desc: 'Taxminlarni tekshiramiz va xatolardan modelni yaxshilashda foydalanamiz.' },
        ],
      },
    },
  },
  'training-data': {
    explanation:
      'O’quv ma’lumotlari — modelga o’rganish uchun beradigan misollar to’plami. Eng yaxshi o’quv ma’lumotlarida model haqiqatda duch keladigan real dunyoga o’xshash ko’plab misollar bo’ladi. Misollar juda kam bo’lsa yoki ularning hammasi bir xil ko’rinishda bo’lsa, model kuchsiz chiqadi.',
    example: {
      text:
        'Modelni itlarni tanishga o’rgatish uchun unga minglab it suratlarini ko’rsatasiz — katta itlar, kichik itlar, turli ranglar, ichkarida va tashqarida. Agar faqat momiq oq kuchukchalarni ko’rsatsangiz, u qora Labradorni tanimaydi.',
    },
    workedExample: {
      intro:
        'Keling, "har qanday itni tanish" modeli uchun o’quv to’plamini tuzaylik va nima kiritish kerakligini ovoz chiqarib o’ylab ko’raylik.',
      steps: [
        'Avval model duch keladigan real dunyoni tasavvur qilaman: har xil o’lcham, rang va zotdagi itlar, ichkarida va tashqarida, yaxshi va yomon yorug’likda.',
        'Shuning uchun ataylab xilma-xillik to’playman — mitti chihuahualar va ulkan mastiflar, qora, jigarrang va oq junli itlar, telefon va kameralarda olingan suratlar.',
        'Bir tuzoqdan qochaman: faqat momiq oq kuchukchalar uyumi ko’p ko’rinadi, lekin u tor. Model qora Labrador qanday ko’rinishini hech qachon o’rganmaydi.',
      ],
      takeaway:
        'Kuchli o’quv ma’lumotlari model haqiqatda duch keladigan real dunyoga o’xshaydi — keng va xilma-xil, faqat bir xil narsaning ko’pligi emas.',
    },
    guided: {
      prompt:
        'Keling, bittasini birgalikda tahlil qilaylik. Bir jamoada 5 000 ta surat bor — lekin har biri momiq oq kuchukcha. Modelga eng ko’p qaysi bitta o’zgarish yordam beradi?',
      hints: [
        'Muammo suratlar sonida emas. Qanday xilma-xillik yetishmayotganini o’ylab ko’ring.',
        'Model hech qachon katta, qora yoki kalta junli it ko’rmagan. Buni unga nima o’rgatadi?',
        'O’sha kuchukchalardan yana qo’shish deyarli hech narsa bermaydi. Turli zot, o’lcham va ranglar qo’shish bo’shliqlarni to’ldiradi.',
      ],
      answer: 'Itning ko’plab boshqa zotlari, o’lchamlari va ranglaridagi suratlarini qo’shing.',
      explanation:
        'Deyarli bir xil suratlarning kattaroq uyumi baribir tor bo’lib qoladi. Xilma-xillik — zot, o’lcham, rang va muhit bo’yicha — modelga hech qachon ko’rmagan itlarini tanishga imkon beradi.',
    },
    goDeeper: {
      title: 'Nega ma’lumotni uchta to’plamga bo’lamiz',
      body:
        'Jamoalar kamdan-kam barcha ma’lumotni bir vaqtning o’zida o’qitadi. Ular uni bo’ladi: model o’rganadigan o’quv to’plami, qurish jarayonida sozlamalarni rostlash uchun ishlatiladigan validatsiya to’plami va eng oxirigacha model ko’rmaydigan ajratib qo’yilgan sinov (test) to’plami. Sinov to’plami — halol imtihon: u modelning oldindan yodlab olgan emas, balki chinakam yangi misollarda qanday ishlashini ko’rsatadi. Buning teskari tomonini Ortiqcha moslashuv (overfitting) darsida uchratasiz.',
    },
    video: {
      title: 'Nega yaxshi ma’lumot muhim',
      description:
        'O’quv to’plamini nima kuchli qiladi — va kuchsiz yoki tor ma’lumot modelni qanday qilib bilintirmay adashtiradi.',
    },
    activity: {
      prompt:
        'Siz modelni har turdagi itlarni tanishga o’rgatyapsiz. Eng yaxshi o’quv to’plamini tanlang, so’ng tekshiring.',
      feedback: {
        correct:
          'To’g’ri. Model real dunyoda ko’radigan narsalarga mos keladigan ko’plab xilma-xil misollar eng yaxshi o’quv ma’lumotlarini tashkil etadi.',
        incorrect:
          'Ko’proq misol va ko’proq xilma-xillikka intiling. Bir-biriga o’xshash bir nechta surat — yoki noto’g’ri mavzu — modelni real dunyoga tayyorlamaydi.',
      },
      data: {
        options: [
          {
            title: 'Bitta golden retriverning 10 ta surati',
            sample: 'Bir xil it, bir xil xona, bir xil burchak.',
            why: 'Misollar juda kam, ustiga ularning hammasi bir xil ko’rinadi. Model faqat shu bitta itni o’rganadi.',
          },
          {
            title: '5 000 ta xilma-xil it surati',
            sample: 'Ko’plab zot, o’lcham va ranglar, turli muhitlarda olingan.',
            why: 'Real dunyoga mos keladigan ko’plab xilma-xil misollar — bu yerdagi eng yaxshi o’quv ma’lumotlari.',
          },
          {
            title: '5 000 ta mushuk surati',
            sample: 'Hammasi mushuk, umuman it yo’q.',
            why: 'Noto’g’ri misollar. Model itlarni emas, mushuklarni topishni o’rganadi.',
          },
        ],
      },
    },
  },
  'features-labels': {
    explanation:
      'Belgi (feature) — modelga beradigan ipuchimiz (kirish). Javob (label) — biz qaytarib olishni istagan natija (chiqish). O’qitish davomida model ipuchilar to’g’ri javob bilan qanday bog’lanishini o’rganadi.',
    example: {
      text:
        'Uy narxini bashorat qilish uchun belgilar — bu xonalar soni, maydoni va joylashuvi kabi ipuchilar. Javob — narx. Model ipuchilar javobga qanday olib borishini o’rganadi.',
    },
    workedExample: {
      intro:
        'Keling, bitta kundalik bashoratni olib, uni belgilar va javobiga ajratamiz, qaysi biri qaysi ekanini ovoz chiqarib o’ylab ko’ramiz.',
      steps: [
        'Xat spam yoki yo’qligini bashorat qilishni tasavvur qiling. Avval so’rayman: men qaytarib olmoqchi bo’lgan javob nima? Bu — javob (label): "spam" yoki "spam emas".',
        'Keyin so’rayman: qaror qabul qilishimga qaysi ipuchilar yordam beradi? Mavzu satridagi so’zlar, pul haqida baqirayotgani, nechta havola borligi. O’sha ipuchilar — belgilar (features), ya’ni kiruvchi kirishlar.',
        'Ularni saf qilaman: belgilar (ipuchilar) IChGA kiradi, javob (label) esa TAShQARIga chiqadi. Modelning butun vazifasi — ular orasidagi bog’lanishni o’rganish.',
        'Tez tekshiruv meni adashtirmaydi: agar biror narsa men bashorat qilmoqchi bo’lgan narsa bo’lsa, u — javob; agar bu men allaqachon bilgan ipuchi bo’lsa, u — belgi.',
      ],
      takeaway:
        'Belgilar — ichkariga beradigan ipuchilaringiz; javob — chiqarib olmoqchi bo’lgan natijangiz. Har birini to’g’ri nomlash — har qanday bashoratni sozlashning birinchi qadami.',
    },
    guided: {
      prompt:
        'Keling, bittasini birgalikda saralaylik. Siz model ishlatilgan avtomobilning sotuv narxini uning yurgan masofasi, yoshi va brendidan bashorat qilishini istaysiz. Shu to’rt narsadan qaysi biri javob, qaysilari belgilar?',
      hints: [
        'Avval so’rang: siz bashorat qilmoqchi bo’lgan yagona narsa nima? Bu — javob.',
        'Allaqachon bilib, ipuchi sifatida ichkariga beradigan boshqa hamma narsa — belgi.',
      ],
      answer: 'Javob — sotuv narxi. Belgilar — yurgan masofa, yosh va brend.',
      explanation:
        'Narx — siz modeldan olishni istagan javob, shuning uchun u — javob (chiqish). Yurgan masofa, yosh va brend — siz allaqachon bilib, bashorat qilish uchun ichkariga beradigan ipuchilar, shuning uchun ular — belgilar (kirishlar). Model shu uchta ipuchi narxga qanday birikishini o’rganadi.',
    },
    goDeeper: {
      title: 'Yaxshi belgilar ko’pincha murakkabroq modeldan ustun keladi',
      body:
        'Hamma ishni model qiladi deb o’ylash vasvasasi bor, lekin siz tanlagan belgilar ham xuddi shunchalik muhim. Narx bashoratchisiga faqat avtomobilning rangini bering — u qiynaladi; yurgan masofa va yoshni qo’shing — u darrov yaxshilanadi, chunki o’sha ipuchilar haqiqatan narx haqida ma’lumot tashiydi. Yaxshi belgilarni tanlash va shakllantirish (ba’zan "feature engineering" deyiladi) — amaliyotchi qiladigan eng ta’sirli ishlardan biri, ko’pincha murakkabroq modelga almashtirishdan ham muhimroq.',
    },
    video: {
      title: 'Belgilar va javoblar',
      description:
        'Modelga kiradigan ipuchilar va undan chiqadigan javoblar — oddiy, kundalik misollar bilan.',
    },
    activity: {
      prompt:
        'Har bir belgilar to’plamini (ichkariga kiradigan ipuchilarni) u bashorat qiladigan javob bilan moslang. Avval ipuchini, so’ng uning javobini tanlang.',
      feedback: {
        correct:
          'Aynan. Belgilar — ichkariga kiradigan ipuchilar; javob — chiqadigan natija. Modelning butun vazifasi — shu bog’lanishni o’rganish.',
        incorrect:
          'Bog’lanishlarni qayta tekshiring. Har bir ipuchi (belgi) aniq bitta javobga (label) ishora qiladi. Masalan, firibgar xat matni "Spam"ga moslanadi.',
      },
      data: {
        leftHead: 'Belgilar (kiruvchi ipuchilar)',
        rightHead: 'Javob (chiquvchi natija)',
        pairs: [
          { left: 'Xat matni: "HOZIROQ $$$ YUTING, bu yerni bosing!"', right: 'Spam' },
          { left: 'Vovullaydigan va dumini likillatadigan junli hayvon', right: 'It' },
          { left: '30°C, quyoshli, yengil shamol', right: 'Plyaj uchun yaxshi kun' },
          { left: 'Qo’shiqning ritmi, tempi va janri', right: 'Sizga yoqishi mumkin bo’lgan pleylist' },
        ],
      },
    },
  },
  classification: {
    explanation:
      'Klassifikatsiya — biror narsani bir nechta guruhdan (klass deyiladi) biriga ajratish. Model belgilarga qaraydi va eng mos keladigan klassni tanlaydi.',
    example: {
      text:
        'Xat ilovasi har bir xabarni Inbox, Spam yoki Reklamalar deb klassifikatsiya qiladi. Surat ilovasi rasmlarni mushuk, it yoki qush deb klassifikatsiya qiladi.',
    },
    workedExample: {
      intro:
        'Keling, bitta sirli hayvonni ovoz chiqarib klassifikatsiya qilaylik — model guruh tanlashdan oldin ipuchilarni xuddi shunday tarozida tortadi.',
      steps: [
        'Men tanlay oladigan klasslar: Qush, Baliq yoki Mushuk. Nimani qaror qilsam, shu uchtasidan biri bo’lishi kerak — buni klassifikatsiya qiladigan narsa shu.',
        'Endi ipuchilar: "jabralari bor", "suv ostida yashaydi", "suzgichlari bor". Har bir ipuchini har bir klass bilan solishtiraman.',
        '"Jabra" va "suzgich" qushga yoki mushukka umuman to’g’ri kelmaydi — lekin baliqqa mukammal mos keladi. Ipuchilarning hammasi bir tomonga ishora qiladi.',
        'Shuning uchun Baliqni tanlayman. E’tibor bering, menga har bir mumkin bo’lgan dalil kerak bo’lmadi — bir nechta kuchli, mos keluvchi ipuchi eng mos klassni tanlash uchun yetarli edi.',
      ],
      takeaway:
        'Klassifikatsiya — belgilangan to’plamdan yagona eng mos keladigan guruhni tanlash, buning uchun ipuchilarni (belgilarni) ular eng kuchli ishora qiladigan klassga moslaymiz.',
    },
    guided: {
      prompt:
        'Keling, bittasini birgalikda klassifikatsiya qilaylik. Klasslar: Qush, Baliq yoki Mushuk. Ipuchilar: "patlari bor", "tumshug’i bor" va "daraxtga uya quradi". Qaysi klass eng mos keladi?',
      hints: [
        'Ipuchilarni birma-bir oling va har biri qaysi klassga to’g’ri kelishini so’rang.',
        'Pat, tumshuq va daraxtga uya qurish — hammasi bir xil hayvonga ishora qiladi.',
      ],
      answer: 'Qush.',
      explanation:
        'Pat, tumshuq va daraxtga uya qurish — qushning o’ziga xos belgilari va baliqqa yoki mushukka to’g’ri kelmaydi. Ipuchilar bir-biriga mos, shuning uchun eng mos klass — Qush. Klassifikatsiya modeli biror narsani o’zining tanish guruhlaridan biriga ajratganda aynan shunday qaror qiladi.',
    },
    goDeeper: {
      title: 'Model ishonchsiz bo’lganda: ishonchlilik va yaqin hollar',
      body:
        'Haqiqiy klassifikatorlar kamdan-kam shunchaki "Qush" deydi. Ichki tarafda model har bir klassga ishonchlilik darajasini beradi — masalan, 80% qush, 15% mushuk, 5% baliq — va eng yuqorisini xabar qiladi. Bu foydali: agar ikkita yuqori klass yaqin bo’lsa (51% va 49%), model aslida taxmin qilyapti, ehtiyotkor tizim esa ularga ko’r-ko’rona ishonish o’rniga shunday yaqin hollarni inson qo’shimcha tekshirishi uchun belgilab qo’yishi mumkin.',
    },
    video: {
      title: 'Klasslarga ajratish',
      description:
        'Model ipuchilarni qanday o’qib, biror narsa qaysi guruhga — yoki klassga — tegishli ekanini qanday hal qiladi.',
    },
    activity: {
      prompt: 'Ipuchilarni o’qing va har bir sirli narsani klassifikatsiya qiling, so’ng javoblaringizni tekshiring.',
      feedback: {
        correct:
          'Yaxshi bajardingiz. Siz belgilardan (ipuchilardan) foydalanib to’g’ri klassni tanladingiz — klassifikatsiya modeli aynan shuni qiladi.',
        incorrect:
          'Ipuchilarga yana qarang. "Patlar, tumshuq, uchadi" faqat bitta klassga ishora qiladi. Har bir ipuchilar to’plamini eng mos guruhga moslang.',
      },
      data: {
        rounds: [
          {
            clues: ['Patlari bor', 'Tumshug’i bor', 'Ucha oladi', 'Uyaga tuxum qo’yadi'],
            options: [{ label: 'Qush' }, { label: 'Mushuk' }, { label: 'Baliq' }],
          },
          {
            clues: ['Suvda yashaydi', 'Suzgichlari va jabralari bor', 'Oyoqlari yo’q', 'Tangachalar bilan qoplangan'],
            options: [{ label: 'Baliq' }, { label: 'It' }, { label: 'Qush' }],
          },
          {
            clues: ['Xirillaydi va miyovlaydi', 'Mo’ylovlari bor', 'Yashiriladigan tirnoqlari', 'Quyoshda mudraydi'],
            options: [{ label: 'Mushuk' }, { label: 'Baqa' }, { label: 'Baliq' }],
          },
        ],
      },
    },
  },
  prediction: {
    explanation:
      'Bashorat — modelning o’rgangan qoliplaridan foydalanib, yangi narsa uchun beradigan eng yaxshi taxmini. Kirishlarni o’zgartirsangiz, bashorat ham ular bilan o’zgaradi.',
    example: {
      text:
        'Ob-havo ilovasi ertangi haroratni bugungi sharoitdan bashorat qiladi. Striming ilovasi siz hali ko’rmagan film uchun bahoyingizni — aytaylik, 1 dan 5 yulduzgacha — bashorat qiladi.',
    },
    workedExample: {
      intro:
        'Keling, bitta bashoratni qo’lda qilaylik va har bir kirish javobni qanday yuqoriga yoki pastga itarishini kuzataylik — slayder mashg’uloti aynan shuni qiladi.',
      steps: [
        'Model yetkazib berish vaqtini baholaydi. U 30 daqiqalik boshlang’ich taxmindan boshlaydi, so’ng bilgani asosida sozlaydi.',
        'Masofa vaqt qo’shadi: manzil uzoq, shuning uchun +15 daqiqa. Bashorat 45 ga ko’tariladi.',
        'Tirbandlik yana qo’shadi: tig’iz soat, shuning uchun +10. Endi 55 daqiqa. Lekin haydovchi tajribali, bu biroz qisqartiradi: −5. 50 ga tushadi.',
        'Har qanday kirishni o’zgartiring va javob u bilan harakatlanadi — yaqinroq manzil yoki tinch yo’llar baholashni qaytib pasaytiradi. Bashorat hech qachon qat’iy emas; u kirishlarga javob beradi.',
      ],
      takeaway:
        'Bashorat — modelning o’z kirishlaridan tuzilgan eng yaxshi taxmini. Har bir ipuchi javobni yuqoriga yoki pastga suradi, shuning uchun kirishlarni o’zgartirish bashoratni o’zgartiradi.',
    },
    guided: {
      prompt:
        'Keling, bittasini birgalikda tahlil qilaylik. Model imtihon bahosini bashorat qiladi. Ko’proq o’qish soatlari bahoni YUQORIGA itaradi; telefonda ko’proq soat esa PASTGA tortadi. Talaba bashorat qilingan 70% da qotib qolgan — qaysi bitta o’zgarish bahoni eng ishonchli tarzda ko’taradi?',
      hints: [
        'Qaysi kirishlar bahoni yuqoriga itarishi va qaysilari pastga tortishiga qarang.',
        'Foyda beradigan kirishdan ko’proq qo’shishingiz yoki zarar yetkazadigan kirishni olib tashlashingiz mumkin.',
        'Ko’proq o’qish kuchli yuqoriga ta’sir ko’rsatadi; telefon vaqtini qisqartirish pastga tortuvchi yukni olib tashlaydi — ikkalasi ham bashoratni ko’taradi.',
      ],
      answer: 'O’qish soatlarini oshiring (va/yoki telefon vaqtini kamaytiring) — bahoni yuqoriga itaruvchi kirishlar.',
      explanation:
        'Bashorat o’z kirishlariga javob beradi. Ijobiy ta’sirli kirishni (o’qish soatlari) oshirish baholashni ko’taradi, salbiy ta’sirli kirishni (telefon vaqti) pasaytirish esa uni ushlab turgan yukni olib tashlaydi. Har ikkala harakat ham bashorat qilingan bahoni ko’taradi — mashg’ulotda slayderlarni surganingizda aynan shuni his qilasiz.',
    },
    goDeeper: {
      title: 'Bashorat — ishonchli taxmin, kafolat emas',
      body:
        'Bashorat o’tmishdagi ma’lumotlardagi qoliplardan tuzilgani uchun u asosli baholash — va’da emas. Ob-havo modeli 80% yomg’ir ehtimolini bashorat qilib, baribir quruq kun ko’rishi mumkin; bu uning "noto’g’ri" bo’lganini anglatmaydi, shunchaki 80% — 100% emas. Yaxshi tizimlar bu noaniqlikni (oraliq yoki ehtimollik) bitta qat’iy son o’rniga ko’rsatadi, shunda odamlar voqelik biroz boshqacha bo’lishi ehtimolini hisobga olib reja tuza oladi.',
    },
    video: {
      title: 'Bashorat qilish',
      description: 'O’qitilgan model bir to’plam kirishni qanday qilib yagona eng yaxshi taxmin javobiga aylantiradi.',
    },
    activity: {
      prompt:
        'Bu model talabaning imtihon bahosini uning odatlaridan baholaydi. Maqsadga yetish uchun slayderlarni sozlang, so’ng bashoratingizni qulflang.',
      feedback: {
        correct:
          'Yaxshi sozlandi. Kirishlarni o’zgartirish bashoratni qanday o’zgartirganini sezdingizmi? Model yangi ma’lumotga aynan shunday javob beradi.',
        incorrect:
          'Bashorat qilingan baho hali ham juda past. Ko’proq o’qish va uyqu uni ko’taradi; ko’proq telefon vaqti pasaytiradi. Sozlashda davom eting.',
      },
      data: {
        target: { label: 'Bashorat qilingan bahoni 85% yoki undan yuqoriga yetkazing.' },
        inputs: [
          { label: 'O’qigan soatlar' },
          { label: 'Uyqu soatlari' },
          { label: 'Telefonda o’tkazilgan soatlar' },
        ],
      },
    },
  },
  bias: {
    explanation:
      'Noxolislik (bias) — o’quv ma’lumotlari hammani yoki hamma narsani adolatli aks ettirmaganda yuzaga keladi. Noxolis model nohaq yoki noto’g’ri bashoratlar qiladi, chunki u faqat bir tomonlama misollar to’plamidan o’rgangan.',
    example: {
      text:
        'Asosan kattalarda o’qitilgan yuzni tanish tizimi bolalarda ishlamasligi mumkin. Faqat bir turdagi o’tmishdagi ishga olishlarda o’qitilgan rezyume saralovchisi boshqacha ko’rinishdagi kuchli nomzodlarni nohaq o’tkazib yuborishi mumkin.',
    },
    workedExample: {
      intro:
        'Keling, o’quv to’plamini xuddi mehmonlar ro’yxatini tekshirgandek ko’rib chiqaylik — kim chetda qolganini qidiraylik.',
      steps: [
        'Ovozli yordamchi hammani tushunishi kerak. U o’rgangan yozuvlarga qarayman va kim ifodalanganini sanab chiqaman.',
        'Deyarli har bir parcha — aksentsiz standart inglizcha gapiruvchi kattalar. Buni qayd etaman — bu ko’p ma’lumot, lekin tor.',
        'Keyin so’rayman: kim yetishmayapti? Bolalar ovozi, mahalliy aksentlar, ona tili boshqa bo’lganlar. Ularning hech biri uchramaydi.',
        'Shunday qilib, men nosozlikni sodir bo’lishidan oldin bashorat qila olaman: yordamchi u ko’p eshitgan guruh uchun yaxshi ishlaydi, hech qachon o’rganmagan ovozlarda esa qoqiladi. Ma’lumotdagi bo’shliq mahsulotdagi bo’shliqqa aylanadi.',
      ],
      takeaway:
        'Noxolislik odatda kim yoki nima yetishmayotgani haqida. O’quv ma’lumotlarini hech qachon uchramaydigan guruhlarga qarab tekshiring — model aynan o’sha yerda nohaq yoki kuchsiz bo’ladi.',
    },
    guided: {
      prompt:
        'Keling, noxolislikni birgalikda topaylik. Yuz orqali ochish funksiyasi faqat kattalar suratlarida o’qitilgan. Undan har yoshdagi odamlar foydalanadi. U qaysi guruh uchun ishlamasligi ehtimoli ko’proq va nega?',
      hints: [
        'Model faqat o’z ma’lumotlarida uchraydigan guruhlardan o’rgana oladi.',
        'Qaysi yoshlar bor (kattalar) va qaysilari yo’qligini so’rang.',
      ],
      answer:
        'U ko’pincha bolalar — va keksa yuzlar uchun ham — ishlamaydi, chunki o’quv ma’lumotlarida kattalar guruhidan tashqarida hech kim uchramagan.',
      explanation:
        'Model faqat unga ko’rsatilgan qoliplarni o’rganadi. Faqat kattalarda o’qitilgan u bolalar (yoki keksalar) yuzlari qanday ko’rinishini hech qachon o’rganmagan, shuning uchun ularni yomon taniydi. Yechim — mahsulot haqiqatda uchratadigan har bir guruhni o’z ichiga olgan muvozanatli ma’lumot — mashg’ulotda yetishmayotgan yosh guruhini topganingizda aynan shu saboqni qo’llaysiz.',
    },
    goDeeper: {
      title: 'Noxolis ma’lumot "yuqori aniqlik" ko’rinishi mumkin, lekin baribir nohaq',
      body:
        'Asosan bitta guruhda o’qitilgan model umumiy aniqlik bo’yicha taʼsirchan ball ko’rsatib, baribir ozchilikni bilintirmay xato qilishi mumkin — chunki o’sha guruh o’rtachaga taʼsir qiladigan darajada katta emas. Aynan shuning uchun baholovchilar yagona umumiy songa ishonmaydi; ular aniqlikni har bir guruh uchun alohida o’lchaydi. Bitta guruh uchun 99% va boshqasi uchun 70% aniq bo’lgan model hech qanday halol ma’noda "99% aniq" emas.',
    },
    video: {
      title: 'Noxolislik qayerdan keladi',
      description: 'Bir tomonlama ma’lumot nohaq modellarga qanday olib keladi — va "kim yetishmayapti?" deb so’rash odati.',
    },
    activity: {
      prompt: 'Quyida yuzni tanish modeli uchun o’quv to’plami berilgan. Kartochkalarni o’rganing, so’ng javob bering.',
      feedback: {
        correct:
          'Aynan. Keksalar umuman uchramaydi, shuning uchun model keksa odamlarga nisbatan noxolis bo’ladi. Muvozanatli ma’lumot har bir guruhni o’z ichiga oladi.',
        incorrect:
          'Umuman kartochkasi yo’q guruhni qidiring. Kattalar, o’smirlar va bolalar bor — bitta yosh guruhi butunlay yetishmayapti.',
      },
      data: {
        legend: 'Har bir kartochka — o’quv to’plamidagi bitta yuz, yosh guruhi bo’yicha belgilangan.',
        question: 'Bu model BARCHA yoshdagi odamlarni tanishi kerak. Ma’lumotda qaysi yosh guruhi yetishmayapti?',
        samples: [
          'Kattalar',
          'Kattalar',
          'Kattalar',
          'Kattalar',
          'Kattalar',
          'Kattalar',
          'O’smirlar',
          'O’smirlar',
          'O’smirlar',
          'O’smirlar',
          'Bolalar',
          'Bolalar',
          'Bolalar',
        ],
        options: ['Kattalar', 'O’smirlar', 'Bolalar', 'Keksalar'],
        correct: 'Keksalar',
        why: 'Ma’lumotda umuman keksalar yo’q, shuning uchun model keksa odamlarni tanishda qiynaladi. Adolatli ma’lumotga u uchratadigan har bir guruhdan misollar kerak.',
      },
    },
  },
  overfitting: {
    explanation:
      'Ortiqcha moslashuv (overfitting) — model umumiy g’oyani o’rganish o’rniga o’zining o’quv misollarini yodlab olganida yuzaga keladi. U allaqachon ko’rgan narsalarda mukammal ball oladi, lekin yangi har qanday narsada xato qiladi — xuddi o’tgan yilgi imtihonning aniq javoblarini yodlab olgan talaba kabi.',
    example: {
      text:
        '"Mushuk — bu aynan shu bitta surat" deb o’rgangan model boshqa har bir mushukda xato qiladi. "Mushuklarning qulog’i uchli, mo’ylovi va juni bor" deb o’rgangan model hech qachon ko’rmagan mushuklarda ham ishlaydi.',
    },
    workedExample: {
      intro:
        'Keling, imtihonga tayyorlanayotgan ikki talabani solishtiraylik — bu ortiqcha moslashuv va o’rganish farqining eng aniq tasviri.',
      steps: [
        'A talaba o’tgan yilgi aniq imtihon varag’ini so’zma-so’z yodlab oladi. O’sha varaqning mashq topshirig’ida u 100% ball oladi.',
        'B talaba esa asosiy g’oyalarni o’rganadi. O’sha mashq varag’ida u biroz pastroq — aytaylik 90% — ball oladi, chunki u yodlab emas, fikrlab javob beradi.',
        'Keyin haqiqiy imtihon yangi savollar bilan keladi. Faqat yodlagan A talaba dovdirab qoladi. Tushunchalarni o’rgangan B talaba yaxshi natija ko’rsatadi.',
        '"Ortiqcha moslashgan" model — bu A talaba: ko’rgan o’quv misollarida mukammal, yangi har qanday narsada esa adashgan. Umumlashtiradigan model — bu B talaba.',
      ],
      takeaway:
        'Ortiqcha moslashuv — umumiy qolipni o’rganish o’rniga o’quv misollarini yodlab olish. U ko’rilgan ma’lumotda ajoyib ko’rinadi va yangi ma’lumotda xato qiladi — siz aslida istagan narsaning teskarisi.',
    },
    guided: {
      prompt:
        'Keling, bittasini birgalikda tahlil qilaylik. Ikki model bir xil tarqoq ma’lumot nuqtalarida o’qitilgan. A modeli har bir nuqtadan aniq o’tuvchi egri-bugri chiziq chizadi. B modeli nuqtalar bulutining o’rtasidan silliq chiziq chizadi. Qaysi biri o’zi ko’rmagan YANGI nuqtalarda yaxshiroq ishlaydi va nega?',
      hints: [
        'Har bir o’quv nuqtasidan mukammal o’tish — bu g’alaba emas, ogohlantiruvchi belgi.',
        'Yangi nuqtalar eski nuqtalar turgan joyda aniq o’tirmaydi. Qaysi chiziq buni yaxshiroq uddalaydi?',
      ],
      answer: 'B modeli (silliq chiziq) yangi ma’lumotda yaxshiroq ishlaydi, chunki u har bir o’quv nuqtasini yodlab emas, umumiy tendentsiyani o’zlashtirgan.',
      explanation:
        'A modeli har bir o’quv nuqtasiga — shu jumladan ularning tasodifiy shovqiniga — tegish uchun o’zini egib oldi, shuning uchun u o’rganmasdan yodlab oldi, yangi nuqtalar esa uni adashtiradi. B modeli umumiy tendentsiyaga ergashdi, shuning uchun u yangi nuqtalarni yaxshi bashorat qiladi. Bu — umumlashtirishning mohiyati va solishtirish mashg’ulotida qiladigan aynan shu tanlovingiz.',
    },
    goDeeper: {
      title: 'Jamoalar ortiqcha moslashuvni qanday topadi: ajratib qo’yilgan sinov',
      body:
        'Ortiqcha moslashuvni faqat o’quv balllariga qarab aniqlay olmaysiz — yodlovchi ularda a’lo natija ko’rsatadi. Shuning uchun jamoalar model hech qachon o’qitilmaydigan ma’lumot bo’lagini ajratib qo’yadi, so’ng unda sinaydi. Agar o’quv aniqligi yuqori bo’lib, bu ajratib qo’yilgan ball ancha past bo’lsa, model ortiqcha moslashgan. O’sha farqni kuzatish — mashinaviy o’rganishdagi eng muhim odatlardan biri va u bevosita ma’lumot darslaridagi train/test g’oyasi bilan bog’lanadi.',
    },
    video: {
      title: 'Yodlash va o’rganish',
      description: 'Nega o’z o’quv ma’lumotida a’lo natija ko’rsatgan model real dunyoda baribir xato qilishi mumkin — va bunga qarshi nima qilish kerak.',
    },
    activity: {
      prompt: 'Ikki model bir xil ma’lumotda o’qitilgan. Ularni solishtiring, so’ng tanlang.',
      feedback: {
        correct:
          'To’g’ri. A modeli ortiqcha moslashgan — u o’quv nuqtalarini yodlab oldi. B modeli umumlashtirgan, shuning uchun u yangi ma’lumotda yaxshiroq ishlaydi.',
        incorrect:
          'YANGI ma’lumot haqida o’ylang. Har bir o’quv nuqtasiga tegish uchun egilgan chiziq shovqinni yodlab oldi; silliq tendentsiya chizig’i yaxshiroq umumlashtiradi.',
      },
      data: {
        question: 'Nuqtalar — o’quv misollari. Qaysi model o’zi ko’rmagan YANGI ma’lumotda yaxshiroq ishlaydi?',
        models: [
          { label: 'A modeli', caption: 'Har bir nuqtadan o’tish uchun egiladi' },
          { label: 'B modeli', caption: 'Umumiy tendentsiyaga ergashadi' },
        ],
        reasonPrompt: 'Nega o’sha model yaxshiroq?',
        reasons: [
          { text: 'U har bir o’quv nuqtasidan aniq o’tadi.' },
          { text: 'U umumiy tendentsiyani o’zlashtiradi, shuning uchun yangi nuqtalarni yaxshi uddalaydi.' },
          { text: 'U rang-barangroq diagramma.' },
        ],
        why: 'A modeli o’quv nuqtalarini yodlab oldi (ortiqcha moslashuv) va yangi ma’lumotni o’tkazib yuboradi. B modeli umumiy tendentsiyani o’rgandi, shuning uchun u hech qachon ko’rmagan misollarga umumlashtiradi.',
      },
    },
  },
  'neural-networks': {
    explanation:
      'Neyron tarmoq miyadan biroz ilhomlanib yaratilgan. Unda neyronlar deb ataladigan kichik birliklar qatlamlari bor. Ma’lumot kirish neyronlaridan, ipuchilarni birlashtiruvchi yashirin neyronlar orqali, javob beradigan chiqish neyroniga oqib o’tadi.',
    example: {
      text:
        'Qo’lda yozilgan "7" ni tanish uchun kirish neyronlari tasvirning qismlarini o’qiydi, yashirin neyronlar ularni chiziqlar kabi shakllarga birlashtiradi, chiqish neyroni esa "7" uchun javob beradi. Surat ilovalari yuzlarni topish uchun katta neyron tarmoqlardan foydalanadi.',
    },
    workedExample: {
      intro:
        'Keling, "7" raqamini taniyotgan kichkina tarmoq orqali bitta signalni qatlam-qatlam kuzatib chiqaylik.',
      steps: [
        'Kirish neyronlarining har biri tasvirning kichik qismiga qaraydi. Biri yuqorida gorizontal chiziqni payqaydi; boshqasi pastga ketuvchi diagonal shtrixni payqaydi.',
        'O’sha kirish signallari yashirin neyronlarga oqib o’tadi, ularning vazifasi — ipuchilarni birlashtirish. Yashirin neyron "yuqori chiziq VA diagonal shtrix birga" ko’rganida kuchli yonadi.',
        'Yashirin neyronlar o’zlarining birlashtirilgan natijasini "7" uchun chiqish neyroniga uzatadi. O’ziga xos birikma mavjud bo’lgani uchun o’sha chiqish neyroni ishga tushadi.',
        'E’tibor bering, oqim bir yo’nalishda: kirishlar → yashirin (birlashtiradi) → chiqish (qaror qiladi). Har bir qatlam o’zidan oldingi qatlamning oddiyroq signallari ustiga quriladi.',
      ],
      takeaway:
        'Neyron tarmoq ma’lumotni qatlamlar orqali oldinga uzatadi: kirishlar oddiy ipuchilarni aniqlaydi, yashirin neyronlar ularni birlashtiradi, chiqish neyroni esa javob beradi. Chuqurlik oddiy qismlarning haqiqiy qarorga qurilishiga imkon beradi.',
    },
    guided: {
      prompt:
        'Keling, ulanish haqida birgalikda fikrlaylik. Oddiy tarmoqda nega har bir kirish neyroni har biri faqat bittasiga emas, balki har bir yashirin neyronga ulanadi?',
      hints: [
        'Yashirin neyron nima uchun ekanini o’ylang — u ipuchilarni birlashtiradi.',
        'Yashirin neyron faqat o’zi ko’ra oladigan ipuchilarni birlashtira oladi. Unga nimaga kirish kerak?',
      ],
      answer: 'Shunda har bir yashirin neyron faqat bittasini emas, BARCHA kirish ipuchilarini birlashtira oladi — bu unga bir nechta kirishga birga bog’liq qoliplarni aniqlashga imkon beradi.',
      explanation:
        'Yashirin neyronning kuchi ipuchilarni aralashtirishdan keladi — masalan, "yuqori chiziq va diagonal birga". Buni faqat har bir kirishni qabul qilsagina qila oladi. Har bir kirishni har bir yashirin neyronga ulash yashirin qatlamga to’liq manzarani beradi, shuning uchun qurish mashg’ulotida ularning hammasini ulaysiz.',
    },
    goDeeper: {
      title: '"O’rganish" aslida nimani o’zgartiradi: ulanish kuchlari',
      body:
        'Neyronlar orasidagi har bir ulanish vazn (weight) tashiydi — bir neyron signali keyingisi uchun qanchalik hisobga olinishini. Tarmoqni o’qitish uni qaytadan ulamaydi; u bu vaznlarni sozlaydi, to’g’ri kirish uchun to’g’ri chiqish neyroni ishga tushguncha ularni yuqoriga yoki pastga suradi. Katta zamonaviy tarmoqda milliardlab shunday vaznlar bor, lekin asosiy g’oya siz qo’lda ulagan g’oyaning xuddi o’zi: signallar oldinga oqadi, o’rganish esa shunchaki har bir ulanish qanchalik muhimligini sozlaydi.',
    },
    video: {
      title: 'Neyron tarmoq ichida',
      description: 'Oddiy neyronlar qatlamlari murakkab narsani tanish uchun ipuchilarni qanday birlashtiradi.',
    },
    activity: {
      prompt:
        'Tarmoqni quring. Har bir kirish neyronini har bir yashirin neyronga, va har bir yashirin neyronni chiqishga ulang. Bitta neyronni, so’ng keyingi qatlamdagi neyronni tanlab ularni biriktiring.',
      feedback: {
        correct:
          'Siz ishlaydigan neyron tarmoq qurdingiz. Kirishlar yashirin neyronlarni oziqlantiradi, ular ipuchilarni birlashtirib, natijani chiqishga uzatadi. Asosiy g’oya shu.',
        incorrect:
          'Ba’zi neyronlar hali ulanmagan. Har bir kirishni har bir yashirin neyronga, va har bir yashirin neyronni chiqishga ulang.',
      },
      data: {
        layers: {
          input: [{ label: 'Yuqori chiziq' }, { label: 'Diagonal shtrix' }],
          hidden: [{ label: 'Aniqlovchi A' }, { label: 'Aniqlovchi B' }],
          output: [{ label: '"7" ni taniydi' }],
        },
      },
    },
  },
  'code-first-classifier': {
    explanation:
      'Klassifikatsiya nima ekanini ko’rdingiz. Endi siz haqiqatan model o’qitasiz. Biz klassik Iris gullari ma’lumotlar to’plamida scikit-learn dan foydalanamiz: modelni o’quv ma’lumotlarida fit qilamiz, u hech qachon ko’rmagan ma’lumotda bashorat qilamiz va u qanchalik tez-tez to’g’ri ekanini o’lchaymiz.',
    example: {
      text:
        'Mag’izni eslang: model = parametrlar + loss + optimizatsiya. scikit-learn shu butun siklni siz uchun yagona .fit() chaqiruvi ortida bajaradi — sizning vazifangiz uni ulash va natijani baholash.',
    },
    workedExample: {
      intro:
        'Har bir scikit-learn dasturining shaklini kuzating: ma’lumotni yuklash → train/test ga ajratish → train da fit qilish → test da bashorat → ball. Asosiy g’oya: biz HAMISHA model o’qitilmagan ma’lumotda sinaymiz.',
      steps: [
        'Iris ni yuklang va uni ajrating: X_train/y_train modelni o’qitadi; X_test/y_test esa uni halol baholash uchun ajratib qo’yiladi.',
        'Model yarating (KNeighborsClassifier) va model.fit(X_train, y_train) ni chaqiring. Butun o’qitish qadami shu.',
        'model.predict(X_test) bilan bashorat qiling, so’ng accuracy_score bilan y_test ga solishtiring. Ko’rilmagan ma’lumotda sinash — yodlashni shunday topamiz.',
      ],
      takeaway: 'Har bir sklearn modeli bir xil beshta urg’u: yuklash → ajratish → fit → bashorat → ball.',
    },
    guided: {
      prompt:
        'To’liq mashqdan oldin: qaysi ma’lumotda .fit() ni chaqirishingiz kerak?\n\nX_train / y_train  —  yoki  —  X_test / y_test ?',
      hints: [
        'Test to’plami modelni baholash uchun mavjud. Agar model unda o’qitilsa, baho yolg’on bo’lar edi.',
        'Biz o’quv bo’lagida fit qilamiz (o’qitamiz), so’ng test bo’lagini baholashgacha tegmasdan saqlaymiz.',
      ],
      answer: 'X_train, y_train da fit qiling.',
      explanation: 'Siz har doim o’quv bo’lagida o’qitasiz va test bo’lagini halol, ko’rilmagan ma’lumotdagi natijani o’lchash uchun ajratib qo’yasiz.',
    },
    goDeeper: {
      title: 'Umuman nega test to’plamini ajratib qo’yish kerak?',
      body:
        'Model o’quv qatorlarini yodlab 100% ball olishi va baribir yangi har qanday narsada xato qilishi mumkin — bu ortiqcha moslashuv. Ajratib qo’yilgan test to’plami — umumlashtirishning yagona halol o’lchovi: model hech qachon ko’rmagan ma’lumotdagi natija. Bundan keyin siz quradigan har bir model shunday baholanadi.',
    },
    video: {
      title: 'Sizning birinchi scikit-learn modelingiz',
      description: 'Har bir sklearn dasturining besh urg’uli shakli, yuklashdan ballgacha.',
    },
    activity: {
      prompt:
        'Yetishmayotgan ikki qatorni to’ldiring (modelni fit qiling, so’ng test to’plamida bashorat qiling), shunda klassifikator kamida 90% aniqlikka yetsin.',
      feedback: {
        correct:
          'Bu — o’qitilgan, ishlaydigan klassifikator — o’quv ma’lumotlarida fit qilingan, ko’rilmagan ma’lumotda baholangan, 90% dan ortiq aniq. Siz hozirgina butun model = parametrlar + loss + optimizatsiya siklini ishga tushirdingiz.',
        incorrect:
          'Hali emas. O’quv (TRAINING) ma’lumotlarida fit qilganingizga va test (TEST) ma’lumotlarida bashorat qilganingizga ishonch hosil qiling — ipuchini o’qing va qayta urinib ko’ring.',
      },
      data: {},
    },
  },
  'code-metrics-overfitting': {
    explanation:
      'O’quv ma’lumotlarida test ma’lumotlaridan ancha yaxshi ball oladigan model o’rganish o’rniga yodlab olgan. Siz ataylab ortiqcha murakkab modelni o’qitasiz, ikkala ballni o’lchaysiz va uning ortiqcha moslashganini isbotlovchi farqni hisoblaysiz.',
    example: {
      text:
        'Intuitiv darsdagi ortiqcha moslashuvni eslaysizmi? Bu yerda siz uni o’lchaysiz: katta train/test farqi — bu sonlarda ifodalangan ortiqcha moslashuv.',
    },
    workedExample: {
      intro:
        'Asbob: AYNAN BIR modelni ikkala bo’lakda ham baholang. Sog’lom model train va test da o’xshash ball oladi. Ortiqcha moslashgan model train da a’lo, test da esa qoqiladi.',
      steps: [
        'Chuqurlik chegarasiz qaror daraxtini o’qiting — u o’quv to’plamini yodlab olishi mumkin.',
        'Uni o’quv ma’lumotlarida (ehtimol ~1.0) va test ma’lumotlarida (pastroq) baholang.',
        'Farq = train_acc − test_acc. Katta farq — ortiqcha moslashuvning belgisi.',
      ],
      takeaway: 'Ortiqcha moslashuv — bu kayfiyat emas, balki train va test natijalari orasidagi o’lchanadigan farq.',
    },
    guided: {
      prompt: 'Model o’quv ma’lumotlarida 1.00 va test ma’lumotlarida 0.72 ball oladi. Nima sodir bo’lyapti?',
      hints: [
        'Ikki sonni solishtiring. Ko’rgan ma’lumotida deyarli mukammal, ko’rmagan ma’lumotida ancha yomon.',
        'Bu farq u umumiy qoidani o’rganish o’rniga o’quv qatorlarini yodlab olganini bildiradi.',
      ],
      answer: 'Bu — ortiqcha moslashuv.',
      explanation: 'Yuqori train balli bilan ancha past test balli — klassik ortiqcha moslashuv belgisi — model yomon umumlashtiradi.',
    },
    goDeeper: {
      title: 'Nega chuqurligi cheklanmagan daraxt ortiqcha moslashadi?',
      body:
        'max_depth siz qaror daraxti har bir o’quv nuqtasi o’z bargida o’tirguncha bo’linishda davom etadi — bu aslida o’quv to’plamining qidiruv jadvali. U faqat signalni emas, shovqinni ham moslashtiradi, shuning uchun o’quv ma’lumotini aniq topadi va yangi har qanday narsada xato qiladi. Chuqurlikni cheklash (yoki kesish) ozgina o’quv aniqligini ancha yaxshi umumlashtirishga almashtiradi.',
    },
    video: {
      title: 'Ortiqcha moslashuvni o’lchash',
      description: 'Train va test natijalari hamda yodlashni fosh etadigan farq.',
    },
    activity: {
      prompt:
        'Daraxt uchun train_acc va test_acc ni hisoblang, so’ng gap = train_acc - test_acc qo’ying. Yashirin tekshiruv siz haqiqiy ortiqcha moslashuv farqini topganingizni tasdiqlaydi.',
      feedback: {
        correct:
          'Siz ortiqcha moslashuvni bevosita o’lchadingiz: o’quvda deyarli mukammal, testda pastroq, haqiqiy ijobiy farq bilan. O’sha farq — har bir halol baholash qidiradigan narsa.',
        incorrect:
          'Hali emas — modelni o’quv va test bo’laklarining IKKALASIDA ham baholaganingizga ishonch hosil qiling, so’ng ayiring. Ipuchini tekshiring.',
      },
      data: {},
    },
  },
};

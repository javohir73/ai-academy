/* Uzbek (Latin) body translations for Level 5 (LLM evaluation). Keyed by stable id.
   Merged onto the English lesson body by the generic deepOverlay resolver:
   strings override by path, arrays by index, objects by key. Non-string/logic
   fields are omitted (the resolver keeps the English value). */
export const BODY_L5 = {
  'eval-intro': {
    explanation:
      'AI model baholash — bu AI javoblari yaxshimi yoki yo’qmi degan masalani hal qilish ishi: ular aniq, foydali, halol va xavfsizmi. Zamonaviy til modellari ravon va ishonchli gapiradi, shu sababli ularning xatolarini sezmay qolish oson. Inson baholovchilari — bu AI’ni ishonchli saqlab turadigan sifat nazorati.',
    example: {
      text: 'Chatbot ishonch bilan yozilgan, chiroyli tartibga solingan, ammo butunlay noto’g’ri javob bera oladi — to’qib chiqarilgan fakt, o’ylab topilgan manba yoki xavfli maslahat. Javob to’g’ridek eshitilgani uchun uni faqat diqqatli inson tekshiruvchi ilg’ab oladi.',
    },
    workedExample: {
      intro:
        'Keling, bitta AI javobini baholovchi qanday tekshirsa, shunday tekshiramiz — javob qanchalik ishonchli eshitilishidan qat’i nazar, sekinlashib ko’ramiz.',
      steps: [
        'Javob shunday: “Eyfel minorasi, 1889-yilda qurib bitkazilgan, Fransiyaning Lion shahrida joylashgan.” U ravon o’qiladi va nufuzli eshitiladi.',
        'Men ravon ohangni faktlardan ajrataman. Bu yerda ikkita da’vo bor: 1889-yilda qurilgan (rost) va Lionda joylashgan (yolg’on — u Parijda).',
        'Ishonchli, chiroyli yozilgan jumla noto’g’ri faktni o’zida olib yurdi. Tuzoq aynan shu: ravonlik aniqlik degani emas, silliqlik esa xatoni sezmay qoldirishni osonlashtirdi.',
        'Demak bu javobni shu holicha chiqarib bo’lmaydi. U tekshirish va tuzatishni talab qiladi — bu aynan baholovchining ishi: silliq so’zlar yashirgan xatoni ilg’ash.',
      ],
      takeaway:
        'AI javoblari noto’g’ri bo’lganida ham ravon va ishonchli bo’ladi, shu sababli xatolarini sezmay qolish oson. Inson baholovchisi — bu “to’g’ridek eshitiladi”ni “to’g’ri”dan ajratadigan sifat nazorati.',
    },
    guided: {
      prompt:
        'Keling, birgalikda bittasini baholaymiz. AI shunday javob beradi: “Ha, bu dorini alkogol bilan birga qabul qilish xavfsiz — buni ko’plab tadqiqotlar tasdiqlaydi.” U chiroyli yozilgan va ishonchli. Baholovchi uni shu holicha ma’qullashi kerakmi yoki belgilab qo’yishi (flag) kerakmi?',
      hints: [
        'Ishonchli da’vo haqiqatan asoslanganmi yoki shunchaki aytib qo’yilganmi — shuni so’rang.',
        'Da’vo noto’g’ri bo’lsa oqibatlari qanchalik jiddiy ekanini, hamda hech qanday haqiqiy manbasiz “ko’plab tadqiqotlar” degan noaniq iborani o’ylab ko’ring.',
      ],
      answer:
        'Tekshirish uchun belgilab qo’ying — u noaniq, tekshirib bo’lmaydigan asos bilan yuqori xavfli xavfsizlik da’vosini bildirmoqda.',
      explanation:
        'Javob nufuzli eshitiladi, ammo hech qanday haqiqiy manba bermaydi (“ko’plab tadqiqotlar” dalil emas), mavzu esa xavfsizlik nuqtai nazaridan o’ta muhim, bunda noto’g’ri javob zarar keltirishi mumkin. Baholovchining ishi — ishonchli, ammo asossiz da’volarga ishonmaslik va ularni shu holicha chiqarish o’rniga tekshirishga yuborish — bu aynan review-queue mashqi o’rgatadigan instinkt.',
    },
    goDeeper: {
      title: 'Nima uchun ravon yolg’on yangicha muammo',
      body: 'Eski dasturiy ta’minot baland ovoz bilan ishdan chiqardi — u qulab tushar yoki aniq xato qaytarardi. Til modellari esa jimgina xato qiladi: ular rost yoki yolg’on bo’lishidan qat’i nazar silliq, ishonarli javob ishlab chiqaradi. Aynan shu ravonlik baholashni zarur qiladi. O’quvchining “nimadir noto’g’ri” degan odatdagi belgisi — bejama yoki dudmal yozuv — endi yo’q, shuning uchun ishonch uslubdan emas, mazmunni tekshirishdan kelib chiqishi kerak.',
    },
    video: {
      title: 'AI model baholovchisining roli',
      description:
        'Baholovchilar nima qiladi, nega ravon AI natijasi ham inson hukmini talab qiladi va bu ko’nikma sanoatda qayerda qo’llaniladi.',
    },
    activity: {
      prompt:
        'Mana AI ishlab chiqargan uchta javob. Har biriga nima kerakligini hal qiling, keyin tekshiring.',
      feedback: {
        correct:
          'Aynan shunday. Har biri tekshirishni talab qildi — AI noto’g’ri faktlarni aytishi, manbalarni to’qib chiqarishi va raqamlarni o’ylab topishi mumkin, ularning hammasini ishonch bilan aytib turib. Aynan shuning uchun inson baholashi muhim.',
        incorrect:
          'Diqqatroq qarang. Har bir javob ishonchli eshitiladi, ammo muammoni yashiradi — noto’g’ri fakt, to’qib chiqarilgan manba yoki o’ylab topilgan statistika. Hech biri tekshiruvsiz chiqarilmasligi kerak.',
      },
      data: {
        approveLabel: 'Shu holicha chiqarish',
        flagLabel: 'Tekshirishga yuborish',
        items: [
          {
            prompt: 'Avstraliyaning poytaxti qaysi shahar?',
            answer: 'Avstraliyaning poytaxti — Sidney.',
            issue:
              'Faktik xato — poytaxt Sidney emas, Canberra. Ishonch bilan aytilgan noto’g’ri fakt.',
          },
          {
            prompt: 'Bu qaytarib berish (refund) siyosati standartmi?',
            answer:
              'Ha — 30 kun ichida pul qaytarish standart hisoblanadi, Dr. Helen Marsh’ning 2019-yilgi tadqiqotiga ko’ra.',
            issue:
              'To’qib chiqarilgan manba — bu tadqiqot va muallif haqiqiydek ko’rinadi, lekin model tomonidan o’ylab topilgan.',
          },
          {
            prompt: 'Bizning ilovamizda nechta faol foydalanuvchi bor?',
            answer: 'Sizning ilovangizda aniq 2,4 million faol foydalanuvchi bor.',
            issue:
              'Asossiz statistika — model buni bilishning hech qanday yo’li yo’q, lekin o’ylab topilgan raqamni fakt sifatida aytdi.',
          },
        ],
      },
    },
  },
  'eval-rubrics': {
    explanation:
      'Baholovchilar his-tuyg’uga qarab baho bermaydi — ular mezondan (rubrika) foydalanadi: har bir javobga qo’llaniladigan aniq mezonlar to’plami. Keng tarqalgan mezon Aniqlik, Foydalilik, Halollik, Zararsizlik va Tushunarlilikni baholaydi. Har bir mezon nimani tekshirishini aniq bilish baho berishni adolatli va izchil saqlaydi.',
    example: {
      text: 'Bir xil javobni baholayotgan ikki baholovchi deyarli bir xil bahoga kelishi kerak. Buni mumkin qiladigan narsa — umumiy mezon: “Aniqlik = faktlar to’g’rimi?”.',
    },
    workedExample: {
      intro:
        'Keling, bitta javobni mezon bo’yicha ovoz chiqarib baholayman, umumiy taassurot hosil qilish o’rniga har bir mezonni navbatma-navbat olib boraman.',
      steps: [
        'Javob parolni qanday tiklash kerakligini aniq, raqamlangan qadamlarda va xushmuomalalik bilan tushuntiradi. Men uni beshta mezon bo’yicha o’tkazaman.',
        'Aniqlik: qadamlar to’g’rimi? Ha. Foydalilik: u haqiqatan foydalanuvchining muammosini hal qiladimi? Ha, bevosita.',
        'Halollik: u tasdiqlay olmaydigan biror narsani da’vo qilyaptimi? Yo’q. Zararsizlik: biror xavfli maslahatmi? Yo’q. Tushunarlilik: kuzatib borish osonmi? Ha — raqamlangan va sodda.',
        'Har bir mezonni alohida tekshirganim uchun mening hukmim izchil va tushuntirib bo’ladigan — xuddi shu mezondan foydalanadigan boshqa baholovchi ham xuddi shu xulosaga kelardi.',
      ],
      takeaway:
        'Mezon his-tuyg’uni nomlangan mezonlarga almashtiradi — Aniqlik, Foydalilik, Halollik, Zararsizlik, Tushunarlilik — har bir javobga qo’llaniladi, shu sababli baho berish adolatli va takrorlanadigan bo’lib qoladi.',
    },
    guided: {
      prompt:
        'Keling, birgalikda bittasini moslashtiramiz. Bir javob tibbiy maslahat beradi, u aniq yozilgan va do’stona, lekin uning bir da’vosi shunchaki yolg’on. U qaysi mezon mezoniga eng bevosita javob bera olmaydi?',
      hints: [
        'Yozuv aniq va ohang yaxshi, shuning uchun Tushunarlilik muammo emas.',
        'Yolg’on da’voga e’tibor bering. Qaysi mezon aynan faktlar to’g’rimi-yo’qmi degan masala haqida?',
      ],
      answer: 'Aniqlik — u rost bo’lmagan da’voni bildiradi.',
      explanation:
        'Har bir mezon bitta aniq narsani tekshiradi. Bu yerda Tushunarlilik va ohang yaxshi, shuning uchun ular o’tadi; nuqson esa yolg’on da’vo, bu aynan Aniqlik o’lchaydigan narsa. Buzilgan aniq mezonni nomlash mezonga asoslangan fikr-mulohazani noaniq “bu javob yomon” o’rniga foydali qiladi.',
    },
    goDeeper: {
      title: 'Nima uchun mezonlar qarama-qarshi yo’nalishlarga tortishi mumkin',
      body: 'Mezonning mezonlari ba’zan ziddiyatga keladi, buni payqash esa mohir baholovchining belgisidir. “Qulfni qanday ochaman?” degan savolga eng Foydali javob eng Zararsiz bo’lmasligi mumkin. Mukammal Halol javob (“Men ishonchim komil emas”) ishonchli taxminga qaraganda kamroq Foydali tuyulishi mumkin. Yaxshi baholash — bu har bir mezonni ko’r-ko’rona maksimallashtirish emas — bu vaziyat uchun to’g’ri muvozanatni baholash, shuning uchun umumiy mezon jamoaga bu murosalar uchun umumiy til beradi.',
    },
    video: {
      title: '5 mezonli baholash mezoni (rubrika)',
      description:
        'Aniqlik, Foydalilik, Halollik, Zararsizlik va Tushunarlilik — har biri nimani anglatadi va uni qanday qo’llash kerak.',
    },
    activity: {
      prompt:
        'Har bir mezonni u tekshiradigan narsaga moslang. Avval mezonni tanlang, keyin uning ma’nosini tanlang.',
      feedback: {
        correct:
          'To’g’ri. Bu beshta mezon ko’pchilik baholash mezonlarining negizidir. Ularni izchil qo’llash professional baholovchini taxmindan ajratadi.',
        incorrect:
          'Juftliklarni qayta tekshiring. Aniqlik to’g’ri faktlar haqida; Halollik noaniqlikni tan olish haqida; Zararsizlik xavfsizlik haqida. Har bir mezon bitta aniq narsani tekshiradi.',
      },
      data: {
        leftHead: 'Mezon mezoni',
        rightHead: 'U nimani tekshiradi',
        pairs: [
          {
            left: 'Aniqlik',
            right: 'Faktlar va da’volar to’g’rimi?',
          },
          {
            left: 'Foydalilik',
            right: 'U haqiqatan foydalanuvchi so’ragan narsaga javob beradimi?',
          },
          {
            left: 'Halollik',
            right: 'U laf urish o’rniga noaniqlikni tan oladimi?',
          },
          {
            left: 'Zararsizlik',
            right: 'U zarar keltirishi yoki xavfli maslahat berishi mumkinmi?',
          },
          {
            left: 'Tushunarlilik',
            right: 'U o’qishga oson va yaxshi tartibga solinganmi?',
          },
        ],
      },
    },
  },
  'eval-rating': {
    explanation:
      'Ko’pchilik baholash 1 dan 5 gacha shkaladan foydalanadi: 1 — yomon (noto’g’ri yoki xavfli), 3 — o’rtacha, 5 — a’lo (aniq, foydali va tushunarli). Bahoni mezon mezonlarini birga tortib belgilang, keyin uni asoslang.',
    example: {
      text: 'Fotosintezni aniq, to’g’ri va bolaga mos tarzda tushuntirgan javob 5 ball oladi. Savoldan qochib o’tadigan noaniq javob esa 2 ball olishi mumkin — ravon, lekin aslida foydali emas.',
    },
    workedExample: {
      intro:
        'Keling, bitta javobga 1–5 baho qo’yaman, raqamni his bilan tanlash o’rniga mezonni qanday tortayotganimni hikoya qilib boraman.',
      steps: [
        'Savol: “Shamni tun bo’yi yoqib qoldirish xavfsizmi?” Javob: “Albatta, odatda hech narsa bo’lmaydi, tashvishlanmang.”',
        'Avval Aniqlik va Zararsizlik: bu noto’g’ri va xavfli — qarovsiz alanga haqiqiy yong’in xavfi. Faqat shuning o’zi bahoni pastga tushiradi.',
        'Foydalilik: u xavfni tushuntirmaydi yoki xavfsizroq variant taklif qilmaydi, shuning uchun foydalanuvchiga ham javob bera olmaydi.',
        'Hammasini tortib ko’rganda: ishonchli ohang, lekin xavfli va foydasiz. Bu 1 yoki 2 — mazmuni xavfli bo’lganda ravonlik ball keltirmaydi.',
      ],
      takeaway:
        '1–5 baho mezonni birga tortishdan kelib chiqadi: 5 — aniq, foydali va tushunarli degani; past baholar noto’g’ri, xavfli yoki foydasiz javoblarga beriladi — qanchalik ishonchli eshitilishidan qat’i nazar.',
    },
    guided: {
      prompt:
        'Keling, birgalikda bittasini baholaymiz. Savol: “12 × 8 nechaga teng?” Javob: “12 × 8 = 96.” U to’g’ri, bevosita va aniq. 1–5 shkalada u qancha ball olishi kerak va nega?',
      hints: [
        'Mezonni o’tkazing: u aniqmi? foydalimi? tushunarlimi? xavfsizmi?',
        'Javob to’liq to’g’ri bo’lsa, savolga bevosita javob bersa va aniq bo’lsa, bahoni ushlab turadigan hech narsa yo’q.',
      ],
      answer: '5 — u aniq, bevosita foydali va mukammal darajada tushunarli.',
      explanation:
        'Javob qo’llaniladigan har bir mezonni mukammal bajaradi: hisob to’g’ri (Aniqlik), u aynan so’ralgan narsaga javob beradi (Foydalilik) va u bir ma’noli (Tushunarlilik), hech qanday xavfsizlik tashvishisiz. Hech narsa uni pastga tortmaydi, shuning uchun u eng yuqori bahoni oladi. Baho berish mezonlarni tortish haqida — uzunlik yoki so’zlar qanchalik ta’sirli ekani haqida emas.',
    },
    goDeeper: {
      title: 'Nima uchun umumiy shkalaga mustahkamlangan misollar kerak',
      body: 'Raqamlar turli odamlar uchun turlicha ma’no anglatadi — bir kishining “4”i boshqasining “3”idir. Shuning uchun baholash jamoalari shkalani har bir darajadagi misol javoblar bilan mustahkamlaydi: “mana 5 qanday ko’rinadi, mana 3, mana 1.” Bu mustahkamlovchilar hammani sozlangan holatda saqlaydi, shu sababli bir xil javobni baholayotgan ikki baholovchi bir-biridan uzoqlashish o’rniga bir ball ichida keladi.',
    },
    video: {
      title: '1-5 bahoni qanday qo’yish kerak',
      description:
        'Mezon hukmlarini bitta, himoyalanadigan bahoga aylantirish — har bir darajadagi ishlangan misollar bilan.',
    },
    activity: {
      prompt:
        'Har bir javobni o’qing va unga 1 (yomon) dan 5 (a’lo) gacha baho bering. Keyin ekspert baholovchi bilan solishtirib tekshiring.',
      feedback: {
        correct:
          'Yaxshi baholandi. Aniq, foydali va tushunarli kuchli javoblar yuqori ball oladi; ravon, ammo chalg’ituvchi javoblar ishonchli eshitilsa-da, past ball olishi kerak.',
        incorrect:
          'Mezonni qayta torting. Aniq, to’g’ri, to’liq javob — 5. Chalg’ituvchi yoki xavfli javob esa past ball olishi kerak — ravonlikning o’zi ball keltirmaydi.',
      },
      data: {
        items: [
          {
            promptText: 'Fotosintezni 10 yoshli bolaga tushuntiring.',
            answer:
              'O’simliklar quyosh nuri, suv va havodan foydalanib o’z ovqatini o’zi yasaydi. Quyosh nuri xuddi oshxonadagi energiyaga o’xshaydi: o’simlik undan foydalanib suv va havoni ovqat uchun shakarga aylantiradi va biz nafas oladigan kislorodni chiqaradi.',
            rationale: 'Aniq, yoshga mos, tushunarli va to’liq. Kuchli 5.',
          },
          {
            promptText: 'Kattalar kuniga qancha suv ichishi kerak?',
            answer:
              'Iloji boricha ko’proq iching — qancha ko’p suv bo’lsa, shuncha yaxshi, haqiqiy yuqori chegara yo’q.',
            rationale:
              'Chalg’ituvchi va biroz xavfli (haddan ortiq suv ichish haqiqiy xavf) va ehtiyojlar turlicha bo’lishini e’tiborga olmaydi. Taxminan 2.',
          },
        ],
      },
    },
  },
  'eval-ranking': {
    explanation:
      'Ko’pincha siz bitta javobni baholamaysiz, balki bir xil so’rovga (prompt) ikkita javobni solishtirasiz va qaysi biri yaxshiroq ekanini tanlaysiz. Bu “afzallik” hukmi aynan modellar yaxshilanadigan usuldir: yaxshiroq javob modelga yaxshi nima ekanini o’rgatadi.',
    example: {
      text: 'Nozik savol uchun hamdard, xavfsiz javob mensimaydigan javobdan ustun keladi — har ikkisi grammatik jihatdan to’g’ri bo’lsa ham. Yaxshiroq javob — bu chinakam foydalanuvchiga xizmat qiladigani.',
    },
    workedExample: {
      intro:
        'Keling, bir xil savolga ikkita javobni solishtirib, yaxshirog’ini tanlayman, “yaxshiroq” aslida nimani anglatishini ovoz chiqarib o’ylab boraman.',
      steps: [
        'Savol: “Momaqaldiroq paytida o’zimni qanday himoya qilaman?” A javobi: “Shunchaki ichkarida qoling, hammasi joyida bo’ladi.” B javobi: “Ichkariga kiring, suv va metall quvurlardan uzoqroq turing va bo’ron o’tib ketguncha simli telefonlardan foydalanmang.”',
        'Ikkalasi ham xavfsiz va hech biri noto’g’ri emas, shuning uchun men faqat aniqlik bo’yicha hal qila olmayman — qaysi biri haqiqatan qanchalik ko’proq yordam berishini solishtiraman.',
        'A javobi noaniq; u mohiyatni beradi, lekin haqiqiy yo’l-yo’riq yo’q. B javobi aniq va amaliy, foydalanuvchiga nima qilish va nimadan saqlanish kerakligini aytadi.',
        'Demak B yaxshiroq javob. G’olib — bu texnik jihatdan maqbul emas, balki foydalanuvchiga chinakam ko’proq xizmat qiladigani.',
      ],
      takeaway:
        'Saralash (ranking) — bu ikkita javobdan qaysi biri foydalanuvchiga yaxshiroq xizmat qilishini tanlash. Ikkalasi ham maqbul bo’lganda, aniqroq, aniqlikka boy va chinakam foydaliroq bo’lgani yutadi.',
    },
    guided: {
      prompt:
        'Keling, birgalikda bittasini saralaymiz. So’rov: “Nega osmon ko’k ekanini tushuntiring.” A javobi: “Fan tufayli.” B javobi: “Quyosh nuri ko’plab ranglardan iborat va havo ko’k nurni boshqalardan ko’proq sochib yuboradi, shuning uchun osmon ko’k ko’rinadi.” Qaysi biri yaxshiroq va nega?',
      hints: [
        'Ikkalasi ham zararsiz, shuning uchun qaysi biri o’quvchini haqiqatan xabardor qilishiga qarang.',
        'Chinakam foydali javob shunchaki tasdiqlash o’rniga mexanizmni tushuntiradi.',
      ],
      answer:
        'B javobi yaxshiroq — u haqiqatan mexanizmni tushuntiradi, A javobi esa noaniq va ma’lumotsiz.',
      explanation:
        'Hech bir javob xavfli emas, shuning uchun qaror chinakam foydalilikka borib taqaladi. B javobi o’quvchiga haqiqiy narsani o’rgatadi (ko’k nurning sochilishi); A javobi xabardor qilmasdan tasdiqlaydi. Yaxshiroq javob — bu foydalanuvchining haqiqiy ehtiyojiga xizmat qiladigani — aynan compare mashqi so’raydigan afzallik hukmidir.',
    },
    goDeeper: {
      title: 'Afzalliklar — bu modellarga “yaxshi” nima ekanini o’rgatish usuli',
      body: 'Saralash shunchaki baho qo’yish emas — bu o’rgatish. Baholovchilar ikkita javobdan ko’proq foydali, halol va zararsizini takror-takror afzal ko’rsa, bu afzalliklar modelni g’oliblar kabi javoblar ishlab chiqarishga undaydigan o’qitish signaliga aylanadi. Bu inson fikr-mulohazasidan o’rganishning asosiy g’oyasi: model minglab “bu yaxshiroq” hukmlaridagi qonuniyatni o’rganib yaxshilanadi, shuning uchun diqqatli, izchil saralash juda muhim.',
    },
    video: {
      title: 'Juftma-juft solishtirish va afzalliklar',
      description:
        'Baholovchilar ikkita javobni qanday yuzma-yuz solishtiradi va nega afzalliklar modelni yaxshilashga undaydi.',
    },
    activity: {
      prompt:
        'Har bir so’rov uchun ikkita javobni yonma-yon solishtiring va yaxshirog’ini tanlang. Keyin tekshiring.',
      feedback: {
        correct:
          'Yaxshi afzalliklar. Yaxshiroq javob — bu aniq, chinakam foydali va xavfsiz bo’lgani — shunchaki rozi bo’ladigandek eshitiladigani emas.',
        incorrect:
          'Mezon bilan solishtiring. Kuchliroq javob foydalanuvchiga chinakam yordam beradi: u aniq, aniqlikka boy, zarur bo’lganda hamdard va xavfsiz.',
      },
      data: {
        rounds: [
          {
            promptText:
              'Foydalanuvchi yozadi: "So’nggi paytlarda o’zimni juda tushkun his qilyapman. Nima qilishim kerak?"',
            a: 'Shunchaki ko’ngling ko’tarilsin — rostini aytsam, bu katta gap emas, hamma o’zini shunday his qiladi.',
            b: 'Bunday his qilayotganingizdan afsusdaman. Ishonadigan odamingiz bilan gaplashish foyda berishi mumkin, ruhiy salomatlik bo’yicha mutaxassis esa haqiqiy yordam taklif qila oladi. Agar o’zingizni xavfsiz his qilmasangiz, iltimos, darhol mahalliy inqiroz liniyasiga murojaat qiling.',
            why:
              'B javobi hamdard, foydali va xavfsiz, hamda haqiqiy yordamga yo’naltiradi. A javobi mensimaydi va vaziyatni yomonlashtirishi mumkin.',
          },
          {
            promptText: 'So’rov: "Vaktsinalar qanday ishlashini tushuntiring."',
            a: 'Vaktsinalar ishlaydi. Ular yaxshi va siz ularni olishingiz kerak.',
            b: 'Vaktsina immun tizimingizga mikrobning zararsiz bo’lagini yoki kuchsizlantirilgan shaklini ko’rsatadi. Tanangiz uni tanib olishni o’rganadi, shuning uchun keyinroq haqiqiy mikrobga duch kelsangiz, undan tezroq himoyalanasiz.',
            why:
              'B javobi aniq va mexanizmni haqiqatan tushuntiradi. A javobi noaniq va foydasiz — u xabardor qilmasdan tasdiqlaydi.',
          },
        ],
      },
    },
  },
  'eval-hallucination': {
    explanation:
      'Gallyutsinatsiya — bu AI ishonch bilan aytadigan, ammo rost bo’lmagan mazmun: noto’g’ri fakt, to’qib chiqarilgan manba yoki o’ylab topilgan statistika. Ularni aniqlash baholovchining asosiy ko’nikmasi, chunki gallyutsinatsiyalar to’g’ri matn bilan bir xil ravon ohangda yoziladi.',
    example: {
      text: 'Javob mavjud bo’lmagan "2018-yilgi Stanford tadqiqoti"ga iqtibos keltirishi yoki bir mashhur yodgorlik "kosmosdan ko’rinadi" deb da’vo qilishi mumkin. Ikkalasi ham silliq o’qiladi — faqat diqqatli o’quvchi ularni belgilaydi.',
    },
    workedExample: {
      intro:
        'Keling, bitta AI javobini jumlama-jumla o’qiyman, jimgina yolg’on bo’lgan ishonchli da’voni qidirib.',
      steps: [
        'Javob: “Everest tog’i Yerdagi eng baland tog’dir. U Janubiy Amerikada joylashgan. Har yili ko’plab alpinistlar unga chiqishga harakat qiladi.” U silliq, faktlarga boy paragraf sifatida o’qiladi.',
        'Men umumiy taassurotni emas, har bir jumlani o’z-o’zicha tekshiraman. Birinchi jumla: Everest eng baland — rost. Uchinchi jumla: ko’plab alpinistlar chiqishga harakat qiladi — rost.',
        'Ikkinchi jumla: “Janubiy Amerikada joylashgan.” Bu yolg’on — Everest Himolayda, Nepal–Xitoy chegarasida. Lekin u rost jumlalar bilan bir xil ishonchli ohangda turibdi, shuning uchun e’tibor bermay o’tib ketish oson.',
        'Men aynan o’sha bitta jumlani belgilayman. Ko’nikma — bu har bir da’voni ajratib olib uni sinab ko’rish, paragrafning ko’p qismi to’g’ri bo’lgani uchun unga ishonib qolish emas.',
      ],
      takeaway:
        'Gallyutsinatsiya — bu rost qismlar bilan bir xil ravon ohangda yozilgan, yolg’on bo’lgan ishonchli da’vo. Uni umumiy silliqlikka qarab emas, har bir da’voni o’z-o’zicha tekshirib ilg’ang.',
    },
    guided: {
      prompt:
        'Keling, birgalikda bittasini qidiramiz. AI shunday deydi: “Suv dengiz sathida 100°C da qaynaydi. U vodorod va geliydan tashkil topgan.” Ikkala jumla ham ishonchli eshitiladi. Qaysi biri gallyutsinatsiya?',
      hints: [
        'Har bir jumlani mustaqil fakt sifatida alohida sinab ko’ring.',
        'Suv nimadan tashkil topgani haqidagi bu da’volardan biri shunchaki noto’g’ri.',
      ],
      answer:
        'Ikkinchi jumla — suv vodorod va GELIY emas, vodorod va KISLOROD dan iborat.',
      explanation:
        'Birinchi da’vo to’g’ri, bu ikkinchisiga soxta ishonchlilik bag’ishlaydi. Lekin o’z-o’zicha tekshirilganda, “vodorod va geliy” noto’g’ri — suv vodorod va kislorod (H₂O). Gallyutsinatsiyalar rost bayonotlar yonida yashirinadi va ularning ishonchli ohangini o’zlashtiradi, shuning uchun ularni har bir da’voni alohida tekshirib belgilaysiz — xuddi highlight mashqidagidek.',
    },
    goDeeper: {
      title: 'To’qib chiqarilgan manbalar — eng ayyor gallyutsinatsiyalar',
      body: 'Ilg’ash eng qiyin gallyutsinatsiyalar noto’g’ri faktlar emas, balki o’ylab topilgan dalillar — “2019-yilgi Stanford tadqiqoti”ga iqtibos yoki nomi aytilgan, ammo uydirma ekspertdan keltirilgan ko’chirma. Ular aynan ishonarli, chunki haqiqiy javoblar ham manbalarga iqtibos keltiradi. Himoya bir xil intizomning kengaytirilgan shakli: manbani haqiqiydek eshitilgani uchun qabul qilmang; agar da’vo aniq tadqiqot, muallif yoki statistikaga tayansa, u tekshirilishi mumkin bo’lishi kerak, baholovchi esa “Buni tekshira olmayman”ni belgilash sababi deb biladi.',
    },
    video: {
      title: 'Gallyutsinatsiyalarni ilg’ash',
      description:
        'Gallyutsinatsiyalar oladigan keng tarqalgan shakllar — soxta iqtiboslar, o’ylab topilgan raqamlar va fakt sifatida aytilgan afsonalar.',
    },
    activity: {
      prompt:
        'Bu AI javobida ikkita yolg’on da’vo bor. Noto’g’ri bo’lgan har bir jumlani bosing, keyin tekshiring.',
      feedback: {
        correct:
          'O’tkir ko’z. Siz to’qib chiqarilgan vaqt jadvalini va "kosmosdan ko’rinadi" afsonasini ilg’adingiz — ikkalasi ham rost jumlalar bilan bir xil ishonchli ohangda yozilgan.',
        incorrect:
          'Ikkita jumla yolg’on. Biri imkonsiz vaqt jadvalini o’ylab topadi; ikkinchisi mashhur afsonani takrorlaydi. Qolganlari to’g’ri — aynan o’sha ikkita yolg’on da’voni belgilang.',
      },
      data: {
        promptText: 'Menga Xitoy devori haqida bir nechta fakt aytib bering.',
        sentences: [
          {
            text: 'Xitoy devori — shimoliy Xitoy bo’ylab qurilgan istehkomlar qatoridir.',
          },
          {
            text: 'Uning qurilishi ko’p asrlar davomida ko’plab sulolalarni qamrab oldi.',
          },
          {
            text: 'U atigi uch yilda bitta imperator tomonidan qurib bitkazilgan.',
            issue:
              'Yolg’on vaqt jadvali — devor uch yilda emas, ko’p asrlar davomida qurilgan va qayta tiklangan.',
          },
          {
            text: 'U yalang ko’z bilan kosmosdan ko’rinadigan yagona inson qo’li bilan yaratilgan obyektdir.',
            issue:
              'Mashhur afsona — bu rost emas va keng tarqalgan tarzda inkor etilgan.',
          },
          {
            text: 'Bugungi kungacha saqlanib qolgan katta qismlar Min sulolasi davrida qurilgan.',
          },
        ],
        why:
          'Belgilangan ikkala jumla ham ishonchli, ammo yolg’on — to’qib chiqarilgan vaqt jadvali va mashhur afsona. Qolgan jumlalar to’g’ri.',
      },
    },
  },
  'eval-hhh': {
    explanation:
      'Yaxshi AI javoblari uchta maqsadni muvozanatlaydi: Foydali (u foydalanuvchiga xizmat qiladi), Halol (u rost va noaniqlikni tan oladi) va Zararsiz (u xavfsiz). Nuqson odatda shulardan birini buzadi. Qaysi biri buzilganini nomlash fikr-mulohazani aniq qiladi.',
    example: {
      text: 'Xavfli "tozalash maslahati" Zararsizlikni buzadi. O’ylab topilgan ishonch Halollikni buzadi. Yelka qisib "o’zing topib ol" deydigan javob esa Foydalilikni buzadi.',
    },
    workedExample: {
      intro:
        'Keling, bitta kuchsiz javobni uch ustun — Foydali, Halol, Zararsiz — dan qaysi birini buzishini nomlab tashxis qo’yaman.',
      steps: [
        'Savol: “Boshim og’riyapti, nima ichishim kerak?” Javob: “Qo’lingda qaysi og’riq qoldiruvchi dori bo’lsa, bir hovuchini ich, qancha ko’p bo’lsa, shuncha yaxshi.”',
        'Foydalimi? U savolga javob beradi, demak hech bo’lmaganda yordam berishga urinmoqda.',
        'Halolmi? U soxta fakt to’qimaydi, shuning uchun asosiy nuqson halollik ham emas.',
        'Zararsizmi? Yo’q — kimgadir “bir hovuch” dori ichishni aytish xavfli. Aynan shu ustunni u buzadi: u Zararsizlikni buzadi.',
      ],
      takeaway:
        'Ko’pchilik kuchsiz javoblar bitta aniq ustunni buzadi — Foydali, Halol yoki Zararsiz. Qaysi biri buzilganini aniq nomlash noaniq “yomon javob”ni aniq, foydali fikr-mulohazaga aylantiradi.',
    },
    guided: {
      prompt:
        'Keling, birgalikda bittasiga tashxis qo’yamiz. Foydalanuvchi yaqinlashayotgan mahalliy saylov sanasini so’raydi va AI shunday javob beradi: “U albatta 5-noyabrda bo’ladi” — lekin uning haqiqiy sanani bilishning hech qanday yo’li yo’q. Bu qaysi ustunni buzadi: Foydali, Halol yoki Zararsiz?',
      hints: [
        'U aniq, mavzuga oid javob beradi, shuning uchun Foydalilikni buzmaydi.',
        'Model haqiqatan tasdiqlay olmaydigan ma’lumot bilan birga kelgan “albatta” so’ziga e’tibor bering.',
      ],
      answer:
        'Halol emas — u haqiqatan bila olmaydigan vaqtda aniq sanani soxta ishonch bilan aytadi.',
      explanation:
        'Javob mavzuga oid (shuning uchun foydasiz emas) va xavfli emas (shuning uchun xavfsiz), lekin u tekshirib bo’lmaydigan taxminni aniq fakt sifatida taqdim etadi. Bu Halollik nuqsoni — javob laf urish o’rniga noaniqlikni tan olishi kerak. Buzilgan ustunni aniqlash aynan label-issues mashqi o’rgatadigan narsa.',
    },
    goDeeper: {
      title: 'Uch ustun to’qnashganda',
      body: 'Foydali, Halol va Zararsiz odatda kelishadi, lekin qiyin holatlar — bu ular ziddiyatga kelgandadir, va bularni hal qilish — bu haqiqiy moslashtirish (alignment) ishining mohiyati. Xavfli so’rovga eng foydali javob eng kam zararsiz bo’lishi mumkin; eng halol javob (“Bilmayman”) ishonchli taxminga qaraganda kamroq foydali tuyulishi mumkin. Yaxshi loyihalashtirilgan AI ziddiyat yuzaga kelganda Zararsiz va Halolni xom foydalilikdan ustun qo’yishga o’rgatiladi, chunki ishonchli, xavfli yoki rost bo’lmagan javob ehtiyotkor javobga qaraganda ko’proq zarar keltiradi.',
    },
    video: {
      title: 'Foydali, Halol, Zararsiz tizimi',
      description:
        'Uch ustun qanday birga ishlaydi — va javob qaysi birini buzishiga qanday tashxis qo’yish kerak.',
    },
    activity: {
      prompt:
        'Quyidagi har bir javob bitta tamoyilni buzadi. To’g’ri yorliqni har bir javobga torting — yoki yorliqni bosing, keyin javobni bosing.',
      feedback: {
        correct:
          'Aynan shunday. Xavfli maslahat Zararsizlikni, o’ylab topilgan ishonch Halollikni, noaniq e’tiborsizlik esa Foydalilikni buzadi. Buzilgan ustunni nomlash fikr-mulohazangizni aniq qiladi.',
        incorrect:
          'Har birini qayta tekshiring. Xavfli maslahat → Zararsiz emas. Ishonchli o’ylab topilgan fakt → Halol emas. Haqiqatan yordam bermaydigan javob → Foydali emas.',
      },
      data: {
        labels: [
          {
            text: 'Foydali emas',
          },
          {
            text: 'Halol emas',
          },
          {
            text: 'Zararsiz emas',
          },
        ],
        statements: [
          {
            text: 'Yarqirab tozalik uchun oqartiruvchi (bleach) va ammiakni birga aralashtiring va ishqalang — zo’r ishlaydi!',
            why:
              'Oqartiruvchi va ammiakni aralashtirish zaharli gaz hosil qiladi. Bu xavfli, shuning uchun u Zararsizlikni buzadi.',
          },
          {
            text: 'Men 100% ishonchim komilki, bu yil sizning soliq qaytarmangiz aynan $4,212 bo’ladi.',
            why:
              'Model buni bila olmaydi va o’ylab topilgan raqamni soxta ishonch bilan aytadi. U Halollikni buzadi.',
          },
          {
            text: 'Parolni qanday tiklash kerak? Eh, menyularni shunchaki ko’zdan kechir, qayerdadir topasan.',
            why:
              'U foydalanuvchiga vazifani bajarishda haqiqatan yordam bermaydi. U Foydalilikni buzadi.',
          },
        ],
      },
    },
  },
  'eval-rewrite': {
    explanation:
      'Baholovchilar shunchaki baho qo’ymaydi — ular yaxshilaydi. Kuchsiz javob berilganda, siz nima yetishmayotganini aniqlaysiz va uni 5/5 ga qayta yozasiz: aniq, foydali, tushunarli va xavfsiz. Nimani o’zgartirganingizni aniq ko’rsatish — fikr-mulohazani model va jamoa uchun foydali qiladigan narsadir.',
    example: {
      text: 'Noaniq "sozlamalarga o’ting yoki shunga o’xshash narsa" aniq raqamlangan qadamlar, xushmuomala ohang va aynan qayerga bosishni tasdiqlash qo’shilishi bilan 5/5 ga aylanadi.',
    },
    workedExample: {
      intro:
        'Keling, bitta kuchsiz javobni 5/5 ga aylantiraman, har bir o’zgarishni va nega u yaxshilanishga loyiq ekanini hikoya qilib boraman.',
      steps: [
        'Savol: “Parolimni qanday tiklayman?” Kuchsiz javob: “Sozlamalarda qayerdadir tiklash narsasini topib ol.” U noaniq, biroz mensimaydigan va hech qanday haqiqiy qadam bermaydi.',
        'Birinchi tuzatish — aniq, tartibli qadamlar qo’shish: “1) Sozlamalarni oching, 2) Hisob (Account) ga teging, 3) "Parolni tiklash" ga teging va ko’rsatmalarga amal qiling.” Endi u haqiqatan amaliy.',
        'Ikkinchi tuzatish — xushmuomala, professional ohang: “topib ol” o’rniga “Yordam berishdan xursandman —” deb boshlash. Bir xil faktlar, ancha yaxshi tajriba.',
        'Men shu yerda to’xtayman. Men uni to’ldiruvchi matn yoki soxta siyosat ogohlantirishlari bilan to’ldirMAYMAN — ular uzunlik qo’shadi, qiymat emas. 5/5 — bu to’liq va aniq, shishirilgan emas.',
      ],
      takeaway:
        '5/5 ga qayta yozish — bu yetishmagan narsani qo’shish — aniq qadamlar, foydali ohang, aniq yo’l-yo’riq — to’ldiruvchi matn yoki o’ylab topilgan tafsilotsiz. Har bir o’zgarishni aniq ko’rsatish — tuzatishni foydali qiladigan narsadir.',
    },
    guided: {
      prompt:
        'Keling, birgalikda qayta yozishni rejalashtiramiz. Kuchsiz qo’llab-quvvatlash javobi shunday deydi: “bilmadim, balki shunchaki qayta ishga tushirib ko’r.” Unga bu o’zgarishlardan qaysi biri chinakam kerak: (a) aniq qadam-baqadam ko’rsatmalar, (b) xushmuomala professional ohang, yoki (c) oxiriga yopishtirilgan uzun huquqiy ogohlantirish?',
      hints: [
        '5/5 javob aniq, foydali va hurmatli — foydalanuvchiga muvaffaqiyat qozonish uchun aslida nima kerakligini tasavvur qiling.',
        'Bu variantlardan biri foydalanuvchiga umuman yordam bermasdan uzunlik qo’shadi.',
      ],
      answer:
        'Unga (a) aniq qadam-baqadam ko’rsatmalar va (b) xushmuomala professional ohang kerak — lekin (c) uzun huquqiy ogohlantirish EMAS.',
      explanation:
        'Javob noaniq va mensimaydigani uchun nuqsonli, shuning uchun haqiqiy tuzatishlar — aniq qadamlar va hurmatli ohang. Yopishtirilgan huquqiy ogohlantirish foydalanuvchiga muammosini hal qilishda yordam bermasdan javobni shunchaki to’ldiradi — 5/5 esa uzunlik bo’yicha emas, chinakam yordam va aniqlik bo’yicha baholanadi. Bu aynan rewrite mashqi sizdan qilishni so’raydigan hukm.',
    },
    goDeeper: {
      title: 'Nima uchun “tahrirlaringizni ko’rsatish” bu bitta javobdan tashqarida ham muhim',
      body: 'Nimani o’zgartirganingizni nomlash — “qadamlar qo’shdim, ohangni tuzatdim” — qayta yozishning o’zidan ham qimmatliroq. Bitta yaxshilangan javob bir foydalanuvchiga yordam beradi; nima noto’g’ri bo’lgani va uni qanday tuzatganingiz haqidagi aniq ro’yxat esa jamoa (va model) o’rganishi mumkin bo’lgan qonuniyatga aylanadi, shuning uchun keyingi minglab javob yaxshiroq boshlanadi. Yaxshi baholash bir martalik tuzatishlar emas, qayta foydalanish mumkin bo’lgan saboqlar ishlab chiqaradi.',
    },
    video: {
      title: '5/5 sari qayta yozish',
      description:
        'Kuchsiz javobni yaxshilashning takrorlanadigan usuli: kamchiliklarga tashxis qo’ying, keyin ularni to’ldirish uchun qayta yozing.',
    },
    activity: {
      prompt:
        'Bu kuchsiz qo’llab-quvvatlash javobini yaxshilang. Yaxshiroq versiyangizni yozing, keyin unga kerak bo’lgan har bir o’zgarishni tanlang.',
      feedback: {
        correct:
          'Kuchli qayta yozish. Siz aniq qadamlar, professional ohang va aniq yo’l-yo’riq qo’shdingiz — to’ldiruvchi matn yoki soxta ogohlantirishlarsiz. O’zingiznikini quyidagi 5/5 model javobi bilan solishtiring.',
        incorrect:
          '5/5 ga aniq qadamlar, xushmuomala ohang va aniq yo’l-yo’riq kerak — to’ldiruvchi matn yoki o’ylab topilgan ogohlantirishlar emas. Haqiqiy yaxshilanish yozing va unga chinakam kerak bo’lgan o’zgarishlarni tanlang.',
      },
      data: {
        promptText: 'Mijoz so’raydi: "Obunamni qanday bekor qilaman?"',
        weakAnswer: 'Sozlamalarga yoki shunga o’xshash joyga o’ting. Bu juda oson, shunchaki atrofga qarang.',
        placeholder: 'Yaxshilangan 5/5 javobingizni shu yerga yozing…',
        improvements: [
          {
            text: 'Aniq, qadam-baqadam ko’rsatmalar bering',
          },
          {
            text: 'Xushmuomala, professional ohangdan foydalaning',
          },
          {
            text: 'Sozlamani aynan qayerdan topishni tasdiqlang',
          },
          {
            text: 'Rasmiy eshitiladigan huquqiy ogohlantirishlar qo’shing',
          },
          {
            text: 'Uni qo’shimcha to’ldiruvchi matn bilan shishiring',
          },
        ],
        modelAnswer:
          'Albatta — mana qanday bekor qilinadi: 1) Sozlamalarni oching, 2) To’lov (Billing) ni tanlang, 3) "Obunani bekor qilish" ni bosing va tasdiqlang. Sizning kirish huquqingiz joriy to’lov davringiz oxirigacha faol qoladi. Agar biror qiyinchilikka duch kelsangiz, shu yerga javob yozing, men yordam beraman.',
      },
    },
  },
  'eval-capstone': {
    explanation:
      'Hammasini birlashtirish vaqti keldi. Bu yakuniy loyihada (capstone) siz haqiqiy baholash to’plamini bajarib chiqasiz: javobni baholaysiz, ikkita javobni saralaysiz, xatoni ilg’aysiz, kuchsiz javobni qayta yozasiz va mulohaza yuritasiz. Baholovchi sertifikatingizni olish uchun har bir qadamni bajaring.',
    example: {
      text: 'Bu aynan professional baholovchi ishida amal qiladigan ish jarayoni — mezonni bir nechta vazifada qo’llash, keyin natijalarni umumlashtirish.',
    },
    workedExample: {
      intro:
        'Keling, baholovchining to’liq ish jarayonini boshidan oxirigacha bir marta birga o’tib chiqaman, shunda beshta yakuniy vazifa bitta bog’langan ish bo’lib his qilinsin.',
      steps: [
        'Baholash: Men bitta javobni o’qiyman va uni mezon bo’yicha 1–5 baholayman — aniq, foydali, halol, zararsiz, tushunarli — va raqamni asoslab beraman.',
        'Solishtirish: bitta so’rovga ikkita javob berilganda, men yaxshirog’ini tanlayman va nega ekanini aytaman, chunki afzalliklar — bu modellar “yaxshi” nima ekanini o’rganadigan usul.',
        'Xatoni ilg’ash: Men ravon javobni jumlama-jumla ko’zdan kechiraman va yolg’on bo’lgan ishonchli da’voni belgilayman.',
        'Qayta yozish, keyin mulohaza: Men yetishmagan narsani qo’shib kuchsiz javobni 5/5 ga aylantiraman, keyin nimani o’rganganimni umumlashtiraman — chunki baholovchi ham baho qo’yadi, ham yaxshilaydi.',
      ],
      takeaway:
        'Professional baholash to’plami butun ko’nikma to’plamini — baholash, saralash, xatolarni ilg’ash, qayta yozish, mulohaza — davomida bir xil mezonga asoslangan bitta takrorlanadigan ish jarayoniga bog’laydi.',
    },
    guided: {
      prompt:
        'To’plamni boshlashdan oldin asosiy o’zakni mustahkamlang. Beshta vazifani — baholash, saralash, xatolarni ilg’ash va qayta yozishni — bog’laydigan yagona standart nima?',
      hints: [
        'Har bir vazifa javobni aslida nimaga qarab o’lchayotganini o’ylab ko’ring.',
        'Bu mezon darsidan beri foydalanib kelayotgan o’sha mezonlar to’plami.',
      ],
      answer:
        'Mezon — aniq, foydali, halol, zararsiz va tushunarli — har bir vazifa ortidagi umumiy standartdir.',
      explanation:
        'Baholash mezonni bitta javobga qo’llaydi; saralash ikkita javobni unga qarshi solishtiradi; xatolarni ilg’ash uning Aniqlik va Halolligini ta’minlaydi; qayta yozish javobni hammasiga mos kelishi uchun ko’taradi. Mezon — umumiy ip, shuning uchun yakuniy loyiha beshta bog’lanmagan mashqdek emas, izchil bo’lib his qilinadi — bu bitta standart, besh xil tarzda qo’llanadi.',
    },
    goDeeper: {
      title: 'Bu to’plam haqiqiy dunyoda nimani aks ettiradi',
      body: 'Besh vazifali jarayon — bu sanoatda inson fikr-mulohazasi AI tizimlarini qanday yaxshilashining kichraytirilgan versiyasi. Baholovchilar jamoasi model natijalarini umumiy mezon bo’yicha baholaydi va saralaydi, nuqsonlarni belgilaydi va yaxshiroq versiyalarni yozadi; bu hukmlar jamlanadi va modelni sozlash hamda u vaqt o’tishi bilan xavfsizroq va foydaliroq bo’lib borayotganini kuzatish uchun ishlatiladi. Bu to’plamni tugatish shuni anglatadiki, siz haqiqiy AI tizimlarini ishonchli saqlab turadigan aynan o’sha mahoratni kichik ko’lamda mashq qildingiz.',
    },
    video: {
      title: 'Haqiqiy baholash to’plamining ichida',
      description:
        'Baholashdan to mulohazagacha bo’lgan boshidan oxirigacha baholash vazifasi bo’ylab sayohat.',
    },
    activity: {
      prompt:
        'Baholash to’plamidagi beshta vazifaning hammasini bajaring. Sizning jarayoningiz nazorat ro’yxatida kuzatib boriladi.',
      feedback: {
        correct:
          'Tabriklaymiz — siz to’liq baholash to’plamini tugatdingiz. Siz javoblarni baholay olasiz, javoblarni saralay olasiz, gallyutsinatsiyalarni ilg’ay olasiz, kuchsiz javoblarni qayta yoza olasiz va o’z hukmingiz haqida mulohaza yurita olasiz. Siz AI model baholovchisidek o’ylaysiz.',
        incorrect:
          'Deyarli yetdingiz — o’tkazib yuborgan vazifalaringizni qayta ko’rib chiqing. Mezonni qo’llang: aniq, foydali, halol, zararsiz va tushunarli.',
      },
      data: {
        steps: [
          {
            title: 'Javobni baholang',
            promptText: 'So’rov: "Telefonim suvga tushib ketsa nima qilishim kerak?"',
            answer:
              'Uni tez olib chiqing, tashqarisini quriting va o’chiring. Ho’l holida zaryadlamang. Yana yoqishdan oldin to’liq qurishiga qo’ying (yaxshisi bir-ikki kun).',
            rationale: 'Aniq, xavfsiz, tushunarli va amaliy — kuchli 5.',
          },
          {
            title: 'Ikkita javobni saralang',
            promptText: 'So’rov: "Suv aylanishini bir jumlada umumlashtiring."',
            a: 'Suv havoga bug’lanadi, bulutlarga aylanadi, yomg’ir yoki qor bo’lib yog’adi va daryolar hamda dengizlarga qaytib oqadi — keyin yana takrorlanadi.',
            b: 'Suv aylanishi — bu suv tabiatda nimadir qiladigan va ko’p harakatlanadigan paytdir.',
            why:
              'A javobi aniq, to’liq va tushunarli. B javobi noaniq va ma’lumotsiz.',
          },
          {
            title: 'Xatoni ilg’ang',
            promptText: 'So’rov: "Menga Quyosh haqida aytib bering."',
            sentences: [
              {
                text: 'Quyosh — bizning quyosh tizimimiz markazidagi yulduz.',
              },
              {
                text: 'U asosan vodorod va geliydan tashkil topgan.',
              },
              {
                text: 'Quyosh — muzdan yasalgan kichik, sovuq sayyora.',
                issue: 'Yolg’on — Quyosh issiq yulduz, sovuq muz sayyora emas.',
              },
            ],
            why:
              'Faqat uchinchi jumla yolg’on: Quyosh issiq yulduz, sovuq muz sayyora emas.',
          },
          {
            title: 'Eng kuchsiz javobni qayta yozing',
            promptText: 'So’rov: "Parolimni qanday kuchliroq qilaman?"',
            weakAnswer: 'Bilmadim, shunchaki uzunroq qil yoki nimadir.',
            placeholder: 'Aniq, foydali 5/5 javob yozing…',
          },
          {
            title: 'Mulohaza yuriting',
            question:
              'Bir-ikki jumlada: AI javobini ishonchli qiladigan narsa nima va baholovchining ishi nima?',
            placeholder: 'Nimani o’rganganingizni baham ko’ring…',
          },
        ],
      },
    },
  },
}

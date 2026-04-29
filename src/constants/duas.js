export const DUA_CATEGORIES = [
  { id: 'all', name: 'All Duas', icon: '🤲' },
  { id: 'morning_evening', name: 'Morning & Evening', icon: '🌅' },
  { id: 'prayer', name: 'Prayer & Salah', icon: '🕌' },
  { id: 'protection', name: 'Protection', icon: '🛡️' },
  { id: 'distress', name: 'Distress & Anxiety', icon: '🫂' },
  { id: 'health', name: 'Health & Sickness', icon: '🩹' },
  { id: 'provision', name: 'Provision & Debt', icon: '💰' },
  { id: 'forgiveness', name: 'Forgiveness', icon: '📿' },
  { id: 'family', name: 'Family & Marriage', icon: '🏠' },
  { id: 'travel', name: 'Travel & Journey', icon: '✈️' },
  { id: 'etiquette', name: 'Etiquette', icon: '✨' },
  { id: 'quranic', name: 'Quranic (Rabbana)', icon: '📖' },
];

export const DUAS = [
  // --- MORNING & EVENING ---
  {
    id: 'd1',
    category: 'morning_evening',
    title: 'Morning Supplication',
    arabic: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَهَ إلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
    transliteration: "Asbahna wa-asbahal-mulku lillahi walhamdu lillahi, la ilaha illallahu wahdahu la sharika lahu, lahul-mulku walahul-hamdu wa huwa 'ala kulli shay'in qadir.",
    translation: "We have reached the morning and at this very time unto Allah belongs all sovereignty, and all praise is for Allah. None has the right to be worshipped but Allah alone, without partner.",
    reference: "Muslim 4/2088"
  },
  {
    id: 'd2',
    category: 'morning_evening',
    title: 'Sayyid al-Istighfar (The Master Prayer for Forgiveness)',
    arabic: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ لِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ",
    transliteration: "Allahumma Anta Rabbi la ilaha illa Anta, khalaqtani wa ana 'abduka, wa ana 'ala 'ahdika wa wa'dika mastata'tu, a'udhu bika min sharri ma sana'tu, abu'u laka bini'matika 'alayya, wa abu'u bidhanbi faghfir li fa-innahu la yaghfiru-dhunuba illa Anta.",
    translation: "O Allah, You are my Lord, there is none worthy of worship but You. You created me and I am your slave. I keep Your covenant and my pledge to You as far as I am able. I seek refuge in You from the evil of what I have done. I admit to Your blessings upon me and I admit to my misdeeds. Forgive me, for there is none who may forgive sins but You.",
    reference: "Bukhari 7/150"
  },
  
  // --- PRAYER & SALAH ---
  {
    id: 'd10',
    category: 'prayer',
    title: 'Before starting Salah (Istiftah)',
    arabic: "سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ، وَتَبَارَكَ اسْمُكَ، وَتَعَالَى جَدُّكَ، وَلَا إِلَهَ غَيْرُكَ",
    transliteration: "Subhanakal-lahumma wa bihamdika, wa tabarakas-muka wa ta'ala jadduka, wa la ilaha ghayruka.",
    translation: "Glory is to You O Allah, and praise. Blessed is Your Name and Exalted is Your Majesty. There is none worthy of worship but You.",
    reference: "Abu Dawud, Ibn Majah"
  },
  {
    id: 'd11',
    category: 'prayer',
    title: 'Supplication in Ruku (Bowing)',
    arabic: "سُبْحَانَ رَبِّيَ الْعَظِيمِ",
    transliteration: "Subhana Rabbiyal-'Azim.",
    translation: "Glory is to my Lord, the Most Magnificent.",
    reference: "Muslim, Abu Dawud"
  },
  {
    id: 'd12',
    category: 'prayer',
    title: 'Supplication in Sujud (Prostration)',
    arabic: "سُبْحَانَ رَبِّيَ الأَعْلَى",
    transliteration: "Subhana Rabbiyal-A'la.",
    translation: "Glory is to my Lord, the Most High.",
    reference: "Muslim, Abu Dawud"
  },

  // --- PROTECTION ---
  {
    id: 'd20',
    category: 'protection',
    title: 'Protection against all harm',
    arabic: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",
    transliteration: "Bismillahil-ladhi la yadurru ma'as-mihi shay'un fil-ardi wa la fis-sama'i wa Huwas-Sami'ul-'Alim.",
    translation: "In the Name of Allah, Who with His Name nothing can cause harm in the earth nor in the heavens, and He is the All-Hearing, the All-Knowing.",
    reference: "Abu Dawud 4/323, At-Tirmidhi 5/465"
  },
  {
    id: 'd21',
    category: 'protection',
    title: 'Seeking refuge from the evil of what He created',
    arabic: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
    transliteration: "A'udhu bikalimatil-lahit-tammati min sharri ma khalaq.",
    translation: "I seek refuge in the perfect words of Allah from the evil of what He has created.",
    reference: "Muslim 4/2080"
  },

  // --- DISTRESS & ANXIETY ---
  {
    id: 'd30',
    category: 'distress',
    title: 'Supplication for one in distress',
    arabic: "لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ",
    transliteration: "La ilaha illa Anta subhanaka inni kuntu minaz-zalimin.",
    translation: "There is none worthy of worship but You, glory is to You. Indeed, I was among the wrongdoers.",
    reference: "At-Tirmidhi 5/529, Al-Hakim"
  },
  {
    id: 'd31',
    category: 'distress',
    title: 'Dua for relief from sorrow and anxiety',
    arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْبُخْلِ وَالْجُبْنِ ، وَضَلَعِ الدَّيْنِ، وَغَلَبَةِ الرِّجَالِ",
    transliteration: "Allahumma inni a'udhu bika minal-hammi wal-hazani, wal-'ajzi wal-kasali, wal-bukhli wal-jubni, wa dala'id-dayni wa ghalabatir-rijal.",
    translation: "O Allah, I seek refuge in You from anxiety and sorrow, weakness and laziness, miserliness and cowardice, the burden of debts and from being overpowered by men.",
    reference: "Bukhari 7/158"
  },

  // --- HEALTH & SICKNESS ---
  {
    id: 'd40',
    category: 'health',
    title: 'Supplication for the sick',
    arabic: "لَا بَأْسَ طَهُورٌ إِنْ شَاءَ اللَّهُ",
    transliteration: "La ba'sa tahurun in sha' Allah.",
    translation: "No need to worry, it is a purification, if Allah wills.",
    reference: "Bukhari"
  },
  {
    id: 'd41',
    category: 'health',
    title: 'Dua for good health',
    arabic: "اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لَا إِلَهَ إِلَّا أَنْتَ",
    transliteration: "Allahumma 'afini fi badani, Allahumma 'afini fi sam'i, Allahumma 'afini fi basari, la ilaha illa Anta.",
    translation: "O Allah, grant me health in my body. O Allah, grant me health in my hearing. O Allah, grant me health in my sight. There is no god but You.",
    reference: "Abu Dawud 4/324"
  },

  // --- PROVISION & DEBT ---
  {
    id: 'd50',
    category: 'provision',
    title: 'Dua for provision',
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلًا مُتَقَبَّلًا",
    transliteration: "Allahumma inni as'aluka 'ilman nafi'an, wa rizqan tayyiban, wa 'amalan mutaqabbalan.",
    translation: "O Allah, I ask You for knowledge that is of benefit, a good provision, and deeds that will be accepted.",
    reference: "Ibn Majah"
  },

  // --- FORGIVENESS ---
  {
    id: 'd60',
    category: 'forgiveness',
    title: 'Seeking forgiveness',
    arabic: "أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ",
    transliteration: "Astaghfirullaha wa atubu ilayh.",
    translation: "I seek Allah's forgiveness and turn to Him in repentance.",
    reference: "Bukhari 7/146, Muslim 4/2075"
  },

  // --- TRAVEL ---
  {
    id: 'd70',
    category: 'travel',
    title: 'Dua for traveling',
    arabic: "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ",
    transliteration: "Subhanal-ladhi sakhkhara lana hadha wa ma kunna lahu muqrinin. Wa inna ila Rabbina lamunqalibun.",
    translation: "Glory to Him Who has brought this [vehicle] under our control, though we were unable to control it [ourselves], and indeed, to our Lord we will surely return.",
    reference: "Muslim 2/998"
  },

  // --- QURANIC ---
  {
    id: 'd80',
    category: 'quranic',
    title: 'Dua for goodness in both worlds',
    arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
    transliteration: "Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan waqina 'adhaban-nar.",
    translation: "Our Lord, give us in this world [that which is] good and in the Hereafter [that which is] good and protect us from the punishment of the Fire.",
    reference: "Al-Baqarah 2:201"
  },
  {
    id: 'd81',
    category: 'quranic',
    title: 'Dua for patience and firm footing',
    arabic: "رَبَّنَا أَفْرِغْ عَلَيْنَا صَبْرًا وَثَبِّتْ أَقْدَامَنَا وَانصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ",
    transliteration: "Rabbana afrigh 'alayna sabran wa thabbit aqdamana wansurna 'alal-qawmil-kafirin.",
    translation: "Our Lord, pour upon us patience and plant firmly our feet and give us victory over the disbelieving people.",
    reference: "Al-Baqarah 2:250"
  },
  
  // --- FAMILY & MARRIAGE ---
  {
    id: 'd90',
    category: 'family',
    title: 'Dua for righteous spouse and children',
    arabic: "رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا",
    transliteration: "Rabbana hab lana min azwajina wa dhurriyatina qurrata a'yunin waj'alna lil-muttaqina imama.",
    translation: "Our Lord, grant us from among our wives and offspring comfort to our eyes and make us an example for the righteous.",
    reference: "Al-Furqan 25:74"
  },
  {
    id: 'd91',
    category: 'family',
    title: 'Dua for parents',
    arabic: "رَّبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا",
    transliteration: "Rabbi-rhamhuma kama rabbayani saghira.",
    translation: "My Lord, have mercy upon them as they brought me up [when I was] small.",
    reference: "Al-Isra 17:24"
  },

  // --- ETIQUETTE ---
  {
    id: 'd100',
    category: 'etiquette',
    title: 'Before eating',
    arabic: "بِسْمِ اللَّهِ",
    transliteration: "Bismillah.",
    translation: "In the name of Allah.",
    reference: "Abu Dawud, At-Tirmidhi"
  },
  {
    id: 'd101',
    category: 'etiquette',
    title: 'After eating',
    arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ",
    transliteration: "Alhamdu lillahil-ladhi at'amani hadha wa razaqanihi min ghayri hawlin minni wa la quwwah.",
    translation: "Praise is to Allah Who has given me this food and sustained me with it though I was unable to do it and powerless.",
    reference: "Abu Dawud, At-Tirmidhi"
  },
  {
    id: 'd102',
    category: 'etiquette',
    title: 'When sneezing',
    arabic: "الْحَمْدُ لِلَّهِ",
    transliteration: "Alhamdu lillah.",
    translation: "All praise is for Allah.",
    reference: "Bukhari 7/125"
  },
  {
    id: 'd103',
    category: 'etiquette',
    title: 'Entering the home',
    arabic: "بِسْمِ اللَّهِ وَلَجْنَا، وَبِسْمِ اللَّهِ خَرَجْنَا، وَعَلَى رَبِّنَا تَوَكَّلْنَا",
    transliteration: "Bismillahi walajna, wa bismillahi kharajna, wa 'ala Rabbina tawakkalna.",
    translation: "In the Name of Allah we enter, in the Name of Allah we leave, and upon our Lord we rely.",
    reference: "Abu Dawud 4/325"
  },

  // --- PROVISION ---
  {
    id: 'd51',
    category: 'provision',
    title: 'Dua for relief from debt',
    arabic: "اللَّهُمَّ اكْفِنِي بِحَلَالِكَ عَنْ حَرَامِكَ وَأَغْنِنِي بِفَضْلِكَ عَمَّنْ سِوَاكَ",
    transliteration: "Allahummak-fini bihalalika 'an haramika wa aghnini bifadlika 'amman siwaka.",
    translation: "O Allah, suffice me with Your allowed instead of Your forbidden, and make me independent of all others besides You by Your grace.",
    reference: "At-Tirmidhi 5/560"
  },

  // --- PROTECTION (EXTENDED) ---
  {
    id: 'd22',
    category: 'protection',
    title: 'Seeking protection from the Dajjal',
    arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عَذَابِ الْقَبْرِ، وَأَعُوذُ بِكَ مِنْ فِتْنَةِ الْمَسِيحِ الدَّجَّالِ، وَأَعُوذُ بِكَ مِنْ فِتْنَةِ الْمَحْيَا وَالْمَمَاتِ",
    transliteration: "Allahumma inni a'udhu bika min 'adhabil-qabri, wa a'udhu bika min fitnatil-masihid-dajjal, wa a'udhu bika min fitnatil-mahya wal-mamat.",
    translation: "O Allah, I seek refuge in You from the punishment of the grave, and I seek refuge in You from the trial of the False Messiah, and I seek refuge in You from the trials of life and death.",
    reference: "Bukhari, Muslim"
  },
  {
    id: 'd23',
    category: 'protection',
    title: 'Dua for children\'s protection',
    arabic: "أُعِيذُكُمَا بِكَلِمَاتِ اللَّهِ التَّامَّةِ مِنْ كُلِّ شَيْطَانٍ وَهَامَّةٍ، وَمِنْ كُلِّ عَيْنٍ لَامَّةٍ",
    transliteration: "U'idhukuma bikalimatil-lahit-tammati min kulli shaytanin wa hammah, wa min kulli 'aynin lammah.",
    translation: "I seek protection for you in the Perfect Words of Allah from every devil and every beast, and from every envious eye.",
    reference: "Bukhari 4/119"
  },

  // --- KNOWLEDGE & GUIDANCE ---
  {
    id: 'd110',
    category: 'quranic',
    title: 'Dua for increase in knowledge',
    arabic: "رَّبِّ زِدْنِي عِلْمًا",
    transliteration: "Rabbi zidni 'ilma.",
    translation: "My Lord, increase me in knowledge.",
    reference: "Taha 20:114"
  },
  {
    id: 'd111',
    category: 'quranic',
    title: 'Dua for guidance',
    arabic: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
    transliteration: "Ihdinas-siratal-mustaqim.",
    translation: "Guide us to the straight path.",
    reference: "Al-Fatihah 1:6"
  },

  // --- SLEEP ---
  {
    id: 'd120',
    category: 'etiquette',
    title: 'Before sleeping',
    arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
    transliteration: "Bismika Allahumma amutu wa ahya.",
    translation: "In Your Name, O Allah, I die and I live.",
    reference: "Bukhari, Muslim"
  },
  {
    id: 'd121',
    category: 'etiquette',
    title: 'Upon waking up',
    arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
    transliteration: "Alhamdu lillahil-ladhi ahyana ba'da ma amatana wa ilayhin-nushur.",
    translation: "Praise is to Allah Who gives us life after He has caused us to die and to Him is the return.",
    reference: "Bukhari, Muslim"
  },
  
  // --- FORGIVENESS ---
  {
    id: 'd61',
    category: 'forgiveness',
    title: 'Dua of Prophet Yunus (AS)',
    arabic: "لَّا إِلَٰهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ",
    transliteration: "La ilaha illa Anta subhanaka inni kuntu minaz-zalimin.",
    translation: "There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers.",
    reference: "Al-Anbiya 21:87"
  },
  {
    id: 'd62',
    category: 'forgiveness',
    title: 'Comprehensive Istighfar',
    arabic: "رَبِّ اغْفِرْ لِي وَتُبْ عَلَيَّ إِنَّكَ أَنْتَ التَّوَّابُ الرَّحِيمُ",
    transliteration: "Rabbigh-fir li wa tub 'alayya innaka Antat-Tawwabur-Rahim.",
    translation: "My Lord, forgive me and accept my repentance, for You are the Accepter of Repentance, the Most Merciful.",
    reference: "Abu Dawud, At-Tirmidhi"
  },

  // --- HEALTH & SICKNESS ---
  {
    id: 'd42',
    category: 'health',
    title: 'Dua for any pain in the body',
    arabic: "أَعُوذُ بِاللَّهِ وَقُدْرَتِهِ مِنْ شَرِّ مَا أَجِدُ وَأُحَاذِرُ",
    transliteration: "A'udhu billahi wa qudratihi min sharri ma ajidu wa uhadhiru.",
    translation: "I seek refuge in Allah and His Power from the evil of what I find and of what I fear.",
    reference: "Muslim 4/1728"
  },
  {
    id: 'd43',
    category: 'health',
    title: 'Dua for healing (Ruqyah)',
    arabic: "أَذْهِبِ الْبَأْسَ رَبَّ النَّاسِ ، وَاشْفِ أَنْتَ الشَّافِي ، لَا شِفَاءَ إِلَّا شِفَاؤُكَ ، شِفَاءً لَا يُغَادِرُ سَقَمًا",
    transliteration: "Adhhibil-ba'sa Rabban-nas, washfi Antash-Shafi, la shifa'a illa shifa'uka, shifa'an la yughadiru saqama.",
    translation: "Remove the suffering, O Lord of mankind, and heal, for You are the Healer. There is no healing except Your healing, a healing that leaves no disease behind.",
    reference: "Bukhari, Muslim"
  }
];

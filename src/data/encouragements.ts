/**
 * encouragements.ts — L'écosystème de motivation de Hafiz.
 *
 * On accompagne l'apprenant avec des versets et des hadiths AUTHENTIQUES,
 * placés au bon moment de son parcours, et reliés à la façon dont le Coran a
 * été enseigné : Jibril ﷺ au Prophète ﷺ, puis le Prophète ﷺ à ses compagnons.
 *
 * RÈGLE ABSOLUE : chaque texte est vérifié et attribué (verset → sourate:verset,
 * hadith → recueil + numéro). Sources des hadiths : sunnah.com.
 *   - Double récompense pour qui peine à réciter : Bukhari 4937, Muslim 798 (Aïcha)
 *   - Jibril révisait le Coran chaque Ramadan, deux fois l'année de sa mort :
 *     Bukhari 4998 (Abu Hurayra) — fondement du murajaah (révision)
 *   - « Le meilleur d'entre vous apprend le Coran et l'enseigne » : Bukhari 5027 (Uthman)
 *
 * Traductions françaises d'après le sens (proches de Hamidullah).
 */

export type EncouragementContext =
  | 'home'
  | 'alphabet'
  | 'tajweed'
  | 'hifz'
  | 'listen'
  | 'revision'
  | 'struggle'
  | 'milestone'

export interface Encouragement {
  id: string
  kind: 'verset' | 'hadith'
  arabic: string
  /** Translittération simple (lecture à voix haute pour le débutant). */
  translit?: string
  french: string
  /** Référence exacte : « Al-‘Alaq 96:1 » ou « Sahih al-Bukhari 4937 ». */
  source: string
  /** Une phrase chaleureuse qui relie le texte au moment de l'apprenant. */
  note?: string
  contexts: EncouragementContext[]
}

export const ENCOURAGEMENTS: Encouragement[] = [
  {
    id: 'iqra',
    kind: 'verset',
    arabic: 'اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ',
    translit: 'Iqraʾ bismi rabbika alladhī khalaq',
    french: '« Lis, au nom de ton Seigneur qui a créé. »',
    source: 'Al-‘Alaq 96:1',
    note: "Tout a commencé par un seul mot : « Lis ». Jibril ﷺ l'a dit au Prophète ﷺ, qui ne savait pas lire. Vous êtes exactement à ce point de départ.",
    contexts: ['alphabet', 'home'],
  },
  {
    id: 'yassarna',
    kind: 'verset',
    arabic: 'وَلَقَدْ يَسَّرْنَا الْقُرْآنَ لِلذِّكْرِ فَهَلْ مِن مُّدَّكِرٍ',
    translit: 'Wa laqad yassarnā l-Qurʾāna li-dh-dhikri fa-hal min muddakir',
    french: '« Nous avons rendu le Coran facile à retenir. Y a-t-il quelqu\'un pour s\'en souvenir ? »',
    source: 'Al-Qamar 54:17',
    note: "Allah Lui-même a promis que le Coran serait facile à mémoriser. Avancez verset par verset, sans vous presser.",
    contexts: ['hifz', 'home', 'struggle'],
  },
  {
    id: 'zidni-ilma',
    kind: 'verset',
    arabic: 'وَقُل رَّبِّ زِدْنِي عِلْمًا',
    translit: 'Wa qul rabbi zidnī ‘ilmā',
    french: '« Et dis : Ô mon Seigneur, accrois mes connaissances. »',
    source: 'Ta-Ha 20:114',
    note: "Une invocation enseignée par Allah à Son Prophète ﷺ. Faites-en la vôtre avant chaque session.",
    contexts: ['home', 'hifz'],
  },
  {
    id: 'follow-recitation',
    kind: 'verset',
    arabic: 'فَإِذَا قَرَأْنَاهُ فَاتَّبِعْ قُرْآنَهُ',
    translit: 'Fa-idhā qaraʾnāhu fa-ttabi‘ qurʾānah',
    french: '« Quand Nous le récitons, suis sa récitation. »',
    source: 'Al-Qiyama 75:18',
    note: "Le Prophète ﷺ écoutait d'abord Jibril réciter, puis répétait après lui. Écoutez plusieurs fois avant de répéter — c'est la méthode prophétique.",
    contexts: ['listen'],
  },
  {
    id: 'tartil',
    kind: 'verset',
    arabic: 'وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا',
    translit: 'Wa rattili l-Qurʾāna tartīlā',
    french: '« Et récite le Coran lentement et clairement. »',
    source: 'Al-Muzzammil 73:4',
    note: "Le tajweed n'est pas un détail : c'est embellir la récitation comme Allah l'a ordonné. Prenez votre temps sur chaque son.",
    contexts: ['tajweed'],
  },
  {
    id: 'two-rewards',
    kind: 'hadith',
    arabic: 'وَالَّذِي يَقْرَأُ الْقُرْآنَ وَيَتَتَعْتَعُ فِيهِ وَهُوَ عَلَيْهِ شَاقٌّ لَهُ أَجْرَانِ',
    translit: 'Wa-lladhī yaqraʾu l-Qurʾāna wa yatataʿtaʿu fīhi wa huwa ʿalayhi shāqqun lahu ajrān',
    french: '« Celui qui récite le Coran en hésitant, et pour qui cela est difficile, aura deux récompenses. »',
    source: 'Sahih al-Bukhari 4937 · Muslim 798 (Aïcha)',
    note: "Vous butez sur les lettres ? Loin d'être un échec, votre effort est compté double auprès d'Allah.",
    contexts: ['struggle', 'home', 'alphabet'],
  },
  {
    id: 'jibril-revision',
    kind: 'hadith',
    arabic: 'كَانَ جِبْرِيلُ يُعَارِضُهُ الْقُرْآنَ كُلَّ عَامٍ مَرَّةً، فَعَارَضَهُ مَرَّتَيْنِ فِي الْعَامِ الَّذِي قُبِضَ فِيهِ',
    translit: 'Kāna Jibrīlu yuʿāriḍuhu l-Qurʾāna kulla ʿāmin marra, fa-ʿāraḍahu marratayni fī l-ʿāmi lladhī qubiḍa fīh',
    french: '« Jibril révisait le Coran avec lui [le Prophète ﷺ] une fois chaque année ; il le révisa deux fois l\'année de sa mort. »',
    source: 'Sahih al-Bukhari 4998 (Abu Hurayra)',
    note: "Même le Prophète ﷺ révisait. La révision n'est pas une corvée : c'est la sunna de Jibril ﷺ lui-même.",
    contexts: ['revision'],
  },
  {
    id: 'best-of-you',
    kind: 'hadith',
    arabic: 'خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ',
    translit: 'Khayrukum man taʿallama l-Qurʾāna wa ʿallamah',
    french: '« Le meilleur d\'entre vous est celui qui apprend le Coran et l\'enseigne. »',
    source: 'Sahih al-Bukhari 5027 (Uthman)',
    note: "Chaque lettre apprise vous rapproche de cette parole. Ce que vous faites a du poids.",
    contexts: ['milestone', 'home'],
  },
]

/** Jour de l'année (1–366), pour une rotation stable sur 24 h. */
function dayOfYear(date = new Date()): number {
  const start = new Date(date.getFullYear(), 0, 0)
  const diff = date.getTime() - start.getTime()
  return Math.floor(diff / 86_400_000)
}

/** Encouragements disponibles pour un contexte donné. */
export function encouragementsFor(context: EncouragementContext): Encouragement[] {
  return ENCOURAGEMENTS.filter((e) => e.contexts.includes(context))
}

/**
 * Un encouragement pour un contexte, stable sur la journée (change chaque jour).
 * Renvoie `null` si aucun n'est défini pour ce contexte.
 */
export function encouragementOfDay(context: EncouragementContext): Encouragement | null {
  const pool = encouragementsFor(context)
  if (pool.length === 0) return null
  return pool[dayOfYear() % pool.length]
}

/**
 * Données statiques de l'alphabet arabe — les 28 lettres
 *
 * Sources:
 * - Formes Unicode : Unicode Arabic Presentation Forms-A & B (U+FE70–U+FEFF)
 * - Phonétique : ALA-LC Romanization Tables pour l'arabe
 * - Classification solaire/lunaire : grammaire arabe classique
 *
 * Note islamique : Les lettres arabes sont les véhicules de la Parole d'Allah.
 * Leur apprentissage est une ibada (acte d'adoration). Que Allah facilite
 * l'apprentissage du Coran à tous ceux qui utilisent cette application.
 */

import type { ArabicLetter } from '../types'

/**
 * Les 28 lettres de l'alphabet arabe dans l'ordre traditionnel (abjadi moderne).
 *
 * Connecteurs Unicode :
 * - ـ (U+0640) = tatweel (connecteur horizontal)
 * - Les formes de présentation (FE70–FEFF) ne sont plus recommandées ;
 *   on préfère les caractères de base combinés avec le connecteur.
 *
 * Convention pour les formes :
 * - isolated : lettre seule, sans connexion
 * - initial  : début de mot (connectée à droite)
 * - medial   : milieu de mot (connectée des deux côtés)
 * - final    : fin de mot (connectée à gauche)
 * Pour les lettres non-connectantes (alif, dal, dhal, ra, zay, waw),
 * initial = medial = isolated, et final = isolated.
 */
export const ARABIC_ALPHABET: ArabicLetter[] = [
  // ─── 1. Alif ───────────────────────────────────────────────
  {
    id: 1,
    name: 'أَلِف',
    nameTranslit: 'Alif',
    nameFr: 'Alif',
    isolated: 'ا',
    initial: 'ا',   // Alif ne se connecte pas à gauche
    medial: 'ـا',
    final: 'ـا',
    phonetic: "Comme le 'a' long en français (ex : pâte). Peut aussi être support de hamza.",
    phoneticAcademic: 'ā / ʾ',
    group: 'lunaire',
    audioUrl: '',
  },

  // ─── 2. Ba ─────────────────────────────────────────────────
  {
    id: 2,
    name: 'بَاء',
    nameTranslit: 'Bāʾ',
    nameFr: 'Ba',
    isolated: 'ب',
    initial: 'بـ',
    medial: 'ـبـ',
    final: 'ـب',
    phonetic: "Comme le 'b' français (ex : bateau).",
    phoneticAcademic: 'b',
    group: 'lunaire',
    audioUrl: '',
  },

  // ─── 3. Ta ─────────────────────────────────────────────────
  {
    id: 3,
    name: 'تَاء',
    nameTranslit: 'Tāʾ',
    nameFr: 'Ta',
    isolated: 'ت',
    initial: 'تـ',
    medial: 'ـتـ',
    final: 'ـت',
    phonetic: "Comme le 't' français, non aspiré (ex : table).",
    phoneticAcademic: 't',
    group: 'solaire',
    audioUrl: '',
  },

  // ─── 4. Tha ────────────────────────────────────────────────
  {
    id: 4,
    name: 'ثَاء',
    nameTranslit: 'Thāʾ',
    nameFr: 'Tha',
    isolated: 'ث',
    initial: 'ثـ',
    medial: 'ـثـ',
    final: 'ـث',
    phonetic: "Comme le 'th' anglais sourd de 'think' — la langue entre les dents.",
    phoneticAcademic: 'th',
    group: 'solaire',
    audioUrl: '',
  },

  // ─── 5. Jim ────────────────────────────────────────────────
  {
    id: 5,
    name: 'جِيم',
    nameTranslit: 'Jīm',
    nameFr: 'Jim',
    isolated: 'ج',
    initial: 'جـ',
    medial: 'ـجـ',
    final: 'ـج',
    phonetic: "Comme le 'dj' de 'djinn'. Prononciation classique (Coran) : légèrement affriquée.",
    phoneticAcademic: 'j',
    group: 'lunaire',
    audioUrl: '',
  },

  // ─── 6. Ha (pharyngale soufflée) ───────────────────────────
  {
    id: 6,
    name: 'حَاء',
    nameTranslit: 'Ḥāʾ',
    nameFr: 'Ha (soufflé)',
    isolated: 'ح',
    initial: 'حـ',
    medial: 'ـحـ',
    final: 'ـح',
    phonetic: "Souffle chaud et rauque venant du fond de la gorge (pharynx), sans équivalent français. Différent du خ.",
    phoneticAcademic: 'ḥ',
    group: 'lunaire',
    audioUrl: '',
  },

  // ─── 7. Kha ────────────────────────────────────────────────
  {
    id: 7,
    name: 'خَاء',
    nameTranslit: 'Khāʾ',
    nameFr: 'Kha',
    isolated: 'خ',
    initial: 'خـ',
    medial: 'ـخـ',
    final: 'ـخ',
    phonetic: "Comme le 'j' espagnol de 'Juan' ou le 'ch' allemand de 'Bach' — raclement vélaire.",
    phoneticAcademic: 'kh',
    group: 'lunaire',
    audioUrl: '',
  },

  // ─── 8. Dal ────────────────────────────────────────────────
  {
    id: 8,
    name: 'دَال',
    nameTranslit: 'Dāl',
    nameFr: 'Dal',
    isolated: 'د',
    initial: 'د',   // non-connectante à gauche
    medial: 'ـد',
    final: 'ـد',
    phonetic: "Comme le 'd' français (ex : dame).",
    phoneticAcademic: 'd',
    group: 'solaire',
    audioUrl: '',
  },

  // ─── 9. Dhal ───────────────────────────────────────────────
  {
    id: 9,
    name: 'ذَال',
    nameTranslit: 'Dhāl',
    nameFr: 'Dhal',
    isolated: 'ذ',
    initial: 'ذ',   // non-connectante à gauche
    medial: 'ـذ',
    final: 'ـذ',
    phonetic: "Comme le 'th' anglais sonore de 'this' ou 'the' — la langue entre les dents, voix.",
    phoneticAcademic: 'dh',
    group: 'solaire',
    audioUrl: '',
  },

  // ─── 10. Ra ────────────────────────────────────────────────
  {
    id: 10,
    name: 'رَاء',
    nameTranslit: 'Rāʾ',
    nameFr: 'Ra',
    isolated: 'ر',
    initial: 'ر',   // non-connectante à gauche
    medial: 'ـر',
    final: 'ـر',
    phonetic: "R roulé alvéolaire, proche de l'espagnol ou de l'italien. Peut être lourd (مُفَخَّم) ou léger (مُرَقَّق) selon le tajweed.",
    phoneticAcademic: 'r',
    group: 'solaire',
    audioUrl: '',
  },

  // ─── 11. Zay ───────────────────────────────────────────────
  {
    id: 11,
    name: 'زَاي',
    nameTranslit: 'Zāy',
    nameFr: 'Zay',
    isolated: 'ز',
    initial: 'ز',   // non-connectante à gauche
    medial: 'ـز',
    final: 'ـز',
    phonetic: "Comme le 'z' français (ex : zèbre).",
    phoneticAcademic: 'z',
    group: 'solaire',
    audioUrl: '',
  },

  // ─── 12. Sin ───────────────────────────────────────────────
  {
    id: 12,
    name: 'سِين',
    nameTranslit: 'Sīn',
    nameFr: 'Sin',
    isolated: 'س',
    initial: 'سـ',
    medial: 'ـسـ',
    final: 'ـس',
    phonetic: "Comme le 's' français sourd (ex : sable).",
    phoneticAcademic: 's',
    group: 'solaire',
    audioUrl: '',
  },

  // ─── 13. Shin ──────────────────────────────────────────────
  {
    id: 13,
    name: 'شِين',
    nameTranslit: 'Shīn',
    nameFr: 'Shin',
    isolated: 'ش',
    initial: 'شـ',
    medial: 'ـشـ',
    final: 'ـش',
    phonetic: "Comme le 'ch' français (ex : chat, cheval).",
    phoneticAcademic: 'sh',
    group: 'solaire',
    audioUrl: '',
  },

  // ─── 14. Sad ───────────────────────────────────────────────
  {
    id: 14,
    name: 'صَاد',
    nameTranslit: 'Ṣād',
    nameFr: 'Sad',
    isolated: 'ص',
    initial: 'صـ',
    medial: 'ـصـ',
    final: 'ـص',
    phonetic: "S emphatique — la langue se creuse vers le bas. Rend les voyelles voisines plus sombres.",
    phoneticAcademic: 'ṣ',
    group: 'solaire',
    audioUrl: '',
  },

  // ─── 15. Dad ───────────────────────────────────────────────
  {
    id: 15,
    name: 'ضَاد',
    nameTranslit: 'Ḍād',
    nameFr: 'Dad',
    isolated: 'ض',
    initial: 'ضـ',
    medial: 'ـضـ',
    final: 'ـض',
    phonetic: "D emphatique — la plus difficile de l'alphabet, propre à l'arabe (« langue du Ḍād »). Son latéralisé et pharyngalisé.",
    phoneticAcademic: 'ḍ',
    group: 'solaire',
    audioUrl: '',
  },

  // ─── 16. Ta emphatique ─────────────────────────────────────
  {
    id: 16,
    name: 'طَاء',
    nameTranslit: 'Ṭāʾ',
    nameFr: 'Ta (emphatique)',
    isolated: 'ط',
    initial: 'طـ',
    medial: 'ـطـ',
    final: 'ـط',
    phonetic: "T emphatique pharyngalisé — langue creusée vers le bas. L'un des cinq sons de qalqala.",
    phoneticAcademic: 'ṭ',
    group: 'solaire',
    audioUrl: '',
  },

  // ─── 17. Zha emphatique ────────────────────────────────────
  {
    id: 17,
    name: 'ظَاء',
    nameTranslit: 'Ẓāʾ',
    nameFr: 'Zha (emphatique)',
    isolated: 'ظ',
    initial: 'ظـ',
    medial: 'ـظـ',
    final: 'ـظ',
    phonetic: "Th sonore emphatique — comme le 'dh' mais pharyngalisé. Propre au Coran.",
    phoneticAcademic: 'ẓ',
    group: 'solaire',
    audioUrl: '',
  },

  // ─── 18. Ain ───────────────────────────────────────────────
  {
    id: 18,
    name: 'عَيْن',
    nameTranslit: 'ʿAyn',
    nameFr: 'Ain',
    isolated: 'ع',
    initial: 'عـ',
    medial: 'ـعـ',
    final: 'ـع',
    phonetic: "Consonne pharyngale sonore sans équivalent français — constriction au fond de la gorge avec voix. Fondamentale dans le Coran.",
    phoneticAcademic: 'ʿ',
    group: 'lunaire',
    audioUrl: '',
  },

  // ─── 19. Ghain ─────────────────────────────────────────────
  {
    id: 19,
    name: 'غَيْن',
    nameTranslit: 'Ghayn',
    nameFr: 'Ghain',
    isolated: 'غ',
    initial: 'غـ',
    medial: 'ـغـ',
    final: 'ـغ',
    phonetic: "Fricative uvulaire sonore — ressemble au 'r' grasseyé parisien, mais plus postérieur.",
    phoneticAcademic: 'gh',
    group: 'lunaire',
    audioUrl: '',
  },

  // ─── 20. Fa ────────────────────────────────────────────────
  {
    id: 20,
    name: 'فَاء',
    nameTranslit: 'Fāʾ',
    nameFr: 'Fa',
    isolated: 'ف',
    initial: 'فـ',
    medial: 'ـفـ',
    final: 'ـف',
    phonetic: "Comme le 'f' français (ex : famille).",
    phoneticAcademic: 'f',
    group: 'lunaire',
    audioUrl: '',
  },

  // ─── 21. Qaf ───────────────────────────────────────────────
  {
    id: 21,
    name: 'قَاف',
    nameTranslit: 'Qāf',
    nameFr: 'Qaf',
    isolated: 'ق',
    initial: 'قـ',
    medial: 'ـقـ',
    final: 'ـق',
    phonetic: "K uvulaire — comme un 'k' prononcé tout au fond de la bouche. L'un des cinq sons de qalqala.",
    phoneticAcademic: 'q',
    group: 'lunaire',
    audioUrl: '',
  },

  // ─── 22. Kaf ───────────────────────────────────────────────
  {
    id: 22,
    name: 'كَاف',
    nameTranslit: 'Kāf',
    nameFr: 'Kaf',
    isolated: 'ك',
    initial: 'كـ',
    medial: 'ـكـ',
    final: 'ـك',
    phonetic: "Comme le 'k' français (ex : képi), mais légèrement palatalisé.",
    phoneticAcademic: 'k',
    group: 'lunaire',
    audioUrl: '',
  },

  // ─── 23. Lam ───────────────────────────────────────────────
  {
    id: 23,
    name: 'لَام',
    nameTranslit: 'Lām',
    nameFr: 'Lam',
    isolated: 'ل',
    initial: 'لـ',
    medial: 'ـلـ',
    final: 'ـل',
    phonetic: "Comme le 'l' français. Devient lam jalala (لَّه) dans le nom d'Allah quand précédé d'une voyelle ouverte.",
    phoneticAcademic: 'l',
    group: 'solaire',
    audioUrl: '',
  },

  // ─── 24. Mim ───────────────────────────────────────────────
  {
    id: 24,
    name: 'مِيم',
    nameTranslit: 'Mīm',
    nameFr: 'Mim',
    isolated: 'م',
    initial: 'مـ',
    medial: 'ـمـ',
    final: 'ـم',
    phonetic: "Comme le 'm' français. Importante en tajweed : règles d'ikhfa shafawi et idgham shafawi.",
    phoneticAcademic: 'm',
    group: 'lunaire',
    audioUrl: '',
  },

  // ─── 25. Nun ───────────────────────────────────────────────
  {
    id: 25,
    name: 'نُون',
    nameTranslit: 'Nūn',
    nameFr: 'Nun',
    isolated: 'ن',
    initial: 'نـ',
    medial: 'ـنـ',
    final: 'ـن',
    phonetic: "Comme le 'n' français. Sujet à de nombreuses règles tajweed (idgham, ikhfa, iqlab, idhar).",
    phoneticAcademic: 'n',
    group: 'solaire',
    audioUrl: '',
  },

  // ─── 26. Ha (laryngale) ────────────────────────────────────
  {
    id: 26,
    name: 'هَاء',
    nameTranslit: 'Hāʾ',
    nameFr: 'Ha (laryngale)',
    isolated: 'ه',
    initial: 'هـ',
    medial: 'ـهـ',
    final: 'ـه',
    phonetic: "Comme le 'h' anglais de 'house' — souffle glottal doux, différent de ح.",
    phoneticAcademic: 'h',
    group: 'lunaire',
    audioUrl: '',
  },

  // ─── 27. Waw ───────────────────────────────────────────────
  {
    id: 27,
    name: 'وَاو',
    nameTranslit: 'Wāw',
    nameFr: 'Waw',
    isolated: 'و',
    initial: 'و',   // non-connectante à gauche
    medial: 'ـو',
    final: 'ـو',
    phonetic: "Consonantique : comme le 'w' anglais. Vocalique long : comme le 'ou' français (ex : loup).",
    phoneticAcademic: 'w / ū',
    group: 'lunaire',
    audioUrl: '',
  },

  // ─── 28. Ya ────────────────────────────────────────────────
  {
    id: 28,
    name: 'يَاء',
    nameTranslit: 'Yāʾ',
    nameFr: 'Ya',
    isolated: 'ي',
    initial: 'يـ',
    medial: 'ـيـ',
    final: 'ـي',
    phonetic: "Consonantique : comme le 'y' de 'yaourt'. Vocalique long : comme le 'i' français long (ex : vie).",
    phoneticAcademic: 'y / ī',
    group: 'lunaire',
    audioUrl: '',
  },
]

/**
 * Retourne une lettre par son id (1–28).
 */
export function getLetterById(id: number): ArabicLetter | undefined {
  return ARABIC_ALPHABET.find((l) => l.id === id)
}

/**
 * Retourne les lettres d'un groupe phonétique donné.
 */
export function getLettersByGroup(group: ArabicLetter['group']): ArabicLetter[] {
  return ARABIC_ALPHABET.filter((l) => l.group === group)
}

/** Lettres solaires : 14 lettres — le 'l' du article 'al-' s'assimile à ces sons */
export const LETTRES_SOLAIRES = getLettersByGroup('solaire')

/** Lettres lunaires : 14 lettres — le 'l' du article 'al-' reste intact devant ces sons */
export const LETTRES_LUNAIRES = getLettersByGroup('lunaire')

/**
 * Lettres qui ne se connectent pas à gauche (non-connectantes) :
 * ا د ذ ر ز و — elles ne se connectent qu'à droite (à la lettre précédente).
 */
export const LETTRES_NON_CONNECTANTES: ReadonlySet<number> = new Set([1, 8, 9, 10, 11, 27])

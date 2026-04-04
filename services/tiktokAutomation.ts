import type {
  BuzzAnalysis,
  BuzzScene,
  BuzzScriptPack,
  GeneratedPost,
  InfiniteIdeaPack,
  PostPackage,
  ScheduleItem,
  TrendPack,
} from '../types';

const LOVE_TREND_DB = [
  '復縁', '片思い', '不倫', '既読無視', '年下彼氏', '年上彼女', '遠距離恋愛',
  '連絡頻度', '脈あり', '運命の人', 'ツインレイ', '相性診断', '誕生日占い',
  '名前相性', '彼の本音', '恋愛成就'
];

const HOOK_DB = [
  '知らないと損です',
  '実は逆です',
  'この恋、勘違いしていませんか？',
  '当てはまったら危険です',
  'これを知らないと遠回りします',
  '本音を言うと、ここが分かれ道です',
];

const STRUCTURE_DB = [
  '疑問→否定→共感→衝撃→誘導',
  '結論→理由→体験→逆転→誘導',
  'あるある→ズレ→本音→解決→誘導',
  '不安→真実→共感→希望→誘導',
];

const CTA_SET = [
  '続きはプロフィール',
  '無料占いはこちら',
];

const UNIVERSAL_PERSONAS = [
  '連絡を待ってしまう人',
  '相手の本音が気になる人',
  '頑張るほど空回りしやすい人',
  '優しすぎて損しやすい人',
  '好きな人に振り回されやすい人',
  '不安になると考えすぎる人',
];

const STORY_FRAGMENTS = [
  '既読はつくのに、関係が進まない',
  '相手の態度に一喜一憂してしまう',
  '嫌われたくなくて本音を隠してしまう',
  '少し優しくされるだけで期待してしまう',
  '距離を詰めたいのにタイミングがずれる',
  '追うほど苦しくなってしまう',
];

const toSeed = (input: string) =>
  input.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

const seededPick = <T,>(items: T[], seed: number, offset = 0): T =>
  items[(seed + offset) % items.length];

const generateScenes = (
  theme: string,
  shockOrSolution: string,
  pullLine: string
): BuzzScene[] => [
  {
    id: 'scene-1',
    title: '疑問形タイトル',
    text: `${theme}で悩む人、最初に見直す場所を間違えていませんか？`,
    englishKeyword: 'QUESTION',
    durationSec: 8,
  },
  {
    id: 'scene-2',
    title: '常識の否定',
    text: `頑張るほど良い、は${theme}では逆になることがあります。`,
    englishKeyword: 'DENIAL',
    durationSec: 8,
  },
  {
    id: 'scene-3',
    title: '共感ストーリー',
    text: `期待して、不安になって、また待ってしまう。その流れにハマる人は本当に多いです。`,
    englishKeyword: 'EMPATHY',
    durationSec: 8,
  },
  {
    id: 'scene-4',
    title: '解決 or 衝撃',
    text: shockOrSolution,
    englishKeyword: 'SHOCK',
    durationSec: 8,
  },
  {
    id: 'scene-5',
    title: '行動誘導',
    text: pullLine,
    englishKeyword: 'CTA',
    durationSec: 8,
  },
];

export const generateTrendPack = (theme: string): TrendPack => {
  const seed = toSeed(theme);

  const trendKeywords = Array.from(
    new Set([
      theme,
      seededPick(LOVE_TREND_DB, seed, 1),
      seededPick(LOVE_TREND_DB, seed, 3),
      seededPick(LOVE_TREND_DB, seed, 5),
      seededPick(LOVE_TREND_DB, seed, 7),
    ])
  ).slice(0, 5);

  const hookPatterns = [
    seededPick(HOOK_DB, seed, 0),
    seededPick(HOOK_DB, seed, 2),
    seededPick(HOOK_DB, seed, 4),
  ];

  const structureTemplates = [
    seededPick(STRUCTURE_DB, seed, 0),
    seededPick(STRUCTURE_DB, seed, 1),
  ];

  return {
    trendKeywords,
    hookPatterns,
    structureTemplates,
    generatedTrendTitle: `${theme} × ${trendKeywords[1]}で作るトレンド風投稿`,
  };
};

export const generateBuzzScriptPack = (
  theme: string,
  autoCtaEnabled: boolean
): BuzzScriptPack => {
  const seed = toSeed(theme);

  const questionTitle = `${theme}がうまくいかない本当の理由、知っていますか？`;
  const hook = seededPick(HOOK_DB, seed, 0);
  const denial = `「待てば好転する」は${theme}では通用しないことがあります。`;
  const empathyStory = `期待して、考えすぎて、また不安になる。その流れにハマる人は本当に多いです。`;
  const shockOrSolution = `${theme}で流れを変える人は、感情ではなくタイミングと見せ方を先に整えています。`;
  const pullLine = autoCtaEnabled
    ? `${CTA_SET[0]}。${CTA_SET[1]}。`
    : '続きは次の投稿で解説します。';

  const scenes = generateScenes(theme, shockOrSolution, pullLine);

  return {
    questionTitle,
    hook,
    denial,
    empathyStory,
    shockOrSolution,
    pullLine,
    scenes,
    fullScript: [
      `【${questionTitle}】`,
      hook,
      denial,
      empathyStory,
      shockOrSolution,
      pullLine,
    ].join('\n\n'),
  };
};

export const generateInfiniteIdeaPack = (
  theme: string
): InfiniteIdeaPack => {
  const seed = toSeed(theme);
  const persona = seededPick(UNIVERSAL_PERSONAS, seed, 0);
  const story = seededPick(STORY_FRAGMENTS, seed, 2);

  const fortuneSummary = `${theme}で流れが変わる人は、勢いよりも“伝え方の順番”を整えた瞬間に恋愛運が上向きやすいです。特に${persona}は、焦るほど逆効果になりやすい傾向があります。`;

  const loveStory = `${story}。でも本当に大事なのは、相手を追うことではなく、自分の見せ方とタイミングを整えることです。${theme}を題材にすると、すれ違い・本音・逆転の流れをストーリー化しやすくなります。`;

  const endlessIdeas = [
    `${theme}で相手の本音が出る瞬間`,
    `${theme}で連絡が来る前兆`,
    `${theme}でやってはいけない行動3つ`,
    `${theme}で逆転する人の共通点`,
    `${theme}で不安が増える理由`,
    `${theme}で流れを変える一言`,
    `${theme}を恋愛ストーリー化したらこうなる`,
  ];

  return {
    fortuneSummary,
    loveStory,
    endlessIdeas,
  };
};

export const generateSchedulePack = (
  times: string[],
  theme: string
): ScheduleItem[] => {
  const safeTimes = times.filter(Boolean).slice(0, 5);
  return safeTimes.map((time, index) => ({
    id: `schedule-${time}-${index}`,
    label: index === 0 ? '朝' : index === 1 ? '昼' : index === 2 ? '夜' : `枠${index + 1}`,
    time,
    outputTitle: `${theme}の投稿データ`,
    status: 'ready',
  }));
};

export const buildPostPackage = (
  theme: string,
  hashtags: string[],
  autoCtaEnabled: boolean
): PostPackage => {
  const finalCta = autoCtaEnabled
    ? `${CTA_SET[0]} / ${CTA_SET[1]}`
    : '保存してあとで見返してください';

  const tiktokCaption = [
    `${theme}で悩む人へ。`,
    '最初に見直すだけで流れが変わるポイントをまとめました。',
    finalCta,
    hashtags.join(' '),
  ].join('\n');

  return {
    tiktokCaption,
    finalCta,
    hashtags,
    readyToPostText: `${tiktokCaption}\n\n#TikTok #恋愛 #占い`,
  };
};

export const analyzeBuzzFromHistory = (
  currentTheme: string,
  history: GeneratedPost[]
): BuzzAnalysis => {
  const allThemes = history
    .map((item) => item.theme?.trim())
    .filter((item): item is string => !!item);

  const allHooks = history
    .map((item) => item.buzzScript?.hook?.trim())
    .filter((item): item is string => !!item);

  const countMap = (items: string[]) =>
    [...new Set(items)].sort(
      (a, b) =>
        items.filter((item) => item === b).length -
        items.filter((item) => item === a).length
    );

  const topThemes = countMap(allThemes).slice(0, 3);
  const topHooks = countMap(allHooks).slice(0, 3);

  const strengths = [
    '疑問形タイトルを使っている',
    '恋愛系の感情ワードと具体ワードが入っている',
    '最後に行動誘導がある',
  ];

  const weakPoints = [];
  if (!/\d/.test(currentTheme)) {
    weakPoints.push('数字要素が少ない');
  }
  if (!currentTheme.includes('本音') && !currentTheme.includes('前兆')) {
    weakPoints.push('感情フックを増やせる');
  }

  let score = 72;
  if (currentTheme.includes('復縁') || currentTheme.includes('不倫') || currentTheme.includes('片思い')) score += 8;
  if (topThemes.includes(currentTheme)) score += 5;
  if (weakPoints.length === 0) score += 5;

  return {
    score: Math.min(score, 98),
    strengths,
    weakPoints,
    optimizationNext: [
      'フックに断定ワードを追加する',
      'シーン4で衝撃または逆転要素を強める',
      '最後の誘導文を短く強くする',
    ],
    topThemesFromHistory: topThemes,
    topHookPatternsFromHistory: topHooks,
  };
};

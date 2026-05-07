/**
 * テーマ分析エンジン - テーマから深い洞察を抽出
 */
const analyzeThemeKeywords = (theme: string): string[] => {
  // テーマを分析して関連キーワードを生成
  const keywords: string[] = [];
  
  // テーマ自体を分割
  const parts = theme.split(/[\s・〜～\-]+/).filter(p => p);
  keywords.push(...parts);
  
  // テーマに関連する一般的なキーワード拡張
  const themeKeywords: Record<string, string[]> = {
    'インスタ': ['SNS', '拡散', 'バズ', 'フォロワー', 'エンゲージメント'],
    'TikTok': ['トレンド', 'バイラル', '若者', 'ダンス', 'ニューユーザー'],
    'YouTube': ['動画', '視聴', 'チャンネル', '登録', '再生回数'],
    'note': ['執筆', '読者', '記事', 'ファン', 'サポート'],
    'X': ['ツイート', 'リツイート', '拡散', '話題', 'トレンド'],
    'Threads': ['共感', 'ストーリー', '会話', 'コミュニティ', '繋がり'],
    '恋愛': ['感情', 'パートナー', 'リレーション', 'デート', '相性'],
    'ビジネス': ['成長', 'スキル', 'キャリア', '売上', '効率'],
    '健康': ['体', 'ウェルネス', 'フィットネス', 'メンタル', '習慣'],
    '学習': ['勉強', 'スキル', 'マスター', '習慣', 'プロセス'],
  };
  
  // テーマに含まれるキーワードから関連キーワードを追加
  for (const [key, relatedKeywords] of Object.entries(themeKeywords)) {
    if (theme.includes(key)) {
      keywords.push(...relatedKeywords);
    }
  }
  
  return [...new Set(keywords)];
};

/**
 * テーマに基づく具体的なフック（冒頭）生成
 */
const generateThemeSpecificHooks = (theme: string): string[] => {
  const baseHooks = [
    `【知らないと損】${theme}の真実`,
    `${theme}で気付いていない人、実はほとんど`,
    `${theme}で結果が出ない原因が判明`,
    `${theme}で一番重要な3つのポイント`,
    `${theme}が劇的に変わる方法`,
    `本当は${theme}だけで十分です`,
    `${theme}で失敗する人の共通点`,
    `${theme}の伸びる人と伸びない人の差`,
  ];
  
  return baseHooks;
};

/**
 * テーマに基づく心理トリガー埋め込み
 */
const embedPsychologicalTriggers = (theme: string): { curiosity: string; rarity: string; loss: string; empathy: string } => {
  return {
    curiosity: `実は${theme}の${Math.random() > 0.5 ? '一番大事な' : '意外な'}部分は...`,
    rarity: `${theme}で成功してる${Math.random() > 0.5 ? '1%だけ' : '多くの人は'}知ってる方法`,
    loss: `${theme}で知らないままだと、${Math.random() > 0.5 ? '毎日損してます' : '後で後悔します'}`,
    empathy: `${theme}で${Math.random() > 0.5 ? '頑張ってるのに結果が出ない' : '悩んでる'} あなたへ`,
  };
};

/**
 * プロンプト生成用ユーティリティ
 */
const clampText = (text: string, min: number, max: number) => {
  const trimmed = text.trim();
  if (trimmed.length >= min && trimmed.length <= max) return trimmed;
  if (trimmed.length > max) return trimmed.slice(0, max);
  return `${trimmed}${'。'.repeat(Math.max(0, min - trimmed.length))}`.slice(0, max);
};

const padOrTrim = (text: string, min: number, max: number) => {
  if (text.length > max) return text.slice(0, max);
  if (text.length < min) {
    const filler = '今すぐ確認してください。';
    let result = text;
    while (result.length < min) {
      result += filler;
    }
    return result.slice(0, max);
  }
  return text;
};

const targetLength = (length: string) => {
  if (length === '200文字') return 200;
  if (length === '500文字') return 500;
  return 300;
};

/**
 * バズスコア計算（改善版）
 */
const buzzWords = [
  '危険',
  '損',
  '今すぐ',
  '知らないと損',
  '変わる',
  '最短',
  '失敗',
  '本音',
  '真実',
  '逆転',
  '伸びる',
  '売れる',
  '共感',
  '希少',
  'え',
  '？',
  '！',
];

const calcBuzzScore = (text: string) => {
  let score = 40;

  if (/\d/.test(text)) score += 10;
  if (text.includes('？') || text.includes('?')) score += 10;
  if (buzzWords.some((word) => text.includes(word))) score += 15;
  if (text.includes('共通点') || text.includes('理由')) score += 10;
  if (text.includes('今すぐ') || text.includes('まず')) score += 10;
  if (text.includes('変わります') || text.includes('伸び') || text.includes('反応')) score += 10;

  return Math.min(score, 100);
};

const buildCTA = (theme: string) =>
  clampText(`今すぐ${theme}を確認してください`, 20, 40);

const buildThumbnail = (theme: string) => {
  const keywords = analyzeThemeKeywords(theme);
  const base = `${keywords[0]}の真実`;
  return base.length > 15 ? base.slice(0, 15) : base;
};

const buildCapcutTemplate = (theme: string) => {
  const keywords = analyzeThemeKeywords(theme);
  return [
    'SCENE 1 / HOOK',
    `「${theme}で気付いていないこと」`,
    '',
    'SCENE 2 / EMPATHY',
    `${keywords[0]}で困ってる人へ`,
    '',
    'SCENE 3 / PROBLEM',
    `原因は${keywords[1] || '方法'}`,
    '',
    'SCENE 4 / SOLUTION',
    `本当の解決策は`,
    '',
    'SCENE 5 / BENEFIT',
    `これだけで全部変わる`,
    '',
    'SCENE 6 / CTA',
    '今すぐチェック'
  ].join('\n');
};

const buildProfile = (theme: string) => {
  const keywords = analyzeThemeKeywords(theme);
  const text = `${keywords.slice(0, 2).join('・')}について専門的に解説｜初心者向けの実践的なノウハウ・最新トレンド・効率的な方法を毎日発信中｜保存で後から見返せます`;
  return padOrTrim(text, 80, 120);
};

const buildNoteLead = (theme: string) => {
  const keywords = analyzeThemeKeywords(theme);
  const text = `${theme}で望む結果を得られない理由は、実はシンプルです。多くの人が見落としている${keywords[0]}の${keywords[1] || '本質'}について、この記事では徹底解説します。時間の無駄を避けたい方は、ぜひ最後まで読んでみてください。`;
  return padOrTrim(text, 100, 200);
};

const buildWeeklyTemplates = (theme: string) => {
  const keywords = analyzeThemeKeywords(theme);
  return [
    `月：${theme}の基礎知識`,
    `火：${keywords[0] || theme}で失敗する理由`,
    `水：${theme}の実践的な3ステップ`,
    `木：${keywords[1] || 'プロ'}が使ってる秘技`,
    `金：${theme}でやってはいけないNG行為`,
    `土：${keywords[2] || '成功者'}の共通点`,
    `日：${theme}の今週のまとめ`,
  ];
};

/**
 * 改善版：テーマ分析ベースの高度なパッケージ生成
 */
export const generateAdvancedPack = (
  theme: string,
  length: string,
  gender: string,
  age: string
) => {
  const target = targetLength(length);
  const keywords = analyzeThemeKeywords(theme);
  const hooks = generateThemeSpecificHooks(theme);
  const triggers = embedPsychologicalTriggers(theme);
  
  // ランダムにフックを選択
  const selectedHook = hooks[Math.floor(Math.random() * hooks.length)];
  
  // テーマに基づいた記事を生成（従来のテンプレートを改善）
  const profile = `${gender === '指定なし' ? '' : gender}${age === '指定なし' ? '' : age}`.trim() || '多くの人';
  
  // より多様な記事構造を生成
  const structures = [
    {
      title: `【${selectedHook}】`,
      content: `${triggers.curiosity}\n\n${profile}ほど、この問題で悩まされています。\n\n実は成功してる人は、${keywords[0]}の${keywords[1] || '本質'}を理解しています。\n\nそれは、①${keywords[2] || '基本'}を理解する ②${keywords[3] || '実行'}する ③${keywords[4] || '継続'}する です。\n\nたったこれだけで、${theme}の結果が大きく変わります。`,
    },
    {
      title: `【${theme}で気付いていない人へ】`,
      content: `${triggers.loss}\n\n毎日多くの人が${theme}で同じ失敗をしています。\n\n原因は努力不足ではなく、${keywords[0]}の見せ方を間違えているだけです。\n\n結果を変えるために必要なのは、①${keywords[1] || '観点'}を変える ②${keywords[2] || '順番'}を工夫する ③${keywords[3] || 'トレンド'}を取り入れる\n\nこの3つを意識するだけで、反応が劇的に変わります。`,
    },
    {
      title: `【${theme}の本当の理由】`,
      content: `${triggers.rarity}\n\nあなたが${theme}で成功できない理由は実はここです。\n\n${profile}ほど、この視点が抜けています。\n\n成功してる${Math.random() > 0.5 ? '1%' : '上位層'}は全員、①${keywords[0]}の${keywords[1]}を見ている ②${keywords[2]}を活用している ③${keywords[3]}を工夫している\n\nこれを意識するだけで、${theme}はまるで別物に変わります。`,
    }
  ];
  
  const selectedStructure = structures[Math.floor(Math.random() * structures.length)];
  const article = selectedStructure.title + '\n\n' + selectedStructure.content;
  const trimmedArticle = article.length > target ? article.slice(0, target - 1) + '…' : article;
  const buzzScore = calcBuzzScore(trimmedArticle);

  return {
    article: trimmedArticle,
    cta: buildCTA(theme),
    thumbnail: buildThumbnail(theme),
    capcutTemplate: buildCapcutTemplate(theme),
    profile: buildProfile(theme),
    noteLead: buildNoteLead(theme),
    weeklyTemplates: buildWeeklyTemplates(theme),
    buzzScore,
  };
};

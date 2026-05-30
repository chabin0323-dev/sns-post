// services/loveContentGenerator.ts
// Gemini API不使用・完全ローカルテンプレート方式・全ジャンル対応

import type { GeneratedContent, Theme, HookType, OutputKey } from '../types';

// ============================================================
// フックタイプ別・汎用テンプレート（{theme}に自由入力が入る）
// ============================================================
const HOOK_TEMPLATES: Record<HookType, string[]> = {
  '否定系': [
    `【{theme}でやってはいけないこと3選】\n\n{theme}を頑張っているのに\nなぜか結果が出ない…\n\nそれ、もしかしたら\n間違ったやり方をしているかも。\n\n今すぐやめるべき3つのこと、\n正直に話します。`,
    `【その{theme}の常識、実は間違いです】\n\nみんなが当たり前にやっている{theme}の方法。\n\nでも実は、それが\n一番の遠回りになっていることがあります。\n\n知らないと損する、本当のことを話します。`,
    `【{theme}で失敗する人の共通点】\n\n{theme}がうまくいかない人には\n必ずある共通点があります。\n\nあなたは大丈夫ですか？\n\n3つのチェックポイントを確認してください。`,
  ],
  '不安系': [
    `【{theme}を続けないと将来こうなります】\n\n「{theme}は後でいいや」\n\nそう思っているあなたに\n知ってほしいことがあります。\n\n5年後に後悔しないために\n今すぐ確認してください。`,
    `【{theme}、このまま放置すると危険です】\n\n{theme}について\n「まだ大丈夫」と思っていませんか？\n\n実は、今がターニングポイント。\n\n知っておくべき3つのサインを解説します。`,
    `【{theme}で損している人の特徴】\n\n気づかないうちに\n{theme}で損をしている人がいます。\n\nあなたは当てはまっていませんか？\n\nチェックリストで確認してみてください。`,
  ],
  '暴露系': [
    `【{theme}のプロが隠していること】\n\n{theme}を長年やってきた人が\n教えてくれない本音があります。\n\n表では言えないことを\n正直に話します。\n\nこれを知っているかどうかで\n結果が全然違います。`,
    `【{theme}の裏側、教えます】\n\n{theme}について\n一般的に言われていることと\n実際は全然違います。\n\n現場を知っているからこそ\n言える本音を話します。`,
    `【誰も教えてくれない{theme}の真実】\n\n{theme}を始める前に\n知っておくべきことがあります。\n\nきれいごとじゃない、\nリアルな話をします。`,
  ],
  '男性心理系': [
    `【{theme}で相手が本当に思っていること】\n\n{theme}について\n相手は何を考えているのか。\n\n言葉にならない本音を\n心理学の観点から解説します。\n\n知るだけで、関係が変わります。`,
    `【{theme}、実は相手はこう見ています】\n\nあなたの{theme}に対する行動、\n相手にはどう映っているか\n知っていますか？\n\n意外な真実を明かします。`,
    `【{theme}で気持ちを動かす心理テクニック】\n\n{theme}において\n相手の心を動かすには\nコツがあります。\n\n心理学的に正しいアプローチを\n3つ紹介します。`,
  ],
  '実は系': [
    `【{theme}、実はこれが一番大事でした】\n\n{theme}について\nいろんな方法を試してきたけど\n\n最終的に行き着いた\n一番シンプルで大事なことを話します。\n\n案外、気づいていない人が多いです。`,
    `【{theme}で結果が出る人が密かにやっていること】\n\n{theme}がうまくいっている人は\n実は全員ある共通点があります。\n\n特別なことじゃない、\nでも知らない人がほとんどのこと。`,
    `【{theme}について、実は誤解されていること】\n\n{theme}に関する\n「常識」と思われていることの中に\n\n実は全然違う事実があります。\n\nこれを知るだけで見方が変わります。`,
  ],
};

// ============================================================
// 汎用ハッシュタグ生成（どんなジャンルでも対応）
// ============================================================
const generateHashtags = (theme: string): string[] => {
  return [
    `#${theme}`,
    `#${theme}攻略`,
    `#${theme}初心者`,
    `#${theme}tips`,
    `#知らないと損`,
    `#TikTok`,
    `#SNS発信`,
    `#バズる投稿`,
  ];
};

// ============================================================
// ランダム選択
// ============================================================
function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ============================================================
// メイン生成関数（Gemini API不使用・全ジャンル対応）
// ============================================================
export function generateContent(params: {
  theme: Theme;
  hookType: HookType;
  prevTitle: string;
  enabledKeys: OutputKey[];
  tiktokLength: 300 | 500 | 600;
  profileCta: string;
  postUrl: string;
}): GeneratedContent {
  const { theme, hookType, prevTitle, profileCta, postUrl, tiktokLength } = params;

  const templates = HOOK_TEMPLATES[hookType];
  const rawTemplate = pickRandom(templates);
  const mainScriptBase = rawTemplate.replace(/\{theme\}/g, theme);

  const lengthSuffix = tiktokLength >= 500
    ? `\n\n詳しくはプロフィールのリンクから👆\n\n${profileCta}`
    : `\n\n${profileCta}`;

  const mainContent = mainScriptBase + lengthSuffix;

  const hashtags = generateHashtags(theme);
  const hashtagText = hashtags.join(' ');

  const threadsPost = `${mainContent}\n\n${hashtagText}`;

  const xPost = mainScriptBase.split('\n').slice(0, 4).join('\n') + `\n\n${postUrl}`;

  const noteArticle = `# ${theme}について知っておくべきこと\n\n${mainContent}\n\n---\n詳しくはこちら: ${postUrl}`;

  const seoSet = {
    title: `${theme}の真実｜知らないと損する3つのこと`,
    keywords: [theme, `${theme} 方法`, `${theme} コツ`, `${theme} 初心者`, 'TikTok'],
    description: `${theme}について、知らないと損する本当のことを解説。わかりやすく説明します。`,
  };

  const thumbnailPrompt = `テーマ「${theme}」のTikTokサムネイル。インパクトのある文字「${mainScriptBase.split('\n')[0]}」をメインに、目を引く背景、驚いた表情のイラスト。`;

  const buzzScore = {
    hookPower: hookType === '暴露系' ? 90 : hookType === '否定系' ? 85 : 80,
    saveRate: 75,
    commentRate: 70,
    profileRate: 80,
    seoScore: 75,
    total: 78,
    comment: `${hookType}は反応率が高いフックです。${theme}との相性も良好。`,
  };

  return {
    theme,
    hookType,
    prevTitle,
    mainContent,
    hashtags,
    hashtagText,
    threadsPost,
    xPost,
    noteArticle,
    noteUrl: postUrl,
    seoSet,
    thumbnailPrompt,
    buzzScore,
    timestamp: new Date().toISOString(),
  };
}

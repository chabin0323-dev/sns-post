// services/loveContentGenerator.ts
// Gemini API不使用・完全ローカルテンプレート方式・全ジャンル対応

import type { GeneratedContent, Theme, HookType, OutputKey } from '../types';

// ============================================================
// フックタイプ別・汎用テンプレート（{theme}に自由入力が入る）
// ============================================================
const HOOK_TEMPLATES: Record<HookType, string[]> = {
  '否定系': [
    `【{theme}でやってはいけないこと3選】\n\n{theme}を頑張っているのに\nなぜか結果が出ない…\n\nそれ、もしかしたら\n間違ったやり方をしているかも。\n\n今すぐやめるべき3つのこと、\n正直に話します。\n\n①見た目だけ整えようとする\n②量だけ増やして質を無視する\n③継続せずにすぐ諦める\n\nこの3つに心当たりがある人は\n要注意です。`,
    `【その{theme}の常識、実は間違いです】\n\nみんなが当たり前にやっている{theme}の方法。\n\nでも実は、それが\n一番の遠回りになっていることがあります。\n\n知らないと損する、本当のことを話します。\n\nよくある間違い3選：\n①正しいと思っていたことが逆効果\n②頑張るほど結果が出にくくなる\n③続けるほど遠ざかってしまう\n\n正しい方向で努力することが\n何より大切です。`,
    `【{theme}で失敗する人の共通点】\n\n{theme}がうまくいかない人には\n必ずある共通点があります。\n\nあなたは大丈夫ですか？\n\n3つのチェックポイント：\n①基礎を飛ばして応用に進む\n②結果だけ見て過程を無視する\n③自己流にこだわりすぎる\n\n1つでも当てはまったら\n今すぐ見直してください。\n\n小さな修正が大きな変化を生みます。`,
  ],
  '不安系': [
    `【{theme}を続けないと将来こうなります】\n\n「{theme}は後でいいや」\n\nそう思っているあなたに\n知ってほしいことがあります。\n\n実は今が一番大事なタイミング。\n\n放置すると起こること：\n①差がどんどん開いていく\n②取り返しがつかなくなる\n③後悔しても遅くなる\n\n5年後に後悔しないために\n今すぐ確認してください。\n\n小さな一歩が未来を変えます。`,
    `【{theme}、このまま放置すると危険です】\n\n{theme}について\n「まだ大丈夫」と思っていませんか？\n\n実は、今がターニングポイント。\n\n知っておくべき3つのサイン：\n①なんとなく結果が出ていない\n②周りとの差を感じてきた\n③焦りや不安を感じている\n\nこれは変化のサインです。\n\n今動けば必ず変わります。\n一緒に正しい方向へ進みましょう。`,
    `【{theme}で損している人の特徴】\n\n気づかないうちに\n{theme}で損をしている人がいます。\n\nあなたは当てはまっていませんか？\n\n損している人の特徴：\n①間違った情報を信じている\n②効率の悪い方法を続けている\n③正しいやり方を知らない\n\n知っているか知らないかだけで\n結果が全然変わります。\n\n今日から正しい方法で進みましょう。`,
  ],
  '暴露系': [
    `【{theme}のプロが隠していること】\n\n{theme}を長年やってきた人が\n教えてくれない本音があります。\n\n表では言えないことを\n正直に話します。\n\n実は知られていない3つの事実：\n①一般的に言われていることは古い\n②本当に効果があるのは別の方法\n③プロが実際にやっていることは違う\n\nこれを知っているかどうかで\n結果が全然違います。\n\nぜひ参考にしてみてください。`,
    `【{theme}の裏側、教えます】\n\n{theme}について\n一般的に言われていることと\n実際は全然違います。\n\n現場を知っているからこそ\n言える本音を話します。\n\n裏側の真実3選：\n①表に出ない成功の法則がある\n②失敗する人には共通パターンがある\n③知っている人だけが得をしている\n\nこの情報、ぜひ活用してください。\n\n知ることから全てが始まります。`,
    `【誰も教えてくれない{theme}の真実】\n\n{theme}を始める前に\n知っておくべきことがあります。\n\nきれいごとじゃない、\nリアルな話をします。\n\n知らないと損する3つの真実：\n①最初に躓くポイントは決まっている\n②うまくいく人には共通点がある\n③正しい順番で取り組むことが全て\n\nこれを知った上で始めると\n結果が大きく変わります。\n\n参考になれば嬉しいです。`,
  ],
  '男性心理系': [
    `【{theme}で相手が本当に思っていること】\n\n{theme}について\n相手は何を考えているのか。\n\n言葉にならない本音を\n心理学の観点から解説します。\n\n相手の本音3選：\n①表面上の言葉と本心は違う\n②行動に本当の気持ちが出る\n③タイミングと状況が全てを左右する\n\n知るだけで、関係が変わります。\n\n相手の気持ちを理解することが\n最初の一歩です。`,
    `【{theme}、実は相手はこう見ています】\n\nあなたの{theme}に対する行動、\n相手にはどう映っているか\n知っていますか？\n\n意外な真実を明かします。\n\n相手が実は気にしていること：\n①細かい言動や態度\n②一貫性があるかどうか\n③本気度が伝わっているか\n\nこの3つを意識するだけで\n相手の反応が変わります。\n\nぜひ試してみてください。`,
    `【{theme}で気持ちを動かす心理テクニック】\n\n{theme}において\n相手の心を動かすには\nコツがあります。\n\n心理学的に正しいアプローチ3選：\n①相手の立場から考える\n②感情に訴えかける伝え方をする\n③タイミングを見極めて行動する\n\nこれを知っているだけで\n相手への伝わり方が変わります。\n\n関係をより良くしたい方は\nぜひ参考にしてください。`,
  ],
  '実は系': [
    `【{theme}、実はこれが一番大事でした】\n\n{theme}について\nいろんな方法を試してきたけど\n\n最終的に行き着いた\n一番シンプルで大事なことを話します。\n\n実は大事だった3つのこと：\n①難しく考えすぎないこと\n②基本を徹底すること\n③継続することを最優先にすること\n\n案外、気づいていない人が多いです。\n\nシンプルなことを\n丁寧に続けることが\n一番の近道です。`,
    `【{theme}で結果が出る人が密かにやっていること】\n\n{theme}がうまくいっている人は\n実は全員ある共通点があります。\n\n特別なことじゃない、\nでも知らない人がほとんどのこと。\n\n結果が出る人の共通点3選：\n①毎日小さな積み重ねをしている\n②うまくいかない時も続けている\n③自分なりの工夫を加えている\n\nこれだけです。\n\n今日からあなたも\n同じことをやってみてください。`,
    `【{theme}について、実は誤解されていること】\n\n{theme}に関する\n「常識」と思われていることの中に\n\n実は全然違う事実があります。\n\nよくある誤解3選：\n①難しいと思っているが実は簡単\n②時間がかかると思っているが早い\n③特別な才能が必要と思っているが誰でもできる\n\nこれを知るだけで見方が変わります。\n\nまず一歩踏み出してみましょう。`,
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
// メイン生成関数
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

  // 文字数に応じてテンプレートを拡張
  const extensions: Record<number, string> = {
    300: `\n\n${profileCta}`,
    500: `\n\n▼なぜこれが重要なのか\n\n多くの人が気づかないうちに\n同じ失敗を繰り返しています。\n\n正しい方法を知っているだけで\n結果が大きく変わります。\n\nまず今日から1つだけ\n意識してみてください。\n\n詳しくはプロフィールのリンクから👆\n\n${profileCta}`,
    600: `\n\n▼なぜこれが重要なのか\n\n多くの人が気づかないうちに\n同じ失敗を繰り返しています。\n\n正しい方法を知っているだけで\n結果が大きく変わります。\n\n▼今日からできること\n\nまず小さな一歩を踏み出すこと。\nそれだけで3ヶ月後の結果が\n全然違ってきます。\n\n気になる人は\nプロフィールのリンクへ👆\n\n${profileCta}`,
  };

  const mainContent = mainScriptBase + (extensions[tiktokLength] ?? extensions[500]);

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

// ============================================================
// InputFormで使用する定数のexport
// ============================================================
export const ALL_HOOK_TYPES: HookType[] = ['否定系', '不安系', '暴露系', '男性心理系', '実は系'];

export const ALL_OUTPUT_KEYS: OutputKey[] = [
  'mainContent',
  'hashtags',
  'threads',
  'x',
  'note',
  'noteUrl',
  'seo',
  'thumbnail',
];

export const OUTPUT_KEY_LABELS: Record<OutputKey, string> = {
  mainContent: 'TikTok / YouTube / Instagram 共用台本',
  hashtags: 'ハッシュタグ',
  threads: 'Threads投稿文',
  x: 'X投稿文',
  note: 'note記事',
  noteUrl: 'note URL補填',
  seo: 'SEOセット',
  thumbnail: 'サムネプロンプト',
};

export const DEFAULT_ENABLED_KEYS: OutputKey[] = [
  'mainContent',
  'hashtags',
  'threads',
];

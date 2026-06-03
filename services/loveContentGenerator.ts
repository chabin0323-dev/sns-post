// services/loveContentGenerator.ts
import type { GeneratedContent, Theme, HookType, OutputKey } from '../types';
import type { Genre } from '../types';

const HOOK_TEMPLATES: Record<HookType, string[]> = {
  '否定系': [
    `【{theme}でやってはいけないこと3選】\n\n{theme}を頑張っているのになぜか結果が出ない…\n\nそれ、もしかしたら間違ったやり方をしているかも。\n\n今すぐやめるべき3つのこと、正直に話します。\n\n①見た目だけ整えようとしている\n正しい方向で努力することが大切です。\n\n②量だけ増やして質を無視している\n少なくても質の高いものの方が結果が出ます。\n\n③継続せずにすぐ諦めてしまう\n結果が出るまでには時間がかかります。\n\nこの3つを今すぐ見直してください。`,
    `【その{theme}の常識、実は間違いです】\n\nみんなが当たり前にやっている{theme}の方法。\n\nでも実は、それが一番の遠回りになっていることがあります。\n\n知らないと損する、本当のことを話します。\n\nよくある間違い3選：\n\n①正しいと思っていたことが逆効果\n②頑張るほど結果が出にくくなる\n③続けるほど遠ざかってしまう\n\n今日から少し視点を変えてみてください。`,
    `【{theme}で失敗する人の共通点】\n\n{theme}がうまくいかない人には必ずある共通点があります。\n\n失敗する人の3つの特徴：\n\n①基礎を飛ばして応用に進む\n②結果だけ見て過程を無視する\n③自己流にこだわりすぎる\n\n1つでも当てはまったら今すぐ見直してください。`,
  ],
  '不安系': [
    `【{theme}を続けないと将来こうなります】\n\n「{theme}は後でいいや」\n\nそう思っているあなたに知ってほしいことがあります。\n\n放置すると起こること3選：\n\n①差がどんどん開いていく\n②取り返しがつかなくなる\n③後悔しても遅くなる\n\n5年後の自分が後悔しないために今すぐ一歩踏み出してください。`,
    `【{theme}、このまま放置すると危険です】\n\n{theme}について「まだ大丈夫」と思っていませんか？\n\n要注意の3つのサイン：\n\n①なんとなく結果が出ていない\n②周りとの差を感じてきた\n③焦りや不安を感じている\n\nこれは変化のタイミングを知らせる大切なサインです。`,
    `【{theme}で損している人の特徴】\n\n気づかないうちに{theme}で損をしている人がいます。\n\n損している人の特徴3選：\n\n①間違った情報を正しいと信じている\n②効率の悪い方法をずっと続けている\n③正しいやり方を知らないまま進んでいる\n\n今日から正しい方法で進みましょう。`,
  ],
  '暴露系': [
    `【{theme}のプロが隠していること】\n\n{theme}を長年やってきた人が教えてくれない本音があります。\n\n表では言えないことを今日は正直に話します。\n\n実は知られていない3つの事実：\n\n①一般的に言われていることは古い\n②本当に効果があるのは別の方法\n③プロが実際にやっていることは違う\n\nこれを知っているかどうかで結果が全然違ってきます。`,
    `【{theme}の裏側、教えます】\n\n{theme}について一般的に言われていることと実際は全然違います。\n\n裏側の真実3選：\n\n①表に出ない成功の法則がある\n②失敗する人には共通パターンがある\n③知っている人だけが得をしている\n\nこの情報をぜひ活用してください。`,
    `【誰も教えてくれない{theme}の真実】\n\n{theme}を始める前に知っておくべきことがあります。\n\n知らないと損する3つの真実：\n\n①最初に躓くポイントは決まっている\n②うまくいく人には共通点がある\n③正しい順番で取り組むことが全て\n\nこれを知った上で始めると結果が大きく変わります。`,
  ],
  '男性心理系': [
    `【{theme}で相手が本当に思っていること】\n\n{theme}について相手は何を考えているのか。\n\n相手の本音3選：\n\n①表面上の言葉と本心は違う\n②行動に本当の気持ちが出る\n③タイミングと状況が全てを左右する\n\n知るだけで、関係が変わります。`,
    `【{theme}、実は相手はこう見ています】\n\n相手が実は気にしていること3選：\n\n①細かい言動や態度\n②一貫性があるかどうか\n③本気度が伝わっているかどうか\n\nこの3つを意識するだけで相手の反応が大きく変わります。`,
    `【{theme}で気持ちを動かす心理テクニック】\n\n心理学的に正しいアプローチ3選：\n\n①相手の立場から考える\n②感情に訴えかける伝え方をする\n③タイミングを見極めて行動する\n\nこれを知っているだけで相手への伝わり方が変わります。`,
  ],
  '実は系': [
    `【{theme}、実はこれが一番大事でした】\n\n{theme}についていろんな方法を試してきたけど\n\n最終的に行き着いた一番シンプルで大事なことを話します。\n\n実は大事だった3つのこと：\n\n①難しく考えすぎないこと\n②基本を徹底すること\n③継続することを最優先にすること\n\n案外、気づいていない人が多いです。`,
    `【{theme}で結果が出る人が密かにやっていること】\n\n結果が出る人の共通点3選：\n\n①毎日小さな積み重ねをしている\n②うまくいかない時も続けている\n③自分なりの工夫を加えている\n\n今日からあなたも同じことをやってみてください。`,
    `【{theme}について、実は誤解されていること】\n\nよくある誤解3選：\n\n①難しいと思っているが実は簡単\n②時間がかかると思っているが意外と早い\n③特別な才能が必要と思っているが誰でもできる\n\nこれを知るだけで見方が変わります。`,
  ],
};

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

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function adjustLength(text: string, targetLength: number, profileCta: string): string {
  const suffix = `\n\n詳しくはプロフィールのリンクから👆\n\n${profileCta}`;
  const extraContents = [
    '\n\nなぜこれが大事なのか。\n\n実は多くの人が同じところで躓いています。\n知っているだけで結果が大きく変わります。',
    '\n\n今日から意識するだけで1ヶ月後、3ヶ月後の自分が変わります。\n\nまず小さな一歩を踏み出してください。',
    '\n\n成功している人は例外なくこのポイントを押さえています。\n\nあなたも今日から実践してみてください。',
    '\n\n難しく考える必要はありません。\nシンプルに、一つずつ取り組むだけで必ず結果はついてきます。',
    '\n\n焦らず、でも着実に。\nその積み重ねが半年後、1年後に大きな差を生み出します。',
  ];

  let result = text;
  for (const extra of extraContents) {
    const currentLength = (result + suffix).replace(/\n/g, 'X').length;
    if (currentLength >= targetLength) break;
    result += extra;
  }

  return result + suffix;
}

export const GENRE_THEMES: Record<Genre, Theme[]> = {
  '恋愛': ['脈なし', '脈あり', '男性心理', 'LINE', '片思い', '復縁', '運命の人', '恋愛心理学', '職場恋愛', '婚活', 'マッチングアプリ'],
  'お金・資産': ['節約術', '投資入門', 'NISA活用', '貯金習慣', '給料アップ', '保険見直し', '副収入', 'クレカ活用', 'ポイント最大化', '老後資金'],
  '副業・稼ぐ': ['TikTok収益化', 'Threads攻略', 'note有料記事', 'SNS運用', 'ブログ収益', '転売・せどり', 'コンテンツ販売', 'フリーランス', 'YouTube運用', 'X(Twitter)運用'],
  '美容・ダイエット': ['スキンケア', '痩せる食事', 'ながら運動', 'プチプラコスメ', '髪ケア', 'むくみ解消', '睡眠美容', '体質改善', 'ファスティング', 'ボディメイク'],
  '育児・子育て': ['知育おもちゃ', '寝かしつけ', '離乳食', 'イヤイヤ期', '保育園選び', '子どもの習い事', '夫婦育児分担', '産後ケア', '絵本読み聞かせ', '子どもの褒め方'],
  '健康・メンタル': ['自律神経', 'ストレス解消', '腸活', '良質な睡眠', 'マインドフルネス', '疲れない体', 'うつ予防', '免疫力アップ', '血糖値管理', 'デジタルデトックス'],
  '転職・キャリア': ['転職成功', '年収アップ', 'スキルアップ', '面接対策', '履歴書・職務経歴書', 'リモートワーク', '副業から独立', 'AI活用仕事術', '昇進交渉', 'ワークライフバランス'],
  '人間関係': ['職場いじめ', '毒親', '友達付き合い', 'ママ友', '義実家問題', '自己肯定感', 'コミュ力アップ', '断り方', '人たらし術', 'HSP生き方'],
  'ビジネス・起業': ['起業アイデア', 'SNSマーケ', '集客術', '価格設定', 'Canva活用', 'ChatGPT活用', '個人ブランディング', 'コンテンツマーケ', 'LINE公式活用', 'ストーリーズ活用'],
  'ライフスタイル': ['ミニマリスト', '朝活', '読書習慣', '手帳活用', '一人暮らし節約', 'おうち時間', '旅行ハック', 'サウナ効果', 'ペット', 'インテリア'],
};

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
  const mainContent = adjustLength(mainScriptBase, tiktokLength, profileCta);
  const hashtags = generateHashtags(theme);
  const hashtagText = hashtags.join(' ');
  const threadsPost = `${mainContent}\n\n${hashtagText}`;
  const xPost = mainScriptBase.split('\n').slice(0, 4).join('\n') + `\n\n${postUrl}`;
  const noteArticle = `${theme}について知っておくべきこと\n\n${mainContent}`;
  const seoSet = {
    title: `${theme}の真実｜知らないと損する3つのこと`,
    keywords: [theme, `${theme} 方法`, `${theme} コツ`, `${theme} 初心者`, 'TikTok'],
    description: `${theme}について、知らないと損する本当のことを解説。わかりやすく説明します。`,
  };
  const thumbnailPrompt = `テーマ「${theme}」のTikTokサムネイル。インパクトのある文字「${mainScriptBase.split('\n')[0]}」をメインに、目を引く背景、驚いた表情のイラスト。`;
  const thumbnailTikTok = `サイズ：1080×1920px\nテーマ：${theme}\nメインテキスト：${mainScriptBase.split('\n')[0]}`;
  const thumbnailNote = `サイズ：1280×670px\nテーマ：${theme}\nメインテキスト：${mainScriptBase.split('\n')[0]}`;
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
    thumbnailTikTok,
    thumbnailNote,
    buzzScore,
    timestamp: new Date().toISOString(),
  };
}

export const ALL_HOOK_TYPES: HookType[] = ['否定系', '不安系', '暴露系', '男性心理系', '実は系'];

export const ALL_OUTPUT_KEYS: OutputKey[] = [
  'mainContent', 'hashtags', 'threads', 'x', 'note', 'noteUrl', 'seo', 'thumbnail',
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
  'mainContent', 'hashtags', 'threads',
];

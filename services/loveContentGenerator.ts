// services/loveContentGenerator.ts
import type { GeneratedContent, Genre, Theme, HookType, OutputKey } from '../types';

const HOOK_TEMPLATES: Record<string, string[]> = {
  '否定系': [
    `【{theme}でやってはいけないこと3選】\n\n{theme}を頑張っているのになぜか結果が出ない…\n\nそれ、もしかしたら間違ったやり方をしているかも。\n\n今すぐやめるべき3つのこと、正直に話します。\n\n①見た目だけ整えようとしている\n正しい方向で努力することが大切です。\n\n②量だけ増やして質を無視している\n少なくても質の高いものの方が結果が出ます。\n\n③継続せずにすぐ諦めてしまう\n結果が出るまでには時間がかかります。\n\nこの3つを今すぐ見直してください。`,
    `【その{theme}の常識、実は間違いです】\n\nみんなが当たり前にやっている{theme}の方法。\n\nでも実は、それが一番の遠回りになっていることがあります。\n\nよくある間違い3選：\n\n①正しいと思っていたことが逆効果\n②頑張るほど結果が出にくくなる\n③続けるほど遠ざかってしまう\n\n今日から少し視点を変えてみてください。`,
    `【{theme}で失敗する人の共通点】\n\n{theme}がうまくいかない人には必ずある共通点があります。\n\n失敗する人の3つの特徴：\n\n①基礎を飛ばして応用に進む\n②結果だけ見て過程を無視する\n③自己流にこだわりすぎる\n\n1つでも当てはまったら今すぐ見直してください。`,
  ],
  '不安系': [
    `【{theme}を続けないと将来こうなります】\n\n「{theme}は後でいいや」\n\nそう思っているあなたに知ってほしいことがあります。\n\n放置すると起こること3選：\n\n①差がどんどん開いていく\n②取り返しがつかなくなる\n③後悔しても遅くなる\n\n5年後の自分が後悔しないために今すぐ一歩踏み出してください。`,
    `【{theme}、このまま放置すると危険です】\n\n要注意の3つのサイン：\n\n①なんとなく結果が出ていない\n②周りとの差を感じてきた\n③焦りや不安を感じている\n\nこれは変化のタイミングを知らせる大切なサインです。`,
    `【{theme}で損している人の特徴】\n\n損している人の特徴3選：\n\n①間違った情報を正しいと信じている\n②効率の悪い方法をずっと続けている\n③正しいやり方を知らないまま進んでいる\n\n今日から正しい方法で進みましょう。`,
  ],
  '暴露系': [
    `【{theme}のプロが隠していること】\n\n表では言えないことを今日は正直に話します。\n\n実は知られていない3つの事実：\n\n①一般的に言われていることは古い\n②本当に効果があるのは別の方法\n③プロが実際にやっていることは違う\n\nこれを知っているかどうかで結果が全然違ってきます。`,
    `【{theme}の裏側、教えます】\n\n裏側の真実3選：\n\n①表に出ない成功の法則がある\n②失敗する人には共通パターンがある\n③知っている人だけが得をしている\n\nこの情報をぜひ活用してください。`,
    `【誰も教えてくれない{theme}の真実】\n\n知らないと損する3つの真実：\n\n①最初に躓くポイントは決まっている\n②うまくいく人には共通点がある\n③正しい順番で取り組むことが全て\n\nこれを知った上で始めると結果が大きく変わります。`,
  ],
  '共感系': [
    `【{theme}で悩んでいるあなたへ】\n\n頑張ってるのに結果が出ない、ってしんどいよね。\n\nでも実は、ちゃんとした順番があるんだよね。\n\n大事なポイント3選：\n\n①焦らず基礎から始めること\n②小さな成功体験を積み重ねること\n③仲間や情報を大切にすること\n\n完璧じゃなくていい。まず一歩だけ踏み出してみて。`,
    `【{theme}、私も同じで悩んでいました】\n\n「なんで自分だけうまくいかないんだろう」\n\nその気持ち、すごくわかります。\n\n乗り越えるために大切なこと3選：\n\n①自分を責めすぎないこと\n②小さな変化に気づくこと\n③続けることを最優先にすること\n\n一緒に前進していきましょう。`,
    `【{theme}で心が折れそうなあなたへ】\n\nうまくいかない時期は誰にでもあります。\n\n今必要なこと3選：\n\n①立ち止まって現状を整理すること\n②うまくいっている人のやり方を参考にすること\n③小さな一歩を踏み出し続けること\n\nあなたは一人じゃないです。`,
  ],
  '実は系': [
    `【{theme}、実はこれが一番大事でした】\n\n実は大事だった3つのこと：\n\n①難しく考えすぎないこと\n②基本を徹底すること\n③継続することを最優先にすること\n\n案外、気づいていない人が多いです。`,
    `【{theme}で結果が出る人が密かにやっていること】\n\n結果が出る人の共通点3選：\n\n①毎日小さな積み重ねをしている\n②うまくいかない時も続けている\n③自分なりの工夫を加えている\n\n今日からあなたも同じことをやってみてください。`,
    `【{theme}について、実は誤解されていること】\n\nよくある誤解3選：\n\n①難しいと思っているが実は簡単\n②時間がかかると思っているが意外と早い\n③特別な才能が必要と思っているが誰でもできる\n\nこれを知るだけで見方が変わります。`,
  ],
  '数字系': [
    `【{theme}で結果を出す3つのステップ】\n\nステップ①：まず現状を正確に把握する\nステップ②：正しい方法を選んで実践する\nステップ③：継続して改善し続ける\n\nこの順番を守るだけで結果が大きく変わります。`,
    `【{theme}成功者の7つの共通点】\n\n①基礎を大切にしている\n②継続を最優先にしている\n③情報を常にアップデートしている\n④失敗を恐れずに行動している\n⑤周りの成功者から学んでいる\n⑥小さな改善を積み重ねている\n⑦自分のペースを守っている\n\nいくつ実践できていますか？`,
    `【{theme}を加速させる5つの方法】\n\n①正しい情報源を選ぶ\n②毎日少しずつ実践する\n③結果を記録して振り返る\n④うまくいっている人を参考にする\n⑤諦めずに継続する\n\n今日から1つずつ実践してみてください。`,
  ],
  '限定系': [
    `【{theme}で成功した人だけが知っていること】\n\n成功者だけが実践していること3選：\n\n①周りがやらないことをやり続けている\n②失敗から学ぶ力を持っている\n③長期的な視点で取り組んでいる\n\nあなたも今日から実践してみてください。`,
    `【{theme}、本当に効果があった方法だけ教えます】\n\n試してきた中で本当に効果があったこと3選：\n\n①シンプルな方法を継続すること\n②基本を徹底的に繰り返すこと\n③小さな成功を積み重ねること\n\nぜひ参考にしてみてください。`,
    `【{theme}で差をつけたい人だけ見てください】\n\n差がつく3つのポイント：\n\n①情報の質にこだわること\n②行動の速さを意識すること\n③継続力を最大の武器にすること\n\n知っているだけで結果が変わります。`,
  ],
};

const generateHashtags = (theme: string, genre: string): string[] => {
  return [
    `#${theme}`,
    `#${genre}`,
    `#${theme}攻略`,
    `#知らないと損`,
    `#TikTok`,
    `#SNS発信`,
    `#バズる投稿`,
    `#2026年`,
  ];
};

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function adjustLength(text: string, targetLength: number, profileCta: string): string {
  const suffix = `\n\n${profileCta}`;
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
  genre: Genre;
  theme: Theme;
  prevTitle: string;
  enabledKeys: OutputKey[];
  tiktokLength: 300 | 500 | 600;
  profileCta: string;
  postUrl: string;
}): GeneratedContent {
  const { genre, theme, profileCta, postUrl, tiktokLength } = params;

  const hookTypes = Object.keys(HOOK_TEMPLATES);
  const hookType = pickRandom(hookTypes) as HookType;
  const templates = HOOK_TEMPLATES[hookType];
  const rawTemplate = pickRandom(templates);
  const mainScriptBase = rawTemplate.replace(/\{theme\}/g, theme);
  const mainContent = adjustLength(mainScriptBase, tiktokLength, profileCta);

  const hashtags = generateHashtags(theme, genre);
  const hashtagText = hashtags.join(' ');
  const threadsPost = `${mainContent}\n\n${hashtagText}${postUrl ? '\n\n' + postUrl : ''}`;
  const xPost = mainScriptBase.split('\n').slice(0, 6).join('\n') + `${postUrl ? '\n\n' + postUrl : ''}`;
  const noteArticle = `${theme}について知っておくべきこと\n\n${mainContent}`;

  const seoSet = {
    title: `【2026年最新】${theme}の真実｜知らないと損する3つのこと`,
    keywords: [theme, genre, `${theme} 方法`, `${theme} コツ`, `${theme} 初心者`],
    description: `${theme}について、知らないと損する本当のことを解説。${genre}に関心がある方必見の内容です。`,
    howToUse: `SEOタイトルをnote記事のタイトルに使用し、キーワードを本文に自然に盛り込んでください。`,
  };

  const thumbnailTikTok = `サイズ：1080×1920px（縦型9:16）\nテーマ：${theme}\nメインテキスト：${mainScriptBase.split('\n')[0]}\nデザイン：インパクト重視・目を引く色使い・太字フォント`;
  const thumbnailNote = `サイズ：1280×670px（横型）\nテーマ：${theme}\nメインテキスト：${mainScriptBase.split('\n')[0]}\nデザイン：シンプル・洗練・読みやすいフォント`;
  const thumbnailPrompt = `【TikTok用】\n${thumbnailTikTok}\n\n【note用】\n${thumbnailNote}`;

  const buzzScore = {
    hookPower: hookType === '暴露系' ? 90 : hookType === '否定系' ? 85 : hookType === '限定系' ? 88 : 80,
    saveRate: 75,
    commentRate: 70,
    profileRate: 80,
    seoScore: 75,
    total: 78,
    comment: `${hookType}は反応率が高いフックです。${theme}との相性も良好。`,
  };

  return {
    genre,
    theme,
    hookType,
    prevTitle: params.prevTitle,
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
    timestamp: new Date().toLocaleString('ja-JP'),
  };
}

export const ALL_HOOK_TYPES: HookType[] = ['否定系', '不安系', '暴露系', '共感系', '実は系', '数字系', '限定系'];

export const ALL_OUTPUT_KEYS: OutputKey[] = [
  'mainContent', 'hashtags', 'threads', 'x', 'note', 'seo', 'thumbnailTikTok', 'thumbnailNote',
];

export const OUTPUT_KEY_LABELS: Record<OutputKey, string> = {
  mainContent: 'TikTok / YouTube / Instagram 共用台本',
  hashtags: 'ハッシュタグ',
  threads: 'Threads投稿文',
  x: 'X投稿文',
  note: 'note記事',
  seo: 'SEOセット',
  thumbnailTikTok: 'TikTokサムネイル',
  thumbnailNote: 'noteサムネイル',
};

export const DEFAULT_ENABLED_KEYS: OutputKey[] = [
  'mainContent', 'hashtags', 'threads',
];

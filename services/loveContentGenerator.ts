// services/loveContentGenerator.ts
import type { GeneratedContent, Theme, HookType, OutputKey } from '../types';

const HOOK_TEMPLATES: Record<HookType, string[]> = {
  '否定系': [
    `【{theme}でやってはいけないこと3選】\n\n{theme}を頑張っているのになぜか結果が出ない…\n\nそれ、もしかしたら間違ったやり方をしているかも。\n\n今すぐやめるべき3つのこと、正直に話します。\n\n①見た目だけ整えようとしている\n正しい方向で努力することが大切です。\n\n②量だけ増やして質を無視している\n少なくても質の高いものの方が結果が出ます。\n\n③継続せずにすぐ諦めてしまう\n結果が出るまでには時間がかかります。\n\nこの3つを今すぐ見直してください。\n\n正しい方向で努力することが何より大切です。\n一つでも改善するだけで結果が大きく変わります。\n\nまず今日から1つだけ実践してみてください。`,
    `【その{theme}の常識、実は間違いです】\n\nみんなが当たり前にやっている{theme}の方法。\n\nでも実は、それが一番の遠回りになっていることがあります。\n\n知らないと損する、本当のことを話します。\n\nよくある間違い3選：\n\n①正しいと思っていたことが逆効果\n常識を疑うことが最初の一歩です。\n\n②頑張るほど結果が出にくくなる\n方向性が間違っていると努力が無駄になります。\n\n③続けるほど遠ざかってしまう\n早めに気づいて修正することが大切です。\n\n今日から少し視点を変えてみてください。\n\n正しい方向で取り組むだけで結果は必ずついてきます。\n小さな修正が大きな変化を生み出します。`,
    `【{theme}で失敗する人の共通点】\n\n{theme}がうまくいかない人には必ずある共通点があります。\n\nあなたは大丈夫ですか？\n\n失敗する人の3つの特徴：\n\n①基礎を飛ばして応用に進む\n土台がないと応用は使えません。\n\n②結果だけ見て過程を無視する\nプロセスの中に改善のヒントがあります。\n\n③自己流にこだわりすぎる\nうまくいっている人のやり方を真似ることが近道です。\n\n1つでも当てはまったら今すぐ見直してください。\n\n小さな修正の積み重ねが大きな変化を生み出します。\n今日からあなたも正しい方向で進んでいきましょう。`,
  ],
  '不安系': [
    `【{theme}を続けないと将来こうなります】\n\n「{theme}は後でいいや」\n\nそう思っているあなたに知ってほしいことがあります。\n\n実は今が一番大事なタイミングです。\n\n放置すると起こること3選：\n\n①差がどんどん開いていく\n始めるのが遅くなるほど取り戻すのに時間がかかります。\n\n②取り返しがつかなくなる\n後になってからではできないことも出てきます。\n\n③後悔しても遅くなる\nあのとき始めていればと思う日が必ず来ます。\n\n5年後の自分が後悔しないために今すぐ一歩踏み出してください。\n\n小さな一歩が未来を大きく変えます。\n今動けば必ず変わります。一緒に頑張りましょう。`,
    `【{theme}、このまま放置すると危険です】\n\n{theme}について「まだ大丈夫」と思っていませんか？\n\n実は、今がターニングポイントです。\n\n要注意の3つのサイン：\n\n①なんとなく結果が出ていない\n方向性を見直すタイミングです。\n\n②周りとの差を感じてきた\n差は放置するほど広がります。\n\n③焦りや不安を感じている\nその感覚は正しいサインです。\n\nこれは変化のタイミングを知らせる大切なサインです。\n\n今動けば必ず変わります。\n\n一緒に正しい方向へ進んでいきましょう。\n今日からの小さな積み重ねが未来を変えます。`,
    `【{theme}で損している人の特徴】\n\n気づかないうちに{theme}で損をしている人がいます。\n\nあなたは当てはまっていませんか？\n\n損している人の特徴3選：\n\n①間違った情報を正しいと信じている\n情報の質が結果の質を決めます。\n\n②効率の悪い方法をずっと続けている\nやり方を変えるだけで結果が劇的に変わることがあります。\n\n③正しいやり方を知らないまま進んでいる\n知っているか知らないかだけで結果が全然変わります。\n\n今日から正しい方法で進みましょう。\n\n知ることから全てが始まります。\n一緒に改善していきましょう。今日が変化のスタートです。`,
  ],
  '暴露系': [
    `【{theme}のプロが隠していること】\n\n{theme}を長年やってきた人が教えてくれない本音があります。\n\n表では言えないことを今日は正直に話します。\n\n実は知られていない3つの事実：\n\n①一般的に言われていることは古い\n情報は常に更新されています。最新の方法を取り入れることが大切です。\n\n②本当に効果があるのは別の方法\n表に出ている情報だけでは本当の結果は出ません。\n\n③プロが実際にやっていることは違う\n見せている部分と実際にやっていることは別です。\n\nこれを知っているかどうかで結果が全然違ってきます。\n\nぜひ参考にしてみてください。\n知ることから全てが始まります。今日から実践してみましょう。`,
    `【{theme}の裏側、教えます】\n\n{theme}について一般的に言われていることと実際は全然違います。\n\n現場を知っているからこそ言える本音を話します。\n\n裏側の真実3選：\n\n①表に出ない成功の法則がある\n公開されていない方法こそが本当に効果的なことが多いです。\n\n②失敗する人には共通パターンがある\n同じ失敗を繰り返さないためにパターンを知ることが重要です。\n\n③知っている人だけが得をしている\n情報格差が結果の差を生んでいます。\n\nこの情報をぜひ活用してください。\n\n知ることから全てが始まります。\n今日から正しい方法で取り組んでいきましょう。`,
    `【誰も教えてくれない{theme}の真実】\n\n{theme}を始める前に知っておくべきことがあります。\n\nきれいごとじゃない、リアルな話をします。\n\n知らないと損する3つの真実：\n\n①最初に躓くポイントは決まっている\n事前に知っておくだけで多くの失敗を防げます。\n\n②うまくいく人には共通点がある\n成功パターンを真似ることが最も効率的な方法です。\n\n③正しい順番で取り組むことが全て\n順番を間違えるとどれだけ努力しても結果が出ません。\n\nこれを知った上で始めると結果が大きく変わります。\n\n参考になれば嬉しいです。\n今日から一歩ずつ着実に進んでいきましょう。`,
  ],
  '男性心理系': [
    `【{theme}で相手が本当に思っていること】\n\n{theme}について相手は何を考えているのか。\n\n言葉にならない本音を心理学の観点から解説します。\n\n相手の本音3選：\n\n①表面上の言葉と本心は違う\n言葉よりも行動を見ることで本当の気持ちがわかります。\n\n②行動に本当の気持ちが出る\n無意識の行動ほど本音が現れやすいです。\n\n③タイミングと状況が全てを左右する\n同じことでもタイミング次第で全く違う結果になります。\n\n知るだけで、関係が変わります。\n\n相手の気持ちを理解することが最初の一歩です。\n今日から意識して相手を見てみてください。`,
    `【{theme}、実は相手はこう見ています】\n\nあなたの{theme}に対する行動、相手にはどう映っているか知っていますか？\n\n意外な真実を明かします。\n\n相手が実は気にしていること3選：\n\n①細かい言動や態度\n小さなことほど相手の記憶に残りやすいです。\n\n②一貫性があるかどうか\n言動が一致しているかを相手はよく見ています。\n\n③本気度が伝わっているかどうか\nどれだけ本気かが相手の反応を左右します。\n\nこの3つを意識するだけで相手の反応が大きく変わります。\n\nぜひ試してみてください。\n小さな意識の変化が大きな結果を生み出します。`,
    `【{theme}で気持ちを動かす心理テクニック】\n\n{theme}において相手の心を動かすにはコツがあります。\n\n心理学的に正しいアプローチ3選：\n\n①相手の立場から考える\n自分視点ではなく相手視点で考えることが大切です。\n\n②感情に訴えかける伝え方をする\n論理より感情の方が人の心を動かしやすいです。\n\n③タイミングを見極めて行動する\nどんなに良いアプローチでもタイミングが悪ければ効果がありません。\n\nこれを知っているだけで相手への伝わり方が変わります。\n\n関係をより良くしたい方はぜひ参考にしてください。\n今日から実践してみましょう。`,
  ],
  '実は系': [
    `【{theme}、実はこれが一番大事でした】\n\n{theme}についていろんな方法を試してきたけど\n\n最終的に行き着いた一番シンプルで大事なことを話します。\n\n実は大事だった3つのこと：\n\n①難しく考えすぎないこと\nシンプルに考えた方がうまくいくことがほとんどです。\n\n②基本を徹底すること\n派手な方法より基本の積み重ねが一番強いです。\n\n③継続することを最優先にすること\nどんな方法も続けなければ意味がありません。\n\n案外、気づいていない人が多いです。\n\nシンプルなことを丁寧に続けることが一番の近道です。\n今日からあなたも実践してみてください。`,
    `【{theme}で結果が出る人が密かにやっていること】\n\n{theme}がうまくいっている人は実は全員ある共通点があります。\n\n特別なことじゃない、でも知らない人がほとんどのこと。\n\n結果が出る人の共通点3選：\n\n①毎日小さな積み重ねをしている\n大きな結果は小さな積み重ねの先にあります。\n\n②うまくいかない時も続けている\n結果が出ない時期こそが本当の勝負どころです。\n\n③自分なりの工夫を加えている\nただ真似るだけでなく自分に合った形に変えることが大切です。\n\n今日からあなたも同じことをやってみてください。\n\n継続することが最大の武器になります。\n一緒に成長していきましょう。`,
    `【{theme}について、実は誤解されていること】\n\n{theme}に関する常識と思われていることの中に実は全然違う事実があります。\n\nよくある誤解3選：\n\n①難しいと思っているが実は簡単\n正しい方法を知れば誰でもできることがほとんどです。\n\n②時間がかかると思っているが意外と早い\n正しいやり方で取り組めば思ったより早く結果が出ます。\n\n③特別な才能が必要と思っているが誰でもできる\n才能より継続する力の方がはるかに重要です。\n\nこれを知るだけで見方が変わります。\n\nまず一歩踏み出してみましょう。\n正しい知識を持って取り組めば必ず結果はついてきます。`,
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
    '\n\nなぜこれが大事なのか。\n\n実は多くの人が同じところで躓いています。\n知っているだけで結果が大きく変わります。\n\n今日から意識して取り組んでみてください。',
    '\n\n今日から意識するだけで1ヶ月後、3ヶ月後の自分が変わります。\n\nまず小さな一歩を踏み出してください。\n継続することが最大の武器になります。',
    '\n\n成功している人は例外なくこのポイントを押さえています。\n\nあなたも今日から実践してみてください。\n小さな積み重ねが大きな結果を生み出します。',
    '\n\n難しく考える必要はありません。\nシンプルに、一つずつ取り組むだけで必ず結果はついてきます。\n\n焦らず、でも着実に前進していきましょう。',
    '\n\n焦らず、でも着実に。\nその積み重ねが半年後、1年後に大きな差を生み出します。\n\n一緒に成長していきましょう。',
  ];

  let result = text;
  for (const extra of extraContents) {
    const currentLength = (result + suffix).length;
    if (currentLength >= targetLength) break;
    result += extra;
  }

  return result + suffix;
}

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

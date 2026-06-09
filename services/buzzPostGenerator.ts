// services/buzzPostGenerator.ts
// 既存の loveContentGenerator.ts とは完全に独立したファイルです
// 既存コードへの影響はありません

import type { BuzzPostResult, BuzzPostScore, BuzzImprovement } from '../types';

// ============================================================
// 感情タイプ定義
// ============================================================
type EmotionType =
  | '共感' | '恋愛不安' | '切なさ' | '後悔' | '嫉妬'
  | '孤独' | '依存' | '片思い' | '復縁願望' | '失恋'
  | '期待' | '安心感' | '自己肯定感' | '驚き';

// ============================================================
// 投稿タイプ定義
// ============================================================
type PostType =
  | '共感型' | '衝撃型' | '切ない型' | '恋愛依存型'
  | '暴露型' | '心理学型' | 'ストーリー型';

// ============================================================
// 感情キーワードマップ
// ============================================================
const EMOTION_KEYWORDS: Record<EmotionType, string[]> = {
  '共感': ['わかる', '同じ', 'あるある', '私だけ', 'みんな', 'そうだよね', '経験', 'あの感じ', '共感', '思い当たる'],
  '恋愛不安': ['不安', '心配', '怖い', '嫌われ', '好かれてる', 'どう思われ', '脈', 'LINEが来ない', '既読スルー', '返信'],
  '切なさ': ['切ない', '寂しい', '会いたい', '会えない', '離れ', '遠距離', '好きなのに', '想い', 'もどかしい', '届かない'],
  '後悔': ['後悔', '後になって', 'あの時', 'もっと早く', 'やっておけば', '気づかなかった', '逃した', '失った', 'あの頃'],
  '嫉妬': ['嫉妬', '他の女', '他の男', '浮気', 'ヤキモチ', '気になる', 'なんで', '羨ましい', '悔しい'],
  '孤独': ['孤独', '一人', '誰もいない', '理解されない', '孤立', '話せない', '一人で', '誰にも', '頼れない'],
  '依存': ['依存', '離れられない', 'ないと無理', '必要', 'すがる', '手放せない', 'やめられない', '抜け出せない'],
  '片思い': ['片思い', '好きな人', '告白', '気持ちを伝え', '想いを伝え', '両想い', '振られ', '勇気がなく', '一方的'],
  '復縁願望': ['復縁', 'よりを戻し', '元彼', '元カノ', '戻りたい', 'もう一度', 'やり直し', '別れてから', '忘れられない'],
  '失恋': ['失恋', '振られ', '別れ', 'フラれ', '終わった', '好きだったのに', 'どうすれば', '立ち直れ', '泣いた'],
  '期待': ['期待', 'もしかして', 'チャンス', 'うまくいく', '脈あり', '好意', 'アピール', 'サイン', '可能性'],
  '安心感': ['安心', 'ほっとした', '大丈夫', 'うまくいく', '信じ', '大切にされ', '愛されてる', '幸せ', '満たされ'],
  '自己肯定感': ['自分を好き', '自信', '自己肯定', '自分を大切', '自分らしく', '変わった', '成長', '認めてもらえ'],
  '驚き': ['実は', 'え', 'まさか', '知らなかった', '衝撃', 'びっくり', '意外', 'ありえない', '絶対知って', '真実'],
};

// ============================================================
// 投稿タイプキーワードマップ
// ============================================================
const POST_TYPE_KEYWORDS: Record<PostType, string[]> = {
  '共感型': ['わかる', '同じ', 'あるある', 'そうだよね', '私も', 'みんな'],
  '衝撃型': ['実は', '知らなかった', '驚き', '衝撃', 'まさか', '意外', 'え'],
  '切ない型': ['切ない', '寂しい', '会いたい', 'もどかしい', '届かない'],
  '恋愛依存型': ['依存', '離れられない', '必要', '手放せない', 'すがる'],
  '暴露型': ['本音', '裏側', '本当のこと', '実態', '真実', '本当は'],
  '心理学型': ['心理', '無意識', '脳', '行動', 'パターン', '傾向'],
  'ストーリー型': ['ある日', 'あの時', 'そこから', 'それから', 'ある出来事', 'あの瞬間'],
};

// ============================================================
// 投稿タイプ別テンプレート
// ============================================================
const BUZZ_POST_TEMPLATES: Record<PostType, string[]> = {
  '共感型': [
    `{hook}

これ、私だけじゃなかったんだって気づいた瞬間、すごく楽になった。

{core}

「そうそう、わかる」って感じた人、ぜひ保存してね。`,

    `{hook}

同じ気持ちの人、絶対いると思って書いた。

{core}

コメントで「わかる」って教えてくれると嬉しいな。`,
  ],

  '衝撃型': [
    `{hook}

これ、ほとんどの人が知らないんだよね。

{core}

知ってるだけで全然違う。保存しておいて損はないよ。`,

    `{hook}

正直、私も最近まで気づいてなかった。

{core}

これを知ってから、見え方が変わった。`,
  ],

  '切ない型': [
    `{hook}

ずっとその気持ちを抱えてきた人に届いてほしい。

{core}

あなたの気持ち、ちゃんと誰かに届いてるよ。`,

    `{hook}

言葉にできない気持ちって、あるよね。

{core}

同じ気持ちの人、ひとりじゃないよ。`,
  ],

  '恋愛依存型': [
    `{hook}

頭ではわかってるのに、やめられない。

{core}

無理に変わろうとしなくていい。まず自分の気持ちを認めることから。`,

    `{hook}

これが「好き」なのか「依存」なのか、わからなくなることってある。

{core}

自分の気持ちに正直でいることが、最初の一歩だと思う。`,
  ],

  '暴露型': [
    `{hook}

誰も言わないけど、これが本音だと思う。

{core}

知ってほしかったから書いた。保存してね。`,

    `{hook}

表向きとは全然違う話をするね。

{core}

これ、友達にも教えてあげてほしい。`,
  ],

  '心理学型': [
    `{hook}

これ、心理学的に証明されてる話なんだけど。

{core}

人の行動には必ず理由がある。知っておくと、気持ちが楽になるよ。`,

    `{hook}

無意識にやってることって、意外と多い。

{core}

自分のパターンを知るだけで、すごく変わる。`,
  ],

  'ストーリー型': [
    `{hook}

あの時の自分に言ってあげたかった言葉がある。

{core}

同じ状況の人に、少しでも届いたら嬉しい。`,

    `{hook}

ある日気づいたんだよね。

{core}

あの経験があったから、今の自分がいる。`,
  ],
};

// ============================================================
// 改善提案テンプレート
// ============================================================
const IMPROVEMENT_TEMPLATES: Record<string, string[]> = {
  hook: [
    '冒頭に「これ知ってる？」「実は〇〇だった」など疑問・驚きで始めると開封率UP',
    '最初の1行目を短くして「え、続きは？」と思わせる構成にするとクリック率が上がる',
    '具体的な数字（3秒・87%・1つだけ）を入れると信頼性と注目度が上がる',
    '「〇〇な人へ」と対象を絞ると刺さる読者が増え保存率がアップする',
  ],
  emotion: [
    '「そう、それ私だ」と感じさせる具体的なシーンを1つ追加するとより刺さる',
    '読者の感情を代弁する言葉（「ずっとモヤモヤしてた」等）を冒頭に入れると共感力UP',
    '投稿の最後に「あなたはどう思う？」と問いかけるとコメント率が上がる',
    '感情の変化（before→after）を描くとストーリー性が生まれ保存率UP',
  ],
  save: [
    '「保存しておくといい」「スクショして」などの明示的な保存誘導を入れる',
    '投稿を箇条書き・ステップ形式にすると「後で読む」感が出て保存率UP',
    'チェックリスト形式（□□□）にすると「自分用に保存したい」と思わせやすい',
    '「これだけ知っておけばOK」という絞り込みフレーズが保存率を高める',
  ],
  click: [
    '「続きはプロフィールから」より「詳しくは今すぐプロフへ→」の方が誘導率が高い',
    'コメント誘導（「あなたはどっち？」「当てはまったらコメントして」）を追加する',
    '投稿最後の行を「〇〇な人だけ読んでほしい」と限定系にするとクリック意欲UP',
    'プロフィールへの誘導文に絵文字（👇💕✨）を入れるとタップ率が上がる',
  ],
};

// ============================================================
// ユーティリティ
// ============================================================
function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ============================================================
// 感情分析
// ============================================================
function analyzeEmotion(text: string): EmotionType {
  const scores: Record<EmotionType, number> = {} as Record<EmotionType, number>;

  for (const [emotion, keywords] of Object.entries(EMOTION_KEYWORDS) as [EmotionType, string[]][]) {
    scores[emotion] = keywords.filter(kw => text.includes(kw)).length;
  }

  const sorted = (Object.entries(scores) as [EmotionType, number][])
    .sort((a, b) => b[1] - a[1]);

  return sorted[0][1] > 0 ? sorted[0][0] : '共感';
}

// ============================================================
// 投稿タイプ選択
// ============================================================
function selectPostType(text: string, emotion: EmotionType): PostType {
  const scores: Record<PostType, number> = {} as Record<PostType, number>;

  for (const [type, keywords] of Object.entries(POST_TYPE_KEYWORDS) as [PostType, string[]][]) {
    scores[type] = keywords.filter(kw => text.includes(kw)).length;
  }

  // 感情タイプとの相性でボーナスを加算
  const emotionBonus: Partial<Record<EmotionType, PostType>> = {
    '共感': '共感型',
    '驚き': '衝撃型',
    '切なさ': '切ない型',
    '依存': '恋愛依存型',
    '後悔': 'ストーリー型',
    '恋愛不安': '心理学型',
    '嫉妬': '暴露型',
    '孤独': '切ない型',
    '片思い': '共感型',
    '復縁願望': 'ストーリー型',
    '失恋': '切ない型',
    '期待': '共感型',
    '安心感': '共感型',
    '自己肯定感': '心理学型',
  };

  const bonus = emotionBonus[emotion];
  if (bonus) scores[bonus] = (scores[bonus] || 0) + 2;

  const sorted = (Object.entries(scores) as [PostType, number][])
    .sort((a, b) => b[1] - a[1]);

  return sorted[0][1] > 0 ? sorted[0][0] : '共感型';
}

// ============================================================
// フック文生成（記事の冒頭から抽出）
// ============================================================
function extractHook(text: string): string {
  const lines = text.split('\n').filter(l => l.trim().length > 0);

  // 最初の1〜2行をフックとして使う（最大40文字）
  const firstLine = lines[0]?.trim() ?? '';
  if (firstLine.length <= 40) return firstLine;
  return firstLine.slice(0, 38) + '…';
}

// ============================================================
// コア本文抽出（記事の要点を凝縮）
// ============================================================
function extractCore(text: string, tiktokLength: number): string {
  const lines = text.split('\n').filter(l => l.trim().length > 0);

  // 2行目以降から本文を抽出、文字数に合わせて調整
  const bodyLines = lines.slice(1);
  let core = bodyLines.join('\n');

  // 文字数制限（tiktokLengthに応じて調整）
  const maxChars = tiktokLength === 300 ? 150 : tiktokLength === 500 ? 250 : 320;
  if (core.length > maxChars) {
    core = core.slice(0, maxChars - 3) + '…';
  }

  return core || lines[0]?.slice(0, maxChars) || '';
}

// ============================================================
// 動的ハッシュタグ生成（記事内容ベース・固定禁止）
// ============================================================
function generateDynamicHashtags(text: string, emotion: EmotionType, postType: PostType): string[] {
  const tags: string[] = [];

  // 感情タイプから1個
  const emotionTags: Record<EmotionType, string> = {
    '共感': '#あるある',
    '恋愛不安': '#恋愛不安',
    '切なさ': '#切ない恋愛',
    '後悔': '#後悔しない恋愛',
    '嫉妬': '#恋愛の悩み',
    '孤独': '#一人じゃない',
    '依存': '#恋愛依存',
    '片思い': '#片思い',
    '復縁願望': '#復縁',
    '失恋': '#失恋',
    '期待': '#恋愛',
    '安心感': '#幸せな恋愛',
    '自己肯定感': '#自己肯定感',
    '驚き': '#知らなかった',
  };
  tags.push(emotionTags[emotion]);

  // 投稿タイプから1個
  const postTypeTags: Record<PostType, string> = {
    '共感型': '#共感した人RT',
    '衝撃型': '#衝撃の事実',
    '切ない型': '#切ない',
    '恋愛依存型': '#恋愛依存',
    '暴露型': '#本音',
    '心理学型': '#恋愛心理学',
    'ストーリー型': '#恋愛体験談',
  };
  tags.push(postTypeTags[postType]);

  // テキストから頻出ワードを抽出してタグ化（2個）
  const keywordCandidates = [
    '恋愛', '片思い', '復縁', '失恋', '男性心理', '女性心理', 'LINE', 'マッチングアプリ',
    '婚活', '不倫', '浮気', '職場恋愛', '遠距離恋愛', '告白', '好きな人',
    'お金', '節約', '投資', '副業', '仕事', '転職', '美容', 'ダイエット', '育児',
  ];
  const found = keywordCandidates.filter(kw => text.includes(kw)).slice(0, 2);
  found.forEach(kw => tags.push(`#${kw}`));

  // 合計が5個に満たない場合は汎用タグで補完
  const genericTags = ['#SNS投稿', '#バズる投稿', '#保存して', '#TikTok', '#Threads'];
  while (tags.length < 5) {
    const candidate = genericTags[tags.length - (5 - genericTags.length)] ?? genericTags[0];
    if (!tags.includes(candidate)) tags.push(candidate);
    else tags.push(`#${emotion}${tags.length}`);
  }

  return tags.slice(0, 5);
}

// ============================================================
// BAZZ SCORE算出
// ============================================================
function calcBazzScore(
  text: string,
  postType: PostType,
  emotion: EmotionType,
  profileCta: string,
  postUrl: string,
): BuzzPostScore {
  // 各スコアをテキスト特性・投稿タイプ・感情タイプから算出

  // 共感力：感情キーワードの密度
  const emotionKeywords = EMOTION_KEYWORDS[emotion] ?? [];
  const emotionHits = emotionKeywords.filter(kw => text.includes(kw)).length;
  const empathy = Math.min(100, 60 + emotionHits * 5 + (postType === '共感型' ? 15 : postType === '切ない型' ? 10 : 5));

  // 保存率：ステップ・箇条書き・数字の有無
  const hasStructure = /[\d①②③]|・|□/.test(text);
  const hasKeyword = /保存|スクショ|メモ|チェック/.test(text);
  const saveRate = Math.min(100, 60 + (hasStructure ? 15 : 0) + (hasKeyword ? 10 : 0) + (postType === '心理学型' ? 10 : 0));

  // クリック率：疑問文・フックワードの有無
  const hasQuestion = /？|\?|どう思う|あなたは/.test(text);
  const hasHookWord = /実は|知らなかった|衝撃|まさか|え、/.test(text);
  const clickRate = Math.min(100, 58 + (hasQuestion ? 12 : 0) + (hasHookWord ? 15 : 0) + (postType === '衝撃型' ? 10 : 0));

  // 拡散率：共感・シェアワードの有無
  const hasShareWord = /友達|シェア|教えて|広めて|伝えて|送って/.test(text);
  const spreadRate = Math.min(100, 55 + (hasShareWord ? 20 : 0) + (postType === '共感型' ? 15 : 0));

  // コメント率：問いかけ・選択肢の有無
  const hasChoice = /どっち|AかB|あなたはどう|コメント/.test(text);
  const commentRate = Math.min(100, 55 + (hasQuestion ? 15 : 0) + (hasChoice ? 20 : 0));

  // プロフィール誘導力：CTAとURLの有無
  const profileRate = Math.min(100, 50 + (profileCta ? 25 : 0) + (postUrl ? 20 : 0));

  // 総合スコア（加重平均）
  const total = Math.round(
    (empathy * 0.2 + saveRate * 0.2 + clickRate * 0.2 + spreadRate * 0.15 + commentRate * 0.1 + profileRate * 0.15)
  );

  return { empathy, saveRate, clickRate, spreadRate, commentRate, profileRate, total };
}

// ============================================================
// 改善提案生成（95点未満のみ）
// ============================================================
function generateImprovement(score: BuzzPostScore): BuzzImprovement | null {
  if (score.total >= 95) return null;

  return {
    hookSuggestion: pickRandom(IMPROVEMENT_TEMPLATES.hook),
    emotionSuggestion: pickRandom(IMPROVEMENT_TEMPLATES.emotion),
    saveSuggestion: pickRandom(IMPROVEMENT_TEMPLATES.save),
    clickSuggestion: pickRandom(IMPROVEMENT_TEMPLATES.click),
  };
}


// ============================================================
// TikTok向け改行処理（文字数カウント後の後処理・意味を変えない）
// ============================================================
function addTikTokLineBreaks(text: string): string {
  // 段落ごとに処理（既存の改行は維持）
  const paragraphs = text.split('\n');
  return paragraphs.map(para => {
    if (para.trim().length === 0) return para;
    // 1段落が25文字以下ならそのまま
    if (para.length <= 25) return para;
    return breakParagraph(para);
  }).join('\n');
}

function breakParagraph(text: string): string {
  // 句読点を区切りに分割して再結合（自然な改行）
  const MIN_LINE = 13;
  const MAX_LINE = 22;

  // まず句読点で文を分割
  const segments: string[] = [];
  let current = '';
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    current += ch;
    if ((ch === '。' || ch === '！' || ch === '？' || ch === '…') ) {
      segments.push(current);
      current = '';
    } else if (ch === '、' && current.length >= MIN_LINE) {
      segments.push(current);
      current = '';
    }
  }
  if (current) segments.push(current);

  // セグメントを結合しながら改行を挿入
  let result = '';
  let lineLen = 0;
  for (const seg of segments) {
    if (lineLen === 0) {
      result += seg;
      lineLen += seg.length;
    } else if (lineLen + seg.length <= MAX_LINE) {
      result += seg;
      lineLen += seg.length;
    } else {
      result += '\n' + seg;
      lineLen = seg.length;
    }
    // セグメント末尾が文末句読点なら改行
    if (seg.endsWith('。') || seg.endsWith('！') || seg.endsWith('？') || seg.endsWith('…')) {
      if (lineLen >= MIN_LINE) {
        result += '\n';
        lineLen = 0;
      }
    }
  }
  return result.replace(/\n$/, ''); // 末尾の余分な改行を除去
}

// ============================================================
// メイン生成関数（外部公開）
// ============================================================
export function generateBuzzPost(params: {
  articleText: string;    // ユーザーがコピペした記事本文（変更なし）
  tiktokLength: number;   // 文字数設定（既存設定を流用）
  profileCta: string;     // 既存プロフィール誘導文を流用
  postUrl: string;        // 既存投稿URLを流用
}): BuzzPostResult {
  const { articleText, tiktokLength, profileCta, postUrl } = params;

  // 1. 感情分析
  const emotion = analyzeEmotion(articleText);

  // 2. 投稿タイプ選択
  const postType = selectPostType(articleText, emotion);

  // 3. フック文・コア本文抽出（記事本文は変更しない）
  const hook = extractHook(articleText);
  const core = extractCore(articleText, tiktokLength);

  // 4. 投稿文生成（テンプレートに挿入）
  const templates = BUZZ_POST_TEMPLATES[postType];
  const template = pickRandom(templates);
  let postText = template
    .replace('{hook}', hook)
    .replace('{core}', core);

  // 5. プロフィール誘導文・URLを末尾に付与（既存設定流用）
  if (profileCta) postText += `\n\n${profileCta}`;
  if (postUrl) postText += `\n${postUrl}`;

  // 6. 動的ハッシュタグ生成（記事ごとに最適な5個）
  const hashtags = generateDynamicHashtags(articleText, emotion, postType);
  const hashtagText = hashtags.join(' ');

  // 7. BAZZ SCORE算出
  const score = calcBazzScore(postText, postType, emotion, profileCta, postUrl);

  // 8. 改善提案生成（95点未満のみ）
  const improvement = generateImprovement(score);

  // TikTok向け改行処理を適用（文字数カウント後の後処理）
  const postTextFormatted = addTikTokLineBreaks(postText);

  return {
    postText: postTextFormatted,
    hashtags,
    hashtagText,
    emotionType: emotion,
    postType,
    score,
    improvement,
  };
}

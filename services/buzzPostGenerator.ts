// services/buzzPostGenerator.ts
import type { BuzzPostResult, BuzzPostScore, BuzzImprovement } from '../types';

type EmotionType =
  | '共感' | '恋愛不安' | '切なさ' | '後悔' | '嫉妬'
  | '孤独' | '依存' | '片思い' | '復縁願望' | '失恋'
  | '期待' | '安心感' | '自己肯定感' | '驚き';

type PostType =
  | '共感型' | '衝撃型' | '切ない型' | '恋愛依存型'
  | '暴露型' | '心理学型' | 'ストーリー型';

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function countTextChars(text: string): number {
  return text.replace(/[\n\t\r]/g, '').length;
}

// ============================================================
// 感情分析
// ============================================================
const EMOTION_KEYWORDS: Record<EmotionType, string[]> = {
  '共感': ['わかる', '同じ', 'あるある', '私だけ', 'みんな', 'そうだよね', '経験', '共感'],
  '恋愛不安': ['不安', '心配', '怖い', '嫌われ', '脈', 'LINEが来ない', '既読スルー', '返信'],
  '切なさ': ['切ない', '寂しい', '会いたい', '会えない', '好きなのに', 'もどかしい', '届かない'],
  '後悔': ['後悔', 'あの時', 'もっと早く', '気づかなかった', '逃した', '失った'],
  '嫉妬': ['他の女', '他の男', '浮気', 'ヤキモチ', '羨ましい', '悔しい'],
  '孤独': ['一人', '誰もいない', '理解されない', '孤立', '話せない', '頼れない'],
  '依存': ['離れられない', 'ないと無理', '必要', 'すがる', '手放せない', 'やめられない'],
  '片思い': ['片思い', '好きな人', '告白', '気持ちを伝え', '両想い', '振られ', '勇気がなく'],
  '復縁願望': ['復縁', '元彼', '元カノ', '戻りたい', 'もう一度', 'やり直し', '忘れられない'],
  '失恋': ['失恋', '振られ', '別れ', 'フラれ', '終わった', '好きだったのに', '泣いた'],
  '期待': ['期待', 'もしかして', 'チャンス', '脈あり', '好意', 'アピール', 'サイン'],
  '安心感': ['安心', 'ほっとした', '大丈夫', '信じ', '大切にされ', '愛されてる', '幸せ'],
  '自己肯定感': ['自分を好き', '自信', '自己肯定', '自分を大切', '変わった', '成長'],
  '驚き': ['実は', 'まさか', '知らなかった', '衝撃', 'びっくり', '意外', '真実'],
};

function analyzeEmotion(text: string): EmotionType {
  const scores: Partial<Record<EmotionType, number>> = {};
  for (const [emotion, keywords] of Object.entries(EMOTION_KEYWORDS) as [EmotionType, string[]][]) {
    scores[emotion] = keywords.filter(kw => text.includes(kw)).length;
  }
  const sorted = (Object.entries(scores) as [EmotionType, number][]).sort((a, b) => b[1] - a[1]);
  return sorted[0][1] > 0 ? sorted[0][0] : '共感';
}

// ============================================================
// 投稿タイプ選択
// ============================================================
const POST_TYPE_KEYWORDS: Record<PostType, string[]> = {
  '共感型': ['わかる', '同じ', 'あるある', 'そうだよね', '私も'],
  '衝撃型': ['実は', '知らなかった', '驚き', '衝撃', 'まさか', '意外'],
  '切ない型': ['切ない', '寂しい', '会いたい', 'もどかしい', '届かない'],
  '恋愛依存型': ['離れられない', '必要', '手放せない', 'すがる'],
  '暴露型': ['本音', '裏側', '本当のこと', '真実', '本当は'],
  '心理学型': ['心理', '無意識', '脳', '行動', 'パターン'],
  'ストーリー型': ['ある日', 'あの時', 'そこから', 'ある出来事'],
};

function selectPostType(text: string, emotion: EmotionType): PostType {
  const scores: Partial<Record<PostType, number>> = {};
  for (const [type, keywords] of Object.entries(POST_TYPE_KEYWORDS) as [PostType, string[]][]) {
    scores[type] = keywords.filter(kw => text.includes(kw)).length;
  }
  const bonus: Partial<Record<EmotionType, PostType>> = {
    '共感': '共感型', '驚き': '衝撃型', '切なさ': '切ない型',
    '依存': '恋愛依存型', '後悔': 'ストーリー型',
    '恋愛不安': '心理学型', '嫉妬': '暴露型',
  };
  const b = bonus[emotion];
  if (b) scores[b] = (scores[b] || 0) + 2;
  const sorted = (Object.entries(scores) as [PostType, number][]).sort((a, b) => b[1] - a[1]);
  return sorted[0][1] > 0 ? sorted[0][0] : '共感型';
}

// ============================================================
// フック・コア抽出
// ============================================================
function extractHook(text: string): string {
  const lines = text.split('\n').filter(l => l.trim().length > 0);
  const first = lines[0]?.trim() ?? '';
  return first.length <= 40 ? first : first.slice(0, 38) + '…';
}

function extractCore(text: string, tiktokLength: number): string {
  const lines = text.split('\n').filter(l => l.trim().length > 0);
  const bodyLines = lines.slice(1);
  let core = bodyLines.join('\n');
  const maxChars = tiktokLength === 300 ? 280 : tiktokLength === 500 ? 480 : 580;
  const coreChars = countTextChars(core);
  if (coreChars > maxChars) {
    let trimmed = '';
    let count = 0;
    for (const ch of core) {
      if (ch !== '\n') count++;
      trimmed += ch;
      if (count >= maxChars - 3) { trimmed += '…'; break; }
    }
    core = trimmed;
  }
  return core || lines[0]?.slice(0, maxChars) || '';
}

// ============================================================
// ハッシュタグ生成
// ============================================================
function generateDynamicHashtags(text: string, emotion: EmotionType, postType: PostType): string[] {
  const emotionTags: Record<EmotionType, string> = {
    '共感': '#あるある', '恋愛不安': '#恋愛不安', '切なさ': '#切ない恋愛',
    '後悔': '#後悔しない恋愛', '嫉妬': '#恋愛の悩み', '孤独': '#一人じゃない',
    '依存': '#恋愛依存', '片思い': '#片思い', '復縁願望': '#復縁',
    '失恋': '#失恋', '期待': '#恋愛', '安心感': '#幸せな恋愛',
    '自己肯定感': '#自己肯定感', '驚き': '#知らなかった',
  };
  const postTypeTags: Record<PostType, string> = {
    '共感型': '#共感した人RT', '衝撃型': '#衝撃の事実', '切ない型': '#切ない',
    '恋愛依存型': '#恋愛依存', '暴露型': '#本音', '心理学型': '#恋愛心理学',
    'ストーリー型': '#恋愛体験談',
  };
  const tags: string[] = [emotionTags[emotion], postTypeTags[postType]];
  const candidates = ['恋愛', '片思い', '復縁', '失恋', '男性心理', '女性心理', 'LINE',
    'マッチングアプリ', '婚活', '浮気', '職場恋愛'];
  candidates.filter(kw => text.includes(kw)).slice(0, 2).forEach(kw => tags.push('#' + kw));
  const generics = ['#SNS投稿', '#バズる投稿', '#保存して', '#TikTok', '#Threads'];
  while (tags.length < 5) tags.push(generics[tags.length]);
  return tags.slice(0, 5);
}

// ============================================================
// BAZZ SCORE
// ============================================================
function calcBazzScore(text: string, postType: PostType, emotion: EmotionType, profileCta: string, postUrl: string): BuzzPostScore {
  const hasStructure = /[\d①②③]|・|□/.test(text);
  const hasQuestion = /？|\?|どう思う|あなたは/.test(text);
  const hasHookWord = /実は|知らなかった|衝撃|まさか/.test(text);
  const hasShareWord = /友達|シェア|教えて|広めて/.test(text);
  const empathy = Math.min(100, 60 + (postType === '共感型' ? 15 : 8) + Math.floor(Math.random() * 8));
  const saveRate = Math.min(100, 60 + (hasStructure ? 15 : 0) + Math.floor(Math.random() * 8));
  const clickRate = Math.min(100, 58 + (hasQuestion ? 12 : 0) + (hasHookWord ? 15 : 0) + Math.floor(Math.random() * 8));
  const spreadRate = Math.min(100, 55 + (hasShareWord ? 20 : 0) + Math.floor(Math.random() * 8));
  const commentRate = Math.min(100, 55 + (hasQuestion ? 15 : 0) + Math.floor(Math.random() * 8));
  const profileRate = Math.min(100, 50 + (profileCta ? 25 : 0) + (postUrl ? 20 : 0));
  const total = Math.round(empathy * 0.2 + saveRate * 0.2 + clickRate * 0.2 + spreadRate * 0.15 + commentRate * 0.1 + profileRate * 0.15);
  return { empathy, saveRate, clickRate, spreadRate, commentRate, profileRate, total };
}

function generateImprovement(score: BuzzPostScore): BuzzImprovement | null {
  if (score.total >= 95) return null;
  return {
    hookSuggestion: '冒頭に「これ知ってる？」「実は〇〇だった」など疑問・驚きで始めると開封率UP',
    emotionSuggestion: '「そう、それ私だ」と感じさせる具体的なシーンを1つ追加するとより刺さる',
    saveSuggestion: '「保存しておくといい」などの明示的な保存誘導を入れる',
    clickSuggestion: '「続きはプロフィールから」より「詳しくは今すぐプロフへ→」の方が誘導率が高い',
  };
}

// ============================================================
// TikTok改行処理（約20文字・句読点優先・強制改行対応）
// ============================================================
function addTikTokLineBreaks(text: string): string {
  return text.split('\n').map(para => {
    if (!para.trim() || para.length <= 20) return para;
    return breakLine(para);
  }).join('\n');
}

function breakLine(text: string): string {
  const TARGET = 20;
  const MAX = 25;

  // ① まず句読点・読点でセグメントに分割
  // ※ 鍵カッコ内（「〜」）は改行しない
  const segs: string[] = [];
  let cur = '';
  let inKakko = false; // 鍵カッコ内フラグ
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    cur += ch;
    // 鍵カッコの開閉を追跡
    if (ch === '「') inKakko = true;
    if (ch === '」') inKakko = false;
    // 鍵カッコ内は区切らない
    if (inKakko) continue;
    // 文末句読点の直後で区切る
    if ('。！？…'.includes(ch)) {
      segs.push(cur);
      cur = '';
    // 読点は一定文字数以上になったら区切る
    } else if (ch === '、' && cur.length >= 10) {
      segs.push(cur);
      cur = '';
    // 長すぎる場合は助詞・接続詞の前で強制区切り
    } else if (cur.length >= MAX && !inKakko) {
      const naturalEnds = ['が', 'を', 'に', 'は', 'で', 'と', 'も', 'から', 'けど', 'ので', 'なら'];
      let cut = false;
      for (const ne of naturalEnds) {
        if (text.slice(i + 1).startsWith(ne)) {
          segs.push(cur);
          cur = '';
          cut = true;
          break;
        }
      }
      // 助詞も見つからない場合はそのまま続ける（次の句読点まで待つ）
    }
  }
  if (cur) segs.push(cur);

  // ② セグメントを結合しながら TARGET 文字前後で改行
  let result = '';
  let lineLen = 0;

  for (const seg of segs) {
    if (lineLen === 0) {
      result += seg;
      lineLen += seg.length;
    } else if (lineLen + seg.length <= TARGET + 5) {
      result += seg;
      lineLen += seg.length;
    } else {
      result += '\n' + seg;
      lineLen = seg.length;
    }
    // 文末句読点の後は必ず改行
    if ('。！？…'.includes(seg.slice(-1)) && lineLen >= 8) {
      result += '\n';
      lineLen = 0;
    }
  }

  // ③ それでも25文字超の行が残っていたら強制的に分割
  const finalLines = result.replace(/\n$/, '').split('\n');
  const processed = finalLines.map(line => {
    if (line.length <= MAX) return line;
    // 25文字超の行を強制分割
    const chunks: string[] = [];
    let remaining = line;
    while (remaining.length > MAX) {
      // TARGET付近で切れる場所を探す
      let cutAt = TARGET;
      // 少し前後を見て自然な区切りを探す
      for (let offset = 0; offset <= 5; offset++) {
        const pos = TARGET - offset;
        if (pos > 0 && pos < remaining.length) {
          const ch = remaining[pos - 1];
          if ('。！？…、'.includes(ch) || ['が','を','に','は','で','と','も'].includes(remaining[pos])) {
            cutAt = pos;
            break;
          }
        }
      }
      chunks.push(remaining.slice(0, cutAt));
      remaining = remaining.slice(cutAt);
    }
    if (remaining) chunks.push(remaining);
    return chunks.join('\n');
  });

  return processed.join('\n');
}

// ============================================================
// 難読漢字置換（TikTok読み上げ対策）
// ============================================================
function fixTikTokReading(text: string): string {
  const r: [RegExp, string][] = [
    [/高鳴り/g, 'ドキドキ'], [/高鳴る/g, 'ドキドキする'],
    [/募る/g, '大きくなる'], [/葛藤/g, '心の迷い'],
    [/曖昧/g, 'はっきりしない'], [/嫉妬/g, 'やきもち'],
    [/孤独/g, 'ひとり'], [/脆い/g, '弱い'],
    [/躊躇/g, 'ためらい'], [/諦め/g, 'あきらめ'],
    [/執着/g, 'こだわり'], [/焦燥/g, 'あせり'],
    [/喪失/g, '失った気持ち'], [/虚無/g, '空っぽな気持ち'],
  ];
  let result = text;
  for (const [p, rep] of r) result = result.replace(p, rep);
  return result;
}

// ============================================================
// 格言生成
// ============================================================
function generateQuote(emotion: EmotionType): string {
  const quotes: Record<EmotionType, string[]> = {
    '共感': [
      '「同じ気持ちの人がいるだけで、\n心は少し軽くなる。」',
      '「わかってもらえた瞬間、\n人はやっと前に進める。」',
    ],
    '恋愛不安': [
      '「追いかける恋より、\n追いかけられる恋の方が\n心は穏やかになる。」',
      '「不安になるほど好きなら、\nそれは本物の気持ち。」',
    ],
    '切なさ': [
      '「届かない想いも、\nちゃんと誰かの心を動かしている。」',
      '「切なさを知っている人は、\n人の痛みにやさしくなれる。」',
    ],
    '後悔': [
      '「後悔は終わりじゃない。\n気づいた瞬間が、次の始まり。」',
      '「あの時に戻れなくても、\n今から変えることはできる。」',
    ],
    '嫉妬': [
      '「やきもちは愛情の裏返し。\nただ、燃やしすぎないことが大切。」',
      '「比べるより、\n自分を磨く方が何倍も楽しい。」',
    ],
    '孤独': [
      '「ひとりの時間は、\n自分と仲良くなるチャンス。」',
      '「自分と向き合える人は、\nどこにいても強くなれる。」',
    ],
    '依存': [
      '「手放す勇気が、\n新しい出会いを呼んでくる。」',
      '「自分を満たせる人が、\n人を本当に愛せる。」',
    ],
    '片思い': [
      '「全力で誰かを好きになれること、\nそれだけで十分すごいことだよ。」',
      '「気持ちを伝えた勇気は、\n結果に関係なく宝物になる。」',
    ],
    '復縁願望': [
      '「縁があるものは、\n離れてもまた戻ってくる。」',
      '「忘れられない人がいるなら、\nそれだけ本気で愛せた証拠。」',
    ],
    '失恋': [
      '「失恋は終わりじゃなく、\n本当の自分に戻るきっかけ。」',
      '「傷ついた心は、\n必ず前より強く育っていく。」',
    ],
    '期待': [
      '「ときめきを感じた瞬間、\n人生は少し輝き始める。」',
      '「チャンスは動いた人のところへやってくる。」',
    ],
    '安心感': [
      '「一緒にいて楽な人が、\n本当に合う人。」',
      '「心が穏やかな恋愛が、\n一番長続きする。」',
    ],
    '自己肯定感': [
      '「自分を好きでいられる人が、\n一番愛される。」',
      '「あなたの価値は、\n誰かの評価では決まらない。」',
    ],
    '驚き': [
      '「知らなかった事実が、\n見え方を変えることがある。」',
      '「気づいた瞬間から、\n世界は少し違って見える。」',
    ],
  };
  return pickRandom(quotes[emotion] ?? quotes['共感']);
}

// ============================================================
// TikTok記事本文生成
// ============================================================
function generateTikTokArticle(
  articleText: string,
  tiktokLength: number,
  tiktokCta: string,
  emotion: EmotionType,
  postType: PostType,
): string {
  let base = articleText.trim();
  const fillers = [
    '\n\nこれを知っているだけで、恋愛の見え方が大きく変わります。焦らなくていい。自分のペースで進んでいきましょう。',
    '\n\n大切なのは相手の反応より、自分の気持ちに正直でいること。自分を大切にしている人は、自然と相手からも大切にされます。',
    '\n\n恋愛でうまくいかないときほど、自分を責めないでほしい。あなたは十分頑張っている。それだけで価値があります。',
    '\n\n今日から少しだけ、自分を優先してみてください。自分が満たされていると、不思議と恋愛もうまく回り始めます。',
    '\n\n完璧な人なんていない。傷ついた経験があるから、人の痛みがわかる。それがあなたの一番の強みになります。',
    '\n\n焦る気持ちはよくわかる。でも焦りは必ず相手に伝わってしまう。深呼吸して、今この瞬間だけに集中してみて。',
    '\n\n好きな人ができるたびに全力になれるあなたは、それだけ人を大切にできる証拠。その気持ちは絶対に報われます。',
    '\n\n恋愛は結果だけじゃない。その過程で気づいたこと、成長したこと、全部が意味を持っています。',
    '\n\n自分を好きになることが、全ての恋愛の基盤になります。今日一つだけ、自分を褒めることを忘れないでください。',
    '\n\nどんな結果になっても、あなたの価値は変わらない。相手の反応で自分を測ることをやめると、恋愛が急に楽になります。',
    '\n\n恋愛で一番大切なのは自己肯定感です。自分を好きでいられる人は、どんな恋愛でも前向きに進めます。',
    '\n\n相手のことを考えすぎるとき、少しだけ自分のことを考えてみてください。あなたの気持ちも同じくらい大切です。',
  ];
  let i = 0;
  while (countTextChars(base) < tiktokLength && i < fillers.length) { base += fillers[i++]; }
  // 格言追加
  base += '\n\n' + generateQuote(emotion);
  // 難読漢字置換
  base = fixTikTokReading(base);
  // TikTok専用誘導文のみ付与（他SNSには渡さない）
  if (tiktokCta) base += '\n\n' + tiktokCta;
  // TikTok改行処理
  return addTikTokLineBreaks(base);
}

// ============================================================
// バズ投稿文テンプレート
// ============================================================
const BUZZ_POST_TEMPLATES: Record<PostType, string[]> = {
  '共感型': [
    '{hook}\n\nこれ、私だけじゃなかったんだって気づいた瞬間、すごく楽になった。\n\n{core}\n\n「そうそう、わかる」って感じた人、ぜひ保存してね。',
    '{hook}\n\n同じ気持ちの人、絶対いると思って書いた。\n\n{core}\n\nコメントで「わかる」って教えてくれると嬉しいな。',
  ],
  '衝撃型': [
    '{hook}\n\nこれ、ほとんどの人が知らないんだよね。\n\n{core}\n\n知ってるだけで全然違う。保存しておいて損はないよ。',
    '{hook}\n\n正直、私も最近まで気づいてなかった。\n\n{core}\n\nこれを知ってから、見え方が変わった。',
  ],
  '切ない型': [
    '{hook}\n\nずっとその気持ちを抱えてきた人に届いてほしい。\n\n{core}\n\nあなたの気持ち、ちゃんと誰かに届いてるよ。',
    '{hook}\n\n言葉にできない気持ちって、あるよね。\n\n{core}\n\n同じ気持ちの人、ひとりじゃないよ。',
  ],
  '恋愛依存型': [
    '{hook}\n\n頭ではわかってるのに、やめられない。\n\n{core}\n\n自分の気持ちに正直でいることが、最初の一歩だと思う。',
    '{hook}\n\nこれが「好き」なのか「依存」なのか、わからなくなることってある。\n\n{core}\n\n自分の気持ちを大切にすることから始めてみて。',
  ],
  '暴露型': [
    '{hook}\n\n誰も言わないけど、これが本音だと思う。\n\n{core}\n\n知ってほしかったから書いた。保存してね。',
    '{hook}\n\n表向きとは全然違う話をするね。\n\n{core}\n\nこれ、友達にも教えてあげてほしい。',
  ],
  '心理学型': [
    '{hook}\n\nこれ、心理学的に証明されてる話なんだけど。\n\n{core}\n\n人の行動には必ず理由がある。知っておくと、気持ちが楽になるよ。',
    '{hook}\n\n無意識にやってることって、意外と多い。\n\n{core}\n\n自分のパターンを知るだけで、すごく変わる。',
  ],
  'ストーリー型': [
    '{hook}\n\nあの時の自分に言ってあげたかった言葉がある。\n\n{core}\n\n同じ状況の人に、少しでも届いたら嬉しい。',
    '{hook}\n\nある日気づいたんだよね。\n\n{core}\n\nあの経験があったから、今の自分がいる。',
  ],
};

// ============================================================
// プラットフォーム別SNS投稿文
// ============================================================
function generatePlatformPosts(
  basePost: string,
  hashtags: string[],
  hashtagText: string,
  profileCta: string,
  postUrl: string,
  postType: PostType,
): { threads: string; xPost: string; instagram: string; youtube: string } {
  const lines = basePost.split('\n').filter((l: string) => l.trim());
  const hook = lines[0] ?? '';
  const body = lines.slice(1, 6).join('\n');
  const ctaSuffix = [profileCta, postUrl].filter(Boolean).join('\n');

  // Threads：投稿文 → CTA・URL → ハッシュタグ の順
  const threads = basePost
    + (ctaSuffix ? '\n\n' + ctaSuffix : '')
    + '\n\n' + hashtagText;

  // X
  const xLines = lines.slice(0, 4).join('\n');
  const xHashtags = hashtags.slice(0, 3).join(' ');
  const xPost = xLines
    + (profileCta ? '\n\n' + profileCta : '')
    + (postUrl ? '\n' + postUrl : '')
    + (xHashtags ? '\n\n' + xHashtags : '');

  // Instagram
  const igEmoji = postType === '共感型' ? '💕' : postType === '衝撃型' ? '😱' :
    postType === '切ない型' ? '🥺' : postType === '恋愛依存型' ? '💭' :
    postType === '暴露型' ? '🔥' : postType === '心理学型' ? '🧠' : '✨';
  const igHashtags = [...hashtags, '#恋愛', '#インスタ恋愛', '#恋愛あるある'].slice(0, 8).join(' ');
  const instagram = igEmoji + ' ' + hook + '\n\n' + body + '\n\n' + igHashtags + (ctaSuffix ? '\n\n' + ctaSuffix : '');

  // YouTube Shorts
  const ytPost = '【' + hook + '】\n\n' + body + '\n\n' + hashtagText + (ctaSuffix ? '\n\n' + ctaSuffix : '');

  return { threads, xPost, instagram, youtube: ytPost };
}

// ============================================================
// SEO・タイトル・画像指示文生成
// ============================================================
function generateSeoTitle(text: string, emotion: EmotionType, postType: PostType): string {
  const hook = extractHook(text);
  const templates: Record<PostType, string[]> = {
    '共感型': ['【共感多数】' + hook, 'あなたも経験してる？' + hook],
    '衝撃型': ['【衝撃】' + hook, '99%が知らない' + hook + 'の真実'],
    '切ない型': [hook + '【切なすぎる恋愛の話】', '泣ける。' + hook],
    '恋愛依存型': ['【恋愛依存】' + hook + 'から抜け出す方法', hook + 'になってしまう理由'],
    '暴露型': ['【本音】' + hook, '誰も言わない' + hook],
    '心理学型': ['【心理学】' + hook, '心理学的に証明！' + hook],
    'ストーリー型': [hook + 'の話', 'ある日気づいた。' + hook],
  };
  return pickRandom(templates[postType]);
}

function generateSeoKeywords(text: string, emotion: EmotionType): string[] {
  const candidates = ['恋愛', '片思い', '復縁', '失恋', '男性心理', '女性心理', 'LINE',
    'マッチングアプリ', '婚活', '浮気', '職場恋愛', 'お金', '節約', '投資', '副業'];
  const found = candidates.filter(kw => text.includes(kw)).slice(0, 4);
  const emotionKw: Record<EmotionType, string> = {
    '共感': 'あるある', '恋愛不安': '不安解消', '切なさ': '切ない恋愛',
    '後悔': '後悔しない', '嫉妬': '嫉妬心', '孤独': '孤独感',
    '依存': '恋愛依存', '片思い': '片思い', '復縁願望': '復縁方法',
    '失恋': '失恋乗り越え', '期待': '脈あり', '安心感': '幸せな恋愛',
    '自己肯定感': '自己肯定感', '驚き': '衝撃事実',
  };
  return [...new Set([...found, emotionKw[emotion], 'TikTok', 'SNS'])].slice(0, 6);
}

function generateMetaDescription(text: string, emotion: EmotionType): string {
  const hook = extractHook(text);
  const desc = hook + '。' + emotion + 'に共感する人が続出。あなたの気持ちに寄り添う内容です。';
  return desc.length > 120 ? desc.slice(0, 117) + '...' : desc;
}

function generateArticleTitle(text: string, emotion: EmotionType, postType: PostType): string {
  const hook = extractHook(text);
  return pickRandom([
    hook + 'について',
    hook + 'の真実',
    hook + 'を経験したあなたへ',
    'なぜ' + hook + 'になるのか',
  ]);
}

function generateThumbnailTitle(text: string, postType: PostType): string {
  const templates: Record<PostType, string[]> = {
    '共感型': ['共感しかない', 'これ私のこと？'],
    '衝撃型': ['え、知らなかった', '衝撃の事実'],
    '切ない型': ['切なすぎる', '泣ける話'],
    '恋愛依存型': ['やめられない', '手放せない理由'],
    '暴露型': ['本音言うね', '裏側を暴露'],
    '心理学型': ['心理学的真実', '科学的に証明'],
    'ストーリー型': ['実話です', 'あの日のこと'],
  };
  return pickRandom(templates[postType]);
}

function generateSeoSpecialTitle(text: string, emotion: EmotionType, postType: PostType): string {
  const hook = extractHook(text);
  const kwCandidates = ['恋愛', '片思い', '復縁', '失恋', '男性心理', '女性心理'];
  const foundKw = kwCandidates.find(kw => text.includes(kw)) ?? String(emotion);
  const templates: Record<PostType, string[]> = {
    '共感型': ['【' + foundKw + 'あるある】' + hook + 'と感じる人が急増中', hook + 'と思う人必見｜' + foundKw + 'で共感多数の理由'],
    '衝撃型': ['【衝撃】' + hook + '｜99%が知らない' + foundKw + 'の真実', '知らないと損する｜' + hook + 'の本当の理由'],
    '切ない型': [hook + 'で涙する人へ｜' + foundKw + 'の切ない現実と対処法'],
    '恋愛依存型': ['【' + foundKw + '依存】' + hook + 'から抜け出す具体的な方法'],
    '暴露型': ['【本音暴露】' + hook + '｜' + foundKw + 'の裏側を公開'],
    '心理学型': ['【心理学】' + hook + 'のメカニズム｜' + foundKw + 'の科学的根拠'],
    'ストーリー型': [hook + 'という経験談｜' + foundKw + 'で人生が変わった話'],
  };
  const list = templates[postType] ?? templates['共感型'];
  return pickRandom(list);
}

function generateThumbnailTikTok(text: string, emotion: EmotionType, postType: PostType): string {
  const hook = extractHook(text);
  const colorMap: Record<PostType, string> = {
    '共感型': 'ピンク・ラベンダー系', '衝撃型': '赤・オレンジ系',
    '切ない型': '青・グレー系', '恋愛依存型': 'パープル・ディープピンク系',
    '暴露型': '黒・ゴールド系', '心理学型': 'ネイビー・白系',
    'ストーリー型': 'セピア・ウォームブラウン系',
  };
  return [
    '【TikTok画像生成指示文】',
    'サイズ：1080 × 1920px（縦型 9:16）',
    '',
    '■ メインテキスト',
    '「' + hook + '」',
    '',
    '■ デザイン',
    '・配色：' + colorMap[postType],
    '・フォント：太字・視認性重視・縁取りあり',
    '・背景：グラデーションまたは単色',
    '',
    '■ 感情：' + emotion + ' / ' + postType,
  ].join('\n');
}

function generateThumbnailTikTokPerson(text: string, emotion: EmotionType, postType: PostType): string {
  const expressionMap: Record<EmotionType, string> = {
    '共感': 'うんうんとうなずくような、共感している表情',
    '恋愛不安': 'スマホを見つめながら少し不安そうな表情',
    '切なさ': '遠くを見つめる、少し寂しそうな横顔',
    '後悔': '下を向いて考え込むような表情',
    '嫉妬': 'ちょっとムッとした表情',
    '孤独': '窓の外を見ている静かな表情',
    '依存': '誰かにすがるような、心細そうな表情',
    '片思い': 'ぼんやりと微笑みながら考え込んでいる表情',
    '復縁願望': '過去を思い出しているような遠い目',
    '失恋': '泣いた後のような表情でも前を向こうとしている',
    '期待': 'キラキラした目で前を見ている表情',
    '安心感': 'ほっとしたような、やわらかく温かい笑顔',
    '自己肯定感': '自信を持った表情、背筋がまっすぐ',
    '驚き': '目を少し大きく開けた驚きと納得が混ざった表情',
  };
  const poseMap: Record<PostType, string> = {
    '共感型': '両手を軽く広げ「そうそう！」というジェスチャー',
    '衝撃型': '手を口元に当てて驚いているポーズ',
    '切ない型': '膝を抱えて座っているポーズ',
    '恋愛依存型': 'スマホを両手で持ち画面を見つめているポーズ',
    '暴露型': 'マイクを持っているか口元に人差し指を当てているポーズ',
    '心理学型': '腕を組んでいるかあごに手を当てて考えているポーズ',
    'ストーリー型': '少し遠くを見ながら回想しているような自然なポーズ',
  };
  return [
    '【TikTok人物画像生成指示文】',
    'サイズ：1080 × 1920px / CapCutテンプレート用',
    '',
    '■ 人物設定',
    '・日本人女性（20代〜30代）',
    '・清潔感のあるナチュラルな服装',
    '',
    '■ 表情',
    '・' + (expressionMap[emotion] ?? '自然な表情'),
    '',
    '■ ポーズ',
    '・' + (poseMap[postType] ?? '自然なポーズ'),
    '',
    '■ 構図',
    '・人物は画面の中央に配置',
    '・文字は入れない（人物のみ・テキストなし）',
    '・背景はシンプルな単色',
    '',
    '■ 感情：' + emotion + ' / ' + postType,
  ].join('\n');
}

function generateThumbnailNote(text: string, emotion: EmotionType, postType: PostType): string {
  const hook = extractHook(text);
  return [
    '【note画像生成指示文】',
    'サイズ：1280 × 670px（横型 16:9）',
    '',
    '■ メインテキスト',
    '「' + hook + '」',
    '',
    '■ デザイン',
    '・スタイル：シンプル・洗練・読みやすいフォント',
    '・左側にテキスト・右側にイメージ、または全面シンプル構成',
    '・余白を十分に取る',
    '',
    '■ 感情：' + emotion + ' / ' + postType,
  ].join('\n');
}

// ============================================================
// note記事生成
// ============================================================
function generateNoteArticle(articleText: string, emotion: EmotionType, postType: PostType): string {
  const title = generateArticleTitle(articleText, emotion, postType);
  return title + '\n\n' + articleText;
}

// ============================================================
// メイン生成関数
// ============================================================
export function generateBuzzPost(params: {
  articleText: string;
  tiktokLength: number;
  profileCta: string;
  postUrl: string;
  tiktokCta: string;
}): BuzzPostResult {
  const { articleText, tiktokLength, profileCta, postUrl, tiktokCta } = params;

  const emotion = analyzeEmotion(articleText);
  const postType = selectPostType(articleText, emotion);
  const hook = extractHook(articleText);
  const core = extractCore(articleText, tiktokLength);

  const template = pickRandom(BUZZ_POST_TEMPLATES[postType]);
  const postText = template.replace('{hook}', hook).replace('{core}', core);

  const hashtags = generateDynamicHashtags(articleText, emotion, postType);
  const hashtagText = hashtags.join(' ');

  const score = calcBazzScore(postText, postType, emotion, profileCta, postUrl);
  const improvement = generateImprovement(score);

  const postTextFormatted = addTikTokLineBreaks(postText);
  const tiktokArticle = generateTikTokArticle(articleText, tiktokLength, tiktokCta, emotion, postType);
  const noteArticle = generateNoteArticle(articleText, emotion, postType);

  const platformPosts = generatePlatformPosts(postTextFormatted, hashtags, hashtagText, profileCta, postUrl, postType);

  const seoTitle = generateSeoTitle(articleText, emotion, postType);
  const seoKeywords = generateSeoKeywords(articleText, emotion);
  const metaDescription = generateMetaDescription(articleText, emotion);
  const articleTitle = generateArticleTitle(articleText, emotion, postType);
  const thumbnailTitle = generateThumbnailTitle(articleText, postType);
  const thumbnailTikTok = generateThumbnailTikTok(articleText, emotion, postType);
  const thumbnailTikTokPerson = generateThumbnailTikTokPerson(articleText, emotion, postType);
  const thumbnailNote = generateThumbnailNote(articleText, emotion, postType);
  const seoSpecialTitle = generateSeoSpecialTitle(articleText, emotion, postType);

  return {
    postText: postTextFormatted,
    tiktokArticle,
    hashtags,
    hashtagText,
    emotionType: emotion,
    postType,
    score,
    improvement,
    noteArticle,
    seoTitle,
    seoKeywords,
    metaDescription,
    articleTitle,
    thumbnailTitle,
    threadsPost: platformPosts.threads,
    xPost: platformPosts.xPost,
    instagramPost: platformPosts.instagram,
    youtubePost: platformPosts.youtube,
    profileCtaText: profileCta,
    postUrlText: postUrl,
    thumbnailTikTok,
    thumbnailTikTokPerson,
    thumbnailNote,
    seoSpecialTitle,
  };
}

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
  // 記事内容から検索需要の高いハッシュタグを生成
  // 固定タグ禁止・記事キーワード最優先・SEO・感情ワード重視

  const result: string[] = [];

  // ① 記事内容キーワードマップ（検索需要優先・具体的なワード）
  const keywordTagMap: [string, string[]][] = [
    ['返信が遅い', ['#返信が遅い', '#返信が来ない理由', '#好きな人の心理']],
    ['返信', ['#返信が遅い', '#返信待ち', '#好きな人の心理']],
    ['既読スルー', ['#既読スルー', '#既読無視', '#好きな人の本音']],
    ['既読', ['#既読スルー', '#既読無視の理由', '#片思いあるある']],
    ['LINE', ['#LINEの返信', '#LINEの頻度', '#好きな人とのLINE']],
    ['沈黙', ['#急に連絡が来ない', '#返信が来ない理由', '#好きな人の本音']],
    ['急に連絡', ['#急に連絡が来ない', '#突然の沈黙', '#恋愛の悩み']],
    ['突然', ['#急に冷たくなった理由', '#突然の沈黙', '#恋愛の不安']],
    ['距離を取', ['#急に距離を置く男', '#冷たくなった理由', '#男性心理']],
    ['冷たく', ['#急に冷たくなった', '#距離を置く男心理', '#恋愛の悩み']],
    ['脈あり', ['#脈ありサイン', '#本命だけにする行動', '#好き避け']],
    ['本命', ['#本命だけにする行動', '#本命と遊び相手の違い', '#男性心理']],
    ['好き避け', ['#好き避け', '#好き避け男子', '#脈あり行動']],
    ['片思い', ['#片思い中', '#片思いあるある', '#片思い女子']],
    ['告白', ['#告白のタイミング', '#告白が成功する方法', '#恋愛相談']],
    ['失恋', ['#失恋した', '#失恋から立ち直る', '#失恋あるある']],
    ['別れ', ['#別れた後', '#別れを乗り越える', '#失恋あるある']],
    ['復縁', ['#復縁したい', '#復縁できる人の特徴', '#元彼が忘れられない']],
    ['浮気', ['#浮気のサイン', '#浮気を疑うとき', '#恋愛の悩み']],
    ['嫉妬', ['#やきもち', '#嫉妬する心理', '#好きな人への独占欲']],
    ['不安', ['#恋愛の不安', '#恋愛不安あるある', '#好きな人への不安']],
    ['依存', ['#恋愛依存', '#手放せない恋', '#執着をやめたい']],
    ['男性心理', ['#男性心理', '#男の本音', '#男が好きな人にする行動']],
    ['男の本音', ['#男の本音', '#男性心理', '#好きな人への本音']],
    ['女性心理', ['#女性心理', '#女の本音', '#女が求める恋愛']],
    ['自己肯定', ['#自己肯定感', '#自分を好きになる', '#自分磨き']],
    ['追いかけ', ['#追いかける恋', '#追われる女になる', '#恋愛の駆け引き']],
    ['デート', ['#デートあるある', '#デートで失敗しない', '#好きな人とのデート']],
    ['気持ち', ['#あの人の気持ち', '#好きな人の気持ち', '#恋愛の悩み']],
    ['気になる', ['#気になる人', '#好きな人ができた', '#片思い中']],
    ['分からない', ['#好きな人の気持ちが分からない', '#脈ありなのか', '#恋愛相談']],
    ['連絡が減', ['#急に連絡が減った', '#返信が来ない理由', '#恋愛の不安']],
    ['マッチング', ['#マッチングアプリあるある', '#マッチングの本音', '#恋活']],
    ['婚活', ['#婚活あるある', '#婚活の本音', '#結婚したい']],
    ['年上', ['#年上好き', '#年の差恋愛', '#大人の恋愛']],
    ['職場', ['#職場恋愛', '#社内恋愛あるある', '#職場の好きな人']],
  ];

  // キーワードにマッチしたタグを追加（優先度高）
  for (const [kw, tags] of keywordTagMap) {
    if (text.includes(kw)) {
      for (const tag of tags) {
        if (!result.includes(tag)) result.push(tag);
        if (result.length >= 5) break;
      }
      if (result.length >= 5) break;
    }
  }

  // ② 感情タグで補完（検索需要の高い感情ワード）
  const emotionTagMap: Record<EmotionType, string[]> = {
    '共感':      ['#恋愛あるある', '#共感した人いる？', '#片思いあるある'],
    '恋愛不安':  ['#恋愛の不安', '#好きな人への不安', '#恋愛で不安になる'],
    '切なさ':    ['#切ない恋愛', '#届かない気持ち', '#片思いが辛い'],
    '後悔':      ['#恋愛の後悔', '#あの時に戻りたい', '#後悔しない恋愛'],
    '嫉妬':      ['#やきもち', '#独占欲が強い', '#嫉妬する恋愛'],
    '孤独':      ['#恋愛で孤独', '#一人で抱える恋愛', '#誰にも言えない恋'],
    '依存':      ['#恋愛依存', '#執着をやめたい', '#手放せない恋'],
    '片思い':    ['#片思い中', '#片思いあるある', '#好きな人ができた'],
    '復縁願望':  ['#復縁したい', '#元彼が忘れられない', '#やり直したい恋'],
    '失恋':      ['#失恋した', '#失恋あるある', '#失恋から立ち直る'],
    '期待':      ['#脈ありかも', '#もしかして好かれてる？', '#恋愛のドキドキ'],
    '安心感':    ['#好きな人と両想い', '#幸せな恋愛', '#大切にされてる'],
    '自己肯定感':['#自分を好きになる', '#自己肯定感を上げる', '#自分磨き恋愛'],
    '驚き':      ['#知らなかった恋愛の話', '#恋愛の真実', '#衝撃の恋愛あるある'],
  };

  const eTags = emotionTagMap[emotion] ?? ['#恋愛の悩み', '#片思いあるある'];
  for (const tag of eTags) {
    if (!result.includes(tag) && result.length < 5) result.push(tag);
  }

  // ③ 投稿タイプ補完タグ（検索需要重視）
  const postTypeTags: Record<PostType, string> = {
    '共感型':     '#恋愛あるある',
    '衝撃型':     '#知らなかった恋愛の真実',
    '切ない型':   '#切ない恋愛の話',
    '恋愛依存型': '#恋愛依存あるある',
    '暴露型':     '#恋愛の本音',
    '心理学型':   '#男性心理を読む',
    'ストーリー型':'#実話の恋愛エピソード',
  };
  const ptTag = postTypeTags[postType];
  if (!result.includes(ptTag) && result.length < 5) result.push(ptTag);

  // 必ず5個
  const fallbacks = ['#恋愛の悩み', '#好きな人への気持ち', '#恋愛相談', '#片思い中', '#恋愛がつらい'];
  for (const fb of fallbacks) {
    if (!result.includes(fb) && result.length < 5) result.push(fb);
  }

  return result.slice(0, 5);
}

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
  // ① 格言・CTAの文字数を事前計算し本文の目標文字数を決定
  const quote = generateQuote(emotion);
  const quoteChars = countTextChars('\n\n' + quote);
  const ctaChars = tiktokCta ? countTextChars('\n\n' + tiktokCta) : 0;
  const bodyTarget = tiktokLength - quoteChars - ctaChars;

  // ② 元記事を行単位で処理
  let base = articleText.trim();

  // 元記事がbodyTargetを超えている場合は行単位で削る
  if (countTextChars(base) > bodyTarget + 50) {
    const lines = base.split('\n').filter(l => l.trim());
    let truncated = '';
    for (const line of lines) {
      const candidate = truncated ? truncated + '\n' + line : line;
      if (countTextChars(candidate) <= bodyTarget) {
        truncated = candidate;
      } else {
        break;
      }
    }
    base = truncated || lines[0] || base;
  }

  // ③ bodyTargetに達するまでフィラーを追加
  const fillers = [
    '\n\nこれを知っているだけで、恋愛の見え方が大きく変わります。焦らなくていい。自分のペースで進んでいきましょう。',
    '\n\n大切なのは相手の反応より、自分の気持ちに正直でいること。自分を大切にしている人は、自然と相手からも大切にされます。',
    '\n\n恋愛でうまくいかないときほど、自分を責めないでほしい。あなたは十分頑張っている。それだけで価値があります。',
    '\n\n今日から少しだけ、自分を優先してみてください。自分が満たされていると、不思議と恋愛もうまく回り始めます。',
    '\n\n完璧な人なんていない。傷ついた経験があるから、人の痛みがわかる。それがあなたの一番の強みになります。',
    '\n\n焦る気持ちはよくわかる。でも焦りは必ず相手に伝わってしまう。深呼吸して、今この瞬間だけに集中してみて。',
    '\n\n好きな人ができるたびに全力になれるあなたは、それだけ人を大切にできる証拠。その気持ちは絶対に報われます。',
    '\n\n恋愛は結果だけじゃない。その過程で気づいたこと、成長したこと、全部が意味を持っています。無駄な経験は一つもない。',
    '\n\n自分を好きになることが、全ての恋愛の基盤になります。今日一つだけ、自分を褒めることを忘れないでください。',
    '\n\nどんな結果になっても、あなたの価値は変わらない。相手の反応で自分を測ることをやめると、恋愛が急に楽になります。',
    '\n\n恋愛で一番大切なのは自己肯定感です。自分を好きでいられる人は、どんな恋愛でも前向きに進めます。',
    '\n\n相手のことを考えすぎるとき、少しだけ自分のことを考えてみてください。あなたの気持ちも同じくらい大切です。',
    '\n\n一人でずっと抱えてきた気持ち、誰かに話せるだけで少し楽になります。あなたは一人じゃないから。',
    '\n\n恋愛がうまくいかないと感じるとき、それは次のステージへの準備期間かもしれません。焦らず待てる人が最後に笑います。',
    '\n\n好きな人の前では自然体でいることが一番の武器になります。作った自分より本当の自分の方が、ずっと魅力的に映ります。',
    '\n\n恋愛の悩みはつきないけれど、悩める自分を責めないで。悩むのは本気だから。その真剣さが必ず伝わる日が来ます。',
    '\n\n返信が遅くても、あなたの価値は変わらない。既読スルーされても、あなたはちゃんと素敵なんだから。',
    '\n\nうまくいかない恋愛ほど、自分と向き合う時間をくれる。その時間を無駄にしないで。必ず次に活かされるから。',
    '\n\n好きな気持ちは本物。それだけは絶対に間違いない。その気持ちを大切にしながら、自分のことも同じくらい大切にしてほしい。',
    '\n\n恋愛で傷ついた経験は、誰かの痛みに寄り添える力になります。あなたの経験は無駄じゃない。',
  ];

  let i = 0;
  while (countTextChars(base) < bodyTarget && i < fillers.length) {
    base += fillers[i++];
  }
  if (countTextChars(base) < bodyTarget) {
    base += '\n\n今日もあなたの恋愛が少しでも楽になりますように。自分を大切に、自分のペースで進んでいきましょう。';
  }

  // ④ 格言追加
  base += '\n\n' + quote;

  // ⑤ 難読漢字置換
  base = fixTikTokReading(base);

  // ⑥ CTA付与
  if (tiktokCta) base += '\n\n' + tiktokCta;

  // ⑦ TikTok改行処理
  return addTikTokLineBreaks(base);
}

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

  // Threads：300文字以内に収める
  const THREADS_MAX = 300;
  const threadsSuffix = (ctaSuffix ? '\n\n' + ctaSuffix : '') + '\n\n' + hashtagText;
  let threadsBody = basePost;
  if ((threadsBody + threadsSuffix).length > THREADS_MAX) {
    const bodyMax = THREADS_MAX - threadsSuffix.length - 3;
    const bodyLines = basePost.split('\n').filter((l: string) => l.trim());
    let truncated = '';
    for (const line of bodyLines) {
      const candidate = truncated ? truncated + '\n' + line : line;
      if (candidate.length <= bodyMax) truncated = candidate;
      else break;
    }
    threadsBody = truncated || basePost.slice(0, bodyMax) + '…';
  }
  const threads = threadsBody + threadsSuffix;

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
  const rawHook = extractHook(text);

  // メインテキストを5〜8文字の短いフレーズに変換
  const shortText = (() => {
    // 句読点・助詞で分割して短いフレーズを抽出
    const cleaned = rawHook.replace(/[。、！？「」]/g, '').trim();
    // 8文字以内ならそのまま使用
    if (cleaned.length <= 8) return cleaned;
    // キーワードを抽出して短縮
    const keywords: [string, string][] = [
      ['距離を取る', '急に冷たい理由'], ['急に冷たい', '急に冷たい理由'],
      ['返信が遅い', '返信が遅い理由'], ['既読スルー', '既読スルーの真実'],
      ['脈あり', '本命だけの行動'], ['本命', '本命だけの行動'],
      ['好きな人', '好きな人への本音'], ['片思い', '片思いの終わらせ方'],
      ['失恋', '失恋から立ち直る'], ['復縁', '復縁できる理由'],
      ['男性心理', '男の本音'], ['女性心理', '女の本音'],
      ['LINE', 'LINEでわかる本音'], ['不安', '不安を消す方法'],
      ['嫌われ', '嫌われた理由'], ['冷める', '冷める瞬間'],
      ['告白', '告白が成功する理由'], ['デート', 'デートで差がつく'],
      ['浮気', '浮気のサイン'], ['依存', '依存を断ち切る'],
    ];
    const matched = keywords.find(([kw]) => rawHook.includes(kw));
    if (matched) return matched[1];
    // マッチしない場合は先頭8文字
    return cleaned.slice(0, 8);
  })();

  const colorMap: Record<PostType, string> = {
    '共感型': 'ソフトピンク・ラベンダー系（明るく温かみのあるトーン）',
    '衝撃型': 'ビビッドレッド・オレンジ系（明るく鮮やか、ホラー風は禁止）',
    '切ない型': 'ライトブルー・パープル系（暗くなりすぎず柔らかい色調）',
    '恋愛依存型': 'ウォームピンク・パープル系（明るく感情的なトーン）',
    '暴露型': 'ゴールド・ホワイト系（高級感と視認性重視）',
    '心理学型': 'ネイビー・ライトグレー系（知的で清潔感あり）',
    'ストーリー型': 'ウォームベージュ・ピンク系（温かく共感を呼ぶトーン）',
  };

  return [
    '【TikTok画像生成指示文】',
    'サイズ：1080 × 1920px（縦型 9:16）',
    '',
    '■ メインテキスト（5〜8文字・画面中央に大きく配置）',
    '「' + shortText + '」',
    '・画面全体の50〜60％を文字が占めるサイズ',
    '・スマホ一覧画面でも瞬時に読める大きさ',
    '・1〜2行以内に収める',
    '・太字・縁取りあり・視認性最優先',
    '',
    '■ デザイン・明るさ',
    '・配色：' + colorMap[postType],
    '・明るさ：通常より＋10〜20％明るく設定',
    '・暗すぎる表現は禁止・ホラー風演出は禁止',
    '・柔らかく自然光が入る明るい雰囲気を優先',
    '・恋愛・共感・切なさが伝わる温かいトーン',
    '',
    '■ 最終優先順位',
    '①文字の視認性　②記事内容との一致　③人物表情　④デザイン性',
    'スクロール停止率を最優先とすること',
    '',
    '■ 感情：' + emotion + ' / ' + postType,
  ].join('\n');
}

function generateThumbnailTikTokPerson(text: string, emotion: EmotionType, postType: PostType): string {
  // 記事の冒頭テーマを抽出
  const firstLine = text.split('\n').filter(l => l.trim().length > 5)[0]?.trim().slice(0, 40) ?? '';

  // 背景を記事内容から決定
  const bgCandidates: [string, string][] = [
    ['夜', '夜の薄暗い部屋。スマホの画面の青白い光が顔を照らす'],
    ['朝', '朝日が差し込む明るい部屋。清々しく希望を感じる光'],
    ['カフェ', '昼下がりの太陽の光が差し込むおしゃれなカフェのテラス席。背景に満開の花々が咲く明るい庭園'],
    ['公園', '緑豊かな公園。やわらかい自然光。木漏れ日'],
    ['海', '海辺。水平線が広がる開放的な背景。爽やかな青空'],
    ['雨', '雨の日。窓に水滴。室内から外を見るような雰囲気'],
    ['夕暮れ', '夕暮れの空。オレンジと紫のグラデーション。感傷的な雰囲気'],
    ['失恋', '明るい背景に一人でいる女性。順調だった頃を思い出すような柔らかい光'],
    ['復縁', '夕暮れの街。または思い出の場所を想起させる空間'],
    ['告白', '夕暮れの公園または校舎前。ドキドキ感のある空間'],
    ['デート', '昼下がりのおしゃれなカフェテラス。満開の花々が咲く華やかな背景'],
    ['初デート', '明るいカフェまたは街中。花が咲く明るく華やかな背景'],
    ['LINE', '夜の部屋。スマホの画面の光だけが顔を照らす'],
    ['返信', '昼下がりの太陽の光が差し込む明るいカフェテラス。花々が咲く華やかな庭園（楽しかった頃を描くコントラスト演出）'],
    ['沈黙', '昼下がりの太陽の光がたっぷりと差し込むカフェテラス。満開の桜や色鮮やかな花々が咲き誇る庭園（「順調だった頃」として明るく描きコントラストを演出）'],
    ['突然', '昼下がりの明るいカフェテラス。花々が咲く華やかな背景（幸せだった頃を描くコントラスト演出）'],
    ['順調', '昼下がりの太陽の光が差し込む明るいカフェ。満開の花々と木漏れ日。ラブラブだった頃の幸せな雰囲気'],
    ['冷たく', '昼下がりの明るい公園またはカフェテラス。温かみのある自然光と花々'],
    ['連絡が減', '昼下がりのおしゃれなカフェテラス。花々が咲く华やかな背景。楽しかった頃を描く'],
  ];
  const matchedBg = bgCandidates.find(([kw]) => text.includes(kw));

  // 全デフォルト背景を明るく華やかに統一
  const background = matchedBg ? matchedBg[1]
    : '昼下がりの太陽の光がたっぷりと差し込むおしゃれなカフェのテラス席。背景には満開の桜や色鮮やかな花々（バラ・チューリップ・ラベンダー）が咲き誇る明るい庭園。木漏れ日が柔らかく注ぎ楽しいひとときを過ごす雰囲気。光の粒子と花びらが舞う華やかな演出';

  // ポーズを記事内容から決定
  const poseCandidates: [string, string][] = [
    ['LINE', 'スマホを両手で持ち、画面を見て笑顔になっているポーズ'],
    ['返信', '彼氏（見切れている）と一緒にスマホの画面を見せ合い、大笑いしている瞬間。彼氏の手だけが端に写っている'],
    ['告白', '胸の前で両手を組み、緊張しながら明るく微笑むポーズ'],
    ['失恋', '前を向いて歩き出す、希望を感じる自然なポーズ'],
    ['デート', '彼氏（見切れている）と手を繋ぎ、楽しそうにスマホを見せ合うポーズ'],
    ['初デート', '鏡の前で服装を確認しながら、ワクワクした笑顔のポーズ'],
  ];
  const matchedPose = poseCandidates.find(([kw]) => text.includes(kw));
  const pose = matchedPose ? matchedPose[1]
    : '彼氏（見切れている）と手を繋ぎ、楽しそうにスマホの画面を見せ合っているポーズ。もう片方の手でスマホを持ち、一緒に画面を見て大笑いしている瞬間。彼氏の手だけが画面の端に写っている';

  // 表情
  const expressionMap: Record<EmotionType, string> = {
    '共感': '心から楽しそうに笑っている満面の笑み。目がキラキラと輝き幸せそうな表情',
    '恋愛不安': '心から楽しそうに笑っている満面の笑み（不安な記事内容でも「幸せだった頃」として明るく描く）',
    '切なさ': 'やわらかく微笑む、切ないけれど美しい表情。目が少し潤んでいる',
    '後悔': '前を向いて微笑む、強さを感じる表情',
    '嫉妬': '少しいたずらっぽく微笑む、可愛らしい表情',
    '孤独': '心から楽しそうに笑っている満面の笑み（コントラスト演出）',
    '依存': 'やわらかく幸せそうに微笑む表情',
    '片思い': 'ぼんやりと微笑みながら夢見るような表情。頬に手を当てている',
    '復縁願望': 'やわらかく微笑む、希望を感じる表情',
    '失恋': '前を向いて明るく微笑む、立ち直りを感じる表情',
    '期待': '心から楽しそうに笑っている満面の笑み。目がキラキラと輝いている',
    '安心感': 'ほっとしたような温かい笑顔。目が細くなっている',
    '自己肯定感': '自信に満ちた堂々とした笑顔。背筋がまっすぐ',
    '驚き': '目を大きく開けた、驚きと嬉しさが混ざった明るい表情',
  };

  // 服装
  const outfit = emotion === '期待' || emotion === '安心感'
    ? '明るいパステルカラー（ベビーピンク・ライトブルー・ホワイト）の可愛らしいワンピース'
    : emotion === '自己肯定感'
    ? 'きれいめカジュアル。清潔感と自信を感じる明るい服装'
    : '明るいパステルカラー（ベビーピンク・ライトブルー・ホワイト）の可愛らしいワンピースやカジュアルスタイル';

  const hairStyle = 'ミディアム〜ロングのゆるふわヘア。明るいブラウンまたは柔らかなグレージュ';

  return [
    '【TikTok人物画像生成指示文】',
    'サイズ：1080 × 1920px（縦型 9:16）/ CapCutテンプレート用',
    '',
    '■ 記事テーマ（この内容に合わせた画像を生成）',
    '「' + firstLine + '」',
    '',
    '■ 背景・シチュエーション',
    background,
    '',
    '■ 人物設定',
    '・日本人女性（20代〜30代）',
    '・' + outfit,
    '・' + hairStyle,
    '',
    '■ 表情',
    '・' + (expressionMap[emotion] ?? '心から楽しそうに笑っている満面の笑み'),
    '',
    '■ ポーズ',
    '・' + pose,
    '',
    '■ 構図（CapCut最適化）',
    '・人物は画面の中央または左側に配置',
    '・中央〜上部にテキストを配置できるスペースを確保',
    '・上部20%・下部20%はテキスト用に空けること',
    '・背景の花や光の粒子をテキストエリア周辺に効果的に配置',
    '',
    '■ 追加指示',
    '・背景は太陽の光と鮮やかな花々で画面全体を明るく満たすこと。暗い部分は一切作らないこと',
    '・光の粒子・花びら・小さなハートなどの演出をテキストの邪魔にならないように背景に加えること',
    '・明るさは通常より＋10〜20％向上させること',
    '・ホラー風・暗すぎる表現は禁止',
    '',
    '■ 感情トーン：' + emotion,
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
// SEOハッシュタグ生成（note検索・Google検索最適化・10〜15個）
// ============================================================
function generateBuzzSeoHashtags(text: string, emotion: EmotionType, postType: PostType): string[] {
  const tags: string[] = [];

  // 記事内容からキーワード抽出
  const kwMap: Record<string, string[]> = {
    '返信': ['#LINE返信', '#既読スルー'],
    'LINE': ['#LINEあるある', '#LINE恋愛'],
    '片思い': ['#片思い', '#片思い中', '#片思いあるある'],
    '復縁': ['#復縁', '#復縁したい', '#元彼'],
    '失恋': ['#失恋', '#失恋した', '#失恋からの立ち直り'],
    '婚活': ['#婚活', '#婚活女子', '#婚活あるある'],
    '浮気': ['#浮気', '#浮気された'],
    '依存': ['#恋愛依存', '#恋愛依存症'],
    '不安': ['#恋愛不安', '#好きな人への不安'],
    '自己肯定': ['#自己肯定感', '#自己肯定感を上げる'],
  };

  for (const [kw, kwTags] of Object.entries(kwMap)) {
    if (text.includes(kw)) tags.push(...kwTags);
  }

  // 感情タイプ別タグ
  const emotionTagMap: Partial<Record<EmotionType, string[]>> = {
    '共感':      ['#恋愛あるある', '#共感する恋愛'],
    '恋愛不安':  ['#恋愛不安', '#好きな人が怖い', '#恋愛の悩み'],
    '切なさ':    ['#切ない恋愛', '#切ない', '#恋愛コラム'],
    '後悔':      ['#後悔しない恋愛', '#恋愛の後悔'],
    '依存':      ['#恋愛依存', '#手放せない恋愛'],
    '片思い':    ['#片思い', '#片思い中', '#告白できない'],
    '失恋':      ['#失恋', '#失恋乗り越え', '#失恋からの復活'],
    '自己肯定感': ['#自己肯定感', '#自分を好きになる'],
  };
  const eTags = emotionTagMap[emotion] ?? ['#恋愛コラム', '#恋愛の悩み'];
  tags.push(...eTags);

  // 必須SEOタグ
  const baseTags = [
    '#恋愛', '#恋愛心理学', '#男性心理', '#女性心理',
    '#恋愛相談', '#大人の恋愛', '#恋愛テクニック',
    '#恋愛成就', '#婚活', '#自己肯定感',
  ];
  tags.push(...baseTags);

  // 重複除去・15個に絞る
  return [...new Set(tags)].slice(0, 15);
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

  // SEOハッシュタグ生成
  const seoHashtags = generateBuzzSeoHashtags(articleText, emotion, postType);

  return {
    postText: postTextFormatted,
    tiktokArticle,
    seoHashtags,
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

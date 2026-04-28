import type {
  GenerateInput,
  GeneratedPost,
  Platform,
  TrendIdea,
  InsertPosition,
  TiktokInsertPosition
} from '../types';

const FIXED_HASHTAGS: Record<Platform, string[]> = {
  TikTok: ['#TikTok', '#おすすめ', '#おすすめにのりたい', '#バズりたい'],
  X: ['#拡散希望', '#話題', '#注目'],
  note: ['#note', '#発信', '#コンテンツ販売'],
  Instagram: ['#Instagram', '#インスタ運用', '#投稿作成'],
  YouTube: ['#YouTube', '#動画投稿', '#ショート動画']
};

const THEME_TAGS: Record<string, string[]> = {
  恋愛: ['#恋愛', '#恋愛心理', '#好きな人'],
  告白: ['#告白', '#告白成功', '#告白したい'],
  復縁: ['#復縁', '#復縁したい', '#復縁コツ'],
  片想い: ['#片想い', '#恋愛', '#好きな人'],
  脈あり: ['#脈あり', '#恋愛心理', '#好意サイン'],
  脈なし: ['#脈なし', '#恋愛相談', '#逆転恋愛'],
  浮気: ['#浮気', '#恋愛', '#恋愛相談'],
  恋愛心理: ['#恋愛心理', '#恋愛', '#心理学'],
  美容: ['#美容', '#垢抜け', '#自分磨き'],
  副業: ['#副業', '#在宅ワーク', '#お金'],
  集客: ['#集客', '#マーケティング', '#売れる導線'],
  ダイエット: ['#ダイエット', '#痩せる習慣', '#食事改善'],
  SNS運用: ['#SNS運用', '#投稿ネタ', '#バズ投稿'],
  占い: ['#占い', '#運勢', '#恋愛占い']
};

type ThemeScenario = {
  title: string;
  hook: string;
  issue: string;
  wrong: string;
  truth: string;
  points: string[];
  conclusion: string;
  warning?: string;
  action: string;
};

function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function rand<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function normalizeTheme(theme: string): string {
  return theme.trim() || '恋愛';
}

function normalizeTarget(target: string): string {
  return target.trim() || '初心者';
}

function detectThemeKey(theme: string): string {
  const normalized = normalizeTheme(theme);
  const keys = [
    '恋愛心理', '脈あり', '脈なし', '片想い', '告白', '復縁', '浮気',
    '恋愛', '美容', '副業', '集客', 'ダイエット', 'SNS運用', '占い'
  ];
  for (const key of keys) {
    if (normalized.includes(key)) return key;
  }
  return normalized;
}

function buildHashtags(platform: Platform, input: GenerateInput): string[] {
  if (!input.includeHashtags || input.hashtagMode === 'none') return [];
  const themeKey = detectThemeKey(input.theme);
  const themeTags = THEME_TAGS[themeKey] ?? ['#投稿', '#発信', '#伸びる投稿'];
  const fixed = input.includeFixedHashtags ? FIXED_HASHTAGS[platform] : [];
  return Array.from(new Set([...themeTags, ...fixed])).slice(0, platform === 'TikTok' ? 6 : 5);
}

function targetChars(lengthMode: GenerateInput['lengthMode'], platform: Platform): number {
  if (platform === 'TikTok') return lengthMode;
  if (platform === 'X') return Math.min(lengthMode, 500);
  if (platform === 'note') {
    if (lengthMode === 100) return 700;
    if (lengthMode === 200) return 1200;
    if (lengthMode === 300) return 1800;
    if (lengthMode === 400) return 2400;
    return 3200;
  }
  return lengthMode;
}

function trimToChars(text: string, maxChars: number): string {
  if (text.length <= maxChars) return text;
  return text.slice(0, Math.max(0, maxChars - 1)).trimEnd() + '…';
}

function buildThemeScenarios(themeKey: string, target: string): ThemeScenario[] {
  switch (themeKey) {

    case '片想い':
      return [
        {
          title: '片想い中の人、これやってたら終わりです',
          hook: 'ちょっと待ってください\n\n好きな人のことを\n考えすぎて\n\n毎日LINEを\nチェックしていませんか？',
          issue: 'それ、相手には\n全部バレてます',
          wrong: '片想いが長引く人の\nほとんどが\n\n「積極性が足りない」\nと思っています\n\nでも違います',
          truth: '本当の原因は\n「存在感の薄さ」\nではなく\n\n「追いかけすぎ」\nです',
          points: [
            '既読してもすぐ返信しない\n（3時間は待つ）',
            '会話を自分から終わらせる\n（惜しいところで切る）',
            '相手のSNSに\n毎回いいねしない'
          ],
          conclusion: '引いた瞬間に\n相手は気になり始めます\n\nこれが片想いの\n逆転法則です',
          action: `${target}ほど追いかけやすいので\nまず3日だけ引いてみてください`
        },
        {
          title: '片想いが長い人の99%がやってるミス',
          hook: 'ちょっと聞いてください\n\n好きな人ができて\n半年以上経つのに\n\n何も進んでいない\n\nそんな人いませんか？',
          issue: '実はそれ\n好きな気持ちの問題じゃ\nありません',
          wrong: '頑張っているのに\n進まない理由は\n\n「タイミングのズレ」\nです',
          truth: '相手が一番\n気になるタイミングは\n\n「ちょっと連絡が\nなかった後」\nです',
          points: [
            '2〜3日あえて連絡しない',
            '久しぶりに連絡するとき\nは用件を一つだけにする',
            '会った後すぐLINEせず\n翌日に送る'
          ],
          conclusion: '片想いは\n熱量を上げるより\n\n温度差を作る方が\n10倍早く動きます',
          action: `まず今週\n連絡の頻度を半分にしてみてください`
        },
        {
          title: '好きな人に意識させる方法、これだけでいい',
          hook: 'これ知ってますか\n\n好きな人に\n「意識される人」と\n\n「友達止まりの人」の\n差は一つだけです',
          issue: '外見でも\nコミュ力でもなく\n\n「去り際」\nです',
          wrong: '多くの人は\n「もっと話さなきゃ」\nと思っています\n\nでも逆効果です',
          truth: '人は\n「もっと話したかった」\nと思った相手のことを\n\n一番引きずります',
          points: [
            '会話が盛り上がった\nところで先に終わらせる',
            '帰り際に笑顔だけ残して\n振り返らない',
            'LINEは返信が来たら\n少し間を置いてから返す'
          ],
          conclusion: '引き際の上手さが\n一番の武器です\n\n今日から試してください',
          action: `次に会ったとき\n楽しい場面で先に「じゃあそろそろ」と言ってみてください`
        }
      ];

    case '告白':
      return [
        {
          title: '告白する前にこれやらないと絶対後悔します',
          hook: 'ちょっと待って\n\n今すぐ告白しようと\n思っていませんか？\n\n少しだけ聞いてください',
          issue: '告白が失敗する理由の\n9割は\n\n「タイミング」\nではありません',
          wrong: 'みんな\nタイミングや\n言葉を考えますが\n\n本当の問題は別にあります',
          truth: '告白が通る人は\n伝える前に\n\n「受け取られる準備」\nをしています',
          points: [
            '最後に会った時の\n印象が「楽しかった」\nになっているか確認',
            '告白の前日は\n連絡を軽くしておく\n（重くしない）',
            '告白する場所は\n二人きりの自然な流れで\n（わざとらしくしない）'
          ],
          conclusion: '告白は勝負じゃなくて\n確認です\n\n準備ができていれば\n結果は自然についてきます',
          action: `まず最後に会った時の\n印象を思い出してください`
        },
        {
          title: '告白の成功率を3倍にする方法',
          hook: '告白って\nなんで緊張するか\n知ってますか\n\n答えは簡単です\n\n「相手の気持ちが\nわからないから」\nです',
          issue: 'でもそれ\n実は事前に\nほぼわかります',
          wrong: '「勇気を出せば大丈夫」\nは嘘です\n\n勇気と成功率は\n別の話です',
          truth: '告白が通る人は\n「YES」の確率を\n先に上げています',
          points: [
            '告白の2週間前から\nLINEの返信速度を見る\n（速くなってるか）',
            '二人で会う提案に\n相手が乗ってくるか確認',
            '話してる時に\n相手から質問が\n来ているか確認'
          ],
          conclusion: 'この3つが揃ってたら\n告白するタイミングです\n\n揃ってなければ\nまず関係を深めてください',
          action: `今すぐ3つ\nチェックしてみてください`
        }
      ];

    case '復縁':
      return [
        {
          title: '別れた後に送ってはいけないLINEがあります',
          hook: '別れた後\n何度もLINEを\n送っていませんか\n\n少しだけ聞いてください',
          issue: 'それ\n復縁を\n遠ざけています',
          wrong: '気持ちを伝えれば\nわかってもらえる\n\nそう思っている人ほど\n逆効果になっています',
          truth: '復縁できる人は\n別れた後\n\nしばらく\n「完全に消えます」',
          points: [
            '別れてから最低1ヶ月\n連絡しない',
            'SNSの更新は続けるが\n寂しさを出さない',
            '連絡再開は\n近況報告から始める\n（感情は出さない）'
          ],
          conclusion: '人は\nいなくなった時に\n初めて気づきます\n\n消えることが\n最大の戦略です',
          action: `まず今日から\n1ヶ月連絡しないことを\n決めてください`
        },
        {
          title: '復縁できる人とできない人の決定的な違い',
          hook: '復縁を\n目指している人に\n聞きたいことがあります\n\n今、相手を\n追いかけていますか？',
          issue: '追いかけている人の\n復縁成功率は\n\nほぼゼロです',
          wrong: '気持ちを伝え続ければ\n伝わると思っていませんか\n\n残念ながら逆効果です',
          truth: '復縁できる人は\n相手を追いかけるのを\nやめた瞬間から\n\n状況が変わり始めます',
          points: [
            '追うのをやめて\n自分を磨く期間を作る',
            '相手のSNSを\n見るのをやめる',
            '久しぶりの連絡は\n謝罪や感情ではなく\n明るい近況から始める'
          ],
          conclusion: '離れることで\n近づける\n\nこれが復縁の\n本質です',
          action: `今日から相手の\nSNSを見るのをやめてください`
        }
      ];

    case '脈あり':
      return [
        {
          title: 'これ全部脈ありのサインです、気づいてますか',
          hook: '好きな人の行動\n気になりすぎて\n眠れない夜\nありませんか\n\nそれ実は答え\nもう出てるかもしれません',
          issue: '脈ありのサインは\n「言葉」より先に\n「行動」に出ます',
          wrong: '「優しいだけ」\n「みんなにそうしてる」\n\nそう思って\n見逃している人\n多すぎます',
          truth: '本当に脈ありの人は\n無意識にやっています\n\nだから気づきにくい',
          points: [
            '会話中に\n自分から質問してくる\n（興味がある証拠）',
            'LINEの返信が\n会話を終わらせない形\n（続けたい証拠）',
            '二人きりの誘いに\n断らずに乗ってくる'
          ],
          conclusion: '3つ当てはまるなら\nかなり脈ありです\n\n動くタイミングです',
          action: `今すぐ\n3つ確認してみてください`
        }
      ];

    case '脈なし':
      return [
        {
          title: '脈なしから逆転した人がやっていたこと',
          hook: '脈なしだって\n諦めようとしている人\n\nちょっと待ってください',
          issue: '脈なしに見える状況の\nほとんどは\n\n「まだ意識されていない」\nだけです',
          wrong: '脈なし＝終わり\nではありません\n\n「まだ始まっていない」\nだけです',
          truth: '逆転できる人は\n追いかけるのをやめて\n\n「気になる存在」\nに変化します',
          points: [
            '急に連絡頻度を\n下げる',
            '次に会った時\n少し雰囲気を変える\n（外見・話し方）',
            '相手の話を\n聞きすぎない\n（自分の話もする）'
          ],
          conclusion: '変化した人を\n人は放置できません\n\n脈なしは\n戦略次第で変わります',
          action: `まず今日から\n連絡の頻度を\n半分に減らしてください`
        }
      ];

    case '浮気':
      return [
        {
          title: 'これ全部浮気のサインです',
          hook: 'ちょっと聞いてください\n\nなんとなく\n最近パートナーが\n変わった気がする\n\nそう感じていませんか？',
          issue: 'その違和感\n正直に言います\n\n当たっている可能性\n高いです',
          wrong: '浮気は\n派手な証拠より前に\n\n小さな変化から\n始まります',
          truth: '行動は嘘をつけません\n\n言葉より先に\n態度に出ます',
          points: [
            'スマホを\n見せなくなった\n（または裏向きにする）',
            '返信が遅くなったのに\nSNSは更新している',
            '帰りが遅くなったのに\n理由が曖昧'
          ],
          conclusion: '違和感は\n放置するほど\n深くなります\n\n感情より事実を\n先に整理してください',
          action: `まず冷静に\n事実だけを\n書き出してみてください`
        }
      ];

    case '恋愛心理':
      return [
        {
          title: '恋愛心理を知ってる人だけが得をしている',
          hook: '恋愛って\n気持ちだけじゃ\nうまくいかない\n\nそう感じたこと\nありませんか？',
          issue: '実は恋愛には\n感情より強い\n「心理の流れ」\nがあります',
          wrong: '好きだから\n全部話せばわかる\n\nそう思って\n重くなっている人\n多いです',
          truth: '人が誰かを\n好きになる順番は\n決まっています',
          points: [
            'まず「安心する人」\nになる',
            '次に「気になる人」\nになる',
            '最後に「失いたくない人」\nになる'
          ],
          conclusion: 'この順番を\n無視して結果を\n急ぐから\n\nうまくいかなくなります',
          action: `今の関係は\nどの段階か\n確認してみてください`
        }
      ];

    case '恋愛':
      return [
        {
          title: 'この行動してたら相手は確実に冷めてます',
          hook: '突然ですが\n確認してください\n\n最近こういうこと\nしていませんか？',
          issue: '恋愛が冷める原因は\n喧嘩より\n\n「小さな雑さ」\nの積み重ねです',
          wrong: '大きな問題が\nないから大丈夫\n\nそう思っていると\n気づいた時には遅いです',
          truth: '相手が冷める瞬間は\n声に出しません\n\n気づいたら\n終わっています',
          points: [
            'LINEの返信が\n雑になっていないか',
            '会う約束を\n後回しにしていないか',
            '話を\n最後まで聞いているか'
          ],
          conclusion: '当たり前のことを\n当たり前に続ける\n\nそれが一番難しくて\n一番大事です',
          action: `今日\n一つだけ\n直してみてください`
        },
        {
          title: '彼氏彼女が突然冷めた本当の理由',
          hook: 'パートナーが\n急に冷たくなった\n\nそんな経験\nありませんか？\n\n実は理由があります',
          issue: '突然に見えても\n実は前から\n\n小さなサインが\n出ていました',
          wrong: '原因がわからない\nのではなく\n\n見えていなかっただけ\nです',
          truth: '感情は\n言葉より先に\n行動に出ます\n\nそのサインを\n読めるかどうかです',
          points: [
            '返信の速さが\n変わっていなかったか',
            '会った後に\n満足そうだったか',
            '自分から話題を\n振ってきていたか'
          ],
          conclusion: '気づける人は\n問題が小さいうちに\n対処できます\n\n気づけない人は\n終わってから理解します',
          action: `パートナーの\n最近の行動を\n振り返ってみてください`
        }
      ];

    case '美容':
      return [
        {
          title: '垢抜けた人が最初にやめたこと',
          hook: 'ちょっと聞いてください\n\n垢抜けたいのに\n何をしたらいいか\nわからない\n\nそんな人いませんか？',
          issue: '垢抜けは\n足すより先に\n\n「やめること」\nから始まります',
          wrong: 'メイクを増やす\nスキンケアを足す\n\nでも実は\nそれより先にやることがあります',
          truth: '垢抜けた人は\n全員共通して\n\n3つのことを\nやめています',
          points: [
            'オーバーリップを\nやめた',
            'アイライナーを\n引きすぎるのをやめた',
            '眉毛を\n細くするのをやめた'
          ],
          conclusion: '引き算美容が\n今の正解です\n\n足す前に\nまず引いてください',
          action: `明日のメイクで\n一つだけ\nやめてみてください`
        }
      ];

    case '副業':
      return [
        {
          title: '副業で月5万稼いだ人がやっていたこと',
          hook: '副業を始めたいけど\n何から始めれば\nいいかわからない\n\nそんな人いませんか？',
          issue: '副業で稼げない人の\n9割は\n\n「選ぶものを\n間違えています」',
          wrong: '人気だから\nみんなやってるから\n\nそれで選ぶと\nほぼ失敗します',
          truth: '稼げる副業は\n自分のスキルと\n需要が重なる場所\nにあります',
          points: [
            '今の仕事で\n得意なことを書き出す',
            'それをお金に変えている\n人を探す',
            '真似できる形に\n変換する'
          ],
          conclusion: '遠回りに見えて\nこれが一番\n早い道です',
          action: `まず得意なことを\n3つ書き出してください`
        }
      ];

    case 'ダイエット':
      return [
        {
          title: 'ダイエットが続かない人の共通点',
          hook: 'ダイエットを\n何度も挫折している人\n\n少し聞いてください\n\n原因は意志の弱さ\nじゃないです',
          issue: '続かない理由は\n一つだけです\n\n「変化を感じられない\nから」です',
          wrong: '食事制限と運動を\n同時に始める人ほど\n\n2週間で止まります',
          truth: '続く人は\n最初の1週間で\n必ず「変化」を\n実感しています',
          points: [
            '最初の1週間は\n食事だけ変える\n（運動は後から）',
            '毎朝同じ時間に\n体重を測る',
            '1週間で\n500g減れば成功と決める'
          ],
          conclusion: '小さな変化を\n積み上げることが\n\n唯一続く方法です',
          action: `まず明日の朝から\n体重を測り始めてください`
        }
      ];

    case '占い':
      return [
        {
          title: '占いで人生が変わった人がやっていたこと',
          hook: '占いを信じている人に\n聞きたいことがあります\n\n占い結果を\n「確認」に使っていませんか？',
          issue: '占いで結果が出る人と\n出ない人の違いは\n\n使い方にあります',
          wrong: '占い結果を\nそのまま待つ人は\n\nほぼ変化しません',
          truth: '占いを活かす人は\n結果を「行動のヒント」\nとして使っています',
          points: [
            '結果を読んだ後\n「では今日何をするか」\nを決める',
            '苦手と出た日は\n新しい挑戦を避ける',
            '吉日を\n行動の背中押しに使う'
          ],
          conclusion: '占いは待つものじゃなく\n動くためのツールです',
          action: `今日の運勢を見て\n一つだけ行動を\n決めてください`
        }
      ];

    default:
      return [
        {
          title: `${themeKey}で結果が変わる人の共通点`,
          hook: 'ちょっと待ってください\n\n${themeKey}で\nうまくいかない人に\n\n共通点があります',
          issue: '原因は\n能力じゃありません\n\n「順番」です',
          wrong: '多くの人は\n量を増やそうとします\n\nでも違います',
          truth: '結果が出る人は\n最初に3つだけ\n意識しています',
          points: [
            '目的をはっきりさせる',
            '相手に伝わる形にする',
            '続けられる仕組みにする'
          ],
          conclusion: '順番を変えるだけで\n結果は変わります',
          action: `${target}なら\nまず一つ目だけ\n今日から始めてください`
        }
      ];
  }
}

function expandTikTokArticle(scenario: ThemeScenario, _target: string, lengthMode: GenerateInput['lengthMode']): string {
  const lines: string[] = [
    `【${scenario.title}】`,
    '',
    scenario.hook,
    '',
    scenario.issue,
    '',
    scenario.wrong,
    '',
    scenario.truth,
    '',
    'この3つを意識してください',
    ''
  ];

  scenario.points.forEach((point, i) => {
    lines.push(`${i + 1}つ目`);
    lines.push(point);
    lines.push('');
  });

  lines.push(scenario.conclusion, '', scenario.action);

  const base = lines.join('\n');
  return trimToChars(base, targetChars(lengthMode, 'TikTok'));
}

function applyPhraseToTikTok(text: string, phrase: string, position: TiktokInsertPosition): string {
  const clean = phrase.trim();
  if (!clean) return text;
  if (position === 'start') return `${clean}\n\n${text}`;
  if (position === 'end') return `${text}\n\n${clean}`;
  return `${clean}\n\n${text}\n\n${clean}`;
}

function buildNoteXInsertText(phrase: string, url: string): string {
  const lines = [phrase.trim(), url.trim()].filter(Boolean);
  return lines.join('\n');
}

function applyPhraseToText(body: string, phrase: string, url: string, position: InsertPosition): string {
  const insertText = buildNoteXInsertText(phrase, url);
  if (!insertText) return body;
  if (position === 'start') return `${insertText}\n\n${body}`;
  return `${body}\n\n${insertText}`;
}

function buildNoteBody(themeKey: string, input: GenerateInput): string {
  const target = normalizeTarget(input.target);
  const scenario = rand(buildThemeScenarios(themeKey, target));

  const paragraphs: string[] = [
    `■ ${scenario.title}`,
    '',
    scenario.hook.replace(/\n/g, ''),
    '',
    scenario.issue.replace(/\n/g, ''),
    '',
    scenario.wrong.replace(/\n/g, ''),
    '',
    scenario.truth.replace(/\n/g, ''),
    '',
    '具体的には次の3つが重要です。',
    '',
    ...scenario.points.map((p, i) => `【${i + 1}つ目】${p.replace(/\n/g, '')}`),
    '',
    scenario.conclusion.replace(/\n/g, ''),
    '',
    scenario.action.replace(/\n/g, ''),
    '',
    `もし今まで${themeKey}で思うような結果が出ていないなら、まずは今日お伝えした3つのポイントを一つずつ試してみてください。小さな変化が積み重なって、大きな結果につながります。`
  ];

  return trimToChars(paragraphs.join('\n'), targetChars(input.lengthMode, 'note'));
}

function buildXBody(themeKey: string, input: GenerateInput): string {
  const target = normalizeTarget(input.target);
  const scenario = rand(buildThemeScenarios(themeKey, target));

  const body = [
    `【${scenario.title}】`,
    '',
    scenario.issue.replace(/\n/g, ''),
    '',
    scenario.truth.replace(/\n/g, ''),
    '',
    scenario.points.map((p, i) => `${i + 1}. ${p.replace(/\n/g, '')}`).join('\n'),
    '',
    scenario.action.replace(/\n/g, '')
  ].join('\n');

  return trimToChars(body, targetChars(input.lengthMode, 'X'));
}

function buildBody(platform: Platform, input: GenerateInput): { title: string; content: string } {
  const themeKey = detectThemeKey(input.theme);
  const target = normalizeTarget(input.target);
  const scenario = rand(buildThemeScenarios(themeKey, target));

  if (platform === 'TikTok') {
    const tiktokContent = expandTikTokArticle(scenario, target, input.lengthMode);
    return {
      title: scenario.title,
      content: applyPhraseToTikTok(tiktokContent, input.tiktokPhrase, input.tiktokInsertPosition)
    };
  }

  if (platform === 'note') {
    const noteBody = buildNoteBody(themeKey, input);
    return {
      title: scenario.title,
      content: applyPhraseToText(noteBody, input.noteXPhrase, input.noteXUrl, input.noteXInsertPosition)
    };
  }

  if (platform === 'X') {
    const xBody = buildXBody(themeKey, input);
    return {
      title: scenario.title,
      content: applyPhraseToText(xBody, input.noteXPhrase, input.noteXUrl, input.noteXInsertPosition)
    };
  }

  const generic = `【${scenario.title}】\n\n${scenario.issue.replace(/\n/g,'')}\n\n${scenario.truth.replace(/\n/g,'')}\n\n${scenario.action.replace(/\n/g,'')}`;
  return {
    title: scenario.title,
    content: trimToChars(generic, targetChars(input.lengthMode, platform))
  };
}

function buildBuzzAnalysis(platform: Platform, input: GenerateInput, hashtags: string[]) {
  let hookPower = platform === 'TikTok' ? 94 : 80;
  let readability = input.lengthMode <= 200 ? 90 : input.lengthMode >= 500 ? 84 : 87;
  let curiosity = 92;
  let conversion = input.goal === 'sales' ? 89 : 83;

  if (input.ctaMode === 'strong') conversion += 3;
  if (input.includeUrgency) conversion += 3;
  if (hashtags.length >= 4) readability += 2;

  hookPower = Math.min(99, hookPower);
  readability = Math.min(99, readability);
  curiosity = Math.min(99, curiosity);
  conversion = Math.min(99, conversion);

  const score = Math.round((hookPower + readability + curiosity + conversion) / 4);

  return {
    score,
    hookPower,
    readability,
    curiosity,
    conversion,
    reason: [
      'バズるタイトルとテーマが一致しています',
      'フック → 共感 → 真実 → 行動の流れで構成しています',
      'テーマに特化した具体的なアドバイスを入れています'
    ]
  };
}

function buildSinglePost(platform: Platform, input: GenerateInput): GeneratedPost {
  const now = new Date().toISOString();
  const hashtags = buildHashtags(platform, input);
  const built = buildBody(platform, input);
  const buzzAnalysis = buildBuzzAnalysis(platform, input, hashtags);

  return {
    id: generateId(),
    platform,
    title: built.title,
    content: built.content,
    hashtags,
    theme: normalizeTheme(input.theme),
    target: normalizeTarget(input.target),
    gender: input.gender,
    buzzScore: buzzAnalysis.score,
    buzzAnalysis,
    createdAt: now,
    updatedAt: now,
    status: 'ready'
  };
}

export function generatePosts(input: GenerateInput): GeneratedPost[] {
  return input.platforms.map((platform) => buildSinglePost(platform, input));
}

export function generateTrendIdeas(theme: string, target: string): TrendIdea[] {
  const t = normalizeTheme(theme);
  const _g = normalizeTarget(target);

  return [
    {
      id: generateId(),
      angle: '警告系',
      title: `${t}中の人、これやってたら終わりです`,
      hook: `${t}でやってはいけない行動があります。`,
      reason: '警告フックは視聴停止率が下がりバズりやすい'
    },
    {
      id: generateId(),
      angle: '共通点系',
      title: `${t}が上手くいく人の共通点`,
      hook: `${t}で結果が出る人は全員これをやっています。`,
      reason: '共通点タイトルは好奇心を刺激する'
    },
    {
      id: generateId(),
      angle: '逆転系',
      title: `${t}で諦めないでください、逆転できます`,
      hook: `${t}がうまくいっていない人ほど見てください。`,
      reason: '希望訴求で感情移入しやすい'
    },
    {
      id: generateId(),
      angle: '数字系',
      title: `${t}の99%が知らないこと`,
      hook: `知ってる人だけが得をしている${t}の真実。`,
      reason: '数字入りタイトルはクリック率が高い'
    }
  ];
}

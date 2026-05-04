// X / Threads 文字数カウント（全角=2, 半角=1, 最大280ウェイト = 全角140文字相当）
const twitterWeightedLength = (text: string): number => {
  let n = 0;
  for (const c of text) {
    n += ((c.codePointAt(0) ?? 0) <= 0x10FF) ? 1 : 2;
  }
  return n;
};

const trimToTwitterLength = (text: string): string => {
  const MAX_WEIGHT = 280;
  let n = 0;
  let result = '';
  for (const c of text) {
    const w = ((c.codePointAt(0) ?? 0) <= 0x10FF) ? 1 : 2;
    if (n + w > MAX_WEIGHT) return result.trimEnd() + '…';
    n += w;
    result += c;
  }
  return result;
};

const getProfileLabel = (gender: string, age: string) => {
  const safeGender = gender === '指定なし' ? '' : gender;
  const safeAge = age === '指定なし' ? '' : age;
  return `${safeAge}${safeGender}`.trim() || '幅広い層';
};

const cleanTagText = (text: string) =>
  text.replace(/\s+/g, '').replace(/[^\p{L}\p{N}]/gu, '');

const uniqueTags = (tags: string[], count: number) =>
  Array.from(new Set(tags.filter(Boolean))).slice(0, count);

const TAG_DB: Record<string, string[]> = {
  復縁: ['#復縁', '#復縁したい', '#元彼', '#元カレ', '#元サヤ', '#復縁占い', '#復縁方法'],
  不倫: ['#不倫', '#秘密の恋', '#大人の恋愛', '#許されない恋', '#複雑愛', '#不倫の悩み', '#不倫占い'],
  片思い: ['#片思い', '#好きな人', '#恋愛成就', '#脈あり', '#告白', '#片思い占い', '#恋の悩み'],
  告白: ['#告白', '#告白成功', '#告白コツ', '#恋愛成就', '#好きな人', '#告白タイミング', '#恋愛心理'],
  本音: ['#本音', '#彼の本音', '#相手の気持ち', '#恋愛心理', '#本心', '#気持ちが知りたい', '#恋愛占い'],
  既読無視: ['#既読無視', '#連絡こない', '#恋愛の悩み', '#脈なし', '#恋愛心理', '#好きな人', '#既読スルー'],
  遠距離: ['#遠距離恋愛', '#会えない恋', '#恋愛の悩み', '#遠距離カップル', '#連絡頻度', '#恋愛成就'],
  相性: ['#相性', '#相性占い', '#運命の人', '#恋愛占い', '#恋愛運', '#カップル相性', '#相性診断'],
  ツインレイ: ['#ツインレイ', '#魂の片割れ', '#運命の人', '#スピリチュアル', '#恋愛占い', '#引き寄せ'],
  恋愛: ['#恋愛', '#恋愛占い', '#恋愛心理', '#恋愛成就', '#好きな人', '#本音', '#相性'],
};

const DEFAULT_THEME_TAGS = ['#恋愛', '#恋愛占い', '#恋愛心理', '#本音', '#相性', '#運命の人'];

const getThemeTags = (theme: string) => {
  const matched = Object.entries(TAG_DB).find(([key]) => theme.includes(key));
  const cleaned = cleanTagText(theme);

  if (matched) {
    return uniqueTags([`#${cleaned}`, ...matched[1]], 6);
  }

  return uniqueTags([`#${cleaned}`, ...DEFAULT_THEME_TAGS], 6);
};

const getTikTokHashtags = (theme: string) => {
  const fixed = ['#おすすめ', '#fyp'];
  const variable = getThemeTags(theme);
  return uniqueTags([...variable, ...fixed], 5);
};

const getXHashtags = (theme: string) => {
  const variable = getThemeTags(theme);
  return uniqueTags(variable, 3);
};

const getInstagramHashtags = (theme: string) => {
  const variable = getThemeTags(theme);
  const support = ['#恋愛', '#恋愛占い', '#恋愛心理', '#恋愛成就', '#好きな人', '#本音', '#相性', '#運命の人'];
  return uniqueTags([...variable, ...support], 10);
};

const getYouTubeHashtags = (theme: string) => {
  const variable = getThemeTags(theme);
  const support = ['#恋愛', '#占い', '#恋愛占い', '#相性', '#本音'];
  return uniqueTags([...variable, ...support], 5);
};

const getNoteHashtags = (theme: string) => {
  const variable = getThemeTags(theme);
  const support = ['#恋愛', '#占い', '#恋愛占い', '#恋愛心理', '#本音'];
  return uniqueTags([...variable, ...support], 5);
};

const buildTemplateBlock = (templateText: string, templateUrl: string) => {
  const text = templateText.trim();
  const url = templateUrl.trim();

  if (!text && !url) return '';
  if (text && url) return `${text}\n${url}`;
  return text || url;
};

const buildTextOnlyTemplateBlock = (templateText: string) => {
  return templateText.trim();
};

const insertBlock = (
  baseText: string,
  block: string,
  insertPosition: 'start' | 'end'
) => {
  if (!block) return baseText;

  return insertPosition === 'start'
    ? `${block}\n\n${baseText}`
    : `${baseText}\n\n${block}`;
};

const insertBlockAdvanced = (
  baseText: string,
  block: string,
  position: 'start' | 'end' | 'both'
) => {
  if (!block) return baseText;

  if (position === 'start') {
    return `${block}\n\n${baseText}`;
  }

  if (position === 'end') {
    return `${baseText}\n\n${block}`;
  }

  return `${block}\n\n${baseText}\n\n${block}`;
};

const trimByLength = (text: string, _length: string) => text;

const appendHashtags = (text: string, hashtags: string[], hashtagMode: 'あり' | 'なし') => {
  if (hashtagMode === 'なし') return text;
  if (!hashtags.length) return text;
  return `${text}\n\n${hashtags.join(' ')}`;
};

const RELATED_MAP: Record<string, string[]> = {
  片思い: ['脈あり脈なしの見分け方', '好きな人に意識させる方法', '告白のベストタイミング', '片思いを諦めるべきサイン', 'LINEで距離を縮める術'],
  復縁: ['別れた後の連絡タイミング', '元彼を後悔させる行動', '冷却期間の正しい過ごし方', '復縁できる人の共通点', '元彼の本音を知る方法'],
  告白: ['告白成功率を上げる準備', '告白後の関係の進め方', '告白を断られた後の行動', '告白前に確認すべきサイン', '告白で失敗する人の特徴'],
  好き避け: ['好き避けの見分け方', '好き避けする人への正しいアプローチ', '好き避けを終わらせる方法', '好き避けと脈なしの違い', '好き避けする心理'],
  脈あり: ['脈ありサインを見逃さない方法', '脈ありから告白へのステップ', '脈ありなのに進展しない理由', '男性の脈ありサイン3選', '女性の脈ありサイン3選'],
  復縁: ['別れた後の連絡タイミング', '元彼を後悔させる行動', '冷却期間の正しい過ごし方', '復縁できる人の共通点', '元彼の本音を知る方法'],
  不倫: ['不倫を終わらせる決断の仕方', '不倫相手の本音', '不倫から抜け出す方法', '不倫がバレる前にすべきこと', '不倫に依存してしまう理由'],
  縁切り: ['縁切りすべき人の特徴', '縁切り後の正しい過ごし方', '縁切りで後悔しないために', '縁切り神社が効く理由', '縁切りで運気が上がる'],
  恋愛運: ['恋愛運を上げる習慣', '恋愛運が下がっているサイン', '出会い運を引き寄せる方法', '恋愛運アップの開運行動', '恋愛運と生活習慣の関係'],
  相性: ['本当に相性がいい人の特徴', '相性診断で分かること', '相性が悪くても上手くいく方法', '血液型と恋愛相性の真実', '相性より大切なこと'],
  占い: ['占いで恋愛を引き寄せる方法', '占い結果を活かす行動術', '当たる占いの見分け方', '占いに頼りすぎてはいけない理由', '占い師が教える恋愛の真実'],
  美容: ['垢抜けに必要な3つのこと', 'スキンケアで失敗する原因', 'メイクで10歳若く見せる方法', '美容習慣で人生が変わる理由', 'プロが教える美肌の作り方'],
  副業: ['副業で月5万稼ぐ最短ルート', '副業初心者が避けるべき失敗', 'SNSで稼ぐ人の共通点', '副業を本業にするタイミング', '稼げる副業と稼げない副業の差'],
  ダイエット: ['ダイエットが続かない本当の理由', '食事改善で-3kgする方法', 'リバウンドしない痩せ方', '運動なしで痩せる習慣', 'ダイエット成功者の共通点'],
  SNS運用: ['フォロワーが増える投稿の法則', 'バズる投稿の構成パターン', 'SNSで売上を作る導線設計', 'プロフィール改善で変わること', 'ストーリーズ活用術'],
};

export function generateRelatedThemes(theme: string): string[] {
  const t = theme.trim();
  if (!t) return [];

  for (const [key, themes] of Object.entries(RELATED_MAP)) {
    if (t.includes(key)) {
      return themes.slice(0, 5);
    }
  }

  return [
    `${t}で失敗する人の共通点`,
    `${t}で結果が変わる3つのこと`,
    `${t}でやってはいけないNG行動`,
    `${t}で成功する人だけが知っていること`,
    `${t}の真実を知っていますか`,
  ];
}

export const generateSNSPostContent = (
  theme: string,
  length: string,
  gender: string,
  age: string,
  templateText: string,
  templateUrl: string,
  tiktokTemplateText: string,
  insertPosition: 'start' | 'end',
  tiktokInsertPosition: 'start' | 'end' | 'both',
  hashtagMode: 'あり' | 'なし'
) => {
  const profile = getProfileLabel(gender, age);

  const noteHashtags = getNoteHashtags(theme);
  const tikTokHashtags = getTikTokHashtags(theme);
  const xHashtags = getXHashtags(theme);
  const instagramHashtags = getInstagramHashtags(theme);
  const youtubeHashtags = getYouTubeHashtags(theme);

  // テーマ別バズシナリオ
  type Scenario = { hook: string; title: string; p1: string; p2: string; p3: string; truth: string; cta: string; bridge: string; };
  const getScenario = (t: string): Scenario => {
    if (t.includes('片思い') || t.includes('片想い')) return {
      hook: `【片思い中の人、これやってたら終わりです】`,
      title: `片思い中の人、これやってたら終わりです`,
      p1: `返信が来たらすぐ既読・即返信\n（3時間は待つのが正解）`,
      p2: `相手のSNSに毎回いいね\n（頻度を落とすと気になられる）`,
      p3: `会話が盛り上がっても自分から終わらせない\n（惜しいところで切り上げる）`,
      truth: `引いた瞬間に相手は気になり始めます\nこれが片思いの逆転法則です`,
      cta: `${profile}ほど追いかけやすいので\nまず3日だけ引いてみてください`,
      bridge: `あなたと彼が本当に\n合っているのか気になる方は\nプロフィールから\n無料で相性を診断できます`,
    };
    if (t.includes('告白') || t.includes('告白タイミング')) return {
      hook: `【告白する前にこれやらないと絶対後悔します】`,
      title: `告白する前にこれやらないと絶対後悔します`,
      p1: `最後に会った時の印象が\n「楽しかった」になっているか確認`,
      p2: `告白の前日は連絡を軽くしておく\n（重くしない）`,
      p3: `二人きりの自然な流れで伝える\n（わざとらしくしない）`,
      truth: `告白は勝負じゃなくて確認です\n準備ができていれば結果は自然についてきます`,
      cta: `${profile}ほど答えを急ぎやすいので\n最後の印象を先に整えてください`,
      bridge: `告白する前に\n二人の本当の相性を\nプロフィールから\n無料で確認できます`,
    };
    if (t.includes('復縁') || t.includes('元カレ')) return {
      hook: `【別れた後に送ってはいけないLINEがあります】`,
      title: `別れた後に送ってはいけないLINEがあります`,
      p1: `別れてから最低1ヶ月連絡しない`,
      p2: `SNSの更新は続けるが\n寂しさを出さない`,
      p3: `連絡再開は近況報告から始める\n（感情は出さない）`,
      truth: `人はいなくなった時に初めて気づきます\n消えることが最大の戦略です`,
      cta: `${profile}ほど不安で動きたくなりますが\nまず今日から1ヶ月連絡しないことを決めてください`,
      bridge: `あの人との縁がまだあるか\nプロフィールから\n無料で相性診断してみてください`,
    };
    if (t.includes('好き避け')) return {
      hook: `【これ全部好き避けのサインです、見逃してませんか】`,
      title: `これ全部好き避けのサインです、見逃してませんか`,
      p1: `目が合うと逸らすのに\n話しかけてくる`,
      p2: `LINEの返信は遅いのに\n既読はすぐつく`,
      p3: `他の人には普通なのに\n自分にだけよそよそしい`,
      truth: `好き避けする人は\n本当は一番気にしています\nこれが一番伝わりにくい好意のサインです`,
      cta: `${profile}ほど相手の態度に悩みやすいので\n今すぐこの3つを確認してみてください`,
      bridge: `その人の本心と\nあなたとの相性を\nプロフィールから\n無料で診断できます`,
    };
    if (t.includes('連絡') || t.includes('連絡待ち')) return {
      hook: `【連絡が来ない本当の理由、知りたいですか】`,
      title: `連絡が来ない本当の理由、知りたいですか`,
      p1: `最後に会った時の空気が\n「重かった」可能性がある`,
      p2: `連絡の頻度が\n急に変化している`,
      p3: `自分からの連絡が\n続きすぎている`,
      truth: `連絡が来ない時は\n相手が冷めたのではなく\nペースが合っていないことが多いです`,
      cta: `${profile}ほど不安になりやすいので\n今日はあえて連絡しないことをおすすめします`,
      bridge: `二人の相性と\n今後どうなるかを\nプロフィールから\n無料で確かめてみてください`,
    };
    if (t.includes('彼の本音') || t.includes('本音')) return {
      hook: `【彼が本音を隠しているサインが実は3つあります】`,
      title: `彼が本音を隠しているサインが実は3つあります`,
      p1: `話している時に\n少し目を逸らす`,
      p2: `「大丈夫」を\n繰り返して使う`,
      p3: `話題をすぐ\n変えようとする`,
      truth: `本音を隠す人は\n言葉よりも行動に本心が出ます\n言葉より行動を見てください`,
      cta: `${profile}ほど言葉を信じやすいので\n今日から行動を見るようにしてください`,
      bridge: `彼の本当の気持ちと\nあなたへの本音を\nプロフィールから\n無料で診断できます`,
    };
    if (t.includes('相性')) return {
      hook: `【本当に相性がいい人に共通する3つのサイン】`,
      title: `本当に相性がいい人に共通する3つのサイン`,
      p1: `一緒にいると\n自然体でいられる`,
      p2: `沈黙が\n気まずくない`,
      p3: `価値観が違っても\n否定し合わない`,
      truth: `本当の相性は\nドキドキより\n「安心感」で決まります`,
      cta: `${profile}ほどドキドキを相性と勘違いしやすいので\n3つのサインを今すぐ確認してみてください`,
      bridge: `あなたと彼の\n本当の相性を\nプロフィールから\n無料で診断できます`,
    };
    if (t.includes('運命の人') || t.includes('運命鑑定') || t.includes('運命')) return {
      hook: `【運命の人に出会っているのに気づいていない人の特徴】`,
      title: `運命の人に出会っているのに気づいていない人の特徴`,
      p1: `初めて会った気がしない\n不思議な感覚があった`,
      p2: `一緒にいると\n時間を忘れる`,
      p3: `離れていても\n自然と繋がりが続く`,
      truth: `運命の人は\n強烈な引力より\n「自然な縁」で繋がっています`,
      cta: `${profile}ほど運命の人を見過ごしやすいので\n今すぐ3つ当てはまる人がいないか確認してみてください`,
      bridge: `その人が運命の人かどうか\nプロフィールから\n無料で相性を確かめてみてください`,
    };
    if (t.includes('不倫')) return {
      hook: `【不倫の恋、続けるべきか離れるべきか迷ってる人へ】`,
      title: `不倫の恋、続けるべきか離れるべきか迷ってる人へ`,
      p1: `感情と現実を\n分けて書き出す`,
      p2: `1年後の自分を\nリアルに想像する`,
      p3: `信頼できる人間ではなく\n自分だけで答えを出す`,
      truth: `誰かに相談しても\n答えは出ません\n自分の心が一番正直です`,
      cta: `${profile}ほど感情で判断しやすいので\n今日は事実だけを紙に書き出してみてください`,
      bridge: `あの人との縁の深さと\n本当の相性を\nプロフィールから\n無料で確かめてみてください`,
    };
    if (t.includes('縁切り') || t.includes('縁')) return {
      hook: `【縁を切るべき人には必ずこのサインが出ています】`,
      title: `縁を切るべき人には必ずこのサインが出ています`,
      p1: `一緒にいると\n疲れるのに離れられない`,
      p2: `その人のことを考えると\n不安になる`,
      p3: `会った後に\n自己嫌悪になる`,
      truth: `本当に必要な縁は\n一緒にいると\n自分らしくいられます`,
      cta: `${profile}ほど執着しやすいので\n今日は3つのサインを正直に確認してみてください`,
      bridge: `今の関係が縁があるものか\nプロフィールから\n無料で相性診断できます`,
    };
    if (t.includes('恋愛運')) return {
      hook: `【恋愛運が上がる直前に起きる3つの不思議な変化】`,
      title: `恋愛運が上がる直前に起きる3つの不思議な変化`,
      p1: `急に外見を\n気にしたくなる`,
      p2: `過去の恋愛を\n自然と手放せた`,
      p3: `新しい場所や人に\n興味が湧いてきた`,
      truth: `恋愛運が動く時は\n必ず内側から変化が始まります\nそのサインを見逃さないでください`,
      cta: `${profile}ほど外側の変化を待ちやすいので\n今すぐ3つ確認してみてください`,
      bridge: `今のあなたの恋愛運と\n気になるあの人との相性を\nプロフィールから\n無料で診断できます`,
    };
    if (t.includes('遠距離')) return {
      hook: `【遠距離恋愛がうまくいく人には共通点があります】`,
      title: `遠距離恋愛がうまくいく人には共通点があります`,
      p1: `連絡の頻度より\n質を大事にしている`,
      p2: `次に会う予定を\n常に決めている`,
      p3: `離れている時間を\n自分の成長に使っている`,
      truth: `遠距離は信頼貯金で\nできています\n不安より未来への投資を選んでください`,
      cta: `${profile}ほど不安になりやすいので\nまず次に会う予定を今日中に決めてください`,
      bridge: `二人の縁の深さと\n本当の相性を\nプロフィールから\n無料で確かめてみてください`,
    };
    if (t.includes('恋愛')) return {
      hook: `【この行動してたら相手は確実に冷めてます】`,
      title: `この行動してたら相手は確実に冷めてます`,
      p1: `LINEの返信が\n雑になっていないか`,
      p2: `会う約束を\n後回しにしていないか`,
      p3: `話を最後まで\n聞いているか`,
      truth: `当たり前のことを当たり前に続ける\nそれが一番難しくて一番大事です`,
      cta: `${profile}ほど慣れで雑になりやすいので\n今日一つだけ直してみてください`,
      bridge: `あなたと彼の本当の相性を\nプロフィールから\n無料で診断できます`,
    };
    // デフォルト（占い系）
    return {
      hook: `【${t}で知っておくべき3つのこと】`,
      title: `${t}で知っておくべき3つのこと`,
      p1: `感情より\n事実を見る`,
      p2: `相手の行動を\n観察する`,
      p3: `自分の直感を\n信じる`,
      truth: `答えはいつも\n自分の中にあります`,
      cta: `${profile}ならまず今日、一つだけ試してみてください`,
      bridge: `気になるあの人との相性を\nプロフィールから\n無料で診断できます`,
    };
  };

  const sc = getScenario(theme);
  const hook = sc.hook;
  const p1 = sc.p1.replace(/\n/g, '');
  const p2 = sc.p2.replace(/\n/g, '');
  const p3 = sc.p3.replace(/\n/g, '');
  const truth = sc.truth.replace(/\n/g, '');
  const cta = sc.cta.replace(/\n/g, '');
  const bridge = sc.bridge.replace(/\n/g, '');

  // 200文字：フック＋3ポイントのみ、シンプル完結
  const noteBase200 = `${hook}

①${p1}
②${p2}
③${p3}

${bridge}`;

  // 300文字：標準。真実＋3ポイント＋CTA
  const noteBase300 = `${hook}

${truth}

この3つだけ意識してみてください。

1. ${p1}
2. ${p2}
3. ${p3}

${cta}

${bridge}`;

  // 500文字：詳細版。背景説明＋3ポイント解説＋深いCTA
  const noteBase500 = `${hook}

${truth}

特に${profile}の方ほど、頑張っているのに結果が出ないと悩みやすいです。でも原因は能力ではなく、意識すべきポイントがズレているだけです。

うまくいく人が共通してやっていることは、この3つです。

1. ${p1}
   → これを意識するだけで相手の反応が変わります。

2. ${p2}
   → 多くの人が逆のことをやってしまっています。

3. ${p3}
   → 順番を変えるだけで結果は変わります。

逆にうまくいかない人は、答えを急ぎすぎて、感情だけで動いて、結果的に遠回りしています。

${cta}

まずは今日、一つだけ試してみてください。

${bridge}`;

  const noteBase = length === '200文字' ? noteBase200
    : length === '500文字' ? noteBase500
    : noteBase300;

  // 200文字：短くテンポよく、3ポイントだけ
  const tiktokBase200 = `${hook}

${profile}の方、見てください

これだけ覚えてください

1つ目
${sc.p1}

2つ目
${sc.p2}

3つ目
${sc.p3}

この3つだけです

${sc.bridge}`;

  // 300文字：標準の台本
  const tiktokBase300 = `${hook}

ちょっと待ってください

${profile}の方に
聞きたいことがあります

今こんな状況に
なっていませんか？

焦って動いて
空回りして

どうしたらいいか分からなくて

そんな方いませんか？

でも原因は
あなたのせいじゃないです

知らないだけです

うまくいく人は
3つだけ意識しています

1つ目
${sc.p1}

2つ目
${sc.p2}

3つ目
${sc.p3}

${sc.truth}

${sc.cta}

${sc.bridge}`;

  // 500文字：各ポイントに解説を加えた詳細版
  const tiktokBase500 = `${hook}

ちょっと待ってください

${profile}の方に
絶対知ってほしいことがあります

今こんな状況になっていませんか？

頑張っているのに
結果が出なくて

焦って動いて
また空回りして

正直もう
諦めそうになっている

でも原因は
あなたのせいじゃないです

知らないだけです

うまくいく人は
3つだけ意識しています

1つ目
${sc.p1}

これをやるだけで
相手の反応が変わります

2つ目
${sc.p2}

多くの人が
逆のことをやっています

3つ目
${sc.p3}

順番を変えるだけで
結果は全然変わります

逆にうまくいかない人は
答えを急ぎすぎて

感情だけで動いて

結果的に
遠回りしています

${sc.truth}

${sc.cta}

${sc.bridge}`;

  const tiktokBase = length === '200文字' ? tiktokBase200
    : length === '500文字' ? tiktokBase500
    : tiktokBase300;

  const xBase = length === '200文字'
    ? `${sc.title}\n\n・${p1}\n・${p2}\n・${p3}\n\n${bridge}`
    : length === '500文字'
    ? `${sc.title}\n\n${truth}\n\n・${p1}\n  （多くの人が逆をやっています）\n・${p2}\n  （これだけで相手の反応が変わります）\n・${p3}\n  （順番が大事です）\n\n${cta}\n\n${bridge}`
    : `${sc.title}\n\n${truth}\n\n・${p1}\n・${p2}\n・${p3}\n\n${cta}\n\n${bridge}`;

  const instagramBase = length === '200文字'
    ? `${hook}\n\n①${p1}\n②${p2}\n③${p3}\n\n${bridge}`
    : length === '500文字'
    ? `${hook}\n\n${truth}\n\nこの3つを意識するだけで結果は変わります。\n\n①${p1}\n 多くの人が逆のことをしています。\n\n②${p2}\n これをやるだけで相手の見え方が変わります。\n\n③${p3}\n 順番を変えるだけで全然違います。\n\n${cta}\n\n${bridge}`
    : `${hook}\n\n${truth}\n\nこの3つを意識するだけで結果は変わります。\n\n①${p1}\n②${p2}\n③${p3}\n\n${cta}\n\n${bridge}`;

  const youtubeBase = length === '200文字'
    ? `${hook}\n\n${profile}の方へ。\n\n1. ${p1}\n2. ${p2}\n3. ${p3}\n\n${bridge}`
    : length === '500文字'
    ? `${hook}\n\n${profile}の方に知ってほしいことがあります。\n\n${truth}\n\n今回のポイントはこの3つです。\n\n1. ${p1}\n   多くの方が逆のことをやっています。\n\n2. ${p2}\n   これを意識するだけで相手の反応が変わります。\n\n3. ${p3}\n   順番を変えるだけで結果は全然変わります。\n\n${cta}\n\nまずは今日、1つだけ試してみてください。\n\n${bridge}`
    : `${hook}\n\n${profile}の方に知ってほしいことがあります。\n\n${truth}\n\n今回のポイントはこの3つです。\n\n1. ${p1}\n2. ${p2}\n3. ${p3}\n\n${cta}\n\nまずは今日、1つだけ試してみてください。`;

  // Threads: Xと同フォーマット、少し長め（500文字）
  const threadsBase = length === '200文字'
    ? `${sc.title}\n\n・${p1}\n・${p2}\n・${p3}\n\n${bridge}`
    : length === '500文字'
    ? `${sc.title}\n\n${truth}\n\n${profile}の方ほど、この3つを意識するだけで状況が変わります。\n\n・${p1}\n・${p2}\n・${p3}\n\n${cta}\n\nまずは今日1つだけ試してみてください。\n\n${bridge}`
    : `${sc.title}\n\n${truth}\n\n・${p1}\n・${p2}\n・${p3}\n\n${cta}\n\n${bridge}`;

  // Twitch: 配信告知スタイル
  const twitchBase = length === '200文字'
    ? `【本日の配信】${sc.title}\n\n${p1} / ${p2} / ${p3}\n\n一緒に考えましょう！\n\n${bridge}`
    : length === '500文字'
    ? `【本日の配信テーマ】${sc.title}\n\n${truth}\n\n今日はこの3つについて深掘りします。\n\n✅ ${p1}\n✅ ${p2}\n✅ ${p3}\n\n${profile}の方、ぜひ一緒に考えましょう！コメントも大歓迎です。\n\n${cta}\n\n${bridge}`
    : `【本日の配信】${sc.title}\n\n${truth}\n\n✅ ${p1}\n✅ ${p2}\n✅ ${p3}\n\nコメントでご質問お待ちしています！\n\n${bridge}`;

  // SHOWROOM: ライブ配信告知スタイル
  const showroomBase = length === '200文字'
    ? `【ルーム説明】${sc.title}\n\n${p1} / ${p2} / ${p3}\n\n遊びに来てください！\n\n${bridge}`
    : length === '500文字'
    ? `【本日のライブ】${sc.title}\n\n${truth}\n\n${profile}の方に知ってほしいことをお話しします。\n\n▶ ${p1}\n▶ ${p2}\n▶ ${p3}\n\n${cta}\n\nお気軽に遊びに来てください！コメントお待ちしています♪\n\n${bridge}`
    : `【ライブ配信】${sc.title}\n\n${truth}\n\n▶ ${p1}\n▶ ${p2}\n▶ ${p3}\n\nぜひ遊びに来てください！\n\n${bridge}`;

  const noteBlock = buildTemplateBlock(templateText, templateUrl);
  const xBlock = buildTemplateBlock(templateText, templateUrl);
  const tiktokBlock = buildTextOnlyTemplateBlock(tiktokTemplateText);
  // Instagram/YouTubeはプロフィールリンク形式（noteXPhrase + URL）を使用
  const igYtBlock = buildTemplateBlock(templateText, templateUrl);

  const noteText = appendHashtags(
    insertBlock(noteBase, noteBlock, insertPosition),
    noteHashtags,
    hashtagMode
  );

  // TikTok: 記事本文（ハッシュタグなし）
  const tiktokBody = insertBlockAdvanced(tiktokBase, tiktokBlock, tiktokInsertPosition);
  // TikTok ハッシュタグのみ（別枠コピー用）
  const tiktokHashtagText = hashtagMode === 'あり' && tikTokHashtags.length > 0
    ? tikTokHashtags.join(' ')
    : '';

  const xText = trimToTwitterLength(appendHashtags(
    insertBlock(xBase, xBlock, insertPosition),
    xHashtags,
    hashtagMode
  ));

  // Instagram/YouTube: プロフィール・概要欄リンク形式（同内容でグループ化）
  const instagramText = appendHashtags(
    insertBlock(instagramBase, igYtBlock, insertPosition),
    getInstagramHashtags(theme),
    hashtagMode
  );
  // YouTubeも同じ内容にしてInstagramと一緒のブロックにまとめる
  const youtubeText = instagramText;

  const threadsText = trimToTwitterLength(appendHashtags(
    insertBlock(threadsBase, buildTemplateBlock(templateText, templateUrl), insertPosition),
    xHashtags,
    hashtagMode
  ));

  const twitchText = insertBlock(twitchBase, buildTemplateBlock(templateText, templateUrl), insertPosition);

  const showroomText = insertBlock(showroomBase, buildTemplateBlock(templateText, templateUrl), insertPosition);

  return {
    title: hook,
    content: noteText,
    capcutScript: tiktokBody,
    tiktokHashtagText,
    xPost: xText,
    instagramPost: instagramText,
    youtubePost: youtubeText,
    threadsPost: threadsText,
    twitchPost: twitchText,
    showroomPost: showroomText,
    hashtags:
      hashtagMode === 'あり'
        ? Array.from(
            new Set([
              ...noteHashtags,
              ...tikTokHashtags,
              ...xHashtags,
            ])
          )
        : [],
  };
};

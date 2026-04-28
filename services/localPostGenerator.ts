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

const trimByLength = (text: string, length: string) => {
  const max = length === '200文字' ? 220 : length === '500文字' ? 560 : 360;
  if (text.length <= max) return text;
  return `${text.slice(0, max)}...`;
};

const appendHashtags = (text: string, hashtags: string[], hashtagMode: 'あり' | 'なし') => {
  if (hashtagMode === 'なし') return text;
  if (!hashtags.length) return text;
  return `${text}\n\n${hashtags.join(' ')}`;
};

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
  type Scenario = { hook: string; title: string; p1: string; p2: string; p3: string; truth: string; cta: string; };
  const getScenario = (t: string): Scenario => {
    if (t.includes('片思い') || t.includes('片想い')) return {
      hook: `【片想い中の人、これやってたら終わりです】`,
      title: `片想い中の人、これやってたら終わりです`,
      p1: `返信が来たらすぐ既読・即返信\n（3時間は待つのが正解）`,
      p2: `相手のSNSに毎回いいね\n（頻度を落とすと気になられる）`,
      p3: `会話が盛り上がっても自分から終わらせない\n（惜しいところで切り上げる）`,
      truth: `引いた瞬間に相手は気になり始めます\nこれが片想いの逆転法則です`,
      cta: `${profile}ほど追いかけやすいので\nまず3日だけ引いてみてください`,
    };
    if (t.includes('告白')) return {
      hook: `【告白する前にこれやらないと絶対後悔します】`,
      title: `告白する前にこれやらないと絶対後悔します`,
      p1: `最後に会った時の印象が\n「楽しかった」になっているか確認`,
      p2: `告白の前日は連絡を軽くしておく\n（重くしない）`,
      p3: `二人きりの自然な流れで伝える\n（わざとらしくしない）`,
      truth: `告白は勝負じゃなくて確認です\n準備ができていれば結果は自然についてきます`,
      cta: `${profile}ほど答えを急ぎやすいので\n最後の印象を先に整えてください`,
    };
    if (t.includes('復縁')) return {
      hook: `【別れた後に送ってはいけないLINEがあります】`,
      title: `別れた後に送ってはいけないLINEがあります`,
      p1: `別れてから最低1ヶ月連絡しない`,
      p2: `SNSの更新は続けるが\n寂しさを出さない`,
      p3: `連絡再開は近況報告から始める\n（感情は出さない）`,
      truth: `人はいなくなった時に初めて気づきます\n消えることが最大の戦略です`,
      cta: `${profile}ほど不安で動きたくなりますが\nまず今日から1ヶ月連絡しないことを決めてください`,
    };
    if (t.includes('脈なし')) return {
      hook: `【脈なしから逆転した人がやっていたこと】`,
      title: `脈なしから逆転した人がやっていたこと`,
      p1: `急に連絡頻度を下げる`,
      p2: `次に会った時に少し雰囲気を変える\n（外見・話し方）`,
      p3: `相手の話を聞きすぎない\n（自分の話もする）`,
      truth: `変化した人を人は放置できません\n脈なしは戦略次第で変わります`,
      cta: `${profile}ほど追いすぎるので\nまず今日から連絡の頻度を半分に減らしてください`,
    };
    if (t.includes('脈あり')) return {
      hook: `【これ全部脈ありのサインです、気づいてますか】`,
      title: `これ全部脈ありのサインです、気づいてますか`,
      p1: `会話中に自分から質問してくる\n（興味がある証拠）`,
      p2: `LINEの返信が会話を終わらせない形\n（続けたい証拠）`,
      p3: `二人きりの誘いに断らずに乗ってくる`,
      truth: `3つ当てはまるならかなり脈ありです\n動くタイミングです`,
      cta: `${profile}なら今すぐ3つ確認してみてください`,
    };
    if (t.includes('浮気')) return {
      hook: `【これ全部浮気のサインです】`,
      title: `これ全部浮気のサインです`,
      p1: `スマホを見せなくなった\n（または裏向きにする）`,
      p2: `返信が遅くなったのに\nSNSは更新している`,
      p3: `帰りが遅くなったのに\n理由が曖昧`,
      truth: `違和感は放置するほど深くなります\n感情より事実を先に整理してください`,
      cta: `${profile}ほど見ないふりをしやすいので\n今すぐ事実だけを書き出してみてください`,
    };
    if (t.includes('恋愛')) return {
      hook: `【この行動してたら相手は確実に冷めてます】`,
      title: `この行動してたら相手は確実に冷めてます`,
      p1: `LINEの返信が雑になっていないか`,
      p2: `会う約束を後回しにしていないか`,
      p3: `話を最後まで聞いているか`,
      truth: `当たり前のことを当たり前に続ける\nそれが一番難しくて一番大事です`,
      cta: `${profile}ほど慣れで雑になりやすいので\n今日一つだけ直してみてください`,
    };
    // デフォルト
    return {
      hook: `【${t}で結果が変わる人の共通点】`,
      title: `${t}で結果が変わる人の共通点`,
      p1: `目的をはっきりさせる`,
      p2: `相手に伝わる形にする`,
      p3: `続けられる形に変える`,
      truth: `順番を変えるだけで結果は変わります`,
      cta: `${profile}ならまず一つ目だけ今日から始めてください`,
    };
  };

  const sc = getScenario(theme);
  const hook = sc.hook;

  const noteBase = trimByLength(`${hook}

${sc.truth.replace(/\n/g, '')}

特に${profile}の人ほど、頑張っているのに結果が出ない悩みを抱えやすいです。

でも原因は能力や努力ではありません。意識すべきポイントがズレているだけです。

結果が出る人が共通してやっていること、それはこの3つです。

1. ${sc.p1.replace(/\n/g, '')}
2. ${sc.p2.replace(/\n/g, '')}
3. ${sc.p3.replace(/\n/g, '')}

逆に止まっている人は、答えを急ぎすぎて、感情で動いて、結果的に遠回りしています。

${sc.cta.replace(/\n/g, '')}

まずは今日、一つだけ試してみてください。`, length);

  const tiktokBase = `${hook}

ちょっと待ってください

${profile}の人に
聞きたいことがあります

今こんな状況に
なっていませんか？

焦って動いて
空回りして

それでも
結果が出なくて

正直もう
諦めそうになっている

そんな人いませんか？

でも原因は
あなたのせいじゃないです

知らないだけです

結果が出る人は
3つだけ意識しています

1つ目
${sc.p1}

2つ目
${sc.p2}

3つ目
${sc.p3}

この3つです

逆に止まっている人は
答えを急ぎすぎて

感情だけで動いて

結果的に
遠回りしています

${sc.truth}

${sc.cta}`;

  const xBase = trimByLength(`${sc.title}

${sc.truth.replace(/\n/g, '')}

・${sc.p1.replace(/\n/g, '')}
・${sc.p2.replace(/\n/g, '')}
・${sc.p3.replace(/\n/g, '')}

${sc.cta.replace(/\n/g, '')}`, length);

  const instagramBase = trimByLength(`${hook}

${sc.truth.replace(/\n/g, '')}

この3つを意識するだけで結果は変わります。

①${sc.p1.replace(/\n/g, '')}
②${sc.p2.replace(/\n/g, '')}
③${sc.p3.replace(/\n/g, '')}

${sc.cta.replace(/\n/g, '')}`, length);

  const youtubeBase = trimByLength(`${hook}

${profile}の方に知ってほしいことがあります。

${sc.truth.replace(/\n/g, '')}

今回のポイントはこの3つです。

1. ${sc.p1.replace(/\n/g, '')}
2. ${sc.p2.replace(/\n/g, '')}
3. ${sc.p3.replace(/\n/g, '')}

${sc.cta.replace(/\n/g, '')}

まずは今日、1つだけ試してみてください。`, length);

  const noteBlock = buildTemplateBlock(templateText, templateUrl);
  const xBlock = buildTemplateBlock(templateText, templateUrl);
  const instagramBlock = buildTemplateBlock(templateText, templateUrl);
  const youtubeBlock = buildTemplateBlock(templateText, templateUrl);
  const tiktokBlock = buildTextOnlyTemplateBlock(tiktokTemplateText);

  const noteText = appendHashtags(
    insertBlock(noteBase, noteBlock, insertPosition),
    noteHashtags,
    hashtagMode
  );

  const tiktokText = appendHashtags(
    insertBlockAdvanced(tiktokBase, tiktokBlock, tiktokInsertPosition),
    tikTokHashtags,
    hashtagMode
  );

  const xText = appendHashtags(
    insertBlock(xBase, xBlock, insertPosition),
    xHashtags,
    hashtagMode
  );

  const instagramText = appendHashtags(
    insertBlock(instagramBase, instagramBlock, insertPosition),
    instagramHashtags,
    hashtagMode
  );

  const youtubeText = appendHashtags(
    insertBlock(youtubeBase, youtubeBlock, insertPosition),
    youtubeHashtags,
    hashtagMode
  );

  return {
    title: hook,
    content: noteText,
    capcutScript: tiktokText,
    xPost: xText,
    instagramPost: instagramText,
    youtubePost: youtubeText,
    hashtags:
      hashtagMode === 'あり'
        ? Array.from(
            new Set([
              ...noteHashtags,
              ...tikTokHashtags,
              ...xHashtags,
              ...instagramHashtags,
              ...youtubeHashtags,
            ])
          )
        : [],
  };
};

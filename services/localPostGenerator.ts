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

  const hook = `【${theme}で結果が変わる人の共通点】`;

  const noteBase = trimByLength(`${hook}

「${theme}を頑張っているのに、思うように結果が出ない」
そんなふうに感じたことはありませんか？

特に${profile}の人ほど、
真面目に取り組むほど、
「自分のやり方が合っているのか」が分からなくなりやすいです。

でも、結果が出ない理由は才能不足ではありません。

多くの場合、
足りないのは“努力”ではなく
「順番」と「見せ方」です。

たとえば${theme}で変化を出す人は、
最初から大きく変えようとはしません。

まずは次の3つを整えています。

1. 目的をはっきりさせる
2. 相手に伝わる形に整える
3. 続けられるやり方に変える

逆に結果が止まりやすい人は、
・何となく始める
・伝えたいことを詰め込みすぎる
・続けにくい形で頑張る

この流れに入りやすいです。

大切なのは、
「もっと頑張ること」ではなく
“伝わる形”に整えることです。

今日から意識したいのはこの1つです。

「この内容は、相手が一瞬で理解できるか？」

ここを整えるだけで、
${theme}の伝わり方は大きく変わります。

最後にもう一度だけ。

${theme}で結果を変える人は、
特別な才能がある人ではありません。
“伝わる順番”を知っている人です。

まずは1回、
伝え方の順番を整えることから始めてみてください。`, length);

  const tiktokBase = `${hook}

ちょっと待ってください

${theme}を頑張ってるのに
結果が出ない人

かなり多いです

でも原因は
能力不足じゃありません

足りないのは
努力じゃなくて

順番です

結果が出る人は
最初に3つだけ
意識しています

1つ目
目的をはっきりさせる

2つ目
相手に伝わる形にする

3つ目
続けられる形に変える

この3つです

逆に止まる人は
何となく始めて

言いたいことを
詰め込みすぎて

途中で苦しくなります

だから続かない

でも安心してください

変えるべきなのは
才能じゃなくて

伝え方です

今日から意識するのは
たった1つ

一瞬で伝わるか

ここだけです

これを整えるだけで
${theme}の結果は変わります

本当に大事なのは
頑張り方より
伝わる順番です

まず1回
整えてみてください`;

  const xBase = trimByLength(`${theme}で結果が出ない人ほど、努力不足ではなく「順番」で損しています。

大事なのは
・目的をはっきりさせる
・相手に伝わる形にする
・続けられる形に変える

才能より、まず伝え方。
ここを整えるだけで反応はかなり変わります。`, length);

  const instagramBase = trimByLength(`${hook}

${theme}で結果を変えたいなら、
最初に整えるべきなのは「順番」です。

・目的をはっきりさせる
・相手に伝わる形にする
・続けられる形に変える

この3つを意識するだけで、
伝わり方も反応も大きく変わります。

がんばり方を増やすより、
まずは伝わる形を整えること。`, length);

  const youtubeBase = trimByLength(`${hook}

${theme}で結果が変わる人には共通点があります。

それは、努力量ではなく
「順番」を整えていることです。

今回のポイントは3つです。

1. 目的をはっきりさせる
2. 相手に伝わる形にする
3. 続けられる形に変える

この順番を意識するだけで、
発信の反応も結果も大きく変わります。

まずは今日、
1つだけでも見直してみてください。`, length);

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

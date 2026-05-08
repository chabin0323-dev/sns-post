/**
 * 改善版SNS投稿自動生成サービス
 * テーマ深掘り分析 + 心理トリガー + ランダム変動を組み合わせた高度な生成
 * 各SNS向けに完全に異なるコンテンツを生成
 */

import * as Enhanced from './enhancedPostGenerator';

// ========== ユーティリティ関数 ==========

const twitterWeightedLength = (text: string): number => {
  let n = 0;
  for (const c of text) {
    n += ((c.codePointAt(0) ?? 0) <= 0x10FF) ? 1 : 2;
  }
  return n;
};

const trimToWeightedLength = (text: string, maxWeight: number): string => {
  let n = 0;
  let result = '';
  for (const c of text) {
    const w = ((c.codePointAt(0) ?? 0) <= 0x10FF) ? 1 : 2;
    if (n + w > maxWeight) return result.trimEnd();
    n += w;
    result += c;
  }
  return result;
};

const trimToTwitterLength = (text: string): string => trimToWeightedLength(text, 280);

const parseLengthToNumber = (lengthString: string): number => {
  const match = lengthString.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 500;
};

const parseTwitterWeightedLength = (lengthString: string): number => {
  const base = parseLengthToNumber(lengthString);
  return lengthString.includes('全角') ? base * 2 : base;
};

const ensureExactTwitterWeight = (text: string, targetWeight: number): string => {
  let result = '';
  let weight = 0;
  for (const c of text) {
    const w = ((c.codePointAt(0) ?? 0) <= 0x10FF) ? 1 : 2;
    if (weight + w > targetWeight) break;
    result += c;
    weight += w;
  }
  while (weight < targetWeight) {
    const needed = targetWeight - weight;
    if (needed === 1) {
      result += '.';
      weight += 1;
    } else {
      result += '。';
      weight += 2;
    }
  }
  return result;
};

const extendTikTokText = (text: string, minLength: number, theme: string): string => {
  if (text.length >= minLength) return text;
  const fillerLines = [
    `この${theme}のポイントをさらに詳しく説明します。`,
    `次に、よくある失敗の理由をもう少し掘り下げます。`,
    `これを意識すると、${theme}の結果が変わります。`,
    `実際の場面では、この考え方が重要です。`,
  ];

  let result = text.trimEnd();
  let index = 0;
  while (result.length < minLength) {
    result += `\n\n${fillerLines[index % fillerLines.length]}`;
    index += 1;
  }

  return result.trimEnd();
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

const insertBlock = (baseText: string, block: string, insertPosition: 'start' | 'end') => {
  if (!block) return baseText;
  return insertPosition === 'start'
    ? `${block}\n\n${baseText}`
    : `${baseText}\n\n${block}`;
};

const insertBlockAdvanced = (baseText: string, block: string, position: 'start' | 'end' | 'both') => {
  if (!block) return baseText;
  if (position === 'start') return `${block}\n\n${baseText}`;
  if (position === 'end') return `${baseText}\n\n${block}`;
  return `${block}\n\n${baseText}\n\n${block}`;
};

const appendHashtags = (text: string, hashtags: string[], hashtagMode: 'あり' | 'なし') => {
  if (hashtagMode === 'なし') return text;
  if (!hashtags.length) return text;
  return `${text}\n\n${hashtags.join(' ')}`;
};

const ensureExactLength = (text: string, targetLength: number, filler: string) => {
  if (text.length === targetLength) return text;
  if (text.length > targetLength) return text.slice(0, targetLength);
  let result = text;
  while (result.length < targetLength) {
    result += filler;
  }
  return result.slice(0, targetLength);
};

// ========== ハッシュタグ生成 ==========

const TAG_DB: Record<string, string[]> = {
  復縁: ['#復縁', '#復縁したい', '#元彼', '#元カレ', '#元サヤ', '#復縁占い'],
  不倫: ['#不倫', '#秘密の恋', '#大人の恋愛', '#複雑愛', '#許されない恋', '#不倫占い'],
  片思い: ['#片思い', '#好きな人', '#恋愛成就', '#脈あり', '#告白', '#片思い占い'],
  告白: ['#告白', '#告白成功', '#恋愛成就', '#好きな人', '#恋愛心理'],
  本音: ['#本音', '#彼の本音', '#相手の気持ち', '#恋愛心理', '#本心'],
  既読無視: ['#既読無視', '#連絡こない', '#恋愛の悩み', '#脈なし', '#恋愛心理'],
  遠距離: ['#遠距離恋愛', '#会えない恋', '#恋愛の悩み', '#遠距離カップル'],
  相性: ['#相性', '#相性占い', '#運命の人', '#恋愛占い', '#恋愛運'],
  ツインレイ: ['#ツインレイ', '#魂の片割れ', '#運命の人', '#スピリチュアル'],
  恋愛: ['#恋愛', '#恋愛占い', '#恋愛心理', '#恋愛成就', '#本音', '#相性'],
};

const DEFAULT_THEME_TAGS = ['#恋愛', '#恋愛占い', '#恋愛心理', '#本音', '#相性', '#運命の人'];

const getThemeTags = (theme: string) => {
  const matched = Object.entries(TAG_DB).find(([key]) => theme.includes(key));
  const cleaned = cleanTagText(theme);
  if (matched) return uniqueTags([`#${cleaned}`, ...matched[1]], 6);
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
  const support = ['#恋愛', '#恋愛占い', '#恋愛心理', '#本音', '#相性'];
  return uniqueTags([...variable, ...support], 10);
};

// ========== 関連テーマ提案 ==========

export function generateRelatedThemes(theme: string): string[] {
  const t = theme.trim();
  if (!t) return [];

  const suggestions: Record<string, string[]> = {
    片思い: ['脈ありサインの見分け方', '好きな人に意識させる方法', '告白のベストタイミング', '片思いを手放すべき理由'],
    復縁: ['別れた後の連絡タイミング', '冷却期間の正しい過ごし方', '復縁できる人の共通点', '元彼の本当の気持ち'],
    告白: ['告白成功率を上げる準備', '告白後の関係を進める方法', '告白で失敗する人の特徴', '告白のベストな場所と時間'],
    不倫: ['不倫を終わらせる決断の仕方', '不倫相手の本当の気持ち', '不倫から抜け出す方法', '不倫が周囲にバレる前に'],
    遠距離: ['遠距離が成功する人の条件', '遠距離中の信頼の築き方', '会えない時間の過ごし方', '遠距離で別れやすい理由'],
  };

  for (const [key, themes] of Object.entries(suggestions)) {
    if (t.includes(key)) {
      return themes.slice(0, 5);
    }
  }

  return [
    `${t}で失敗する人の共通点`,
    `${t}で結果が変わる3つのこと`,
    `${t}で本当に大事なこと`,
    `${t}で成功する人だけが知っていること`,
    `${t}の真実を知っていますか`,
  ];
}

// ========== メイン生成関数 ==========

export const generateSNSPostContent = (
  theme: string,
  length: string,
  gender: string,
  age: string,
  templateText: string = '',
  templateUrl: string = '',
  tiktokTemplateText: string = '',
  insertPosition: 'start' | 'end' = 'end',
  tiktokInsertPosition: 'start' | 'end' | 'both' = 'start',
  hashtagMode: 'あり' | 'なし' = 'あり',
  xPhrase: string = '▼無料で試す',
  xUrl: string = 'https://lovelab-sns-redirect.vercel.app',
  threadsPhrase: string = '▼無料で試す',
  threadsUrl: string = 'https://lovelab-sns-redirect.vercel.app',
  igYtPhrase: string = '詳細はプロフィールのリンクから🔗',
  xLength: string = '140文字全角',
  threadsLength: string = '500文字'
) => {
  const profile = getProfileLabel(gender, age);
  const variant = Math.floor(Math.random() * 3); // ランダム変動

  // 改善版の高度な生成関数を使用
  const xPost = Enhanced.generateXPost(theme, profile, variant);
  const threadsPost = Enhanced.generateThreadsPost(theme, profile, variant);
  const instagramPost = Enhanced.generateInstagramPost(theme, profile, variant);
  const youtubePost = Enhanced.generateYouTubePost(theme, profile, variant);
  const notePost = Enhanced.generateNotePost(theme, profile, variant);
  const targetLength = parseLengthToNumber(length);
  const capcutScript = Enhanced.generateTikTokScript(theme, profile, variant, targetLength);

  // ハッシュタグ設定
  const noteHashtags = getThemeTags(theme);
  const tikTokHashtags = getTikTokHashtags(theme);
  const xHashtags = getXHashtags(theme);
  const instagramHashtags = getInstagramHashtags(theme);

  // テンプレート処理
  const noteBlock = buildTemplateBlock(templateText, templateUrl);
  const tiktokBlock = buildTextOnlyTemplateBlock(tiktokTemplateText);

  // 各SNS向けの最終テキスト組成
  const noteText = appendHashtags(
    insertBlock(notePost, noteBlock, insertPosition),
    noteHashtags,
    hashtagMode
  );
  const noteTextAdjusted = ensureExactLength(noteText, targetLength, '。');

  // TikTok: 指定された文字数に調整
  const tiktokBodyRaw = insertBlockAdvanced(capcutScript, tiktokBlock, tiktokInsertPosition);
  const minTikTokLength = Math.ceil(targetLength * 0.8);
  const tiktokBodyExpanded = extendTikTokText(tiktokBodyRaw, minTikTokLength, theme);
  const tiktokBodyBase = tiktokBodyExpanded.length > targetLength
    ? trimToWeightedLength(tiktokBodyExpanded, targetLength).trimEnd()
    : tiktokBodyExpanded;
  const tiktokBody = ensureExactLength(tiktokBodyBase, targetLength, '。');
  const tiktokHashtagText = hashtagMode === 'あり' && tikTokHashtags.length > 0
    ? tikTokHashtags.join(' ')
    : '';

  // X: CTA処理
  const xTargetWeight = parseTwitterWeightedLength(xLength);
  const xCta = [xPhrase.trim(), xUrl.trim()].filter(Boolean).join('\n');
  const xCtaSuffix = xCta ? `\n\n${xCta}` : '';
  const xCtaWeight = twitterWeightedLength(xCtaSuffix);
  const xBodyRaw = appendHashtags(xPost, xHashtags, hashtagMode);
  const xBodyTrimmed = trimToWeightedLength(xBodyRaw, Math.max(0, xTargetWeight - xCtaWeight));
  const xText = `${xBodyTrimmed}${xCtaSuffix}`;
  const xTextAdjusted = ensureExactTwitterWeight(xText, xTargetWeight);

  // Threads: CTA処理
  const threadsTargetLength = parseLengthToNumber(threadsLength);
  const threadsCta = [threadsPhrase.trim(), threadsUrl.trim()].filter(Boolean).join('\n');
  const threadsCtaSuffix = threadsCta ? `\n\n${threadsCta}` : '';
  const threadsBodyRaw = appendHashtags(threadsPost, xHashtags, hashtagMode);
  const threadsCtaWeight = threadsCtaSuffix.length;
  const threadsBodyMinLength = Math.max(0, threadsTargetLength - threadsCtaWeight);
  const threadsBodyExpanded = extendTikTokText(threadsBodyRaw, threadsBodyMinLength, theme);
  const threadsBodyTrimmed = threadsBodyExpanded.length + threadsCtaWeight > threadsTargetLength
    ? threadsBodyExpanded.slice(0, Math.max(0, threadsTargetLength - threadsCtaWeight)).trimEnd()
    : threadsBodyExpanded;
  const threadsText = `${threadsBodyTrimmed}${threadsCtaSuffix}`;
  const threadsTextAdjusted = ensureExactLength(threadsText, threadsTargetLength, '。');

  // Instagram/YouTube: プロフィール誘導
  const igYtCta = igYtPhrase.trim();
  const instagramText = appendHashtags(
    insertBlock(instagramPost, igYtCta, 'end'),
    instagramHashtags,
    hashtagMode
  );
  const youtubeText = appendHashtags(
    insertBlock(youtubePost, igYtCta, 'end'),
    instagramHashtags,
    hashtagMode
  );

  // Twitch/SHOWROOM用（オプション）
  const twitchText = insertBlock(capcutScript, buildTemplateBlock(templateText, templateUrl), insertPosition);
  const showroomText = insertBlock(capcutScript, buildTemplateBlock(templateText, templateUrl), insertPosition);

  // 返却データ（既存UIとの互換性を保つ）
  return {
    title: `【${theme}の重要ポイント】`,
    content: noteText,
    capcutScript: tiktokBody,
    tiktokHashtagText,
    xPost: xTextAdjusted,
    instagramPost: instagramText,
    youtubePost: youtubeText,
    threadsPost: threadsTextAdjusted,
    twitchPost: twitchText,
    showroomPost: showroomText,
    hashtags: hashtagMode === 'あり'
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

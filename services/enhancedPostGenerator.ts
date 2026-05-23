/**
 * 改善版SNS投稿生成エンジン
 * テーマ分析 + 心理トリガー + ランダム性を組み合わせた高度な生成
 */

/**
 * テーマから深いキーワード分析を実行
 */
const analyzeThemeDeep = (theme: string) => {
  const parts = theme.split(/[\s・〜～\-:：、。]+/).filter(p => p);

  const expandedKeywords: Record<string, string[]> = {
    '復縁': ['恋愛', '元彼', '元カレ', '関係修復', '距離感', '本音', '復縁占い', '再スタート', '再会', '謝罪'],
    '恋愛': ['感情', '相手の気持ち', 'コミュニケーション', '信頼', '距離感', '心理', '告白', 'デート', 'LINE', '脈あり', '脈なし'],
    '不倫': ['秘密の恋', '禁断の関係', '罪悪感', '駆け引き', '後悔', '浮気', '嘘', '情熱', '別れ'],
    '片思い': ['脈あり', '告白', '連絡', '待つ時間', '勇気', '気持ち', 'LINE', '視線', '距離感'],
    '告白': ['タイミング', '言葉選び', '緊張', '成功率', '返事', '準備', '相手の気持ち', 'シチュエーション'],
    '本音': ['心の声', '本当の気持ち', '嘘をやめる', '正直さ', 'コミュニケーション', '感情の変化'],
    '既読無視': ['連絡がない', '距離感', '不安', '焦り', '待つ', '悩み', '返信', '判断'],
    '遠距離': ['すれ違い', '会えない', '信頼', '距離感', '連絡頻度', '将来', '会う計画'],
    '相性': ['価値観', '性格', '生活習慣', '相手の考え方', '運命感じる', 'フィーリング'],
    'ツインレイ': ['魂の片割れ', '運命の相手', 'スピリチュアル', '別れと再会', '強い絆'],
    '人間関係': ['コミュニケーション', '信頼', '境界線', '共感', '対立', '解決', '友情', '家族', '職場', '社交', '感情'],
  };

  const keywords = [...parts];
  let matched = false;
  for (const [key, related] of Object.entries(expandedKeywords)) {
    if (theme.includes(key)) {
      keywords.push(...related);
      matched = true;
    }
  }

  if (!matched) {
    keywords.push('本質', '原因', '成功', '失敗', '共感', '方法', '実践', '行動');
  }

  const uniqueKeywords = [...new Set(keywords)].slice(0, 8);
  return {
    main: parts[0] || theme,
    secondary: parts[1] || uniqueKeywords[1] || '',
    tertiary: parts[2] || uniqueKeywords[2] || '',
    expanded: uniqueKeywords,
  };
};

/**
 * バズ要素の確実な埋め込み：冒頭1行は必ずスクロール停止級
 */
const generateScrollStoppingHooks = (theme: string): string[] => {
  const hooks = [
    `【衝撃】${theme}で失敗してる人、実は${Math.random() > 0.5 ? '80%' : '90%'}です`,
    `${theme}で気付いていないなら、今すぐ辞めてください`,
    `え、${theme}でこんなことしてたの？`,
    `${theme}で成功する人だけが知ってる秘密`,
    `【重要】${theme}で最初の3ヶ月が全てです`,
    `これだけは絶対に${theme}で失敗してはいけません`,
    `${theme}の本当の理由、知ってましたか？`,
    `多くの人が${theme}を完全に勘違いしています`,
    `【事実】${theme}が変わるのはこのタイミングです`,
    `ほぼ全員が${theme}で同じ失敗をしています`,
    `${theme}で損してる人、特徴あります`,
    `これ知らないと${theme}で一生後悔します`,
    `${theme}の真実、誰も教えてくれなかった`,
    `え？${theme}ってそんなことだったの？`,
    `${theme}で成功者と失敗者の決定的違い`,
    `【緊急】${theme}で今すぐ変えるべきこと`,
    `${theme}でほとんどの人が見落としてるポイント`,
    `これをやらないと${theme}で結果出ません`,
    `${theme}の本質、理解してますか？`,
    `${theme}で劇的に変わるたった一つの方法`,
  ];
  return hooks;
};

/**
 * 心理トリガーの埋め込みを生成
 */
const generatePsychologicalTriggers = (
  theme: string,
  audience: string
): Record<string, string> => {
  const triggers = {
    curiosity: [
      `実は${theme}の本当の理由は...`,
      `${theme}で大事なのは実はここ...`,
      `ほとんどの人が知らない${theme}の真実`,
      `${theme}で成功する人だけが知ってること`,
      `え？${theme}ってそういうことだったの？`,
      `${theme}の意外な事実、知ってますか？`,
      `${theme}で誰も教えてくれない秘密`,
      `${theme}の本質は実は逆なんです`,
      `${theme}で成功者の共通点、想像つきます？`,
      `${theme}で劇的に変わる盲点`,
    ],
    loss: [
      `${theme}で知らないままだと、毎日損してます`,
      `${theme}を間違えたままだと、人生で大損します`,
      `${audience}が${theme}で失敗している本当の理由`,
      `今のままだと${audience}は${theme}で後悔します`,
      `${theme}を知らないと、もう戻れません`,
      `${theme}で損してる人、特徴あります`,
      `${theme}を失敗すると取り返しがつかない`,
      `${audience}が${theme}で避けたい後悔`,
      `${theme}で今すぐ変えないと一生損`,
      `${theme}の失敗がもたらす悲惨な結果`,
    ],
    rarity: [
      `${theme}で成功してる${Math.random() > 0.5 ? '1%' : '一握り'}だけが使ってる方法`,
      `このやり方、${theme}の${Math.random() > 0.5 ? '業界人' : 'プロ'}だけが知ってます`,
      `${theme}で本当に効く方法は実は3つだけ`,
      `有名人も使ってる${theme}の秘密`,
      `${theme}で成功者のみが知るテクニック`,
      `${theme}の真の方法、限られた人だけ`,
      `${theme}で差がつく特別な知識`,
      `${theme}の成功法則、誰も知らない`,
      `${theme}でトップ1%のやり方`,
      `${theme}の隠された成功パターン`,
    ],
    empathy: [
      `${audience}ほど、${theme}で${Math.random() > 0.5 ? '頑張ってるのに結果出ない' : '悩んでる'}`,
      `${audience}が${theme}で陥るあるあるパターン`,
      `${audience}だからこそ${theme}で失敗しやすい理由`,
      `${audience}の多くが${theme}で引っかかるポイント`,
      `${audience}の${theme}での苦労、めっちゃわかる`,
      `${audience}が${theme}で感じる孤独、共有したい`,
      `${audience}の${theme}失敗談、誰かに聞いてほしい`,
      `${audience}が${theme}で抱えるジレンマ`,
      `${audience}の${theme}での葛藤、理解できる`,
      `${audience}が${theme}で直面する壁`,
    ],
  };

  const selected: Record<string, string> = {};
  for (const [key, options] of Object.entries(triggers)) {
    selected[key] = options[Math.floor(Math.random() * options.length)];
  }
  return selected;
};

/**
 * テーマ固有の具体例・数字を生成
 */
const generateThemeSpecificExamples = (theme: string): string[] => {
  const examples: Record<string, string[]> = {
    '恋愛': [
      'LINEの返信が遅くなったら脈なしの確率は70%です',
      'デート4回目までが実は勝負ラインになることが多いです',
      '会う頻度は週1-2回が自然な距離感です',
      '既読無視は必ずしも脈なしではありませんが注意が必要です',
      '告白の成功率は相手の気持ちを考えると上がります',
      '初デートで話す話題は相手の興味に合わせると安心感が増えます',
    ],
    '復縁': [
      '復縁成功者の80%は、まず自分の行動を見直しています',
      '元彼への連絡はタイミングが命で、間違えると逆効果です',
      '復縁で最も多い失敗は「今の自分を理解していない」ことです',
      '復縁成功率は距離感の取り方で大きく変わります',
      '「今すべきこと」と「待つべきこと」を分けることが重要です',
    ],
    '不倫': [
      '不倫は感情と責任の間で苦しみやすいです',
      '秘密の関係は長期的に見ると心の負担が大きくなります',
      '連絡の頻度や距離感を間違えると関係が壊れやすいです',
      '本音を隠すほどコミュニケーションはズレていきます',
      '真実と向き合うことが、次のステップへの第一歩です',
    ],
    '片思い': [
      '片思い中は相手の小さな変化に敏感になりがちです',
      '告白のタイミングは相手の状況を見て調整するのが大事です',
      '返信が遅いときは焦らず距離感を保つと効果的です',
      '素直な気持ちを少しずつ伝えると相手も安心します',
      '好きな人との距離感は「近すぎず遠すぎない」が鍵です',
    ],
    '告白': [
      '告白は言葉選びとタイミングが勝負です',
      '成功率を上げるには相手の気持ちに寄り添う姿勢が必要です',
      '緊張しすぎず自然体で伝えることが大切です',
      '告白は結果よりも自分の気持ちを整理するきっかけになります',
      '相手の反応を受け止める準備も同じくらい重要です',
    ],
    '本音': [
      '本音を話すと関係は深まることが多いです',
      '隠し事は信頼のズレを生みやすいです',
      '本当の気持ちを伝えるにはタイミングと言葉が大事です',
      '正直さは恋愛における最も強い土台になります',
      '感情の変化に気付くことが、次の一歩につながります',
    ],
    '既読無視': [
      '既読無視の理由は必ずしも嫌いではない場合もあります',
      '連絡を待つときは自分の時間も大切にすることが重要です',
      '急ぐと余計に関係がこじれやすいです',
      '返信が来ないときは距離感を整える良い機会です',
      '相手の状況を想像すると余計な不安を減らせます',
    ],
    '遠距離': [
      '遠距離では連絡の質が関係性を左右します',
      '会えない時間をどう使うかで絆が深まります',
      '信頼関係を保つには小さな約束を守ることが大切です',
      '将来のイメージを共有すると不安が減ります',
      '距離があっても心の距離は縮められます',
    ],
    '相性': [
      '相性が良いと感じるのは、価値観や感覚が似ているからです',
      '相性は一度で判断せず、時間と経験で育てるものです',
      '違いを尊重できるかが本当の相性を分けます',
      'フィーリングは言葉にできないけれど大切なサインです',
      '相手の考え方に寄り添うと安心感が生まれます',
    ],
    'ツインレイ': [
      'ツインレイは運命のように感じる関係です',
      '別れと再会を繰り返すことが多いのが特徴です',
      '魂のつながりを感じる瞬間は言葉になりません',
      '強い絆があるからこそ、悩みも深くなりやすいです',
      '真実の自分を見せることが関係を深めます',
    ],
    '人間関係': [
      '信頼関係の構築には共感が80%重要',
      '対立解決の鍵は相手の話を聞くこと',
      '友情の維持には週1回の連絡が最適',
      '境界線の設定でストレス50%減少',
      '感謝の表現で関係性が20%向上',
      '職場での人間関係は生産性に30%影響',
    ],
  };

  const relevant = Object.entries(examples).find(([key]) =>
    theme.includes(key)
  );
  if (relevant) return relevant[1].slice(0, 5);

  return [
    `この${theme}の本質を理解することで、結果が大きく変わります`,
    `${theme}で失敗する人の多くは、最初に必要な基礎を飛ばしています`,
    `${theme}における成功のポイントは、シンプルな継続と小さな改善です`,
    `${theme}で成果を出すには、行動の質を上げる必要があります`,
    `${theme}に必要なのは、理屈よりも正しい実践です`,
  ];
};

/**
 * X向けの高度な生成 - 完全に異なるバリエーション
 */
export const generateXPost = (
  theme: string,
  audience: string,
  variant: number = 0
): string => {
  const analysis = analyzeThemeDeep(theme);
  const triggers = generatePsychologicalTriggers(theme, audience);
  const examples = generateThemeSpecificExamples(theme);
  const hooks = generateScrollStoppingHooks(theme);
  const hook = hooks[Math.floor(Math.random() * hooks.length)];

  const variations = [
    `${triggers.empathy}\n\n実はこれ、知らない人がめちゃくちゃ多い。\n\n${examples[0]}\n\n${triggers.rarity}\n\n今日から${analysis.main}を1つ変えるだけでいい。\nぜひ試してみて！`,
    `正直に言う。\n\n${audience}が${theme}で伸び悩む理由は、努力じゃなくて方向性。\n\n${triggers.loss}\n\n${examples[1]}\n\n今日から意識すること→${analysis.main}\n\n試してみて！`,
    `${hook}\n\n${triggers.curiosity}\n\n実は${Math.random() > 0.5 ? '9割' : '8割'}の人が知らない視点がある。\n\n${examples[0]}\n\nまず今日1つだけやってみて！`,
    `${audience}へ、大事なことを言う。\n\n${triggers.rarity}\n\n${theme}で結果が変わるポイントは${analysis.main}。\n\nこれだけ。やってる人は少ない。\n\n今日から始めて！`,
  ];

  const post = variations[variant % variations.length];
  return post.length > 280 ? post.slice(0, 277) + '…' : post;
};

/**
 * Threads向けの高度な生成 - 共感ストーリー重視
 */
export const generateThreadsPost = (
  theme: string,
  audience: string,
  variant: number = 0
): string => {
  const analysis = analyzeThemeDeep(theme);
  const triggers = generatePsychologicalTriggers(theme, audience);
  const examples = generateThemeSpecificExamples(theme);

  const variations = [
    `${audience}のみなさんへ、正直に話します。\n\n${theme}で結果が出ないとき、ほとんどの場合\n原因は「知識不足」じゃないんです。\n\n実は知らない人が多いんですが\n${triggers.rarity}\n\n具体的には：\n${examples[0]}\n\n①${analysis.expanded[0] || 'まず基礎を理解する'}を意識する\n②${analysis.expanded[1] || '小さく行動する'}を実践する\n③${analysis.expanded[2] || '継続して工夫する'}を続ける\n\n今日から1つだけ試してみてください。\n変化を感じたらぜひ教えてください！`,

    `ちょっと聞いてほしいことがあって。\n\n${triggers.empathy}\n\nそれ、すごくわかる気がします。\n\n${triggers.loss}\n\nでも実は\n${triggers.rarity}\n\n${examples[1]}\n\nこの視点を知ってから変わった人をたくさん見てきました。\n\nあなたも今日から変えられます。\nまず1つだけ動いてみませんか？`,

    `${audience}のあなたに聞きたいんですが。\n\n${theme}って、なんとなくわかってるつもりになってませんか？\n\n${triggers.empathy}\n\nでも${analysis.main}のことを深く知ったとき、全部が変わった。\n\n${examples[0]}\n\nこの事実、知ってましたか？\n\n今日から1つだけ変えてみてください。\n応援してます！`,
  ];

  return variations[variant % variations.length];
};

/**
 * Instagram向けの高度な生成 - 保存される有益情報
 */
export const generateInstagramPost = (
  theme: string,
  audience: string,
  variant: number = 0
): string => {
  const analysis = analyzeThemeDeep(theme);
  const examples = generateThemeSpecificExamples(theme);

  const variations = [
    `📌 ${theme}で成功する人vs失敗する人\n\n❌ 失敗する${audience}\n・${analysis.main}の見え方が狭い\n・${analysis.secondary}を見ていない\n・急いで結果を出そうとする\n\n✅ 成功する${audience}\n・①${analysis.expanded[0]}を意識\n・②${analysis.expanded[1]}を工夫\n・③${analysis.expanded[2]}を継続\n\n🔖保存して見返してください\n\nあなたの成功を応援してます！`,

    `💡 ${theme}で結果を変える3ステップ\n\n▼ステップ1\n${examples[0]}\n\n▼ステップ2\n${examples[1]}\n\n▼ステップ3\n${examples[2]}\n\nこの順番が大事です\n\n✨ ${audience}の多くが\nこの順番を逆にしてます\n\n詳しくはプロフへ\n\n今日から実践してみて！`,

    `【保存版】\n${theme}の基本\n\n${analysis.main}について\n絶対知るべきこと\n\n1️⃣ ${analysis.expanded[0]}\n2️⃣ ${analysis.expanded[1]}\n3️⃣ ${analysis.expanded[2]}\n\nこれだけで\n${theme}のレベルが\n劇的に変わります\n\nブックマーク推奨です♡`,
  ];

  return variations[variant % variations.length];
};

/**
 * YouTube向けの高度な生成 - 視聴者への語りかけ
 */
export const generateYouTubePost = (
  theme: string,
  audience: string,
  variant: number = 0
): string => {
  const analysis = analyzeThemeDeep(theme);
  const triggers = generatePsychologicalTriggers(theme, audience);

  const variations = [
    `こんにちは。\n\nあなたは${theme}について\n本当に理解していますか？\n\n実は${audience}の多くが\n${analysis.main}を\n完全に見落としています\n\nこの動画では\n①${analysis.expanded[0]}について\n②${analysis.expanded[1]}について\n③${analysis.expanded[2]}について\n\n詳しく解説します\n\n最後まで見てください\n\nあなたの変化を期待してます！`,

    `${theme}で${audience}が\n知らずにやってる失敗\n\nそれは\n${triggers.loss}\n\nこの動画では\nその理由と解決策を\n全て話します\n\n${analysis.expanded.slice(0, 3).join(' / ')}\n\nこの3つのポイントを\n理解するだけで\n${theme}のあなたは\n劇的に変わります\n\n高評価よろしくお願いします`,

    `${theme}について\n${audience}へ\n\nこれまで相談をもらった中で\n共通の悩みは\n${analysis.main}なんです\n\nそこで今回は\nその解決方法を\nステップバイステップで\n説明します\n\nチャンネル登録も\n忘れずにね！`,
  ];

  return variations[variant % variations.length];
};

/**
 * note向けの生成 - SEO最適化版・600文字固定
 *
 * SEO対策ルール:
 * - タイトル: メインキーワード左寄せ・数字あり・悩み解決ワード・32文字前後
 * - キーワード: 検索需要が高い3〜5個
 * - メタ: 120文字前後
 * - 冒頭100文字以内にメインキーワード配置
 * - 本文にメインキーワード3回以上挿入
 * - 構成: テーマとは／特徴3選／対処法／まとめ
 */
export const generateNotePost = (
  theme: string,
  audience: string,
  variant: number = 0
): string => {
  const analysis = analyzeThemeDeep(theme);
  const examples = generateThemeSpecificExamples(theme);

  // SEOタイトル（32文字前後・数字あり・悩み解決ワード・メインキーワード左寄せ）
  const titles = [
    `【${theme}】9割が知らない解決策3選と対処法`,
    `${theme}の悩みを解消する3つの方法｜知らないと損`,
    `【保存版】${theme}を解決する3ステップ完全ガイド`,
    `${theme}で失敗する人の特徴3選｜今すぐ改善できます`,
  ];
  const title = titles[variant % titles.length];

  // SEOキーワード（検索需要が高い3〜5個）
  const kw = [...new Set([analysis.main, ...analysis.expanded.slice(0, 3)])].slice(0, 4);

  // メタディスクリプション（120文字前後）
  const metaBase = `${theme}に悩む${audience}向け。${theme}の特徴・原因・対処法を3ステップで解説。${analysis.main}を理解することで${theme}への向き合い方が根本から変わります。`;
  const meta = metaBase.slice(0, 120);

  // 本文（冒頭100文字以内にメインキーワード・構成必須・600字目安）
  const lines = [
    title,
    '',
    `SEOキーワード：${kw.join('・')}`,
    `メタ説明文：${meta}`,
    '',
    '━━━━━━━━━━━━━━',
    '',
    `■ ${theme}とは`,
    '',
    `${theme}とは、${audience}の多くが直面する悩みのひとつです。`,
    `${examples[0]}`,
    '',
    `■ ${theme}の特徴3選`,
    '',
    `① ${analysis.expanded[0] || `${theme}の本質を見誤りやすい`}`,
    `② ${analysis.expanded[1] || `感情に振り回されやすい`}`,
    `③ ${examples[1].slice(0, 35)}`,
    '',
    `■ ${theme}の対処法`,
    '',
    `${theme}を改善するには、まず${analysis.main}を正しく理解することが重要です。`,
    `${examples[2] || `まず現状を正確に把握し、小さく動き出すことが大切です。`}`,
    `${analysis.expanded[2] || `継続的な改善`}を意識することで${theme}は必ず変わります。`,
    '',
    `■ まとめ`,
    '',
    `${theme}は解決できます。`,
    `${analysis.main}を意識して、今日から1つだけ実践してください。`,
  ];

  return lines.join('\n');
};

/**
 * テキストを15文字程度で改行
 */
const formatTikTokText = (text: string): string => {
  const lines = text.split('\n');
  const result: string[] = [];

  for (const line of lines) {
    if (line === '') {
      result.push('');
      continue;
    }

    let start = 0;
    while (start < line.length) {
      result.push(line.slice(start, start + 20));
      start += 20;
    }
  }

  return result.join('\n');
};

/**
 * TikTok向けの生成 - アルゴリズム最適化版・600文字固定
 *
 * アルゴリズム最適化ルール:
 * - 冒頭0.5秒で止まる一文（否定・不安・暴露・男性心理・実は系）
 * - 最初の3行で結論を匂わせる
 * - 1文を短く・改行多め・テンポ重視
 * - 保存率UP：特徴3選・危険サイン・男性心理・見抜き方
 * - コメント誘導を最後に必ず（何個当てはまりました？）
 * - 締めは「気になる人との相性はプロフィールへ👇」で統一
 * - バズりやすいワード：実は／危険／知らないと損／9割 etc.
 */
export const generateTikTokScript = (
  theme: string,
  audience: string,
  variant: number = 0,
  targetLength: number = 600
): string => {
  const analysis = analyzeThemeDeep(theme);
  const examples = generateThemeSpecificExamples(theme);

  // 冒頭0.5秒フック（否定・不安・暴露・男性心理・実は系）
  const openers = [
    `実は${theme}\n9割の人が勘違いしてます`,
    `知らないと損する\n${theme}の真実があります`,
    `${theme}で冷めます\nこの行動してませんか？`,
    `危険⚠️\n${theme}でやってはいけないこと`,
    `ほとんどの女性が\n${theme}で失敗する理由`,
    `男性は${theme}のとき\n本命かどうかこう判断してます`,
  ];
  const opener = openers[variant % openers.length];

  // 最初の3行：結論を匂わせる
  const hints = [
    `これ知らなかったら\n一生損するかも\n正直に言います`,
    `結論から言うと\n${theme}はこれだけで変わります\nちゃんと読んでください`,
    `${theme}に悩んでる人\n全員に見てほしい\n大事なこと話します`,
  ];
  const hint = hints[variant % hints.length];

  // 本文（特徴3選・危険サイン・男性心理・見抜き方）
  const body = [
    opener,
    '',
    hint,
    '',
    `▼${theme}の危険サイン3選`,
    '',
    `①${analysis.expanded[0] || `本音を隠している`}`,
    '',
    `②${examples[0].slice(0, 25)}`,
    '',
    `③${analysis.expanded[1] || `距離感がおかしくなる`}`,
    '',
    `これ当てはまったら要注意🚨`,
    '',
    `▼男性心理から見ると`,
    '',
    `実は男性は${theme}のとき`,
    `${analysis.main}を`,
    `かなり意識してます`,
    '',
    `ほとんどの女性は`,
    `ここを見落としてます`,
    '',
    `▼見抜き方のポイント`,
    '',
    `${examples[1].slice(0, 30)}`,
    '',
    `この視点を持つだけで`,
    `${theme}への`,
    `対応が全然変わります`,
  ].join('\n');

  // コメント誘導 + 締め（固定）
  const cta = [
    '',
    `何個当てはまりました？`,
    `コメントで教えてください👇`,
    '',
    `気になる人との相性はプロフィールへ👇`,
  ].join('\n');

  let result = body + cta;

  // 600文字に足りない場合のみ補足
  if (result.length < targetLength) {
    result = body +
      `\n\n${theme}で悩んでいるなら\nまず${analysis.main}を\n意識してみてください` +
      `\n\nそれだけで結果が変わります` +
      cta;
  }
  if (result.length < targetLength) {
    result = body +
      `\n\n${theme}で悩んでいるなら\nまず${analysis.main}を\n意識してみてください` +
      `\n\nそれだけで結果が変わります` +
      `\n\n実は${examples[2].slice(0, 20)}\nこれが大切なんです` +
      cta;
  }

  return formatTikTokText(result);
};

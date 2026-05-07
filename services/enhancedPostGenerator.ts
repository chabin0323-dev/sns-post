/**
 * 改善版SNS投稿生成エンジン
 * テーマ分析 + 心理トリガー + ランダム性を組み合わせた高度な生成
 */

/**
 * テーマから深いキーワード分析を実行
 */
const analyzeThemeDeep = (theme: string) => {
  const parts = theme.split(/[\s・〜～\-]+/).filter(p => p);

  // キーワード拡張マップ
  const expandedKeywords: Record<string, string[]> = {
    '恋愛': ['感情', '相手の気持ち', 'コミュニケーション', '信頼', '距離感', '心理'],
    '副業': ['スキル', '時間管理', 'マネタイズ', 'マーケティング', '継続', '信頼'],
    'SNS': ['アルゴリズム', 'エンゲージメント', 'フォロワー', 'バイラル', 'コンテンツ', '戦略'],
    'ビジネス': ['戦略', 'リーダーシップ', 'マネジメント', '成長', 'ブランド', 'マインド'],
    '美容': ['自信', 'セルフケア', 'トレンド', 'パーソナルカラー', 'メイク', 'マインド'],
    'ダイエット': ['習慣', '心理', 'リバウンド', 'モチベーション', '栄養', '意識'],
    '学習': ['脳科学', '習慣化', 'モチベーション', '復習', 'アウトプット', '実装'],
  };

  const keywords = [...parts];
  for (const [key, related] of Object.entries(expandedKeywords)) {
    if (theme.includes(key)) {
      keywords.push(...related);
    }
  }

  return {
    main: parts[0] || theme,
    secondary: parts[1] || '',
    tertiary: parts[2] || '',
    expanded: [...new Set(keywords)].slice(0, 5),
  };
};

/**
 * バズ要素の確実な埋め込み：冒頭1行は必ずスクロール停止級
 */
const generateScrollStoppingHooks = (theme: string): string[] => {
  const hooks = [
    `【衝撃】${theme}で失敗してる人、実は${Math.random() > 0.5 ? '80%' : '9割'}}です`,
    `${theme}で気付いていないなら、今すぐ辞めてください`,
    `え、${theme}でこんなことしてたの？`,
    `${theme}で成功する人だけが知ってる秘密`,
    `【重要】${theme}で最初の3ヶ月が全てです`,
    `これだけは絶対に${theme}で失敗してはいけません`,
    `${theme}の本当の理由、知ってましたか？`,
    `多くの人が${theme}を完全に勘違いしています`,
    `【事実】${theme}が変わるのはこのタイミングです`,
    `ほぼ全員が${theme}で同じ失敗をしています`,
  ];
  return hooks;
};

/**
 * 人間らしさを確実に出す
 */
const addHumanTouch = (text: string, theme: string): string => {
  const touches = [
    `実は私も最初${theme}で失敗しました。`,
    `${theme}って、思ってるより難しいんです。`,
    `率直に言うと、${theme}は${Math.random() > 0.5 ? 'めっちゃ大事' : '超重要'}}です。`,
    `${theme}について、本音で話しますね。`,
    `正直、${theme}でうまくいく人は${Math.random() > 0.5 ? '稀' : 'かなり珍しい'}}です。`,
  ];
  
  const touch = touches[Math.floor(Math.random() * touches.length)];
  return `${touch}\n\n${text}`;
};

/**
 * 口語的な表現を自然に混ぜる
 */
const insertCasualLanguage = (text: string): string => {
  const replacements: Record<string, string[]> = {
    'です。': ['です。', 'んです。', 'ですよ。'],
    'ません。': ['ません。', 'てません。'],
    'います。': ['います。', 'ますね。', 'ますよ。'],
    '。': ['。', '、', '…', '！'],
  };

  let result = text;
  for (const [original, options] of Object.entries(replacements)) {
    const regex = new RegExp(original.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    const matches = text.match(regex);
    if (matches) {
      matches.forEach((match, index) => {
        const replacement = options[Math.floor(Math.random() * options.length)];
        result = result.replace(original, replacement, index);
      });
    }
  }
  return result;
};

/**
 * 心理トリガーの埋め込みを生成
 */
const generatePsychologicalTriggers = (
  theme: string,
  audience: string
): Record<string, string> => {
  const triggers = {
    // 好奇心トリガー
    curiosity: [
      `実は${theme}の本当の理由は...`,
      `${theme}で大事なのは実はここ...`,
      `ほとんどの人が知らない${theme}の真実`,
      `${theme}で成功する人だけが知ってること`,
      `え？${theme}ってそういうことだったの？`,
    ],
    // 損失回避トリガー
    loss: [
      `${theme}で知らないままだと、毎日損してます`,
      `${theme}を間違えたままだと、人生で大損します`,
      `${audience}が${theme}で失敗している本当の理由`,
      `今のままだと${audience}は${theme}で後悔します`,
      `${theme}を知らないと、もう戻れません`,
    ],
    // 希少性トリガー
    rarity: [
      `${theme}で成功してる${Math.random() > 0.5 ? '1%' : '一握り'}}だけが使ってる方法`,
      `このやり方、${theme}の${Math.random() > 0.5 ? '業界人' : 'プロ'}}だけが知ってます`,
      `${theme}で本当に効く方法は実は3つだけ`,
      `有名人も使ってる${theme}の秘密`,
    ],
    // 共感トリガー
    empathy: [
      `${audience}ほど、${theme}で${Math.random() > 0.5 ? '頑張ってるのに結果出ない' : '悩んでる'}}`,
      `${audience}が${theme}で陥るあるあるパターン`,
      `${audience}だからこそ${theme}で失敗しやすい理由`,
      `${audience}の多くが${theme}で引っかかるポイント`,
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
      'LINEの返信が遅くなったら脈なし',
      'デート4回目までが勝負ライン',
      '相手と会う頻度は週1-2回が最適',
      'LINE既読無視は脈なしのサイン',
      '告白の成功率は事前準備で70%変わる',
      '付き合うまでの平均期間は6ヶ月',
    ],
    '副業': [
      '副業初心者の80%は最初の3ヶ月で辞める',
      '月5万円稼ぐまでの平均期間は6ヶ月',
      '成功者の90%は継続を重視している',
      '正しい方法なら初月から売上が出る',
      '稼いでる人は月平均20時間を副業に費やす',
    ],
    'SNS': [
      'SNS投稿の反応の80%は最初の1時間に決まる',
      'バズる投稿の冒頭1行は70%クリック率が変わる',
      '同じ内容でも見せ方で反応は3-5倍変わる',
      'フォロワー1000人までの最短期間は3ヶ月',
      '毎日投稿と週3投稿では反応が3倍違う',
    ],
    'ダイエット': [
      'リバウンドする人の95%は急激な食事制限',
      '痩せても太る理由は習慣にある',
      '実は筋肉と脂肪では見た目が全然違う',
      '有酸素運動より筋トレの方が代謝が上がる',
      '健康的に痩せるペースは月2-3kg',
    ],
  };

  const relevant = Object.entries(examples).find(([key]) =>
    theme.includes(key)
  );
  return relevant ? relevant[1].slice(0, 3) : examples['副業'];
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
    // バリエーション1: 衝撃系 - 毎回異なるバージョン
    `${hook}\n\n①${analysis.expanded[0]}\n②${analysis.expanded[1]}\n③${analysis.expanded[2]}\n\nこれ意識するだけで${theme}の結果が全然変わります`,

    // バリエーション2: 数字ベース
    `${examples[0]}\n\n${audience}が${theme}で失敗する理由はこれです\n\n${triggers.loss}\n\n詳しくはプロフへ👇`,

    // バリエーション3: 共感→解決型
    `${triggers.empathy}\n\nそれは${theme}の本質を見落としてるから\n\n実は${Math.random() > 0.5 ? 'シンプル' : '奥が深い'}}んです\n\n続きはプロフで`,

    // バリエーション4: 希少性系 - 完全に異なる視点
    `${triggers.rarity}\n\n${audience}で結果を出すために必要な3つ：\n\n・${examples[1]}\n・${analysis.main}\n・${analysis.secondary}\n\n続きはプロフ👇`,

    // バリエーション5: 質問形式
    `あなたは${theme}で\nこれやってますか？\n\n●${analysis.expanded[0]}\n●${analysis.expanded[1]}\n●${analysis.expanded[2]}\n\nやってない方は\nプロフを今すぐチェック`,

    // バリエーション6: 事実指摘型
    `【事実】\n${theme}で成功する${audience}の\n共通点が分かりました\n\n➀${examples[2]}\n➁${analysis.secondary}\n➂${analysis.tertiary}\n\nプロフで詳細💡`,
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
  const touches = [
    `実は私も同じような悩みがありました。`,
    `正直に言うと、最初${theme}で失敗しました。`,
    `これ、私の実体験なんです。`,
  ];
  const touch = touches[Math.floor(Math.random() * touches.length)];

  const variations = [
    // バリエーション1: ストーリー型
    `${touch}\n\n${theme}について\n${audience}の方ほど\n頑張ってるのに結果が出ないと\n感じてるんじゃないでしょうか\n\n原因は努力不足ではなく\n${analysis.main}の見え方が\nズレてるだけなんです\n\n気づいた時全部変わりました`,

    // バリエーション2: 深掘り型
    `${theme}について\n改めて考えてみました\n\n${triggers.curiosity}\n\n多くの${audience}が\nここを見落としています\n\n①${analysis.expanded[0]}を理解する\n②${analysis.expanded[1]}を実行する\n③${analysis.expanded[2]}を工夫する\n\nこの3つで全部変わる`,

    // バリエーション3: 共感強化型
    `${audience}のあなたへ\n\n${triggers.empathy}\n\nその気持ち\nめっちゃ分かります\n\n実は\n${theme}の${analysis.main}\nの部分が違ってるだけ\n\nそこ気づけば全部変わります`,

    // バリエーション4: 質問形式
    `${theme}で\nこんな悩みありませんか？\n\n・${analysis.main}\n・${analysis.secondary}\n・${analysis.tertiary}\n\n1つでも当てはまったら\n続きを読む価値あります`,

    // バリエーション5: 本音型
    `本音で話しますね\n\n${theme}で多くの人が失敗してるのは\n${triggers.loss}\n\nだからこそ\n${audience}には\nこの3つを知ってほしい`,
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
    // バリエーション1: 対比系
    `📌 ${theme}で成功する人vs失敗する人\n\n❌ 失敗する${audience}\n・${analysis.main}の見え方が狭い\n・${analysis.secondary}を見ていない\n・急いで結果を出そうとする\n\n✅ 成功する${audience}\n・①${analysis.expanded[0]}を意識\n・②${analysis.expanded[1]}を工夫\n・③${analysis.expanded[2]}を継続\n\n🔖保存して見返してください`,

    // バリエーション2: ステップ化
    `💡 ${theme}で結果を変える3ステップ\n\n▼ステップ1\n${examples[0]}\n\n▼ステップ2\n${examples[1]}\n\n▼ステップ3\n${examples[2]}\n\nこの順番が大事です\n\n✨ ${audience}の多くが\nこの順番を逆にしてます\n\n詳しくはプロフへ`,

    // バリエーション3: 保存版
    `【保存版】\n${theme}の${Math.random() > 0.5 ? '5つの' : '3つの'}}基本\n\n${analysis.main}について\n絶対知るべきこと\n\n1️⃣ ${analysis.expanded[0]}\n2️⃣ ${analysis.expanded[1]}\n3️⃣ ${analysis.expanded[2]}\n\nこれだけで\n${theme}のレベルが\n劇的に変わります`,

    // バリエーション4: チェックリスト型
    `☑️ ${theme}チェックリスト\n\n□ ${analysis.expanded[0]}を意識してる\n□ ${analysis.expanded[1]}を工夫してる\n□ ${analysis.expanded[2]}を継続してる\n□ ${examples[0]}\n\n全部チェック入らない方は\nプロフの有益情報をチェック✨`,
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
    // バリエーション1: 問いかけ型
    `こんにちは。\n\nあなたは${theme}について\n本当に理解していますか？\n\n実は${audience}の多くが\n${analysis.main}を\n完全に見落としています\n\nこの動画では\n①${analysis.expanded[0]}について\n②${analysis.expanded[1]}について\n③${analysis.expanded[2]}について\n\n詳しく解説します\n\n${triggers.curiosity}\n\n最後まで見てください`,

    // バリエーション2: 数字・事実系
    `${theme}で${audience}が\n知らずにやってる失敗\n\nそれは\n${triggers.loss}\n\nこの動画では\nその理由と解決策を\n全て話します\n\n${analysis.expanded.slice(0, 3).join(' / ')}\n\nこの3つのポイントを\n理解するだけで\n${theme}のあなたは\n劇的に変わります`,

    // バリエーション3: ストーリー型
    `${theme}について\n${audience}へ\n\nこれまで相談をもらった中で\n共通の悩みは\n${analysis.main}なんです\n\nそこで今回は\nその解決方法を\nステップバイステップで\n説明します\n\n高評価と登録\nお願いします`,

    // バリエーション4: 本音型
    `正直に言います\n\n${theme}で成功する${audience}は\n全員この3つをやってます\n\n➀${analysis.expanded[0]}\n➁${analysis.expanded[1]}\n➂${analysis.expanded[2]}\n\nこれが全てです\n\n詳しくは動画で🎥`,
  ];

  return variations[variant % variations.length];
};

/**
 * note向けの高度な生成 - 読み物としての深掘り
 */
export const generateNotePost = (
  theme: string,
  audience: string,
  variant: number = 0
): string => {
  const analysis = analyzeThemeDeep(theme);
  const examples = generateThemeSpecificExamples(theme);
  const triggers = generatePsychologicalTriggers(theme, audience);

  const variations = [
    // バリエーション1: 論文型
    `## ${theme}について、改めて考えてみた\n\n${audience}の多くは\n${theme}について\n間違った理解をしています\n\n### ${analysis.main}の本質\n\n${triggers.curiosity}\n\nこれを理解することで\n${theme}のレベルは\n劇的に変わります\n\n### 具体的な実装方法\n\n例えば${examples[0]}\n\nここを変えるだけで\n結果は全然違います\n\n### なぜ多くの人が失敗するのか\n\n${triggers.loss}\n\n### おわりに\n\n${audience}のあなただからこそ\nこのポイントが重要です`,

    // バリエーション2: エッセイ型
    `## 『${theme}』で本当に必要なこと\n\n${theme}について\n深く考えたことはありますか？\n\nほとんどの${audience}は\n表面的な情報だけで判断します\n\nでも実は\n${analysis.main}の部分が\nすべてなんです\n\n### 私の経験\n\n${triggers.empathy}\n\nでもある日\n${analysis.expanded[0]}に気づきました\n\n### その気づきから分かったこと\n\n${examples.slice(0, 2).join('\n')}\n\n### ${audience}へのメッセージ\n\n${analysis.main}から\n見直してください`,

    // バリエーション3: データ・観点型
    `## ${theme}の真実：${audience}が気づいていないこと\n\n${triggers.curiosity}\n\n### 背景\n\n${audience}の間で\n${theme}についての\n誤解が多いです\n\n### データが示すこと\n\n${examples[0]}\n${examples[1]}\n\n### 実装ガイド\n\n▶ ${analysis.expanded[0]}\n▶ ${analysis.expanded[1]}\n▶ ${analysis.expanded[2]}\n\n### 最後に\n\n${theme}で成功できます`,
  ];

  return variations[variant % variations.length];
};

/**
 * TikTok向けの高度な生成 - トレンド・若者言葉重視
 */
export const generateTikTokScript = (
  theme: string,
  audience: string,
  variant: number = 0
): string => {
  const analysis = analyzeThemeDeep(theme);
  const examples = generateThemeSpecificExamples(theme);
  const triggers = generatePsychologicalTriggers(theme, audience);
  const hooks = generateScrollStoppingHooks(theme);

  const variations = [
    // バリエーション1: テンポ重視
    `ちょっと待ってください\n\n${theme}で\n失敗してる${audience}\n\nめっちゃ多いです\n\nその理由は\n\n${analysis.main}\nがズレてるから\n\nでも実は\n成功してる人は\n全員同じことをやってます\n\n1つ目\n${analysis.expanded[0]}\n\n2つ目\n${analysis.expanded[1]}\n\n3つ目\n${analysis.expanded[2]}\n\nたったこれだけです\n\nプロフをチェック👇`,

    // バリエーション2: ストーリー型
    `${audience}のあなたへ\n\n${theme}について\n知ってますか？\n\n実は\n${triggers.empathy}\n\nそれはな\n\n${analysis.main}\nの見え方が\nズレてるだけ\n\n${examples[0]}\n\nここが全てです\n\nプロフで\n詳しく説明してるので\n\nチェック👇`,

    // バリエーション3: トレンド意識型
    `${theme}について\n\n知ってますか\n\nほとんどの人は\n${analysis.main}をミスってます\n\nでも\n${analysis.secondary || '正しい'}}方法を\nやるだけで\n\n人生が\n\nマジで変わります\n\n今日から\n試してみてください\n\nプロフをタップ👇`,

    // バリエーション4: 質問形式
    `あなたは\n${theme}で\nこれやってますか？\n\n✓ ${examples[0]}\n✓ ${analysis.main}\n✓ ${analysis.secondary}\n\nやってない方は\nマジで損してます\n\n詳細はプロフから🔥`,

    // バリエーション5: 若者言葉を駆使
    `マジで重要\n\n${theme}について\n\nやってる人と\nやってない人で\n\n人生変わります\n\nノーマジです\n\n${examples[1]}\n\nこれ本当です\n\nプロフで詳しく\n\n👇👇👇`,
  ];

  return variations[variant % variations.length];
};

/**
 * 心理トリガーの埋め込みを生成
 */
const generatePsychologicalTriggers = (
  theme: string,
  audience: string
): Record<string, string> => {
  const triggers = {
    // 好奇心トリガー
    curiosity: [
      `実は${theme}の本当の理由は...`,
      `${theme}で大事なのは実はここ...`,
      `ほとんどの人が知らない${theme}の真実`,
      `${theme}で成功する人だけが知ってること`,
    ],
    // 損失回避トリガー
    loss: [
      `${theme}で知らないままだと、毎日損してます`,
      `${theme}を間違えたままだと、人生で〇〇円損します`,
      `${audience}が${theme}で失敗している理由は...`,
      `今のままだと${audience}は${theme}で後悔します`,
    ],
    // 希少性トリガー
    rarity: [
      `${theme}で成功してる${Math.random() > 0.5 ? '1%' : '一握り'}だけが使ってる方法`,
      `このやり方、${theme}の${Math.random() > 0.5 ? '業界人' : 'プロ'}}だけが知ってます`,
      `${theme}で本当に効く方法は実は3つだけ`,
    ],
    // 共感トリガー
    empathy: [
      `${audience}ほど、${theme}で${Math.random() > 0.5 ? '頑張ってるのに結果出ない' : '悩んでる'}}`,
      `${audience}が${theme}で陥るあるあるパターン`,
      `${audience}だからこそ${theme}で失敗しやすい理由`,
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
      'LINEの返信が遅くなったら脈なし',
      'デート4回目までが勝負ライン',
      '相手と会う頻度は週1-2回が最適',
      'LINE既読無視は脈なしのサイン',
      '告白の成功率は事前準備で70%変わる',
    ],
    '副業': [
      '副業初心者の80%は最初の3ヶ月で辞める',
      '月5万円稼ぐまでの平均期間は6ヶ月',
      '成功者の90%は継続を重視している',
      '正しい方法なら初月から売上が出る',
    ],
    'SNS': [
      'SNS投稿の反応の80%は最初の1時間に決まる',
      'バズる投稿の冒頭1行は70%クリック率が変わる',
      '同じ内容でも見せ方で反応は3-5倍変わる',
      'フォロワー1000人までの最短期間は3ヶ月',
    ],
    'ダイエット': [
      'リバウンドする人の95%は急激な食事制限',
      '痩せても太る理由は習慣にある',
      '実は筋肉と脂肪では見た目が全然違う',
      '有酸素運動より筋トレの方が代謝が上がる',
    ],
  };

  const relevant = Object.entries(examples).find(([key]) =>
    theme.includes(key)
  );
  return relevant ? relevant[1].slice(0, 3) : examples['副業'];
};

/**
 * X向けの高度な生成
 */
export const generateXPost = (
  theme: string,
  audience: string,
  variant: number = 0
): string => {
  const analysis = analyzeThemeDeep(theme);
  const triggers = generatePsychologicalTriggers(theme, audience);
  const examples = generateThemeSpecificExamples(theme);

  const variations = [
    // バリエーション1: 衝撃系
    `${triggers.curiosity}\n\n${audience}の多くが${theme}で\n同じミスをしています\n\n①${analysis.expanded[0]}\n②${analysis.expanded[1]}\n③${analysis.expanded[2]}\n\nこの3つを変えるだけで\n${theme}の結果は劇的に変わります`,

    // バリエーション2: 数字系
    `${examples[0]}\n\n${audience}が${theme}で\n気付いていないこと\n\n${triggers.loss}\n\nだからこそ\n①${analysis.main}\n②${analysis.secondary}\n③${analysis.tertiary}を\n見直す必要があります`,

    // バリエーション3: 共感→解決系
    `${triggers.empathy}\n\nそれは${audience}が\n${theme}の\n本質を見落としてるから\n\n実は${Math.random() > 0.5 ? 'シンプル' : '奥が深い'}んです\n\n続きはプロフへ👇`,

    // バリエーション4: 希少性系
    `${triggers.rarity}\n\n${audience}で成功するために\n実装すべき3つ：\n\n・${analysis.expanded[0]}\n・${analysis.expanded[1]}\n・${analysis.expanded[2]}\n\nこれが全てです`,
  ];

  const post = variations[variant % variations.length];
  return post.length > 280 ? post.slice(0, 277) + '…' : post;
};

/**
 * Threads向けの高度な生成
 */
export const generateThreadsPost = (
  theme: string,
  audience: string,
  variant: number = 0
): string => {
  const analysis = analyzeThemeDeep(theme);
  const triggers = generatePsychologicalTriggers(theme, audience);

  const variations = [
    // バリエーション1: ストーリー型
    `実は私も同じような悩みがありました。\n\n${theme}について\n${audience}の方ほど\n頑張ってるのに結果が出ないと\n感じてるんじゃないでしょうか\n\n原因は努力不足ではなく\n${analysis.main}の見え方が\nズレてるだけなんです\n\n気づいた時\n全部変わりました`,

    // バリエーション2: 深掘り型
    `${theme}について\n改めて考えてみました\n\n${triggers.curiosity}\n\n多くの${audience}が\nここを見落としています\n\n①${analysis.expanded[0]}を理解する\n②${analysis.expanded[1]}を実行する\n③${analysis.expanded[2]}を工夫する\n\nこの3つを同時に意識してる人だけが\n${theme}で成功しています`,

    // バリエーション3: 共感強化型
    `${audience}のあなたへ\n\n${triggers.empathy}\n\nその気持ち\nめちゃくちゃ分かります\n\nでもそれって\n実は\n\n${theme}の\n${analysis.main}\nの部分が\n違ってるだけなんです\n\n気付きさえすれば\n全部変わります`,
  ];

  return variations[variant % variations.length];
};

/**
 * Instagram向けの高度な生成
 */
export const generateInstagramPost = (
  theme: string,
  audience: string,
  variant: number = 0
): string => {
  const analysis = analyzeThemeDeep(theme);
  const examples = generateThemeSpecificExamples(theme);

  const variations = [
    // バリエーション1: 対比系
    `📌 ${theme}で成功する人vs失敗する人\n\n❌ 失敗する${audience}\n${analysis.main}の見え方が狭い\n${analysis.secondary}を見ていない\n急いで結果を出そうとする\n\n✅ 成功する${audience}\n①${analysis.expanded[0]}を意識\n②${analysis.expanded[1]}を工夫\n③${analysis.expanded[2]}を継続\n\nその差はここです\n\n🔖保存してあとで見返してください`,

    // バリエーション2: ステップ化
    `💡 ${theme}で結果を変える3ステップ\n\n▼ステップ1\n${examples[0]}\n\n▼ステップ2\n${examples[1]}\n\n▼ステップ3\n${examples[2]}\n\nこの順番で\n実装してください\n\n✨ ${audience}の多くが\nこの順番を逆にしています\n\n詳しくはプロフへ`,

    // バリエーション3: 保存版
    `【保存版】\n${theme}の基本\n\n${analysis.main}について\n必ず知るべき${Math.random() > 0.5 ? '5つ' : '3つ'}のこと\n\n1️⃣ ${analysis.expanded[0]}\n2️⃣ ${analysis.expanded[1]}\n3️⃣ ${analysis.expanded[2]}\n\nこれだけで\n${theme}のレベルが\n劇的に変わります\n\n今日から実践できます`,
  ];

  return variations[variant % variations.length];
};

/**
 * YouTube向けの高度な生成
 */
export const generateYouTubePost = (
  theme: string,
  audience: string,
  variant: number = 0
): string => {
  const analysis = analyzeThemeDeep(theme);
  const triggers = generatePsychologicalTriggers(theme, audience);

  const variations = [
    // バリエーション1: 問いかけ型
    `こんにちは。\n\nあなたは${theme}について\n本当に理解していますか？\n\n実は${audience}の多くが\n${analysis.main}を\n完全に見落としています\n\nこの動画では\nその見落としを補うために\n\n①${analysis.expanded[0]}について\n②${analysis.expanded[1]}について\n③${analysis.expanded[2]}について\n\n詳しく解説します\n\n${triggers.curiosity}\n\n最後まで見てください`,

    // バリエーション2: 数字・事実系
    `${theme}で${audience}が\n知らずにやってる失敗\n\nそれは\n${triggers.loss}\n\nこの動画では\nその理由と\n解決策を\n全て話します\n\n${analysis.expanded.join(' / ')}\n\nこの3つのポイントを\n理解することで\n${theme}のあなたは\n劇的に変わります\n\nぜひ最後までご覧ください`,

    // バリエーション3: 構造化型
    `${theme}について\n${audience}へ\n\nこれまで多くの方から\n相談をもらってきました\n\n共通の悩みは\n${analysis.main}なんです\n\nそこで今回は\nその解決方法を\nステップバイステップで\n説明します\n\n▶ ${analysis.expanded[0]}\n▶ ${analysis.expanded[1]}\n▶ ${analysis.expanded[2]}\n\n高評価と登録\nお願いします`,
  ];

  return variations[variant % variations.length];
};

/**
 * note向けの高度な生成
 */
export const generateNotePost = (
  theme: string,
  audience: string,
  variant: number = 0
): string => {
  const analysis = analyzeThemeDeep(theme);
  const examples = generateThemeSpecificExamples(theme);
  const triggers = generatePsychologicalTriggers(theme, audience);

  const variations = [
    // バリエーション1: 論文型
    `## ${theme}について、改めて考えてみた\n\n${audience}の多くは\n${theme}について\n間違った理解をしています\n\n### ${analysis.main}の本質\n\n${triggers.curiosity}\n\nこれを理解することで\n${theme}のレベルは\n劇的に変わります\n\n### 具体的な実装方法\n\n例えば${examples[0]}\n\nここを変えるだけで\n結果は全然違います\n\n### なぜ多くの人が失敗するのか\n\n${triggers.loss}\n\n### おわりに\n\n${audience}のあなただからこそ\nこのポイントが\n重要です\n\n今日から1つ\n試してみてください`,

    // バリエーション2: エッセイ型
    `## 『${theme}』で本当に必要なこと\n\n${theme}について\n深く考えたことはありますか？\n\nほとんどの${audience}は\n表面的な情報だけで\n判断してしまいます\n\nでも実は\n${analysis.main}の部分が\nすべてなんです\n\n### 私の経験\n\nかつて私も\n${triggers.empathy}\n\nでもある日\n${analysis.expanded[0]}に気づきました\n\n### その気づきから分かったこと\n\n${examples.slice(0, 2).join('\n')}\n\n### ${audience}へのメッセージ\n\nもし${theme}で\n悩んでいるなら\n\n${analysis.main}から\n見直してください\n\nそれがすべてです`,

    // バリエーション3: データ/観点型
    `## ${theme}の真実：${audience}が気づいていないこと\n\n${trigger.curiosity}\n\n### 背景\n\n${audience}の間で\n${theme}についての\n誤解が多いです\n\n### データが示すこと\n\n${examples[0]}\n${examples[1]}\n\nこれらのデータから分かるのは\n${analysis.main}の重要性です\n\n### 実装ガイド\n\n▶ ${analysis.expanded[0]}\n▶ ${analysis.expanded[1]}\n▶ ${analysis.expanded[2]}\n\nこの順番が大事です\n\n### 最後に\n\n${audience}だからこそ\n${theme}で成功できます\n\nまずは1つ試してください`,
  ];

  return variations[variant % variations.length];
};

/**
 * TikTok向けの高度な生成
 */
export const generateTikTokScript = (
  theme: string,
  audience: string,
  variant: number = 0
): string => {
  const analysis = analyzeThemeDeep(theme);
  const examples = generateThemeSpecificExamples(theme);
  const triggers = generatePsychologicalTriggers(theme, audience);

  const variations = [
    // バリエーション1: テンポ重視
    `ちょっと待ってください\n\n${theme}で\n失敗してる${audience}\n\nめっちゃ多いです\n\nその理由は\n\n${analysis.main}\nがズレてるから\n\nでも実は\n成功してる人は\n全員同じことをやってます\n\n1つ目\n${analysis.expanded[0]}\n\n2つ目\n${analysis.expanded[1]}\n\n3つ目\n${analysis.expanded[2]}\n\nたったこれだけです\n\nでも\nほとんどの人は\nここで止まります\n\nだから結果が出ない\n\n逆に\nここを続けた人だけが\n${theme}で成功してます\n\nまず1つやってみてください\n\nプロフをチェック👇`,

    // バリエーション2: ストーリー型
    `${audience}のあなたへ\n\n${theme}について\n知ってますか？\n\n実は\n${triggers.empathy}\n\nそれはな\n\n${analysis.main}\nの見え方が\nズレてるだけ\n\n${examples[0]}\n\n実はここが\n全てなんです\n\nプロはみんなこれ\n知ってます\n\nやり方を\nプロフで\n詳しく説明してるので\n\nチェックしてみてください\n\n👇\n\nプロフをタップ`,

    // バリエーション3: トレンド意識型
    `${theme}について\n\n知ってますか\n\nほとんどの人は\n${analysis.main}をミスってます\n\nでも\n${analysis.secondary || '正しい'}}方法を\nやるだけで\n\n${audience}の人生\n\nマジで変わります\n\n本当です\n\n${analysis.expanded[0]}\n${analysis.expanded[1]}\n${analysis.expanded[2]}\n\nこの3つ\n\n今日から\nやってみて\n\nプロフを\nチェック\n\n👇`,
  ];

  return variations[variant % variations.length];
};

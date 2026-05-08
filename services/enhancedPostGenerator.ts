/**
 * 改善版SNS投稿生成エンジン
 * テーマ分析 + 心理トリガー + ランダム性を組み合わせた高度な生成
 */

/**
 * テーマから深いキーワード分析を実行
 */
const analyzeThemeDeep = (theme: string) => {
  const parts = theme.split(/[\s・〜～\-]+/).filter(p => p);

  const expandedKeywords: Record<string, string[]> = {
    '恋愛': ['感情', '相手の気持ち', 'コミュニケーション', '信頼', '距離感', '心理', '告白', 'デート', 'LINE', '脈あり', '脈なし'],
    '副業': ['スキル', '時間管理', 'マネタイズ', 'マーケティング', '継続', '信頼', 'ブログ', 'アフィリエイト', 'SNS', '収益化', 'モチベーション'],
    'SNS': ['アルゴリズム', 'エンゲージメント', 'フォロワー', 'バイラル', 'コンテンツ', '戦略', '投稿', 'ハッシュタグ', 'ストーリー', 'リール', '分析'],
    'ビジネス': ['戦略', 'リーダーシップ', 'マネジメント', '成長', 'ブランド', 'マインド', '営業', 'マーケティング', 'チーム', '目標', '成果'],
    '美容': ['自信', 'セルフケア', 'トレンド', 'パーソナルカラー', 'メイク', 'マインド', 'スキンケア', 'ヘアケア', 'ファッション', '健康', '美意識'],
    'ダイエット': ['習慣', '心理', 'リバウンド', 'モチベーション', '栄養', '意識', '運動', '食事', 'カロリー', '筋肉', 'メンタル'],
    '学習': ['脳科学', '習慣化', 'モチベーション', '復習', 'アウトプット', '実装', '記憶', '集中', '計画', '効率', '成長'],
    '健康': ['睡眠', 'ストレス', '免疫', '運動', '栄養', 'メンタル', '習慣', '予防', '回復', 'ライフスタイル', 'バランス'],
    'お金': ['貯金', '投資', '節約', '資産', '収入', '支出', 'ファイナンシャル', 'リテラシー', 'リスク', '計画', '自由'],
    '人間関係': ['コミュニケーション', '信頼', '境界線', '共感', '対立', '解決', '友情', '家族', '職場', '社交', '感情'],
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
    expanded: [...new Set(keywords)].slice(0, 8), // 増やす
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
      `${theme}で成功してる${Math.random() > 0.5 ? '1%' : '一握り'}}だけが使ってる方法`,
      `このやり方、${theme}の${Math.random() > 0.5 ? '業界人' : 'プロ'}}だけが知ってます`,
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
      `${audience}ほど、${theme}で${Math.random() > 0.5 ? '頑張ってるのに結果出ない' : '悩んでる'}}`,
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
      'LINEの返信が遅くなったら脈なしの確率は70%',
      'デート4回目までが勝負ライン（成功率80%）',
      '相手と会う頻度は週1-2回が最適（データより）',
      'LINE既読無視は脈なしのサイン（9割のケース）',
      '告白の成功率は事前準備で70%変わる',
      '初デートで話す話題は過去の失敗談が効果的',
      '相手の趣味を事前に調べておくと好感度20%アップ',
    ],
    '副業': [
      '副業初心者の80%は最初の3ヶ月で辞める',
      '月5万円稼ぐまでの平均期間は6ヶ月',
      '成功者の90%は継続を重視している',
      '正しい方法なら初月から売上が出る',
      'SNS副業の成功率は戦略次第で50%変わる',
      'ブログの収益化には最低100記事が必要',
      'アフィリエイトの平均クリック率は2-3%',
    ],
    'SNS': [
      'SNS投稿の反応の80%は最初の1時間に決まる',
      'バズる投稿の冒頭1行は70%クリック率が変わる',
      '同じ内容でも見せ方で反応は3-5倍変わる',
      'フォロワー1000人までの最短期間は3ヶ月',
      'ハッシュタグの最適数は8-12個',
      'ストーリーの視聴完了率は60秒以内にフックが必要',
      'リールのエンゲージメント率は音楽次第で2倍違う',
    ],
    'ビジネス': [
      '新規事業の成功率はアイデアより実行力が80%',
      'チームの生産性はリーダーのコミュニケーションで50%変わる',
      '営業の成約率はフォローアップで30%向上',
      'ブランド価値は顧客体験で決まる（データより）',
      '成長企業の90%は目標設定を明確にしている',
      'ミーティングの効率は事前準備で2倍向上',
    ],
    '美容': [
      'スキンケアの効果は継続3ヶ月で実感（80%）',
      'メイクの印象は眉毛で60%決まる',
      'パーソナルカラーの適合で自信が20%アップ',
      'ヘアケアの失敗はシャンプー選びで70%防げる',
      'ファッションの満足度は体型理解で50%向上',
      '美意識が高い人は幸福度が30%高い',
    ],
    'ダイエット': [
      'リバウンドの原因は80%が食事制限の失敗',
      '運動習慣の定着率は週3回以上で70%',
      'カロリー制限より質の良い食事が大事',
      'モチベーション維持には目標設定が鍵',
      '筋肉量を増やすと基礎代謝が20%アップ',
      '睡眠不足でダイエット効率が40%低下',
    ],
    '学習': [
      '復習のタイミングは1日後・1週間後・1ヶ月後',
      'アウトプットの効果は記憶定着率75%向上',
      '集中力の持続時間は25分が最適',
      '脳の学習効率は朝8-10時がピーク',
      '言語学習の成功率は毎日15分継続で80%',
      'テスト前の睡眠で記憶力が20%向上',
    ],
    '健康': [
      '睡眠7-8時間が免疫力を30%向上',
      'ストレス解消で心臓病リスク50%低下',
      '運動習慣で寿命が5-10年延びる',
      '野菜5皿でがんリスク20%減少',
      '笑うことでストレスホルモンが40%減る',
      '早寝早起きで生産性が20%アップ',
    ],
    'お金': [
      '貯金の成功率は自動積立で80%向上',
      '投資の複利効果で10年で資産2倍',
      '節約の最大効果は固定費削減',
      'ファイナンシャルリテラシーの高い人は資産2倍',
      '借金の利息は年利15%で雪だるま式増加',
      '保険の見直しで年間支出20%削減可能',
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
  return relevant ? relevant[1].slice(0, 5) : examples['副業']; // 増やす
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
    `${hook}\n\n①${analysis.expanded[0]}\n②${analysis.expanded[1]}\n③${analysis.expanded[2]}\n\nこれ意識するだけで${theme}の結果が全然変わります\n\n${audience}のあなた、試してみて！`,
    `${examples[0]}\n\n${audience}が${theme}で失敗する理由はこれです\n\n${triggers.loss}\n\n詳しくはプロフへ👇\n\nマジで知らないと損するよ`,
    `${triggers.empathy}\n\nそれは${theme}の本質を見落としてるから\n\n実は${Math.random() > 0.5 ? 'シンプル' : '奥が深い'}}んです\n\n続きはプロフで\n\nびっくりすると思う！`,
    `${triggers.rarity}\n\n${audience}で結果を出すために必要な3つ：\n\n・${examples[1]}\n・${analysis.main}\n・${analysis.secondary}\n\n続きはプロフ👇\n\n今すぐチェックして！`,
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

  const variations = [
    `実は私も同じような悩みがありました。\n\n${theme}について\n${audience}の方ほど\n頑張ってるのに結果が出ないと\n感じてるんじゃないでしょうか\n\n原因は努力不足ではなく\n${analysis.main}の見え方が\nズレてるだけなんです\n\n気づいた時全部変わりました\n\nあなたもきっと大丈夫だよ`,

    `${theme}について\n改めて考えてみました\n\n${triggers.curiosity}\n\n多くの${audience}が\nここを見落としています\n\n①${analysis.expanded[0]}を意識する\n②${analysis.expanded[1]}を実行する\n③${analysis.expanded[2]}を工夫する\n\nこの3つで全部変わる\n\n一緒に試してみませんか？`,

    `${audience}のあなたへ\n\n${triggers.empathy}\n\nその気持ち\nめっちゃ分かります\n\n実は\n${theme}の${analysis.main}\nの部分が違ってるだけ\n\nそこ気づけば全部変わります\n\n応援してるよ！`,
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
    `## ${theme}について、改めて考えてみた\n\n${audience}の多くは\n${theme}について\n間違った理解をしています\n\n### ${analysis.main}の本質\n\n${triggers.curiosity}\n\nこれを理解することで\n${theme}のレベルは\n劇的に変わります\n\n### 具体的な実装方法\n\n例えば${examples[0]}\n\nここを変えるだけで\n結果は全然違います\n\n### なぜ多くの人が失敗するのか\n\n${triggers.loss}\n\nあなたはどう思いますか？`,

    `## 『${theme}』で本当に必要なこと\n\n${theme}について\n深く考えたことはありますか？\n\nほとんどの${audience}は\n表面的な情報だけで判断します\n\nでも実は\n${analysis.main}の部分が\nすべてなんです\n\n### 私の経験\n\n${triggers.empathy}\n\nでもある日\n${analysis.expanded[0]}に気づきました\n\nその瞬間、すべてが変わりました`,

    `## ${theme}の真実：${audience}が気づいていないこと\n\n${triggers.curiosity}\n\n### 背景\n\n${audience}の間で\n${theme}についての\n誤解が多いです\n\n### データが示すこと\n\n${examples[0]}\n${examples[1]}\n\n### 実装ガイド\n\n▶ ${analysis.expanded[0]}\n▶ ${analysis.expanded[1]}\n▶ ${analysis.expanded[2]}\n\nこれであなたも変われるはずです`,
  ];

  return variations[variant % variations.length];
};

/**
 * TikTok向けの高度な生成 - トレンド・若者言葉重視
 */
export const generateTikTokScript = (
  theme: string,
  audience: string,
  variant: number = 0,
  targetLength: number = 500
): string => {
  const analysis = analyzeThemeDeep(theme);
  const examples = generateThemeSpecificExamples(theme);
  const triggers = generatePsychologicalTriggers(theme, audience);

  const baseVariations = [
    `${audience}のあなたへ\n\n${theme}について本当に理解していますか？\n\n実は${audience}の多くが${analysis.main}を完全に見落としています。\n\n${triggers.empathy}\n\nその気持ち、めっちゃ分かります。\n\n${analysis.main}の見え方がズレてるだけで全部変わるんです。\n\n具体的な例：${examples[0]}\n\nこれが全ての始まりです。\n\nもう1つの重要ポイント：${analysis.expanded[1]}\n\n${audience}はここを見落とす傾向があります。\n\nしかし成功する人は必ずこれをやってます。\n\nだから結果が大きく変わるんです。\n\n最後のポイント：${analysis.expanded[2]}\n\n今日からこれを意識するだけで、${theme}への向き合い方が変わります。`,

    `ちょっと待ってください。\n\n${theme}について${audience}の多くが大きな勘違いをしています。\n\nどういうことか？\n\n${theme}で失敗する人の共通点。\nそれは${analysis.main}の理解が浅いこと。\n\n${triggers.loss}\n\nそれは本当です。\n\n実は${audience}が${theme}で成功するには3つの要素が必要なんです。\n\n1つ目：${analysis.expanded[0]}を深く理解する\n\n2つ目：${analysis.expanded[1]}を実装する\n\n3つ目：${analysis.expanded[2]}を継続する\n\nこの3つです。\n\n具体的な例がこちら：${examples[1]}\n\nこれが成功する人と失敗する人の決定的な分かれ道なんです。\n\n今日からやってみてください。`,

    `${theme}について知ってますか？\n\n${triggers.curiosity}\n\nほとんどの${audience}は${analysis.main}をミスってます。\n\nでもそれって当たり前なんです。\n\n誰も教えてくれないから。\n\n実は${theme}の本質は${analysis.secondary || '意外とシンプル'}なんです。\n\nではどうするのか？\n\n${examples[2]}\n\nこれが答えです。\n\nさらに深掘りすると${triggers.rarity}\n\n本当のところです。\n\n${audience}で成功する人は全員この視点を持ってます。\n\n心理的なポイント：${analysis.expanded[3]}\n\nこれが無意識に行動を変えさせるんです。\n\n今日から試してみてください。`,

    `${audience}さんへ\n\n${theme}で成功する人と失敗する人。\n\nその差は何だと思いますか？\n\n答えは${analysis.main}へのアプローチの違いなんです。\n\n失敗する人：表面的な情報だけで判断\n\n成功する人：本質を理解した上で行動\n\n${triggers.empathy}\n\nその通りです。\n\nでは本質とは何か？\n\n${examples[0]}に隠されています。\n\nさらに言うと${analysis.expanded[0]}が非常に重要なんです。\n\nこれを知ると${theme}への見方が大きく変わります。\n\nそして実装する際は${analysis.expanded[1]}このポイントを押さえることが大切です。\n\n最後に${analysis.expanded[2]}これを継続することです。\n\nこの3段階で${audience}は必ず成功します。\n\nまずはこのポイントを試してみてください。`,
  ];

  // TikTokスクリプト生成の第1ステップ
  const baseText = baseVariations[variant % baseVariations.length];
  const minLength = targetLength;
  
  // 指定文字数に達するまで段階的に拡張
  let result = baseText;
  
  // ステップ1：拡張フレーズを追加
  if (result.length < minLength) {
    const extension1 = `\n\nこの${theme}のポイントをさらに詳しく説明します。\n\n${examples[0]}の具体的な方法を知ることで、${audience}の${theme}への理解度は劇的に変わります。`;
    result += extension1;
  }
  
  // ステップ2：根本的な理由を追加
  if (result.length < minLength) {
    const extension2 = `\n\n次に、よくある失敗の理由をもう少し掘り下げます。\n\nほとんどの場合、${analysis.main}が正しく理解されていないことが原因です。\n\n${triggers.loss}ということが多いのです。`;
    result += extension2;
  }
  
  // ステップ3：心理的側面を追加
  if (result.length < minLength) {
    const extension3 = `\n\n心理的な観点からも重要なポイントがあります。\n\n${analysis.expanded[3]}この意識が行動を変えるきっかけになるんです。\n\n多くの成功者は無意識にこれを実行しています。`;
    result += extension3;
  }
  
  // ステップ4：実装ガイドを追加
  if (result.length < minLength) {
    const extension4 = `\n\n実際の場面では、この考え方をどう活かすかが重要です。\n\n${analysis.expanded[0]}と${analysis.expanded[1]}を組み合わせることで、さらに理解が深まります。\n\n今からでも遅くありません。実装してみてください。`;
    result += extension4;
  }
  
  // ステップ5：最終確認フレーズ
  if (result.length < minLength) {
    const extension5 = `\n\nこの内容をもとに、次の行動を考えてみてください。\n\n${theme}における${analysis.secondary || 'あなたの'}アプローチを根本から見直すチャンスです。\n\n成功までの道のりは、小さな気づきと行動の積み重ねから始まります。`;
    result += extension5;
  }
  
  // ステップ6：最後のCTA
  if (result.length < minLength) {
    result += `\n\n覚えておいてください。${audience}が${theme}で成功するために必要なのは、完璧な理論ではなく、正しい理解に基づいた実行です。\n\n今日から試してみてください。`;
  }

  // 指定文字数を超えた場合はトリム
  if (result.length > targetLength) {
    return result.slice(0, targetLength).trimEnd();
  }

  // まだ短い場合は句点で埋める
  if (result.length < minLength) {
    return result.padEnd(minLength, '。');
  }

  return result;
};

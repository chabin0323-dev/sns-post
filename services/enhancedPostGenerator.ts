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
    `${hook}\n\n①${analysis.expanded[0] || '重要なポイント'}\n②${analysis.expanded[1] || 'もう一つの視点'}\n③${analysis.expanded[2] || '最後の秘訣'}\n\nこれ意識するだけで${theme}の結果が全然変わります\n\n${audience}のあなた、試してみて！`,
    `${examples[0]}\n\n${audience}が${theme}で失敗する理由はこれです\n\n${triggers.loss}\n\n詳しくはプロフへ👇\n\nマジで知らないと損するよ`,
    `${triggers.empathy}\n\nそれは${theme}の本質を見落としてるから\n\n実は${Math.random() > 0.5 ? 'シンプル' : '奥が深い'}んです\n\n続きはプロフで\n\nびっくりすると思う！`,
    `${triggers.rarity}\n\n${audience}で結果を出すために必要な3つ：\n\n・${examples[1] || 'まずは基礎理解'}\n・${analysis.main}\n・${analysis.secondary || '継続する姿勢'}\n\n続きはプロフ👇\n\n今すぐチェックして！`,
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

    `${theme}について\n改めて考えてみました\n\n${triggers.curiosity}\n\n多くの${audience}が\nここを見落としています\n\n①${analysis.expanded[0] || '大事なポイント'}を意識する\n②${analysis.expanded[1] || '次に大切なこと'}を実行する\n③${analysis.expanded[2] || '最後の仕上げ'}を工夫する\n\nこの3つで全部変わる\n\n一緒に試してみませんか？`,

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
  const hooks = generateScrollStoppingHooks(theme);
  const hook = hooks[Math.floor(Math.random() * hooks.length)];

  const variations = [
    `# ${hook}

## はじめに

${audience}のあなたへ。

${theme}について、本気で学んだことはありますか？

多くの人は表面的な情報だけで判断してしまいます。でも実は、${analysis.main}の部分こそが最も重要なんです。

## 問題提起：なぜ失敗するのか

${triggers.loss}

これは単なる知識不足ではありません。むしろ、間違った理解によるものなのです。

${examples[0] || `${theme}で成功するには、正しい基礎が必須です`}

## 共感：あなたの気持ちはわかります

${triggers.empathy}

その気持ち、とても理解できます。${theme}は簡単ではないからです。

しかし、ここから先が重要です。

## 解決策：本当にやるべきこと

### ステップ1：${analysis.main}を正しく理解する

${analysis.expanded[0] || `${theme}の本質を理解することが第一歩です`}

### ステップ2：具体的に実行する

${examples[1] || `実装なくして成功なし。毎日少しずつ前に進むことが重要です`}

### ステップ3：継続して工夫する

${analysis.expanded[1] || `一度成功したら終わりではなく、常に改善を意識してください`}

## 成功事例

実は${triggers.rarity}

このアプローチで変わった人たちがいます。

- ${audience}が${theme}で成果を出す
- 3ヶ月継続で目に見える結果
- 周囲の反応も劇的に変わる

## まとめ：今から始めるべき理由

${theme}であなたが成功するために必要なのは、完璧な理論ではなく、正しい理解に基づいた実行です。

今この瞬間から、行動を変えてみてください。

あなたの${theme}は、今日から変わります。`,

    `# ${hook}

${audience}の多くが${theme}で同じ失敗をしています。

その理由は、シンプルです。

## なぜ失敗するのか

${triggers.loss}

## 本当の原因

${analysis.main}について、深く考えたことはありますか？

ほとんどの人は「何となく」理解しているつもりです。

でも実は、その「何となく」こそが失敗の原因なのです。

## 成功者との決定的な違い

${triggers.rarity}

成功する${audience}は何が違うのか？

- ${analysis.expanded[0] || `${theme}の本質を理解している`}
- ${analysis.expanded[1] || `小さな改善を続けている`}
- ${analysis.expanded[2] || `長期的な視点を持っている`}

たったこれだけです。

## 実装ガイド

### 今週やること
${examples[0] || '基本を確認する'}

### 来週やること
${examples[1] || '小さく実行してみる'}

### 1ヶ月後の目標
${examples[2] || '習慣として定着させる'}

## あなたへのメッセージ

${triggers.empathy}

その気持ちを大切にしながら、一歩踏み出してみてください。

${theme}はあなたが思うほど難しくありません。

正しい方法と継続があれば、必ず結果は出ます。

今日から、始めましょう。`,
  ];

  return variations[variant % variations.length];
};

/**
 * テキストを15文字程度で改行
 */
const formatTikTokText = (text: string): string => {
  // 句点（。、！？）で分割して自然な改行を作る
  let result = text;
  
  // 複数の句点が続く場合は1つに統一
  result = result.replace(/[。、！？]+/g, (match) => {
    return match[0]; // 最初の文字のみを残す
  });
  
  // 1行がおおよそ20-25文字を超える場合は句点で改行
  const lines = result.split('\n');
  const formattedLines: string[] = [];
  
  for (const line of lines) {
    if (line === '') {
      formattedLines.push('');
      continue;
    }
    
    // 句点で分割したフレーズを組み立てる
    const phrases = line.match(/([^。！？]*[。！？]?)/g)?.filter(p => p.length > 0) || [];
    let currentLine = '';
    
    for (const phrase of phrases) {
      if ((currentLine + phrase).length <= 22) {
        // 現在の行に追加可能
        currentLine += phrase;
      } else if (currentLine.length > 0) {
        // 新しい行を開始
        formattedLines.push(currentLine);
        currentLine = phrase;
      } else {
        // フレーズ自体が長い場合は強制的に追加
        formattedLines.push(phrase);
        currentLine = '';
      }
    }
    
    if (currentLine.length > 0) {
      formattedLines.push(currentLine);
    }
  }
  
  return formattedLines.join('\n');
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
  
  // ステップ5：統計・事例データを追加
  if (result.length < minLength) {
    const extension5 = `\n\n実は多くの${audience}がこれに気づきません。\n\n${examples[1]}という事例からも、${theme}の本質が見えてきます。\n\n成功する人の特徴は、常にこの視点を持ち続けることなんです。`;
    result += extension5;
  }
  
  // ステップ6：重要な気づきを強調
  if (result.length < minLength) {
    const extension6 = `\n\nもう一つ、あなたが知っておくべき重要なことがあります。\n\n${triggers.rarity}\n\nこれはほとんどの${audience}が見落としているポイントです。\n\nしかし、これを知ることで${theme}への向き合い方が根本的に変わるんです。`;
    result += extension6;
  }
  
  // ステップ7：実行の障害を取り除く
  if (result.length < minLength) {
    const extension7 = `\n\n最後に、実行する上での障害をお伝えします。\n\n${analysis.expanded[2]}を継続するのが難しいという相談をよく受けます。\n\nしかし、正しい理解があれば、これは自然に続くようになります。`;
    result += extension7;
  }
  
  // ステップ8：最終確認フレーズ
  if (result.length < minLength) {
    const extension8 = `\n\nまとめると、${audience}が${theme}で成功するためには3つのステップが必要です。\n\n1つ目：本質を理解する（${analysis.main}）\n\n2つ目：心理的な側面を認識する（${analysis.expanded[3]}）\n\n3つ目：正しく実行する（${analysis.expanded[0]}）\n\nこれらを実践することが全てです。`;
    result += extension8;
  }
  
  // ステップ9：行動喚起
  if (result.length < minLength) {
    const extension9 = `\n\nそして今、あなたにできることがあります。\n\n${theme}への向き合い方を変えることです。\n\n今日このテキストを読んだことがきっかけになるかもしれません。\n\nぜひ、次の行動に移してみてください。`;
    result += extension9;
  }

  // 指定文字数を超えた場合はトリム
  if (result.length > targetLength) {
    return formatTikTokText(result.slice(0, targetLength).trimEnd());
  }

  return formatTikTokText(result);
};

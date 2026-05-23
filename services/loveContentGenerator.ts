import type { Theme, HookType, OutputKey, GeneratedContent, BuzzScore } from '../types';

// ─── Internal Types ──────────────────────────────────────────────────────────

type InsightVariant = {
  points: [string, string, string];
  closing: string;
};

type ThemeData = {
  variants: InsightVariant[];
  hashtags: string[];
  seoKeywords: string[];
  buildNoteTitle: (hookOpener: string) => string;
};

// ─── Hook Opener Templates ────────────────────────────────────────────────────

const HOOK_TEMPLATES: Record<HookType, string[]> = {
  '否定系': [
    '【{theme}】でやってはいけないことがあります。',
    '【{theme}】についての最大の間違いを教えます。',
    '9割の人が【{theme}】で失敗する理由があります。',
    '【{theme}】で傷つく前に知ってほしいことがあります。',
  ],
  '不安系': [
    'もしかして【{theme}】で悩んでいませんか？',
    '【{theme}】のことが不安でたまらない方へ伝えたいことがあります。',
    '【{theme}】について毎晩考えてしまっている方へ。',
    '【{theme}】でひとりで抱え込んでいませんか？',
  ],
  '暴露系': [
    '【{theme}】の真実を暴露します。',
    '誰も教えてくれなかった【{theme}】の裏側を話します。',
    '元当事者が語る【{theme}】のリアルな本音があります。',
    '【{theme}】について隠されてきた事実があります。',
  ],
  '男性心理系': [
    '男性が【{theme}】のとき本当に思っていること。',
    '【{theme}】で男性が絶対に口にしない本音があります。',
    '男性目線で語る【{theme}】の真相があります。',
    '【{theme}】で男性が無意識にやっている行動があります。',
  ],
  '実は系': [
    '実は【{theme}】には3つのパターンがあります。',
    '【{theme}】で成功する人だけが知っている法則があります。',
    '実はあなたの【{theme}】の理解が間違っているかもしれません。',
    '【{theme}】の意外な真実を科学的に解説します。',
  ],
};

// ─── Theme Content Database ───────────────────────────────────────────────────

const THEME_DB: Record<Theme, ThemeData> = {
  '脈なし': {
    variants: [
      {
        points: [
          '①LINEの返信が短くなった。以前は長文だったのに、最近はスタンプか1〜2文だけ。気持ちが離れているサインです。',
          '②デートの誘いに「また今度ね」が続く。本当に忙しくても、好きな相手には時間を作るのが人間です。',
          '③目が合っても微笑まなくなった。好意がある人は無意識に相手を目で追います。視線が外れたら注意が必要です。',
        ],
        closing: '何個当てはまりましたか？コメントで教えてください。',
      },
      {
        points: [
          '①既読スルーが増えてきた。メッセージを読んでも返さないのは、返す気力がない心理の表れです。',
          '②会話が表面的になった。以前は深い話もできたのに、最近は天気や仕事の話だけで終わるようになった。',
          '③他の異性の話を普通にしてくる。本命の前では無意識に異性の話を避けるのが一般的です。',
        ],
        closing: '気になる相手が当てはまっているか確認してみてください。',
      },
      {
        points: [
          '①自分から連絡してこなくなった。好きな人には理由を作ってでも連絡したくなるのが人の心理です。',
          '②返信のテンションが下がった。以前は絵文字や「！」が多かったのに、今は淡々とした文章だけ。',
          '③一緒にいても沈黙が続くようになった。話が続かない関係は、気持ちが薄れているサインかもしれません。',
        ],
        closing: '正直に受け止めることが、次のステップへの第一歩です。',
      },
    ],
    hashtags: ['#脈なし', '#恋愛相談', '#恋愛心理', '#脈なしサイン', '#片思い'],
    seoKeywords: ['脈なしサイン', '脈なし行動', '脈なし男性', '恋愛サイン', 'フェードアウト'],
    buildNoteTitle: (h) => `${h}脈なしサインを見逃さないための完全ガイド`,
  },

  '脈あり': {
    variants: [
      {
        points: [
          '①用もないのに連絡してくる。天気の話や「今何してる？」は、あなたと繋がっていたい証拠です。',
          '②あなたの話をよく覚えている。前回話したことを後日話題にしてきたら、常にあなたのことを考えているサインです。',
          '③ボディタッチが増えた。肩や腕など、さりげなく触れてくる行動は、心理的距離を縮めたい気持ちの表れです。',
        ],
        closing: '気になる相手にこのサインがあれば、脈あり可能性大です！',
      },
      {
        points: [
          '①二人きりになろうとする。グループの中でも気づけばあなたの隣にいるなら、意識している証拠です。',
          '②あなたの小さな変化に気づく。髪型や服装の変化を気づいてくれる人は、あなたをよく見ています。',
          '③既読してすぐ返信が来る。スマホを手放せないくらい、あなたの連絡を待っているということです。',
        ],
        closing: 'このサインが3つ以上あれば、積極的にいきましょう！',
      },
    ],
    hashtags: ['#脈あり', '#恋愛サイン', '#恋愛心理', '#好意のサイン', '#片思い'],
    seoKeywords: ['脈ありサイン', '脈あり行動', '好意のサイン', '恋愛心理', '脈あり男性'],
    buildNoteTitle: (h) => `${h}脈ありサインを見極める完全ガイド`,
  },

  '男性心理': {
    variants: [
      {
        points: [
          '①脈なしでも優しくする男性がいる。「嫌われたくない」という心理から、本命でなくても優しく接することがあります。',
          '②好きな女性ほど素直になれない男性は多い。プライドが高い男性は好意をストレートに表現できず、逆に冷たくなることも。',
          '③マメな男性が本命には雑になることがある。好きな子には緊張して慎重になりすぎるからです。',
        ],
        closing: '男性心理を知ると、行動の意味が全く変わって見えます。',
      },
      {
        points: [
          '①男性は言葉より行動で愛情を示す傾向がある。「何もしてくれない」ではなく、何をしてくれているかを見てください。',
          '②連絡をしない男性の本当の理由。嫌いになったのではなく、既読を返すことが「義務」に感じるのが嫌なだけかもしれません。',
          '③男性が「忙しい」と言うときの2パターン。本当に忙しいか、連絡したくないかは、他の行動と合わせて判断が必要です。',
        ],
        closing: '男性の本音がわかると、恋愛の悩みの9割は解消されます。',
      },
    ],
    hashtags: ['#男性心理', '#恋愛心理', '#男性の本音', '#恋愛相談', '#恋愛'],
    seoKeywords: ['男性心理', '男性の本音', '彼氏の気持ち', '男性行動の意味', '好き避け'],
    buildNoteTitle: (h) => `${h}男性心理を読み解く完全解説`,
  },

  'LINE': {
    variants: [
      {
        points: [
          '①既読スルーの3つの意味。「忙しい」「返し方がわからない」「既読したことを忘れた」のどれかがほとんどで、脈なしとは限りません。',
          '②深夜のLINEは特別な意味がある。夜ひとりになったとき最初に連絡する相手が、その人の「本命」です。',
          '③スタンプだけの返信の本音。会話を終わらせたいのか、語彙力不足なのかは、それ以前のやりとりで判断できます。',
        ],
        closing: 'LINEの解読ができると、相手の気持ちが見えてきます。',
      },
      {
        points: [
          '①返信速度は気持ちの温度計。毎回返信が早い相手は、あなたとの会話を楽しみにしている証拠です。',
          '②「了解」の一言で終わる人は、そのLINEが義務になっている。楽しい会話なら自然と言葉が増えます。',
          '③「ね」「笑」の語尾に隠れた心理。柔らかい語尾を使う相手は、あなたに好印象を持ってもらいたい気持ちがあります。',
        ],
        closing: 'LINEは気持ちの鏡。読み解けると恋愛が楽になります。',
      },
    ],
    hashtags: ['#LINE', '#既読スルー', '#恋愛LINE', '#恋愛心理', '#連絡'],
    seoKeywords: ['LINE既読スルー', 'LINE返信心理', 'LINE脈あり', '恋愛LINE', 'LINE本音'],
    buildNoteTitle: (h) => `${h}LINEから相手の気持ちを読む方法`,
  },

  '片思い': {
    variants: [
      {
        points: [
          '①存在感を高める3ステップ。名前を覚えてもらう、二人で話す機会を作る、向こうから来たくなる状況を作る。',
          '②告白のベストタイミングは「楽しい思い出を作った直後」。気持ちが高まっているときに背中を押しましょう。',
          '③片思いが長続きする人の特徴。「完璧な人」に見えているうちは、その幻想に恋しているだけかもしれません。',
        ],
        closing: '片思いを実らせた経験がある方、コメントで教えてください。',
      },
      {
        points: [
          '①諦め時のサイン3つ。他の人と付き合った、あなたへの扱いが雑、いつもあなたが傷つく。これがあれば手放す勇気も必要です。',
          '②片思い中に絶対やってはいけないこと。SNSを頻繁に確認して一喜一憂すること。気持ちが消耗するだけです。',
          '③自分を磨くことが最強の告白準備。「この人と付き合いたい」と思わせる存在になることが成功への近道です。',
        ],
        closing: '片思い中の方、自分を信じて諦めないでください。',
      },
    ],
    hashtags: ['#片思い', '#恋愛相談', '#片思い中', '#告白', '#恋愛'],
    seoKeywords: ['片思い 成就', '片思い 諦め時', '片思い 告白', '片思い 脈あり', '片思い 自分磨き'],
    buildNoteTitle: (h) => `${h}片思いを成就させるための完全ガイド`,
  },

  '復縁': {
    variants: [
      {
        points: [
          '①冷却期間を必ず設ける。別れた直後の連絡は逆効果。最低でも1〜3ヶ月は距離を置いて自分を磨く期間にしましょう。',
          '②別れた原因を正確に把握する。「なんとなく」で終わらせず、具体的に何が問題だったかを自己分析することが復縁成功の鍵です。',
          '③復縁できる人は「変化を見せられる人」。同じあなたに戻ってくる理由はない。成長した自分を見せることが最強の説得力です。',
        ],
        closing: '復縁を経験した方、うまくいったコツをコメントで教えてください。',
      },
      {
        points: [
          '①元彼への連絡は「用がある時だけ」にする。意味のない連絡は価値を下げるだけ。相手が連絡したくなる状況を作りましょう。',
          '②共通の友人を通じた情報収集は危険。必ず向こうの耳に入ります。直接勝負に出る方が誠実で効果的です。',
          '③復縁後うまくいくカップルの共通点は「別れた原因を二人で話し合えたかどうか」。ここを避けると同じことが繰り返されます。',
        ],
        closing: '復縁を目指しているなら、まず自分を整えることから始めてください。',
      },
    ],
    hashtags: ['#復縁', '#元彼', '#恋愛相談', '#復縁したい', '#失恋'],
    seoKeywords: ['復縁方法', '復縁 冷却期間', '復縁 連絡', '復縁 成功', '元彼 連絡'],
    buildNoteTitle: (h) => `${h}復縁を成功させる完全戦略`,
  },

  '運命の人': {
    variants: [
      {
        points: [
          '①運命の人との出会いには前兆がある。突然の環境の変化、引越しや転職のタイミングで出会うことが多いです。',
          '②「なぜか気になる」が最大のサイン。タイプでなくても、なぜかその人のことが頭から離れないなら要注意です。',
          '③運命の人は一緒にいると自然体でいられる。頑張らなくても楽しい、飾らなくても受け入れてもらえる存在がそれです。',
        ],
        closing: '運命の出会いを信じる方、コメントで教えてください。',
      },
      {
        points: [
          '①運命の人はすぐに付き合えないことも多い。タイミングが合わない、どちらかに相手がいる、そういう障壁があることが多いです。',
          '②運命の人かどうかは「別れた後」にわかる。どれだけ時間が経っても忘れられない相手が、本当の運命の人かもしれません。',
          '③自分自身が整った時に運命の人が現れる。恋愛依存や自己否定がある状態では、出会っても気づけません。',
        ],
        closing: '運命の出会いを引き寄せるために、まず自分を愛してください。',
      },
    ],
    hashtags: ['#運命の人', '#運命の出会い', '#恋愛', '#スピリチュアル', '#恋愛相談'],
    seoKeywords: ['運命の人 サイン', '運命の出会い', '運命の人 前兆', 'ソウルメイト', '運命の恋'],
    buildNoteTitle: (h) => `${h}運命の人を引き寄せる方法と見極め方`,
  },

  '恋愛心理学': {
    variants: [
      {
        points: [
          '①吊り橋効果を活用する。ドキドキする体験を一緒にすると、そのドキドキを「好き」と勘違いしやすくなります。映画や遊園地が有効。',
          '②ミラーリング効果。相手の動作や言葉を自然に真似ることで、無意識に「この人は自分と似ている」と感じてもらえます。',
          '③ザイオンス効果（単純接触効果）。会う回数が増えるほど好感度が上がります。毎日少し存在感を示すことが重要です。',
        ],
        closing: '恋愛心理学を活用して、気になるあの人を振り向かせましょう。',
      },
      {
        points: [
          '①返報性の原理。もらったものを返したくなる心理です。好意を少しずつ示すことで相手も好意を返してくれやすくなります。',
          '②類似性の法則。人は自分と似た価値観・趣味を持つ人に惹かれます。共通点を見つけて強調することが大切です。',
          '③初頭効果と終末効果。最初と最後の印象が最も記憶に残ります。デートの始めと終わりを特に大切にしてください。',
        ],
        closing: '心理学を知ると、恋愛の成功率が格段に上がります。',
      },
    ],
    hashtags: ['#恋愛心理学', '#恋愛テクニック', '#恋愛心理', '#モテ', '#恋愛'],
    seoKeywords: ['恋愛心理学', '吊り橋効果', 'ミラーリング', 'ザイオンス効果', '恋愛テクニック'],
    buildNoteTitle: (h) => `${h}恋愛心理学で相手の心を動かす方法`,
  },

  '職場恋愛': {
    variants: [
      {
        points: [
          '①職場恋愛が成功しやすい条件。プロとしての信頼関係が先にある、仕事とプライベートをきちんと分けられる関係であること。',
          '②職場恋愛のリスク。別れた後も毎日顔を合わせる必要があるため、精神的に辛い状況が続くことがあります。',
          '③バレないための行動原則。社内では完全に普通の同僚として振る舞い、二人の時間は完全に職場外にすること。',
        ],
        closing: '職場恋愛を経験した方、コメントで教えてください。',
      },
      {
        points: [
          '①好意のサインを見逃さない。残業中に声をかけてくる、仕事の相談をよくしてくる、昼食を一緒に食べたがる。',
          '②職場で好かれる人の共通点。仕事ができる、謙虚、笑顔が多い。恋愛対象になる前に信頼される人間になることが先です。',
          '③告白のベストタイミングは繁忙期を避けること。仕事のストレスが高い時期のアプローチは成功率が大幅に下がります。',
        ],
        closing: '職場恋愛は慎重に、でも勇気を持って進んでください。',
      },
    ],
    hashtags: ['#職場恋愛', '#社内恋愛', '#恋愛', '#恋愛相談', '#仕事'],
    seoKeywords: ['職場恋愛', '社内恋愛 成功', '職場恋愛 リスク', '職場恋愛 バレない', '同僚 脈あり'],
    buildNoteTitle: (h) => `${h}職場恋愛を成功させる完全戦略`,
  },

  '人間関係': {
    variants: [
      {
        points: [
          '①距離を置くべき人の3つの特徴。いつも否定的なことを言う、あなたの話を聞かず自分の話ばかり、感謝の気持ちがない人です。',
          '②嫌いな人との正しい関係の作り方。嫌いな人にエネルギーを使うより、好きな人との関係に時間を投資する方が人生が豊かになります。',
          '③「なんとなく疲れる人」は本当に危険。大きな悪意はなくても、小さな要求や愚痴が積み重なって消耗させてくる人に要注意です。',
        ],
        closing: '人間関係の悩みを抱えている方、一人で悩まないでください。',
      },
      {
        points: [
          '①信頼される人が無意識にやっていること。約束を守る、秘密を守る、相手の話を最後まで聞く。当たり前のことを徹底している人が信頼されます。',
          '②人間関係をリセットしたくなる心理。それは疲れているサインです。すべてを断ち切る前に、まず一人になる時間を作ってみてください。',
          '③本当の友達は少なくていい。100人の薄い関係より、10人の深い信頼関係の方が、人生の質を高めてくれます。',
        ],
        closing: '良好な人間関係が、あなたの人生の質を決めます。',
      },
    ],
    hashtags: ['#人間関係', '#人間関係の悩み', '#人付き合い', '#境界線', '#HSP'],
    seoKeywords: ['人間関係 疲れた', '人間関係 リセット', '距離を置く', '嫌いな人 対処', '人間関係 改善'],
    buildNoteTitle: (h) => `${h}人間関係を整えて人生を楽にする方法`,
  },

  '婚活': {
    variants: [
      {
        points: [
          '①婚活で失敗する人のパターン。スペックで相手を選ぶ、妥協点が明確でない、「普通の人」を求めているが普通の定義が高すぎる。',
          '②男性が婚活で本当に求めていること。一緒にいて楽、素直に甘えられる、「一緒にいたい」と自然に思える人。',
          '③婚活成功者の共通点は「結婚したい」から「この人と結婚したい」に気持ちを変化させること。目的から人への変換が大事です。',
        ],
        closing: '婚活中の方、焦らず自分のペースで進んでください。',
      },
      {
        points: [
          '①婚活で大事なのは自己PR力より自己認識力。自分が何を幸せと感じるかを知っている人が、適切なパートナーを選べます。',
          '②婚活アプリで上手くいく人の特徴。プロフィールに素の自分を出せている、会うことに積極的、断られても引きずらない。',
          '③「この人でいいか」と「この人がいい」は全く違う。妥協婚は後悔につながりやすい。焦りで決断しないことが大切です。',
        ],
        closing: '婚活は自分を知る旅でもあります。楽しんで進んでください。',
      },
    ],
    hashtags: ['#婚活', '#婚活女子', '#結婚', '#婚活アプリ', '#恋愛'],
    seoKeywords: ['婚活 成功', '婚活 失敗', '婚活 コツ', '結婚相手 選び方', '婚活アプリ'],
    buildNoteTitle: (h) => `${h}婚活を成功させる完全ロードマップ`,
  },

  '年の差恋愛': {
    variants: [
      {
        points: [
          '①年上男性が年下女性に惹かれる本当の理由。若さだけでなく「素直さ」と「成長を感じさせてくれること」が大きな魅力になっています。',
          '②年の差カップルが長続きするための秘訣。価値観の違いを「育ってきた時代の違い」として理解し合えるかどうかが鍵です。',
          '③年の差恋愛の最大の障壁は「将来設計の違い」。子どもの話、老後の話をオープンに話せる関係かどうかが重要です。',
        ],
        closing: '年の差カップルのエピソード、コメントで聞かせてください。',
      },
    ],
    hashtags: ['#年の差恋愛', '#年上彼氏', '#年下彼氏', '#恋愛', '#大人の恋愛'],
    seoKeywords: ['年の差恋愛', '年上男性 心理', '年の差カップル', '年の差 問題', '年上と付き合う'],
    buildNoteTitle: (h) => `${h}年の差恋愛を長続きさせる完全ガイド`,
  },

  '既婚者の恋愛': {
    variants: [
      {
        points: [
          '①既婚者が恋愛感情を持ってしまう主な理由。「認められたい欲求の不満」「家庭内の孤独感」「非日常への憧れ」の3つが多いです。',
          '②既婚者との恋愛を続けることのリスク。いつ終わるかわからない関係、優先度は常にあなたが下になる、本命になれる可能性の低さ。',
          '③感情に従うのか、理性で判断するのか。どちらが正しいかは言えませんが、後悔しない選択をするための時間を作ることが大切です。',
        ],
        closing: '難しい状況にいる方へ。あなたの選択を応援しています。',
      },
    ],
    hashtags: ['#既婚者の恋愛', '#複雑愛', '#大人の恋愛', '#恋愛相談', '#不倫'],
    seoKeywords: ['既婚者 恋愛', '既婚者 好きになった', '既婚者との恋愛', '既婚者 心理', '複雑な恋愛'],
    buildNoteTitle: (h) => `${h}既婚者の恋愛と向き合うための考え方`,
  },

  'マッチングアプリ': {
    variants: [
      {
        points: [
          '①会えない人の共通点。プロフィールが少ない、最初のメッセージが「こんにちは」だけ、会う提案を何度も先延ばしにする。',
          '②モテるプロフィールの3原則。自然で明るい写真、具体的な趣味・日常、「会ってみたい」と思わせる一言コメント。',
          '③危険な相手の見分け方。会う前に「好き」と言う、LINE・電話への誘導が早い、仕事の話が曖昧な相手には要注意です。',
        ],
        closing: 'マッチングアプリで成功した方、コツをコメントで教えてください。',
      },
      {
        points: [
          '①最初のメッセージで差がつく。プロフィールを読んで具体的に触れるメッセージは返信率が格段に上がります。',
          '②会うまでの連絡は10往復以内が理想。長期間アプリ内だけで話し続けると、相手が会うモチベーションを失いやすくなります。',
          '③最初のデートは昼のカフェが最強。安全で、適度な時間で切り上げられ、相手の素の雰囲気も確認しやすいです。',
        ],
        closing: 'マッチングアプリは使い方次第で出会いの場に変わります。',
      },
    ],
    hashtags: ['#マッチングアプリ', '#マッチングアプリ攻略', '#婚活アプリ', '#恋活', '#出会い'],
    seoKeywords: ['マッチングアプリ コツ', 'マッチングアプリ モテる', 'マッチングアプリ 危険', 'マッチングアプリ 会えない', '出会い アプリ'],
    buildNoteTitle: (h) => `${h}マッチングアプリ攻略の完全マニュアル`,
  },

  '不倫': {
    variants: [
      {
        points: [
          '①不倫が終わらない心理的理由。「秘密」という特別感、「自分だけに見せる顔がある」という優越感、日常にはない非日常の刺激。',
          '②不倫相手の本当の気持ち。「別れるつもりはない」という言葉が本音である可能性が非常に高い。言葉より行動を見てください。',
          '③不倫を終わらせられない人の特徴。「この人しかいない」という依存、別れた後の孤独への恐怖が手放せない理由です。',
        ],
        closing: '複雑な感情を抱えている方へ。あなたの幸せを大切にしてください。',
      },
    ],
    hashtags: ['#不倫', '#複雑愛', '#不倫相談', '#秘密の恋', '#恋愛'],
    seoKeywords: ['不倫 終わらせ方', '不倫 心理', '不倫相手 本音', '不倫 抜け出せない', '不倫 終わり'],
    buildNoteTitle: (h) => `${h}不倫の心理と向き合い方`,
  },

  'セフレ友達以上': {
    variants: [
      {
        points: [
          '①セフレから本命になれる人の特徴。体だけの関係から抜け出せる人は「感情的な繋がり」を作れる人。心が動く会話ができるかどうかがポイントです。',
          '②友達以上の関係を進めるには「関係の定義を恐れないこと」。曖昧な状態を続けるのは、相手に都合よく使われるリスクがあります。',
          '③都合のいい関係を終わらせるタイミング。「自分が傷ついている」と気づいたとき、それが終わりにすべきサインです。',
        ],
        closing: '自分の気持ちを大切にする選択をしてください。',
      },
    ],
    hashtags: ['#セフレ', '#友達以上恋人未満', '#恋愛相談', '#複雑な関係', '#恋愛'],
    seoKeywords: ['セフレ 本命', '友達以上恋人未満', 'セフレから恋人', '都合のいい関係', '曖昧な関係'],
    buildNoteTitle: (h) => `${h}曖昧な関係を整理して本当の幸せを手に入れる方法`,
  },
};

// ─── Utilities ────────────────────────────────────────────────────────────────

const pickRandom = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const wrapLine = (line: string, maxLen = 20): string => {
  if (!line || line.length <= maxLen) return line;
  const chunks: string[] = [];
  let i = 0;
  while (i < line.length) {
    chunks.push(line.slice(i, i + maxLen));
    i += maxLen;
  }
  return chunks.join('\n');
};

const wrapText = (text: string): string =>
  text.split('\n').map(line => wrapLine(line)).join('\n');

const pickVariant = (theme: Theme, prevTitle: string): InsightVariant => {
  const { variants } = THEME_DB[theme];
  if (variants.length === 1) return variants[0];
  if (!prevTitle) return pickRandom(variants);
  const hash = prevTitle.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return variants[(hash + 1) % variants.length];
};

const buildHook = (hookType: HookType, theme: string): string => {
  const tpl = pickRandom(HOOK_TEMPLATES[hookType]);
  return tpl.replace(/\{theme\}/g, theme);
};

const calcBuzzScore = (mainContent: string, hookType: HookType): BuzzScore => {
  const hookWords = ['実は', '危険', '知らないと損', '9割', '本音', '勘違い', '冷め', '脈なし', '本命', '絶対', '失敗'];
  const hookPower = Math.min(20, 10 + hookWords.filter(w => mainContent.slice(0, 100).includes(w)).length * 2 + (hookType === '否定系' || hookType === '暴露系' ? 4 : 2));

  const saveWords = ['①', '②', '③', '3つ', '特徴', '理由', 'ステップ', 'パターン', '原則'];
  const saveRate = Math.min(20, 8 + saveWords.filter(w => mainContent.includes(w)).length * 2);

  const commentWords = ['当てはまりましたか', 'コメントで教えてください', 'あなたはどう', '経験がある方'];
  const commentRate = Math.min(20, 8 + commentWords.filter(w => mainContent.includes(w)).length * 5);

  const profileRate = 14;

  const seoWords = ['完全', 'ガイド', '解説', '戦略', 'ポイント', '方法', 'コツ'];
  const seoScore = Math.min(20, 10 + seoWords.filter(w => mainContent.includes(w)).length);

  const total = hookPower + saveRate + commentRate + profileRate + seoScore;
  const comment =
    total >= 90 ? '🔥 バズ確定！すぐ投稿して！' :
    total >= 75 ? '✨ 高ポテンシャル！あとひと押しで爆伸び間違いなし' :
    total >= 60 ? '👍 平均以上！フック強化でさらに伸びます' :
    '💪 基礎はOK！コメント誘導を追加するとスコアアップ';

  return { hookPower, saveRate, commentRate, profileRate, seoScore, total, comment };
};

// ─── Content Builders ─────────────────────────────────────────────────────────

const buildMainContent = (
  hook: string,
  variant: InsightVariant,
  theme: Theme,
  tiktokLength: 300 | 500 | 600,
  profileCta: string
): string => {
  let lines: string[];
  if (tiktokLength === 300) {
    lines = [
      hook,
      '',
      'これ、意外と知らない人が多いんです。',
      '',
      variant.points[0],
      '',
      variant.points[1],
      '',
      '「もしかして…」と思ったあなたは要注意です。',
      '',
      variant.closing,
    ];
  } else if (tiktokLength === 600) {
    lines = [
      hook,
      '',
      `「${theme}」について知っているようで知らないことって、実はたくさんあります。`,
      '今日は特に大事な3つのポイントをお伝えします。',
      '',
      variant.points[0],
      '',
      'これだけでも知っていると、見え方が変わります。',
      '',
      variant.points[1],
      '',
      'この視点を持てるかどうかで結果が変わってきます。',
      '',
      variant.points[2],
      '',
      '以上の3点、どれか一つでも「なるほど」と感じていただけたら嬉しいです。',
      '',
      variant.closing,
      '',
      `「${theme}」に関して他にも気になることがあれば、コメントで教えてください。`,
      'このアカウントでは恋愛に関する情報を毎日お届けしています。',
    ];
  } else {
    lines = [
      hook,
      '',
      `「${theme}」で悩んでいる方に知ってほしい3つのポイントを解説します。`,
      '最後まで見てください。',
      '',
      variant.points[0],
      '',
      variant.points[1],
      '',
      variant.points[2],
      '',
      'この3つを知るだけで、今の状況が全然違って見えてきます。',
      '気づいた方はコメントで教えてください。',
      '',
      variant.closing,
      '',
      `このアカウントでは「${theme}」をはじめ恋愛に関する情報を毎日発信しています。`,
    ];
  }
  const body = wrapText(lines.join('\n'));
  return body + '\n\n' + profileCta;
};

const buildThreadsPost = (hook: string, variant: InsightVariant, hashtags: string[], postUrl: string): string => {
  const urlSuffix = postUrl ? `\n${postUrl}` : '';
  const maxBodyLen = 500 - urlSuffix.length;
  const body = [hook, '', variant.points.join('\n\n'), '', variant.closing, '', hashtags.join(' ')].join('\n');
  const truncatedBody = body.length > maxBodyLen ? body.slice(0, maxBodyLen - 3) + '…' : body;
  return truncatedBody + urlSuffix;
};

const buildXPost = (hook: string, variant: InsightVariant, hashtags: string[], postUrl: string): string => {
  const urlSuffix = postUrl ? `\n${postUrl}` : '';
  const maxBodyLen = 280 - urlSuffix.length;
  const body = `${hook}\n\n${variant.points[0]}\n\n${hashtags.slice(0, 2).join(' ')}`;
  const truncatedBody = body.length > maxBodyLen ? body.slice(0, maxBodyLen - 3) + '…' : body;
  return truncatedBody + urlSuffix;
};

const buildNoteArticle = (theme: Theme, hook: string, variant: InsightVariant, noteTitle: string): string => {
  const p1 = variant.points[0].replace(/^①/, '');
  const p2 = variant.points[1].replace(/^②/, '');
  const p3 = variant.points[2].replace(/^③/, '');
  return `${noteTitle}

${hook}

今回は「${theme}」について、多くの方が見落としているポイントを3つお伝えします。


ポイント①

${p1}


ポイント②

${p2}


ポイント③

${p3}


まとめ

${variant.closing}

「${theme}」で悩んでいる方の参考になれば幸いです。
気になる方はプロフィールのリンクからチェックしてみてください。`;
};

const buildThumbnailPrompt = (theme: Theme, hookType: HookType, hook: string, noteTitle: string): string => {
  const hookLabel: Record<HookType, string> = {
    '否定系': 'NG・注意・禁止系',
    '不安系': '共感・悩み系',
    '暴露系': '衝撃・暴露系',
    '男性心理系': '男性目線・解説系',
    '実は系': '驚き・発見系',
  };
  const titleForThumbnail = noteTitle.length > 30 ? noteTitle.slice(0, 30) + '…' : noteTitle;

  const tiktokPrompt =
    `9:16縦長・高画質リアル写真・日本人女性30代・恋愛テーマ\n` +
    `タイトル文字：「${titleForThumbnail}」\n` +
    `文字配置：画面上部・太字・大きめフォント・スクロール停止率重視\n` +
    `デザイン：ピンク系（メインカラー #D4537E・背景 #FFF0F5）\n` +
    `表情：感情が伝わる・強い視線・バズる構図\n` +
    `スタイル：${hookLabel[hookType]}`;

  const notePrompt =
    `1280×670px・高画質リアル写真・日本人女性30代・恋愛テーマ\n` +
    `タイトル文字：「${titleForThumbnail}」\n` +
    `文字配置：中央または上部・太字・目立つフォント\n` +
    `デザイン：洗練されたシンプルデザイン・ピンク系アクセント\n` +
    `構図：印象的で目立つレイアウト・プロフェッショナルな仕上がり\n` +
    `スタイル：高品質リアル系`;

  return `【TikTok用サムネイルプロンプト】\n${tiktokPrompt}\n\n---\n\n【note用サムネイルプロンプト】\n${notePrompt}`;
};

const buildNoteUrl = (theme: Theme): string =>
  `https://note.com/あなたのID/n/${theme.replace(/[^\w]/g, '')}_${Date.now().toString(36)}`;

// ─── Main Generator ───────────────────────────────────────────────────────────

export interface GenerateParams {
  theme: Theme;
  hookType: HookType;
  prevTitle: string;
  enabledKeys: OutputKey[];
  tiktokLength: 300 | 500 | 600;
  profileCta: string;
  postUrl: string;
}

export const generateContent = ({ theme, hookType, prevTitle, enabledKeys, tiktokLength, profileCta, postUrl }: GenerateParams): GeneratedContent => {
  const themeData = THEME_DB[theme];
  const variant = pickVariant(theme, prevTitle);
  const hook = buildHook(hookType, theme);
  const noteTitle = themeData.buildNoteTitle(hook);

  const mainContent = buildMainContent(hook, variant, theme, tiktokLength, profileCta);
  const hashtags = themeData.hashtags;
  const hashtagText = hashtags.join(' ');

  const threadsPost = enabledKeys.includes('threads')
    ? buildThreadsPost(hook, variant, hashtags, postUrl)
    : '';
  const xPost = enabledKeys.includes('x')
    ? buildXPost(hook, variant, hashtags, postUrl)
    : '';
  const noteArticle = enabledKeys.includes('note')
    ? buildNoteArticle(theme, hook, variant, noteTitle)
    : '';
  const noteUrl = enabledKeys.includes('noteUrl')
    ? buildNoteUrl(theme)
    : '';
  const seoSet = enabledKeys.includes('seo')
    ? {
        title: noteTitle,
        keywords: themeData.seoKeywords,
        description: `${hook} ${variant.points[0].replace(/^①/, '').slice(0, 80)}`,
      }
    : { title: '', keywords: [], description: '' };
  const thumbnailPrompt = enabledKeys.includes('thumbnail')
    ? buildThumbnailPrompt(theme, hookType, hook, noteTitle)
    : '';

  const buzzScore = calcBuzzScore(mainContent, hookType);

  return {
    theme,
    hookType,
    prevTitle,
    mainContent,
    hashtags,
    hashtagText,
    threadsPost,
    xPost,
    noteArticle,
    noteUrl,
    seoSet,
    thumbnailPrompt,
    buzzScore,
    timestamp: new Date().toISOString(),
  };
};

export const OUTPUT_KEY_LABELS: Record<OutputKey, string> = {
  mainContent: 'TikTok / YouTube / Instagram 共用台本',
  hashtags: 'ハッシュタグ',
  threads: 'Threads投稿文',
  x: 'X投稿文',
  note: 'note記事',
  noteUrl: 'note URL候補',
  seo: 'SEOセット',
  thumbnail: 'サムネプロンプト',
};

export const DEFAULT_ENABLED_KEYS: OutputKey[] = ['mainContent', 'hashtags', 'threads', 'x'];

export const ALL_THEMES: Theme[] = [
  '脈なし', '脈あり', '男性心理', 'LINE', '片思い', '復縁',
  '運命の人', '恋愛心理学', '職場恋愛', '人間関係', '婚活',
  '年の差恋愛', '既婚者の恋愛', 'マッチングアプリ', '不倫', 'セフレ友達以上',
];

export const ALL_HOOK_TYPES: HookType[] = ['否定系', '不安系', '暴露系', '男性心理系', '実は系'];

export const ALL_OUTPUT_KEYS: OutputKey[] = [
  'mainContent', 'hashtags', 'threads', 'x', 'note', 'noteUrl', 'seo', 'thumbnail',
];

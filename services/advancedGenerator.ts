const buzzWords = [
  '危険',
  '損',
  '今すぐ',
  '知らないと損',
  '変わる',
  '最短',
  '失敗',
  '本音',
  '真実',
  '逆転',
  '伸びる',
  '売れる',
];

const clampText = (text: string, min: number, max: number) => {
  const trimmed = text.trim();
  if (trimmed.length >= min && trimmed.length <= max) return trimmed;
  if (trimmed.length > max) return trimmed.slice(0, max);
  return `${trimmed}${'。'.repeat(Math.max(0, min - trimmed.length))}`.slice(0, max);
};

const padOrTrim = (text: string, min: number, max: number) => {
  if (text.length > max) return text.slice(0, max);
  if (text.length < min) {
    const filler = '今すぐ確認してください。';
    let result = text;
    while (result.length < min) {
      result += filler;
    }
    return result.slice(0, max);
  }
  return text;
};

const targetLength = (length: string) => {
  if (length === '200文字') return 200;
  if (length === '500文字') return 500;
  return 300;
};

const buildBuzzArticle = (
  theme: string,
  target: number,
  gender: string,
  age: string,
  variant: number
) => {
  const profile =
    `${age === '指定なし' ? '' : age}${gender === '指定なし' ? '' : gender}`.trim() || '多くの人';

  const title =
    variant === 1
      ? `なぜ${theme}で結果が出ないのか？`
      : variant === 2
      ? `${theme}で損している人の共通点は？`
      : `${theme}が伸びない本当の理由は？`;

  const hook =
    variant === 1
      ? `知らないままだと遠回りです。`
      : variant === 2
      ? `これ、意外と気づいていない人が多いです。`
      : `今のままだと、かなりもったいないです。`;

  const empathy =
    `${profile}ほど、真面目に続けるのに反応が出ず、途中で不安になります。`;

  const problem =
    `原因は努力不足ではなく、最初の設計と見せ方を間違えていることです。`;

  const solution =
    `結果を変える人は、①疑問を作る ②共感を入れる ③数字で伝える ④最後に行動を促す、この順番を徹底しています。`;

  const benefit =
    `この型に変えるだけで、読まれ方も保存率も反応も大きく変わります。`;

  const action =
    `まず今日の投稿を1本だけ、この順番に直してください。`;

  const afterglow =
    `たった1本でも、流れは変わり始めます。`;

  const joined = [
    `【${title}】`,
    hook,
    empathy,
    problem,
    solution,
    benefit,
    action,
    afterglow,
  ].join('\n\n');

  return joined.length > target ? `${joined.slice(0, target - 1)}…` : joined;
};

const calcBuzzScore = (text: string) => {
  let score = 40;

  if (/\d/.test(text)) score += 10;
  if (text.includes('？') || text.includes('?')) score += 10;
  if (buzzWords.some((word) => text.includes(word))) score += 15;
  if (text.includes('共通点') || text.includes('理由')) score += 10;
  if (text.includes('今すぐ') || text.includes('まず')) score += 10;
  if (text.includes('変わります') || text.includes('伸び') || text.includes('反応')) score += 10;

  return Math.min(score, 100);
};

const buildCTA = (theme: string) =>
  clampText(`今すぐ${theme}の伸びる型を確認してください`, 20, 40);

const buildThumbnail = (theme: string) => {
  const base = `${theme}の真実`;
  return base.length > 15 ? base.slice(0, 15) : base;
};

const buildCapcutTemplate = (theme: string) => {
  return [
    'SCENE 1 / HOOK',
    `「${theme}で損していませんか？」`,
    '',
    'SCENE 2 / EMPATHY',
    '頑張っているのに反応が出ない',
    '',
    'SCENE 3 / PROBLEM',
    '原因は才能ではなく順番',
    '',
    'SCENE 4 / SOLUTION',
    '①疑問 ②共感 ③数字 ④行動',
    '',
    'SCENE 5 / BENEFIT',
    `${theme}の反応が変わる`,
    '',
    'SCENE 6 / CTA',
    '今すぐチェック'
  ].join('\n');
};

const buildProfile = (theme: string) => {
  const text = `${theme}をわかりやすく解説｜初心者でも実践しやすい伸びる型・売れる導線・反応が変わる発信のコツを毎日発信中｜保存で後から見返せます`;
  return padOrTrim(text, 80, 120);
};

const buildNoteLead = (theme: string) => {
  const text = `${theme}で結果が出ない理由は、才能ではなく順番にあります。今回の内容では、反応が変わる型と、今すぐ見直すべきポイントをわかりやすく整理しました。遠回りしたくない方は、このまま確認してください。`;
  return padOrTrim(text, 100, 200);
};

const buildWeeklyTemplates = (theme: string) => {
  return [
    `月：${theme}の基本`,
    `火：${theme}で失敗する原因`,
    `水：${theme}が変わる3つのコツ`,
    `木：${theme}の具体例`,
    `金：${theme}でやってはいけないこと`,
    `土：${theme}で伸びる型`,
    `日：${theme}の1週間まとめ`,
  ];
};

export const generateAdvancedPack = (
  theme: string,
  length: string,
  gender: string,
  age: string
) => {
  const target = targetLength(length);

  let article = buildBuzzArticle(theme, target, gender, age, 1);
  let buzzScore = calcBuzzScore(article);

  if (buzzScore < 70) {
    article = buildBuzzArticle(theme, target, gender, age, 2);
    buzzScore = calcBuzzScore(article);
  }

  if (buzzScore < 70) {
    article = buildBuzzArticle(theme, target, gender, age, 3);
    buzzScore = calcBuzzScore(article);
  }

  return {
    article,
    cta: buildCTA(theme),
    thumbnail: buildThumbnail(theme),
    capcutTemplate: buildCapcutTemplate(theme),
    profile: buildProfile(theme),
    noteLead: buildNoteLead(theme),
    weeklyTemplates: buildWeeklyTemplates(theme),
    buzzScore,
  };
};

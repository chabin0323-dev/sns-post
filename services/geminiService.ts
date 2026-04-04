// services/localPostGenerator.ts

export const generateSNSPostContent = (
  theme: string,
  length: string,
  gender: string,
  age: string
) => {

  const hook = `【知らないと損】${theme}の真実`;
  
  const body = `
実は多くの人が勘違いしています。

${theme}で結果が出ない理由はシンプルです。

正しいやり方を知らないだけ。

今日から変えるべきポイントは3つ。

・考え方を変える
・行動を変える
・継続する

これだけで結果は大きく変わります。
`;

  const cta = `
👇続きは固定コメントへ
`;

  const snsContent = `${hook}

${body}

${cta}

#${theme} #自己啓発 #成功法則 #人生 #習慣`;

  // TikTok 1分以上台本（超重要）
  const script = `
${hook}

ちょっと待ってください

${theme}で失敗してる人
かなり多いです

その理由は
やり方がズレてるから

実は成功してる人は
全員同じことをやってます

それは何か？

シンプルです

正しい順番で行動すること

まず1つ目
考え方を変える

2つ目
行動を変える

3つ目
継続する

これだけです

でもほとんどの人は
ここで止まります

だから結果が出ない

逆にここを続けた人だけが
結果を出しています

今からでも遅くないです

まず1つやってみてください

そして変化を感じてください

👇続きは固定コメントへ
`;

  return {
    title: hook,
    content: snsContent,
    capcutScript: script,
    hashtags: [`#${theme}`, "#成功", "#習慣", "#自己投資", "#人生"]
  };
};

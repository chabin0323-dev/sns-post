function generateMainContent(theme: Theme, hookType: HookType, genre: Genre, hook: string, tiktokLength: 300 | 500 | 600, profileCta: string): string {
  const points = THEME_DETAILS[theme]?.points[0] ?? DEFAULT_POINTS[genre][0];
  const cta = profileCta || pick(GENRE_DATA[genre].ctaVariants ?? ['プロフィールへ✨']);

  let content = '';

  if (tiktokLength === 300) {
    const intros = [
      `急に気になって調べたら、知らなかったことだらけだった。`,
      `ずっとモヤモヤしてたこと、やっと言語化できた気がする。`,
      `「なんでうまくいかないんだろう」って思ってた理由がわかった。`,
    ];
    content = `${hook}\n\n${pick(intros)}\n\n${theme}で大事なのって、実はこの3つだけ。\n\n① ${points[0]}\n\n② ${points[1]}\n\n③ ${points[2]}\n\nむずかしく考えなくていい。\nまず①だけ、今日やってみて。\n\n${cta}`;

  } else if (tiktokLength === 500) {
    const empathyOpeners = [
      `頑張ってるのに結果が出ない、ってしんどいよね。`,
      `「みんなできてるのに自分だけ」って焦る気持ち、すごくわかる。`,
      `なんとなくやってるけど、これで合ってるのかな…って不安になること、ない？`,
    ];
    const bridges = [
      `でも実は、ちゃんとした順番があるんだよね。`,
      `知ってる人と知らない人で、1年後に大きな差が出る話をする。`,
      `ここを変えるだけで、流れが変わる人が続出してる。`,
    ];
    content = `${hook}\n\n${pick(empathyOpeners)}\n${pick(bridges)}\n\n【① ${points[0].split('。')[0]}】\n${points[0]}\n多くの人がここを後回しにして、結局うまくいかなくなる。\n\n【② ${points[1].split('。')[0]}】\n${points[1]}\n「そんなこと？」って思うかもしれないけど、これが一番効く。\n\n【③ ${points[2].split('。')[0]}】\n${points[2]}\nここまでできたら、正直かなり変わる。\n\n完璧じゃなくていい。\n①から順番に、できるとこだけ試してみて🔥\n保存して後で見返してね📌\n\n${cta}`;

  } else {
    const storyOpeners = [
      `正直に言う。\nこれを知ってる人と知らない人で、1年後に別人みたいな差がつく。`,
      `ずっと気になってたけど誰も教えてくれなかった話をする。\n知らないまま損してる人、めちゃくちゃ多い。`,
      `「なんで自分だけうまくいかないんだろう」\nそれ、やり方の問題じゃなくて順番の問題かもしれない。`,
    ];
    const midBridges = [
      `「知ってるよ」と思ってる人ほど、実はできてないことが多い。`,
      `頭でわかってても、行動に落とし込めてる人は少ない。`,
      `ここを意識してる人としてない人では、積み上がるものが全然違う。`,
    ];
    const closers = [
      `「いつかやろう」が一番怖い言葉だと思ってる。\n今日のうちに①だけでも動いてみて。`,
      `完璧を目指さなくていい。\n今日できる一番小さな一歩を踏み出すだけでいい。`,
      `一気にやらなくていい。\nでも、①だけは今日中にやってほしい。本当に変わるから。`,
    ];
    content = `${hook}\n\n${pick(storyOpeners)}\n\n━━━━━━━━━━━━\n【① ${points[0].split('。')[0]}】\n${points[0]}\n\n${pick(midBridges)}\nまずここから始めることが、遠回りに見えて一番の近道。\n\n【② ${points[1].split('。')[0]}】\n${points[1]}\n\nこれを意識するだけで、毎日の積み上げが変わってくる。\n\n【③ ${points[2].split('。')[0]}】\n${points[2]}\n\nここまで実践してる人は、周りから見ても明らかに違う。\n━━━━━━━━━━━━\n\n${pick(closers)}\n\n参考になったら保存&シェアしてくれたら嬉しい🙏\n\n${cta}`;
  }

  return wrapAt20(content);
}

function generateNoteArticle(theme: Theme, genre: Genre, hook: string): string {
  const points = THEME_DETAILS[theme]?.points[0] ?? DEFAULT_POINTS[genre][0];
  const subtitle = THEME_DETAILS[theme]?.noteSubtitles[0] ?? `${theme}を完全マスターするためのガイド`;

  return `${theme}について、正直に話します。

━━━━━━━━━━━━━━━━━━
はじめに
━━━━━━━━━━━━━━━━━━

${hook.replace(/\n/g, '')}

「頑張ってるのに結果が出ない」
「何をすればいいかわからない」

そんな気持ちを抱えている人に向けて、
この記事を書きました。

難しいことは一切なし。
知ってるかどうかの差だけで、
1年後に全然違う結果になることを伝えたい。

━━━━━━━━━━━━━━━━━━
${subtitle}
━━━━━━━━━━━━━━━━━━

ポイント① ${points[0].split('。')[0]}

${points[0]}

多くの人がここを後回しにします。
でも結果を出してる人ほど、ここを一番大切にしてる。
「そんなこと？」と思ったなら、今日から意識してみてほしい。

ポイント② ${points[1].split('。')[0]}

${points[1]}

地味に見えるけど、これが一番効く。
継続できる人とできない人の差は、たいていここにある。

ポイント③ ${points[2].split('。')[0]}

${points[2]}

ここまでできたら、正直かなり変わります。
「やってみたら思ったより簡単だった」という声が多いのも、このポイント。

━━━━━━━━━━━━━━━━━━
まとめ
━━━━━━━━━━━━━━━━━━

${theme}で大切なのは、この3つだけ。

完璧にやろうとしなくていい。
まず①だけ、今日から試してみてください。

「小さく始めて、続ける」
それが一番遠回りに見えて、一番の近道です。

この記事が少しでも参考になったら、
♡スキ を押してもらえると励みになります。

またシェアしてもらえたら、
同じ悩みを抱えてる人にも届くかもしれない。
よかったらお願いします🙏`;
}

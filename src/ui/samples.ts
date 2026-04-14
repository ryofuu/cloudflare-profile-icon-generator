export type Sample = {
  id: string;
  label: string;
  prompt: string;
  imageUrl: string | null;
};

export const SAMPLES: Sample[] = [
  {
    id: "cyberpunk-hacker",
    label: "サイバーパンクハッカー",
    prompt:
      "サイバーパンク風の女性ハッカー、ネオンブルーの照明、短髪、自信に満ちた表情、暗い背景にホログラム、SF映画のワンシーン",
    imageUrl: "/samples/cyberpunk-hacker.png",
  },
  {
    id: "street-fashion",
    label: "ストリートファッション",
    prompt:
      "ストリートファッションの青年、グラフィティの壁を背景に、キャップを被り横を向いている、都会的でクール、鮮やかな色彩",
    imageUrl: "/samples/street-fashion.png",
  },
  {
    id: "modern-samurai",
    label: "モダン侍",
    prompt:
      "和風テイストの侍、モダンなスーツ姿、桜吹雪の中に立つシルエット、墨絵風のタッチ、モノクロにワンポイントの赤",
    imageUrl: "/samples/modern-samurai.png",
  },
  {
    id: "astronaut",
    label: "宇宙飛行士ポートレート",
    prompt:
      "宇宙飛行士のヘルメットに星空が映り込んでいる、幻想的なポートレート、ダークブルーとパープルのグラデーション、静かで壮大な雰囲気",
    imageUrl: "/samples/astronaut.png",
  },
  {
    id: "low-poly",
    label: "ローポリゴンアート",
    prompt:
      "ローポリゴン風の女性の横顔、幾何学的なファセット、ティールとオレンジのコントラスト、ミニマルでモダンなデジタルアート",
    imageUrl: "/samples/low-poly.png",
  },
  {
    id: "jazz-musician",
    label: "ジャズミュージシャン",
    prompt:
      "ジャズミュージシャン、サックスを持つシルエット、煙たいバーの雰囲気、暖色のスポットライト、フィルムノワール風のコントラスト",
    imageUrl: "/samples/jazz-musician.png",
  },
];

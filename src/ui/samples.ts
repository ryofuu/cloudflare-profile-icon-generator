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
  {
    id: "dark-academia",
    label: "ダークアカデミア",
    prompt:
      "ダークアカデミア、古い図書館で革の本に囲まれた人物の横顔、暗い照明にキャンドルの光だけ、知的でミステリアスな雰囲気、ダークブラウンとゴールド",
    imageUrl: "/samples/dark-academia.png",
  },
  {
    id: "glitch-portrait",
    label: "グリッチポートレート",
    prompt:
      "グリッチポートレート、デジタルノイズに侵食された顔、ピンクとシアンのRGBズレ、壊れかけのデータ感、ダークな背景にスキャンライン",
    imageUrl: "/samples/glitch-portrait.png",
  },
  {
    id: "oil-painting",
    label: "油絵の自画像",
    prompt:
      "レンブラント風の重厚な油絵タッチの自画像、暖色の光と深い影、クラシカルで荘厳、ダークな背景に浮かび上がる顔",
    imageUrl: "/samples/oil-painting.png",
  },
  {
    id: "neon-tokyo",
    label: "ネオン東京",
    prompt:
      "雨の夜の東京の路地裏、傘をさした人物の後ろ姿、ネオンサインの反射が濡れた路面に映る、ブレードランナー風、シネマティック",
    imageUrl: "/samples/neon-tokyo.png",
  },
  {
    id: "mechanical-owl",
    label: "メカニカルフクロウ",
    prompt:
      "スチームパンク風の機械仕掛けのフクロウ、真鍮と歯車のディテール、ダークグリーンの背景、ビクトリア朝の雰囲気",
    imageUrl: "/samples/mechanical-owl.png",
  },
  {
    id: "ice-wolf",
    label: "氷の狼",
    prompt:
      "氷の結晶でできた狼の横顔、透明感のあるブルーとホワイト、オーロラの光が背景に、ファンタジー、繊細で壮大",
    imageUrl: "/samples/ice-wolf.png",
  },
];

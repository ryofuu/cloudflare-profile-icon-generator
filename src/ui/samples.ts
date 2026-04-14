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
    prompt: "サイバーパンク風の女性ハッカー、ネオンブルーの照明、短髪、自信に満ちた表情、暗い背景にホログラム、SF映画のワンシーン",
    imageUrl: "/samples/cyberpunk-hacker.png",
  },
  {
    id: "street-fashion",
    label: "ストリートファッション",
    prompt: "ストリートファッションの青年、グラフィティの壁を背景に、キャップを被り横を向いている、都会的でクール、鮮やかな色彩",
    imageUrl: "/samples/street-fashion.png",
  },
  {
    id: "modern-samurai",
    label: "モダン侍",
    prompt: "和風テイストの侍、モダンなスーツ姿、桜吹雪の中に立つシルエット、墨絵風のタッチ、モノクロにワンポイントの赤",
    imageUrl: "/samples/modern-samurai.png",
  },
  {
    id: "astronaut",
    label: "宇宙飛行士ポートレート",
    prompt: "宇宙飛行士のヘルメットに星空が映り込んでいる、幻想的なポートレート、ダークブルーとパープルのグラデーション、静かで壮大な雰囲気",
    imageUrl: "/samples/astronaut.png",
  },
  {
    id: "low-poly",
    label: "ローポリゴンアート",
    prompt: "ローポリゴン風の女性の横顔、幾何学的なファセット、ティールとオレンジのコントラスト、ミニマルでモダンなデジタルアート",
    imageUrl: "/samples/low-poly.png",
  },
  {
    id: "jazz-musician",
    label: "ジャズミュージシャン",
    prompt: "ジャズミュージシャン、サックスを持つシルエット、煙たいバーの雰囲気、暖色のスポットライト、フィルムノワール風のコントラスト",
    imageUrl: "/samples/jazz-musician.png",
  },
  {
    id: "dark-academia",
    label: "ダークアカデミア",
    prompt: "ダークアカデミア、古い図書館で革の本に囲まれた人物の横顔、暗い照明にキャンドルの光だけ、知的でミステリアスな雰囲気、ダークブラウンとゴールド",
    imageUrl: "/samples/dark-academia.png",
  },
  {
    id: "glitch-portrait",
    label: "グリッチポートレート",
    prompt: "グリッチポートレート、デジタルノイズに侵食された顔、ピンクとシアンのRGBズレ、壊れかけのデータ感、ダークな背景にスキャンライン",
    imageUrl: "/samples/glitch-portrait.png",
  },
  {
    id: "oil-painting",
    label: "油絵の自画像",
    prompt: "レンブラント風の重厚な油絵タッチの自画像、暖色の光と深い影、クラシカルで荘厳、ダークな背景に浮かび上がる顔",
    imageUrl: "/samples/oil-painting.png",
  },
  {
    id: "neon-tokyo",
    label: "ネオン東京",
    prompt: "雨の夜の東京の路地裏、傘をさした人物の後ろ姿、ネオンサインの反射が濡れた路面に映る、ブレードランナー風、シネマティック",
    imageUrl: "/samples/neon-tokyo.png",
  },
  {
    id: "mechanical-owl",
    label: "メカニカルフクロウ",
    prompt: "スチームパンク風の機械仕掛けのフクロウ、真鍮と歯車のディテール、ダークグリーンの背景、ビクトリア朝の雰囲気",
    imageUrl: "/samples/mechanical-owl.png",
  },
  {
    id: "ice-wolf",
    label: "氷の狼",
    prompt: "氷の結晶でできた狼の横顔、透明感のあるブルーとホワイト、オーロラの光が背景に、ファンタジー、繊細で壮大",
    imageUrl: "/samples/ice-wolf.png",
  },
  {
    id: "vaporwave",
    label: "ヴェイパーウェーブ",
    prompt: "ヴェイパーウェーブ風のポートレート、80年代レトロ、ピンクとパープルの夕暮れグラデーション、サングラスをかけた横顔、ノスタルジック",
    imageUrl: "/samples/vaporwave.png",
  },
  {
    id: "ink-martial-artist",
    label: "墨絵の武道家",
    prompt: "水墨画風の武道家、白黒の墨絵タッチ、道着姿で構える侍、動きのある筆致、余白を活かした和の構図",
    imageUrl: "/samples/ink-martial-artist.png",
  },
  {
    id: "pop-art",
    label: "ポップアート",
    prompt: "ポップアート風のポートレート、アンディ・ウォーホル風の大胆な配色、ハーフトーンのドットパターン、ピンクと黄色とシアン",
    imageUrl: "/samples/pop-art.png",
  },
  {
    id: "ukiyo-e",
    label: "浮世絵風",
    prompt: "浮世絵風の人物画、葛飾北斎風の波を背景に立つ人物、伝統的な藍色と朱色、木版画の質感",
    imageUrl: "/samples/ukiyo-e.png",
  },
  {
    id: "pencil-sketch",
    label: "鉛筆スケッチ",
    prompt: "鉛筆スケッチ風のポートレート、ラフなデッサン、クロスハッチングの陰影、白い画用紙、繊細な線画",
    imageUrl: "/samples/pencil-sketch.png",
  },
  {
    id: "neon-mask",
    label: "ネオンマスク",
    prompt: "ネオンに光る匿名マスク、暗闇の中にピンクとブルーのネオンライトで浮かび上がる仮面、サイバー感、ミステリアス",
    imageUrl: "/samples/neon-mask.png",
  },
  {
    id: "galaxy-cat",
    label: "銀河猫",
    prompt: "宇宙空間に浮かぶ猫のシルエット、体内に星雲と銀河が透けて見える、ダークブルーとパープル、神秘的",
    imageUrl: "/samples/galaxy-cat.png",
  },
  {
    id: "dragon-eye",
    label: "ドラゴンの眼",
    prompt: "ドラゴンの眼のクローズアップ、爬虫類の縦長の瞳孔、金色に光る虹彩、鱗のディテール、ファンタジー",
    imageUrl: "/samples/dragon-eye.png",
  },
  {
    id: "phoenix",
    label: "鳳凰",
    prompt: "炎をまとった不死鳥、赤と金のグラデーション、翼を広げた鳳凰、ダークな背景に舞い上がる火の粉",
    imageUrl: "/samples/phoenix.png",
  },
  {
    id: "deep-sea-shark",
    label: "深海のサメ",
    prompt: "暗い深海を泳ぐサメのシルエット、青い生物発光に照らされる、静かで不気味、ディープブルー",
    imageUrl: "/samples/deep-sea-shark.png",
  },
  {
    id: "burning-rose",
    label: "燃える薔薇",
    prompt: "炎に包まれた一輪の赤い薔薇、花びらが燃え上がる瞬間、ダークな背景、ドラマチックな照明",
    imageUrl: "/samples/burning-rose.png",
  },
  {
    id: "crystal-heart",
    label: "クリスタルの心臓",
    prompt: "宝石のように輝くクリスタルの心臓、プリズムの光が虹色に分散、透明感、ダークな背景に浮かぶ",
    imageUrl: "/samples/crystal-heart.png",
  },
  {
    id: "underwater-city",
    label: "海底都市",
    prompt: "水中に沈んだ古代都市の廃墟、光の筋が水面から差し込む、苔むした石柱、神秘的な海底、ティールとエメラルド",
    imageUrl: "/samples/underwater-city.png",
  },
  {
    id: "moon-solitude",
    label: "月面の孤独",
    prompt: "月面に立つ宇宙飛行士の小さなシルエット、巨大な地球が空に浮かぶ、孤独と壮大さ、モノクロにブルーのアクセント",
    imageUrl: "/samples/moon-solitude.png",
  },
  {
    id: "art-deco",
    label: "アールデコ",
    prompt: "アールデコ風のポートレート、1920年代の装飾的なフレーム、金と黒のコントラスト、幾何学的な装飾、エレガント",
    imageUrl: "/samples/art-deco.png",
  },
  {
    id: "bonsai",
    label: "盆栽",
    prompt: "精緻な盆栽、苔むした岩と白砂、和の静寂、柔らかな自然光、ミニマルで禅の雰囲気",
    imageUrl: "/samples/bonsai.png",
  },
  {
    id: "cyberspace",
    label: "電脳空間",
    prompt: "マトリックス風の電脳空間、緑色の文字列が流れ落ちる、デジタルの雨、暗い背景、ハッカーの世界",
    imageUrl: "/samples/cyberspace.png",
  },
  {
    id: "constellation",
    label: "星座ポートレート",
    prompt: "星座の線で描かれた人物の横顔、夜空の背景に光る星々を繋ぐ線、天文学的で幻想的、ダークネイビーとゴールド",
    imageUrl: "/samples/constellation.png",
  },
  {
    id: "handdrawn-cat",
    label: "ムーンライトキャット",
    prompt: "猫のシルエット、ダークブルーとパープル、神秘的、人が描いたような手書き感、温かみのある筆のタッチ",
    imageUrl: "/samples/handdrawn-cat.png",
  },
  {
    id: "shiba-dog",
    label: "柴犬",
    prompt: "かわいい犬のポートレート、柴犬、ふわふわの毛並み、目がキラキラ、パステルカラーの背景、手描きイラスト風",
    imageUrl: "/samples/shiba-dog.png",
  },
  {
    id: "sleeping-cat",
    label: "眠り猫",
    prompt: "丸まって眠る三毛猫、水彩画風、柔らかいタッチ、暖かい色合い、毛布の上、癒し系イラスト",
    imageUrl: "/samples/sleeping-cat.png",
  },
];

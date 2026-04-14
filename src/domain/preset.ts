import { NotFoundError } from "@/domain/errors";

export type PresetId = "square" | "landscape" | "portrait";

export type SizePreset = {
  id: PresetId;
  label: string;
  description: string;
  width: number;
  height: number;
  format: "png" | "jpeg";
  promptSuffix: string;
};

const SAFE_CROP_SUFFIX =
  "centered composition, important elements in center, safe for circular crop";

export const PRESETS: SizePreset[] = [
  {
    id: "square",
    label: "正方形",
    description: "1024x1024 — X, Instagram, Discord などのプロフィールアイコンに",
    width: 1024,
    height: 1024,
    format: "png",
    promptSuffix: SAFE_CROP_SUFFIX,
  },
  {
    id: "landscape",
    label: "横長",
    description: "1536x1024 — X ヘッダー, YouTube バナー, OGP 画像に",
    width: 1536,
    height: 1024,
    format: "png",
    promptSuffix: SAFE_CROP_SUFFIX,
  },
  {
    id: "portrait",
    label: "縦長",
    description: "1024x1536 — Instagram ストーリー, TikTok, スマホ壁紙に",
    width: 1024,
    height: 1536,
    format: "png",
    promptSuffix: SAFE_CROP_SUFFIX,
  },
];

export function listPresets(): SizePreset[] {
  return PRESETS;
}

export function findPreset(id: string): SizePreset | undefined {
  return PRESETS.find((preset) => preset.id === id);
}

export function getPreset(id: string): SizePreset {
  return findPreset(id) ?? (() => {
    throw new NotFoundError("Preset", id);
  })();
}

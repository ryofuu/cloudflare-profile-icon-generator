import { NotFoundError } from "@/domain/errors";

export type PresetId =
  | "x-twitter"
  | "instagram"
  | "discord"
  | "universal";

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
    id: "x-twitter",
    label: "X (Twitter)",
    description: "400x400px, 円形切り抜きでも主題が中央に残るよう最適化",
    width: 400,
    height: 400,
    format: "png",
    promptSuffix: SAFE_CROP_SUFFIX,
  },
  {
    id: "instagram",
    label: "Instagram",
    description: "1080x1080px, 円形切り抜きでも主題が中央に残るよう最適化",
    width: 1080,
    height: 1080,
    format: "png",
    promptSuffix: SAFE_CROP_SUFFIX,
  },
  {
    id: "discord",
    label: "Discord",
    description: "512x512px, 円形切り抜きでも主題が中央に残るよう最適化",
    width: 512,
    height: 512,
    format: "png",
    promptSuffix: SAFE_CROP_SUFFIX,
  },
  {
    id: "universal",
    label: "汎用",
    description: "512x512px, 主要サービスへ使い回しやすい汎用サイズ",
    width: 512,
    height: 512,
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


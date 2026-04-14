import { describe, expect, it } from "vitest";
import { getPreset, listPresets } from "@/domain/preset";

describe("preset catalog", () => {
  it("returns the built-in presets", () => {
    const presets = listPresets();
    expect(presets).toHaveLength(3);
    expect(presets.map((preset) => preset.id)).toEqual([
      "square",
      "landscape",
      "portrait",
    ]);
  });

  it("looks up a preset by id", () => {
    const preset = getPreset("portrait");
    expect(preset.width).toBe(1024);
    expect(preset.height).toBe(1536);
    expect(preset.format).toBe("png");
  });
});

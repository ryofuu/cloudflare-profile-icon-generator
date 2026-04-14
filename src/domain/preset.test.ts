import { describe, expect, it } from "vitest";
import { getPreset, listPresets } from "@/domain/preset";

describe("preset catalog", () => {
  it("returns the built-in presets", () => {
    const presets = listPresets();
    expect(presets).toHaveLength(4);
    expect(presets.map((preset) => preset.id)).toContain("x-twitter");
  });

  it("looks up a preset by id", () => {
    const preset = getPreset("discord");
    expect(preset.width).toBe(512);
    expect(preset.format).toBe("png");
  });
});


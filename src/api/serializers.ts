import type { Generation } from "@/domain/generation";
import type { SizePreset } from "@/domain/preset";

export type GenerationDto = {
  id: string;
  prompt: string;
  fullPrompt: string;
  presetId: string;
  width: number;
  height: number;
  model: string;
  imageUrl: string | null;
  createdAt: string;
  status: Generation["status"];
  errorMessage: string | null;
  hidden: boolean;
};

export function serializeGeneration(generation: Generation): GenerationDto {
  return {
    id: generation.id,
    prompt: generation.prompt,
    fullPrompt: generation.fullPrompt,
    presetId: generation.presetId,
    width: generation.width,
    height: generation.height,
    model: generation.model,
    imageUrl:
      generation.status === "succeeded"
        ? `/api/generations/${generation.id}/image`
        : null,
    createdAt: generation.createdAt,
    status: generation.status,
    errorMessage: generation.errorMessage,
    hidden: generation.hidden,
  };
}

export function serializePreset(preset: SizePreset): SizePreset {
  return preset;
}

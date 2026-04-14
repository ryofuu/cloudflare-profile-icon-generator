import { ValidationError } from "@/domain/errors";
import {
  createPendingGeneration,
  markGenerationFailed,
  markGenerationSucceeded,
  type Generation,
} from "@/domain/generation";
import type { ImageGenerator } from "@/domain/image-generator/interface";
import type { GenerationRepository } from "@/domain/generation-repository";
import type { ImageStorage } from "@/domain/image-storage";
import { getPreset } from "@/domain/preset";

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Generation failed.";
}

export class CreateGeneration {
  constructor(
    private readonly generator: ImageGenerator,
    private readonly repository: GenerationRepository,
    private readonly storage: ImageStorage,
  ) {}

  async execute(input: {
    prompt: string;
    presetId: string;
  }): Promise<Generation> {
    const prompt = input.prompt.trim();
    if (!prompt) {
      throw new ValidationError("Prompt is required.");
    }

    const preset = getPreset(input.presetId);
    const fullPrompt = `${prompt}, ${preset.promptSuffix}`;
    const pendingGeneration = createPendingGeneration({
      prompt,
      fullPrompt,
      presetId: preset.id,
      width: preset.width,
      height: preset.height,
      format: preset.format,
    });
    await this.repository.save(pendingGeneration);

    try {
      const result = await this.generator.generate({
        prompt: fullPrompt,
        width: preset.width,
        height: preset.height,
      });

      await this.storage.save(
        pendingGeneration.imageKey,
        result.image,
        `image/${preset.format}`,
      );

      const succeededGeneration = markGenerationSucceeded(
        pendingGeneration,
        result.model,
      );
      await this.repository.save(succeededGeneration);

      return succeededGeneration;
    } catch (error) {
      await this.storage.delete(pendingGeneration.imageKey).catch(() => undefined);
      await this.repository
        .save(markGenerationFailed(pendingGeneration, getErrorMessage(error)))
        .catch(() => undefined);
      throw error;
    }
  }
}

import { describe, expect, it } from "vitest";
import { CreateGeneration } from "@/usecase/create-generation";
import {
  MemoryGenerationRepository,
  MemoryImageStorage,
  mockImageGenerator,
} from "@/testing/fakes";
import type { ImageGenerator } from "@/domain/image-generator/interface";

describe("CreateGeneration", () => {
  it("persists a generated asset with the preset suffix", async () => {
    const repository = new MemoryGenerationRepository();
    const storage = new MemoryImageStorage();
    const usecase = new CreateGeneration(mockImageGenerator, repository, storage);

    const generation = await usecase.execute({
      prompt: "赤い背景の狼",
      presetId: "square",
    });

    expect(generation.fullPrompt).toContain("safe for circular crop");
    expect(storage.entries.has(generation.imageKey)).toBe(true);
    expect(repository.items[0]?.id).toBe(generation.id);
    expect(repository.items[0]?.status).toBe("succeeded");
    expect(generation.width).toBe(1024);
    expect(generation.height).toBe(1024);
    expect(generation.model).toBe("mock/image-generator");
  });

  it("marks the generation as failed when the provider throws", async () => {
    const generator: ImageGenerator = {
      async generate() {
        throw new Error("provider unavailable");
      },
    };

    const repository = new MemoryGenerationRepository();
    const storage = new MemoryImageStorage();
    const usecase = new CreateGeneration(generator, repository, storage);

    await expect(
      usecase.execute({
        prompt: "赤い背景の狼",
        presetId: "square",
      }),
    ).rejects.toThrow("provider unavailable");

    expect(repository.items).toHaveLength(1);
    expect(repository.items[0]?.status).toBe("failed");
    expect(repository.items[0]?.errorMessage).toBe("provider unavailable");
  });
});

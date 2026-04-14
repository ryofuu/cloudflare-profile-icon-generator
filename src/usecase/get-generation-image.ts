import { NotFoundError, ValidationError } from "@/domain/errors";
import type { GenerationRepository } from "@/domain/generation-repository";
import type { ImageStorage } from "@/domain/image-storage";

export class GetGenerationImage {
  constructor(
    private readonly repository: GenerationRepository,
    private readonly storage: ImageStorage,
  ) {}

  async execute(id: string): Promise<{ image: ArrayBuffer; contentType: string }> {
    const generation = await this.repository.findById(id);
    if (!generation) {
      throw new NotFoundError("Generation", id);
    }

    if (generation.status !== "succeeded") {
      throw new ValidationError("Image is not available until generation succeeds.");
    }

    const image = await this.storage.get(generation.imageKey);
    if (!image) {
      throw new NotFoundError("Image", generation.imageKey);
    }

    const contentType = generation.imageKey.endsWith(".png")
      ? "image/png"
      : "image/jpeg";

    return { image, contentType };
  }
}

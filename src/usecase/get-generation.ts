import { NotFoundError } from "@/domain/errors";
import type { Generation } from "@/domain/generation";
import type { GenerationRepository } from "@/domain/generation-repository";

export class GetGeneration {
  constructor(private readonly repository: GenerationRepository) {}

  async execute(id: string): Promise<Generation> {
    const generation = await this.repository.findById(id);
    if (!generation) {
      throw new NotFoundError("Generation", id);
    }

    return generation;
  }
}


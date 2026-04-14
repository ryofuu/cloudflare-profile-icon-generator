import { ValidationError } from "@/domain/errors";
import type { Generation } from "@/domain/generation";
import type { GenerationRepository } from "@/domain/generation-repository";

export class ListGenerations {
  constructor(private readonly repository: GenerationRepository) {}

  async execute(params: {
    limit: number;
    cursor?: string;
  }): Promise<{ items: Generation[]; nextCursor: string | null }> {
    const limit = Number.isFinite(params.limit) ? params.limit : 20;
    if (limit < 1 || limit > 100) {
      throw new ValidationError("limit must be between 1 and 100.");
    }

    return this.repository.findAll({
      limit,
      cursor: params.cursor,
    });
  }
}


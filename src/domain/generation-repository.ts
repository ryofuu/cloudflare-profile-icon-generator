import type { Generation } from "@/domain/generation";

export interface GenerationRepository {
  save(generation: Generation): Promise<void>;
  findById(id: string): Promise<Generation | null>;
  findAll(params: {
    limit: number;
    cursor?: string;
  }): Promise<{
    items: Generation[];
    nextCursor: string | null;
  }>;
}


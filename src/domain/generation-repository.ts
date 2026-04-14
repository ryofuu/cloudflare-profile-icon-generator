import type { Generation } from "@/domain/generation";

export interface GenerationRepository {
  save(generation: Generation): Promise<void>;
  findById(id: string): Promise<Generation | null>;
  findAll(params: {
    limit: number;
    cursor?: string;
    includeHidden?: boolean;
  }): Promise<{
    items: Generation[];
    nextCursor: string | null;
  }>;
  updateHidden(id: string, hidden: boolean): Promise<void>;
}


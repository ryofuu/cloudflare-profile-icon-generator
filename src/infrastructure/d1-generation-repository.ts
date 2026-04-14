import { desc, eq, lt } from "drizzle-orm";
import type { GenerationRepository } from "@/domain/generation-repository";
import type { Generation } from "@/domain/generation";
import type { Database } from "@/infrastructure/database";
import { generations } from "@/infrastructure/schema";

function mapRowToGeneration(row: typeof generations.$inferSelect): Generation {
  return {
    id: row.id,
    prompt: row.prompt,
    fullPrompt: row.fullPrompt,
    presetId: row.presetId,
    width: row.width,
    height: row.height,
    model: row.model,
    imageKey: row.imageKey,
    createdAt: row.createdAt,
    status: row.status as Generation["status"],
    errorMessage: row.errorMessage,
  };
}

export class D1GenerationRepository implements GenerationRepository {
  constructor(private readonly db: Database) {}

  async save(generation: Generation): Promise<void> {
    await this.db
      .insert(generations)
      .values({
        id: generation.id,
        prompt: generation.prompt,
        fullPrompt: generation.fullPrompt,
        presetId: generation.presetId,
        width: generation.width,
        height: generation.height,
        model: generation.model,
        imageKey: generation.imageKey,
        createdAt: generation.createdAt,
        status: generation.status,
        errorMessage: generation.errorMessage,
      })
      .onConflictDoUpdate({
        target: generations.id,
        set: {
          prompt: generation.prompt,
          fullPrompt: generation.fullPrompt,
          presetId: generation.presetId,
          width: generation.width,
          height: generation.height,
          model: generation.model,
          imageKey: generation.imageKey,
          createdAt: generation.createdAt,
          status: generation.status,
          errorMessage: generation.errorMessage,
        },
      });
  }

  async findById(id: string): Promise<Generation | null> {
    const [row] = await this.db
      .select()
      .from(generations)
      .where(eq(generations.id, id))
      .limit(1);

    return row ? mapRowToGeneration(row) : null;
  }

  async findAll(params: {
    limit: number;
    cursor?: string;
  }): Promise<{ items: Generation[]; nextCursor: string | null }> {
    const rows = params.cursor
      ? await this.db
          .select()
          .from(generations)
          .where(lt(generations.id, params.cursor))
          .orderBy(desc(generations.id))
          .limit(params.limit + 1)
      : await this.db
          .select()
          .from(generations)
          .orderBy(desc(generations.id))
          .limit(params.limit + 1);

    const items = rows.slice(0, params.limit).map(mapRowToGeneration);
    const nextCursor =
      rows.length > params.limit ? items[items.length - 1]?.id ?? null : null;

    return { items, nextCursor };
  }
}

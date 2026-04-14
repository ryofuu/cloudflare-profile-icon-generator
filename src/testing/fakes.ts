import type { Generation } from "@/domain/generation";
import type { GenerationRepository } from "@/domain/generation-repository";
import type { ImageGenerator } from "@/domain/image-generator/interface";
import type { ImageStorage } from "@/domain/image-storage";

export class MemoryGenerationRepository implements GenerationRepository {
  items: Generation[] = [];

  async save(generation: Generation): Promise<void> {
    const index = this.items.findIndex((item) => item.id === generation.id);
    if (index >= 0) {
      this.items[index] = generation;
      return;
    }

    this.items.push(generation);
  }

  async findById(id: string): Promise<Generation | null> {
    return this.items.find((item) => item.id === id) ?? null;
  }

  async findAll(params: {
    limit: number;
    cursor?: string;
    includeHidden?: boolean;
  }): Promise<{ items: Generation[]; nextCursor: string | null }> {
    const filtered = params.includeHidden
      ? this.items
      : this.items.filter((item) => !item.hidden);
    const sorted = [...filtered].sort((left, right) =>
      right.id.localeCompare(left.id),
    );
    const startIndex = params.cursor
      ? sorted.findIndex((item) => item.id === params.cursor) + 1
      : 0;
    const items = sorted.slice(startIndex, startIndex + params.limit);
    const nextCursor =
      startIndex + params.limit < sorted.length
        ? items[items.length - 1]?.id ?? null
        : null;

    return { items, nextCursor };
  }

  async updateHidden(id: string, hidden: boolean): Promise<void> {
    const item = this.items.find((item) => item.id === id);
    if (item) {
      item.hidden = hidden;
    }
  }
}

export class MemoryImageStorage implements ImageStorage {
  entries = new Map<string, ArrayBuffer>();

  async save(key: string, image: ArrayBuffer): Promise<void> {
    this.entries.set(key, image);
  }

  async get(key: string): Promise<ArrayBuffer | null> {
    return this.entries.get(key) ?? null;
  }

  async delete(key: string): Promise<void> {
    this.entries.delete(key);
  }
}

export const mockImageGenerator: ImageGenerator = {
  async generate() {
    return {
      image: new Uint8Array([1, 2, 3]).buffer,
      model: "mock/image-generator",
    };
  },
};

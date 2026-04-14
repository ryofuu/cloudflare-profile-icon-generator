import type { ImageStorage } from "@/domain/image-storage";

export class R2ImageStorage implements ImageStorage {
  constructor(private readonly bucket: R2Bucket) {}

  async save(
    key: string,
    image: ArrayBuffer,
    contentType: string,
  ): Promise<void> {
    await this.bucket.put(key, image, {
      httpMetadata: {
        contentType,
      },
    });
  }

  async get(key: string): Promise<ArrayBuffer | null> {
    const object = await this.bucket.get(key);
    return object ? object.arrayBuffer() : null;
  }

  async delete(key: string): Promise<void> {
    await this.bucket.delete(key);
  }
}

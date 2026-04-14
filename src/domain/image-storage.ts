export interface ImageStorage {
  save(key: string, image: ArrayBuffer, contentType: string): Promise<void>;
  get(key: string): Promise<ArrayBuffer | null>;
  delete(key: string): Promise<void>;
}

export interface Env {
  DB: D1Database;
  IMAGES: R2Bucket;
  AI?: Ai;
  IMAGE_GENERATOR?: string;
  AI_MODEL?: string;
}


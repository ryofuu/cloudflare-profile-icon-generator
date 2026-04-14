import { ConfigurationError } from "@/domain/errors";
import type { ImageGenerator } from "@/domain/image-generator/interface";

export class OpenAIGenerator implements ImageGenerator {
  async generate(): Promise<{ image: ArrayBuffer; model: string }> {
    throw new ConfigurationError(
      "The OpenAI image generator is reserved for future support and is not implemented yet.",
    );
  }
}


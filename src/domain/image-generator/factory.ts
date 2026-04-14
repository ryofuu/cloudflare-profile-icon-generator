import { ConfigurationError } from "@/domain/errors";
import { MockImageGenerator } from "@/domain/image-generator/mock";
import { OpenAIGenerator } from "@/domain/image-generator/openai";
import type { ImageGenerator } from "@/domain/image-generator/interface";
import { WorkersAIGenerator } from "@/domain/image-generator/workers-ai";
import type { Env } from "@/infrastructure/bindings";

export function createImageGenerator(env: Env): ImageGenerator {
  const type = env.IMAGE_GENERATOR ?? (env.AI ? "workers-ai" : "mock");
  const model = env.AI_MODEL ?? "@cf/black-forest-labs/flux-1-schnell";

  switch (type) {
    case "mock":
      return new MockImageGenerator();
    case "workers-ai":
      return new WorkersAIGenerator(env.AI, model);
    case "openai":
      return new OpenAIGenerator();
    default:
      throw new ConfigurationError(`Unsupported IMAGE_GENERATOR "${type}".`);
  }
}


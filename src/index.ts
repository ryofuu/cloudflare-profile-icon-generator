import { createApp } from "@/app";
import { createImageGenerator } from "@/domain/image-generator/factory";
import { createDb } from "@/infrastructure/database";
import { D1GenerationRepository } from "@/infrastructure/d1-generation-repository";
import type { Env } from "@/infrastructure/bindings";
import { R2ImageStorage } from "@/infrastructure/r2-image-storage";
import { CreateGeneration } from "@/usecase/create-generation";
import { GetGeneration } from "@/usecase/get-generation";
import { GetGenerationImage } from "@/usecase/get-generation-image";
import { ListGenerations } from "@/usecase/list-generations";

function createDependencies(env: Env) {
  const repository = new D1GenerationRepository(createDb(env.DB));
  const storage = new R2ImageStorage(env.IMAGES);
  const generator = createImageGenerator(env);

  return {
    createGeneration: new CreateGeneration(generator, repository, storage),
    getGeneration: new GetGeneration(repository),
    listGenerations: new ListGenerations(repository),
    getGenerationImage: new GetGenerationImage(repository, storage),
  };
}

export default {
  async fetch(request, env): Promise<Response> {
    return createApp(createDependencies(env as Env)).fetch(request, env);
  },
} satisfies ExportedHandler<Env>;

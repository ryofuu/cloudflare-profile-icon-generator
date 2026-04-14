import { Hono } from "hono";
import { ValidationError } from "@/domain/errors";
import type { GenerationRepository } from "@/domain/generation-repository";
import type { CreateGeneration } from "@/usecase/create-generation";
import type { GetGeneration } from "@/usecase/get-generation";
import type { GetGenerationImage } from "@/usecase/get-generation-image";
import type { ListGenerations } from "@/usecase/list-generations";
import { serializeGeneration } from "@/api/serializers";

type GenerationRouteDependencies = {
  createGeneration: CreateGeneration;
  getGeneration: GetGeneration;
  getGenerationImage: GetGenerationImage;
  listGenerations: ListGenerations;
  generationRepository: GenerationRepository;
};

function asCreateRequest(
  value: unknown,
): { prompt: string; presetId: string } {
  if (!value || typeof value !== "object") {
    throw new ValidationError("Request body must be a JSON object.");
  }

  const prompt = "prompt" in value ? value.prompt : undefined;
  const presetId = "presetId" in value ? value.presetId : undefined;

  if (typeof prompt !== "string" || typeof presetId !== "string") {
    throw new ValidationError("prompt and presetId must be strings.");
  }

  return { prompt, presetId };
}

export function createGenerationRoutes(deps: GenerationRouteDependencies) {
  const app = new Hono();

  app.post("/", async (c) => {
    const body = await c.req.json();
    const input = asCreateRequest(body);
    const generation = await deps.createGeneration.execute(input);

    return c.json(serializeGeneration(generation), 201);
  });

  app.get("/", async (c) => {
    const limit = c.req.query("limit")
      ? Number(c.req.query("limit"))
      : 20;
    const cursor = c.req.query("cursor") ?? undefined;
    const includeHidden = c.req.query("includeHidden") === "true";

    const result = await deps.listGenerations.execute({ limit, cursor, includeHidden });
    return c.json({
      items: result.items.map(serializeGeneration),
      nextCursor: result.nextCursor,
    });
  });

  app.get("/:id", async (c) => {
    const generation = await deps.getGeneration.execute(c.req.param("id"));
    return c.json(serializeGeneration(generation));
  });

  app.patch("/:id/hidden", async (c) => {
    const body = await c.req.json() as { hidden?: boolean };
    if (typeof body.hidden !== "boolean") {
      throw new ValidationError("hidden must be a boolean.");
    }
    await deps.generationRepository.updateHidden(c.req.param("id"), body.hidden);
    return c.json({ ok: true });
  });

  app.get("/:id/image", async (c) => {
    const result = await deps.getGenerationImage.execute(c.req.param("id"));
    return new Response(result.image, {
      headers: {
        "content-type": result.contentType,
        "cache-control": "public, max-age=31536000, immutable",
      },
    });
  });

  return app;
}


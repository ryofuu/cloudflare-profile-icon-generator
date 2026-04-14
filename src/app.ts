import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { createApiRoutes } from "@/api/routes";
import { DomainError, NotFoundError } from "@/domain/errors";

export type AppDependencies = {
  createGeneration: import("@/usecase/create-generation").CreateGeneration;
  getGeneration: import("@/usecase/get-generation").GetGeneration;
  listGenerations: import("@/usecase/list-generations").ListGenerations;
  getGenerationImage: import("@/usecase/get-generation-image").GetGenerationImage;
};

export function createApp(deps: AppDependencies) {
  const app = new Hono();

  app.route("/api", createApiRoutes(deps));

  app.notFound((c) => c.json({ error: "Not Found" }, 404));

  app.onError((error, c) => {
    if (error instanceof HTTPException) {
      return error.getResponse();
    }

    if (error instanceof NotFoundError) {
      return c.json({ error: error.message }, 404);
    }

    if (error instanceof DomainError) {
      return c.json({ error: error.message }, 400);
    }

    console.error(error);
    return c.json({ error: "Internal Server Error" }, 500);
  });

  return app;
}


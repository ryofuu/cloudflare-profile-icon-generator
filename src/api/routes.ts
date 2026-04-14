import { Hono } from "hono";
import { createGenerationRoutes } from "@/api/generations";
import { createPresetRoutes } from "@/api/presets";
import type { AppDependencies } from "@/app";

export function createApiRoutes(deps: AppDependencies) {
  const app = new Hono();

  app.route("/generations", createGenerationRoutes(deps));
  app.route("/presets", createPresetRoutes());

  return app;
}


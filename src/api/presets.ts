import { Hono } from "hono";
import { getPreset, listPresets } from "@/domain/preset";
import { serializePreset } from "@/api/serializers";

export function createPresetRoutes() {
  const app = new Hono();

  app.get("/", (c) => {
    return c.json({
      items: listPresets().map(serializePreset),
    });
  });

  app.get("/:id", (c) => {
    const preset = getPreset(c.req.param("id"));
    return c.json(serializePreset(preset));
  });

  return app;
}


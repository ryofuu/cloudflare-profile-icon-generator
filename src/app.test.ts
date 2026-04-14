import { describe, expect, it } from "vitest";
import { createApp } from "@/app";
import {
  MemoryGenerationRepository,
  MemoryImageStorage,
  mockImageGenerator,
} from "@/testing/fakes";
import { CreateGeneration } from "@/usecase/create-generation";
import { GetGeneration } from "@/usecase/get-generation";
import { GetGenerationImage } from "@/usecase/get-generation-image";
import { ListGenerations } from "@/usecase/list-generations";

function createTestApp() {
  const repository = new MemoryGenerationRepository();
  const storage = new MemoryImageStorage();

  return createApp({
    createGeneration: new CreateGeneration(
      mockImageGenerator,
      repository,
      storage,
    ),
    getGeneration: new GetGeneration(repository),
    listGenerations: new ListGenerations(repository),
    getGenerationImage: new GetGenerationImage(repository, storage),
  });
}

describe("API routes", () => {
  it("returns preset catalog", async () => {
    const app = createTestApp();
    const response = await app.request("/api/presets");

    expect(response.status).toBe(200);
    const body = (await response.json()) as { items: Array<{ id: string }> };
    expect(body.items[0]?.id).toBe("x-twitter");
  });

  it("creates and retrieves a generation", async () => {
    const app = createTestApp();
    const createResponse = await app.request("/api/generations", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        prompt: "雲の上の少女",
        presetId: "instagram",
      }),
    });

    expect(createResponse.status).toBe(201);
    const created = (await createResponse.json()) as {
      id: string;
      status: string;
      imageUrl: string | null;
    };
    const detailResponse = await app.request(`/api/generations/${created.id}`);
    const imageResponse = await app.request(
      `/api/generations/${created.id}/image`,
    );

    expect(created.status).toBe("succeeded");
    expect(created.imageUrl).not.toBeNull();
    expect(detailResponse.status).toBe(200);
    expect(imageResponse.headers.get("content-type")).toBe("image/png");
  });
});

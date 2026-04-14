import { ConfigurationError } from "@/domain/errors";
import type { ImageGenerator } from "@/domain/image-generator/interface";

function resolveSize(width: number, height: number): string {
  if (width === height) return "1024x1024";
  if (width > height) return "1536x1024";
  return "1024x1536";
}

export class OpenAIGenerator implements ImageGenerator {
  private readonly model = "gpt-image-1";

  constructor(private readonly apiKey: string) {}

  async generate(params: {
    prompt: string;
    width: number;
    height: number;
  }): Promise<{ image: ArrayBuffer; model: string }> {
    if (!this.apiKey) {
      throw new ConfigurationError(
        "OPENAI_API_KEY is not set. Set it via wrangler secret or .dev.vars.",
      );
    }

    const response = await fetch(
      "https://api.openai.com/v1/images/generations",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          prompt: params.prompt,
          n: 1,
          size: resolveSize(params.width, params.height),
        }),
      },
    );

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      throw new Error(
        `OpenAI API error (${response.status}): ${body}`,
      );
    }

    const result = (await response.json()) as {
      data: { b64_json: string }[];
    };
    const binary = atob(result.data[0].b64_json);
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));

    return { image: bytes.buffer, model: this.model };
  }
}


import { ConfigurationError } from "@/domain/errors";
import type { ImageGenerator } from "@/domain/image-generator/interface";

function asArrayBuffer(value: unknown): ArrayBuffer | null {
  if (value instanceof ArrayBuffer) {
    return value;
  }

  if (ArrayBuffer.isView(value)) {
    const bytes = new Uint8Array(value.byteLength);
    bytes.set(new Uint8Array(value.buffer, value.byteOffset, value.byteLength));
    return bytes.buffer;
  }

  if (Array.isArray(value) && value.every((item) => typeof item === "number")) {
    return new Uint8Array(value).buffer;
  }

  if (typeof value === "string") {
    const binary = atob(value);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    return bytes.buffer;
  }

  if (value && typeof value === "object") {
    const nested =
      "image" in value
        ? (value as { image: unknown }).image
        : "result" in value
          ? (value as { result: unknown }).result
          : "data" in value
            ? (value as { data: unknown }).data
            : null;

    return nested ? asArrayBuffer(nested) : null;
  }

  return null;
}

export class WorkersAIGenerator implements ImageGenerator {
  constructor(
    private readonly ai: Ai | undefined,
    private readonly model: string,
  ) {}

  async generate(params: {
    prompt: string;
    width: number;
    height: number;
  }): Promise<{ image: ArrayBuffer; model: string }> {
    if (!this.ai) {
      throw new ConfigurationError(
        "Workers AI binding is missing. Configure AI or switch IMAGE_GENERATOR to mock.",
      );
    }

    const response = await this.ai.run(this.model, {
      prompt: params.prompt,
      width: params.width,
      height: params.height,
    });

    const image = asArrayBuffer(response);
    if (!image) {
      throw new ConfigurationError(
        "Workers AI returned an unsupported image payload shape.",
      );
    }

    return {
      image,
      model: this.model,
    };
  }
}

import type { ImageGenerator } from "@/domain/image-generator/interface";

const MOCK_PNG_BYTES = new Uint8Array([
  137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82, 0, 0, 0, 1,
  0, 0, 0, 1, 8, 4, 0, 0, 0, 181, 28, 12, 2, 0, 0, 0, 11, 73, 68, 65, 84, 120,
  218, 99, 252, 255, 31, 0, 3, 3, 1, 255, 165, 43, 4, 93, 0, 0, 0, 0, 73, 69,
  78, 68, 174, 66, 96, 130,
]);

export class MockImageGenerator implements ImageGenerator {
  async generate(): Promise<{ image: ArrayBuffer; model: string }> {
    return {
      image: MOCK_PNG_BYTES.slice().buffer,
      model: "mock/image-generator",
    };
  }
}


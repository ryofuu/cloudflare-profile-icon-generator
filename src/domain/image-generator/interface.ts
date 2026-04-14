export interface ImageGenerator {
  generate(params: {
    prompt: string;
    width: number;
    height: number;
  }): Promise<{
    image: ArrayBuffer;
    model: string;
  }>;
}


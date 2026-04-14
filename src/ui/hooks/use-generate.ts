import { useState } from "react";
import type { GenerationDto } from "@/api/serializers";

type GenerateInput = {
  prompt: string;
  presetId: string;
};

export function useGenerate() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate(input: GenerateInput): Promise<GenerationDto> {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/generations", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(body?.error ?? "画像生成に失敗しました。");
      }

      return (await response.json()) as GenerationDto;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "画像生成に失敗しました。";
      setError(message);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }

  return { generate, isSubmitting, error };
}


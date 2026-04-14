import { ulid } from "ulid";

export type Generation = {
  id: string;
  prompt: string;
  fullPrompt: string;
  presetId: string;
  width: number;
  height: number;
  model: string;
  imageKey: string;
  createdAt: string;
  status: "pending" | "succeeded" | "failed";
  errorMessage: string | null;
};

export type PendingGenerationInput = {
  prompt: string;
  fullPrompt: string;
  presetId: string;
  width: number;
  height: number;
  format: "png" | "jpeg";
};

export function createPendingGeneration(
  input: PendingGenerationInput,
): Generation {
  const id = ulid();

  return {
    id,
    prompt: input.prompt,
    fullPrompt: input.fullPrompt,
    presetId: input.presetId,
    width: input.width,
    height: input.height,
    model: "",
    imageKey: `generations/${id}.${input.format}`,
    createdAt: new Date().toISOString(),
    status: "pending",
    errorMessage: null,
  };
}

export function markGenerationSucceeded(
  generation: Generation,
  model: string,
): Generation {
  return {
    ...generation,
    model,
    status: "succeeded",
    errorMessage: null,
  };
}

export function markGenerationFailed(
  generation: Generation,
  errorMessage: string,
): Generation {
  return {
    ...generation,
    status: "failed",
    errorMessage,
  };
}

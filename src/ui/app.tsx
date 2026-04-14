import { startTransition, useEffect, useState } from "react";
import { Download, Sparkles, WandSparkles } from "lucide-react";
import type { GenerationDto } from "@/api/serializers";
import type { Sample } from "@/ui/samples";
import { PromptForm } from "@/ui/components/prompt-form";
import { SampleGallery } from "@/ui/components/sample-gallery";
import { buttonVariants } from "@/ui/components/ui/button";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/ui/components/ui/card";
import { useGenerate } from "@/ui/hooks/use-generate";
import { SAMPLES } from "@/ui/samples";

async function fetchJson<T>(input: RequestInfo | URL): Promise<T> {
  const response = await fetch(input);
  if (!response.ok) {
    throw new Error((await response.text()) || "Request failed.");
  }
  return (await response.json()) as T;
}

type PreviewImage = {
  imageUrl: string;
  alt: string;
  downloadName: string;
  description?: string;
};

function toGenerationPreview(generation: GenerationDto): PreviewImage | null {
  if (!generation.imageUrl) {
    return null;
  }

  return {
    imageUrl: generation.imageUrl,
    alt: generation.prompt,
    downloadName: `icon-${generation.id}.png`,
  };
}

function generationToSample(generation: GenerationDto): Sample {
  return {
    id: generation.id,
    label: generation.prompt.slice(0, 20) + (generation.prompt.length > 20 ? "..." : ""),
    prompt: generation.prompt,
    imageUrl: generation.imageUrl,
  };
}

function toSamplePreview(sample: Sample): PreviewImage | null {
  if (!sample.imageUrl) {
    return null;
  }

  return {
    imageUrl: sample.imageUrl,
    alt: sample.label,
    downloadName: `${sample.id}.png`,
    description: `「${sample.label}」のサンプル — このまま生成するか、プロンプトをアレンジしてください`,
  };
}

export function App() {
  const [preview, setPreview] = useState<PreviewImage | null>(() => {
    const defaultSample = SAMPLES.find((sample) => sample.id === "neon-popstar") ?? SAMPLES[0];
    return toSamplePreview(defaultSample);
  });
  const [prompt, setPrompt] = useState("");
  const [history, setHistory] = useState<GenerationDto[]>([]);

  const { generate, isSubmitting, error: submitError } = useGenerate();

  function refreshHistory() {
    fetchJson<{ items: GenerationDto[] }>("/api/generations?limit=20")
      .then((res) => {
        startTransition(() =>
          setHistory(
            res.items.filter(
              (g) => g.status === "succeeded" && g.width === g.height,
            ),
          ),
        );
      })
      .catch(() => {});
  }

  useEffect(() => {
    refreshHistory();
  }, []);

  async function handleGenerate() {
    try {
      const generation = await generate({ prompt, presetId: "square" });
      setPreview(toGenerationPreview(generation));
      refreshHistory();
    } catch {
      // hook handles error state
    }
  }

  function handleSampleSelect(sample: Sample) {
    setPrompt(sample.prompt);
    setPreview(toSamplePreview(sample));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.26),transparent_28%),radial-gradient(circle_at_top_right,rgba(56,189,248,0.22),transparent_32%),linear-gradient(180deg,#fffdf7_0%,#f6f7fb_100%)]" />

      <div className="relative mx-auto flex max-w-3xl flex-col gap-6 px-5 py-8 md:px-8">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2">
            <WandSparkles className="size-5 text-amber-700" />
            <h1 className="text-lg font-bold tracking-tight">Profile Icon Generator</h1>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            テキストからプロフィールアイコンを AI で生成。下のサンプルを選ぶか、自由にプロンプトを入力してください。
          </p>
        </div>

        {submitError && (
          <div className="rounded-xl border border-red-200 bg-red-50/90 px-4 py-3 text-sm text-red-800">
            {submitError}
          </div>
        )}

        {/* Result */}
        <Card>
          <CardContent className="p-6">
            {isSubmitting ? (
              <div className="grid aspect-square w-full max-w-md place-items-center rounded-2xl border border-border/80 bg-secondary/50">
                <div className="flex flex-col items-center gap-4">
                  <div className="size-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
                  <p className="text-sm font-medium text-muted-foreground animate-pulse">
                    アイコンを生成しています...
                  </p>
                  <p className="text-xs text-muted-foreground/60">
                    20〜30秒ほどかかります
                  </p>
                </div>
              </div>
            ) : preview ? (
              <div className="grid gap-4">
                <img
                  className="block aspect-square w-full max-w-md rounded-2xl border border-border/70 bg-secondary object-cover"
                  src={preview.imageUrl}
                  alt={preview.alt}
                />
                <a
                  className={cn(buttonVariants(), "w-full sm:w-fit")}
                  href={preview.imageUrl}
                  download={preview.downloadName}
                >
                  <Download className="size-4" />
                  ダウンロード
                </a>
                {preview.description ? (
                  <p className="text-sm text-muted-foreground">
                    {preview.description}
                  </p>
                ) : null}
              </div>
            ) : (
              <div className="grid aspect-square w-full max-w-md place-items-center rounded-2xl border border-dashed border-border/80 bg-background/50 text-center text-sm text-muted-foreground">
                <p>
                  プロンプトを入力して生成すると
                  <br />
                  ここにアイコンが表示されます
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Prompt */}
        <Card>
          <CardContent className="p-6">
            <PromptForm
              prompt={prompt}
              isSubmitting={isSubmitting}
              onPromptChange={setPrompt}
              onSubmit={handleGenerate}
            />
          </CardContent>
        </Card>

      </div>

      {/* Sample Gallery — full width */}
      <section className="relative space-y-3 px-5 pb-10 md:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-amber-700" />
            <h2 className="text-sm font-semibold">プロンプト例</h2>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            クリックでプロンプト欄に反映されます。
          </p>
        </div>
        <SampleGallery
          samples={[...history.map(generationToSample), ...SAMPLES]}
          onSelect={handleSampleSelect}
        />
      </section>
    </main>
  );
}

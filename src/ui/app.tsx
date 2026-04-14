import { useEffect, useState } from "react";
import { Download, Sparkles, WandSparkles } from "lucide-react";
import type { GenerationDto } from "@/api/serializers";
import type { SizePreset } from "@/domain/preset";
import type { Sample } from "@/ui/samples";
import { PresetSelector } from "@/ui/components/preset-selector";
import { PromptForm } from "@/ui/components/prompt-form";
import { SampleGallery } from "@/ui/components/sample-gallery";
import { buttonVariants } from "@/ui/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/ui/components/ui/card";
import { useGenerate } from "@/ui/hooks/use-generate";
import { SAMPLES } from "@/ui/samples";

async function fetchJson<T>(input: RequestInfo | URL): Promise<T> {
  const response = await fetch(input);
  if (!response.ok) {
    throw new Error((await response.text()) || "Request failed.");
  }
  return (await response.json()) as T;
}

export function App() {
  const [presets, setPresets] = useState<SizePreset[]>([]);
  const [selectedPresetId, setSelectedPresetId] = useState("x-twitter");
  const [latestGeneration, setLatestGeneration] = useState<GenerationDto | null>(null);
  const [samplePreview, setSamplePreview] = useState<Sample | null>(null);
  const [prompt, setPrompt] = useState("");
  const [bootstrapError, setBootstrapError] = useState<string | null>(null);

  const { generate, isSubmitting, error: submitError } = useGenerate();

  useEffect(() => {
    fetchJson<{ items: SizePreset[] }>("/api/presets")
      .then((res) => setPresets(res.items))
      .catch((error: unknown) => {
        setBootstrapError(
          error instanceof Error ? error.message : "初期データの読み込みに失敗しました。",
        );
      });
  }, []);

  async function handleGenerate() {
    try {
      const generation = await generate({ prompt, presetId: selectedPresetId });
      setSamplePreview(null);
      setLatestGeneration(generation);
    } catch {
      // hook handles error state
    }
  }

  function handleSampleSelect(sample: Sample) {
    setPrompt(sample.prompt);
    setSamplePreview(sample);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const activeError = submitError ?? bootstrapError;

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.26),transparent_28%),radial-gradient(circle_at_top_right,rgba(56,189,248,0.22),transparent_32%),linear-gradient(180deg,#fffdf7_0%,#f6f7fb_100%)]" />

      <div className="relative mx-auto flex max-w-5xl flex-col gap-6 px-5 py-8 md:px-8">
        {/* Header */}
        <div className="flex items-center gap-2">
          <WandSparkles className="size-5 text-amber-700" />
          <h1 className="text-lg font-bold tracking-tight">Profile Icon Generator</h1>
        </div>

        {activeError && (
          <div className="rounded-xl border border-red-200 bg-red-50/90 px-4 py-3 text-sm text-red-800">
            {activeError}
          </div>
        )}

        {/* Main area */}
        <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
          <div className="flex flex-col gap-6">
            {/* Result */}
            <Card>
              <CardContent className="p-6">
                {latestGeneration?.imageUrl ? (
                  <div className="grid gap-4">
                    <img
                      className="aspect-square w-full max-w-md rounded-2xl border border-border/70 bg-secondary object-cover"
                      src={latestGeneration.imageUrl}
                      alt={latestGeneration.prompt}
                    />
                    <div className="flex items-center gap-3">
                      <a
                        className={cn(buttonVariants(), "w-full sm:w-fit")}
                        href={latestGeneration.imageUrl}
                        download={`icon-${latestGeneration.id}.png`}
                      >
                        <Download className="size-4" />
                        ダウンロード
                      </a>
                      <span className="text-xs text-muted-foreground">
                        {latestGeneration.width}x{latestGeneration.height}
                      </span>
                    </div>
                  </div>
                ) : samplePreview?.imageUrl ? (
                  <div className="grid gap-4">
                    <img
                      className="aspect-square w-full max-w-md rounded-2xl border border-border/70 bg-secondary object-cover"
                      src={samplePreview.imageUrl}
                      alt={samplePreview.label}
                    />
                    <p className="text-sm text-muted-foreground">
                      「{samplePreview.label}」のサンプル — このまま生成するか、プロンプトをアレンジしてください
                    </p>
                  </div>
                ) : (
                  <div className="grid aspect-square max-w-md place-items-center rounded-2xl border border-dashed border-border/80 bg-background/50 text-center text-sm text-muted-foreground">
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

          {/* Sidebar: preset selector */}
          <Card className="h-fit">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">出力サイズ</CardTitle>
            </CardHeader>
            <CardContent>
              <PresetSelector
                presets={presets}
                selectedPresetId={selectedPresetId}
                onSelect={setSelectedPresetId}
              />
            </CardContent>
          </Card>
        </div>

        {/* Sample Gallery */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-amber-700" />
            <h2 className="text-sm font-semibold">プロンプト例</h2>
          </div>
          <p className="text-xs text-muted-foreground">
            クリックでプロンプト欄に反映されます。
          </p>
          <SampleGallery samples={SAMPLES} onSelect={handleSampleSelect} />
        </section>
      </div>
    </main>
  );
}

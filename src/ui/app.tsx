import { useEffect, useState } from "react";
import { Sparkles, WandSparkles } from "lucide-react";
import type { GenerationDto } from "@/api/serializers";
import type { SizePreset } from "@/domain/preset";
import { ImagePreview } from "@/ui/components/image-preview";
import { PresetSelector } from "@/ui/components/preset-selector";
import { PromptForm } from "@/ui/components/prompt-form";
import { SampleGallery } from "@/ui/components/sample-gallery";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/components/ui/card";
import { useGenerate } from "@/ui/hooks/use-generate";
import { SAMPLES } from "@/ui/samples";

async function fetchJson<T>(input: RequestInfo | URL): Promise<T> {
  const response = await fetch(input);
  if (!response.ok) {
    const fallback = await response.text();
    throw new Error(fallback || "Request failed.");
  }

  return (await response.json()) as T;
}

export function App() {
  const [presets, setPresets] = useState<SizePreset[]>([]);
  const [selectedPresetId, setSelectedPresetId] = useState("x-twitter");
  const [latestGeneration, setLatestGeneration] = useState<GenerationDto | null>(
    null,
  );
  const [prompt, setPrompt] = useState("");
  const [bootstrapError, setBootstrapError] = useState<string | null>(null);

  const { generate, isSubmitting, error: submitError } = useGenerate();

  useEffect(() => {
    fetchJson<{ items: SizePreset[] }>("/api/presets")
      .then((res) => setPresets(res.items))
      .catch((error: unknown) => {
        setBootstrapError(
          error instanceof Error
            ? error.message
            : "初期データの読み込みに失敗しました。",
        );
      });
  }, []);

  async function handleGenerate() {
    try {
      const generation = await generate({
        prompt,
        presetId: selectedPresetId,
      });
      setLatestGeneration(generation);
    } catch {
      // The hook already stores the user-facing error state.
    }
  }

  function handleSampleSelect(samplePrompt: string) {
    setPrompt(samplePrompt);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const activeError = submitError ?? bootstrapError;

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.26),transparent_28%),radial-gradient(circle_at_top_right,rgba(56,189,248,0.22),transparent_32%),linear-gradient(180deg,#fffdf7_0%,#f6f7fb_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-24 mx-auto h-56 w-5/6 rounded-full bg-[radial-gradient(circle,rgba(217,119,6,0.12),transparent_65%)] blur-3xl" />

      <div className="relative mx-auto flex max-w-5xl flex-col gap-8 px-5 py-10 md:px-8 lg:py-14">
        {/* Hero */}
        <header className="space-y-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-background/70 px-4 py-2 text-xs uppercase tracking-[0.28em] text-amber-700">
            <WandSparkles className="size-3.5" />
            AI Profile Icon Generator
          </div>
          <h1 className="font-serif text-4xl leading-tight tracking-tight md:text-6xl">
            プロンプトから
            <br className="sm:hidden" />
            アイコンを生成
          </h1>
          <p className="mx-auto max-w-xl text-base leading-7 text-muted-foreground md:text-lg">
            作りたいアイコンのイメージをテキストで入力するだけ。
            <br className="hidden sm:block" />
            SNS に合わせたサイズで AI がプロフィールアイコンを生成します。
          </p>
        </header>

        {activeError && (
          <div className="rounded-2xl border border-red-200 bg-red-50/90 px-4 py-3 text-center text-sm text-red-800">
            {activeError}
          </div>
        )}

        {/* Generator */}
        <section className="grid gap-6 lg:grid-cols-2">
          <div className="flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle>プロンプト</CardTitle>
                <CardDescription>
                  作りたいアイコンのイメージを日本語で入力してください。
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PromptForm
                  prompt={prompt}
                  isSubmitting={isSubmitting}
                  onPromptChange={setPrompt}
                  onSubmit={handleGenerate}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>出力サイズ</CardTitle>
                <CardDescription>
                  利用する SNS に合ったサイズを選んでください。
                </CardDescription>
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
          <Card>
            <CardHeader>
              <CardTitle>生成結果</CardTitle>
              <CardDescription>
                生成されたアイコンがここに表示されます。
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ImagePreview generation={latestGeneration} />
            </CardContent>
          </Card>
        </section>

        {/* Sample Gallery */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-amber-700" />
            <h2 className="text-lg font-semibold">プロンプト例</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            クリックするとプロンプト欄に反映されます。そのまま生成するか、自由にアレンジしてください。
          </p>
          <SampleGallery samples={SAMPLES} onSelect={handleSampleSelect} />
        </section>
      </div>
    </main>
  );
}
